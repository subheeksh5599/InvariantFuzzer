# Solana Invariant Fuzzer

> **AI-Powered Invariant Discovery, Fuzz Orchestration & Security Workflow for Solana — Built on Top of Trident**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-black?logo=solana)](https://solana.com)
[![Claude Code](https://img.shields.io/badge/Claude_Code-powered-orange)](https://claude.ai)

A Claude Code / Codex skill that turns any coding agent into an expert invariant engineer for Solana programs. Automatically discovers invariants from your source code, generates Trident fuzz harnesses targeting those invariants, and produces executable PoCs for violations.

**Not a fuzzer — the intelligence layer that makes fuzzing useful.**

## The Problem

Every Solana program has invariants — properties that must always hold:
- *"Total deposits must equal the sum of all user deposits"*
- *"Only the authority can withdraw funds"*
- *"A locked vault rejects all state changes"*

Today, these invariants live only in developers' heads. They're never formally specified, never systematically tested, and never checked in CI. When they break, you learn about it from an exploit — or an auditor's bill.

**Trident** gives you a fuzzer. **Solana Invariant Fuzzer** gives you the invariants to fuzz.

> **What this is:** AI-powered invariant discovery, fuzz orchestration, and security workflow for Solana — built on top of Trident.  
> **What this is NOT:** A new fuzzing engine. Trident handles the mechanical fuzzing at 12,000 tx/s. This skill handles the intelligence layer — reading your code, engineering invariants, generating Trident harnesses, and interpreting results.

## How It Works

```
1. /fuzz-plan      →   AI reads your program, extracts invariants,
                        scores maturity (0-5), outputs plan + JSON

2. /fuzz-run       →   AI generates Trident harness targeting the
                        invariants, executes fuzz campaign

3. /fuzz-report    →   AI triages violations, classifies severity,
                        generates executable PoCs
```

## Quick Start

```bash
# Install the skill
git clone https://github.com/subheeksh5599/solana-invariant-fuzzer
cd solana-invariant-fuzzer
./install-custom.sh

# Install prerequisites
cargo install trident-cli
cargo install surfpool-cli

# In Claude Code, analyze your program
/fuzz-plan --target programs/vault --depth deep
```

## What's Included

### Skill Hub (Progressive Loading)
| File | Purpose |
|------|---------|
| `skill/SKILL.md` | Entry point — routes to sub-skills based on user intent |
| `skill/invariant-extraction.md` | 22 code patterns AI uses to extract invariants |
| `skill/invariant-templates.md` | 16 protocol categories, 130+ pre-built invariants |
| `skill/invariant-maturity-model.md` | 0-5 scoring framework for program security maturity |
| `skill/known-attack-vectors.md` | Solana-specific vulnerability catalog |
| `skill/harness-generation.md` | Trident fuzz harness generation from invariants |
| `skill/poc-generation.md` | From violation → executable proof of concept |
| `skill/coverage-analysis.md` | Coverage gap analysis and campaign refinement |
| `skill/ci-integration.md` | CI/CD pipelines for continuous invariant verification |

### Agents
| Agent | Model | Purpose |
|-------|-------|---------|
| `fuzzer-architect` | Opus | Invariant discovery, campaign planning, maturity scoring |
| `fuzz-harness-engineer` | Opus | Trident spec generation, mutation strategy design |
| `fuzz-analyst` | Opus | Violation triage, PoC generation, report writing |

### Commands
| Command | Purpose |
|---------|---------|
| `/fuzz-plan` | Analyze program, extract invariants, score maturity |
| `/fuzz-run` | Generate Trident harness + execute fuzz campaign |
| `/fuzz-report` | Triage violations, generate PoCs, produce report |

## Supported Program Types

Invariant templates exist for 16 program categories:
Vault · AMM · Lending · Staking · Governance · NFT · Escrow · Bridge · Token · CLMM · Multisig · Perps · Oracle · Auction · Treasury · Name Service

Plus 14 universal invariants that apply to every Solana program.

## Invariant Maturity Model

```
Level 0 — Unprotected        No invariants
Level 1 — Guarded            Access control invariants
Level 2 — Consistent         State consistency invariants
Level 3 — Economically Sound Economic invariants
Level 4 — Cross-Program Safe  CPI/interaction invariants
Level 5 — Battle-Hardened    CI-integrated, >90% fuzz coverage
```

## Requirements

- Claude Code or Codex (OpenCode)
- [solana-dev-skill](https://github.com/solana-foundation/solana-dev-skill) (core Solana knowledge)
- [Trident CLI](https://github.com/Ackee-Blockchain/trident) (fuzz engine)
- [Surfpool](https://github.com/acheroncrypto/surfpool) (local mainnet fork)

## Repository Structure

```
solana-invariant-fuzzer/
├── README.md
├── LICENSE
├── CLAUDE.md
├── install.sh / install-custom.sh
├── skill/
│   ├── SKILL.md                     # Entry hub
│   ├── invariant-extraction.md      # ★ Core: 22 extraction patterns
│   ├── invariant-templates.md       # ★ Core: 130+ invariants
│   ├── invariant-maturity-model.md  # ★ Core: 0-5 scoring
│   ├── known-attack-vectors.md      # ★ Core: Vuln catalog
│   ├── harness-generation.md
│   ├── poc-generation.md
│   ├── coverage-analysis.md
│   ├── ci-integration.md
│   └── resources.md
├── agents/
│   ├── fuzzer-architect.md
│   ├── fuzz-harness-engineer.md
│   └── fuzz-analyst.md
├── commands/
│   ├── fuzz-plan.md
│   ├── fuzz-run.md
│   └── fuzz-report.md
└── rules/
    └── fuzzing.md
```

## License

MIT — see [LICENSE](LICENSE)
