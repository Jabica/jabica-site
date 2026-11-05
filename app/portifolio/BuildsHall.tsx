"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const filters = ["All", "2025", "2024", "Earlier"] as const;
type Filter = (typeof filters)[number];

const builds = [
  { name: "Axon Relay", year: "2025", tag: "2025", tone: "blue", note: "A relay for signals that should not get lost." },
  { name: "Desk Runtime", year: "2024", tag: "2024", tone: "navy", note: "The everyday system behind the desk." },
  { name: "Packet Garden", year: "2024", tag: "2024", tone: "ice", note: "Watching flows without the noise." },
  { name: "Red Queue", year: "2023", tag: "Earlier", tone: "blue", note: "A queue with a bias for finishing." },
  { name: "Night Shift", year: "2023", tag: "Earlier", tone: "navy", note: "Automation that covers the late hours." },
  { name: "Glacier Ops", year: "2022", tag: "Earlier", tone: "ice", note: "Slow, cold, and hard to break." },
  { name: "Static Bloom", year: "2022", tag: "Earlier", tone: "blue", note: "A front end that stays put." },
  { name: "First Commit", year: "2019", tag: "Earlier", tone: "navy", note: "Where the habit started." },
] as const;

export function BuildsHall() {
  const rootRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<string | null>(null);
  const visible = builds.filter((build) => filter === "All" || build.tag === filter).length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = root.querySelectorAll<HTMLElement>("[data-build]");
        gsap.from(cards, {
          y: 36,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
          onComplete: () => {
            gsap.set(cards, { clearProps: "transform,opacity,visibility" });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hall} id="builds" ref={rootRef} data-nav-dark aria-labelledby="builds-title">
      <div className={styles.hallHead}>
        <h2 id="builds-title">
          BUILDS
          <br />
          <em>HALL OF FAME</em>
        </h2>
        <p className={styles.hallIntro}>
          Placeholder posters for the systems, tools, and late-night builds. Hover to lift them.
          Filter by season.
        </p>
      </div>
      <div className={styles.filters} role="toolbar" aria-label="Filter builds">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className={styles.buildCount} aria-live="polite">
        {visible} {visible === 1 ? "build" : "builds"}
      </p>
      <div className={styles.buildGrid}>
        {builds.map((build) => {
          const hidden = filter !== "All" && build.tag !== filter;
          const pressed = active === build.name;
          return (
            <button
              key={build.name}
              type="button"
              className={styles.buildCard}
              data-build
              hidden={hidden}
              aria-pressed={pressed}
              onClick={() => setActive(pressed ? null : build.name)}
            >
              <div className={styles.buildArt} data-tone={build.tone} aria-hidden="true">
                {build.year.slice(2)}
              </div>
              <p className={styles.buildName}>{build.name}</p>
              <p className={styles.buildMeta}>
                Build <strong>{build.year}</strong>
              </p>
              {pressed ? <p className={styles.buildDetail}>{build.note}</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
