<script setup>
import { computed } from 'vue';
import { usageSummary } from '@/lib/usage';
import { formatDate } from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState.vue';

const traceAgents = computed(() => usageSummary.traceAgents);

const rows = computed(() =>
  traceAgents.value.flatMap((agent) =>
    agent.models.map((model) => ({
      key: `${agent.id}-${model.model}`,
      agentName: agent.name,
      agentCode: agent.code,
      color: agent.color,
      model: model.model,
      sessions: model.sessions,
      activity: model.activity,
      activityLabel: agent.activityLabel,
      first: model.first,
      last: model.last,
    })),
  ),
);

const totalSessions = computed(() =>
  traceAgents.value.reduce((sum, agent) => sum + agent.sessions, 0),
);

const totalModels = computed(() =>
  traceAgents.value.reduce((sum, agent) => sum + agent.modelCount, 0),
);

function range(first, last) {
  if (!first && !last) return '—';
  if (!first) return formatDate(last);
  if (!last || first === last) return formatDate(first);
  return `${formatDate(first)} – ${formatDate(last)}`;
}
</script>

<template>
  <div class="agent-trace">
    <div class="agent-trace__head">
      <div>
        <span class="eyebrow">TRACE COVERAGE / 其他 AGENT</span>
        <h3>Qoder / Trae 模型统计</h3>
      </div>
      <div class="agent-trace__meta">
        <span class="badge">TOKEN N/A</span>
        <span class="mono">
          {{ traceAgents.length }} AGENTS · {{ totalSessions }} SESSIONS ·
          {{ totalModels }} MODELS
        </span>
      </div>
    </div>

    <p class="agent-trace__hint mono">
      QODER 本地会话库 / TRAE 本地日志与完成缓存 · 仅同步模型、会话、活动与日期范围 ·
      不含对话、标题、路径或 Token
    </p>

    <EmptyState
      v-if="!traceAgents.length"
      code="暂无记录"
      title="还没有其他 Agent 模型记录"
      description="运行 Qoder / Trae 本地统计导入器后，这里会显示模型与会话覆盖情况。"
    />

    <template v-else>
      <div class="agent-trace__cards">
        <article
          v-for="agent in traceAgents"
          :key="agent.id"
          class="agent-trace__card"
          :style="{ '--trace-color': agent.color }"
        >
          <div class="agent-trace__card-top">
            <span class="badge">{{ agent.name }}</span>
            <span class="mono">{{ agent.sourceLabel }}</span>
          </div>
          <div class="agent-trace__card-main">
            <strong>{{ String(agent.sessions).padStart(2, '0') }}</strong>
            <span class="mono">SESSIONS</span>
          </div>
          <p class="mono">
            {{ String(agent.modelCount).padStart(2, '0') }} MODELS ·
            {{ agent.activity }} {{ agent.activityLabel }} ·
            {{ range(agent.period.first, agent.period.last) }}
          </p>
        </article>
      </div>

      <div class="agent-trace__table-wrap">
        <table>
          <thead>
            <tr>
              <th>AGENT</th>
              <th>MODEL</th>
              <th>SESSIONS</th>
              <th>ACTIVITY</th>
              <th>PERIOD</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.key">
              <td>
                <span class="agent-trace__agent">
                  <i :style="{ background: row.color }"></i>
                  <span>
                    <strong>{{ row.agentName }}</strong>
                    <small class="mono">{{ row.agentCode }}</small>
                  </span>
                </span>
              </td>
              <td class="mono agent-trace__model">{{ row.model }}</td>
              <td class="mono">{{ String(row.sessions).padStart(2, '0') }}</td>
              <td class="mono agent-trace__activity">
                {{ row.activity }} <small>{{ row.activityLabel }}</small>
              </td>
              <td class="mono agent-trace__period">
                {{ range(row.first, row.last) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="agent-trace__note mono">
        TRACE ONLY / Qoder 模型名为本地应用内部标识，活动为 assistant 回复数；
        Trae 模型名来自本地日志，活动为日志与完成缓存中观察到的模型调用数。
        本地应用未保存 Token 明细，因此不进入 Token 账本、模型占比和月度图。
      </p>
    </template>
  </div>
</template>

<style scoped>
.agent-trace {
  margin-top: 24px;
  border: 1px solid var(--border-subtle);
}

.agent-trace__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.agent-trace__head h3 {
  margin-top: 8px;
  font-size: 19px;
  font-weight: 600;
}

.agent-trace__meta {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-align: right;
}

.agent-trace__hint {
  padding: 11px 22px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.agent-trace__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.agent-trace__card {
  padding: 20px 22px;
  background: var(--bg-primary);
}

.agent-trace__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.05em;
}

.agent-trace__card-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 16px;
}

.agent-trace__card-main strong {
  color: var(--trace-color);
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 600;
  line-height: 1;
}

.agent-trace__card-main span {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.agent-trace__card > p {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 0.03em;
  line-height: 1.7;
}

.agent-trace__table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 760px;
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

.agent-trace__agent {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
}

.agent-trace__agent > i {
  width: 3px;
  height: 22px;
  flex: none;
}

.agent-trace__agent strong {
  display: block;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
}

.agent-trace__agent small {
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.03em;
}

.agent-trace__model {
  color: var(--text-primary);
  font-size: 11px;
  white-space: nowrap;
}

.agent-trace__activity {
  color: var(--text-secondary);
  font-size: 10.5px;
  white-space: nowrap;
}

.agent-trace__activity small {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.03em;
}

.agent-trace__period {
  color: var(--text-muted);
  font-size: 10px;
  white-space: nowrap;
}

.agent-trace__note {
  padding: 14px 22px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .agent-trace__cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .agent-trace {
    margin-top: 18px;
  }

  .agent-trace__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
  }

  .agent-trace__meta {
    align-items: flex-start;
    text-align: left;
  }

  .agent-trace__hint {
    padding: 10px 18px;
  }

  .agent-trace__card {
    padding: 18px;
  }

  .agent-trace__note {
    padding: 12px 18px;
  }
}
</style>
