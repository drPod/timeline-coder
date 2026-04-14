import { useEffect, useState } from "react";

/**
 * Mock Streamlit dashboard for stormchain. Renders the key headline
 * stats, a faux ROC curve, and a ranked table of riskiest pilot pairs
 * with their suggested swap alternatives. Styled as a clean data
 * dashboard — lighter surfaces than the rest of the site.
 */

const HEADLINE_STATS = [
  { label: "AUC-ROC", value: "0.81", delta: "+0.19 vs baseline" },
  { label: "vs baseline @ K=200", value: "+78%", delta: "delay minutes caught" },
  { label: "upper-bound savings", value: "$34.5M", delta: "per year" },
  { label: "avoid recommendations", value: "1,220", delta: "294 swap alts" },
];

const RISK_TABLE = [
  { rank: 1, pair: "IAH ↔ LAX", risk: 0.91, minutes: 312, alt: "IAH ↔ SAN" },
  { rank: 2, pair: "ORD ↔ DFW", risk: 0.87, minutes: 287, alt: "MDW ↔ DFW" },
  { rank: 3, pair: "DFW ↔ DEN", risk: 0.83, minutes: 241, alt: "DFW ↔ COS" },
  { rank: 4, pair: "DFW ↔ JFK", risk: 0.79, minutes: 223, alt: "DFW ↔ EWR" },
  { rank: 5, pair: "MIA ↔ DFW", risk: 0.75, minutes: 198, alt: "FLL ↔ DFW" },
];

// ROC-curve-ish shape. Points go (fpr, tpr). Fake but plausibly curved.
const ROC_POINTS = [
  { x: 0, y: 0 },
  { x: 0.03, y: 0.22 },
  { x: 0.07, y: 0.41 },
  { x: 0.12, y: 0.55 },
  { x: 0.18, y: 0.66 },
  { x: 0.25, y: 0.74 },
  { x: 0.35, y: 0.81 },
  { x: 0.5, y: 0.87 },
  { x: 0.7, y: 0.94 },
  { x: 1, y: 1 },
];

function pointsToPath(pts: { x: number; y: number }[], w: number, h: number) {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x * w},${h - p.y * h}`)
    .join(" ");
}

const StormchainDemo = () => {
  const [animRoc, setAnimRoc] = useState(0);

  // Animate the ROC curve dash-offset in on first render
  useEffect(() => {
    const t = setTimeout(() => setAnimRoc(1), 200);
    return () => clearTimeout(t);
  }, []);

  const rocPath = pointsToPath(ROC_POINTS, 240, 140);
  const rocLen = 560; // approximation of path length for dash trick

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#3ecf8e]/20 bg-[#0b0b0e] shadow-[0_0_40px_-10px_rgba(62,207,142,0.15)]">
      {/* Header */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[#3ecf8e]" />
        <span className="font-mono text-[10px] text-white/40">
          stormchain.streamlit.app · DFW cascade dashboard
        </span>
        <span className="ml-auto font-mono text-[10px] text-white/30">
          season: winter 2024-25
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Headline stats row */}
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {HEADLINE_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-[22px] font-bold text-white">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[9px] text-[#3ecf8e]/70">
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Chart + table */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
          {/* ROC chart */}
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3 md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/60">
                ROC — held-out 2024
              </span>
              <span className="font-mono text-[9px] text-[#3ecf8e]/70">
                AUC 0.81
              </span>
            </div>
            <svg viewBox="0 0 240 140" width="100%" height="140" preserveAspectRatio="none">
              {/* grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={`h-${t}`}
                  x1={0}
                  y1={140 - t * 140}
                  x2={240}
                  y2={140 - t * 140}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
              ))}
              {/* diag baseline */}
              <line
                x1={0}
                y1={140}
                x2={240}
                y2={0}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {/* curve */}
              <path
                d={rocPath}
                fill="none"
                stroke="#3ecf8e"
                strokeWidth={2}
                strokeDasharray={rocLen}
                strokeDashoffset={animRoc ? 0 : rocLen}
                style={{
                  transition: "stroke-dashoffset 1.4s ease-out",
                  filter: "drop-shadow(0 0 4px rgba(62,207,142,0.5))",
                }}
              />
              {/* fill under curve */}
              <path
                d={`${rocPath} L240,140 L0,140 Z`}
                fill="rgba(62,207,142,0.08)"
                opacity={animRoc}
                style={{ transition: "opacity 0.6s ease-out 1s" }}
              />
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[8px] text-white/30">
              <span>false positive rate</span>
              <span>true positive rate →</span>
            </div>
          </div>

          {/* Risk table */}
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3 md:col-span-3">
            <div className="mb-2 font-mono text-[10px] text-white/60">
              top 5 riskiest pilot pairs — swap alternatives
            </div>
            <table className="w-full font-mono text-[10px]">
              <thead>
                <tr className="text-left text-white/35">
                  <th className="pb-1.5 pr-2 font-normal">#</th>
                  <th className="pb-1.5 pr-2 font-normal">pair</th>
                  <th className="pb-1.5 pr-2 font-normal">risk</th>
                  <th className="pb-1.5 pr-2 font-normal">Δ min</th>
                  <th className="pb-1.5 font-normal">swap →</th>
                </tr>
              </thead>
              <tbody>
                {RISK_TABLE.map((row) => (
                  <tr key={row.pair} className="border-t border-white/5">
                    <td className="py-1.5 pr-2 text-white/30">{row.rank}</td>
                    <td className="py-1.5 pr-2 text-white/85">{row.pair}</td>
                    <td className="py-1.5 pr-2">
                      <RiskBar value={row.risk} />
                    </td>
                    <td className="py-1.5 pr-2 text-amber-300/80">+{row.minutes}</td>
                    <td className="py-1.5 text-[#3ecf8e]/80">{row.alt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="h-1.5 w-14 overflow-hidden rounded-sm bg-white/[0.06]">
      <div
        className="h-full bg-gradient-to-r from-amber-400/60 to-red-400/70"
        style={{ width: `${value * 100}%` }}
      />
    </div>
    <span className="text-white/60">{value.toFixed(2)}</span>
  </div>
);

export default StormchainDemo;
