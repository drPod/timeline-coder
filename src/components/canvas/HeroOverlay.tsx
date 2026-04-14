import { motion } from "framer-motion";
import { Github, Linkedin, FileText } from "lucide-react";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useGlitchName } from "@/hooks/useGlitchName";
import { getProjectStats } from "@/lib/githubData";

const socialLinks = [
  { icon: Github, href: "https://github.com/drPod", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/darshpoddar", label: "LinkedIn" },
  { icon: FileText, href: "/resume.pdf", label: "Resume" },
];

const HeroOverlay = () => {
  const { text, cursor } = useTypingAnimation();
  const { isGlitching, handleClick } = useGlitchName();
  const stats = getProjectStats();

  return (
    <section
      className="pointer-events-none relative z-[2] flex h-screen flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center text-center"
      >
        {/* PGP block top */}
        <pre className="font-mono text-[10px] leading-tight text-[#3ecf8e]/30">
          {"-----BEGIN PGP SIGNATURE-----"}
        </pre>

        {/* Name */}
        <div
          onClick={handleClick}
          className={`pointer-events-auto my-2 cursor-default select-none ${isGlitching ? "glitch-effect" : ""}`}
        >
          <h1
            className="font-mono font-bold text-white"
            style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
          >
            Darsh Poddar
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-mono text-[12px] text-white/30">
          Student at UIUC
        </p>

        {/* Fingerprint */}
        <p className="font-mono text-[10px] text-white/[0.12]">
          Fingerprint: 4D41 5448 2B43 5340 5549 5543
        </p>

        {/* PGP block bottom */}
        <pre className="font-mono text-[10px] leading-tight text-[#3ecf8e]/30">
          {"-----END PGP SIGNATURE-----"}
        </pre>

        {/* Typing animation */}
        <div className="mt-4 h-[20px]">
          <p className="font-mono text-[13px] text-[#3ecf8e]">
            {text}
            <span>{cursor}</span>
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[22px] font-bold text-[#3ecf8e]">
              {stats.repos}
            </span>
            <span className="font-mono text-[9px] uppercase text-white/[0.22]">
              repos
            </span>
          </div>
          <div className="h-[22px] w-px bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="font-mono text-[22px] font-bold text-[#3ecf8e]">
              {stats.years}
            </span>
            <span className="font-mono text-[9px] uppercase text-white/[0.22]">
              years
            </span>
          </div>
          <div className="h-[22px] w-px bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="font-mono text-[22px] font-bold text-[#3ecf8e]">
              {stats.languages}
            </span>
            <span className="font-mono text-[9px] uppercase text-white/[0.22]">
              languages
            </span>
          </div>
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 flex items-center gap-3"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="pointer-events-auto flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/10 text-white/60 transition-all duration-200 hover:border-[#3ecf8e]/50 hover:text-white hover:shadow-[0_0_12px_-3px_#3ecf8e]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </motion.div>

      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-[28px] flex flex-col items-center gap-1"
      >
        <span className="font-mono text-[9px] uppercase text-white/[0.15]">
          scroll
        </span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="font-mono text-[12px] text-white/[0.15]"
        >
          ↓
        </motion.span>
      </motion.div>

      {/* Konami code hint — subtle, bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-6 hidden font-mono text-[9px] tracking-wider text-white/[0.12] md:block"
      >
        ↑↑↓↓←→←→BA
      </div>
    </section>
  );
};

export default HeroOverlay;
