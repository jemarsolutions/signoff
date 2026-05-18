"use server";

import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_123";

const stripe = new Stripe(stripeSecretKey, {
  // Fall back to a widely supported stable version
  apiVersion: "2024-04-10" as any, 
});

export async function createCheckoutSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  const userId = (session.user as any).id;
  const userEmail = session.user.email;
  
  let priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

  // Auto-bootstrap Stripe for the developer if they haven't set up a price ID yet!
  if (!priceId || priceId === "price_dummy123") {
    console.log("No valid Price ID found. Bootstrapping a test Product and Price in Stripe...");
    try {
      const product = await stripe.products.create({
        name: "SignOff Premium (Auto-Generated)",
        description: "Unlimited delivery jobs, custom branding, and priority support.",
      });
      
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 1500, // $15.00
        currency: "usd",
        recurring: { interval: "month" },
      });
      
      priceId = price.id;
      console.log(`Successfully created test Price ID: ${priceId}`);
    } catch (err: any) {
      throw new Error(`Failed to auto-bootstrap Stripe Product: ${err.message}`);
    }
  }

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/dashboard?canceled=true`,
    customer_email: userEmail || undefined,
    // CRITICAL: We pass the userId here so the webhook knows who to upgrade
    client_reference_id: userId,
  });

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }
  
  redirect(checkoutSession.url);
}
