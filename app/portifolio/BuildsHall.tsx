"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./below.module.css";
import { ensureGsap } from "./motion";

const filters = ["All", "Web", "IT", "Security"] as const;
type Filter = (typeof filters)[number];
type Build = {
  name: string;
  year?: string;
  category: Exclude<Filter, "All">;
  tone: "blue" | "navy" | "ice";
  note: string;
  stack: string;
  preview?: string;
  href?: string;
};

// TODO [Gabriel]: Supply calendar years for the web and IT projects below.
const builds: Build[] = [
  { name: "Aurum Investor", category: "Web", tone: "blue", note: "Personal finance and investing platform with AI analysis, backtesting versus CDI, goals and portfolio views.", stack: "Next.js · React · TypeScript · Cloudflare", preview: "/projects/aurum-investor-preview.webp", href: "https://auruminvestor.com" },
  { name: "Jabica Store", category: "Web", tone: "navy", note: "Digital software key store with catalog, checkout, customer area and admin panel.", stack: "Next.js · React · PostgreSQL · Prisma", preview: "/projects/jabica-store-preview.png", href: "https://jabicastore.com" },
  { name: "Jabica Tweaks", category: "Web", tone: "ice", note: "Landing page for a free Windows tweak tool with reversible changes, automatic backups and presets.", stack: "Next.js · React · TypeScript · CSS", preview: "/projects/jabica-tweaks-preview.png", href: "/tweaks" },
  { name: "Dra. Jamilly El Gebai", category: "Web", tone: "blue", note: "Institutional website for a professional presence with clear presentation and simple navigation.", stack: "Next.js · React · TypeScript · CSS · DNS", preview: "/projects/dra-jamilly-preview.webp", href: "https://drajamillyelgebai.com.br/" },
  { name: "Mobile profile migration", category: "IT", tone: "navy", note: "Moved Active Directory roaming profiles to a new file server with per-user isolation.", stack: "Active Directory · PowerShell · NTFS/SMB" },
  { name: "ZTNA/VPN access management", category: "Security", tone: "ice", note: "Temporary VPN keys and ZTNA onboarding, including group and policy fixes.", stack: "FortiClient EMS · ZTNA · VPN · FortiGate" },
  { name: "Data loss prevention follow-up", category: "Security", tone: "blue", note: "Closed Proofpoint DLP agent gaps and defined quarantine for offboarded devices.", stack: "Proofpoint DLP · Endpoint security · Offboarding" },
  { name: "AD vs HR system audit", category: "IT", tone: "ice", note: "Handled automated audit tickets and corrected Active Directory fields against HR records.", stack: "Active Directory · Senior · Data quality" },
  { name: "Contract workflow setup (netLex + D4Sign)", category: "IT", tone: "blue", note: "SSO, document and workflow setup and signing limits for the legal team.", stack: "netLex · D4Sign · SSO · SaaS admin" },
];

export function BuildsHall() {
  const rootRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<string | null>(null);
  const visible = builds.filter((build) => filter === "All" || build.category === filter);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = root.querySelectorAll<HTMLElement>("[data-build]");
        gsap.from(cards, {
          y: 36, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
          onComplete: () => gsap.set(cards, { clearProps: "transform,opacity,visibility" }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hall} id="builds" ref={rootRef} data-nav-dark aria-labelledby="builds-title">
      <div className={styles.hallHead}>
        <h2 id="builds-title">BUILDS<br /><em>HALL OF FAME</em></h2>
        <p className={styles.hallIntro}>Published web projects and practical IT, automation and security work. Select a card for the project details.</p>
      </div>
      <div className={styles.filters} role="toolbar" aria-label="Filter builds">
        {filters.map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => { setFilter(item); setActive(null); }}>{item}</button>
        ))}
      </div>
      <p className={styles.buildCount} aria-live="polite">{visible.length} {visible.length === 1 ? "build" : "builds"}</p>
      <div className={styles.buildGrid}>
        {visible.map((build) => {
          const pressed = active === build.name;
          return (
            <article key={build.name} className={styles.buildCard} data-build data-open={pressed}>
              <button type="button" className={styles.buildToggle} aria-expanded={pressed} onClick={() => setActive(pressed ? null : build.name)}>
                <span className={styles.buildArt} data-tone={build.tone}>
                  {build.preview ? <Image src={build.preview} alt="" fill sizes="(max-width: 760px) 90vw, (max-width: 980px) 45vw, 22vw" className={styles.buildPreview} /> : <span>{build.category}</span>}
                </span>
                <span className={styles.buildName}>{build.name}</span>
                <span className={styles.buildMeta}>{build.category}{build.year && <> · <strong>{build.year}</strong></>}</span>
              </button>
              {pressed ? <div className={styles.buildDetail}><p>{build.note}</p><p>{build.stack}</p>{build.href ? <a href={build.href} target={build.href.startsWith("http") ? "_blank" : undefined} rel={build.href.startsWith("http") ? "noreferrer" : undefined}>View project ↗</a> : null}</div> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
