const DEFAULT_ROLE_ACTIONS = {
  admin: [
    "objective:set",
    "plan:create",
    "action:execute",
    "memory:read",
    "memory:write",
    "report:view",
    "report:publish"
  ],
  auditor: [
    "objective:set",
    "plan:create",
    "action:execute",
    "memory:read",
    "memory:write",
    "report:view"
  ],
  viewer: ["report:view", "memory:read"]
};

export class AccessController {
  constructor(roleActions = DEFAULT_ROLE_ACTIONS) {
    this.roleActions = roleActions;
  }

  can(role, action) {
    const allowed = this.roleActions[role] || [];
    return allowed.includes(action);
  }

  enforce(role, action) {
    if (!this.can(role, action)) {
      const err = new Error(`Access denied for role=${role} action=${action}`);
      err.code = "ACCESS_DENIED";
      throw err;
    }
  }
}

export class TransparencyLedger {
  constructor() {
    this.events = [];
  }

  record(event) {
    this.events.push({ ...event, ts: new Date().toISOString() });
  }

  all() {
    return [...this.events];
  }

  userView() {
    return this.events.map((e) => ({
      ts: e.ts,
      stage: e.stage,
      summary: e.summary,
      objectiveId: e.objectiveId,
      outcome: e.outcome,
      evidenceRefs: e.evidenceRefs || []
    }));
  }
}
