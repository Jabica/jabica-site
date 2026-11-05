export const socialLinks = [
  { label: "WhatsApp", href: "http://wa.me/5548996437375" },
  { label: "GitHub", href: "https://github.com/Jabica" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabriel-jabour-286000245/" },
  { label: "X", href: "https://x.com/gabrielljabour" },
  { label: "Email", href: "mailto:contato@jabica.com.br" },
] as const;

export function externalLinkProps(href: string) {
  if (!href.startsWith("http")) return {};
  return { target: "_blank" as const, rel: "noreferrer" as const };
}
