import { useState } from "react";

type IframeEmbedProps = {
  url: string;
  title: string;
  onOpenFullscreen?: () => void;
};

/** Truncate a URL for display in the faux browser chrome. */
function truncateUrl(url: string, maxLength = 64): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 1) + "…";
}

/**
 * Faux-browser iframe embed used for projects that have a live URL
 * (tracelight, chainviz). Red/yellow/green window dots, centered URL,
 * and an "open full" link that fires `onOpenFullscreen` so the parent
 * can mount the existing LivePreview modal.
 */
const IframeEmbed = ({ url, title, onOpenFullscreen }: IframeEmbedProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#3ecf8e]/20 bg-[rgba(6,6,8,0.9)] shadow-[0_0_40px_-10px_rgba(62,207,142,0.15)]">
      {/* Browser chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="flex-1 truncate text-center font-mono text-[10px] text-white/30">
          {truncateUrl(url)}
        </span>
        {onOpenFullscreen && (
          <button
            type="button"
            onClick={onOpenFullscreen}
            className="cursor-pointer font-mono text-[10px] text-white/30 transition-colors hover:text-[#3ecf8e]"
          >
            ⤢ fullscreen
          </button>
        )}
      </div>

      {/* Iframe — zoomed out so the whole app fits without interior scrolling.
          The iframe itself is rendered at 1/scale (~143%) and scaled down via
          CSS, so the visual result is the site at ~70% zoom. */}
      <div className="relative h-[360px] w-full overflow-hidden bg-[#020204] sm:h-[480px] md:h-[540px]">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="font-mono text-[11px] text-white/30">
              loading live demo…
            </span>
          </div>
        )}
        <iframe
          src={url}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 border-0"
          style={{
            width: "142.857%",  // 100 / 0.7
            height: "142.857%",
            transform: "scale(0.7)",
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
};

export default IframeEmbed;
