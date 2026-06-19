# Invariant Extraction Patterns

> 22 code patterns the AI uses to automatically extract invariants from Solana programs  
> Used by: `fuzzer-architect` agent during `/fuzz-plan`

## How Extraction Works

When the AI reads a Solana program source, it scans for these patterns. Each pattern maps a code structure to one or more invariants the program should maintain.

Extraction operates at three levels:
1. **Structural** — account struct fields and relationships
2. **Constraint-based** — Anchor `#[account(...)]` macros
3. **Instruction logic** — imperative code within instruction handlers

Confidence scoring:
- `HIGH` = Invariant is directly derivable from the code pattern
- `MEDIUM` = Invariant is strongly suggested but requires semantic understanding
- `LOW` = Invariant is speculative, needs human confirmation

---

## Structural Patterns (Account Layout Analysis)

### P1: Summation Field Pattern

```rust
#[account]
pub struct Vault {
    pub total_deposits: u64,  // ← SUM FIELD
}

#[account]
pub struct UserDeposit {
    pub amount: u64,         // ← CONSTITUENT FIELD
}
```

**Extracted invariant:** `vault.total_deposits == sum(all UserDeposit.amount)`  
**Confidence:** HIGH (the naming strongly implies this relationship)  
**Check:** Verify that `total_deposits` is updated in `deposit()` and `withdraw()` instructions.

### P2: Counter-to-Collection Pattern

```rust
#[account]
pub struct Registry {
    pub entry_count: u64,    // ← COUNTER
}

#[account]
pub struct Entry {
    // individual entries
}
```

**Extracted invariant:** `registry.entry_count == count(all Entry accounts owned by program)`  
**Confidence:** HIGH

### P3: Sibling Account Relationship

```rust
#[account]
pub struct Pool {
    pub token_a_vault: Pubkey,  // ← REFERENCES sibling account
    pub token_b_vault: Pubkey,
}
```

**Extracted invariant:** `pool.token_a_vault` and `pool.token_b_vault` are valid token accounts owned by the program.  
**Confidence:** MEDIUM (the invariant is structural, data validity depends on initialization)

### P4: Authority Field Pattern

```rust
#[account]
pub struct Config {
    pub authority: Pubkey,   // ← AUTHORITY FIELD
}
```

**Extracted invariant:** State-modifying instructions require `signer == config.authority`  
**Confidence:** HIGH (standard pattern)

### P5: Boolean Guard Pattern

```rust
#[account]
pub struct State {
    pub locked: bool,         // ← GUARD FLAG
    pub paused: bool,         // ← GUARD FLAG
}
```

**Extracted invariant:** `locked == true` → all state-modifying instructions must fail; `paused == true` → all user-facing instructions must fail.  
**Confidence:** HIGH

### P6: Timestamp Guard Pattern

```rust
#[account]
pub struct Auction {
    pub end_time: i64,       // ← TIME GUARD
}
```

**Extracted invariant:** `current_time > end_time` → auction operations blocked (or claim enabled)  
**Confidence:** HIGH

### P7: Supply Tracking Pattern

```rust
#[account]
pub struct MintConfig {
    pub total_supply: u64,   // ← SUPPLY TRACKER
}
```

**Extracted invariant:**
- `total_supply_after == total_supply_before + amount` (for mint)
- `total_supply_after == total_supply_before - amount` (for burn)
**Confidence:** HIGH

---

## Constraint-Based Patterns (Anchor Macros)

### P8: Ownership Constraint (`has_one`)

```rust
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(has_one = authority)]  // ← ACCESS CONTROL
    pub vault: Account<'info, Vault>,
    pub authority: Signer<'info>,
}
```

**Extracted invariant:** `withdraw()` requires `signer.key() == vault.authority`  
**Confidence:** HIGH (Anchor enforces this at runtime, but verify no bypass exists)

### P9: PDA Constraint (`seeds`)

```rust
#[derive(Accounts)]
pub struct Init<'info> {
    #[account(
        init,
        seeds = [b"vault", authority.key().as_ref()],
        bump,
        payer = authority,
    )]
    pub vault: Account<'info, Vault>,
}
```

**Extracted invariant:** 
- `vault` PDA is derived from `[b"vault", authority]` seeds
- No other seeds can produce this PDA
- `vault.bump` == canonical bump
**Confidence:** HIGH

### P10: Token Account Constraint

```rust
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, token::mint = usdc_mint)]  // ← MINT CONSTRAINT
    pub user_token_account: Account<'info, TokenAccount>,
}
```

**Extracted invariant:** `user_token_account.mint == usdc_mint.key()` (enforced by Anchor, but verify in native programs)  
**Confidence:** HIGH

### P11: Close Constraint

```rust
#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, close = destination)]
    pub account: Account<'info, Vault>,
    pub destination: AccountInfo<'info>,
}
```

**Extracted invariant:** Account lamports go to `destination` when closed; account data is zeroed.  
**Confidence:** HIGH

### P12: Reinitialization Guard (`init`)

```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + Vault::LEN)]
    pub vault: Account<'info, Vault>,
}
```

