"use client";

import { useEffect, useRef } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const metrics = [
  { value: "400", suffix: "+", label: "Corporate lines migrated" },
  { value: "10", suffix: "Y", label: "Windows experience" },
  { value: "7", suffix: "Y", label: "macOS experience" },
  { value: "4", suffix: "Y", label: "DLP and IT projects" },
] as const;

export function OperationalMetrics() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.querySelectorAll("[data-metric]"), {
          y: 36,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
          onComplete: () => gsap.set(root.querySelectorAll("[data-metric]"), { clearProps: "transform,opacity,visibility" }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.metrics} id="metrics" ref={rootRef} data-nav-dark aria-labelledby="metrics-title">
      <h2 id="metrics-title" className={styles.kicker}>Indicators / Scale</h2>
      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <div className={styles.metric} data-metric key={metric.label}>
            <p className={styles.metricValue}>{metric.value}<span>{metric.suffix}</span></p>
            <p className={styles.metricLabel}>{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
