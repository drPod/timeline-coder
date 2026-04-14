import { useState, useEffect, useRef, useCallback } from "react";

const phrases = [
  "> scanning attack surface...",
  "> deploying to production at 3am...",
  "> rm -rf node_modules && bun install",
  "> sudo make me a sandwich",
  "> git push --force (just kidding)",
  "> nmap -sS -T4 localhost",
  "> python3 train.py --epochs 100",
  "> grep -r 'TODO' src/",
];

export function useTypingAnimation(speed = 45, pauseMs = 2000, deleteSpeed = 25) {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const current = phrases[phraseIndex.current];

    if (!isDeleting.current) {
      // Typing forward
      charIndex.current++;
      setText(current.slice(0, charIndex.current));

      if (charIndex.current === current.length) {
        // Done typing — pause, then start deleting
        timeoutRef.current = setTimeout(() => {
          isDeleting.current = true;
          tick();
        }, pauseMs);
        return;
      }
      timeoutRef.current = setTimeout(tick, speed + Math.random() * 30);
    } else {
      // Deleting
      charIndex.current--;
      setText(current.slice(0, charIndex.current));

      if (charIndex.current === 0) {
        isDeleting.current = false;
        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        timeoutRef.current = setTimeout(tick, 400);
        return;
      }
      timeoutRef.current = setTimeout(tick, deleteSpeed);
    }
  }, [speed, pauseMs, deleteSpeed]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, 600);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  return { text, cursor: showCursor ? "█" : " " };
}
