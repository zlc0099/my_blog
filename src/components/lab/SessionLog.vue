<script setup>
import { computed, ref } from 'vue';
import { usageSummary, usageTypeLabels } from '@/lib/usage';
import { getPostBySlug } from '@/lib/content';
import { agentMap } from '@/data/agents';
import { formatDate, formatNumber, formatTokens } from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState.vue';

const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];
const showAll = ref(false);

const colorMap = computed(() =>
  Object.fromEntries(
    usageSummary.byAgent.map((agent, index) => [agent.id, colors[index] || colors[2]]),
  ),
);

const visibleRecords = computed(() =>
  showAll.value ? usageSummary.records : usageSummary.records.slice(0, 8),
);
</script>

<template>
  <div class="session-log">
    <div class="session-log__head">
      <div>
        <span class="eyebrow">SESSION LOG / 作业明细</span>
        <h3>任务与消耗记录</h3>
      </div>
      <span class="mono session-log__count">{{ String(usageSummary.sessions).padStart(2, '0') }} ROWS</span>
    </div>

    <EmptyState
      v-if="!usageSummary.sessions"
      code="LOG / EMPTY"
      title="还没有作业记录"
      description="添加记录后，这里会按时间展示任务、Agent 与 Token 消耗。"
    />

    <template v-else>
      <div class="session-log__table-wrap">
        <table>
          <thead>
            <tr>
              <th>DATE</th>
              <th>AGENT</th>
              <th>TASK</th>
              <th>TYPE</th>
              <th>TOKENS</th>
              <th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in visibleRecords" :key="`${record.date}-${record.task}`">
              <td class="mono session-log__date">{{ formatDate(record.date) }}</td>
              <td>
                <span class="session-log__agent">
                  <i :style="{ background: colorMap[record.agent] || colors[2] }"></i>
                  {{ agentMap[record.agent]?.name || record.agent }}
                </span>
              </td>
              <td class="session-log__task">{{ record.task }}</td>
              <td>
                <span class="tag">{{ usageTypeLabels[record.type] || record.type }}</span>
              </td>
              <td class="mono session-log__tokens">
                <strong>{{ formatTokens((record.tokensIn || 0) + (record.tokensOut || 0)) }}</strong>
                <span>{{ formatNumber((record.tokensIn || 0) + (record.tokensOut || 0)) }}</span>
              </td>
              <td>
                <RouterLink
                  v-if="record.post && getPostBySlug(record.post)"
                  :to="`/posts/${record.post}`"
                  class="session-log__note"
                >
                  RELATED →
                </RouterLink>
                <span v-else class="session-log__none mono">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        v-if="usageSummary.records.length > 8"
        type="button"
        class="btn btn--compact session-log__more"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'COLLAPSE LOG' : `SHOW ALL ${usageSummary.records.length} RECORDS` }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.session-log {
  border: 1px solid var(--border-subtle);
}

.session-log__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.session-log__head h3 {
  margin-top: 8px;
  font-size: 19px;
  font-weight: 600;
}

.session-log__count {
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.1em;
}

.session-log__table-wrap {
  overflow-x: auto;
}

.session-log__table-wrap table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  background: var(--bg-primary);
}

.session-log__table-wrap th,
.session-log__table-wrap td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--border-subtle);
  text-align: left;
  vertical-align: middle;
}

.session-log__table-wrap th {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.session-log__table-wrap tbody tr {
  transition: background-color var(--dur-fast) var(--ease-out);
}

.session-log__table-wrap tbody tr:hover {
  background: var(--bg-secondary);
}

.session-log__table-wrap tbody tr:last-child td {
  border-bottom: 0;
}

.session-log__date {
  color: var(--text-muted);
  font-size: 9px;
  white-space: nowrap;
}

.session-log__agent {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-primary);
  font-size: 12px;
  white-space: nowrap;
}

.session-log__agent i {
  width: 6px;
  height: 6px;
  flex: none;
}

.session-log__task {
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.5;
}

.session-log__tokens {
  white-space: nowrap;
}

.session-log__tokens strong {
  color: var(--text-primary);
  font-size: 11.5px;
  font-weight: 500;
}

.session-log__tokens span {
  margin-left: 7px;
  color: var(--text-muted);
  font-size: 8.5px;
}

.session-log__note {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.session-log__note:hover {
  color: var(--accent-ink);
}

.session-log__none {
  color: var(--text-muted);
  font-size: 10px;
}

.session-log__more {
  margin: 16px 22px 22px;
}

@media (max-width: 560px) {
  .session-log__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
  }

  .session-log__more {
    margin: 14px 18px 18px;
  }
}
</style>
