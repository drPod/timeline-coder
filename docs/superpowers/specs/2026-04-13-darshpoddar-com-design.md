# darshpoddar.com — Design Spec

## Overview

Personal website for Darsh Poddar. A full-viewport interactive binary canvas hero that transitions into a chronological timeline of every project shipped (40+ repos over 5 years), each previewable live on-site. The site should signal "cracked" through the hero interaction, visual polish, and sheer volume of shipped work — not through any single project.

**Target audience**: YC Startup School reviewers, other builders, recruiters, professors, anyone who Googles "Darsh Poddar."

**Domain**: darshpoddar.com

---

## 1. Hero Section

Full-viewport (100vh) interactive canvas on a black background.

### 1.1 Binary Field

- Canvas element covering the entire viewport, rendered at 60fps
- Grid of characters: ~60% are `0` and `1`, ~40% are mixed (hex `A-F`, brackets `{}[]`, slashes `/<>`, operators `#$%&=+`, tildes `~_|`)
- Default state: characters are extremely dim (brightness 0.03) — the field is alive but barely visible
- Font: JetBrains Mono, 14px, monospace

### 1.2 Mouse Interaction (Desktop)

- **Flashlight glow**: radial gradient disc follows the cursor. Outer glow (green, ~200px radius) + bright inner core (shifts toward white/cyan, ~70px radius)
- **Velocity-reactive radius**: slow movement = ~200px radius, fast sweeps expand to ~320px. Makes exploration feel dynamic.
- **Character cycling**: characters within 70px of cursor flip rapidly (~12% per frame). Characters in the outer zone flip at ~4%. Creates a "data processing" vortex.
- **Decaying trail**: recent cursor positions leave a fading glow path. Trail radius ~120px, fades over ~80 positions. Dragging "paints" the canvas.
- **Click ripple**: clicking sends a double-ring (inner + outer) expanding outward from click point. Strength 2.0, decays at 0.958/frame.
- **Visible rings**: faint concentric circles around cursor showing the inner hot zone and outer influence boundary. Targeting reticle feel.

### 1.3 Background Effects (Always Running)

These run independently of mouse input. The canvas is alive even when idle.

- **Matrix rain**: 3-8 active columns at any time cascading downward. Speed 0.4-0.9 rows/frame, length 10-32 rows. Head is bright (1.0) with a radial glow dot at the tip. Tail fades. ~20% of rain columns carry embedded keywords: TRACE, OSINT, QUERY, MODAL, AGENT, SHELL, SPAWN, CRAWL, PARSE, ASYNC, MUTEX, YIELD, GHOST, RECON. Spawn rate ~4%/frame.
- **Scan line**: a horizontal green band sweeps top-to-bottom every ~5 seconds. Consists of: a soft 80px gradient bloom + a bright 2px center line. Characters in the sweep path light up and scramble. Intensity 0.9 at center.
- **Ambient pulse rings**: 2-5 expanding circular ring outlines (like radar pings). Max radius 120-260px, brightness 0.6-1.0. Visible ring stroke drawn on canvas. Spawn rate ~1.4%/frame.
- **Rain head glow**: each rain column has a bright green radial glow (28px) at its leading edge.
- **Ambient flicker**: random characters across the grid occasionally flip and briefly brighten (~0.06%/frame).

### 1.4 Visual Overlays

- **CRT vignette**: fixed radial gradient darkening corners (transparent center → 50% black at edges)
- **Scanlines**: fixed repeating horizontal lines (2px transparent, 2px green at 2.5% opacity). Covers entire page.
- **Background gradient**: faint dark-green radial gradient behind the canvas center (rgba(20,65,42,0.15))

### 1.5 Hero Overlay Content

Centered on top of the canvas, `pointer-events: none`:

```
-----BEGIN PGP SIGNATURE-----
Darsh Poddar
Student at UIUC
Fingerprint: 4D41 5448 2B43 5340 5549 5543
-----END PGP SIGNATURE-----

47 repos  ·  5 years  ·  12 languages

                scroll
                  ↓
```

- Name: clamp(36px, 6vw, 64px), bold, white, green text-shadow
- PGP lines: 10px, green at 30% opacity
- Stats: pulled from GitHub API at build time. JetBrains Mono, green numbers.
- Scroll hint at bottom with bobbing arrow animation

### 1.6 Hidden Konami Code Text

