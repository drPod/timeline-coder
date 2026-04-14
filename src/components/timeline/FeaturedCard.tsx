import { motion } from "framer-motion";
import type { Project } from "@/lib/githubData";
import {
  getCategoryColor,
  getScreenshotPath,
  getVideoPaths,
} from "@/lib/githubData";
import ThumbPlaceholder from "./ThumbPlaceholder";

type FeaturedCardProps = {
  project: Project;
  onClick?: () => void;
};

const FeaturedCard = ({ project, onClick }: FeaturedCardProps) => {
  const categoryHsl = getCategoryColor(project.category);
  const video = getVideoPaths(project.id);
  const screenshot = getScreenshotPath(project.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="group relative mb-5 grid cursor-pointer grid-cols-1 md:grid-cols-2 md:min-h-[240px] overflow-hidden rounded-lg border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#3ecf8e]/20 hover:shadow-[0_0_24px_-6px_rgba(62,207,142,0.12)]"
    >
      {/* Category accent bar (left) — stronger glow */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          background: `hsl(${categoryHsl})`,
          boxShadow: `0 0 8px hsl(${categoryHsl})`,
        }}
      />

      {/* Left: thumbnail */}
      <div className="relative h-full min-h-[160px] overflow-hidden md:min-h-0">
        {video ? (
          <video
            src={video.video}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${project.name} demo`}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : screenshot ? (
          <img
            src={screenshot}
            alt={`${project.name} screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : (
          <ThumbPlaceholder id={project.id} name={project.name} category={project.category} size="lg" />
        )}

        {/* Live badge (bottom-right) */}
        {project.liveUrl && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded border border-white/10 bg-black/70 px-2 py-0.5 backdrop-blur">
            <span
              aria-hidden
              className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#3ecf8e]"
            />
            <span className="font-mono text-[9px] text-white/70">live</span>
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="flex flex-col gap-2.5 p-5 md:p-8">
        <h3 className="font-mono text-[18px] md:text-[22px] font-bold tracking-tight text-white">
          {project.name}
        </h3>
        <p
          className="font-sans text-[13px] md:text-[14px] text-white/[0.45]"
          style={{ lineHeight: 1.55 }}
        >
          {project.pitch}
        </p>
        {project.techStack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-sm border border-[#3ecf8e]/10 bg-[#3ecf8e]/5 px-1.5 py-0.5 font-mono text-[8px] text-[#3ecf8e]/40"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeaturedCard;
