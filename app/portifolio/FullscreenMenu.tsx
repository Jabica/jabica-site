"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";
import { externalLinkProps, socialLinks } from "./siteLinks";
import { GJMonogram } from "./GJMonogram";

const links = [
  { label: "HOME", index: "01", target: null },
  { label: "ON WORK", index: "02", target: "on-work" },
  { label: "OFF WORK", index: "03", target: "off-work" },
  { label: "BUILDS", index: "04", target: "builds" },
  { label: "LAB", index: "05", target: "lab" },
  { label: "CONTACT", index: "06", target: "contact" },
] as const;

type FullscreenMenuProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string | null) => void;
};

export function FullscreenMenu({ open, onClose, onNavigate }: FullscreenMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!open && !hasOpened.current) return;
    if (open) hasOpened.current = true;

    const { gsap } = ensureGsap();
    const items = root.querySelectorAll<HTMLElement>("[data-menu-item]");
    const photos = root.querySelectorAll<HTMLElement>("[data-menu-photo]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!open) {
      document.querySelector<HTMLElement>("[aria-controls='portfolio-menu']")?.focus({ preventScroll: true });
    }

    if (reduced) {
      gsap.set(root, {
        autoAlpha: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      });
      if (open) {
        root.querySelector<HTMLElement>("[data-menu-item]")?.focus({ preventScroll: true });
      }
      return;
    }

    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
    if (open) {
      timeline.set(root, { pointerEvents: "auto" });
      timeline.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      timeline.fromTo(
        photos,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 },
        0.06,
      );
      timeline.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45, ease: "power3.out" },
        0.04,
      );
    } else {
      timeline.to(items, { y: 12, autoAlpha: 0, stagger: 0.02, duration: 0.16 });
      timeline.to(photos, { autoAlpha: 0, duration: 0.16 }, 0);
      timeline.to(root, { autoAlpha: 0, duration: 0.2, pointerEvents: "none" }, 0.08);
    }

    const timeout = window.setTimeout(() => {
      if (!open) return;
      root.querySelector<HTMLElement>("[data-menu-item]")?.focus({ preventScroll: true });
    }, 480);

    return () => {
      window.clearTimeout(timeout);
      timeline.kill();
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      id="portfolio-menu"
      className={styles.menu}
      data-nav-dark
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Portfolio menu"
      inert={!open}
    >
      <h2 className={styles.srOnly}>Menu</h2>
      <div className={styles.menuPhotos} aria-hidden="true">
        <div className={styles.menuPhoto} data-menu-photo>
          <Image
            src="/images/hero/everyday.png"
            alt=""
            fill
            sizes="22vw"
          />
        </div>
        <div className={styles.menuPhoto} data-menu-photo>
          <Image src="/images/hero/ski.png" alt="" fill sizes="22vw" />
        </div>
        <div className={`${styles.swatch} ${styles.swatchNavy}`} data-menu-photo>
          <GJMonogram tone="ice" active={open} />
        </div>
        <div className={`${styles.swatch} ${styles.swatchBlue}`} data-menu-photo>
          ON
        </div>
      </div>
      <nav aria-label="Portfolio">
        {links.map((link) => (
          <a
            key={link.label}
            className={styles.menuLink}
            href={link.target ? `#${link.target}` : "/portifolio"}
            data-menu-item
            onClick={(event) => {
              event.preventDefault();
              onNavigate(link.target);
            }}
          >
            <span data-magnetic>{link.label}</span>
            <span className={styles.menuIndex}>{link.index}</span>
          </a>
        ))}
        <div className={styles.menuSocials}>
          {socialLinks.map((item) => (
            <a
              key={item.label}
              className={styles.menuSocial}
              href={item.href}
              data-menu-item
              onClick={onClose}
              {...externalLinkProps(item.href)}
            >
              <span data-magnetic>{item.label.toUpperCase()}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
