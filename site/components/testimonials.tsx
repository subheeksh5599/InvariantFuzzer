"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, Search, Zap, FileText } from "lucide-react";

interface PipelineStep {
  icon: ReactNode;
  badge: string;
  title: string;
  command: string;
  description: string;
  details: string[];
}

const steps: PipelineStep[] = [
  {
    icon: <Search className="h-8 w-8" />,
    badge: "Phase 1",
    title: "Invariant Discovery",
    command: "/fuzz-plan",
    description:
      "AI reads your Anchor program source, applies 22 extraction patterns, cross-references 130+ invariant templates, and scores your program's maturity from Level 0 to 5.",
    details: [
      "22 structural, constraint, and logic patterns",
      "130+ pre-built invariants across 16 protocol types",
      "Output: Markdown plan + machine-readable JSON",
      "Invariant Maturity Score included in every analysis",
    ],
  },
  {
    icon: <Zap className="h-8 w-8" />,
    badge: "Phase 2",
    title: "Fuzz Orchestration",
    command: "/fuzz-run",
    description:
      "AI generates a Trident fuzz specification targeting your invariants with coverage-guided mutation strategies. Trident executes at 12,000 transactions per second.",
    details: [
      "Trident spec generation from invariant plan",
      "Account state, instruction arg, and sequence mutation",
      "Coverage-guided auto-refinement",
      "Surfpool mainnet-fork integration for realistic state",
    ],
  },
  {
    icon: <FileText className="h-8 w-8" />,
    badge: "Phase 3",
    title: "Triage & PoC Generation",
    command: "/fuzz-report",
    description:
      "AI classifies violations against known attack vectors, maps findings to severity levels, and generates executable proof-of-concept transactions ready to test.",
    details: [
      "False positive filtering with reproducibility checks",
      "Severity: Critical → Info with clear criteria",
      "Executable Anchor test PoCs",
      "Root cause analysis with exact file:line references",
    ],
  },
];

function PipelineCard({ step, isActive }: { step: PipelineStep; isActive: boolean }) {
  return (
    <div className={`flex h-full w-full flex-col rounded-3xl p-6 sm:p-8 lg:flex-row lg:gap-12 lg:p-12 transition-colors duration-300 ${isActive ? 'bg-accent/15' : 'bg-muted'}`}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-accent">{step.icon}</span>
          <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {step.badge}
          </span>
        </div>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {step.title}
        </h3>

        <code className="mt-2 inline-block w-fit rounded-lg bg-background px-3 py-1 text-sm font-mono text-accent">
          {step.command}
        </code>

        <p className="mt-4 flex-1 text-base leading-relaxed text-foreground/80 sm:mt-6 sm:text-lg">
          {step.description}
        </p>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-0 lg:w-80">
        <p className="text-xs font-medium uppercase text-muted-foreground mb-4">
          What it includes
        </p>
        <div className="space-y-3">
          {step.details.map((detail) => (
            <div key={detail} className="flex items-start gap-3">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-sm text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Testimonials(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [measurements, setMeasurements] = useState({ cardWidth: 0, gap: 24 });
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });

  const measure = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth;
      setMeasurements({ cardWidth, gap: 24 });
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const { cardWidth, gap } = measurements;
    if (cardWidth > 0) {
      x.set(-currentIndex * (cardWidth + gap));
    }
  }, [currentIndex, measurements, x]);

  const paginate = (direction: number) => {
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= steps.length) return steps.length - 1;
      return next;
    });
  };

  const goToSlide = (index: number) => setCurrentIndex(index);
  const { cardWidth, gap } = measurements;

  return (
    <section id="how-it-works" className="overflow-hidden py-20 md:py-28">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl mb-12">
          <p className="text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
            How it works — the intelligence layer for Trident
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Trident handles the mechanical fuzzing at 12,000 tx/s. Our skill handles everything Trident can't — reading your code, engineering invariants, and interpreting results.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="mx-auto max-w-7xl">
          <div className="overflow-visible">
            <motion.div className="flex" style={{ x: springX, gap }}>
              {steps.map((step, index) => (
                <div key={step.title} className="shrink-0" style={{ width: cardWidth || "90%" }}>
                  <PipelineCard step={step} isActive={index === currentIndex} />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-accent" : "w-2 bg-foreground/30 hover:bg-foreground/50"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button" onClick={() => paginate(-1)} disabled={currentIndex === 0}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-muted/75 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous step"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button" onClick={() => paginate(1)} disabled={currentIndex === steps.length - 1}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-muted/75 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next step"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
