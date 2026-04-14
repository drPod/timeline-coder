import { motion } from "framer-motion";
import type { Project } from "@/lib/githubData";
import {
  getCategoryColor,
  getCategoryGlow,
  getScreenshotPath,
  getVideoPaths,
} from "@/lib/githubData";
import ThumbPlaceholder from "./ThumbPlaceholder";

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const categoryHsl = getCategoryColor(project.category);
  const categoryGlow = getCategoryGlow(project.category);
  const techBadges = project.techStack.slice(0, 4);
  const video = getVideoPaths(project.id);
  const screenshot = getScreenshotPath(project.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#3ecf8e]/20 hover:shadow-[0_0_24px_-6px_rgba(62,207,142,0.12)]"
    >
      {/* Category accent bar (left) */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          background: `hsl(${categoryHsl})`,
          boxShadow: categoryGlow,
        }}
      />

      {/* Thumbnail area */}
      <div className="relative h-[100px] overflow-hidden">
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
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : screenshot ? (
          <img
            src={screenshot}
            alt={`${project.name} screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : (
          <ThumbPlaceholder id={project.id} name={project.name} category={project.category} size="sm" />
        )}

        {/* Live badge (top-right) */}
        {project.liveUrl && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded border border-white/10 bg-black/70 px-2 py-0.5 backdrop-blur">
            <span
              aria-hidden
              className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#3ecf8e]"
            />
            <span className="font-mono text-[9px] text-white/70">live</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-1.5 p-3">
        <h4 className="font-mono text-[13px] font-bold text-white">
          {project.name}
        </h4>
        <p className="font-sans text-[11px] leading-snug text-white/[0.35] line-clamp-3">
          {project.pitch}
        </p>
        {techBadges.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {techBadges.map((tech) => (
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
    </motion.article>
  );
};

export default ProjectCard;
