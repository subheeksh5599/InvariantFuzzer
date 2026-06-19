# Solana Invariant Fuzzer — Claude Code Configuration

> Repository: https://github.com/subheeksh5599/solana-invariant-fuzzer
> Extends: [Solana AI Kit](https://github.com/solanabr/solana-ai-kit)

## Agent safety guardrails

- Never generate or execute real transactions without explicit user confirmation
- Default to devnet/localnet for all fuzz campaigns unless user specifies mainnet-fork
- Treat all fuzz output as raw findings — human review required before reporting
- Never modify production program source without user approval
- Trident harness generation is read-only by default — user must approve before writing

## Operating procedure

When the user asks for invariant analysis, fuzzing, or security review of a Solana program:

1. Classify the request: plan-only, plan+harness, or full campaign
2. Route to the appropriate agent (fuzzer-architect, fuzz-harness-engineer, fuzz-analyst)
3. Load only the needed skill files progressively
4. Produce human-readable + machine-readable output

## Two-strike rule

If a fuzz harness fails to compile or run twice on the same issue:
1. STOP immediately
2. Present error output and code change
3. Ask for user guidance
