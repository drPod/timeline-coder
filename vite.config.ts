import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { projectOverrides } from "./src/data/projects";
import githubCache from "./src/data/githubCache.json";

type GitHubRepoLite = {
  name: string;
  created_at: string;
  fork: boolean;
};

/**
 * Computes the visible project count + year span (same skip rules the
 * runtime uses in getProjects). Used to substitute real numbers into
 * index.html meta descriptions at build time so SEO/social cards stay
 * in sync with the actual timeline.
 */
function computeSiteStats() {
  const skipSet = new Set(
    projectOverrides.filter((o) => o.skip).map((o) => o.repoName),
  );
  const overrideYearByName = new Map(
    projectOverrides
      .filter((o) => o.year != null)
      .map((o) => [o.repoName, o.year as number]),
  );
  const SKIP_PREFIXES = ["recitation-"];

  const repos = githubCache as GitHubRepoLite[];
  let count = 0;
  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;

  for (const r of repos) {
    if (r.fork) continue;
    if (SKIP_PREFIXES.some((p) => r.name.startsWith(p))) continue;
    if (skipSet.has(r.name)) continue;
    count++;
    const year =
      overrideYearByName.get(r.name) ?? new Date(r.created_at).getFullYear();
    if (year < minYear) minYear = year;
    if (year > maxYear) maxYear = year;
  }

  const yearSpan = Number.isFinite(minYear)
    ? Math.max(1, maxYear - minYear + 1)
    : 1;
  return { count, yearSpan };
}

const siteStats = computeSiteStats();

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "substitute-site-stats",
      transformIndexHtml(html) {
        return html
          .replaceAll("%%PROJECT_COUNT%%", String(siteStats.count))
          .replaceAll("%%YEAR_SPAN%%", String(siteStats.yearSpan));
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
