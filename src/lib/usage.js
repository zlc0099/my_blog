import usageData from '@/data/usage.json';
import { agents } from '@/data/agents';
import { agentTypes } from '@/data/taxonomy';

const records = [...(usageData.records || [])].sort(
  (a, b) => b.date.localeCompare(a.date) || String(b.task).localeCompare(String(a.task)),
);

const totals = records.reduce(
  (summary, record) => {
    const tokensIn = Number(record.tokensIn) || 0;
    const tokensOut = Number(record.tokensOut) || 0;
    summary.total += tokensIn + tokensOut;
    summary.tokensIn += tokensIn;
    summary.tokensOut += tokensOut;
    return summary;
  },
  { total: 0, tokensIn: 0, tokensOut: 0 },
);

const monthMap = new Map();

records.forEach((record) => {
  const month = String(record.date).slice(0, 7);
  if (!monthMap.has(month)) {
    monthMap.set(month, {
      month,
      total: 0,
      byAgent: Object.fromEntries(agents.map((agent) => [agent.id, 0])),
    });
  }
  const entry = monthMap.get(month);
  const tokens = (Number(record.tokensIn) || 0) + (Number(record.tokensOut) || 0);
  entry.total += tokens;
  entry.byAgent[record.agent] = (entry.byAgent[record.agent] || 0) + tokens;
});

const months = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));
const chartMonths = months.slice(-6);
const maxMonthTokens = Math.max(...months.map((month) => month.total), 0);

const byAgent = agents
  .map((agent) => {
    const agentRecords = records.filter((record) => record.agent === agent.id);
    const tokens = agentRecords.reduce(
      (sum, record) => sum + (Number(record.tokensIn) || 0) + (Number(record.tokensOut) || 0),
      0,
    );
    return {
      ...agent,
      tokens,
      sessions: agentRecords.length,
      share: totals.total ? (tokens / totals.total) * 100 : 0,
    };
  })
  .sort((a, b) => b.tokens - a.tokens);

const activeMonths = months.filter((month) => month.total > 0).length;

export const usageSummary = {
  isDemo: usageData.demo === true,
  note: usageData.note || '',
  updated: usageData.updated || '',
  records,
  total: totals.total,
  tokensIn: totals.tokensIn,
  tokensOut: totals.tokensOut,
  sessions: records.length,
  average: records.length ? Math.round(totals.total / records.length) : 0,
  months,
  chartMonths,
  maxMonthTokens,
  activeMonths,
  byAgent,
  latestRecord: records[0] || null,
  latestMonth: months.at(-1)?.month || '',
};

export const usageTypeLabels = agentTypes;

export function getAgentById(id) {
  return agents.find((agent) => agent.id === id) || null;
}
