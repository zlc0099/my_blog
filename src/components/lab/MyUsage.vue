<script setup>
import { computed, onMounted, ref } from 'vue';
import UsageHeatmap from '@/components/lab/UsageHeatmap.vue';
import {
  buildUsageSummary,
  createUsageState,
  dedupeShortIds,
  ingestEntry,
  localDate,
  sumTokens,
  toUsageRecords,
} from '@/lib/claude-usage';
import { formatDate, formatNumber, formatTokens } from '@/lib/format';

const STORAGE_KEY = 'pa-my-usage-v1';
const MODEL_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--success)',
  'var(--heat-alt-3)',
];

const fileInput = ref(null);
const folderInput = ref(null);
const dragging = ref(false);
const parsing = ref(false);
const cancelled = ref(false);
const progress = ref({ files: 0, total: 0, lines: 0, sessions: 0, name: '' });
const error = ref('');
const storageWarning = ref('');
const confirmClear = ref(false);
const payload = ref(null);

const records = computed(() => payload.value?.records || []);
const models = computed(() => payload.value?.models || []);
const total = computed(() => sumTokens(records.value));

const stats = computed(() => {
  const list = records.value;
  const cacheRead = list.reduce((sum, r) => sum + (Number(r.cacheRead) || 0), 0);
  const messages = list.reduce((sum, r) => sum + (Number(r.messages) || 0), 0);
  const dates = list.map((r) => r.date).filter(Boolean).sort();
  const days = new Set(dates).size;
  return [
    { label: '总 Token', value: formatTokens(total.value), sub: `${formatNumber(total.value)} recorded` },
    { label: '会话', value: String(list.length).padStart(2, '0'), sub: `${days} 个活跃日` },
    { label: '消息', value: formatNumber(messages), sub: 'assistant 回复' },
    { label: '模型', value: String(models.value.length).padStart(2, '0'), sub: models.value[0]?.model || '—' },
    {
      label: '缓存读占比',
      value: total.value ? `${((cacheRead / total.value) * 100).toFixed(1)}%` : '0%',
      sub: 'cache read / total',
    },
    {
      label: '时间范围',
      value: dates.length ? formatDate(dates[0]).slice(5) : '—',
      sub: dates.length ? `→ ${formatDate(dates.at(-1))}` : '暂无记录',
    },
  ];
});

const modelRows = computed(() => {
  const max = models.value.reduce((value, model) => Math.max(value, model.total || 0), 0);
  return models.value.map((model, index) => ({
    ...model,
    color: MODEL_COLORS[index % MODEL_COLORS.length],
    width: max ? Math.max(2, Math.round(((model.total || 0) / max) * 100)) : 0,
    share: total.value ? (((model.total || 0) / total.value) * 100).toFixed(1) : '0',
  }));
});

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.records)) payload.value = parsed;
  } catch (err) {
    storageWarning.value = '本地保存的数据无法读取，已忽略。';
  }
}

function persist(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    storageWarning.value = '';
  } catch (err) {
    storageWarning.value = '浏览器本地存储空间不足，本次结果只保留在当前页面，刷新后会丢失。';
  }
}

onMounted(loadStored);

function pickFiles() {
  error.value = '';
  fileInput.value?.click();
}

function pickFolder() {
  error.value = '';
  folderInput.value?.click();
}

function onDrop(event) {
  dragging.value = false;
  const files = [...(event.dataTransfer?.files || [])].filter((file) =>
    file.name.endsWith('.jsonl'),
  );
  if (!files.length) {
    error.value = '拖入的内容里没有 .jsonl 日志文件。';
    return;
  }
  void parseFiles(files);
}

