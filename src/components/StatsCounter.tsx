import { useCountUp } from "@/hooks/useCountUp";
import { timelineData } from "@/data/timeline";

const totalProjects = timelineData.length;
const totalPublications = timelineData.filter((e) => e.category === "research" && e.type === "featured").length;
const yearsActive = new Set(timelineData.map((e) => e.year)).size;
const hackathonWins = timelineData.filter((e) => e.category === "hackathon").length;

const StatsCounter = () => {
  const projects = useCountUp(totalProjects);
  const pubs = useCountUp(totalPublications);
  const years = useCountUp(yearsActive);
  const hacks = useCountUp(hackathonWins);

  return (
    <div
      ref={projects.ref}
      className="border-y border-border bg-card/50 py-4"
    >
      <div className="mx-auto max-w-2xl px-6">
        <p className="font-mono text-xs text-muted-foreground text-center">
          <span className="text-primary">$</span>{" "}
          <span className="text-muted-foreground/70">wc -l ~/career</span>
        </p>
        <div
          ref={pubs.ref}
          className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-sm"
        >
          <span ref={years.ref}>
            <span className="text-foreground font-semibold">{years.count}</span>{" "}
            <span className="text-muted-foreground">years coding</span>
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <span ref={hacks.ref}>
            <span className="text-foreground font-semibold">{projects.count}</span>{" "}
            <span className="text-muted-foreground">projects</span>
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <span>
            <span className="text-foreground font-semibold">{pubs.count}</span>{" "}
            <span className="text-muted-foreground">publications</span>
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <span>
            <span className="text-foreground font-semibold">{hacks.count}</span>{" "}
            <span className="text-muted-foreground">hackathons</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
