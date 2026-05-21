export type BillingPlanKey = "free" | "starter" | "growth" | "pro" | "studio";
export type PaidPlanKey = Exclude<BillingPlanKey, "free">;

type PaidPlanEnvKey =
  | "STRIPE_PRICE_STARTER"
  | "STRIPE_PRICE_GROWTH"
  | "STRIPE_PRICE_PRO"
  | "STRIPE_PRICE_STUDIO";

interface BillingPlan {
  key: BillingPlanKey;
  label: string;
  priceLabel: string;
  monthlyPriceCents: number;
  productName: string;
  envKey?: PaidPlanEnvKey;
  defaultPriceId?: string;
}

export const BILLING_PLANS: Record<BillingPlanKey, BillingPlan> = {
  free: {
    key: "free",
    label: "Free",
    priceLabel: "$0/mo",
    monthlyPriceCents: 0,
    productName: "Virala Free",
  },
  starter: {
    key: "starter",
    label: "Starter",
    priceLabel: "$9/mo",
    monthlyPriceCents: 900,
    productName: "Virala Starter",
    envKey: "STRIPE_PRICE_STARTER",
    defaultPriceId: "price_1TZ9LxBwNhylsiseCUgx7YGB",
  },
  growth: {
    key: "growth",
    label: "Growth",
    priceLabel: "$19/mo",
    monthlyPriceCents: 1900,
    productName: "Virala Growth",
    envKey: "STRIPE_PRICE_GROWTH",
    defaultPriceId: "price_1TZ9LyBwNhylsiseXg2eL3fY",
  },
  pro: {
    key: "pro",
    label: "Pro",
    priceLabel: "$29/mo",
    monthlyPriceCents: 2900,
    productName: "Virala Pro",
    envKey: "STRIPE_PRICE_PRO",
    defaultPriceId: "price_1TZ9LzBwNhylsisewt9Xf6Il",
  },
  studio: {
    key: "studio",
    label: "Studio",
    priceLabel: "$79/mo",
    monthlyPriceCents: 7900,
    productName: "Virala Studio",
    envKey: "STRIPE_PRICE_STUDIO",
    defaultPriceId: "price_1TZ9M0BwNhylsisetzlCg4sq",
  },
};

export const PLAN_ORDER: BillingPlanKey[] = [
  "free",
  "starter",
  "growth",
  "pro",
  "studio",
];

export function isBillingPlanKey(value: string): value is BillingPlanKey {
  return value in BILLING_PLANS;
}

export function isPaidPlanKey(value: string): value is PaidPlanKey {
  return value !== "free" && value in BILLING_PLANS;
}

export function getStripePriceId(plan: PaidPlanKey) {
  const envKey = BILLING_PLANS[plan].envKey;

  if (!envKey) {
    return null;
  }

  return process.env[envKey] ?? BILLING_PLANS[plan].defaultPriceId ?? null;
}

export function getPlanFromPriceId(priceId: string | null | undefined) {
  if (!priceId) {
    return null;
  }

  const paidPlans = PLAN_ORDER.filter((plan) => plan !== "free") as PaidPlanKey[];
  return paidPlans.find((plan) => getStripePriceId(plan) === priceId) ?? null;
}
