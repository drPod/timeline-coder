import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/githubData";
import FeaturedCard from "./FeaturedCard";
import ProjectCard from "./ProjectCard";
import LivePreview from "./LivePreview";

type YearSectionProps = {
  year: number;
  projects: Project[];
};

/** Returns the top 4 most-common tech stack tags across all projects. */
function getTopTechTags(projects: Project[]): string[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const tech of p.techStack) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);
}

const YearSection = ({ year, projects }: YearSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const featured = projects.find((p) => p.featured);
  const rest = featured ? projects.filter((p) => p.id !== featured.id) : projects;
  const topTags = getTopTechTags(projects);

  const gridClass =
    year >= 2025
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : "grid grid-cols-1 md:grid-cols-3 gap-3.5";

  const handleCardClick = (project: Project) => {
    if (!project.liveUrl) return;
    setExpandedId((current) => (current === project.id ? null : project.id));
  };

  const expandedGridProject = rest.find((p) => p.id === expandedId);

  return (
    <>
      <section className="mb-14 pt-6">
        {/* Year header */}
        <div className="mb-7 flex items-baseline gap-4 border-b border-[#3ecf8e]/10 pb-5">
          <span className="font-mono text-[48px] md:text-[64px] font-bold leading-none tracking-tight text-white/[0.06]">
            {year}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[12px] tracking-wide text-[#3ecf8e]/50">
              {projects.length} projects shipped
            </span>
            {topTags.length > 0 && (
              <span className="font-mono text-[10px] text-white/[0.15]">
                {topTags.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Featured card */}
        {featured && (
          <>
            <FeaturedCard
              project={featured}
              onClick={() => handleCardClick(featured)}
            />
            <AnimatePresence initial={false}>
              {expandedId === featured.id && (
                <LivePreview
                  key={featured.id}
                  project={featured}
                  onClose={() => setExpandedId(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Grid of regular cards */}
        {rest.length > 0 && (
          <div className={gridClass}>
            {rest.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
              />
            ))}
          </div>
        )}

        {/* Preview for expanded grid card (renders below the grid, full width) */}
        <AnimatePresence initial={false}>
          {expandedGridProject && (
            <LivePreview
              key={expandedGridProject.id}
              project={expandedGridProject}
              onClose={() => setExpandedId(null)}
            />
          )}
        </AnimatePresence>
      </section>

      {/* Year divider */}
      <div aria-hidden className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#3ecf8e]/10 to-transparent" />
      </div>
    </>
  );
};

export default YearSection;
