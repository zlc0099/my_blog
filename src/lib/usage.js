import usageData from '@/data/usage.json';
import agentModelsData from '@/data/agent-models.json';
import { agents } from '@/data/agents';
import { agentTypes } from '@/data/taxonomy';

const TOKEN_TYPES = [
  { key: 'cacheRead', label: 'CACHE READ', color: 'var(--chart-1)' },
  { key: 'tokensIn', label: 'NEW INPUT', color: 'var(--chart-2)' },
  { key: 'tokensOut', label: 'OUTPUT', color: 'var(--chart-3)' },
  { key: 'cacheWrite', label: 'CACHE WRITE', color: 'var(--chart-4)' },
];

function toNumber(value) {
  return Number(value) || 0;
}

export function recordTotal(record) {
  return (
    toNumber(record.tokensIn) +
    toNumber(record.tokensOut) +
    toNumber(record.cacheRead) +
    toNumber(record.cacheWrite)
  );
}

const records = [...(usageData.records || [])]
  .map((record) => {
    const normalized = {
      ...record,
      tokensIn: toNumber(record.tokensIn),
      tokensOut: toNumber(record.tokensOut),
      cacheRead: toNumber(record.cacheRead),
      cacheWrite: toNumber(record.cacheWrite),
    };
    normalized.total = recordTotal(normalized);
    const start = record.startedAt ? Date.parse(record.startedAt) : NaN;
    const end = record.endedAt ? Date.parse(record.endedAt) : NaN;
    normalized.durationMinutes =
      Number.isFinite(start) && Number.isFinite(end) && end >= start
        ? (end - start) / 60000
        : null;
    return normalized;
  })
  .sort(
    (a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')) ||
      String(a.session || '').localeCompare(String(b.session || '')),
  );

const totals = records.reduce(
  (summary, record) => {
    summary.total += record.total;
    summary.tokensIn += record.tokensIn;
    summary.tokensOut += record.tokensOut;
    summary.cacheRead += record.cacheRead;
    summary.cacheWrite += record.cacheWrite;
    return summary;
  },
  { total: 0, tokensIn: 0, tokensOut: 0, cacheRead: 0, cacheWrite: 0 },
);

const monthMap = new Map();

records.forEach((record) => {
  const month = String(record.date).slice(0, 7);
  if (!monthMap.has(month)) {
    monthMap.set(month, {
      month,
      total: 0,
      byAgent: Object.fromEntries(agents.map((agent) => [agent.id, 0])),
      byType: Object.fromEntries(TOKEN_TYPES.map((type) => [type.key, 0])),
    });
  }
  const entry = monthMap.get(month);
  entry.total += record.total;
  entry.byAgent[record.agent] = (entry.byAgent[record.agent] || 0) + record.total;
  TOKEN_TYPES.forEach((type) => {
    entry.byType[type.key] += record[type.key] || 0;
  });
});

const months = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));
const chartMonths = months.slice(-6);
const maxMonthTokens = Math.max(...months.map((month) => month.total), 0);

const byAgent = agents
  .map((agent) => {
    const agentRecords = records.filter((record) => record.agent === agent.id);
    const tokens = agentRecords.reduce((sum, record) => sum + record.total, 0);
    return {
      ...agent,
      tokens,
      sessions: agentRecords.length,
      share: totals.total ? (tokens / totals.total) * 100 : 0,
    };
  })
  .sort((a, b) => b.tokens - a.tokens);

const MODEL_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--success)',
  'var(--text-muted)',
];

function aggregateModelRecords() {
  const map = new Map();
  records.forEach((record) => {
    const model = record.model || 'unknown';
    if (model === 'unknown') return;
    const entry = map.get(model) || {
      model,
      agent: record.agent,
      sessions: 0,
      messages: 0,
      tokensIn: 0,
      tokensOut: 0,
      cacheRead: 0,
      cacheWrite: 0,
    };
    entry.sessions += 1;
    entry.messages += toNumber(record.messages);
    entry.tokensIn += record.tokensIn;
    entry.tokensOut += record.tokensOut;
    entry.cacheRead += record.cacheRead;
    entry.cacheWrite += record.cacheWrite;
    map.set(model, entry);
  });
  return [...map.values()];
}

const rawModels =
  Array.isArray(usageData.models) && usageData.models.length
    ? usageData.models
    : aggregateModelRecords();

const modelRows = rawModels
  .map((model) => {
    const tokensIn = toNumber(model.tokensIn);
    const tokensOut = toNumber(model.tokensOut);
    const cacheRead = toNumber(model.cacheRead);
    const cacheWrite = toNumber(model.cacheWrite);
    return {
      model: model.model || 'unknown',
      agent: model.agent || 'claude-code',
      sessions: toNumber(model.sessions),
      messages: toNumber(model.messages),
      tokensIn,
      tokensOut,
      cacheRead,
      cacheWrite,
      total: tokensIn + tokensOut + cacheRead + cacheWrite,
    };
  })
  .filter((model) => model.total > 0 || model.messages > 0)
  .sort((a, b) => b.total - a.total);

