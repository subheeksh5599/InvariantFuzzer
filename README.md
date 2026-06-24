# Solana CPI Safety

> Detect and prevent cross-program invocation vulnerabilities in Solana programs

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-black?logo=solana)](https://solana.com)
[![Claude Code](https://img.shields.io/badge/Claude_Code-powered-orange)](https://claude.ai)
[![Live Site](https://img.shields.io/badge/live-site-green)](https://site-seven-ochre-61.vercel.app)

A Claude Code skill that detects and prevents four classes of cross-program invocation vulnerabilities in Solana programs, with first-class coverage of CPI return-data spoofing and five runnable proof-of-concept exploits.

## What it is

Cross-program invocation is Solana's most common source of severe, exploitable bugs. This skill teaches Claude Code to recognize, explain, and fix the four classes that account for the majority of High and Critical audit findings.

### The four CPI vulnerability classes

| Class | Risk | What goes wrong |
|-------|------|-----------------|
| **CPI return-data spoofing** | Critical | Trusting `get_return_data()` without verifying the producing program. Any program can write to the return-data slot — a rogue caller replaces an oracle price before your program reads it. |
| **Arbitrary CPI** | High | Invoking a caller-supplied program id — enables fake SPL Token programs and attacker-controlled code executing inside the victim vault. |
| **Stale account after CPI** | High | Reading account state a callee mutated without reloading from the ledger. |
| **PDA CPI signing** | Medium-High | `invoke_signed` with non-canonical bumps or leaked signer seeds — enables unauthorized signing. |

### The novel core: CPI return-data spoofing

The crown-jewel coverage is CPI return-data spoofing. It is the least-documented of the four classes and the hardest to catch in review. The attack surface is the `set_return_data` / `get_return_data` syscall pair: any program invoked before yours (or by yours) can overwrite the slot. A DeFi program that calls an oracle CPI and then reads `get_return_data()` without checking `program_id == ORACLE_PROGRAM_ID` is fully exploitable.

Anchored on a real upstream-fixed finding: Anchor CPI return-data spoofing, CVSS 7.5, fixed upstream.

Both Anchor and native/Pinocchio patterns are covered.

## What is inside

### Skill bundle

```
skill/
  SKILL.md                         # Routing entry point
  cpi-return-data-spoofing.md      # Crown jewel sub-skill
  arbitrary-cpi.md                 # Arbitrary CPI sub-skill
  account-reload.md                # Stale account sub-skill
  pda-cpi-signing.md               # PDA signing sub-skill
  poc-harness.md                   # PoC test harness guide
  cpi-checklist.md                 # Pre-audit CPI checklist
  rules/
    rust.md                        # Rust code rule

agents/
  cpi-auditor.md                   # Autonomous CPI audit agent

commands/
  audit-cpi.md                     # /audit-cpi command

poc/
  return-data-spoofing/            # Runnable LiteSVM + TypeScript PoC (incl. Variant B)
  pinocchio-return-data/           # Runnable LiteSVM PoC (Pinocchio crown-jewel variant)
  arbitrary-cpi/                   # Runnable LiteSVM + TypeScript PoC
  account-reload/                  # Runnable LiteSVM + TypeScript PoC
  pda-cpi-signing/                 # Runnable LiteSVM + TypeScript PoC
```

### The /audit-cpi command

Invoke `/audit-cpi` in any Claude Code session to scan a Solana repository for all four CPI vulnerability classes and produce a structured finding report with remediation steps.

### Runnable PoCs

The compiled programs and their keypairs are committed, so the PoCs run with Node alone — no Solana/Anchor toolchain required.

```bash
# Return-data spoofing PoC (6 test cases)
cd poc/return-data-spoofing && npm install && npm test

# Arbitrary CPI PoC (3 test cases)
cd poc/arbitrary-cpi && npm install && npm test

# Stale account after CPI PoC (3 test cases)
cd poc/account-reload && npm install && npm test

# PDA CPI signing PoC (4 test cases)
cd poc/pda-cpi-signing && npm install && npm test

# Pinocchio return-data PoC (3 test cases)
cd poc/pinocchio-return-data && npm install && npm test
```

### Use in Claude Code

```
/audit-cpi
Check if this program has return-data spoofing risks
Review this CPI call for arbitrary program substitution
Does this function reload account state after CPI?
```

## Quick Start

```bash
git clone https://github.com/subheeksh5599/InvariantFuzzer
cd InvariantFuzzer

# Install the skill
./install-custom.sh

# Run the PoCs (no toolchain needed)
cd poc/return-data-spoofing && npm install && npm test
```

## Adding to Solana AI Kit

```bash
git submodule add https://github.com/subheeksh5599/InvariantFuzzer.git .claude/skills/ext/solana-cpi-safety
```

```gitmodules
[submodule ".claude/skills/ext/solana-cpi-safety"]
    path = .claude/skills/ext/solana-cpi-safety
    url = https://github.com/subheeksh5599/InvariantFuzzer.git
```

## Why It's Unique

| Existing Tool | What It Does |
|---------------|-------------|
| Trail of Bits skills | General security audit guidance |
| Safe Solana Builder | Security-first code generation |
| QEDGen solana-skills | Formal verification with Lean 4 |

| Solana CPI Safety | What It Adds |
|-------------------|-------------|
| CPI return-data spoofing detection | Novel coverage of the least-documented CPI attack class |
| Arbitrary CPI detection | Program substitution and fake-SPL token patterns |
| Stale account detection | account.reload() enforcement after every CPI |
| PDA CPI signing audit | Canonical bump and seed leakage verification |
| 5 runnable PoCs | LiteSVM + TypeScript test suites — works with Node alone |
| /audit-cpi command | One-command structured audit across all four classes |

## Requirements (for the PoCs)

| Tool | Version |
|------|---------|
| Node.js | >= 20 |

To rebuild the programs from source (optional):

| Tool | Version |
|------|---------|
| Anchor | 1.0.2 |
| Solana / Agave CLI | 3.x |
| Rust | 1.85+ |
| Node.js | >= 20 |

The skill bundle has no runtime requirements — it is plain Markdown.

## Repository Structure

```
InvariantFuzzer/
├── README.md
├── LICENSE
├── CLAUDE.md
├── install.sh / install-custom.sh
├── skill/
│   ├── SKILL.md
│   ├── cpi-return-data-spoofing.md
│   ├── arbitrary-cpi.md
│   ├── account-reload.md
│   ├── pda-cpi-signing.md
│   ├── poc-harness.md
│   ├── cpi-checklist.md
│   └── rules/rust.md
├── agents/
│   └── cpi-auditor.md
├── commands/
│   └── audit-cpi.md
├── rules/
│   └── rust.md
├── poc/
│   ├── return-data-spoofing/
│   ├── pinocchio-return-data/
│   ├── arbitrary-cpi/
│   ├── account-reload/
│   └── pda-cpi-signing/
└── site/          # Landing page
```

## License

MIT — see [LICENSE](LICENSE)
