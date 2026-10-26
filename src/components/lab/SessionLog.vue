<script setup>
import { computed, ref } from 'vue';
import { recordTotal, usageSummary, usageTypeLabels } from '@/lib/usage';
import { agentMap } from '@/data/agents';
import { formatDate, formatDuration, formatNumber, formatTokens } from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState.vue';

const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

const colorMap = computed(() =>
  Object.fromEntries(
    usageSummary.byAgent.map((agent, index) => [agent.id, colors[index] || colors[2]]),
  ),
);

const records = computed(() =>
  usageSummary.records.map((record) => ({
    ...record,
    total: recordTotal(record),
  })),
);

const agentFilter = ref('all');
const projectFilter = ref('all');
const modelFilter = ref('all');

const agentOptions = computed(() => [
  ...new Map(
    records.value.map((record) => [
      record.agent,
      agentMap[record.agent]?.name || record.agent,
    ]),
  ).entries(),
].map(([id, name]) => ({ id, name })));

const projectOptions = computed(() => [
  ...new Set(records.value.map((record) => record.project).filter(Boolean)),
].sort());

const modelOptions = computed(() => [
  ...new Set(records.value.map((record) => record.model).filter(Boolean)),
].sort());

const filteredRecords = computed(() =>
  records.value.filter((record) => {
    if (agentFilter.value !== 'all' && record.agent !== agentFilter.value) return false;
    if (projectFilter.value !== 'all' && record.project !== projectFilter.value) return false;
    if (modelFilter.value !== 'all' && record.model !== modelFilter.value) return false;
    return true;
  }),
);

const hasFilters = computed(
  () =>
    agentFilter.value !== 'all' ||
    projectFilter.value !== 'all' ||
    modelFilter.value !== 'all',
);

function clearFilters() {
  agentFilter.value = 'all';
  projectFilter.value = 'all';
  modelFilter.value = 'all';
}
</script>

<template>
  <div class="session-log">
    <div class="session-log__head">
      <div>
        <span class="eyebrow">SESSION LOG / 作业明细</span>
        <h3>Claude Code 会话记录</h3>
      </div>
      <span class="mono session-log__count">
        {{ filteredRecords.length }} / {{ usageSummary.sessions }} ROWS
      </span>
    </div>

    <p class="session-log__hint mono">
      SESSION RECORDS / 本地 Claude Code 日志聚合 · 原始对话不发布
    </p>

    <EmptyState
      v-if="!usageSummary.sessions"
      code="LOG / EMPTY"
      title="还没有作业记录"
      description="运行 Claude Code 导入器后，这里会显示真实会话记录。"
    />

    <template v-else>
      <div class="session-log__filters">
        <label class="session-log__filter">
          <span>AGENT</span>
          <select v-model="agentFilter">
            <option value="all">ALL</option>
            <option v-for="option in agentOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </label>

        <label class="session-log__filter">
          <span>PROJECT</span>
          <select v-model="projectFilter">
            <option value="all">ALL</option>
            <option v-for="option in projectOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <label class="session-log__filter">
          <span>MODEL</span>
          <select v-model="modelFilter">
            <option value="all">ALL</option>
            <option v-for="option in modelOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <button
          v-if="hasFilters"
          type="button"
          class="session-log__reset mono"
          @click="clearFilters"
        >
          RESET ×
        </button>
      </div>

      <p v-if="!filteredRecords.length" class="session-log__no-match mono">
        NO MATCHING RECORDS / 没有符合筛选条件的会话
      </p>

      <div v-else class="session-log__table-wrap">
        <table>
          <thead>
            <tr>
              <th>DATE</th>
              <th>DURATION</th>
              <th>AGENT</th>
              <th>PROJECT</th>
              <th>TASK / SESSION</th>
              <th>TYPE</th>
              <th>TOKENS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredRecords"
              :key="`${record.date}-${record.session || record.task}`"
            >
              <td class="mono session-log__date">{{ formatDate(record.date) }}</td>
              <td class="mono session-log__duration">{{ formatDuration(record.durationMinutes) }}</td>
              <td>
                <span class="session-log__agent">
                  <i :style="{ background: colorMap[record.agent] || colors[2] }"></i>
                  {{ agentMap[record.agent]?.name || record.agent }}
                </span>
              </td>
              <td class="mono session-log__project">{{ record.project || '—' }}</td>
              <td class="session-log__task">
                <span>{{ record.task }}</span>
                <small class="mono">
                  #{{ record.session || '—' }} · {{ record.model || 'unknown' }}
                </small>
              </td>
              <td>
                <span class="tag">{{ usageTypeLabels[record.type] || record.type }}</span>
              </td>
              <td
                class="mono session-log__tokens"
                :title="`INPUT ${formatNumber(record.tokensIn)} / OUTPUT ${formatNumber(record.tokensOut)} / CACHE READ ${formatNumber(record.cacheRead)} / CACHE WRITE ${formatNumber(record.cacheWrite)}`"
              >
                <strong>{{ formatTokens(record.total) }}</strong>
                <span>{{ formatNumber(record.total) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  font-size: 10px;
  letter-spacing: 0.1em;
}

.session-log__hint {
  padding: 11px 22px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.session-log__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px 14px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-primary);
}

.session-log__filter {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.session-log__filter span {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
}

.session-log__filter select {
  height: 30px;
  min-width: 112px;
  padding: 0 8px;
  border: 1px solid var(--border-primary);
  outline: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  cursor: pointer;
}

.session-log__filter select:focus {
  border-color: var(--accent);
}

.session-log__reset {
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 10.5px;
  letter-spacing: 0.06em;
}

.session-log__reset:hover {
  border-color: var(--accent);
  color: var(--accent-ink);
}

.session-log__no-match {
  padding: 24px 22px;
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.05em;
}

.session-log__table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  background: var(--bg-primary);
}

th,
td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--border-subtle);
  text-align: left;
  vertical-align: middle;
}

th {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
}

tbody tr {
  transition: background-color var(--dur-fast) var(--ease-out);
}

tbody tr:hover {
  background: var(--bg-secondary);
}

tbody tr:last-child td {
  border-bottom: 0;
}

.session-log__date {
  color: var(--text-muted);
  font-size: 10px;
  white-space: nowrap;
}

.session-log__duration {
  color: var(--text-muted);
  font-size: 10px;
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

.session-log__project {
  color: var(--text-muted);
  font-size: 10px;
  white-space: nowrap;
}

.session-log__task {
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.5;
}

.session-log__task small {
  display: block;
  margin-top: 3px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.03em;
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
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 10px;
}

@media (max-width: 560px) {
  .session-log__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
  }

  .session-log__hint {
    padding: 10px 18px;
  }
}
</style>
