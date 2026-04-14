/**
 * Manual overrides for GitHub repos.
 * Each entry matches a repo by name and provides metadata the
 * GitHub API can't: category, pitch copy, featured flag, etc.
 *
 * Repos NOT listed here (and not forks) still appear on the timeline
 * with category "tool" and their GitHub description as pitch.
 */

export type ProjectOverride = {
  repoName: string;
  pitch?: string;
  category:
    | "osint"
    | "tool"
    | "media"
    | "sales"
    | "infra"
    | "security"
    | "research"
    | "learning";
  featured?: boolean;
  year?: number;
  skip?: boolean;
  liveUrl?: string;
};

// ── SHOWCASE (featured: true) ───────────────────────────────────────────

const showcase: ProjectOverride[] = [
  {
    repoName: "tracelight",
    pitch:
      "Pick two world leaders. Watch AI trace the offshore money between them.",
    category: "osint",
    featured: true,
    year: 2026,
    liveUrl: "https://icij-offshore-leaks.vercel.app",
  },
  {
    repoName: "chainviz",
    pitch: "What happens when one npm package gets compromised?",
    category: "infra",
    featured: true,
    year: 2026,
    liveUrl: "https://supply-chain-frontend-nu.vercel.app",
  },
  {
    repoName: "ghostroom",
    pitch:
      "Multiplayer AI escape room. Teams prompt an AI ghost to solve puzzles on a live Linux desktop.",
    category: "tool",
    featured: true,
    year: 2026,
  },
  {
    repoName: "coldshot",
    pitch:
      "Terminal agentic CRM. AI discovers prospects, researches pain, writes the email.",
    category: "sales",
    featured: true,
    year: 2026,
  },
  {
    repoName: "Phantom",
    pitch:
      "Autonomous OSINT platform. One identity in, full digital footprint out.",
    category: "osint",
    featured: true,
    year: 2025,
  },
  {
    repoName: "FuckNetflix",
    pitch: "Open source Netflix for free. No subscriptions, no DRM.",
    category: "media",
    featured: true,
    year: 2025,
  },
  {
    repoName: "Detecting-Malicious-Commits",
    pitch:
      "ML pipeline to detect malicious code in open-source repos. Published at SecureComm 2024.",
    category: "research",
    featured: true,
    year: 2024,
  },
];

// ── INCLUDE (featured: false) ───────────────────────────────────────────

const include: ProjectOverride[] = [
  {
    repoName: "Courses-Visualization",
    pitch: "Interactive network graph of 500+ UIUC engineering courses.",
    category: "tool",
    liveUrl: "https://courses-visualization.vercel.app",
    year: 2025,
  },
  {
    repoName: "Transfer-Bench",
    pitch:
      "Framework for evaluating how jailbreak attacks transfer across languages.",
    category: "research",
    year: 2025,
  },
  {
    repoName: "jailbreak-dataset-analysis",
    pitch: "Unified jailbreak benchmark analysis across 945K records.",
    category: "research",
    year: 2025,
  },
  {
    repoName: "Canopy",
    pitch: "Browser viewer for Claude conversation trees.",
    category: "tool",
    liveUrl: "https://canopy-chat.vercel.app",
    year: 2025,
  },
  {
    repoName: "CalClaude",
    pitch:
      "macOS menubar app. Natural language to calendar events via Claude.",
    category: "tool",
    year: 2025,
  },
  {
    repoName: "UrbanPiper-Periscope",
    pitch: "Delivery platform downtime analysis.",
    category: "sales",
    year: 2025,
  },
  {
    repoName: "UrbanPiper-AI-Tagging",
    pitch: "AI-powered restaurant call transcript analysis.",
    category: "sales",
    year: 2025,
  },
  {
    repoName: "WhereToSellPOS",
    pitch: "Google Maps data pipeline for restaurant discovery.",
    category: "sales",
    year: 2025,
  },
  {
    repoName: "Academic-Decathlon-Focus-Quiz-Automation",
    pitch: "Automates importing quizzes into Canvas LMS.",
    category: "tool",
    year: 2024,
  },
  {
    repoName: "CCDC-Website-Integrity-Script-10-25-2025",
    pitch: "File integrity monitoring for web servers.",
    category: "security",
    year: 2025,
  },
  {
    repoName: "Personal-Blog",
    pitch: "Cybersecurity awareness blog. 12,000+ readers.",
    category: "security",
    liveUrl: "https://cyber-society.tech",
    year: 2023,
  },
  {
    repoName: "GradeHub-ClassDB",
    pitch: "Alternative grade viewer. Web scrapes the school portal.",
    category: "tool",
    liveUrl: "https://gradehubfisd.netlify.app",
    year: 2023,
  },
  {
    repoName: "Intellispend",
    pitch: "Budgeting app with real bank data via Plaid API.",
    category: "tool",
    liveUrl: "https://intellispend.vercel.app",
    year: 2023,
  },
  {
    repoName: "Community-Corner-Web",
    pitch: "Community news platform with Supabase.",
    category: "tool",
    liveUrl: "https://community-corner-web.vercel.app",
    year: 2023,
  },
  {
    repoName: "CyberPatriot-Scripts",
    pitch:
      "Competition cybersecurity hardening scripts for Ubuntu and Windows.",
    category: "security",
    year: 2023,
  },
  {
    repoName: "OurLuckyConnect",
    pitch:
      "Nonprofit: US students tutoring kids in India. 2,000+ books donated.",
    category: "tool",
    liveUrl: "https://our-lucky-connect.vercel.app",
    year: 2023,
  },
  {
    repoName: "GPT-Learning-Project",
    pitch:
      "First AI project. Exploring the OpenAI API when it first came out.",
    category: "learning",
    year: 2023,
  },
];

