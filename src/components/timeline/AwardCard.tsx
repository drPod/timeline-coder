import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { AwardEntry } from "@/lib/githubData";

type AwardCardProps = {
  entry: AwardEntry;
};

const AwardCard = ({ entry }: AwardCardProps) => {
  const inner = (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#febc2e]/15 bg-[#febc2e]/5 px-3 py-2 backdrop-blur-sm transition-colors hover:border-[#febc2e]/25">
      <Trophy size={14} className="shrink-0 text-[#febc2e]/60" />
      <div className="flex flex-col">
        <span className="font-mono text-[11px] text-white">{entry.title}</span>
        {entry.placement && (
          <span className="font-mono text-[9px] text-[#febc2e]/60">
            {entry.placement}
          </span>
        )}
      </div>
    </div>
  );

  const body = entry.url ? (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {inner}
    </a>
  ) : (
    inner
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {body}
    </motion.div>
  );
};

export default AwardCard;
