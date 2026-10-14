import { ShortTermMemory, LongTermMemory } from "./memory.js";
import { AccessController, TransparencyLedger } from "./security.js";
import { PerformanceMonitor } from "./metrics.js";

function nowId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export class AgentEngine {
  constructor({ role = "auditor" } = {}) {
    this.role = role;
    this.stm = new ShortTermMemory();
    this.ltm = new LongTermMemory();
    this.acl = new AccessController();
    this.ledger = new TransparencyLedger();
    this.monitor = new PerformanceMonitor();
  }

  setObjective(objective) {
    this.acl.enforce(this.role, "objective:set");
    const objectiveId = objective.id || nowId("obj");
    const record = {
      ...objective,
      id: objectiveId,
      status: "active",
      createdAt: new Date().toISOString()
    };

    this.ltm.rememberFact(`objective:${objectiveId}`, record);
    this.monitor.increment("objectives_set");
    this.ledger.record({
      stage: "objective",
      objectiveId,
      summary: `Objective set: ${objective.title}`,
      outcome: "accepted"
    });
    return record;
  }

  plan(objective) {
    this.acl.enforce(this.role, "plan:create");
    const timer = this.monitor.timeStart("plan");

    const subgoals = this.decomposeSubgoals(objective);
    const plan = {
      id: nowId("plan"),
      objectiveId: objective.id,
      constraints: objective.constraints || [],
      successCriteria: objective.successCriteria || [],
      subgoals,
      createdAt: new Date().toISOString()
    };

    this.stm.add({ type: "plan", planId: plan.id, objectiveId: objective.id, subgoals });
    this.ltm.rememberPattern(`plan:${objective.id}`, {
      subgoalCount: subgoals.length,
      strategy: "risk-first"
    });

    const durationMs = this.monitor.timeEnd(timer, { stage: "plan" });
    this.monitor.increment("plans_created");
    this.ledger.record({
      stage: "plan",
      objectiveId: objective.id,
      summary: `Plan generated with ${subgoals.length} subgoals`,
      outcome: "created",
      evidenceRefs: [plan.id],
      durationMs
    });
    return plan;
  }

  decomposeSubgoals(objective) {
    const base = [
      "Define measurable controls and acceptance thresholds",
      "Collect evidence from approved sources",
      "Evaluate controls and detect high-risk gaps",
      "Recommend remediations with owner and due date",
      "Publish transparent summary for users"
    ];

    if (objective.domain === "ai-governance") {
      base.splice(3, 0, "Run model-risk checks and safety policy validation");
    }

    return base.map((title, index) => ({
      id: nowId(`sg${index + 1}`),
      title,
      priority: index + 1,
      status: "pending"
    }));
  }

  act(plan) {
    this.acl.enforce(this.role, "action:execute");
    const timer = this.monitor.timeStart("action");

    const outputs = [];
    for (const sg of plan.subgoals) {
      const result = {
        subgoalId: sg.id,
        title: sg.title,
        status: "done",
        objectiveEvidence: [`evidence:${sg.id}`],
        rationaleSummary: `Executed ${sg.title.toLowerCase()} using approved policy constraints.`
      };
      outputs.push(result);
      this.stm.add({ type: "action", planId: plan.id, result });
      this.monitor.increment("subgoals_completed");
      this.ledger.record({
        stage: "action",
        objectiveId: plan.objectiveId,
        summary: `Subgoal completed: ${sg.title}`,
        outcome: "done",
        evidenceRefs: result.objectiveEvidence
      });
    }

    const durationMs = this.monitor.timeEnd(timer, { stage: "action" });
    this.monitor.increment("actions_executed");
    return { planId: plan.id, objectiveId: plan.objectiveId, outputs, durationMs };
  }

  reflect(actionBundle) {
    const timer = this.monitor.timeStart("reflection");
    const risks = [];

    for (const item of actionBundle.outputs) {
      if (!item.objectiveEvidence || item.objectiveEvidence.length === 0) {
        risks.push({ subgoalId: item.subgoalId, issue: "missing_evidence" });
      }
    }

    const reflection = {
      id: nowId("reflect"),
      objectiveId: actionBundle.objectiveId,
      passed: risks.length === 0,
      risks,
      note: risks.length === 0
        ? "Execution aligned with objectives and evidence collection policy."
        : "Execution requires evidence completion before publishing."
    };

    this.stm.add({ type: "reflection", reflection });
    this.ltm.addDecision({
      objectiveId: actionBundle.objectiveId,
      decision: reflection.passed ? "publish_candidate" : "hold_for_review",
      reasons: reflection.note
    });

    const durationMs = this.monitor.timeEnd(timer, { stage: "reflection" });
    this.monitor.increment("reflections_completed");
    this.ledger.record({
      stage: "reflection",
      objectiveId: actionBundle.objectiveId,
      summary: "Reflection completed",
      outcome: reflection.passed ? "pass" : "needs_review",
      evidenceRefs: risks.map((r) => r.subgoalId),
      durationMs
    });
    return reflection;
  }

  selfCritique(reflection) {
    const timer = this.monitor.timeStart("self_critique");
    const critique = {
      id: nowId("critique"),
      objectiveId: reflection.objectiveId,
      confidence: reflection.passed ? 0.87 : 0.61,
      weaknesses: reflection.passed
        ? ["Need broader adversarial sampling in next run."]
        : ["Insufficient evidence for one or more subgoals."],
      correctiveActions: reflection.passed
        ? ["Schedule periodic drift check and policy refresh."]
        : ["Re-run incomplete subgoals with mandatory evidence checks."]
    };

    this.stm.add({ type: "self_critique", critique });
    const durationMs = this.monitor.timeEnd(timer, { stage: "self_critique" });
    this.monitor.increment("self_critiques_completed");
    this.ledger.record({
      stage: "self_critique",
      objectiveId: reflection.objectiveId,
      summary: "Self-critique generated",
      outcome: "completed",
      evidenceRefs: critique.correctiveActions,
      durationMs
    });
    return critique;
  }

  run(objectiveInput) {
    const objective = this.setObjective(objectiveInput);
    const plan = this.plan(objective);
    const actions = this.act(plan);
    const reflection = this.reflect(actions);
    const critique = this.selfCritique(reflection);

    return {
      objective,
      plan,
      actions,
      reflection,
      critique,
      transparency: this.ledger.userView(),
      performance: this.monitor.summary(),
      memory: {
        shortTermRecent: this.stm.latest(12),
        longTermDecisions: this.ltm.latestDecisions(5)
      }
    };
  }
}
