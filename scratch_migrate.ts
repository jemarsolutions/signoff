import { db } from "./src/db";

async function run() {
  try {
    await db.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false`);
    console.log("✅ Successfully added is_deleted column to jobs table.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

run();
