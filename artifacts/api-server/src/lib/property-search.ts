import { logger } from "./logger";

export interface PropertySearchCriteria {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  landSizeMin?: number;
  propertyType?: "house" | "apartment" | "townhouse" | "land" | "any";
  distressedOnly?: boolean;
  keywords?: string[];
}

export interface PropertyListing {
  address: string;
  suburb: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landSize?: string;
  propertyType: string;
  url: string;
  imageUrl?: string;
  daysListed?: number;
  isDistressed: boolean;
  source: "domain";
}

export interface PropertySearchResult {
  properties: PropertyListing[];
  domainSearchUrl: string;
  reaSearchUrl: string;
  criteria: PropertySearchCriteria;
  apiUsed: boolean;
}

function parseLocation(location: string): { suburb: string; state: string; postcode?: string } {
  const stateSet = new Set(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]);
  const parts = location.trim().split(/[\s,]+/);
  let state = "";
  let postcode = "";
  const suburbParts: string[] = [];
  for (const part of parts) {
    if (stateSet.has(part.toUpperCase())) {
      state = part.toUpperCase();
    } else if (/^\d{4}$/.test(part)) {
      postcode = part;
    } else {
      suburbParts.push(part);
    }
  }
  return { suburb: suburbParts.join(" "), state, postcode: postcode || undefined };
}

