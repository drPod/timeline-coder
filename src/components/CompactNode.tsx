import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { TimelineEntry } from "@/data/timeline";

const CompactNode = ({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
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
        <h3 className="text-sm font-medium text-foreground">{entry.title}</h3>

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
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {(entry.repoUrl || entry.liveUrl) && (
                <div
                  className={`mt-2 flex gap-3 ${
                    side === "left" ? "md:justify-end" : ""
                  }`}
                >
                  {entry.repoUrl && (
                    <a
                      href={entry.repoUrl}
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
