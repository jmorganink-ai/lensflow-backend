import Stripe from 'stripe';

async function getStripeCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  const directSecret = process.env.STRIPE_SECRET_KEY?.trim();
  if (directSecret) {
    return {
      secretKey: directSecret,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.trim() || undefined,
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      'Missing Replit environment variables. ' +
      'Ensure the Stripe integration is connected via the Integrations tab.'
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json() as { items?: Array<{ settings?: { secret?: string; publishable?: string; webhook_secret?: string } }> };
  const settings = data.items?.[0]?.settings;

  if (!settings?.secret) {
    throw new Error(
      'Stripe integration not connected or missing secret key. ' +
      'Connect Stripe via the Integrations tab first.'
    );
  }

  return {
    secretKey: settings.secret,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? settings.webhook_secret,
  };
}

let _cachedClient: Stripe | null = null;

export async function getStripeClient(): Promise<Stripe> {
  if (_cachedClient) return _cachedClient;
  const { secretKey } = await getStripeCredentials();
  _cachedClient = new Stripe(secretKey);
  return _cachedClient;
}

export async function getStripeWebhookSecret(): Promise<string | undefined> {
  const { webhookSecret } = await getStripeCredentials();
  return webhookSecret;
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}
