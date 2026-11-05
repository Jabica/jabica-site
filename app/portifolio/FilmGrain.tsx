"use client";

import { useEffect, useRef } from "react";
import styles from "./PinnedScrollSequence.module.css";

export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    let visible = false;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const specks = Math.ceil(width * height / 24);
      for (let i = 0; i < specks; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = Math.random() < 0.5 ? "#4f6478" : "#3d5266";
        const size = 0.45 + Math.random() * 0.55;
        ctx.fillRect(x, y, size, size);
      }
    };

    const frame = () => {
      raf = 0;
      if (!visible || document.hidden || reduced) return;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const start = () => {
      if (visible && !document.hidden && !reduced && !raf) raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw();
    };
    const onVisibility = () => document.hidden ? stop() : start();
    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      if (reduced) { stop(); draw(); }
      else start();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.01 });
    resizeObserver.observe(stage);
    intersectionObserver.observe(stage);
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onReducedChange);
    resize();
    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.filmGrain} data-film-grain aria-hidden="true" />;
}
