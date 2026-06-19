"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Send, Terminal, Sparkles, AlertTriangle, Info, MessageSquare, Plus } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";

const suggestions = [
  "A vault where users deposit SOL and earn yield. Only the admin can pause withdrawals.",
  "An AMM pool with two tokens. Users swap tokens and LPs provide liquidity. There's a 0.3% fee.",
  "A lending protocol where users deposit USDC as collateral and borrow other tokens. Positions get liquidated if health drops below 1.2.",
  "A staking pool where users stake tokens for rewards proportional to their share and time staked.",
  "A DAO governance program where token holders propose and vote. Proposals need 60% quorum to pass.",
];

interface Thread {
  id: string;
  title: string;
  messages: { role: "user" | "assistant"; content: string }[];
  createdAt: Date;
}

function makeId() { return Math.random().toString(36).slice(2, 10); }

export function ChatInterface(): ReactNode {
  const [threads, setThreads] = useState<Thread[]>([
    { id: "default", title: "New analysis", messages: [], createdAt: new Date() },
  ]);
  const [activeThreadId, setActiveThreadId] = useState("default");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId)!;
  const messages = activeThread?.messages ?? [];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const newChat = () => {
    const id = makeId();
    setThreads((prev) => [{ id, title: "New analysis", messages: [], createdAt: new Date() }, ...prev]);
    setActiveThreadId(id);
  };

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (text.length < 10) { setError("Please describe your program in more detail."); return; }
    setError("");
    setLoading(true);

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        const title = t.messages.length === 0 ? text.slice(0, 40) + (text.length > 40 ? "..." : "") : t.title;
        return { ...t, title, messages: newMessages };
      })
    );
    setInput("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });
      const data = await res.json();
      const reply = data.error ? `❌ ${data.error}` : data.analysis || "No analysis returned.";
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, messages: [...newMessages, { role: "assistant", content: reply }] } : t
        )
      );
    } catch {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...newMessages, { role: "assistant", content: "❌ Failed to connect." }] }
            : t
        )
      );
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      let cls = "text-sm leading-relaxed";
      let icon: ReactNode = null;
      if (trimmed.startsWith("IMM SCORE:")) cls = "text-base font-semibold text-violet-500 dark:text-violet-400 mt-4 mb-1";
      else if (trimmed.startsWith("CRITICAL:")) { cls = "text-xs font-semibold text-red-600 dark:text-red-400 mt-3 mb-1 tracking-wide uppercase"; icon = <AlertTriangle className="h-3 w-3 inline mr-1 text-red-600 dark:text-red-400" />; }
      else if (trimmed.startsWith("HIGH:")) { cls = "text-xs font-semibold text-orange-600 dark:text-orange-400 mt-3 mb-1 tracking-wide uppercase"; icon = <AlertTriangle className="h-3 w-3 inline mr-1 text-orange-600 dark:text-orange-400" />; }
      else if (trimmed.startsWith("MEDIUM:")) { cls = "text-xs font-semibold text-yellow-600 dark:text-yellow-400 mt-3 mb-1 tracking-wide uppercase"; icon = <Info className="h-3 w-3 inline mr-1 text-yellow-600 dark:text-yellow-400" />; }
      else if (trimmed.startsWith("LOW") || trimmed.startsWith("INFO:")) { cls = "text-xs font-semibold text-slate-500 mt-3 mb-1 tracking-wide uppercase"; icon = <Info className="h-3 w-3 inline mr-1 text-slate-500" />; }
      else if (trimmed.startsWith("NEXT:")) { cls = "text-xs font-mono text-green-600 dark:text-green-400 mt-4 bg-green-500/5 border border-green-500/10 rounded-lg p-3"; icon = <Terminal className="h-3 w-3 inline mr-1 text-green-600 dark:text-green-400" />; }
      else if (trimmed.startsWith("- I-")) cls = "text-sm text-foreground/80 pl-2 border-l-2 border-border ml-2";
      else if (trimmed.startsWith("❌")) cls = "text-sm text-red-600 dark:text-red-400";
      else if (trimmed.startsWith("I only")) cls = "text-sm text-muted-foreground italic";
      return <div key={i} className={cls}>{icon}{line || "\u00A0"}</div>;
    });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            Invariant Fuzzer
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <Link
            href="https://github.com/subheeksh5599/InvariantFuzzer"
            target="_blank"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            GitHub
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Chat History */}
        <div className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-muted/30">
          <div className="p-3">
            <button
              onClick={newChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              New analysis
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  t.id === activeThreadId
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <div ref={chatRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <Sparkles className="h-7 w-7 text-accent mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">Describe your Solana program</h2>
                  <p className="text-sm text-muted-foreground max-w-md mb-8">
                    Describe what your program does in plain English. The AI will discover invariants, score maturity, and flag security gaps.
                  </p>
                  <div className="w-full max-w-lg space-y-2">
                    <p className="text-xs text-muted-foreground font-medium mb-3">Try an example:</p>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        className="w-full text-left p-3 rounded-xl border border-border hover:border-accent/20 hover:bg-accent/5 text-sm text-muted-foreground hover:text-foreground transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      {msg.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] rounded-2xl rounded-br-md bg-accent/10 border border-accent/20 px-4 py-3">
                            <p className="text-sm text-foreground">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl rounded-bl-md bg-muted/50 border border-border px-5 py-4">
                          {renderContent(msg.content)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="rounded-2xl rounded-bl-md bg-muted/50 border border-border px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Analyzing invariants</span>
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>...</motion.span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border shrink-0">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
              {error && <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>}
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your Solana program..."
                  rows={2}
                  className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-accent/30 transition-colors"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="shrink-0 h-11 w-11 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-accent-foreground transition-all"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
