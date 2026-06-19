"use client";

import { useEffect, useRef, useMemo, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CodeWindow() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <rect x="12" y="12" width="376" height="40" rx="8" fill="#1e293b" />
      <circle cx="28" cy="32" r="5" fill="#ef4444" />
      <circle cx="46" cy="32" r="5" fill="#f59e0b" />
      <circle cx="64" cy="32" r="5" fill="#22c55e" />
      <rect x="88" y="24" width="100" height="16" rx="4" fill="#334155" />
      <rect x="24" y="72" width="80" height="8" rx="3" fill="#7c3aed" opacity="0.6" />
      <rect x="24" y="92" width="120" height="8" rx="3" fill="#334155" />
      <rect x="24" y="112" width="60" height="8" rx="3" fill="#334155" />
      <rect x="24" y="136" width="140" height="8" rx="3" fill="#1e293b" />
      <rect x="24" y="156" width="100" height="8" rx="3" fill="#7c3aed" opacity="0.4" />
      <rect x="24" y="176" width="180" height="8" rx="3" fill="#334155" />
      <rect x="24" y="196" width="90" height="8" rx="3" fill="#334155" />
      <rect x="24" y="220" width="200" height="6" rx="3" fill="#1e293b" />
      <rect x="24" y="238" width="160" height="6" rx="3" fill="#7c3aed" opacity="0.3" />
      <rect x="24" y="256" width="120" height="6" rx="3" fill="#334155" />
      <rect x="24" y="274" width="140" height="6" rx="3" fill="#334155" />
      <rect x="24" y="292" width="80" height="6" rx="3" fill="#334155" />
      <rect x="24" y="316" width="170" height="8" rx="3" fill="#1e293b" />
      <rect x="24" y="336" width="130" height="8" rx="3" fill="#334155" />
      <rect x="24" y="356" width="160" height="8" rx="3" fill="#7c3aed" opacity="0.5" />
      <rect x="24" y="376" width="100" height="8" rx="3" fill="#334155" />
    </svg>
  );
}

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <rect x="120" y="40" width="160" height="48" rx="10" fill="#7c3aed" opacity="0.2" stroke="#7c3aed" strokeWidth="1.5" />
      <text x="200" y="69" textAnchor="middle" fill="#a78bfa" fontSize="13" fontWeight="500" fontFamily="monospace">Program Source</text>
      <line x1="200" y1="88" x2="200" y2="118" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="120" y="118" width="160" height="48" rx="10" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="200" y="147" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="500" fontFamily="monospace">AI Extraction</text>
      <line x1="200" y1="166" x2="200" y2="196" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="120" y="196" width="160" height="48" rx="10" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x="200" y="225" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="500" fontFamily="monospace">Invar Spec</text>
      <line x1="200" y1="244" x2="200" y2="274" stroke="#8b5cf6" strokeWidth="1.5" />
      <rect x="120" y="274" width="160" height="48" rx="10" fill="#06b6d4" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" />
      <text x="200" y="303" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="500" fontFamily="monospace">Trident Fuzz</text>
      <line x1="200" y1="322" x2="200" y2="352" stroke="#06b6d4" strokeWidth="1.5" />
      <rect x="120" y="352" width="160" height="48" rx="10" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
      <text x="200" y="381" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="500" fontFamily="monospace">PoC Report</text>
      <line x1="200" y1="400" x2="200" y2="430" stroke="#22c55e" strokeWidth="1.5" />
      <rect x="120" y="430" width="160" height="40" rx="10" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="200" y="455" textAnchor="middle" fill="#fcd34d" fontSize="13" fontWeight="500" fontFamily="monospace">Fix Deployed</text>
    </svg>
  );
}

