export type Language = "pt" | "en";

export const DOWNLOAD_URL = "https://github.com/Jabica/ResetExplode/releases";
export const SOURCE_URL = "https://github.com/Jabica/ResetExplode";

export type TweaksCopy = {
  skip: string;
  menu: string;
  navLabel: string;
  languageLabel: string;
  languageNames: { pt: string; en: string };
  download: string;
  newTab: string;
  sourceLabel: string;
  nav: Array<{ id: string; label: string }>;
  hero: {
    kicker: string;
    titleLead: string;
    titleAccent: string;
    text: string;
    primary: string;
    secondary: string;
    platform: string;
    cardLabel: string;
  };
  spec: Array<{ label: string; value: string }>;
  trust: {
    kicker: string;
    title: string;
    text: string;
    items: Array<{ title: string; text: string }>;
  };
  presets: {
    kicker: string;
    title: string;
    text: string;
    items: Array<{ name: string; title: string; text: string }>;
  };
  features: {
    kicker: string;
    title: string;
    text: string;
    items: Array<{ kicker: string; title: string; text: string; points: string[] }>;
  };
  steps: {
    kicker: string;
    title: string;
    text: string;
    items: Array<{ title: string; text: string }>;
  };
  compare: {
    kicker: string;
    title: string;
    badge: string;
    text: string;
    before: string;
    after: string;
    empty: string;
  };
  glossary: {
    kicker: string;
    title: string;
    text: string;
    listLabel: string;
    items: Array<{ id: string; term: string; definition: string }>;
  };
  faq: {
    kicker: string;
    title: string;
    text: string;
    items: Array<{ q: string; a: string }>;
  };
  footer: {
    rights: string;
    license: string;
    source: string;
  };
};

