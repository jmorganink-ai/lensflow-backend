---
name: Stripe live catalog & connector split
description: How LensFlow's running app resolves its Stripe account vs. where the live product catalog lives, plus live-catalog quirks and the subscription-only billing invariant.
---

# Stripe account resolution: connector ≠ live key

The running app (api-server `getStripeClient`/`getUncachableStripeClient`) resolves its
Stripe secret from the **Replit connector**, NOT from `STRIPE_LIVE_SECRET_KEY`. In
development the connector returns a **test/sandbox account** (different `acct_` id from
the live business account). The live product catalog created with
`STRIPE_LIVE_SECRET_KEY` lives in the live business account (`acct_1TVCs2…`,
admin@lensflow.com.au).

**Why:** This means creating products with the live key does NOT make them appear in the
app's billing page or get charged — unless the **production** connector is connected to
that same live account. Whether prod charges real money is a connector-connection
question, separate from catalog data.

**How to apply:** Before claiming live checkout works end-to-end, verify which account the
prod connector points to. Switching the connector's account later can also orphan stored
`stripeCustomerId` / `stripeSubscriptionId` values created under the old account.

# Restricted (rk_live) vs standard (sk_live) keys

A restricted `rk_live` key reveals missing scopes **one at a time** on each call
(accounts read → Prices read → Prices write → Products write → Features write). Product
creation also needs `feature_write` (entitlement features), which is easy to miss. For
one-off catalog writes, request a **standard `sk_live` secret key** to avoid permission
whack-a-mole.

# Live catalog quirks (observed)

- The 4 monthly tiers + Enterprise are the canonical set. Twin Avatar (A$599/mo) and
  Enterprise (A$1799 one-time per project) carry `metadata.plan` (`twin`, `enterprise`).
- The pre-existing base products (Starter/Elite/Concierge) have **no `metadata.plan`**, so
  marketing `?plan=` preselection only matches them by name, not metadata.
- **`LensFlow Starter` is a ONE-TIME A$79 price** while Elite/Concierge are `/month` —
  inconsistent; a one-time price cannot be used in a `mode:'subscription'` checkout.
- The live account has lots of legacy clutter (Lumen hours, MORGAN46 Credit, $1,790
  Concierge, $1,199 Elite Package, etc.), some recurring, some one-time.

# Wiring production to the live account

`getStripeCredentials` (stripeClient.ts) returns the **live** key
(`STRIPE_LIVE_SECRET_KEY`) only when `isDeploymentEnv()` is true; otherwise it uses the
connector (test). `isDeploymentEnv()` checks **`WEB_REPL_RENEWAL` only** — NOT
`NODE_ENV`.

**Why:** Secrets are global across dev and prod. If the gate also keyed on
`NODE_ENV==='production'`, any dev/preview process started with that env var would silently
use the live key and touch real money. `WEB_REPL_RENEWAL` is the deployment auth token and
is absent in the dev workflow, so it is the safe production signal. `REPL_IDENTITY` (set in
dev) is the connector's dev token.

**How to apply:** Gate any "use live/real resource in prod only" decision on
`WEB_REPL_RENEWAL`, never on `NODE_ENV`, in this repo.

Two consequences of the account switch that need guards:
- **Webhooks must fail closed in deployment.** If `STRIPE_WEBHOOK_SECRET` is missing in a
  deployment, the handler throws instead of parsing unsigned payloads (which could forge
  subscription events). Unsigned parsing is allowed only in non-deployment dev. A LIVE
  Stripe webhook endpoint → `/api/stripe/webhook` and its signing secret in
  `STRIPE_WEBHOOK_SECRET` are required for prod subscriptions to sync.
- **Stale customer ids.** A `stripeCustomerId` stored under the old test account won't
  exist in the live account. Checkout calls `stripeService.customerExists` (treats only
  `resource_missing`/404 as missing, rethrows other errors) and creates a fresh customer
  if stale.

# Subscription-only billing invariant

`createCheckoutSession` uses `mode:'subscription'`, so both the billing UI
(`recurringPriceOf`) and the `/stripe/checkout` route only accept **active monthly
recurring** prices. One-time prices (Enterprise, legacy packages) are intentionally
excluded — never wire a one-time price into the self-serve subscription flow.
