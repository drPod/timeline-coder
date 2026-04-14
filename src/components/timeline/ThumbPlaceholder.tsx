import { getCategoryColor } from "@/lib/githubData";

type ThumbPlaceholderProps = {
  id?: string;
  name: string;
  category: string;
  size?: "sm" | "lg";
};

type VisualProps = { hsl: string; size: "sm" | "lg"; sizes: SizeMap };
type SizeMap = {
  tiny: number;
  small: number;
  body: number;
  title: number;
};

function getSizes(size: "sm" | "lg"): SizeMap {
  return size === "lg"
    ? { tiny: 7, small: 8, body: 9, title: 10 }
    : { tiny: 5, small: 6, body: 7, title: 8 };
}

/**
 * Category-themed thumbnail placeholder used for projects that don't have
 * a deploy-URL screenshot or demo video. Checks for a project-specific
 * visual first (keyed by repo id) and falls back to a category motif.
 */
const ThumbPlaceholder = ({ id, name, category, size = "sm" }: ThumbPlaceholderProps) => {
  const hsl = getCategoryColor(category);
  const sizes = getSizes(size);
  const ProjectVisual = id ? PROJECT_VISUALS[id] : undefined;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${hsl} / 0.1) 0%, rgba(0,0,0,0.85) 100%)`,
      }}
    >
      {ProjectVisual ? (
        <ProjectVisual hsl={hsl} size={size} sizes={sizes} />
      ) : (
        <>
          <CategoryMotif category={category} hsl={hsl} />
          <div className="relative z-10 flex flex-col items-center gap-1 px-3">
            <span
              className="font-mono font-bold tracking-tight text-white/85"
              style={{ fontSize: size === "lg" ? 22 : 13 }}
            >
              {name}
            </span>
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{
                fontSize: size === "lg" ? 10 : 8,
                color: `hsl(${hsl} / 0.65)`,
              }}
            >
              {category}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Project-specific visuals
// ═══════════════════════════════════════════════════════════════════

// ── ghostroom: 6 linux desktop tiles ──────────────────────────────
const GhostroomVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-1 p-2">
    <div className="flex items-center justify-between px-1">
      <span className="font-mono text-white/40" style={{ fontSize: sizes.small }}>
        {"> ghostroom // 6 teams"}
      </span>
      <span className="font-mono text-[#3ecf8e]/60" style={{ fontSize: sizes.tiny }}>
        LIVE
      </span>
    </div>
    <div className="grid flex-1 grid-cols-3 gap-1">
      {[82, 40, 73, 15, 65, 91].map((pct, i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5 rounded-sm border border-white/10 bg-black/40 p-1"
        >
          <div className="flex gap-0.5">
            <span className="h-1 w-1 rounded-full bg-[#ff5f57]/60" />
            <span className="h-1 w-1 rounded-full bg-[#febc2e]/60" />
            <span className="h-1 w-1 rounded-full bg-[#28c840]/60" />
          </div>
          <div
            className="font-mono text-[#3ecf8e]/50"
            style={{ fontSize: sizes.tiny - 1 }}
          >
            team_{i + 1}
          </div>
          <div className="mt-auto h-px w-full bg-white/10">
            <div className="h-full bg-[#3ecf8e]/50" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── coldshot: agentic pipeline steps ───────────────────────────────
const ColdshotVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-1 p-3">
    <div
      className="mb-1 font-mono text-[#28c840]/75"
      style={{ fontSize: sizes.body }}
    >
      $ coldshot run --target acme.co
    </div>
    {[
      ["discover", "sumble", "✓"],
      ["qualify", "claude", "✓"],
      ["contact", "CTO found", "✓"],
      ["research", "opus + web", "✓"],
      ["draft", "3 variants", "◌"],
    ].map(([step, detail, status], i) => (
      <div
        key={i}
        className="flex items-center gap-2 font-mono"
        style={{ fontSize: sizes.small }}
      >
        <span className="text-white/25">[{step}]</span>
        <span className="text-white/45">{detail}</span>
        <span
          className={`ml-auto ${status === "✓" ? "text-[#28c840]/70" : "text-[#febc2e]/70"}`}
        >
          {status}
        </span>
      </div>
    ))}
  </div>
);

// ── FuckNetflix: torrent player ────────────────────────────────────
const FuckNetflixVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-2 p-3">
    <div className="flex items-center justify-center">
      <div className="relative flex h-12 w-20 items-center justify-center rounded-md border border-[#ff5f57]/30 bg-black/60">
        <div
          className="ml-1 h-0 w-0 opacity-80"
          style={{
            borderLeft: "10px solid #ff5f57",
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
          }}
        />
      </div>
    </div>
    <div className="flex flex-col gap-0.5">
      <div
        className="flex gap-2 font-mono text-white/40"
        style={{ fontSize: sizes.tiny }}
      >
        <span>seeders</span>
        <span className="text-[#28c840]/70">▮▮▮▮▮▮▮▮▮▯</span>
        <span>247</span>
      </div>
      <div
        className="flex gap-2 font-mono text-white/40"
        style={{ fontSize: sizes.tiny }}
      >
        <span>pick</span>
        <span className="text-[#3ecf8e]/70">smollm2 ► 1080p bluray</span>
      </div>
    </div>
  </div>
);

// ── Detecting-Malicious-Commits: code diff with LSTM verdict ───────
const MaliciousCommitsVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-1.5 p-3">
    <div className="font-mono text-white/30" style={{ fontSize: sizes.small }}>
      ~/crypto.c @ HEAD
    </div>
    <div className="flex flex-col gap-0.5 rounded-sm border border-white/10 bg-black/50 p-1.5">
      <div className="font-mono text-white/25" style={{ fontSize: sizes.tiny }}>
        - validate_input(x);
      </div>
      <div className="font-mono text-[#ff5f57]/75" style={{ fontSize: sizes.tiny }}>
        + system(getenv("PAYLOAD"));
      </div>
    </div>
    <div className="mt-1 flex items-center gap-2">
      <span
        className="rounded-sm bg-[#ff5f57]/20 px-1.5 py-0.5 font-mono text-[#ff5f57]/90"
        style={{ fontSize: sizes.tiny }}
      >
        MALICIOUS
      </span>
      <span className="font-mono text-white/35" style={{ fontSize: sizes.tiny }}>
        lstm → 0.94
      </span>
    </div>
  </div>
);

// ── CalClaude: macOS menubar + natural language event ──────────────
const CalClaudeVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-1 p-2">
    <div className="flex items-center gap-2 rounded-sm bg-white/5 px-1.5 py-0.5">
      <span className="font-mono text-white/50" style={{ fontSize: sizes.tiny }}>

      </span>
      <span className="font-mono text-white/35" style={{ fontSize: sizes.tiny }}>
        calclaude
      </span>
      <span
        className="ml-auto font-mono text-white/30"
        style={{ fontSize: sizes.tiny }}
      >
        ⌘⌥P
      </span>
    </div>
    <div className="flex flex-1 flex-col justify-center gap-1 rounded-md border border-white/10 bg-black/70 p-1.5">
      <div
        className="font-mono text-white/75"
        style={{ fontSize: sizes.body }}
      >
        lunch with sarah tomorrow at noon
      </div>
      <div
        className="font-mono text-[#3ecf8e]/60"
        style={{ fontSize: sizes.tiny }}
      >
        → claude parsing...
      </div>
      <div
        className="flex items-center justify-between font-mono text-white/40"
        style={{ fontSize: sizes.tiny }}
      >
        <span>Sarah · Lunch</span>
        <span>12:00 PM tmr</span>
      </div>
    </div>
  </div>
);

// ── Transfer-Bench: languages → transfer matrix ────────────────────
const TransferBenchVisual = ({ hsl, sizes }: VisualProps) => {
  const langs = ["EN", "ES", "ZH", "AR", "DE"];
  return (
    <div className="absolute inset-0 flex flex-col gap-1 p-3">
      <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
        cross-lingual jailbreak xfer
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-5 gap-0.5">
          {langs.map((_, r) =>
            langs.map((_, c) => {
              const val = r === c ? 0.9 : Math.abs(Math.sin((r + 1) * (c + 1.7))) * 0.6;
              return (
                <div
                  key={`${r}-${c}`}
                  className="h-3 w-3 rounded-sm md:h-4 md:w-4"
                  style={{ background: `hsl(${hsl} / ${val.toFixed(2)})` }}
                />
              );
            })
          )}
        </div>
      </div>
      <div
        className="flex justify-between font-mono text-white/25"
        style={{ fontSize: sizes.tiny }}
      >
        {langs.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
};

// ── jailbreak-dataset-analysis: cluster scatter ────────────────────
const JailbreakAnalysisVisual = ({ hsl, sizes }: VisualProps) => {
  const clusters: Array<{ cx: number; cy: number; pts: number; tint: string }> = [
    { cx: 45, cy: 40, pts: 28, tint: hsl },
    { cx: 130, cy: 70, pts: 22, tint: "35 90% 55%" },
    { cx: 95, cy: 25, pts: 18, tint: "0 70% 55%" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-0.5 p-2.5">
      <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
        jailbreak dataset · 945K rows
      </div>
      <svg viewBox="0 0 180 110" className="flex-1" preserveAspectRatio="xMidYMid slice">
        {clusters.flatMap((c, ci) =>
          Array.from({ length: c.pts }).map((_, i) => {
            const a = (i / c.pts) * Math.PI * 2;
            const r = Math.random() * 18;
            const x = c.cx + Math.cos(a) * r;
            const y = c.cy + Math.sin(a) * r * 0.7;
            return (
              <circle
                key={`${ci}-${i}`}
                cx={x}
                cy={y}
                r="1.3"
                fill={`hsl(${c.tint})`}
                opacity="0.7"
              />
            );
          })
        )}
      </svg>
      <div className="font-mono text-white/30" style={{ fontSize: sizes.tiny }}>
        hackaprompt · jailbreakbench · wildjailbreak
      </div>
    </div>
  );
};

// ── UrbanPiper-Periscope: delivery downtime bars ──────────────────
const PeriscopeVisual = ({ sizes }: VisualProps) => {
  const bars = [92, 88, 40, 95, 76, 98, 71, 94, 89, 45, 91, 85];
  return (
    <div className="absolute inset-0 flex flex-col gap-1 p-3">
      <div
        className="flex items-center justify-between font-mono text-white/40"
        style={{ fontSize: sizes.small }}
      >
        <span>periscope · uptime %</span>
        <span className="text-[#28c840]/70">85.3%</span>
      </div>
      <div className="flex flex-1 items-end gap-1">
        {bars.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${v}%`,
              background: v < 60 ? "#ff5f57" : "#28c840",
              opacity: 0.5 + (v / 100) * 0.4,
            }}
          />
        ))}
      </div>
      <div
        className="flex justify-between font-mono text-white/25"
        style={{ fontSize: sizes.tiny }}
      >
        <span>grubhub</span>
        <span>doordash</span>
        <span>uber eats</span>
      </div>
    </div>
  );
};

