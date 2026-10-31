<script setup>
import { computed } from 'vue';
import { usageSummary } from '@/lib/usage';
import {
  formatMonth,
  formatNumber,
  formatTokens,
} from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState.vue';

const chartTypes = computed(() => usageSummary.tokenTypes);

const traceNames = computed(() =>
  usageSummary.traceAgents.map((agent) => agent.name).join(' · '),
);

const noLogNames = computed(() =>
  usageSummary.agentCoverage
    .filter((agent) => agent.sessions === 0)
    .map((agent) => agent.name)
    .join(' · '),
);

const stats = computed(() => [
  {
    label: 'TOTAL PROCESSED',
    value: formatTokens(usageSummary.total),
    sub: `${formatNumber(usageSummary.total)} recorded`,
  },
  {
    label: 'NEW INPUT',
    value: formatTokens(usageSummary.tokensIn),
    sub: 'uncached prompt',
  },
  {
    label: 'OUTPUT',
    value: formatTokens(usageSummary.tokensOut),
    sub: 'completion side',
  },
  {
    label: 'CACHE READ',
    value: formatTokens(usageSummary.cacheRead),
    sub: `${usageSummary.cacheShare.toFixed(1)}% of total`,
  },
  {
    label: 'CACHE WRITE',
    value: formatTokens(usageSummary.cacheWrite),
    sub: 'cache creation',
  },
  {
    label: 'TOKEN SESSIONS',
    value: String(usageSummary.sessions).padStart(2, '0'),
    sub: `${formatTokens(usageSummary.average)} avg / session`,
  },
]);

function barHeight(month) {
  if (!usageSummary.maxMonthTokens) return '0%';
  const percent = (month.total / usageSummary.maxMonthTokens) * 100;
  return `${month.total > 0 ? Math.max(4, Math.round(percent)) : 0}%`;
}
</script>

