import { useEffect, useState } from "react";

/**
 * Fake multi-team ghostroom view. Renders a grid of 6 "team terminals",
 * each simulating:
 *   - a SKILL.md prompt
 *   - a streaming Qwen output (chars typed one by one)
 *   - a puzzle phase (1/3, 2/3, 3/3, solved)
 *
 * Tiles independently cycle through states so the grid always feels alive.
 */

type TeamState = {
  name: string;
  skill: string;
  output: string;
  targetOutput: string;
  phase: 1 | 2 | 3 | 4; // 4 = solved
  score: number;
};

const TEAM_TEMPLATES: Array<{ name: string; skill: string; scripts: string[] }> = [
  {
    name: "team_synapse",
    skill: "always ls -la before cd",
    scripts: [
      "$ ls -la /home/ghost\ntotal 24\ndrwx------ 3 ghost ghost 4096 .\n-rw------- 1 ghost ghost  341 .bash_history\n-rw-r--r-- 1 ghost ghost   47 SKILL.md",
      "$ cat .bash_history\ncd /var/log\ngrep 'unlock_key' auth.log\nsudo -l\nfound: phase1_key=xN8fP2",
      "$ echo phase1_key=xN8fP2 > /tmp/flag\n[unlock] phase 1 cleared",
    ],
  },
  {
    name: "team_ghost",
    skill: "ignore decoys, chase env vars",
    scripts: [
      "$ env | grep -i puzzle\nPUZZLE_HINT=/opt/escape/.secret\nPUZZLE_PHASE=2",
      "$ cat /opt/escape/.secret\n====[ hint ]====\nthe ghost lives in ~/.cache",
      "$ find ~/.cache -name 'phase*'\n/home/ghost/.cache/phase2.key\n[unlock] phase 2 cleared",
    ],
  },
  {
    name: "team_loop",
    skill: "recursive cat until EOF",
    scripts: [
      "$ xdotool type 'nc localhost 9000'\n> HELO\n< WHO ARE YOU?\n> ghost\n< PROVE IT",
      "$ wc -l /etc/hostname\n1 /etc/hostname\n$ md5sum /etc/hostname\na1b9... ghost.local",
      "stuck — retrying prompt…\nreading SKILL.md again",
    ],
  },
  {
    name: "team_shard",
    skill: "brute-force the lockfile",
    scripts: [
      "$ ls -la ~/puzzle\n-rw------- 1 ghost ghost 256 lock.bin\n$ file lock.bin\nlock.bin: encrypted, xor-cipher",
      "$ for k in 0x{01..ff}; do ./try $k; done\n[0x3f] ACCESS\n[0x7e] ACCESS\n[0xa1] UNLOCK",
      "phase 3 solved.  writing /tmp/solved",
    ],
  },
  {
    name: "team_echo",
    skill: "tail -f the log, then act",
    scripts: [
      "$ tail -f /var/log/ghost.log\n10:04 gate_1 locked\n10:04 awaiting keystroke…\n10:05 WRONG_KEY",
      "$ cat /proc/meminfo | head -2\nMemTotal: 16332112 kB\nMemFree:   8791200 kB",
      "retrying phase 1 — last attempt lost",
    ],
  },
  {
    name: "team_null",
    skill: "open every .md in ~/docs",
    scripts: [
      "$ head -5 ~/docs/RULES.md\n# Rules\n1. No external tools.\n2. Prompt must fit in 60 chars.\n3. Ghost never sleeps.",
      "$ cat ~/docs/HINT.md\ngrep the dotfiles. the ghost is literal.",
      "$ grep -r 'PHASE_3' ~/.*rc\n.bashrc: export PHASE_3=unlocked\n[unlock] phase 3 cleared",
    ],
  },
];

function pickScriptIndex(): number {
  return Math.floor(Math.random() * 3);
}