function ShieldSecurity() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <path d="M200 60 L320 110 L320 260 C320 340 260 400 200 430 C140 400 80 340 80 260 L80 110 Z" fill="#7c3aed" opacity="0.12" stroke="#7c3aed" strokeWidth="2" />
      <path d="M200 100 L280 135 L280 230 C280 290 235 335 200 358 C165 335 120 290 120 230 L120 135 Z" fill="#7c3aed" opacity="0.15" stroke="#a78bfa" strokeWidth="1.5" />
      <path d="M186 240 L196 256 L220 220" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="200" cy="200" r="95" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
    </svg>
  );
}

function GraphVisualization() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <line x1="80" y1="420" x2="360" y2="420" stroke="#334155" strokeWidth="1.5" />
      <line x1="80" y1="420" x2="80" y2="60" stroke="#334155" strokeWidth="1.5" />
      <rect x="100" y="280" width="24" height="140" rx="4" fill="#7c3aed" opacity="0.6" />
      <rect x="140" y="200" width="24" height="220" rx="4" fill="#7c3aed" opacity="0.8" />
      <rect x="180" y="150" width="24" height="270" rx="4" fill="#a78bfa" />
      <rect x="220" y="180" width="24" height="240" rx="4" fill="#7c3aed" opacity="0.8" />
      <rect x="260" y="240" width="24" height="180" rx="4" fill="#7c3aed" opacity="0.6" />
      <rect x="300" y="300" width="24" height="120" rx="4" fill="#7c3aed" opacity="0.4" />
      <rect x="340" y="350" width="24" height="70" rx="4" fill="#7c3aed" opacity="0.3" />
      <line x1="130" y1="240" x2="150" y2="200" stroke="#a78bfa" strokeWidth="1.5" />
      <line x1="170" y1="160" x2="190" y2="150" stroke="#a78bfa" strokeWidth="1.5" />
      <line x1="210" y1="190" x2="230" y2="180" stroke="#a78bfa" strokeWidth="1.5" />
      <line x1="250" y1="250" x2="270" y2="240" stroke="#a78bfa" strokeWidth="1.5" />
      <line x1="290" y1="310" x2="310" y2="300" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="90" y="100" fill="#64748b" fontSize="10" fontFamily="monospace">Coverage</text>
      <text x="350" y="440" fill="#64748b" fontSize="10" fontFamily="monospace">Time</text>
      <line x1="210" y1="455" x2="210" y2="465" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="210" y="478" fill="#a78bfa" fontSize="11" fontFamily="monospace" textAnchor="middle">Peak: 87%</text>
    </svg>
  );
}

function TerminalOutput() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <rect x="12" y="12" width="376" height="32" rx="6" fill="#1e293b" />
      <circle cx="26" cy="28" r="4" fill="#475569" />
      <circle cx="40" cy="28" r="4" fill="#475569" />
      <circle cx="54" cy="28" r="4" fill="#475569" />
      <text x="200" y="32" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Terminal — fuzz campaign output</text>
      <text x="24" y="68" fill="#7c3aed" fontSize="11" fontFamily="monospace">$ trident fuzz run vault_invariants</text>
      <text x="24" y="90" fill="#475569" fontSize="10" fontFamily="monospace">═══════════════════════════════════</text>
      <text x="24" y="112" fill="#22c55e" fontSize="10" fontFamily="monospace">[INIT]</text><text x="70" y="112" fill="#64748b" fontSize="10" fontFamily="monospace">Creating vault + 5 user accounts</text>
      <text x="24" y="132" fill="#f59e0b" fontSize="10" fontFamily="monospace">[FUZZ]</text><text x="70" y="132" fill="#64748b" fontSize="10" fontFamily="monospace">12,000 tx/s · Coverage: 34%</text>
      <text x="24" y="152" fill="#f59e0b" fontSize="10" fontFamily="monospace">[FUZZ]</text><text x="70" y="152" fill="#64748b" fontSize="10" fontFamily="monospace">12,000 tx/s · Coverage: 61%</text>
      <text x="24" y="172" fill="#f59e0b" fontSize="10" fontFamily="monospace">[FUZZ]</text><text x="70" y="172" fill="#64748b" fontSize="10" fontFamily="monospace">12,000 tx/s · Coverage: 78%</text>
      <text x="24" y="198" fill="#ef4444" fontSize="10" fontFamily="monospace">[VIOLATION] I-001: total_deposits != sum(user deposits)</text>
      <text x="24" y="216" fill="#ef4444" fontSize="10" fontFamily="monospace">             tx: 8473ae12...  severity: CRITICAL</text>
      <text x="24" y="242" fill="#f59e0b" fontSize="10" fontFamily="monospace">[FUZZ]</text><text x="70" y="242" fill="#64748b" fontSize="10" fontFamily="monospace">12,000 tx/s · Coverage: 82%</text>
      <text x="24" y="268" fill="#22c55e" fontSize="10" fontFamily="monospace">[DONE]</text><text x="70" y="268" fill="#64748b" fontSize="10" fontFamily="monospace">3,847,201 tx · 8 invariants · 1 violation</text>
      <text x="24" y="298" fill="#64748b" fontSize="10" fontFamily="monospace">Results written to fuzz_target/violations.json</text>
      <text x="24" y="318" fill="#7c3aed" fontSize="11" fontFamily="monospace">$ _</text>
    </svg>
  );
}

