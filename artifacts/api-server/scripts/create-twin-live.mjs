import Stripe from "stripe";

const key = process.env.STRIPE_LIVE_SECRET_KEY;
if (!key) {
  console.error("ERROR: STRIPE_LIVE_SECRET_KEY is not set.");
  process.exit(1);
}

const DRY_RUN = process.env.DRY_RUN === "1";

const mode = key.startsWith("sk_live")
  ? "LIVE"
  : key.startsWith("rk_live")
  ? "LIVE (restricted)"
  : key.startsWith("sk_test") || key.startsWith("rk_test")
  ? "TEST"
  : "UNKNOWN";

console.log("Key mode:", mode, "| DRY_RUN:", DRY_RUN);
if (!mode.startsWith("LIVE")) {
  console.error("Refusing to run: this is not a LIVE key. Aborting.");
  process.exit(1);
}

const stripe = new Stripe(key);

// Target catalogue. Monthly recurring AUD for the 4 plans; Enterprise = one-time per project.
const TIERS = [
  {
    plan: "starter",
    name: "Starter",
    match: "starter",
    amount: 7900,
    recurring: true,
    desc: "You film, we produce. AI-generated script from your listing URL, a scrolling teleprompter on your phone, self-record & upload, 720p output. REA & Domain compatible. 1 video / month.",
  },
  {
    plan: "elite",
    name: "Elite",
    match: "elite",
    amount: 19900,
    recurring: true,
    desc: "The complete AI pipeline, fully produced. AI presenter, ElevenLabs voice narration, Voice + Photos slideshow, photo enhancement & Ken Burns, 4K rendering. REA & Domain export. 1 video / month.",
  },
  {
    plan: "concierge",
    name: "Concierge",
    match: "concierge",
    amount: 39900,
    recurring: true,
    desc: "Full AI pipeline plus Morgan runs your marketing — social captions, email copy, content calendar, dedicated account manager, 24hr turnaround. 2 videos / month.",
  },
  {
    plan: "twin",
    name: "Twin Avatar Solution",
    match: "twin avatar",
    amount: 59900,
    recurring: true,
    desc: "Your personal AI digital twin presents every listing — voice, face and mannerisms cloned from a short selfie video. Includes 3 fully-produced videos per month plus Morgan as your marketing PA. Additional videos $499 each.",
    extraMeta: { videos_per_month: "3", extra_video_price: "499" },
  },
  {
    plan: "enterprise",
    name: "Enterprise",
    match: "enterprise",
    amount: 179900,
    recurring: false, // one-time per project
    desc: "Full-agency rollout with dedicated infrastructure, multi-seat access, and a bespoke AI pipeline built around your brand. Unlimited videos & agents, up to 20 custom presenters, white-label platform, API access, SLA-backed 4hr turnaround. Billed one-time per project.",
    extraMeta: { billing: "one_time_per_project" },
  },
];

function findProduct(products, tier) {
  return products.find(
    (p) =>
      (p.metadata?.plan && p.metadata.plan === tier.plan) ||
      p.name.toLowerCase().includes(tier.match)
  );
}

function priceMatches(pr, tier) {
  if (pr.currency !== "aud" || pr.unit_amount !== tier.amount) return false;
  if (tier.recurring) return pr.recurring?.interval === "month";
  return !pr.recurring;
}

let products;
try {
  products = (await stripe.products.list({ limit: 100, active: true })).data;
} catch (e) {
  if (e.type === "StripePermissionError") {
    console.error("\nPERMISSION DENIED reading products. Enable 'Products' (write) + 'Prices' (write) on the restricted key, or use a standard secret key.");
    console.error(e.raw?.message ?? e.message);
    process.exit(2);
  }
  throw e;
}

console.log("\nExisting active products in LIVE:");
if (products.length === 0) console.log("  (none)");
for (const p of products) console.log("  -", p.name, "| plan=" + (p.metadata?.plan ?? "—"), "|", p.id);

console.log("\nPlan reconciliation:");
const actions = [];
for (const tier of TIERS) {
  const existing = findProduct(products, tier);
  const dollars = "A$" + (tier.amount / 100).toFixed(0) + (tier.recurring ? "/mo" : " one-time");
  if (!existing) {
    actions.push({ tier, type: "create-product" });
    console.log(`  ${tier.name}: MISSING → would create product + ${dollars} price`);
  } else {
    const prices = (await stripe.prices.list({ product: existing.id, active: true, limit: 100 })).data;
    const match = prices.find((pr) => priceMatches(pr, tier));
    if (match) {
      console.log(`  ${tier.name}: OK (exists: ${existing.id}, price ${match.id} = ${dollars})`);
    } else {
      actions.push({ tier, type: "create-price", productId: existing.id });
      console.log(`  ${tier.name}: product exists (${existing.id}) but NO ${dollars} price → would add price`);
    }
  }
}

if (DRY_RUN) {
  console.log("\n=== DRY RUN — no changes made. Actions that WOULD run:", actions.length, "===");
  for (const a of actions) console.log("  -", a.type, a.tier.name);
  process.exit(0);
}

console.log("\n=== APPLYING CHANGES ===");
for (const a of actions) {
  const { tier } = a;
  let productId = a.productId;
  if (a.type === "create-product") {
    const prod = await stripe.products.create({
      name: tier.name,
      description: tier.desc,
      metadata: { plan: tier.plan, ...(tier.extraMeta || {}) },
    });
    productId = prod.id;
    console.log("Created product:", tier.name, prod.id);
  }
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: tier.amount,
    currency: "aud",
    ...(tier.recurring ? { recurring: { interval: "month" } } : {}),
    metadata: { plan: tier.plan },
  });
  console.log("Created price:", tier.name, price.id, "=", tier.amount / 100, "AUD", tier.recurring ? "/month" : "one-time");
}

console.log("\n=== FINAL LIVE CATALOG ===");
const verify = (await stripe.products.list({ limit: 100, active: true })).data;
for (const p of verify) {
  const pr = (await stripe.prices.list({ product: p.id, active: true, limit: 1 })).data[0];
  const amt = pr
    ? (pr.unit_amount / 100).toFixed(0) + " " + pr.currency.toUpperCase() + (pr.recurring ? "/" + pr.recurring.interval : " one-time")
    : "no price";
  console.log("  -", p.name, "|", amt, "| plan=" + (p.metadata?.plan ?? "—"));
}