// ── UrbanPiper-AI-Tagging: call transcript with tags ──────────────
const AITaggingVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-1 p-3">
    <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
      call #4782 · 02:14
    </div>
    <div
      className="flex-1 overflow-hidden rounded-sm border border-white/10 bg-black/40 p-1.5 font-mono leading-relaxed text-white/50"
      style={{ fontSize: sizes.tiny }}
    >
      ...yes, we're located on Main St...
      <br />
      the voice sounds natural now...
      <br />
      <span className="text-white/25">[customer sentiment: positive]</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {["ai-voice", "positive", "order-complete", "no-issue"].map((t) => (
        <span
          key={t}
          className="rounded-sm bg-[#28c840]/10 px-1 font-mono text-[#28c840]/70"
          style={{ fontSize: sizes.tiny - 1 }}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

// ── UrbanPiper-AI-Checking: voice vs actual diff ──────────────────
const AICheckingVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 grid grid-cols-2 gap-1 p-3">
    <div className="flex flex-col gap-0.5 rounded-sm border border-white/10 bg-black/30 p-1.5">
      <div className="font-mono text-white/35" style={{ fontSize: sizes.tiny }}>
        voice ai
      </div>
      <div className="font-mono text-white/55" style={{ fontSize: sizes.tiny }}>
        2× large pepperoni
        <br />1× garlic knots
      </div>
    </div>
    <div className="flex flex-col gap-0.5 rounded-sm border border-white/10 bg-black/30 p-1.5">
      <div className="font-mono text-white/35" style={{ fontSize: sizes.tiny }}>
        actual order
      </div>
      <div className="font-mono text-white/55" style={{ fontSize: sizes.tiny }}>
        2× large pepperoni
        <br />
        <span className="text-[#ff5f57]/80">1× breadsticks</span>
      </div>
    </div>
  </div>
);

// ── WhereToSellPOS: google maps pins ──────────────────────────────
const WhereToSellVisual = ({ hsl, sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-1 p-2">
    <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
      restaurant discovery · dallas metro
    </div>
    <div className="relative flex-1 overflow-hidden rounded-sm border border-white/10 bg-black/30">
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 100 70"
      >
        <path d="M 0 20 L 100 20" stroke="white" strokeWidth="0.2" />
        <path d="M 0 40 L 100 40" stroke="white" strokeWidth="0.2" />
        <path d="M 25 0 L 25 70" stroke="white" strokeWidth="0.2" />
        <path d="M 60 0 L 60 70" stroke="white" strokeWidth="0.2" />
        <path d="M 80 0 L 80 70" stroke="white" strokeWidth="0.2" />
      </svg>
      {[
        [18, 15], [35, 22], [52, 18], [72, 28], [88, 42],
        [22, 48], [45, 38], [68, 52], [82, 58], [30, 60],
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            background: `hsl(${hsl})`,
            boxShadow: `0 0 4px hsl(${hsl})`,
          }}
        />
      ))}
    </div>
    <div className="font-mono text-white/30" style={{ fontSize: sizes.tiny }}>
      127 pulled · 3,849 reviews · google maps api
    </div>
  </div>
);

