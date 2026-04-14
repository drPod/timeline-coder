import { Trophy } from "lucide-react";
import type { AwardEntry } from "@/lib/githubData";

type AwardCardProps = {
  entry: AwardEntry;
};

const AwardCard = ({ entry }: AwardCardProps) => {
  const content = (
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

  if (entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default AwardCard;
