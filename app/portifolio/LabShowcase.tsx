"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./below.module.css";
import { LightAtmosphere } from "./LightAtmosphere";
import { ensureGsap } from "./motion";
import { InlineArrow } from "./InlineArrow";

export function LabShowcase() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parts = root.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.from(parts, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
          onComplete: () => {
            gsap.set(parts, { clearProps: "transform,opacity,visibility" });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.lab} id="lab" ref={rootRef} aria-labelledby="lab-title">
      <LightAtmosphere />
      <div>
        <p className={styles.kicker} data-reveal>
          Featured study
        </p>
        <h2 id="lab-title" data-reveal>
          GABRIEL
          <br />
          <em>LAB</em>
        </h2>
        <p className={styles.labCopy} data-reveal>
          Technical studies and projects built around practical problems and clear outcomes.
        </p>
        <Link className={styles.labButton} href="#builds" data-magnetic>
          VIEW ALL BUILDS <InlineArrow />
        </Link>
      </div>
      <article className={styles.poster} data-reveal>
        <p className={styles.kicker}>Featured case</p>
        <p>
          <span>Coming soon</span>
          <strong>CASE STUDY TO BE CONFIRMED</strong>
        </p>
        <p>A featured case will appear here once Gabriel selects one to share.</p>
      </article>
    </section>
  );
}
