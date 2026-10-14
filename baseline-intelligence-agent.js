export function createBaselineIntelligenceAgent({
  getState,
  getSlaHours,
  refreshSecurityBaselines,
  refreshPolicyRagService,
  syncPolicyRagStatus,
  onGateEvaluated,
  onRagRefreshError
}) {
  function evaluateFreshness(now = Date.now()) {
    const state = getState();
    const baseline = state.lastBaselineCheck || null;
    const baselineAt = baseline ? Date.parse(baseline.checkedAtIso || baseline.stamp || '') : NaN;
    const ragAt = state.ragStore?.updatedAt ? Date.parse(state.ragStore.updatedAt) : NaN;
    const maxAgeMs = Number(getSlaHours()) * 60 * 60 * 1000;

    const baselineAge = Number.isNaN(baselineAt) ? Number.POSITIVE_INFINITY : Math.max(0, now - baselineAt);
    const ragAge = Number.isNaN(ragAt) ? Number.POSITIVE_INFINITY : Math.max(0, now - ragAt);

    const staleParts = [];
    if (!baseline) staleParts.push('baseline missing');
    else if (baselineAge > maxAgeMs) staleParts.push('baseline stale');

    if (!state.ragStore?.updatedAt) staleParts.push('RAG corpus missing');
    else if (ragAge > maxAgeMs) staleParts.push('RAG corpus stale');

    const ok = staleParts.length === 0;
    const gate = {
      ok,
      summary: ok
        ? `Baseline and RAG corpus refreshed within ${getSlaHours()}h`
        : `Blocked: ${staleParts.join(', ')}`,
      baselineAgeMs: baselineAge,
      ragAgeMs: ragAge,
      checkedAt: new Date(now).toLocaleString(),
      live: {
        ragUpdatedAt: state.ragStore?.updatedAt || null,
        ragDocCount: state.ragStore?.stats?.docCount ?? 0,
        policyCount: state.ragStore?.stats?.policyCount ?? 0,
        policyDocCount: state.ragStore?.stats?.policyDocCount ?? 0
      }
    };

    if (onGateEvaluated) onGateEvaluated(gate);
    return gate;
  }

  async function enforce(button) {
    await refreshSecurityBaselines(button);

    let ragRefreshError = null;
    try {
      await refreshPolicyRagService();
      // Pull latest backend status to ensure gate uses real-time RAG state.
      if (syncPolicyRagStatus) await syncPolicyRagStatus();
    } catch (error) {
      ragRefreshError = error;
      if (onRagRefreshError) onRagRefreshError(error);
    }

    const gate = evaluateFreshness(Date.now());
    if (ragRefreshError || !gate.ok) {
      const message = ragRefreshError?.message || gate.summary;
      throw new Error(`Compliance freshness gate failed. ${message}`);
    }

    return gate;
  }

  async function runFirst(button) {
    const gate = await enforce(button);
    const state = getState();
    return {
      agentId: 'agent-baseline',
      gate,
      executedAt: new Date().toISOString(),
      summary: `Baseline intelligence gate passed with SLA ${getSlaHours()}h, manifest ${state.lastBaselineCheck?.manifestId || 'n/a'}, and RAG ${gate.live.ragDocCount} docs.`
    };
  }

  return {
    evaluateFreshness,
    enforce,
    runFirst
  };
}
