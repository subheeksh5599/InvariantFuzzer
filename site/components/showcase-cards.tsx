"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Search, Zap, FileText } from "lucide-react";
import type { ReactNode } from "react";

interface CardData {
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  items: string[];
}

const cards: CardData[] = [
  {
    title: "Invariant Discovery",
    subtitle: "/fuzz-plan",
    icon: <Search className="h-8 w-8" />,
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    items: ["22 extraction patterns", "130+ pre-built invariants", "Maturity scoring 0-5"],
  },
  {
    title: "Fuzz Orchestration",
    subtitle: "/fuzz-run",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-indigo-600 via-blue-700 to-violet-700",
    items: ["Trident spec generation", "Coverage-guided mutations", "12,000 tx/s execution"],
  },
  {
    title: "PoC Generation",
    subtitle: "/fuzz-report",
    icon: <FileText className="h-8 w-8" />,
    gradient: "from-purple-700 via-violet-800 to-indigo-900",
    items: ["Violation triage tree", "Executable PoC tests", "Root cause analysis"],
  },
];

function GradientCard({ card, index }: { card: CardData; index: number }) {
  return (
    <motion.div
      className={`group relative aspect-4/5 w-full overflow-hidden rounded-2xl cursor-pointer bg-gradient-to-br ${card.gradient}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm text-white">{card.icon}</div>
        <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-mono text-white/70 backdrop-blur-sm">
          {card.subtitle}
        </span>
        <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {card.title}
        </h3>
        <div className="mt-2 space-y-1.5">
          {card.items.map((item) => (
            <p key={item} className="text-sm text-white/60">{item}</p>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
    </motion.div>
  );
}

export function ShowcaseCards(): ReactNode {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
          Three commands. Zero blind spots.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <GradientCard key={card.title} card={card} index={index} />
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 sm:flex-row items-start sm:justify-between">
          <p className="max-w-md text-lg text-muted-foreground">
            From invariant discovery through fuzz orchestration to executable PoCs — a complete security pipeline in three Claude Code commands.
          </p>
          <Link href="https://github.com/subheeksh5599/solana-invariant-fuzzer" target="_blank" className="group flex shrink-0 items-center gap-2 text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
            Read the docs
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
