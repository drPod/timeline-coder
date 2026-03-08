import cache from "@/data/githubCache.json";

type RepoCacheEntry = {
  sha: string;
  repo: string;
};

const githubCache = cache as Record<string, RepoCacheEntry[]>;

/** Get cached GitHub data for a timeline entry ID. Returns null if not cached. */
export function getGitHubData(entryId: string): RepoCacheEntry[] | null {
  return githubCache[entryId] ?? null;
}

/** Get the short hash (7 chars) for the primary repo, or null. */
export function getShortHash(entryId: string): string | null {
  const data = getGitHubData(entryId);
  if (!data || data.length === 0) return null;
  return data[0].sha.slice(0, 7);
}

/** Get the primary repo name (e.g. "drPod/Phantom"), or null. */
export function getPrimaryRepo(entryId: string): string | null {
  const data = getGitHubData(entryId);
  if (!data || data.length === 0) return null;
  return data[0].repo;
}

/**
 * Get the repo label for display.
 * Single repo: "drPod/Phantom"
 * Multi repo: "drPod/mcp-google-sheets +2"
 */
export function getRepoLabel(entryId: string): string | null {
  const data = getGitHubData(entryId);
  if (!data || data.length === 0) return null;
  const primary = data[0].repo;
  if (data.length === 1) return primary;
  return `${primary} +${data.length - 1}`;
}

/** Get GitHub URL for the primary repo, or null. */
export function getRepoUrl(entryId: string): string | null {
  const primary = getPrimaryRepo(entryId);
  if (!primary) return null;
  return `https://github.com/${primary}`;
}
