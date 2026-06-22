export function getPublicBaseUrl(fallback = "http://localhost:80"): string {
  const explicit =
    process.env.PUBLIC_BASE_URL?.trim()
    || process.env.APP_BASE_URL?.trim()
    || process.env.RENDER_EXTERNAL_URL?.trim();

  if (explicit) return explicit.replace(/\/$/, "");

  const replitDomain = (process.env.REPLIT_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim())
    .find(Boolean);

  if (replitDomain) return `https://${replitDomain}`.replace(/\/$/, "");
  return fallback.replace(/\/$/, "");
}

export function getAllowedPublicHosts(): string[] {
  const hosts = new Set<string>();

  for (const raw of [
    process.env.PUBLIC_BASE_URL,
    process.env.APP_BASE_URL,
    process.env.RENDER_EXTERNAL_URL,
  ]) {
    if (!raw?.trim()) continue;
    try {
      hosts.add(new URL(raw).hostname.toLowerCase());
    } catch {
      // Ignore invalid optional environment values.
    }
  }

  for (const domain of (process.env.REPLIT_DOMAINS ?? "").split(",")) {
    const trimmed = domain.trim().toLowerCase();
    if (trimmed) hosts.add(trimmed);
  }

  hosts.add("lensflow.com.au");
  hosts.add("www.lensflow.com.au");

  return [...hosts];
}
