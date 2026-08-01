"use client";

import { useEffect, useState } from "react";

const timeline = [
  {
    year: "01",
    title: "Inicio como jovem aprendiz",
    text: "Primeira experiencia corporativa em TI, com adaptacao rapida, senso de urgencia e crescimento dentro da mesma empresa.",
  },
  {
    year: "02",
    title: "Service Desk e suporte tecnico",
    text: "Atendimento a colaboradores, resolucao de chamados, implantacao de softwares e resposta a demandas emergenciais.",
  },
  {
    year: "03",
    title: "Projetos corporativos",
    text: "Apoio ao Projeto Avatar com Senior Sistemas, operacao de DLP, servidores de impressao e novos projetos de TI.",
  },
  {
    year: "04",
    title: "Automacao e evolucao tecnica",
    text: "Uso de APIs, documentacao e agentes para reduzir retrabalho, melhorar rastreabilidade e apoiar decisoes operacionais.",
  },
];

const specialties = [
  "Service Desk",
  "Windows",
  "macOS",
  "DLP",
  "Projetos de TI",
  "Servidores de impressao",
  "VLANs",
  "Switches",
  "Data centers",
  "Movidesk API",
  "FortiClient EMS",
  "Pentest em formacao",
  "PowerShell",
];

const pillars = [
  {
    label: "Suporte",
    title: "Resolucao sob pressao",
    text: "Atendimento tecnico em ambiente corporativo, com foco em urgencia, clareza e continuidade da operacao.",
  },
  {
    label: "Infraestrutura",
    title: "Base tecnica de campo",
    text: "Windows, macOS, impressao, redes, switches, VLANs, DLP e nocao pratica de ambientes corporativos.",
  },
  {
    label: "Projetos",
    title: "Execucao com resultado",
    text: "Implantacoes, integracoes, telefonia corporativa e automacoes que conectam rotina tecnica a impacto real.",
  },
];

const works = [
  {
    name: "Migracao de 400 linhas corporativas",
    type: "Telefonia",
    text: "Gestao diaria de chips, portabilidade, negociacao com operadora e logistica para colaboradores remotos e de outros estados.",
  },
  {
    name: "Projeto Avatar / Senior Sistemas",
    type: "Integracao",
    text: "Suporte tecnico de prontidao para demandas presenciais, lentidoes reportadas e otimizacoes durante implantacao de novo sistema.",
  },
  {
    name: "Implantacao de softwares e DLP",
    type: "Projetos de TI",
    text: "Configuracao, suporte e operacao de ferramentas corporativas, com foco em seguranca para a empresa sem impactar o usuario final.",
  },
  {
    name: "Automacoes e briefings operacionais",
    type: "Automacao",
    text: "Estudos com IA, APIs, scripts, MCPs e documentacao para aperfeicoar fluxos, melhorar o dia a dia e elevar a experiencia dos usuarios.",
  },
];

const credentials = [
  "Ciencia da Computacao - UNISUL, termino previsto em dez/2026",
  "Inovacao, Sustentabilidade e Competitividade Empresarial - 160h",
  "Sistemas Distribuidos e Moveis - 160h",
  "Ingles avancado em escrita e intermediario em comunicacao verbal",
];

