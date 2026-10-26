import usageData from '@/data/usage.json';
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
  activeAgents: byAgent.filter((agent) => agent.sessions > 0),
  inactiveAgents: byAgent.filter((agent) => agent.sessions === 0),
  latestRecord: records[0] || null,
  latestMonth: months.at(-1)?.month || '',
};

export const usageTypeLabels = agentTypes;

export function getAgentById(id) {
  return agents.find((agent) => agent.id === id) || null;
}
