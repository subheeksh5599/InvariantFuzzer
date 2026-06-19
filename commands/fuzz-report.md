# /fuzz-report

## Purpose
Triage fuzz violations, classify findings, generate executable PoCs, and produce a report.

## Usage
```
/fuzz-report [--plan <invariants.json>] [--results <violations.json>] [--format markdown|json]
```

## Parameters

| Flag | Default | Description |
|------|---------|-------------|
| `--plan` | (required) | Path to invariant plan JSON |
| `--results` | auto-detect | Path to violations JSON |
| `--format` | markdown | Output format (markdown or json) |

## What It Does

1. **Loads skill context**: poc-generation.md, known-attack-vectors.md
2. **Spawns fuzz-analyst agent**
3. **Agent reads violation traces** and reproduces each one
4. **Agent applies triage decision tree**:
   - Incorrect invariant → fix spec
   - Known limitation → document as INFO
   - False positive → discard
   - Real bug → classify severity, generate PoC
5. **Agent maps each finding** to an attack vector class
6. **Agent generates executable PoCs** (Anchor tests)
7. **Produces final report**: sorted by severity, with root cause and fix guidance

## Output Example

```
# Fuzz Report: vault

## Summary
2 violations found → 1 confirmed bug, 1 false positive

## Finding #1 [CRITICAL] Accounting Desync in Withdraw
Invariant: I-001 — vault.total_deposits == sum(user deposits)
Root cause: withdraw() at line 145 does not check user.deposited >= amount
Impact: Attacker can drain vault of all user deposits
PoC: poc_vault_overwithdraw.rs (45 lines, runs in <1s)
Fix: Add require!(user_dep.amount >= amount) before line 146
```
