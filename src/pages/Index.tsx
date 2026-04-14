import { useState, useEffect } from "react";
import BinaryCanvas from "@/components/canvas/BinaryCanvas";
import HeroOverlay from "@/components/canvas/HeroOverlay";
import YearSection from "@/components/timeline/YearSection";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { getProjectsByYear } from "@/lib/githubData";

const Index = () => {
  const { crtMode, toggleCrt } = useKonamiCode();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const projectsByYear = getProjectsByYear();

  // Keyboard shortcut for Cmd+K / Ctrl+/ — toggle command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "/")) {
        e.preventDefault();
        setIsCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Toggle CRT mode class on body
  useEffect(() => {
    if (crtMode) {
      document.body.classList.add("crt-mode");
    } else {
      document.body.classList.remove("crt-mode");
    }
    return () => {
      document.body.classList.remove("crt-mode");
    };
  }, [crtMode]);

  // Convert Map to sorted array (descending year)
  const years = Array.from(projectsByYear.keys()).sort((a, b) => b - a);

  return (
    <>
      <BinaryCanvas />
      <div className="scanlines-overlay" />
      <div className="vignette-overlay" />

      {/* Hero section — canvas is fixed, this is the overlay content */}
      <HeroOverlay />

      {/* Gradient transition from transparent to timeline background */}
      <div className="hero-to-timeline-fade" />

      {/* Timeline section */}
      <div className="timeline-wrapper">
        <div className="timeline-container">
          {years.map((year) => (
            <YearSection
              key={year}
              year={year}
              projects={projectsByYear.get(year) || []}
            />
          ))}
        </div>
      </div>

      <Footer />

      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onToggleCrt={toggleCrt}
      />

      <StatusBar />
    </>
  );
};

export default Index;
