<script setup>
import { computed } from 'vue';
import { usageSummary } from '@/lib/usage';
import { formatNumber, formatTokens } from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState.vue';

const models = computed(() => usageSummary.models);

const totalMessages = computed(() =>
  models.value.reduce((sum, model) => sum + model.messages, 0),
);

const totalTokens = computed(() =>
  models.value.reduce(
    (sum, model) => {
      sum.cacheRead += model.cacheRead;
      sum.cacheWrite += model.cacheWrite;
      sum.tokensIn += model.tokensIn;
      sum.tokensOut += model.tokensOut;
      return sum;
    },
    { cacheRead: 0, cacheWrite: 0, tokensIn: 0, tokensOut: 0 },
  ),
);

const mixLabel = computed(() =>
  models.value
    .map((model) => `${model.model} ${shareLabel(model.share)}`)
    .join(' · '),
);

function shareLabel(value) {
  if (value > 0 && value < 0.1) return '<0.1%';
  return `${value.toFixed(1)}%`;
}

const coverageText = computed(() =>
  usageSummary.modelCoverage
    ? `${usageSummary.modelCoverage.toFixed(1)}% OF RECORDED TOKENS`
    : '',
);
</script>

<template>
  <div class="model-usage">
    <div class="model-usage__head">
      <div>
        <span class="eyebrow">MODEL MIX / 模型构成</span>
        <h3>各模型使用情况</h3>
      </div>
      <div class="model-usage__meta">
        <span class="badge">{{ usageSummary.modelScopeLabel || 'NO MODEL DATA' }}</span>
        <span class="mono">
          {{ usageSummary.modelCount }} MODELS · {{ formatNumber(totalMessages) }} MESSAGES
        </span>
      </div>
    </div>

    <p class="model-usage__hint mono">
      AGGREGATED BY MESSAGE MODEL / 按每条消息的模型聚合 · TOKEN 包含缓存读写 ·
      同一会话可能使用多个模型
    </p>

    <EmptyState
      v-if="!models.length"
      code="MODEL / EMPTY"
      title="还没有模型记录"
      description="运行 Claude Code 导入器后，这里会按模型拆分 Token 使用情况。"
    />

    <template v-else>
      <div class="model-usage__mix">
        <div class="model-usage__bar" role="img" :aria-label="mixLabel">
          <span
            v-for="model in models"
            :key="model.model"
            :style="{ flexGrow: model.total, background: model.color }"
            :title="`${model.model} · ${shareLabel(model.share)}`"
          ></span>
        </div>
        <ul class="model-usage__legend">
          <li v-for="model in models" :key="model.model">
            <i :style="{ background: model.color }"></i>
            <span class="model-usage__legend-name">{{ model.model }}</span>
            <span class="mono">{{ shareLabel(model.share) }}</span>
          </li>
        </ul>
      </div>

      <div class="model-usage__table-wrap">
        <table>
          <thead>
            <tr>
              <th>MODEL</th>
              <th>SESSIONS</th>
              <th>MESSAGES</th>
              <th>CACHE READ</th>
              <th>CACHE WRITE</th>
              <th>NEW INPUT</th>
              <th>OUTPUT</th>
              <th>TOTAL</th>
              <th>SHARE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(model, index) in models" :key="model.model">
              <td>
                <span class="model-usage__name">
                  <i :style="{ background: model.color }"></i>
                  <span>
                    <strong>{{ model.model }}</strong>
                    <small class="mono">
                      M-{{ String(index + 1).padStart(2, '0') }} · {{ model.agent }}
                    </small>
                  </span>
                </span>
              </td>
              <td class="mono">{{ String(model.sessions).padStart(2, '0') }}</td>
              <td class="mono">{{ formatNumber(model.messages) }}</td>
              <td class="mono">{{ formatTokens(model.cacheRead) }}</td>
              <td class="mono">{{ formatTokens(model.cacheWrite) }}</td>
              <td class="mono">{{ formatTokens(model.tokensIn) }}</td>
              <td class="mono">{{ formatTokens(model.tokensOut) }}</td>
              <td class="mono model-usage__total">
                <strong>{{ formatTokens(model.total) }}</strong>
                <small>{{ formatNumber(model.total) }}</small>
              </td>
              <td class="model-usage__share">
                <span class="mono">{{ shareLabel(model.share) }}</span>
                <span class="model-usage__track">
                  <i :style="{ width: `${model.share}%`, background: model.color }"></i>
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="mono">TOTAL</td>
              <td class="mono" title="同一会话可能使用多个模型，会话数不可相加">—</td>
              <td class="mono">{{ formatNumber(totalMessages) }}</td>
              <td class="mono">{{ formatTokens(totalTokens.cacheRead) }}</td>
              <td class="mono">{{ formatTokens(totalTokens.cacheWrite) }}</td>
              <td class="mono">{{ formatTokens(totalTokens.tokensIn) }}</td>
              <td class="mono">{{ formatTokens(totalTokens.tokensOut) }}</td>
              <td class="mono model-usage__total">
                <strong>{{ formatTokens(usageSummary.modelTotal) }}</strong>
                <small>{{ formatNumber(usageSummary.modelTotal) }}</small>
              </td>
              <td class="mono">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p class="model-usage__note mono">
        MODEL TOTAL / {{ formatTokens(usageSummary.modelTotal) }}
        <span v-if="coverageText"> · {{ coverageText }}</span>
        · SESSIONS 为出现该模型的会话数，不可相加 ·
        模型名读取自本地 Claude Code 日志 · Qoder / Trae 无 Token 明细，模型统计见下方 TRACE
      </p>
    </template>
  </div>
