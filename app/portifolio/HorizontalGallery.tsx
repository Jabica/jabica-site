"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const moments = [
  {
    title: "Project Alpha",
    year: "2024",
    note: "Systems that stay up when the day gets loud.",
    ink: "light",
    bg: "var(--sky-raised)",
  },
  {
    title: "Night Ops",
    year: "2024",
    note: "Automation that keeps working after hours.",
    ink: "light",
    bg: "var(--jacket)",
  },
  {
    title: "Field Kit",
    year: "2025",
    note: "Notes collected away from the desk.",
    ink: "dark",
    bg: "var(--snow)",
  },
  {
    title: "Signal Desk",
    year: "2025",
    note: "A watch on the things that actually matter.",
    ink: "light",
    bg: "var(--sky-bright)",
  },
  {
    title: "Redline",
    year: "2023",
    note: "Interfaces with a pulse and a point.",
    ink: "light",
    bg: "var(--jacket)",
  },
  {
    title: "Northbound",
    year: "2026",
    note: "Lab experiments, still in motion.",
    ink: "dark",
    bg: "var(--ice)",
  },
] as const;

export function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const { gsap } = ensureGsap();
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(distance(), 1)}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const midpoint = window.innerWidth / 2;
              let best = 0;
              let bestDist = Number.POSITIVE_INFINITY;
              cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const dist = Math.abs(rect.left + rect.width / 2 - midpoint);
                const t = Math.min(dist / (window.innerWidth * 0.7), 1);
                card.style.transform = `scale(${(1 - t * 0.06).toFixed(3)})`;
                card.style.opacity = (1 - t * 0.28).toFixed(3);
                if (dist < bestDist) {
                  bestDist = dist;
                  best = index;
                }
              });
              if (countRef.current) {
                countRef.current.textContent = String(best + 1).padStart(2, "0");
              }
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
        return () => {
          cards.forEach((card) => {
            card.style.removeProperty("transform");
            card.style.removeProperty("opacity");
          });
          barRef.current?.style.removeProperty("transform");
        };
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hSection} id="gallery" ref={sectionRef} data-nav-dark aria-labelledby="gallery-title">
      <div className={styles.hTop}>
        <h2 id="gallery-title">Selected moments</h2>
        <p className={styles.hCounter}>
          <span ref={countRef}>01</span>
          {` / ${String(moments.length).padStart(2, "0")}`}
        </p>
      </div>
      <div className={styles.hTrack} ref={trackRef}>
        {moments.map((item) => (
          <article
            key={item.title}
            className={styles.hCard}
            data-card
            data-ink={item.ink}
            style={{ background: item.bg }}
          >
            <p className={styles.hYear}>{item.year}</p>
            <div>
              <h3>{item.title}</h3>
              <p className={styles.hNote}>{item.note}</p>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.progress} aria-hidden="true">
        <span ref={barRef} />
      </div>
    </section>
  );
}
