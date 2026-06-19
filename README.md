# Solana Invariant Fuzzer

> **AI-Powered Invariant Discovery, Fuzz Orchestration & Security Workflow for Solana — Built on Top of Trident**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-black?logo=solana)](https://solana.com)
[![Claude Code](https://img.shields.io/badge/Claude_Code-powered-orange)](https://claude.ai)
[![Live Site](https://img.shields.io/badge/live-site-green)](https://site-seven-ochre-61.vercel.app)

A Claude Code / Codex skill that turns any coding agent into an expert invariant engineer for Solana programs. Automatically discovers invariants from your source code, generates Trident fuzz harnesses targeting those invariants, and produces executable PoCs for violations.

**Most Solana teams don't fail because they lack a fuzzer. They fail because they don't know which invariants to test.** Solana Invariant Fuzzer solves that by automatically discovering invariants, generating fuzz campaigns around them, and producing executable proof-of-concepts when violations occur.

> **What this is:** AI-powered invariant discovery, fuzz orchestration, and security workflow for Solana — built on top of Trident.  
> **What this is NOT:** A new fuzzing engine. Trident handles the mechanical fuzzing at 12,000 tx/s. This skill handles the intelligence layer — reading your code, engineering invariants, generating Trident harnesses, and interpreting results.

## Concrete Example

```rust
#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub total_deposits: u64,
    pub locked: bool,
}
```

**↓ `/fuzz-plan`**

```
╔═══════════════════════════════════╗
║ Invariant Maturity Score: 2/5     ║
╚═══════════════════════════════════╝

[CRITICAL] I-001: vault.total_deposits == sum(UserDeposit.amount)
  Source: summation field pattern (P1)
  Risk: Accounting desync — withdraw() has no require! guard

[HIGH] I-002: only authority may call withdraw()
  Source: authority field pattern (P4)
  Risk: Missing has_one = authority constraint

[MEDIUM] I-003: vault.locked == true → withdraw() must fail
  Source: boolean guard pattern (P5)
  Risk: locked field exists but no check in withdraw()
```

<div align="center">

**[Try it live →](https://site-seven-ochre-61.vercel.app/chat)**

</div>

## Why It's Unique

| Existing Tool | What It Does |
|---------------|-------------|
| Trident | Executes fuzzing at 12,000 tx/s |
| Mollusk | SVM harness for program testing |
| LiteSVM | In-process SVM simulation |
| Surfpool | Local mainnet-fork validator |
| Trail of Bits skills | Static security audit guidance |
| Safe Solana Builder | Security-first code generation |

| Solana Invariant Fuzzer | What It Adds |
|-------------------------|-------------|
| Discovers invariants | Reads your code and extracts security properties automatically |
| Generates fuzz plans | Produces Trident specs targeting specific invariants |
| Orchestrates campaigns | Runs coverage-guided fuzz campaigns with auto-refinement |
| Converts violations to PoCs | Triage tree → executable proof of concept |
| Scores maturity (0–5) | Framework measuring invariant coverage from Unprotected to Battle-Hardened |
| Works across 16 protocol types | Vault, AMM, Lending, Staking, Governance, NFT, and more |

## The Problem

Every Solana program has invariants — properties that must always hold:
- *"Total deposits must equal the sum of all user deposits"*
- *"Only the authority can withdraw funds"*
- *"A locked vault rejects all state changes"*

Today, these invariants live only in developers' heads. They're never formally specified, never systematically tested, and never checked in CI. When they break, you learn about it from an exploit — or an auditor's bill.

**Trident** gives you a fuzzer. **Solana Invariant Fuzzer** gives you the invariants to fuzz.

## Example Output (`vault-invariants.json`)

Every `/fuzz-plan` produces both human-readable output and machine-readable JSON for chaining into `/fuzz-run`:

```json
{
  "program": "vault",
  "program_type": "vault",
  "maturity_score": 2,
  "target_maturity": 3,
  "invariants": [
    {
      "id": "I-001",
      "name": "total_deposits_consistency",
      "description": "vault.total_deposits == sum(UserDeposit.amount)",
      "severity": "critical",
      "confidence": "HIGH",
      "source_pattern": "P1 — summation field",
      "attack_class": "accounting_desync",
      "line": 17,
      "risk": "withdraw() subtracts without checking user balance"
    },
    {
      "id": "I-002",
      "name": "withdraw_authorization",
      "description": "only vault.authority may call withdraw()",
      "severity": "high",
      "confidence": "HIGH",
      "source_pattern": "P4 — authority field",
      "attack_class": "access_control_bypass",
      "line": 15,
      "risk": "no has_one = authority constraint on withdraw context"
    },
    {
      "id": "I-003",
      "name": "lock_enforcement",
      "description": "vault.locked == true → withdraw() fails",
      "severity": "medium",
      "confidence": "MEDIUM",
      "source_pattern": "P5 — boolean guard",
      "attack_class": "state_machine_violation",
      "line": null,
      "risk": "locked field exists but no guard in withdraw handler"
    }
  ],
  "campaigns": [
    { "name": "state_consistency", "time_minutes": 20, "target_coverage": 0.75 },
    { "name": "access_control", "time_minutes": 10, "target_coverage": 0.90 },
    { "name": "boolean_guard", "time_minutes": 15, "target_coverage": 0.85 }
  ]
}
```

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
git clone https://github.com/subheeksh5599/InvariantFuzzer
cd InvariantFuzzer
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
| Agent | Purpose |
|-------|---------|
| `fuzzer-architect` | Invariant discovery, campaign planning, maturity scoring |
| `fuzz-harness-engineer` | Trident spec generation, mutation strategy design |
| `fuzz-analyst` | Violation triage, PoC generation, report writing |

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