// ── AcDec quiz automation: PDF → canvas ──────────────────────────
const AcDecQuizVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex items-center justify-around gap-2 p-3">
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-10 w-8 flex-col gap-0.5 rounded-sm border border-white/20 bg-white/5 p-1 md:h-14 md:w-11">
        <div className="h-px w-full bg-white/30" />
        <div className="h-px w-3/4 bg-white/30" />
        <div className="h-px w-full bg-white/30" />
        <div className="h-px w-2/3 bg-white/30" />
        <div className="h-px w-full bg-white/30" />
      </div>
      <span className="font-mono text-white/40" style={{ fontSize: sizes.tiny }}>
        demidec.pdf
      </span>
    </div>
    <div className="flex flex-col items-center">
      <div
        className="font-mono text-[#3ecf8e]/70"
        style={{ fontSize: sizes.title + 4 }}
      >
        →
      </div>
      <span className="font-mono text-white/30" style={{ fontSize: sizes.tiny }}>
        parse
      </span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-10 w-10 flex-col gap-0.5 rounded-sm border border-[#3ecf8e]/30 bg-[#3ecf8e]/5 p-1 md:h-14 md:w-14">
        <div
          className="font-mono text-[#3ecf8e]/70"
          style={{ fontSize: sizes.tiny }}
        >
          Q. 1920s
        </div>
        <div className="mt-auto flex gap-0.5">
          <span className="h-1 w-full rounded-sm bg-[#3ecf8e]/30" />
          <span className="h-1 w-full rounded-sm bg-[#3ecf8e]/30" />
          <span className="h-1 w-full rounded-sm bg-[#3ecf8e]/60" />
          <span className="h-1 w-full rounded-sm bg-[#3ecf8e]/30" />
        </div>
      </div>
      <span className="font-mono text-white/40" style={{ fontSize: sizes.tiny }}>
        canvas lms
      </span>
    </div>
  </div>
);

