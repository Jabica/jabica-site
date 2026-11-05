import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gabriel Jabour — In Motion",
  description: "An interactive portrait and personal portfolio of Gabriel Jabour, from technology projects to moments beyond the desk.",
  icons: {
    icon: "/portifolio/icon.svg",
    shortcut: "/portifolio/icon.svg",
  },
};

export default function PortifolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