function SolanaBlockchain() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <circle cx="200" cy="100" r="50" fill="#7c3aed" opacity="0.1" stroke="#7c3aed" strokeWidth="2" />
      <text x="200" y="97" textAnchor="middle" fill="#a78bfa" fontSize="18" fontWeight="700" fontFamily="monospace">SOL</text>
      <text x="200" y="112" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="monospace">Cluster</text>
      <line x1="200" y1="150" x2="200" y2="200" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 4" />
      <rect x="140" y="200" width="120" height="40" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      <text x="200" y="225" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="600" fontFamily="monospace">Program</text>
      <line x1="140" y1="220" x2="60" y2="300" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="260" y1="220" x2="340" y2="170" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="30" y="300" width="60" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="60" y="325" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Account</text>
      <rect x="60" y="360" width="60" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="90" y="385" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">PDA</text>
      <rect x="310" y="130" width="60" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="340" y="155" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Token-22</text>
      <line x1="200" y1="240" x2="200" y2="290" stroke="#7c3aed" strokeWidth="2" />
      <rect x="140" y="290" width="120" height="40" rx="8" fill="#7c3aed" opacity="0.15" stroke="#7c3aed" strokeWidth="1.5" />
      <text x="200" y="315" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="600" fontFamily="monospace">CPI Call</text>
      <line x1="200" y1="330" x2="200" y2="380" stroke="#7c3aed" strokeWidth="2" />
      <rect x="140" y="380" width="120" height="40" rx="8" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1.5" />
      <text x="200" y="405" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="600" fontFamily="monospace">Result OK</text>
    </svg>
  );
}

function CoverageHex() {
  const hexes = useMemo(() => {
    const rows = 4, cols = 5;
    const result: { cx: number; cy: number; fill: string; stroke: string }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = 90 + col * 60 + (row % 2) * 30;
        const cy = 80 + row * 52;
        const seed = (row * 7 + col * 13) % 17;
        const isFilled = seed > 5;
        result.push({
          cx, cy,
          fill: isFilled ? "#7c3aed44" : "#1e293b",
          stroke: isFilled ? "#7c3aed66" : "#33415544",
        });
      }
    }
    return result;
  }, []);
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      {hexes.map((h, i) => (
        <polygon key={i}
          points={`${h.cx},${h.cy-28} ${h.cx+26},${h.cy-14} ${h.cx+26},${h.cy+14} ${h.cx},${h.cy+28} ${h.cx-26},${h.cy+14} ${h.cx-26},${h.cy-14}`}
          fill={h.fill} stroke={h.stroke} strokeWidth="1" />
      ))}
      <text x="200" y="380" textAnchor="middle" fill="#7c3aed" fontSize="28" fontWeight="800" fontFamily="monospace">82%</text>
      <text x="200" y="405" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">Coverage Achieved</text>
      <rect x="140" y="425" width="120" height="6" rx="3" fill="#1e293b" />
      <rect x="140" y="425" width="98" height="6" rx="3" fill="#22c55e" opacity="0.8" />
    </svg>
  );
}

