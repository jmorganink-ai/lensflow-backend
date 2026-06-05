import app from "./app";
import { logger } from "./lib/logger";
import { getStripeClient } from './lib/stripeClient';

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function initStripe() {
  try {
    const stripe = await getStripeClient();
    await stripe.products.list({ limit: 1 });
    logger.info("Stripe connected");
  } catch (err) {
    logger.warn({ err }, "Stripe init failed — running without Stripe (connect integration to enable)");
  }
}

await initStripe();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