// ── CCDC: file integrity monitor ──────────────────────────────────
const CCDCVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-1 p-3">
    <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
      file integrity monitor · sha-256
    </div>
    <div
      className="flex-1 space-y-0.5 font-mono text-white/50"
      style={{ fontSize: sizes.tiny }}
    >
      <div>
        ✓ /var/www/index.html <span className="text-white/20">a3f7…</span>
      </div>
      <div>
        ✓ /var/www/css/main.css <span className="text-white/20">c82e…</span>
      </div>
      <div className="text-[#ff5f57]/80">
        ✗ /var/www/admin.php <span className="text-white/20">f9d1…→8ab4…</span>
      </div>
      <div>
        ✓ /etc/nginx/nginx.conf <span className="text-white/20">2d8a…</span>
      </div>
      <div className="text-[#ff5f57]/80">⚠ syslog: alert sent</div>
    </div>
  </div>
);

// ── CyberPatriot: hardening checklist ─────────────────────────────
const CyberPatriotVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col gap-0.5 p-3">
    <div
      className="flex items-center justify-between font-mono text-white/35"
      style={{ fontSize: sizes.small }}
    >
      <span>hardening · ubuntu 22.04</span>
      <span className="text-[#febc2e]/80">GOLD</span>
    </div>
    <div
      className="flex-1 font-mono leading-relaxed text-white/45"
      style={{ fontSize: sizes.tiny }}
    >
      <div>[✓] disable guest account</div>
      <div>[✓] enforce password policy</div>
      <div>[✓] remove unauthorized users</div>
      <div>[✓] ufw enable default deny</div>
      <div>[◌] scanning open ports...</div>
    </div>
  </div>
);

