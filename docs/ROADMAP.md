# SIA Roadmap

This roadmap describes the engineering direction of the project. Ordering may change as testing reveals new failure modes.

## Stage A — Deterministic Planning

Status: **Implemented**

Focus:
- planning controller
- requirement extraction
- artifact manifest
- plan validation gate
- duplicate/no-progress protection

## Stage B — Verification & Repair

Status: **Implemented / being hardened**

Focus:
- project-wide verification
- validation controller
- self-review
- bounded repair
- stale-evidence invalidation
- completion gate

## Stage C — Reliable Tool Intelligence

Status: **In progress**

Focus:
- unified tool registry
- capability-based tool discovery
- intent-to-tool resolution
- schema validation
- deterministic argument repair
- permissions
- result validation
- recovery taxonomy
- reliability telemetry

## Stage D — MCP Integration

Status: **Planned**

Focus:
- MCP discovery
- MCP-to-SIA adapter
- stable tool IDs
- trust and scope controls
- approvals
- timeouts
- output limits

## Stage E — Context Intelligence

Status: **Planned**

Focus:
- context router
- budget management
- compaction
- large-output handling
- persistent agent state

## Stage F — Skills

Status: **Planned**

Focus:
- reusable workflows
- skill metadata
- capability routing
- verified documentation-to-skill experiments

## Stage G — Controlled Workers

Status: **Later stage**

Focus:
- controller-owned workers
- narrow task scopes
- sequential operation on limited hardware
- independent verification

## Stage H — Model Routing

Status: **Later stage**

Focus:
- optional model routing
- preserve single-model mode
- choose models by capability and resource budget

## Benchmark track

A benchmark harness will compare the same model with and without SIA under the same environment.

Planned measurements:
- end-to-end task success
- tool-call success
- invalid arguments
- repair frequency
- verification failures
- false completion
- elapsed time
- resource usage
