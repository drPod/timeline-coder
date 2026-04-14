import { ArrowRight, ExternalLink, Monitor, Hash, Sparkles, Code2 } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { getProjects } from "@/lib/githubData";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleCrt: () => void;
}

const GITHUB_URL = "https://github.com/drPod";
const LINKEDIN_URL = "https://linkedin.com/in/darshpoddar";
const SOURCE_URL = "https://github.com/drPod/timeline-coder";

const CommandPalette = ({ open, onOpenChange, onToggleCrt }: CommandPaletteProps) => {
  const projects = getProjects();

  const scrollTo = (id: string) => {
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const toggleCrt = () => {
    onToggleCrt();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="$ type a command..." className="font-mono" />
      <CommandList>
        <CommandEmpty className="font-mono text-xs">
          No results found. Try another query.
        </CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => scrollTo("hero")} className="font-mono text-sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Hero
          </CommandItem>
          <CommandItem onSelect={() => scrollTo("timeline")} className="font-mono text-sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Timeline
          </CommandItem>
          <CommandItem onSelect={() => scrollTo("footer")} className="font-mono text-sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Footer
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((project) => {
            const target = project.liveUrl ?? project.repoUrl;
            // cmdk filters by the value prop (falls back to text content).
            // Include pitch + tech so fuzzy search covers more than just the name.
            const searchValue = [
              project.name,
              project.pitch,
              project.category,
              project.primaryLanguage ?? "",
              project.techStack.join(" "),
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <CommandItem
                key={project.id}
                value={searchValue}
                onSelect={() => openUrl(target)}
                className="font-mono text-sm"
              >
                <Hash className="mr-2 h-4 w-4 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{project.name}</span>
                  {project.pitch && (
                    <span className="truncate text-xs text-muted-foreground">
                      {project.pitch}
                    </span>
                  )}
                </div>
                <CommandShortcut>{project.year}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            onSelect={() => openUrl(GITHUB_URL)}
            className="font-mono text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            GitHub
          </CommandItem>
          <CommandItem
            onSelect={() => openUrl(LINKEDIN_URL)}
            className="font-mono text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            LinkedIn
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Easter Eggs">
          <CommandItem
            value="crt toggle monitor easter egg"
            onSelect={toggleCrt}
            className="font-mono text-sm"
          >
            <Monitor className="mr-2 h-4 w-4" />
            Toggle CRT mode
            <CommandShortcut>↑↑↓↓←→←→BA</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="matrix crt green rain easter egg"
            onSelect={toggleCrt}
            className="font-mono text-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            matrix
            <CommandShortcut>secret</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="source code github repo easter egg"
            onSelect={() => openUrl(SOURCE_URL)}
            className="font-mono text-sm"
          >
            <Code2 className="mr-2 h-4 w-4" />
            source
            <CommandShortcut>view source</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
