---
name: solana-invariant-fuzzer
description: AI-powered invariant discovery, fuzz orchestration, and security workflow for Solana — built on top of Trident. Extracts invariants from Anchor/Pinocchio/native program source, generates Trident fuzz harnesses targeting those invariants, orchestrates fuzz campaigns, and produces executable PoCs for violations. Extends solana-dev-skill for program knowledge and integrates with the Solana AI Kit agent/command system.
user-invocable: true
license: MIT
compatibility: Requires Trident CLI, surfpool, Rust toolchain, Solana CLI 1.18+
metadata:
  author: Solana Invariant Fuzzer Contributors
  version: 1.0.0
---

# Solana Invariant Fuzzer

> *AI-powered invariant discovery, fuzz orchestration, and security workflow for Solana — built on top of Trident*  
> **Extends**: [solana-dev-skill](https://github.com/solana-foundation/solana-dev-skill) — Core Solana development  
> **Fuzz engine**: [Trident](https://github.com/Ackee-Blockchain/trident) — Solana-native fuzzer (12K tx/s, stateful)  
> **Integrates with**: [Solana AI Kit](https://github.com/solanabr/solana-ai-kit)

## What This Skill Is For

Use when the user asks:
- "Find bugs in my Solana program"
- "What invariants should my vault / AMM / lending protocol have?"
- "Set up fuzzing for my Anchor program"
- "Is my program safe from [reentrancy / arithmetic bugs / access control flaws]?"
- "Generate a fuzz harness targeting these invariants"
- "Run a fuzz campaign against my deployed program"
- "Triage these fuzz violations — are they real bugs?"

## How It Works

```
 ┌────────────── INVARIANT DISCOVERY ──────────────┐
 │  AI reads program source + IDL                   │
 │  Extracts invariants from structs, constraints,   │
 │  instruction logic, and known attack patterns     │
 │  Output: human-readable plan + machine JSON       │
 └──────────────────────┬───────────────────────────┘
                        │
 ┌──────────────────────▼───────────────────────────┐
 │  HARNESS ORCHESTRATION                            │
 │  AI generates Trident fuzz spec + mutation         │
 │  strategies targeting each discovered invariant    │
 │  Output: fuzz_target/ + trident-spec.json         │
 └──────────────────────┬───────────────────────────┘
                        │
 ┌──────────────────────▼───────────────────────────┐
 │  FUZZ EXECUTION (Trident does the heavy lifting)   │
 │  trident fuzz run <target> --time 30m              │
 │  AI monitors coverage, invariants, violations      │
 │  Output: coverage maps, violation traces           │
 └──────────────────────┬───────────────────────────┘
                        │
 ┌──────────────────────▼───────────────────────────┐
 │  TRIAGE + PoC GENERATION                           │
 │  AI classifies violations, generates minimal       │
 │  reproducible transaction sequences                │
 │  Output: ranked findings + executable PoCs         │
 └───────────────────────────────────────────────────┘
```

## Default Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Fuzz engine | Trident | Solana-native, 12K tx/s, stateful, SF-granted |
| Test network | Surfpool (mainnet-fork) | Fast local fork, matches real state |
| Invariant format | JSON + Markdown | Machine-readable for chaining, human-readable for review |
| Program analysis | Anchor IDL + source | 99% of programs use Anchor |
| Harness language | Rust (Trident macros) | Native performance, Anchor compatibility |
| PoC output | Standalone Rust test | Runnable immediately, no setup |

## Operating Procedure

### 1. Classify the Task

| User intent | Phase | Primary skill file(s) |
|-------------|-------|-----------------------|
| "Find invariants for my program" | Discovery | invariant-extraction.md, invariant-templates.md |
| "What maturity level is my program?" | Scoring | invariant-maturity-model.md |
| "Check for [vuln class]" | Analysis | known-attack-vectors.md |
| "Generate a fuzz harness" | Harness | harness-generation.md |
| "Run a fuzz campaign" | Execution | harness-generation.md (via Trident) |
| "Diagnose this violation" | Triage | poc-generation.md |
| "Set up CI fuzzing" | Integration | ci-integration.md |

### 2. Route to the Right Agent

| Intent | Agent |
|--------|-------|
| Invariant discovery + campaign planning | fuzzer-architect |
| Harness generation + fuzz spec writing | fuzz-harness-engineer |
| Violation triage + PoC generation | fuzz-analyst |

### 3. Execute the Phase

See each sub-skill for detailed phase instructions.

### 4. Deliverables

- **Plan phase**: Markdown report + `*-invariants.json` file
- **Harness phase**: `fuzz_target/` directory with Trident spec + Rust target
- **Report phase**: Ranked findings (Critical → Info) with executable PoCs
- **All phases**: Invariant Maturity Score (0-5) for the program

---

## Progressive Disclosure (Load When Needed)

### Core Intelligence Layer

| File | Purpose | Load when... |
|------|---------|-------------|
| [invariant-extraction.md](invariant-extraction.md) | 22+ extraction patterns with code examples | Planning invariants |
| [invariant-templates.md](invariant-templates.md) | 16 protocol categories, 130+ pre-built invariants | Planning invariants |
| [invariant-maturity-model.md](invariant-maturity-model.md) | 0-5 scoring framework for program security maturity | Scoring a program |
| [known-attack-vectors.md](known-attack-vectors.md) | Solana-specific vulnerability catalog | Auditing / checking for known bugs |

### Execution Layer

| File | Purpose | Load when... |
|------|---------|-------------|
| [harness-generation.md](harness-generation.md) | Trident spec generation from invariants | Building fuzz harnesses |
| [poc-generation.md](poc-generation.md) | From violation trace → executable PoC | Triage / report phase |
| [coverage-analysis.md](coverage-analysis.md) | Interpreting coverage gaps | After fuzz campaign |
| [ci-integration.md](ci-integration.md) | GitHub Actions + Surfpool CI pipeline | Setting up continuous fuzzing |

### Reference

| File | Purpose |
|------|---------|
| [resources.md](resources.md) | External tools, papers, references |

---

## Invariant Maturity Model (Quick Reference)

The model scores programs 0-5. Every `/fuzz-plan` output includes the score.

| Level | Name | What it means |
|-------|------|---------------|
| 0 | Unprotected | No invariants documented or tested |
| 1 | Guarded | Basic access control invariants checked |
| 2 | Consistent | State consistency invariants verified |
| 3 | Economically Sound | Economic invariants modeled and tested |
| 4 | Cross-Program Safe | Cross-program interaction invariants validated |
| 5 | Battle-Hardened | Production-grade fuzz coverage, CI integration |

See [invariant-maturity-model.md](invariant-maturity-model.md) for full details.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/fuzz-plan` | Analyze program, extract invariants, score maturity, output plan |
| `/fuzz-run` | Generate Trident harness + execute fuzz campaign |
| `/fuzz-report` | Triage violations, generate PoCs, produce finding report |

## Agents

| Agent | Purpose |
|-------|---------|
| **fuzzer-architect** | Invariant discovery, campaign planning, maturity scoring |
| **fuzz-harness-engineer** | Trident spec generation, mutation strategy design |
| **fuzz-analyst** | Violation triage, PoC generation, report writing |
