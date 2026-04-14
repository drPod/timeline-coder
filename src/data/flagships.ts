/**
 * Flagship projects — the 7 that get cinematic full-bleed treatment at the
 * top of the timeline. Each entry powers one <FlagshipSection> panel with
 * an embedded live demo (iframe, video, or custom React component).
 *
 * The `id` MUST match the repo name in `projects.ts`/`githubCache.json` so
 * the Index page can filter these out of MonthSection (avoid double-render).
 */

export type FlagshipProject = {
  id: string;
  name: string;
  tagline: string;
  story: string;
  architecture: string[];
  stats: { label: string; value: string }[];
  demoKind:
    | "iframe"
    | "video"
    | "ghostroom"
    | "coldshot"
    | "stormchain"
    | "fucknetflix";
  iframeUrl?: string;
  videoSrc?: string;
  videoPoster?: string;
  repoUrl: string;
  liveUrl?: string;
  paperUrl?: string;
  year: number;
};

export const flagshipProjects: FlagshipProject[] = [
  {
    id: "ghostroom",
    name: "ghostroom",
    tagline: "An AI ghost runs your Linux desktop.",
    story:
      "Live multiplayer escape room for prompt engineers. Twenty teams get twenty real Linux desktops, each haunted by a local Qwen 2.5 operating the mouse, the keyboard, and the filesystem. The gameplay is whatever you can convince the ghost to do.",
    architecture: [
      "20 Modal containers, one L4 GPU each, XFCE desktop streamed over noVNC",
      "Qwen 2.5 7B via Ollama — fully local, no API keys, no rate limits",
      "3-phase filesystem puzzle with persistent unlock state across attempts",
      "Live Rich scoreboard backed by modal.Dict — every keystroke broadcast",
      "Teams write a SKILL.md prompt; the ghost reads it and acts autonomously",
    ],
    stats: [
      { label: "containers", value: "20" },
      { label: "gpu / team", value: "L4" },
      { label: "model", value: "Qwen 2.5 7B" },
      { label: "puzzle phases", value: "3" },
    ],
    demoKind: "ghostroom",
    repoUrl: "https://github.com/drPod/ghostroom",
    year: 2026,
  },
  {
    id: "tracelight",
    name: "tracelight",
    tagline: "The Panama Papers, made walkable.",
    story:
      "Pick any two world leaders. A Jac PathFinder walker traverses the 2M-node ICIJ offshore graph between them, and `by llm()` writes a plain-English narrative of every shell company and nominee director along the way. Deployed.",
    architecture: [
      "ICIJ Offshore Leaks graph — 2M nodes, 3.2M edges, Neo4j-backed",
      "Jac walker traversal with `by llm()` abilities for narrative summaries",
      "3D force-directed graph rendered with react-force-graph + three.js",
      "Path-scoring by shortest-hop + jurisdiction-risk heuristics",
      "Streaming LLM responses as the walker discovers each new connection",
    ],
    stats: [
      { label: "graph nodes", value: "2M" },
      { label: "edges", value: "3.2M" },
      { label: "walker engine", value: "Jac" },
      { label: "render", value: "3D force" },
    ],
    demoKind: "iframe",
    iframeUrl: "https://icij-offshore-leaks.vercel.app",
    videoSrc: "/thumbnails/videos/tracelight.mp4",
    videoPoster: "/thumbnails/videos/tracelight-poster.jpg",
    repoUrl: "https://github.com/drPod/tracelight",
    liveUrl: "https://icij-offshore-leaks.vercel.app",
    year: 2026,
  },
  {
    id: "chainviz",
    name: "chainviz",
    tagline: "Five AI agents investigating one compromised package.",
    story:
      "What happens when a popular npm package turns malicious? chainviz runs five coordinated Jac agents across 1,087 packages and 217K OSV vulnerabilities, then replays the real attacks — event-stream, ua-parser-js, colors.js, node-ipc — so you can watch the blast radius propagate.",
    architecture: [
      "5 Jac agents: discoverer, risk-scorer, path-finder, attack-replayer, narrator",
      "1,087 packages × 217K OSV vulnerabilities indexed into a typed graph",
      "Curated historical replays — 4 real npm supply-chain attacks",
      "D3 force graph + timeline scrubber; agents broadcast via WebSocket",
      "Jac `by llm()` narration for every hop of the propagation",
    ],
    stats: [
      { label: "packages", value: "1,087" },
      { label: "osv vulns", value: "217K" },
      { label: "agents", value: "5" },
      { label: "historical attacks", value: "4" },
    ],
    demoKind: "iframe",
    iframeUrl: "https://supply-chain-frontend-nu.vercel.app",
    videoSrc: "/thumbnails/videos/chainviz.mp4",
    videoPoster: "/thumbnails/videos/chainviz-poster.jpg",
    repoUrl: "https://github.com/drPod/chainviz",
    liveUrl: "https://supply-chain-frontend-nu.vercel.app",
    year: 2026,
  },
  {
    id: "Phantom",
    name: "Phantom",
    tagline: "One identity in, the full digital footprint out.",
    story:
      "Autonomous OSINT platform. Feed it a username, email, phone, domain, or wallet and a Claude-powered planner-analyst loop dispatches parallel resolvers across 600+ sources — breach databases, social platforms, crypto explorers — then stitches the findings into a live graph. Built at HackIllinois 2026; led directly to the Respan co-op.",
    architecture: [
      "Planner-Analyst loop — Claude picks which resolvers to fire, never blocks on a slow one",
      "600+ parallel resolvers across breach DBs, social platforms, email enrichment, domain intel, crypto explorers",
      "20+ external APIs fused into a single entity graph",
      "GPU entity extraction with Qwen2.5-1.5B on an A10G",
      "Wave-pipelining — finished resolvers get harvested while new ones keep launching",
      "Live D3 force graph streamed over Server-Sent Events, hosted on Modal for serverless CPU + GPU",
    ],
    stats: [
      { label: "resolver sites", value: "600+" },
      { label: "external apis", value: "20+" },
      { label: "gpu model", value: "Qwen2.5-1.5B" },
      { label: "streaming", value: "SSE · D3" },
    ],
    demoKind: "video",
    videoSrc: "/thumbnails/videos/Phantom.mp4",
    videoPoster: "/thumbnails/videos/Phantom-poster.jpg",
    repoUrl: "https://github.com/drPod/Phantom",
    year: 2026,
  },
  {
    id: "FuckNetflix",
    name: "FuckNetflix",
    tagline: "Paste a magnet. Press play.",
    story:
      "Electron desktop app for streaming and downloading torrents. Built because streaming is fragmented, overpriced, and DRM-encumbered — this one has no subscriptions, no API keys, and no central server. An optional on-device SmolLM2 picks the best torrent for your display and preferences.",
    architecture: [
      "Electron + React desktop app — DMG, NSIS, and AppImage builds for macOS, Windows, Linux",
      "WebTorrent for peer-to-peer streaming, no central server in the loop",
      "Bundled mpv for hardware-accelerated playback with subtitle attach, rename, and queue control",
      "Optional local SmolLM2 360M Q8 ranks torrents by quality, seeders, and display — runs offline",
      "Full queue management: pause, resume, prioritize, subtitle attach, rename on the fly",
    ],
    stats: [
      { label: "api keys", value: "0" },
      { label: "subscriptions", value: "0" },
      { label: "platforms", value: "3" },
      { label: "llm", value: "SmolLM2 on-device" },
    ],
    demoKind: "fucknetflix",
    repoUrl: "https://github.com/drPod/FuckNetflix",
    year: 2026,
  },
  {
    id: "coldshot",
    name: "coldshot",
    tagline: "16 LLM calls per email.",
    story:
      "Agentic CRM for people who don't want to blast. coldshot discovers the company, verifies they actually build on LLMs, walks the org chart to find the right decision-maker, deep-researches their pain, drafts three email variants in parallel, and opens $EDITOR so you get the last word.",
    architecture: [
      "Pipeline: discover (Sumble) → qualify (Sonnet + web) → contact → research (Opus) → 3 drafts → review",
      "Org-chart walk evaluates each rung in parallel — CXO → VP → Director → Manager",
      "Phase 2 runs 3 complete email drafts concurrently; Opus picks the winner",
      "SQLite records every prompt, every reply, every verdict — future fine-tuning corpus",
      "Few-shot from your own sent mail; by email 6 the voice clones itself",
    ],
    stats: [
      { label: "llm calls / email", value: "16" },
      { label: "parallel drafts", value: "3" },
      { label: "parallel companies", value: "8" },
      { label: "pipeline stages", value: "7" },
    ],
    demoKind: "coldshot",
    repoUrl: "https://github.com/drPod/coldshot",
    year: 2026,
  },
  {
    id: "stormchain",
    name: "stormchain",
    tagline: "Which DFW pilot pairs will weather break first?",
    story:
      "Submission for the EPPS-American Airlines data challenge. XGBoost on 117 features and 1.5M training samples predicting which pilot flight sequences through DFW are about to cascade. +78% more delay minutes caught than baseline, $34.5M of upper-bound savings annually.",
    architecture: [
      "842K flights (2019-2024) + 3.5M hourly weather obs + 3.3M METAR observations",
      "XGBoost on 117 engineered features, 1.5M training rows, AUC-ROC 0.81",
      "Cascade-propagation simulator validates the avoid list against held-out 2024",
      "12 iterations of self-critique — caught a 240× inflation bug mid-project",
      "Streamlit dashboard with avoid recommendations + swap alternatives per pair",
    ],
    stats: [
      { label: "auc-roc", value: "0.81" },
      { label: "vs baseline", value: "+78%" },
      { label: "savings upper-bound", value: "$34.5M" },
      { label: "avoid recs", value: "1,220" },
    ],
    demoKind: "stormchain",
    repoUrl: "https://github.com/drPod/stormchain",
    liveUrl: "https://stormchain.streamlit.app/",
    year: 2026,
  },
];

export const flagshipIds: Set<string> = new Set(
  flagshipProjects.map((f) => f.id),
);