</template>

<style scoped>
.model-usage {
  border: 1px solid var(--border-subtle);
}

.model-usage__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.model-usage__head h3 {
  margin-top: 8px;
  font-size: 19px;
  font-weight: 600;
}

.model-usage__meta {
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

.model-usage__hint {
  padding: 11px 22px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.model-usage__mix {
  padding: 20px 22px 18px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-primary);
}

.model-usage__bar {
  display: flex;
  height: 12px;
  gap: 2px;
  background: var(--bg-secondary);
}

.model-usage__bar span {
  min-width: 3px;
  height: 100%;
  transition: flex-grow var(--dur-base) var(--ease-out);
}

.model-usage__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin-top: 14px;
}

.model-usage__legend li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.03em;
}

.model-usage__legend i {
  width: 7px;
  height: 7px;
  flex: none;
}

.model-usage__legend-name {
  color: var(--text-secondary);
}

.model-usage__table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 960px;
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

tbody td.mono {
  color: var(--text-secondary);
  font-size: 10.5px;
  white-space: nowrap;
}

.model-usage__name {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
}

.model-usage__name > i {
  width: 6px;
  height: 22px;
  flex: none;
}

.model-usage__name strong {
  display: block;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.model-usage__name small {
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.03em;
}

.model-usage__total strong {
  display: block;
  color: var(--text-primary);
  font-size: 11.5px;
  font-weight: 500;
}

.model-usage__total small {
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 9.5px;
}

.model-usage__share {
  min-width: 108px;
}

.model-usage__share > span:first-child {
  color: var(--text-secondary);
  font-size: 10px;
}

.model-usage__track {
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 5px;
  background: var(--bg-secondary);
}

.model-usage__track i {
  display: block;
  height: 100%;
}

tfoot td {
  border-bottom: 0;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 10px;
}

tfoot td.model-usage__total strong {
  color: var(--text-secondary);
}

.model-usage__note {
  padding: 14px 22px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

@media (max-width: 560px) {
  .model-usage__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
  }

  .model-usage__meta {
    align-items: flex-start;
    text-align: left;
  }

  .model-usage__hint {
    padding: 10px 18px;
  }

  .model-usage__mix {
    padding: 18px;
  }

  .model-usage__note {
    padding: 12px 18px;
  }
}
</style>
