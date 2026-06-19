import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChatInterface } from "@/components/chat-interface";

export const metadata: Metadata = createMetadata({
  title: "Try the Invariant Fuzzer",
  description:
    "Paste a Solana program snippet and watch AI discover invariants, score maturity, and identify security gaps in real time.",
  path: "/chat",
});

export default function ChatPage(): ReactNode {
  return (
    <main id="main-content" className="min-h-dvh bg-[#04050f]">
      <ChatInterface />
    </main>
  );
}
