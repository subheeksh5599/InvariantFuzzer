import Link from "next/link";
import type { ReactNode } from "react";

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Maturity Model", href: "#maturity" },
    { label: "Install", href: "#install" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "GitHub", href: "https://github.com/subheeksh5599/solana-invariant-fuzzer" },
    { label: "Solana AI Kit", href: "https://github.com/solanabr/solana-ai-kit" },
  ],
  Ecosystem: [
    { label: "Trident Fuzzer", href: "https://github.com/Ackee-Blockchain/trident" },
    { label: "Solana Dev Skill", href: "https://github.com/solana-foundation/solana-dev-skill" },
    { label: "Superteam", href: "https://superteam.codes" },
  ],
};

export function Footer(): ReactNode {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span className="font-semibold text-foreground text-lg tracking-tight">
                Invariant <span className="font-normal text-muted-foreground">Fuzzer</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              AI-powered invariant discovery & fuzz orchestration for Solana programs.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-foreground mb-4 text-sm font-medium">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            MIT License · Built by the Solana community
          </p>
          <p className="text-muted-foreground text-sm">
            Solana Invariant Fuzzer © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
