# Dead Code, Component Usage, and Modular Migration Analysis

## Scope and interpretation

This assessment distinguishes four conditions that are often incorrectly grouped as “dead code”:

1. **Syntactically dead:** declared code that is never referenced.
2. **Disconnected:** visible or callable code without a functioning downstream path.
3. **Simulated:** code that represents a future capability with fixed data or timers.
4. **Missing:** a capability claimed by the interface but absent from the runtime.

The current repository is a Vite-hosted static application. It contains no backend, database schema, API, executable agent, scanner, model integration, queue, or persistence layer. Database and AI findings below therefore describe absent/disconnected product components, not unused database tables or deployed models.

## Verified repository findings

### Syntactically dead

- The `i` argument in `audits.map((a, i) => ...)` is unused.
- The original build produced static assets in `dist/`; these are derived artifacts rather than source modules and should not become a second manually managed copy.

There is otherwise little conventional dead JavaScript: the main constants and functions are referenced. This does not mean the application is functionally complete.

### Disconnected application controls

The following controls render but have no action contract:

- Help and documentation
- Search and notifications
- Continuous-monitoring management
- Risk-menu ellipsis
- Audit search and filter
- Configure guardrails
- Deep-analysis scope selector
- Deep-analysis filters
- Create action buttons
- Add custom framework
- Share report
- All findings

Recommendation: every interactive component should declare a capability state.

```js
const capability = {
  id: 'framework.create',
  status: 'unavailable', // available | unavailable | permission_denied
  reason: 'Custom framework storage is not configured'
};
```

Unavailable capabilities should be disabled with an explanation or excluded. A live-looking control with no behavior is especially harmful in compliance software because users interpret it as an assurance boundary.

### Simulated application paths

| UI capability | Present behavior | Required real behavior |
|---|---|---|
| Folder source | Counts selected files | Manifest, classify, hash, and safely scan content |
| GitHub source | Changes drop-zone copy | Authenticate, resolve revision, clone/read, checkpoint |
| Data source | Changes drop-zone copy | Connector config, sampling, schema discovery, access controls |
| Framework selection | Toggles CSS | Versioned framework IDs in an audit request |
| Run audit | Timed animation | Durable asynchronous workflow |
| Agent team | Cards and labels | Registered implementations with contracts and health |
| Deep analysis | Fixed findings | Analyzer output tied to actual source locations |
| Report | Fixed markup | Immutable report snapshot generated from results |

## Database-component analysis

There are no database components to remove because none have been implemented. The current arrays are an in-memory read model. The migration risk is prematurely binding business logic to a database library.

### Recommended separation

```ts
export interface AuditRepository {
  create(request: CreateAudit): Promise<Audit>;
  get(auditId: AuditId, tenantId: TenantId): Promise<Audit | null>;
  transition(auditId: AuditId, expectedVersion: number, event: AuditEvent): Promise<Audit>;
}

export interface EvidenceRepository {
  put(metadata: EvidenceMetadata, content: ReadableStream): Promise<EvidenceRef>;
  get(ref: EvidenceRef, subject: AccessSubject): Promise<ReadableStream>;
  findByDigest(tenantId: TenantId, sha256: string): Promise<EvidenceRef | null>;
}
```

Domain services depend on interfaces. PostgreSQL and S3-compatible implementations live in adapters:

```text
packages/domain/ports/AuditRepository.ts
packages/domain/ports/EvidenceRepository.ts
adapters/postgres/PostgresAuditRepository.ts
adapters/object-store/S3EvidenceRepository.ts
```

This permits migration from PostgreSQL to another relational service, or from MinIO to cloud object storage, without modifying compliance evaluation.

### Canonical database entities

