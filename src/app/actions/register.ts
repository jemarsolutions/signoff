"use server";

import { db } from "@/db";
import bcrypt from "bcryptjs";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if user already exists
    const existingResult = await db.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existingResult.rows.length > 0) {
      const existingUser = existingResult.rows[0];
      
      // If it exists but has no password (e.g. created during magic link testing),
      // we can link the password to their existing account so they don't lose their data!
      if (!existingUser.password_hash) {
        await db.query(
          `UPDATE users SET name = $1, password_hash = $2 WHERE id = $3`,
          [name, passwordHash, existingUser.id]
        );
        return { success: true };
      } else {
        return { error: "An account with this email already exists" };
      }
    }

    // Insert new user
    await db.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`,
      [name, normalizedEmail, passwordHash]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration. Please try again." };
  }
}
