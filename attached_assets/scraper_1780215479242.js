// STEP 01: SCRAPE LISTING URL
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function scrapeListing(listingUrl) {
    try {
        // Using an off-the-shelf real estate portal actor
        const run = await client.actor("apify/real-estate-scraper").call({
            startUrls: [{ url: listingUrl }],
            maxPagesPerCrawl: 1,
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        if (!items || items.length === 0) {
            throw new Error("No data returned from listing scraper.");
        }
        
        return items[0]; // Return raw payload
    } catch (error) {
        console.error("Pipeline Step 01 Failure:", error.message);
        throw error;
    }
}
// STEP 02: PARSE & NORMALIZE
import { z } from 'zod';

export const CanonicalListingSchema = z.object({
    id: z.string(),
    address: z.string(),
    suburb: z.string(),
    state: z.string().max(3),
    priceGuide: z.string().default("Contact Agent"),
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().int().nonnegative(),
    carSpaces: z.number().int().nonnegative(),
    description: z.string(),
    images: z.array(z.string().url()).min(1),
    agentName: z.string().default("Your Trusted Local Expert"),
});

export function normalizeListingData(rawScraperOutput) {
    // Map inconsistent keys from portal HTML variants to our unified schema
    const standardData = {
        id: rawScraperOutput.id || rawScraperOutput.url,
        address: rawScraperOutput.displayAddress || rawScraperOutput.address,
        suburb: rawScraperOutput.suburb || rawScraperOutput.locality,
        state: rawScraperOutput.state || "AU",
        priceGuide: rawScraperOutput.price || rawScraperOutput.priceText,
        bedrooms: Number(rawScraperOutput.beds || rawScraperOutput.bedrooms || 0),
        bathrooms: Number(rawScraperOutput.baths || rawScraperOutput.bathrooms || 0),
        carSpaces: Number(rawScraperOutput.cars || rawScraperOutput.parking || 0),
        description: rawScraperOutput.descriptionText || rawScraperOutput.description || "",
        images: rawScraperOutput.photos || rawScraperOutput.images || [],
        agentName: rawScraperOutput.agent?.name || rawScraperOutput.contactName,
    };

    // Enforce structure strictly. Fails loudly if layout criteria isn't met.
    return CanonicalListingSchema.parse(standardData);
}