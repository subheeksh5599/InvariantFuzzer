# Known Attack Vectors for Solana Programs

> Maps every major Solana vulnerability class to the invariants that catch it  
> Used by: `fuzzer-architect` to prioritize mutation strategies, `fuzz-analyst` to classify violations

## Attack Vector → Invariant Mapping

Each attack class below shows:
- The invariant(s) that detect it
- The extraction pattern that flags it
- The template invariants that prevent it
- Real-world examples where available

---

## 1. Accounting Desync

**What it is:** State variables lose consistency with each other. Total doesn't match sum of parts. Counters drift from collection sizes.

**Detected by invariants:**
- V01: `vault.total_deposits == sum(all UserDeposit.amount)`
- L01: `total_borrowed <= total_deposited`
- A01: `k` never decreases
- S01: `total_staked == sum(all UserStake.amount)`

**Extraction pattern:** P1 (summation fields), P2 (counter-to-collection)

**Mutation strategy:** Deposit/withdraw in rapid alternating sequences, race conditions, concurrent instructions

**Real examples:** Cashio hack (2022) — infinite mint via unvalidated total supply; multiple Solend incidents

---

## 2. Access Control Bypass

**What it is:** Unauthorized caller executes privileged instructions. Missing or incorrect signer checks.

**Detected by invariants:**
- V03: Only authority can withdraw
- G06: Proposal creator cannot unilaterally execute
- T03: Only mint authority can mint_to
- U03: CPI target must be verified
- U07: Signer checks on all lamport-moving operations

**Extraction pattern:** P4 (authority fields), P8 (has_one), P16 (missing authorization check)

**Mutation strategy:** Call privileged instructions with every possible signer combination, spoof PDAs, cross-program signatures

**Real examples:** Wormhole (2022) — missing signature verification on guardians; Raydium (2022) — owner-only instruction called by anyone

---

## 3. Arithmetic Overflow / Underflow

**What it is:** Integer operations wrap around or panic, causing state corruption or denial of service.

**Detected by invariants:**
- U01: No arithmetic overflow/underflow
- V09: Deposit splits never lose lamports
- T01: Supply conservation on mint/burn

**Extraction pattern:** P13 (arithmetic without overflow check)

**Mutation strategy:** Fuzz with boundary values: 0, 1, u64::MAX, u64::MAX-1, amounts that produce MAX on addition

**Real examples:** Solend (2021) — interest calculation overflow; numerous early Solana programs before Rust overflow checks matured

---

## 4. Rounding Errors

**What it is:** Division truncation consistently benefits attacker (or protocol) in a way that breaks economic invariants.

**Detected by invariants:**
- V09: Rounding direction is explicit and correct
- L08: Interest calculation rounds correctly
- A03: Swap output never exceeds fair price (after fees)
- D03: PnL settlement correct to the lamport

**Extraction pattern:** P14 (division without rounding consideration)

**Mutation strategy:** Fuzz with amounts that produce fractional results: 1, 2, 3, prime numbers, amounts where `amount % divisor != 0`

**Real examples:** Numerous AMM implementations with dust attacks; lending protocols with 1-wei borrow exploits on EVM (concept applies to lamports)

---

## 5. Reinitialization Attack

**What it is:** Attacker re-initializes an already-initialized account, resetting its state or stealing funds.

**Detected by invariants:**
- U05: Account cannot be re-initialized
- V10: Emergency pause cannot be bypassed by re-init

**Extraction pattern:** P12 (reinitialization guard)

**Mutation strategy:** Call init instruction with accounts that already have data, call init twice in same transaction

**Real examples:** Multiple Anchor programs pre-0.29 where discriminator was not auto-checked

---

## 6. PDA Collision / Forging

**What it is:** Two different account types use the same PDA seeds, or an attacker computes a PDA that collides with a program's expected address.

**Detected by invariants:**
- U06: PDA seeds include expected fields — no collision
- V08: vault.bump == canonical bump
- P9: PDA derivation constraints

**Extraction pattern:** P18 (seed collision risk), P9 (PDA constraint analysis)

**Mutation strategy:** Check all PDA seeds across the program; verify uniqueness with domain prefixes; test with different bumps

---

## 7. CPI Bypass / Fake Programs

**What it is:** Program calls into an untrusted program that impersonates the expected target (e.g., fake SPL Token program).

**Detected by invariants:**
- U03: CPI target program must be verified
- B05: Destination chain and token address verified

**Extraction pattern:** P19 (CPI target not verified)

