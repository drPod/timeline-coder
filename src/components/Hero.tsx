import { motion } from "framer-motion";
import { Github, Linkedin, FileText, ChevronDown } from "lucide-react";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useGlitchName } from "@/hooks/useGlitchName";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FileText, href: "/resume.pdf", label: "Resume" },
];

const Hero = () => {
  const { text, cursor } = useTypingAnimation();
  const { isGlitching, handleClick } = useGlitchName();

  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-6">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(142 70% 45% / 0.15) 2px, hsl(142 70% 45% / 0.15) 4px)",
        }}
      />

      {/* CRT vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,hsl(0_0%_0%/0.4))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center"
      >
        {/* PGP-style name block */}
        <div
          onClick={handleClick}
          className={`mx-auto mb-6 cursor-default select-none ${isGlitching ? "glitch-effect" : ""}`}
        >
          <pre className="font-mono text-[10px] leading-tight text-primary/40 sm:text-xs">
            {"-----BEGIN PGP SIGNATURE-----"}
          </pre>
          <h1 className="my-2 font-mono text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Darsh Poddar
          </h1>
          <pre className="font-mono text-[10px] leading-tight text-muted-foreground sm:text-xs">
            {"Student at UIUC"}
          </pre>
          <pre className="font-mono text-[10px] leading-tight text-muted-foreground/50 sm:text-xs">
            {"Fingerprint: 4D41 5448 2B43 5340 5549 5543"}
          </pre>
          <pre className="font-mono text-[10px] leading-tight text-primary/40 sm:text-xs">
            {"-----END PGP SIGNATURE-----"}
          </pre>
        </div>

        {/* Typing animation tagline */}
        <div className="mx-auto h-6 max-w-lg">
          <p className="font-mono text-sm text-primary sm:text-base">
            {text}
            <span className="text-primary">{cursor}</span>
          </p>
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-lg border border-border bg-secondary/50 p-3 text-muted-foreground transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:text-foreground hover:shadow-[0_0_20px_-5px_hsl(var(--commit-glow)/0.3)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6 font-mono text-[10px] text-muted-foreground/40"
        >
          press <kbd className="rounded border border-border px-1 py-0.5 text-muted-foreground/60">Ctrl+/</kbd> to open command palette
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
