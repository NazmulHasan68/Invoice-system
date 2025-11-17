import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assets, purchase } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function createStripeCheckout(assetId: string) {
  // 1️⃣ Validate user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to purchase a");
  }

  // 2️⃣ Fetch the asset
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId));
  if (!asset) throw new Error("Asset not found");

  // 3️⃣ Check if user already purchased
  const existing = await db
    .select()
    .from(purchase)
    .where(and(eq(purchase.assetId, assetId), eq(purchase.userId, session.user.id)))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyPurchased: true };
  }

  // 4️⃣ Create Stripe Checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: asset.title },
          unit_amount: Math.round(100 * 100), // price in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      assetId: asset.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/cancel`,
  });

  return { url: checkoutSession.url };
}
