import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { TimelineEntry } from "@/data/timeline";

const FeaturedCard = ({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_40px_-10px_hsl(var(--commit-glow)/0.15)]">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
          <div className="flex gap-2">
            {entry.repoUrl && (
              <a
                href={entry.repoUrl}
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
              className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCard;
