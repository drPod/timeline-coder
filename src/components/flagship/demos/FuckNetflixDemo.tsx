import { useEffect, useRef, useState } from "react";

/**
 * Mock desktop UI for FuckNetflix. A faux Electron window with a search
 * bar streaming a query, torrent results populating row by row, a local
 * SmolLM pick glowing, then a player pane fading in with a progress
 * bar ticking. Loops every ~18s.
 */

type TorrentRow = {
  title: string;
  size: string;
  seeders: number;
  quality: string;
  picked?: boolean;
};

const QUERY = "the matrix 1999";

const RESULTS: TorrentRow[] = [
  {
    title: "The.Matrix.1999.2160p.UHD.BluRay.x265.HDR-PSA",
    size: "18.4 GB",
    seeders: 612,
    quality: "4K",
  },
  {
    title: "The.Matrix.1999.1080p.BluRay.x264-AMIABLE",
    size: "2.18 GB",
    seeders: 1_432,
    quality: "1080p",
    picked: true,
  },
  {
    title: "The Matrix (1999) 720p BluRay YIFY",
    size: "933 MB",
    seeders: 842,
    quality: "720p",
  },
  {
    title: "The.Matrix.1999.DVDRip.XviD-FLAWL3SS",
    size: "1.37 GB",
    seeders: 48,
    quality: "DVD",
  },
  {
    title: "matrix-1999-CAM-ugly-dont-use.mkv",
    size: "642 MB",
    seeders: 3,
    quality: "CAM",
  },
];

// Phases: search → rows filling → ai pick glow → player pane
type Phase = "typing" | "results" | "picking" | "playing";

const PHASE_DURATIONS: Record<Phase, number> = {
  typing: 1_600,
  results: 2_200,
  picking: 1_400,
  playing: 10_000,
};

