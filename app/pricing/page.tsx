import Link from "next/link";

import CheckoutButton from "@/components/checkout-button";
import { BILLING_PLANS, PLAN_ORDER } from "@/lib/stripe/config";

export default function PricingPage() {
  return (
    <main
      style={{ background: "var(--background)", minHeight: "100vh" }}
      className="flex flex-col"
    >
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
        <Link href="/" className="text-2xl font-bold gradient-violet-text">
          Virala
        </Link>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-medium text-white rounded-lg gradient-violet hover:opacity-90 transition-opacity"
          >
            Start Free
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto w-full px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Virala Plans
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">
            Pricing for every stage of content production.
          </h1>
          <p className="text-lg text-[var(--muted)]">
            All paid plans are connected to live Stripe subscriptions. Start
            free, then upgrade as your image and video volume grows.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {PLAN_ORDER.map((planKey) => {
            const plan = BILLING_PLANS[planKey];
            const isFeatured = plan.key === "growth";

            return (
              <article
                key={plan.key}
                className={`glass rounded-2xl p-6 flex flex-col ${
                  isFeatured ? "ring-1 ring-[var(--accent)]" : ""
                }`}
              >
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
                    {plan.productName}
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-3">
                    {plan.label}
                  </h2>
                  <p className="text-3xl font-bold text-white mt-4">
                    {plan.priceLabel}
                  </p>
                </div>

                <div className="text-sm text-[var(--muted)] space-y-2 mb-8 flex-1">
                  <p>
                    {plan.key === "free"
                      ? "Explore Virala with a lightweight free tier."
                      : "Monthly recurring subscription billed through Stripe."}
                  </p>
                  <p>
                    {plan.key === "studio"
                      ? "Best for high-volume teams and agencies."
                      : "Built for creators publishing on a consistent schedule."}
                  </p>
                </div>

                {plan.key === "free" ? (
                  <Link
                    href="/signup"
                    className="w-full px-4 py-3 text-sm font-semibold text-center text-white rounded-lg bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    Start Free
                  </Link>
                ) : (
                  <CheckoutButton
                    plan={plan.key}
                    label={`Choose ${plan.label}`}
                  />
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
