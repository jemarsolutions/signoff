"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";

export async function requestGCashUpgrade() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  // If the user already has an active request, keep it pending rather than creating duplicates.
  await db.query(
    `INSERT INTO gcash_payment_requests (user_id, amount_cents, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (user_id) DO UPDATE SET amount_cents = EXCLUDED.amount_cents, status = 'pending', requested_at = current_timestamp`,
    [userId, 85000]
  );

  redirect("/dashboard/upgrade?status=submitted");
}

export async function confirmGCashPayment() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  const result = await db.query(
    `UPDATE gcash_payment_requests
     SET status = 'awaiting_verification', confirmed_at = current_timestamp
     WHERE user_id = $1 AND status IN ('pending')
     RETURNING id`,
    [userId]
  );

  redirect("/dashboard/upgrade?status=awaiting_verification");
}

export async function approveGCashPayment(formData: FormData) {
  const requestId = formData.get("requestId");
  if (typeof requestId !== "string") {
    throw new Error("Invalid request ID");
  }

  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdminEmail(session.user.email)) {
    throw new Error("Unauthorized");
  }

  await db.query(
    `UPDATE gcash_payment_requests
     SET status = 'confirmed', confirmed_at = current_timestamp
     WHERE id = $1`,
    [requestId]
  );

  await db.query(
    `UPDATE users
     SET is_premium = true,
         premium_until = greatest(current_timestamp, coalesce(premium_until, current_timestamp)) + interval '1 month'
     WHERE id = (
       SELECT user_id FROM gcash_payment_requests WHERE id = $1
     )`,
    [requestId]
  );

  redirect("/dashboard/admin/gcash-requests?status=approved");
}

export async function rejectGCashPayment(formData: FormData) {
  const requestId = formData.get("requestId");
  if (typeof requestId !== "string") {
    throw new Error("Invalid request ID");
  }

  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdminEmail(session.user.email)) {
    throw new Error("Unauthorized");
  }

  await db.query(
    `UPDATE gcash_payment_requests
     SET status = 'rejected', confirmed_at = current_timestamp
     WHERE id = $1`,
    [requestId]
  );

  redirect("/dashboard/admin/gcash-requests?status=rejected");
}
