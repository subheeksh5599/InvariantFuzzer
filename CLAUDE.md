# Solana CPI Safety — Claude Code Configuration

> Repository: https://github.com/subheeksh5599/solana-cpi-safety

## What this skill is

A Claude Code skill that detects and prevents four Solana CPI vulnerability classes with five runnable PoCs.

## Toolchain pins

| Tool | Version |
|------|---------|
| Anchor | 1.0.2 |
| Rust | 1.85+ |
| Node.js | >= 20 |

## Running the PoCs

```bash
cd poc/return-data-spoofing && anchor build && npm install && npm test
cd poc/arbitrary-cpi && anchor build && npm install && npm test
cd poc/account-reload && anchor build && npm install && npm test
cd poc/pda-cpi-signing && anchor build && npm install && npm test
cd poc/pinocchio-return-data && cargo-build-sbf && npm install && npm test
```

Compiled programs and keypairs are committed, so `npm test` works with Node alone.

## Key files

```
skill/SKILL.md                         # Routing entry point
skill/cpi-return-data-spoofing.md      # Crown jewel sub-skill
skill/arbitrary-cpi.md
skill/account-reload.md
skill/pda-cpi-signing.md
skill/poc-harness.md
skill/cpi-checklist.md
agents/cpi-auditor.md
commands/audit-cpi.md
rules/rust.md
poc/return-data-spoofing/
poc/pinocchio-return-data/
poc/arbitrary-cpi/
poc/account-reload/
poc/pda-cpi-signing/
```
