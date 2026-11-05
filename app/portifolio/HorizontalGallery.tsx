"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const moments = [
  {
    title: "ColPal / Okta Workflows",
    year: "2026",
    note: "Identity flows connecting local operations to the Colgate-Palmolive environment without breaking day-to-day work.",
    ink: "light",
    bg: "var(--sky-raised)",
    // Okta logo only — ColPal/Colgate logo not permitted.
    logo: "/images/logos/okta.svg",
    logoAlt: "Okta",
  },
  {
    title: "400+ Corporate Lines",
    year: "2024",
    note: "SIM cards, portability, carrier negotiation and logistics for remote employees across states.",
    ink: "light",
    bg: "var(--jacket)",
  },
  {
    title: "Avatar / Senior Sistemas",
    year: "2023",
    note: "Standby technical support and optimization during a new system rollout.",
    ink: "dark",
    bg: "var(--snow)",
  },
  {
    title: "Software & DLP",
    year: "2023",
    note: "Configuration and operation of corporate tools focused on security without impacting users.",
    ink: "light",
    bg: "var(--sky-bright)",
  },
  {
    title: "Operational Automation",
    year: "2025",
    note: "AI, APIs, scripts and documentation to improve daily work and user experience.",
    ink: "light",
    bg: "var(--jacket)",
  },
  {
    title: "Computer Science — UNISUL",
    year: "2026",
    note: "Expected completion December 2026. Distributed and Mobile Systems and Business Innovation coursework.",
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
        <h2 id="gallery-title">Corporate work &amp; education</h2>
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
            <div className={styles.hCardTop}>
              <p className={styles.hYear}>{item.year}</p>
              {"logo" in item && item.logo ? (
                <Image className={styles.hLogo} src={item.logo} alt={item.logoAlt} width={36} height={36} />
              ) : null}
            </div>
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
