# Invariant Templates Catalog

> 16 protocol categories · 130+ pre-built invariants  
> AI loads relevant sections based on program type detected during `/fuzz-plan`

## Usage

When the `fuzzer-architect` agent analyzes a program:
1. Identify the program type (vault, AMM, lending, etc.)
2. Load the matching template section below
3. Cross-reference with [invariant-extraction.md](invariant-extraction.md) extraction patterns
4. Output tailored invariants with confidence scores

Each invariant includes:
- **Severity**: Critical / High / Medium / Low
- **Confidence**: Whether the invariant is always applicable to this program type
- **Extraction hint**: What code patterns to look for
- **Maturity level**: Minimum IMM level for this invariant class

---

## 1. Vault / Deposit

> Minimum maturity: Level 2  
> Programs that hold user funds: staking pools, yield aggregators, escrow vaults

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| V01 | `vault.total_deposits == sum(all UserDeposit.amount)` | Critical | HIGH |
| V02 | `user_deposit.amount >= withdraw_amount` (over-withdraw prevention) | Critical | HIGH |
| V03 | `withdraw()` authorization: signer == `vault.authority` or `user.authority` | Critical | HIGH |
| V04 | `deposit()` increases `vault.total_deposits` by exactly `deposit_amount` | High | HIGH |
| V05 | `withdraw()` decreases `vault.total_deposits` by exactly `withdraw_amount` | High | HIGH |
| V06 | Token account balance changes match vault state changes | High | MEDIUM |
| V07 | `vault.locked == true` → all state-modifying instructions must fail | High | HIGH |
| V08 | `vault.bump == canonical PDA bump` (no forged PDA) | Medium | HIGH |
| V09 | Rounding: deposit splits never lose lamports (ceiling for protocol, floor for user) | Medium | HIGH |
| V10 | Emergency pause cannot be bypassed by re-initialization | Critical | MEDIUM |

**Extraction hints:** Look for `total_` fields, `has_one = authority`, `locked: bool`, init/withdraw/deposit instruction structs.

---

## 2. AMM / Constant Product

> Minimum maturity: Level 3  
> Programs implementing x·y = k or similar invariant curves

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| A01 | `pool.reserve_a * pool.reserve_b >= k_last` (k never decreases) | Critical | HIGH |
| A02 | `(reserve_a + amount_in) * (reserve_b - amount_out) >= reserve_a * reserve_b` (post-swap) | Critical | HIGH |
| A03 | Swap output amount < input amount * (reserve_out / reserve_in) [fees make it ≤] | High | HIGH |
| A04 | LP token supply changes proportionally to liquidity changes | High | HIGH |
| A05 | `add_liquidity` ratio must match pool ratio | High | HIGH |
| A06 | `remove_liquidity` returns proportional share of both reserves | High | HIGH |
| A07 | Fee accumulates to correct account (LP or protocol treasury) | High | MEDIUM |
| A08 | Flash swap: borrowed + fee returned within single transaction | Critical | HIGH |
| A09 | `k` after swap >= `k` before swap (fees always increase or preserve k) | Critical | HIGH |
| A10 | Price manipulation in single tx bounded by pool size | High | MEDIUM |

**Extraction hints:** Look for `reserve_a`, `reserve_b`, `k`, `fee_numerator`/`fee_denominator`, swap/add_liquidity/remove_liquidity functions.

---

## 3. Lending / Borrowing

> Minimum maturity: Level 3  
> Programs that allow borrowing against collateral

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| L01 | `collateral_value * ltv >= borrowed_value` (over-collateralization) | Critical | HIGH |
| L02 | Liquidation repays debt and transfers collateral (not vice versa) | Critical | HIGH |
| L03 | `borrow_amount <= available_liquidity` in the reserve | High | HIGH |
| L04 | Interest accrual is monotonic (never decreases) | High | HIGH |
| L05 | `repay()` reduces debt by exactly the repayment amount | High | HIGH |
| L06 | Health factor changes predictably with price movements | High | MEDIUM |
| L07 | Liquidation bonus does not exceed collateral value | High | MEDIUM |
| L08 | Oracle price staleness is enforced (max age check) | Critical | HIGH |
| L09 | Cannot liquidate healthy positions (health_factor > 1) | High | HIGH |
| L10 | Reserve utilization rate stays within [0, 1] | Medium | HIGH |

**Extraction hints:** Look for `collateral`, `borrow`, `ltv`/`loan_to_value`, `health_factor`, `liquidation_threshold`, oracle price feeds.

---

## 4. Staking / Yield

