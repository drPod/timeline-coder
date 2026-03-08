export type Category = "research" | "hackathon" | "leadership" | "security" | "project" | "certification" | "milestone";

export type TimelineEntry = {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  techStack: string[];
  type: "featured" | "compact";
  category: Category;
  screenshot?: string;
  liveUrl?: string;
  repoUrl?: string;
  branch?: boolean;
};

export const CATEGORY_COLORS: Record<Category, string> = {
  research: "270 70% 60%",     // purple
  hackathon: "35 90% 55%",     // orange
  leadership: "142 70% 45%",   // green — main trunk
  security: "0 70% 55%",       // red
  project: "200 70% 50%",      // blue
  certification: "50 80% 50%", // gold
  milestone: "142 70% 45%",    // green
};

export const CATEGORY_LABELS: Record<Category, string> = {
  research: "research",
  hackathon: "hackathon",
  leadership: "leadership",
  security: "security",
  project: "project",
  certification: "cert",
  milestone: "milestone",
};

export const timelineData: TimelineEntry[] = [
  // — 2021 —
  {
    id: "cyber-club",
    year: 2021,
    title: "Started a cybersecurity club",
    description: "Founded it, grew it to 90+ members. CTFs, workshops, hands-on hacking. It got out of hand (in the best way).",
    techStack: ["CTFs", "Security"],
    type: "compact",
    category: "leadership",
  },
  {
    id: "cyberpatriot-scripts",
    year: 2021,
    title: "CyberPatriot hardening scripts",
    description: "Automated the boring parts of competition environments so we could focus on the fun parts.",
    techStack: ["Bash", "PowerShell"],
    type: "compact",
    category: "security",
    branch: true,
  },
  {
    id: "safety-hero",
    year: 2021,
    title: "SafetyHero",
    description: "Digital safety education for elementary students. My first real 'build something that matters' project.",
    techStack: ["Web Dev"],
    type: "compact",
    category: "project",
  },
  {
    id: "java-learning",
    year: 2021,
    title: "Java deep dive",
    description: "Foundational projects and exercises. Unglamorous but necessary.",
    techStack: ["Java"],
    type: "compact",
    category: "milestone",
    branch: true,
  },

  // — 2022 —
  {
    id: "gpt-experiments",
    year: 2022,
    title: "GPT experiments",
    description: "Early API tinkering back when most people hadn't heard of GPT. Exploring what language models could actually do.",
    techStack: ["Python", "OpenAI API"],
    type: "compact",
    category: "project",
  },
  {
    id: "ourluckyconnect",
    year: 2022,
    title: "OurLuckyConnect",
    description: "Language exchange platform connecting learners across cultures. First time thinking about real users.",
    techStack: ["Web Dev"],
    type: "compact",
    category: "project",
    branch: true,
  },
  {
    id: "bpa-officer",
    year: 2022,
    title: "BPA Chapter Officer",
    description: "Rose through leadership ranks. Setting the stage for what came next.",
    techStack: ["Leadership"],
    type: "compact",
    category: "leadership",
  },

  // — 2023 —
  {
    id: "bpa-president",
    year: 2023,
    title: "BPA President — Best TX Chapter",
    description: "Expanded chapter to 350 members. Named Best Chapter in Texas out of 510. Turns out scaling orgs is a lot like scaling systems.",
    techStack: ["Leadership"],
    type: "compact",
    category: "leadership",
  },
  {
    id: "cyberpatriot-gold",
    year: 2023,
    title: "CyberPatriot Gold — 3rd in Texas",
    description: "Also placed top 3% in PicoCTF. The competition arc peaked here.",
    techStack: ["Security", "CTFs"],
    type: "compact",
    category: "security",
  },
  {
    id: "academic-decathlon",
    year: 2023,
    title: "Academic Decathlon — #1 Varsity",
    description: "First in school history to compete at nationals. Turns out I'm annoyingly competitive.",
    techStack: ["Academics"],
    type: "compact",
    category: "milestone",
    branch: true,
  },
  {
    id: "intellispend",
    year: 2023,
    title: "Intellispend",
    description: "Full-stack budgeting app with Plaid API integration pulling real bank data. First time connecting to a serious third-party API.",
    techStack: ["React", "Node.js", "Plaid API"],
    type: "featured",
    category: "project",
    repoUrl: "#",
  },
  {
    id: "ccna",
    year: 2023,
    title: "CCNA Certification",
    description: "Cisco Certified Network Associate. Networking fundamentals locked in.",
    techStack: ["Networking", "Cisco"],
    type: "compact",
    category: "certification",
    branch: true,
  },
  {
    id: "community-corner",
    year: 2023,
    title: "Community-Corner-Web",
    description: "Community-focused platform connecting local resources. Small project, good intentions.",
    techStack: ["Web Dev"],
    type: "compact",
    category: "project",
  },

  // — 2024 —
  {
    id: "utd-research",
    year: 2024,
    title: "UT Dallas Intelligent Security Lab",
    description: "High School Intern Lead. Ran experiments, managed data pipelines, coordinated with PhD researchers. Got to break things professionally.",
    techStack: ["Python", "ML", "Security"],
    type: "featured",
    category: "research",
  },
  {
    id: "lstm-vuln",
    year: 2024,
    month: 6,
    title: "LSTM vulnerability detection",
    description: "Built deep learning models to detect malicious commits in open-source code — inspired by the xz Utils backdoor. This one kept me up at night (in a good way).",
    techStack: ["Python", "LSTM", "TensorFlow"],
    type: "compact",
    category: "research",
  },
  {
    id: "research-repos",
    year: 2024,
    month: 7,
    title: "Malicious commit research pipeline",
    description: "Multiple repos powering the vulnerability detection system. Blame-Data, Detecting-Malicious-Commits — the unglamorous backbone.",
    techStack: ["Python", "Data"],
    type: "compact",
    category: "research",
    branch: true,
  },
  {
    id: "publications",
    year: 2024,
    month: 8,
    title: "SecureComm 2024 & ACSAC 2024",
    description: "Co-authored papers accepted at two top security conferences. As a high schooler. Still surreal.",
    techStack: ["Research", "LaTeX"],
    type: "featured",
    category: "research",
  },
  {
    id: "uiuc-start",
    year: 2024,
    month: 8,
    title: "Started at UIUC",
    description: "Math + CS. Joined ACM Corporate Committee, SigEp, SigPWNY. Found my people.",
    techStack: ["Math", "CS"],
    type: "compact",
    category: "milestone",
  },

  // — 2025 —
  {
    id: "urbanpiper",
    year: 2025,
    title: "UrbanPiper — AI Sales Agent → Product Dev",
    description: "Started building AI sales automation, got pulled into product development. Shipped internal tools, AI verification systems, and a Google Maps market research tool.",
    techStack: ["Python", "AI/ML", "Google Maps API"],
    type: "featured",
    category: "project",
  },
  {
    id: "urbanpiper-tools",
    year: 2025,
    month: 6,
    title: "UrbanPiper tooling blitz",
    description: "Periscope (data viz), AI-Checking, AI-Tagging, WhereToSellPOS, voice AI beta, revenue forecasting. Shipped fast, learned faster.",
    techStack: ["Python", "NLP", "Data Viz"],
    type: "compact",
    category: "project",
    branch: true,
  },
  {
    id: "fucknetflix",
    year: 2025,
    month: 9,
    title: "FuckNetflix",
    description: "Keywords AI hackathon. Electron + WebTorrent + on-device LLM. The name got attention, the tech got us a co-op offer.",
    techStack: ["Electron", "WebTorrent", "LLM", "Hackathon"],
    type: "featured",
    category: "hackathon",
    repoUrl: "#",
    screenshot: "",
  },
  {
    id: "phantom",
    year: 2025,
    month: 10,
    title: "Phantom",
    description: "HackIllinois. Autonomous OSINT platform on Modal — Claude-powered planner, GPU inference, D3 graph frontend. Built to find what people try to hide.",
    techStack: ["Modal", "Claude", "OSINT", "D3.js", "GPU"],
    type: "featured",
    category: "hackathon",
    repoUrl: "#",
    screenshot: "",
  },
  {
    id: "mcp-contrib",
    year: 2025,
    month: 11,
    title: "MCP open-source contributions",
    description: "mcp-google-sheets, mcp-ical, drawio-mcp-extension. Building tools for the MCP ecosystem because the best way to understand a platform is to extend it.",
    techStack: ["MCP", "TypeScript", "Open Source"],
    type: "compact",
    category: "project",
    branch: true,
  },
  {
    id: "learnx",
    year: 2025,
    title: "LearnX",
    description: "Cybersecurity learning management system. Teaching what I know.",
    techStack: ["Web Dev", "Security"],
    type: "compact",
    category: "security",
  },
  {
    id: "jailbreak-analysis",
    year: 2025,
    title: "Jailbreak dataset analysis",
    description: "945K records of LLM jailbreak patterns. Poking at the edges of what these models will do.",
    techStack: ["Python", "Data Analysis"],
    type: "compact",
    category: "research",
    branch: true,
  },
  {
    id: "ccdc-script",
    year: 2025,
    title: "CCDC integrity monitoring",
    description: "Web server integrity script for CCDC competition. Trust but verify.",
    techStack: ["Bash", "Security"],
    type: "compact",
    category: "security",
  },
  {
    id: "acdec-quiz",
    year: 2025,
    title: "AcDec quiz automation",
    description: "Automated quiz generation and grading. Because manually grading 200 quizzes is not a good use of anyone's time.",
    techStack: ["Python", "Automation"],
    type: "compact",
    category: "project",
    branch: true,
  },

  // — 2026 —
  {
    id: "keywords-coop",
    year: 2026,
    title: "Keywords AI Co-op",
    description: "Starting June 2026. Building the future of AI tooling. The hackathon project turned into a job offer — still processing that.",
    techStack: ["AI Tooling", "Co-op"],
    type: "featured",
    category: "milestone",
    liveUrl: "#",
  },
  {
    id: "this-portfolio",
    year: 2026,
    title: "This portfolio",
    description: "The commit graph you're scrolling through right now.",
    techStack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    type: "compact",
    category: "project",
  },
];

export const years = [...new Set(timelineData.map((e) => e.year))].sort();