| Entity | Purpose | Migration-safe requirement |
|---|---|---|
| tenant | Security and ownership boundary | Tenant key on every business row |
| audit | Lifecycle and source revision | Optimistic version and explicit state |
| asset | Code, model, dataset, store, stream, API | Stable ID independent of provider path |
| evidence | Immutable observed fact metadata | Content digest, collector/rule version, object reference |
| canonical_control | Deduplicated technical obligation | Stable semantic ID |
| framework_requirement | Legal/control-framework statement | Framework and effective version |
| control_mapping | Canonical-to-framework relationship | Versioned, reviewed, confidence |
| control_result | Verdict for one audit/control | Pass/fail/unknown/N/A separated from workflow |
| finding | Risk requiring disposition | Severity, owner, lifecycle, due date |
| verification | Independent second-line decision | Blind strategy, disagreement, evidence sample |
| report_snapshot | Immutable delivery artifact | Input/result hashes and signing metadata |

Avoid framework-specific tables such as `gdpr_results`, `hipaa_results`, and `soc2_results`. They duplicate schemas and make cross-framework reuse expensive. Store framework requirements as versioned data and use canonical controls for shared technical checks.

### Schema evolution rules

- Use additive migrations first: new nullable column/table, dual write, backfill, validate, then make mandatory.
- Never rename or drop fields in the same release that introduces the replacement.
- Put `schema_version`, `rule_version`, and `framework_version` on persisted outputs.
- Use an outbox table for workflow events so database commits and queue publication cannot diverge.
- Do not store large evidence payloads in relational rows. Store immutable objects and retain digest/metadata in PostgreSQL.
- Add tenant-aware indexes from the beginning, for example `(tenant_id, audit_id)` rather than only `(audit_id)`.

## Application-component analysis

### Current coupling

`app.js` owns mock domain data, HTML generation, navigation, audit execution simulation, and interaction state. `index.html` owns all view composition, and every view remains mounted. This is acceptable at prototype size but prevents isolated testing and replacement.

### Recommended modular front end

```text
src/
  app/
    router.js
    capabilities.js
  domain/
    schemas.js
    audit-status.js
  api/
    audit-client.js
    report-client.js
  features/
    audit-intake/
    deep-analysis/
    framework-library/
    reports/
  components/
    finding-card.js
    score-bar.js
    status-badge.js
  fixtures/
    audits.js
    analysis-findings.js
```

Do not introduce a large UI framework solely for modularity. ES modules and small pure render functions are sufficient initially. A component framework becomes valuable when interactive state, routing, validation, and server caching become substantial.

### Named data rather than positional arrays

Current:

```js
['Claims Intelligence Platform', 'FastAPI · PyTorch', ['GD', 'HI'], 82,
 '14 / 3', 'Today', 'Review']
```

Recommended:

```js
const auditSummary = {
  id: 'aud_01J...',
  projectName: 'Claims Intelligence Platform',
  technologies: ['FastAPI', 'PyTorch'],
  frameworkIds: ['gdpr@2016-679', 'hipaa-security@2013'],
  readiness: 82,
  findings: { open: 14, critical: 3 },
  completedAt: '2026-08-08T14:42:00Z',
  lifecycle: 'needs_review'
};
```

Validate external data at the boundary with JSON Schema, Zod, TypeBox, or an equivalent tool. Never assume API payloads match UI expectations.

### Reusable source connectors

```ts
export interface SourceConnector<TConfig> {
  readonly type: string;
  validate(config: TConfig): Promise<ValidationResult>;
  createManifest(config: TConfig, signal: AbortSignal): Promise<SourceManifest>;
  open(item: ManifestItem, signal: AbortSignal): Promise<ReadableStream>;
}
```

Folder, GitHub, GitLab, S3, database, and document connectors implement this interface. Downstream discovery never sees provider credentials or provider-specific paths.

## AI-component analysis

No AI inference occurs in the current application. Agent names are display records, so all eight are functionally unused as agents.

### Avoid one autonomous agent per framework

Creating fully autonomous GDPR, HIPAA, and SOC 2 agents causes duplicated scans, inconsistent reasoning, cost multiplication, and hard-to-reproduce results. Prefer the following split:

```text
Deterministic collection
  -> normalized evidence graph
  -> deterministic policy/control evaluation
  -> model-assisted ambiguity resolution
  -> independent risk-based verification
  -> deterministic score calculation
  -> model-assisted report narrative
```

