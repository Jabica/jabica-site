"use client";

import styles from "./below.module.css";

const logos = ["ACME", "NOVA", "ORBIT", "NORTH", "HELIX", "PULSE", "VECTOR", "FORGE"];

function LogoSet({ hidden }: { hidden?: boolean }) {
  return (
    <ul className={hidden ? styles.logoSetDup : styles.logoSet} aria-hidden={hidden || undefined}>
      {logos.map((name) => (
        <li key={name} className={styles.logo}>
          {name}
        </li>
      ))}
    </ul>
  );
}

export function PartnersMarquee() {
  return (
    <section className={styles.partners} id="partners" data-nav-dark aria-labelledby="partners-title">
      <h2 id="partners-title">Partners and campaigns</h2>
      <div className={styles.logoViewport}>
        <div className={styles.logoTrack}>
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
    </section>
  );
}
