# Aegis AI Audit — Technical Architecture Review

**Review date:** 2026-08-07  
**Reviewed scope:** `index.html`, `app.js`, `styles.css`, and `README.md`  
**Current maturity:** Interactive front-end prototype; no executable audit backend

## Executive verdict

The application is correctly structured for demonstrating product flow, but it is not yet structured as a production AI audit platform. The current runtime is one static HTML document, one global JavaScript script, and one stylesheet. All framework scores, agents, findings, architecture results, tool recommendations, and recent audits are static seed data. Starting an audit only animates the pipeline for 2.2 seconds and opens a predefined report.

The prototype has low infrastructure overhead and will scale well as a static demonstration. It has no meaningful audit-compute scalability because no audit work is performed. The safest next step is a **modular monolith plus asynchronous worker pool**, not microservices. This is the best cost/reliability sweet spot until sustained workload exceeds roughly 100 concurrent audits or individual scanner isolation becomes an operational bottleneck.

## What actually exists

| Layer | Current implementation | Status |
|---|---|---|
| UI shell | Five client-side views in `index.html` | Working |
| Navigation | `switchView()` toggles CSS classes | Working |
| Folder intake | Browser file picker counts filenames | Partial; files are not read or analyzed |
| GitHub intake | Changes explanatory text only | Simulated |
| Data-source intake | Changes explanatory text only | Simulated |
| Framework modules | Eight objects in the `frameworks` array | Catalog only |
| Agent modules | Display records in `agentData` and pipeline arrays | Simulated |
| Orchestrator | No implementation | Missing |
| Evaluator | No implementation | Missing |
| Independent verifier | No implementation | Missing |
| Architecture detector | Hard-coded FastAPI/Kafka/PyTorch/Postgres result | Simulated |
| Audit execution | Timers and CSS animation in `#run-audit` handler | Simulated |
| Evidence store | None | Missing |
| Report generation | Static HTML plus `window.print()` | Partial |
| Persistence/auth/tenancy | None | Missing |
| Tests/build/CI/observability | None | Missing |

## Code-structure assessment

### Correctly structured for the prototype

- The UI has a clear information hierarchy: intake, agent visibility, frameworks, findings, and remediation.
- Frameworks, audits, agents, findings, and tools are data-driven arrays rather than repeated hand-written cards.
- Navigation is centralized in `switchView()`.
- Event delegation is used for the primary navigation/source tabs, reducing listener count.
- The application has no runtime package dependencies; cold start and hosting cost are effectively minimal.
- Print styling provides a useful zero-cost report export path.

### Structural weaknesses

1. **Global runtime:** all state, rendering, navigation, and audit simulation live in `app.js`. Any new workflow state increases coupling and regression risk.
2. **Positional arrays:** audits, agents, findings, and tools use numeric indexes (`a[0]`, `f[3]`). Schema changes will silently bind the wrong values. Replace with typed named objects.
3. **Unsafe rendering boundary:** catalog data is inserted through `innerHTML`. It is safe only while data is hard-coded. Repository names, findings, evidence, and connector data would introduce stored/reflected XSS risk.
4. **No domain model:** there are no entities for `Audit`, `Control`, `Evidence`, `Finding`, `Asset`, `DataFlow`, `AgentRun`, or `Verification`.
5. **No state machine:** an audit cannot reliably represent queued, scanning, blocked, awaiting-evidence, evaluating, verifying, canceled, failed, or completed states.
6. **No error/cancellation behavior:** timers cannot fail, retry, resume, time out, or be canceled.
7. **Report disconnect:** the project name selected by the user is shown in the toast but the report remains the hard-coded Claims Intelligence Platform.
8. **Framework selection disconnect:** selected checkboxes do not influence execution or the report.
9. **Source disconnect:** selected folders are not inspected; GitHub and data-source tabs have no inputs or adapters.
10. **Monolithic presentation files:** the stylesheet is effectively one physical line and the HTML contains all five views. This harms review, blame quality, merge conflict rate, and component ownership.

## Dead and misleading components

### Dead controls

The following visible controls have no behavior:

- Continuous-monitoring `Manage`
- Search and notification buttons
- Help and documentation
- Recent-audit search and filter
- Recent-audit rows
- Configure guardrails
- Add custom framework
- Share report
- All findings
- Workspace selector/profile menu

These controls should either be implemented, explicitly marked “coming soon,” or removed from production builds. Non-functional security/compliance controls reduce trust more than an intentionally smaller interface.

### Data components with no runtime use

- `frameworks[].color` is presentation-only.
- Framework control totals are labels; there is no control catalog behind them.
- Readiness scores, evidence coverage, finding counts, and trends are independent hard-coded values and can contradict each other.
- Architecture technologies and remediation recommendations are fixed regardless of input.
- The `audits.map((a,i)` callback declares `i` but never uses it.
- The “8 specialists” label does not match the six animated pipeline stages and six orbit nodes; the agent card catalog contains eight records.

