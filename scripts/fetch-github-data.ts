/**
 * Fetches latest commit SHAs from GitHub for each repo in repoConfig.
 * Writes results to src/data/githubCache.json.
 *
 * Usage: bun run scripts/fetch-github-data.ts
 * Set GITHUB_TOKEN env var for higher rate limits.
 */

import { repoConfig } from "../src/data/repoConfig";
import { writeFileSync } from "fs";
import { resolve } from "path";

type RepoCacheEntry = {
  sha: string;
  repo: string;
};

type GitHubCache = Record<string, RepoCacheEntry[]>;

const GITHUB_API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "timeline-coder",
};
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function fetchLatestCommit(ownerRepo: string): Promise<{ sha: string } | null> {
  const url = `${GITHUB_API}/repos/${ownerRepo}/commits?per_page=1`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`  ⚠ ${ownerRepo}: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { sha: data[0].sha as string };
  } catch (err) {
    console.warn(`  ⚠ ${ownerRepo}: ${(err as Error).message}`);
    return null;
  }
}

async function main() {
  console.log("Fetching GitHub commit data...\n");

  const cache: GitHubCache = {};

  for (const [entryId, mapping] of Object.entries(repoConfig)) {
    const entries: RepoCacheEntry[] = [];

    for (const repo of mapping.repos) {
      process.stdout.write(`  ${repo}... `);
      const result = await fetchLatestCommit(repo);
      if (result) {
        entries.push({ sha: result.sha, repo });
        console.log(result.sha.slice(0, 7));
      } else {
        console.log("skipped");
      }
    }

    if (entries.length > 0) {
      cache[entryId] = entries;
    }
  }

  const outPath = resolve(import.meta.dir, "../src/data/githubCache.json");
  writeFileSync(outPath, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(cache).length} entries to src/data/githubCache.json`);
}

main();
