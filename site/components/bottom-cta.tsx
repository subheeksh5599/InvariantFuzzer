"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export function BottomCTA(): ReactNode {
  return (
    <section id="install" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-muted/50">
        <div className="relative z-10 px-8 py-12 sm:px-12">
          <div className="max-w-xl">
              <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                One command. Four vulnerability classes. Zero blind spots.
              </h2>
              <p className="mt-3 text-lg max-w-md text-muted-foreground">
                Install the CPI Safety skill and run{" "}
                <code className="rounded bg-background px-1.5 py-0.5 text-sm font-mono">/audit-cpi</code>{" "}
                in any Solana project. Five runnable PoCs included.
              </p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Install in one command:</p>
              <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-3">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm text-foreground font-mono">
                  curl -fsSL https://raw.githubusercontent.com/subheeksh5599/InvariantFuzzer/master/install.sh | bash
                </code>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="https://github.com/subheeksh5599/InvariantFuzzer"
                target="_blank"
                className="inline-flex h-12 cursor-pointer items-center rounded-full bg-background px-8 font-medium text-foreground transition-opacity hover:opacity-90"
              >
                Star on GitHub
              </Link>
              <Link
                href="https://github.com/subheeksh5599/InvariantFuzzer/blob/main/README.md"
                target="_blank"
                className="inline-flex h-12 cursor-pointer items-center rounded-full border border-border px-8 font-medium text-foreground transition-colors hover:bg-background"
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-25 sm:opacity-25"
          style={{
            background: "linear-gradient(to left, #7c3aed, transparent)",
            maskImage: "linear-gradient(to left, black 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 40%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
