import { db } from "./src/db";

async function run() {
  try {
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text`);
    console.log("✅ Successfully added password_hash column to users table.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