### Application overhead

Current compute overhead is negligible, but maintenance overhead is already visible:

- Every `render()` call rebuilds all dynamic lists with `innerHTML`, even when only one view changes.
- All views exist in the DOM simultaneously, although CSS hides four of them.
- Google Fonts are a third-party availability/privacy dependency and can delay first paint or conflict with strict CSP/privacy requirements.
- Numerous emoji glyphs vary by OS and are not a consistent icon system.
- No content-security policy, integrity pinning, or self-hosted font strategy exists.
- There is no bundling/tree-shaking concern yet; introducing a framework solely to solve this small UI would add more overhead than value.

## Recommended production architecture

```text
Web UI / CLI
    |
API + Auth + Tenant boundary
    |
Audit Orchestrator ---- PostgreSQL (jobs, controls, findings)
    |                   Object store (raw evidence, reports)
    |                   Event log (append-only provenance)
    v
Durable queue
    |
Sandboxed worker pool
    +-- Source discovery and SBOM
    +-- Architecture/data-flow inference
    +-- Security and privacy scanners
    +-- Model/data quality and fairness tests
    +-- Framework policy evaluators
    +-- Independent verifier
    |
Evidence normalizer -> Control graph -> Scoring/evaluation -> Report builder
```

### Program/module boundaries

```text
apps/
  web/                 UI, report viewer, evidence review
  api/                 auth, audit lifecycle, connector APIs
  worker/              sandboxed scanner execution
packages/
  domain/              typed entities and audit state machine
  orchestrator/        DAG planning, retries, cancellation, budgets
  evidence/            hashing, provenance, normalization, retention
  architecture/        stack, model, stream, store, and data-flow detection
  evaluator/           scoring, confidence, conflicts, false-positive review
  verifier/            blind re-evaluation of sampled/critical controls
  reporting/           HTML/PDF/JSON/SARIF outputs
  connectors/          folder, GitHub, GitLab, S3, databases, documents
  frameworks/
    shared/            canonical controls and crosswalk graph
    gdpr/
    hipaa/
    soc2/
    iso27001/
    nist-ai-rmf/
    eu-ai-act/
```

Each scanner should implement a versioned contract similar to:

```text
plan(context) -> ScanTask[]
execute(task, sandbox) -> RawEvidence[]
normalize(rawEvidence) -> Evidence[]
evaluate(evidence, controlVersion) -> ControlResult[]
verify(controlResult, independentEvidence) -> VerificationResult
```

Do not model every compliance framework as a full autonomous LLM agent. Use deterministic policy evaluation for objective controls and reserve model-assisted reasoning for evidence classification, architecture inference, ambiguous mappings, and narrative generation. This improves cost, latency, reproducibility, and auditor confidence.

## Efficiency recommendations, in order

1. Create typed domain schemas and stable IDs before adding scanners.
2. Build one canonical control graph and map frameworks onto it. Run overlapping checks once; GDPR encryption, HIPAA technical safeguards, SOC 2 CC6, and ISO controls can reuse evidence.
3. Content-address every source file and evidence artifact. On repeat audits, execute only checks whose inputs, rule versions, or dependencies changed.
4. Use a durable DAG/queue with idempotency keys, retry budgets, timeouts, cancellation, and dead-letter handling.
5. Separate collection from evaluation. Scanner output should be normalized facts; framework versions decide compliance.
6. Execute untrusted repositories in rootless, network-denied, resource-capped sandboxes.
7. Run cheap deterministic checks first. Trigger expensive model analysis only for unresolved controls or high-risk systems.
8. Make verifier sampling risk-based: verify 100% of critical failures, a sample of passes, and all low-confidence decisions.
9. Store raw evidence once; store references/hashes in each mapped control result.
10. Emit progress events rather than polling full audit objects.

## Scaling trend and sweet spot

These are architectural planning ranges, not measured benchmarks; the repository currently performs no scan workload.

| Stage | Workload trend | Recommended topology | Likely constraint | Break risk |
|---|---|---|---|---|
| Prototype | 1 user, simulated audits | Static hosting | Product completeness | Low technically; high expectation gap |
| Pilot | Up to ~10 concurrent audits, repositories under ~2 GB | Modular monolith + Postgres + object store + 2–5 workers | Scanner CPU/memory and repository checkout | Worker starvation, unsafe local execution |
| Sweet spot | ~10–100 concurrent audits, incremental rescans | Same API/orchestrator, autoscaled isolated worker pool, durable queue | External APIs, LLM tokens, large monorepos | Queue backlog, duplicate jobs, provider rate limits |
| Scale-out | ~100–1,000 concurrent audits or multi-region requirements | Partition workers by capability/risk; separate ingestion/evaluation/reporting only where independently scaled | Evidence volume, tenancy isolation, control-version fan-out | Noisy neighbors, database hotspots, version inconsistency |
| Enterprise extreme | Thousands concurrent, petabyte evidence estate | Regional control planes, sharded metadata, federated evidence storage | Data sovereignty and cross-region consistency | Compliance breach through replication, operational complexity |

