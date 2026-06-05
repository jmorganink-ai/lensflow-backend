export interface Presenter {
  id: string;
  name: string;
  specialty: string;
  neutralName: string;
  neutralSpecialty: string;
  voiceId: string;
  voiceName: string;
  photo: string;
}

export const PRESENTERS: Presenter[] = [
  {
    id: "mia",
    name: "Mia",
    specialty: "Waterfront · Lifestyle",
    neutralName: "Female — Warm",
    neutralSpecialty: "Natural · Conversational",
    voiceId: "x3PfG9wL6FOEApZ1VJ9H",
    voiceName: "mia",
    photo: "https://files2.heygen.ai/avatar/v3/96a78a5d17d04e75adc4b53a89eb3fe4_38970/preview_talk_7.webp",
  },
  {
    id: "oliver",
    name: "Oliver",
    specialty: "Inner-City · Investment",
    neutralName: "Male — Confident",
    neutralSpecialty: "Clear · Authoritative",
    voiceId: "jfIS2w2yJi0grJZPyEsk",
    voiceName: "oliver",
    photo: "https://files2.heygen.ai/avatar/v3/e2811ccbb3b247fabf76a93d288a75a6_43160/preview_target.webp",
  },
  {
    id: "sophie",
    name: "Sophie",
    specialty: "Family · Suburban",
    neutralName: "Female — Energetic",
    neutralSpecialty: "Bright · Engaging",
    voiceId: "69h9o7wh5u0isWHzdogD",
    voiceName: "sophie",
    photo: "https://files2.heygen.ai/avatar/v3/5ea97a1a6cbf4a96b5ee910aa8f4f08d_62450/preview_target.webp",
  },
  {
    id: "james",
    name: "James",
    specialty: "Prestige · Coastal · Inner-City",
    neutralName: "Male — Authoritative",
    neutralSpecialty: "Sharp · Commanding",
    voiceId: "yXFr3XVHzrViCIHi1yoc",
    voiceName: "james",
    photo: "https://files2.heygen.ai/avatar/v3/placeholder_james/preview_target.webp",
  },
];

const PLATFORM_LABELS: Record<string, string> = {
  "realestate.com.au": "REA",
  "domain.com.au": "Domain",
  "onthehouse.com.au": "OnTheHouse",
  "allhomes.com.au": "AllHomes",
  "raywhite.com": "Ray White",
  "ljhooker.com": "LJ Hooker",
  "harcourts.com.au": "Harcourts",
  "mcgrath.com.au": "McGrath",
  "barryproperty.com.au": "Barry Plant",
};

export function detectPlatform(url: string): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace("www.", "");
    for (const [domain, label] of Object.entries(PLATFORM_LABELS)) {
      if (host === domain || host.endsWith("." + domain)) return label;
    }
    if (host) return host;
  } catch {
    // not yet a valid URL
  }
  return null;
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
