"use client";

import styles from "./below.module.css";

// Dental Speed logo awaits permission.
const logos = ["HENRY SCHEIN", "OKTA", "FORTICLIENT EMS", "PROOFPOINT DLP", "NEXT.JS", "ACTIVE DIRECTORY", "POWERSHELL", "DOCKER", "TYPESCRIPT", "CLOUDFLARE", "SENTINELONE", "CISCO MERAKI", "CONFLUENCE", "PYTHON", "OBSIDIAN"];

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
      <h2 id="partners-title">Enterprise stack &amp; ecosystem</h2>
      <p className={styles.partnersIntro}>Platforms, security tools and development technologies used in operations and projects.</p>
      <div className={styles.logoViewport}>
        <div className={styles.logoTrack}>
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
    </section>
  );
}
