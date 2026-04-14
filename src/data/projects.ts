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
    liveUrl: "https://icij-offshore-leaks.vercel.app",
  },
  {
    repoName: "chainviz",
    pitch: "What happens when one npm package gets compromised?",
    category: "infra",
    featured: true,
    liveUrl: "https://supply-chain-frontend-nu.vercel.app",
  },
  {
    repoName: "ghostroom",
    pitch:
      "Live AI escape room. 20 teams, 20 Linux desktops, one local Qwen ghost — best prompt wins.",
    category: "tool",
    featured: true,
  },
  {
    repoName: "coldshot",
    pitch:
      "Terminal agentic CRM. AI discovers prospects, researches pain, writes the email.",
    category: "sales",
    featured: true,
  },
  {
    repoName: "Phantom",
    pitch:
      "Autonomous OSINT platform. One identity in, full digital footprint out.",
    category: "osint",
    featured: true,
  },
  {
    repoName: "FuckNetflix",
    pitch: "Open source Netflix for free. No subscriptions, no DRM.",
    category: "media",
    featured: true,
  },
  {
    repoName: "Detecting-Malicious-Commits",
    pitch:
      "Catch malicious commits before they ship. Ensemble of GNN, LSTM, and transformer. Published at SecureComm 2024.",
    category: "research",
    featured: true,
    year: 2024,
  },
];

// ── INCLUDE (featured: false) ───────────────────────────────────────────

const include: ProjectOverride[] = [
  {
    repoName: "Courses-Visualization",
    pitch:
      "Every UIUC engineering prereq as one interactive graph. 500+ courses, 13 majors, the hub classes exposed.",
    category: "tool",
    liveUrl: "https://courses-visualization.vercel.app",
  },
  {
    repoName: "Transfer-Bench",
    pitch:
      "Does a jailbreak in English still work in Spanish? In Chinese? Benchmark says yes.",
    category: "research",
  },
  {
    repoName: "jailbreak-dataset-analysis",
    pitch:
      "Unified 945K jailbreak attempts across HackAPrompt, JailbreakBench, WildJailbreak, and XSTest into one dataset.",
    category: "research",
  },
  {
    repoName: "Canopy",
    pitch:
      "Claude conversations are trees, not threads. See every branch, every edit, every alternate response.",
    category: "tool",
    liveUrl: "https://canopy-chat.vercel.app",
  },
  {
    repoName: "CalClaude",
    pitch:
      "Cmd+Opt+P from anywhere. Describe the event in English, screenshot optional. Claude files it on your calendar.",
    category: "tool",
  },
  {
    repoName: "UrbanPiper-Periscope",
    pitch:
      "Restaurant went dark on DoorDash at 7pm. This figures out how much revenue that cost — during business hours only.",
    category: "sales",
  },
  {
    repoName: "UrbanPiper-AI-Tagging",
    pitch:
      "Every restaurant phone call tagged by AI. Owners see which calls went wrong without listening to any of them.",
    category: "sales",
  },
  {
    repoName: "UrbanPiper-AI-Checking",
    pitch:
      "Did the voice AI agent actually take the order right? Pulls every Atlas order and checks against the call.",
    category: "sales",
  },
  {
    repoName: "WhereToSellPOS",
    pitch:
      "Crawled every restaurant within 30km of Dallas via Google Maps. Every review, every rating, ready to mine.",
    category: "sales",
  },
  {
    repoName: "Academic-Decathlon-Focus-Quiz-Automation",
    pitch:
      "Teachers used to copy DemiDec quizzes into Canvas question by question. Drop a PDF, get a quiz.",
    category: "tool",
  },
  {
    repoName: "CCDC-Website-Integrity-Script-10-25-2025",
    pitch:
      "SHA-256 every file on the web server. Immutable bit, syslog alerts, catches defacement in under 5 minutes.",
    category: "security",
  },
  {
    repoName: "Personal-Blog",
    pitch:
      "Wrote about phishing, password managers, and ransomware for high schoolers. 12,000+ readers.",
    category: "security",
    liveUrl: "https://cybersociety.vercel.app/",
  },
  {
    repoName: "GradeHub-ClassDB",
    pitch:
      "Home Access Center is ugly. Scrape it, compute real GPAs with subject weightage, make it look good.",
    category: "tool",
    liveUrl: "https://gradehubfisd.netlify.app",
  },
  {
    repoName: "Intellispend",
    pitch:
      "Plaid into your actual bank. Every transaction categorized, budget caps, one clean dashboard.",
    category: "tool",
    liveUrl: "https://intellispend.vercel.app",
  },
  {
    repoName: "Community-Corner-Web",
    pitch:
      "Rebuilt a Wix news site as a real React app. Supabase backend, Vercel deploy, zero page builders.",
    category: "tool",
    liveUrl: "https://community-corner-web.vercel.app",
  },
  {
    repoName: "CyberPatriot-Scripts",
    pitch:
      "Six-hour Air Force cyber defense competition. One script hardens Ubuntu, one hardens Windows, fast.",
    category: "security",
  },
  {
    repoName: "OurLuckyConnect",
    pitch:
      "US high schoolers teach English to underprivileged kids in India. 2,000+ books donated, nonprofit I co-founded.",
    category: "tool",
    liveUrl: "https://our-lucky-connect.vercel.app",
  },
  {
    repoName: "GPT-Learning-Project",
    pitch:
      "First time I touched the OpenAI API. Looped through every engine they had, called Babbage and Davinci.",
    category: "learning",
  },
];

// ── MENTION (small cards) ───────────────────────────────────────────────

const mention: ProjectOverride[] = [
  {
    repoName: "Malicious-Commits",
    pitch: "First take at the SecureComm pipeline. Where it started.",
    category: "research",
  },
  {
    repoName: "Blame-Data",
    pitch:
      "Mined git blame from thousands of vulnerable commits to feed the LSTM.",
    category: "research",
  },
  {
    repoName: "Cryptography",
    pitch:
      "Every CryptoHack and PicoCTF crypto challenge I've solved, worked out in Python.",
    category: "security",
  },
  {
    repoName: "stormchain",
    pitch:
      "DFW pilot sequences ranked by weather-cascade risk. XGBoost on 842K flights, 78% more delay minutes caught than baseline.",
    category: "research",
    featured: true,
    liveUrl: "https://stormchain.streamlit.app/",
  },
  {
    repoName: "campuschai-landing-page",
    pitch: "Landing page for a chai and matcha startup aimed at college campuses.",
    category: "tool",
    liveUrl: "https://campuschai-landing-page.vercel.app",
  },
  {
    repoName: "respan-tools",
    pitch:
      "`respan logs list`, `respan traces get`, `respan evaluators run`. Respan observability without leaving the terminal.",
    category: "tool",
  },
  {
    repoName: "uiuc-food-waste-awareness",
    pitch:
      "Vanilla HTML, CSS, JS. One page telling UIUC students to stop dumping food trays.",
    category: "tool",
    liveUrl: "https://uiuc-food-waste-awareness.vercel.app",
  },
  {
    repoName: "Community-Corner-App",
    pitch:
      "React Native companion to the Community Corner newsroom. Same content, on your phone.",
    category: "tool",
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
