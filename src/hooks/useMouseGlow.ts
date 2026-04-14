import { useEffect, useRef } from "react";

export type Trail = { x: number; y: number; a: number };
export type Ripple = { x: number; y: number; r: number; s: number };

export type MouseState = {
  mx: number;
  my: number;
  velocity: number;
  trails: Trail[];
  ripples: Ripple[];
};

export type UseMouseGlowOptions = {
  enableMouse?: boolean;
  enableTouch?: boolean;
};

export function useMouseGlow(options: UseMouseGlowOptions = {}) {
  const { enableMouse = true, enableTouch = true } = options;

  const state = useRef<MouseState>({
    mx: -9e3,
    my: -9e3,
    velocity: 0,
    trails: [],
    ripples: [],
  });

  // Previous mouse position for velocity calculation
  const prev = useRef({ x: -9e3, y: -9e3 });

  useEffect(() => {
    const s = state.current;

    const onMouseMove = (e: MouseEvent) => {
      prev.current.x = s.mx;
      prev.current.y = s.my;
      s.mx = e.clientX;
      s.my = e.clientY;
      s.velocity = Math.sqrt(
        (s.mx - prev.current.x) ** 2 + (s.my - prev.current.y) ** 2
      );
      s.trails.push({ x: s.mx, y: s.my, a: 1 });
      if (s.trails.length > 80) s.trails.shift();
    };

    const onMouseLeave = () => {
      s.mx = -9e3;
      s.my = -9e3;
      s.velocity = 0;
    };

    const onClick = (e: MouseEvent) => {
      s.ripples.push({ x: e.clientX, y: e.clientY, r: 0, s: 2.0 });
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      prev.current.x = s.mx;
      prev.current.y = s.my;
      s.mx = t.clientX;
      s.my = t.clientY;
      s.velocity = Math.sqrt(
        (s.mx - prev.current.x) ** 2 + (s.my - prev.current.y) ** 2
      );
      s.trails.push({ x: s.mx, y: s.my, a: 1 });
      if (s.trails.length > 80) s.trails.shift();
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      s.ripples.push({ x: t.clientX, y: t.clientY, r: 0, s: 2.0 });
    };

    const onTouchEnd = () => {
      s.mx = -9e3;
      s.my = -9e3;
      s.velocity = 0;
    };

    if (enableMouse) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("click", onClick);
    }
    if (enableTouch) {
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      if (enableMouse) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("click", onClick);
      }
      if (enableTouch) {
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [enableMouse, enableTouch]);

  return state;
}
