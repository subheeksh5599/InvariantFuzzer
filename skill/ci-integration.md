# CI Integration

> Continuous invariant verification in CI/CD pipelines  
> Used by: `fuzz-harness-engineer` agent during `/fuzz-ci`

## GitHub Actions Workflow

```yaml
name: Invariant Fuzzing

on:
  pull_request:
    paths:
      - 'programs/**'
      - 'fuzz_target/**'
  schedule:
    - cron: '0 2 * * *'  # Nightly deep fuzz at 2 AM

jobs:
  quick-fuzz:
    name: Quick Fuzz (PR)
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Install Trident
        run: cargo install trident-cli
      - name: Install Surfpool
        run: cargo install surfpool-cli
      - name: Start Surfpool Fork
        run: NO_DNA=1 surfpool start --url mainnet-beta &
      - name: Run Quick Fuzz (10 min)
        run: NO_DNA=1 trident fuzz run vault_state_consistency --time 600
      - name: Check Invariants
        run: |
          if [ -f fuzz_target/violations.json ]; then
            echo "::error::Invariant violations found!"
            cat fuzz_target/violations.json
            exit 1
          fi

  deep-fuzz:
    name: Deep Fuzz (Nightly)
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install tools
        run: |
          cargo install trident-cli
          cargo install surfpool-cli
      - name: Start Fork
        run: NO_DNA=1 surfpool start --url mainnet-beta &
      - name: Run All Campaigns
        run: NO_DNA=1 trident fuzz run all --time 3600
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: fuzz-report
          path: fuzz_target/reports/
```

## Badge Integration

```markdown
[![Invariant Score](https://img.shields.io/badge/invariant_maturity-3%2F5-orange)](https://github.com/user/repo/blob/main/SECURITY.md)
[![Coverage](https://img.shields.io/badge/fuzz_coverage-72%25-yellow)](https://github.com/user/repo/actions)
```

## Alert Configuration

```yaml
# .github/fuzz-alerts.yml
alerts:
  on_violation:
    slack: "#security-alerts"
    discord: "security-bot"
    email: "security@example.com"

  on_coverage_drop:
    threshold: -5%
    slack: "#dev-alerts"
```

## Surfpool in CI

```bash
# Start mainnet-fork for realistic CI testing
surfpool start \
  --url mainnet-beta \
  --slot 280000000 \
  --accounts vault,PDA1,PDA2 \
  --dump-on-error

# Run tests against fork
trident fuzz run --cluster localhost
```
