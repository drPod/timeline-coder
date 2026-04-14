import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { CertificationEntry } from "@/lib/githubData";

type CertificationCardProps = {
  entry: CertificationEntry;
};

const CertificationCard = ({ entry }: CertificationCardProps) => {
  const inner = (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#4b6bfc]/15 bg-[#4b6bfc]/5 px-3 py-2 backdrop-blur-sm transition-colors hover:border-[#4b6bfc]/25">
      <BadgeCheck size={14} className="shrink-0 text-[#4b6bfc]/60" />
      <div className="flex flex-col">
        <span className="font-mono text-[11px] text-white">{entry.title}</span>
        <span className="font-mono text-[9px] text-[#4b6bfc]/60">
          {entry.issuer}
        </span>
      </div>
    </div>
  );

  const body = entry.credlyUrl ? (
    <a
      href={entry.credlyUrl}
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

export default CertificationCard;
