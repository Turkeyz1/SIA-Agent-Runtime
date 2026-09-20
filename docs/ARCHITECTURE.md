# SIA Architecture

## 1. Runtime-first reliability

SIA separates the language model from the reliability mechanisms around it.

The model is used primarily for tasks that benefit from reasoning or language understanding. Deterministic software handles validation, state transitions, permissions, evidence tracking, and other work that does not need to be probabilistic.

## 2. Goal pipeline

```text
User Goal
  -> Requirements
  -> Plan
  -> Context
  -> Tool Intent
  -> Tool Candidate Resolution
  -> Argument Construction
  -> Schema Validation
  -> Permission Gate
  -> Execution
  -> Result Validation
  -> Evidence
  -> Project Verification
  -> Review
  -> Repair or Complete
```

## 3. Planning Controller

The Planning Controller converts the user's goal into explicit requirements and an actionable plan before project-changing operations are allowed.

Responsibilities:
- preserve the original goal
- derive explicit requirements
- map steps to artifacts and expected outcomes
- reject malformed or incomplete plans
- detect repeated no-progress actions

## 4. Artifact and requirement state

SIA keeps task state outside the model so it can be inspected deterministically.

Example conceptual state:

```json
{
  "goal": "...",
  "requirements": [],
  "plan": [],
  "artifacts": [],
  "toolState": {},
  "evidence": [],
  "decisions": [],
  "progress": {}
}
```

This is illustrative only and is not the private production schema.

## 5. Verification Controller

Completion is not based only on the model saying the work is finished.

The verification layer checks whether required artifacts and project-level outcomes exist and whether previous evidence is still valid after later modifications.

Key ideas:
- project-wide verification
- stale-evidence invalidation
- completion gates
- bounded repair
- explicit failure reasons

## 6. Tool Intelligence

The tool layer is designed around a unified registry for native tools, MCP tools, and custom integrations.

A tool record may describe:
- stable ID and name
- purpose and capability tags
- input/output schema
- permissions and risk level
- side effects
- prerequisites
- success criteria
- failure categories
- recovery strategy
- provider

The intended execution flow is:

```text
LLM intent
  -> Resolver
  -> Argument Builder
  -> Schema Validator
  -> Permission Gate
  -> Execute
  -> Result Validator
  -> Evidence
```

SIA should repair only simple deterministic argument problems automatically. Semantic ambiguity, destructive operations, or unsafe requests should not be silently repaired.

## 7. Permission model

Planned risk categories:

| Risk | Example |
|---|---|
| Low | Read/search project files |
| Medium | Write project files, run tests |
| High | Install packages, network calls, deletion |
| Critical | System-level modifications |

The model should not be able to modify the permission policy itself.

## 8. MCP interoperability

MCP support is intended to be an adapter layer rather than a separate execution architecture.

Proposed stable tool identifiers:

```text
mcp:<server-id>:<tool-id>
```

MCP integrations should still pass through SIA's validation, permission, result-checking, evidence, and recovery layers.

## 9. Context intelligence

A later context layer will manage:
- relevant-file selection
- context budgets
- large tool outputs
- compaction
- persistent task state
- evidence retention

The UI should not own agent state.

## 10. Controlled workers

Worker agents are a later-stage capability. On constrained local hardware, SIA favors controlled and often sequential workers over unrestricted parallel agent swarms.

The controller remains responsible for:
- worker scope
- tool permissions
- shared state
- verification
- stopping conditions
