<script setup>
import { computed } from 'vue';
import { usageSummary } from '@/lib/usage';
import { formatTokens } from '@/lib/format';

const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

const agentStats = computed(() =>
  usageSummary.byAgent.map((agent, index) => ({
    ...agent,
    color: colors[index] || colors[2],
    rank: String(index + 1).padStart(2, '0'),
    shareLabel: `${Math.round(agent.share)}%`,
  })),
);
</script>

<template>
  <div class="agent-roster">
    <article
      v-for="agent in agentStats"
      :key="agent.id"
      class="agent-card"
      :style="{ '--agent-color': agent.color }"
    >
      <span class="agent-card__ghost" aria-hidden="true">{{ agent.rank }}</span>

      <div class="agent-card__top">
        <span class="mono">{{ agent.code }}</span>
        <span class="mono agent-card__mode">{{ agent.mode }}</span>
      </div>

      <div class="agent-card__main">
        <h3>{{ agent.name }}</h3>
        <p class="agent-card__role">{{ agent.role }}</p>
        <p class="agent-card__summary">{{ agent.summary }}</p>
      </div>

      <div class="agent-card__usage">
        <div class="agent-card__bar">
          <span :style="{ width: `${agent.share}%` }"></span>
        </div>
        <div class="agent-card__numbers mono">
          <span>{{ String(agent.sessions).padStart(2, '0') }} SESSIONS</span>
          <span>{{ formatTokens(agent.tokens) }} PROCESSED</span>
          <span class="agent-card__share">{{ agent.shareLabel }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.agent-roster {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.agent-card {
  position: relative;
  display: flex;
  min-height: 290px;
  flex-direction: column;
  padding: 22px;
  background: var(--bg-primary);
  overflow: hidden;
  transition: background-color var(--dur-base) var(--ease-out);
}

.agent-card:hover {
  background: var(--bg-secondary);
}

.agent-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 44px;
  background: var(--agent-color);
}

.agent-card__ghost {
  position: absolute;
  top: 40px;
  right: 14px;
  color: var(--agent-color);
  font-family: var(--font-display);
  font-size: 110px;
  font-weight: 600;
  line-height: 1;
  opacity: 0.06;
  pointer-events: none;
}

.agent-card__top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.agent-card__mode {
  padding: 3px 6px;
  border: 1px solid var(--border-primary);
}

.agent-card__main {
  position: relative;
  margin-top: 26px;
}

.agent-card__main h3 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  text-transform: uppercase;
}

.agent-card__role {
  margin-top: 9px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
}

.agent-card__summary {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.8;
}

.agent-card__usage {
  margin-top: auto;
  padding-top: 24px;
}

.agent-card__bar {
  height: 3px;
  background: var(--bg-elevated);
}

.agent-card__bar span {
  display: block;
  height: 100%;
  background: var(--agent-color);
  transition: width 0.8s var(--ease-out);
}

.agent-card__numbers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.02em;
}

.agent-card__share {
  color: var(--agent-color);
  font-size: 10px;
}

@media (max-width: 900px) {
  .agent-roster {
    grid-template-columns: 1fr;
  }

  .agent-card {
    min-height: auto;
  }

  .agent-card__usage {
    padding-top: 20px;
  }
}
</style>