### Reusable agent contract

```ts
export interface AuditAgent<TTask, TResult> {
  readonly descriptor: AgentDescriptor;
  plan(context: AuditContext): Promise<TTask[]>;
  execute(task: TTask, context: ExecutionContext): Promise<TResult>;
  validate(result: TResult): ValidationResult;
}

export interface AgentDescriptor {
  id: string;
  version: string;
  capabilities: string[];
  requiredEvidence: string[];
  resourceClass: 'light' | 'cpu' | 'memory' | 'model';
}
```

The orchestrator uses capability lookup rather than importing concrete agents:

```ts
const candidates = registry.forCapability(task.capability);
const agent = scheduler.select(candidates, task.resourceBudget);
const result = await executor.runIsolated(agent, task);
```

This supports replacing a local model with a hosted model, or a Semgrep analyzer with another implementation, without changing workflow logic.

### Independent verification

The verifier must not receive the first evaluator’s conclusion. It receives the control, a separately selected evidence sample, and a different strategy identifier. Persist:

- evaluator and verifier version
- model and prompt/policy version
- evidence IDs visible to each
- decision, confidence, and rationale hashes
- disagreement and final disposition

If the same prompt, model, evidence ordering, and rationale are reused, verification is duplicated inference rather than independence.

## Recommended extraction sequence

### Step 1: Remove misleading dead surface

- Implement, disable, or remove the twelve disconnected controls.
- Wire selected frameworks and project identity into an explicit `AuditRequest`.
- Fix the unused `i` callback parameter.
- Add `.gitignore` policy for build artifacts.

### Step 2: Extract reusable UI/domain modules

- Move fixture data out of `app.js`.
- Replace positional arrays with named validated objects.
- Extract deep-analysis, audit-table, framework-picker, and report renderers.
- Add unit tests for pure transformations and state transitions.

### Step 3: Add ports before infrastructure

- Define source, repository, object-store, queue, scanner, evaluator, and report interfaces.
- Build in-memory adapters for contract tests.
- Add PostgreSQL/object-store implementations without leaking them into domain code.

### Step 4: Implement one real vertical slice

```text
FolderSourceConnector
 -> SourceManifest
 -> isolated secret/SBOM scanner
 -> EvidenceNormalizer
 -> one canonical control
 -> deterministic evaluator
 -> independent verifier
 -> ReportSnapshot
```

This is a better foundation than implementing eight framework agents simultaneously. Once the shared evidence/control contract works, framework mappings can be added incrementally.

### Step 5: Migration safety

- Run mock and real API adapters behind the same client interface.
- Add feature flags by tenant and audit type.
- Dual-run old/new evaluators and compare results without changing the user verdict.
- Record compatibility fixtures for every schema and agent contract.
- Make every workflow operation idempotent and resumable.
- Promote new versions only when verifier disagreement and regression rates remain within limits.

## Priority summary

| Priority | Change | Reason |
|---|---|---|
| P0 | Honest capability states | Prevents simulated features being mistaken for assurance |
| P0 | Source and execution contracts | Establishes the first real audit boundary |
| P0 | Tenant-safe evidence persistence | Required before regulated data is processed |
| P1 | Named schemas and canonical controls | Enables reuse and safe migrations |
| P1 | Durable workflow and isolated workers | Provides retry, cancellation, and safe scanning |
| P1 | Independent verification protocol | Makes assurance defensible |
| P2 | On-demand view rendering | Reduces future UI overhead |
| P2 | Framework/plugin marketplace | Valuable only after shared contracts stabilize |

## Conclusion

The immediate issue is not a large volume of unreachable code; it is a large volume of reachable UI that is disconnected from real application, database, and AI capabilities. Preserve the interface as a product specification, but create stable ports around source ingestion, evidence, controls, agent execution, verification, and reporting. A modular monolith with contract-based adapters is the easiest architecture to test, reuse, and migrate. Split deployables only when measured scaling or isolation requirements justify it.
