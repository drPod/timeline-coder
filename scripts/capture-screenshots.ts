/**
 * Captures PNG screenshots of every project's liveUrl using Playwright.
 *
 * Strategy:
 *  - Read githubCache.json for all repos (provides homepage fallbacks).
 *  - Read projects.ts for manual overrides (liveUrl, skip, etc.).
 *  - For every non-skipped project with a resolved liveUrl, launch a headless
 *    Chromium page at 1280×720, navigate with a 20s timeout, let animations
 *    settle, and save a viewport PNG to public/thumbnails/{id}.png.
 *  - Skip captures that already exist and are fresher than MAX_AGE_DAYS,
 *    unless `--force` is passed.
 *  - Write a manifest at src/data/screenshots-manifest.json listing all IDs
 *    that have a screenshot on disk, so the app can resolve paths at build
 *    time without file-system access.
 *
 * Usage:
 *   bun run scripts/capture-screenshots.ts [--force] [--only <id>]
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { resolve } from "path";
import { chromium, type Browser } from "playwright";

import { overridesByName, projectOverrides } from "../src/data/projects";

// ── Config ──────────────────────────────────────────────────────────────

const VIEWPORT = { width: 1280, height: 720 } as const;
const NAV_TIMEOUT_MS = 20_000;
const SETTLE_MS = 1_500; // wait after load so animations settle
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

const ROOT = resolve(import.meta.dir, "..");
const THUMBNAIL_DIR = resolve(ROOT, "public/thumbnails");
const MANIFEST_PATH = resolve(ROOT, "src/data/screenshots-manifest.json");
const CACHE_PATH = resolve(ROOT, "src/data/githubCache.json");

// ── CLI flags ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const ONLY_ID =
  onlyIdx >= 0 && args[onlyIdx + 1] ? args[onlyIdx + 1] : undefined;

// ── Types ───────────────────────────────────────────────────────────────

type GitHubRepo = {
  name: string;
  homepage: string | null;
  fork: boolean;
};

type CaptureTarget = {
  id: string; // matches the repo name (ProjectEntry.id)
  url: string;
};

// ── Helpers ─────────────────────────────────────────────────────────────

function loadTargets(): CaptureTarget[] {
  const raw = readFileSync(CACHE_PATH, "utf-8");
  const repos = JSON.parse(raw) as GitHubRepo[];

  const byRepoName = new Map<string, GitHubRepo>();
  for (const r of repos) byRepoName.set(r.name, r);

  const targets: CaptureTarget[] = [];
  const seen = new Set<string>();

  // 1) Every repo with a homepage gets a target, unless skipped or forked.
  for (const repo of repos) {
    if (repo.fork) continue;
    const override = overridesByName.get(repo.name);
    if (override?.skip) continue;

    const liveUrl =
      override?.liveUrl ??
      (repo.homepage && repo.homepage.length > 0 ? repo.homepage : undefined);
    if (!liveUrl) continue;

    targets.push({ id: repo.name, url: liveUrl });
    seen.add(repo.name);
  }

  // 2) Any override that provides a liveUrl but is missing from the cache
  //    (edge case; shouldn't usually happen, but covers manual additions).
  for (const override of projectOverrides) {
    if (override.skip) continue;
    if (!override.liveUrl) continue;
    if (seen.has(override.repoName)) continue;
    // Make sure the repo exists in the cache at all — otherwise the app
    // won't render a card for it, so capturing would be wasted work.
    if (!byRepoName.has(override.repoName)) continue;
    targets.push({ id: override.repoName, url: override.liveUrl });
  }

  return targets;
}

function screenshotPath(id: string): string {
  return resolve(THUMBNAIL_DIR, `${id}.png`);
}

function isFresh(path: string): boolean {
  try {
    const s = statSync(path);
    return Date.now() - s.mtimeMs < MAX_AGE_MS;
  } catch {
    return false;
  }
}

async function captureOne(
  browser: Browser,
  target: CaptureTarget,
): Promise<"captured" | "skipped-fresh" | "failed"> {
  const outPath = screenshotPath(target.id);

  if (!FORCE && existsSync(outPath) && isFresh(outPath)) {
    console.log(`  ⎯ ${target.id}: fresh (skipped)`);
    return "skipped-fresh";
  }

  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });

  const page = await ctx.newPage();

  try {
    console.log(`  → ${target.id}: ${target.url}`);
    await page.goto(target.url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT_MS,
    });

    // Try to also reach networkidle, but tolerate sites with long-poll/etc.
    try {
      await page.waitForLoadState("networkidle", { timeout: 6_000 });
    } catch {
      // Non-fatal — many modern sites never truly reach networkidle.
    }

    await page.waitForTimeout(SETTLE_MS);

    await page.screenshot({
      path: outPath,
      type: "png",
      fullPage: false,
    });

    console.log(`    ✓ wrote ${outPath.replace(ROOT + "/", "")}`);
    return "captured";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    ✗ ${target.id} failed: ${msg.split("\n")[0]}`);
    return "failed";
  } finally {
    await ctx.close();
  }
}

function writeManifest(ids: string[]): void {
  ids.sort();
  const body = {
    generatedAt: new Date().toISOString(),
    ids,
  };
  writeFileSync(MANIFEST_PATH, JSON.stringify(body, null, 2) + "\n");
  console.log(
    `\nWrote manifest with ${ids.length} entries → ${MANIFEST_PATH.replace(
      ROOT + "/",
      "",
    )}`,
  );
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(THUMBNAIL_DIR)) {
    mkdirSync(THUMBNAIL_DIR, { recursive: true });
  }

  let targets = loadTargets();

  if (ONLY_ID) {
    targets = targets.filter((t) => t.id === ONLY_ID);
    if (targets.length === 0) {
      console.error(`No target matches --only ${ONLY_ID}`);
      process.exit(1);
    }
  }

  console.log(
    `Capturing ${targets.length} screenshot${targets.length === 1 ? "" : "s"}` +
      (FORCE ? " (forced)" : "") +
      "\n",
  );

  const browser = await chromium.launch({ headless: true });

  let captured = 0;
  let skipped = 0;
  let failed = 0;

  try {
    for (const target of targets) {
      const result = await captureOne(browser, target);
      if (result === "captured") captured++;
      else if (result === "skipped-fresh") skipped++;
      else failed++;
    }
  } finally {
    await browser.close();
  }

  // Manifest = every id that has a file on disk right now.
  const presentIds: string[] = [];
  for (const target of loadTargets()) {
    if (existsSync(screenshotPath(target.id))) {
      presentIds.push(target.id);
    }
  }
  writeManifest(presentIds);

  console.log(
    `\nDone. captured=${captured} skipped=${skipped} failed=${failed} ` +
      `total-on-disk=${presentIds.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
