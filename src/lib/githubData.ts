import cache from "@/data/githubCache.json";
import { overridesByName } from "@/data/projects";

// ── Types ───────────────────────────────────────────────────────────────

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

export type Project = {
  id: string;
  name: string;
  pitch: string;
  category: string;
  year: number;
  month: number;
  techStack: string[];
  liveUrl?: string;
  repoUrl: string;
  featured: boolean;
  primaryLanguage?: string;
};

// ── Category colours ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  osint: "270 70% 60%",
  tool: "200 70% 50%",
  media: "0 70% 55%",
  sales: "142 70% 45%",
  infra: "35 90% 55%",
  security: "0 70% 55%",
  research: "270 70% 60%",
  learning: "200 70% 50%",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "200 70% 50%";
}

export function getCategoryGlow(category: string): string {
  const hsl = getCategoryColor(category);
  return `0 0 12px hsl(${hsl} / 0.45), 0 0 32px hsl(${hsl} / 0.2)`;
}

// ── Repos typed ─────────────────────────────────────────────────────────

const repos = cache as GitHubRepo[];

// Repos whose names start with these prefixes are always skipped.
const SKIP_PREFIXES = ["recitation-"];

function shouldSkipByPrefix(name: string): boolean {
  return SKIP_PREFIXES.some((p) => name.startsWith(p));
}

// ── Merge logic ─────────────────────────────────────────────────────────

function buildProject(repo: GitHubRepo): Project | null {
  // Always skip forks
  if (repo.fork) return null;

  // Check prefix-based skip list
  if (shouldSkipByPrefix(repo.name)) return null;

  const override = overridesByName.get(repo.name);

  // Explicit skip in overrides
  if (override?.skip) return null;

  const createdAt = new Date(repo.created_at);

  const year = override?.year ?? createdAt.getFullYear();
  const month = createdAt.getMonth() + 1; // 1-indexed

  const pitch =
    override?.pitch ??
    repo.description ??
    "";

  const category = override?.category ?? "tool";
  const featured = override?.featured ?? false;

  const techStack: string[] = [];
  if (repo.language) techStack.push(repo.language);

  // Determine liveUrl: override takes precedence, then GitHub homepage
  const liveUrl =
    override?.liveUrl ??
    (repo.homepage && repo.homepage.length > 0 ? repo.homepage : undefined);

  return {
    id: repo.name,
    name: repo.name.toLowerCase(),
    pitch,
    category,
    year,
    month,
    techStack,
    liveUrl,
    repoUrl: repo.html_url,
    featured,
    primaryLanguage: repo.language ?? undefined,
  };
}

// ── Query helpers ───────────────────────────────────────────────────────

let _cache: Project[] | null = null;

/**
 * Reads githubCache.json, merges with overrides, filters out skipped
 * entries and forks, and returns the final list sorted year desc then
 * month desc.
 */
export function getProjects(): Project[] {
  if (_cache) return _cache;

  const projects: Project[] = [];

  for (const repo of repos) {
    const p = buildProject(repo);
    if (p) projects.push(p);
  }

  // Sort: year descending, then month descending
  projects.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  _cache = projects;
  return projects;
}

/** Groups projects by year (Map key = year). */
export function getProjectsByYear(): Map<number, Project[]> {
  const map = new Map<number, Project[]>();
  for (const p of getProjects()) {
    const list = map.get(p.year);
    if (list) {
      list.push(p);
    } else {
      map.set(p.year, [p]);
    }
  }
  return map;
}

/** Returns the first featured project for the given year, or undefined. */
export function getFeaturedProject(year: number): Project | undefined {
  return getProjects().find((p) => p.year === year && p.featured);
}

/** Aggregate stats for the hero section. */
export function getProjectStats(): {
  repos: number;
  years: number;
  languages: number;
} {
  const projects = getProjects();
  const yearSet = new Set<number>();
  const langSet = new Set<string>();

  for (const p of projects) {
    yearSet.add(p.year);
    if (p.primaryLanguage) langSet.add(p.primaryLanguage);
  }

  return {
    repos: projects.length,
    years: yearSet.size,
    languages: langSet.size,
  };
}
