import Stripe from 'stripe';
import { logger } from './logger';

// True only in a Replit deployment. WEB_REPL_RENEWAL is the deployment auth token and is
// NOT present in the dev workflow, so it is the safe signal for "production". We avoid
// NODE_ENV here because secrets (including the live key) are global across dev/prod — a dev
// process accidentally started with NODE_ENV=production must NEVER touch the live account.
export function isDeploymentEnv(): boolean {
  return !!process.env.WEB_REPL_RENEWAL;
}

function isLiveSecretKey(k?: string): k is string {
  return !!k && (k.startsWith('sk_live') || k.startsWith('rk_live'));
}

let _loggedStripeSource = false;

async function getStripeCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  // In a deployment, charge through the LIVE Stripe account explicitly via
  // STRIPE_LIVE_SECRET_KEY. The Replit Stripe connector resolves to a test/sandbox
  // account, so it must NEVER be used for real customer payments in production.
  // Development (no deployment signal) falls through to the connector below.
  const liveKey = process.env.STRIPE_LIVE_SECRET_KEY;
  if (isDeploymentEnv() && isLiveSecretKey(liveKey)) {
    if (!_loggedStripeSource) {
      logger.info('Stripe: using LIVE secret key (production deployment)');
      _loggedStripeSource = true;
    }
    return {
      secretKey: liveKey,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
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

  if (!_loggedStripeSource) {
    logger.info('Stripe: using Replit connector account (test/sandbox in dev)');
    _loggedStripeSource = true;
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
