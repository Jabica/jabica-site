import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-display",
  weight: "300 700",
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-mono",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "Gabriel Jabour — In Motion",
  description:
    "An interactive portrait and personal portfolio of Gabriel Jabour, from technology projects to moments beyond the desk.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