// ── Cryptography: RSA + CryptoHack ───────────────────────────────
const CryptographyVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-1 p-3">
    <div className="font-mono text-white/35" style={{ fontSize: sizes.small }}>
      rsa · p × q = n
    </div>
    <div
      className="break-all font-mono text-[#3ecf8e]/65"
      style={{ fontSize: sizes.small }}
    >
      p = 857504083339712752
      <br />q = 1029224947942998075
      <br />n = 8826845…
    </div>
    <div className="font-mono text-white/30" style={{ fontSize: sizes.tiny }}>
      cryptohack · picoctf · 20+ solves
    </div>
  </div>
);

// ── GPT-Learning-Project: early 2023 openai ───────────────────────
const GPTLearningVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-1 p-3">
    <div className="font-mono text-white/25" style={{ fontSize: sizes.tiny }}>
      apr 2023
    </div>
    <div className="font-mono text-white/40" style={{ fontSize: sizes.small }}>
      {'>>> openai.Completion.create('}
    </div>
    <div
      className="pl-3 font-mono text-[#3ecf8e]/70"
      style={{ fontSize: sizes.small }}
    >
      engine="davinci"
    </div>
    <div className="font-mono text-white/40" style={{ fontSize: sizes.small }}>
      {")"}
    </div>
    <div className="mt-1 font-mono text-white/30" style={{ fontSize: sizes.tiny }}>
      where it started.
    </div>
  </div>
);

// ── respan-tools: CLI for LLM observability ──────────────────────
const RespanToolsVisual = ({ sizes }: VisualProps) => (
  <div className="absolute inset-0 flex flex-col justify-center gap-1 p-3">
    <div className="font-mono text-[#28c840]/70" style={{ fontSize: sizes.small }}>
      $ respan traces
    </div>
    <div
      className="font-mono leading-relaxed text-white/45"
      style={{ fontSize: sizes.tiny }}
    >
      <div className="text-white/25">time     span           tok  ms</div>
      <div>14:32:01 chat.completion  847  1203</div>
      <div>14:32:04 tool.search        12   284</div>
      <div>14:32:07 chat.completion 1024  1890</div>
    </div>
  </div>
);

