"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What exactly does the Invariant Fuzzer do?",
    answer:
      "It reads your Solana program source code, automatically extracts invariants (security properties your program must maintain), generates a Trident fuzz harness targeting those invariants, and produces executable PoCs for any violations found. Think of it as an AI auditor that never sleeps.",
  },
  {
    question: "Do I need to know how to write invariants?",
    answer:
      "No — that's the whole point. The skill includes 130+ pre-built invariants across 16 protocol categories and 22 extraction patterns that scan your code. You just run /fuzz-plan and the AI discovers invariants automatically.",
  },
  {
    question: "How is this different from a manual security audit?",
    answer:
      "Manual audits are point-in-time, expensive (often $50K+), and limited by what the auditor can find in a fixed window. This skill runs continuously — on every PR, every commit. It also uses coverage-guided fuzzing at 12,000 transactions per second, exploring edge cases no human auditor would find.",
  },
  {
    question: "What's the Invariant Maturity Model?",
    answer:
      "A 6-level framework (0-5) that scores your program's security maturity based on invariant coverage. Level 0 means no invariants exist. Level 5 means CI-integrated fuzzing with >90% coverage and battle-hardened invariants. Every /fuzz-plan output includes your current score and what's needed to reach the next level.",
  },
  {
    question: "Does this work with non-Anchor programs?",
    answer:
      "Yes — while the extraction patterns are optimized for Anchor (which covers 99% of the ecosystem), the invariant templates and known attack vectors apply to all Solana programs. For native programs, the AI analyzes Rust source directly using the same extraction patterns.",
  },
  {
    question: "What are the prerequisites?",
    answer:
      "You need Trident CLI (cargo install trident-cli), the Solana AI Kit, and optionally Surfpool for mainnet-fork fuzzing. The skill itself installs via a single curl command. All context is loaded progressively — total cost is ~2K tokens per phase.",
  },
];

function FAQItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className="rounded-2xl bg-muted/50"
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-medium text-foreground">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="shrink-0"
        >
          <Plus className="h-5 w-5 text-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted-foreground">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8 border-t border-foreground/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="text-4xl text-foreground font-medium tracking-tight">
              Questions you probably have
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="flex flex-col gap-3">
              {faqs.map((faq, index) => (
                <FAQItemComponent
                  key={faq.question}
                  item={faq}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
