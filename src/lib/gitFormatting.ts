import type { Category } from "@/data/timeline";

export function generateFakeHash(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Convert to positive hex, pad to 7 chars
  const hex = Math.abs(hash).toString(16).padStart(7, "0").slice(0, 7);
  return hex;
}

export function toBranchName(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    research: "hsl(270 70% 60%)",
    hackathon: "hsl(35 90% 55%)",
    leadership: "hsl(142 70% 45%)",
    security: "hsl(0 70% 55%)",
    project: "hsl(200 70% 50%)",
    certification: "hsl(50 80% 50%)",
    milestone: "hsl(142 70% 45%)",
  };
  return colors[category];
}

export function getCategoryGlow(category: Category): string {
  const color = getCategoryColor(category);
  return `0 0 12px 2px ${color.replace(")", " / 0.4)")}`;
}
