/**
 * Maps timeline entry IDs to their GitHub repo(s).
 * Edit this file to add/remove/change repo mappings.
 */

export type RepoMapping = {
  /** GitHub owner/repo pairs (e.g. "drPod/Phantom") */
  repos: string[];
};

export const repoConfig: Record<string, RepoMapping> = {
  "intellispend": { repos: ["drPod/Intellispend"] },
  "fucknetflix": { repos: ["drPod/fucknetflix"] },
  "phantom": { repos: ["drPod/Phantom"] },
  "mcp-contrib": { repos: ["drPod/mcp-google-sheets", "drPod/mcp-ical", "drPod/drawio-mcp-extension"] },
  "this-portfolio": { repos: ["drPod/timeline-coder"] },
  "cyberpatriot-scripts": { repos: ["drPod/CyberPatriot-Scripts"] },
  "safety-hero": { repos: ["drPod/SafetyHero"] },
  "community-corner": { repos: ["drPod/Community-Corner-Web"] },
  "research-repos": { repos: ["drPod/Blame-Data", "drPod/Detecting-Malicious-Commits"] },
  "learnx": { repos: ["jeff-k-zhou/LearnX"] },
  "ccdc-script": { repos: ["drPod/CCDC-Website-Integrity-Script-10-25-2025"] },
  "acdec-quiz": { repos: ["drPod/Academic-Decathlon-Focus-Quiz-Automation"] },
};