function MaturityRadial() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <circle cx="200" cy="220" r="130" fill="none" stroke="#1e293b" strokeWidth="18" />
      <circle cx="200" cy="220" r="130" fill="none" stroke="#7c3aed" strokeWidth="18" strokeDasharray="612 204" strokeLinecap="round" transform="rotate(-90 200 220)" />
      <text x="200" y="210" textAnchor="middle" fill="white" fontSize="42" fontWeight="800">3</text>
      <text x="200" y="240" textAnchor="middle" fill="#a78bfa" fontSize="13" fontWeight="600" fontFamily="monospace">/ 5</text>
      <text x="200" y="270" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">Economic Soundness</text>
      <rect x="80" y="400" width="56" height="8" rx="4" fill="#ef4444" opacity="0.5" />
      <rect x="144" y="400" width="56" height="8" rx="4" fill="#f59e0b" opacity="0.5" />
      <rect x="208" y="400" width="56" height="8" rx="4" fill="#22c55e" opacity="0.8" />
      <rect x="272" y="400" width="56" height="8" rx="4" fill="#1e293b" />
      <text x="108" y="428" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">L0</text>
      <text x="236" y="428" textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace">L3</text>
      <text x="300" y="428" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">L5</text>
    </svg>
  );
}

function LockAndChain() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <rect x="140" y="280" width="120" height="170" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      <rect x="165" y="310" width="70" height="60" rx="8" fill="#7c3aed" opacity="0.15" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="200" cy="335" r="12" fill="#7c3aed" />
      <rect x="196" y="335" width="8" height="15" rx="2" fill="white" />
      <text x="200" y="400" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">locked</text>
      <circle cx="200" cy="100" r="30" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <circle cx="200" cy="180" r="30" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <line x1="200" y1="130" x2="200" y2="150" stroke="#334155" strokeWidth="2" />
      <line x1="200" y1="210" x2="200" y2="230" stroke="#334155" strokeWidth="2" />
      <line x1="185" y1="115" x2="185" y2="95" stroke="#334155" strokeWidth="2" />
      <rect x="190" y="92" width="40" height="8" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <line x1="215" y1="115" x2="215" y2="165" stroke="#334155" strokeWidth="2" />
      <text x="200" y="445" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="500" fontFamily="monospace">State Invariant</text>
    </svg>
  );
}

function DiffViewer() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <text x="24" y="50" fill="#64748b" fontSize="9" fontFamily="monospace">═══ Original ═══════════════════</text>
      <rect x="24" y="60" width="352" height="24" rx="4" fill="#ef4444" opacity="0.08" />
      <text x="34" y="76" fill="#ef4444" fontSize="11" fontFamily="monospace">- pub fn withdraw(ctx, amount: u64) Result</text>
      <rect x="24" y="88" width="352" height="24" rx="4" fill="#1e293b" />
      <text x="34" y="104" fill="#64748b" fontSize="11" fontFamily="monospace">      ctx.accounts.vault.total -= amount;</text>
      <text x="24" y="136" fill="#64748b" fontSize="9" fontFamily="monospace">═══ Patched ════════════════════</text>
      <rect x="24" y="146" width="352" height="24" rx="4" fill="#22c55e" opacity="0.08" />
      <text x="34" y="162" fill="#22c55e" fontSize="11" fontFamily="monospace">+ pub fn withdraw(ctx, amount: u64) Result</text>
      <rect x="24" y="174" width="352" height="24" rx="4" fill="#22c55e" opacity="0.08" />
      <text x="34" y="190" fill="#22c55e" fontSize="11" fontFamily="monospace">{'+     require!(user.deposited >= amount);'}</text>
      <rect x="24" y="198" width="352" height="24" rx="4" fill="#1e293b" />
      <text x="34" y="214" fill="#64748b" fontSize="11" fontFamily="monospace">      ctx.accounts.vault.total -= amount;</text>
      <rect x="24" y="270" width="352" height="80" rx="8" fill="#7c3aed" opacity="0.06" stroke="#7c3aed" strokeWidth="1" />
      <text x="200" y="298" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="500" fontFamily="monospace">Invariant Restored</text>
      <text x="200" y="318" textAnchor="middle" fill="#a78bfa" fontSize="23" fontWeight="800">I-001 ✓</text>
      <circle cx="200" cy="410" r="35" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2" />
      <path d="M185 410 L195 420 L215 400" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="200" y="465" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily="monospace">Fix Verified</text>
    </svg>
  );
}

