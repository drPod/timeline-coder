/**
 * Generates public/og-image.png — the 1200×630 social preview image for
 * sharing darshpoddar.com on Twitter / LinkedIn / iMessage / etc.
 *
 * Strategy: launch a headless Chromium page at exactly 1200×630, set an
 * inline HTML document styled to match the site's green-on-black terminal
 * aesthetic, wait for JetBrains Mono to load, then screenshot the viewport.
 *
 * Usage:
 *   bun run scripts/generate-og-image.ts
 */

import { resolve } from "node:path";
import { chromium } from "playwright";

const ROOT = resolve(import.meta.dir, "..");
const OUTPUT_PATH = resolve(ROOT, "public/og-image.png");

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; }
  body {
    margin: 0;
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
  }
  body::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.55));
    pointer-events: none;
  }
  .label {
    position: absolute;
    top: 50px;
    left: 60px;
    color: #ffb84d;
    font-size: 14px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }
  .name {
    position: absolute;
    top: 50%;
    left: 60px;
    transform: translateY(-70%);
    color: #fff;
    font-size: 88px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .sub {
    position: absolute;
    top: 50%;
    left: 60px;
    transform: translateY(90%);
    color: rgba(62, 207, 142, 0.75);
    font-size: 24px;
    letter-spacing: -0.01em;
  }
  .stats {
    position: absolute;
    bottom: 50px;
    left: 60px;
    color: rgba(255, 255, 255, 0.35);
    font-size: 14px;
    letter-spacing: 0.05em;
  }
  .matrix-col {
    position: absolute;
    right: 60px;
    top: 0;
    bottom: 0;
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    color: rgba(62, 207, 142, 0.4);
    font-size: 14px;
    text-align: right;
  }
  .matrix-col div:nth-child(odd) {
    color: rgba(62, 207, 142, 0.55);
  }
</style>
</head>
<body>
  <div class="label">&gt; DARSHPODDAR.COM</div>
  <div class="name">Darsh Poddar</div>
  <div class="sub">Builder. AI systems, OSINT, agentic tools.</div>
  <div class="stats">40+ projects &middot; 5 years &middot; 12 languages &middot; UIUC</div>
  <div class="matrix-col">
    <div>01</div><div>1A</div><div>0F</div><div>3B</div><div>TRACE</div>
    <div>C4</div><div>00</div><div>OSINT</div><div>11</div><div>AGENT</div>
    <div>29</div><div>7D</div><div>10</div><div>PARSE</div><div>00</div>
  </div>
</body>
</html>`;

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    // Give the Google Fonts stylesheet + font files a beat to finish rendering.
    await page.waitForTimeout(1500);
    await page.screenshot({ path: OUTPUT_PATH, type: "png" });
    console.log(`\u2713 OG image generated -> ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
