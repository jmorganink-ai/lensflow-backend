export interface ListingMetadata {
  platform: string;
  suburb: string | null;
  state: string | null;
  propertyType: string | null;
  bedrooms: string | null;
  summary: string;
}

const PROPERTY_TYPES: Record<string, string> = {
  house: "house",
  apartment: "apartment",
  unit: "unit",
  townhouse: "townhouse",
  villa: "villa",
  acreage: "acreage",
  rural: "rural property",
  land: "land",
  duplex: "duplex",
  penthouse: "penthouse",
};

const AU_STATES: Record<string, string> = {
  nsw: "NSW",
  vic: "VIC",
  qld: "QLD",
  wa: "WA",
  sa: "SA",
  tas: "TAS",
  act: "ACT",
  nt: "NT",
  "new-south-wales": "NSW",
  victoria: "VIC",
  queensland: "QLD",
  "western-australia": "WA",
  "south-australia": "SA",
  tasmania: "TAS",
};

export function parseListingUrl(listingUrl: string): ListingMetadata {
  let domain = "realestate.com.au";
  let pathname = "";

  try {
    const url = new URL(listingUrl);
    domain = url.hostname.replace("www.", "");
    pathname = url.pathname.toLowerCase();
  } catch {
    return { platform: domain, suburb: null, state: null, propertyType: null, bedrooms: null, summary: listingUrl };
  }

  const segments = pathname.split("/").filter(Boolean);

  let suburb: string | null = null;
  let state: string | null = null;
  let propertyType: string | null = null;
  let bedrooms: string | null = null;

  for (const seg of segments) {
    // Match AU state codes
    if (!state) {
      for (const [key, val] of Object.entries(AU_STATES)) {
        if (seg === key || seg.startsWith(key + "-") || seg.endsWith("-" + key)) {
          state = val;
          // Try to extract suburb from segment like "vic-melbourne" or "nsw-double-bay"
          const suburbPart = seg.replace(key + "-", "").replace("-" + key, "");
          if (suburbPart && suburbPart !== key) {
            suburb = toTitleCase(suburbPart.replace(/-/g, " "));
          }
          break;
        }
      }
    }

    // Match property types
    if (!propertyType) {
      for (const [key, val] of Object.entries(PROPERTY_TYPES)) {
        if (seg.includes(key) || seg.includes(key + "s")) {
          propertyType = val;
          break;
        }
      }
    }

    // Match bedroom count like "3-bed" or "4br"
    const bedMatch = seg.match(/(\d+)[-_]?(?:bed|br|bedroom)/);
    if (bedMatch && !bedrooms) {
      bedrooms = bedMatch[1];
    }
  }

  // Build human summary
  const parts: string[] = [];
  if (bedrooms) parts.push(`${bedrooms}-bedroom`);
  if (propertyType) parts.push(propertyType);
  else parts.push("property");
  if (suburb) parts.push(`in ${suburb}`);
  if (state) parts.push(state);

  const summary = parts.length > 1 ? toTitleCase(parts.join(" ")) : `Property listing on ${domain}`;

  return { platform: domain, suburb, state, propertyType, bedrooms, summary };
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
