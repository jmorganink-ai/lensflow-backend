import { logger } from "./logger";
import type { ScrapedListing } from "./apify";

const DOMAIN_AUTH_URL = "https://auth.domain.com.au/v1/connect/token";
const DOMAIN_API_BASE = "https://api.domain.com.au/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.DOMAIN_CLIENT_ID?.trim();
  const clientSecret = process.env.DOMAIN_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("DOMAIN_CLIENT_ID and DOMAIN_CLIENT_SECRET must be set");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "api_listings_read",
  });

  const res = await fetch(DOMAIN_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Domain OAuth token request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  logger.info("Domain OAuth token acquired");
  return cachedToken.value;
}

/**
 * Extract the numeric listing ID from a domain.com.au URL.
 * Handles formats like:
 *   /2-bed-house-for-sale/suburb-nsw-2000/address-street-12345678
 *   /properties/address-suburb-state-postcode-12345678
 */
export function extractDomainListingId(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      // Match a trailing numeric id (8+ digits) possibly preceded by a dash
      const match = seg.match(/(?:^|-)(\d{7,})$/);
      if (match) return match[1];
      // Or the segment is purely numeric
      if (/^\d{7,}$/.test(seg)) return seg;
    }
  } catch {
    return null;
  }
  return null;
}

export function isDomainUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return host === "domain.com.au";
  } catch {
    return false;
  }
}

interface DomainListing {
  id: number;
  listingType: string;
  propertyTypes: string[];
  headline: string | null;
  summaryDescription: string | null;
  description: string | null;
  priceDetails?: {
    displayPrice?: string;
    price?: number;
  };
  addressParts?: {
    displayAddress?: string;
    streetNumber?: string;
    street?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  carspaces?: number;
  media?: Array<{
    category?: string;
    url?: string;
  }>;
  photos?: Array<{ url?: string }>;
}

/**
 * Fetch a Domain.com.au listing by ID and return structured listing data
 * in the same shape as ScrapedListing from Apify.
 */
export async function fetchDomainListing(listingId: string): Promise<ScrapedListing> {
  const token = await getAccessToken();

  const res = await fetch(`${DOMAIN_API_BASE}/listings/${listingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Domain API listing fetch failed (${res.status}): ${text}`);
  }

  const listing = (await res.json()) as DomainListing;

  // Extract photos — media array contains images, virtual tours, floor plans, etc.
  const images: string[] = [];
  if (listing.media) {
    for (const m of listing.media) {
      if (m.url && (!m.category || m.category.toLowerCase().includes("image") || m.category.toLowerCase() === "photo")) {
        images.push(m.url);
      }
    }
  }
  if (images.length === 0 && listing.photos) {
    for (const p of listing.photos) {
      if (p.url) images.push(p.url);
    }
  }

  // Build address string
  const ap = listing.addressParts;
  const address = ap?.displayAddress
    ?? ([ap?.streetNumber, ap?.street, ap?.suburb, ap?.state, ap?.postcode].filter(Boolean).join(" ") || null);

  // Build title
  const suburb = ap?.suburb ?? null;
  const state = ap?.state ?? null;
  const propType = listing.propertyTypes?.[0] ?? null;
  const beds = listing.bedrooms ?? null;
  const title = listing.headline
    ?? ([
        beds ? `${beds}-Bed` : null,
        propType,
        suburb ? `in ${suburb}` : null,
        state,
      ].filter(Boolean).join(" ") || address);

  const price = listing.priceDetails?.displayPrice ?? null;
  const description = listing.summaryDescription ?? listing.description ?? null;

  logger.info(
    { listingId, imageCount: images.length, address, title },
    "Domain API listing fetched"
  );

  return {
    title,
    address,
    price,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    carSpaces: listing.carspaces ?? null,
    description,
    images: images.slice(0, 12),
    pageText: [title, address, price, description].filter(Boolean).join(" "),
  };
}