async function readLines(file, onLine) {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  for (;;) {
    if (cancelled.value) {
      await reader.cancel();
      return;
    }
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index = buffer.indexOf('\n');
    while (index >= 0) {
      onLine(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
      index = buffer.indexOf('\n');
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  buffer += decoder.decode();
  if (buffer) onLine(buffer);
}

async function parseFiles(files) {
  if (parsing.value) return;
  parsing.value = true;
  cancelled.value = false;
  error.value = '';
  confirmClear.value = false;
  progress.value = { files: 0, total: files.length, lines: 0, sessions: 0, name: '' };

  const state = createUsageState();
  try {
    for (const file of files) {
      if (cancelled.value) break;
      progress.value.name = file.name;
      const fallback = file.name.replace(/\.jsonl$/i, '');
      const fileDate = localDate(new Date(file.lastModified || Date.now()).toISOString());
      await readLines(file, (line) => {
        progress.value.lines += 1;
        if (!line.includes('"usage"')) return;
        let entry;
        try {
          entry = JSON.parse(line);
        } catch (err) {
          return;
        }
        ingestEntry(state, entry, fallback, fileDate);
      });
      progress.value.files += 1;
      progress.value.sessions = state.sessions.size;
    }

    if (cancelled.value) {
      error.value = '已取消解析，未保存任何结果。';
      return;
    }

    const summary = buildUsageSummary(state);
    if (!summary.sessions.length) {
      error.value = '这些文件里没有解析到带 usage 统计的 assistant 记录。请确认选择的是 Claude Code 的 .jsonl 会话日志。';
      return;
    }
    dedupeShortIds(summary.sessions);
    const next = {
      version: 1,
      updated: localDate(new Date().toISOString()),
      fileCount: files.length,
      records: toUsageRecords(summary.sessions),
      models: summary.models,
    };
    payload.value = next;
    persist(next);
  } catch (err) {
    error.value = `解析失败：${err?.message || err}`;
  } finally {
    parsing.value = false;
    progress.value.name = '';
  }
}

function onFileChange(event) {
  const files = [...(event.target.files || [])].filter((file) =>
    file.name.endsWith('.jsonl'),
  );
  event.target.value = '';
  if (!files.length) {
    error.value = '没有选中 .jsonl 文件。';
    return;
  }
  void parseFiles(files);
}

function cancelParse() {
  cancelled.value = true;
}

function exportJson() {
  if (!payload.value) return;
  const blob = new Blob([JSON.stringify(payload.value, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `my-claude-usage-${payload.value.updated}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function clearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true;
    return;
  }
  payload.value = null;
  confirmClear.value = false;
  storageWarning.value = '';
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    /* 本地存储不可用时忽略 */
  }
}
</script>

<template>
  <div class="mine">
    <div class="mine__intro">
      <p>
        把你自己的 Claude Code 会话日志（<code class="mono">~/.claude/projects/**/*.jsonl</code>）交给这个页面，
        就能得到和上面同一套热力图与账本。解析、聚合、保存全部在你的浏览器里完成，
        <strong>文件不会上传</strong>；仓库和服务器拿不到你的任何数据。
      </p>
      <span class="badge">仅本机浏览器</span>
    </div>

    <div
      class="mine__drop"
      :class="{ dragging, busy: parsing }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <div class="mine__drop-text">
        <strong>{{ parsing ? '正在本地解析…' : '拖入 .jsonl 日志，或选择文件' }}</strong>
        <span class="mono">
          {{
            parsing
              ? `${progress.files}/${progress.total} 个文件 · ${formatNumber(progress.lines)} 行 · ${progress.sessions} 个会话${progress.name ? ` · ${progress.name}` : ''}`
              : '支持多选文件，或直接选择整个 projects 文件夹'
          }}
        </span>
      </div>
      <div class="mine__drop-actions">
        <button type="button" class="btn btn--compact" :disabled="parsing" @click="pickFiles">选择文件</button>
        <button type="button" class="btn btn--compact" :disabled="parsing" @click="pickFolder">选择文件夹</button>
        <button v-if="parsing" type="button" class="btn btn--compact" @click="cancelParse">取消</button>
      </div>
      <div v-if="parsing" class="mine__bar" aria-hidden="true">
        <i :style="{ width: `${progress.total ? Math.round((progress.files / progress.total) * 100) : 0}%` }"></i>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".jsonl,application/jsonl"
        multiple
        class="sr-only"
        tabindex="-1"
        @change="onFileChange"
      />
      <input
        ref="folderInput"
        type="file"
        webkitdirectory
        directory
        multiple
        class="sr-only"
        tabindex="-1"
        @change="onFileChange"
      />
    </div>

    <p v-if="error" class="mine__error" role="alert">{{ error }}</p>
    <p v-if="storageWarning" class="mine__warn" role="status">{{ storageWarning }}</p>

    <template v-if="payload">
      <div class="mine__meta mono">
        <span>本地结果 · {{ payload.fileCount }} 个文件 · 导入于 {{ formatDate(payload.updated) }}</span>
        <div class="mine__meta-actions">
          <button type="button" class="btn btn--compact" @click="exportJson">导出聚合 JSON</button>
          <button type="button" class="btn btn--compact" :class="{ danger: confirmClear }" @click="clearAll">
            {{ confirmClear ? '确认清除？' : '清除本地数据' }}
          </button>
        </div>
      </div>

      <div class="mine__stats">
        <div v-for="stat in stats" :key="stat.label" class="mine__stat">
          <span class="mine__stat-label">{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
          <small class="mono">{{ stat.sub }}</small>
        </div>
      </div>

      <UsageHeatmap :records="records" title="我的 Token 热力图" export-name="my-token-heatmap" />

      <div class="mine__models">
        <div class="mine__models-head">
          <h4>我的模型分布</h4>
          <span class="mono">按总 Token 排序 · 含缓存读写</span>
        </div>
        <ul>
          <li v-for="model in modelRows" :key="model.model">
            <span class="mine__model-name mono">{{ model.model }}</span>
            <span class="mine__model-bar"><i :style="{ width: `${model.width}%`, background: model.color }"></i></span>
            <span class="mono mine__model-value">{{ formatTokens(model.total) }}</span>
            <span class="mono mine__model-share">{{ model.share }}%</span>
            <span class="mono mine__model-sub">{{ model.sessions }} 会话 / {{ formatNumber(model.messages) }} 消息</span>
          </li>
        </ul>
      </div>

      <p class="mine__foot mono">
        重新导入会覆盖本地保存的聚合结果；聚合只包含日期、模型、项目标签与 Token 计数，不含对话原文。
      </p>
    </template>

    <div v-else-if="!parsing" class="mine__empty">
      <strong>还没有你的数据</strong>
      <p>
        导入后这里会显示你的总量、活跃日、模型分布和日历热力图；
        结果保存在本机浏览器，下次打开自动恢复，也可以一键清除。
      </p>
    </div>
  </div>
</template>

<style scoped>
.mine {
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  padding: clamp(20px, 3vw, 28px);
}

.mine__intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.mine__intro p {
  max-width: 760px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.85;
}

.mine__intro strong {
  color: var(--text-primary);
}

.mine__intro code {
  padding: 1px 5px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  font-size: 11px;
}

.mine__drop {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 20px;
  margin-top: 20px;
  padding: 20px 22px;
  border: 1px dashed var(--border-strong);
  background: var(--bg-secondary);
  transition: border-color 0.18s ease, background 0.18s ease;
}

.mine__drop.dragging {
  border-color: var(--accent);
  background: var(--selection);
}

.mine__drop.busy {
  border-style: solid;
}

.mine__drop-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.mine__drop-text strong {
  font-size: 14px;
  font-weight: 600;
}

.mine__drop-text span {
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mine__drop-actions {
  display: flex;
  gap: 8px;
}

.mine__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--border-subtle);
}

.mine__bar i {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.2s ease;
}

.mine__error,
.mine__warn {
  margin-top: 14px;
  padding: 10px 14px;
  border-left: 2px solid var(--danger);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.mine__warn {
  border-left-color: var(--warning);
}

.mine__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 18px;
  margin-top: 22px;
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.05em;
}

.mine__meta-actions {
  display: flex;
  gap: 8px;
}

.mine__meta-actions .danger {
  border-color: var(--danger);
  color: var(--danger);
}

.mine__stats {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1px;
  margin-top: 14px;
  background: var(--border-subtle);
  border: 1px solid var(--border-subtle);
}

.mine__stat {
  display: flex;
  min-height: 108px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 16px 18px;
  background: var(--bg-secondary);
}

.mine__stat-label {
  color: var(--text-muted);
  font-size: 11px;
}

.mine__stat strong {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 600;
  line-height: 1;
}

.mine__stat small {
  color: var(--text-muted);
  font-size: 9.5px;
  letter-spacing: 0.04em;
}

.mine :deep(.heat) {
  margin-top: 18px;
}

.mine__models {
  margin-top: 18px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.mine__models-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.mine__models-head h4 {
  font-size: 14px;
  font-weight: 600;
}

.mine__models-head span {
  color: var(--text-muted);
  font-size: 10px;
}

.mine__models ul {
  margin: 0;
  padding: 8px 0;
  list-style: none;
}

.mine__models li {
  display: grid;
  grid-template-columns: minmax(120px, 1.1fr) minmax(0, 2fr) 70px 52px minmax(120px, 1fr);
  gap: 14px;
  align-items: center;
  padding: 9px 18px;
}

.mine__model-name {
  color: var(--text-primary);
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mine__model-bar {
  height: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
}

.mine__model-bar i {
  display: block;
  height: 100%;
}

.mine__model-value {
  color: var(--accent);
  font-size: 11px;
  text-align: right;
}

.mine__model-share {
  color: var(--text-secondary);
  font-size: 10.5px;
  text-align: right;
}

.mine__model-sub {
  color: var(--text-muted);
  font-size: 10px;
  text-align: right;
}

.mine__foot {
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.mine__empty {
  margin-top: 20px;
  padding: 26px 22px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.mine__empty strong {
  font-size: 14px;
}

.mine__empty p {
  margin-top: 8px;
  max-width: 640px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.8;
}

@media (max-width: 1100px) {
  .mine__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mine__models li {
    grid-template-columns: minmax(110px, 1fr) minmax(0, 1.6fr) 66px 48px;
  }

  .mine__model-sub {
    display: none;
  }
}

@media (max-width: 640px) {
  .mine__intro {
    flex-direction: column;
  }

  .mine__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mine__models li {
    grid-template-columns: minmax(90px, 1fr) minmax(0, 1.4fr) 62px;
  }

  .mine__model-share {
    display: none;
  }

  .mine__drop {
    padding: 16px;
  }
}
</style>
