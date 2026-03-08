import { useState, useRef, useCallback } from "react";

export function useGlitchName() {
  const [isGlitching, setIsGlitching] = useState(false);
  const clickCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = useCallback(() => {
    if (isGlitching) return;

    clickCount.current++;

    // Reset click count after 2s of no clicks
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 2000);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 3000);
    }
  }, [isGlitching]);

  return { isGlitching, handleClick };
}
