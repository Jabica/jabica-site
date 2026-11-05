"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const topLine = "MESSAGE FROM GABRIEL  ✳  ".repeat(8);
const bottomLine = "IT & DEV  ✳  BUILDING IN MOTION  ✳  ".repeat(8);

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
        <p className={styles.marqueeStatic}>MESSAGE FROM GABRIEL</p>
        <div className={styles.marqueeTrack}>
          <span>{topLine}</span>
          <span>{topLine}</span>
        </div>
      </div>
      <div className={`${styles.marqueeViewport} ${styles.marqueeReverse}`} aria-hidden="true">
        <p className={styles.marqueeStatic}>IT & DEV · BUILDING IN MOTION</p>
        <div className={styles.marqueeTrack}>
          <span>{bottomLine}</span>
          <span>{bottomLine}</span>
        </div>
      </div>
      <div className={styles.statementPin} ref={pinRef}>
        <p className={styles.kicker} data-line>
          01 / Message from Gabriel
        </p>
        <h2 id="message-title" className={styles.statement}>
          <span data-line>BUILDING SYSTEMS</span>
          <span data-line>
            THAT STAY <em>IN MOTION.</em>
          </span>
          <span data-line>IT, OPS, AND THE</span>
          <span data-line>
            <em>LONG GAME.</em>
          </span>
        </h2>
        <p className={styles.statementNote} data-line>
          A note on IT, development, and building while things are in motion.
        </p>
      </div>
    </section>
  );
}
