import { useEffect, useState } from "react";
import { Terminal, ArrowRight, ExternalLink, Monitor, Hash } from "lucide-react";
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
import { timelineData } from "@/data/timeline";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleCrt: () => void;
}

const featured = timelineData.filter((e) => e.type === "featured");

const CommandPalette = ({ open, onOpenChange, onToggleCrt }: CommandPaletteProps) => {
  const scrollTo = (id: string) => {
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
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
          {featured.map((entry) => (
            <CommandItem
              key={entry.id}
              onSelect={() => scrollTo(`entry-${entry.id}`)}
              className="font-mono text-sm"
            >
              <Hash className="mr-2 h-4 w-4" />
              {entry.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            onSelect={() => { window.open("https://github.com", "_blank"); onOpenChange(false); }}
            className="font-mono text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            GitHub
          </CommandItem>
          <CommandItem
            onSelect={() => { window.open("https://linkedin.com", "_blank"); onOpenChange(false); }}
            className="font-mono text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            LinkedIn
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Easter Eggs">
          <CommandItem
            onSelect={() => { onToggleCrt(); onOpenChange(false); }}
            className="font-mono text-sm"
          >
            <Monitor className="mr-2 h-4 w-4" />
            Toggle CRT mode
            <CommandShortcut>↑↑↓↓←→←→BA</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
