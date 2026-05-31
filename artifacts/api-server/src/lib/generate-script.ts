import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ScriptResult {
  script: string;
  title: string;
}

export interface ListingContext {
  suburb?: string | null;
  state?: string | null;
  propertyType?: string | null;
  bedrooms?: string | null;
  platform?: string;
  summary?: string;
  // Enriched from Apify scrape
  address?: string | null;
  price?: string | null;
  bathrooms?: number | null;
  carSpaces?: number | null;
  scrapedDescription?: string | null;
}

export async function generateListingScript(listingUrl: string, context?: ListingContext): Promise<ScriptResult> {
  let domain = listingUrl;
  try {
    domain = new URL(listingUrl).hostname.replace("www.", "");
  } catch {
    // use raw URL if parse fails
  }

  const contextLines: string[] = [];
  if (context?.summary) contextLines.push(`Property: ${context.summary}`);
  if (context?.address) contextLines.push(`Address: ${context.address}`);
  if (context?.suburb) contextLines.push(`Suburb: ${context.suburb}`);
  if (context?.state) contextLines.push(`State: ${context.state}`);
  if (context?.propertyType) contextLines.push(`Property type: ${context.propertyType}`);
  if (context?.bedrooms) contextLines.push(`Bedrooms: ${context.bedrooms}`);
  if (context?.bathrooms) contextLines.push(`Bathrooms: ${context.bathrooms}`);
  if (context?.carSpaces) contextLines.push(`Car spaces: ${context.carSpaces}`);
  if (context?.price) contextLines.push(`Price: ${context.price}`);
  if (context?.scrapedDescription) contextLines.push(`Listing description: ${context.scrapedDescription}`);

  const prompt = `You are a professional real estate video scriptwriter for Australia's top agencies. Write a compelling 45-second presenter video script for a property listing.

Listing URL: ${listingUrl}
Platform: ${context?.platform ?? domain}
${contextLines.length > 0 ? contextLines.join("\n") : ""}

Respond with a JSON object with exactly two fields:
- "title": a short descriptive property title (max 60 chars, e.g. "3-Bed Family Home in Paddington" or "Luxury Penthouse · Sydney CBD")
- "script": the spoken presenter script

The script should:
- Open with a vivid, specific hook about the property type and lifestyle (infer from the domain/URL context)
- Highlight 3 key selling points in natural, conversational language
- Mention the location's lifestyle advantages
- Close with a confident call to action

Keep the script to exactly 4 short paragraphs, ~120 words total. No stage directions — just the spoken words.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { title?: string; script?: string };
      if (parsed.script) {
        logger.info({ listingUrl, chars: parsed.script.length }, "Anthropic script generated");
        return { script: parsed.script, title: parsed.title ?? "" };
      }
    }
    // If JSON parse fails, treat entire response as script
    logger.info({ listingUrl, chars: raw.length }, "Anthropic script generated (raw)");
    return { script: raw, title: "" };
  } catch (err) {
    logger.error({ err, listingUrl }, "Anthropic script generation failed — using fallback");
    const fb = buildFallbackScript(listingUrl, domain);
    return { script: fb, title: "" };
  }
}

function buildFallbackScript(_listingUrl: string, domain: string): string {
  return `Welcome to this exceptional property, presented exclusively through ${domain}. From the moment you step inside, you'll be captivated by the quality, space, and light that define every room.

This stunning home delivers the lifestyle today's buyers are searching for — generous living areas that flow seamlessly to the outdoors, premium finishes throughout, and a location that puts everything at your doorstep.

Whether you're hosting friends in the open-plan entertaining space or retreating to the peaceful master suite, every detail has been crafted with your comfort in mind.

This is a rare opportunity in today's market. Contact us now to arrange your private inspection and experience it for yourself.`;
}
