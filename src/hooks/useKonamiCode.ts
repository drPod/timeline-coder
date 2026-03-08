import { useState, useEffect, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export const useKonamiCode = () => {
  const [crtMode, setCrtMode] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);

  const toggleCrt = useCallback(() => {
    setCrtMode((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[inputIndex]) {
        const next = inputIndex + 1;
        if (next === KONAMI_CODE.length) {
          toggleCrt();
          setInputIndex(0);
        } else {
          setInputIndex(next);
        }
      } else {
        setInputIndex(0);
      }
    },
    [inputIndex, toggleCrt]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { crtMode, toggleCrt };
};