> Minimum maturity: Level 3  
> Programs for staking tokens and earning yield

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| S01 | `total_staked == sum(all UserStake.amount)` | Critical | HIGH |
| S02 | Rewards are proportional to `user_stake * time_staked` | High | HIGH |
| S03 | Unstaking has mandatory delay (cannot skip cooldown) | High | HIGH |
| S04 | `unstake()` returns exactly the staked amount + accrued rewards | High | HIGH |
| S05 | Reward rate resets correctly after claim (no double-claim) | Critical | MEDIUM |
| S06 | Total rewards distributed <= reward pool balance | High | HIGH |
| S07 | Staking token balance updates atomically with stake record | High | MEDIUM |
| S08 | Early unstaking penalty (if exists) is applied consistently | Medium | MEDIUM |
| S09 | Cannot stake or unstake 0 amount | Medium | HIGH |
| S10 | Staking/unstaking events are deterministic based on on-chain state only | Medium | HIGH |

**Extraction hints:** Look for `stake`, `unstake`, `reward`, `cooldown`/`lockup_period`, time-based calculations.

---

## 5. Governance / DAO

> Minimum maturity: Level 2  
> Programs for proposal creation, voting, and execution

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| G01 | Proposal execution requires >= `quorum` votes (not just majority) | Critical | HIGH |
| G02 | Vote weight exactly matches token balance at snapshot time | Critical | HIGH |
| G03 | Cannot vote twice with same tokens (double-vote protection) | Critical | HIGH |
| G04 | Proposal lifecycle: Draft → Active → Succeeded/Defeated → Executed (valid transitions) | High | HIGH |
| G05 | Expired proposals cannot be executed | High | HIGH |
| G06 | Proposal creator cannot unilaterally execute | High | HIGH |
| G07 | Vote delegation respects delegate authority | Medium | MEDIUM |
| G08 | Execution is one-shot (cannot re-execute succeeded proposals) | Critical | MEDIUM |
| G09 | Timelock between approval and execution is enforced | High | MEDIUM |

**Extraction hints:** Look for `proposal`, `vote`, `quorum`, `threshold`, state machine enums, snapshot logic.

---

## 6. NFT / Metaplex

> Minimum maturity: Level 2  
> Programs for NFT minting, trading, and metadata management

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| N01 | NFT ownership is exclusive (one owner at a time per mint) | Critical | HIGH |
| N02 | Metadata update requires current update authority | High | HIGH |
| N03 | Royalty basis points sum <= 10000 (100%) | Medium | HIGH |
| N04 | Mint supply = 1 for non-fungible tokens (if NFT) | High | MEDIUM |
| N05 | Transfer preserves metadata association | High | HIGH |
| N06 | Collection verification requires collection authority | High | MEDIUM |
| N07 | Cannot mint beyond max supply | High | HIGH |
| N08 | Candy machine: mint proceeds go to correct treasury | High | MEDIUM |

**Extraction hints:** Look for `update_authority`, `royalty_basis_points`, `collection`, `max_supply`, `is_mutable`.

---

## 7. Escrow

> Minimum maturity: Level 2  
> Programs that hold assets pending condition fulfillment

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| E01 | Funds only released when escrow conditions are met | Critical | HIGH |
| E02 | `cancel()` returns full amount to depositor (if before expiry) | High | HIGH |
| E03 | Escrow cannot be claimed twice (double-spend) | Critical | HIGH |
| E04 | Expiry enforcement: cannot claim after expiry without conditions met | High | HIGH |
| E05 | Depositor and beneficiary cannot be swapped after initialization | High | MEDIUM |
| E06 | Escrow amount does not change after initialization | High | HIGH |
| E07 | Only depositor can cancel (unless dispute mechanism exists) | High | MEDIUM |

**Extraction hints:** Look for `depositor`, `beneficiary`, `expiry`, `cancel`, `claim`/`release`, state machine enums.

---

## 8. Bridge / Cross-Chain

> Minimum maturity: Level 4  
> Programs for cross-chain token transfers and message passing

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| B01 | `total_locked_on_source == total_minted_on_destination` (supply conservation) | Critical | HIGH |
| B02 | Message replay protection (nonce uniqueness) | Critical | HIGH |
| B03 | Validator/guardian threshold is enforced | Critical | HIGH |
| B04 | Validator set changes require supermajority | Critical | MEDIUM |
| B05 | Destination chain and token address are verified | Critical | HIGH |
| B06 | Fees deducted from amount, not added to supply | High | MEDIUM |
| B07 | Paused state prevents all bridge operations | High | HIGH |
| B08 | Maximum transfer amount is bounded | High | MEDIUM |

**Extraction hints:** Look for `nonce`, `guardian_set`, `verify_signatures`, `mint`/`burn` pairs, Wormhole/Mayan-style VAA verification.

---

## 9. Token / Token-2022

