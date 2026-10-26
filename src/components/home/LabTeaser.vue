<script setup>
import { computed } from 'vue';
import { usageSummary } from '@/lib/usage';
import { formatDate, formatMonth, formatMonthShort, formatTokens } from '@/lib/format';

const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

const chartAgents = computed(() =>
  usageSummary.byAgent.map((agent, index) => ({
    ...agent,
    color: chartColors[index] || chartColors[2],
    shareLabel: `${Math.round(agent.share)}%`,
  })),
);

function barHeight(month) {
  if (!usageSummary.maxMonthTokens) return '0%';
  const percent = (month.total / usageSummary.maxMonthTokens) * 100;
  return `${month.total > 0 ? Math.max(4, Math.round(percent)) : 0}%`;
}
</script>

<template>
  <div class="lab-teaser">
    <div class="lab-teaser__main">
      <div class="eyebrow eyebrow--accent">
        <span class="eyebrow__tick"></span>
        RESOURCE LEDGER / TOKEN 账本
      </div>

      <div class="lab-teaser__total">
        <strong>{{ formatTokens(usageSummary.total) }}</strong>
        <span>TOKENS</span>
      </div>

      <p class="lab-teaser__desc">
        记录 Claude Code、Qoder、Trae 的作业与资源消耗。数据来自手动维护的账本，而不是自动追踪。
      </p>

      <div class="lab-teaser__stats">
        <div>
          <span>SESSIONS</span>
          <strong>{{ String(usageSummary.sessions).padStart(2, '0') }}</strong>
        </div>
        <div>
          <span>ACTIVE MONTHS</span>
          <strong>{{ String(usageSummary.activeMonths).padStart(2, '0') }}</strong>
        </div>
        <div>
          <span>AVG / SESSION</span>
          <strong>{{ formatTokens(usageSummary.average) }}</strong>
        </div>
      </div>

      <div class="lab-teaser__actions">
        <RouterLink to="/lab" class="btn btn--primary btn--compact">
          打开 AI LAB <span class="btn__arrow">→</span>
        </RouterLink>
        <RouterLink to="/lab/prompts" class="btn btn--compact">提示词库</RouterLink>
      </div>
    </div>

    <div class="lab-teaser__chart">
      <div class="lab-teaser__chart-head">
        <span class="eyebrow">MONTHLY TOKENS</span>
        <span v-if="usageSummary.isDemo" class="badge">DEMO DATA</span>
      </div>

      <div v-if="usageSummary.sessions" class="mini-chart">
        <div v-for="month in usageSummary.chartMonths" :key="month.month" class="mini-chart__col">
          <span class="mini-chart__value mono">{{ formatTokens(month.total) }}</span>
          <div
            class="mini-chart__bar"
            :title="`${formatMonth(month.month)} · ${formatTokens(month.total)} tokens`"
          >
            <div class="mini-chart__stack" :style="{ height: barHeight(month) }">
              <span
                v-for="agent in chartAgents"
                :key="agent.id"
                :style="{ flexGrow: month.byAgent[agent.id] || 0, background: agent.color }"
              ></span>
            </div>
          </div>
          <span class="mini-chart__label mono">{{ formatMonthShort(month.month) }}</span>
        </div>
      </div>

      <div v-else class="lab-teaser__empty">暂无 Token 记录。</div>

      <div class="mini-chart__legend">
        <span v-for="agent in chartAgents" :key="agent.id">
          <i :style="{ background: agent.color }"></i>
          {{ agent.name }} · {{ agent.shareLabel }}
        </span>
      </div>

      <p class="lab-teaser__note mono">
        {{ usageSummary.isDemo ? 'DEMO DATA / ' : '' }}UPDATED {{ formatDate(usageSummary.updated) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.lab-teaser {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  overflow: hidden;
}

.lab-teaser__main {
  position: relative;
  padding: clamp(26px, 4vw, 42px);
  background: var(--bg-primary);
}

.lab-teaser__main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 64px;
  background: var(--accent);
}

.lab-teaser__total {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-top: 24px;
}

.lab-teaser__total strong {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(52px, 6.4vw, 84px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 0.85;
}

.lab-teaser__total span {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.14em;
}

.lab-teaser__desc {
  max-width: 460px;
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.8;
}

.lab-teaser__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.lab-teaser__stats div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lab-teaser__stats span {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.lab-teaser__stats strong {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 500;
}

.lab-teaser__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}

.lab-teaser__chart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(26px, 4vw, 36px);
  border-left: 1px solid var(--border-subtle);
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 20px 20px;
}

.lab-teaser__chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: clamp(14px, 3vw, 30px);
  height: 196px;
  margin-top: 20px;
  padding-top: 16px;
}

.mini-chart__col {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
}

.mini-chart__value {
  color: var(--text-secondary);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.mini-chart__bar {
  display: flex;
  width: 100%;
  max-width: 30px;
  height: 126px;
  align-items: flex-end;
  background: var(--bg-elevated);
}

.mini-chart__stack {
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
}

.mini-chart__stack span {
  width: 100%;
  min-height: 0;
}

.mini-chart__label {
  color: var(--text-muted);
  font-size: 8.5px;
}

.mini-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.mini-chart__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.03em;
}

.mini-chart__legend i {
  width: 7px;
  height: 7px;
  flex: none;
}

.lab-teaser__note {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.lab-teaser__empty {
  flex: 1;
  display: grid;
  place-items: center;
  color: var(--text-muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .lab-teaser {
    grid-template-columns: 1fr;
  }

  .lab-teaser__chart {
    border-top: 1px solid var(--border-subtle);
    border-left: 0;
  }
}

@media (max-width: 560px) {
  .lab-teaser__stats {
    gap: 10px;
  }

  .lab-teaser__stats strong {
    font-size: 14px;
  }

  .mini-chart {
    height: 170px;
    gap: 12px;
  }

  .mini-chart__bar {
    height: 108px;
  }

  .mini-chart__value {
    font-size: 8px;
  }
}
</style>
