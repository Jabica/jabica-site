"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const topLine = "SERVICE DESK IN REAL OPERATIONS  ✳  AUTOMATION THAT REDUCES REWORK  ✳  IT PROJECTS WITH IMPACT  ✳  ".repeat(4);
const bottomLine = "HENRY SCHEIN BRAZIL  ✳  DENTAL SPEED GRAPH  ✳  SUPPORT  ✳  INFRASTRUCTURE  ✳  AUTOMATION  ✳  ".repeat(4);

export function MessageStatement() {
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = pin.querySelectorAll<HTMLElement>("[data-line]");
        gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.7,
          },
        }).fromTo(
          lines,
          { autoAlpha: 0.2, y: 42 },
          { autoAlpha: 1, y: 0, ease: "none", stagger: 0.18 },
        );
      });
    }, pin);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.message} id="message" data-nav-dark aria-labelledby="message-title">
      <div className={styles.marqueeViewport} aria-hidden="true">
        <p className={styles.marqueeStatic}>SERVICE DESK IN REAL OPERATIONS</p>
        <div className={styles.marqueeTrack}>
          <span>{topLine}</span>
          <span>{topLine}</span>
        </div>
      </div>
      <div className={`${styles.marqueeViewport} ${styles.marqueeReverse}`} aria-hidden="true">
        <p className={styles.marqueeStatic}>SUPPORT · INFRASTRUCTURE · AUTOMATION</p>
        <div className={styles.marqueeTrack}>
          <span>{bottomLine}</span>
          <span>{bottomLine}</span>
        </div>
      </div>
      <div className={styles.statementPin} ref={pinRef}>
        <p className={styles.kicker} data-line>
          01 / Operational philosophy
        </p>
        <h2 id="message-title" className={styles.statement}>
          <span data-line>REDUCING REWORK.</span>
          <span data-line>
            PROTECTING <em>OPERATIONS.</em>
          </span>
          <span data-line>WITHOUT SLOWING</span>
          <span data-line>
            <em>DOWN THE USER.</em>
          </span>
        </h2>
        <p className={styles.statementNote} data-line>
          Service Desk Analyst at Henry Schein Brazil / Dental Speed Graph. Working across support,
          infrastructure, corporate projects and automation to reduce rework and increase reliability.
        </p>
      </div>
    </section>
  );
}