<template>
  <div class="ledger">
    <div class="ledger__stats">
      <div v-for="stat in stats" :key="stat.label" class="ledger__stat">
        <span class="ledger__stat-label">{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
        <small>{{ stat.sub }}</small>
      </div>
    </div>

    <EmptyState
      v-if="!usageSummary.sessions"
      code="暂无账本"
      title="还没有 Token 记录"
      description="在 usage.json 中添加作业记录后，这里会自动生成月度账本。"
    />

    <div v-else class="ledger__chart">
      <div class="ledger__chart-head">
        <div>
          <span class="eyebrow">MONTHLY CONSUMPTION</span>
          <h3>月度资源消耗</h3>
          <p class="ledger__hint mono">
            TOTAL INCLUDES INPUT / OUTPUT / CACHE · CACHE READ {{ usageSummary.cacheShare.toFixed(1) }}%
          </p>
        </div>
        <div class="ledger__chart-tools">
          <span class="badge">{{ usageSummary.sourceLabel }}</span>
          <div class="ledger__legend">
            <span v-for="type in chartTypes" :key="type.key">
              <i :style="{ background: type.color }"></i>{{ type.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="ledger__plot">
        <div class="ledger__axis mono" aria-hidden="true">
          <span>{{ formatTokens(usageSummary.maxMonthTokens) }}</span>
          <span>{{ formatTokens(usageSummary.maxMonthTokens / 2) }}</span>
          <span>0</span>
        </div>

        <div class="ledger__chart-area">
          <div class="ledger__columns">
            <div v-for="month in usageSummary.chartMonths" :key="month.month" class="ledger__column">
              <span class="ledger__value mono">{{ formatTokens(month.total) }}</span>
              <div
                class="ledger__bar"
                :title="`${formatMonth(month.month)} · ${formatNumber(month.total)} tokens`"
              >
                <div class="ledger__stack" :style="{ height: barHeight(month) }">
                  <span
                    v-for="type in chartTypes"
                    :key="type.key"
                    :style="{ flexGrow: month.byType[type.key] || 0, background: type.color }"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div class="ledger__months mono" aria-hidden="true">
            <span v-for="month in usageSummary.chartMonths" :key="month.month">
              {{ formatMonth(month.month) }}
            </span>
          </div>
        </div>
      </div>

      <details class="ledger__data">
        <summary class="mono">DATA TABLE / 查看月度明细 <span>+</span></summary>
        <div class="ledger__table-wrap">
          <table>
            <thead>
              <tr>
                <th>MONTH</th>
                <th v-for="type in chartTypes" :key="type.key">{{ type.label }}</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="month in usageSummary.chartMonths" :key="month.month">
                <td class="mono">{{ formatMonth(month.month) }}</td>
                <td v-for="type in chartTypes" :key="type.key" class="mono">
                  {{ formatTokens(month.byType[type.key] || 0) }}
                </td>
                <td class="mono">{{ formatTokens(month.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <p v-if="usageSummary.note" class="ledger__note mono">
        {{ usageSummary.sourceLabel }} / {{ usageSummary.note }}
      </p>
      <p v-if="traceNames" class="ledger__hint mono">
        TOKEN N/A / {{ traceNames }} · 已接入本机模型与会话统计，但本地应用未保存 Token 明细
      </p>
      <p v-if="noLogNames" class="ledger__hint mono">
        NO LOGS YET / {{ noLogNames }} · 手动记录后显示
      </p>
    </div>
  </div>
</template>

<style scoped>
.ledger {
  border: 1px solid var(--border-subtle);
}

.ledger__stats {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1px;
  background: var(--border-subtle);
}

.ledger__stat {
  display: flex;
  min-height: 130px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 20px 22px;
  background: var(--bg-secondary);
}

.ledger__stat-label {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.ledger__stat strong {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 600;
  line-height: 1;
}

.ledger__stat small {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.ledger__chart {
  padding: clamp(22px, 3.4vw, 32px);
  background: var(--bg-primary);
}

.ledger__chart-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.ledger__chart-head h3 {
  margin-top: 8px;
  font-size: 19px;
  font-weight: 600;
}

.ledger__hint {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.6;
}

.ledger__chart-tools {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.ledger__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.ledger__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
}

.ledger__legend i {
  width: 7px;
  height: 7px;
}

.ledger__plot {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 12px;
  margin-top: 36px;
}

.ledger__axis {
  display: flex;
  height: 202px;
  flex-direction: column;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 10px;
  text-align: right;
}

.ledger__chart-area {
  min-width: 0;
}

.ledger__columns {
  display: flex;
  height: 202px;
  align-items: flex-end;
  gap: clamp(12px, 4vw, 48px);
  background-image: repeating-linear-gradient(
    to top,
    var(--border-subtle) 0,
    var(--border-subtle) 1px,
    transparent 1px,
    transparent 25%
  );
}

.ledger__column {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.ledger__value {
  color: var(--text-secondary);
  font-size: 10px;
}

.ledger__bar {
  display: flex;
  width: 100%;
  max-width: 42px;
  height: 168px;
  align-items: flex-end;
  background: transparent;
}

.ledger__stack {
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
}

.ledger__stack span {
  width: 100%;
  min-height: 0;
}

.ledger__months {
  display: flex;
  gap: clamp(12px, 4vw, 48px);
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 10px;
}

.ledger__months span {
  flex: 1;
  text-align: center;
}

.ledger__data {
  margin-top: 26px;
  border-top: 1px solid var(--border-subtle);
}

.ledger__data summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 0;
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 0.08em;
  cursor: pointer;
  list-style: none;
}

.ledger__data summary::-webkit-details-marker {
  display: none;
}

.ledger__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border-subtle);
}

.ledger__table-wrap table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: 11.5px;
}

.ledger__table-wrap th,
.ledger__table-wrap td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--border-subtle);
  text-align: left;
}

.ledger__table-wrap th {
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.ledger__table-wrap td {
  color: var(--text-secondary);
}

.ledger__table-wrap tr:last-child td {
  border-bottom: 0;
}

.ledger__note {
  margin-top: 18px;
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1.7;
  letter-spacing: 0.04em;
}

@media (max-width: 1100px) {
  .ledger__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ledger__chart-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .ledger__chart-tools {
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .ledger__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .ledger__stat {
    min-height: 108px;
    padding: 16px;
  }

  .ledger__plot {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 8px;
  }

  .ledger__columns,
  .ledger__months {
    gap: 8px;
  }

  .ledger__value {
    font-size: 10px;
  }

  .ledger__bar {
    max-width: 28px;
  }
}
</style>
