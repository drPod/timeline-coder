import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { TimelineEntry } from "@/data/timeline";
import { getCategoryColor } from "@/lib/gitFormatting";
import { getPrimaryRepo, getRepoUrl } from "@/lib/githubData";

const FeaturedCard = ({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) => {
  const categoryColor = getCategoryColor(entry.category);
  const primaryRepo = getPrimaryRepo(entry.id);
  const resolvedRepoUrl = getRepoUrl(entry.id);

  return (
    <motion.div
      id={`entry-${entry.id}`}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_40px_-10px_hsl(var(--commit-glow)/0.15)]">
        {/* File path header — cat README.md style */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60">
            ~/{primaryRepo ?? `projects/${entry.id}`}/README.md
          </span>
        </div>

        <div className="p-5">
          {/* Category indicator dot */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: categoryColor, boxShadow: `0 0 8px ${categoryColor}` }}
              />
              <h3 className="font-mono text-lg font-semibold text-foreground">
                <span className="text-muted-foreground/40"># </span>
                {entry.title}
              </h3>
            </div>
            <div className="flex gap-2">
              {(resolvedRepoUrl || (entry.repoUrl && entry.repoUrl !== "#")) && (
                <a
                  href={resolvedRepoUrl ?? entry.repoUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Source code"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {entry.liveUrl && (
                <a
                  href={entry.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Live demo"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {entry.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {entry.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCard;
