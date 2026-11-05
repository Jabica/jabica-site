"use client";

import { useEffect, useRef } from "react";
import styles from "./below.module.css";
import { LightAtmosphere } from "./LightAtmosphere";
import { ensureGsap } from "./motion";
import { externalLinkProps, socialLinks } from "./siteLinks";

export function SocialsCallout() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const links = root.querySelectorAll<HTMLElement>("[data-social]");
        gsap.from(links, {
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
          onComplete: () => {
            gsap.set(links, { clearProps: "opacity,visibility" });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.socials} id="contact" ref={rootRef} aria-labelledby="socials-title">
      <LightAtmosphere />
      <p className={styles.socialMark} aria-hidden="true">
        *
      </p>
      <h2 id="socials-title">{"WHAT'S UP ON SOCIALS"}</h2>
      <p className={styles.socialIntro}>For professional contact, use email or WhatsApp. LinkedIn is available for history and connections.</p>
      <ul className={styles.socialList}>
        {socialLinks.map((item) => (
          <li key={item.label}>
            <a
              className={styles.socialLink}
              href={item.href}
              data-magnetic
              data-social
              {...externalLinkProps(item.href)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
