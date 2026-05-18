import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";

export const dynamic = "force-dynamic";

// Ensure the secret is present
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_123";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_123";

const stripe = new Stripe(stripeSecretKey, {
  // Fall back to a widely supported stable version
  apiVersion: "2024-04-10" as any, 
});

export async function POST(req: NextRequest) {
  // Read the raw text body to verify the signature properly
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No Stripe signature found in headers" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract user_id. We assume it's passed via client_reference_id or metadata when creating the checkout session.
        const userId = session.client_reference_id || session.metadata?.userId;

        if (userId) {
          // 1. Grant premium status to the user
          await db.query(
            `UPDATE users SET is_premium = true WHERE id = $1`,
            [userId]
          );

          // 2. If it's a subscription (not a one-time payment), track it in the subscriptions table
          if (session.subscription) {
            const subscriptionId = typeof session.subscription === "string" 
              ? session.subscription 
              : session.subscription.id;
              
            // Fetch subscription details to capture the renewal period and price
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0]?.price.id;
            const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000);

            await db.query(
              `INSERT INTO subscriptions (id, user_id, status, price_id, current_period_end)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (id) DO UPDATE SET
               status = EXCLUDED.status,
               price_id = EXCLUDED.price_id,
               current_period_end = EXCLUDED.current_period_end`,
              [subscriptionId, userId, subscription.status, priceId, currentPeriodEnd]
            );
          }
        } else {
          console.warn("checkout.session.completed missing user reference.");
        }
        break;
      }
      
      // Handle subscription cancellations, renewals, or payment failures
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000);
        const priceId = subscription.items.data[0]?.price.id;

        // Update the existing subscription record
        const result = await db.query(
          `UPDATE subscriptions 
           SET status = $1, current_period_end = $2, price_id = $3
           WHERE id = $4
           RETURNING user_id`,
          [subscription.status, currentPeriodEnd, priceId, subscription.id]
        );

        const updatedRow = result.rows[0];
        
        if (updatedRow) {
          // If the subscription is no longer active, revoke premium access
          if (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'past_due') {
            await db.query(
              `UPDATE users SET is_premium = false WHERE id = $1`,
              [updatedRow.user_id]
            );
          } else if (subscription.status === 'active') {
            await db.query(
              `UPDATE users SET is_premium = true WHERE id = $1`,
              [updatedRow.user_id]
            );
          }
        }
        break;
      }
      
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // Acknowledge receipt to Stripe
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
