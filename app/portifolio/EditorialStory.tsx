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
          <figcaption>Florianópolis, BR</figcaption>
        </figure>
        <blockquote className={styles.quote} data-reveal>
          <p>
            I started my IT career as a young apprentice at the company where I still work today.
            It was my first professional experience in a corporate environment, where I connected
            with support, urgent situations and <em>problem solving.</em>
          </p>
          <footer>Gabriel Jabour — Service Desk Analyst</footer>
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
          <figcaption>Chile, 2024</figcaption>
        </figure>
      </div>
      <div className={styles.storyBottom}>
        <div className={styles.noteCard} data-reveal data-shot>
          <p className={styles.kicker}>Traceable execution</p>
          <p>On my own projects I use an AI-assisted pull request workflow with an activity log of every step.</p>
        </div>
        <p className={styles.storyBody} data-reveal>
          Over time, I grew into technical support, software deployment, IT projects, DLP,
          networks and automation. My way of working combines practical execution,
          clear communication and <em>result validation.</em>
        </p>
      </div>
    </section>
  );
}
