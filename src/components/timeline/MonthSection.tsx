import { motion } from "framer-motion";
import type {
  TimelineEntry,
  ProjectEntry,
  ExperienceEntry,
  PublicationEntry,
  AwardEntry,
  CertificationEntry,
  IsefEntry,
  ContributionEntry,
} from "@/lib/githubData";
import ProjectCard from "./ProjectCard";
import ExperienceCard from "./ExperienceCard";
import PublicationCard from "./PublicationCard";
import AwardCard from "./AwardCard";
import CertificationCard from "./CertificationCard";
import IsefCard from "./IsefCard";
import ContributionCard from "./ContributionCard";

const MONTH_LABEL: Record<number, string> = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

type MonthSectionProps = {
  year: number;
  month: number; // 1-12
  entries: TimelineEntry[];
  onOpenPreview: (project: ProjectEntry) => void;
  /** True when this is the first month rendered for its year. */
  showYear?: boolean;
};

const MonthSection = ({
  year,
  month,
  entries,
  onOpenPreview,
  showYear = false,
}: MonthSectionProps) => {
  // Split entries by kind via type narrowing
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
  const isefs = entries.filter((e): e is IsefEntry => e.kind === "isef");
  const contributions = entries.filter(
    (e): e is ContributionEntry => e.kind === "contribution",
  );

  if (entries.length === 0) return null;

  const handleProjectClick = (project: ProjectEntry) => {
    // Open the preview modal regardless of liveUrl — the modal falls back
    // to rendering the project's README when there's no live demo.
    onOpenPreview(project);
  };

  const monthLabel = MONTH_LABEL[month] ?? "";
  const headerLabel = showYear ? `${monthLabel} ${year}` : monthLabel;

  const awardsAndCerts = [...awards, ...certifications];

  return (
    <section className="mb-10 pt-2">
      {/* Month header — minimal monospace marker with rule */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-4 flex items-center gap-3"
      >
        <h3
          className={
            showYear
              ? "font-mono text-[13px] font-semibold uppercase tracking-[0.22em] text-[#3ecf8e]/70"
              : "font-mono text-[11px] uppercase tracking-[0.2em] text-[#3ecf8e]/40"
          }
        >
          {headerLabel}
        </h3>
        <span
          aria-hidden
          className={
            showYear
              ? "h-px flex-1 bg-gradient-to-r from-[#3ecf8e]/25 via-[#3ecf8e]/10 to-transparent"
              : "h-px flex-1 bg-gradient-to-r from-[#3ecf8e]/15 to-transparent"
          }
        />
      </motion.div>

      {/* ISEF (full-width) */}
      {isefs.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {isefs.map((entry) => (
            <IsefCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Publications (full-width vertical stack) */}
      {publications.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} entry={pub} />
          ))}
        </div>
      )}

      {/* Experience (full-width vertical stack) */}
      {experiences.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} entry={exp} />
          ))}
        </div>
      )}

      {/* Projects — all rendered as ProjectCard regardless of featured flag.
          Tighter grid since a single month rarely has more than a few. */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      {/* Open-source contributions */}
      {contributions.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4b6bfc]/60">
            &gt; open source
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {contributions.map((c) => (
              <ContributionCard key={c.id} entry={c} />
            ))}
          </div>
        </div>
      )}

      {/* Awards + certifications combined row */}
      {awardsAndCerts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {awards.map((award) => (
            <AwardCard key={award.id} entry={award} />
          ))}
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} entry={cert} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MonthSection;
