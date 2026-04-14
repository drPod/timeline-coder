type VideoDemoProps = {
  src: string;
  poster?: string;
  label?: string;
};

/**
 * Video fallback for flagship projects that have a demo clip but whose
 * live URL doesn't iframe well (or doesn't exist). autoplays muted +
 * looped, no controls — pure eye-candy.
 */
const VideoDemo = ({ src, poster, label }: VideoDemoProps) => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#3ecf8e]/20 bg-[rgba(6,6,8,0.9)] shadow-[0_0_40px_-10px_rgba(62,207,142,0.15)]">
      {/* Browser chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="flex-1 truncate text-center font-mono text-[10px] text-white/30">
          {label ?? "demo reel"}
        </span>
      </div>

      <div className="relative h-[480px] w-full bg-black md:h-[540px]">
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default VideoDemo;
