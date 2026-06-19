# PoC Generation

> From violation trace → executable proof of concept  
> Used by: `fuzz-analyst` agent during `/fuzz-report`

## Overview

When a fuzz campaign discovers an invariant violation, the AI triages it:
1. False positive? → Skip
2. Known limitation? → Document
3. Real vulnerability? → Generate PoC

A PoC consists of:
- A standalone Rust test that reproduces the violation
- The exact transaction sequence that triggers it
- A human-readable explanation of the root cause
- Severity classification aligned with the attack vector catalog

## PoC Template

### Anchor Test Format

```rust
#[tokio::test]
async fn test_poc_vault_overwithdraw() {
    // ── SETUP ──────────────────────────────────────
    let mut context = surfpool::start().await;
    let user = Keypair::new();
    let attacker = Keypair::new();

    // Fund accounts
    context.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).await.unwrap();
    context.airdrop(&attacker.pubkey(), 10 * LAMPORTS_PER_SOL).await.unwrap();

    // Create vault + deposit
    let vault = initialize_vault(&context, &user).await;
    deposit(&context, &vault, &user, 1_000_000).await; // 0.001 SOL

    // ── VIOLATION ─────────────────────────────────
    // BUG: Withdraw does not check user.deposited >= amount
    // Attacker withdraws more than deposited
    let result = withdraw(&context, &vault, &attacker, 5_000_000).await;

    // ── ASSERTION ─────────────────────────────────
    // The invariant says: user_deposited >= withdraw_amount
    // This should fail but currently succeeds
    assert!(result.is_ok(), "EXPECTED: Withdraw should fail (overflow)");
    // ACTUAL: Withdraw succeeds due to missing balance check

    // Verify state corruption
    let vault_state = get_vault(&context, &vault).await;
    let user_state = get_user_deposit(&context, &vault, &attacker.pubkey()).await;

    println!("=== INVARIANT VIOLATION ===");
    println!("Vault total_deposits: {}", vault_state.total_deposits);
    println!("User deposited: {}", user_state.amount);
    println!("Invariant: user.deposited >= withdraw_amount");
    println!("Result: user.deposited underflowed — invariant broken");
}
```

### Standalone Rust Format

```rust
/// PoC: Vault over-withdraw vulnerability
/// Program: vault::withdraw
/// Invariant violated: V03 — user_deposited >= withdraw_amount
/// Root cause: Missing check `require!(user_deposit.amount >= amount)` in withdraw()
/// Severity: CRITICAL — allows draining vault of all user deposits

fn main() {
    let program_id = Pubkey::from_str("Vau1t...abc").unwrap();
    // ... setup + exploit + verification ...
}
```

## Triage Decision Tree

```
Violation found
    │
    ├─ Is the invariant correctly specified?
    │   ├─ No → Fix invariant spec, re-run
    │   └─ Yes → Continue
    │
    ├─ Is this a known limitation / design choice?
    │   ├─ Yes → Document as INFO finding
    │   └─ No → Continue
    │
    ├─ Is the violation reproducible?
    │   ├─ No → Mark as false positive, improve mutation strategy
    │   └─ Yes → Continue
    │
    ├─ Can value be extracted?
    │   ├─ Yes → CRITICAL or HIGH severity
    │   └─ No → MEDIUM or LOW severity
    │
    └─ Generate PoC + report finding
```

## Severity Classification

| Severity | Criteria | Example |
|----------|----------|---------|
| **Critical** | Direct loss of funds, infinite mint, complete drain | Accounting desync allows draining vault |
| **High** | Bypass access controls, freeze funds, extract value | Unauthorized admin instruction execution |
| **Medium** | Denial of service, incorrect fee calculation | Compute budget exhaustion bricks instruction |
| **Low** | Minor invariant violation, information leak | Rounding error of 1 lamport |
| **Info** | Best practice violation, no direct impact | Missing N/A on close account |

## Report Output

Each finding in `/fuzz-report` includes:

```markdown
## Finding #1: Accounting Desync in Vault Withdraw

**Severity:** CRITICAL
**Invariant violated:** V03 — user_deposited >= withdraw_amount
**Attack vector class:** Accounting Desync
**Root cause:** `withdraw()` function at `programs/vault/src/lib.rs:145` does not
check that `user_deposit.amount >= amount` before subtracting

**Impact:** An attacker can withdraw more than deposited, draining the vault of
funds deposited by other users. The `vault.total_deposits` counter becomes
permanently inconsistent with the sum of user deposits.

**PoC:** See `poc_vault_overwithdraw.rs` — 45 lines, runs in < 1 second
**Fix:** Add `require!(user_deposit.amount >= amount, ErrorCode::InsufficientFunds)`
before the subtraction at line 145

**Real-world reference:** Similar to Cashio hack (2022) where infinite mint was
possible due to accounting desync
```
