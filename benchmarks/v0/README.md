# Public Reliability Benchmark v0

This directory contains a small, public-safe benchmark format for evaluating agent-runtime reliability without publishing the proprietary SIA implementation.

## What this is

The benchmark defines a fixed set of generic reliability cases and a dependency-free scorer. It is intended to compare:

1. a baseline/basic agent loop, and
2. the same model under another runtime configuration, such as SIA,

while keeping the **model, hardware, task set, and evaluation conditions unchanged**.

The public repository does **not** include SIA's production orchestration code, private prompts, internal policies, private test corpus, or proprietary runtime adapters.

## Files

- `cases.json` — fixed public-safe reliability case definitions
- `result.schema.json` — JSON Schema for recorded benchmark results
- `score.mjs` — dependency-free scorer and comparability checks

## Metrics

The v0 format records:

- end-to-end task success
- tool-call success
- invalid argument count
- repair count
- verification failure count
- false completion count
- elapsed time

The scorer intentionally does not collapse these into a single "SIA score". Reliability tradeoffs should remain visible.

## Fair-comparison rule

A direct comparison is valid only when both result files use the same:

- model
- hardware
- task set
- case IDs

The scorer rejects comparisons that violate these minimum conditions.

Other runtime conditions should also be kept as stable as practical and documented in `environment.notes`.

## Result format

Each run should produce a JSON document matching `result.schema.json`.

Skeleton shape (not schema-valid until measured case records are added):

```json
{
  "benchmarkVersion": "0.1",
  "label": "baseline",
  "environment": {
    "model": "same-model-for-both-runs",
    "hardware": "same-machine-for-both-runs",
    "taskSet": "benchmarks/v0/cases.json",
    "runtime": "basic-agent-loop",
    "notes": "Controlled local run"
  },
  "cases": []
}
```

Populate `cases` with measured observations before scoring. Do not publish placeholder values as benchmark results.

## Scoring

Score one run:

```bash
node benchmarks/v0/score.mjs baseline.json
```

Compare two compatible runs:

```bash
node benchmarks/v0/score.mjs baseline.json sia.json
```

## Publication policy

No comparative SIA numbers should be published until they come from an actual controlled run. Example or synthetic values must be labeled as such and must not be presented as evidence of production performance.

This benchmark is intentionally small. The goal of v0 is reproducibility and honest measurement before broader coverage.
