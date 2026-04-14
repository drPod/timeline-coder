import { motion } from "framer-motion";
import type { ContributionEntry } from "@/lib/githubData";

type ContributionCardProps = {
  entry: ContributionEntry;
};

const STATE_STYLE: Record<
  ContributionEntry["prState"],
  { label: string; className: string }
> = {
  merged: {
    label: "merged",
    className: "border-[#9b5bff]/35 bg-[#9b5bff]/10 text-[#9b5bff]/90",
  },
  open: {
    label: "open",
    className: "border-[#3ecf8e]/30 bg-[#3ecf8e]/10 text-[#3ecf8e]/90",
  },
  closed: {
    label: "closed",
    className: "border-white/15 bg-white/[0.04] text-white/40",
  },
};

const ContributionCard = ({ entry }: ContributionCardProps) => {
  const state = STATE_STYLE[entry.prState];

  return (
    <motion.a
      href={entry.prUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative block overflow-hidden rounded-lg border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#4b6bfc]/30 hover:shadow-[0_0_24px_-6px_rgba(75,107,252,0.25)]"
    >
      {/* Left accent bar */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          background: "#4b6bfc",
          boxShadow:
            "0 0 12px hsl(227 97% 64% / 0.45), 0 0 32px hsl(227 97% 64% / 0.2)",
        }}
      />

      <div className="flex flex-col gap-2 p-3 pl-4">
        {/* Top row: upstream repo + state badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[11px] text-[#4b6bfc]/80">
            {entry.upstream}
          </span>
          <span
            className={[
              "shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
              state.className,
            ].join(" ")}
          >
            {state.label}
          </span>
        </div>

        {/* PR title */}
        <h4 className="font-mono text-[13px] font-bold leading-snug text-white">
          {entry.prTitle}
        </h4>

        {/* Contribution blurb */}
        <p className="font-sans text-[11px] leading-snug text-white/40">
          {entry.contribution}
        </p>

        {/* Bottom: PR number + view link */}
        <div className="mt-0.5 flex items-center justify-between font-mono text-[10px]">
          <span className="text-white/30">#{entry.prNumber}</span>
          <span className="text-[#4b6bfc]/70 transition-colors group-hover:text-[#4b6bfc]">
            view pr →
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default ContributionCard;