**Mutation strategy:** Replace known program IDs with attacker-controlled programs; verify that the actual program key is checked before CPI

---

## 8. Token Account Substitution

**What it is:** Attacker passes a different token account than expected — wrong mint, wrong owner, wrong amount.

**Detected by invariants:**
- V06: Token account balance changes match vault state changes
- T02: Transfer preserves supply

**Extraction pattern:** P10 (token account constraint), P19 (CPI target)

**Mutation strategy:** Pass token accounts with wrong mint, wrong owner, insufficient balance; verify constraint checks

---

## 9. Close Account / Data Resurrection

**What it is:** Account is closed but data is not zeroed, allowing a new account at the same address to "inherit" the old state.

**Detected by invariants:**
- U12: Close account zeroes data before lamport transfer

**Extraction pattern:** P20 (account close without data zeroing)

**Mutation strategy:** Close account, then immediately initialize a new account at the same PDA; verify old data is not accessible

---

## 10. Signer Seeding / Authority Confusion

**What it is:** Program uses a PDA as a signer but the seeds don't include enough context, allowing an attacker to derive the same PDA in a different context.

**Detected by invariants:**
- U06: PDA seeds include expected fields
- U14: Sysvar accounts validated

**Extraction pattern:** P18 (seed collision risk), P9 (PDA analysis)

**Mutation strategy:** Check all PDA signer seeds for uniqueness; test with different authority/caller combinations

---

## 11. Oracle Manipulation

**What it is:** Attacker manipulates price oracle to trigger unfair liquidations, borrow more than collateral allows, or extract value.

**Detected by invariants:**
- L08: Oracle price staleness enforced
- D06: Oracle update frequency > position monitoring
- O01: Price staleness bounded
- O05: Price cannot be negative or zero

**Mutation strategy:** Fuzz with extreme prices, zero prices, negative prices, stale timestamps

**Real examples:** Mango Markets (2022) — oracle price manipulation leading to $116M exploit

---

## 12. Flash Loan / Single-Tx Manipulation

**What it is:** Attacker executes multiple operations in a single transaction that temporarily break invariants, extracting value before the invariant is restored.

**Detected by invariants:**
- A08: Flash swap borrowed + fee returned within single tx
- L07: Liquidation cannot be called on healthy positions
- D07: Maximum position size bounded

**Mutation strategy:** Generate multi-instruction sequences that temporarily break invariants; check if any value can be extracted

**Real examples:** Crema Finance (2022) — flash loan attack on concentrated liquidity

---

## 13. Instruction Sequence Reordering

**What it is:** Instructions executed in an unexpected order produce incorrect state.

**Detected by invariants:**
- G04: Proposal lifecycle valid transitions
- E04: Expiry enforcement
- U05: Cannot reinitialize

**Mutation strategy:** Reorder instruction sequences; execute instructions out of expected lifecycle order

---

## 14. Compute Budget Exhaustion

**What it is:** Attacker crafts inputs that consume excessive compute units, preventing legitimate users from interacting.

**Detected by invariants:**
- U09: Compute budget bounded — no infinite loops

**Mutation strategy:** Fuzz with maximum-size inputs, accounts with many entries, loop counters at limits

---

## 15. Rent Evasion

**What it is:** Account is made rent-exempt but attacker reduces lamports below rent-exemption threshold, causing data loss.

**Detected by invariants:**
- U13: Rent exemption maintained

**Extraction pattern:** P21 (rent exemption)

**Mutation strategy:** Reduce account lamports; verify rent exemption checks exist

---

## 16. Bump Seed Canonicalization

**What it is:** Program accepts user-provided bump instead of canonical bump, allowing PDA forgery.

**Detected by invariants:**
- V08: vault.bump == canonical bump
- U11: Bump seed stored in account

**Extraction pattern:** P9 (PDA derivation)

**Mutation strategy:** Try every bump (0-255) and verify only the canonical bump produces a valid PDA

---

## How the AI Uses This During Fuzzing

1. **Prioritization**: When generating a Trident harness, the AI prioritizes mutation strategies that target the attack vectors most relevant to the program type.

2. **Classification**: When a fuzz campaign finds a violation, the AI maps the violation to the closest attack vector class for severity classification.

3. **PoC Enrichment**: When generating a PoC, the AI includes the mapped attack vector class and references to real-world examples for context.

4. **Completeness check**: Before concluding a fuzz campaign, the AI checks whether all applicable attack vectors have been exercised.
