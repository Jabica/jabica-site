"use client";

import Link from "next/link";
import styles from "./below.module.css";
import { InlineArrow } from "./InlineArrow";

export function CtaBanner() {
  return (
    <section className={styles.ctaBanner} id="see-more" data-nav-dark aria-label="See more projects and notes">
      <Link className={styles.ctaLink} href="https://github.com/Jabica" target="_blank" rel="noreferrer" data-magnetic>
        Explore repositories on GitHub
        <InlineArrow direction="right" size="0.8em" />
      </Link>
    </section>
  );
}
