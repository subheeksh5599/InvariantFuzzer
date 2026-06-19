# /fuzz-run

## Purpose
Generate a Trident fuzz harness from an invariant plan and execute the fuzz campaign.

## Usage
```
/fuzz-run --plan <invariants.json> [--time <minutes>] [--campaign <name>]
```

## Parameters

| Flag | Default | Description |
|------|---------|-------------|
| `--plan` | (required) | Path to invariant plan JSON (from /fuzz-plan) |
| `--time` | 30 | Time budget in minutes |
| `--campaign` | all | Run a specific campaign from the plan |
| `--coverage` | 75 | Target coverage percentage (0-100) |

## What It Does

1. **Loads skill context**: harness-generation.md, coverage-analysis.md
2. **Spawns fuzz-harness-engineer agent**
3. **Agent reads the invariant plan JSON**
4. **Agent generates**:
   - `fuzz_target/<name>/trident-spec.json`
   - `fuzz_target/<name>/src/` — fuzz target, accounts, invariants, strategies
   - `fuzz_target/<name>/Cargo.toml`
5. **Agent compiles** the fuzz target
6. **Executes campaign**: `NO_DNA=1 trident fuzz run <target> --time <minutes>`
7. **Collects results**: coverage data, violation traces, crash logs
8. **If coverage < target**: analyzes gaps, refines strategies, re-runs
9. **Produces**: `violations.json` + coverage report

## Prerequisites

- Trident CLI installed (`cargo install trident-cli`)
- Program compiles successfully
- Surfpool running (for mainnet-fork campaigns)

## Output

```
Fuzz Campaign: vault_state_consistency
Duration: 30 min
Transactions: 3,847,201
Instructions exercised: 4/4 (100%)
Branch coverage: 78%
Invariants checked: 8
Violations found: 1

Next: /fuzz-report to triage violations
```
