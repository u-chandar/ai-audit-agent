export class PerformanceMonitor {
  constructor() {
    this.counters = new Map();
    this.timings = [];
  }

  increment(name, by = 1) {
    this.counters.set(name, (this.counters.get(name) || 0) + by);
  }

  timeStart(label) {
    return { label, start: Date.now() };
  }

  timeEnd(token, extra = {}) {
    const durationMs = Date.now() - token.start;
    this.timings.push({ label: token.label, durationMs, ...extra });
    return durationMs;
  }

  summary() {
    const byLabel = new Map();
    for (const t of this.timings) {
      const row = byLabel.get(t.label) || { count: 0, total: 0, max: 0 };
      row.count += 1;
      row.total += t.durationMs;
      row.max = Math.max(row.max, t.durationMs);
      byLabel.set(t.label, row);
    }

    const latency = [...byLabel.entries()].map(([label, row]) => ({
      label,
      count: row.count,
      avgMs: Math.round(row.total / row.count),
      maxMs: row.max
    }));

    return {
      counters: Object.fromEntries(this.counters.entries()),
      latency
    };
  }
}