const modelTotal = modelRows.reduce((sum, model) => sum + model.total, 0);
const models = modelRows.map((model, index) => ({
  ...model,
  color: MODEL_COLORS[index % MODEL_COLORS.length],
  share: modelTotal ? (model.total / modelTotal) * 100 : 0,
}));
const modelScopeLabel = models.length
  ? models.every((model) => model.agent === 'claude-code')
    ? 'CLAUDE CODE'
    : 'ALL AGENTS'
  : '';
const modelCoverage = totals.total ? (modelTotal / totals.total) * 100 : 0;

const AGENT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];
const agentTraceMap = new Map(
  (agentModelsData.agents || []).map((agent) => [agent.agent, agent]),
);
const claudeDates = records.map((record) => record.date).filter(Boolean).sort();
const claudeMessages = records.reduce(
  (sum, record) => sum + toNumber(record.messages),
  0,
);

const agentCoverage = agents.map((agent, index) => {
  const color = AGENT_COLORS[index % AGENT_COLORS.length];
  const usage = byAgent.find((item) => item.id === agent.id) || {
    tokens: 0,
    sessions: 0,
    share: 0,
  };
  const trace = agentTraceMap.get(agent.id);
  const tokensAvailable = agent.id === 'claude-code' && usage.tokens > 0;

  if (tokensAvailable) {
    return {
      ...agent,
      color,
      sessions: usage.sessions,
      tokens: usage.tokens,
      tokensAvailable: true,
      share: usage.share,
      models,
      modelCount: models.length,
      activity: claudeMessages,
      activityLabel: 'MESSAGES',
      sourceLabel: 'LOCAL LOGS',
      source: 'claude-code-logs',
      period: {
        first: claudeDates[0] || '',
        last: claudeDates.at(-1) || '',
      },
    };
  }

  if (trace) {
    return {
      ...agent,
      color,
      sessions: toNumber(trace.sessions),
      tokens: null,
      tokensAvailable: false,
      share: null,
      models: trace.models || [],
      modelCount: (trace.models || []).length,
      activity: toNumber(trace.activity),
      activityLabel: trace.activityLabel || 'TRACE',
      sourceLabel: trace.sourceLabel || 'LOCAL TRACE',
      source: trace.source || 'local-trace',
      period: trace.period || { first: '', last: '' },
    };
  }

  return {
    ...agent,
    color,
    sessions: usage.sessions,
    tokens: 0,
    tokensAvailable: false,
    share: 0,
    models: [],
    modelCount: 0,
    activity: 0,
    activityLabel: 'TRACE',
    sourceLabel: 'NO DATA',
    source: 'none',
    period: { first: '', last: '' },
  };
});

const traceAgents = agentCoverage.filter(
  (agent) => !agent.tokensAvailable && agent.models.length > 0 && agent.sessions > 0,
);
const agentSessions = agentCoverage.reduce(
  (sum, agent) => sum + toNumber(agent.sessions),
  0,
);
const agentModelCount = agentCoverage.reduce(
  (sum, agent) => sum + toNumber(agent.modelCount),
  0,
);

const tokenTypes = TOKEN_TYPES.map((type) => ({
  ...type,
  value: totals[type.key],
  share: totals.total ? (totals[type.key] / totals.total) * 100 : 0,
})).filter((type) => type.value > 0);

const activeMonths = months.filter((month) => month.total > 0).length;
const cacheShare = totals.total ? (totals.cacheRead / totals.total) * 100 : 0;
const sourceLabel =
  usageData.demo === true
    ? 'DEMO DATA'
    : usageData.source === 'claude-code-logs'
      ? 'LOCAL LOGS'
      : 'MANUAL LOG';

export const usageSummary = {
  isDemo: usageData.demo === true,
  source: usageData.source || 'manual',
  sourceLabel,
  note: usageData.note || '',
  updated: usageData.updated || '',
  records,
  total: totals.total,
  tokensIn: totals.tokensIn,
  tokensOut: totals.tokensOut,
  cacheRead: totals.cacheRead,
  cacheWrite: totals.cacheWrite,
  cacheShare,
  tokenTypes,
  sessions: records.length,
  average: records.length ? Math.round(totals.total / records.length) : 0,
  months,
  chartMonths,
  maxMonthTokens,
  activeMonths,
  byAgent,
  models,
  modelTotal,
  modelCoverage,
  modelScopeLabel,
  modelCount: models.length,
  topModel: models[0] || null,
  agentCoverage,
  traceAgents,
  agentSessions,
  agentModelCount,
  latestRecord: records[0] || null,
  latestMonth: months.at(-1)?.month || '',
};

export const usageTypeLabels = agentTypes;

export function getAgentById(id) {
  return agents.find((agent) => agent.id === id) || null;
}
