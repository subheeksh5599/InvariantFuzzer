export const siteConfig = {
  name: "Solana CPI Safety",
  tagline: "Detect & Prevent Cross-Program Invocation Vulnerabilities",
  description:
    "A Claude Code skill that detects four classes of CPI vulnerabilities — return-data spoofing, arbitrary CPI, stale account after CPI, and non-canonical PDA signing — with runnable PoCs for each.",
  url: "https://site-seven-ochre-61.vercel.app",
  twitter: "@superteambr",
  github: "https://github.com/subheeksh5599/InvariantFuzzer",

  nav: {
    cta: {
      text: "Get Started",
      href: "#install",
    },
    signIn: {
      text: "GitHub",
      href: "https://github.com/subheeksh5599/InvariantFuzzer",
    },
  },
} as const;

export const features = {
  smoothScroll: true,
  darkMode: true,
} as const;

export const themeConfig = {
  defaultTheme: "dark" as "light" | "dark" | "system",
  enableSystemTheme: true,
} as const;
