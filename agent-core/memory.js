export class ShortTermMemory {
  constructor(limit = 200) {
    this.limit = limit;
    this.items = [];
  }

  add(entry) {
    this.items.push({ ...entry, ts: new Date().toISOString() });
    if (this.items.length > this.limit) {
      this.items = this.items.slice(this.items.length - this.limit);
    }
  }

  query(predicate) {
    return this.items.filter(predicate);
  }

  latest(count = 10) {
    return this.items.slice(Math.max(0, this.items.length - count));
  }
}

export class LongTermMemory {
  constructor() {
    this.facts = new Map();
    this.patterns = new Map();
    this.decisions = [];
  }

  rememberFact(key, value) {
    this.facts.set(key, { value, ts: new Date().toISOString() });
  }

  recallFact(key) {
    return this.facts.get(key) || null;
  }

  rememberPattern(key, value) {
    this.patterns.set(key, { value, ts: new Date().toISOString() });
  }

  recallPattern(key) {
    return this.patterns.get(key) || null;
  }

  addDecision(decision) {
    this.decisions.push({ ...decision, ts: new Date().toISOString() });
  }

  latestDecisions(count = 10) {
    return this.decisions.slice(Math.max(0, this.decisions.length - count));
  }
}
