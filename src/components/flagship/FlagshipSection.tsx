import { motion } from "framer-motion";
import type { FlagshipProject } from "@/data/flagships";
import { flagshipProjects } from "@/data/flagships";
import IframeEmbed from "./demos/IframeEmbed";
import VideoDemo from "./demos/VideoDemo";
import GhostroomDemo from "./demos/GhostroomDemo";
import ColdshotDemo from "./demos/ColdshotDemo";
import StormchainDemo from "./demos/StormchainDemo";
import FuckNetflixDemo from "./demos/FuckNetflixDemo";

type FlagshipSectionProps = {
  /**
   * Called when the user hits "open full" on an iframe-demo. Parent
   * wires this to the LivePreview modal that already lives on Index.
   */
  onOpenLive?: (project: FlagshipProject) => void;
};

const FlagshipSection = ({ onOpenLive }: FlagshipSectionProps) => {
  return (
    <section
      aria-label="Flagship projects"
      className="relative z-[2] bg-[rgba(0,0,0,0.88)]"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="pt-16 pb-4"
        >
          <div className="flex items-baseline gap-3 border-b border-[#3ecf8e]/10 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#3ecf8e]/70">
              flagship · {flagshipProjects.length} projects
            </span>
            <span className="font-mono text-[10px] text-white/25">
              the ones worth scrolling
            </span>
          </div>
        </motion.div>

        {/* Each flagship as a full-bleed panel */}
        {flagshipProjects.map((p, idx) => (
          <FlagshipPanel
            key={p.id}
            project={p}
            index={idx}
            onOpenLive={onOpenLive}
          />
        ))}
      </div>
    </section>
  );
};

type FlagshipPanelProps = {
  project: FlagshipProject;
  index: number;
  onOpenLive?: (project: FlagshipProject) => void;
};

const FlagshipPanel = ({ project, index, onOpenLive }: FlagshipPanelProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex min-h-[88vh] flex-col justify-center border-b border-white/[0.04] py-14 md:py-20"
    >
      {/* Year + index */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 md:mb-5 md:text-[11px]">
        <span className="text-[#3ecf8e]/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-white/20">/</span>
        <span>{project.year}</span>
        <span className="text-white/20">·</span>
        <span>{project.name}</span>
      </div>

      {/* Tagline */}
      <h2
        className="font-mono font-bold leading-[1.02] tracking-tight text-white"
        style={{ fontSize: "clamp(32px, 5.2vw, 64px)", letterSpacing: "-0.02em" }}
      >
        {project.tagline}
      </h2>

      {/* Story */}
      <p
        className="mt-5 max-w-[640px] font-sans text-[15px] text-white/60 md:text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        {project.story}
      </p>

      {/* Two-column split */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:gap-8 lg:grid-cols-5">
        {/* Demo column — 3/5 width on large */}
        <div className="lg:col-span-3">
          <DemoPicker project={project} onOpenLive={onOpenLive} />
        </div>

        {/* Architecture + stats — 2/5 width on large */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3ecf8e]/60">
              architecture
            </div>
            <ul className="flex flex-col gap-2.5">
              {project.architecture.map((bullet, i) => (
                <li
                  key={i}
                  className="relative pl-4 font-mono text-[12px] leading-[1.55] text-white/70"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[8px] h-[4px] w-[4px] rounded-sm bg-[#3ecf8e]/50"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3ecf8e]/60">
              by the numbers
            </div>
            <div className="grid grid-cols-2 gap-2">
              {project.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded border border-white/[0.06] bg-white/[0.015] px-3 py-2"
                >
                  <div className="font-mono text-[9px] uppercase tracking-wider text-white/35">
                    {s.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[17px] font-bold text-white">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links row */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/5 pt-5">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
        >
          github →
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
          >
            live →
          </a>
        )}
        {project.paperUrl && (
          <a
            href={project.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
          >
            paper →
          </a>
        )}
        {project.devpostUrl && (
          <a
            href={project.devpostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
          >
            devpost →
          </a>
        )}
        <span className="ml-auto font-mono text-[10px] text-white/20">
          {project.name} · {project.year}
        </span>
      </div>
    </motion.article>
  );
};

/** Picks the right demo component for the flagship's demoKind. */
const DemoPicker = ({
  project,
  onOpenLive,
}: {
  project: FlagshipProject;
  onOpenLive?: (project: FlagshipProject) => void;
}) => {
  switch (project.demoKind) {
    case "iframe":
      if (!project.iframeUrl) return null;
      return (
        <IframeEmbed
          url={project.iframeUrl}
          title={project.name}
          onOpenFullscreen={
            onOpenLive ? () => onOpenLive(project) : undefined
          }
          posterSrc={project.videoPoster}
        />
      );
    case "video":
      if (!project.videoSrc) return null;
      return (
        <VideoDemo
          src={project.videoSrc}
          poster={project.videoPoster}
          label={`${project.name} demo`}
        />
      );
    case "ghostroom":
      return <GhostroomDemo />;
    case "coldshot":
      return <ColdshotDemo />;
    case "stormchain":
      return <StormchainDemo />;
    case "fucknetflix":
      return <FuckNetflixDemo />;
    default:
      return null;
  }
};

export default FlagshipSection;