const GhostroomDemo = () => {
  const [teams, setTeams] = useState<TeamState[]>(() =>
    TEAM_TEMPLATES.map((t, i) => {
      const idx = i % 3;
      return {
        name: t.name,
        skill: t.skill,
        output: "",
        targetOutput: t.scripts[idx],
        phase: ((idx + 1) as 1 | 2 | 3),
        score: Math.floor(Math.random() * 340) + 120,
      };
    }),
  );

  // Type-out animation — each team ticks one character per interval tick.
  // Uses a stagger so tiles don't move in lockstep.
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams((prev) =>
        prev.map((team) => {
          if (team.output.length < team.targetOutput.length) {
            // Variable speed — 1 or 2 chars per tick so it feels organic
            const step = Math.random() < 0.4 ? 2 : 1;
            return {
              ...team,
              output: team.targetOutput.slice(
                0,
                Math.min(team.output.length + step, team.targetOutput.length),
              ),
            };
          }
          // Output complete — small chance to reset with a new script
          if (Math.random() < 0.05) {
            const tmpl = TEAM_TEMPLATES.find((t) => t.name === team.name)!;
            const nextIdx = pickScriptIndex();
            const nextPhase = ((nextIdx + 1) as 1 | 2 | 3);
            return {
              ...team,
              output: "",
              targetOutput: tmpl.scripts[nextIdx],
              phase: nextPhase,
              score: team.score + Math.floor(Math.random() * 40),
            };
          }
          return team;
        }),
      );
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Random phase promotion — every few seconds one team solves
  useEffect(() => {
    const promotionInterval = setInterval(() => {
      setTeams((prev) => {
        const solvable = prev.filter((t) => t.phase < 4);
        if (solvable.length === 0) return prev;
        const target = solvable[Math.floor(Math.random() * solvable.length)];
        return prev.map((t) =>
          t.name === target.name
            ? { ...t, phase: Math.min(4, t.phase + 1) as 1 | 2 | 3 | 4, score: t.score + 200 }
            : t,
        );
      });
    }, 4500);
    return () => clearInterval(promotionInterval);
  }, []);

  // Leaderboard sorted by score
  const leaderboard = [...teams].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#3ecf8e]/20 bg-[rgba(6,6,8,0.92)] shadow-[0_0_40px_-10px_rgba(62,207,142,0.15)]">
      {/* Header */}
      <div className="flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3">
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#3ecf8e]" />
        <span className="truncate font-mono text-[10px] text-white/40">
          <span className="md:hidden">ghostroom.live · 20/20 up</span>
          <span className="hidden md:inline">
            ghostroom.live · 20 / 20 containers up · qwen2.5-7b-instruct
          </span>
        </span>
        <span className="ml-auto hidden shrink-0 font-mono text-[10px] text-[#3ecf8e]/60 sm:inline">
          ▲ {leaderboard[0]?.name}
        </span>
      </div>

      {/* Tile grid */}
      <div className="grid flex-1 grid-cols-2 gap-[1px] bg-white/[0.04] md:grid-cols-3">
        {teams.map((team) => (
          <TeamTile key={team.name} team={team} />
        ))}
      </div>

      {/* Scoreboard */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/5 bg-white/[0.02] px-3 py-2 md:gap-4">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          leaderboard
        </span>
        {leaderboard.map((t, i) => (
          <span
            key={t.name}
            className="flex items-center gap-1.5 font-mono text-[10px]"
          >
            <span className="text-white/30">{i + 1}.</span>
            <span className="truncate text-white/70">{t.name}</span>
            <span className="text-[#3ecf8e]/70">{t.score}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

type TeamTileProps = { team: TeamState };

const TeamTile = ({ team }: TeamTileProps) => {
  const phaseLabel =
    team.phase === 4 ? "solved" : `phase ${team.phase}/3`;
  const phaseColor =
    team.phase === 4 ? "text-[#3ecf8e]" : "text-white/40";

  return (
    <div className="relative flex min-h-[120px] flex-col bg-[rgba(6,6,8,0.95)] p-2.5">
      {/* Top row */}
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/70">{team.name}</span>
        <span className={`font-mono text-[9px] ${phaseColor}`}>{phaseLabel}</span>
      </div>

      {/* SKILL.md line */}
      <div className="mb-1.5 truncate font-mono text-[9px] italic text-[#3ecf8e]/40">
        # {team.skill}
      </div>

      {/* Terminal body */}
      <pre className="flex-1 overflow-hidden whitespace-pre-wrap font-mono text-[9px] leading-[1.35] text-white/50">
        {team.output}
        <span className="inline-block w-[5px] animate-pulse bg-[#3ecf8e]/60" style={{ height: "9px" }}>
          &nbsp;
        </span>
      </pre>
    </div>
  );
};

export default GhostroomDemo;