// ── Project ID → visual component map ────────────────────────────
const PROJECT_VISUALS: Record<string, React.FC<VisualProps>> = {
  ghostroom: GhostroomVisual,
  coldshot: ColdshotVisual,
  FuckNetflix: FuckNetflixVisual,
  "Detecting-Malicious-Commits": MaliciousCommitsVisual,
  CalClaude: CalClaudeVisual,
  "Transfer-Bench": TransferBenchVisual,
  "jailbreak-dataset-analysis": JailbreakAnalysisVisual,
  "UrbanPiper-Periscope": PeriscopeVisual,
  "UrbanPiper-AI-Tagging": AITaggingVisual,
  "UrbanPiper-AI-Checking": AICheckingVisual,
  WhereToSellPOS: WhereToSellVisual,
  "Academic-Decathlon-Focus-Quiz-Automation": AcDecQuizVisual,
  "CCDC-Website-Integrity-Script-10-25-2025": CCDCVisual,
  "CyberPatriot-Scripts": CyberPatriotVisual,
  Cryptography: CryptographyVisual,
  "GPT-Learning-Project": GPTLearningVisual,
  "respan-tools": RespanToolsVisual,
};

/**
 * Per-category faint SVG motif rendered behind the name when no
 * project-specific visual exists.
 */
const CategoryMotif = ({ category, hsl }: { category: string; hsl: string }) => {
  const color = `hsl(${hsl})`;

  if (category === "osint" || category === "research") {
    return (
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="30" y1="60" x2="90" y2="30" stroke={color} strokeWidth="0.5" />
        <line x1="30" y1="60" x2="90" y2="90" stroke={color} strokeWidth="0.5" />
        <line x1="90" y1="30" x2="150" y2="40" stroke={color} strokeWidth="0.5" />
        <line x1="90" y1="90" x2="150" y2="40" stroke={color} strokeWidth="0.5" />
        <line x1="90" y1="90" x2="170" y2="90" stroke={color} strokeWidth="0.5" />
        <line x1="150" y1="40" x2="170" y2="90" stroke={color} strokeWidth="0.5" />
        <circle cx="30" cy="60" r="3" fill={color} />
        <circle cx="90" cy="30" r="2.5" fill={color} />
        <circle cx="90" cy="90" r="2.5" fill={color} />
        <circle cx="150" cy="40" r="2" fill={color} opacity="0.6" />
        <circle cx="170" cy="90" r="2" fill={color} opacity="0.6" />
      </svg>
    );
  }

  if (category === "sales") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center gap-1 px-6 opacity-20"
        style={{ color }}
      >
        <div className="font-mono text-[9px]">$ ./run --target acme.co</div>
        <div className="font-mono text-[9px] opacity-70">[discover] scanning…</div>
        <div className="font-mono text-[9px] opacity-70">[qualify] ✓ match</div>
        <div className="font-mono text-[9px] opacity-40">[draft] composing…</div>
      </div>
    );
  }

  if (category === "media") {
    return (
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <polygon points="85,45 115,60 85,75" fill={color} />
        <rect x="40" y="88" width="120" height="2" fill={color} opacity="0.35" />
        <rect x="40" y="88" width="50" height="2" fill={color} />
        <circle cx="90" cy="89" r="3" fill={color} />
      </svg>
    );
  }

  if (category === "security") {
    return (
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hex-pattern" x="0" y="0" width="20" height="24" patternUnits="userSpaceOnUse">
            <polygon
              points="10,2 18,7 18,17 10,22 2,17 2,7"
              fill="none"
              stroke={color}
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="200" height="120" fill="url(#hex-pattern)" />
      </svg>
    );
  }

  if (category === "infra") {
    return (
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={20 + col * 22}
              y={20 + row * 20}
              width="18"
              height="16"
              fill={color}
              opacity={Math.max(0.15, 1 - (row + col) * 0.1)}
            />
          ))
        )}
      </svg>
    );
  }

  // default: binary noise
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-wrap items-center justify-center gap-[2px] overflow-hidden p-3 opacity-[0.12]"
      style={{ color }}
    >
      {Array.from({ length: 80 }).map((_, i) => (
        <span key={i} className="font-mono text-[10px]">
          {Math.random() > 0.5 ? "1" : "0"}
        </span>
      ))}
    </div>
  );
};

export default ThumbPlaceholder;
