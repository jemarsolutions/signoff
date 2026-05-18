import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { Resend } from "resend";
import { db } from "@/db"; // points to src/db/index.ts

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * NextAuth configuration using the Neon PostgreSQL adapter.
 * Environment variables required (add to .env.local):
 *   - NEXTAUTH_SECRET – secret for signing JWTs / cookies
 *   - RESEND_API_KEY  – from resend.com/api-keys
 *   - EMAIL_FROM      – e.g. "SignOff <noreply@yourdomain.com>"
 *                        (use "onboarding@resend.dev" for testing without a verified domain)
 *   - NEXTAUTH_URL    – your site URL (required for callbacks)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { error } = await resend.emails.send({
          from: provider.from!,
          to: email,
          subject: "Sign in to SignOff",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;border-radius:16px;color:#e2e8f0;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#6366f1,#7c3aed);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;color:white;">✓</div>
                <span style="font-size:22px;font-weight:900;color:white;letter-spacing:-0.5px;">SignOff</span>
              </div>
              <h1 style="font-size:22px;font-weight:800;color:white;margin:0 0 8px;">Your sign-in link</h1>
              <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 28px;">Click the button below to securely sign in to your SignOff account. This link expires in 24 hours.</p>
              <a href="${url}" style="display:block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;text-align:center;margin-bottom:24px;">Sign In to SignOff →</a>
              <p style="color:#475569;font-size:12px;text-align:center;margin:0;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });

        if (error) {
          console.error("[Resend] Failed to send sign-in email:", error);
          throw new Error("Failed to send verification email. Please try again.");
        }
      },
    }),
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

        // Import bcryptjs on the fly or normally. Let's make sure it's imported at the top.
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
