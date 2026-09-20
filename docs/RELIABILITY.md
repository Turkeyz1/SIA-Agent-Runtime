# Reliability Model

SIA treats an AI coding agent as a software system whose actions must be checked, not as a chatbot whose final message is automatically trusted.

## Failure classes

Typical failure modes include:

- invalid or incomplete plans
- wrong tool selection
- malformed tool arguments
- successful process exit with incorrect real-world effect
- repeated duplicate actions
- no-progress loops
- stale evidence after later edits
- incomplete deliverables
- premature completion

## Deterministic recovery

When a failure can be identified precisely, SIA prefers normal software logic over another unconstrained LLM retry.

Examples:
- normalize a path format
- add a known missing optional wrapper
- reject an invalid enum
- retry a transient tool failure within a strict bound
- invalidate evidence for a file that changed

SIA should not automatically invent meaning when the user's intent is ambiguous.

## Completion gate

A task can be considered complete only when required checks have passed.

Conceptually:

```text
Requirements satisfied?
Artifacts present?
Validation passed?
Verification current?
No mandatory step unresolved?
Evidence available?

YES -> Complete
NO  -> Repair / Continue / Block
```

## Evidence

Evidence is intended to connect a requirement with a concrete observable result, such as:
- a file exists
- a test passed
- expected content is present
- a command produced the required effect
- a project-wide verifier confirmed consistency

Evidence can become stale and must be invalidated when later actions affect what it proved.

## Bounded repair

Recovery must have limits.

A bounded repair loop should:
1. classify the failure
2. choose an allowed recovery
3. perform the smallest useful change
4. re-run the relevant verification
5. stop after the configured bound if progress is not being made

This protects small models from spending long runs repeating the same ineffective action.

## Telemetry goals

Local reliability telemetry can include:
- task success
- tool-call success
- invalid argument rate
- deterministic repairs
- model retries
- verification failures
- false completion
- no-progress events
- repair count
- context usage
- elapsed time
- model/tool call count
- memory/resource usage

The intended default is local/private telemetry rather than external tracking.