> Minimum maturity: Level 2  
> Programs implementing token minting, transfers, and Token-2022 extensions

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| T01 | `total_supply_after == total_supply_before + minted - burned` | Critical | HIGH |
| T02 | Transfer: `sender_balance_after == sender_balance_before - amount` AND `receiver_balance_after == receiver_balance_before + amount` | Critical | HIGH |
| T03 | `mint_to` requires mint authority | Critical | HIGH |
| T04 | `burn` reduces total supply by exact burn amount | High | HIGH |
| T05 | Freeze authority can freeze but not seize tokens | High | HIGH |
| T06 | Confidential transfers: encrypted amounts sum correctly | Critical | MEDIUM |
| T07 | Transfer fee: recipient receives `amount - fee`, fee goes to withdraw authority | High | HIGH |
| T08 | Transfer hook executes atomically with transfer | High | MEDIUM |
| T09 | Permanent delegate cannot exceed transfer amount | High | MEDIUM |
| T10 | Close account returns lamports to correct destination | Medium | HIGH |

**Extraction hints:** Look for token program CPI calls, `mint_to`, `burn`, `transfer`, Token-2022 extension handling.

---

## 10. CLMM / Concentrated Liquidity

> Minimum maturity: Level 3  
> Programs for concentrated liquidity market making (Orca Whirlpools, Raydium CLMM, Meteora DLMM)

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| C01 | Position liquidity is bounded by `[lower_tick, upper_tick]` (out of range = earns 0) | Critical | HIGH |
| C02 | `sqrt_price` stays within valid tick range | Critical | HIGH |
| C03 | Fee growth tracking is monotonic per tick | High | HIGH |
| C04 | Opening a position does not alter pool price | High | HIGH |
| C05 | Removing liquidity returns correct token amounts at current price | High | HIGH |
| C06 | `collect_fees` returns exactly the accrued but unclaimed fees | High | HIGH |
| C07 | Tick crossing updates fee growth correctly | High | MEDIUM |
| C08 | Position cannot be closed with unclaimed fees (fees lost) | Medium | HIGH |
| C09 | Swap fee is bounded (0 <= fee_rate <= max_fee_rate) | High | HIGH |

**Extraction hints:** Look for `tick`, `sqrt_price`, `liquidity`, `fee_growth`, `lower_tick`/`upper_tick`, `position`.

---

## 11. Multisig

> Minimum maturity: Level 2  
> Programs for multi-signature transaction approval

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| M01 | Execution requires >= `threshold` unique signers | Critical | HIGH |
| M02 | Cannot execute without reaching threshold | Critical | HIGH |
| M03 | Cannot execute same transaction twice (nonce/sequence) | Critical | HIGH |
| M04 | Signer cannot be duplicated in approval list | High | HIGH |
| M05 | Only configured signers can approve | High | HIGH |
| M06 | Owner set changes require >= threshold approvals | Critical | HIGH |
| M07 | Threshold cannot exceed number of owners | Medium | HIGH |
| M08 | Transaction expiry is enforced | Medium | MEDIUM |

**Extraction hints:** Look for `owners`, `threshold`, `signers`, `sequence`/`nonce`, Squads/serum-multisig patterns.

---

## 12. Derivatives / Perps

> Minimum maturity: Level 3  
> Programs for perpetual futures and derivatives trading

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| D01 | `collateral_value >= margin_requirement` for open positions | Critical | HIGH |
| D02 | Funding rate payments net to zero (long pays short or vice versa) | High | HIGH |
| D03 | PnL settlement does not create/destroy tokens (transfers between traders) | High | HIGH |
| D04 | Liquidation: position closed, remaining collateral returned | Critical | HIGH |
| D05 | Cannot open position with 0 collateral | Medium | HIGH |
| D06 | Oracle price update frequency exceeds position monitoring frequency | High | MEDIUM |
| D07 | Maximum position size is bounded by pool capacity | High | MEDIUM |
| D08 | Insurance fund covers shortfall, not excess profit | High | MEDIUM |
| D09 | Open interest matches sum of all position sizes | Critical | HIGH |

**Extraction hints:** Look for `position`, `collateral`, `margin`, `funding_rate`, `liquidation_price`, oracle feeds.

---

## 13. Oracle

> Minimum maturity: Level 3  
> Programs for price feeds and data oracles

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| O01 | Price staleness is bounded (max age enforced) | Critical | HIGH |
| O02 | Confidence interval is within acceptable bounds | High | HIGH |
| O03 | Publisher is authorized (verified oracle set) | Critical | HIGH |
| O04 | Aggregate price is median of publisher prices (outlier-resistant) | High | MEDIUM |
| O05 | Price cannot be negative or zero | Critical | HIGH |
| O06 | Number of publishers submitting >= minimum threshold | High | MEDIUM |

