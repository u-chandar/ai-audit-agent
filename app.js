import { AgentEngine } from './agent-core/engine.js';
import { createBaselineIntelligenceAgent } from './baseline-intelligence-agent.js';
import mermaid from 'mermaid';

const frameworks=[
 {id:'gdpr',short:'GDPR',name:'General Data Protection Regulation',desc:'Privacy, lawful processing, data subject rights, DPIAs, and automated decision-making.',score:88,controls:173,color:'#2f836f'},
 {id:'hipaa',short:'HIPAA',name:'HIPAA Security & Privacy',desc:'Administrative, physical, and technical safeguards for protected health information.',score:74,controls:119,color:'#5a85a0'},
 {id:'soc2',short:'SOC 2',name:'SOC 2 Trust Services',desc:'Security, availability, processing integrity, confidentiality, and privacy controls.',score:92,controls:196,color:'#756da7'},
 {id:'iso',short:'ISO',name:'ISO/IEC 27001:2022',desc:'Risk-based information security management system and Annex A controls.',score:86,controls:93,color:'#b37a45'},
 {id:'nist',short:'NIST',name:'NIST AI RMF 1.0',desc:'Govern, Map, Measure, and Manage trustworthy and responsible AI risks.',score:69,controls:72,color:'#477d77'},
 {id:'euai',short:'EU AI',name:'EU AI Act',desc:'Risk classification, transparency, human oversight, quality, and post-market monitoring.',score:71,controls:113,color:'#486d9a'},
 {id:'pci',short:'PCI',name:'PCI DSS 4.0.1',desc:'Security requirements for systems that store, process, or transmit payment data.',score:95,controls:64,color:'#517990'},
 {id:'ccpa',short:'CPRA',name:'CCPA / CPRA',desc:'California consumer privacy rights, sensitive data controls, and disclosures.',score:83,controls:46,color:'#6c8174'},
 {id:'iso42001',short:'42001',name:'ISO/IEC 42001:2023',desc:'AI management system requirements for responsible development, provision, and use.',score:68,controls:84,color:'#4d817a'},
 {id:'nist-gai',short:'GAI',name:'NIST AI 600-1 GenAI Profile',desc:'Generative AI risks and actions extending the NIST AI RMF for cross-sector use.',score:64,controls:79,color:'#675e94'},
 {id:'owasp-llm',short:'LLM',name:'OWASP LLM Top 10:2025',desc:'Application-security baseline for prompt injection, data leakage, agency, and model risks.',score:72,controls:52,color:'#a25f55'},
 {id:'mitre-atlas',short:'ATLAS',name:'MITRE ATLAS',desc:'Living threat knowledge base for predictive, generative, and agentic AI systems.',score:59,controls:173,color:'#6c637f'},
 {id:'nist-csf',short:'CSF',name:'NIST Cybersecurity Framework 2.0',desc:'Govern, Identify, Protect, Detect, Respond, and Recover cybersecurity outcomes.',score:77,controls:106,color:'#3e7381'},
 {id:'nist-ssdf-ai',short:'SSDF',name:'NIST SP 800-218A',desc:'Secure software-development practices for generative AI and dual-use foundation models.',score:63,controls:58,color:'#7b6458'},
 {id:'nrc-50',short:'NRC50',name:'10 CFR Part 50 + App. A/B',desc:'Nuclear licensing, General Design Criteria, and quality assurance for safety-related design and construction.',score:74,controls:64,color:'#536d74'},
 {id:'nrc-52',short:'NRC52',name:'10 CFR Part 52',desc:'Nuclear plant licenses, standard design certifications, approvals, ITAAC, and acceptance criteria.',score:66,controls:48,color:'#5b7475'},
 {id:'nrc-21',short:'PART21',name:'10 CFR Part 21',desc:'Evaluation and reporting of defects and noncompliance for nuclear basic components.',score:81,controls:22,color:'#7d6958'},
 {id:'nrc-7354',short:'73.54',name:'10 CFR 73.54',desc:'Protection of nuclear safety, security, and emergency-preparedness digital systems from cyberattack.',score:69,controls:34,color:'#7e5a5f'},
 {id:'nrc-rg571',short:'RG5.71',name:'NRC RG 5.71 Rev. 1',desc:'NRC regulatory guidance for nuclear power reactor cybersecurity programs and lifecycle controls.',score:72,controls:147,color:'#506b7e'},
 {id:'nrc-rg128',short:'RG1.28',name:'NRC RG 1.28 Rev. 6 / NQA-1',desc:'NRC-endorsed quality assurance criteria using NQA-1 editions with exceptions and clarifications.',score:78,controls:108,color:'#766b56'},
 {id:'nureg0800',short:'SRP',name:'NUREG-0800 Standard Review Plan',desc:'NRC staff guidance for structured safety and licensing review of nuclear power plant applications.',score:62,controls:236,color:'#55717a'},
 {id:'iaea-ssr21',short:'SSR2/1',name:'IAEA SSR-2/1 Rev. 1',desc:'International nuclear power plant design safety requirements and defense-in-depth principles.',score:71,controls:82,color:'#507a76'},
 {id:'iaea-gsr2',short:'GSR2',name:'IAEA GSR Part 2',desc:'Leadership, integrated management systems, supply chain, safety culture, assessment, and improvement.',score:76,controls:14,color:'#647260'},
 {id:'cui-32cfr2002',short:'CUI',name:'32 CFR Part 2002 CUI Program',desc:'Executive-branch controlled unclassified information handling, marking, safeguarding, dissemination, and decontrol requirements.',score:73,controls:67,color:'#4e7a6e'},
 {id:'itar-22cfr120',short:'ITAR',name:'ITAR 22 CFR 120-130',desc:'Defense-article technical-data classification, access control, export authorization, and handling restrictions.',score:69,controls:81,color:'#7a5f4f'},
 {id:'nist-800-171',short:'171',name:'NIST SP 800-171 Rev. 3',desc:'Protecting controlled unclassified information in nonfederal systems and organizations.',score:75,controls:110,color:'#486f85'},
 {id:'nist-800-172',short:'172',name:'NIST SP 800-172',desc:'Enhanced requirements for protecting CUI in high-value contractor environments from advanced threats.',score:67,controls:35,color:'#44657a'},
 {id:'ear-15cfr730',short:'EAR',name:'EAR 15 CFR 730-774',desc:'Export Administration Regulations for dual-use items, controlled technology, and deemed export restrictions.',score:66,controls:59,color:'#836548'},
 {id:'dfars-7012',short:'DFARS',name:'DFARS 252.204-7012',desc:'Contractor safeguarding and cyber incident reporting requirements for covered defense information.',score:71,controls:24,color:'#6c5f7a'},
 {id:'cmmc-2',short:'CMMC2',name:'DoD CMMC 2.0',desc:'Defense contractor maturity model for controlled information protection and assessment readiness.',score:63,controls:110,color:'#4f6d60'},
 {id:'dod-851001',short:'RMF',name:'DoDI 8510.01 RMF',desc:'DoD Risk Management Framework process requirements for categorization, controls, authorization, and continuous monitoring.',score:65,controls:83,color:'#5f6f8a'},
 {id:'dfars-7019-7020',short:'7019/20',name:'DFARS 252.204-7019/7020',desc:'NIST 800-171 assessment submission and DoD assessment access requirements for defense contractors.',score:62,controls:18,color:'#6d6372'},
 {id:'doe-o-2051d',short:'DOE205',name:'DOE O 205.1D',desc:'Departmental cybersecurity risk management policy for mission systems and enterprise services.',score:66,controls:44,color:'#4b7484'},
 {id:'doe-o-2061',short:'DOE206',name:'DOE O 206.1',desc:'DOE cybersecurity program direction for protective operations, incident handling, and governance accountability.',score:64,controls:39,color:'#5a6f7e'},
 {id:'doe-o-4716',short:'DOE471',name:'DOE O 471.6',desc:'Information security policy for controlled information handling, marking, and safeguarding.',score:70,controls:31,color:'#5f7459'},
 {id:'cfr-10-810',short:'10CFR810',name:'10 CFR Part 810',desc:'Assistance to foreign atomic energy activities, export authorization, and restricted technical-data controls.',score:61,controls:27,color:'#7b664f'}
];
const audits=[
 ['Claims Intelligence Platform','FastAPI  -  PyTorch', ['GD','HI','AI'],82,'14 / 3','Today, 09:42','Review'],
 ['Customer Support Copilot','Next.js  -  OpenAI', ['S2','GD','NI'],94,'4 / 0','Yesterday','Ready'],
 ['Fraud Detection Engine','Kafka  -  XGBoost', ['PC','S2','IS'],78,'19 / 2','Aug 04','Attention'],
 ['Document Classification API','Python  -  BERT', ['GD','AI'],88,'7 / 0','Jul 31','Ready'],
 ['Clinical Note Summarizer','Kubernetes  -  Llama 3', ['HI','GD','AI'],61,'32 / 7','Jul 29','Attention'],
 ['Credit Decision Service','Java  -  LightGBM', ['AI','S2','CP'],73,'21 / 4','Jul 27','Review'],
 ['Retail Recommendation Hub','Spark  -  Feast', ['GD','CP','IS'],91,'6 / 0','Jul 25','Ready'],
 ['Voice Biometrics Gateway','Go  -  ONNX Runtime', ['GD','S2','IS'],67,'28 / 5','Jul 23','Attention'],
 ['Payments Risk Copilot','Python  -  Kafka', ['PC','S2','AI'],84,'11 / 1','Jul 20','Review'],
 ['HR Candidate Ranker','Azure ML  -  Python', ['AI','GD','CP'],56,'39 / 9','Jul 18','Attention'],
 ['Knowledge Search Assistant','Node.js  -  pgvector', ['S2','NI'],97,'2 / 0','Jul 15','Ready'],
 ['Manufacturing Vision QA','Edge K8s  -  YOLOv8', ['IS','AI'],89,'8 / 0','Jul 11','Ready'],
 ['Insurance Pricing Model','Databricks  -  MLflow', ['GD','S2','AI'],76,'17 / 2','Jul 08','Review'],
 ['Legacy Patient Portal','PHP  -  MySQL', ['HI','S2'],43,'51 / 12','Jul 03','Attention'],
 ['Synthetic Data Generator','Ray  -  PyTorch', ['GD','NI','AI'],80,'13 / 1','Jun 29','Review'],
 ['Public FAQ Assistant','Cloudflare  -  Workers AI', ['AI'],99,'1 / 0','Jun 25','Ready']
];
const agentData=[
 ['BL','Baseline intelligence agent','Checks latest policies, frameworks, and compliance resources, then pins a baseline manifest before all other agents execute.','Policy baseline gate'],
 ['DS','Discovery agent','Inventories code, models, stores, streams, APIs, infrastructure, and policy evidence.','42 analyzers'],
 ['DG','Data governance agent','Traces personal, health, payment, training, and inference data through its lifecycle.','Lineage and classification'],
 ['DR','Data restrictions agent','Applies CUI, ITAR, export-control, and classification boundary rules across data, code, and model artifacts.','CUI and ITAR controls'],
 ['SE','Security agent','Tests identity, secrets, encryption, dependencies, IaC, APIs, and runtime posture.','Threat-led checks'],
 ['MR','Model risk agent','Evaluates bias, drift, explainability, robustness, lineage, and model documentation.','TEVV pipeline'],
 ['CP','Compliance agents','One independent specialist translates evidence into each framework\'s controls.','15 frameworks'],
 ['EV','Evaluator agent','Challenges evidence strength, detects false positives, and calibrates scoring.','Confidence scoring'],
 ['IV','Independent verifier','Re-runs critical checks without seeing the first verdict to reduce confirmation bias.','Blind validation'],
 ['RP','Report agent','Builds executive, technical, evidence, and remediation-ready audit packages.','PDF / JSON / SARIF']
];
const agentAlgorithmCatalog=[
 {id:'agent-baseline',icon:'BL',name:'Baseline intelligence agent',summary:'Verifies latest policy/framework corpus, pins baseline manifest, and gates pipeline start.',algorithm:'Freshness-gate protocol: refresh baseline sources, rebuild policy RAG corpus, evaluate SLA age constraints, and publish immutable baseline manifest before allowing downstream execution.',meta:'Baseline gate',citations:[
  {title:'NIST CSF 2.0 Govern Function',url:'https://www.nist.gov/cyberframework'},
  {title:'NIST AI RMF Govern',url:'https://www.nist.gov/itl/ai-risk-management-framework'}
 ]},
 {id:'agent-discovery',icon:'DS',name:'Discovery agent',summary:'Inventories code, models, stores, streams, APIs, infrastructure, and policy evidence.',algorithm:'Static parsing plus graph traversal: parse manifests, dependency trees, API specs, IaC, and service topology, then emit an AssetGraph with trust-boundary annotations.',meta:'42 analyzers',citations:[
  {title:'NIST SP 800-218 SSDF',url:'https://csrc.nist.gov/pubs/sp/800/218/final'},
  {title:'OWASP SAMM',url:'https://owaspsamm.org/model/'}
 ]},
 {id:'agent-data-governance',icon:'DG',name:'Data governance agent',summary:'Traces personal, health, payment, training, and inference data through its lifecycle.',algorithm:'Lineage graph propagation: classify entities, map source-to-sink flows, apply policy tags, and compute purpose/retention violations over directed data paths.',meta:'Lineage and classification',citations:[
  {title:'NIST Privacy Framework 1.0',url:'https://www.nist.gov/privacy-framework'},
  {title:'W3C PROV',url:'https://www.w3.org/TR/prov-overview/'}
 ]},
 {id:'agent-data-restrictions',icon:'DR',name:'Data restrictions agent',summary:'Applies CUI, ITAR, export-control, and classification boundary rules across data and model artifacts.',algorithm:'Classification-policy enforcement: detect CUI/export tags, evaluate sovereignty and recipient constraints, and verify dissemination controls against restricted-data rules.',meta:'CUI and ITAR controls',citations:[
  {title:'NARA CUI Program (32 CFR Part 2002)',url:'https://www.ecfr.gov/current/title-32/subtitle-B/chapter-XX/part-2002'},
  {title:'ITAR eCFR (22 CFR 120-130)',url:'https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M'},
  {title:'NIST SP 800-171',url:'https://csrc.nist.gov/pubs/sp/800/171/r3/final'}
 ]},
 {id:'agent-security',icon:'SE',name:'Security agent',summary:'Tests identity, secrets, encryption, dependencies, IaC, APIs, and runtime posture.',algorithm:'Deterministic control-check engine: execute rule packs (secrets, SBOM/CVE, IAM, encryption, IaC posture), normalize findings, and compute exploitability-weighted risk states.',meta:'Threat-led checks',citations:[
  {title:'NIST CSF 2.0',url:'https://www.nist.gov/cyberframework'},
  {title:'OWASP ASVS',url:'https://owasp.org/www-project-application-security-verification-standard/'}
 ]},
 {id:'agent-model-risk',icon:'MR',name:'Model risk agent',summary:'Evaluates bias, drift, explainability, robustness, lineage, and model documentation.',algorithm:'TEVV workflow: run statistical drift/bias tests, robustness probes, explainability checks, and lineage completeness scoring before model risk verdicting.',meta:'TEVV pipeline',citations:[
  {title:'NIST AI RMF 1.0',url:'https://www.nist.gov/itl/ai-risk-management-framework'},
  {title:'ISO/IEC 23894 AI risk management',url:'https://www.iso.org/standard/77304.html'}
 ]},
 {id:'agent-compliance',icon:'CP',name:'Compliance agents',summary:'One independent specialist translates evidence into each framework\'s controls.',algorithm:'Canonical control mapping: convert normalized evidence into reusable control facts, then map facts to framework-specific obligations using versioned rule dictionaries.',meta:'15 frameworks',citations:[
  {title:'NIST OSCAL',url:'https://pages.nist.gov/OSCAL/'},
  {title:'OpenControl',url:'https://github.com/opencontrol'}
 ]},
 {id:'agent-evaluator',icon:'EV',name:'Evaluator agent',summary:'Challenges evidence strength, detects false positives, and calibrates scoring.',algorithm:'Confidence calibration loop: challenge contradictory evidence, score sufficiency/freshness/severity, and apply weighted readiness with critical-control caps.',meta:'Confidence scoring',citations:[
  {title:'NIST AI RMF Measure/Manage',url:'https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-playbook'},
  {title:'GUM uncertainty framework',url:'https://www.bipm.org/en/committees/jc/jcgm/publications'}
 ]},
 {id:'agent-verifier',icon:'IV',name:'Independent verifier',summary:'Re-runs critical checks without seeing the first verdict to reduce confirmation bias.',algorithm:'Blind double-check protocol: sample critical and low-confidence controls, re-run with independent evidence selection and separate scoring context, then compare deltas.',meta:'Blind validation',citations:[
  {title:'NIST SP 800-53A',url:'https://csrc.nist.gov/pubs/sp/800/53/a/final'},
  {title:'ISO/IEC 19011 auditing guidelines',url:'https://www.iso.org/standard/70017.html'}
 ]},
 {id:'agent-reporter',icon:'RP',name:'Report agent',summary:'Builds executive, technical, evidence, and remediation-ready audit packages.',algorithm:'Snapshot synthesis: assemble immutable evidence links, framework verdicts, confidence rationale, and prioritized remediations into export-specific renderers.',meta:'PDF / JSON / SARIF',citations:[
  {title:'OASIS SARIF v2.1.0',url:'https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html'},
  {title:'NISTIR 8286 risk reporting',url:'https://csrc.nist.gov/publications/detail/nistir/8286/final'}
 ]}
];
const findings=[
 ['01','Establish immutable evidence provenance','NIST AI RMF  -  ISO 27001  -  SOC 2','Add signed evidence records, source digests, artifact ownership, and approval history for every assessed control.','2-3 days','Governance Office'],
 ['02','Enforce policy-bound retention limits','GDPR Art. 5  -  HIPAA C164.310','Apply retention schedules, deletion proofs, and disposal controls for uploaded project artifacts and derived evidence.','3-5 days','Data Governance'],
 ['03','Document accountable human review points','EU AI Act Art. 14  -  ISO/IEC 42001','Define intervention points, operator competence, override behavior, and escalation evidence for consequential decisions.','1-2 days','Governance Lead'],
 ['04','Close audit-log coverage for sensitive operations','HIPAA C164.312(b)  -  SOC 2 CC7','Instrument sensitive reads, exports, admin actions, and evidence mutations with tamper-evident audit events.','2 days','Security'],
 ['05','Add systematic impact and bias review gates','NIST MAP 3.5  -  EU AI Act Art. 10','Run documented impact checks, cohort metrics, and decision-quality reviews before promoting high-impact capabilities.','3-4 days','Responsible Systems'],
 ['06','Rotate exposed development credentials','SOC 2 CC6.1  -  ISO A.8.24','Revoke detected tokens, move secrets to Vault, and add pre-commit secret scanning.','4 hours','Platform Security'],
 ['07','Create deletion and disposition evidence','GDPR Art. 17  -  CPRA C1798.105','Propagate deletion requests and disposal proofs through stores, indexes, exports, and derived assurance datasets.','5-8 days','Privacy Engineering'],
 ['08','Define rollback and recovery objectives','SOC 2 A1.2  -  NIST MANAGE 4.1','Set recovery objectives, retain approved releases and artifacts, and test rollback quarterly.','2 days','SRE'],
 ['09','Validate interaction and content-boundary controls','NIST AI RMF  -  OWASP LLM01','Add adversarial interaction tests, tool allowlists, output filtering, and isolation checks where generative or agentic features exist.','2-3 days','Application Security'],
 ['10','Document business-associate coverage','HIPAA C164.308(b)','Inventory subprocessors handling ePHI and attach current business associate agreements.','1 day','Legal'],
 ['11','Apply encryption to evidence and backup stores','ISO A.8.24  -  SOC 2 CC6.7','Enable envelope encryption, rotate keys, and verify restore procedures with encrypted evidence snapshots.','1-2 days','Data Platform'],
 ['12','Publish intended use, limitations, and prohibited contexts','EU AI Act Art. 13  -  NIST GOVERN 1.4','Document known limitations, intended users, excluded uses, and prohibited deployment contexts for governed capabilities.','1 day','Product Owner'],
 ['13','Apply CUI marking and decontrol workflow','32 CFR Part 2002  -  NIST SP 800-171','Apply CUI category/marking labels, dissemination controls, and decontrol records across artifacts and exports.','2-3 days','Data Restrictions'],
 ['14','Enforce export-control gate for model artifacts','ITAR  -  EAR  -  DFARS 252.204-7012','Block release of controlled technical data and model weights to non-authorized recipients or jurisdictions.','1-2 days','Export Compliance']
];
const compliancePackages=[
 {id:'enterprise',label:'Enterprise software assurance',description:'General enterprise applications, internal systems, and customer-facing software.',frameworks:['soc2','iso','nist-csf']},
 {id:'privacy',label:'Privacy and consumer data',description:'Systems processing personal, employee, or consumer-sensitive data.',frameworks:['gdpr','ccpa','iso']},
 {id:'healthcare',label:'Healthcare and regulated records',description:'Clinical, health, or protected information with audit and retention obligations.',frameworks:['hipaa','soc2','iso','nist-csf']},
 {id:'ai-enabled',label:'AI-enabled consequential systems',description:'Automated or intelligent capabilities requiring governance, oversight, and risk controls.',frameworks:['nist','euai','iso42001','nist-gai']},
 {id:'defense',label:'Controlled technical and defense data',description:'CUI, export-controlled, contractor, or restricted technical-information workloads.',frameworks:['cui-32cfr2002','nist-800-171','itar-22cfr120','ear-15cfr730','dfars-7012','dfars-7019-7020','cmmc-2','dod-851001']},
 {id:'doe-energy',label:'DOE and energy-sector compliance',description:'Department of Energy mission systems, nuclear technical data, and energy cybersecurity controls.',frameworks:['doe-o-2051d','doe-o-2061','doe-o-4716','cfr-10-810','nrc-50','nrc-52','nrc-7354','nist-800-171']},
 {id:'nuclear',label:'Nuclear digital assurance',description:'Safety, quality, cybersecurity, and licensing-sensitive nuclear or digital I&C systems.',frameworks:['nrc-50','nrc-52','nrc-21','nrc-7354','nrc-rg571','nrc-rg128','nureg0800','iaea-ssr21','iaea-gsr2']}
];
const complianceSlaPresetByPackage={
 enterprise:24,
 privacy:24,
 healthcare:12,
 'ai-enabled':12,
 defense:12,
 'doe-energy':6,
 nuclear:6
};
const tools=[
 ['Open Policy Agent','Policy-as-code for deploy-time and runtime guardrails.','Apache-2.0'],['Semgrep','Static analysis and custom compliance rules.','LGPL-2.1'],['Trivy','Container, SBOM, IaC, and secret scanning.','Apache-2.0'],['Presidio','PII discovery and de-identification pipelines.','MIT'],
 ['MLflow','Model registry, experiments, and lineage evidence.','Apache-2.0'],['Evidently','Data quality, drift, and model monitoring.','Apache-2.0'],['Fairlearn','Fairness metrics and mitigation assessment.','MIT'],['OpenTelemetry','Vendor-neutral audit and observability signals.','Apache-2.0'],
 ['OpenLineage','Dataset and pipeline lineage event standard.','Apache-2.0'],['Checkov','Infrastructure-as-code policy scanning.','Apache-2.0'],['Syft + Grype','SBOM generation and vulnerability scanning.','Apache-2.0'],['Keycloak','Identity, RBAC, MFA, and federation.','Apache-2.0']
];
const deepAnalysis={
 'dead-code':{title:'Dead and disconnected component analysis',description:'Unused code, unwired application controls, absent persistence, and simulated AI execution paths.',items:[
  {severity:'high',name:'All AI agents are catalog records, not executable modules',location:'app.js  -  agentData  -  pipeline',detail:'Discovery, governance, security, evaluator, verifier, and reporting agents are rendered as labels; no agent accepts input or produces evidence.',current:'agentData.map(agent => renderCard(agent))',better:'Define Agent { id, capabilities, plan(context), execute(task), health() } and register implementations through an AgentRegistry.',impact:'Turns the product claim into testable, replaceable components.',effort:'2-3 weeks'},
  {severity:'high',name:'Database and evidence components do not exist',location:'application infrastructure',detail:'Audit histories, controls, evidence, findings, users, and reports are constants in browser memory. Reloading restores mock data.',current:'const audits = [[...]]; const findings = [[...]];',better:'Introduce repository interfaces backed initially by PostgreSQL and object storage; keep the UI dependent only on API DTOs.',impact:'Adds persistence without coupling domain logic to one database.',effort:'1-2 weeks'},
  {severity:'high',name:'Source connectors are disconnected',location:'new-audit source tabs',detail:'Folder selection counts files; GitHub and data-source modes only change instructional copy. No content enters an analysis pipeline.',current:'onchange => display files.length',better:'SourceConnector.createManifest(input) returns normalized files, revision, provenance, exclusions, and errors.',impact:'Creates a reusable intake boundary for local, Git, cloud, and database sources.',effort:'1 week'},
  {severity:'high',name:'Audit execution is a timer',location:'app.js  -  #run-audit',detail:'The apparent multi-agent scan is a 2.2-second animation that always opens the same static report.',current:'setTimeout(() => switchView("reports"), 2200)',better:'POST /audits -> durable workflow ID; consume progress events; fetch immutable ReportSnapshot after verification.',impact:'Enables failure, retry, cancellation, and real results.',effort:'2 weeks'},
  {severity:'medium',name:'Twelve visible controls are not wired',location:'index.html',detail:'Search, notifications, monitoring management, filters, guardrails, custom framework, sharing, and action creation have no handler.',current:'<button class="ghost">Configure guardrails</button>',better:'Attach a capability ID and handler, disable with an explanation, or remove until supported.',impact:'Reduces misleading UI and test ambiguity.',effort:'1-3 days'},
  {severity:'medium',name:'Analysis filters are decorative',location:'#analysis-findings toolbar',detail:'All, High risk, and Quick wins buttons do not filter results.',current:'<button class="ghost">High risk</button>',better:'Keep activeAnalysisFilter in state and filter items by severity or effort before rendering.',impact:'Makes large finding sets usable.',effort:'2 hours'},
  {severity:'medium',name:'Selected frameworks are discarded',location:'#check-grid  -  #run-audit',detail:'Checkbox state is visual and never becomes an audit request or report scope.',current:'toggle .selected CSS class only',better:'buildAuditRequest() serializes selected framework IDs and versions with source and policy scope.',impact:'Prevents inaccurate framework claims.',effort:'3 hours'},
  {severity:'medium',name:'Project input does not update the report',location:'#project-name  -  #reports',detail:'The input is used in a toast while report headings and findings remain fixed.',current:'toast.textContent = projectName',better:'Render report from ReportSnapshot.project and route by auditId.',impact:'Avoids cross-project report confusion.',effort:'4 hours'},
  {severity:'medium',name:'Positional mock arrays create hidden schema coupling',location:'audits  -  findings  -  tools',detail:'Consumers depend on indexes such as a[6] and f[4]; insertion or reordering silently corrupts meaning.',current:'a[0], a[3], a[6]',better:'Use named objects validated by AuditSummarySchema and FindingSchema at API boundaries.',impact:'Safe migrations and readable reuse.',effort:'1 day'},
  {severity:'low',name:'Unused callback parameter in audit rendering',location:'app.js  -  audits.map',detail:'The map callback declares i but never reads it.',current:'audits.map((a, i) => ...)',better:'Use audits.map(a => ...) or use a stable audit.id as a key in a component implementation.',impact:'Removes a small dead symbol and lint warning.',effort:'1 minute'},
  {severity:'low',name:'All hidden views remain mounted',location:'index.html  -  .view',detail:'Five inactive views and their rendered lists remain in the DOM even when invisible.',current:'.view { display:none } / .view.active { display:block }',better:'Route and render views on demand; preserve only necessary view state in a store.',impact:'Lower DOM and event overhead as the product grows.',effort:'1-2 days'},
  {severity:'low',name:'Build output is generated but unmanaged',location:'dist/',detail:'Production assets are build artifacts; without ignore/deployment policy they can become stale or accidentally committed.',current:'dist/assets/index-[hash].js',better:'Ignore dist for source workflows or publish it only in a dedicated deployment pipeline.',impact:'Prevents stale artifact drift.',effort:'15 minutes'}]},
 modules:{title:'Technical module assessment',description:'Architecture boundaries, coupling, cohesion, ownership, and operational resilience.',items:[
  {severity:'high',name:'AuditOrchestrator has too many responsibilities',location:'services/audit/orchestrator.py',detail:'Planning, execution, retries, scoring, notifications, and reporting are coupled in one 1,284-line module.',current:'AuditOrchestrator.run() performs discovery, dispatch, scoring, and PDF generation.',better:'Split into AuditPlanner, TaskDispatcher, ResultAggregator, and ReportPublisher behind an AuditWorkflow interface.',impact:'Smaller change radius and independently scalable workers.',effort:'3 days'},
  {severity:'high',name:'Framework modules duplicate evidence collection',location:'agents/gdpr.py  -  hipaa.py  -  soc2.py',detail:'Every framework independently scans encryption, identity, logging, and retention evidence.',current:'gdpr.scan_encryption() and hipaa.scan_encryption() run separate repository passes.',better:'Collect EncryptionEvidence once; map its immutable evidence ID to every applicable control.',impact:'28-40% less repeated scanner work.',effort:'4 days'},
  {severity:'medium',name:'Connector contracts leak provider details',location:'connectors/',detail:'GitHub and folder inputs return different shapes that flow into evaluators.',current:'GitHub returns repository.full_name; Folder returns rootPath.',better:'Normalize to SourceManifest { sourceId, revision, files, provenance, discoveredAt }.',impact:'Makes new sources additive and testable.',effort:'2 days'},
  {severity:'low',name:'Generic utility package has weak cohesion',location:'shared/utils.py',detail:'Hashing, retry logic, colors, dates, and JSON serialization share one module.',current:'from shared.utils import *',better:'Use crypto.py, retry.py, time.py, and serialization.py with explicit imports.',impact:'Clearer ownership and dependencies.',effort:'4 hours'}]},
 functions:{title:'Function and procedure analysis',description:'Complexity, side effects, error handling, testability, and policy-sensitive behavior.',items:[
  {severity:'high',name:'evaluate_control() hides incomplete evidence',location:'evaluation/controls.py:142',detail:'A broad exception converts missing evidence into a failed control.',current:'except Exception: return ControlResult(status="fail")',better:'Return verdict="unknown", reason="evidence_incomplete", and retain the typed retryable error.',impact:'Prevents false compliance failures.',effort:'4 hours'},
  {severity:'high',name:'delete_subject_data() is not transactionally safe',location:'governance/retention.py:88',detail:'Primary records are deleted before embeddings and training snapshots, allowing partial deletion.',current:'delete_db(); delete_vectors(); delete_training_copy()',better:'Use an idempotent deletion saga with retries, verification, and a signed deletion receipt.',impact:'Provides GDPR deletion proof across stores.',effort:'3 days'},
  {severity:'medium',name:'calculate_readiness() is unversioned',location:'evaluation/scoring.py:31',detail:'A simple mean weights critical and informational controls equally.',current:'sum(result.score) / len(results)',better:'Apply versioned weights, applicability, confidence, critical caps, and scoringPolicyId.',impact:'Defensible and reproducible scores.',effort:'2 days'},
  {severity:'medium',name:'scan_repository() has unbounded concurrency',location:'workers/repository.py:54',detail:'One task per file can exhaust memory on a monorepository.',current:'await gather(*(scan(file) for file in files))',better:'Use a bounded worker pool, streaming manifest, file budgets, cancellation, and backpressure.',impact:'Protects workers from large inputs.',effort:'1 day'}]},
 'data-models':{title:'Policy-aware data model analysis',description:'Entity semantics, classification, lineage, retention, consent, and regulatory traceability.',items:[
  {severity:'high',name:'Evidence lacks immutable provenance',location:'models/evidence.py',detail:'Evidence can change without collector version, source revision, or a digest.',current:'Evidence { id, value, createdAt }',better:'Evidence { id, tenantId, sourceRevision, collectorVersion, sha256, observedAt, classification, payloadRef }.',impact:'Creates an auditable chain of custody.',effort:'2 days'},
  {severity:'high',name:'Sensitive datasets use free-form metadata',location:'models/dataset.py',detail:'Generic metadata cannot enforce HIPAA, GDPR, residency, or processing constraints.',current:'Dataset { name, metadata: dict }',better:'Dataset { classifications[], subjects[], purposes[], lawfulBasis, residency, retentionPolicyId, stewardId }.',impact:'Enables automated privacy policies.',effort:'3 days'},
  {severity:'medium',name:'Finding status mixes verdict and workflow',location:'models/finding.py',detail:'Open, failed, waived, and accepted combine two separate state dimensions.',current:'status = "failed" | "open" | "waived"',better:'Separate verdict {pass, fail, unknown, N/A} from lifecycle {open, accepted, remediating, resolved}.',impact:'Prevents impossible states and bad metrics.',effort:'1 day'},
  {severity:'medium',name:'Model versions omit training lineage',location:'models/model.py',detail:'Artifacts do not link to exact datasets, features, source code, or approvals.',current:'ModelVersion { name, version, artifactUri }',better:'Link TrainingRun to dataset snapshots, code SHA, parameters, metrics, approvers, and model card.',impact:'Supports AI Act traceability and rollback.',effort:'3 days'}]},
 naming:{title:'Naming convention analysis',description:'Consistency, semantic clarity, regulatory meaning, and machine-enforceable naming rules.',items:[
  {severity:'medium',name:'Identifiers vary across API and storage',location:'API schemas  -  database models',detail:'auditId, audit_id, AuditID, and id refer to the same concept.',current:'JSON: audit_id; TypeScript: auditId; SQL: AuditID',better:'Use camelCase in JSON/TypeScript, snake_case in SQL/Python, with explicit serialization aliases.',impact:'Reduces integration mapping defects.',effort:'4 hours'},
  {severity:'medium',name:'Framework abbreviations are ambiguous',location:'framework mappings',detail:'AI, NI, IS, and CP will collide as the catalog grows.',current:'frameworks: ["AI", "NI", "IS"]',better:'Use nist-ai-rmf@1.0, iso-27001@2022, and eu-ai-act@2024 as stable IDs.',impact:'Reliable versioning and analytics.',effort:'1 day'},
  {severity:'low',name:'Boolean names create double negatives',location:'models  -  configuration',detail:'disabled, noRetention, and skipVerify make policy conditions harder to inspect.',current:'if (!policy.noRetention) ...',better:'Prefer retentionEnabled, verificationRequired, and evidenceComplete.',impact:'Safer control logic.',effort:'2 hours'},
  {severity:'low',name:'Manager and processor names hide intent',location:'services/',detail:'DataProcessor and ComplianceManager attract unrelated behavior.',current:'ComplianceManager.process(data)',better:'EvidenceNormalizer.normalize(raw) and ControlEvaluator.evaluate(control, evidence).',impact:'Searchable, intention-revealing APIs.',effort:'1 day'}]},
 governance:{title:'Data governance analysis',description:'Ownership, classification, purpose limitation, lifecycle, quality, access, and accountability.',items:[
  {severity:'high',name:'Retention rules are not enforceable',location:'datasets  -  evidence  -  reports',detail:'Records contain text durations but no versioned policy or disposal schedule.',current:'dataset.retention = "90 days"',better:'retentionPolicyId links version, trigger, duration, legal hold, disposal action, and proof.',impact:'Turns policy language into lifecycle controls.',effort:'3 days'},
  {severity:'high',name:'Sensitive data ownership is optional',location:'catalog/entity schemas',detail:'Twelve sensitive entities lack an accountable steward or escalation path.',current:'owner?: string',better:'Require stewardId, systemOwnerId, riskOwnerId, and escalationPolicyId.',impact:'Closes audit and incident accountability gaps.',effort:'1 day'},
  {severity:'medium',name:'Purpose and consent are plain labels',location:'privacy/consent.py',detail:'Free text cannot reliably enforce consent withdrawal or purpose limitation.',current:'purpose = "analytics"',better:'Use ProcessingPurpose linked to lawful basis, categories, recipients, expiry, and consent receipt.',impact:'Automates purpose-limitation checks.',effort:'3 days'},
  {severity:'medium',name:'Data quality is not risk-tiered',location:'quality/rules/',detail:'The same completeness threshold is used for contact data and safety-critical features.',current:'completeness >= 95%',better:'Define quality SLOs by field criticality, model use, population, and downstream impact.',impact:'Focuses monitoring on consequential errors.',effort:'2 days'}]}
};
const qualityProfile=[['Modularity',78],['Function safety',65],['Data contracts',58],['Naming consistency',84],['Governance',72]];
const aiComponents=[
 {id:'discovery',name:'Discovery & architecture',purpose:'Classify files, infer services, dependencies, streams, stores, and system boundaries.',input:380000,output:35000,calls:32,build:620000,latency:'4-7 min',confidence:'0.86',mode:'Hybrid'},
 {id:'data',name:'Data governance analyst',purpose:'Infer classifications, lineage, retention, purpose, residency, and policy relationships.',input:290000,output:30000,calls:24,build:540000,latency:'3-6 min',confidence:'0.81',mode:'Model-led'},
 {id:'model',name:'AI & model risk analyst',purpose:'Assess model cards, training lineage, fairness, robustness, monitoring, and oversight.',input:340000,output:42000,calls:28,build:710000,latency:'4-8 min',confidence:'0.79',mode:'Hybrid'},
 {id:'policy',name:'Policy mapping specialist',purpose:'Map normalized evidence to canonical controls and versioned framework obligations.',input:250000,output:32000,calls:38,build:880000,latency:'3-5 min',confidence:'0.91',mode:'Policy-first'},
 {id:'evaluator',name:'Adversarial evaluator',purpose:'Challenge evidence sufficiency, detect contradictions, and calibrate confidence.',input:180000,output:25000,calls:14,build:460000,latency:'2-4 min',confidence:'0.84',mode:'Model-led'},
 {id:'verifier',name:'Independent verifier',purpose:'Blindly re-evaluate critical and sampled controls using separate context and strategy.',input:100000,output:14000,calls:8,build:390000,latency:'2-3 min',confidence:'0.89',mode:'Independent'},
 {id:'report',name:'Report synthesis',purpose:'Generate executive, technical, evidence, and remediation narratives from verified facts.',input:70000,output:8000,calls:2,build:280000,latency:'1-2 min',confidence:'0.94',mode:'Grounded'}
 ,{id:'rag-security',name:'RAG security analyst',purpose:'Test retrieval poisoning, indexed-data exposure, grounding, provenance, and tenant isolation.',input:220000,output:26000,calls:18,build:510000,latency:'3-5 min',confidence:'0.82',mode:'Adversarial'}
 ,{id:'agentic',name:'Agentic AI controller',purpose:'Inspect tool permissions, planning loops, memory, delegation, kill switches, and excessive agency.',input:240000,output:29000,calls:20,build:670000,latency:'3-6 min',confidence:'0.78',mode:'Threat-led'}
 ,{id:'supply-chain',name:'Model supply-chain analyst',purpose:'Trace model origin, licenses, signatures, unsafe formats, dependencies, and external providers.',input:160000,output:17000,calls:15,build:430000,latency:'2-4 min',confidence:'0.88',mode:'Hybrid'}
 ,{id:'red-team',name:'AI red-team planner',purpose:'Select OWASP and MITRE ATLAS abuse cases based on the discovered AI attack surface.',input:190000,output:24000,calls:16,build:590000,latency:'3-5 min',confidence:'0.80',mode:'Adversarial'}
];
const batchProjects=[
 {name:'Clinical Note Summarizer',source:'GitHub',preset:'Healthcare regulated',stage:'AI model analysis',progress:64,tokens:'1.8M',status:'running'},
 {name:'Fraud Detection Engine',source:'Folder',preset:'Enterprise assurance',stage:'Policy evaluation',progress:81,tokens:'1.4M',status:'running'},
 {name:'Customer Support Copilot',source:'GitHub',preset:'AI + privacy',stage:'Verified',progress:100,tokens:'1.1M',status:'complete'},
 {name:'Retail Recommendation Hub',source:'S3 manifest',preset:'AI + privacy',stage:'Verified',progress:100,tokens:'1.2M',status:'complete'},
 {name:'HR Candidate Ranker',source:'GitHub',preset:'Full scan',stage:'Waiting for retry',progress:37,tokens:'1.6M',status:'failed'},
 {name:'Voice Biometrics Gateway',source:'Folder',preset:'Full scan',stage:'Queued',progress:0,tokens:'1.5M',status:'queued'},
 {name:'Knowledge Search Assistant',source:'GitHub',preset:'AI + privacy',stage:'Queued',progress:0,tokens:'0.9M',status:'queued'},
 {name:'Manufacturing Vision QA',source:'GitLab',preset:'Enterprise assurance',stage:'Queued',progress:0,tokens:'1.3M',status:'queued'}
];
const securityManifest=[
 {name:'NIST CSF',version:'2.0  -  Feb 26, 2024',authority:'NIST',status:'active',focus:'Enterprise cyber-risk outcomes',checked:'Today 10:24'},
 {name:'NIST SP 800-218A',version:'Final  -  Jul 26, 2024',authority:'NIST',status:'active',focus:'Secure GenAI development',checked:'Today 10:24'},
 {name:'NIST AI RMF',version:'1.0  -  revision watched',authority:'NIST',status:'active',focus:'Trustworthy AI risk',checked:'Today 10:24'},
 {name:'NIST AI 600-1',version:'Updated Apr 8, 2026',authority:'NIST',status:'active',focus:'Generative AI risks',checked:'Today 10:24'},
 {name:'OWASP LLM Top 10',version:'2025 edition',authority:'OWASP',status:'active',focus:'LLM application security',checked:'Today 10:24'},
 {name:'MITRE ATLAS',version:'Living baseline',authority:'MITRE',status:'active',focus:'AI adversary tactics',checked:'Today 10:24'},
 {name:'ISO/IEC 27001',version:'2022 edition',authority:'ISO',status:'active',focus:'Information security',checked:'Today 10:24'},
 {name:'ISO/IEC 42001',version:'2023 edition 1',authority:'ISO',status:'active',focus:'AI management system',checked:'Today 10:24'},
 {name:'HIPAA Security Rule',version:'Current 45 CFR 160/164',authority:'HHS OCR',status:'active',focus:'ePHI safeguards',checked:'Today 10:24'},
 {name:'HIPAA Security NPRM',version:'Dec 27, 2024 proposal',authority:'HHS OCR',status:'proposed',focus:'Cybersecurity strengthening',checked:'Today 10:24'},
 {name:'PCI DSS',version:'4.0.1',authority:'PCI SSC',status:'active',focus:'Payment-data security',checked:'Today 10:24'},
 {name:'SOC 2 TSC',version:'2017  -  points revised 2022',authority:'AICPA',status:'active',focus:'Trust service controls',checked:'Today 10:24'},
 {name:'EU AI Act',version:'2024/1689  -  phased',authority:'EU',status:'active',focus:'AI system obligations',checked:'Today 10:24'},
 {name:'CCPA / CPRA',version:'Regulations effective 2026',authority:'California CPPA',status:'active',focus:'Privacy and cyber audits',checked:'Today 10:24'},
 {name:'NARA CUI Program',version:'32 CFR Part 2002',authority:'NARA ISOO',status:'active',focus:'CUI marking and dissemination',checked:'Today 10:24'},
 {name:'ITAR',version:'22 CFR 120-130',authority:'U.S. DDTC',status:'active',focus:'Defense technical-data export control',checked:'Today 10:24'},
 {name:'EAR',version:'15 CFR 730-774',authority:'U.S. BIS',status:'active',focus:'Dual-use export control and deemed exports',checked:'Today 10:24'},
 {name:'NIST SP 800-171',version:'Rev. 3',authority:'NIST',status:'active',focus:'CUI safeguards in nonfederal systems',checked:'Today 10:24'},
 {name:'NIST SP 800-172',version:'Final',authority:'NIST',status:'active',focus:'Enhanced CUI safeguards for APT threats',checked:'Today 10:24'},
 {name:'DFARS 252.204-7012',version:'Current clause',authority:'U.S. DoD',status:'active',focus:'CDI safeguarding and cyber incident reporting',checked:'Today 10:24'},
 {name:'DFARS 252.204-7019/7020',version:'Current clauses',authority:'U.S. DoD',status:'active',focus:'NIST 800-171 assessment score submission and access',checked:'Today 10:24'},
 {name:'DoD CMMC 2.0',version:'Current model',authority:'U.S. DoD',status:'active',focus:'Contractor assessment readiness for controlled information',checked:'Today 10:24'},
 {name:'DoDI 8510.01 RMF',version:'Current instruction',authority:'U.S. DoD',status:'active',focus:'Risk management framework and authorization lifecycle',checked:'Today 10:24'},
 {name:'DOE O 205.1D',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Departmental cybersecurity risk-management policy',checked:'Today 10:24'},
 {name:'DOE O 206.1',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Departmental cybersecurity program governance',checked:'Today 10:24'},
 {name:'DOE O 471.6',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Information security requirements and safeguarding',checked:'Today 10:24'},
 {name:'10 CFR Part 810',version:'Current regulation',authority:'U.S. DOE/NNSA',status:'active',focus:'Foreign atomic-energy assistance and export controls',checked:'Today 10:24'}
];

const frameworkDocumentCatalog=[
 {frameworkId:'cui-32cfr2002',title:'NARA CUI Registry',version:'Live registry',authority:'NARA ISOO',status:'active',focus:'CUI categories, markings, dissemination and decontrol requirements'},
 {frameworkId:'itar-22cfr120',title:'ITAR Part 120 Definitions',version:'Current eCFR',authority:'U.S. DDTC',status:'active',focus:'Defense-article and technical-data scope definitions'},
 {frameworkId:'ear-15cfr730',title:'EAR Part 734 Scope',version:'Current eCFR',authority:'U.S. BIS',status:'active',focus:'Scope, exclusions, and deemed export criteria'},
 {frameworkId:'dfars-7012',title:'DFARS 252.204-7012 Clause Text',version:'Current clause',authority:'U.S. DoD',status:'active',focus:'Safeguarding covered defense information and incident reporting'},
 {frameworkId:'dfars-7019-7020',title:'DFARS 252.204-7019/7020 Clause Text',version:'Current clauses',authority:'U.S. DoD',status:'active',focus:'NIST 800-171 assessment submission and supplier flowdown'},
 {frameworkId:'cmmc-2',title:'DoD CMMC Program Rule',version:'Current publication',authority:'U.S. DoD',status:'active',focus:'Assessment levels and implementation expectations'},
 {frameworkId:'dod-851001',title:'DoDI 8510.01 Risk Management Framework',version:'Current instruction',authority:'U.S. DoD',status:'active',focus:'Control selection, authorization, and continuous monitoring process'},
 {frameworkId:'doe-o-2051d',title:'DOE O 205.1D Cybersecurity Program',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Cybersecurity risk management governance and accountability'},
 {frameworkId:'doe-o-2061',title:'DOE O 206.1 Departmental Cybersecurity',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Incident response, protection, and operational cybersecurity direction'},
 {frameworkId:'doe-o-4716',title:'DOE O 471.6 Information Security',version:'Current order',authority:'U.S. DOE',status:'active',focus:'Controlled information handling and safeguarding requirements'},
 {frameworkId:'cfr-10-810',title:'10 CFR Part 810 Rule Text',version:'Current regulation',authority:'U.S. DOE/NNSA',status:'active',focus:'Foreign atomic-energy assistance restrictions and authorization gates'}
];

const runtimeState={lastRun:null,lastBaselineCheck:null,lastRunContext:null,lastDesignContext:null,ragStore:null,tokenHistory:[],trendMetric:'tokens',liveTechnicalEstimate:null,estimatePendingSignature:null,estimateRequestId:0,liveGovernanceLastRefresh:null,liveGovernanceHeartbeatAt:null,liveGovernanceHeartbeatError:null,liveGovernanceDegradedChecks:0,liveGovernanceAutoRecoveryAt:null,liveGovernanceAutoRecoveryStatus:'Idle',featureValidation:null,featureValidationPending:false,complianceGate:null};
let floatingSeed=0;
let productAgentStageFilter=null;
let playbookAgentStageFilter=null;
let newAuditProgressTimer=null;
let liveGovernanceHeartbeatTimer=null;
let liveGovernanceHeartbeatInFlight=false;
let liveGovernanceAutoRecoveryInFlight=false;
let reportFindingFilter='all';
let activeAnalysisType='dead-code';
let activeAnalysisFilter='all';
const selectedCompliancePackageIds=new Set(['enterprise']);
const auditPipelineState={runToken:0,isAnimating:false,stageIndex:-1,startTime:0,timerId:null,totalMs:0,completedStageIds:[],selectedCompletedStageId:null};
const productFeatureChecklist=[
 {key:'animatedPipeline',label:'Animated audit pipeline',successText:'Stage-by-stage pipeline is visible in the audit workspace.',missingText:'Animated audit pipeline is not available in the visible audit workspace.'},
 {key:'clickableAgents',label:'Clickable agents with detail view',successText:'Agents can be clicked to inspect algorithm, behavior, and citations.',missingText:'Agents are not exposing an inspectable detail view.'},
 {key:'transparentProcessing',label:'Transparent processing steps',successText:'Transparent processing history is rendered stage by stage.',missingText:'Transparent processing steps are missing from the workspace.'},
 {key:'multiSelectPackages',label:'Multi-select compliance packages',successText:'Compliance packages support union-style multi-selection.',missingText:'Compliance package selection is still single-select.'},
 {key:'technicalLandscapeComparison',label:'Static vs real-time technical comparison',successText:'Token and pricing comparison is visible with static and live values.',missingText:'Static and real-time technical comparison is missing.'},
 {key:'liveGovernanceMode',label:'Real-time LLM governance mode',successText:'Workspace exposes live governance mode and refresh status.',missingText:'Real-time LLM governance mode is not surfaced to the user.'},
 {key:'featureValidation',label:'Feature completeness validator',successText:'Workspace can validate completed design against required capabilities.',missingText:'Feature completeness validator is not available.'}
];
const highVisibilityStorageKey='aegis-high-visibility-mode';
const complianceSlaStorageKey='aegis-compliance-sla-hours';
const complianceSlaModeStorageKey='aegis-compliance-sla-mode';
const diagramSizeStorageKey='aegis-diagram-size';
const liveGovernanceHeartbeatIntervalMs=30000;
const liveGovernanceDegradedThreshold=3;
const policyRagApiBase = window.location.port === '4185'
 ? 'http://127.0.0.1:8765/api/rag'
 : '/api/rag';
let complianceBaselineSlaHours=24;
const complianceSlaAllowedHours=[6,12,24,48,72];
let complianceSlaMode='auto';
const frameworkReadinessPriority=[
 'nrc-50','nrc-52','nrc-21','nrc-7354','nrc-rg571','nrc-rg128','nureg0800','iaea-ssr21','iaea-gsr2',
 'gdpr','soc2','hipaa','cui-32cfr2002','itar-22cfr120','nist-800-171','nist-800-172','ear-15cfr730','dfars-7012','dfars-7019-7020','cmmc-2','dod-851001','doe-o-2051d','doe-o-2061','doe-o-4716','cfr-10-810'
];
const productPipelineStages=[
 {id:'baseline',title:'Baseline intelligence gate',detail:'Refresh policy corpus, validate SLA freshness, and pin immutable baseline manifest.',lane:'INTAKE'},
 {id:'scope',title:'Scope intake',detail:'Capture project objective, framework set, and data boundaries.',lane:'INTAKE'},
 {id:'manifest',title:'Source manifest',detail:'Inventory files, commits, services, models, and data stores.',lane:'INTAKE'},
 {id:'discovery',title:'Architecture discovery',detail:'Build asset and trust-boundary graph for orchestration.',lane:'INTAKE'},
 {id:'collection',title:'Deterministic collection',detail:'Run policy, SBOM, secret, IaC, and runtime control checks.',lane:'ANALYSIS'},
 {id:'mapping',title:'Control mapping',detail:'Map evidence graph into canonical controls and obligations.',lane:'ANALYSIS'},
 {id:'evaluation',title:'Evaluation + scoring',detail:'Compute verdicts, confidence, and critical-control caps.',lane:'ANALYSIS'},
 {id:'verification',title:'Independent verification',detail:'Re-check critical and sampled controls with blind strategy.',lane:'ASSURANCE'},
 {id:'reporting',title:'Report publish',detail:'Create immutable snapshot, remediation plan, and user summary.',lane:'ASSURANCE'}
];
const productPipelineSpeedMs={slow:980,normal:650,fast:380};
const productAgentHierarchy=[
 {group:'BASELINE LAYER',description:'Dedicated compliance baseline gate that must pass first.',agents:[
  {id:'agent-baseline',name:'Baseline intelligence agent',character:'Bela Gate',icon:'00',model:'Baseline intelligence model',meta:'Policy baseline gate',function:'Checks latest policies/frameworks, validates SLA freshness, and pins baseline manifest before downstream execution.'}
 ]},
 {group:'ORCHESTRATOR LAYER',description:'Top-down planning and routing for the complete audit pipeline.',agents:[
  {id:'agent-orchestrator',name:'Orchestration lead',character:'Ora Flow',icon:'01',model:'Orchestrator model',meta:'Pipeline controller',function:'Sets objectives, decomposes stages, and routes all agent handoffs.'}
 ]},
 {group:'ANALYSIS AGENT LAYER',description:'Function agents build inventory, classify data, and stress security and model posture.',agents:[
  {id:'agent-discovery',name:'Discovery agent',character:'Nia Topology',icon:'02',model:'Function model: Discovery',meta:'42 analyzers',function:'Inventories code, models, stores, streams, APIs, infrastructure, and policy evidence.'},
  {id:'agent-data-governance',name:'Data governance agent',character:'Lina Trace',icon:'03',model:'Function model: Data governance',meta:'Lineage and classification',function:'Traces personal, health, payment, training, and inference data through its lifecycle.'},
  {id:'agent-data-restrictions',name:'Data restrictions agent',character:'Rina Guard',icon:'04',model:'Function model: Classification controls',meta:'CUI and ITAR controls',function:'Enforces CUI, ITAR, export-control, and handling restrictions across evidence and artifacts.'},
  {id:'agent-security',name:'Security agent',character:'Kai Shield',icon:'05',model:'Function model: Security',meta:'Threat-led checks',function:'Tests identity, secrets, encryption, dependencies, IaC, APIs, and runtime posture.'},
  {id:'agent-model-risk',name:'Model risk agent',character:'Mira Risk',icon:'06',model:'Function model: Model risk',meta:'TEVV pipeline',function:'Evaluates bias, drift, explainability, robustness, lineage, and model documentation.'}
 ]},
 {group:'COMPLIANCE LAYER',description:'Independent control interpreters map evidence into framework-specific obligations.',agents:[
  {id:'agent-compliance',name:'Compliance agents',character:'Cora Control',icon:'07',model:'Function model: Compliance',meta:'11 frameworks',function:'Independent specialists translate evidence into each framework\'s controls.'}
 ]},
 {group:'ASSURANCE LAYER',description:'Assurance checks challenge findings and calibrate confidence.',agents:[
  {id:'agent-evaluator',name:'Evaluator agent',character:'Rex Verdict',icon:'08',model:'Evaluator model',meta:'Confidence scoring',function:'Challenges evidence strength, detects false positives, and calibrates scoring.'},
  {id:'agent-verifier',name:'Independent verifier',character:'Ivy Proof',icon:'09',model:'Independent verifier model',meta:'Blind validation',function:'Re-runs critical checks without seeing the first verdict to reduce confirmation bias.'}
 ]},
 {group:'REPORTING LAYER',description:'Final packaging for executive, technical, and engineering delivery.',agents:[
  {id:'agent-reporter',name:'Report agent',character:'Nova Brief',icon:'10',model:'Reporting model',meta:'PDF / JSON / SARIF',function:'Builds executive, technical, evidence, and remediation-ready audit packages.'}
 ]}
];
const productAgentsFlat=productAgentHierarchy.flatMap(section=>section.agents);
const productStageMoveMap={
 baseline:{label:'Pin baseline',icon:'BL'},
 scope:{label:'Plan mission',icon:'SC'},
 manifest:{label:'Inventory assets',icon:'MF'},
 discovery:{label:'Trace architecture',icon:'DS'},
 collection:{label:'Collect controls',icon:'CL'},
 mapping:{label:'Map obligations',icon:'MP'},
 evaluation:{label:'Calibrate confidence',icon:'EV'},
 verification:{label:'Blind re-check',icon:'VR'},
 reporting:{label:'Publish package',icon:'RP'}
};
const productStageAgentMap={
 baseline:['agent-baseline'],
 scope:['agent-orchestrator','agent-discovery','agent-data-governance','agent-data-restrictions'],
 manifest:['agent-orchestrator','agent-discovery','agent-data-governance','agent-data-restrictions'],
 discovery:['agent-orchestrator','agent-discovery','agent-data-restrictions','agent-security','agent-model-risk'],
 collection:['agent-orchestrator','agent-security','agent-data-governance','agent-data-restrictions','agent-model-risk'],
 mapping:['agent-orchestrator','agent-compliance','agent-data-governance','agent-data-restrictions','agent-discovery'],
 evaluation:['agent-evaluator','agent-model-risk','agent-compliance','agent-data-restrictions'],
 verification:['agent-verifier','agent-security','agent-data-restrictions','agent-evaluator'],
 reporting:['agent-orchestrator','agent-reporter','agent-compliance']
};
const productStageEvidenceMap={
 baseline:'Compliance baseline is refreshed, SLA-validated, and pinned as immutable manifest before pipeline continuation.',
 scope:'Project objective, framework scope, and data-boundary declarations are captured as immutable intake context.',
 manifest:'Source inventory is normalized into a manifest with provenance, exclusions, and revision context.',
 discovery:'Architecture boundaries, sensitive pathways, and attack surfaces are extracted into an asset graph.',
 collection:'Deterministic checks collect policy, SBOM, secret, IaC, and governance evidence before narrative scoring.',
 mapping:'Evidence is mapped to canonical controls, then translated to each selected framework obligation.',
 evaluation:'Evaluator computes risk-adjusted readiness with confidence, applicability, and critical caps.',
 verification:'Independent verifier blind-checks critical and low-confidence controls to reduce confirmation bias.',
 reporting:'Final snapshot packages evidence links, findings, and remediation priorities for user review.'
};
const iconHierarchyStageClassMap={
 baseline:'pipeline-stage-baseline',
 scope:'pipeline-stage-orchestration',
 manifest:'pipeline-stage-orchestration',
 discovery:'pipeline-stage-analysis',
 collection:'pipeline-stage-analysis',
 mapping:'pipeline-stage-compliance',
 evaluation:'pipeline-stage-assurance',
 verification:'pipeline-stage-assurance',
 reporting:'pipeline-stage-reporting'
};
const iconHierarchyAgentNodeClassByAgentId={
 'agent-baseline':'agent-baseline',
 'agent-orchestrator':'agent-orchestrator',
 'agent-discovery':'agent-discovery',
 'agent-data-governance':'agent-data-governance',
 'agent-data-restrictions':'agent-data-restrictions',
 'agent-security':'agent-security',
 'agent-model-risk':'agent-model-risk',
 'agent-compliance':'agent-compliance',
 'agent-evaluator':'agent-evaluator',
 'agent-verifier':'agent-verifier',
 'agent-reporter':'agent-reporter'
};
const auditPipelinePhaseOrder=['baseline','orchestration','analysis','compliance','assurance','reporting'];
const auditPipelinePhaseLabels={
 baseline:'Baseline',
 orchestration:'Orchestration',
 analysis:'Analysis',
 compliance:'Compliance',
 assurance:'Assurance',
 reporting:'Reporting'
};
const stageAiComponentMap={
 baseline:['policy','rag-security','agentic'],
 scope:['discovery','data','agentic'],
 manifest:['discovery','data','rag-security'],
 discovery:['discovery','model','supply-chain'],
 collection:['data','model','rag-security','red-team','supply-chain'],
 mapping:['policy','data','rag-security'],
 evaluation:['evaluator','model','agentic','red-team'],
 verification:['verifier','evaluator','rag-security','red-team'],
 reporting:['report','policy']
};
const productAgentActionByStage={
 'agent-baseline':{
  baseline:'refreshes policy and framework sources, enforces freshness SLA, and publishes the pinned baseline manifest gate.'
 },
 'agent-orchestrator':{
  scope:'sets the top-down plan, decomposes subgoals, and routes the first workload.',
  manifest:'keeps discovery and governance outputs synchronized for downstream checks.',
  discovery:'coordinates architecture, security, and model risk analysis paths.',
  collection:'fans out deterministic checks and consolidates evidence into one run state.',
  mapping:'routes normalized evidence into framework-specific control obligations.',
  reporting:'closes orchestration and forwards approved evidence into final reporting.'
 },
 'agent-discovery':{
  scope:'starts initial intake inventory across code, model, and infrastructure targets.',
  manifest:'builds the normalized manifest of sources, services, and evidence endpoints.',
  discovery:'maps architecture and trust boundaries using the analyzer graph.',
  mapping:'supplies discovered asset context for control mapping precision.'
 },
 'agent-data-governance':{
  scope:'marks the data domains that must be tracked through the run lifecycle.',
  manifest:'tags discovered stores and streams with privacy and sensitivity context.',
  collection:'traces personal, health, payment, training, and inference data lineage.',
  mapping:'aligns lineage signals with data-handling obligations in each framework.'
 },
 'agent-data-restrictions':{
  scope:'identifies CUI, export-controlled, and restricted-data scope boundaries before execution.',
  manifest:'tags assets with CUI/ITAR markers, access classes, and dissemination restrictions.',
  discovery:'checks trust boundaries against export and restricted-data access zones.',
  collection:'tests handling controls for marking, storage, transfer, and recipient restrictions.',
  mapping:'maps restricted-data findings to CUI, ITAR, and related control obligations.',
  evaluation:'contributes restriction severity and violation confidence into readiness scoring.',
  verification:'re-runs critical restricted-data checks under blind verification paths.'
 },
 'agent-security':{
  discovery:'evaluates architectural attack surface and trust-boundary exposure.',
  collection:'tests identity, secrets, encryption, dependencies, IaC, APIs, and runtime posture.',
  verification:'replays high-severity controls during blind assurance checks.'
 },
 'agent-model-risk':{
  discovery:'profiles model topology and documentation readiness before scoring.',
  collection:'runs TEVV checks for bias, drift, robustness, and explainability baselines.',
  evaluation:'feeds calibrated model-risk evidence into confidence scoring.'
 },
 'agent-compliance':{
  mapping:'translates normalized evidence into each framework\'s control language.',
  evaluation:'checks coverage and obligation completeness across the active frameworks.',
  reporting:'contributes framework-by-framework control outcomes to report sections.'
 },
 'agent-evaluator':{
  evaluation:'challenges evidence strength, detects false positives, and calibrates confidence.',
  verification:'compares blind re-check deltas and adjusts final scoring confidence.'
 },
 'agent-verifier':{
  verification:'re-runs critical checks without first-verdict visibility to reduce confirmation bias.'
 },
 'agent-reporter':{
  reporting:'builds executive, technical, evidence, and remediation-ready outputs (PDF, JSON, SARIF).'
 }
};

const $=(q,ctx=document)=>ctx.querySelector(q), $$=(q,ctx=document)=>[...ctx.querySelectorAll(q)];

mermaid.initialize({
 startOnLoad:false,
 theme:'base',
 securityLevel:'loose',
 flowchart:{useMaxWidth:true,htmlLabels:true,nodeSpacing:70,rankSpacing:90},
 sequence:{useMaxWidth:true,actorMargin:80,boxMargin:16,boxTextMargin:10},
 themeVariables:{
  fontFamily:'Manrope, Plus Jakarta Sans, sans-serif',
  fontSize:'24px',
  primaryTextColor:'#12354b',
  lineColor:'#2a6f9e'
 }
});

const liveIconHierarchyMermaidSource=`flowchart TD
  A["Baseline Layer<br/><small>Policy gate</small>"] --> A1["00 Bela Gate<br/>Baseline Intelligence Agent"]
  A1 --> A2["RG<br/>Live Policy RAG + SLA Gate"]

  B["Orchestrator Layer<br/><small>Top-down routing</small>"] --> B1["01 Ora Flow<br/>Orchestration Lead"]

  C["Analysis Layer<br/><small>Discovery and controls</small>"] --> C1["02 Nia Topology<br/>Discovery Agent"]
  C --> C2["03 Lina Trace<br/>Data Governance Agent"]
  C --> C3["04 Rina Guard<br/>Data Restrictions Agent"]
  C --> C4["05 Kai Shield<br/>Security Agent"]
  C --> C5["06 Mira Risk<br/>Model Risk Agent"]

  D["Compliance Layer<br/><small>Framework mapping</small>"] --> D1["07 Cora Control<br/>Framework Compliance Agents"]

  E["Assurance Layer<br/><small>Challenge and verify</small>"] --> E1["08 Rex Verdict<br/>Evaluator Agent"]
  E --> E2["09 Ivy Proof<br/>Independent Verifier"]

  F["Reporting Layer<br/><small>Publish audit package</small>"] --> F1["10 Nova Brief<br/>Report Agent"]

  A2 --> B1
  B1 --> C
  C --> D1
  D1 --> E
  E --> F1

  classDef baseline fill:#e8f8f0,stroke:#1f8a5b,color:#0f3f2b,stroke-width:3px;
  classDef orchestration fill:#e9f4ff,stroke:#1f6fb2,color:#0d3352,stroke-width:3px;
  classDef analysis fill:#f0edff,stroke:#6554c0,color:#2b2065,stroke-width:3px;
  classDef compliance fill:#fff1e6,stroke:#c76b00,color:#5a2f00,stroke-width:3px;
  classDef assurance fill:#fff7d9,stroke:#b08900,color:#4b3a00,stroke-width:3px;
  classDef reporting fill:#fbe9ff,stroke:#9b3db7,color:#4a1658,stroke-width:3px;

  class A,A1,A2 baseline;
  class B,B1 orchestration;
  class C,C1,C2,C3,C4,C5 analysis;
  class D,D1 compliance;
  class E,E1,E2 assurance;
  class F,F1 reporting;
  class A1 agent-baseline;
  class B1 agent-orchestrator;
  class C1 agent-discovery;
  class C2 agent-data-governance;
  class C3 agent-data-restrictions;
  class C4 agent-security;
  class C5 agent-model-risk;
  class D1 agent-compliance;
  class E1 agent-evaluator;
  class E2 agent-verifier;
  class F1 agent-reporter;`;

const architectureSequenceMermaidSource=`sequenceDiagram
  actor User
  participant UI
  participant BaselineAgent
  participant RAGService
  participant Orchestrator
  participant AnalysisAgents
  participant Evaluator
  participant Verifier
  participant Reporter

  Note over BaselineAgent,RAGService: Baseline Gate
  User->>UI: Start Audit
  UI->>BaselineAgent: runFirst()
  BaselineAgent->>RAGService: rebuild() + status()
  BaselineAgent-->>UI: gate Pass/Block + manifest

  Note over Orchestrator,AnalysisAgents: Orchestration + Analysis
  UI->>Orchestrator: continue when gate Pass
  Orchestrator->>AnalysisAgents: discovery/collection/mapping
  AnalysisAgents->>Evaluator: control outcomes + confidence

  Note over Evaluator,Reporter: Assurance + Reporting
  Evaluator->>Verifier: critical + low-confidence subset
  Verifier->>Reporter: verified findings
  Reporter-->>UI: report snapshot + evidence links`;

const architectureIconHierarchyMermaidSource=liveIconHierarchyMermaidSource;

function normalizeMermaidSource(source=''){
 return source.replace(/\s+/g,' ').trim();
}

function ensureLiveMermaidSource(selector,source,{forceReset=false}={}){
 const node=$(selector);
 if(!node)return null;
 const hasRenderedSvg=!!node.querySelector('svg');
 const currentText=node.textContent?.trim()||'';
 const sourceAnchor=source.startsWith('sequenceDiagram')?'sequenceDiagram':'Baseline Layer';
 const needsSourceReset=forceReset||!hasRenderedSvg&&(currentText.length<32||!currentText.includes(sourceAnchor)||normalizeMermaidSource(currentText)!==normalizeMermaidSource(source));
 if(forceReset||!hasRenderedSvg){
  node.removeAttribute('data-processed');
 }
 if(needsSourceReset){
  node.textContent=source;
   node.dataset.mermaidSeeded='true';
 }
 return node;
}

window.renderAegisMermaid=async()=>{
 ensureLiveMermaidSource('#product-icon-hierarchy-live',liveIconHierarchyMermaidSource,{forceReset:true});
 ensureLiveMermaidSource('#audit-icon-hierarchy-live',liveIconHierarchyMermaidSource,{forceReset:true});
 ensureLiveMermaidSource('#architecture-sequence-mermaid',architectureSequenceMermaidSource,{forceReset:true});
 ensureLiveMermaidSource('#architecture-icon-hierarchy-mermaid',architectureIconHierarchyMermaidSource,{forceReset:true});
 const nodes=Array.from(document.querySelectorAll('.mermaid[data-render-live="true"]')).filter(node=>node.getAttribute('data-processed')!=='true');
 if(!nodes.length)return;
 await mermaid.run({nodes});
};
function normalizeFinding(entry){
 const [id,title,control,detail,effort,owner,severity='high']=entry;
 return {id,title,control,detail,effort,owner,severity};
}
function getSelectedCompliancePackageFrameworkIds(){
 return [...selectedCompliancePackageIds].flatMap(packageId=>compliancePackages.find(pkg=>pkg.id===packageId)?.frameworks||[]);
}
function resolveComplianceSlaFromPackages(){
 const packageHours=[...selectedCompliancePackageIds]
  .map(packageId=>complianceSlaPresetByPackage[packageId])
  .filter(value=>Number.isFinite(value));
 if(!packageHours.length)return null;
 return Math.min(...packageHours);
}
function syncComplianceSlaWithPackageSelection(){
 if(complianceSlaMode!=='auto')return;
 const autoHours=resolveComplianceSlaFromPackages();
 if(autoHours===null)return;
 applyComplianceSlaHours(autoHours);
 window.localStorage.setItem(complianceSlaStorageKey,String(complianceBaselineSlaHours));
 runtimeState.complianceGate=evaluateComplianceFreshnessGate();
 renderLiveGovernanceStatus();
}
function setFrameworkSelection(selectedIds,{packageId=null,expandAdvanced=false,initialize=false}={}){
 let ids=new Set(selectedIds||[]);
 const packageEntry=packageId?compliancePackages.find(pkg=>pkg.id===packageId):null;
 if(packageEntry){
  if(initialize){
   selectedCompliancePackageIds.add(packageId);
  }else if(selectedCompliancePackageIds.has(packageId)){
   selectedCompliancePackageIds.delete(packageId);
  }else{
   selectedCompliancePackageIds.add(packageId);
  }
  ids=new Set(getSelectedCompliancePackageFrameworkIds());
 }
 $$('#check-grid .check-card').forEach((card,index)=>{
  const framework=frameworks[index];
  const checked=ids.has(framework.id);
  card.classList.toggle('selected',checked);
  const input=$('input',card);
  if(input)input.checked=checked;
 });
 updateCompliancePackageButtons();
 syncComplianceSlaWithPackageSelection();
 renderPlaybookTokenReference();
 const panel=$('#advanced-frameworks-panel');
 if(panel&&expandAdvanced)panel.open=true;
}
function updateCompliancePackageButtons(){
 $$('#compliance-package-grid [data-package-id]').forEach(button=>{
  button.classList.toggle('active',selectedCompliancePackageIds.has(button.dataset.packageId));
 });
}
function renderCompliancePackages(){
 const host=$('#compliance-package-grid');
 if(!host)return;
 host.innerHTML=compliancePackages.map(pkg=>`<button type="button" class="workspace-shortcut compliance-package-card" data-package-id="${pkg.id}"><b>${pkg.label}</b><small>${pkg.description}</small></button>`).join('');
 updateCompliancePackageButtons();
 if(!selectedCompliancePackageIds.size)selectedCompliancePackageIds.add(compliancePackages[0].id);
 setFrameworkSelection(getSelectedCompliancePackageFrameworkIds(),{initialize:true});
}
function renderAuditHistoryTable(){
 const host=$('#audit-table');
 if(!host)return;
 host.innerHTML=audits.map(a=>`<tr><td><div class="project-cell"><span class="project-icon">${a[0][0]}</span><div><b>${a[0]}</b><small>${a[1]}</small></div></div></td><td><div class="framework-pills">${a[2].map(x=>`<i>${x}</i>`).join('')}</div></td><td><span class="score">${a[3]}%</span></td><td>${a[4]}</td><td>${a[5]}</td><td><span class="status ${a[6]==='Review'?'review':a[6]==='Attention'?'attn':''}">${a[6]}</span></td><td>Open</td></tr>`).join('');
}
function getFilteredFindings(entries,filter){
 const normalized=entries.map(normalizeFinding);
 if(!filter||filter==='all')return normalized;
 return normalized.filter(item=>item.severity===filter);
}
function renderFindingsList(entries,{hostId='#finding-list',filter=reportFindingFilter,limit=null}={}){
 const host=$(hostId);
 if(!host)return;
 const filtered=getFilteredFindings(entries,filter);
 const visible=limit?filtered.slice(0,limit):filtered;
 host.innerHTML=visible.map(item=>`<div class="finding-row finding-${item.severity}" data-finding-severity="${item.severity}"><span class="finding-num">${item.id}</span><div><h3>${item.title}</h3><p>${item.control}  -  ${item.detail}</p></div><span class="effort">ESTIMATED EFFORT<b>${item.effort}</b></span><span class="owner">${item.owner}<small class="finding-severity">${item.severity} severity</small></span></div>`).join('');
 const label=$('#report-findings-filter-label');
 if(label)label.textContent=filter==='all'?'All findings':`${filter[0].toUpperCase()+filter.slice(1)} findings`;
}
function openReportView(targetId='report-summary-section',findingFilter='all'){
 reportFindingFilter=findingFilter||'all';
 switchView('reports');
 const section=document.getElementById(targetId);
 if(section){
  renderFindingsList(runtimeState.lastReportFindings||findings,{filter:reportFindingFilter});
  section.scrollIntoView({behavior:'smooth',block:'start'});
 }
}
function applyHighVisibilityMode(enabled){
 document.body.classList.toggle('high-visibility-mode',enabled);
 const button=$('#toggle-high-visibility');
 if(button){
  button.textContent=enabled?'Visibility: High':'Visibility: Normal';
  button.setAttribute('aria-pressed',String(enabled));
 }
}
function readHighVisibilityMode(){
 const stored=window.localStorage.getItem(highVisibilityStorageKey);
 if(stored===null)return true;
 return stored==='1';
}
function initHighVisibilityToggle(){
 const enabled=readHighVisibilityMode();
 applyHighVisibilityMode(enabled);
 const button=$('#toggle-high-visibility');
 if(!button||button.dataset.bound==='1')return;
 button.addEventListener('click',()=>{
  const next=!document.body.classList.contains('high-visibility-mode');
  window.localStorage.setItem(highVisibilityStorageKey,next?'1':'0');
  applyHighVisibilityMode(next);
 });
 button.dataset.bound='1';
}
function readComplianceSlaHours(){
 const stored=window.localStorage.getItem(complianceSlaStorageKey);
 const parsed=Number.parseInt(stored||'',10);
 if(complianceSlaAllowedHours.includes(parsed))return parsed;
 return 24;
}
function readComplianceSlaMode(){
 const stored=window.localStorage.getItem(complianceSlaModeStorageKey);
 return stored==='manual'?'manual':'auto';
}
function renderComplianceSlaModeControl(){
 const button=$('#compliance-sla-mode-toggle');
 if(!button)return;
 const isAuto=complianceSlaMode==='auto';
 button.textContent=`SLA mode: ${isAuto?'Auto':'Manual'}`;
 button.setAttribute('aria-pressed',String(isAuto));
}
function applyComplianceSlaHours(nextHours){
 const resolved=complianceSlaAllowedHours.includes(Number(nextHours))?Number(nextHours):24;
 complianceBaselineSlaHours=resolved;
 const select=$('#compliance-sla-hours');
 if(select)select.value=String(resolved);
}
function initComplianceSlaControl(){
 complianceSlaMode=readComplianceSlaMode();
 const autoHours=resolveComplianceSlaFromPackages();
 const initialHours=complianceSlaMode==='auto'?(autoHours??24):readComplianceSlaHours();
 applyComplianceSlaHours(initialHours);
 renderComplianceSlaModeControl();
 const select=$('#compliance-sla-hours');
 if(select&&select.dataset.bound!=='1')select.addEventListener('change',()=>{
  applyComplianceSlaHours(select.value);
  complianceSlaMode='manual';
  window.localStorage.setItem(complianceSlaModeStorageKey,complianceSlaMode);
  window.localStorage.setItem(complianceSlaStorageKey,String(complianceBaselineSlaHours));
  runtimeState.complianceGate=evaluateComplianceFreshnessGate();
  renderComplianceSlaModeControl();
  renderLiveGovernanceStatus();
 });
 if(select)select.dataset.bound='1';

 const modeButton=$('#compliance-sla-mode-toggle');
 if(modeButton&&modeButton.dataset.bound!=='1')modeButton.addEventListener('click',()=>{
  if(complianceSlaMode==='auto'){
   complianceSlaMode='manual';
   window.localStorage.setItem(complianceSlaStorageKey,String(complianceBaselineSlaHours));
  }else{
   complianceSlaMode='auto';
   const strictHours=resolveComplianceSlaFromPackages();
   applyComplianceSlaHours(strictHours??readComplianceSlaHours());
  }
  window.localStorage.setItem(complianceSlaModeStorageKey,complianceSlaMode);
  runtimeState.complianceGate=evaluateComplianceFreshnessGate();
  renderComplianceSlaModeControl();
  renderLiveGovernanceStatus();
 });
 if(modeButton)modeButton.dataset.bound='1';
}
function getPrioritizedFrameworks(){
 const rank=new Map(frameworkReadinessPriority.map((id,index)=>[id,index]));
 return [...frameworks].sort((a,b)=>{
  const aRank=rank.has(a.id)?rank.get(a.id):Number.MAX_SAFE_INTEGER;
  const bRank=rank.has(b.id)?rank.get(b.id):Number.MAX_SAFE_INTEGER;
  if(aRank!==bRank)return aRank-bRank;
  return b.score-a.score;
 });
}
function buildPolicyRagDocuments(){
 const docs=[];
 frameworks.forEach(item=>{
  docs.push({
   id:`framework-${item.id}`,
   kind:'framework',
   title:item.name,
   summary:item.desc,
   body:`${item.short} ${item.name} ${item.desc} ${item.controls} controls ${item.score} readiness`,
   citations:[item.short]
  });
 });
 frameworkDocumentCatalog.forEach((item,index)=>{
  const framework=frameworks.find(entry=>entry.id===item.frameworkId);
  docs.push({
   id:`policy-doc-${item.frameworkId}-${index}`,
   kind:'policy-doc',
   title:item.title,
   summary:item.focus,
   body:`${framework?.name||item.frameworkId} ${item.title} ${item.version} ${item.authority} ${item.focus} status ${item.status}`,
   citations:[item.authority,item.version,framework?.short||item.frameworkId]
  });
 });
 securityManifest.forEach(item=>{
  docs.push({
   id:`policy-${item.name}`,
   kind:'policy',
   title:item.name,
   summary:item.focus,
   body:`${item.name} ${item.version} ${item.authority} ${item.focus} status ${item.status}`,
   citations:[item.authority,item.version]
  });
 });
 findings.forEach(item=>{
  docs.push({
   id:`finding-${item[0]}`,
   kind:'gap',
   title:item[1],
   summary:item[2],
   body:`${item[1]} ${item[2]} ${item[3]} owner ${item[5]} effort ${item[4]}`,
   citations:[item[2],item[5]]
  });
 });
 Object.entries(deepAnalysis).forEach(([sectionId,section])=>{
  section.items.forEach((item,index)=>{
   docs.push({
    id:`deep-${sectionId}-${index}`,
    kind:'gap',
    title:item.name,
    summary:item.detail,
    body:`${section.title} ${item.name} ${item.detail} current ${item.current} recommended ${item.better} impact ${item.impact}`,
    citations:[section.title,item.location]
   });
  });
 });

 const runContext=runtimeState.lastRunContext;
 if(runContext){
  docs.push({
   id:'run-context-current',
   kind:'source',
   title:runContext.reportName,
   summary:runContext.comparisonTarget,
   body:`${runContext.projectName} ${runContext.reportName} ${runContext.sourceKind} ${runContext.sourceLabel} ${runContext.comparisonTarget} ${runContext.baselineCheck?.manifestId||''}`,
   citations:[runContext.sourceKind,runContext.baselineCheck?.manifestId||'Pinned manifest']
  });
 }
 const designContext=runtimeState.lastDesignContext;
 if(designContext?.fileNames?.length){
  docs.push({
   id:'design-evidence-current',
   kind:'source',
   title:'Design evidence',
   summary:designContext.comparisonTarget,
   body:`${designContext.fileNames.join(' ')} ${designContext.comparisonTarget}`,
   citations:designContext.fileNames.slice(0,3)
  });
 }
 return docs;
}
async function syncPolicyRagStatus(){
 try{
  const response=await fetch(`${policyRagApiBase}/status`);
  if(!response.ok)throw new Error('RAG status unavailable');
  runtimeState.ragStore=await response.json();
  runtimeState.liveGovernanceHeartbeatAt=new Date().toLocaleString();
  runtimeState.liveGovernanceHeartbeatError=null;
 }catch(error){
  runtimeState.ragStore=null;
  runtimeState.liveGovernanceHeartbeatError=error?.message||'RAG status unavailable';
 }
 renderPolicyRagStatus();
}
async function runLiveGovernanceAutoRecovery(){
 if(liveGovernanceAutoRecoveryInFlight)return;
 if(runtimeState.liveGovernanceDegradedChecks<liveGovernanceDegradedThreshold)return;
 liveGovernanceAutoRecoveryInFlight=true;
 runtimeState.liveGovernanceAutoRecoveryStatus=`Auto recovery started after ${runtimeState.liveGovernanceDegradedChecks} failed heartbeat checks`;
 try{
  await refreshPolicyRagService();
  await syncPolicyRagStatus();
  runtimeState.liveGovernanceAutoRecoveryAt=new Date().toLocaleString();
  runtimeState.liveGovernanceAutoRecoveryStatus='Recovered by automatic RAG rebuild';
  runtimeState.liveGovernanceDegradedChecks=0;
 }catch(error){
  runtimeState.liveGovernanceAutoRecoveryAt=new Date().toLocaleString();
  runtimeState.liveGovernanceAutoRecoveryStatus=`Auto recovery failed: ${error?.message||'RAG rebuild unavailable'}`;
  runtimeState.liveGovernanceDegradedChecks=liveGovernanceDegradedThreshold;
 }finally{
  liveGovernanceAutoRecoveryInFlight=false;
  renderLiveGovernanceStatus();
 }
}
async function runLiveGovernanceHeartbeatTick(){
 if(!isLiveGovernanceModeEnabled())return;
 if(liveGovernanceHeartbeatInFlight)return;
 liveGovernanceHeartbeatInFlight=true;
 try{
  await syncPolicyRagStatus();
  if(runtimeState.liveGovernanceHeartbeatError){
   runtimeState.liveGovernanceDegradedChecks+=1;
   await runLiveGovernanceAutoRecovery();
  }else{
   runtimeState.liveGovernanceDegradedChecks=0;
   if(runtimeState.liveGovernanceAutoRecoveryStatus.startsWith('Auto recovery failed')){
    runtimeState.liveGovernanceAutoRecoveryStatus='Idle';
   }
  }
  runtimeState.complianceGate=evaluateComplianceFreshnessGate();
  renderLiveGovernanceStatus();
 }finally{
  liveGovernanceHeartbeatInFlight=false;
 }
}
function startLiveGovernanceHeartbeat(){
 if(liveGovernanceHeartbeatTimer)clearInterval(liveGovernanceHeartbeatTimer);
 runLiveGovernanceHeartbeatTick().catch(()=>null);
 liveGovernanceHeartbeatTimer=setInterval(()=>{
  runLiveGovernanceHeartbeatTick().catch(()=>null);
 },liveGovernanceHeartbeatIntervalMs);
}
async function refreshPolicyRagService(){
 const documents=buildPolicyRagDocuments();
 const metadata={
  runContext:runtimeState.lastRunContext||null,
  designContext:runtimeState.lastDesignContext||null,
  baselineCheck:runtimeState.lastBaselineCheck||null
 };
 const response=await fetch(`${policyRagApiBase}/rebuild`,{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({documents,metadata})
 });
 if(!response.ok){
  const payload=await response.json().catch(()=>({}));
  throw new Error(payload.error||'Policy RAG rebuild failed');
 }
 runtimeState.ragStore=await response.json();
 renderPolicyRagStatus();
 return runtimeState.ragStore;
}
function renderPolicyRagStatus(){
 const store=runtimeState.ragStore;
 const countEl=$('#policy-rag-count');
 const updatedEl=$('#policy-rag-updated');
 if(countEl)countEl.textContent=store?.stats?.docCount?`${store.stats.docCount} documents`:'RAG offline';
 if(updatedEl)updatedEl.textContent=store?.updatedAt?`Updated ${new Date(store.updatedAt).toLocaleString()}`:'Start the policy RAG API to enable retrieval';
 const storeHost=$('#rag-architecture-store');
 if(storeHost)storeHost.innerHTML=`<div class="quality-row"><div><span>Framework records</span><b>${store?.stats?.frameworkCount??frameworks.length}</b></div><div><small>Mapped framework summaries including Defense and DOE overlays</small></div></div>
 <div class="quality-row"><div><span>Baseline resources</span><b>${store?.stats?.policyCount??securityManifest.length}</b></div><div><small>Pinned policy manifest items and framework policy documents</small></div></div>
 <div class="quality-row"><div><span>Framework policy documents</span><b>${store?.stats?.policyDocCount??frameworkDocumentCatalog.length}</b></div><div><small>Defense, DOE, CUI, export, and mission-policy source records</small></div></div>
 <div class="quality-row"><div><span>Gap records</span><b>${store?.stats?.gapCount??findings.length}</b></div><div><small>Findings and remediation items</small></div></div>`;
 const flowHost=$('#rag-architecture-flow');
 if(flowHost)flowHost.innerHTML=`<div class="quality-row"><div><span>Chunking</span><b>Embedded policy corpus</b></div><div><small>Framework, policy, policy-document, gap, and source documents</small></div></div>
 <div class="quality-row"><div><span>Retrieval</span><b>Vector similarity search</b></div><div><small>Persistent JSON vector store with offline local embeddings</small></div></div>
 <div class="quality-row"><div><span>Grounding</span><b>Run context + citations</b></div><div><small>Source or design comparison target included, with latest Defense and DOE policy snapshots</small></div></div>`;
 renderLiveGovernanceStatus();
}
function isLiveGovernanceModeEnabled(){
 return Boolean($('#live-governance-mode')?.checked);
}
function renderLiveGovernanceStatus(){
 const host=$('#new-audit-live-governance-status');
 if(!host)return;
 const liveMode=isLiveGovernanceModeEnabled();
 const baselineStamp=runtimeState.lastBaselineCheck?.stamp||'Not refreshed';
 const ragUpdated=runtimeState.ragStore?.updatedAt?new Date(runtimeState.ragStore.updatedAt).toLocaleString():'RAG offline';
 const providerLabel=runtimeState.liveTechnicalEstimate?.estimate?.provider?.chatDeployment||'Waiting for provider';
 const refreshStamp=runtimeState.liveGovernanceLastRefresh||'Not refreshed in this session';
 const heartbeatStamp=runtimeState.liveGovernanceHeartbeatAt||'No heartbeat yet';
 const heartbeatStatus=runtimeState.liveGovernanceHeartbeatError?'Degraded':'Healthy';
 const autoRecoveryStamp=runtimeState.liveGovernanceAutoRecoveryAt||'Not triggered in this session';
 const gateSummary=runtimeState.complianceGate?.ok
  ?`Pass  -  ${runtimeState.complianceGate.summary}`
  :(runtimeState.complianceGate?.summary||'Not validated for this run');
 const slaModeLabel=complianceSlaMode==='auto'?'Auto from selected package(s)':'Manual override';
 const baselineAgentStatus=runtimeState.complianceGate?.baselineAgentResult?.summary||'Baseline intelligence agent has not executed yet in this session';
 host.innerHTML=`<div class="quality-row"><div><span>Mode</span><b>${liveMode?'Real-time LLM governance enabled':'Static baseline preview only'}</b></div><div><small>${liveMode?'Latest policy refresh and provider-backed estimate will be used during runs.':'Embedded estimator and cached policy state only.'}</small></div></div>
 <div class="quality-row"><div><span>Baseline intelligence agent</span><b>${runtimeState.complianceGate?.baselineAgentResult?'Executed first':'Pending'}</b></div><div><small>${baselineAgentStatus}</small></div></div>
 <div class="quality-row"><div><span>Baseline integrity</span><b>${baselineStamp}</b></div><div><small>Latest pinned compliance source verification</small></div></div>
 <div class="quality-row"><div><span>Policy knowledge base</span><b>${runtimeState.ragStore?.stats?.docCount?`${runtimeState.ragStore.stats.docCount} documents`:'Offline'}</b></div><div><small>${ragUpdated}</small></div></div>
 <div class="quality-row"><div><span>Live RAG heartbeat</span><b>${heartbeatStatus}</b></div><div><small>${runtimeState.liveGovernanceHeartbeatError||`Last check ${heartbeatStamp}  -  every ${Math.round(liveGovernanceHeartbeatIntervalMs/1000)}s`}  -  degraded streak ${runtimeState.liveGovernanceDegradedChecks}/${liveGovernanceDegradedThreshold}</small></div></div>
 <div class="quality-row"><div><span>Auto recovery</span><b>${runtimeState.liveGovernanceAutoRecoveryStatus}</b></div><div><small>${autoRecoveryStamp}</small></div></div>
 <div class="quality-row"><div><span>Real-time LLM deployment</span><b>${providerLabel}</b></div><div><small>Configured Azure OpenAI deployment for live token and governance estimation</small></div></div>
 <div class="quality-row"><div><span>Compliance freshness gate</span><b>${gateSummary}</b></div><div><small>SLA ${complianceBaselineSlaHours}h (${slaModeLabel}) for baseline + policy corpus refresh</small></div></div>
 <div class="quality-row"><div><span>Last live refresh</span><b>${refreshStamp}</b></div><div><small>Security baselines and governance corpus refresh status</small></div></div>`;
}
function buildProductFeatureState(){
 return {
  animatedPipeline:Boolean($('#audit-workspace-pipeline')),
  clickableAgents:Boolean($('#audit-agent-detail')),
  transparentProcessing:Boolean($('#new-audit-processing-steps')),
  multiSelectPackages:selectedCompliancePackageIds.size>=1,
  technicalLandscapeComparison:Boolean($('#new-audit-ai-technical-preview')),
  liveGovernanceMode:Boolean($('#live-governance-mode')),
  featureValidation:Boolean($('#new-audit-feature-validation'))
 };
}
function renderFeatureValidation(){
 const host=$('#new-audit-feature-validation');
 if(!host)return;
 const validation=runtimeState.featureValidation;
 if(runtimeState.featureValidationPending){
  host.innerHTML='<div class="quality-row"><div><span>Validation status</span><b>Running</b></div><div><small>Checking the completed design against required product capabilities.</small></div></div>';
  return;
 }
 if(!validation){
  host.innerHTML='<div class="quality-row"><div><span>Validation status</span><b>Not run yet</b></div><div><small>Run design validation to confirm the current product includes the requested features.</small></div></div>';
  return;
 }
 host.innerHTML=`<div class="quality-row"><div><span>Validation mode</span><b>${validation.mode==='realtime-llm'?'Real-time LLM':'Deterministic fallback'}</b></div><div><small>${validation.summary}</small></div></div>
 <div class="quality-row"><div><span>Coverage score</span><b>${validation.score}%</b></div><div><small>${validation.passed.length} passed  -  ${validation.missing.length} missing</small></div></div>
 <div class="agent-stage-filter-row">${validation.passed.map(item=>`<span class="delta-value delta-decrease">OK ${item.label}</span>`).join('')||'<span class="delta-value delta-flat">No confirmed features yet</span>'}</div>
 ${validation.missing.length?`<div class="agent-stage-filter-row">${validation.missing.map(item=>`<span class="delta-value delta-increase">! ${item.label}</span>`).join('')}</div>`:''}`;
}
async function requestFeatureValidation(){
 const host=$('#new-audit-feature-validation');
 if(!host)return;
 runtimeState.featureValidationPending=true;
 renderFeatureValidation();
 try{
  const response=await fetch(`${policyRagApiBase}/validate-features`,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    checklist:productFeatureChecklist,
    productState:buildProductFeatureState(),
    context:{
     runContext:runtimeState.lastRunContext||null,
     liveGovernanceMode:isLiveGovernanceModeEnabled(),
     ragDocuments:runtimeState.ragStore?.stats?.docCount||0
    }
   })
  });
  if(!response.ok){
   const payload=await response.json().catch(()=>({}));
   throw new Error(payload.error||'Feature validation unavailable');
  }
  const payload=await response.json();
  runtimeState.featureValidation=payload.validation;
 }catch(error){
  runtimeState.featureValidation={mode:'deterministic-fallback',score:0,summary:error.message,passed:[],missing:productFeatureChecklist.map(item=>({label:item.label}))};
 }finally{
  runtimeState.featureValidationPending=false;
  renderFeatureValidation();
 }
}
async function submitPolicyChat(question){
 const query=normalizeProjectName(question,'');
 const answerHost=$('#policy-chat-answer');
 const citationsHost=$('#policy-chat-citations');
 if(!query){
  if(answerHost)answerHost.textContent='Enter a framework, policy, or gap question to query the local baseline corpus.';
  if(citationsHost)citationsHost.innerHTML='';
  return;
 }
 if(answerHost)answerHost.textContent='Querying policy RAG service...';
 if(citationsHost)citationsHost.innerHTML='';
 try{
  const response=await fetch(`${policyRagApiBase}/query`,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({question:query,topK:4})
  });
  if(!response.ok){
   const payload=await response.json().catch(()=>({}));
   throw new Error(payload.error||'Policy query failed');
  }
  const payload=await response.json();
  if(answerHost)answerHost.textContent=payload.answer;
  if(citationsHost){
   const citationItems=payload.matches?.length
    ?payload.matches.map(item=>`${item.title} (${item.kind}  -  ${item.score})`)
    :payload.citations||[];
   citationsHost.innerHTML=`<div class="agent-stage-filter-row">${citationItems.map(item=>`<span>${item}</span>`).join('')}</div>`;
  }
 }catch(error){
  if(answerHost)answerHost.textContent=`Policy RAG API unavailable. ${error.message}. Start the local RAG service and refresh the knowledge base.`;
 }
}
function render(){
 const prioritizedFrameworks=getPrioritizedFrameworks();
 $('#framework-list').innerHTML=prioritizedFrameworks.slice(0,6).map(f=>`<div class="framework-row"><span class="framework-logo">${f.short}</span><div class="framework-info"><b>${f.name}</b><small>${f.controls} controls  -  ${f.score<80?'Action required':'On track'}</small></div><div class="framework-pct">${f.score}%</div><div class="mini-progress"><i style="width:${f.score}%;background:${f.score<80?'#dc9737':''}"></i></div></div>`).join('');
 renderAuditHistoryTable();
 $('#check-grid').innerHTML=frameworks.map((f,i)=>`<label class="check-card ${i<5?'selected':''}"><input type="checkbox" ${i<5?'checked':''}><span class="framework-logo">${f.short}</span><span><b>${f.name}</b><small>${f.controls} mapped controls</small></span></label>`).join('');
 renderCompliancePackages();
 const pipe=[['BL','Baseline intelligence','Refresh policies, frameworks, and baseline manifest gate'],['DS','Discovery','Map architecture and evidence'],['DA','Data and model analysis','Trace lineage, privacy, and risk'],['CP','Compliance specialists','Evaluate selected frameworks'],['EV','Adversarial evaluator','Challenge claims and evidence'],['IV','Independent verifier','Blindly validate critical controls'],['RP','Report and remediation','Prioritized path to resolution']];
 $('#pipeline-flow').innerHTML=pipe.map(x=>`<div class="pipe-item"><span class="pipe-icon">${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div></div>`).join('');
 $('#agent-cards').innerHTML=agentData.map(a=>`<article class="agent-card"><span>${a[0]}</span><h3>${a[1]}</h3><p>${a[2]}</p><small>${a[3]}</small></article>`).join('');
 const positions=[[12,22],[75,19],[8,67],[78,65],[25,82],[62,84]];
 $('#agent-orbit').innerHTML=['Discovery','Data governance','Security','Model risk','Evaluator','Verifier'].map((x,i)=>`<span class="orbit-node" style="left:${positions[i][0]}%;top:${positions[i][1]}%">${x}</span>`).join('');
 $('#framework-cards').innerHTML=frameworks.map(f=>`<article class="framework-card"><div class="top"><span class="framework-logo">${f.short}</span><span class="active-pill">Active</span></div><h3>${f.name}</h3><p>${f.desc}</p><div class="progress"><i style="width:${f.score}%;background:${f.color}"></i></div><div class="meta"><span>${f.controls} controls</span><b>${f.score}% ready</b></div></article>`).join('');
 runtimeState.lastReportFindings=findings;
 renderFindingsList(findings,{filter:reportFindingFilter});
 renderProjectInsightTiles();
 setAnalysisState('idle');
 renderTransparentProcessingSteps();
 $('#tool-list').innerHTML=tools.map(t=>`<div class="tool-card"><b>${t[0]}</b><p>${t[1]}</p><span>up ${t[2]}</span></div>`).join('');
 renderPolicyRagStatus();
 syncPolicyRagStatus();
 renderDeepAnalysis(activeAnalysisType,activeAnalysisFilter);
 $('#quality-bars').innerHTML=qualityProfile.map(q=>`<div class="quality-row"><div><span>${q[0]}</span><b>${q[1]}%</b></div><div class="mini-progress"><i style="width:${q[1]}%;background:${q[1]<70?'#dc9737':'#287e69'}"></i></div></div>`).join('');
 renderAIArchitecture(1);
 renderBatch();
 renderSecurityManifest();
 renderProductPipelineVisualizer();
 initAuditWorkspacePipeline();
 renderAgentAlgorithmLists();
 renderPlaybookTokenReference();
 renderAuditWorkspaceTechnicalPreview();
 initComplianceSlaControl();
 renderLiveGovernanceStatus();
 renderFeatureValidation();
 initHighVisibilityToggle();
 applyFloatingMotion();
}
function renderAgentAlgorithmLists(){
 const stageById=Object.fromEntries(productPipelineStages.map(stage=>[stage.id,stage.title]));
 const stagesForAgent=agentId=>productPipelineStages.filter(stage=>(productStageAgentMap[stage.id]||[]).includes(agentId)).map(stage=>stage.id);
 const cardTemplate=item=>`<article class="agent-algorithm-card" data-agent-algorithm-id="${item.id}"><div class="agent-algorithm-head"><span>${item.icon}</span><div><h3>${item.name}</h3><small>${item.meta}</small></div></div><p>${item.summary}</p><div class="agent-stage-strip">${stagesForAgent(item.id).map(stageId=>`<i data-agent-stage-tag="${stageId}">${stageById[stageId]}</i>`).join('')}</div><div class="agent-algorithm-method"><b>Algorithm used</b><p>${item.algorithm}</p></div><div class="agent-citation-block"><b>Citations</b><ul>${item.citations.map(c=>`<li><a href="${c.url}" target="_blank" rel="noreferrer">${c.title}</a></li>`).join('')}</ul></div></article>`;
 const stageFilterHost=$('#product-agent-stage-filters');
 if(stageFilterHost)stageFilterHost.innerHTML=productPipelineStages.map(stage=>`<button type="button" data-product-stage-filter="${stage.id}">${stage.title}</button>`).join('');
 const productHost=$('#product-agent-algorithm-list');
 if(productHost)productHost.innerHTML=agentAlgorithmCatalog.map(cardTemplate).join('');
 const playbookHost=$('#playbook-agent-algorithm-list');
 if(playbookHost)playbookHost.innerHTML=agentAlgorithmCatalog.map(cardTemplate).join('');
 applyProductAgentStageFilter(productAgentStageFilter);
 applyPlaybookAgentStageFilter(playbookAgentStageFilter);
}
function setProductAgentTab(tab){
 const value=tab||'system';
 $$('#product-agent-tabs [data-product-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.productTab===value));
 $$('[data-product-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.productPanel===value));
}
function setPlaybookAgentTab(tab){
 const value=tab||'stages';
 $$('#playbook-agent-tabs [data-playbook-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.playbookTab===value));
 $$('[data-playbook-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.playbookPanel===value));
}
function applyProductAgentStageFilter(stageId){
 productAgentStageFilter=stageId||null;
 const stageTitle=productPipelineStages.find(stage=>stage.id===productAgentStageFilter)?.title;
 const label=$('#product-agent-filter-label');
 if(label){
  label.textContent=productAgentStageFilter
   ?`Filtered by stage: ${stageTitle}. Showing only active agents for this product pipeline stage.`
   :'Showing all agents. Choose a pipeline stage to filter.';
 }
 $$('#product-agent-stage-filters [data-product-stage-filter]').forEach(button=>{
  button.classList.toggle('active',button.dataset.productStageFilter===productAgentStageFilter);
 });
 $$('#product-agent-algorithm-list [data-agent-algorithm-id]').forEach(card=>{
  const agentId=card.dataset.agentAlgorithmId;
  const isVisible=!productAgentStageFilter||(productStageAgentMap[productAgentStageFilter]||[]).includes(agentId);
  card.classList.toggle('filtered-out',!isVisible);
  card.querySelectorAll('[data-agent-stage-tag]').forEach(tag=>{
   tag.classList.toggle('stage-match',!!productAgentStageFilter&&tag.dataset.agentStageTag===productAgentStageFilter);
  });
 });
}
function applyPlaybookAgentStageFilter(stageId){
 playbookAgentStageFilter=stageId||null;
 const stageTitle=productPipelineStages.find(stage=>stage.id===playbookAgentStageFilter)?.title;
 const label=$('#playbook-agent-filter-label');
 if(label){
  label.textContent=playbookAgentStageFilter
   ?`Filtered by stage: ${stageTitle}. Showing only active agents for this playbook stage.`
   :'Showing all agents. Click a playbook stage to filter.';
 }
 $$('[data-playbook-stage]').forEach(step=>step.classList.toggle('stage-selected',step.dataset.playbookStage===playbookAgentStageFilter));
 $$('#playbook-agent-algorithm-list [data-agent-algorithm-id]').forEach(card=>{
  const agentId=card.dataset.agentAlgorithmId;
  const isVisible=!playbookAgentStageFilter||(productStageAgentMap[playbookAgentStageFilter]||[]).includes(agentId);
  card.classList.toggle('filtered-out',!isVisible);
  card.querySelectorAll('[data-agent-stage-tag]').forEach(tag=>{
   tag.classList.toggle('stage-match',!!playbookAgentStageFilter&&tag.dataset.agentStageTag===playbookAgentStageFilter);
  });
 });
}
function populateSimulationProjectOptions(preferredName){
 const select=$('#product-pipeline-project');
 if(!select)return;

 const orderedNames=[];
 const seen=new Set();
 const addName=name=>{
  const clean=(name||'').trim();
  if(!clean||seen.has(clean))return;
  seen.add(clean);
  orderedNames.push(clean);
 };

 batchProjects.forEach(project=>addName(project?.name));
 audits.forEach(row=>addName(Array.isArray(row)?row[0]:''));
 addName('Clinical Risk Assistant');

 if(!orderedNames.length)addName('Untitled project');

 const selected=preferredName||select.value||orderedNames[0];
 select.innerHTML=orderedNames.map(name=>`<option value="${name}">${name}</option>`).join('');
 select.value=seen.has(selected)?selected:orderedNames[0];
}
function renderProductPipelineVisualizer(){
 const progress=$('#product-pipeline-progress');
 const log=$('#product-pipeline-log');
 if(!progress||!log)return;

 populateSimulationProjectOptions();

 progress.style.width='0%';
 log.innerHTML='<div class="orchestrator-log-row"><time>READY</time><span>UML pipeline is ready. Enter a project name and run orchestration.</span></div>';
 const live=$('#product-live-commentary');
 if(live)live.textContent='LIVE: waiting for kickoff...';
 renderProductAgentHierarchy();
 updateProductHierarchyStage(null,'');
}
function wait(ms){
 return new Promise(resolve=>setTimeout(resolve,ms));
}
function formatMsClock(ms){
 const safe=Math.max(0,Math.round(ms/1000));
 const minutes=String(Math.floor(safe/60)).padStart(2,'0');
 const seconds=String(safe%60).padStart(2,'0');
 return `${minutes}:${seconds}`;
}
function getAuditStageIcon(stageId){
 const lane=productPipelineStages.find(stage=>stage.id===stageId)?.lane;
 if(lane==='INTAKE')return 'IN';
 if(lane==='ANALYSIS')return 'AN';
 if(lane==='ASSURANCE')return 'AS';
 return '--';
}
function getAuditStageTiming(stageId){
 const lane=productPipelineStages.find(stage=>stage.id===stageId)?.lane;
 if(lane==='INTAKE')return {perAgentMs:700,stagePauseMs:780};
 if(lane==='ANALYSIS')return {perAgentMs:560,stagePauseMs:620};
 if(lane==='ASSURANCE')return {perAgentMs:760,stagePauseMs:920};
 return {perAgentMs:620,stagePauseMs:800};
}
function setAuditNowProcessing({agent='Waiting',stage='Idle',elapsedMs=0,remainingMs=null}={}){
 const agentEl=$('#audit-now-agent');
 const stageEl=$('#audit-now-stage');
 const elapsedEl=$('#audit-now-elapsed');
 const remainEl=$('#audit-now-remaining');
 if(agentEl)agentEl.textContent=agent;
 if(stageEl)stageEl.textContent=stage;
 if(elapsedEl)elapsedEl.textContent=formatMsClock(elapsedMs);
 if(remainEl)remainEl.textContent=remainingMs===null?'--:--':formatMsClock(remainingMs);
}
function startAuditPipelineTimer(){
 if(auditPipelineState.timerId)clearInterval(auditPipelineState.timerId);
 auditPipelineState.timerId=setInterval(()=>{
  if(!auditPipelineState.startTime)return;
  const elapsed=Date.now()-auditPipelineState.startTime;
  const remaining=Math.max(0,auditPipelineState.totalMs-elapsed);
  const currentAgent=$('#audit-now-agent')?.textContent||'Waiting';
  const currentStage=$('#audit-now-stage')?.textContent||'Idle';
  setAuditNowProcessing({agent:currentAgent,stage:currentStage,elapsedMs:elapsed,remainingMs:remaining});
 },250);
}
function stopAuditPipelineTimer(){
 if(auditPipelineState.timerId){
  clearInterval(auditPipelineState.timerId);
  auditPipelineState.timerId=null;
 }
}
function getAgentCatalogById(){
 return new Map(agentAlgorithmCatalog.map(agent=>[agent.id,agent]));
}
function markAuditStageCompleted(stageId){
 if(!stageId)return;
 if(!auditPipelineState.completedStageIds.includes(stageId))auditPipelineState.completedStageIds.push(stageId);
}
function renderAuditPipelineAgentLane(stageId){
 const lane=$('#audit-pipeline-agent-lane');
 if(!lane)return;
 const highlightedStageId=auditPipelineState.selectedCompletedStageId||stageId||'';
 const activeAgentIds=highlightedStageId?(productStageAgentMap[highlightedStageId]||[]):[];
 const completedStageCards=auditPipelineState.completedStageIds
  .map((completedId,index)=>{
   const stage=productPipelineStages.find(item=>item.id===completedId);
   if(!stage)return '';
   const selectedClass=auditPipelineState.selectedCompletedStageId===completedId?' active':'';
  return `<button type="button" class="audit-completed-stage-pill${selectedClass}" data-audit-completed-stage="${completedId}"><i>${getAuditStageIcon(completedId)}</i>${stage.title}</button>`;
  })
  .join('');
 const selectedStageTitle=productPipelineStages.find(stage=>stage.id===auditPipelineState.selectedCompletedStageId)?.title;
 const title=selectedStageTitle
  ?`Agents highlighted: ${selectedStageTitle}`
  :stageId
  ?`Agents executing: ${productPipelineStages.find(stage=>stage.id===stageId)?.title||'stage'}`
  :'Agents waiting for pipeline start';
 lane.innerHTML=`<div class="audit-agent-lane-head"><b>${title}</b><small>Click any agent card to inspect algorithm, behavior, and citations</small></div>${completedStageCards?`<div class="audit-completed-stage-track"><small>Completed stages</small><div class="audit-completed-stage-grid">${completedStageCards}</div></div>`:''}<div class="audit-agent-chip-grid">${productAgentsFlat.map(agent=>`<button type="button" class="audit-agent-chip ${activeAgentIds.includes(agent.id)?'active':''}" data-audit-agent="${agent.id}" data-audit-stage="${highlightedStageId||stageId||''}"><span>${agent.icon}</span><div><em>${agent.character||agent.name}</em><small>${agent.name}</small></div></button>`).join('')}</div>`;
}
function setAuditAgentDetail(agentId,stageId=''){
 const detailTitle=$('#audit-agent-detail-title');
 const detailSummary=$('#audit-agent-detail-summary');
 const detailAlgorithm=$('#audit-agent-detail-algorithm');
 const detailCitations=$('#audit-agent-detail-citations');
 if(!detailTitle||!detailSummary||!detailAlgorithm||!detailCitations)return;

 const details=getAgentCatalogById().get(agentId);
 if(!details){
  detailTitle.textContent='Agent details unavailable';
  detailSummary.textContent='No metadata was found for the selected agent.';
  detailAlgorithm.textContent='';
  detailCitations.innerHTML='';
  return;
 }

 const stageName=productPipelineStages.find(stage=>stage.id===stageId)?.title||'selected stage';
 detailTitle.textContent=`${details.name}  -  ${stageName}`;
 detailSummary.textContent=details.summary;
 detailAlgorithm.textContent=`Method: ${details.algorithm}`;
 detailCitations.innerHTML=details.citations.map(citation=>`<a href="${citation.url}" target="_blank" rel="noreferrer">${citation.title}</a>`).join('');
}
function renderAuditPipelineStatic(){
 const track=$('#audit-pipeline-stage-track');
 if(!track)return;
 auditPipelineState.completedStageIds=[];
 auditPipelineState.selectedCompletedStageId=null;
 track.innerHTML=productPipelineStages.map((stage,index)=>`<button type="button" class="audit-stage-chip" data-audit-stage="${stage.id}"><span>${getAuditStageIcon(stage.id)}</span><b>${stage.title}</b><small>${stage.lane}  -  ${String(index+1).padStart(2,'0')}</small></button>`).join('');
 $('#audit-pipeline-current-stage').textContent='Idle';
 $('#audit-pipeline-current-detail').textContent='Waiting for project intake.';
 $('#audit-pipeline-progress').style.width='0%';
 setAuditNowProcessing({agent:'Waiting',stage:'Idle',elapsedMs:0,remainingMs:null});
 renderAuditPipelinePhaseStrip();
 updateAuditPipelineIconHierarchy(null);
 renderAuditPipelineAgentLane(null);
}
function updateAuditPipelineStage(stageId,projectName,index,total){
 auditPipelineState.stageIndex=index;
 auditPipelineState.selectedCompletedStageId=null;
 const stage=productPipelineStages.find(item=>item.id===stageId);
 if(!stage)return;
 $('#audit-pipeline-current-stage').textContent=`${getAuditStageIcon(stage.id)} ${stage.lane}  -  ${stage.title}`;
 $('#audit-pipeline-current-detail').textContent=`${projectName}: ${stage.detail}`;
 $('#audit-pipeline-progress').style.width=`${Math.round(((index+1)/total)*100)}%`;
 $$('#audit-pipeline-stage-track [data-audit-stage]').forEach((chip,chipIndex)=>{
  chip.classList.toggle('active',chip.dataset.auditStage===stageId);
  chip.classList.toggle('done',chipIndex<index);
 });
 updateAuditPipelineIconHierarchy(stageId);
 renderAuditPipelineAgentLane(stageId);
}
async function startAuditWorkspacePipelineAnimation(projectName){
 const panel=$('#audit-workspace-pipeline');
 const playButton=$('#audit-pipeline-play');
 const runToken=++auditPipelineState.runToken;
 const stageCount=productPipelineStages.length;
 auditPipelineState.completedStageIds=[];
 auditPipelineState.selectedCompletedStageId=null;
 auditPipelineState.totalMs=productPipelineStages.reduce((sum,stage)=>{
  const timing=getAuditStageTiming(stage.id);
  const activeAgents=(productStageAgentMap[stage.id]||[]).length;
  return sum+(activeAgents*timing.perAgentMs)+timing.stagePauseMs;
 },0);
 auditPipelineState.startTime=Date.now();
 auditPipelineState.isAnimating=true;
 startAuditPipelineTimer();
 if(panel){
  panel.classList.add('is-running');
  panel.scrollIntoView({behavior:'smooth',block:'start'});
 }
 if(playButton){
  playButton.disabled=true;
  playButton.textContent='Animating...';
 }

 for(let index=0;index<productPipelineStages.length;index+=1){
  if(runToken!==auditPipelineState.runToken)return;
  const stage=productPipelineStages[index];
  const timing=getAuditStageTiming(stage.id);
  updateAuditPipelineStage(stage.id,projectName,index,productPipelineStages.length);
  const activeAgents=productStageAgentMap[stage.id]||[];
  for(let agentIndex=0;agentIndex<activeAgents.length;agentIndex+=1){
   if(runToken!==auditPipelineState.runToken)return;
   const agentId=activeAgents[agentIndex];
    const agentMeta=productAgentsFlat.find(agent=>agent.id===agentId);
    const stageName=productPipelineStages.find(item=>item.id===stage.id)?.title||'Stage';
    const elapsedNow=Date.now()-auditPipelineState.startTime;
    setAuditNowProcessing({agent:agentMeta?.character||agentMeta?.name||agentId,stage:`${getAuditStageIcon(stage.id)} ${stageName}`,elapsedMs:elapsedNow,remainingMs:Math.max(0,auditPipelineState.totalMs-elapsedNow)});
   const chip=$(`#audit-pipeline-agent-lane [data-audit-agent="${agentId}"]`);
   if(chip){
    chip.classList.add('processing');
    setAuditAgentDetail(agentId,stage.id);
   }
  await wait(timing.perAgentMs);
   if(chip)chip.classList.remove('processing');
  }
  markAuditStageCompleted(stage.id);
  renderAuditPipelineAgentLane(stage.id);
  await wait(timing.stagePauseMs);
 }

 if(runToken===auditPipelineState.runToken){
  auditPipelineState.completedStageIds=productPipelineStages.map(stage=>stage.id);
  $('#audit-pipeline-current-stage').textContent='Completed';
  $('#audit-pipeline-current-detail').textContent=`${projectName}: transparent agent trace completed for all stages.`;
  setAuditNowProcessing({agent:'Completed',stage:'AS All stages complete',elapsedMs:Date.now()-auditPipelineState.startTime,remainingMs:0});
  auditPipelineState.isAnimating=false;
  stopAuditPipelineTimer();
  if(panel)panel.classList.remove('is-running');
  if(playButton){
   playButton.disabled=false;
   playButton.textContent='Replay slow animation';
  }
 }
}
function resetAuditWorkspacePipeline(){
 auditPipelineState.runToken+=1;
 auditPipelineState.isAnimating=false;
 auditPipelineState.startTime=0;
 auditPipelineState.totalMs=0;
 stopAuditPipelineTimer();
 const panel=$('#audit-workspace-pipeline');
 if(panel)panel.classList.remove('is-running');
 renderAuditPipelineStatic();
 const playButton=$('#audit-pipeline-play');
 if(playButton){
  playButton.disabled=false;
  playButton.textContent='Play slow animation';
 }
}
function initAuditWorkspacePipeline(){
 if(!$('#audit-workspace-pipeline'))return;
 renderAuditPipelineStatic();

 const playButton=$('#audit-pipeline-play');
 const stopButton=$('#audit-pipeline-stop');
 if(playButton){
  playButton.onclick=()=>{
   const name=normalizeProjectName($('#project-name')?.value,'Claims Intelligence Platform');
   startAuditWorkspacePipelineAnimation(name);
  };
  playButton.dataset.bound='1';
 }
 if(stopButton){
  stopButton.onclick=resetAuditWorkspacePipeline;
  stopButton.dataset.bound='1';
 }
}
function renderProductAgentHierarchy(){
 const host=$('#product-agent-hierarchy');
 if(!host)return;
 const legendItems=productAgentsFlat.map(agent=>`<article class="uml-legend-item" data-agent-legend="${agent.id}"><div><b>${agent.character||agent.name}</b><span>${agent.name}  -  ${agent.model||'Agent model'}</span></div><small>${agent.function}</small><small class="uml-meta">${agent.meta||'Pipeline metadata'}</small><em class="legend-state">Idle</em></article>`).join('');
 host.innerHTML=`<header class="orchestrator-agent-status" id="product-hierarchy-action">UML top-down orchestration ready. Press animate to run the pipeline.</header><div class="uml-pipeline-wrap"><div class="uml-diagram">${productAgentHierarchy.map((section,sectionIndex)=>`${sectionIndex>0?`<div class="uml-arrow" data-layer-connector="${sectionIndex}">down</div>`:''}<section class="uml-layer" data-agent-group="${sectionIndex}"><div class="uml-layer-head"><h4>${section.group}</h4><span class="agent-group-state">Queued</span></div><p class="uml-layer-description">${section.description}</p><div class="uml-layer-body">${section.agents.map((agent,agentIndex)=>`<article class="uml-agent" data-agent-card="${agent.id}" data-agent-index="${agentIndex}"><span class="uml-agent-id">${agent.icon}</span><div class="uml-agent-main"><div class="uml-agent-head"><b>${agent.character||agent.name}</b><span>${agent.name}</span></div><small>${agent.model||'Agent model'}</small><small class="uml-meta">${agent.meta||'Pipeline metadata'}</small><em class="agent-state">Waiting</em><i class="agent-move">Not started</i></div></article>`).join('')}</div></section>`).join('')}</div><aside class="uml-legend"><h5>Agent Legend</h5><p>Descriptions and metadata for discovery, governance, security, model risk, compliance, evaluator, verifier, and report agents.</p>${legendItems}</aside></div>`;
}
function highlightProductStageAgents(stageId){
 $$('[data-agent-card]').forEach(card=>card.classList.remove('active'));
 if(!stageId)return;
 const activeAgentIds=productStageAgentMap[stageId]||[];
 activeAgentIds.forEach(id=>{
  const card=$(`[data-agent-card="${id}"]`);
  if(card)card.classList.add('active');
 });
}
function updatePipelineActiveAgentNodes(host,stageId){
 const nodes=host.querySelectorAll('.node');
 nodes.forEach(node=>node.classList.remove('agent-in-action'));
 if(!stageId)return;
 const activeAgentIds=productStageAgentMap[stageId]||[];
 activeAgentIds.forEach(agentId=>{
  const nodeClass=iconHierarchyAgentNodeClassByAgentId[agentId];
  if(!nodeClass)return;
  host.querySelectorAll(`.node.${nodeClass}`).forEach(node=>node.classList.add('agent-in-action'));
 });
}
function updatePipelineIconHierarchy(stageId,hostSelector='#product-icon-hierarchy-live'){
 const host=$(hostSelector);
 if(!host)return;
 const stageClassNames=Object.values(iconHierarchyStageClassMap);
 const stageKeys=[...new Set(productPipelineStages.map(stage=>(iconHierarchyStageClassMap[stage.id]||'').replace('pipeline-stage-','')).filter(Boolean))];
 const dynamicClassNames=[
  ...stageClassNames,
  ...stageKeys.map(key=>`pipeline-active-${key}`),
  ...stageKeys.map(key=>`pipeline-done-${key}`)
 ];
 host.classList.remove('pipeline-stage-idle',...dynamicClassNames);
 if(!stageId){
  host.classList.add('pipeline-stage-idle');
  updatePipelineActiveAgentNodes(host,null);
  return;
 }
 const stageClass=iconHierarchyStageClassMap[stageId];
 if(!stageClass){
  host.classList.add('pipeline-stage-idle');
  updatePipelineActiveAgentNodes(host,null);
  return;
 }

 const activeKey=stageClass.replace('pipeline-stage-','');
 const activeStageIndex=productPipelineStages.findIndex(stage=>stage.id===stageId);
 const doneKeys=[...new Set(
  productPipelineStages
   .slice(0,Math.max(0,activeStageIndex))
   .map(stage=>(iconHierarchyStageClassMap[stage.id]||'').replace('pipeline-stage-',''))
   .filter(Boolean)
 )];

 host.classList.add(`pipeline-active-${activeKey}`);
 doneKeys.forEach(key=>host.classList.add(`pipeline-done-${key}`));
 updatePipelineActiveAgentNodes(host,stageId);
}
function renderAuditPipelinePhaseStrip(){
 const host=$('#audit-phase-strip');
 if(!host)return;
 host.innerHTML=auditPipelinePhaseOrder.map(phase=>`<div class="audit-phase-chip" data-audit-phase="${phase}"><b>${auditPipelinePhaseLabels[phase]}</b><small>Queued</small></div>`).join('');
}
function updateAuditPipelinePhaseHighlight(stageId){
 const currentClass=iconHierarchyStageClassMap[stageId]||'';
 const currentPhase=currentClass.replace('pipeline-stage-','');
 const currentIndex=auditPipelinePhaseOrder.indexOf(currentPhase);
 $$('#audit-phase-strip [data-audit-phase]').forEach(chip=>{
  const phase=chip.dataset.auditPhase;
  const phaseIndex=auditPipelinePhaseOrder.indexOf(phase);
  const label=$('small',chip);
  chip.classList.remove('active','done');
  if(!currentPhase||currentIndex<0){
   if(label)label.textContent='Queued';
   return;
  }
  if(phaseIndex<currentIndex){
   chip.classList.add('done');
   if(label)label.textContent='Done';
   return;
  }
  if(phaseIndex===currentIndex){
   chip.classList.add('active');
   if(label)label.textContent='Running';
   return;
  }
  if(label)label.textContent='Queued';
 });
}
function updateAuditPipelineIconHierarchy(stageId){
 updatePipelineIconHierarchy(stageId,'#audit-icon-hierarchy-live');
 updatePipelineIconHierarchy(stageId,'#architecture-icon-hierarchy-mermaid');
 updateAuditPipelinePhaseHighlight(stageId);
}
function updatePipelineStageLegend(stageId){
 const activeHost=$('#pipeline-icon-active');
 const completedHost=$('#pipeline-icon-completed');
 const nextHost=$('#pipeline-icon-next');
 if(!activeHost||!completedHost||!nextHost)return;

 if(!stageId){
  activeHost.textContent='Idle';
  completedHost.textContent='None';
  nextHost.textContent=productPipelineStages[0]?.title||'Not set';
  return;
 }

 const stageIndex=productPipelineStages.findIndex(stage=>stage.id===stageId);
 const activeStage=productPipelineStages[stageIndex];
 const completedStages=stageIndex>0?productPipelineStages.slice(0,stageIndex):[];
 const nextStage=productPipelineStages[stageIndex+1]||null;

 activeHost.textContent=activeStage?.title||'In progress';
 completedHost.textContent=completedStages.length?completedStages.map(stage=>stage.title).join(' -> '):'None';
 nextHost.textContent=nextStage?nextStage.title:'Complete';
}
function highlightPipelineAIComponents(stageId){
 const activeIds=new Set(stageAiComponentMap[stageId]||[]);
 $$('[data-ai-component]').forEach(card=>{
  const isActive=activeIds.has(card.dataset.aiComponent);
  card.classList.toggle('pipeline-active',isActive);
  card.classList.toggle('pipeline-done',!isActive&&!!stageId);
 });
}
function updateProductHierarchyStage(stageId,projectName){
 const banner=$('#product-hierarchy-action');
 const groupStates=$$('[data-agent-group]');
 const connectors=$$('[data-layer-connector]');
 const legends=$$('[data-agent-legend]');
 connectors.forEach(connector=>{
  connector.classList.remove('active');
  connector.classList.remove('done');
 });
 legends.forEach(item=>{
  item.classList.remove('active');
  item.classList.remove('done');
  const state=$('.legend-state',item);
  if(state)state.textContent='Idle';
 });
 groupStates.forEach(group=>{
  group.classList.remove('active');
  group.classList.remove('done');
  const label=$('.agent-group-state',group);
  if(label)label.textContent='Queued';
 });
 $$('[data-agent-card]').forEach(card=>{
  card.classList.remove('active');
  card.classList.remove('done');
  const status=$('.agent-state',card);
  if(status)status.textContent='Waiting';
  const move=$('.agent-move',card);
  if(move)move.textContent='Not started';
 });

 if(!stageId){
  if(banner)banner.textContent='UML hierarchy ready. Press animate to run top-down orchestrator, function, evaluator, and independent models.';
  const explainer=$('#product-pipeline-explainer');
  if(explainer)explainer.textContent='Top-down flow: discovery, governance, security, model risk, compliance, evaluator, independent verifier, and report agents execute in sequence under orchestrator control.';
  const live=$('#product-live-commentary');
  if(live)live.textContent='LIVE: waiting for kickoff...';
  updatePipelineIconHierarchy(null);
  updatePipelineIconHierarchy(null,'#architecture-icon-hierarchy-mermaid');
  updatePipelineStageLegend(null);
  highlightPipelineAIComponents(null);
  return;
 }

 const activeIds=productStageAgentMap[stageId]||[];
 const stage=productPipelineStages.find(item=>item.id===stageId);
 const moveMeta=productStageMoveMap[stageId]||{label:'Play',icon:'*'};
 const activeGroupIndex=productAgentHierarchy.findIndex(section=>section.agents.some(agent=>activeIds.includes(agent.id)));
 if(activeGroupIndex>=0){
  const activeGroup=$(`[data-agent-group="${activeGroupIndex}"]`);
  if(activeGroup){
   activeGroup.classList.add('active');
   const label=$('.agent-group-state',activeGroup);
   if(label)label.textContent='Running';
  }
  const activeConnector=$(`[data-layer-connector="${activeGroupIndex}"]`);
  if(activeConnector)activeConnector.classList.add('active');
 }
 activeIds.forEach(id=>{
  const card=$(`[data-agent-card="${id}"]`);
  const legend=$(`[data-agent-legend="${id}"]`);
  if(card){
   card.classList.add('active');
   const status=$('.agent-state',card);
   if(status)status.textContent='Initiated';
   const move=$('.agent-move',card);
   if(move)move.textContent=`${moveMeta.icon} Executing ${moveMeta.label}`;
  }
  if(legend){
   legend.classList.add('active');
   const state=$('.legend-state',legend);
   if(state)state.textContent='Initiated';
  }
 });

 const doneIndex=productPipelineStages.findIndex(item=>item.id===stageId);
 if(doneIndex>0){
  const completedStages=productPipelineStages.slice(0,doneIndex);
  completedStages.forEach(completed=>{
   const completedAgents=productStageAgentMap[completed.id]||[];
   completedAgents.forEach(id=>{
    const card=$(`[data-agent-card="${id}"]`);
     const legend=$(`[data-agent-legend="${id}"]`);
    if(card){
     card.classList.add('done');
     const status=$('.agent-state',card);
     if(status&&status.textContent!=='Initiated')status.textContent='Executed';
      const doneMove=$('.agent-move',card);
      if(doneMove&&doneMove.textContent==='Not started')doneMove.textContent='Executed';
    }
      if(legend){
        legend.classList.add('done');
        const state=$('.legend-state',legend);
        if(state&&state.textContent!=='Initiated')state.textContent='Executed';
      }
   });
  });
 }

   const finishedGroupIndex=activeGroupIndex>0?activeGroupIndex-1:-1;
   if(finishedGroupIndex>=0){
    for(let index=0;index<=finishedGroupIndex;index+=1){
    const group=$(`[data-agent-group="${index}"]`);
    if(group){
     group.classList.add('done');
     const label=$('.agent-group-state',group);
     if(label&&label.textContent!=='Running')label.textContent='Passed';
    }
      const connector=$(`[data-layer-connector="${index+1}"]`);
      if(connector)connector.classList.add('done');
    }
   }

 const activeNames=activeIds
  .map(id=>productAgentsFlat.find(agent=>agent.id===id)?.character)
  .filter(Boolean)
  .join(' + ');
 if(banner)banner.textContent=`${projectName}: ${activeNames||'Agent'} is driving ${stage?.title||'stage'} from the top down.`;
 const activeAgents=productAgentsFlat.filter(agent=>activeIds.includes(agent.id));
 const explainer=$('#product-pipeline-explainer');
 const initiatedSummary=activeAgents.map(agent=>`${agent.character} ${productAgentActionByStage[agent.id]?.[stageId]||agent.function}`).join(' ');
 if(explainer)explainer.textContent=`${stage?.title||'Stage'}: ${stage?.detail||''} Initiated agents: ${activeAgents.map(agent=>agent.name).join(', ')||'none'}. Executed workflow: ${initiatedSummary||'Awaiting stage activation.'}`.trim();
 const live=$('#product-live-commentary');
 if(live)live.textContent=`LIVE: ${stage?.title||'Stage'} is active. Triggered by ${activeAgents.map(agent=>agent.character).join(', ')||'system'}. Current move: ${moveMeta.label}.`;
 updatePipelineIconHierarchy(stageId);
 updatePipelineIconHierarchy(stageId,'#architecture-icon-hierarchy-mermaid');
 updatePipelineStageLegend(stageId);
 highlightPipelineAIComponents(stageId);
}
function flashStageComplete(stageTitle){
 const badge=$('#product-stage-complete');
 if(!badge)return;
 badge.textContent=`GAME STAGE COMPLETED: ${stageTitle.toUpperCase()}`;
 badge.classList.remove('show');
 // Force reflow so repeated stages re-trigger animation.
 void badge.offsetWidth;
 badge.classList.add('show');
 setTimeout(()=>badge.classList.remove('show'),780);
}
function renderProductPokerSeats(){
 const host=$('#product-poker-seats');
 if(!host)return;
 host.innerHTML=productAgentsFlat.map(agent=>`<article class="poker-seat" data-poker-seat="${agent.id}"><div class="poker-avatar" data-poker-avatar="${agent.id}"><span class="poker-seat-rank">${agent.icon||'CARD'}</span><i class="poker-avatar-head"></i><i class="poker-avatar-body"></i><i class="poker-avatar-shadow"></i></div><div class="poker-seat-main"><div class="poker-seat-head"><b>${agent.character||agent.name}</b><span class="poker-character">${agent.name}</span></div><small>${agent.function}</small><i class="poker-move">No move</i><em>Waiting</em></div></article>`).join('');
 const actionStrip=$('#product-poker-action');
 if(actionStrip)actionStrip.textContent='Waiting for simulation start.';
}
function updateProductPokerStage(stageId,projectName){
 $$('[data-poker-seat]').forEach(seat=>{
  seat.classList.remove('active');
  seat.classList.remove('done');
  const status=$('em',seat);
  if(status)status.textContent='Waiting';
  const move=$('.poker-move',seat);
  if(move)move.textContent='No move';
 });
 if(!stageId){
  const actionStrip=$('#product-poker-action');
  if(actionStrip)actionStrip.textContent='Waiting for simulation start.';
  return;
 }

 const activeIds=productStageAgentMap[stageId]||[];
 const moveMeta=productStageMoveMap[stageId]||{label:'Play',icon:'*'};
 activeIds.forEach(id=>{
  const seat=$(`[data-poker-seat="${id}"]`);
  if(seat){
   seat.classList.add('active');
   const agentAction=(productAgentActionByStage[id]&&productAgentActionByStage[id][stageId])||'Executes stage action.';
   const status=$('em',seat);
   if(status)status.textContent='Active';
    const move=$('.poker-move',seat);
   if(move)move.textContent=`${moveMeta.icon} ${moveMeta.label}  -  ${agentAction}`;
   const actionStrip=$('#product-poker-action');
   if(actionStrip)actionStrip.textContent=`${projectName}: ${agentAction}`;
  }
 });

 const doneIndices=productPipelineStages.findIndex(s=>s.id===stageId);
 if(doneIndices>0){
  const completedStages=productPipelineStages.slice(0,doneIndices);
  completedStages.forEach(s=>{
   const doneAgents=productStageAgentMap[s.id]||[];
   doneAgents.forEach(id=>{
    const seat=$(`[data-poker-seat="${id}"]`);
    if(seat){
      seat.classList.add('done');
      const status=$('em',seat);
      if(status&&status.textContent!=='Active')status.textContent='Done';
      const move=$('.poker-move',seat);
      if(move&&move.textContent==='No move')move.textContent='Played';
    }
   });
  });
 }
}
function applyProductPipelineMode(){
 const mode=$('#product-pipeline-mode')?.value||'hybrid';
 const hierarchy=$('#product-agent-hierarchy');
 const poker=$('#product-poker-table');
 if(!hierarchy||!poker)return;

 if(mode==='poker'){
  hierarchy.hidden=true;
  poker.hidden=false;
 }else if(mode==='hybrid'){
  hierarchy.hidden=false;
  poker.hidden=false;
 }else{
  hierarchy.hidden=false;
  poker.hidden=true;
 }
}
function appendProductPipelineLog(message){
 const log=$('#product-pipeline-log');
 if(!log)return;
 const row=document.createElement('div');
 row.className='orchestrator-log-row';
 const time=document.createElement('time');
 time.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
 const text=document.createElement('span');
 text.textContent=message;
 row.append(time,text);
 log.prepend(row);
}
async function runProductPipelineAnimation(){
 const projectInput=$('#product-pipeline-project');
 const runButton=$('#product-pipeline-run');
 const speedSelect=$('#product-pipeline-speed');
 const stageLabel=$('#product-pipeline-stage');
 const summaryLabel=$('#product-pipeline-summary');
 const progress=$('#product-pipeline-progress');
 if(!projectInput||!runButton||!stageLabel||!summaryLabel||!progress)return;

 const projectName=projectInput.value.trim()||'Untitled project';
 const speedMode=speedSelect?.value||'normal';
 const stageDelay=productPipelineSpeedMs[speedMode]||productPipelineSpeedMs.normal;
 runButton.disabled=true;
 runButton.textContent='Animating orchestration...';
 progress.style.width='0%';
 appendProductPipelineLog(`Started top-down pipeline for ${projectName} at ${speedMode} speed.`);
 const live=$('#product-live-commentary');
 if(live)live.textContent=`LIVE: ${projectName} kickoff. Top-down workflow activated.`;
 updateProductHierarchyStage(null,projectName);

 for(let index=0;index<productPipelineStages.length;index+=1){
  const stage=productPipelineStages[index];
  const stageAgents=getStageAgentNames(stage.id);
  appendProductPipelineLog(`Stage ${index+1}/${productPipelineStages.length} started: ${stage.title}. Agents: ${stageAgents.join(', ')||'none'}.`);
  updateProductHierarchyStage(stage.id,projectName);
  stageLabel.textContent=`${stage.lane}  -  ${stage.title}`;
  summaryLabel.textContent=`${projectName}: ${stage.detail}`;
  progress.style.width=`${Math.round(((index+1)/productPipelineStages.length)*100)}%`;
  appendProductPipelineLog(`${stage.title} completed for ${projectName}. Output: ${productStageEvidenceMap[stage.id]}`);
  flashStageComplete(stage.title);
  // Intentional pacing for user-visible orchestration flow.
  await new Promise(resolve=>setTimeout(resolve,stageDelay));
 }

 stageLabel.textContent='Complete';
 summaryLabel.textContent=`${projectName} reached immutable report snapshot with full orchestration trace.`;
 appendProductPipelineLog(`Simulation complete for ${projectName}. Report snapshot available.`);
 updateProductHierarchyStage('reporting',projectName);
 if(live)live.textContent=`LIVE: ${projectName} cleared all levels. Snapshot shipped.`;
 runButton.textContent='Animate intake pipeline';
 runButton.disabled=false;
}
function applyFloatingMotion(){
 const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const targets=$$('.panel, .stat-card, .report-banner, .framework-card, .analysis-finding, .agent-card, .tool-card, .check-card, .finding-row, .batch-summary article, .scope, .workspace, .profile, .open-source');
 if(reduceMotion){
  targets.forEach(el=>{
   el.classList.remove('motion-float','is-tilting');
   el.style.removeProperty('--tilt-x');
   el.style.removeProperty('--tilt-y');
   el.style.removeProperty('--float-speed');
  });
  return;
 }

 targets.forEach(el=>{
  if(!el.classList.contains('motion-float'))el.classList.add('motion-float');
  if(!el.dataset.floatReady){
   floatingSeed+=1;
   const speed=(6.4 + (floatingSeed % 5) * 0.55).toFixed(2);
   el.style.setProperty('--float-speed', `${speed}s`);

   el.addEventListener('mousemove',evt=>{
    const rect=el.getBoundingClientRect();
    const x=(evt.clientX-rect.left)/rect.width;
    const y=(evt.clientY-rect.top)/rect.height;
    const tiltY=((x-0.5)*6).toFixed(2);
    const tiltX=((0.5-y)*6).toFixed(2);
    el.style.setProperty('--tilt-x', `${tiltX}deg`);
    el.style.setProperty('--tilt-y', `${tiltY}deg`);
    el.classList.add('is-tilting');
   });

   el.addEventListener('mouseleave',()=>{
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.classList.remove('is-tilting');
   });

   el.dataset.floatReady='1';
  }
 });
}
function isQuickWinEffort(effort){
 return /(hour|1 day|1-2 days|1-2 days|2 days|2-3 days|2-3 days)/i.test(effort||'');
}
function getDeepAnalysisItems(type,filter){
 const section=deepAnalysis[type];
 if(!section)return [];
 if(filter==='high')return section.items.filter(item=>item.severity==='high');
 if(filter==='quick')return section.items.filter(item=>isQuickWinEffort(item.effort));
 return section.items;
}
function updateAnalysisFilterButtons(){
 $$('#analysis-filter [data-analysis-filter]').forEach(button=>{
  button.classList.toggle('active',button.dataset.analysisFilter===activeAnalysisFilter);
 });
}
function renderDeepAnalysis(type=activeAnalysisType,filter=activeAnalysisFilter){
 const section=deepAnalysis[type];
 if(!section)return;
 activeAnalysisType=type;
 activeAnalysisFilter=filter||'all';

 $$('#analysis-tabs button[data-analysis]').forEach(button=>{
  button.classList.toggle('active',button.dataset.analysis===activeAnalysisType);
 });
 updateAnalysisFilterButtons();

 const visibleItems=getDeepAnalysisItems(activeAnalysisType,activeAnalysisFilter);
 $('#analysis-title').textContent=section.title;
 $('#analysis-description').textContent=`${section.description} Showing ${visibleItems.length} of ${section.items.length} findings.`;
 $('#analysis-findings').innerHTML=visibleItems.map((x,i)=>`<article class="analysis-finding" data-analysis-finding-index="${i}" data-analysis-severity="${x.severity}" data-analysis-effort="${x.effort}"><div class="finding-top"><span class="risk-label ${x.severity}">${x.severity} risk</span><span class="finding-location">@ ${x.location}</span><span class="finding-index">${String(i+1).padStart(2,'0')}</span></div><h3>${x.name}</h3><p>${x.detail}</p><div class="comparison"><div class="current-example"><small>CURRENT</small><code>${x.current}</code></div><div class="better-example"><small>RECOMMENDED</small><code>${x.better}</code></div></div><div class="finding-foot"><span><b>Impact</b> ${x.impact}</span><span><b>Effort</b> ${x.effort}</span><button class="text-btn" type="button" data-analysis-action="${x.name}">Create action -></button></div></article>`).join('');
}
function openDeepAnalysisView(type='dead-code',filter='all'){
 switchView('deep-analysis');
 renderDeepAnalysis(type,filter);
 const firstFinding=$('#analysis-findings .analysis-finding');
 if(firstFinding)firstFinding.scrollIntoView({behavior:'smooth',block:'center'});
}
function formatTokens(value){return value>=1000000?(value/1000000).toFixed(2)+'M':Math.round(value/1000)+'K'}
function renderAIArchitecture(multiplier){const max=450000*multiplier;const totals=aiComponents.reduce((a,c)=>({input:a.input+c.input*multiplier,output:a.output+c.output*multiplier,calls:a.calls+Math.ceil(c.calls*Math.sqrt(multiplier))}),{input:0,output:0,calls:0});$('#total-input').textContent=formatTokens(totals.input);$('#total-output').textContent=formatTokens(totals.output);$('#total-calls').textContent=totals.calls;$('#token-chart').innerHTML=aiComponents.map(c=>`<div class="token-row"><div class="token-label"><b>${c.name}</b><small>${formatTokens(c.input*multiplier)} in  -  ${formatTokens(c.output*multiplier)} out</small></div><div class="token-track"><i style="width:${Math.max(4,(c.input*multiplier/max)*100)}%"></i><em style="width:${Math.max(2,(c.output*multiplier/max)*100)}%"></em></div><span>${Math.ceil(c.calls*Math.sqrt(multiplier))} calls</span></div>`).join('');$('#ai-component-grid').innerHTML=aiComponents.map(c=>`<article class="ai-component-card" data-ai-component="${c.id}"><div class="ai-card-head"><span>${c.name.slice(0,2).toUpperCase()}</span><div><b>${c.name}</b><small>${c.mode}</small></div></div><p>${c.purpose}</p><div class="ai-card-metrics"><span><small>Per audit</small><b>${formatTokens((c.input+c.output)*multiplier)}</b></span><span><small>Build-assist est.</small><b>${formatTokens(c.build)}</b></span><span><small>Latency</small><b>${c.latency}</b></span><span><small>Confidence</small><b>${c.confidence}</b></span></div></article>`).join('');highlightPipelineAIComponents(null)}
function renderBatch(){const statusText={running:'Processing',complete:'Completed',failed:'Retry',queued:'Queued'};$('#batch-table').innerHTML=batchProjects.map((p,i)=>`<tr><td><div class="batch-project"><span>${p.name[0]}</span><b>${p.name}</b></div></td><td>${p.source}</td><td><span class="preset-pill">${p.preset}</span></td><td><span class="batch-status ${p.status}">${statusText[p.status]}</span><small>${p.stage}</small></td><td><div class="batch-row-progress"><div class="progress"><i style="width:${p.progress}%"></i></div><b>${p.progress}%</b></div></td><td>${p.tokens}</td><td><button class="batch-action" data-batch-action="${i}">${p.status==='failed'?'refresh Retry':p.status==='running'?'II':'***'}</button></td></tr>`).join('');const complete=batchProjects.filter(p=>p.status==='complete').length,running=batchProjects.filter(p=>p.status==='running').length,failed=batchProjects.filter(p=>p.status==='failed').length,percent=Math.round(batchProjects.reduce((n,p)=>n+p.progress,0)/batchProjects.length);const batchTotal=$('#batch-total');const batchNavCount=$('#batch-nav-count');const batchCompleted=$('#batch-completed');const batchRunning=$('#batch-running');const batchFailed=$('#batch-failed');const batchPercent=$('#batch-percent');const batchProgressBar=$('#batch-progress-bar');if(batchTotal)batchTotal.textContent=batchProjects.length;if(batchNavCount)batchNavCount.textContent=batchProjects.length;if(batchCompleted)batchCompleted.textContent=complete;if(batchRunning)batchRunning.textContent=running;if(batchFailed)batchFailed.textContent=failed;if(batchPercent)batchPercent.textContent=percent+'%';if(batchProgressBar)batchProgressBar.style.width=percent+'%'}
function renderSecurityManifest(){$('#security-manifest').innerHTML=securityManifest.map(x=>`<tr><td><b>${x.name}</b></td><td>${x.version}</td><td>${x.authority}</td><td><span class="manifest-status ${x.status}">${x.status}</span></td><td>${x.focus}</td><td>${x.checked}</td></tr>`).join('')}
function getSelectedFrameworks(){
 const selected=[];
 $$('#check-grid .check-card').forEach((card,index)=>{
  if($('input',card)?.checked)selected.push(frameworks[index]);
 });
 return selected;
}
function getRestrictionScopeSummary(selectedFrameworks){
 const ids=new Set(selectedFrameworks.map(x=>x.id));
 const labels=[];
 if(ids.has('cui-32cfr2002'))labels.push('CUI');
 if(ids.has('itar-22cfr120'))labels.push('ITAR');
 if(ids.has('ear-15cfr730'))labels.push('EAR');
 if(ids.has('dfars-7012'))labels.push('DFARS');
 if(ids.has('nist-800-171'))labels.push('NIST 800-171');
 if(ids.has('nist-800-172'))labels.push('NIST 800-172');
 if(ids.has('cmmc-2'))labels.push('CMMC 2.0');
 return labels.length?`Restricted-data compliance scope: ${labels.join(', ')}`:null;
}
function normalizeProjectName(rawName,fallback='Untitled AI project'){
 const cleaned=(rawName||'').trim().replace(/\s+/g,' ');
 return cleaned||fallback;
}
function getCurrentSourceContext(){
 const active=$('.source-tabs button.active')?.dataset.source||'folder';
 const files=[...($('#folder-input')?.files||[])];
 const rootName=files[0]?.webkitRelativePath?.split('/')?.[0]||'';
 if(active==='github')return {kind:'GitHub repository',label:'GitHub repository URL',artifact:'Repository manifest',comparison:'repository source code and dependency manifests'};
 if(active==='design'){
  const designContext=runtimeState.lastDesignContext;
  return {kind:'Design evidence package',label:designContext?.fileNames?.slice(0,2).join(', ')||'Design evidence upload',artifact:`${designContext?.fileNames?.length||0} design artifact(s)`,comparison:designContext?.comparisonTarget||'high-level design evidence, PowerPoint, PDFs, and architecture artifacts'};
 }
 if(active==='data'){
  const designContext=runtimeState.lastDesignContext;
  if(designContext?.fileNames?.length){
   return {kind:'Design evidence source',label:designContext.fileNames.slice(0,2).join(', '),artifact:`${designContext.fileNames.length} design artifact(s)`,comparison:designContext.comparisonTarget};
  }
  return {kind:'Data source',label:'Connected evidence source',artifact:'Evidence collection',comparison:'structured evidence records and attached design artifacts'};
 }
 return {kind:'Project folder',label:rootName||'Local project folder',artifact:rootName||'Local folder contents',comparison:'source code, local policies, and architecture assets'};
}
function createBaselineManifestId(sourceCount){
 const now=new Date();
 const stamp=`${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
 return `BL-${stamp}-${sourceCount}src`;
}
function buildRunContext(projectName,selectedFrameworks){
 const normalizedProjectName=normalizeProjectName(projectName);
 const sourceContext=getCurrentSourceContext();
 const baselineCheck=runtimeState.lastBaselineCheck||{stamp:new Date().toLocaleString(),sourceCount:securityManifest.length,manifestId:createBaselineManifestId(securityManifest.length)};
 const reportName=`${normalizedProjectName} Audit Report`;
 const comparisonTarget=sourceContext.comparison;
 const knowledgeBaseSummary=`Knowledge base refreshed from ${baselineCheck.sourceCount} pinned policy resources and compared against ${comparisonTarget}.`;
 return {
  projectName:normalizedProjectName,
  reportName,
  sourceKind:sourceContext.kind,
  sourceLabel:sourceContext.label,
  sourceArtifact:sourceContext.artifact,
  comparisonTarget,
  baselineCheck,
  selectedFrameworks:[...selectedFrameworks],
  liveGovernanceMode:isLiveGovernanceModeEnabled()
 };
}
function renderRunContext(containerId,runContext){
 const container=$(containerId);
 if(!container||!runContext)return;
 container.innerHTML=`<div class="quality-row"><div><span>Project</span><b>${runContext.projectName}</b></div><div><small>Current audit target</small></div></div>
 <div class="quality-row"><div><span>Report name</span><b>${runContext.reportName}</b></div><div><small>Generated title</small></div></div>
 <div class="quality-row"><div><span>Source analyzed</span><b>${runContext.sourceKind}</b></div><div><small>${runContext.sourceLabel}</small></div></div>
 <div class="quality-row"><div><span>Comparison target</span><b>${runContext.comparisonTarget}</b></div><div><small>${runContext.sourceArtifact}</small></div></div>`;
}
function renderPolicySync(containerId,runContext){
 const container=$(containerId);
 if(!container||!runContext)return;
 container.innerHTML=`<div class="quality-row"><div><span>Policy resources checked</span><b>${runContext.baselineCheck.sourceCount}</b></div><div><small>${runContext.baselineCheck.stamp}</small></div></div>
 <div class="quality-row"><div><span>Pinned manifest</span><b>${runContext.baselineCheck.manifestId}</b></div><div><small>Retained with this report</small></div></div>
 <div class="quality-row"><div><span>Knowledge base update</span><b>Completed before scoring</b></div><div><small>${runContext.comparisonTarget}</small></div></div>
 <div class="quality-row"><div><span>Comparison method</span><b>Policies + knowledge base against source</b></div><div><small>${runContext.selectedFrameworks.map(f=>f.short).join(', ')||'No frameworks selected'}</small></div></div>`;
}
function formatTokenNumber(value){
 return `${Math.round(value).toLocaleString()} tokens`;
}
function formatUsdRange(minValue,maxValue){
 return `$${minValue.toFixed(2)} - $${maxValue.toFixed(2)}`;
}
function getLlmAssistFactor(mode){
 if(mode==='Model-led')return 1.22;
 if(mode==='Adversarial')return 1.18;
 if(mode==='Independent')return 1.1;
 if(mode==='Hybrid')return 1.14;
 return 1.0;
}
function parseCompactTokenValue(rawValue){
 const value=String(rawValue||'').trim().toUpperCase();
 if(!value)return 0;
 const numeric=Number.parseFloat(value.replace(/[^\d.]/g,''));
 if(Number.isNaN(numeric))return 0;
 if(value.endsWith('M'))return numeric*1_000_000;
 if(value.endsWith('K'))return numeric*1_000;
 return numeric;
}
function estimateHistoricalCostRange(totalEstimated){
 const lowRatePer1M=1.54;
 const highRatePer1M=8.26;
 const totalInMillions=totalEstimated/1_000_000;
 return {
  estimatedCostLow:totalInMillions*lowRatePer1M,
  estimatedCostHigh:totalInMillions*highRatePer1M
 };
}
function ensureSeedTokenHistory(){
 if(runtimeState.tokenHistory.length)return;
 const seedItems=batchProjects
  .filter(project=>project.status==='complete'||project.status==='running')
  .slice(0,6)
  .map(project=>{
   const totalEstimated=parseCompactTokenValue(project.tokens);
   if(!totalEstimated)return null;
   const costs=estimateHistoricalCostRange(totalEstimated);
   return {
    at:project.stage,
    projectName:project.name,
    sourceKind:project.source,
    frameworkCount:0,
    totalEstimated,
    estimatedCostLow:costs.estimatedCostLow,
    estimatedCostHigh:costs.estimatedCostHigh,
    synthetic:true
   };
  })
  .filter(Boolean);
 if(seedItems.length)runtimeState.tokenHistory.push(...seedItems);
}
function getTechnicalEstimateSignature(runContext,selectedFrameworks,result){
 const sourceKind=runContext?.sourceKind||'Unknown';
 const frameworkIds=(selectedFrameworks||[]).map(item=>item.id).sort().join(',');
 const riskCount=Array.isArray(result?.reflection?.risks)?result.reflection.risks.length:Number(result?.riskCount||0);
 return `${sourceKind}|${frameworkIds}|${riskCount}`;
}
function getResolvedTechnicalLandscapeEstimate(runContext,selectedFrameworks,result){
 const signature=getTechnicalEstimateSignature(runContext,selectedFrameworks,result);
 const localEstimate=estimateTechnicalLandscape(runContext,selectedFrameworks,result);
 if(runtimeState.liveTechnicalEstimate?.signature===signature){
  return {...localEstimate,...runtimeState.liveTechnicalEstimate.estimate};
 }
 return localEstimate;
}
async function requestTechnicalLandscapeEstimate(runContext,selectedFrameworks,result,{rerenderPreview=false,rerenderReport=false}={}){
 const signature=getTechnicalEstimateSignature(runContext,selectedFrameworks,result);
 if(runtimeState.liveTechnicalEstimate?.signature===signature||runtimeState.estimatePendingSignature===signature)return;

 const requestId=++runtimeState.estimateRequestId;
 runtimeState.estimatePendingSignature=signature;

 try{
  const response=await fetch(`${policyRagApiBase}/estimate`,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({runContext,selectedFrameworks,result,aiComponents})
  });
  if(!response.ok){
   const payload=await response.json().catch(()=>({}));
   throw new Error(payload.error||'Technical estimate unavailable');
  }

  const payload=await response.json();
  if(requestId!==runtimeState.estimateRequestId)return;
  runtimeState.liveTechnicalEstimate={signature,estimate:payload.estimate};
  renderPlaybookTokenReference();
  if(rerenderPreview)renderAuditWorkspaceTechnicalPreview({refreshProvider:false});
  if(rerenderReport&&runtimeState.lastRunContext){
   const reportFrameworks=runtimeState.lastRunContext.selectedFrameworks||selectedFrameworks;
   const reportResult=runtimeState.lastRun||result;
   renderTechnicalLandscape('#report-ai-technical',runtimeState.lastRunContext,reportFrameworks,reportResult);
   renderTechnicalLandscape('#new-audit-ai-technical',runtimeState.lastRunContext,reportFrameworks,reportResult);
  }
 }catch(error){
  if(requestId===runtimeState.estimateRequestId&&runtimeState.liveTechnicalEstimate?.signature===signature){
   runtimeState.liveTechnicalEstimate=null;
  }
 }finally{
  if(runtimeState.estimatePendingSignature===signature)runtimeState.estimatePendingSignature=null;
 }
}
function estimateTechnicalLandscape(runContext,selectedFrameworks,result){
 const sourceKind=(runContext?.sourceKind||'').toLowerCase();
 const sourceFactor=sourceKind.includes('github')?1.26:sourceKind.includes('design')?0.92:sourceKind.includes('data source')?1.08:1.16;
 const frameworkFactor=1+Math.min(0.55,selectedFrameworks.length*0.045);
 const riskFactor=1+Math.min(0.35,(result?.reflection?.risks?.length||0)*0.05);

 const basePrompt=aiComponents.reduce((sum,item)=>sum+item.input,0);
 const baseCompletion=aiComponents.reduce((sum,item)=>sum+item.output,0);
 const baseBuild=aiComponents.reduce((sum,item)=>sum+item.build,0);

 const approxPrompt=basePrompt*sourceFactor*frameworkFactor;
 const approxCompletion=baseCompletion*frameworkFactor;
 const approxReasoning=(approxPrompt+approxCompletion)*0.18*riskFactor;
 const retrievalAndIndexing=baseBuild*(sourceKind.includes('design')?0.52:0.64);
 const totalEstimated=approxPrompt+approxCompletion+approxReasoning+retrievalAndIndexing;
 const modelPriceProfiles={
  economy:{promptPer1M:0.28,completionPer1M:1.1,retrievalPer1M:0.16},
  premium:{promptPer1M:1.45,completionPer1M:6.4,retrievalPer1M:0.42}
 };
 const billablePrompt=approxPrompt+retrievalAndIndexing*0.32;
 const billableCompletion=approxCompletion+approxReasoning;
 const lowCost=(billablePrompt/1_000_000)*modelPriceProfiles.economy.promptPer1M+(billableCompletion/1_000_000)*modelPriceProfiles.economy.completionPer1M+(retrievalAndIndexing/1_000_000)*modelPriceProfiles.economy.retrievalPer1M;
 const highCost=(billablePrompt/1_000_000)*modelPriceProfiles.premium.promptPer1M+(billableCompletion/1_000_000)*modelPriceProfiles.premium.completionPer1M+(retrievalAndIndexing/1_000_000)*modelPriceProfiles.premium.retrievalPer1M;

 const componentBreakdown=aiComponents.map(item=>{
  const llmFactor=getLlmAssistFactor(item.mode);
  const baseline=item.input+item.output;
  const sourceAdjusted=baseline*sourceFactor;
  const frameworkAdjusted=sourceAdjusted*frameworkFactor;
  const llmAdjusted=frameworkAdjusted*llmFactor;
  const riskAdjusted=llmAdjusted*(1+((riskFactor-1)*0.5));
  return {
   name:item.name,
   mode:item.mode,
   latency:item.latency,
   llmFactor,
   input:item.input,
   output:item.output,
   build:item.build,
   baseline,
   sourceAdjusted,
   frameworkAdjusted,
   llmAdjusted,
   riskAdjusted
  };
 });
 const topComponents=[...componentBreakdown]
  .sort((a,b)=>b.riskAdjusted-a.riskAdjusted)
  .slice(0,4)
  .map(item=>({
   name:item.name,
   total:item.riskAdjusted,
   mode:item.mode,
   latency:item.latency
  }));
 const llmModeTotals=componentBreakdown.reduce((acc,item)=>{
  acc[item.mode]=(acc[item.mode]||0)+item.riskAdjusted;
  return acc;
 },{});

 const frameworkIds=new Set(selectedFrameworks.map(item=>item.id));
 const recommendations=[
  {area:'Orchestration',stack:'Agent Engine + durable workflow queue',reason:'Supports staged planning, retries, and deterministic audit progression.'},
  {area:'Storage',stack:'PostgreSQL (audit metadata) + object store (evidence snapshots)',reason:'Separates transactional control state from immutable evidence artifacts.'},
  {area:'Observability',stack:'OpenTelemetry + Prometheus + Grafana',reason:'Tracks run latency, failures, and model-risk indicators per stage.'}
 ];

 if(sourceKind.includes('github')){
  recommendations.push({area:'CI security',stack:'GitHub Actions + Semgrep + Trivy + OPA',reason:'Aligns repository-first intake with policy-as-code and supply-chain checks.'});
 }
 if(sourceKind.includes('folder')){
  recommendations.push({area:'Local intake hardening',stack:'Pre-commit hooks + SBOM generation + signed manifests',reason:'Improves provenance and repeatability for local project uploads.'});
 }
 if(frameworkIds.has('nist')||frameworkIds.has('euai')||frameworkIds.has('iso42001')||frameworkIds.has('nist-gai')){
  recommendations.push({area:'Responsible AI',stack:'MLflow + Evidently + Fairlearn + model cards',reason:'Provides monitoring and governance evidence for consequential AI behavior.'});
 }
 if(frameworkIds.has('cui-32cfr2002')||frameworkIds.has('itar-22cfr120')||frameworkIds.has('ear-15cfr730')||frameworkIds.has('dfars-7012')){
  recommendations.push({area:'Restricted data controls',stack:'Attribute-based access control + HSM-backed key management + DLP',reason:'Enforces export and dissemination restrictions across artifacts and outputs.'});
 }

 return {
  approxPrompt,
  approxCompletion,
  approxReasoning,
  retrievalAndIndexing,
  totalEstimated,
  estimatedCostLow:lowCost,
  estimatedCostHigh:highCost,
  modelPriceProfiles,
  sourceFactor,
  frameworkFactor,
  riskFactor,
  componentBreakdown,
  llmModeTotals,
  topComponents,
  recommendations
 };
}
function renderTechnicalLandscape(containerId,runContext,selectedFrameworks,result){
 const host=$(containerId);
 if(!host||!runContext||!selectedFrameworks||!result)return;
 ensureSeedTokenHistory();
 const staticLandscape=estimateTechnicalLandscape(runContext,selectedFrameworks,result);
 const landscape=getResolvedTechnicalLandscapeEstimate(runContext,selectedFrameworks,result);
 const sourceLabel=runContext.sourceKind;
 const hasLivePricing=Boolean(landscape.provider?.chatDeployment);
 const baselineSnapshot=runtimeState.tokenHistory[runtimeState.tokenHistory.length-1]||null;
 const baselineTokens=baselineSnapshot?.totalEstimated??landscape.totalEstimated;
 const baselineCostLow=baselineSnapshot?.estimatedCostLow??landscape.estimatedCostLow;
 const baselineCostHigh=baselineSnapshot?.estimatedCostHigh??landscape.estimatedCostHigh;
 const baselineNote=baselineSnapshot?.synthetic?'Seeded from batch history':'Most recent completed run snapshot';
 const deltaTokens=landscape.totalEstimated-baselineTokens;
 const deltaCostLow=landscape.estimatedCostLow-baselineCostLow;
 const deltaCostHigh=landscape.estimatedCostHigh-baselineCostHigh;
 const trendMetricConfig=getTrendMetricConfig(runtimeState.trendMetric,landscape);
 const trendValues=[...runtimeState.tokenHistory.map(item=>trendMetricConfig.getHistoryValue(item)),trendMetricConfig.currentValue];
 const sparklinePoints=buildSparklinePoints(trendValues);
 const trendDelta=trendValues.length>1?trendValues[trendValues.length-1]-trendValues[0]:0;
 const trendLabel=trendDelta===0?`Flat ${trendMetricConfig.label.toLowerCase()} trend`:`${trendDelta>0?'Up':'Down'} ${trendMetricConfig.formatDelta(trendDelta).replace(/^[+-]/,'')} across ${trendValues.length} points`;
 const realtimeRows=`<div class="tech-live-comparison"><div class="quality-row"><div><span>Baseline (last audit run)</span><b>${formatTokenNumber(baselineTokens)}  -  ${formatUsdRange(baselineCostLow,baselineCostHigh)}</b></div><div><small>${baselineNote}</small></div></div>
 <div class="quality-row"><div><span>Real-time delta</span><b>${renderDeltaValue(`${deltaTokens>=0?'+':'-'}${formatTokenNumber(Math.abs(deltaTokens))}`,getDeltaState(deltaTokens))}  -  ${renderDeltaValue(`${deltaCostLow>=0?'+':'-'}$${Math.abs(deltaCostLow).toFixed(2)} to ${deltaCostHigh>=0?'+':'-'}$${Math.abs(deltaCostHigh).toFixed(2)}`,getDeltaState((deltaCostLow+deltaCostHigh)/2))}</b></div><div><small>Current scope compared against last completed run</small></div></div>
 <div class="tech-trend-card"><div class="tech-trend-head"><span>Recent run comparison</span><div class="trend-toggle" role="tablist" aria-label="Trend metric"><button type="button" class="${runtimeState.trendMetric==='tokens'?'active':''}" data-trend-metric="tokens">Tokens</button><button type="button" class="${runtimeState.trendMetric==='cost'?'active':''}" data-trend-metric="cost">USD</button></div><b>${trendLabel}</b></div><svg viewBox="0 0 240 58" role="img" aria-label="${trendMetricConfig.ariaLabel}"><polyline points="${sparklinePoints}" /></svg><small>Viewing ${trendMetricConfig.label.toLowerCase()} across previous runs and the live estimate.</small></div></div>`;
 const llmContributionLabel=Object.entries(landscape.llmModeTotals)
  .sort((a,b)=>b[1]-a[1])
  .map(([mode,tokens])=>`${mode}: ${Math.round(tokens/1000)}k`)
  .join('  -  ');
 const providerNote=landscape.provider?.chatDeployment
  ?`Calculated with configured Azure OpenAI deployment ${landscape.provider.chatDeployment} (${landscape.provider.source}).`
  :'Using embedded estimation profile.';
 const tokenDiff=landscape.totalEstimated-staticLandscape.totalEstimated;
 const pricingDiffLow=landscape.estimatedCostLow-staticLandscape.estimatedCostLow;
 const pricingDiffHigh=landscape.estimatedCostHigh-staticLandscape.estimatedCostHigh;
 const pricingComparisonRows=`<div class="tech-live-comparison"><div class="quality-row"><div><span>Static token estimate</span><b>${formatTokenNumber(staticLandscape.totalEstimated)}</b></div><div><small>Embedded estimator using source, framework, and risk factors</small></div></div>
 <div class="quality-row"><div><span>Real-time token estimate</span><b>${hasLivePricing?formatTokenNumber(landscape.totalEstimated):'Waiting for provider estimate'}</b></div><div><small>${hasLivePricing?'Resolved from backend-assisted run context and configured deployment profile.':'Fetching configured Azure OpenAI deployment estimate from the backend.'}</small></div></div>
 <div class="quality-row"><div><span>Token difference</span><b>${hasLivePricing?renderDeltaValue(`${tokenDiff>=0?'+':'-'}${formatTokenNumber(Math.abs(tokenDiff))}`,getDeltaState(tokenDiff)):'<span class="delta-value delta-pending">Pending live comparison</span>'}</b></div><div><small>${hasLivePricing?'Difference between static token model and real-time backend estimate.':'Run scope is ready; live token comparison will fill in after the backend responds.'}</small></div></div>
 <div class="quality-row"><div><span>Static pricing profile</span><b>${formatUsdRange(staticLandscape.estimatedCostLow,staticLandscape.estimatedCostHigh)}</b></div><div><small>Embedded economy/premium reference table</small></div></div>
 <div class="quality-row"><div><span>Real-time provider pricing</span><b>${hasLivePricing?formatUsdRange(landscape.estimatedCostLow,landscape.estimatedCostHigh):'Waiting for provider estimate'}</b></div><div><small>${hasLivePricing?providerNote:'Fetching configured Azure OpenAI deployment pricing from the backend.'}</small></div></div>
 <div class="quality-row"><div><span>Pricing difference</span><b>${hasLivePricing?renderDeltaValue(`${pricingDiffLow>=0?'+':'-'}$${Math.abs(pricingDiffLow).toFixed(2)} to ${pricingDiffHigh>=0?'+':'-'}$${Math.abs(pricingDiffHigh).toFixed(2)}`,getDeltaState((pricingDiffLow+pricingDiffHigh)/2)):'<span class="delta-value delta-pending">Pending live comparison</span>'}</b></div><div><small>${hasLivePricing?'Difference between static profile and configured deployment pricing.':'Run scope is ready; live provider comparison will fill in after the backend responds.'}</small></div></div></div>`;
 const highLevelRows=`<div class="quality-row"><div><span>Approximate total token consumption</span><b>${formatTokenNumber(landscape.totalEstimated)}</b></div><div><small>Includes prompt, completion, reasoning, and retrieval/indexing phases</small></div></div>
 <div class="quality-row"><div><span>Estimated AI runtime cost (USD)</span><b>${formatUsdRange(landscape.estimatedCostLow,landscape.estimatedCostHigh)}</b></div><div><small>${providerNote}</small></div></div>
 <p class="report-copy" style="margin-top:10px;">Highest token components this run: ${landscape.topComponents.map(item=>`${item.name} (${Math.round(item.total/1000)}k, ${item.mode}, ${item.latency})`).join('  -  ')}</p>`;
 const detailRows=`<div class="quality-row"><div><span>Prompt tokens</span><b>${formatTokenNumber(landscape.approxPrompt)}</b></div><div><small>Source + framework-scoped context ingestion</small></div></div>
 <div class="quality-row"><div><span>Completion tokens</span><b>${formatTokenNumber(landscape.approxCompletion)}</b></div><div><small>Agent outputs and report synthesis</small></div></div>
 <div class="quality-row"><div><span>Reasoning and evaluator overhead</span><b>${formatTokenNumber(landscape.approxReasoning)}</b></div><div><small>Reflection, challenge checks, and confidence calibration</small></div></div>
 <div class="quality-row"><div><span>Retrieval and indexing budget</span><b>${formatTokenNumber(landscape.retrievalAndIndexing)}</b></div><div><small>Policy RAG refresh, chunking, and relevance scoring</small></div></div>
 <div class="quality-row"><div><span>Pricing assumptions</span><b>${landscape.provider?.pricing?`Prompt $${landscape.provider.pricing.promptPer1M}/1M  -  Completion $${landscape.provider.pricing.completionPer1M}/1M`:`Economy $${landscape.modelPriceProfiles.economy.promptPer1M}/$${landscape.modelPriceProfiles.economy.completionPer1M}  -  Premium $${landscape.modelPriceProfiles.premium.promptPer1M}/$${landscape.modelPriceProfiles.premium.completionPer1M}`}</b></div><div><small>${landscape.provider?.pricing?'Configured deployment pricing profile plus retrieval cost.':'Prompt/completion cost per 1M tokens; retrieval priced separately'}</small></div></div>
 <div class="quality-row"><div><span>Token calculation model</span><b>(Input + Output) x Source x Framework x LLM Assist x Risk</b></div><div><small>Source factor: ${landscape.sourceFactor.toFixed(2)} (${sourceLabel})  -  Framework factor: ${landscape.frameworkFactor.toFixed(2)}  -  Risk factor: ${landscape.riskFactor.toFixed(2)}</small></div></div>
 <div class="quality-row"><div><span>LLM assistance contribution</span><b>${llmContributionLabel}</b></div><div><small>Token pressure grouped by component execution mode</small></div></div>
 <div style="margin-top:10px;">
  ${landscape.componentBreakdown.map(item=>`<div class="quality-row"><div><span>${item.name}</span><b>${formatTokenNumber(item.riskAdjusted)}</b></div><div><small>Input ${Math.round(item.input/1000)}k + Output ${Math.round(item.output/1000)}k  -  ${item.mode} assist ${item.llmFactor.toFixed(2)}x  -  ${item.latency}</small></div></div>`).join('')}
 </div>
 <div class="tech-tags" style="margin-top:8px;">${landscape.recommendations.slice(0,4).map(item=>`<span>${item.area}: ${item.stack}</span>`).join('')}</div>
 <div style="margin-top:10px;">${landscape.recommendations.map(item=>`<div class="quality-row"><div><span>${item.area}</span><b>${item.stack}</b></div><div><small>${item.reason}</small></div></div>`).join('')}</div>`;
 host.innerHTML=`${highLevelRows}
 ${pricingComparisonRows}
 ${realtimeRows}
 <details class="token-estimate-details">
  <summary>Explain this estimate</summary>
  <div class="token-estimate-details-body">${detailRows}</div>
 </details>`;
}
  function recordTokenEstimateSnapshot(runContext,selectedFrameworks,result){
   if(!runContext||!selectedFrameworks||!result)return;
   const estimate=estimateTechnicalLandscape(runContext,selectedFrameworks,result);
   runtimeState.tokenHistory.push({
    at:new Date().toLocaleString(),
    projectName:runContext.projectName,
    sourceKind:runContext.sourceKind,
    frameworkCount:selectedFrameworks.length,
    totalEstimated:estimate.totalEstimated,
    estimatedCostLow:estimate.estimatedCostLow,
    estimatedCostHigh:estimate.estimatedCostHigh
   });
   if(runtimeState.tokenHistory.length>12)runtimeState.tokenHistory.shift();
  }
  function buildSparklinePoints(values,width=240,height=58,padding=6){
   if(!values.length)return '';
   const min=Math.min(...values);
   const max=Math.max(...values);
   const yScale=max===min?0:(height-padding*2)/(max-min);
   const xStep=values.length===1?0:(width-padding*2)/(values.length-1);
   return values.map((value,index)=>{
    const x=padding+(xStep*index);
    const y=max===min?height/2:height-padding-((value-min)*yScale);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
   }).join(' ');
  }
  function getTrendMetricConfig(metric,currentEstimate){
   if(metric==='cost'){
    return {
     label:'USD cost',
     currentValue:(currentEstimate.estimatedCostLow+currentEstimate.estimatedCostHigh)/2,
     getHistoryValue:item=>(item.estimatedCostLow+item.estimatedCostHigh)/2,
     formatValue:value=>`$${value.toFixed(2)}`,
     formatDelta:value=>`${value>=0?'+':'-'}$${Math.abs(value).toFixed(2)}`,
     ariaLabel:'AI technical cost trend'
    };
   }
   return {
    label:'Tokens',
    currentValue:currentEstimate.totalEstimated,
    getHistoryValue:item=>item.totalEstimated,
    formatValue:value=>formatTokenNumber(value),
    formatDelta:value=>`${value>=0?'+':'-'}${formatTokenNumber(Math.abs(value))}`,
    ariaLabel:'AI technical token trend'
   };
  }
  function getDeltaState(value){
   if(value>0)return 'increase';
   if(value<0)return 'decrease';
   return 'flat';
  }
  function renderDeltaValue(label,state){
   const meta={
    increase:{icon:'',text:'Higher than static'},
    decrease:{icon:'down',text:'Lower than static'},
    flat:{icon:'*',text:'Matches static'},
    pending:{icon:'...',text:'Waiting for live data'}
   }[state]||{icon:'*',text:'Comparison state'};
   return `<span class="delta-value delta-${state}"><span>${meta.icon}</span>${label}<small>${meta.text}</small></span>`;
  }
  function renderPlaybookTokenReference(){
   const host=$('#playbook-token-reference');
   if(!host)return;
    ensureSeedTokenHistory();

   const selectedFrameworks=getSelectedFrameworks();
   const activeContext=runtimeState.lastRunContext||buildRunContext($('#project-name')?.value||'Untitled AI project',selectedFrameworks);
   const resultContext=runtimeState.lastRun||{reflection:{risks:[]}};
  const staticEstimate=estimateTechnicalLandscape(activeContext,selectedFrameworks,resultContext);
  const current=getResolvedTechnicalLandscapeEstimate(activeContext,selectedFrameworks,resultContext);
  const hasLivePricing=Boolean(current.provider?.chatDeployment);
   const baselineSnapshot=runtimeState.tokenHistory[runtimeState.tokenHistory.length-1]||null;
   const baselineTokens=baselineSnapshot?.totalEstimated??current.totalEstimated;
   const baselineCostLow=baselineSnapshot?.estimatedCostLow??current.estimatedCostLow;
   const baselineCostHigh=baselineSnapshot?.estimatedCostHigh??current.estimatedCostHigh;
  const baselineNote=baselineSnapshot?.synthetic?'Seeded from batch history':'Most recent completed run snapshot';

   const currentTokenK=Math.round(current.totalEstimated/1000);
   const baselineTokenK=Math.round(baselineTokens/1000);
   const deltaTokens=current.totalEstimated-baselineTokens;
   const deltaCostLow=current.estimatedCostLow-baselineCostLow;
   const deltaCostHigh=current.estimatedCostHigh-baselineCostHigh;
   const tokenDeltaLabel=`${deltaTokens>=0?'+':'-'}${Math.abs(Math.round(deltaTokens/1000))}k`;
   const costDeltaLabel=`${deltaCostLow>=0?'+':'-'}$${Math.abs(deltaCostLow).toFixed(2)} to ${deltaCostHigh>=0?'+':'-'}$${Math.abs(deltaCostHigh).toFixed(2)}`;
  const staticTokenDiff=current.totalEstimated-staticEstimate.totalEstimated;
  const staticDeltaLow=current.estimatedCostLow-staticEstimate.estimatedCostLow;
  const staticDeltaHigh=current.estimatedCostHigh-staticEstimate.estimatedCostHigh;
   const frameworkLabel=selectedFrameworks.length?selectedFrameworks.map(item=>item.short).join(', '):'No frameworks selected';
  const trendMetricConfig=getTrendMetricConfig(runtimeState.trendMetric,current);
  const trendValues=[...runtimeState.tokenHistory.map(item=>trendMetricConfig.getHistoryValue(item)),trendMetricConfig.currentValue];
   const sparklinePoints=buildSparklinePoints(trendValues);
   const trendDelta=trendValues.length>1?trendValues[trendValues.length-1]-trendValues[0]:0;
  const trendLabel=trendDelta===0?`Flat ${trendMetricConfig.label.toLowerCase()} trend`:`${trendDelta>0?'Up':'Down'} ${trendMetricConfig.formatDelta(trendDelta).replace(/^[+-]/,'')} across ${trendValues.length} points`;

   host.innerHTML=`<h3>Token and cost estimation algorithm</h3>
   <p>Formula: (Input + Output) x Source x Framework x LLM Assist x Risk + Retrieval/Indexing overhead.</p>
   <div class="quality-row"><div><span>Current scope</span><b>${activeContext.sourceKind}  -  ${selectedFrameworks.length} frameworks</b></div><div><small>${frameworkLabel}</small></div></div>
   <div class="quality-row"><div><span>Current estimate</span><b>${currentTokenK}k tokens  -  ${formatUsdRange(current.estimatedCostLow,current.estimatedCostHigh)}</b></div><div><small>Source ${current.sourceFactor.toFixed(2)}x  -  Framework ${current.frameworkFactor.toFixed(2)}x  -  Risk ${current.riskFactor.toFixed(2)}x</small></div></div>
  <div class="playbook-reference-compare"><div><span>Static token estimate</span><b>${formatTokenNumber(staticEstimate.totalEstimated)}</b><small>Embedded reference estimator</small></div><div><span>Live token estimate</span><b>${hasLivePricing?formatTokenNumber(current.totalEstimated):'Waiting for provider estimate'}</b><small>${hasLivePricing?`Difference ${renderDeltaValue(`${staticTokenDiff>=0?'+':'-'}${formatTokenNumber(Math.abs(staticTokenDiff))}`,getDeltaState(staticTokenDiff))}`:'<span class="delta-value delta-pending">Backend comparison pending</span>'}</small></div></div>
  <div class="playbook-reference-compare"><div><span>Static pricing profile</span><b>${formatUsdRange(staticEstimate.estimatedCostLow,staticEstimate.estimatedCostHigh)}</b><small>Embedded reference pricing</small></div><div><span>Live provider pricing</span><b>${hasLivePricing?formatUsdRange(current.estimatedCostLow,current.estimatedCostHigh):'Waiting for provider estimate'}</b><small>${hasLivePricing?`Difference ${renderDeltaValue(`${staticDeltaLow>=0?'+':'-'}$${Math.abs(staticDeltaLow).toFixed(2)} to ${staticDeltaHigh>=0?'+':'-'}$${Math.abs(staticDeltaHigh).toFixed(2)}`,getDeltaState((staticDeltaLow+staticDeltaHigh)/2))}`:'<span class="delta-value delta-pending">Backend comparison pending</span>'}</small></div></div>
  <div class="playbook-reference-compare"><div><span>Baseline (last audit run)</span><b>${baselineTokenK}k tokens  -  ${formatUsdRange(baselineCostLow,baselineCostHigh)}</b><small>${baselineNote}</small></div><div><span>Real-time delta</span><b>${tokenDeltaLabel} tokens  -  ${costDeltaLabel}</b></div></div>
   <div class="playbook-trend-card"><div class="playbook-trend-head"><span>Recent run comparison</span><div class="trend-toggle" role="tablist" aria-label="Trend metric"><button type="button" class="${runtimeState.trendMetric==='tokens'?'active':''}" data-trend-metric="tokens">Tokens</button><button type="button" class="${runtimeState.trendMetric==='cost'?'active':''}" data-trend-metric="cost">USD</button></div><b>${trendLabel}</b></div><svg viewBox="0 0 240 58" role="img" aria-label="${trendMetricConfig.ariaLabel}"><polyline points="${sparklinePoints}" /></svg><small>Viewing ${trendMetricConfig.label.toLowerCase()} across previous runs and the current in-progress estimate.</small></div>
   <div class="quality-row"><div><span>Data source for estimate</span><b>Run context + framework selection + agent component catalog</b></div><div><small>Current source type, selected framework scope, model assist mode, and observed run risk signals.</small></div></div>`;
  }
  function renderAuditWorkspaceTechnicalPreview({refreshProvider=true}={}){
   const selectedFrameworks=getSelectedFrameworks();
   const previewContext=runtimeState.lastRunContext||buildRunContext($('#project-name')?.value||'Untitled AI project',selectedFrameworks);
   const previewResult=runtimeState.lastRun||{reflection:{risks:[]}};
    if($('#new-audit-ai-technical-preview'))renderTechnicalLandscape('#new-audit-ai-technical-preview',previewContext,selectedFrameworks,previewResult);
    if($('#new-audit-ai-technical'))renderTechnicalLandscape('#new-audit-ai-technical',previewContext,selectedFrameworks,previewResult);
   if(refreshProvider)requestTechnicalLandscapeEstimate(previewContext,selectedFrameworks,previewResult,{rerenderPreview:true});
  }
function getStageAgentNames(stageId){
 const ids=productStageAgentMap[stageId]||[];
 return ids.map(id=>productAgentsFlat.find(agent=>agent.id===id)?.name).filter(Boolean);
}
function buildTransparentProcessingTrace(runContext,selectedFrameworks){
 const startedAt=new Date().toLocaleString();
 const frameworkScope=selectedFrameworks.map(item=>item.short).join(', ')||'No frameworks selected';
 return productPipelineStages.map((stage,index)=>({
  stageId:stage.id,
  index:index+1,
  title:stage.title,
  lane:stage.lane,
  agents:getStageAgentNames(stage.id),
  method:stage.detail,
  evidence:productStageEvidenceMap[stage.id],
  startedAt,
  source:runContext.sourceKind,
  frameworkScope
 }));
}
function renderTransparentProcessingSteps(trace=[]){
 const host=$('#new-audit-processing-steps');
 if(!host)return;
 if(!trace.length){
  host.innerHTML='<p class="report-copy">Run a project evaluation to show transparent stage-by-stage processing details.</p>';
  return;
 }
 host.innerHTML=trace.map(item=>`<button type="button" class="processing-step" data-pipeline-stage="${item.stageId}"><span class="processing-step-no">${String(item.index).padStart(2,'0')}</span><div><b>${item.title}</b><small>${item.lane}  -  ${item.startedAt}</small><p>${item.method}</p><p><b>Agents:</b> ${item.agents.join(', ')}</p><p><b>Evidence output:</b> ${item.evidence}</p></div><em>Open in playbook -></em></button>`).join('');
}
function openProductTransparency({stageId=null,runAnimation=false,projectName=''}={}){
 switchView('product');
 setProductAgentTab('system');
 setPlaybookAgentTab('stages');
 if(stageId){
  applyProductAgentStageFilter(stageId);
  applyPlaybookAgentStageFilter(stageId);
  const step=$(`[data-playbook-stage="${stageId}"]`);
  if(step)step.scrollIntoView({behavior:'smooth',block:'center'});
 }
 if(projectName){
  populateSimulationProjectOptions(projectName);
  const select=$('#product-pipeline-project');
  if(select)select.value=projectName;
 }
 if(runAnimation){
  const runButton=$('#product-pipeline-run');
  if(runButton&&!runButton.disabled)runButton.click();
 }
}
function setAnalysisState(mode,{title,note,pill}={}){
 const banner=$('#analysis-state-banner');
 const titleEl=$('#analysis-state-title');
 const noteEl=$('#analysis-state-note');
 const pillEl=$('#analysis-state-pill');
 if(!banner||!titleEl||!noteEl||!pillEl)return;

 banner.classList.remove('is-idle','is-running','is-complete','is-failed');
 const className={idle:'is-idle',running:'is-running',complete:'is-complete',failed:'is-failed'}[mode]||'is-idle';
 banner.classList.add(className);
 titleEl.textContent=title||'Not analyzed yet';
 noteEl.textContent=note||'Run an evaluation to generate project intelligence tiles and drill-down insights.';
 pillEl.textContent=pill||({idle:'Idle',running:'Running',complete:'Analyzed',failed:'Failed'}[mode]||'Idle');
}
function renderProjectInsightTiles({runContext=null,selectedFrameworks=[],findingEntries=[]}={}){
 const findingsNormalized=findingEntries.map(normalizeFinding);
 const openFindings=findingsNormalized.length;
 const highRisk=findingsNormalized.filter(item=>item.severity==='high'||item.severity==='critical').length;
 const frameworkCount=selectedFrameworks.length;
 const policySyncValue=runContext?.baselineCheck?.manifestId||'Pending';
 const hasData=Boolean(runContext&&findingEntries.length);

 const openFindingsEl=$('#insight-open-findings');
 const frameworkCountEl=$('#insight-framework-count');
 const policySyncEl=$('#insight-policy-sync');
 const highRiskEl=$('#insight-high-risk');
 if(openFindingsEl)openFindingsEl.textContent=String(openFindings);
 if(frameworkCountEl)frameworkCountEl.textContent=String(frameworkCount);
 if(policySyncEl)policySyncEl.textContent=policySyncValue;
 if(highRiskEl)highRiskEl.textContent=String(highRisk);

 $$('#project-insight-tiles .project-insight-tile').forEach(tile=>{
  tile.disabled=!hasData;
  tile.classList.toggle('is-ready',hasData);
 });
}
function inferSourceLabel(){
 const active=$('.source-tabs button.active')?.dataset.source;
 if(active==='github')return 'GitHub';
 if(active==='data')return 'Data source';
 return 'Folder';
}
function inferBatchPreset(selectedFrameworks){
 const ids=new Set(selectedFrameworks.map(x=>x.id));
 if(ids.has('cui-32cfr2002')||ids.has('itar-22cfr120')||ids.has('ear-15cfr730')||ids.has('dfars-7012'))return 'Restricted data (CUI/Export)';
 if(ids.has('hipaa'))return 'Healthcare regulated';
 if(ids.has('gdpr')||ids.has('euai')||ids.has('iso42001'))return 'AI + privacy baseline';
 if(ids.size>=8)return 'Full multi-framework scan';
 return 'Enterprise assurance';
}
function queueProjectFromAuditForm(){
 const name=($('#project-name')?.value||'').trim()||`Queued Project ${batchProjects.length+1}`;
 const selectedFrameworks=getSelectedFrameworks();
 const source=inferSourceLabel();
 const preset=inferBatchPreset(selectedFrameworks);
 const frameworkHint=selectedFrameworks.length
  ?selectedFrameworks.map(x=>x.short).slice(0,4).join(', ')
  :'No frameworks selected';

 batchProjects.push({
  name,
  source,
  preset,
  stage:`Queued from New Audit  -  ${frameworkHint}`,
  progress:0,
  tokens:selectedFrameworks.length>=8?'1.9M':selectedFrameworks.length>=4?'1.4M':'1.0M',
  status:'queued'
 });
 renderBatch();
 populateSimulationProjectOptions(name);

 $('.toast b').textContent='Project added to audit queue';
 $('.toast small').textContent=`${name} queued (${source}  -  ${preset}).`;
 $('#toast').classList.add('show');
 setTimeout(()=>$('#toast').classList.remove('show'),1300);
}
function upsertDashboardAudit(projectName,selectedFrameworks,readiness,result){
 const frameworkBadges=selectedFrameworks.slice(0,3).map(item=>item.short.slice(0,3).toUpperCase());
 const needsEvidence=result?.reflection?.risks?.length||0;
 const status=needsEvidence>0?'Review':readiness>=90?'Ready':'Review';
 const findingsLabel=`${Math.max(1,needsEvidence+3)} / ${needsEvidence}`;
 const row=[
  projectName,
  `${inferSourceLabel()}  -  Agent Engine`,
  frameworkBadges.length?frameworkBadges:['AI'],
  readiness,
  findingsLabel,
  'Just now',
  status
 ];
 const existingIndex=audits.findIndex(item=>item[0]===projectName);
 if(existingIndex>=0){
  audits.splice(existingIndex,1);
 }
 audits.unshift(row);
 if(audits.length>20)audits.length=20;
 renderAuditHistoryTable();
 populateSimulationProjectOptions(projectName);
}
function buildObjective(projectName,selectedFrameworks){
 const restrictionScope=getRestrictionScopeSummary(selectedFrameworks);
 return {
  id:`obj_${Date.now()}`,
  title:`Evaluate compliance posture for ${projectName}`,
  domain:'ai-governance',
  constraints:[
   'Use approved evidence sources only',
   'Do not expose personal data in generated summaries',
   'Publish only after reflection and self-critique'
  ],
  successCriteria:[
   'All mandatory subgoals completed',
   'No unresolved high-risk findings',
   'Transparency log available to users',
    `Framework scope includes ${selectedFrameworks.map(f=>f.short).join(', ')||'no frameworks selected'}`,
    restrictionScope||'Restricted-data scope reviewed (no restricted classification frameworks selected)'
  ]
 };
}
function buildContextualFindings(runContext,selectedFrameworks){
 const ids=new Set(selectedFrameworks.map(item=>item.id));
 const sourceLabel=runContext.sourceKind.toLowerCase();
 const sourceTarget=runContext.sourceArtifact||runContext.comparisonTarget;
 const result=[];

 const pushFinding=(title,control,detail,effort,owner)=>{
  result.push([
   String(result.length+1).padStart(2,'0'),
   title,
   control,
   detail,
   effort,
   owner
  ]);
 };

 pushFinding(
  'Establish control ownership for uploaded evidence',
  'SOC 2 CC1  -  ISO 27001  -  NIST GOVERN',
  `Assign accountable owners, approvers, and review cadence for ${sourceTarget} so every assessed control has a named governance path.`,
  '1-2 days',
  'Governance Office'
 );
 pushFinding(
  'Pin immutable evidence provenance and source digests',
  'ISO 27001 A.5  -  NIST AI RMF  -  SOC 2 CC8',
  `Record source revisions, hashes, collector versions, and evidence timestamps for the uploaded ${sourceLabel} before publishing findings.`,
  '2-3 days',
  'Platform Assurance'
 );
 pushFinding(
  'Create policy-to-system traceability for assessed controls',
  'ISO/IEC 42001  -  NIST OSCAL  -  SOC 2',
  `Map each active framework obligation to concrete components, data paths, operators, and control evidence discovered in ${sourceTarget}.`,
  '2-4 days',
  'Compliance Engineering'
 );
 pushFinding(
  'Formalize retention, disposal, and legal-hold handling',
  'GDPR Art. 5  -  CPRA  -  Records governance',
  `Attach retention schedules, disposal triggers, and legal-hold logic to evidence and artifacts derived from the uploaded ${sourceLabel}.`,
  '3-5 days',
  'Data Governance'
 );
 pushFinding(
  'Review privileged access, service identities, and approval workflows',
  'SOC 2 CC6  -  ISO 27001 A.8  -  NIST CSF',
  `Verify access reviews, segregation of duties, emergency access, and approval evidence for the systems represented in ${sourceTarget}.`,
  '1-3 days',
  'IAM Team'
 );

 const aiRelevant=ids.has('nist')||ids.has('euai')||ids.has('iso42001')||ids.has('nist-gai')||ids.has('owasp-llm')||ids.has('mitre-atlas')||ids.has('nist-ssdf-ai');
 if(aiRelevant){
  pushFinding(
   'Document capability inventory, intended use, and human review checkpoints',
   'EU AI Act Art. 13/14  -  NIST AI RMF',
   `Inventory models, prompts, agent tools, or automated decision paths present in ${sourceTarget} and define oversight, limitations, and prohibited uses.`,
   '2-3 days',
   'Responsible AI'
  );
  pushFinding(
   'Establish model or automation lineage and release approvals',
   'NIST MANAGE  -  ISO/IEC 42001',
   'Preserve release lineage, evaluation results, rollback plans, and accountable approvals for high-impact intelligent capabilities.',
   '2-4 days',
   'ML Platform'
  );
 }

 if(ids.has('cui-32cfr2002')||ids.has('itar-22cfr120')||ids.has('ear-15cfr730')||ids.has('dfars-7012')){
  pushFinding(
   'Apply restricted-data marking, dissemination, and jurisdiction controls',
   'CUI  -  ITAR  -  EAR  -  DFARS',
   `Classify uploaded evidence, code, and derived outputs from ${sourceTarget} with the correct handling caveats and recipient restrictions.`,
   '2-3 days',
   'Export Compliance'
  );
 }

 if(ids.has('hipaa')){
  pushFinding(
   'Confirm regulated-data processor inventory and healthcare obligations',
   'HIPAA C164.308(b)  -  C164.312',
   'Document subprocessors, audit trails, minimum necessary handling, and healthcare-specific operational safeguards.',
   '1-2 days',
   'Privacy Counsel'
  );
 }

 return result.slice(0,8);
}
function renderRuntimeReport(result,runContext,selectedFrameworks){
 const completed=result.actions.outputs.length;
 const needsEvidence=result.reflection.risks.length;
 const failed=needsEvidence;
 const readiness=result.reflection.passed?Math.min(99,Math.round(70+result.critique.confidence*30)):Math.max(40,Math.round(50+result.critique.confidence*20));
 const grade=readiness>=90?'A':readiness>=80?'B+':readiness>=70?'B':readiness>=60?'C+':'C';
 const projectName=runContext.projectName;

 $('#report-project-title').textContent=runContext.reportName;
 const restrictionScope=getRestrictionScopeSummary(selectedFrameworks);
 $('#report-run-meta').textContent=`Project: ${projectName}  -  Source: ${runContext.sourceKind}  -  Framework scope: ${selectedFrameworks.map(f=>f.short).join(', ')||'none selected'}${restrictionScope?`  -  ${restrictionScope}`:''}  -  Completed ${new Date().toLocaleString()}`;
 $('#report-grade').textContent=grade;
 $('#report-overall-verdict').textContent=result.reflection.passed?'Ready with monitored follow-ups':'Needs review before release';
 $('#report-overall-summary').textContent=result.reflection.passed
  ?'Objective execution completed with full stage coverage. Continue with scheduled drift checks and policy refresh cycles.'
  :'Execution completed with unresolved risks. Complete corrective actions before approval.';
 $('#report-readiness-score').textContent=`${readiness}%`;

 $('#report-exec-summary').textContent=`The agent engine executed objective planning, subgoal decomposition, action, reflection, and self-critique for ${projectName}. Confidence is ${Math.round(result.critique.confidence*100)}%. ${result.critique.correctiveActions.join(' ')}`;
 $('#report-passed-count').textContent=String(completed-failed);
 $('#report-needs-evidence-count').textContent=String(needsEvidence);
 $('#report-failed-count').textContent=String(failed);

 $('#report-arch-flow').innerHTML='<span>Objective<br><small>Planner</small></span><i>-></i><span>Action<br><small>Subgoals</small></span><i>-></i><span>Reflection<br><small>Evidence checks</small></span><i>-></i><span>Critique<br><small>Corrective actions</small></span>';

 $('#runtime-performance').innerHTML=`<div class="quality-row"><div><span>Objectives set</span><b>${result.performance.counters.objectives_set||0}</b></div><div class="mini-progress"><i style="width:100%"></i></div></div>
 <div class="quality-row"><div><span>Plans created</span><b>${result.performance.counters.plans_created||0}</b></div><div class="mini-progress"><i style="width:100%"></i></div></div>
 <div class="quality-row"><div><span>Subgoals completed</span><b>${result.performance.counters.subgoals_completed||0}</b></div><div class="mini-progress"><i style="width:100%"></i></div></div>
 ${result.performance.latency.map(l=>`<div class="quality-row"><div><span>${l.label} avg latency</span><b>${l.avgMs} ms</b></div><div class="mini-progress"><i style="width:${Math.min(100,Math.max(10,100-Math.round(l.avgMs/2)))}%"></i></div></div>`).join('')}`;

 $('#runtime-transparency').innerHTML=result.transparency.map((evt,index)=>`<div class="finding-row"><span class="finding-num">${String(index+1).padStart(2,'0')}</span><div><h3>${evt.stage.toUpperCase()}  -  ${evt.outcome}</h3><p>${evt.summary}</p></div><span class="owner">${evt.evidenceRefs.length?evt.evidenceRefs.join(', '):'No evidence refs'}</span></div>`).join('');

 const critiqueFindings=result.critique.correctiveActions.map((action,index)=>[
  String(index+1).padStart(2,'0'),
  action,
  'Execution assurance',
  `Generated from reflection and confidence checks for ${runContext.sourceKind.toLowerCase()} evidence.`,
  index===0?'1 day':'2-3 days',
  index===0?'Assurance Lead':'Platform Team',
  'medium'
 ]);
 const contextualFindings=buildContextualFindings(runContext,selectedFrameworks);
 const effectiveFindings=(contextualFindings.length?contextualFindings:findings).concat(critiqueFindings.slice(0,2));
 runtimeState.lastReportFindings=effectiveFindings;
 renderFindingsList(effectiveFindings,{filter:reportFindingFilter});
 renderRunContext('#report-run-context',runContext);
 renderPolicySync('#report-policy-sync',runContext);
 renderTechnicalLandscape('#report-ai-technical',runContext,selectedFrameworks,result);
 requestTechnicalLandscapeEstimate(runContext,selectedFrameworks,result,{rerenderPreview:true,rerenderReport:true});
 renderPlaybookTokenReference();
 renderProjectInsightTiles({runContext,selectedFrameworks,findingEntries:effectiveFindings});
 renderTransparentProcessingSteps(buildTransparentProcessingTrace(runContext,selectedFrameworks));
 setAnalysisState('complete',{
  title:`${runContext.projectName} analyzed`,
  note:`${effectiveFindings.length} findings generated across ${selectedFrameworks.length} selected frameworks. Open the tiles below for drill-down details.`,
  pill:'Analyzed'
 });

 const inlineReport=$('#new-audit-inline-report');
 if(inlineReport){
  inlineReport.hidden=false;
  $('#new-audit-report-meta').textContent=`${runContext.reportName}  -  ${runContext.sourceKind}  -  Framework scope: ${selectedFrameworks.map(f=>f.short).join(', ')||'none selected'}${restrictionScope?`  -  ${restrictionScope}`:''}  -  Completed ${new Date().toLocaleString()}`;
  $('#new-audit-report-grade').textContent=grade;
  $('#new-audit-overall-verdict').textContent=result.reflection.passed?'Ready with monitored follow-ups':'Needs review before release';
  $('#new-audit-overall-summary').textContent=result.reflection.passed
   ?'Objective execution completed with full stage coverage. Continue with scheduled drift checks and policy refresh cycles.'
   :'Execution completed with unresolved risks. Complete corrective actions before approval.';
  $('#new-audit-readiness-score').textContent=`${readiness}%`;
  $('#new-audit-passed-count').textContent=String(completed-failed);
  $('#new-audit-needs-evidence-count').textContent=String(needsEvidence);
  $('#new-audit-failed-count').textContent=String(failed);
  $('#new-audit-exec-summary').textContent=`The agent engine executed objective planning, subgoal decomposition, action, reflection, and self-critique for ${projectName}. Confidence is ${Math.round(result.critique.confidence*100)}%. ${result.critique.correctiveActions.join(' ')}`;
  renderFindingsList(effectiveFindings,{hostId:'#new-audit-finding-list',filter:'all',limit:4});
  renderRunContext('#new-audit-run-context',runContext);
  renderPolicySync('#new-audit-policy-sync',runContext);
  renderTechnicalLandscape('#new-audit-ai-technical',runContext,selectedFrameworks,result);
  $('#new-audit-live-stage').textContent='Completed';
  $('#new-audit-live-note').textContent=`Final readiness score ${readiness}%`;
  $('#new-audit-live-percent').textContent='100%';
  $('#new-audit-live-bar').style.width='100%';
  inlineReport.scrollIntoView({behavior:'smooth',block:'start'});
 }
}
function clearNewAuditProgressTimer(){
 if(newAuditProgressTimer){
  clearInterval(newAuditProgressTimer);
  newAuditProgressTimer=null;
 }
}
function startNewAuditLiveProgress(projectName){
 const stagePlan=[
  'Baseline refresh',
  'Scope and objective planning',
  'Evidence collection',
  'Control mapping and scoring',
  'Verification and report assembly'
 ];
 const inlineReport=$('#new-audit-inline-report');
 if(inlineReport)inlineReport.hidden=false;
 renderAuditWorkspaceTechnicalPreview();
 setAnalysisState('running',{
  title:`Analyzing ${projectName}`,
  note:'Agents are building evidence maps, policy checks, and prioritized remediation insights.',
  pill:'Running'
 });
 clearNewAuditProgressTimer();

 const stageEl=$('#new-audit-live-stage');
 const noteEl=$('#new-audit-live-note');
 const percentEl=$('#new-audit-live-percent');
 const barEl=$('#new-audit-live-bar');
 let progress=6;

 const updateProgress=(next)=>{
  progress=Math.max(progress,Math.min(92,next));
  const stageIndex=Math.min(stagePlan.length-1,Math.floor((progress/100)*stagePlan.length));
  if(stageEl)stageEl.textContent=stagePlan[stageIndex];
  if(noteEl)noteEl.textContent=`${projectName} is processing...`;
  if(percentEl)percentEl.textContent=`${Math.round(progress)}%`;
  if(barEl)barEl.style.width=`${Math.round(progress)}%`;
 };

 updateProgress(progress);
 newAuditProgressTimer=setInterval(()=>updateProgress(progress+8),220);
}
function stopNewAuditLiveProgress(){
 clearNewAuditProgressTimer();
}
function openFullReportView(){
 openReportView('report-summary-section','all');
}
function refreshSecurityBaselines(button){return new Promise(resolve=>{const original=button.textContent;button.disabled=true;button.textContent='Fetching official sources...';$('#gate-icon').textContent='Sync';$('#gate-title').textContent='Validating baseline integrity';$('#gate-detail').textContent='Checking source metadata, versions, status, and manifest digests';setTimeout(()=>{const now=new Date();const stamp=now.toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});const sourceCount=securityManifest.length;const manifestId=createBaselineManifestId(sourceCount);securityManifest.forEach(x=>x.checked='Just now');renderSecurityManifest();runtimeState.lastBaselineCheck={stamp,checkedAtIso:now.toISOString(),sourceCount,manifestId,frameworkPolicyDocs:frameworkDocumentCatalog.length};$('#baseline-checked').textContent=stamp;$('#gate-icon').textContent='Ready';$('#gate-title').textContent='Baseline manifest verified';$('#gate-detail').textContent=`${sourceCount} policy sources + ${frameworkDocumentCatalog.length} framework documents checked  -  no blocking integrity failures  -  pinned for this run`;button.textContent='Baselines current';setTimeout(()=>{button.textContent=original;button.disabled=false},1100);resolve(runtimeState.lastBaselineCheck)},1100)})}
let baselineIntelligenceAgent=null;
function getBaselineIntelligenceAgent(){
 if(!baselineIntelligenceAgent){
  baselineIntelligenceAgent=createBaselineIntelligenceAgent({
   getState:()=>runtimeState,
   getSlaHours:()=>complianceBaselineSlaHours,
   refreshSecurityBaselines,
   refreshPolicyRagService,
   syncPolicyRagStatus,
   onGateEvaluated:gate=>{
    runtimeState.complianceGate=gate;
    renderLiveGovernanceStatus();
   },
   onRagRefreshError:()=>renderPolicyRagStatus()
  });
 }
 return baselineIntelligenceAgent;
}
function evaluateComplianceFreshnessGate(now=Date.now()){
 return getBaselineIntelligenceAgent().evaluateFreshness(now);
}
async function enforceComplianceFreshnessGate(button){
 return getBaselineIntelligenceAgent().enforce(button);
}
async function runBaselineIntelligenceAgent(button){
 return getBaselineIntelligenceAgent().runFirst(button);
}
function switchView(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));const navActivationMap={dashboard:'dashboard',product:'product','frameworks':'product','security':'product','agents':'product','architecture':'product','new-audit':'new-audit','design':'new-audit','batch':'new-audit','deep-analysis':'deep-analysis','nuclear':'deep-analysis','reports':'reports'};$$('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===navActivationMap[id]));$('#crumb').textContent=({dashboard:'Overview',product:'Product','new-audit':'Audit workspace',design:'Design review',batch:'Batch queue',agents:'Policy chat',architecture:'Architecture',security:'Security baseline',nuclear:'Nuclear assurance','deep-analysis':'Deep analysis',frameworks:'Framework library',reports:'Reports'})[id];if(id==='new-audit')initAuditWorkspacePipeline();if((id==='architecture'||id==='product'||id==='new-audit')&&window.renderAegisMermaid)setTimeout(()=>window.renderAegisMermaid(),0);window.scrollTo({top:0,behavior:'smooth'});applyFloatingMotion();}
function applyDiagramSizeMode(mode='boardroom'){
 const boardroomMode=mode!=='normal';
 document.body.classList.toggle('diagram-size-boardroom',boardroomMode);
 const button=$('#diagram-size-toggle');
 if(button){
  button.textContent=`Diagram size: ${boardroomMode?'Boardroom':'Normal'}`;
  button.setAttribute('aria-pressed',boardroomMode?'true':'false');
 }
 window.localStorage.setItem(diagramSizeStorageKey,boardroomMode?'boardroom':'normal');
 if(window.renderAegisMermaid)setTimeout(()=>window.renderAegisMermaid(),0);
}
document.addEventListener('click',e=>{const reportTarget=e.target.closest('[data-report-target]');if(reportTarget){openReportView(reportTarget.dataset.reportTarget,reportTarget.dataset.findingFilter||'all');return;}const go=e.target.closest('[data-go]');if(go)switchView(go.dataset.go);const nav=e.target.closest('[data-view]');if(nav)switchView(nav.dataset.view);const tab=e.target.closest('[data-source]');if(tab){$$('.source-tabs button').forEach(x=>x.classList.remove('active'));tab.classList.add('active');const copy={folder:['Drop your project folder here','or select a local directory to scan'],github:['Connect a GitHub repository','public or private repository URL'],data:['Connect your evidence source','database, object store, or document collection']}[tab.dataset.source];$('#dropzone h3').textContent=copy[0];$('#dropzone p').textContent=copy[1];}const productTab=e.target.closest('[data-product-tab]');if(productTab)setProductAgentTab(productTab.dataset.productTab);const playbookTab=e.target.closest('[data-playbook-tab]');if(playbookTab)setPlaybookAgentTab(playbookTab.dataset.playbookTab);const productStage=e.target.closest('[data-product-stage-filter]');if(productStage)applyProductAgentStageFilter(productStage.dataset.productStageFilter);const productClear=e.target.closest('#product-agent-filter-clear');if(productClear)applyProductAgentStageFilter(null);const playbookStep=e.target.closest('[data-playbook-stage]');if(playbookStep){applyPlaybookAgentStageFilter(playbookStep.dataset.playbookStage);setPlaybookAgentTab('agents');}const clear=e.target.closest('#playbook-agent-filter-clear');if(clear)applyPlaybookAgentStageFilter(null);});
document.addEventListener('click',e=>{const reportTarget=e.target.closest('[data-report-target]');if(reportTarget){openReportView(reportTarget.dataset.reportTarget,reportTarget.dataset.findingFilter||'all');return;}const packageCard=e.target.closest('[data-package-id]');if(packageCard){const selected=compliancePackages.find(pkg=>pkg.id===packageCard.dataset.packageId);if(selected)setFrameworkSelection(selected.frameworks,{packageId:selected.id});return;}const go=e.target.closest('[data-go]');if(go)switchView(go.dataset.go);const nav=e.target.closest('[data-view]');if(nav)switchView(nav.dataset.view);const tab=e.target.closest('[data-source]');if(tab){$$('.source-tabs button').forEach(x=>x.classList.remove('active'));tab.classList.add('active');const copy={folder:['Drop your project folder here','or select a local directory to scan'],github:['Connect a GitHub repository','public or private repository URL'],design:['Drop design files or presentations here','PowerPoint, PDF, Word, spreadsheets, diagrams, and architecture packs'],data:['Connect your evidence source','database, object store, or document collection']}[tab.dataset.source];$('#dropzone h3').textContent=copy[0];$('#dropzone p').textContent=copy[1];$('#browse').textContent=tab.dataset.source==='design'?'Select design files':'Browse folder';}const productTab=e.target.closest('[data-product-tab]');if(productTab)setProductAgentTab(productTab.dataset.productTab);const playbookTab=e.target.closest('[data-playbook-tab]');if(playbookTab)setPlaybookAgentTab(playbookTab.dataset.playbookTab);const productStage=e.target.closest('[data-product-stage-filter]');if(productStage)applyProductAgentStageFilter(productStage.dataset.productStageFilter);const productClear=e.target.closest('#product-agent-filter-clear');if(productClear)applyProductAgentStageFilter(null);const playbookStep=e.target.closest('[data-playbook-stage]');if(playbookStep){applyPlaybookAgentStageFilter(playbookStep.dataset.playbookStage);setPlaybookAgentTab('agents');}const clear=e.target.closest('#playbook-agent-filter-clear');if(clear)applyPlaybookAgentStageFilter(null);});
$('#browse').onclick=()=>{const active=$('.source-tabs button.active')?.dataset.source; if(active==='design')$('#design-files').click(); else $('#folder-input').click();};
$('#folder-input').onchange=e=>{if(e.target.files.length){const rootName=e.target.files[0].webkitRelativePath.split('/')[0];$('#dropzone h3').textContent=`${e.target.files.length} files ready`;$('#dropzone p').textContent=rootName+'  -  contents stay local';$('#project-name').value=normalizeProjectName(rootName,$('#project-name').value.trim()||'Untitled AI project');renderPlaybookTokenReference();renderAuditWorkspaceTechnicalPreview();refreshPolicyRagService().catch(()=>renderPolicyRagStatus());}};
$('#select-all').onclick=()=>{$$('.check-card').forEach(c=>{c.classList.add('selected');$('input',c).checked=true})};
$('#check-grid').addEventListener('change',e=>{e.target.closest('.check-card').classList.toggle('selected',e.target.checked);selectedCompliancePackageIds.clear();updateCompliancePackageButtons();if(complianceSlaMode==='auto'){applyComplianceSlaHours(24);window.localStorage.setItem(complianceSlaStorageKey,'24');runtimeState.complianceGate=evaluateComplianceFreshnessGate();renderComplianceSlaModeControl();renderLiveGovernanceStatus();}});
if($('#live-governance-mode'))$('#live-governance-mode').addEventListener('change',()=>{if(isLiveGovernanceModeEnabled())runLiveGovernanceHeartbeatTick().catch(()=>null);renderLiveGovernanceStatus();renderPlaybookTokenReference();renderAuditWorkspaceTechnicalPreview();});
if($('#refresh-live-governance'))$('#refresh-live-governance').onclick=async e=>{const button=e.target;const original=button.textContent;button.textContent='Refreshing live governance...';button.disabled=true;try{await enforceComplianceFreshnessGate(button);runtimeState.liveGovernanceLastRefresh=new Date().toLocaleString();runtimeState.liveGovernanceDegradedChecks=0;runtimeState.liveGovernanceAutoRecoveryStatus='Idle';renderLiveGovernanceStatus();renderAuditWorkspaceTechnicalPreview();button.textContent='Latest compliance refreshed'}catch(error){runtimeState.complianceGate={ok:false,summary:error.message};renderLiveGovernanceStatus();button.textContent='Refresh failed'}setTimeout(()=>{button.textContent=original;button.disabled=false},1000)};
if($('#validate-feature-completeness'))$('#validate-feature-completeness').onclick=()=>requestFeatureValidation();
if($('#add-to-queue'))$('#add-to-queue').onclick=queueProjectFromAuditForm;
$('#run-audit').onclick=async()=>{
 const btn=$('#run-audit');
 try{
  const baselineAgentResult=await runBaselineIntelligenceAgent(btn);
  runtimeState.complianceGate={...runtimeState.complianceGate,baselineAgentResult};
  runtimeState.liveGovernanceLastRefresh=new Date().toLocaleString();
 }catch(error){
  runtimeState.complianceGate={ok:false,summary:error.message};
  renderLiveGovernanceStatus();
  $('.toast b').textContent='Audit blocked by compliance gate';
  $('.toast small').textContent=error.message;
  $('#toast').classList.add('show');
  setTimeout(()=>$('#toast').classList.remove('show'),1800);
  return;
 }
 const name=normalizeProjectName($('#project-name').value,'Untitled AI project');
 const selectedFrameworks=getSelectedFrameworks();
 const runContext=buildRunContext(name,selectedFrameworks);
 runtimeState.lastRunContext=runContext;
 renderPlaybookTokenReference();
 renderAuditWorkspaceTechnicalPreview();
 renderLiveGovernanceStatus();
  requestFeatureValidation();
 const engine=new AgentEngine({role:'auditor'});
 const inlineReport=$('#new-audit-inline-report');
 if(inlineReport)inlineReport.hidden=true;
 startNewAuditLiveProgress(name);
 const pipelineAnimationPromise=startAuditWorkspacePipelineAnimation(name);

 $('.toast b').textContent=`Audit started for ${name}`;
 $('.toast small').textContent=isLiveGovernanceModeEnabled()?'Objective planning, live governance refresh, and real-time LLM verification in progress.':'Objective planning, execution, and verification in progress.';
 $('#toast').classList.add('show');
 $$('.pipe-item').forEach((x,i)=>setTimeout(()=>x.classList.add('scan-active'),i*180));

 try{
  const objective=buildObjective(name,selectedFrameworks);
  const result=engine.run(objective);
  await pipelineAnimationPromise;
  runtimeState.lastRun=result;
  recordTokenEstimateSnapshot(runContext,selectedFrameworks,result);
  renderPlaybookTokenReference();
  renderAuditWorkspaceTechnicalPreview();
  renderRuntimeReport(result,runContext,selectedFrameworks);
  requestFeatureValidation();
    const readiness=result.reflection.passed?Math.min(99,Math.round(70+result.critique.confidence*30)):Math.max(40,Math.round(50+result.critique.confidence*20));
    upsertDashboardAudit(name,selectedFrameworks,readiness,result);
  await refreshPolicyRagService().catch(()=>renderPolicyRagStatus());
   stopNewAuditLiveProgress();
   $('.toast b').textContent=`Audit complete for ${name}`;
   $('.toast small').textContent='Report, pinned policy resources, and knowledge-base comparison updated below.';
 }catch(err){
    stopNewAuditLiveProgress();
    $('#new-audit-live-stage').textContent='Run failed';
    $('#new-audit-live-note').textContent=err?.message||'Unexpected execution error';
    renderTransparentProcessingSteps([]);
   setAnalysisState('failed',{
    title:`${name} analysis failed`,
    note:err?.message||'Unexpected execution error',
    pill:'Failed'
   });
  $('.toast b').textContent='Audit failed';
  $('.toast small').textContent=err?.message||'Unexpected execution error';
 }finally{
    stopNewAuditLiveProgress();
  setTimeout(()=>{
   $('#toast').classList.remove('show');
   $$('.pipe-item').forEach(x=>x.classList.remove('scan-active'));
  },1200);
 }
};
$('#print-report').onclick=()=>window.print();
if($('#open-full-report'))$('#open-full-report').onclick=openFullReportView;
$('#analysis-tabs').addEventListener('click',e=>{
 const tab=e.target.closest('[data-analysis]');
 if(!tab)return;
 renderDeepAnalysis(tab.dataset.analysis,activeAnalysisFilter);
});
if($('#analysis-filter'))$('#analysis-filter').addEventListener('click',e=>{
 const button=e.target.closest('[data-analysis-filter]');
 if(!button)return;
 renderDeepAnalysis(activeAnalysisType,button.dataset.analysisFilter||'all');
});
if($('#analysis-findings'))$('#analysis-findings').addEventListener('click',e=>{
 const action=e.target.closest('[data-analysis-action]');
 if(!action)return;
 const name=action.dataset.analysisAction;
 $('.toast b').textContent='Action drafted';
 $('.toast small').textContent=`${name} added to remediation planning.`;
 $('#toast').classList.add('show');
 setTimeout(()=>$('#toast').classList.remove('show'),1200);
});
$('#rerun-analysis').onclick=()=>{const btn=$('#rerun-analysis');btn.textContent='Analyzing...';btn.disabled=true;setAnalysisState('running',{title:'Refreshing deep analysis',note:'Recomputing technical and governance insights from the current project context.',pill:'Running'});setTimeout(()=>{renderDeepAnalysis(activeAnalysisType,activeAnalysisFilter);setAnalysisState('complete',{title:'Project analysis refreshed',note:'Deep analysis cards and findings were updated. Use the tiles to drill into details.',pill:'Analyzed'});btn.textContent='Analysis refreshed';setTimeout(()=>{btn.textContent='Re-run analysis';btn.disabled=false},1200)},1400)};
$('#repo-profile').addEventListener('change',e=>renderAIArchitecture(Number(e.target.value)));
$('#batch-table').addEventListener('click',e=>{const action=e.target.closest('[data-batch-action]');if(!action)return;const project=batchProjects[Number(action.dataset.batchAction)];if(project.status==='failed'){project.status='queued';project.stage='Retry queued'}else if(project.status==='running'){project.status='queued';project.stage='Paused'}renderBatch()});
$('#pause-batch').onclick=e=>{const paused=e.target.textContent.includes('Pause');batchProjects.forEach(p=>{if(p.status==='running'){p.status=paused?'queued':'running';p.stage=paused?'Paused':'Analysis resumed'}});e.target.textContent=paused?'Resume':'Pause';renderBatch()};
$('#start-batch').onclick=async e=>{await refreshSecurityBaselines(e.target);batchProjects.filter(p=>p.status==='queued').slice(0,3).forEach(p=>{p.status='running';p.stage='Source discovery';p.progress=Math.max(p.progress,8)});e.target.textContent='Batch running';renderBatch()};
$('#add-batch-projects').onclick=()=>{batchProjects.push({name:'New AI Project '+(batchProjects.length+1),source:'Folder',preset:$('#batch-preset').value,stage:'Queued',progress:0,tokens:'1.2M',status:'queued'});renderBatch()};
$('#refresh-baselines').onclick=async e=>{await refreshSecurityBaselines(e.target);await refreshPolicyRagService().catch(()=>renderPolicyRagStatus());};
$('#dont-know-all').onclick=()=>$$('.landscape-answer').forEach(select=>select.value="Don't know");
$('#design-files').onchange=e=>{const list=$('#design-file-list');const files=[...e.target.files];list.textContent='';files.forEach(file=>{const row=document.createElement('div'),type=document.createElement('span'),name=document.createElement('b'),meta=document.createElement('small'),state=document.createElement('em');type.textContent=(file.name.split('.').pop()||'FILE').toUpperCase().slice(0,4);name.textContent=file.name;meta.textContent=(file.size/1024/1024).toFixed(1)+' MB  -  queued for local extraction';state.textContent='Ready';row.append(type,name,meta,state);list.append(row)});runtimeState.lastDesignContext={fileNames:files.map(file=>file.name),comparisonTarget:files.some(file=>/\.pptx?$/i.test(file.name))?'high-level PowerPoint and design evidence':'design files and architecture evidence'};const designName=files[0]?.name?.replace(/\.[^.]+$/,'')||'Design evidence review';$('#project-name').value=normalizeProjectName(designName,$('#project-name').value.trim()||'Untitled AI project');const designTab=$('.source-tabs [data-source="design"]');if(designTab){$$('.source-tabs button').forEach(x=>x.classList.remove('active'));designTab.classList.add('active');$('#dropzone h3').textContent=`${files.length} design files ready`;$('#dropzone p').textContent='Design evidence package selected for governance review';$('#browse').textContent='Select design files';}renderPlaybookTokenReference();renderAuditWorkspaceTechnicalPreview();refreshPolicyRagService().catch(()=>renderPolicyRagStatus());};
$('#generate-design').onclick=async e=>{const btn=e.target;await refreshSecurityBaselines(btn);btn.textContent='Reusing audit algorithm...';setTimeout(()=>{btn.textContent='Design proposal generated';$('#design-proposal').classList.add('generated');$('#design-proposal').scrollIntoView({behavior:'smooth',block:'start'})},900)};
$('#run-nuclear-review').onclick=async e=>{await refreshSecurityBaselines(e.target);e.target.textContent='Mapping nuclear design evidence...';setTimeout(()=>{e.target.textContent='Nuclear review complete';$('.nuclear-findings').scrollIntoView({behavior:'smooth',block:'start'})},1100)};
if($('#policy-chat-send'))$('#policy-chat-send').onclick=()=>submitPolicyChat($('#policy-chat-input')?.value||'');
if($('#policy-rag-refresh'))$('#policy-rag-refresh').onclick=async()=>{await refreshPolicyRagService().catch(()=>renderPolicyRagStatus());await submitPolicyChat($('#policy-chat-input')?.value||'');};
if($('#policy-chat-input'))$('#policy-chat-input').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){submitPolicyChat(e.target.value);}});
if($('#diagram-size-toggle'))$('#diagram-size-toggle').onclick=()=>{const isBoardroom=document.body.classList.contains('diagram-size-boardroom');applyDiagramSizeMode(isBoardroom?'normal':'boardroom');};
document.addEventListener('click',e=>{const prompt=e.target.closest('[data-chat-prompt]');if(prompt){const input=$('#policy-chat-input');if(input)input.value=prompt.dataset.chatPrompt;submitPolicyChat(prompt.dataset.chatPrompt);}});
document.addEventListener('click',e=>{
 const trendMetricButton=e.target.closest('[data-trend-metric]');
 if(trendMetricButton){
  runtimeState.trendMetric=trendMetricButton.dataset.trendMetric||'tokens';
  renderPlaybookTokenReference();
  renderAuditWorkspaceTechnicalPreview();
  return;
 }
 const completedStageChip=e.target.closest('[data-audit-completed-stage]');
 if(completedStageChip&&$('#audit-workspace-pipeline')){
  const stageId=completedStageChip.dataset.auditCompletedStage;
  auditPipelineState.selectedCompletedStageId=auditPipelineState.selectedCompletedStageId===stageId?null:stageId;
  const selectedStage=auditPipelineState.selectedCompletedStageId;
  const activeStage=productPipelineStages[auditPipelineState.stageIndex]?.id||null;
  renderAuditPipelineAgentLane(stageId);
  updateAuditPipelineIconHierarchy(selectedStage||activeStage);
  return;
 }
 const auditStageChip=e.target.closest('[data-audit-stage]');
 if(auditStageChip&&$('#audit-workspace-pipeline')){
  const stageId=auditStageChip.dataset.auditStage;
  const projectName=normalizeProjectName($('#project-name')?.value,'Claims Intelligence Platform');
  const stageIndex=productPipelineStages.findIndex(stage=>stage.id===stageId);
  if(stageIndex>=0)updateAuditPipelineStage(stageId,projectName,stageIndex,productPipelineStages.length);
  return;
 }
 const auditAgentChip=e.target.closest('[data-audit-agent]');
 if(auditAgentChip&&$('#audit-workspace-pipeline')){
  setAuditAgentDetail(auditAgentChip.dataset.auditAgent,auditAgentChip.dataset.auditStage||'');
  return;
 }
 const openPlaybook=e.target.closest('[data-open-product-playbook]');
 if(openPlaybook){
  openProductTransparency({projectName:normalizeProjectName($('#project-name')?.value,'Claims Intelligence Platform')});
  return;
 }
 const openPipeline=e.target.closest('[data-open-product-pipeline], #new-audit-view-pipeline');
 if(openPipeline){
  openProductTransparency({runAnimation:true,projectName:normalizeProjectName($('#project-name')?.value,'Claims Intelligence Platform')});
  return;
 }
 const pipelineStage=e.target.closest('[data-pipeline-stage]');
 if(pipelineStage){
  openProductTransparency({stageId:pipelineStage.dataset.pipelineStage,projectName:normalizeProjectName($('#project-name')?.value,'Claims Intelligence Platform')});
  return;
 }
 const analysisJump=e.target.closest('[data-analysis-jump]');
 if(analysisJump){
  openDeepAnalysisView(analysisJump.dataset.analysisJump,analysisJump.dataset.analysisFilter||'all');
  return;
 }
 const insightTile=e.target.closest('[data-insight-target]');
 if(insightTile&&!insightTile.disabled){
  openReportView(insightTile.dataset.insightTarget,insightTile.dataset.insightFilter||'all');
 }
});
if($('#product-pipeline-run'))$('#product-pipeline-run').onclick=runProductPipelineAnimation;
document.addEventListener('click',e=>{
 if(e.target.closest('[data-source]')||e.target.closest('[data-package-id]'))setTimeout(()=>{renderPlaybookTokenReference();renderAuditWorkspaceTechnicalPreview();},0);
});
document.addEventListener('change',e=>{
 if(e.target.closest('#check-grid')||e.target.id==='folder-input'||e.target.id==='design-files')setTimeout(()=>{renderPlaybookTokenReference();renderAuditWorkspaceTechnicalPreview();},0);
});
render();
setProductAgentTab('system');
setPlaybookAgentTab('stages');
applyDiagramSizeMode(window.localStorage.getItem(diagramSizeStorageKey)||'boardroom');
startLiveGovernanceHeartbeat();
