import { db } from "./src/db";

async function run() {
  try {
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS company_logo text`);
    console.log("✅ Successfully added company_logo column to users table.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
