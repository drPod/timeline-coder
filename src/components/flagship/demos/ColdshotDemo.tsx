import { useEffect, useRef, useState } from "react";

/**
 * Animated terminal replay of a single `coldshot run --target acme.co`
 * session. Lines reveal one-at-a-time with a small delay, coloured by
 * step type (info / ok / data / warn). Finishes with the generated
 * email draft in a bordered box. Auto-loops.
 */

type LineKind = "cmd" | "info" | "ok" | "data" | "step" | "warn" | "divider";

type Line = {
  kind: LineKind;
  text: string;
  delay?: number; // ms before next line
};

const SCRIPT: Line[] = [
  { kind: "cmd", text: "$ coldshot run --target acme-health.co", delay: 600 },
  { kind: "divider", text: "─".repeat(32), delay: 200 },
  { kind: "step", text: "[1/7] discover      sumble.com/search", delay: 500 },
  { kind: "data", text: "       → 47 candidates matched ICP (llm+b2b+>50)", delay: 400 },
  { kind: "step", text: "[2/7] qualify       claude-sonnet + web.search", delay: 600 },
  { kind: "data", text: "       → acme-health.co builds on llms. verdict: pass", delay: 400 },
  { kind: "step", text: "[3/7] find contact  walking org chart", delay: 400 },
  { kind: "data", text: "       CXO     → skip (8 evals, no match)", delay: 300 },
  { kind: "data", text: "       VP      → skip (3 evals, tangential)", delay: 300 },
  { kind: "data", text: "       Director → MATCH  Jamie Chen, Dir. of AI", delay: 400 },
  { kind: "step", text: "[4/7] research      opus + web.search (12 tool calls)", delay: 700 },
  { kind: "data", text: "       pain: SOAP note accuracy on multi-symptom calls", delay: 350 },
  { kind: "step", text: "[5/7] generate      3 drafts in parallel", delay: 600 },
  { kind: "data", text: "       draft_a  score 0.81", delay: 250 },
  { kind: "data", text: "       draft_b  score 0.74", delay: 250 },
  { kind: "data", text: "       draft_c  score 0.89  ← picked", delay: 400 },
  { kind: "step", text: "[6/7] review        opening $EDITOR (vim)…", delay: 600 },
  { kind: "step", text: "[7/7] send          gmail api → 200 OK", delay: 500 },
  { kind: "ok", text: "✓ sent in 41.8s · 16 llm calls · $0.38 api", delay: 400 },
  { kind: "divider", text: "─".repeat(32), delay: 200 },
  { kind: "info", text: "DRAFT PREVIEW", delay: 200 },
];

const DRAFT = {
  subject: "SOAP note accuracy",
  body: `Hi Jamie,

I've been looking at how acme-health generates SOAP records
from patient conversations using generative AI.

When a summary drops a symptom the patient actually reported,
how do you catch that before the doctor reads it?

Respan (YC W24, backed by Google) traces every step from
patient input through summarization, so your team can pinpoint
exactly where a symptom got lost.

— Darsh`,
};

const kindColor: Record<LineKind, string> = {
  cmd: "text-[#3ecf8e]",
  info: "text-white/70",
  ok: "text-[#3ecf8e]",
  data: "text-sky-300/70",
  step: "text-white/85",
  warn: "text-amber-300/80",
  divider: "text-white/15",
};

const ColdshotDemo = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [showDraft, setShowDraft] = useState(false);
  const cursor = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Progression — push one line at a time, each with its own delay
  useEffect(() => {
    const runStep = () => {
      if (cursor.current < SCRIPT.length) {
        const next = SCRIPT[cursor.current];
        cursor.current += 1;
        setLines((prev) => [...prev, next]);
        timer.current = setTimeout(runStep, next.delay ?? 350);
      } else {
        // Script done — show draft, then reset after 12s
        setShowDraft(true);
        timer.current = setTimeout(() => {
          cursor.current = 0;
          setLines([]);
          setShowDraft(false);
          timer.current = setTimeout(runStep, 500);
        }, 12000);
      }
    };
    timer.current = setTimeout(runStep, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#3ecf8e]/20 bg-[rgba(6,6,8,0.95)] shadow-[0_0_40px_-10px_rgba(62,207,142,0.15)]">
      {/* Header */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="flex-1 truncate text-center font-mono text-[10px] text-white/30">
          ~/Coding/cold-sales · zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="flex-1 overflow-hidden bg-black p-3 md:p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-[10px] leading-[1.6] md:text-[11px]">
          {lines.map((ln, i) => (
            <div key={i} className={kindColor[ln.kind]}>
              {ln.text}
            </div>
          ))}
          {!showDraft && lines.length > 0 && lines.length < SCRIPT.length && (
            <span className="inline-block h-[11px] w-[6px] animate-pulse bg-[#3ecf8e]" />
          )}
        </pre>

        {/* Draft preview box */}
        {showDraft && (
          <div className="mt-3 rounded border border-[#3ecf8e]/25 bg-[rgba(62,207,142,0.04)] p-3">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px]">
              <span className="text-white/30">to:</span>
              <span className="text-white/70">jamie@acme-health.co</span>
            </div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px]">
              <span className="text-white/30">subject:</span>
              <span className="text-white/90">{DRAFT.subject}</span>
            </div>
            <pre className="whitespace-pre-wrap break-words font-mono text-[10px] leading-[1.55] text-white/80 md:text-[10.5px]">
              {DRAFT.body}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdshotDemo;
