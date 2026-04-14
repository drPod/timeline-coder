import { useRef, useCallback } from "react";
import type { MouseState } from "./useMouseGlow";

// ── Types ──
type Cell = { c: string; b: number; tb: number };
type RainColumn = {
  col: number;
  row: number;
  speed: number;
  len: number;
  bright: number;
  kw: string | null;
  kwRow: number;
};
type Pulse = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  brightness: number;
  phase: number;
};

// ── Constants (exact values from prototype) ──
const SZ = 14;
const CHARS = '0011001100ABCDEFabcdef{}[]/<>:;#$%&=+-.~_|\\^01010101';
const KW = [
  "TRACE", "OSINT", "QUERY", "MODAL", "AGENT", "SHELL", "SPAWN",
  "CRAWL", "PARSE", "ASYNC", "MUTEX", "YIELD", "GHOST", "RECON",
];

function rc() {
  return CHARS[(Math.random() * CHARS.length) | 0];
}

const KONAMI_TEXT = "KONAMI CODE";

export function useBinaryCanvas() {
  const grid = useRef<Cell[]>([]);
  const rainCols = useRef<RainColumn[]>([]);
  const scanY = useRef(-50);
  const scanActive = useRef(false);
  const scanTimer = useRef(0);
  const pulses = useRef<Pulse[]>([]);
  const dims = useRef({ cols: 0, rows: 0, CW: 8.4, CH: 16 });
  const konamiCells = useRef<Map<number, string>>(new Map());

  const init = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.font = SZ + "px JetBrains Mono, SF Mono, Menlo, monospace";
    const CW = ctx.measureText("0").width;
    const CH = SZ + 2;
    const cols = Math.ceil(W / CW) + 1;
    const rows = Math.ceil(H / CH) + 1;

    dims.current = { cols, rows, CW, CH };

    const newGrid: Cell[] = [];
    for (let i = 0; i < cols * rows; i++) {
      newGrid.push({
        c: Math.random() > 0.4 ? (Math.random() > 0.5 ? "1" : "0") : rc(),
        b: 0.03,
        tb: 0.03,
      });
    }
    grid.current = newGrid;

    // ── Konami text stamp ──
    // Stamp "KONAMI CODE" near the top-left of the canvas, above where the
    // centered hero overlay starts, so the hint is discoverable by anyone
    // who sweeps their cursor up there. Cells keep the baseline 0.03
    // brightness; cursor/rain/ripple influence lights them into legibility.
    const konami = new Map<number, string>();
    const textLen = KONAMI_TEXT.length;
    const startCol = Math.max(2, ((cols * 0.08) | 0));
    const stampRow = Math.max(2, ((rows * 0.12) | 0));
    for (let i = 0; i < textLen; i++) {
      const c = startCol + i;
      if (c >= cols) break;
      const idx = stampRow * cols + c;
      konami.set(idx, KONAMI_TEXT[i]);
    }
    konamiCells.current = konami;

    // Reset rain/scan/pulses on reinit
    rainCols.current = [];
    pulses.current = [];
    scanY.current = -50;
    scanActive.current = false;
    scanTimer.current = 0;
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, W: number, H: number, mouse: MouseState) => {
      const { cols, rows, CW, CH } = dims.current;
      const g = grid.current;
      const rains = rainCols.current;
      const pls = pulses.current;
      const konami = konamiCells.current;

      ctx.clearRect(0, 0, W, H);
      ctx.font = SZ + "px JetBrains Mono, SF Mono, Menlo, monospace";
      ctx.textBaseline = "top";

      // ── Velocity decay ──
      mouse.velocity *= 0.92;
      const cursorR = 200 + Math.min(mouse.velocity * 1.5, 120);
      const hotR = 70 + Math.min(mouse.velocity * 0.5, 30);

      // ── Systems update ──
      // Ripples
      for (let i = mouse.ripples.length - 1; i >= 0; i--) {
        mouse.ripples[i].r += 6;
        mouse.ripples[i].s *= 0.958;
        if (mouse.ripples[i].s < 0.004) mouse.ripples.splice(i, 1);
      }
      // Trails
      for (let i = mouse.trails.length - 1; i >= 0; i--) {
        mouse.trails[i].a *= 0.935;
        if (mouse.trails[i].a < 0.004) mouse.trails.splice(i, 1);
      }

      // Rain spawn
      if (rains.length < 8 && Math.random() < 0.04) {
        const kw = Math.random() < 0.2 ? KW[(Math.random() * KW.length) | 0] : null;
        rains.push({
          col: (Math.random() * cols) | 0,
          row: -4,
          speed: 0.4 + Math.random() * 0.5,
          len: (10 + Math.random() * 22) | 0,
          bright: 0.85 + Math.random() * 0.35,
          kw,
          kwRow: kw ? ((Math.random() * 5) | 0) + 2 : 0,
        });
      }
      // Rain advance
      for (let i = rains.length - 1; i >= 0; i--) {
        rains[i].row += rains[i].speed;
        if (rains[i].row - rains[i].len > rows) rains.splice(i, 1);
      }

      // Scan line
      scanTimer.current++;
      if (!scanActive.current && scanTimer.current > 300) {
        scanActive.current = true;
        scanY.current = -10;
        scanTimer.current = 0;
      }
      if (scanActive.current) {
        scanY.current += 1.8;
        if (scanY.current > rows + 10) scanActive.current = false;
      }

      // Ambient pulses
      if (pls.length < 5 && Math.random() < 0.014) {
        pls.push({
          x: Math.random() * W,
          y: Math.random() * H,
          radius: 0,
          maxRadius: 120 + Math.random() * 140,
          brightness: 0.6 + Math.random() * 0.4,
          phase: 0,
        });
      }
      for (let i = pls.length - 1; i >= 0; i--) {
        pls[i].phase += 0.008;
        pls[i].radius = pls[i].maxRadius * Math.min(1, pls[i].phase * 1.3);
        if (pls[i].phase >= 1) pls.splice(i, 1);
      }

      // ── RENDER GRID ──
      const mx = mouse.mx;
      const my = mouse.my;
      const sY = scanY.current;
      const sActive = scanActive.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (idx >= g.length) continue;
          const cell = g[idx];
          const px = c * CW;
          const py = r * CH;
          const cpx = px + CW / 2;
          const cpy = py + CH / 2;
          let inf = 0;
          let cDist = 9e9;
          let hot = false;

          // Cursor influence
          const dx = cpx - mx;
          const dy = cpy - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < cursorR * cursorR) {
            const d = Math.sqrt(d2);
            cDist = d;
            inf = Math.max(inf, Math.pow(1 - d / cursorR, 1.3));
            hot = d < hotR;
            if (d < hotR && Math.random() < 0.12) cell.c = rc();
            else if (d < cursorR * 0.6 && Math.random() < 0.04) cell.c = rc();
          }

          // Trail influence
          for (let t = 0; t < mouse.trails.length; t++) {
            const tr = mouse.trails[t];
            const td2 = (cpx - tr.x) ** 2 + (cpy - tr.y) ** 2;
            if (td2 < 14400) {
              inf = Math.max(inf, (1 - Math.sqrt(td2) / 120) * tr.a * 0.7);
            }
          }

          // Ripple influence
          for (let ri = 0; ri < mouse.ripples.length; ri++) {
            const rp = mouse.ripples[ri];
            const rd = Math.sqrt((cpx - rp.x) ** 2 + (cpy - rp.y) ** 2);
            const band = Math.abs(rd - rp.r);
            if (band < 32) {
              inf = Math.max(inf, (1 - band / 32) * rp.s);
            }
          }

          // Rain influence
          for (let ri = 0; ri < rains.length; ri++) {
            const rc2 = rains[ri];
            if (c !== rc2.col) continue;
            const hd = rc2.row - r;
            if (hd >= 0 && hd < rc2.len) {
              const fade =
                hd < 2 ? 1.0 : hd < 5 ? 0.7 : Math.max(0, (1 - hd / rc2.len) * 0.45);
              inf = Math.max(inf, fade * rc2.bright);
              if (hd < 3 && Math.random() < 0.35) cell.c = rc();
              if (rc2.kw) {
                const ki = r - ((rc2.row - rc2.kwRow) | 0);
                if (ki >= 0 && ki < rc2.kw.length) cell.c = rc2.kw[ki];
              }
            }
          }

          // Scan line influence
          if (sActive) {
            const sd = Math.abs(r - sY);
            if (sd < 8) {
              inf = Math.max(
                inf,
                sd < 1 ? 0.9 : sd < 3 ? 0.55 : (1 - sd / 8) * 0.3
              );
              if (sd < 2 && Math.random() < 0.15) cell.c = rc();
            }
          }

          // Pulse influence
          for (let pi = 0; pi < pls.length; pi++) {
            const p = pls[pi];
            const pd = Math.sqrt((cpx - p.x) ** 2 + (cpy - p.y) ** 2);
            const ringDist = Math.abs(pd - p.radius);
            if (ringDist < 18) {
              inf = Math.max(
                inf,
                (1 - ringDist / 18) * p.brightness * (1 - p.phase)
              );
            }
          }

          // Ambient flicker
          if (Math.random() < 0.0006) {
            cell.c = rc();
            inf = Math.max(inf, 0.25 + Math.random() * 0.15);
          }

          // Interpolate brightness
          cell.tb = Math.max(0.03, inf);
          cell.b += (cell.tb - cell.b) * 0.1;
          const b = cell.b;

          // Color calculation
          let green: number, red: number, blue: number;
          if (hot && cDist < hotR) {
            const hn = 1 - cDist / hotR;
            green = (16 + b * 200 + hn * b * 55) | 0;
            red = (b * 28 + hn * b * 140) | 0;
            blue = (b * 60 + hn * b * 120) | 0;
          } else {
            green = (16 + b * 200) | 0;
            red = (b * 28) | 0;
            blue = (b * 60) | 0;
          }

          ctx.fillStyle =
            "rgba(" + red + "," + green + "," + blue + "," + (0.2 + b * 0.8) + ")";

          // ── Konami easter egg: override char for stamped cells ──
          const konamiChar = konami.get(idx);
          ctx.fillText(konamiChar ?? cell.c, px, py);
        }
      }

      // ── OVERLAYS ──

      // Cursor glow
      if (mx > -1000) {
        const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, cursorR);
        g1.addColorStop(0, "rgba(62,207,142,0.14)");
        g1.addColorStop(0.25, "rgba(62,207,142,0.07)");
        g1.addColorStop(0.6, "rgba(62,207,142,0.02)");
        g1.addColorStop(1, "rgba(62,207,142,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(mx - cursorR, my - cursorR, cursorR * 2, cursorR * 2);

        const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, hotR);
        g2.addColorStop(0, "rgba(180,255,220,0.08)");
        g2.addColorStop(0.5, "rgba(62,207,142,0.04)");
        g2.addColorStop(1, "rgba(62,207,142,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(mx - hotR, my - hotR, hotR * 2, hotR * 2);

        ctx.beginPath();
        ctx.arc(mx, my, cursorR * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(62,207,142,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mx, my, hotR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(62,207,142,0.08)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Trail glow dots
      for (let t = 0; t < mouse.trails.length; t++) {
        const tr = mouse.trails[t];
        if (tr.a > 0.08) {
          const sz = 35 + tr.a * 20;
          const tg = ctx.createRadialGradient(tr.x, tr.y, 0, tr.x, tr.y, sz);
          tg.addColorStop(0, "rgba(62,207,142," + 0.1 * tr.a + ")");
          tg.addColorStop(1, "rgba(62,207,142,0)");
          ctx.fillStyle = tg;
          ctx.fillRect(tr.x - sz, tr.y - sz, sz * 2, sz * 2);
        }
      }

      // Scan line gradient band
      if (sActive) {
        const sy = sY * CH;
        const grad = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
        grad.addColorStop(0, "rgba(62,207,142,0)");
        grad.addColorStop(0.3, "rgba(62,207,142,0.04)");
        grad.addColorStop(0.5, "rgba(62,207,142,0.1)");
        grad.addColorStop(0.7, "rgba(62,207,142,0.04)");
        grad.addColorStop(1, "rgba(62,207,142,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, sy - 40, W, 80);
        ctx.fillStyle = "rgba(62,207,142,0.12)";
        ctx.fillRect(0, sy - 1, W, 2);
      }

      // Pulse ring strokes
      for (let pi = 0; pi < pls.length; pi++) {
        const p = pls[pi];
        const fo = 1 - p.phase;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(62,207,142," + 0.18 * fo * p.brightness + ")";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (p.radius > 20) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(62,207,142," + 0.06 * fo * p.brightness + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Rain head glows
      for (let ri = 0; ri < rains.length; ri++) {
        const rc2 = rains[ri];
        const hx = rc2.col * CW + CW / 2;
        const hy = rc2.row * CH;
        const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 28);
        rg.addColorStop(0, "rgba(62,207,142," + 0.22 * rc2.bright + ")");
        rg.addColorStop(1, "rgba(62,207,142,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(hx - 28, hy - 28, 56, 56);
      }

      // Ripple ring strokes
      for (let ri = 0; ri < mouse.ripples.length; ri++) {
        const rp = mouse.ripples[ri];
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(62,207,142," + 0.25 * rp.s + ")";
        ctx.lineWidth = 2;
        ctx.stroke();
        if (rp.r > 30) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(62,207,142," + 0.1 * rp.s + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    },
    []
  );

  return { init, draw };
}
