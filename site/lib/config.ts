/**
 * ============================================================================
 * SITE CONFIGURATION — Solana Invariant Fuzzer
 * ============================================================================
 */

export const siteConfig = {
  name: "Solana Invariant Fuzzer",
  tagline: "AI-Powered Invariant Discovery & Fuzz Orchestration",
  description:
    "The first AI-native invariant engineering skill for Solana programs. Reads your code, discovers invariants, generates Trident fuzz harnesses, and produces executable PoCs for violations.",
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
