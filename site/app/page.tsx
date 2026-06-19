import { BottomCTA } from "@/components/bottom-cta";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ImageReveal } from "@/components/image-reveal";
import { ShowcaseCards } from "@/components/showcase-cards";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { TextReveal } from "@/components/text-reveal";
import { ThemeSwitch } from "@/components/theme-switch";
import { ToolsCarousel } from "@/components/tools-carousel";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Solana Invariant Fuzzer — AI-Powered Invariant Discovery & Fuzz Orchestration",
  description:
    "The first AI-native invariant engineering skill for Solana programs. Reads your code, discovers invariants, generates Trident fuzz harnesses, and produces executable PoCs.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <>
      <Header />
      <ThemeSwitch />
      <main id="main-content" className="flex-1">
        <Hero />

        {/* Problem Statement */}
        <section className="relative py-32 md:py-48">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <TextReveal
              text="Every Solana program has invariants. Nobody tests them."
              className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed">
              Properties like <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">total_deposits == sum(user deposits)</code> live only in developers' heads. When they break, you learn about it from an exploit — or a six-figure audit bill.
            </p>
          </div>
        </section>

        {/* Pipeline Visualization */}
        <ImageReveal />

        {/* Protocol Types */}
        <ToolsCarousel />

        {/* Features */}
        <ShowcaseCards />

        {/* By The Numbers */}
        <Stats />

        {/* Testimonials / Social Proof */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* Install CTA */}
        <BottomCTA />
      </main>

      <Footer />
    </>
  );
}
