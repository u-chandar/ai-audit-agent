# Agent Infrastructure Redesign

This redesign upgrades the prototype into a policy-aware agent core with clear objectives, explicit planning, actionable execution, reflection, self-critique, memory layers, access control, performance monitoring, and transparent user logs.

## Architecture outcomes

- Short-term memory for session context and recent reasoning artifacts
- Long-term memory for reusable facts, decisions, and operating patterns
- Subgoal decomposition tied to objective success criteria
- Plan -> act -> reflect -> self-critique cycle in each run
- Access control gates before objective setting, planning, action, and publishing
- Transparency ledger for user-visible stage summaries and evidence references
- Performance telemetry for counters and stage-level latency

## Core modules

- `agent-core/memory.js`
  - `ShortTermMemory`: bounded context window for active execution
  - `LongTermMemory`: durable facts, patterns, and prior decisions
- `agent-core/security.js`
  - `AccessController`: role-based permissions (admin, auditor, viewer)
  - `TransparencyLedger`: explicit execution summary for users
- `agent-core/metrics.js`
  - `PerformanceMonitor`: counters and stage timing snapshots
- `agent-core/engine.js`
  - `AgentEngine`: objective intake, planning, subgoal decomposition, action, reflection, self-critique
- `agent-core/objectives.example.json`
  - sample objective with constraints and success criteria

## How strategy is applied

1. Objectives are explicit and measurable.
2. Planner decomposes objective into ordered subgoals.
3. Actions execute per subgoal with evidence references.
4. Reflection validates evidence quality and objective alignment.
5. Self-critique identifies weaknesses and corrective actions.
6. Long-term memory stores decisions for future runs.
7. Transparency ledger emits user-facing stage summaries.

## Access controls

Role permissions are enforced before each critical step:

- `objective:set`
- `plan:create`
- `action:execute`
- `memory:read`
- `memory:write`
- `report:view`
- `report:publish`

By default:

- `admin`: full access
- `auditor`: execution access, report view
- `viewer`: read-only transparency and reports

## Performance monitoring

The monitor captures:

- Objective, plan, action, reflection, and self-critique counts
- Stage-level latency (`avgMs`, `maxMs`, and call count)
- Run-level summaries for trend tracking dashboards

## Transparency to users

User-facing output does not expose hidden intermediate thoughts.
It provides:

- stage (`objective`, `plan`, `action`, `reflection`, `self_critique`)
- concise summary
- outcome status
- evidence references
- objective ID for traceability

## Run demo

```powershell
npm run agent:demo
```

This executes a full cycle and prints performance and transparency output.

## Production next steps

- Persist long-term memory and transparency logs to a database
- Add policy versioning and immutable evidence digests
- Add confidence thresholds and human-in-the-loop approval gates
- Connect scanner outputs to real evidence sources and framework evaluators
- Add tenant isolation and fine-grained ABAC for enterprise deployment
