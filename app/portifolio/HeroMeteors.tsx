"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { gsap } from "gsap";
import styles from "./PinnedScrollSequence.module.css";

// Recent wash stamps, in client pixels. The portrait uses the same spots to open the ski photo.
export interface MeteorStamp {
  x: number;
  y: number;
  r: number;
  a: number;
  born: number;
}

// Uneven lobes. Irrational angles and speeds so the slime never settles into a ring.
const SLIME = [
  { angle: 0.37, freq: 0.71, spread: 0.62, size: 0.58 },
  { angle: 2.19, freq: 1.37, spread: 0.28, size: 0.34 },
  { angle: 3.84, freq: 0.43, spread: 0.91, size: 0.22 },
  { angle: 5.11, freq: 1.83, spread: 0.41, size: 0.47 },
  { angle: 1.08, freq: 0.97, spread: 0.15, size: 0.31 },
  { angle: 4.46, freq: 1.21, spread: 0.74, size: 0.18 },
];

// Copied from Lando's idle cursor (class c9 + mouse wJ in lando-by-OFF+BRAND.05.js).
// One cursor draws two U-turns while it drifts down, rests, then draws two more on the way back.
// The smear is the fading trail, and it sits on the contour field behind the portrait.
const IDLE_START_MS = 2500;
const IDLE_RESUME_MS = 2000;

