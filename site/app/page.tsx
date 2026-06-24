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
  title: "Solana CPI Safety — Detect & Prevent Cross-Program Invocation Vulnerabilities",
  description:
    "A Claude Code skill that detects four classes of CPI vulnerabilities — return-data spoofing, arbitrary CPI, stale account after CPI, and non-canonical PDA signing.",
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
              text="CPI is Solana's most common source of critical bugs."
              className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed">
              Four vulnerability classes account for the majority of High and Critical audit findings:{" "}
              <span className="text-foreground">return-data spoofing</span>,{" "}
              <span className="text-foreground">arbitrary CPI</span>,{" "}
              <span className="text-foreground">stale account after CPI</span>, and{" "}
              <span className="text-foreground">non-canonical PDA signing</span>. This skill detects all four with runnable PoCs for each.
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
