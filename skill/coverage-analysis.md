# Coverage Analysis

> Interpreting fuzz coverage data and discovering blind spots  
> Used by: `fuzzer-architect` and `fuzz-analyst` agents after fuzz campaigns

## Coverage Metrics

After a Trident fuzz campaign runs, the AI analyzes:

| Metric | What it measures | Target |
|--------|-----------------|--------|
| Instruction coverage | % of instruction handlers exercised | > 90% |
| Branch coverage | % of conditional branches inside instructions | > 75% |
| Account state coverage | Variety of account states explored | At least 10 distinct states per account |
| Invariant coverage | % of defined invariants verified | 100% |
| Edge case coverage | Boundary values exercised | All boundary conditions |

## Blind Spot Detection

### Pattern 1: Unexercised Instructions

If `process_withdraw` has 0% coverage:
- Check if the flow exists in the spec
- Check if initialization setup is correct
- Add explicit flow targeting the missing instruction

### Pattern 2: Deep Path Miss

If branch coverage < instruction coverage significantly:
- The fuzzer is hitting instructions but not exploring their internal branches
- Increase sequence length, add explicit branch-targeting mutations

### Pattern 3: Shallow State Exploration

If account state coverage is low:
- The mutation strategies aren't varying account fields enough
- Add field-specific mutators, increase mutation rate

### Pattern 4: Invariant Blind Spots

If an invariant is defined but never checked:
- Verify the invariant check is correctly implemented in the fuzz target
- Verify the instruction sequences can reach the state that triggers the invariant

## Coverage-Driven Campaign Refinement

After each campaign, the AI:

1. **Analyzes coverage gaps**
2. **Proposes refined mutation strategies**
3. **Re-runs the campaign** with tighter targeting
4. **Repeats until** coverage target met or time budget exhausted

## Integration with `/fuzz-plan` & `/fuzz-run`

```
/fuzz-plan → generates invariants + initial strategies
/fuzz-run → runs campaign, produces coverage data
           → loads coverage-analysis.md
           → if coverage < target: refine strategies, re-run
           → if coverage >= target: produce final report
```

## Shell Commands for Coverage Inspection

```bash
# View Trident coverage data
trident fuzz coverage <target_name>

# Generate HTML coverage report
trident fuzz coverage --html <target_name>

# Check which instructions are unexercised
trident fuzz analyze <target_name> --unexercised
```