export function buildDomainSearchUrl(criteria: PropertySearchCriteria): string {
  const { suburb, state, postcode } = parseLocation(criteria.location);
  const slug = [suburb.toLowerCase().replace(/\s+/g, "-"), state.toLowerCase(), postcode]
    .filter(Boolean)
    .join("-");
  const base = `https://www.domain.com.au/sale/${slug}/`;
  const params = new URLSearchParams();
  if (criteria.bedrooms) params.set("bedrooms", `${criteria.bedrooms}-`);
  if (criteria.bathrooms) params.set("bathrooms", `${criteria.bathrooms}-`);
  if (criteria.minPrice || criteria.maxPrice) {
    params.set("price", `${criteria.minPrice ?? ""}-${criteria.maxPrice ?? ""}`);
  }
  if (criteria.landSizeMin) params.set("land_area", `${criteria.landSizeMin}-`);
  if (criteria.propertyType && criteria.propertyType !== "any") {
    const t: Record<string, string> = { house: "house", apartment: "unit+apartment", townhouse: "townhouse", land: "land" };
    params.set("property_type", t[criteria.propertyType] ?? criteria.propertyType);
  }
  if (criteria.distressedOnly) {
    params.set("q", "mortgagee+in+possession");
  } else if (criteria.keywords?.length) {
    params.set("q", criteria.keywords.join("+"));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildREASearchUrl(criteria: PropertySearchCriteria): string {
  const { suburb, state, postcode } = parseLocation(criteria.location);
  const locationSlug = [suburb.replace(/\s+/g, "-"), state, postcode].filter(Boolean).join("-");
  let path = "/buy";
  if (criteria.minPrice || criteria.maxPrice) {
    path += `/between-${criteria.minPrice ?? ""}-${criteria.maxPrice ?? ""}`;
  }
  path += `/in-${locationSlug}/list-1`;
  const params = new URLSearchParams();
  if (criteria.bedrooms) params.set("numberOfBedrooms", `${criteria.bedrooms}-`);
  if (criteria.bathrooms) params.set("minimumBathrooms", String(criteria.bathrooms));
  if (criteria.landSizeMin) params.set("minimumLandSize", String(criteria.landSizeMin));
  if (criteria.propertyType && criteria.propertyType !== "any") {
    const t: Record<string, string> = { house: "house", apartment: "apartment", townhouse: "townhouse", land: "land" };
    params.set("propertyType", t[criteria.propertyType] ?? criteria.propertyType);
  }
  if (criteria.distressedOnly) {
    params.set("keywords", "mortgagee");
  } else if (criteria.keywords?.length) {
    params.set("keywords", criteria.keywords.join(","));
  }
  const qs = params.toString();
  return qs ? `https://www.realestate.com.au${path}?${qs}` : `https://www.realestate.com.au${path}`;
}

let _domainToken: string | null = null;
let _domainTokenExpiry = 0;

async function getDomainToken(): Promise<string | null> {
  const id = process.env.DOMAIN_CLIENT_ID;
  const secret = process.env.DOMAIN_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (_domainToken && Date.now() < _domainTokenExpiry) return _domainToken;
  try {
    const creds = Buffer.from(`${id}:${secret}`).toString("base64");
    const res = await fetch("https://auth.domain.com.au/v1/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${creds}` },
      body: "grant_type=client_credentials&scope=api_listings_read",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string; expires_in: number };
    _domainToken = data.access_token;
    _domainTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return _domainToken;
  } catch (err) {
    logger.warn({ err }, "Domain OAuth token request failed");
    return null;
  }
}

async function fetchFromDomainAPI(criteria: PropertySearchCriteria): Promise<PropertyListing[]> {
  const token = await getDomainToken();
  if (!token) return [];

  const { suburb, state, postcode } = parseLocation(criteria.location);
  const body: Record<string, unknown> = {
    listingType: "Sale",
    locations: [{ state, suburb, ...(postcode ? { postCode: postcode } : {}) }],
    pageSize: 10,
    sort: { sortKey: "Default", direction: "Ascending" },
  };
  if (criteria.minPrice) body.minPrice = criteria.minPrice;
  if (criteria.maxPrice) body.maxPrice = criteria.maxPrice;
  if (criteria.bedrooms) body.minBedrooms = criteria.bedrooms;
  if (criteria.bathrooms) body.minBathrooms = criteria.bathrooms;
  if (criteria.landSizeMin) body.landAreaMin = criteria.landSizeMin;
  if (criteria.propertyType && criteria.propertyType !== "any") {
    const t: Record<string, string> = { house: "House", apartment: "ApartmentUnitFlat", townhouse: "Townhouse", land: "VacantLand" };
    body.propertyTypes = [t[criteria.propertyType] ?? "House"];
  }
  const kwds = criteria.distressedOnly
    ? ["mortgagee", "bank sale"]
    : (criteria.keywords ?? []);
  if (kwds.length) body.keywords = kwds;

  try {
    const res = await fetch("https://api.domain.com.au/v2/listings/residential/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Api-Key": process.env.DOMAIN_CLIENT_ID ?? "",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Domain API residential search failed");
      return [];
    }
    type RawListing = {
      listing?: {
        propertyDetails?: {
          displayableAddress?: string;
          suburb?: string;
          bedrooms?: number;
          bathrooms?: number;
          carspaces?: number;
          landArea?: number;
          propertyType?: string;
        };
        priceDetails?: { displayPrice?: string };
        media?: Array<{ url?: string }>;
        listingSlug?: string;
        daysListed?: number;
        saleMode?: string;
        headline?: string;
      };
    };
    const data = (await res.json()) as RawListing[];
    return data
      .filter((item) => item.listing?.propertyDetails?.displayableAddress)
      .map((item) => {
        const l = item.listing!;
        const pd = l.propertyDetails!;
        const headline = (l.headline ?? "").toLowerCase();
        return {
          address: pd.displayableAddress ?? "",
          suburb: pd.suburb ?? "",
          price: l.priceDetails?.displayPrice ?? "Price on Application",
          bedrooms: pd.bedrooms,
          bathrooms: pd.bathrooms,
          carSpaces: pd.carspaces,
          landSize: pd.landArea ? `${pd.landArea}m²` : undefined,
          propertyType: pd.propertyType ?? "Property",
          url: `https://www.domain.com.au/${l.listingSlug ?? ""}`,
          imageUrl: l.media?.[0]?.url,
          daysListed: l.daysListed,
          isDistressed: headline.includes("mortgagee") || headline.includes("bank") || !!criteria.distressedOnly,
          source: "domain" as const,
        };
      });
  } catch (err) {
    logger.warn({ err }, "Domain API fetch failed");
    return [];
  }
}

export async function searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResult> {
  const [domainSearchUrl, reaSearchUrl, properties] = await Promise.all([
    Promise.resolve(buildDomainSearchUrl(criteria)),
    Promise.resolve(buildREASearchUrl(criteria)),
    fetchFromDomainAPI(criteria),
  ]);

  return { properties, domainSearchUrl, reaSearchUrl, criteria, apiUsed: properties.length > 0 };
}