**Extraction hints:** Look for `price`, `confidence`, `publisher`, `staleness`/`max_age`, `ema`, `exponent`.

---

## 14. Auction / Marketplace

> Minimum maturity: Level 2  
> Programs for on-chain auctions and marketplaces

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| AU01 | Highest bid wins (bid ranking integrity) | Critical | HIGH |
| AU02 | Outbid refunds previous highest bidder | Critical | HIGH |
| AU03 | Auction cannot be claimed before end time | High | HIGH |
| AU04 | Bid amounts are non-decreasing | Medium | HIGH |
| AU05 | Seller receives payment, buyer receives asset (atomically) | Critical | HIGH |
| AU06 | Platform fee is bounded and correctly deducted | High | MEDIUM |
| AU07 | Cancelled auction returns item to seller | High | MEDIUM |

**Extraction hints:** Look for `bid`, `highest_bidder`, `end_time`, `claim`, `cancel`, auction state enums.

---

## 15. Treasury / Fund Management

> Minimum maturity: Level 3  
> Programs for protocol treasuries and fund management

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| TR01 | Treasury outflow requires governance approval (timelock + vote) | Critical | HIGH |
| TR02 | Treasury balance == sum of tracked assets (token accounts + SOL) | High | HIGH |
| TR03 | Spending limits per period are enforced | High | MEDIUM |
| TR04 | Beneficiary address is validated (not zero, not arbitrary program) | High | MEDIUM |
| TR05 | Streaming payments: total streamed <= total allocated | High | MEDIUM |
| TR06 | Multisig on treasury operations (not single authority) | Critical | HIGH |

**Extraction hints:** Look for `treasury`, `governance`, `spending_limit`, `streaming`, `allocation`.

---

## 16. Name Service / Registry

> Minimum maturity: Level 1  
> Programs for on-chain naming and registries

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| NS01 | Name ownership is exclusive (one owner per name) | High | HIGH |
| NS02 | Name transfer requires current owner's signature | High | HIGH |
| NS03 | Name registration cost is paid to correct fee account | Medium | HIGH |
| NS04 | Name cannot be registered twice | Medium | MEDIUM |
| NS05 | Subdomain management requires parent domain owner | High | MEDIUM |
| NS06 | Name expiry (if applicable) prevents resolution after expiry | High | MEDIUM |

**Extraction hints:** Look for `name`, `owner`, `parent`, `subdomain`, `registrar`, SNS patterns.

---

## Universal Invariants (All Programs)

These apply to every Solana program regardless of type:

| # | Invariant | Severity | Confidence |
|---|-----------|----------|------------|
| U01 | No arithmetic overflow/underflow in any instruction | Critical | HIGH |
| U02 | No unauthorized SOL withdrawal from program-owned accounts | Critical | HIGH |
| U03 | No CPI to arbitrary programs (target program must be verified) | Critical | HIGH |
| U04 | All accounts are validated: owner, discriminator, writable flag | Critical | HIGH |
| U05 | Reinitialization attack prevented (cannot re-init an existing account) | Critical | HIGH |
| U06 | PDA seeds include expected fields (no PDA collision) | Critical | HIGH |
| U07 | Signer checks on all lamport-moving operations | Critical | HIGH |
| U08 | Account closing returns lamports to correct destination | High | HIGH |
| U09 | Compute budget is bounded (no infinite loops) | Medium | MEDIUM |
| U10 | Instruction discriminator is validated (8-byte check) | High | HIGH |
| U11 | Bump seed is stored in account (canonical bump verification) | Medium | HIGH |
| U12 | Closing an account zeroes its data before transferring lamports | High | MEDIUM |
| U13 | Rent exemption is maintained for all allocated accounts | Medium | MEDIUM |
| U14 | Sysvar accounts are validated (correct address, not spoofed) | High | HIGH |

---

## How the AI Uses This Catalog

1. **During `/fuzz-plan`**: The `fuzzer-architect` identifies the program type from source analysis, loads the matching template section, and outputs all HIGH-confidence invariants plus MEDIUM-confidence invariants for review.

2. **Confidence logic**:
   - `HIGH` = This invariant is mathematically required for this program type. If violated, a bug exists.
   - `MEDIUM` = This invariant is a strong recommendation. Violation may indicate a design flaw.
   - `LOW` = Contextual. The AI must analyze code to determine applicability.

3. **Customization**: The AI always supplements template invariants with invariants extracted from the specific program source (see [invariant-extraction.md](invariant-extraction.md)).

4. **Maturity mapping**: Invariants are tagged with their minimum IMM level. The `/fuzz-plan` output only includes invariants at or below the target maturity level by default.
