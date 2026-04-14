import type { IsefEntry } from "@/lib/githubData";

type IsefCardProps = {
  entry: IsefEntry;
};

/** Decorative placeholder — stylized crystal/diamond drawn with SVG lines. */
const ModelPlaceholder = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
      className="opacity-40"
    >
      <g stroke="currentColor" strokeWidth="1" className="text-[#9b5bff]/60">
        {/* Top apex */}
        <line x1="48" y1="8" x2="16" y2="36" />
        <line x1="48" y1="8" x2="80" y2="36" />
        <line x1="48" y1="8" x2="48" y2="36" />
        {/* Upper ring */}
        <line x1="16" y1="36" x2="48" y2="36" />
        <line x1="48" y1="36" x2="80" y2="36" />
        <line x1="16" y1="36" x2="80" y2="36" />
        {/* Lower crystal */}
        <line x1="16" y1="36" x2="48" y2="88" />
        <line x1="80" y1="36" x2="48" y2="88" />
        <line x1="48" y1="36" x2="48" y2="88" />
      </g>
    </svg>
    <div className="text-center">
      <div className="font-mono text-[11px] text-white/20">QKD APPARATUS</div>
      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/15">
        3D model coming
      </div>
    </div>
  </div>
);

const IsefCard = ({ entry }: IsefCardProps) => {
  return (
    <div className="group relative mb-5 grid min-h-[240px] grid-cols-1 overflow-hidden rounded-xl border border-white/5 bg-[rgba(6,6,8,0.9)] backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-px hover:border-[#3ecf8e]/20 hover:shadow-[0_0_24px_-6px_rgba(62,207,142,0.12)] md:grid-cols-2">
      {/* Left accent bar */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-[#3ecf8e]/60"
        style={{
          boxShadow: "0 0 12px rgba(62,207,142,0.5)",
        }}
      />

      {/* Left: 3D model placeholder area */}
      <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden bg-gradient-to-br from-[rgba(155,91,255,0.08)] to-[rgba(62,207,142,0.05)] md:min-h-0">
        {entry.modelUrl ? (
          // Placeholder slot for an actual 3D model — will be replaced with
          // <model-viewer> or similar later. For now, render as iframe.
          <iframe
            src={entry.modelUrl}
            title={`${entry.name} 3D model`}
            className="h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <ModelPlaceholder />
        )}
      </div>

      {/* Right: content */}
      <div className="flex flex-col gap-0 p-6 md:p-8">
        {/* Label */}
        <div className="font-mono text-[9px] uppercase tracking-wider text-[#9b5bff]/60">
          SCIENCE FAIR
        </div>

        {/* Name */}
        <h3 className="mt-2 font-mono text-[24px] font-bold leading-tight tracking-tight text-white">
          {entry.name}
        </h3>

        {/* Pitch */}
        <p
          className="mt-2 font-sans text-[14px] text-white/50"
          style={{ lineHeight: 1.55 }}
        >
          {entry.pitch}
        </p>

        {/* Description */}
        <p
          className="mt-3 font-sans text-[12px] text-white/35"
          style={{ lineHeight: 1.6 }}
        >
          {entry.description}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex flex-col gap-1.5 font-mono text-[10px]">
          <span className="text-white/40">
            {entry.fair} · {entry.grade} · {entry.category}
          </span>
          {entry.coAuthors && entry.coAuthors.length > 0 && (
            <span className="text-white/25">
              with {entry.coAuthors.join(", ")}
            </span>
          )}
        </div>

        {/* Tech stack */}
        {entry.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {entry.techStack.map((tech) => (
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
    </div>
  );
};

export default IsefCard;
