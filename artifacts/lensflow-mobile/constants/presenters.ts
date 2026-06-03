export interface Presenter {
  id: string;
  name: string;
  specialty: string;
  voiceId: string;
  voiceName: string;
  photo: string;
}

export const PRESENTERS: Presenter[] = [
  {
    id: "mia",
    name: "Mia",
    specialty: "Waterfront · Lifestyle",
    voiceId: "z9fH9S068t9I3i8Y9u4",
    voiceName: "emma",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "oliver",
    name: "Oliver",
    specialty: "Inner-City · Investment",
    voiceId: "Xb7hH9S068t9I3i8Y9u4",
    voiceName: "aussie voice",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "sophie",
    name: "Sophie",
    specialty: "Family · Suburban",
    voiceId: "u8fH9S068t9I3i8Y9u4",
    voiceName: "Australian real estate agent",
    photo:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "james",
    name: "James",
    specialty: "Commercial · Rural · Development",
    voiceId: "nzYv9Z868t9I3i8Y9u4",
    voiceName: "morgan voice",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400",
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
