"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import {
  copy,
  DOWNLOAD_NAME,
  DOWNLOAD_URL,
  SOURCE_URL,
  type Language,
  type TweaksCopy,
} from "./copy";
import "./tweaks.css";

const languages: Language[] = ["pt", "en"];

function readLanguage(): Language {
  try {
    const saved = window.localStorage.getItem("jabica-language");
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    return detectBrowserLanguage();
  }

  return detectBrowserLanguage();
}

function detectBrowserLanguage(): Language {
  const primary = window.navigator.languages?.[0] || window.navigator.language || "en";
  return primary.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function applyLanguage(next: Language, persist: boolean) {
  document.documentElement.dataset.lang = next;
  document.documentElement.dataset.surface = "tweaks";
  document.documentElement.lang = next === "pt" ? "pt-BR" : "en";

  if (!persist) return;

  try {
    window.localStorage.setItem("jabica-language", next);
  } catch {
    // The visible language still updates when storage is blocked.
  }
}

function ExternalLink({
  href,
  className,
  newTabLabel,
  children,
}: {
  href: string;
  className?: string;
  newTabLabel: string;
  children: ReactNode;
}) {
  return (
    <a className={className} href={href} rel="noreferrer noopener" target="_blank">
      {children}
      <span className="tw-sr"> ({newTabLabel})</span>
    </a>
  );
}

function IconShield() {
  return (
    <svg aria-hidden="true" className="tw-icon" viewBox="0 0 24 24">
      <path
        d="M12 3 5 6v6c0 4.2 2.7 7.4 7 8.5 4.3-1.1 7-4.3 7-8.5V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconBackup() {
  return (
    <svg aria-hidden="true" className="tw-icon" viewBox="0 0 24 24">
      <path
        d="M6 8.5h12v10H6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8.5V6.8A1.8 1.8 0 0 1 10.8 5h2.4A1.8 1.8 0 0 1 15 6.8v1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 11.5v4M10 13.5l2 2 2-2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconCode() {
  return (
    <svg aria-hidden="true" className="tw-icon" viewBox="0 0 24 24">
      <path
        d="m9 8-4 4 4 4M15 8l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

const trustIcons = [IconShield, IconBackup, IconCode];

function closeDetails(event: { currentTarget: HTMLElement }) {
  const details = event.currentTarget.closest(".tw-nav-slot")?.querySelector("details");
  if (details instanceof HTMLDetailsElement) details.open = false;
}

function Glossary({
  items,
  listLabel,
}: {
  items: Array<{ id: string; term: string; definition: string }>;
  listLabel: string;
}) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [lockId, setLockId] = useState<string | null>(null);

  useEffect(() => {
    if (!pinnedId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setLockId(pinnedId);
      setHoverId(null);
      setPinnedId(null);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const pinned = document.getElementById(pinnedId);
      const container = pinned?.closest(".tw-term");
      if (container && !container.contains(target)) setPinnedId(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pinnedId]);

  return (
    <ul aria-label={listLabel} className="tw-terms">
      {items.map((item) => {
        const open = pinnedId === item.id || (hoverId === item.id && lockId !== item.id);

        return (
          <li
            className={`tw-term${open ? " is-open" : ""}`}
            key={item.id}
            onMouseEnter={() => setHoverId(item.id)}
            onMouseLeave={(event) => {
              const active = document.activeElement;
              if (active instanceof Node && event.currentTarget.contains(active)) {
                setLockId((current) => (current === item.id ? null : current));
                return;
              }

              setHoverId((current) => (current === item.id ? null : current));
              setLockId((current) => (current === item.id ? null : current));
            }}
          >
            <button
              aria-controls={item.id}
              aria-describedby={open ? item.id : undefined}
              aria-expanded={open}
              className="tw-term-btn"
              onBlur={() => {
                setHoverId((current) => (current === item.id ? null : current));
              }}
              onClick={() => {
                if (pinnedId === item.id) {
                  setPinnedId(null);
                  setHoverId(null);
                  setLockId(item.id);
                  return;
                }

                setLockId((current) => (current === item.id ? null : current));
                setPinnedId(item.id);
              }}
              onFocus={() => {
                setLockId((current) => (current === item.id ? null : current));
                setHoverId(item.id);
              }}
              type="button"
            >
              <span>{item.term}</span>
              <span aria-hidden="true" className="tw-term-mark">
                {open ? "−" : "+"}
              </span>
            </button>
            <p className="tw-pop" hidden={!open} id={item.id} role="tooltip">
              {item.definition}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function Faq({
  items,
  idPrefix,
}: {
  items: Array<{ q: string; a: string }>;
  idPrefix: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="tw-faq">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${idPrefix}-q-${index}`;
        const panelId = `${idPrefix}-a-${index}`;

        return (
          <div className={`tw-faq-item${open ? " is-open" : ""}`} key={item.q}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                id={buttonId}
                onClick={() => setOpenIndex(open ? null : index)}
                type="button"
              >
                <span>{item.q}</span>
                <span aria-hidden="true" className="tw-faq-mark">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div aria-labelledby={buttonId} hidden={!open} id={panelId} role="region">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="tw-heading">
      <p className="tw-kicker">{kicker}</p>
      <h2>{title}</h2>
      {text ? <p className="tw-lede">{text}</p> : null}
    </div>
  );
}

function TweaksDocument({
  lang,
  content,
  onLanguage,
}: {
  lang: Language;
  content: TweaksCopy;
  onLanguage: (next: Language) => void;
}) {
  return (
    <div className={`tw-lang tw-lang-${lang}`} lang={lang === "pt" ? "pt-BR" : "en"}>
      <a className="tw-skip" href={`#${lang}-content`}>
        {content.skip}
      </a>
      <header className="tw-header">
        <div className="tw-wrap tw-header-inner">
          <a className="tw-brand" href={`#${lang}-top`}>
            <span aria-hidden="true" className="tw-mark">
              J
            </span>
            <span className="tw-brand-name">Jabica Tweaks</span>
          </a>
          <div aria-label={content.languageLabel} className="tw-langs" role="group">
            <button
              aria-label={content.languageNames.pt}
              aria-pressed={lang === "pt"}
              lang="pt-BR"
              onClick={() => onLanguage("pt")}
              type="button"
            >
              PT
            </button>
            <button
              aria-label={content.languageNames.en}
              aria-pressed={lang === "en"}
              lang="en"
              onClick={() => onLanguage("en")}
              type="button"
            >
              EN
            </button>
          </div>
          <a className="tw-btn tw-btn-primary tw-header-download" download={DOWNLOAD_NAME} href={DOWNLOAD_URL}>
            {content.download}
          </a>
          <div className="tw-nav-slot">
            <details className="tw-nav-details">
              <summary aria-controls={`${lang}-nav`} className="tw-menu">
                {content.menu}
              </summary>
            </details>
            <nav aria-label={content.navLabel} className="tw-nav" id={`${lang}-nav`}>
              {content.nav.map((item) => (
                <a href={`#${lang}-${item.id}`} key={item.id} onClick={closeDetails}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id={`${lang}-content`} tabIndex={-1}>
        <section className="tw-hero" id={`${lang}-top`}>
          <div className="tw-wrap tw-hero-grid">
            <div>
              <p className="tw-kicker">{content.hero.kicker}</p>
              <h1 className="tw-title">
                <span className="tw-title-lead">{content.hero.titleLead}</span>
                <span className="tw-title-accent">{content.hero.titleAccent}</span>
              </h1>
              <p className="tw-lede">{content.hero.text}</p>
              <div className="tw-hero-actions">
                <a className="tw-btn tw-btn-primary" download={DOWNLOAD_NAME} href={DOWNLOAD_URL}>
                  {content.hero.primary}
                </a>
                <a className="tw-btn tw-btn-ghost" href={`#${lang}-steps`}>
                  {content.hero.secondary}
                </a>
              </div>
              <p className="tw-note">{content.hero.platform}</p>
            </div>
            <aside aria-label={content.hero.cardLabel} className="tw-spec">
              <p className="tw-kicker tw-spec-label">Jabica Tweaks</p>
              <dl>
                {content.spec.map((row) => (
                  <div className="tw-spec-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-safety`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.trust.kicker}
              text={content.trust.text}
              title={content.trust.title}
            />
            <div className="tw-grid-3">
              {content.trust.items.map((item, index) => {
                const Icon = trustIcons[index] ?? IconShield;

                return (
                  <article className="tw-card" key={item.title}>
                    <Icon />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {index === 2 ? (
                      <ExternalLink
                        className="tw-text-link"
                        href={SOURCE_URL}
                        newTabLabel={content.newTab}
                      >
                        {content.sourceLabel}
                      </ExternalLink>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-presets`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.presets.kicker}
              text={content.presets.text}
              title={content.presets.title}
            />
            <div className="tw-presets">
              {content.presets.items.map((item, index) => (
                <article className="tw-card tw-preset" key={item.name}>
                  {item.name === item.title ? (
                    <p aria-hidden="true" className="tw-kicker">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  ) : (
                    <p className="tw-kicker" translate="no">
                      {item.name}
                    </p>
                  )}
                  <h3 translate={item.name === item.title ? "no" : undefined}>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-features`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.features.kicker}
              text={content.features.text}
              title={content.features.title}
            />
            <div className="tw-features">
              {content.features.items.map((item) => (
                <article className="tw-card tw-feature" key={item.title}>
                  <p className="tw-kicker">{item.kicker}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ul className="tw-points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-steps`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.steps.kicker}
              text={content.steps.text}
              title={content.steps.title}
            />
            <ol className="tw-steps-list">
              {content.steps.items.map((item, index) => (
                <li key={item.title}>
                  <span aria-hidden="true" className="tw-step-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-compare`}>
          <div className="tw-wrap">
            <SectionHeading kicker={content.compare.kicker} title={content.compare.title} />
            <div className="tw-soon" role="note">
              <p className="tw-soon-label">{content.compare.badge}</p>
              <p>{content.compare.text}</p>
            </div>
            <div className="tw-compare">
              {[content.compare.before, content.compare.after].map((label) => (
                <article key={label}>
                  <h3>{label}</h3>
                  <p aria-hidden="true" className="tw-dash">
                    —
                  </p>
                  <p>{content.compare.empty}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tw-section" id={`${lang}-glossary`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.glossary.kicker}
              text={content.glossary.text}
              title={content.glossary.title}
            />
            <Glossary
              items={content.glossary.items.map((item) => ({
                ...item,
                id: `${lang}-${item.id}`,
              }))}
              listLabel={content.glossary.listLabel}
            />
          </div>
        </section>

        <section className="tw-section" id={`${lang}-faq`}>
          <div className="tw-wrap">
            <SectionHeading
              kicker={content.faq.kicker}
              text={content.faq.text}
              title={content.faq.title}
            />
            <Faq idPrefix={`${lang}-faq`} items={content.faq.items} />
          </div>
        </section>
      </main>

      <footer className="tw-footer">
        <div className="tw-wrap">
          <p className="tw-footer-line">
            <span>© 2026 Jabica. {content.footer.rights}</span>
            <span aria-hidden="true">•</span>
            <span>{content.footer.developed}</span>
            <Link className="tw-footer-brand" href="/">
              <span aria-hidden="true" className="tw-footer-badge">
                J
              </span>
              jabica.com.br
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function TweaksPage() {
  const [announcement, setAnnouncement] = useState("");

  useLayoutEffect(() => {
    applyLanguage(readLanguage(), false);

    return () => {
      delete document.documentElement.dataset.surface;
    };
  }, []);

  const chooseLanguage = (next: Language) => {
    applyLanguage(next, true);
    setAnnouncement(next === "pt" ? "Idioma: português do Brasil" : "Language: English");
  };

  return (
    <div className="tweaks">
      <div aria-hidden="true" className="tw-space">
        <div className="tw-stars" />
      </div>
      <p aria-live="polite" className="tw-sr">
        {announcement}
      </p>
      {languages.map((lang) => (
        <TweaksDocument
          content={copy[lang]}
          key={lang}
          lang={lang}
          onLanguage={chooseLanguage}
        />
      ))}
    </div>
  );
}
