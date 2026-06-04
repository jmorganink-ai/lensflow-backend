import { logger } from "./logger";
import type { ScrapedListing } from "./apify";

const DOMAIN_AUTH_URL = "https://auth.domain.com.au/v1/connect/token";
const DOMAIN_API_BASE = "https://api.domain.com.au/v1";

const ALL_SCOPES = [
  "api_listings_read",
  "api_properties_read",
  "api_suburbperformance_read",
  "api_demographics_read",
  "api_locations_read",
  "api_agencies_read",
  "api_enquiries_read",
  "api_addresslocators_read",
  "api_salesresults_read",
].join(" ");

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
    scope: ALL_SCOPES,
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

async function domainGet<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${DOMAIN_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Domain API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function extractDomainListingId(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      const match = seg.match(/(?:^|-)(\d{7,})$/);
      if (match) return match[1];
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface DomainListing {
  id: number;
  listingType: string;
  propertyTypes: string[];
  headline: string | null;
  summaryDescription: string | null;
  description: string | null;
  priceDetails?: { displayPrice?: string; price?: number };
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
  media?: Array<{ category?: string; url?: string }>;
  photos?: Array<{ url?: string }>;
}

export interface SuburbStats {
  suburb: string;
  state: string;
  propertyCategory: string;
  medianSoldPrice: number | null;
  medianDaysOnMarket: number | null;
  numberSold: number | null;
  clearanceRate: number | null;
  highestSoldPrice: number | null;
  lowestSoldPrice: number | null;
  vendorDiscount: number | null;
  periodLabel: string | null;
}

export interface LocationResult {
  id: string;
  name: string;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
}

export interface SalesResult {
  address: string | null;
  suburb: string | null;
  state: string | null;
  price: number | null;
  saleMethod: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  agencyName: string | null;
}

export interface PropertyEstimate {
  propertyId: string;
  confidence: string | null;
  estimatedValue: number | null;
  lowerValue: number | null;
  upperValue: number | null;
  fsdScore: number | null;
}

// ── Listings ──────────────────────────────────────────────────────────────────

export async function fetchDomainListing(listingId: string): Promise<ScrapedListing> {
  const listing = await domainGet<DomainListing>(`/listings/${listingId}`);

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

  const ap = listing.addressParts;
  const address = ap?.displayAddress
    ?? ([ap?.streetNumber, ap?.street, ap?.suburb, ap?.state, ap?.postcode].filter(Boolean).join(" ") || null);

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

  logger.info({ listingId, imageCount: images.length, address, title }, "Domain API listing fetched");

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

// ── Suburb Performance ────────────────────────────────────────────────────────

interface DomainSuburbPerformanceResponse {
  header?: {
    suburb?: string;
    state?: string;
    propertyCategory?: string;
  };
  series?: {
    seriesInfo?: Array<{
      year?: number;
      month?: number;
      label?: string;
    }>;
    values?: {
      medianSoldPrice?: Array<number | null>;
      medianDaysOnMarket?: Array<number | null>;
      numberSold?: Array<number | null>;
      numberAuctioned?: Array<number | null>;
      auctionNumberSold?: Array<number | null>;
      highestSoldPrice?: Array<number | null>;
      lowestSoldPrice?: Array<number | null>;
      vendorDiscount?: Array<number | null>;
    };
  };
}

export async function getSuburbPerformance(
  suburb: string,
  state: string,
  propertyCategory: "house" | "unit" = "house",
): Promise<SuburbStats | null> {
  try {
    const encSuburb = encodeURIComponent(suburb.toLowerCase());
    const encState = encodeURIComponent(state.toUpperCase());
    const path = `/suburbPerformance/state/${encState}/suburb/${encSuburb}/propertyCategory/${propertyCategory}/bedrooms/0?startingPeriodRelativeToCurrent=1&totalPeriods=1`;

    const data = await domainGet<DomainSuburbPerformanceResponse>(path);

    const vals = data.series?.values ?? {};
    const seriesInfo = data.series?.seriesInfo ?? [];
    const idx = 0;

    const auctioned = vals.numberAuctioned?.[idx] ?? 0;
    const auctionSold = vals.auctionNumberSold?.[idx] ?? 0;
    const clearanceRate = auctioned && auctioned > 0
      ? Math.round((auctionSold / auctioned) * 100)
      : null;

    const si = seriesInfo[idx];
    const periodLabel = si?.label ?? (si?.month && si?.year ? `${si.year}-${String(si.month).padStart(2, "0")}` : null);

    logger.info({ suburb, state, propertyCategory }, "Domain suburb performance fetched");

    return {
      suburb: data.header?.suburb ?? suburb,
      state: data.header?.state ?? state,
      propertyCategory: data.header?.propertyCategory ?? propertyCategory,
      medianSoldPrice: vals.medianSoldPrice?.[idx] ?? null,
      medianDaysOnMarket: vals.medianDaysOnMarket?.[idx] ?? null,
      numberSold: vals.numberSold?.[idx] ?? null,
      clearanceRate,
      highestSoldPrice: vals.highestSoldPrice?.[idx] ?? null,
      lowestSoldPrice: vals.lowestSoldPrice?.[idx] ?? null,
      vendorDiscount: vals.vendorDiscount?.[idx] ?? null,
      periodLabel,
    };
  } catch (err) {
    logger.warn({ err, suburb, state }, "Domain suburb performance fetch failed");
    return null;
  }
}

// ── Location Search ───────────────────────────────────────────────────────────

interface DomainLocationSearchItem {
  id?: string;
  name?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

export async function searchLocations(terms: string, pageSize = 5): Promise<LocationResult[]> {
  const path = `/locations/search?terms=${encodeURIComponent(terms)}&pageSize=${pageSize}`;
  const data = await domainGet<DomainLocationSearchItem[]>(path);
  return (data ?? []).map((item) => ({
    id: item.id ?? "",
    name: item.name ?? "",
    suburb: item.suburb ?? null,
    state: item.state ?? null,
    postcode: item.postcode ?? null,
  }));
}

// ── Sales Results ─────────────────────────────────────────────────────────────

interface DomainSalesResult {
  streetAddress?: string;
  suburb?: string;
  state?: string;
  price?: number;
  saleMethod?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  agency?: { name?: string };
}

interface DomainSalesResultsResponse {
  results?: DomainSalesResult[];
}

export async function getRecentSalesResults(
  state: string,
  date?: Date,
): Promise<SalesResult[]> {
  const d = date ?? mostRecentSaturday();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const path = `/salesResults/${year}/${month}/${day}?state=${encodeURIComponent(state.toUpperCase())}&pageSize=20`;
  const data = await domainGet<DomainSalesResultsResponse>(path);

  return (data.results ?? []).map((r) => ({
    address: r.streetAddress ?? null,
    suburb: r.suburb ?? null,
    state: r.state ?? null,
    price: r.price ?? null,
    saleMethod: r.saleMethod ?? null,
    propertyType: r.propertyType ?? null,
    bedrooms: r.bedrooms ?? null,
    bathrooms: r.bathrooms ?? null,
    agencyName: r.agency?.name ?? null,
  }));
}

function mostRecentSaturday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const daysBack = day === 6 ? 0 : (day + 1) % 7 === 0 ? 1 : day + 1;
  const sat = new Date(now);
  sat.setDate(now.getDate() - daysBack);
  return sat;
}

// ── Property Price Estimate ───────────────────────────────────────────────────

interface DomainPriceEstimateResponse {
  confidence?: string;
  estimatedValue?: number;
  lowerValue?: number;
  upperValue?: number;
  fsdScore?: number;
}

export async function getPropertyEstimate(propertyId: string): Promise<PropertyEstimate | null> {
  try {
    const data = await domainGet<DomainPriceEstimateResponse>(`/properties/${propertyId}/priceEstimate`);
    return {
      propertyId,
      confidence: data.confidence ?? null,
      estimatedValue: data.estimatedValue ?? null,
      lowerValue: data.lowerValue ?? null,
      upperValue: data.upperValue ?? null,
      fsdScore: data.fsdScore ?? null,
    };
  } catch (err) {
    logger.warn({ err, propertyId }, "Domain property estimate fetch failed");
    return null;
  }
}
