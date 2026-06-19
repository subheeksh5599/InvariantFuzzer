# Invariant Maturity Model

> A 6-level framework for measuring program security maturity through invariant coverage.

## Overview

The Invariant Maturity Model (IMM) scores Solana programs from 0 (no invariants) to 5 (battle-hardened). Every `/fuzz-plan` analysis produces a score with actionable recommendations for reaching the next level.

Scoring is based on:
- **Invariant coverage** — what categories of invariants are defined and verified
- **Fuzz coverage** — percentage of instruction paths exercised by fuzz campaigns
- **CI integration** — whether invariants are checked on every commit

---

## Levels

### Level 0 — Unprotected

| Criterion | Status |
|-----------|--------|
| Defined invariants | None |
| Fuzz coverage | 0% |
| CI integration | None |

**What this means:** The program has no documented invariants. No fuzz campaigns exist. Every audit starts from scratch.

**To reach Level 1:**
- Document access control invariants (who can call each instruction)
- Run a basic `/fuzz-plan` to discover missing invariants
- Create at least one `#[test]` that validates an access control invariant

### Level 1 — Guarded

| Criterion | Status |
|-----------|--------|
| Defined invariants | Access control only |
| Fuzz coverage | < 20% |
| CI integration | Manual execution |

**What this means:** Basic authorization checks are in place. The program can't be called by unauthorized parties, but state consistency and economic soundness are unverified.

**Invariants expected:**
- Only `authority` can call privileged instructions
- PDA derivation is canonical
- Signer checks exist on all state-modifying instructions

**To reach Level 2:**
- Add state consistency invariants (total supply == sum of deposits, etc.)
- Run `/fuzz-plan --depth medium` to discover state invariants
- Create fuzz harness targeting at least 3 state invariants

### Level 2 — Consistent

| Criterion | Status |
|-----------|--------|
| Defined invariants | Access control + state consistency |
| Fuzz coverage | 20-50% |
| CI integration | Manual execution |

**What this means:** The program maintains internal state consistency. Total amounts match constituent parts. Counters agree with collection sizes. State transitions are atomic.

**Invariants expected:**
- Supply conservation (total == sum of parts)
- Counter-to-collection consistency
- State transitions preserve invariants
- No phantom data (orphaned accounts)

**To reach Level 3:**
- Add economic invariants (pricing bounds, fee caps, slippage limits)
- Run `/fuzz-plan --depth deep` with economic parameters
- Model worst-case economic scenarios

### Level 3 — Economically Sound

| Criterion | Status |
|-----------|--------|
| Defined invariants | Access + state + economic |
| Fuzz coverage | 50-75% |
| CI integration | Weekly scheduled campaigns |

**What this means:** The program has been tested against economic attack vectors. Price manipulation, rounding errors, fee extraction, and arbitrage opportunities have been modeled and constrained.

**Invariants expected:**
- Rounding direction is correct (always favors protocol, or always favors user)
- Fee calculations are bounded and monotonic
- Exchange rates have sanity bounds
- Flash-loan-resistant (single-transaction state change bounded)
- Liquidation math preserves collateral ratios

**To reach Level 4:**
- Add cross-program invariants (CPI call chains, token program interactions)
- Test interactions with dependent protocols
- Model multi-program state transitions

### Level 4 — Cross-Program Safe

| Criterion | Status |
|-----------|--------|
| Defined invariants | Access + state + economic + cross-program |
| Fuzz coverage | 75-90% |
| CI integration | Daily scheduled campaigns |

**What this means:** The program has been tested for safe interaction with other programs. CPI arguments are validated. Token account ownership is verified. Reentrancy across program boundaries is prevented.

**Invariants expected:**
- CPI target programs are verified (not arbitrary)
- Token accounts belong to expected mints
- Cross-program state transitions are atomic (via CPI)
- No unauthorized token delegate changes
- Reentrancy protection across CPI boundaries

**To reach Level 5:**
- Achieve >90% fuzz coverage
- Integrate fuzz campaigns into CI on every PR
- Document all invariants with formal specifications
- Maintain a regression corpus of discovered violations

### Level 5 — Battle-Hardened

| Criterion | Status |
|-----------|--------|
| Defined invariants | Comprehensive (all categories) |
| Fuzz coverage | > 90% |
| CI integration | On every commit + PR |

**What this means:** The program has production-grade invariant coverage. Every instruction path is fuzzed. Every invariant is checked on every commit. The invariant specification serves as executable documentation for auditors and contributors.

**Invariants expected:**
- All Level 0-4 invariants plus
- Platform-specific invariants (compute budget bounds, account size limits)
- Upgrade path invariants (state compatibility across versions)
- Formal specification of all invariants in machine-verifiable format

---

## Scoring Output

Every `/fuzz-plan` outputs:

```
┌─────────────────────────────────────────────────────┐
│             INVARIANT MATURITY SCORE                  │
│                                                       │
│   Current: Level 2 — Consistent                       │
│   Target:  Level 3 — Economically Sound               │
│                                                       │
│   Coverage:                                            │
│     Access control:   ■■■■■■■■■■  100%               │
│     State consistency: ■■■■■■■□□□  72%               │
│     Economic:          ■□□□□□□□□□   8%  ← GAP        │
│     Cross-program:     □□□□□□□□□□   0%               │
│                                                       │
│   To reach Level 3:                                   │
│   1. Add rounding direction invariant                 │
│   2. Add fee monotonicity invariant                   │
│   3. Add flash-loan resistance invariant              │
│   4. Run /fuzz-plan --depth deep                      │
└─────────────────────────────────────────────────────┘
```

---

## Integration with Invariant Templates

Each template in [invariant-templates.md](invariant-templates.md) is tagged with its minimum maturity level:

| Template category | Minimum level | Why |
|-------------------|---------------|-----|
| Access control invariants | Level 1 | Fundamental security |
| State consistency invariants | Level 2 | Internal correctness |
| Economic invariants | Level 3 | Financial safety |
| Cross-program invariants | Level 4 | Ecosystem safety |
| Platform invariants | Level 5 | Production hardening |

The `/fuzz-plan` command uses this mapping to determine which templates to suggest based on the program's current maturity score and target level.
