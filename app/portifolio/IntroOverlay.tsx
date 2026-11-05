"use client";

import { useEffect, useId, useRef } from "react";
import { GJMonogram, GJ_PATHS } from "./GJMonogram";
import { ensureGsap } from "./motion";
import styles from "./IntroOverlay.module.css";

const introSessionKey = "portifolio-intro-complete";
let activeIntro: HTMLDivElement | null = null;
let introComplete = false;
const waitingIntros = new Set<() => void>();

export function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const startedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const maskSvgRef = useRef<SVGSVGElement>(null);
  const maskGeometryRef = useRef<SVGGElement>(null);
  const cutoutRef = useRef<SVGGElement>(null);
  const maskId = useId();

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || startedRef.current) return;
    startedRef.current = true;

    if (introComplete || sessionStorage.getItem(introSessionKey) === "true") {
      overlay.style.display = "none";
      onComplete();
      return () => { startedRef.current = false; };
    }

    if (activeIntro) {
      overlay.style.display = "none";
      waitingIntros.add(onComplete);
      return () => {
        waitingIntros.delete(onComplete);
        startedRef.current = false;
      };
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introComplete = true;
      sessionStorage.setItem(introSessionKey, "true");
      overlay.style.display = "none";
      onComplete();
      return () => { startedRef.current = false; };
    }

    const mark = markRef.current;
    const maskSvg = maskSvgRef.current;
    const maskGeometry = maskGeometryRef.current;
    const cutout = cutoutRef.current;
    if (!mark || !maskSvg || !maskGeometry || !cutout) return;

    const { gsap } = ensureGsap();
    let timeline: ReturnType<typeof gsap.timeline> | null = null;
    const monogram = mark.querySelector<HTMLElement>("[data-gj-monogram]");
    if (!monogram) return;
    activeIntro = overlay;
    const paths = mark.querySelectorAll<SVGPathElement>("[data-gj-path]");
    const layoutMask = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const bounds = monogram.getBoundingClientRect();
      maskSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      maskGeometry.setAttribute("transform", `translate(${(width - bounds.width) / 2} ${(height - bounds.height) / 2}) scale(${bounds.width / 100} ${bounds.height / 80})`);
      return { focalX: (width - bounds.width) / 2 + bounds.width * 55 / 100, focalY: (height - bounds.height) / 2 + bounds.height * 10 / 80 };
    };
    const { focalX, focalY } = layoutMask();
    window.addEventListener("resize", layoutMask);
    const context = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0 });
      });
      gsap.set(maskSvg, { autoAlpha: 0 });
      gsap.set(mark, { autoAlpha: 0 });

      timeline = gsap.timeline({ onComplete: () => {
        overlay.style.display = "none";
        introComplete = true;
        sessionStorage.setItem(introSessionKey, "true");
        activeIntro = null;
        onComplete();
        waitingIntros.forEach((complete) => complete());
        waitingIntros.clear();
      } });
      timeline
        .set(mark, { autoAlpha: 1 }, 1)
        .to(paths, { strokeDashoffset: 0, duration: 0.76, ease: "power3.out" }, 1)
        .to(paths, { fillOpacity: 1, duration: 0.18 }, 1.58)
        .set(maskSvg, { autoAlpha: 1 }, 1.76)
        .set(overlay, { backgroundColor: "transparent" }, 1.76)
        .set(mark, { autoAlpha: 0 }, 1.76)
        .fromTo(cutout, { scale: 1, svgOrigin: `${focalX} ${focalY}` }, { scale: 100, duration: 0.88, ease: "expo.in" }, 1.76);
    }, overlay);

    return () => {
      window.removeEventListener("resize", layoutMask);
      timeline?.kill();
      context.revert();
      if (activeIntro === overlay) activeIntro = null;
      startedRef.current = false;
    };
  }, [onComplete]);

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <svg ref={maskSvgRef} className={styles.maskSurface} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <g ref={cutoutRef}>
              <g ref={maskGeometryRef}>
                {Object.values(GJ_PATHS).map((d) => <path key={d} d={d} fill="black" fillRule="evenodd" />)}
              </g>
            </g>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#eef3f7" mask={`url(#${maskId})`} />
      </svg>
      <div ref={markRef} className={styles.mark}>
        <GJMonogram tone="navy" intro />
      </div>
    </div>
  );
}
