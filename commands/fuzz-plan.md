# /fuzz-plan

## Purpose
Analyze a Solana program, discover invariants, score maturity, and produce a fuzzing plan.

## Usage
```
/fuzz-plan [--target <program_path>] [--depth quick|medium|deep] [--type <program_type>]
```

## Parameters

| Flag | Default | Description |
|------|---------|-------------|
| `--target` | Current workspace root | Path to program directory |
| `--depth quick` | quick | Fast scan — structural + constraint patterns only |
| `--depth medium` | — | + instruction logic patterns, 5 min max |
| `--depth deep` | — | + economic + cross-program analysis, full source |
| `--type` | auto-detect | Force program type (vault, amm, lending, etc.) |

## What It Does

1. **Loads skill context**: invariant-extraction.md, invariant-templates.md, invariant-maturity-model.md, known-attack-vectors.md
2. **Spawns fuzzer-architect agent**
3. **Agent reads program source** and applies extraction patterns
4. **Agent cross-references** with invariant template catalog
5. **Agent scores maturity** using the Invariant Maturity Model
6. **Produces dual output**:
   - Human-readable markdown plan
   - Machine-readable `*-invariants.json`

## Output Example

```
Invariant Maturity Score: 2/5

CRITICAL Invariants (3 found):
  I-001: vault.total_deposits == sum(user deposits)
  I-002: only authority can withdraw
  I-003: locked vault rejects all state changes

HIGH Invariants (5 found):
  ...

Suggested Campaigns:
  1. State consistency (20 min)
  2. Access control (10 min)
  3. Rounding safety (15 min)

Next: /fuzz-run --plan vault-invariants.json
```
