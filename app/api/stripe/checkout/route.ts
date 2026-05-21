import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import {
  getPlanFromPriceId,
  getStripePriceId,
  isPaidPlanKey,
} from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const requestedPriceId = typeof body.priceId === "string" ? body.priceId : null;
  const requestedPlan = typeof body.plan === "string" ? body.plan : null;

  const plan = requestedPlan && isPaidPlanKey(requestedPlan)
    ? requestedPlan
    : getPlanFromPriceId(requestedPriceId);
  const priceId = plan ? getStripePriceId(plan) : null;

  if (!plan || !priceId) {
    return NextResponse.json(
      { error: "A valid paid Virala plan is required." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://virala.studio";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { userId: user.id, plan, priceId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
