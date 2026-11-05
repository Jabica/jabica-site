"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./below.module.css";
import { LightAtmosphere } from "./LightAtmosphere";
import { ensureGsap } from "./motion";

export function EditorialStory() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
        const shots = root.querySelectorAll<HTMLElement>("[data-shot]");
        gsap.from(reveals, {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
          onComplete: () => {
            gsap.set(reveals, { clearProps: "transform,opacity,visibility" });
          },
        });
        gsap.from(shots, {
          clipPath: "inset(14% 0 0 0)",
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
          onComplete: () => {
            gsap.set(shots, { clearProps: "clipPath" });
          },
        });
        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((node) => {
          const shift = Number(node.dataset.shift ?? "-28");
          gsap.to(node, {
            y: shift,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.story} id="story" ref={rootRef} aria-labelledby="story-title">
      <LightAtmosphere />
      <p className={styles.kicker}>02 / The story</p>
      <h2 id="story-title" data-reveal>
        ON AND OFF
        <br />
        THE <em>DESK.</em>
      </h2>
      <div className={styles.storyLayout}>
        <figure className={styles.shot} data-reveal>
          <div className={styles.shotFrame} data-shot>
            <div className={styles.parallax} data-parallax data-shift="-28">
              <Image
                src="/images/hero/everyday.png"
                alt="Gabriel Jabour, everyday portrait"
                fill
                sizes="(max-width: 760px) 90vw, 28vw"
                className={styles.shotImg}
              />
            </div>
          </div>
          <figcaption>São Paulo, 2024</figcaption>
        </figure>
        <blockquote className={styles.quote} data-reveal>
          <p>
            It does not matter where you start. It matters what you <em>keep shipping.</em>
          </p>
          <footer>Gabriel</footer>
        </blockquote>
        <figure className={styles.shot} data-reveal>
          <div className={styles.shotFrame} data-shot>
            <div className={styles.parallax} data-parallax data-shift="-46">
              <Image
                src="/images/hero/ski.png"
                alt="Gabriel Jabour in a red ski jacket and goggles"
                fill
                sizes="(max-width: 760px) 90vw, 28vw"
                className={styles.shotImg}
              />
            </div>
          </div>
          <figcaption>Slope day, 2025</figcaption>
        </figure>
      </div>
      <div className={styles.storyBottom}>
        <div className={styles.noteCard} data-reveal data-shot>
          <p className={styles.kicker}>Notebook, 2026</p>
          <p>A field note for the version of the work that never makes the README.</p>
        </div>
        <p className={styles.storyBody} data-reveal>
          Technology, automation, and digital operations shape the desk. Away from the screen, the
          same curiosity keeps moving. The useful thing is not the first script. It is the one that
          still runs on a <em>bad day.</em>
        </p>
      </div>
    </section>
  );
}