**Extracted invariant:** `vault` can only be initialized once (Anchor's `init` constraint prevents re-initialization).  
**Confidence:** HIGH (verify discriminator check for native programs)

---

## Instruction Logic Patterns

### P13: Arithmetic Operation Without Overflow Check

```rust
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    ctx.accounts.vault.total_deposits += amount;  // ← POTENTIAL OVERFLOW
}
```

**Extracted invariant:** `vault.total_deposits + amount` must not overflow `u64`  
**Confidence:** HIGH (in Rust 1.82+ with debug mode overflow checks, but verify: (1) release mode wrapping, (2) the `+=` is checked or unchecked)

### P14: Division Without Rounding Consideration

```rust
let user_share = (user_deposit * total_rewards) / vault.total_deposits;
```

**Extracted invariant:** Rounding direction must be explicit and correct: `user_share * vault.total_deposits <= user_deposit * total_rewards` (floor)  
**Confidence:** HIGH (universal for any division in financial code)

### P15: Transfer Without Balance Check

```rust
// BUG PRONE: Does not verify sufficient balance
ctx.accounts.user_token_account.amount -= withdraw_amount;
```

**Extracted invariant:** `user_token_account.amount >= withdraw_amount` must be validated before subtraction.  
**Confidence:** HIGH

### P16: Authorization Bypass via Missing Check

```rust
pub fn admin_action(ctx: Context<AdminAction>) -> Result<()> {
    // NO CHECK: ctx.accounts.authority.key() == ctx.accounts.config.admin
    // ... modifies state ...
}
```

**Extracted invariant:** `admin_action()` has an access control check.  
**Confidence:** MEDIUM (the function name suggests admin-only, but the AI must verify the check exists)

### P17: State Machine Transition Violation

```rust
pub fn claim(ctx: Context<Claim>) -> Result<()> {
    // Check that escrow is in "Funded" state
    require!(ctx.accounts.escrow.state == EscrowState::Funded);
    ctx.accounts.escrow.state = EscrowState::Claimed;
}
```

**Extracted invariant:** Escrow can only transition `Funded → Claimed` (not `Claimed → Claimed`, not `Cancelled → Claimed`).  
**Confidence:** HIGH (verify all valid state transitions are enumerated)

### P18: PDA Seed Collision Risk

```rust
#[account(
    seeds = [user.key().as_ref()],  // ← COLLISION RISK if used by multiple program types
    bump,
)]
pub struct UserState;
```

**Extracted invariant:** PDA seeds must uniquely identify the account type (e.g., include a domain prefix like `b"user_state"`).  
**Confidence:** MEDIUM (seed collision requires another program using same seeds)

### P19: CPI Target Not Verified

```rust
let cpi_ctx = CpiContext::new(
    ctx.accounts.token_program.to_account_info(),  // ← IS THIS THE REAL TOKEN PROGRAM?
    token::Transfer { ... }
);
```

**Extracted invariant:** CPI target address must be verified against known program IDs.  
**Confidence:** HIGH (for token program, verify `token_program.key() == spl_token::ID` or `spl_token_2022::ID`)

### P20: Account Close Without Data Zeroing

```rust
pub fn close(ctx: Context<Close>) -> Result<()> {
    let dest = ctx.accounts.destination.to_account_info();
    let acct = ctx.accounts.account.to_account_info();
    **dest.lamports.borrow_mut() += acct.lamports();
    **acct.lamports.borrow_mut() = 0;
    // MISSING: zero out account data before closing
}
```

**Extracted invariant:** Account data must be zeroed before closing to prevent data resurrection attacks.  
**Confidence:** HIGH

### P21: Missing Rent Exemption Check

```rust
pub fn create_account(ctx: Context<Create>) -> Result<()> {
    // Account created without verifying rent-exempt lamports
}
```

**Extracted invariant:** All created accounts must be rent-exempt.  
**Confidence:** MEDIUM (Anchor's `init` handles this automatically)

### P22: Fee Calculation Not Monotonic

```rust
let fee = amount * fee_bps / 10000;
```

**Extracted invariant:** `fee(amount_a + amount_b) >= fee(amount_a) + fee(amount_b)` (fees should not decrease with larger amounts, unless tiered).  
**Confidence:** MEDIUM (depends on business logic)

---

## Extraction Workflow

When `fuzzer-architect` runs `/fuzz-plan`:

1. **Load the program source** (Anchor IDL + Rust source)
2. **Scan structural patterns** (P1-P7) across all `#[account]` structs
3. **Scan constraint patterns** (P8-P12) across all `#[derive(Accounts)]` structs
4. **Scan instruction logic** (P13-P22) across all `pub fn` handlers
5. **Cross-reference with templates** from [invariant-templates.md](invariant-templates.md)
6. **Assign confidence** based on pattern match strength
7. **Output** human-readable plan + machine-readable JSON

### Priority Order

Patterns are scanned in order of severity impact:
- **First pass**: Summation fields (P1), authority fields (P4), boolean guards (P5) — highest confidence
- **Second pass**: Arithmetic (P13), division (P14), balance checks (P15) — potential Critical/High bugs
- **Third pass**: State machines (P17), CPI verification (P19), close safety (P20) — medium confidence
- **Fourth pass**: Seed collisions (P18), fee monotonicity (P22) — contextual, lower confidence

### False Positive Mitigation

Patterns that produce HIGH confidence but might not apply:
- P1 (summation field): Verify both accounts exist in the same program
- P5 (boolean guard): Verify the bool is actually checked in every instruction
- P13 (overflow): Verify Rust edition (pre-1.82 release mode wraps silently)

The AI always includes a **confidence rationale** in the output so a human reviewer can judge.
