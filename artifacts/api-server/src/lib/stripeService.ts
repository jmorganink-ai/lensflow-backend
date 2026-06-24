import { eq } from 'drizzle-orm';
import { db, usersTable } from '@workspace/db';
import { getStripeClient, getUncachableStripeClient } from './stripeClient';
import type Stripe from 'stripe';

export class StripeStorage {
  async listProductsWithPrices(active = true): Promise<Array<{
    product_id: string;
    product_name: string;
    product_description: string | null;
    product_active: boolean;
    product_metadata: Record<string, string>;
    price_id: string | null;
    unit_amount: number | null;
    currency: string | null;
    recurring: Stripe.Price.Recurring | null;
  }>> {
    const stripe = await getStripeClient();

    const [products, prices] = await Promise.all([
      stripe.products.list({ active: active || undefined, limit: 100 }),
      stripe.prices.list({ active: true, limit: 100 }),
    ]);

    const rows: ReturnType<typeof this.listProductsWithPrices> extends Promise<infer T> ? T : never = [];

    for (const product of products.data) {
      const productPrices = prices.data.filter(p => p.product === product.id);
      if (productPrices.length === 0) {
        rows.push({
          product_id: product.id,
          product_name: product.name,
          product_description: product.description ?? null,
          product_active: product.active,
          product_metadata: product.metadata as Record<string, string>,
          price_id: null,
          unit_amount: null,
          currency: null,
          recurring: null,
        });
      } else {
        for (const price of productPrices) {
          rows.push({
            product_id: product.id,
            product_name: product.name,
            product_description: product.description ?? null,
            product_active: product.active,
            product_metadata: product.metadata as Record<string, string>,
            price_id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
            recurring: price.recurring ?? null,
          });
        }
      }
    }

    rows.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0));
    return rows;
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const stripe = await getStripeClient();
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch {
      return null;
    }
  }

  async getUser(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user;
  }

  async getUserByStripeCustomerId(customerId: string) {
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.stripeCustomerId, customerId));
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    planName?: string;
  }) {
    const [user] = await db
      .update(usersTable)
      .set(stripeInfo)
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  }
}

export const stripeStorage = new StripeStorage();

export class StripeService {
  async createCustomer(email: string, userId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getPrice(priceId: string): Promise<Stripe.Price> {
    const stripe = await getUncachableStripeClient();
    return await stripe.prices.retrieve(priceId);
  }

  // Returns false if the customer does not exist (or is deleted) in the active
  // Stripe account — e.g. a customer id stored under the old test/sandbox account
  // after switching the app to the live account.
  async customerExists(customerId: string): Promise<boolean> {
    try {
      const stripe = await getUncachableStripeClient();
      const customer = await stripe.customers.retrieve(customerId);
      return !(customer as Stripe.DeletedCustomer).deleted;
    } catch (err) {
      // Only a genuine "no such customer" means missing. Rethrow transient/auth errors
      // so we don't orphan a valid customer id and silently create a duplicate.
      const e = err as { code?: string; statusCode?: number };
      if (e?.code === 'resource_missing' || e?.statusCode === 404) return false;
      throw err;
    }
  }
}

export const stripeService = new StripeService();
