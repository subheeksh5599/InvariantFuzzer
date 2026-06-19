"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  desc: string;
}

const stats: StatItem[] = [
  {
    label: "Pre-built invariants",
    value: 130,
    suffix: "+",
    desc: "Across 16 protocol categories — vault, AMM, lending, staking, and more",
  },
  {
    label: "Extraction patterns",
    value: 22,
    suffix: "",
    desc: "AI scans your source for summation fields, authority checks, rounding errors, and more",
  },
  {
    label: "Fuzz throughput",
    value: 12,
    suffix: "K tx/s",
    desc: "Trident executes at Solana-native speed — millions of permutations per campaign",
  },
  {
    label: "Maturity levels",
    value: 6,
    suffix: "",
    desc: "From Unprotected (0) to Battle-Hardened (5) — know exactly where your program stands",
  },
];

function StatBar({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const maxValue = Math.max(...stats.map((s) => s.value));
  const percentage = (stat.value / maxValue) * 100;

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-end justify-between">
        <p className="text-sm font-medium text-foreground">{stat.label}</p>
        <motion.span
          className="text-2xl font-bold tabular-nums text-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {stat.value}
          <span className="text-lg text-muted-foreground">{stat.suffix}</span>
        </motion.span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-[#7c3aed] to-[#a78bfa]"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>

      <p className="text-sm text-muted-foreground">{stat.desc}</p>
    </div>
  );
}

export function Stats(): ReactNode {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
            By the numbers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            What ships with the skill. No setup required — everything is loaded progressively on demand.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {stats.map((stat, index) => (
            <StatBar key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
