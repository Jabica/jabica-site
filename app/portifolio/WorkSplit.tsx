"use client";

import { useEffect, useRef } from "react";
import styles from "./below.module.css";
import { LightAtmosphere } from "./LightAtmosphere";
import { ensureGsap } from "./motion";
import { InlineArrow } from "./InlineArrow";

export function WorkSplit() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = root.querySelectorAll<HTMLElement>("[data-tilt]");
        gsap.from(panels, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
          onComplete: () => {
            gsap.set(panels, { clearProps: "clipPath" });
          },
        });
      });
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
        const cleanups: Array<() => void> = [];
        panels.forEach((panel) => {
          const move = (event: PointerEvent) => {
            const rect = panel.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            panel.style.transition = "transform 0.08s linear";
            panel.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
          };
          const leave = () => {
            panel.style.transition = "transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            panel.style.transform = "";
          };
          panel.addEventListener("pointermove", move);
          panel.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            panel.removeEventListener("pointermove", move);
            panel.removeEventListener("pointerleave", leave);
            panel.style.removeProperty("transform");
            panel.style.removeProperty("transition");
          });
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.split} ref={rootRef} aria-label="On work and off work">
      <article id="on-work" className={styles.panel} data-tilt data-nav-dark>
        <p className={styles.kicker}>01 / In the trenches</p>
        <div>
          <h2>
            <em>ON</em> WORK
          </h2>
          <p>Service Desk Analyst at Henry Schein Brazil / Dental Speed Graph. Support, infrastructure, corporate projects and automation grounded in daily operations.</p>
          <a href="#builds" data-magnetic>EXPLORE BUILDS <InlineArrow /></a>
        </div>
      </article>
      <article id="off-work" className={styles.panelLight} data-tilt>
        <LightAtmosphere />
        <p className={styles.kicker}>02 / Beyond the screen</p>
        <div>
          <h2>
            <em>OFF</em> WORK
          </h2>
          <p>Skiing and time away from the keyboard. <span className={styles.todo}>TODO: Gabriel to add other off-work interests.</span></p>
          {/* TODO [Gabriel]: Add genuine off-work interests beyond skiing and time away. */}
          <a href="#story" data-magnetic>
            READ THE STORY <InlineArrow />
          </a>
        </div>
      </article>
    </section>
  );
}
