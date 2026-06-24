import type { Metadata } from "next";

export const siteConfig = {
  name: "Solana CPI Safety",
  description:
    "A Claude Code skill that detects and prevents four classes of cross-program invocation vulnerabilities in Solana programs with runnable proof-of-concept exploits.",
  url: "https://site-seven-ochre-61.vercel.app",
  ogImage: "/og-image.png",
  creator: "@RECTOR_LABS",
  authors: [
    {
      name: "RECTOR-LABS",
      url: "https://github.com/RECTOR-LABS",
    },
  ],
  keywords: [
    "Solana", "CPI", "cross-program invocation", "security", "return-data spoofing",
    "arbitrary CPI", "anchor", "audit", "vulnerability", "Claude Code",
    "smart contract", "exploit", "PoC", "proof of concept",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: siteConfig.url, title: siteConfig.name, description: siteConfig.description, siteName: siteConfig.name, images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }] },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description, images: [siteConfig.ogImage], creator: siteConfig.creator },
  icons: { icon: "/favicon.ico", shortcut: "/favicon-16x16.png", apple: "/apple-icon.png" },
  manifest: "/site.webmanifest",
};

export function createMetadata({ title, description, path = "/", image, noIndex = false }: { title?: string; description?: string; path?: string; image?: string; noIndex?: boolean }): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title: title ?? siteConfig.name, description: description ?? siteConfig.description, url, images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? siteConfig.name }] },
    twitter: { title: title ?? siteConfig.name, description: description ?? siteConfig.description, images: [ogImage] },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
