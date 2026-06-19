# Harness Generation

> Generating Trident fuzz harnesses from invariant plans  
> Used by: `fuzz-harness-engineer` agent during `/fuzz-run`

## Overview

Given an invariant plan (from `/fuzz-plan`), the AI generates:
1. A Trident fuzz specification (`trident-spec.json`)
2. Fuzz test target files (`fuzz_target/*.rs`)
3. Mutation strategy configuration
4. Account initialization helpers

The harness targets each invariant discovered during the planning phase.

## Trident Spec Generation

### Structure

```json
{
  "target_program": "vault",
  "program_id": "Vau1t...abc",
  "targets": [
    {
      "name": "vault_state_consistency",
      "invariants": ["V01", "V04", "V05"],
      "instructions": ["deposit", "withdraw"],
      "strategies": ["account_mutation", "amount_mutation", "sequence_mutation"],
      "time_budget_seconds": 1800,
      "coverage_target": 0.75
    }
  ]
}
```

### Generation Rules

For each invariant in the plan:

1. **Summation invariants** (V01, S01, A01): Generate mutation strategies that vary deposit/withdraw amounts and verify the sum invariant after each sequence.

2. **Access control invariants** (V03, G06, T03): Generate strategies that call privileged instructions with every possible signer permutation.

3. **Boolean guard invariants** (V07, TR02): Generate strategies that attempt state-modifying operations while guards are active.

4. **Economic invariants** (A03, L07, D07): Generate strategies with boundary economic parameters.

## Trident Fuzz Target Template

```rust
use trident_fuzz::*;
use vault::*;

#[init]
fn start(&mut self) {
    // Initialize vault + user deposit accounts
    let vault_account = VaultAccount::init(&mut self.trident, &mut self.fuzz_accounts);
    let user = UserAccount::init(&mut self.trident, &mut self.fuzz_accounts);

    // Set initial state
    DepositTransaction::build(&mut self.trident, &mut self.fuzz_accounts, &user, 1000);
    self.trident.execute_transaction(&mut tx, Some("Initial Deposit"));

    // Record baseline for invariants
    self.check_all_invariants();
}

#[flow]
fn deposit_flow(&mut self) {
    let amount = self.trident.fuzz_amount(1, u64::MAX);
    let mut tx = DepositTransaction::build(&mut self.trident, &mut self.fuzz_accounts, amount);
    self.trident.execute_transaction(&mut tx, Some("Fuzz Deposit"));
}

#[flow]
fn withdraw_flow(&mut self) {
    let amount = self.trident.fuzz_amount(1, u64::MAX);
    let mut tx = WithdrawTransaction::build(&mut self.trident, &mut self.fuzz_accounts, amount);
    self.trident.execute_transaction(&mut tx, Some("Fuzz Withdraw"));
}

#[after_each_flow]
fn after_each(&mut self, flow_id: &str, flow_result: &str) {
    // Check invariants after every flow
    self.check_invariant_v01(); // total_deposits == sum(user deposits)
    self.check_invariant_v04(); // deposit increases total correctly
    self.check_invariant_v05(); // withdraw decreases total correctly
}

#[end]
fn end(&mut self) {
    // Final invariant checks
    // Generate coverage report
    self.write_coverage_report();
}
```

## Mutation Strategies

### 1. Account State Mutation
- Randomize deposit amounts in user accounts
- Randomize vault configuration (locked/unlocked, authority changes)
- Test with zero, maximum, and boundary values

### 2. Instruction Argument Mutation
- Fuzz deposit amounts: 0, 1, u64::MAX, u64::MAX-1, random
- Fuzz withdraw amounts: exceed balance, exact balance, 1 lamport
- Fuzz authority: wrong keypair, PDA-signed, no signer

### 3. Instruction Sequence Mutation
- Randomize instruction order
- Execute sequences that should be invalid (withdraw before deposit, close before init)
- Race condition sequences (rapid alternating deposit/withdraw)

### 4. CPI Mutation (Cross-Program)
- Replace token program with mock
- Test with both SPL Token and Token-2022
- Test with unverified program IDs

## Surfpool Integration

For campaigns requiring realistic cluster state:

```bash
# Start mainnet fork via surfpool
NO_DNA=1 surfpool start --url mainnet-beta

# Run fuzz campaign against fork
trident fuzz run vault_state_consistency --cluster localhost

# Stop fork
surfpool stop
```

## Output

The harness generation phase produces:
```
fuzz_target/
├── trident-spec.json          # Fuzz campaign specification
├── Cargo.toml                  # Dependencies (trident, program crate)
├── src/
│   ├── lib.rs                  # Fuzz target entry point
│   ├── accounts.rs             # Account initialization helpers
│   ├── invariants.rs           # Invariant check implementations
│   └── strategies.rs           # Custom mutation strategies
└── README.md                   # How to run this campaign
```
