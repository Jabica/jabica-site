"use client";

import {
  siApple,
  siClaude,
  siClaudecode,
  siCloudflare,
  siDebian,
  siDocker,
  siFortinet,
  siGit,
  siGithub,
  siGithubcopilot,
  siGitforwindows,
  siGooglegemini,
  siIcloud,
  siJavascript,
  siMacos,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siReact,
  siTypescript,
  siUbuntu,
  siVercel,
  siVmware,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type Language = "pt" | "en";

const signalIcons: Array<{ icon?: SimpleIcon; label: string; text?: string }> = [
  { icon: siGooglegemini, label: "Google Gemini" },
  { icon: siUbuntu, label: "Ubuntu" },
  { icon: siDebian, label: "Debian" },
  { icon: siVmware, label: "VMware" },
  { icon: siIcloud, label: "iCloud" },
  { icon: siDocker, label: "Docker" },
  { icon: siVercel, label: "Vercel" },
  { icon: siJavascript, label: "JavaScript" },
  { icon: siTypescript, label: "TypeScript" },
  { text: "GPT", label: "GPT" },
  { icon: siCloudflare, label: "Cloudflare" },
  { icon: siClaudecode, label: "Claude Code" },
  { icon: siGithub, label: "GitHub" },
  { icon: siGithubcopilot, label: "GitHub Copilot" },
  { icon: siClaude, label: "Claude" },
  { icon: siNextdotjs, label: "Next.js" },
  { icon: siReact, label: "React" },
  { icon: siNodedotjs, label: "Node.js" },
  { icon: siNpm, label: "npm" },
  { icon: siApple, label: "Apple" },
  { icon: siMacos, label: "macOS" },
  { icon: siGit, label: "Git" },
  { icon: siGitforwindows, label: "Git for Windows" },
  { icon: siFortinet, label: "Fortinet" },
];

const content = {
  pt: {
    nav: ["Sobre", "Especialidades", "Entregas", "Projetos", "Contato"],
    heroPhrases: [
      "Service Desk em operação real.",
      "Automações para reduzir retrabalho.",
      "Projetos de TI com impacto.",
      "DLP sem impactar o usuário final.",
      "IA aplicada ao dia a dia.",
      "Documentação que vira ação.",
    ],
    hero: {
      kicker: "00 / Perfil profissional",
      text: "Analista de Service Desk com trajetoria construida na operacao real de TI, atuando em suporte, infraestrutura, projetos corporativos e automacoes para reduzir retrabalho e aumentar confiabilidade.",
      primary: "Falar comigo",
      secondary: "Ver entregas",
    },
    panel: {
      status: "Operacao, projetos e automacao em evolucao.",
      role: "Analista de Service Desk",
      company: "Henry Schein Brazil / Dental Speed Graph",
      projects: "ColPal, Avatar, DLP e telefonia corporativa",
      security: "protecao da empresa sem travar o usuario final",
      automation: "IA, APIs, scripts, MCPs e documentacao viva",
      education: "Ciencia da Computacao - UNISUL / 2026",
      metrics: ["linhas migradas", "Windows", "macOS"],
    },
    about: {
      kicker: "01 / Sobre",
      title: "Carreira construida dentro da operacao.",
      paragraphs: [
        "Iniciei minha carreira em TI como jovem aprendiz na empresa onde atuo ate hoje. Foi minha primeira experiencia profissional em um ambiente corporativo, onde encontrei afinidade com atendimento, situacoes emergenciais e resolucao de problemas.",
        "Com o tempo, cresci para atuar em suporte tecnico, implantacao de softwares, projetos de TI, DLP, redes e automacoes. Minha forma de trabalhar combina execucao pratica, comunicacao clara e validacao do resultado.",
      ],
    },
    timelineTitle: {
      kicker: "02 / Linha do tempo",
      title: "Do primeiro chamado aos projetos corporativos.",
    },
    timeline: [
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
        text: "Apoio ao Projeto Avatar com Senior Sistemas, operacao de DLP, servidores de impressao e integracao do ambiente ColPal com Okta Workflows.",
      },
      {
        year: "04",
        title: "Automacao e evolucao tecnica",
        text: "Uso de APIs, documentacao e agentes para reduzir retrabalho, melhorar rastreabilidade e apoiar decisoes operacionais.",
      },
    ],
    pillarsTitle: {
      kicker: "03 / Especialidades",
      title: "Base tecnica para sustentar rotina critica.",
    },
    pillars: [
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
        text: "Implantacoes, integracoes de identidade, telefonia corporativa e automacoes que conectam rotina tecnica a impacto real.",
      },
    ],
    specialties: [
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
      "Okta",
      "Okta Workflows",
      "Pentest em formacao",
      "PowerShell",
    ],
    worksTitle: {
      kicker: "04 / Entregas",
      title: "Projetos que mostram impacto alem do chamado.",
    },
    works: [
      {
        name: "Integração ColPal / Okta Workflows",
        type: "Identidade",
        text: "Integração do ambiente Colgate-Palmolive (ColPal), com Okta Workflows e fluxos de identidade para conectar a operação local ao ambiente do parceiro sem quebrar o dia a dia do usuário.",
      },
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
    ],
    numbers: [
      "linhas corporativas migradas",
      "experiencia em Windows",
      "experiencia em macOS",
      "DLP e projetos de TI",
    ],
    portfolioTitle: {
      kicker: "05 / Projetos",
      title: "Sites publicados e projetos web.",
    },
    portfolio: [
      {
        status: "online",
        name: "Dra. Jamilly El Gebai",
        type: "site profissional",
        text: "Site institucional para presença profissional, com foco em apresentação clara, navegação simples e publicação pública do projeto.",
        stack: ["Next.js", "React", "TypeScript", "CSS", "DNS"],
        href: "https://drajamillyelgebai.com.br/",
        preview: "/projects/dra-jamilly-preview.webp",
        accentTheme: "default",
      },
      {
        status: "online",
        name: "Jabica Store",
        type: "loja digital",
        text: "E-commerce de chaves para softwares externos, com catálogo, checkout, área do cliente e painel administrativo com identidade visual própria.",
        stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma"],
        href: "https://jabicastore.com",
        preview: "/projects/jabica-store-preview.png",
        accentTheme: "store",
      },
      {
        status: "online",
        name: "Aurum Investor",
        type: "plataforma financeira",
        text: "Plataforma de organização financeira e investimentos: o Basic cuida de gastos, cartões e metas; o Premium consolida a carteira, análise mensal com IA e backtest versus CDI.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare"],
        href: "https://auruminvestor.com",
        preview: "/projects/aurum-investor-preview.webp",
        accentTheme: "aurum",
      },
    ],
    credentialsTitle: {
      kicker: "06 / Formacao",
      title: "Formacao academica e certificacoes.",
    },
    credentials: [
      "Ciencia da Computacao - UNISUL, termino previsto em dez/2026",
      "Inovacao, Sustentabilidade e Competitividade Empresarial - 160h",
      "Sistemas Distribuidos e Moveis - 160h",
      "Ingles avancado em escrita e intermediario em comunicacao verbal",
    ],
    contact: {
      kicker: "07 / Contato",
      title: "Escolha o melhor canal para falar comigo.",
      text: "Para contato profissional, use e-mail ou WhatsApp. O LinkedIn fica como apoio para ver historico e conexoes.",
      whatsapp: "Clique aqui para conversar pelo WhatsApp",
      professional: "Rede profissional",
    },
    aria: {
      brandOpen: "Voltar ao topo ou abrir menu",
      brandClose: "Fechar menu",
      themeToLight: "Ativar light mode",
      themeToDark: "Ativar dark mode",
      nav: "Navegacao principal",
      panel: "Resumo profissional",
      metrics: "Indicadores profissionais",
      specialties: "Competencias",
      stack: "Tecnologias e contexto",
      credentials: "Formacao e certificacoes",
    },
    footer: {
      rights: "Todos os direitos reservados.",
      developed: "Desenvolvido por",
    },
  },
  en: {
    nav: ["About", "Specialties", "Work", "Projects", "Contact"],
    heroPhrases: [
      "Service Desk in real operations.",
      "Automation that reduces rework.",
      "IT projects with impact.",
      "DLP without hurting users.",
      "AI applied to daily work.",
      "Documentation that becomes action.",
    ],
    hero: {
      kicker: "00 / Professional profile",
      text: "Service Desk Analyst with a career built inside real IT operations, working across support, infrastructure, corporate projects and automation to reduce rework and increase reliability.",
      primary: "Contact me",
      secondary: "View work",
    },
    panel: {
      status: "Operations, projects and automation in progress.",
      role: "Service Desk Analyst",
      company: "Henry Schein Brazil / Dental Speed Graph",
      projects: "ColPal, Avatar, DLP and corporate telephony",
      security: "company protection without slowing down end users",
      automation: "AI, APIs, scripts, MCPs and living documentation",
      education: "Computer Science - UNISUL / 2026",
      metrics: ["lines migrated", "Windows", "macOS"],
    },
    about: {
      kicker: "01 / About",
      title: "A career built inside operations.",
      paragraphs: [
        "I started my IT career as a young apprentice at the company where I still work today. It was my first professional experience in a corporate environment, where I connected with support, urgent situations and problem solving.",
        "Over time, I grew into technical support, software deployment, IT projects, DLP, networks and automation. My way of working combines practical execution, clear communication and result validation.",
      ],
    },
    timelineTitle: {
      kicker: "02 / Timeline",
      title: "From the first ticket to corporate projects.",
    },
    timeline: [
      {
        year: "01",
        title: "Started as a young apprentice",
        text: "First corporate IT experience, with fast adaptation, urgency and growth inside the same company.",
      },
      {
        year: "02",
        title: "Service Desk and technical support",
        text: "Employee support, ticket resolution, software deployment and response to urgent demands.",
      },
      {
        year: "03",
        title: "Corporate projects",
        text: "Support for the Avatar project with Senior Sistemas, DLP operations, print servers and ColPal environment integration with Okta Workflows.",
      },
      {
        year: "04",
        title: "Automation and technical growth",
        text: "Use of APIs, documentation and agents to reduce rework, improve traceability and support operational decisions.",
      },
    ],
    pillarsTitle: {
      kicker: "03 / Specialties",
      title: "Technical foundation for critical routines.",
    },
    pillars: [
      {
        label: "Support",
        title: "Resolution under pressure",
        text: "Technical support in a corporate environment, focused on urgency, clarity and operational continuity.",
      },
      {
        label: "Infrastructure",
        title: "Hands-on technical base",
        text: "Windows, macOS, printing, networks, switches, VLANs, DLP and practical knowledge of corporate environments.",
      },
      {
        label: "Projects",
        title: "Execution with results",
        text: "Deployments, identity integrations, corporate telephony and automations that connect technical routine to real impact.",
      },
    ],
    specialties: [
      "Service Desk",
      "Windows",
      "macOS",
      "DLP",
      "IT Projects",
      "Print servers",
      "VLANs",
      "Switches",
      "Data centers",
      "Movidesk API",
      "FortiClient EMS",
      "Okta",
      "Okta Workflows",
      "Pentest training",
      "PowerShell",
    ],
    worksTitle: {
      kicker: "04 / Work",
      title: "Projects that show impact beyond the ticket.",
    },
    works: [
      {
        name: "ColPal / Okta Workflows integration",
        type: "Identity",
        text: "Integration of the Colgate-Palmolive (ColPal) environment, using Okta Workflows and identity flows to connect local operations to the partner environment without breaking day-to-day work.",
      },
      {
        name: "Migration of 400 corporate lines",
        type: "Telephony",
        text: "Daily management of SIM cards, portability, carrier negotiation and logistics for remote employees and other states.",
      },
      {
        name: "Avatar / Senior Sistemas project",
        type: "Integration",
        text: "Standby technical support for on-site demands, reported slowness and optimizations during a new system rollout.",
      },
      {
        name: "Software and DLP deployment",
        type: "IT Projects",
        text: "Configuration, support and operation of corporate tools, focused on company security without impacting end users.",
      },
      {
        name: "Automation and operational briefings",
        type: "Automation",
        text: "Studies with AI, APIs, scripts, MCPs and documentation to improve flows, daily work and the user experience.",
      },
    ],
    numbers: [
      "corporate lines migrated",
      "experience with Windows",
      "experience with macOS",
      "DLP and IT projects",
    ],
    portfolioTitle: {
      kicker: "05 / Projects",
      title: "Published websites and web projects.",
    },
    portfolio: [
      {
        status: "online",
        name: "Dra. Jamilly El Gebai",
        type: "professional site",
        text: "Institutional website for professional presence, focused on clear presentation, simple navigation and public project delivery.",
        stack: ["Next.js", "React", "TypeScript", "CSS", "DNS"],
        href: "https://drajamillyelgebai.com.br/",
        preview: "/projects/dra-jamilly-preview.webp",
        accentTheme: "default",
      },
      {
        status: "online",
        name: "Jabica Store",
        type: "digital store",
        text: "E-commerce for External softwares Keys with catalog, checkout, customer area and an admin panel built around its own visual identity.",
        stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma"],
        href: "https://jabicastore.com",
        preview: "/projects/jabica-store-preview.png",
        accentTheme: "store",
      },
      {
        status: "online",
        name: "Aurum Investor",
        type: "financial platform",
        text: "Personal finance and investing platform: Basic organizes expenses, cards and goals; Premium unlocks a consolidated portfolio, monthly AI analysis and backtesting versus CDI.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare"],
        href: "https://auruminvestor.com",
        preview: "/projects/aurum-investor-preview.webp",
        accentTheme: "aurum",
      },
    ],
    credentialsTitle: {
      kicker: "06 / Education",
      title: "Academic background and certifications.",
    },
    credentials: [
      "Computer Science - UNISUL, expected completion in Dec/2026",
      "Innovation, Sustainability and Business Competitiveness - 160h",
      "Distributed and Mobile Systems - 160h",
      "Advanced written English and intermediate verbal communication",
    ],
    contact: {
      kicker: "07 / Contact",
      title: "Choose the best channel to reach me.",
      text: "For professional contact, use email or WhatsApp. LinkedIn is available as support for history and connections.",
      whatsapp: "Click here to talk on WhatsApp",
      professional: "Professional network",
    },
    aria: {
      brandOpen: "Back to top or open menu",
      brandClose: "Close menu",
      themeToLight: "Switch to light mode",
      themeToDark: "Switch to dark mode",
      nav: "Main navigation",
      panel: "Professional summary",
      metrics: "Professional indicators",
      specialties: "Skills",
      stack: "Technologies and context",
      credentials: "Education and certifications",
    },
    footer: {
      rights: "All rights reserved.",
      developed: "Developed by",
    },
  },
} satisfies Record<Language, Record<string, unknown>>;

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentContent = content[language];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("jabica-theme");
    const savedLanguage = window.localStorage.getItem("jabica-language");
    const initialTheme = savedTheme === "light" ? "light" : "dark";
    const initialLanguage = savedLanguage === "pt" ? "pt" : "en";

    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.lang = initialLanguage === "pt" ? "pt-BR" : "en";

    const timeout = window.setTimeout(() => {
      setTheme(initialTheme);
      setLanguage(initialLanguage);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const toggleTheme = () => {
    setIsMenuOpen(false);
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("jabica-theme", nextTheme);

      return nextTheme;
    });
  };

  const toggleLanguage = () => {
    setIsMenuOpen(false);
    setLanguage((currentLanguage) => {
      const nextLanguage = currentLanguage === "pt" ? "en" : "pt";

      setTypedText("");
      setPhraseIndex(0);
      setIsDeleting(false);
      document.documentElement.lang = nextLanguage === "pt" ? "pt-BR" : "en";
      window.localStorage.setItem("jabica-language", nextLanguage);

      return nextLanguage;
    });
  };

  const handleBrandClick = () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      setIsMenuOpen((current) => !current);
      return;
    }

    setIsMenuOpen(false);
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.intersectionRatio >= 0.18) {
            target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "-6% 0px -12%", threshold: [0, 0.18] },
    );

    const staggerGroups = [
      ".timeline",
      ".pillar-grid",
      ".work-list",
      ".portfolio-grid",
      ".numbers",
      ".tag-cloud",
      ".contact-actions",
    ];

    revealItems.forEach((item) => {
      const group = staggerGroups
        .map((selector) => item.closest(selector))
        .find(Boolean);

      if (group) {
        const siblings = Array.from(group.querySelectorAll<HTMLElement>(".reveal"));
        const index = Math.max(siblings.indexOf(item), 0);
        item.style.setProperty("--reveal-delay", `${index * 85}ms`);
      }

      observer.observe(item);
    });

    const cards = document.querySelectorAll<HTMLElement>(".magnetic-card");
    const accentCards = document.querySelectorAll<HTMLElement>("[data-accent-theme]");
    const moveLight = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    };
    const applyAccentTheme = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const accentTheme = target.dataset.accentTheme;

      if (accentTheme === "default") {
        delete document.documentElement.dataset.accentTheme;
        return;
      }

      if (accentTheme) {
        document.documentElement.dataset.accentTheme = accentTheme;
      }
    };
    const clearAccentTheme = (event: Event) => {
      const target = event.currentTarget as HTMLElement;

      if (
        target.dataset.accentTheme === "default" &&
        document.documentElement.dataset.accentTheme === target.dataset.accentTheme
      ) {
        delete document.documentElement.dataset.accentTheme;
      }
    };
    const movePageLight = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--page-mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--page-mouse-y", `${event.clientY}px`);
    };

    cards.forEach((card) => card.addEventListener("mousemove", moveLight));
    accentCards.forEach((card) => {
      card.addEventListener("mouseenter", applyAccentTheme);
      card.addEventListener("mouseleave", clearAccentTheme);
      card.addEventListener("focus", applyAccentTheme);
      card.addEventListener("blur", clearAccentTheme);
    });
    window.addEventListener("mousemove", movePageLight, { passive: true });

    const syncRevealState = () => {
      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isHeroItem = Boolean(item.closest("#top"));
        const resetOffsetAbove = Math.min(rect.height * 2.2, window.innerHeight * 1.6);
        const resetOffsetBelow = Math.min(rect.height * 2.2, window.innerHeight * 1.6);
        const isFarAbove = rect.bottom < -resetOffsetAbove;
        const isFarBelow = rect.top > window.innerHeight + resetOffsetBelow;

        if (!isHeroItem && (isFarAbove || isFarBelow)) {
          item.classList.remove("is-visible");
        }
      });
    };

    const setProgress = () => {
      const scrollMax =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax <= 0 ? 0 : window.scrollY / scrollMax;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${Math.min(1, Math.max(0, progress)) * 100}%`,
      );
      syncRevealState();
    };

    setProgress();
    window.addEventListener("scroll", setProgress, { passive: true });

    return () => {
      observer.disconnect();
      cards.forEach((card) => card.removeEventListener("mousemove", moveLight));
      accentCards.forEach((card) => {
        card.removeEventListener("mouseenter", applyAccentTheme);
        card.removeEventListener("mouseleave", clearAccentTheme);
        card.removeEventListener("focus", applyAccentTheme);
        card.removeEventListener("blur", clearAccentTheme);
      });
      delete document.documentElement.dataset.accentTheme;
      window.removeEventListener("mousemove", movePageLight);
      window.removeEventListener("scroll", setProgress);
    };
  }, [language]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(() => {
        setTypedText(currentContent.heroPhrases[0]);
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    const phrase = currentContent.heroPhrases[phraseIndex] ?? currentContent.heroPhrases[0];

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
      setPhraseIndex((current) => (current + 1) % currentContent.heroPhrases.length);
    }, 260);

    return () => window.clearTimeout(timeout);
  }, [currentContent.heroPhrases, isDeleting, phraseIndex, typedText]);

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

      <header className={`site-header ${isMenuOpen ? "is-open" : ""}`}>
        <button
          className="brand"
          type="button"
          onClick={handleBrandClick}
          aria-expanded={isMenuOpen}
          aria-controls="header-menu"
          aria-label={isMenuOpen ? currentContent.aria.brandClose : currentContent.aria.brandOpen}
        >
          <span className="brand-mark">J</span>
          <span>Gabriel Jabour</span>
        </button>
        <div className="brand-controls">
          <button
            className="theme-toggle language-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label={`Switch language to ${language === "pt" ? "English" : "Portuguese"}`}
          >
            <span>{language === "pt" ? "EN" : "PT"}</span>
          </button>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? currentContent.aria.themeToLight : currentContent.aria.themeToDark}
          >
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
        <div
          className={`header-actions ${isMenuOpen ? "is-open" : ""}`}
          id="header-menu"
        >
          <nav aria-label={currentContent.aria.nav}>
            <a href="#sobre" onClick={() => setIsMenuOpen(false)}>
              {currentContent.nav[0]}
            </a>
            <a href="#especialidades" onClick={() => setIsMenuOpen(false)}>
              {currentContent.nav[1]}
            </a>
            <a href="#entregas" onClick={() => setIsMenuOpen(false)}>
              {currentContent.nav[2]}
            </a>
            <a href="#projetos" onClick={() => setIsMenuOpen(false)}>
              {currentContent.nav[3]}
            </a>
            <a href="#contato" onClick={() => setIsMenuOpen(false)}>
              {currentContent.nav[4]}
            </a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="section-kicker reveal reveal-up">{currentContent.hero.kicker}</span>
          <h1 className="hero-title reveal reveal-left">
            Gabriel Jabour
            <span className="terminal-title" aria-live="polite">
              <span className="terminal-prompt">&gt;</span>
              <span className="terminal-text">{typedText}</span>
              <span className="terminal-cursor" aria-hidden="true" />
            </span>
          </h1>
          <p className="hero-text reveal reveal-up">{currentContent.hero.text}</p>
          <div className="hero-actions reveal reveal-up">
            <a className="primary-action" href="#contato">
              {currentContent.hero.primary}
            </a>
            <a className="secondary-action" href="#entregas">
              {currentContent.hero.secondary}
            </a>
          </div>
        </div>

        <div className="hero-panel reveal reveal-right magnetic-card">
          <div className="panel-topline">
            <span>operational_profile.ts</span>
            <span>live</span>
          </div>
          <div className="panel-status">
            <span>status</span>
            <strong>{currentContent.panel.status}</strong>
          </div>
          <div className="terminal-lines" aria-label={currentContent.aria.panel}>
            <p>
              <span>role</span> {currentContent.panel.role}
            </p>
            <p>
              <span>company</span> {currentContent.panel.company}
            </p>
            <p>
              <span>projects</span> {currentContent.panel.projects}
            </p>
            <p>
              <span>security</span> {currentContent.panel.security}
            </p>
            <p>
              <span>automation</span> {currentContent.panel.automation}
            </p>
            <p>
              <span>education</span> {currentContent.panel.education}
            </p>
          </div>
          <div className="panel-metrics" aria-label={currentContent.aria.metrics}>
            <span>
              <strong>400+</strong>
              {currentContent.panel.metrics[0]}
            </span>
            <span>
              <strong>{language === "en" ? "9Y" : "9a"}</strong>
              {currentContent.panel.metrics[1]}
            </span>
            <span>
              <strong>{language === "en" ? "6Y" : "6a"}</strong>
              {currentContent.panel.metrics[2]}
            </span>
          </div>
          <div className="signal-grid" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => {
              const signalIcon = signalIcons[index];

              return (
                <span className={signalIcon ? "signal-icon-cell" : undefined} key={index}>
                  {signalIcon?.icon ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d={signalIcon.icon.path} />
                    </svg>
                  ) : null}
                  {signalIcon?.text ? <strong>{signalIcon.text}</strong> : null}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-grid" id="sobre">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.about.kicker}</span>
          <h2>{currentContent.about.title}</h2>
        </div>
        <div className="section-body reveal reveal-right">
          {currentContent.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.timelineTitle.kicker}</span>
          <h2>{currentContent.timelineTitle.title}</h2>
        </div>
        <div className="timeline">
          {currentContent.timeline.map((item, index) => (
            <article className="timeline-item reveal reveal-up" key={index}>
              <span>{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pillars" id="especialidades">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.pillarsTitle.kicker}</span>
          <h2>{currentContent.pillarsTitle.title}</h2>
        </div>
        <div className="pillar-grid">
          {currentContent.pillars.map((pillar, index) => (
            <article className="pillar-card reveal reveal-up magnetic-card" key={index}>
              <span>{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
              <div className="card-meter" aria-hidden="true" />
            </article>
          ))}
        </div>
        <div className="tag-cloud reveal reveal-up" aria-label={currentContent.aria.specialties}>
          {currentContent.specialties.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </section>

      <section className="works" id="entregas">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.worksTitle.kicker}</span>
          <h2>{currentContent.worksTitle.title}</h2>
        </div>
        <div className="work-list">
          {currentContent.works.map((work, index) => (
            <article
              className={`work-card reveal ${index % 2 === 0 ? "reveal-left" : "reveal-right"}`}
              key={index}
            >
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
        <div className="number-card reveal reveal-up">
          <strong>400+</strong>
          <span>{currentContent.numbers[0]}</span>
        </div>
        <div className="number-card reveal reveal-up">
          <strong>{language === "en" ? "9Y" : "9a"}</strong>
          <span>{currentContent.numbers[1]}</span>
        </div>
        <div className="number-card reveal reveal-up">
          <strong>{language === "en" ? "6Y" : "6a"}</strong>
          <span>{currentContent.numbers[2]}</span>
        </div>
        <div className="number-card reveal reveal-up">
          <strong>{language === "en" ? "3Y" : "3a"}</strong>
          <span>{currentContent.numbers[3]}</span>
        </div>
      </section>

      <section className="portfolio" id="projetos">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.portfolioTitle.kicker}</span>
          <h2>{currentContent.portfolioTitle.title}</h2>
        </div>
        <div className="portfolio-grid">
          {currentContent.portfolio.map((project) => {
            const content = (
              <>
                <div className="portfolio-topline">
                  <span>{project.status}</span>
                  <span>{project.type}</span>
                </div>
                {"preview" in project ? (
                  <div className="portfolio-preview">
                    <div
                      aria-hidden="true"
                      className="portfolio-preview-image"
                      style={{ backgroundImage: `url(${project.preview})` }}
                    />
                  </div>
                ) : null}
                <h3>{project.name}</h3>
                <p>{project.text}</p>
                <div className="portfolio-stack" aria-label={currentContent.aria.stack}>
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </>
            );

            return project.href ? (
              <a
                className="portfolio-card reveal reveal-up magnetic-card"
                data-accent-theme={"accentTheme" in project ? project.accentTheme : undefined}
                href={project.href}
                key={project.name}
                rel="noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <article
                className="portfolio-card reveal reveal-up magnetic-card"
                data-accent-theme={"accentTheme" in project ? project.accentTheme : undefined}
                key={project.name}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="works">
        <div className="section-heading reveal reveal-left">
          <span className="section-kicker">{currentContent.credentialsTitle.kicker}</span>
          <h2>{currentContent.credentialsTitle.title}</h2>
        </div>
        <div className="tag-cloud reveal reveal-up" aria-label={currentContent.aria.credentials}>
          {currentContent.credentials.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="contact-copy reveal reveal-left">
          <span className="section-kicker">{currentContent.contact.kicker}</span>
          <h2>{currentContent.contact.title}</h2>
          <p>{currentContent.contact.text}</p>
        </div>
        <div className="contact-actions reveal reveal-right">
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
            {currentContent.contact.whatsapp}
          </a>
          <a href="https://github.com/Jabica" target="_blank" rel="noreferrer">
            <span>{currentContent.contact.professional}</span>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/gabriel-jabour-286000245/"
            target="_blank"
            rel="noreferrer"
          >
            <span>{currentContent.contact.professional}</span>
            LinkedIn
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <p>
          &copy; 2026 Jabica. {currentContent.footer.rights}
          <span aria-hidden="true"> • </span>
          {currentContent.footer.developed}
          <span className="footer-badge" aria-hidden="true">J</span>
          <a href="https://jabica.com.br" target="_blank" rel="noreferrer">
            jabica.com.br
          </a>
        </p>
      </footer>
    </main>
  );
}
