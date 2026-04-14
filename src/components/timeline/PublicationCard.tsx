import { motion } from "framer-motion";
import type { PublicationEntry } from "@/lib/githubData";

type PublicationCardProps = {
  entry: PublicationEntry;
};

/**
 * Renders author list as plain text with "Poddar, D." bolded.
 */
function renderAuthors(authors: string[]) {
  return authors.map((author, i) => {
    const isMe = author === "Poddar, D.";
    const separator = i < authors.length - 1 ? ", " : "";
    if (isMe) {
      return (
        <span key={i}>
          <strong className="text-white">{author}</strong>
          {separator}
        </span>
      );
    }
    return (
      <span key={i}>
        {author}
        {separator}
      </span>
    );
  });
}

const PublicationCard = ({ entry }: PublicationCardProps) => {
  const hasLinks = Boolean(entry.arxivUrl || entry.ieeeUrl || entry.doi);
  const isUnderReview = entry.status === "under-review";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-lg border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#3ecf8e]/20 hover:shadow-[0_0_24px_-6px_rgba(62,207,142,0.12)]">
      {/* Left accent bar — publications = purple */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-[#9b5bff]/40"
        style={{
          boxShadow: "0 0 8px rgba(155,91,255,0.4)",
        }}
      />

      {/* Status badge (top-right) */}
      {isUnderReview && (
        <div className="absolute right-3 top-3 rounded-sm border border-[#febc2e]/20 bg-[#febc2e]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#febc2e]/70">
          UNDER REVIEW
        </div>
      )}

      <div className="p-5">
        {/* Label */}
        <div className="font-mono text-[9px] uppercase tracking-wider text-[#9b5bff]/60">
          PUBLICATION
        </div>

        {/* Title (sans, readable) */}
        <h4
          className="mt-2 font-sans text-[14px] font-bold text-white"
          style={{ lineHeight: 1.3 }}
        >
          {entry.title}
        </h4>

        {/* Authors */}
        <p className="mt-2 font-mono text-[11px] text-white/35">
          {renderAuthors(entry.authors)}
        </p>

        {/* Venue */}
        <p className="mt-2 font-mono text-[11px] italic text-[#9b5bff]/70">
          {entry.venue}
        </p>

        {/* Links */}
        {hasLinks && (
          <div className="mt-3 flex flex-wrap gap-3">
            {entry.arxivUrl && (
              <a
                href={entry.arxivUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
              >
                arxiv →
              </a>
            )}
            {entry.ieeeUrl && (
              <a
                href={entry.ieeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
              >
                ieee →
              </a>
            )}
            {entry.doi && (
              <span className="font-mono text-[10px] text-white/20">
                DOI: {entry.doi}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default PublicationCard;
