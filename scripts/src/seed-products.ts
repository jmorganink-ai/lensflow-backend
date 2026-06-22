import { getUncachableStripeClient } from './stripeClient';

const PLANS = [
  {
    name: 'Starter',
    description: '5 AI videos per month — perfect for individual agents getting started with AI video marketing.',
    amount: 7900, // $79 AUD in cents
    currency: 'aud',
    metadata: { plan: 'starter', videos_per_month: '5' },
  },
  {
    name: 'Elite',
    description: '20 AI videos per month — ideal for busy agents and boutique agencies scaling their content.',
    amount: 19900, // $199 AUD in cents
    currency: 'aud',
    metadata: { plan: 'elite', videos_per_month: '20' },
  },
  {
    name: 'Concierge',
    description: 'Unlimited AI videos per month — full power for high-volume agencies and teams.',
    amount: 39900, // $399 AUD in cents
    currency: 'aud',
    metadata: { plan: 'concierge', videos_per_month: 'unlimited' },
  },
];

async function seedProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Seeding LensFlow plans in Stripe...\n');

    for (const plan of PLANS) {
      const existing = await stripe.products.search({
        query: `name:'${plan.name}' AND active:'true'`,
      });

      if (existing.data.length > 0) {
        console.log(`✓ ${plan.name} already exists (${existing.data[0].id})`);
        const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
        if (prices.data.length > 0) {
          console.log(`  Price: $${prices.data[0].unit_amount! / 100} ${prices.data[0].currency.toUpperCase()}/mo (${prices.data[0].id})\n`);
        }
        continue;
      }

      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: plan.metadata,
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.amount,
        currency: plan.currency,
        recurring: { interval: 'month' },
        metadata: plan.metadata,
      });

      console.log(`✓ Created ${plan.name}: ${product.id}`);
      console.log(`  Price: $${plan.amount / 100} ${plan.currency.toUpperCase()}/mo (${price.id})\n`);
    }

    console.log('Done! Webhooks will sync products to the database automatically.');
  } catch (err: any) {
    console.error('Error seeding products:', err.message);
    process.exit(1);
  }
}

seedProducts();
