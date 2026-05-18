import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { db } from "@/db"; // points to src/db/index.ts

/**
 * NextAuth configuration using the Neon PostgreSQL adapter.
 * Environment variables required (add to .env.local):
 *   - NEXTAUTH_SECRET – secret for signing JWTs / cookies
 *   - NEXTAUTH_URL    – your site URL (required for callbacks)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Lookup the user by email including their password hash
        const result = await db.query(
          `SELECT id, email, name, image, is_premium, password_hash FROM users WHERE email = $1`,
          [credentials.email.toLowerCase()]
        );
        const user = result.rows[0];
        
        if (!user || !user.password_hash) {
          return null;
        }

        const bcrypt = require("bcryptjs");
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        
        if (!isValid) {
          return null;
        }

        // Return user object without the password hash
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  adapter: PostgresAdapter(db) as any, // Type cast to any to resolve NextAuth v4 vs Auth.js adapter type differences if any
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).isPremium = token.isPremium ?? false;
        // Expose the freshly-fetched avatar from the DB into the session
        if (token.image !== undefined) {
          session.user.image = token.image as string | null;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
      }
      
      // Always fetch the freshest premium status from the DB.
      // This ensures that when the Stripe webhook upgrades them in the background,
      // their active browser session reflects it instantly without needing to log out.
      if (token.sub) {
        try {
          // Fetch both premium status AND avatar so settings changes are instant
          const result = await db.query(`SELECT is_premium, image FROM users WHERE id = $1`, [token.sub]);
          if (result.rows.length > 0) {
            token.isPremium = result.rows[0].is_premium;
            token.image = result.rows[0].image ?? null;
          }
        } catch (err) {
          console.error("Failed to fetch fresh user status for JWT", err);
        }
      }
      
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
