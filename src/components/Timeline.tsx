import { motion } from "framer-motion";
import { timelineData, years } from "@/data/timeline";
import { getCategoryColor, getCategoryGlow } from "@/lib/gitFormatting";
import CompactNode from "./CompactNode";
import FeaturedCard from "./FeaturedCard";

const Timeline = () => {
  const entriesByYear = years.map((year) => ({
    year,
    entries: timelineData.filter((e) => e.year === year),
  }));

  let globalIndex = 0;
  const lastEntryId = timelineData[timelineData.length - 1]?.id;

  return (
    <section id="timeline" className="relative mx-auto max-w-4xl px-6 py-20">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16 text-center font-mono text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
      >
        git log --graph --all
      </motion.h2>

      <div className="relative">
        {/* Main vertical line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2 md:-translate-x-px" />

        {entriesByYear.map(({ year, entries }) => (
          <div key={year} className="relative">
            {/* Year marker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="relative z-10 mb-8 flex items-center"
            >
              <div className="flex items-center md:mx-auto">
                <div className="flex h-8 items-center rounded-full border border-border bg-secondary px-4 font-mono text-xs font-semibold tracking-wider text-foreground shadow-[0_0_15px_-3px_hsl(var(--commit-glow)/0.2)]">
                  {year}
                </div>
              </div>
            </motion.div>

            {/* Entries for this year */}
            {entries.map((entry) => {
              const idx = globalIndex++;
              const side: "left" | "right" = idx % 2 === 0 ? "left" : "right";
              const isLatest = entry.id === lastEntryId;
              const categoryColor = getCategoryColor(entry.category);
              const categoryGlow = getCategoryGlow(entry.category);
              const delay = Math.min(idx * 0.05, 0.3);

              return (
                <div key={entry.id} id={`entry-${entry.id}`} className="relative mb-6">
                  <div className="flex items-start">
                    {/* Left content (desktop) */}
                    <div className="hidden w-[calc(50%-24px)] md:block">
                      {side === "left" && (
                        entry.type === "featured" ? (
                          <FeaturedCard entry={entry} side="left" />
                        ) : (
                          <CompactNode entry={entry} side="left" isLatest={isLatest} />
                        )
                      )}
                    </div>

                    {/* Center node */}
                    <div className="relative z-10 flex w-8 flex-shrink-0 items-start justify-center md:mx-auto">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: [0, 1.3, 1] }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay,
                        }}
                        className="mt-3 flex items-center justify-center"
                      >
                        {entry.type === "featured" ? (
                          <div
                            className="h-4 w-4 rounded-full border-2 bg-background commit-push-glow"
                            style={{
                              borderColor: categoryColor,
                              boxShadow: categoryGlow,
                            }}
                          />
                        ) : entry.branch ? (
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: categoryColor,
                              boxShadow: `0 0 8px 2px ${categoryColor.replace(")", " / 0.3)")}`,
                            }}
                          />
                        ) : (
                          <div
                            className="h-2.5 w-2.5 rounded-full opacity-60"
                            style={{ backgroundColor: categoryColor }}
                          />
                        )}
                      </motion.div>

                      {/* Branch line */}
                      {entry.branch && (
                        <div
                          className={`absolute top-4 h-px w-4 ${
                            side === "left"
                              ? "right-full md:right-full"
                              : "left-full md:left-full"
                          }`}
                          style={{ backgroundColor: `${categoryColor.replace(")", " / 0.3)")}` }}
                        />
                      )}
                    </div>

                    {/* Right content (desktop) */}
                    <div className="hidden w-[calc(50%-24px)] md:block">
                      {side === "right" && (
                        entry.type === "featured" ? (
                          <FeaturedCard entry={entry} side="right" />
                        ) : (
                          <CompactNode entry={entry} side="right" isLatest={isLatest} />
                        )
                      )}
                    </div>

                    {/* Mobile: single column */}
                    <div className="ml-4 flex-1 md:hidden">
                      {entry.type === "featured" ? (
                        <FeaturedCard entry={entry} side="right" />
                      ) : (
                        <CompactNode entry={entry} side="right" isLatest={isLatest} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* End cap */}
        <div className="relative flex justify-start md:justify-center">
          <div className="ml-[13px] h-3 w-3 rounded-full bg-commit-node shadow-[0_0_12px_2px_hsl(var(--commit-glow)/0.4)] md:ml-0" />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