export const copy = {
  pt: {
    skip: "Ir para o conteúdo",
    menu: "Menu",
    navLabel: "Seções da página",
    languageLabel: "Idioma",
    languageNames: { pt: "Português", en: "Inglês" },
    download: "Baixar",
    newTab: "abre em uma nova aba",
    sourceLabel: "Ver o código",
    nav: [
      { id: "safety", label: "Segurança" },
      { id: "presets", label: "Presets" },
      { id: "features", label: "Recursos" },
      { id: "glossary", label: "Glossário" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "Ferramenta gratuita · MIT",
      titleLead: "Windows no seu",
      titleAccent: "controle.",
      text: "O Jabica Tweaks aplica ajustes reversíveis no Windows. Cada mudança pode ser desfeita, um backup é criado automaticamente e um assistente explica o que vai acontecer antes de você confirmar.",
      primary: "Baixar",
      secondary: "Como funciona",
      platform: "Aplicativo para Windows.",
      cardLabel: "Resumo do Jabica Tweaks",
    },
    spec: [
      { label: "Acesso", value: "Gratuito" },
      { label: "Sistema", value: "Windows" },
      { label: "Ajustes", value: "Reversíveis" },
      { label: "Backup", value: "Automático" },
      { label: "Licença", value: "MIT" },
    ],
    trust: {
      kicker: "Segurança",
      title: "Ajustes que você pode desfazer.",
      text: "O aplicativo muda o Windows sem prender você numa configuração. Nada é gravado antes do backup.",
      items: [
        {
          title: "Tweaks reversíveis",
          text: "Cada ajuste pode ser desfeito. Você volta ao estado anterior quando quiser.",
        },
        {
          title: "Backups automáticos",
          text: "Antes de aplicar, o Jabica Tweaks cria um backup. Esse passo acontece sozinho.",
        },
        {
          title: "Código aberto, licença MIT",
          text: "O código pode ser lido, revisado e compartilhado sob a licença MIT.",
        },
      ],
    },
    presets: {
      kicker: "Presets",
      title: "Cinco pontos de partida.",
      text: "O assistente mostra o que cada conjunto altera antes de aplicar. As descrições dizem o que muda. Não há números de desempenho.",
      items: [
        {
          name: "Recomendado",
          title: "Recomendado",
          text: "Conjunto equilibrado para o uso do dia a dia. Mudanças reversíveis, com backup antes de aplicar.",
        },
        {
          name: "Hard",
          title: "Hard",
          text: "Conjunto mais profundo, para quem quer menos atividade em segundo plano e aceita revisar cada item.",
        },
        {
          name: "Jogos",
          title: "Jogos",
          text: "Foco em sessões de jogo, como plano de energia e atividade em segundo plano. Não promete um ganho específico.",
        },
        {
          name: "Privacidade máxima",
          title: "Privacidade máxima",
          text: "Reduz telemetria e compartilhamentos opcionais. Funções do Windows que dependem desses serviços podem mudar de comportamento.",
        },
        {
          name: "Personalizado",
          title: "Personalizado",
          text: "Você escolhe exatamente o que aplicar. Nada roda até a sua confirmação.",
        },
      ],
    },
    features: {
      kicker: "Recursos",
      title: "Dois caminhos, o mesmo controle.",
      text: "Use a coleção pronta ou deixe o assistente conduzir. Nos dois casos, a confirmação é sua.",
      items: [
        {
          kicker: "Coleção",
          title: "Tweaks Jabica Boost",
          text: "Ajustes do Windows reunidos em grupos, com uma explicação direta do que muda e por quê.",
          points: [
            "Lista o que será alterado",
            "Explica o efeito antes de aplicar",
            "Não grava nada sem confirmação",
          ],
        },
        {
          kicker: "Assistente",
          title: "Assistente guiado",
          text: "Um passo a passo para escolher o preset, revisar, criar o backup e aplicar.",
          points: [
            "Escolha um preset ou monte o seu",
            "Leia o resumo das mudanças",
            "Pare antes de qualquer gravação",
          ],
        },
      ],
    },
    steps: {
      kicker: "Como funciona",
      title: "Cinco passos, sem surpresa.",
      text: "Você vê a mudança, o backup e a chance de parar antes que algo seja gravado.",
      items: [
        {
          title: "Baixe e abra",
          text: "Baixe o aplicativo e abra no seu Windows.",
        },
        {
          title: "Escolha o conjunto",
          text: "Use um preset ou monte um conjunto personalizado.",
        },
        {
          title: "Revise",
          text: "Leia o que vai mudar, inclusive termos como serviços e telemetria.",
        },
        {
          title: "Confirme o backup",
          text: "Ao confirmar, um backup automático é criado e só então os ajustes são aplicados.",
        },
        {
          title: "Desfaça se quiser",
          text: "Restaure o backup quando quiser voltar atrás.",
        },
      ],
    },
    compare: {
      kicker: "Antes e depois",
      title: "Comparativos medidos entram aqui.",
      badge: "Em breve / Coming soon",
      text: "Ainda não existem medições reais. Esta área fica sem números, gráficos ou porcentagens até haver dados de verdade. Nenhum número de desempenho aparece nesta página.",
      before: "Antes",
      after: "Depois",
      empty: "Sem dados",
    },
    glossary: {
      kicker: "Glossário",
      title: "Termos que aparecem no assistente.",
      text: "Passe o mouse, foque com o teclado ou toque no termo para abrir a definição.",
      listLabel: "Termos do glossário",
      items: [
        {
          id: "telemetry",
          term: "Telemetria",
          definition:
            "Dados que o Windows envia sobre como o sistema é usado. Um ajuste nessa área limita essa coleta. Isso não apaga os seus arquivos.",
        },
        {
          id: "services",
          term: "Serviços",
          definition:
            "Programas em segundo plano que o Windows inicia para oferecer funções. Desligar um serviço pode interromper a função que depende dele. O aplicativo lista isso antes de aplicar.",
        },
        {
          id: "power",
          term: "Plano de energia",
          definition:
            "A configuração do Windows que equilibra desempenho e consumo. Um preset pode trocar esse plano. Dá para voltar ao plano anterior depois.",
        },
        {
          id: "restore",
          term: "Ponto de restauração",
          definition:
            "Um instantâneo para o qual o Windows pode retornar se algo sair do esperado. O Jabica Tweaks cria backups automáticos antes de aplicar mudanças.",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Perguntas frequentes.",
      text: "Respostas curtas sobre o que a ferramenta faz e o que ela ainda não publica.",
      items: [
        {
          q: "O Jabica Tweaks é gratuito?",
          a: "Sim. A ferramenta é gratuita.",
        },
        {
          q: "Dá para desfazer os ajustes?",
          a: "Sim. Os tweaks são reversíveis e o aplicativo cria um backup automático antes de aplicar.",
        },
        {
          q: "Preciso entender cada termo técnico?",
          a: "Não. O assistente explica a mudança. O glossário cobre telemetria, serviços, plano de energia e ponto de restauração.",
        },
        {
          q: "O código é aberto?",
          a: "Sim. O projeto é distribuído sob a licença MIT e pode ser revisado publicamente.",
        },
        {
          q: "Os presets deixam o PC mais rápido?",
          a: "Não publicamos ganho de desempenho. A seção antes e depois está marcada como Em breve / Coming soon até existirem medições reais.",
        },
        {
          q: "Privacidade máxima muda alguma função do Windows?",
          a: "Pode mudar funções que dependem de telemetria ou de serviços conectados. O assistente mostra o que será alterado antes da confirmação.",
        },
      ],
    },
    footer: {
      rights: "Todos os direitos reservados.",
      license: "Ferramenta gratuita sob a licença MIT.",
      source: "Código-fonte",
    },
  },
  en: {
    skip: "Skip to content",
    menu: "Menu",
    navLabel: "Page sections",
    languageLabel: "Language",
    languageNames: { pt: "Portuguese", en: "English" },
    download: "Download",
    newTab: "opens in a new tab",
    sourceLabel: "View the code",
    nav: [
      { id: "safety", label: "Safety" },
      { id: "presets", label: "Presets" },
      { id: "features", label: "Features" },
      { id: "glossary", label: "Glossary" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "Free tool · MIT",
      titleLead: "Windows, under your",
      titleAccent: "control.",
      text: "Jabica Tweaks applies reversible adjustments on Windows. Every change can be undone, a backup is created automatically, and a wizard explains what will happen before you confirm.",
      primary: "Download",
      secondary: "How it works",
      platform: "App for Windows.",
      cardLabel: "Jabica Tweaks summary",
    },
    spec: [
      { label: "Access", value: "Free" },
      { label: "System", value: "Windows" },
      { label: "Tweaks", value: "Reversible" },
      { label: "Backup", value: "Automatic" },
      { label: "License", value: "MIT" },
    ],
    trust: {
      kicker: "Safety",
      title: "Changes you can undo.",
      text: "The app adjusts Windows without locking you into a setup. Nothing is written before the backup.",
      items: [
        {
          title: "Reversible tweaks",
          text: "Every adjustment can be undone. Return to the previous state whenever you want.",
        },
        {
          title: "Automatic backups",
          text: "Before anything is applied, Jabica Tweaks creates a backup. That step happens on its own.",
        },
        {
          title: "Open source, MIT license",
          text: "The code can be read, reviewed, and shared under the MIT license.",
        },
      ],
    },
    presets: {
      kicker: "Presets",
      title: "Five starting points.",
      text: "The wizard shows what each set changes before you apply it. Descriptions say what changes. There are no performance figures.",
      items: [
        {
          name: "Recomendado",
          title: "Recommended",
          text: "A balanced set for everyday use. Reversible changes, with a backup before anything is applied.",
        },
        {
          name: "Hard",
          title: "Hard",
          text: "A deeper set for people who want less background activity and are willing to review each item.",
        },
        {
          name: "Jogos",
          title: "Gaming",
          text: "Focused on game sessions, such as the power plan and background activity. It does not promise a specific gain.",
        },
        {
          name: "Privacidade máxima",
          title: "Maximum privacy",
          text: "Reduces telemetry and optional data sharing. Windows features that depend on those services may behave differently.",
        },
        {
          name: "Personalizado",
          title: "Custom",
          text: "You choose exactly what to apply. Nothing runs until you confirm.",
        },
      ],
    },
    features: {
      kicker: "Features",
      title: "Two paths, the same control.",
      text: "Use the ready-made collection or let the wizard lead. Either way, you confirm before anything is written.",
      items: [
        {
          kicker: "Collection",
          title: "Jabica Boost tweaks",
          text: "Windows adjustments grouped together, with a plain-language explanation of what changes and why.",
          points: [
            "Lists what will change",
            "Explains the effect before you apply",
            "Writes nothing without confirmation",
          ],
        },
        {
          kicker: "Wizard",
          title: "Guided wizard",
          text: "A step-by-step path through preset choice, review, backup, and apply.",
          points: [
            "Pick a preset or build your own",
            "Read the summary of changes",
            "Stop before anything is written",
          ],
        },
      ],
    },
    steps: {
      kicker: "How it works",
      title: "Five steps, no surprises.",
      text: "You see the change, the backup, and a chance to stop before anything is written.",
      items: [
        {
          title: "Download and open",
          text: "Download the app and open it on your Windows PC.",
        },
        {
          title: "Choose a set",
          text: "Use a preset or build a custom set.",
        },
        {
          title: "Review",
          text: "Read what will change, including terms such as services and telemetry.",
        },
        {
          title: "Confirm the backup",
          text: "When you confirm, an automatic backup is created and only then are the tweaks applied.",
        },
        {
          title: "Undo if you want",
          text: "Restore the backup whenever you want to go back.",
        },
      ],
    },
    compare: {
      kicker: "Before and after",
      title: "Measured comparisons will live here.",
      badge: "Em breve / Coming soon",
      text: "There are no real measurements yet. This area shows no figures, charts, or percentages until real data exists. No performance numbers appear on this page.",
      before: "Before",
      after: "After",
      empty: "No data",
    },
    glossary: {
      kicker: "Glossary",
      title: "Terms the wizard uses.",
      text: "Hover, focus, or tap a term to open its definition.",
      listLabel: "Glossary terms",
      items: [
        {
          id: "telemetry",
          term: "Telemetry",
          definition:
            "Data Windows sends about how the system is used. A tweak in this area limits that collection. It does not delete your files.",
        },
        {
          id: "services",
          term: "Services",
          definition:
            "Background programs Windows starts in order to provide features. Turning a service off can stop the feature that depends on it. The app lists that before you apply.",
        },
        {
          id: "power",
          term: "Power plan",
          definition:
            "The Windows setting that balances performance and energy use. A preset can switch this plan. You can return to the previous plan later.",
        },
        {
          id: "restore",
          term: "Restore point",
          definition:
            "A snapshot Windows can return to if something does not go as expected. Jabica Tweaks creates automatic backups before applying changes.",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Frequently asked questions.",
      text: "Short answers about what the tool does and what it does not publish yet.",
      items: [
        {
          q: "Is Jabica Tweaks free?",
          a: "Yes. The tool is free.",
        },
        {
          q: "Can I undo the tweaks?",
          a: "Yes. Tweaks are reversible, and the app creates an automatic backup before applying them.",
        },
        {
          q: "Do I need to understand every technical term?",
          a: "No. The wizard explains the change. The glossary covers telemetry, services, power plan, and restore point.",
        },
        {
          q: "Is the code open?",
          a: "Yes. The project is distributed under the MIT license and can be reviewed in public.",
        },
        {
          q: "Do the presets make the PC faster?",
          a: "We do not publish performance gains. The before-and-after section is marked Em breve / Coming soon until real measurements exist.",
        },
        {
          q: "Can maximum privacy change how Windows behaves?",
          a: "It can change features that depend on telemetry or connected services. The wizard shows what will change before you confirm.",
        },
      ],
    },
    footer: {
      rights: "All rights reserved.",
      license: "Free tool under the MIT license.",
      source: "Source code",
    },
  },
} satisfies Record<Language, TweaksCopy>;