const FuckNetflixDemo = () => {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedLen, setTypedLen] = useState(0);
  const [rowsShown, setRowsShown] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    clearAll();

    if (phase === "typing") {
      setTypedLen(0);
      setRowsShown(0);
      setProgress(0);
      // Type one char every ~80ms
      for (let i = 1; i <= QUERY.length; i++) {
        timers.current.push(
          setTimeout(() => setTypedLen(i), 100 + i * 80),
        );
      }
      timers.current.push(
        setTimeout(() => setPhase("results"), PHASE_DURATIONS.typing),
      );
    }

    if (phase === "results") {
      setRowsShown(0);
      // Reveal one row every ~360ms
      for (let i = 1; i <= RESULTS.length; i++) {
        timers.current.push(
          setTimeout(() => setRowsShown(i), 200 + i * 380),
        );
      }
      timers.current.push(
        setTimeout(() => setPhase("picking"), PHASE_DURATIONS.results),
      );
    }

    if (phase === "picking") {
      // Just hold on the glow, then transition to playing
      timers.current.push(
        setTimeout(() => setPhase("playing"), PHASE_DURATIONS.picking),
      );
    }

    if (phase === "playing") {
      setProgress(0);
      // Tick progress bar over ~9s, 60 ticks
      for (let i = 1; i <= 60; i++) {
        timers.current.push(
          setTimeout(() => setProgress(i / 60), (i * 9_000) / 60),
        );
      }
      timers.current.push(
        setTimeout(() => setPhase("typing"), PHASE_DURATIONS.playing),
      );
    }

    return clearAll;
  }, [phase]);

  const typed = QUERY.slice(0, typedLen);
  const showCursor = phase === "typing" && typedLen < QUERY.length;
  const showPlayer = phase === "playing";
  const aiGlow = phase === "picking" || phase === "playing";

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#ff3b3b]/25 bg-[#0a0405] shadow-[0_0_40px_-10px_rgba(255,59,59,0.25)]"
      role="img"
      aria-label="FuckNetflix desktop demo: search, AI-picked torrent, playback"
    >
      {/* Window chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-[#0f0607] px-3">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ background: "#ff5f57" }}
        />
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ background: "#febc2e" }}
        />
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ background: "#28c840" }}
        />
        <span className="flex-1 truncate text-center font-mono text-[10px] text-white/30">
          FuckNetflix — no DRM, no API keys
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#120609] to-[#060203]">
        {/* Search bar */}
        <div className="border-b border-white/5 px-4 py-3">
          <label
            htmlFor="fn-search"
            className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff3b3b]/60"
          >
            search torrents
          </label>
          <div className="flex items-center gap-2 rounded border border-[#ff3b3b]/20 bg-black/50 px-3 py-2">
            <svg
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-[#ff3b3b]/70"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" strokeLinecap="round" />
            </svg>
            <div
              id="fn-search"
              className="flex-1 font-mono text-[12px] text-white/85"
            >
              {typed}
              {showCursor && (
                <span
                  aria-hidden
                  className="inline-block h-[12px] w-[6px] translate-y-[1px] animate-pulse bg-[#ff3b3b]"
                />
              )}
              {!showCursor && typed.length === 0 && (
                <span className="text-white/25">search magnets…</span>
              )}
            </div>
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-white/30">
              ↵ go
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-hidden px-4 pt-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
              results
            </span>
            {aiGlow && (
              <span className="flex items-center gap-1.5 font-mono text-[9px] text-[#ff3b3b]/80">
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#ff3b3b]"
                />
                SmolLM2 picked the best match
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {RESULTS.slice(0, rowsShown).map((r, i) => {
              const highlight = r.picked && aiGlow;
              return (
                <div
                  key={r.title}
                  style={{
                    transition: "all 260ms ease",
                  }}
                  className={[
                    "group flex items-center gap-3 rounded border px-3 py-2",
                    highlight
                      ? "border-[#ff3b3b]/50 bg-[#ff3b3b]/[0.07] shadow-[0_0_18px_-4px_rgba(255,59,59,0.5)]"
                      : "border-white/5 bg-white/[0.015]",
                  ].join(" ")}
                >
                  <span className="w-5 shrink-0 text-right font-mono text-[9px] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 truncate font-mono text-[11px] text-white/80">
                    {r.title}
                  </span>

                  <span className="hidden shrink-0 items-center gap-2 md:flex">
                    <span className="font-mono text-[9px] text-white/40">
                      {r.size}
                    </span>
                    <span
                      className={[
                        "rounded-sm px-1.5 py-0.5 font-mono text-[9px]",
                        r.quality === "4K"
                          ? "border border-[#ff3b3b]/30 bg-[#ff3b3b]/10 text-[#ff3b3b]/80"
                          : r.quality === "CAM"
                            ? "border border-white/10 bg-white/[0.04] text-white/35"
                            : "border border-white/10 bg-white/[0.04] text-white/55",
                      ].join(" ")}
                    >
                      {r.quality}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9px] text-[#3ecf8e]/70">
                      <span
                        aria-hidden
                        className="h-[5px] w-[5px] rounded-full bg-[#3ecf8e]/60"
                      />
                      {r.seeders.toLocaleString()}
                    </span>
                  </span>

                  {highlight && (
                    <span className="shrink-0 rounded border border-[#ff3b3b]/40 bg-[#ff3b3b]/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-[#ff3b3b]/90">
                      AI picked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Player pane */}
        <div
          className="border-t border-white/5 px-4 py-3"
          style={{
            opacity: showPlayer ? 1 : 0,
            transform: showPlayer ? "translateY(0)" : "translateY(8px)",
            transition: "all 420ms ease",
          }}
        >
          <div className="rounded border border-[#ff3b3b]/25 bg-black/60 p-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="pause"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ff3b3b]/40 bg-[#ff3b3b]/10 text-[#ff3b3b]/90"
                tabIndex={-1}
              >
                <span className="flex items-center gap-[2px]">
                  <span className="h-3 w-[2px] bg-current" />
                  <span className="h-3 w-[2px] bg-current" />
                </span>
              </button>

              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[11px] text-white/85">
                  The.Matrix.1999.1080p.BluRay.x264-AMIABLE.mkv
                </div>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[9px] text-white/40">
                  <span>mpv · hardware accelerated</span>
                  <span className="text-white/20">·</span>
                  <span>1,432 seeds</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#3ecf8e]/70">streaming</span>
                </div>
              </div>

              <div className="hidden shrink-0 font-mono text-[10px] text-white/50 md:block">
                {Math.floor(progress * 136)
                  .toString()
                  .padStart(2, "0")}
                :
                {Math.floor(((progress * 136) % 1) * 60)
                  .toString()
                  .padStart(2, "0")}
                <span className="text-white/20"> / 2:16:00</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1 overflow-hidden rounded-sm bg-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-[#ff3b3b]/70 to-[#ff3b3b]"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  transition: "width 0.14s linear",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuckNetflixDemo;
