export type TimelineEntry = {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  techStack: string[];
  type: "featured" | "compact";
  screenshot?: string;
  liveUrl?: string;
  repoUrl?: string;
  branch?: boolean; // visually forks off the main line
};

export const timelineData: TimelineEntry[] = [
  // — 2018 — sparse era
  {
    id: "first-code",
    year: 2018,
    title: "First lines of Python",
    description: "Wrote my first script — a number guessing game. Got hooked immediately.",
    techStack: ["Python"],
    type: "compact",
  },

  // — 2019 —
  {
    id: "web-intro",
    year: 2019,
    title: "Discovered web dev",
    description: "Built a personal homepage with raw HTML/CSS. No frameworks, just vibes.",
    techStack: ["HTML", "CSS"],
    type: "compact",
  },
  {
    id: "js-basics",
    year: 2019,
    month: 8,
    title: "JavaScript deep dive",
    description: "Learned JS fundamentals, DOM manipulation, and async patterns.",
    techStack: ["JavaScript"],
    type: "compact",
  },

  // — 2020 —
  {
    id: "react-start",
    year: 2020,
    title: "Picked up React",
    description: "Built a COVID dashboard as my first React app. Learned state management the hard way.",
    techStack: ["React", "JavaScript", "Chart.js"],
    type: "compact",
  },
  {
    id: "discord-bot",
    year: 2020,
    month: 6,
    title: "Discord bot for friends",
    description: "Built a moderation + music bot that ran 24/7 on a Raspberry Pi.",
    techStack: ["Node.js", "Discord.js"],
    type: "compact",
    branch: true,
  },
  {
    id: "competitive-prog",
    year: 2020,
    month: 9,
    title: "Started competitive programming",
    description: "Began solving USACO and Codeforces problems. Hit 1400 rating.",
    techStack: ["C++", "Algorithms"],
    type: "compact",
  },

  // — 2021 —
  {
    id: "fullstack-app",
    year: 2021,
    title: "First full-stack app",
    description: "A task manager with auth, real-time sync, and a polished UI. My first taste of shipping something complete.",
    techStack: ["React", "Node.js", "PostgreSQL", "Socket.io"],
    type: "featured",
    repoUrl: "https://github.com",
  },
  {
    id: "ml-exploration",
    year: 2021,
    month: 5,
    title: "ML exploration",
    description: "Trained CNNs for image classification. Built a digit recognizer web app.",
    techStack: ["Python", "TensorFlow", "Flask"],
    type: "compact",
    branch: true,
  },
  {
    id: "hackathon-1",
    year: 2021,
    month: 10,
    title: "First hackathon win",
    description: "Built a campus navigation app in 36 hours. Won Best Technical Implementation.",
    techStack: ["React Native", "Firebase", "Google Maps API"],
    type: "compact",
  },

  // — 2022 —
  {
    id: "internship-1",
    year: 2022,
    title: "First internship",
    description: "Worked on internal tools at a fintech startup. Shipped features to 10k+ users.",
    techStack: ["TypeScript", "React", "GraphQL"],
    type: "compact",
  },
  {
    id: "open-source",
    year: 2022,
    month: 3,
    title: "Open source contributions",
    description: "Started contributing to popular React libraries. Landed PRs in two major repos.",
    techStack: ["TypeScript", "React"],
    type: "compact",
    branch: true,
  },
  {
    id: "saas-project",
    year: 2022,
    month: 7,
    title: "Launched a micro-SaaS",
    description: "Built and launched a developer tool that generates API documentation from code comments. Reached 500 users in the first month.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Stripe", "PostgreSQL"],
    type: "featured",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "rust-learning",
    year: 2022,
    month: 11,
    title: "Learning Rust",
    description: "Built a CLI tool for batch-renaming files with regex patterns.",
    techStack: ["Rust"],
    type: "compact",
    branch: true,
  },

  // — 2023 —
  {
    id: "uiuc-start",
    year: 2023,
    title: "Started at UIUC",
    description: "Began studying Math + CS. Joined ACM and Systems Programming groups.",
    techStack: ["C", "C++", "Math"],
    type: "compact",
  },
  {
    id: "research-project",
    year: 2023,
    month: 3,
    title: "Research: Graph algorithms",
    description: "Worked with a professor on optimizing shortest-path algorithms for sparse graphs.",
    techStack: ["C++", "Python", "LaTeX"],
    type: "compact",
    branch: true,
  },
  {
    id: "hackathon-2",
    year: 2023,
    month: 4,
    title: "HackIllinois project",
    description: "Built an AI-powered study group matcher. 2nd place overall.",
    techStack: ["Next.js", "OpenAI API", "Supabase"],
    type: "compact",
  },
  {
    id: "systems-project",
    year: 2023,
    month: 9,
    title: "Built a database engine",
    description: "Implemented a B+ tree-based storage engine with ACID transactions from scratch for a systems course. One of the most challenging and rewarding projects I've done.",
    techStack: ["C", "Linux", "Make"],
    type: "featured",
    repoUrl: "https://github.com",
  },
  {
    id: "ta-position",
    year: 2023,
    month: 11,
    title: "Became a CS 225 TA",
    description: "Teaching data structures. Running office hours and writing MP test cases.",
    techStack: ["C++", "Teaching"],
    type: "compact",
  },

  // — 2024 —
  {
    id: "internship-2",
    year: 2024,
    title: "Summer internship — Series B startup",
    description: "Built the real-time collaboration engine for a design tool. WebSocket architecture serving 50k concurrent users.",
    techStack: ["TypeScript", "React", "WebSockets", "Redis", "AWS"],
    type: "featured",
  },
  {
    id: "side-project-2024",
    year: 2024,
    month: 3,
    title: "Terminal portfolio v1",
    description: "Built an interactive terminal-style portfolio with a custom shell parser.",
    techStack: ["React", "TypeScript", "xterm.js"],
    type: "compact",
    branch: true,
  },
  {
    id: "math-viz",
    year: 2024,
    month: 5,
    title: "Math visualization tool",
    description: "Interactive visualizations for topology and abstract algebra concepts.",
    techStack: ["Three.js", "React", "TypeScript"],
    type: "compact",
    branch: true,
  },
  {
    id: "contrib-2024",
    year: 2024,
    month: 8,
    title: "Major OSS contribution",
    description: "Landed a significant performance PR in a popular bundler.",
    techStack: ["Rust", "JavaScript"],
    type: "compact",
    branch: true,
  },
  {
    id: "distributed-sys",
    year: 2024,
    month: 10,
    title: "Distributed systems course project",
    description: "Implemented Raft consensus protocol with fault-tolerant log replication.",
    techStack: ["Go", "gRPC", "Docker"],
    type: "compact",
  },
  {
    id: "portfolio-v2",
    year: 2024,
    month: 12,
    title: "This portfolio",
    description: "The git-graph portfolio you're looking at right now.",
    techStack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    type: "compact",
  },
];

export const years = [...new Set(timelineData.map((e) => e.year))].sort();
