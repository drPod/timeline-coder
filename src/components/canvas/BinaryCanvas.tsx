import { useRef, useEffect } from "react";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { useBinaryCanvas } from "@/hooks/useBinaryCanvas";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BinaryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  // On mobile, disable the mouse cursor glow (no hover available) — keep touch
  // listeners so taps/drags still produce ripples + trail.
  const mouseState = useMouseGlow({ enableMouse: !isMobile, enableTouch: true });
  const { init, draw } = useBinaryCanvas();
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      init(ctx, W, H);
    };

    resize();

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      draw(ctx, W, H, mouseState.current);
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
    };
  }, [init, draw, mouseState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