const heroPhrases = [
  "Service Desk em operacao real.",
  "Automacoes para reduzir retrabalho.",
  "Projetos de TI com impacto.",
  "DLP sem impactar usuario final.",
  "IA aplicada ao dia a dia.",
  "Documentacao que vira acao.",
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    revealItems.forEach((item) => observer.observe(item));

    const cards = document.querySelectorAll<HTMLElement>(".magnetic-card");
    const moveLight = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    };
    const movePageLight = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--page-mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--page-mouse-y", `${event.clientY}px`);
    };

    cards.forEach((card) => card.addEventListener("mousemove", moveLight));
    window.addEventListener("mousemove", movePageLight, { passive: true });

    const setProgress = () => {
      const scrollMax =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax <= 0 ? 0 : window.scrollY / scrollMax;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${Math.min(1, Math.max(0, progress)) * 100}%`,
      );
    };

    setProgress();
    window.addEventListener("scroll", setProgress, { passive: true });

    return () => {
      observer.disconnect();
      cards.forEach((card) => card.removeEventListener("mousemove", moveLight));
      window.removeEventListener("mousemove", movePageLight);
      window.removeEventListener("scroll", setProgress);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(heroPhrases[0]);
      return;
    }

    const phrase = heroPhrases[phraseIndex];

    if (!isDeleting && typedText.length < phrase.length) {
      const timeout = window.setTimeout(() => {
        setTypedText(phrase.slice(0, typedText.length + 1));
      }, 58);
      return () => window.clearTimeout(timeout);
    }

    if (!isDeleting && typedText.length === phrase.length) {
      const timeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, 1350);
      return () => window.clearTimeout(timeout);
    }

    if (isDeleting && typedText.length > 0) {
      const timeout = window.setTimeout(() => {
        setTypedText(phrase.slice(0, typedText.length - 1));
      }, 28);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setIsDeleting(false);
      setPhraseIndex((current) => (current + 1) % heroPhrases.length);
    }, 260);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, phraseIndex, typedText]);

  return (
    <main>
      <div className="noise" aria-hidden="true" />
      <div className="scroll-rail" aria-hidden="true" />
      <div className="motion-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gabriel Jabour">
          <span className="brand-mark">J</span>
          <span>Gabriel Jabour</span>
        </a>
        <nav aria-label="Navegacao principal">
          <a href="#sobre">Sobre</a>
          <a href="#especialidades">Especialidades</a>
          <a href="#entregas">Entregas</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="section-kicker reveal">00 / Perfil profissional</span>
          <h1 className="hero-title reveal">
            Gabriel Jabour
            <span className="terminal-title" aria-live="polite">
              <span className="terminal-prompt">&gt;</span>
              {typedText}
              <span className="terminal-cursor" aria-hidden="true" />
            </span>
          </h1>
          <p className="hero-text reveal">
            Analista de Service Desk com trajetoria construida na operacao real
            de TI, atuando em suporte, infraestrutura, projetos corporativos e
            automacoes para reduzir retrabalho e aumentar confiabilidade.
          </p>
          <div className="hero-actions reveal">
            <a className="primary-action" href="#contato">
              Falar comigo
            </a>
            <a className="secondary-action" href="#entregas">
              Ver entregas
            </a>
          </div>
        </div>

        <div className="hero-panel reveal magnetic-card">
          <div className="panel-topline">
            <span>operational_profile.ts</span>
            <span>live</span>
          </div>
          <div className="panel-status">
            <span>status</span>
            <strong>operacao, projetos e automacao em evolucao</strong>
          </div>
          <div className="terminal-lines" aria-label="Resumo profissional">
            <p>
              <span>role</span> Analista de Service Desk
            </p>
            <p>
              <span>company</span> Henry Schein Brazil / Dental Speed Graph
            </p>
            <p>
              <span>projects</span> Avatar, DLP, softwares e telefonia corporativa
            </p>
            <p>
              <span>security</span> protecao da empresa sem travar o usuario final
            </p>
            <p>
              <span>automation</span> IA, APIs, scripts, MCPs e documentacao viva
            </p>
            <p>
              <span>education</span> Ciencia da Computacao - UNISUL / 2026
            </p>
          </div>
          <div className="panel-metrics" aria-label="Indicadores profissionais">
            <span>
              <strong>400+</strong>
              linhas migradas
            </span>
            <span>
              <strong>9a</strong>
              Windows
            </span>
            <span>
              <strong>6a</strong>
              macOS
            </span>
          </div>
          <div className="signal-grid" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-grid" id="sobre">
        <div className="section-heading reveal">
          <span className="section-kicker">01 / Sobre</span>
          <h2>Carreira construida dentro da operacao.</h2>
        </div>
        <div className="section-body reveal">
          <p>
            Iniciei minha carreira em TI como jovem aprendiz na empresa onde
            atuo ate hoje. Foi minha primeira experiencia profissional em um
            ambiente corporativo, onde encontrei afinidade com atendimento,
            situacoes emergenciais e resolucao de problemas.
          </p>
          <p>
            Com o tempo, cresci para atuar em suporte tecnico, implantacao de
            softwares, projetos de TI, DLP, redes e automacoes. Minha forma de
            trabalhar combina execucao pratica, comunicacao clara e validacao
            do resultado.
          </p>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-heading reveal">
          <span className="section-kicker">02 / Linha do tempo</span>
          <h2>Do primeiro chamado aos projetos corporativos.</h2>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <article className="timeline-item reveal" key={item.title}>
              <span>{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pillars" id="especialidades">
        <div className="section-heading reveal">
          <span className="section-kicker">03 / Especialidades</span>
          <h2>Base tecnica para sustentar rotina critica.</h2>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card reveal magnetic-card" key={pillar.title}>
              <span>{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
              <div className="card-meter" aria-hidden="true" />
            </article>
          ))}
        </div>
        <div className="tag-cloud reveal" aria-label="Competencias">
          {specialties.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="works" id="entregas">
        <div className="section-heading reveal">
          <span className="section-kicker">04 / Entregas</span>
          <h2>Projetos que mostram impacto alem do chamado.</h2>
        </div>
        <div className="work-list">
          {works.map((work, index) => (
            <article className="work-card reveal" key={work.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{work.type}</p>
                <h3>{work.name}</h3>
              </div>
              <p>{work.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="numbers">
        <div className="number-card reveal">
          <strong>400+</strong>
          <span>linhas corporativas migradas</span>
        </div>
        <div className="number-card reveal">
          <strong>9a</strong>
          <span>experiencia em Windows</span>
        </div>
        <div className="number-card reveal">
          <strong>6a</strong>
          <span>experiencia em macOS</span>
        </div>
        <div className="number-card reveal">
          <strong>3a</strong>
          <span>DLP e projetos de TI</span>
        </div>
      </section>

      <section className="works">
        <div className="section-heading reveal">
          <span className="section-kicker">05 / Formacao</span>
          <h2>Formacao academica e certificacoes.</h2>
        </div>
        <div className="tag-cloud reveal" aria-label="Formacao e certificacoes">
          {credentials.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="contact-copy reveal">
          <span className="section-kicker">06 / Contato</span>
          <h2>Escolha o melhor canal para falar comigo.</h2>
          <p>
            Para contato profissional, use e-mail ou WhatsApp. O LinkedIn fica
            como apoio para ver historico e conexoes.
          </p>
        </div>
        <div className="contact-actions reveal">
          <a href="mailto:contato@jabica.com.br">
            <span>E-mail</span>
            contato@jabica.com.br
          </a>
          <a
            href="http://wa.me/5548996437375"
            target="_blank"
            rel="noreferrer"
          >
            <span>WhatsApp</span>
            Clique aqui para conversar pelo WhatsApp
          </a>
          <a href="https://github.com/Jabica" target="_blank" rel="noreferrer">
            <span>Rede profissional</span>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/gabriel-jabour-286000245/"
            target="_blank"
            rel="noreferrer"
          >
            <span>Rede profissional</span>
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
