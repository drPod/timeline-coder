import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { TimelineEntry } from "@/data/timeline";
import { generateFakeHash, toBranchName, getCategoryColor } from "@/lib/gitFormatting";
import { getShortHash, getRepoLabel, getRepoUrl } from "@/lib/githubData";

const CompactNode = ({ entry, side, isLatest }: { entry: TimelineEntry; side: "left" | "right"; isLatest?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const hash = getShortHash(entry.id) ?? generateFakeHash(entry.id);
  const repoLabel = getRepoLabel(entry.id);
  const resolvedRepoUrl = getRepoUrl(entry.id);
  const categoryColor = getCategoryColor(entry.category);

  return (
    <motion.div
      id={`entry-${entry.id}`}
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group w-full cursor-pointer ${
        side === "left" ? "md:text-right" : "md:text-left"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div
        className={`rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-border hover:bg-secondary/30 ${
          expanded ? "border-border bg-secondary/30" : ""
        }`}
      >
        {/* Git log --oneline format */}
        <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-sm ${side === "left" ? "md:flex-row-reverse" : ""}`}>
          <span style={{ color: categoryColor }} className="shrink-0 text-xs opacity-80">
            {hash}
          </span>
          {isLatest && (
            <span className="shrink-0 text-xs text-commit-branch">
              (HEAD → main)
            </span>
          )}
          {repoLabel && !isLatest && (
            <span className="inline-block max-w-[160px] shrink-0 truncate text-xs text-commit-branch opacity-70 md:max-w-[250px]">
              ({repoLabel})
            </span>
          )}
          {!repoLabel && entry.branch && !isLatest && (
            <span className="inline-block max-w-[120px] shrink-0 truncate text-xs text-commit-branch opacity-70 md:max-w-[200px]">
              (feature/{toBranchName(entry.title)})
            </span>
          )}
          <span className="font-medium text-foreground">{entry.title}</span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-sm text-muted-foreground">{entry.description}</p>
              <div
                className={`mt-2 flex flex-wrap gap-1.5 ${
                  side === "left" ? "md:justify-end" : ""
                }`}
              >
                {entry.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {(entry.repoUrl || resolvedRepoUrl || entry.liveUrl) && (
                <div
                  className={`mt-2 flex gap-3 ${
                    side === "left" ? "md:justify-end" : ""
                  }`}
                >
                  {(resolvedRepoUrl || entry.repoUrl) && (
                    <a
                      href={resolvedRepoUrl ?? entry.repoUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Github className="h-3 w-3" /> Code
                    </a>
                  )}
                  {entry.liveUrl && (
                    <a
                      href={entry.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Live
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CompactNode;
