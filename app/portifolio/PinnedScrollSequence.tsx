"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PinnedScrollSequence.module.css";
import { PortraitReveal } from "./HeroReveal";
import { GJMonogram } from "./GJMonogram";
import { HeroMeteors, type MeteorStamp } from "./HeroMeteors";
import { InlineArrow } from "./InlineArrow";

interface PinnedScrollSequenceProps {
  children?: ReactNode;
  locked?: boolean;
  onToggleLock?: () => void;
  introDone?: boolean;
}

export function PinnedScrollSequence({
  children,
  locked = false,
  onToggleLock,
  introDone = true,
}: PinnedScrollSequenceProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const darkBackdropRef = useRef<HTMLDivElement>(null);
  const meteorLayerRef = useRef<HTMLDivElement>(null);
  const washStampsRef = useRef<MeteorStamp[]>([]);
  const heroInfoCardWrapRef = useRef<HTMLDivElement>(null);
  const heroInfoCardRef = useRef<HTMLDivElement>(null);
  const heroCornerMetaWrapRef = useRef<HTMLDivElement>(null);
  const heroCornerMetaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const textRowsRef = useRef<HTMLDivElement>(null);
  const marqueeTiltRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const cardTiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardBackdropRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const signatureSvgRef = useRef<SVGSVGElement>(null);
  const scrollHintRef = useRef<HTMLSpanElement>(null);

  const [liveClock, setLiveClock] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setLiveClock(formatter.format(now));
      } catch {
        const d = new Date();
        setLiveClock(d.toTimeString().slice(0, 8));
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const stage = stageRef.current;
    const darkBackdrop = darkBackdropRef.current;
    const meteorLayer = meteorLayerRef.current;
    const heroInfoCardWrap = heroInfoCardWrapRef.current;
    const heroInfoCard = heroInfoCardRef.current;
    const heroCornerMetaWrap = heroCornerMetaWrapRef.current;
    const heroCornerMeta = heroCornerMetaRef.current;
    const header = headerRef.current;
    const textRows = textRowsRef.current;
    const marqueeTilt = marqueeTiltRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    const frameContainer = frameContainerRef.current;
    const cardTilt = cardTiltRef.current;
    const card = cardRef.current;
    const cardBackdrop = cardBackdropRef.current;
    const photo = photoRef.current;
    const signatureSvg = signatureSvgRef.current;
    const scrollHint = scrollHintRef.current;

    if (
      !container ||
      !stage ||
      !darkBackdrop ||
      !meteorLayer ||
      !heroInfoCardWrap ||
      !heroCornerMetaWrap ||
      !header ||
      !textRows ||
      !row1 ||
      !row2 ||
      !frameContainer ||
      !card ||
      !cardBackdrop ||
      !photo ||
      !signatureSvg ||
      !scrollHint
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Respect prefers-reduced-motion: static final layout without pinning
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(frameContainer, {
          xPercent: -50,
          yPercent: -50,
          scale: 0.90,
          y: 0,
        });
        gsap.set(darkBackdrop, { opacity: 1 });
        gsap.set(meteorLayer, { opacity: 0 });
        gsap.set(cardBackdrop, { opacity: 1 });
        gsap.set(card, {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "rgba(238, 243, 247, 0.9)",
          backgroundColor: "#02305e",
          boxShadow: "0 28px 75px -15px rgba(0, 0, 0, 0.75)",
        });
        gsap.set(photo, {
          filter: "grayscale(100%) contrast(110%)",
        });
        gsap.set(header, { opacity: 1, y: 0 });
        gsap.set(heroInfoCardWrap, { opacity: 0 });
        gsap.set(heroCornerMetaWrap, { opacity: 0 });
        gsap.set(textRows, { opacity: 1 });
        gsap.set(row1, { xPercent: 0 });
        gsap.set(row2, { xPercent: 0 });
        const paths = signatureSvg.querySelectorAll<SVGPathElement>("path");
        paths.forEach((p) => {
          gsap.set(p, { strokeDashoffset: 0 });
        });
        gsap.set(signatureSvg, {
          filter:
            "drop-shadow(0 0 5px rgba(255, 42, 75, 0.7)) drop-shadow(0 0 12px rgba(192, 1, 27, 0.45))",
        });
        gsap.set(scrollHint, { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const paths = signatureSvg.querySelectorAll<SVGPathElement>("path");
        paths.forEach((path) => {
          const length = Math.max(path.getTotalLength(), 120);
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        const getInitialState = () => {
          const sw = stage.clientWidth || window.innerWidth;
          const sh = stage.clientHeight || window.innerHeight;
          const isMobile = sw <= 768;

          // Contain-style sizing: full head + shoulders visible at all times, large centred portrait filling the hero height
          const heroPortraitHeight = isMobile
            ? Math.min(sw * 0.94 * (1448 / 1086), sh * 0.86)
            : Math.min(sw * 0.72 * (1448 / 1086), sh * 0.90);

          // Card height in 16:9 format at scale 1.0
          const cw =
            card.clientWidth ||
            (isMobile ? Math.min(sw * 0.92, 460) : Math.min(sw * 0.68, 1020));
          const cardHeight = card.clientHeight || cw * (9 / 16);

          const scale = heroPortraitHeight / Math.max(1, cardHeight);
          // Hero placement: bottom of portrait sits flush at bottom of viewport
          const initialY = (sh - cardHeight * scale) / 2;

          return {
            scale: Number.isFinite(scale) && scale > 0 ? scale : 1.5,
            y: Number.isFinite(initialY) ? initialY : 0,
          };
        };

        gsap.set(frameContainer, {
          xPercent: -50,
          yPercent: -50,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            pin: stage,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Initial setup
        gsap.set(header, { opacity: 0, y: 14 });
        const markPaths = header.querySelectorAll<SVGPathElement>("[data-gj-path]");
        const markSweep = header.querySelector<SVGGElement>("[data-gj-sweep]");
        if (markSweep) {
          gsap.set(markSweep, { visibility: "hidden" });
          tl.set(markSweep, { visibility: "visible" }, 34);
        }
        gsap.set(markPaths, { fillOpacity: 0, stroke: "transparent" });
        tl.to(markPaths, { fillOpacity: 1, ease: "power2.out", duration: 8 }, 26);
        gsap.set(scrollHint, { opacity: 0 });
        gsap.set(textRows, { opacity: 0 });
        gsap.set(darkBackdrop, { opacity: 0 });
        gsap.set(meteorLayer, { opacity: 1 });
        gsap.set(cardBackdrop, { opacity: 0 });
        gsap.set(photo, { filter: "grayscale(0%) contrast(100%)" });

        // Phase 1: Hero living UI details fade out as portrait scales down into card (0% -> 22%)
        tl.fromTo(
          heroInfoCardWrap,
          { opacity: 1, y: 0, x: 0 },
          { opacity: 0, y: 30, x: -16, ease: "power1.out", duration: 20 },
          0
        );

        tl.fromTo(
          heroCornerMetaWrap,
          { opacity: 1, y: 0, x: 0 },
          { opacity: 0, y: 24, x: 16, ease: "power1.out", duration: 18 },
          0
        );

        // The same animated contour field changes tone as the stage darkens.
        tl.fromTo(
          darkBackdrop,
          { opacity: 0 },
          { opacity: 1, ease: "power1.inOut", duration: 37 },
          8
        );
        tl.fromTo(
          meteorLayer,
          { opacity: 1 },
          { opacity: 0, ease: "power1.inOut", duration: 30 },
          8
        );

        // Text rows fade in behind the card (4% -> 22%)
        tl.fromTo(
          textRows,
          { opacity: 0 },
          { opacity: 1, ease: "power1.in", duration: 18 },
          4
        );

        // Row 1 (accent serif, Georgia, var(--sky-blue)) scrolls left (0% -> 100%)
        tl.fromTo(
          row1,
          { xPercent: 4 },
          { xPercent: -36, ease: "none", duration: 100 },
          0
        );

        // Row 2 (bold sans, Arial, var(--deep-blue)) scrolls right (0% -> 100%)
        tl.fromTo(
          row2,
          { xPercent: -38 },
          { xPercent: 3, ease: "none", duration: 100 },
          0
        );

        // Phase 1: Frame scales down and glides into wide landscape card (0% -> 45%)
        tl.fromTo(
          frameContainer,
          {
            scale: () => getInitialState().scale,
            y: () => getInitialState().y,
          },
          {
            scale: 1.0,
            y: 0,
            ease: "power1.inOut",
            duration: 45,
          },
          0
        );

        // Card backdrop (dark navy + faint ice contours) fades in (10% -> 45%)
        tl.fromTo(
          cardBackdrop,
          { opacity: 0 },
          { opacity: 1, ease: "power1.inOut", duration: 35 },
          10
        );

        // Card border & shadow form around the wide card (12% -> 45%)
        tl.fromTo(
          card,
          {
            borderRadius: 0,
            borderWidth: 0,
            borderColor: "rgba(238, 243, 247, 0)",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          },
          {
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "rgba(238, 243, 247, 0.9)",
            boxShadow: "0 28px 75px -15px rgba(0, 0, 0, 0.75)",
            ease: "power1.inOut",
            duration: 33,
          },
          12
        );

        // Card shrinks a bit (47% -> 75%)
        tl.to(
          frameContainer,
          {
            scale: 0.90,
            ease: "power2.inOut",
            duration: 28,
          },
          47
        );

        // Photo desaturates with the signature draw (35% -> 80%)
        // Grayscale 0->1 with slight contrast 1->1.1; face stays clearly visible
        tl.fromTo(
          photo,
          { filter: "grayscale(0%) contrast(100%)" },
          {
            filter: "grayscale(100%) contrast(110%)",
            ease: "power1.inOut",
            duration: 45,
          },
          35
        );

        // "GJ" logo and caption rise in early (10% -> 35%)
        tl.to(
          header,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 25,
          },
          10
        );

        // Hide the signature until it starts drawing: round line caps otherwise leave a stray dot
        gsap.set(signatureSvg, { autoAlpha: 0 });
        tl.fromTo(signatureSvg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "none" }, 35);

        // Neon signature draws itself via stroke-dashoffset (35% -> 80%)
        paths.forEach((path, idx) => {
          const length = Math.max(path.getTotalLength(), 120);
          tl.fromTo(
            path,
            { strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: "power1.inOut",
              duration: 30,
            },
            35 + idx * 15
          );
        });

        // Red neon glow intensifies as signature completes (72% -> 88%)
        tl.fromTo(
          signatureSvg,
          {
            filter:
              "drop-shadow(0 0 3px rgba(255, 42, 75, 0.5)) drop-shadow(0 0 8px rgba(192, 1, 27, 0.3))",
          },
          {
            filter:
              "drop-shadow(0 0 5px rgba(255, 42, 75, 0.7)) drop-shadow(0 0 12px rgba(192, 1, 27, 0.45))",
            ease: "power1.out",
            duration: 16,
          },
          72
        );

        // Scroll hint fades in before the final signature hold (72% -> 88%)
        tl.to(
          scrollHint,
          {
            opacity: 1,
            ease: "power1.out",
            duration: 16,
          },
          72
        );
      });
    }, container);

    // Subtle parallax tilt: card, hero copy, and marquee text follow mouse with easing
    // Disabled under prefers-reduced-motion and on pointer: coarse
    let tiltRafId = 0;
    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    let onPointerLeave: (() => void) | null = null;

    const isInteractive =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

    if (isInteractive) {
      let targetNx = 0;
      let targetNy = 0;
      let currentNx = 0;
      let currentNy = 0;

      onPointerMove = (e: PointerEvent) => {
        const sw = window.innerWidth;
        const sh = window.innerHeight;
        targetNx = Math.max(-1, Math.min(1, (e.clientX - sw / 2) / (sw / 2)));
        targetNy = Math.max(-1, Math.min(1, (e.clientY - sh / 2) / (sh / 2)));
      };

      onPointerLeave = () => {
        targetNx = 0;
        targetNy = 0;
      };

      const updateTilt = () => {
        currentNx += (targetNx - currentNx) * 0.08;
        currentNy += (targetNy - currentNy) * 0.08;

        // Ambient floating motion (slow breathing oscillation)
        const timeSec = performance.now() * 0.001;
        const floatY = Math.sin(timeSec * 1.15) * 4.0;
        const floatRot = Math.cos(timeSec * 0.85) * 0.35;

        // Portrait / card tilt + ambient float
        if (cardTilt) {
          const rotX = -currentNy * 3.5;
          const rotY = currentNx * 3.5 + floatRot;
          const tx = currentNx * 10;
          const ty = currentNy * 7 + floatY;
          cardTilt.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
        }

        // Info card parallax shift
        if (heroInfoCard) {
          const itx = -currentNx * 8;
          const ity = -currentNy * 6 + floatY * 0.4;
          heroInfoCard.style.transform = `translate3d(${itx.toFixed(1)}px, ${ity.toFixed(1)}px, 0)`;
        }

        // Corner meta parallax shift
        if (heroCornerMeta) {
          const ctx = currentNx * 6;
          const cty = currentNy * 5 + floatY * 0.3;
          heroCornerMeta.style.transform = `translate3d(${ctx.toFixed(1)}px, ${cty.toFixed(1)}px, 0)`;
        }

        // Marquee text shift
        if (marqueeTilt) {
          const mtx = currentNx * 8;
          const mty = currentNy * 5;
          marqueeTilt.style.transform = `translate3d(${mtx.toFixed(1)}px, ${mty.toFixed(1)}px, 0)`;
        }

        tiltRafId = requestAnimationFrame(updateTilt);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onPointerLeave);
      tiltRafId = requestAnimationFrame(updateTilt);
    }

    return () => {
      ctx.revert();
      if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
      if (onPointerLeave) window.removeEventListener("pointerleave", onPointerLeave);
      if (tiltRafId) cancelAnimationFrame(tiltRafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={styles.sequenceSection}
      aria-label="Gabriel Jabour — Everyday in Motion portrait sequence"
    >
      <div ref={stageRef} className={styles.stage} data-reveal-hero>
        <div ref={darkBackdropRef} className={styles.stageDarkBackdrop} data-nav-dark aria-hidden="true" />

        <div className={styles.backgroundLayer}>{children}</div>

        <div ref={meteorLayerRef} className={styles.meteorLayer} aria-hidden="true">
          <HeroMeteors active={introDone} stampsRef={washStampsRef} />
        </div>

        <h2 className={styles.visuallyHidden}>
          Gabriel Jabour — Personal Portfolio
        </h2>

        {/* Lando-style living UI info card bottom-left */}
        <div ref={heroInfoCardWrapRef} className={styles.heroInfoCardWrap}>
          <div ref={heroInfoCardRef} className={styles.heroInfoCard} data-magnetic>
            <div className={styles.infoCardTop}>
              <span className={styles.infoCardPulseDot} aria-hidden="true" />
              <span className={styles.infoCardLabel}>SPECIALTY / FOCUS</span>
            </div>
            <div className={styles.infoCardContent}>
              <div className={styles.infoCardName}>GABRIEL JABOUR</div>
              <div className={styles.infoCardRole}>IT & DEV</div>
            </div>
            <div className={styles.infoCardTrack} aria-hidden="true">
              <div className={styles.infoCardProgress} />
            </div>
          </div>
        </div>

        {/* Living UI corner meta details bottom-right */}
        <div ref={heroCornerMetaWrapRef} className={styles.heroCornerMetaWrap}>
          <div ref={heroCornerMetaRef} className={styles.heroCornerMeta}>
            <div className={styles.metaRow}>
              <span className={styles.metaCoords}>27°35&apos;S 48°32&apos;W</span>
              <span className={styles.metaLoc}>FLORIANÓPOLIS, BR</span>
            </div>
            <div className={styles.metaClockRow}>
              <span className={styles.clockPulseDot} aria-hidden="true" />
              <span className={styles.metaClock} suppressHydrationWarning>
                {liveClock ? `${liveClock} BRT` : "--:--:-- BRT"}
              </span>
            </div>
            <div className={styles.metaActionRow}>
              <span className={styles.hintDot} />
              <span>MOVE TO REVEAL * SCROLL TO PIN <InlineArrow direction="down" size={12} /></span>
            </div>
          </div>
        </div>

        {/* Mobile touch explore toggle */}
        {onToggleLock && (
          <button
            className={styles.lockButton}
            type="button"
            onClick={onToggleLock}
            aria-pressed={locked}
          >
            {locked ? "BACK TO SCROLL" : "TAP TO EXPLORE"}
          </button>
        )}

        {/* Header lockup: Small "GJ" logo and short caption above the frame that fade in */}
        <div ref={headerRef} className={styles.headerLockup} aria-hidden="true">
          <div className={styles.gjMark}>
            <GJMonogram tone="ice" scrollDraw />
          </div>
          <p className={styles.caption}>A NOTE FROM GABRIEL / EVERYDAY IN MOTION</p>
        </div>

        {/* Behind the frame: two rows of huge text scrolling horizontally in opposite directions */}
        <div ref={textRowsRef} className={styles.textRows} aria-hidden="true">
          <div ref={marqueeTiltRef} className={styles.marqueeTiltWrap}>
            <div ref={row1Ref} className={styles.textRowSerif}>
              <span>
                GABRIEL JABOUR * BUILD WHAT MATTERS * GABRIEL JABOUR * BUILD WHAT MATTERS * GABRIEL JABOUR * BUILD WHAT MATTERS *&nbsp;
              </span>
            </div>
            <div ref={row2Ref} className={styles.textRowSans}>
              <span>
                EVERYDAY IN MOTION * LIVE BEYOND THE SCREEN * EVERYDAY IN MOTION * LIVE BEYOND THE SCREEN * EVERYDAY IN MOTION *&nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* Pinned portrait figure with neon signature overlay — single picture throughout */}
        <div ref={frameContainerRef} className={styles.frameContainer}>
          <div ref={cardTiltRef} className={styles.cardTiltWrap}>
            <div ref={cardRef} className={styles.photoCard}>
              {/* Dark navy backdrop + faint ice contour lines overlay */}
              <div ref={cardBackdropRef} className={styles.cardBackdrop}>
                <svg
                  className={styles.cardContours}
                  viewBox="0 0 1000 562"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M-50,110 C180,80 320,170 500,130 C680,90 820,160 1050,120" stroke="rgba(149, 166, 183, 0.35)" strokeWidth="1.2" />
                  <path d="M-50,210 C150,250 350,160 540,220 C730,280 850,200 1050,230" stroke="rgba(149, 166, 183, 0.30)" strokeWidth="1.2" />
                  <path d="M-50,330 C190,290 370,400 560,340 C750,280 880,380 1050,320" stroke="rgba(149, 166, 183, 0.35)" strokeWidth="1.2" />
                  <path d="M-50,430 C140,480 330,410 520,460 C710,510 860,440 1050,470" stroke="rgba(149, 166, 183, 0.30)" strokeWidth="1.2" />
                  <path d="M-50,55 C210,25 400,95 600,55 C800,15 920,75 1050,45" stroke="rgba(149, 166, 183, 0.24)" strokeWidth="1.2" />
                  <path d="M-50,510 C220,540 420,500 610,525 C800,550 910,510 1050,535" stroke="rgba(149, 166, 183, 0.24)" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Centered portrait: head + shoulders, contain-style, bottom-anchored, never cropped to face */}
              <div ref={photoRef} className={styles.photoInner}>
                <PortraitReveal locked={locked} washRef={washStampsRef} />
              </div>
            </div>

            {/* Hand-authored cursive "Jabour" neon signature (fluid single stroke + flourish underline, no stray dots) */}
            <svg
              ref={signatureSvgRef}
              className={styles.signatureSvg}
              viewBox="0 0 620 250"
              fill="none"
              aria-hidden="true"
            >
              {/* Fluid cursive "Jabour" wordmark */}
              <path
                className={styles.signaturePath}
                d="M 74 125 C 88 88 114 42 138 32 C 154 26 164 38 156 62 C 144 102 124 176 114 208 C 104 238 82 240 74 222 C 66 204 80 178 110 160 C 132 146 154 148 170 144 C 180 120 196 114 206 120 C 218 128 212 146 200 150 C 186 154 174 144 176 130 C 178 118 192 112 204 112 C 212 112 214 128 214 142 C 218 144 226 116 234 72 C 240 34 254 30 256 48 C 258 74 246 130 248 146 C 250 156 264 156 272 144 C 278 132 272 120 260 120 C 254 120 256 130 270 132 C 282 134 288 120 300 120 C 312 120 320 130 316 144 C 312 156 298 156 294 144 C 290 132 300 122 314 122 C 322 122 328 130 332 134 C 340 144 350 146 356 134 C 360 126 364 122 370 122 C 376 134 382 146 390 144 C 396 142 400 130 404 124 C 410 118 420 120 422 128 C 424 138 430 146 438 144 C 450 140 468 132 488 126"
              />
              {/* Confident flourish underline */}
              <path
                className={styles.signaturePath}
                d="M 98 186 C 168 206 308 208 438 180 C 488 168 532 150 552 136"
              />
            </svg>
          </div>
        </div>

        <span ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
          KEEP SCROLLING <InlineArrow direction="down" size={12} />
        </span>
      </div>
    </section>
  );
}

export default PinnedScrollSequence;
