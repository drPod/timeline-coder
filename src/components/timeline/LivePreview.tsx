import { Suspense, lazy, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { ProjectEntry } from "@/lib/githubData";
import readmesData from "@/data/readmes.json";

// ReadmeView pulls in react-markdown + remark-gfm + rehype-highlight
// (~200KB). Only loaded when a user actually opens a README modal.
const ReadmeView = lazy(() => import("@/components/preview/ReadmeView"));

type LivePreviewProps = {
  project: ProjectEntry;
  onClose: () => void;
};

type ReadmeEntry = { content: string; branch: string; repo: string };
const readmes = readmesData as Record<string, ReadmeEntry>;

/** Truncate a URL for display in the browser chrome bar. */
function truncateUrl(url: string, maxLength = 80): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 1) + "…";
}

/** Infer the repo name from a GitHub URL like https://github.com/drPod/Phantom */
function repoNameFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(/github\.com\/[^/]+\/([^/#?]+)/i);
  return m ? m[1] : null;
}

const LivePreview = ({ project, onClose }: LivePreviewProps) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  const readmeEntry = useMemo(() => {
    const byId = readmes[project.id];
    if (byId) return byId;
    const repoFromUrl = repoNameFromUrl(project.repoUrl);
    if (repoFromUrl && readmes[repoFromUrl]) return readmes[repoFromUrl];
    return null;
  }, [project.id, project.repoUrl]);

  const hasLive = !!project.liveUrl;
  const hasReadme = !!readmeEntry;

  const chromeUrl = hasLive
    ? project.liveUrl!
    : hasReadme
      ? `github.com/drPod/${readmeEntry!.repo}/README.md`
      : `github.com/drPod/${project.id}`;

  const readmeGithubUrl = hasReadme
    ? `https://github.com/drPod/${readmeEntry!.repo}/blob/${readmeEntry!.branch}/README.md`
    : null;

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
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="group relative flex h-3 w-3 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ background: "#ff5f57" }}
          >
            <span className="font-mono text-[8px] font-bold text-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              ×
            </span>
          </button>
          <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
          <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
          <span className="flex-1 truncate text-center font-mono text-[11px] text-white/30">
            {truncateUrl(chromeUrl)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-2 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
          >
            ✕ close  esc
          </button>
        </div>

        {/* Body — iframe if live, README if not, fallback otherwise */}
        <div className="w-full flex-1 overflow-y-auto bg-[#020204]">
          {hasLive ? (
            <iframe
              src={project.liveUrl}
              loading="eager"
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="h-full w-full border-0"
              title={project.name}
            />
          ) : hasReadme ? (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <span className="font-mono text-[11px] text-white/30">
                    loading readme…
                  </span>
                </div>
              }
            >
              <ReadmeView
                repo={readmeEntry!.repo}
                branch={readmeEntry!.branch}
                content={readmeEntry!.content}
              />
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-center">
              <div className="flex max-w-md flex-col gap-3">
                <h3 className="font-mono text-[18px] font-bold text-white">
                  {project.name}
                </h3>
                <p className="font-sans text-[13px] leading-relaxed text-white/50">
                  {project.pitch}
                </p>
                <p className="pt-2 font-mono text-[10px] text-white/25">
                  no live demo, no README on github
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="flex h-10 flex-wrap items-center gap-3.5 border-t border-white/5 px-4">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
          >
            github →
          </a>
          {hasLive && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
            >
              open full →
            </a>
          )}
          {!hasLive && readmeGithubUrl && (
            <a
              href={readmeGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-[#3ecf8e]/70 transition-colors hover:text-[#3ecf8e]"
            >
              readme on github →
            </a>
          )}
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
