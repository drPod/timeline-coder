import cache from "@/data/githubCache.json";
import { overridesByName } from "@/data/projects";
import { manualEntries } from "@/data/entries";

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

// Base shared by all entries
type TimelineEntryBase = {
  id: string;
  kind:
    | "project"
    | "experience"
    | "publication"
    | "award"
    | "certification"
    | "isef";
  year: number;
  month: number;
  featured?: boolean;
};

export type ProjectEntry = TimelineEntryBase & {
  kind: "project";
  name: string;
  pitch: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl: string;
  primaryLanguage?: string;
};

export type ExperienceEntry = TimelineEntryBase & {
  kind: "experience";
  company: string;
  role: string;
  endYear?: number;
  endMonth?: number;
  location?: string;
  pitch: string;
  url?: string;
};

export type PublicationEntry = TimelineEntryBase & {
  kind: "publication";
  title: string;
  venue: string;
  authors: string[];
  arxivUrl?: string;
  doi?: string;
  ieeeUrl?: string;
  status?: "published" | "under-review";
};

export type AwardEntry = TimelineEntryBase & {
  kind: "award";
  title: string;
  placement?: string;
  competition: string;
  url?: string;
};

export type CertificationEntry = TimelineEntryBase & {
  kind: "certification";
  title: string;
  issuer: string;
  credlyUrl?: string;
};

export type IsefEntry = TimelineEntryBase & {
  kind: "isef";
  name: string;
  pitch: string;
  description: string;
  techStack: string[];
  category: string;
  fair: string;
  grade: string;
  coAuthors?: string[];
  modelUrl?: string;
};

export type TimelineEntry =
  | ProjectEntry
  | ExperienceEntry
  | PublicationEntry
  | AwardEntry
  | CertificationEntry
  | IsefEntry;

// Backward compat — keep Project type as alias to ProjectEntry
export type Project = ProjectEntry;

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

function buildProject(repo: GitHubRepo): ProjectEntry | null {
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
    kind: "project",
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

let _cache: ProjectEntry[] | null = null;
let _allEntriesCache: TimelineEntry[] | null = null;

/**
 * Reads githubCache.json, merges with overrides, filters out skipped
 * entries and forks, and returns the final list sorted year desc then
 * month desc.
 */
export function getProjects(): ProjectEntry[] {
  if (_cache) return _cache;

  const projects: ProjectEntry[] = [];

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
export function getProjectsByYear(): Map<number, ProjectEntry[]> {
  const map = new Map<number, ProjectEntry[]>();
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
export function getFeaturedProject(year: number): ProjectEntry | undefined {
  return getProjects().find((p) => p.year === year && p.featured);
}

/**
 * Merges GitHub-derived projects with the manual entries
 * (experience, publications, awards, certifications, ISEF)
 * and returns them sorted by year desc, month desc.
 */
export function getAllEntries(): TimelineEntry[] {
  if (_allEntriesCache) return _allEntriesCache;

  const entries: TimelineEntry[] = [
    ...getProjects(),
    ...manualEntries,
  ];

  entries.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  _allEntriesCache = entries;
  return entries;
}

/** Groups every timeline entry (projects + manual) by year. */
export function getEntriesByYear(): Map<number, TimelineEntry[]> {
  const map = new Map<number, TimelineEntry[]>();
  for (const e of getAllEntries()) {
    const list = map.get(e.year);
    if (list) {
      list.push(e);
    } else {
      map.set(e.year, [e]);
    }
  }
  return map;
}

// Preference order when multiple entries in a year are marked featured.
const FEATURED_KIND_PRIORITY: Record<TimelineEntry["kind"], number> = {
  isef: 0,
  publication: 1,
  project: 2,
  experience: 3,
  award: 4,
  certification: 5,
};

/**
 * Returns the featured entry for a given year across all kinds.
 * When multiple entries in the same year are featured, picks by
 * the preference order: isef > publication > project > experience
 * > award > certification.
 */
export function getFeaturedEntry(year: number): TimelineEntry | undefined {
  const featured = getAllEntries().filter(
    (e) => e.year === year && e.featured,
  );
  if (featured.length === 0) return undefined;

  featured.sort(
    (a, b) => FEATURED_KIND_PRIORITY[a.kind] - FEATURED_KIND_PRIORITY[b.kind],
  );
  return featured[0];
}

/** Aggregate stats for the hero section. Counts projects only. */
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
