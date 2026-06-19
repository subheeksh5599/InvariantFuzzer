# Fuzzing Rules

These rules apply whenever working with fuzz targets, Trident harnesses, or invariant specifications.

## Invariant Specification Format

- Use `I-XXX` naming: `I-001`, `I-002`, etc.
- Always include: severity, confidence, extraction source, attack class
- Machine format: JSON with `{ name, description, severity, confidence, source_pattern, attack_class }`
- Human format: `[SEVERITY] I-XXX: <description> (source: <file>:<line>, confidence: HIGH|MEDIUM|LOW)`

## Fuzz Target Safety

- Never execute fuzz campaigns against mainnet-beta
- Default to localnet (TridentSVM) or surfpool fork
- Always use `NO_DNA=1` for CLI commands
- Never sign real transactions during fuzzing
- Fuzz targets must be read-only with respect to program source

## Trident Conventions

- `#[init]` must initialize ALL required accounts
- `#[flow]` blocks must be idempotent (can run in any order)
- `#[after_each_flow]` must check all invariants
- Never use `unwrap()` in invariant checks — use proper error handling
- Coverage targets: 75%+ for PR, 90%+ for release

## Code Quality

- Fuzz targets must compile with `cargo check` before submission
- Include comments mapping checks to invariant IDs
- Use descriptive flow names (not `flow1`, `flow2`)
- Account initialization helpers must handle edge cases (already initialized, rent-exempt, etc.)

## Reporting

- Critical/High findings must include executable PoC
- All findings must map to an attack vector class
- Report must include exact file:line for root cause
- Severity is based on impact, not exploitability