function NodeGraph() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <circle cx="200" cy="60" r="28" fill="#7c3aed" opacity="0.2" stroke="#7c3aed" strokeWidth="2" />
      <text x="200" y="65" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="600" fontFamily="monospace">Vault</text>
      <line x1="185" y1="88" x2="60" y2="170" stroke="#334155" strokeWidth="1.5" />
      <line x1="200" y1="88" x2="200" y2="170" stroke="#334155" strokeWidth="1.5" />
      <line x1="215" y1="88" x2="340" y2="170" stroke="#334155" strokeWidth="1.5" />
      <circle cx="60" cy="190" r="24" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="60" y="194" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">User</text>
      <circle cx="200" cy="190" r="24" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x="200" y="194" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace">Token</text>
      <circle cx="340" cy="190" r="24" fill="#06b6d4" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" />
      <text x="340" y="194" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace">Oracle</text>
      <line x1="60" y1="214" x2="140" y2="340" stroke="#334155" strokeWidth="1.5" />
      <line x1="200" y1="214" x2="200" y2="340" stroke="#334155" strokeWidth="1.5" />
      <line x1="340" y1="214" x2="260" y2="340" stroke="#334155" strokeWidth="1.5" />
      <circle cx="140" cy="360" r="24" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="140" y="364" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Deposit</text>
      <circle cx="200" cy="360" r="24" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
      <text x="200" y="364" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="monospace">Withdraw</text>
      <circle cx="260" cy="360" r="24" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1.5" />
      <text x="260" y="364" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace">Price</text>
      <text x="200" y="438" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">Account Dependency Graph</text>
    </svg>
  );
}

