/**
 * Prerender step — runs after `vite build`.
 *
 * Serves the freshly-built dist/ via vite preview, loads the homepage
 * with Playwright, scrolls it top-to-bottom so every Framer Motion
 * `whileInView` panel animates in, then captures the fully-rendered
 * DOM and writes it back over dist/index.html.
 *
 * Crawlers (Googlebot, Bing, social scrapers) now see the real content
 * on first fetch instead of an empty SPA shell. At load time the
 * client's `createRoot` still replaces the rendered HTML, so users
 * get the normal interactive app and the animations play.
 *
 * We strip <iframe> and <video> from the captured DOM before writing.
 * Crawlers don't need them, and leaving them in would cause the
 * browser to fetch each one twice on first visit (once from the
 * static HTML, once after React re-mounts).
 */

import { chromium } from "playwright";
import { preview } from "vite";
import { writeFileSync } from "fs";

async function main(): Promise<void> {
  console.log("[prerender] Starting vite preview on :4173...");
  const server = await preview({
    preview: { port: 4173, strictPort: true, host: "127.0.0.1" },
  });

  const url = "http://127.0.0.1:4173/";

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    // If Chromium isn't installed in this environment (e.g. a CI image
    // without `playwright install`), skip prerender rather than failing
    // the whole build. The un-prerendered SPA still ships — we just
    // lose the static-HTML SEO boost.
    console.warn("[prerender] Could not launch Chromium, skipping:", err instanceof Error ? err.message : err);
    server.httpServer.close();
    return;
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    console.log(`[prerender] Loading ${url}...`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for React to mount (HeroOverlay renders the PGP <pre> tag)
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.waitForTimeout(400);

    console.log("[prerender] Scrolling to trigger whileInView animations...");
    await page.evaluate(async () => {
      const maxScroll = document.documentElement.scrollHeight;
      let y = 0;
      const step = window.innerHeight * 0.6;
      while (y < maxScroll) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
        y += step;
      }
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(800);

    console.log("[prerender] Stripping iframes + videos from snapshot...");
    await page.evaluate(() => {
      document.querySelectorAll("iframe").forEach((el) => el.remove());
      document.querySelectorAll("video").forEach((el) => el.remove());
      document.querySelectorAll("canvas").forEach((el) => el.remove());
    });

    console.log("[prerender] Capturing DOM...");
    const html = await page.evaluate(
      () => "<!doctype html>\n" + document.documentElement.outerHTML,
    );

    writeFileSync("dist/index.html", html);
    console.log(`[prerender] Wrote dist/index.html (${html.length} bytes)`);
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

main().catch((err) => {
  console.error("[prerender] Failed:", err);
  process.exit(1);
});
