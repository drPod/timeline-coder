/**
 * Fetches ALL public repos for GitHub user drPod with full metadata.
 * Also pulls READMEs for non-fork, non-archived, non-skipped repos.
 *
 * Writes:
 *   - src/data/githubCache.json (array of repo objects)
 *   - src/data/readmes.json    (map of repoName -> { content, branch, repo })
 *
 * Usage: bun run scripts/fetch-github-data.ts
 * Set GITHUB_TOKEN env var for higher rate limits.
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import { overridesByName } from "../src/data/projects";

const GITHUB_API = "https://api.github.com";
const GITHUB_USER = "drPod";
const token = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "darshpoddar.com",
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
  default_branch: string;
  topics: string[];
};

type ReadmeEntry = {
  content: string;
  branch: string;
  repo: string;
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
        default_branch: repo.default_branch ?? "main",
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

/**
 * Fetches the README for a single repo. Returns null if the repo has no
 * README (404) or any other error surfaces — never throws.
 */
async function fetchReadme(repoName: string): Promise<string | null> {
  const url = `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/readme`;
  try {
    const res = await fetch(url, { headers });
    if (res.status === 404) {
      console.warn(`  [!] ${repoName}: no README found`);
      return null;
    }
    if (!res.ok) {
      console.warn(
        `  [!] ${repoName}: README fetch failed (${res.status} ${res.statusText})`,
      );
      return null;
    }
    const data = (await res.json()) as {
      content?: string;
      encoding?: string;
    };
    if (!data.content) return null;

    // GitHub returns base64-encoded content
    const encoding = data.encoding ?? "base64";
    if (encoding !== "base64") {
      console.warn(`  [!] ${repoName}: unexpected encoding ${encoding}`);
      return null;
    }

    // Decode base64 — GitHub splits it across lines with \n
    const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return decoded;
  } catch (err) {
    console.warn(`  [!] ${repoName}: README fetch error`, err);
    return null;
  }
}

/**
 * Names of prefixes always skipped (matches githubData.ts logic).
 */
const SKIP_PREFIXES = ["recitation-"];

function shouldSkipByPrefix(name: string): boolean {
  return SKIP_PREFIXES.some((p) => name.startsWith(p));
}

/**
 * Decides whether we should try to fetch a README for this repo.
 * Mirrors `buildProject` in githubData.ts.
 */
function shouldFetchReadme(repo: GitHubRepo): boolean {
  if (repo.fork) return false;
  if (repo.archived) return false;
  if (shouldSkipByPrefix(repo.name)) return false;
  const override = overridesByName.get(repo.name);
  if (override?.skip) return false;
  return true;
}

async function fetchAllReadmes(
  repos: GitHubRepo[],
): Promise<Record<string, ReadmeEntry>> {
  const readmes: Record<string, ReadmeEntry> = {};
  const candidates = repos.filter(shouldFetchReadme);
  console.log(
    `\nFetching READMEs for ${candidates.length} repos (filtered from ${repos.length})...`,
  );

  let got = 0;
  let missing = 0;

  for (const repo of candidates) {
    const content = await fetchReadme(repo.name);
    if (content === null) {
      missing++;
      continue;
    }
    readmes[repo.name] = {
      content,
      branch: repo.default_branch,
      repo: repo.name,
    };
    got++;
  }

  console.log(
    `\n  Got ${got} READMEs, ${missing} missing/skipped (of ${candidates.length})`,
  );

  return readmes;
}

async function main() {
  console.log(`Fetching all public repos for ${GITHUB_USER}...\n`);

  const repos = await fetchAllRepos();

  const cachePath = resolve(import.meta.dir, "../src/data/githubCache.json");
  writeFileSync(cachePath, JSON.stringify(repos, null, 2) + "\n");
  console.log(`\nWrote ${repos.length} repos to src/data/githubCache.json`);

  const readmes = await fetchAllReadmes(repos);
  const readmePath = resolve(import.meta.dir, "../src/data/readmes.json");
  writeFileSync(readmePath, JSON.stringify(readmes, null, 2) + "\n");
  const sizeKB = (JSON.stringify(readmes).length / 1024).toFixed(1);
  console.log(
    `\nWrote ${Object.keys(readmes).length} READMEs to src/data/readmes.json (${sizeKB} KB)`,
  );
}

main();
