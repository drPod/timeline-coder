/**
 * Generates a 1200x630 OG image per flagship project. Output goes to
 * public/og/{id}.png so that the file can be referenced from per-share
 * meta tags or pasted into a tweet/devpost manually.
 *
 * Strategy: same as scripts/generate-og-image.ts — headless Chromium
 * with inline HTML, screenshot the viewport. Each card uses the
 * project's name + tagline + a category-derived accent color so the
 * 7 images have a consistent silhouette but feel distinct.
 *
 * Usage:
 *   bun run scripts/generate-flagship-og.ts
 */

import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { flagshipProjects, type FlagshipProject } from "../src/data/flagships";

const ROOT = resolve(import.meta.dir, "..");
const OG_DIR = resolve(ROOT, "public/og");

if (!existsSync(OG_DIR)) {
  mkdirSync(OG_DIR, { recursive: true });
}

// Per-flagship accent color. Chosen to feel related to each project's
// dominant theme but stay within the site's palette.
const ACCENT: Record<string, string> = {
  ghostroom: "#3ecf8e",     // green — terminal/Linux
  tracelight: "#a78bfa",    // purple — research/OSINT graph
  chainviz: "#fb923c",      // orange — supply-chain alert
  Phantom: "#a78bfa",       // purple — OSINT
  FuckNetflix: "#f87171",   // red — anti-streaming
  coldshot: "#3ecf8e",      // green — sales/growth
  stormchain: "#60a5fa",    // blue — weather
};

function htmlFor(p: FlagshipProject): string {
  const accent = ACCENT[p.id] ?? "#3ecf8e";
  // Keep tagline short — wraps badly if too long
  const tagline = p.tagline.length > 80 ? p.tagline.slice(0, 77) + "…" : p.tagline;
  return `<!doctype html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #000;
    background-image: repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 2px,
      rgba(62, 207, 142, 0.04) 2px,
      rgba(62, 207, 142, 0.04) 4px
    );
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    position: relative;
    overflow: hidden;
    padding: 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  body::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.6));
    pointer-events: none;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 1;
  }
  .breadcrumb {
    color: rgba(255, 255, 255, 0.4);
    font-size: 16px;
    letter-spacing: 0.18em;
    text-transform: lowercase;
  }
  .breadcrumb .accent { color: ${accent}; }
  .accent-bar {
    width: 4px;
    height: 24px;
    background: ${accent};
    box-shadow: 0 0 16px ${accent}aa;
    margin-top: 6px;
  }
  .middle { z-index: 1; }
  .name {
    color: #fff;
    font-size: 96px;
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 0.95;
    margin-bottom: 24px;
  }
  .tagline {
    color: ${accent};
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.25;
    max-width: 1000px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 1;
  }
  .author {
    color: rgba(255, 255, 255, 0.55);
    font-size: 18px;
  }
  .author .name-small {
    color: #fff;
    font-weight: 700;
  }
  .domain {
    color: rgba(255, 255, 255, 0.3);
    font-size: 14px;
    letter-spacing: 0.1em;
    text-transform: lowercase;
  }
</style>
</head>
<body>
  <div class="top">
    <div class="breadcrumb">
      darshpoddar.com<span class="accent"> / projects / ${p.id}</span>
    </div>
    <div class="accent-bar"></div>
  </div>
  <div class="middle">
    <div class="name">${escapeHtml(p.name)}</div>
    <div class="tagline">${escapeHtml(tagline)}</div>
  </div>
  <div class="bottom">
    <div class="author">
      built by <span class="name-small">Darsh Poddar</span> &middot; ${p.year}
    </div>
    <div class="domain">&gt; darshpoddar.com</div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c] as string);
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    for (const project of flagshipProjects) {
      const page = await ctx.newPage();
      await page.setContent(htmlFor(project), { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      const out = resolve(OG_DIR, `${project.id}.png`);
      await page.screenshot({ path: out, type: "png" });
      console.log(`✓ ${project.id} → ${out}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
