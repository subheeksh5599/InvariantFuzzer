"use client";

import { useScroll, useTransform, useSpring, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { FluidCursor } from "./fluid-cursor";

export function Hero(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scaleYRaw = useTransform(scrollYProgress, [0.0, 0.5], [1, 0]);
  const scaleY = useSpring(scaleYRaw, { stiffness: 100, damping: 30 });
  const y = useTransform(scrollY, (value) => value * 0.7);

  return (
    <section ref={sectionRef} className="relative min-h-dvh w-full">
      <FluidCursor className="absolute inset-0 -z-5" />
      <motion.div className="pointer-events-none absolute inset-0 -z-10 origin-top scale-125 will-change-transform" style={{ scaleY, y }} aria-hidden="true">
        <Image src="/svg/gradient-fade.svg" alt="" fill className="object-cover object-top dark:-scale-y-100" priority />
        <div className="from-background absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t to-transparent" />
      </motion.div>

      <div className="mx-auto flex min-h-dvh max-w-4xl flex-col items-start justify-center gap-6 px-4 py-20 sm:justify-start sm:gap-0 sm:py-0 sm:pt-40 lg:px-8 lg:pt-68">
        <motion.h1
          className="text-background dark:text-background text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block">CPI is Solana's</span>
          <span className="block">
            most common source of{" "}
            <em className="text-background/80 dark:text-background/80 italic">critical</em> bugs
          </span>
        </motion.h1>

        <motion.p
          className="text-background/60 dark:text-background/60 mt-4 max-w-xl text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Detect and prevent four classes of cross-program invocation vulnerabilities —
          return-data spoofing, arbitrary CPI, stale account after CPI, and non-canonical PDA signing.
          Five runnable PoCs included.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link href="/chat" className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10">
            Try Skills <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="https://github.com/subheeksh5599/InvariantFuzzer" target="_blank" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
            View on GitHub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
