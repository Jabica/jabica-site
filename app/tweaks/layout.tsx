import type { Metadata } from "next";
import type { ReactNode } from "react";

const initScript = `(function () {
  var lang = "en";
  try {
    var saved = localStorage.getItem("jabica-language");
    if (saved === "pt" || saved === "en") {
      lang = saved;
    } else {
      var primary =
        (navigator.languages && navigator.languages.length && navigator.languages[0]) ||
        navigator.language ||
        "";
      if (String(primary).toLowerCase().indexOf("pt") === 0) lang = "pt";
    }
  } catch (error) {
    lang = "en";
  }
  var root = document.documentElement;
  root.dataset.lang = lang;
  root.dataset.surface = "tweaks";
  root.lang = lang === "pt" ? "pt-BR" : "en";
})();`;

export const metadata: Metadata = {
  title: "Jabica Tweaks | Free Windows optimization",
  description:
    "Free tool for reversible Windows tweaks, with automatic backups, ready-made presets, and open-source MIT code. Ferramenta gratuita para ajustes reversíveis no Windows, com backups automáticos, presets e código aberto (MIT).",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function TweaksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
      {children}
    </>
  );
}
