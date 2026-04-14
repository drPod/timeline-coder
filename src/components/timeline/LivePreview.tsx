import { useEffect } from "react";
import { motion } from "framer-motion";
import type { ProjectEntry } from "@/lib/githubData";

type LivePreviewProps = {
  project: ProjectEntry;
  onClose: () => void;
};

/** Truncate a URL for display in the browser chrome bar. */
function truncateUrl(url: string, maxLength = 80): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 1) + "…";
}

const LivePreview = ({ project, onClose }: LivePreviewProps) => {
  // Escape key closes the modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (!project.liveUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[88vh] max-h-[800px] w-[92vw] max-w-[1200px] flex-col overflow-hidden rounded-xl border border-[#3ecf8e]/25 bg-[rgba(6,6,8,0.95)] shadow-[0_0_60px_-10px_rgba(62,207,142,0.25)]"
      >
        {/* Browser chrome bar */}
        <div className="flex h-10 items-center gap-2.5 border-b border-white/5 bg-white/[0.02] px-4">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
          <span className="flex-1 truncate text-center font-mono text-[11px] text-white/30">
            {truncateUrl(project.liveUrl)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-2 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
          >
            ✕ close  esc
          </button>
        </div>

        {/* iframe */}
        <div className="w-full flex-1 bg-[#020204]">
          <iframe
            src={project.liveUrl}
            loading="eager"
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="h-full w-full border-0"
            title={project.name}
          />
        </div>

        {/* Actions bar */}
        <div className="flex h-10 items-center gap-3.5 border-t border-white/5 px-4">
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
    </motion.div>
  );
};

export default LivePreview;