export function HeroMeteors({
  active,
  stampsRef,
}: {
  active: boolean;
  stampsRef: MutableRefObject<MeteorStamp[]>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.closest<HTMLElement>("[data-reveal-hero]");
    const ctx = canvas?.getContext("2d");
    if (!active || !canvas || !stage || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const progress = { x: 0, y: 0 };
    const smallProgress = { x: 0, y: 0 };
    let moving = true;
    let onScreen = false;
    let rafId = 0;
    let dpr = 1;
    let prevNx = 0;
    let prevNy = 0;
    let prevSmallNx = 0;
    let prevSmallNy = 0;
    let hasPrev = false;
    let idleTimer = 0;
    let resumeTimer = 0;

    // Lando idle pass: x eases through two U-turns while y drifts, then the pass returns.
    const timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3 });
    timeline.fromTo(progress, { y: 0 }, { y: 1, duration: 2.5, ease: "none" }, 0);
    timeline.fromTo(progress, { x: 0 }, { x: 1, duration: 2.5, ease: "power1.inOut" }, 0);
    timeline.fromTo(progress, { y: 1 }, { y: 0, duration: 2.5, ease: "none" }, 4);
    timeline.fromTo(progress, { x: 1 }, { x: 0, duration: 2.5, ease: "power1.inOut" }, 4);

    const smallTimeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3 });
    smallTimeline.fromTo(smallProgress, { y: 0 }, { y: 1, duration: 2.5, ease: "none" }, 0);
    smallTimeline.fromTo(smallProgress, { x: 0 }, { x: 1, duration: 2.5, ease: "power1.inOut" }, 0);
    smallTimeline.fromTo(smallProgress, { y: 1 }, { y: 0, duration: 2.5, ease: "none" }, 4);
    smallTimeline.fromTo(smallProgress, { x: 1 }, { x: 0, duration: 2.5, ease: "power1.inOut" }, 4);

    const beginIdle = () => {
      moving = false;
      hasPrev = false;
      timeline.seek(0);
      timeline.play();
      smallTimeline.seek(0);
      smallTimeline.play();
    };

    const onPointer = () => {
      moving = true;
      timeline.pause();
      smallTimeline.pause();
      window.clearTimeout(idleTimer);
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(beginIdle, IDLE_RESUME_MS);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(stage.clientWidth * dpr);
      const h = Math.round(stage.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const frame = () => {
      rafId = 0;
      if (!onScreen || document.hidden) return;

      const width = stage.clientWidth;
      const height = stage.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const stageRect = stage.getBoundingClientRect();
      const live: MeteorStamp[] = [];

      const fillBlob = (cx: number, cy: number, blobRadius: number, strength = 1) => {
        const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, blobRadius);
        wash.addColorStop(0, `rgba(149, 166, 183, ${0.42 * strength})`);
        wash.addColorStop(0.45, `rgba(193, 202, 211, ${0.16 * strength})`);
        wash.addColorStop(1, "rgba(248, 250, 249, 0)");
        ctx.fillStyle = wash;
        ctx.beginPath();
        ctx.arc(cx, cy, blobRadius, 0, Math.PI * 2);
        ctx.fill();
      };

      const stamp = (nx: number, ny: number, fromX: number, fromY: number, radiusScale: number) => {
        const px = ((nx + 1) / 2) * width;
        const py = ((1 - ny) / 2) * height;
        const radius = Math.min(width, height) * radiusScale;
        const seconds = now * 0.001;
        fillBlob(px, py, radius);
        const dx = nx - fromX;
        const dy = ny - fromY;
        const travel = Math.hypot(dx, dy) || 0.0001;
        fillBlob(px - (dx / travel) * radius * 0.72, py - (dy / travel) * radius * 0.72, radius * 0.46, 0.85);
        for (const lobe of SLIME) {
          const wobble = Math.sin(seconds * lobe.freq + lobe.angle) * 0.55
            + Math.sin(seconds * lobe.freq * 2.31 + lobe.angle * 1.7) * 0.28;
          const reach = radius * Math.max(0.08, lobe.spread + wobble * 0.22);
          const angle = lobe.angle + Math.sin(seconds * lobe.freq * 0.63) * 0.85;
          fillBlob(px + Math.cos(angle) * reach, py + Math.sin(angle) * reach, radius * lobe.size, 0.7);
        }
        live.push({ x: stageRect.left + px, y: stageRect.top + py, r: radius * 1.35, a: 1, born: now });
      };

      if (!moving) {
        // Same U-turn as Lando. This one drifts from the top down to the bottom.
        const nx = -Math.cos(progress.x * Math.PI * 4) * 0.75;
        const ny = Math.cos(progress.y * Math.PI) * 0.55;
        // Same U-turn, opposite vertical: bottom up to the top, and a quarter swing aside.
        const smallNx = -Math.cos((smallProgress.x + 0.25) * Math.PI * 4) * 0.55;
        const smallNy = -Math.cos(smallProgress.y * Math.PI) * 0.55;
        const fromNx = prevNx;
        const fromNy = prevNy;
        const fromSmallNx = prevSmallNx;
        const fromSmallNy = prevSmallNy;
        const moved = !hasPrev || Math.hypot(nx - prevNx, ny - prevNy) > 0.004;
        const smallMoved = !hasPrev || Math.hypot(smallNx - prevSmallNx, smallNy - prevSmallNy) > 0.004;
        prevNx = nx;
        prevNy = ny;
        prevSmallNx = smallNx;
        prevSmallNy = smallNy;
        hasPrev = true;

        if (moved) stamp(nx, ny, fromNx, fromNy, 0.065);
        if (smallMoved) stamp(smallNx, smallNy, fromSmallNx, fromSmallNy, 0.039);
      }

      stampsRef.current = live;
      rafId = requestAnimationFrame(frame);
    };

    const play = () => {
      if (rafId || !onScreen || document.hidden) return;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      stampsRef.current = [];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, stage.clientWidth, stage.clientHeight);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
      else stop();
    }, { threshold: 0.05 });
    intersectionObserver.observe(stage);

    const onVisibility = () => {
      if (document.hidden) stop();
      else play();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onPointer, { passive: true });
    resize();
    idleTimer = window.setTimeout(beginIdle, IDLE_START_MS);
    play();

    return () => {
      timeline.kill();
      smallTimeline.kill();
      window.clearTimeout(idleTimer);
      window.clearTimeout(resumeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      stop();
    };
  }, [active, stampsRef]);

  return <canvas ref={canvasRef} className={styles.meteorCanvas} aria-hidden="true" />;
}

export default HeroMeteors;
