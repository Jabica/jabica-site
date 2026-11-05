"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./below.module.css";
import { LightAtmosphere } from "./LightAtmosphere";
import { ensureGsap } from "./motion";

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
          Featured
        </p>
        <h2 id="lab-title" data-reveal>
          GABRIEL
          <br />
          <em>LAB</em>
        </h2>
        <p className={styles.labCopy} data-reveal>
          A placeholder drop for the work in progress: notes, tools, and experiments collected in
          one place.
        </p>
        <Link className={styles.labButton} href="/#projetos" data-magnetic>
          OPEN THE LAB <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <article className={styles.poster} data-reveal>
        <p className={styles.kicker}>Case 01</p>
        <p>
          <span>Featured study</span>
          <strong>NIGHT DESK</strong>
        </p>
        <p>A monitoring story told as a poster, not a product shot.</p>
      </article>
    </section>
  );
}
