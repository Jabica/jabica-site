"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";
import { externalLinkProps, socialLinks } from "./siteLinks";

const pages = [
  { label: "Home", href: "/" },
  { label: "On work", href: "#on-work" },
  { label: "Off work", href: "#off-work" },
  { label: "Metrics", href: "#metrics" },
  { label: "Timeline", href: "#timeline" },
  { label: "Builds", href: "#builds" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
];

export function SiteFooter() {
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
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
          onComplete: () => {
            gsap.set(parts, { clearProps: "transform,opacity,visibility" });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer className={styles.footer} id="footer" ref={rootRef} data-nav-dark>
      <p className={styles.wordmark} data-reveal>
        JABICA
      </p>
      <p className={styles.tagline} data-reveal>
        Always building.
      </p>
      <div className={styles.footerGrid}>
        <div data-reveal>
          <h2>Pages</h2>
          <ul>
            {pages.map((page) => (
              <li key={page.label}>
                {page.href.startsWith("#") ? (
                  <a href={page.href}>{page.label}</a>
                ) : (
                  <Link href={page.href}>{page.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h2>Follow</h2>
          <ul>
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} {...externalLinkProps(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.legal} data-reveal>
        <span>© 2026 Jabica. All rights reserved. Developed by Gabriel Jabour.</span>
        <a href="https://jabica.com.br" target="_blank" rel="noreferrer">
          jabica.com.br
        </a>
      </div>
    </footer>
  );
}
