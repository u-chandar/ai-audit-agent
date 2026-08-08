# Aegis AI Audit

A local-first product prototype for orchestrated AI compliance audits. It accepts a project folder, GitHub repository, or data source; maps architecture and data flows; evaluates controls with specialist agents; independently verifies conclusions; and produces an executive and technical remediation report.

## Run

Install dependencies once, then start the hot-reload development server:

```powershell
npm install
npm run dev
```

Visit `http://127.0.0.1:4185/`. Changes to HTML, CSS, and JavaScript automatically refresh the browser. The strict port setting prevents the address from changing silently.

## Included modules

- GDPR, HIPAA, SOC 2, ISO 27001, NIST AI RMF, EU AI Act, PCI DSS, and CCPA/CPRA control modules
- Discovery, data governance, security, model risk, compliance, evaluator, verifier, and report agents
- Architecture and streaming-technology detection surface
- Evidence coverage, pass/fail, severity, confidence, and readiness scoring
- Prioritized remediation guidance and an open-source tool catalog
- Print/PDF-ready audit report
- Deep technical analysis for dead/disconnected code, application, database, AI, data-model, naming, and governance concerns
- Batch project queues with presets, concurrency controls, retry handling, cache savings, and aggregate progress
- Additional AI baselines: ISO/IEC 42001, NIST AI 600-1, OWASP LLM Top 10:2025, and MITRE ATLAS
- Proposed-design analysis for PDF, PowerPoint, Word, spreadsheet, structured-data, image, and diagram inputs
- Technical-landscape questionnaire with explicit unknown handling and reusable target-architecture generation
- Nuclear engineering assurance covering NRC Parts 21, 50, 52, and 73.54; NRC RG 5.71 and RG 1.28; NUREG-0800; and IAEA SSR-2/1 and GSR Part 2

Detailed engineering recommendations and migration-safe module contracts are documented in `DEAD_CODE_AND_MODULARITY_ANALYSIS.md`.

## Mock test coverage

The prototype includes 16 audit records spanning healthcare, financial services, retail, HR, manufacturing, insurance, and public-facing AI. Scores range from 43% to 99% and cover ready, review, and attention states. The report fixture includes 12 remediation findings across privacy, security, model governance, resilience, data lifecycle, and AI-specific attack risks.

Useful UI edge cases include:

- `Legacy Patient Portal`: lowest readiness and highest finding count
- `Public FAQ Assistant`: near-perfect single-framework audit
- `Clinical Note Summarizer`: multi-framework regulated-health workload
- `HR Candidate Ranker`: high-risk automated decision system
- `Knowledge Search Assistant`: low-finding, high-readiness RAG workload

This is an interactive front-end prototype. Production scanning requires connecting the UI to sandboxed analyzers and a policy/evidence backend. Compliance results are decision support, not legal certification.
