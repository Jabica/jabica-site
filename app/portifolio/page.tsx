"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./portifolio.module.css";
import { PinnedScrollSequence } from "./PinnedScrollSequence";
import { MovingContours } from "./ContourBackground";
import { BelowHero } from "./BelowHero";
import { FullscreenMenu } from "./FullscreenMenu";
import { ensureGsap } from "./motion";
import { GJMonogram } from "./GJMonogram";
import { IntroOverlay } from "./IntroOverlay";

// Magnetic hover on buttons and CTA links: translates toward cursor within ~10px with spring back
// Disabled under prefers-reduced-motion and on (pointer: coarse)
function useMagneticButtons() {
  useEffect(() => {
    const isInteractive =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    if (!isInteractive) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const cleanups: Array<() => void> = [];

    elements.forEach((el) => {
      let isHovered = false;

      const onPointerMove = (e: PointerEvent) => {
        isHovered = true;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const maxDist = 10;
        const tx = Math.max(-maxDist, Math.min(maxDist, dx * 0.32));
        const ty = Math.max(-maxDist, Math.min(maxDist, dy * 0.32));

        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
        el.style.transition = "transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)";
      };

      const onPointerLeave = () => {
        if (!isHovered) return;
        isHovered = false;
        el.style.transform = "translate3d(0, 0, 0)";
        el.style.transition = "transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      cleanups.push(() => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);
}

export default function PortifolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navOnSnow, setNavOnSnow] = useState(true); // snow hero first paint; detector corrects on mount
  const [markReplay, setMarkReplay] = useState(0);
  const scrolledRef = useRef(false);
  const [introActive, setIntroActive] = useState(true);
  const completeIntro = useCallback(() => setIntroActive(false), []);
  const pendingScroll = useRef<string | null | undefined>(undefined);
  const menuWasOpen = useRef(false);
  const headerRef = useRef<HTMLElement>(null);

  useMagneticButtons();

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 48;
      if (scrolledRef.current === next) return;
      const wasScrolled = scrolledRef.current;
      scrolledRef.current = next;
      setScrolled(next);
      if (wasScrolled && !next) setMarkReplay((token) => token + 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let frame = 0;
    const isActiveDark = (el: Element | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number.parseFloat(style.opacity) >= 0.2
      );
    };

    const update = () => {
      frame = 0;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 70;
      const probeY = Math.max(8, Math.min(headerBottom - 8, 56));

      // Full-bleed opaque overlays (e.g. pinned hero dark backdrop) use pointer-events:none,
      // so elementsFromPoint cannot see them — detect via opacity + band coverage instead.
      let overDark = false;
      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((marker) => {
        if (overDark) return;
        const style = getComputedStyle(marker);
        const opacity = Number.parseFloat(style.opacity);
        if (style.pointerEvents !== "none" || opacity < 0.35) return;
        if (style.display === "none" || style.visibility === "hidden") return;
        const rect = marker.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= headerBottom) overDark = true;
      });

      if (!overDark) {
        const probeXs = [32, Math.round(window.innerWidth * 0.5), Math.max(32, window.innerWidth - 96)];
        for (const x of probeXs) {
          const stack = document.elementsFromPoint(x, probeY);
          for (const node of stack) {
            if (!(node instanceof Element)) continue;
            if (node.closest("header") || node.closest("[data-gj-monogram]")) continue;
            const hiddenMenu = node.closest("#portfolio-menu");
            if (hiddenMenu && hiddenMenu.getAttribute("aria-hidden") === "true") continue;
            const dark = node.closest("[data-nav-dark]");
            if (dark && isActiveDark(dark)) {
              overDark = true;
              break;
            }
            // First real page content under the probe without an active dark marker => light/snow.
            if (node.closest("section, article, footer, main")) break;
          }
          if (overDark) break;
        }
      }

      setNavOnSnow(!overDark);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden"],
    });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) menuWasOpen.current = true;

    if (menuOpen || locked || introActive) {
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }

    const target = pendingScroll.current;
    const shouldScroll = target !== undefined;
    if (shouldScroll) pendingScroll.current = undefined;

    const { ScrollTrigger } = ensureGsap();
    const id = requestAnimationFrame(() => {
      if (menuWasOpen.current) {
        ScrollTrigger.refresh();
        menuWasOpen.current = false;
      }
      if (!shouldScroll || target === undefined) return;
      if (target === null) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      document.getElementById(target)?.scrollIntoView({ behavior: "auto" });
    });
    return () => cancelAnimationFrame(id);
  }, [menuOpen, locked, introActive]);

  const toggleLock = () => {
    if (!locked) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    setLocked(!locked);
  };

  const navigateTo = (id: string | null) => {
    pendingScroll.current = id;
    setLocked(false);
    setMenuOpen(false);
  };

  return (
    <main className={styles.page}>
      {introActive && <IntroOverlay onComplete={completeIntro} />}
      <header ref={headerRef} className={`${styles.nav} ${scrolled ? styles.navScrolled : ""} ${navOnSnow ? styles.navOnSnow : ""}`}>
        <Link href="/" className={styles.brand} aria-label="Gabriel Jabour home">
          GABRIEL<br />JABOUR
        </Link>
        <div className={styles.navActions}>
          <Link className={styles.workButton} href="#builds" data-magnetic onClick={(event) => { event.preventDefault(); navigateTo("builds"); }}>
            VIEW WORK <span aria-hidden="true">↗</span>
          </Link>
          <button
            className={styles.menuButton}
            type="button"
            data-magnetic
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="portfolio-menu"
          >
            <span /> <span />
          </button>
        </div>
      </header>
      <GJMonogram key={markReplay} className={`${styles.navMonogram} ${scrolled ? styles.navMonogramScrolled : ""}`} enterDelay={2300} replayToken={markReplay} />

      <PinnedScrollSequence locked={locked} onToggleLock={toggleLock} introDone={!introActive}>
        <MovingContours tone="lightTransition" />
      </PinnedScrollSequence>

      <BelowHero />
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={navigateTo} />
    </main>
  );
}
