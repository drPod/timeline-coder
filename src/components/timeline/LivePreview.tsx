import { motion } from "framer-motion";
import type { Project } from "@/lib/githubData";

type LivePreviewProps = {
  project: Project;
  onClose: () => void;
};

/** Truncate a URL for display in the browser chrome bar. */
function truncateUrl(url: string, maxLength = 60): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 1) + "…";
}

const LivePreview = ({ project, onClose }: LivePreviewProps) => {
  if (!project.liveUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="my-4 overflow-hidden rounded-xl border border-[#3ecf8e]/20 bg-[rgba(6,6,8,0.94)] shadow-[0_0_30px_-8px_rgba(62,207,142,0.12)] backdrop-blur-sm"
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2.5 border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="flex-1 text-center font-mono text-[11px] text-white/30">
          {truncateUrl(project.liveUrl)}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer font-mono text-[11px] text-white/25 transition-colors hover:text-white/50"
        >
          ✕ close
        </button>
      </div>

      {/* iframe */}
      <div className="h-[440px] w-full bg-[#020204]">
        <iframe
          src={project.liveUrl}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="h-full w-full border-0"
          title={`${project.name} live preview`}
        />
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-3.5 border-t border-white/5 px-4 py-2.5">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
        >
          github →
        </a>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
        >
          open full →
        </a>
        {project.techStack.length > 0 && (
          <span className="ml-auto font-mono text-[10px] text-white/15">
            {project.techStack.join(" · ")}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default LivePreview;