// ── MENTION (small cards) ───────────────────────────────────────────────

const mention: ProjectOverride[] = [
  {
    repoName: "Malicious-Commits",
    pitch: "Early malicious commit detection pipeline.",
    category: "research",
    year: 2024,
  },
  {
    repoName: "Blame-Data",
    pitch: "Git blame data extraction for LSTM training.",
    category: "research",
    year: 2024,
  },
  {
    repoName: "Cryptography",
    pitch: "CryptoHack + PicoCTF challenge solutions.",
    category: "security",
    year: 2024,
  },
  {
    repoName: "campuschai-landing-page",
    pitch: "Chai & matcha startup landing page.",
    category: "tool",
    liveUrl: "https://campuschai-landing-page.vercel.app",
    year: 2026,
  },
  {
    repoName: "respan-tools",
    pitch: "CLI tool for Respan LLM observability.",
    category: "tool",
    year: 2026,
  },
  {
    repoName: "uiuc-food-waste-awareness",
    pitch: "Food waste awareness site for UIUC.",
    category: "tool",
    liveUrl: "https://uiuc-food-waste-awareness.vercel.app",
    year: 2025,
  },
];

// ── SKIP ────────────────────────────────────────────────────────────────

const skip: ProjectOverride[] = [
  { repoName: "drPod", skip: true, category: "tool" },
  { repoName: "drPod.github.io", skip: true, category: "tool" },
  { repoName: "Java-Learning", skip: true, category: "tool" },
  { repoName: "thisisfunny", skip: true, category: "tool" },
  { repoName: "steg", skip: true, category: "tool" },
  { repoName: "Flowers-for-Vasu", skip: true, category: "tool" },
  { repoName: "Youtube-Transcript-Maker", skip: true, category: "tool" },
  { repoName: "stat107-project2", skip: true, category: "tool" },
  { repoName: "AP-Stat-Project", skip: true, category: "tool" },
  { repoName: "Aura-Health", skip: true, category: "tool" },
  { repoName: "Unbound-Basketball", skip: true, category: "tool" },
  { repoName: "vasu-hw", skip: true, category: "tool" },
  { repoName: "cinestream-desktop", skip: true, category: "tool" },
  { repoName: "study-buddy-hub", skip: true, category: "tool" },
  { repoName: "my-story-timeline", skip: true, category: "tool" },
  { repoName: "chatterbox-chronicle", skip: true, category: "tool" },
  { repoName: "research-navigator-ai", skip: true, category: "tool" },
  { repoName: "curryblends-elevated", skip: true, category: "tool" },
  { repoName: "cafe-website", skip: true, category: "tool" },
  { repoName: "phd-application-tracker", skip: true, category: "tool" },
  { repoName: "timeline-coder", skip: true, category: "tool" },
  { repoName: "Atlantis", skip: true, category: "tool" },
  { repoName: "Homebowls", skip: true, category: "tool" },
  { repoName: "Cutting-Edge-Website", skip: true, category: "tool" },
  { repoName: "Its-The-Little-Things", skip: true, category: "tool" },
];

// ── Combined lookup ─────────────────────────────────────────────────────

export const projectOverrides: ProjectOverride[] = [
  ...showcase,
  ...include,
  ...mention,
  ...skip,
];

/** Fast lookup by repo name */
export const overridesByName: Map<string, ProjectOverride> = new Map(
  projectOverrides.map((o) => [o.repoName, o]),
);