function InvariantMatrix() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="0" y="0" width="400" height="500" rx="16" fill="#0f172a" />
      <rect x="30" y="60" width="80" height="30" rx="6" fill="#1e293b" />
      <text x="70" y="80" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Vault</text>
      <rect x="120" y="60" width="80" height="30" rx="6" fill="#1e293b" />
      <text x="160" y="80" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">AMM</text>
      <rect x="210" y="60" width="80" height="30" rx="6" fill="#1e293b" />
      <text x="250" y="80" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Lending</text>
      <rect x="300" y="60" width="70" height="30" rx="6" fill="#1e293b" />
      <text x="335" y="80" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Gov</text>
      <rect x="30" y="100" width="60" height="28" rx="6" fill="#1e293b" />
      <text x="60" y="118" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Supply</text>
      <rect x="30" y="138" width="60" height="28" rx="6" fill="#1e293b" />
      <text x="60" y="156" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Auth</text>
      <rect x="30" y="176" width="60" height="28" rx="6" fill="#1e293b" />
      <text x="60" y="194" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Rounding</text>
      <rect x="30" y="214" width="60" height="28" rx="6" fill="#1e293b" />
      <text x="60" y="232" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">CPI</text>
      {[
        {x:120,y:100,f:"#22c55e"},{x:210,y:100,f:"#22c55e"},{x:300,y:100,f:"#22c55e"},
        {x:120,y:138,f:"#22c55e"},{x:210,y:138,f:"#22c55e"},{x:300,y:138,f:"#22c55e"},
        {x:120,y:176,f:"#f59e0b"},{x:210,y:176,f:"#f59e0b"},{x:300,y:176,f:"#ef4444"},
        {x:120,y:214,f:"#ef4444"},{x:210,y:214,f:"#ef4444"},{x:300,y:214,f:"#ef4444"},
      ].map((cell,i) => (
        <rect key={i} x={cell.x} y={cell.y} width="80" height="28" rx="6" fill={cell.f} opacity="0.12" stroke={cell.f} strokeWidth="1" />
      ))}
      <text x="200" y="330" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="600" fontFamily="monospace">130+ Invariant Coverage</text>
      <rect x="80" y="360" width="240" height="8" rx="4" fill="#1e293b" />
      <rect x="80" y="360" width="120" height="8" rx="4" fill="#22c55e" opacity="0.7" />
      <rect x="120" y="360" width="80" height="8" rx="4" fill="#f59e0b" opacity="0.7" />
      <rect x="200" y="360" width="40" height="8" rx="4" fill="#ef4444" opacity="0.7" />
      <text x="200" y="395" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">Gap Analysis: Rounding + CPI</text>
    </svg>
  );
}

const illustrations = [
  <CodeWindow key="code" />,
  <ArchitectureDiagram key="arch" />,
  <ShieldSecurity key="shield" />,
  <GraphVisualization key="graph" />,
  <TerminalOutput key="terminal" />,
  <SolanaBlockchain key="solana" />,
  <CoverageHex key="hex" />,
  <MaturityRadial key="maturity" />,
  <LockAndChain key="lock" />,
  <DiffViewer key="diff" />,
  <NodeGraph key="node" />,
  <InvariantMatrix key="matrix" />,
];

export function ImageReveal(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const columns: ReactNode[][] = [[], [], []];
  illustrations.forEach((ill, index) => columns[index % 3]!.push(ill));

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const columnEls = containerRef.current!.querySelectorAll(".column");
      columnEls.forEach((column, columnIndex) => {
        const items = column.querySelectorAll(".column__item");
        items.forEach((item) => {
          const wrapper = item.querySelector(".column__item-imgwrap");
          if (!wrapper) return;
          let xVal: number, sx: number, sy: number, origin: string, blur: string;
          switch (columnIndex) {
            case 0: xVal = -400; origin = "0% 50%"; sx = 6; sy = 0.3; blur = "blur(10px)"; break;
            case 1: xVal = 0; origin = "50% 50%"; sx = 0.7; sy = 0.7; blur = "blur(5px)"; break;
            case 2: xVal = 400; origin = "100% 50%"; sx = 6; sy = 0.3; blur = "blur(10px)"; break;
            default: xVal = 0; origin = "50% 50%"; sx = 1; sy = 1; blur = "blur(0px)";
          }
          gsap.fromTo(wrapper, {
            willChange: "filter", xPercent: xVal, opacity: 0, scaleX: sx, scaleY: sy, filter: blur,
          }, {
            startAt: { transformOrigin: origin },
            scrollTrigger: { trigger: item, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: true },
            xPercent: 0, opacity: 1, scaleX: 1, scaleY: 1, filter: "blur(0px)",
          });
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden -mt-24">
      <div ref={containerRef} className="columns mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 sm:px-6 md:gap-6 lg:gap-8 lg:px-8">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="column flex flex-col gap-4 md:gap-6 lg:gap-8">
            {col.map((ill, i) => (
              <figure key={`col${colIdx}-${i}`} className="column__item">
                <div className="column__item-imgwrap relative aspect-3/4 w-full overflow-hidden rounded-xl border border-white/5">
                  {ill}
                </div>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
