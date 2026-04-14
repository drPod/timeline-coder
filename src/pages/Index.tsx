import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import BinaryCanvas from "@/components/canvas/BinaryCanvas";
import HeroOverlay from "@/components/canvas/HeroOverlay";
import FlagshipSection from "@/components/flagship/FlagshipSection";
import YearSection from "@/components/timeline/YearSection";
import LivePreview from "@/components/timeline/LivePreview";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { getEntriesByYear } from "@/lib/githubData";
import type { ProjectEntry } from "@/lib/githubData";
import { flagshipIds } from "@/data/flagships";
import type { FlagshipProject } from "@/data/flagships";

const Index = () => {
  const { crtMode, toggleCrt } = useKonamiCode();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<ProjectEntry | null>(
    null,
  );
  const entriesByYear = getEntriesByYear();

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
  const years = Array.from(entriesByYear.keys()).sort((a, b) => b - a);

  /**
   * Synthesises a ProjectEntry for a flagship so LivePreview can open.
   * Only called when a flagship has a liveUrl the user wants to pop.
   */
  const flagshipToProject = useMemo(
    () =>
      (f: FlagshipProject): ProjectEntry => ({
        id: f.id,
        kind: "project" as const,
        name: f.name,
        pitch: f.story,
        category: "tool",
        year: f.year,
        month: 1,
        techStack: [],
        liveUrl: f.liveUrl,
        repoUrl: f.repoUrl,
        featured: true,
      }),
    [],
  );

  const handleOpenLive = (flagship: FlagshipProject) => {
    if (!flagship.liveUrl) return;
    setPreviewProject(flagshipToProject(flagship));
  };

  return (
    <>
      <BinaryCanvas />
      <div className="scanlines-overlay" />
      <div className="vignette-overlay" />

      {/* Hero section — canvas is fixed, this is the overlay content */}
      <HeroOverlay />

      {/* Gradient transition from transparent to flagship background */}
      <div className="hero-to-timeline-fade" />

      {/* Flagship projects — cinematic full-bleed */}
      <FlagshipSection onOpenLive={handleOpenLive} />

      {/* Timeline section (flagship IDs filtered out so they don't render twice) */}
      <div className="timeline-wrapper">
        <div className="timeline-container">
          {years.map((year) => (
            <YearSection
              key={year}
              year={year}
              entries={entriesByYear.get(year) || []}
              onOpenPreview={setPreviewProject}
              excludeIds={flagshipIds}
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

      {/* Fullscreen live preview modal — rendered once at top level */}
      <AnimatePresence>
        {previewProject && (
          <LivePreview
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
