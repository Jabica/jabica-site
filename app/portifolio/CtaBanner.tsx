"use client";

import Link from "next/link";
import styles from "./below.module.css";

export function CtaBanner() {
  return (
    <section className={styles.ctaBanner} id="see-more" data-nav-dark aria-label="See more projects and notes">
      <Link className={styles.ctaLink} href="/#projetos" data-magnetic>
        See more projects and notes
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
