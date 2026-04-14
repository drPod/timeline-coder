import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  TimelineEntry,
  ProjectEntry,
  ExperienceEntry,
  PublicationEntry,
  AwardEntry,
  CertificationEntry,
  IsefEntry,
} from "@/lib/githubData";
import { getFeaturedEntry } from "@/lib/githubData";
import FeaturedCard from "./FeaturedCard";
import ProjectCard from "./ProjectCard";
import ExperienceCard from "./ExperienceCard";
import PublicationCard from "./PublicationCard";
import AwardCard from "./AwardCard";
import CertificationCard from "./CertificationCard";
import IsefCard from "./IsefCard";
import LivePreview from "./LivePreview";

type YearSectionProps = {
  year: number;
  entries: TimelineEntry[];
};

/** Returns the top 4 most-common tech stack tags across projects only. */
function getTopTechTags(projects: ProjectEntry[]): string[] {
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

const YearSection = ({ year, entries }: YearSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Split entries by kind using type narrowing
  const projects = entries.filter(
    (e): e is ProjectEntry => e.kind === "project",
  );
  const experiences = entries.filter(
    (e): e is ExperienceEntry => e.kind === "experience",
  );
  const publications = entries.filter(
    (e): e is PublicationEntry => e.kind === "publication",
  );
  const awards = entries.filter((e): e is AwardEntry => e.kind === "award");
  const certifications = entries.filter(
    (e): e is CertificationEntry => e.kind === "certification",
  );

  // Featured entry for the year (cross-kind). May be an ISEF, a project,
  // or a publication depending on what is marked featured.
  const featured = getFeaturedEntry(year);

  // Non-featured projects (shown in the grid)
  const nonFeaturedProjects = featured
    ? projects.filter((p) => p.id !== featured.id)
    : projects;

  // Non-featured publications (shown in the vertical stack)
  const nonFeaturedPublications = featured
    ? publications.filter((p) => p.id !== featured.id)
    : publications;

  const topTags = getTopTechTags(projects);

  const gridClass =
    year >= 2025
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : "grid grid-cols-1 md:grid-cols-3 gap-3.5";

  const handleProjectClick = (project: ProjectEntry) => {
    if (!project.liveUrl) return;
    setExpandedId((current) => (current === project.id ? null : project.id));
  };

  const expandedGridProject = nonFeaturedProjects.find(
    (p) => p.id === expandedId,
  );

  const featuredProjectLive =
    featured?.kind === "project" ? featured : undefined;

  const awardsAndCerts = [...awards, ...certifications];

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

        {/* Featured entry — routed by kind */}
        {featured && (
          <>
            {featured.kind === "isef" && (
              <IsefCard entry={featured as IsefEntry} />
            )}
            {featured.kind === "project" && (
              <>
                <FeaturedCard
                  project={featured as ProjectEntry}
                  onClick={() => handleProjectClick(featured as ProjectEntry)}
                />
                <AnimatePresence initial={false}>
                  {expandedId === featured.id && featuredProjectLive && (
                    <LivePreview
                      key={featured.id}
                      project={featuredProjectLive}
                      onClose={() => setExpandedId(null)}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
            {featured.kind === "publication" && (
              <div className="mb-5">
                <PublicationCard entry={featured as PublicationEntry} />
              </div>
            )}
          </>
        )}

        {/* Publications (non-featured) — vertical stack */}
        {nonFeaturedPublications.length > 0 && (
          <div className="mb-5 flex flex-col gap-3">
            {nonFeaturedPublications.map((pub) => (
              <PublicationCard key={pub.id} entry={pub} />
            ))}
          </div>
        )}

        {/* Experience — vertical stack */}
        {experiences.length > 0 && (
          <div className="mb-5 flex flex-col gap-3">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} entry={exp} />
            ))}
          </div>
        )}

        {/* Grid of regular project cards */}
        {nonFeaturedProjects.length > 0 && (
          <div className={gridClass}>
            {nonFeaturedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
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

        {/* Awards + certifications combined row */}
        {awardsAndCerts.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {awards.map((award) => (
              <AwardCard key={award.id} entry={award} />
            ))}
            {certifications.map((cert) => (
              <CertificationCard key={cert.id} entry={cert} />
            ))}
          </div>
        )}
      </section>

      {/* Year divider */}
      <div aria-hidden className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#3ecf8e]/10 to-transparent" />
      </div>
    </>
  );
};

export default YearSection;