### Recommended sweet spot

Use one deployable API/orchestrator, PostgreSQL, S3-compatible object storage, and a durable queue with separate ephemeral workers. Scale workers horizontally by scanner class. This supports most early enterprise adoption while preserving transactional simplicity and low operational cost.

Avoid Kafka initially. Audit jobs are coarse-grained workflows, not a high-throughput event stream. PostgreSQL-backed queues, Redis-compatible queues, RabbitMQ, or NATS JetStream are simpler. Introduce Kafka only when evidence/event throughput, replay requirements, and multiple independent consumers justify its operational cost.

## Where the system will break first

| Risk | Trigger | Failure mode | Required protection |
|---|---|---|---|
| Untrusted repository execution | Real folder/Git integration | RCE, secret theft, lateral movement | Rootless disposable sandbox, no network, read-only input, CPU/RAM/time limits |
| Evidence/version drift | Framework or scanner updates | Same evidence produces unexplained new verdict | Version every rule, scanner, model, prompt, and control mapping |
| LLM nondeterminism | Model used as final control authority | Non-repeatable pass/fail results | Deterministic policies, structured outputs, confidence thresholds, human review |
| Cross-tenant leakage | Shared workers/storage | Regulatory and contractual incident | Tenant-scoped encryption, authorization on every object, isolated workspaces |
| Large monorepositories | Millions of files/generated assets | Memory exhaustion and very long audits | Ignore rules, file budgets, streaming manifests, incremental scanning |
| Framework overlap | More modules added independently | Duplicate findings and inflated failure counts | Canonical control/evidence graph and deduplication keys |
| Queue overload | Burst of audits or stuck scanners | Hours-long backlog and stale reports | Priority queues, admission control, fair scheduling, autoscaling, SLAs |
| External connector limits | GitHub/cloud/database throttling | Partial evidence mistaken for compliance failure | Checkpointing, retry-after handling, explicit incomplete state |
| Evidence storage growth | Repeated full snapshots | High cost and slow retrieval | Hash deduplication, compression, tiering, retention/legal holds |
| Evaluator/verifier coupling | Same model/context/prompt | “Independent” verification repeats original bias | Separate execution context, evidence sampling, different policy/model strategy |

## Metrics and trends to implement

### Product and compliance trends

- Readiness and evidence-coverage change by framework/control family
- New, resolved, reopened, and waived findings by severity
- Mean time to evidence and mean time to remediation
- Control regression rate after code/model/data changes
- Findings per changed file, model, dataset, deployment, and team
- Evidence freshness and expiring-evidence forecast

### Engineering trends

- Queue depth/age and audit completion latency: p50, p95, p99
- Scanner CPU time, peak memory, cache-hit rate, and failure/retry rate
- Cost per audit and per passing control, including model tokens
- Duplicate evidence ratio and incremental-scan savings
- Control decisions by deterministic/model/manual source
- Evaluator disagreement and verifier overturn rates
- Connector throttle rate and incomplete-audit rate

### Capacity warning signals

- Queue age grows for three consecutive intervals while workers exceed 70% utilization.
- p95 audit time exceeds twice the 30-day baseline.
- Incremental cache hit rate falls below 60% for repeat audits.
- Verifier overturn rate exceeds 5% or differs sharply by framework.
- Incomplete evidence is being classified as failure rather than “unknown.”
- A tenant consumes more than 25% of worker capacity for a sustained interval.

## Implementation roadmap

### Phase 1 — Honest vertical slice

- Extract UI data into typed objects and components.
- Implement audit lifecycle API and persistent job model.
- Add local-folder manifesting without executing repository code.
- Implement one real scanner path: secret/SBOM/IaC collection.
- Implement one versioned framework slice end to end, including evidence and verification.
- Label unsupported controls as `unknown`, never pass.

### Phase 2 — Safe multi-framework engine

- Add canonical controls/crosswalks and policy-as-code evaluation.
- Add sandbox workers, GitHub connector, retries, cancellation, and partial results.
- Add architecture/data-flow inference and model/data inventory.
- Add signed reports, evidence export, audit log, RBAC, and tenant isolation.

### Phase 3 — Scale and continuous assurance

- Add incremental change analysis and content-addressed evidence cache.
- Autoscale worker classes and implement admission/fairness controls.
- Add continuous monitoring, evidence expiry, regression alerts, and historical trends.
- Benchmark with small, large, and adversarial repositories before stating capacity.

## Final recommendation

Keep the current interface as the product specification, but do not extend `app.js` into the backend. The highest-value next implementation is a single auditable vertical slice: folder manifest -> isolated open-source scanner -> normalized evidence -> one framework control decision -> independent verification -> signed report. Once that contract is stable, additional agents and frameworks become configuration and isolated plugins instead of tightly coupled application features.
