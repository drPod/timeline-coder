/**
 * Fetches ALL public repos for GitHub user drPod with full metadata.
 * Writes results to src/data/githubCache.json as an array of repo objects.
 *
 * Usage: bun run scripts/fetch-github-data.ts
 * Set GITHUB_TOKEN env var for higher rate limits.
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

const GITHUB_API = "https://api.github.com";
const GITHUB_USER = "drPod";
const token = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "timeline-coder",
};
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

type GitHubRepo = {
  name: string;
  description: string | null;
  created_at: string;
  pushed_at: string;
  language: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  topics: string[];
};

async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const url = `${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=asc&page=${page}`;
    console.log(`  Fetching page ${page}...`);

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    for (const repo of data) {
      allRepos.push({
        name: repo.name,
        description: repo.description ?? null,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at,
        language: repo.language ?? null,
        html_url: repo.html_url,
        homepage: repo.homepage ?? null,
        fork: repo.fork,
        archived: repo.archived,
        topics: repo.topics ?? [],
      });
    }

    console.log(`  Got ${data.length} repos (total: ${allRepos.length})`);

    // If we got fewer than 100 results, we've reached the last page
    if (data.length < 100) break;
    page++;
  }

  return allRepos;
}

async function main() {
  console.log(`Fetching all public repos for ${GITHUB_USER}...\n`);

  const repos = await fetchAllRepos();

  const outPath = resolve(import.meta.dir, "../src/data/githubCache.json");
  writeFileSync(outPath, JSON.stringify(repos, null, 2) + "\n");
  console.log(`\nWrote ${repos.length} repos to src/data/githubCache.json`);
}

main();