At canvas initialization, compute grid positions that spell "KONAMI CODE" (or "↑↑↓↓←→←→BA") using a text mask approach:
- Render the text to an offscreen canvas in large monospace font
- Read pixel data to determine which grid cells fall within the text
- Those cells use the actual letter characters (K, O, N, A, M, I, etc.) instead of random 0s/1s
- At default brightness (0.03) they're nearly invisible — but someone staring long enough notices they aren't random
- When illuminated by cursor, the text becomes readable

---

## 2. Hero → Timeline Transition

- 120px gradient div: `linear-gradient(transparent → rgba(0,0,0,0.75) → rgba(0,0,0,0.92))`
- Canvas continues as `position: fixed` behind everything — never stops
- The timeline section's semi-transparent background lets the canvas effects bleed through gaps

---

## 3. Timeline Section

### 3.1 Container

- Max-width: 1200px, centered
- Padding: 0 48px
- Background: rgba(0,0,0,0.88) — semi-transparent, matrix bleeds through gaps between cards and around margins
- `backdrop-filter: blur(4px)` on cards for readability

### 3.2 Year Sections

Each year is a distinct visual block:

- **Year header**: 64px year number (white at 6% opacity — typographic weight), project count label (green, 12px), key tech stack subtitle (white at 15%, 10px). Full-width bottom border (green at 10% opacity).
- **Year divider**: 48px spacer between sections with a centered horizontal gradient line (green, fading at edges).
- Each year section contains: year header → featured card (optional) → card grid → "+ N more" hint (if not all shown)

### 3.3 Featured Cards

The top project per year section gets a featured treatment. Which project is featured is set via a `featured: true` flag in the manual config file — not auto-determined.

- Full-width (spans both grid columns)
- `grid-template-columns: 1fr 1fr` — thumbnail left, content right
- Min-height: 240px
- Larger title (22px bold), longer description (14px), more tech badges
- Category-colored 3px left accent bar with glow/box-shadow on the thumbnail side
- "Live" badge with pulsing green dot (if project has a web deploy)
- Hover: green border glow (0 0 32px rgba(62,207,142,0.12)) + 2px translateY lift

### 3.4 Regular Cards

All other projects per year:

- **Recent years (2025, 2026)**: 2-column grid, 16px gap
- **Older years (2024 and before)**: 3-column grid, 14px gap
- Each card: thumbnail area (100px tall) + content area (title, 1-2 sentence pitch, tech badges)
- Category-colored 3px left accent bar with glow. Categories (assigned via config): `osint` (purple #9b5bff), `tool` (blue #4b6bfc), `media` (red #ff5f57), `sales` (green #28c840), `infra` (amber #febc2e), `security` (red #ff5f57)
- "Live" badge where applicable
- Hover: green border glow (0 0 24px) + 1px lift
- Background: rgba(6,6,8,0.9-0.92), 1px border at rgba(255,255,255,0.05-0.06)

### 3.5 Card Thumbnails

For each project, the thumbnail area should show:

- **Projects with web deploys**: auto-generated screenshot (via Playwright at build time) or short video loop
- **CLI tools / libraries / desktop apps**: styled terminal output mockup, ASCII visualization, or category-themed gradient with project name
- **Fallback**: category-colored gradient background with project name text

Screenshots are generated at build time: run Playwright against each deploy URL, capture a 1280×720 screenshot, resize to thumbnail dimensions. Stored in the build output.

### 3.6 Project Data Source

- Primary: GitHub API at build time — repos, creation dates, languages, descriptions, topics, deploy URLs
- Manual overrides: a config file for pitch text, category assignment, featured status, custom thumbnail, display order within year
- Adding a new project: push the repo to GitHub, optionally add a config entry. Site rebuilds itself.

---

## 4. Live Preview

Clicking any card with a web deploy expands it into an inline live preview:

- **Preview panel**: expands below the clicked card, pushing content down
- **Browser chrome bar**: macOS dots (red/yellow/green) + deploy URL centered + close button
- **Iframe area**: loads the actual deployed version. ~440px tall on desktop, full-width.
- **Actions bar**: github link, open full screen link, tech stack
- **One at a time**: opening a new preview closes the previous one
- **Lazy loading**: iframe only loads when the preview opens. Unloads when closed.
- **Non-web projects**: show a video demo, terminal recording (asciinema), or animated screenshot instead of iframe.
- **Prefetch**: as user scrolls toward a live project, start preloading its iframe in the background.

---

## 5. Desktop Enhancements

### 5.1 Command Palette (⌘K)

- Hint in top-right corner: `⌘K commands` with styled kbd element
- Opens a fuzzy-search overlay (cmdk library or custom)
- Searchable: all project names, tech stack terms, year navigation, section jumping
- "Secret" commands as easter eggs (e.g., typing "crt" triggers CRT mode)

### 5.2 Status Bar

- Fixed to bottom of viewport, 26px tall
- Left: site name with green dot indicator
- Center: project count + year range (e.g., "47 repos · 2021–2026")
- Right: ⌘K hint + scroll indicator
- Background: rgba(0,0,0,0.8) + backdrop-filter blur
- Top border: green at 5% opacity

---

## 6. Easter Eggs

### 6.1 Konami Code → CRT Mode

- Input sequence: ↑↑↓↓←→←→BA (keyboard)
- Activation: toggles `.crt-mode` class on body
- Effect: all text forced to monospace, foreground color shifts to green (142 70% 75%), border colors shift to green, heavier scanlines overlay, green monochrome aesthetic everywhere
- Hidden "KONAMI CODE" text in the binary field serves as the hint

### 6.2 Name Glitch

- Click the name in the hero 5 times within 2 seconds
- Triggers 3-second glitch animation: hue-rotate, clip-path slicing, red/cyan text-shadow offset
- Existing implementation from the current codebase carries over

### 6.3 Command Palette Secrets

- Typing "crt" or "matrix" in ⌘K toggles CRT mode
- Typing "source" opens the GitHub repo
- Other discoverable commands TBD

---

## 7. Mobile Adaptation

### 7.1 Hero (Mobile)

- Canvas still runs but interaction changes
- **No cursor glow** — no hover on mobile
- **Auto-animate**: ambient effects (rain, pulses, scan) run at full strength. The field is alive on its own.
- **Tap → ripple**: tapping anywhere sends a ripple ring outward
- **Touch-drag → trail**: dragging a finger creates the glow trail (already wired up via touchmove events)
- Canvas resolution may be reduced for performance on low-end devices

### 7.2 Timeline (Mobile)

- All grids collapse to single column
- Featured cards: thumbnail stacks on top of content (vertical instead of side-by-side)
- Year headers remain big (maybe 48px instead of 64px)
- Card thumbnails become full-width
- Preview iframe: full-width, maybe shorter (320px)
- ⌘K replaced with a visible search icon or bottom sheet navigation
- Status bar: simplified or hidden

### 7.3 Breakpoints

- Desktop: >1024px — full 2/3-column grid, ⌘K, status bar, cursor interaction
- Tablet: 768–1024px — 2-column grid, reduced padding
- Mobile: <768px — single column, stacked cards, tap interaction, no status bar

---

## 8. Tech Stack

- **Framework**: React + Vite (existing codebase, evolve rather than rewrite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (existing)
- **Animation**: Framer Motion (existing) + Canvas API (hero)
- **UI**: shadcn/ui components where useful (existing)
- **Data**: GitHub API (build-time fetch), manual config overrides
- **Screenshots**: Playwright (build-time generation)
- **Package manager**: Bun
- **Deployment**: Vercel (likely)
- **Domain**: darshpoddar.com

---

## 9. Performance Budget

- **Initial load**: <2s on 4G. Hero canvas starts immediately, timeline lazy-loads below fold.
- **Canvas**: 60fps on modern devices. Reduced resolution / frame-skip on low-end.
- **Thumbnails**: pre-generated at build time, ~50-200KB each, served as optimized images.
- **Live iframes**: loaded on demand, one at a time. Unloaded when closed.
- **Total page weight**: <500KB excluding thumbnails. Thumbnails lazy-loaded.
- **Canvas pause**: when hero is scrolled out of viewport, reduce canvas to 15fps or pause entirely (IntersectionObserver).

---

## 10. Footer

- Minimal, full-width, below the last year section
- Social links: GitHub (github.com/drPod), LinkedIn (real profile URL), email (real address)
- Resume PDF link (optional — only if the user adds one to /public)
- "Built by Darsh Poddar" or similar — one line, monospace, dim
- No contact form — links are sufficient

---

## 11. What's NOT in Scope

- Blog / writing section
- Contact form (social links in footer are sufficient)
- Analytics dashboard
- CMS / admin panel
- Multi-page routing (single page with scroll sections)
- Server-side rendering (static build via Vite is fine)
- AI agent chat interface (decided against during brainstorming)
- Force-graph visualization (decided against — one-time thing)
