# Virala Docs

## Stack
- Next.js 15 App Router
- TypeScript + Tailwind CSS
- Supabase auth/data
- Stripe subscriptions via route handlers

## Stripe Catalog
- Live Stripe products now present for all 5 plans:
  - Virala Free
  - Virala Starter
  - Virala Growth
  - Virala Pro
  - Virala Studio
- Live recurring monthly price IDs:
  - `STRIPE_PRICE_STARTER=price_1TZ9LxBwNhylsiseCUgx7YGB`
  - `STRIPE_PRICE_GROWTH=price_1TZ9LyBwNhylsiseXg2eL3fY`
  - `STRIPE_PRICE_PRO=price_1TZ9LzBwNhylsisewt9Xf6Il`
  - `STRIPE_PRICE_STUDIO=price_1TZ9M0BwNhylsisetzlCg4sq`

## Billing Code Paths
- `lib/stripe/config.ts` is the shared source of truth for plan labels, Stripe product names, and live price IDs.
- `app/api/stripe/checkout/route.ts` now accepts a plan key, resolves the matching live Stripe price ID, and rejects unknown inputs.
- `app/pricing/page.tsx` is the public pricing page.
- `components/checkout-button.tsx` posts the selected plan to `/api/stripe/checkout` and redirects to Stripe Checkout.

## Task Notes
- The public GitHub repo `cris1382/virala` originally had Stripe checkout routes but no plan-to-price config or pricing page.
- `.env.example` now documents the live Stripe price IDs used by the codebase.
