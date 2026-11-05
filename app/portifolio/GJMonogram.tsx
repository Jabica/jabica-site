"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import styles from "./GJMonogram.module.css";

// The light-blue J sits behind the broad, forward-slanted G.
export const GJ_PATHS = {
  j: "M 74 27 H 98 L 86 63 C 83 73 76 78 64 78 H 24 L 28 66 H 63 C 69 66 72 63 74 57 L 80 38 H 69 Z",
  g: "M 81 4 H 43 C 29 4 21 11 17 24 L 7 51 C 3 64 9 70 22 70 H 52 L 63 37 H 40 L 44 25 H 70 L 58 58 H 28 C 23 58 21 55 22 51 L 31 27 C 33 20 36 17 44 17 H 77 Z",
} as const;

type GJMonogramProps = {
  className?: string;
  tone?: "navy" | "ice";
  scrollDraw?: boolean;
  intro?: boolean;
  active?: boolean;
  enterDelay?: number;
  replayToken?: number;
};

export function GJMonogram({ className, tone = "navy", scrollDraw = false, intro = false, active = true, enterDelay = 0, replayToken = 0 }: GJMonogramProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [entered, setEntered] = useState(false);
  const gradientId = useId();

  useEffect(() => {
    if (scrollDraw || intro || !active) return;
    const delay = replayToken > 0 ? 0 : enterDelay;
    let frame = 0;
    const reset = window.setTimeout(() => setEntered(false), 0);
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(() => setEntered(true));
    }, delay);
    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [active, enterDelay, intro, replayToken, scrollDraw]);

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (intro || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const bounds = root.getBoundingClientRect();
    root.style.setProperty("--pull-x", `${((event.clientX - bounds.left - bounds.width / 2) * 0.12).toFixed(1)}px`);
    root.style.setProperty("--pull-y", `${((event.clientY - bounds.top - bounds.height / 2) * 0.12).toFixed(1)}px`);
  };

  const onPointerLeave = () => {
    rootRef.current?.style.setProperty("--pull-x", "0px");
    rootRef.current?.style.setProperty("--pull-y", "0px");
  };

  return (
    <span ref={rootRef} className={`${styles.mark} ${styles[tone]} ${intro ? styles.intro : scrollDraw ? styles.scrollDraw : styles.enterDraw} ${entered ? styles.entered : ""} ${className ?? ""}`} data-gj-monogram onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} role="img" aria-label="GJ">
      <span className={styles.pull}>
        <svg className={styles.svg} viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId}><stop stopColor="#3a7ba6" stopOpacity="0" /><stop offset="0.5" stopColor="#eef3f7" stopOpacity="0.9" /><stop offset="1" stopColor="#3a7ba6" stopOpacity="0" /></linearGradient>
          </defs>
          <path className={`${styles.glyph} ${styles.j}`} data-gj-path d={GJ_PATHS.j} />
          <path className={styles.gap} d={GJ_PATHS.g} fillRule="evenodd" />
          <path className={`${styles.glyph} ${styles.g}`} data-gj-path d={GJ_PATHS.g} fillRule="evenodd" />
          <g className={styles.shimmer} data-gj-sweep>
            <path className={styles.sweepPath} d={GJ_PATHS.j} stroke={`url(#${gradientId})`} />
            <path className={styles.sweepPath} d={GJ_PATHS.g} stroke={`url(#${gradientId})`} />
          </g>
        </svg>
      </span>
    </span>
  );
}
