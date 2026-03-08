import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import StatsCounter from "@/components/StatsCounter";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import { useKonamiCode } from "@/hooks/useKonamiCode";

const Index = () => {
  const { crtMode, toggleCrt } = useKonamiCode();
  const [commandOpen, setCommandOpen] = useState(false);

  // Ctrl+/ (or Cmd+/) to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 ${crtMode ? "crt-mode" : ""}`}>
      <Hero />
      <StatsCounter />
      <Timeline />
      <Footer />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onToggleCrt={toggleCrt}
      />

      {crtMode && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(142 70% 45% / 0.3) 2px, hsl(142 70% 45% / 0.3) 4px)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(0_0%_0%/0.6))]" />
        </div>
      )}
    </div>
  );
};

export default Index;
