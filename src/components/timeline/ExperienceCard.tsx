import { format } from "date-fns";
import { motion } from "framer-motion";
import type { ExperienceEntry } from "@/lib/githubData";

type ExperienceCardProps = {
  entry: ExperienceEntry;
};

/** Format { year, month } → "MMM yyyy" (e.g. "Jul 2025"). */
function formatMonth(year: number, month: number): string {
  // month is 1-indexed in our data; Date expects 0-indexed
  return format(new Date(year, month - 1, 1), "MMM yyyy");
}

function formatRange(entry: ExperienceEntry): string {
  const start = formatMonth(entry.year, entry.month);
  const end =
    entry.endYear !== undefined && entry.endMonth !== undefined
      ? formatMonth(entry.endYear, entry.endMonth)
      : "present";
  return `${start} – ${end}`;
}

const ExperienceCard = ({ entry }: ExperienceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-lg border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#3ecf8e]/20 hover:shadow-[0_0_24px_-6px_rgba(62,207,142,0.12)]">
      {/* Left accent bar — experience = green */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-[#3ecf8e]/40"
        style={{
          boxShadow: "0 0 8px rgba(62,207,142,0.4)",
        }}
      />

      <div className="p-4 md:p-5">
        {/* Top row: company/role (left) + dates (right) */}
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <span className="font-mono text-[14px] font-bold text-white">
              {entry.company}
            </span>
            <span className="hidden font-mono text-[13px] text-white/60 md:inline">
              · {entry.role}
            </span>
            <span className="font-mono text-[13px] text-white/60 md:hidden">
              {entry.role}
            </span>
          </div>
          <span className="font-mono text-[11px] text-white/25">
            {formatRange(entry)}
          </span>
        </div>

        {/* Pitch */}
        <p
          className="mt-2 font-sans text-[12px] text-white/45"
          style={{ lineHeight: 1.6 }}
        >
          {entry.pitch}
        </p>

        {/* Location */}
        {entry.location && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-white/20">
            {entry.location}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
