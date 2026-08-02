import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabriel Jabour | Tecnologia, automacao e operacao digital",
  description:
    "Site biografico de Gabriel Jabour: Analista de Service Desk com experiencia em suporte, Windows, macOS, DLP, projetos de TI e automacoes operacionais.",
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
