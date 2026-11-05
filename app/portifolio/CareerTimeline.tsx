"use client";

import { useEffect, useRef } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const steps = [
  { title: "Started as a young apprentice", year: "2021–2022", text: "First corporate IT experience, with fast adaptation, urgency and growth inside the same company." },
  { title: "IT assistant and technical support", year: "2022–2023", text: "Employee support, ticket resolution, software deployment and response to urgent demands." },
  { title: "Corporate projects", year: "", text: "Support for the Avatar project with Senior Sistemas, DLP operations, print servers and ColPal environment integration with Okta Workflows." },
  { title: "Automation and technical growth", year: "", text: "Use of APIs, documentation and agents to reduce rework, improve traceability and support operational decisions." },
] as const;

export function CareerTimeline() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.querySelectorAll("[data-step]"), {
          y: 32,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
          onComplete: () => gsap.set(root.querySelectorAll("[data-step]"), { clearProps: "transform,opacity,visibility" }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.timeline} id="timeline" ref={rootRef} data-nav-dark aria-labelledby="timeline-title">
      <p className={styles.kicker}>03 / Timeline</p>
      <h2 id="timeline-title">FROM THE FIRST TICKET<br /><em>TO CORPORATE SYSTEMS.</em></h2>
      <div className={styles.timelineGrid}>
        {steps.map((step, index) => (
          <article className={styles.timelineStep} data-step key={step.title}>
            <p className={styles.timelineIndex}>{String(index + 1).padStart(2, "0")}{step.year && ` / ${step.year}`}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
