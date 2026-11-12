<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { formatDate, formatNumber, formatTokens } from '@/lib/format';

const props = defineProps({
  records: { type: Array, default: () => [] },
  title: { type: String, default: 'Token 热力图' },
  exportName: { type: String, default: 'token-heatmap' },
});

const METRICS = [
  { key: 'total', label: '总 Token', unit: 'tokens', ramp: 'heat' },
  { key: 'tokensIn', label: '新输入', unit: 'tokens', ramp: 'heat' },
  { key: 'tokensOut', label: '输出', unit: 'tokens', ramp: 'heat' },
  { key: 'cacheRead', label: '缓存读', unit: 'tokens', ramp: 'heat' },
  { key: 'sessions', label: '会话数', unit: '次', ramp: 'heat-alt' },
];

const RANGES = [
  { key: '12w', label: '近 12 周', weeks: 12 },
  { key: '26w', label: '近 26 周', weeks: 26 },
  { key: '52w', label: '近 52 周', weeks: 52 },
  { key: 'all', label: '全部', weeks: 0 },
];

const GAP = 3;
const LABEL_W = 34;
const MONTH_H = 18;
const CAPTION_H = 24;
const DAY_MS = 86400000;

const metric = ref('total');
const range = ref('26w');
const scale = ref('linear');
const weekStart = ref(1);
const showEmpty = ref(true);
const selected = ref('');
const focusIndex = ref(-1);
const tooltip = ref(null);
const exportState = ref('');
const wrapWidth = ref(860);
const svgRef = ref(null);
const wrapRef = ref(null);
let observer = null;

const today = new Date();
today.setHours(0, 0, 0, 0);

function parseDay(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date) {
  const diff = (date.getDay() - weekStart.value + 7) % 7;
  return addDays(date, -diff);
}

const dayMap = computed(() => {
  const map = new Map();
  for (const record of props.records) {
    const key = String(record.date || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    let day = map.get(key);
    if (!day) {
      day = {
        date: key,
        total: 0,
        tokensIn: 0,
        tokensOut: 0,
        cacheRead: 0,
        cacheWrite: 0,
        sessions: 0,
        messages: 0,
        models: new Set(),
        items: [],
      };
      map.set(key, day);
    }
    const tokensIn = Number(record.tokensIn) || 0;
    const tokensOut = Number(record.tokensOut) || 0;
    const cacheRead = Number(record.cacheRead) || 0;
    const cacheWrite = Number(record.cacheWrite) || 0;
    day.tokensIn += tokensIn;
    day.tokensOut += tokensOut;
    day.cacheRead += cacheRead;
    day.cacheWrite += cacheWrite;
    day.total += tokensIn + tokensOut + cacheRead + cacheWrite;
    day.sessions += 1;
    day.messages += Number(record.messages) || 0;
    if (record.model) day.models.add(record.model);
    day.items.push(record);
  }
  return map;
});

const grid = computed(() => {
  const keys = [...dayMap.value.keys()].sort();
  const first = keys.length ? parseDay(keys[0]) : today;
  const option = RANGES.find((item) => item.key === range.value) || RANGES[1];
  let weeks = option.weeks;
  if (!weeks) {
    weeks = Math.ceil((today - startOfWeek(first)) / (7 * DAY_MS)) + 1;
  }
  weeks = Math.max(4, Math.min(54, weeks));
  const start = startOfWeek(addDays(today, -(weeks * 7 - 1)));
  const cells = [];
  for (let week = 0; week < weeks; week += 1) {
    for (let dow = 0; dow < 7; dow += 1) {
      const date = addDays(start, week * 7 + dow);
      const key = iso(date);
      cells.push({
        key,
        week,
        dow,
        day: dayMap.value.get(key) || null,
        future: date > today,
      });
    }
  }
  return { weeks, start, cells, first: keys[0] || '', last: keys.at(-1) || '' };
});

const cellSize = computed(() => {
  const available = wrapWidth.value - LABEL_W - 6;
  const step = Math.floor(available / grid.value.weeks);
  const maxCell = grid.value.weeks <= 16 ? 40 : 28;
  return Math.max(10, Math.min(maxCell, step - GAP));
});
const step = computed(() => cellSize.value + GAP);

const metricInfo = computed(() => METRICS.find((item) => item.key === metric.value));

function cellValue(cell) {
  if (!cell.day) return 0;
  return metric.value === 'sessions' ? cell.day.sessions : cell.day[metric.value];
}

const maxValue = computed(() =>
  grid.value.cells.reduce((max, cell) => Math.max(max, cellValue(cell)), 0),
);

function levelOf(value) {
  if (!value || !maxValue.value) return 0;
  const ratio =
    scale.value === 'log'
      ? Math.log1p(value) / Math.log1p(maxValue.value)
      : value / maxValue.value;
  return Math.min(4, Math.max(1, Math.ceil(ratio * 4)));
}

function fillOf(cell) {
  const level = levelOf(cellValue(cell));
  return `var(--${metricInfo.value.ramp}-${level})`;
}

const svgWidth = computed(() => LABEL_W + grid.value.weeks * step.value + 6);
const svgHeight = computed(() => MONTH_H + 7 * step.value + CAPTION_H);

const monthLabels = computed(() => {
  const labels = [];
  let previous = -1;
  for (let week = 0; week < grid.value.weeks; week += 1) {
    const date = addDays(grid.value.start, week * 7);
    const month = date.getMonth();
    if (month !== previous) {
      labels.push({ week, text: `${month + 1}月` });
      previous = month;
    }
  }
  return labels;
});

const weekdayLabels = computed(() => {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  return [0, 2, 4].map((row) => ({
    row,
    text: names[(row + weekStart.value) % 7],
  }));
});

const stats = computed(() => {
  const days = [...dayMap.value.values()].sort((a, b) => a.date.localeCompare(b.date));
  const active = days.filter((day) => day.total > 0);
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const day of active) {
    const date = parseDay(day.date);
    run = previous && date - previous === DAY_MS ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  let current = 0;
  let cursor = dayMap.value.has(iso(today)) ? today : addDays(today, -1);
  while (dayMap.value.has(iso(cursor)) && dayMap.value.get(iso(cursor)).total > 0) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  const peak = active.reduce(
    (best, day) => (day.total > (best?.total || 0) ? day : best),
    null,
  );
  const sum = active.reduce((total, day) => total + day.total, 0);
  return {
    activeDays: active.length,
    longest,
    current,
    peak,
    average: active.length ? Math.round(sum / active.length) : 0,
    top: [...active].sort((a, b) => b.total - a.total).slice(0, 5),
  };
});

const selectedDay = computed(() =>
  selected.value ? dayMap.value.get(selected.value) || null : null,
);

const selectedItems = computed(() => {
  if (!selectedDay.value) return [];
  return [...selectedDay.value.items].sort((a, b) =>
    String(a.startedAt || '').localeCompare(String(b.startedAt || '')),
  );
});

const liveText = computed(() => {
  const cell = grid.value.cells[focusIndex.value];
  if (!cell) return '';
  const value = cellValue(cell);
  return `${formatDate(cell.key)}，${metricInfo.value.label} ${
    metric.value === 'sessions' ? formatNumber(value) : formatTokens(value)
  }，${cell.day?.sessions || 0} 个会话`;
});

function showTooltip(cell, event) {
  const wrap = wrapRef.value;
  const target = event?.currentTarget;
  if (!wrap || !target) return;
  const wrapRect = wrap.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  tooltip.value = {
    cell,
    x: rect.left - wrapRect.left + rect.width / 2,
    y: rect.top - wrapRect.top,
  };
}

function hideTooltip() {
  tooltip.value = null;
}

function pick(cell) {
  selected.value = selected.value === cell.key ? '' : cell.key;
}

function onKeydown(event) {
  const cells = grid.value.cells;
  if (!cells.length) return;
  const moves = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
  if (event.key in moves) {
    event.preventDefault();
    const base = focusIndex.value < 0 ? cells.length - 8 : focusIndex.value;
    focusIndex.value = Math.max(0, Math.min(cells.length - 1, base + moves[event.key]));
    const cell = cells[focusIndex.value];
    const node = svgRef.value?.querySelector(`[data-key="${cell.key}"]`);
    node?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    showTooltip(cell, { currentTarget: node });
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (focusIndex.value >= 0) pick(cells[focusIndex.value]);
    return;
  }
  if (event.key === 'Escape') {
    selected.value = '';
    hideTooltip();
  }
}

function reset() {
  metric.value = 'total';
  range.value = '26w';
  scale.value = 'linear';
  weekStart.value = 1;
  showEmpty.value = true;
  selected.value = '';
  focusIndex.value = -1;
  hideTooltip();
}

watch(
  () => props.records,
  () => {
    if (selected.value && !dayMap.value.has(selected.value)) selected.value = '';
    focusIndex.value = -1;
    hideTooltip();
  },
);

onMounted(() => {
  if (!wrapRef.value || typeof ResizeObserver === 'undefined') return;
  observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect?.width;
    if (width) wrapWidth.value = Math.max(240, width - 4);
  });
  observer.observe(wrapRef.value);
});

onBeforeUnmount(() => observer?.disconnect());

const SVG_NS = 'http://www.w3.org/2000/svg';

function resolvedSvg() {
  const clone = svgRef.value.cloneNode(true);
  const styles = getComputedStyle(document.documentElement);
  const resolve = (value) => {
    if (!value || !value.startsWith('var(')) return value;
    return styles.getPropertyValue(value.slice(4, -1).trim()).trim() || '#888888';
  };
  clone.querySelectorAll('*').forEach((node) => {
    for (const attr of ['fill', 'stroke']) {
      const value = node.getAttribute(attr);
      if (value) node.setAttribute(attr, resolve(value));
    }
    node.removeAttribute('data-key');
    node.removeAttribute('tabindex');
    node.removeAttribute('class');
  });
  clone.setAttribute('xmlns', SVG_NS);
  clone.removeAttribute('class');
  clone.removeAttribute('style');
  clone.removeAttribute('tabindex');
  clone.removeAttribute('role');
  clone.removeAttribute('aria-label');
  const background = document.createElementNS(SVG_NS, 'rect');
  background.setAttribute('x', '0');
  background.setAttribute('y', '0');
  background.setAttribute('width', String(svgWidth.value));
  background.setAttribute('height', String(svgHeight.value));
  background.setAttribute('fill', resolve('var(--bg-base)'));
  clone.insertBefore(background, clone.firstChild);
  return clone;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function svgMarkup() {
  return new XMLSerializer().serializeToString(resolvedSvg());
}

function exportSvg() {
  exportState.value = 'svg';
  triggerDownload(
    new Blob([svgMarkup()], { type: 'image/svg+xml;charset=utf-8' }),
    `${props.exportName}-${metric.value}.svg`,
  );
  setTimeout(() => (exportState.value = ''), 1200);
}

async function exportPng() {
  exportState.value = 'png';
  const url = URL.createObjectURL(
    new Blob([svgMarkup()], { type: 'image/svg+xml;charset=utf-8' }),
  );
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const ratio = 2;
    const canvas = document.createElement('canvas');
    canvas.width = svgWidth.value * ratio;
    canvas.height = svgHeight.value * ratio;
    const context = canvas.getContext('2d');
    context.scale(ratio, ratio);
    context.drawImage(image, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (blob) triggerDownload(blob, `${props.exportName}-${metric.value}.png`);
  } finally {
    URL.revokeObjectURL(url);
    setTimeout(() => (exportState.value = ''), 1200);
  }
}

function formatMetric(value) {
  return metric.value === 'sessions' ? `${formatNumber(value)} 次` : formatTokens(value);
}

function timeOf(record) {
  const value = String(record.startedAt || '');
  return value.length >= 16 ? value.slice(11, 16) : '--:--';
}
</script>

<template>
  <div class="heat">
    <div class="heat__head">
      <div>
        <h3>{{ title }}</h3>
        <p class="heat__sub mono">
          {{ grid.first ? formatDate(grid.first) : '—' }} → {{ grid.last ? formatDate(grid.last) : '—' }}
          · 每格一天 · 点击查看当日会话
        </p>
      </div>
      <div class="heat__legend mono" aria-hidden="true">
        <span>少</span>
        <i v-for="level in 5" :key="level" :style="{ background: `var(--${metricInfo.ramp}-${level - 1})` }"></i>
        <span>多</span>
        <em>{{ formatMetric(maxValue) }} / 日峰值</em>
      </div>
    </div>

    <div class="heat__controls" role="group" aria-label="热力图控制">
      <label class="heat__field">
        <span>指标</span>
        <select v-model="metric">
          <option v-for="item in METRICS" :key="item.key" :value="item.key">{{ item.label }}</option>
        </select>
      </label>
      <label class="heat__field">
        <span>范围</span>
        <select v-model="range">
          <option v-for="item in RANGES" :key="item.key" :value="item.key">{{ item.label }}</option>
        </select>
      </label>
      <div class="heat__field">
        <span>刻度</span>
        <div class="heat__seg">
          <button type="button" :aria-pressed="scale === 'linear'" @click="scale = 'linear'">线性</button>
          <button type="button" :aria-pressed="scale === 'log'" @click="scale = 'log'">对数</button>
        </div>
      </div>
      <div class="heat__field">
        <span>周起始</span>
        <div class="heat__seg">
          <button type="button" :aria-pressed="weekStart === 1" @click="weekStart = 1">周一</button>
          <button type="button" :aria-pressed="weekStart === 0" @click="weekStart = 0">周日</button>
        </div>
      </div>
      <button type="button" class="heat__toggle" :aria-pressed="showEmpty" @click="showEmpty = !showEmpty">
        <i :class="{ on: showEmpty }"></i>显示空日
      </button>
      <div class="heat__actions">
        <button type="button" class="btn btn--compact" @click="reset">重置</button>
        <button type="button" class="btn btn--compact" :disabled="!!exportState" @click="exportSvg">
          {{ exportState === 'svg' ? '已导出' : '导出 SVG' }}
        </button>
        <button type="button" class="btn btn--compact" :disabled="!!exportState" @click="exportPng">
          {{ exportState === 'png' ? '渲染中' : '导出 PNG' }}
        </button>
      </div>
    </div>

    <div class="heat__body">
      <div
        ref="wrapRef"
        class="heat__wrap"
        tabindex="0"
        role="application"
        aria-label="Token 日历热力图，方向键移动，回车查看当日会话"
        @keydown="onKeydown"
        @pointerleave="hideTooltip"
      >
        <svg
          ref="svgRef"
          class="heat__svg"
          :width="svgWidth"
          :height="svgHeight"
          :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
          role="img"
          :aria-label="`${title}，${metricInfo.label}，${grid.weeks} 周`"
        >
          <text
            v-for="label in monthLabels"
            :key="`m-${label.week}`"
            :x="LABEL_W + label.week * step"
            :y="11"
            fill="var(--text-muted)"
            font-size="10"
            font-family="ui-monospace, Consolas, monospace"
          >{{ label.text }}</text>
          <text
            v-for="label in weekdayLabels"
            :key="`w-${label.row}`"
            :x="LABEL_W - 8"
            :y="MONTH_H + label.row * step + cellSize - 3"
            fill="var(--text-muted)"
            font-size="10"
            text-anchor="end"
            font-family="ui-monospace, Consolas, monospace"
          >{{ label.text }}</text>
          <rect
            v-for="cell in grid.cells"
            :key="cell.key"
            :data-key="cell.key"
            :x="LABEL_W + cell.week * step"
            :y="MONTH_H + cell.dow * step"
            :width="cellSize"
            :height="cellSize"
            rx="2"
            :fill="cell.future ? 'var(--heat-0)' : fillOf(cell)"
            :opacity="cell.future ? 0.35 : !cell.day && !showEmpty ? 0 : 1"
            :stroke="selected === cell.key ? 'var(--accent)' : focusIndex >= 0 && grid.cells[focusIndex]?.key === cell.key ? 'var(--text-primary)' : 'none'"
            :stroke-width="selected === cell.key ? 2 : 1.5"
            class="heat__cell"
            :class="{ picked: selected === cell.key }"
            @pointerenter="showTooltip(cell, $event)"
            @pointermove="showTooltip(cell, $event)"
            @click="pick(cell)"
          />
          <text
            :x="LABEL_W"
            :y="svgHeight - 8"
            fill="var(--text-muted)"
            font-size="10"
            font-family="ui-monospace, Consolas, monospace"
          >{{ title }} · {{ metricInfo.label }} · {{ RANGES.find((r) => r.key === range)?.label }} · {{ scale === 'log' ? '对数刻度' : '线性刻度' }}</text>
        </svg>

        <div
          v-if="tooltip"
          class="heat__tip"
          :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
          role="status"
        >
          <strong class="mono">{{ formatDate(tooltip.cell.key) }}</strong>
          <span>{{ metricInfo.label }}：{{ formatMetric(cellValue(tooltip.cell)) }}</span>
          <span v-if="tooltip.cell.day">
            会话 {{ tooltip.cell.day.sessions }} · 消息 {{ formatNumber(tooltip.cell.day.messages) }}
          </span>
          <span v-if="tooltip.cell.day && tooltip.cell.day.models.size">
            {{ [...tooltip.cell.day.models].slice(0, 2).join(' / ') }}
          </span>
          <span v-else-if="!tooltip.cell.day">无记录</span>
        </div>
        <p class="sr-only" aria-live="polite">{{ liveText }}</p>
      </div>

      <aside class="heat__side">
        <div class="heat__stats mono">
          <span>活跃 <strong>{{ stats.activeDays }}</strong> 天</span>
          <span>最长连续 <strong>{{ stats.longest }}</strong> 天</span>
          <span>当前连续 <strong>{{ stats.current }}</strong> 天</span>
          <span>活跃日均 <strong>{{ formatTokens(stats.average) }}</strong></span>
        </div>

        <div v-if="selectedDay" class="heat__day">
          <div class="heat__day-head">
            <strong class="mono">{{ formatDate(selectedDay.date) }}</strong>
            <button type="button" class="btn btn--compact" @click="selected = ''">收起</button>
          </div>
          <p class="heat__day-sum mono">
            {{ formatTokens(selectedDay.total) }} tokens · {{ selectedDay.sessions }} 会话 ·
            {{ formatNumber(selectedDay.messages) }} 消息
          </p>
          <ul class="heat__day-list">
            <li v-for="(item, index) in selectedItems" :key="`${item.session}-${index}`">
              <span class="mono heat__time">{{ timeOf(item) }}</span>
              <span class="heat__project">{{ item.project || 'unknown' }}</span>
              <span class="mono heat__tokens">{{ formatTokens(item.tokensIn + item.tokensOut + item.cacheRead + item.cacheWrite) }}</span>
            </li>
          </ul>
        </div>

        <div v-else class="heat__top">
          <span class="heat__side-label mono">峰值日 TOP 5</span>
          <ul>
            <li v-for="day in stats.top" :key="day.date">
              <button type="button" class="mono" @click="selected = day.date">
                <span>{{ formatDate(day.date) }}</span>
                <strong>{{ formatTokens(day.total) }}</strong>
              </button>
            </li>
          </ul>
          <p v-if="!stats.top.length" class="heat__side-empty">暂无记录</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.heat {
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
}

.heat__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px 0;
}

.heat__head h3 {
  font-size: 19px;
  font-weight: 600;
}

.heat__sub {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.heat__legend {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-size: 10px;
}

.heat__legend i {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.heat__legend em {
  margin-left: 10px;
  font-style: normal;
  color: var(--text-secondary);
}

.heat__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px 18px;
  margin: 18px 24px 0;
  padding: 14px 16px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent);
  background: var(--bg-secondary);
}

.heat__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heat__field > span {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.heat__field select {
  min-width: 104px;
  padding: 7px 10px;
  border: 1px solid var(--border-primary);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 11.5px;
  cursor: pointer;
}

.heat__seg {
  display: flex;
  border: 1px solid var(--border-primary);
}

.heat__seg button {
  padding: 7px 12px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11.5px;
  cursor: pointer;
}

.heat__seg button + button {
  border-left: 1px solid var(--border-primary);
}

.heat__seg button[aria-pressed='true'] {
  background: var(--accent);
  color: var(--bg-base);
}

.heat__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 4px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11.5px;
  cursor: pointer;
}

.heat__toggle i {
  width: 26px;
  height: 14px;
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  position: relative;
  transition: background 0.18s ease;
}

.heat__toggle i::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  transition: transform 0.18s ease, background 0.18s ease;
}

.heat__toggle i.on {
  background: var(--selection);
}

.heat__toggle i.on::after {
  transform: translateX(12px);
  background: var(--accent);
}

.heat__actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.heat__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 264px;
  gap: 18px;
  margin: 18px 24px 24px;
}

.heat__wrap {
  position: relative;
  min-width: 0;
  padding: 6px 2px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-color: var(--accent) var(--bg-secondary);
}

.heat__wrap::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border: 2px solid var(--bg-primary);
}

.heat__wrap::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

.heat__wrap:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.heat__svg {
  display: block;
  max-width: none;
  margin-inline: auto;
}

.heat__cell {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.heat__cell:hover {
  stroke: var(--text-primary);
  stroke-width: 1.5;
}

.heat__cell.picked {
  cursor: default;
}

.heat__tip {
  position: absolute;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 168px;
  padding: 10px 12px;
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-panel);
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.5;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 10px));
}

.heat__tip strong {
  color: var(--text-primary);
  font-size: 11px;
}

.heat__side {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
  border-left: 1px solid var(--border-subtle);
  padding-left: 18px;
}

.heat__stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.heat__stats strong {
  color: var(--text-primary);
  font-weight: 600;
}

.heat__side-label {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.heat__top ul,
.heat__day-list {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.heat__top li + li {
  margin-top: 4px;
}

.heat__top button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 10px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 10.5px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.heat__top button:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.heat__top strong {
  color: var(--accent);
  font-weight: 600;
}

.heat__side-empty {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 11px;
}

.heat__day {
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.heat__day-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.heat__day-head strong {
  color: var(--accent);
  font-size: 12px;
}

.heat__day-sum {
  padding: 8px 12px 0;
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1.6;
}

.heat__day-list {
  margin: 0;
  padding: 6px 0;
  max-height: 240px;
  overflow-y: auto;
}

.heat__day-list li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 62px;
  gap: 8px;
  align-items: center;
  padding: 7px 12px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 11px;
}

.heat__day-list li:last-child {
  border-bottom: 0;
}

.heat__time {
  color: var(--text-muted);
}

.heat__project {
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.heat__tokens {
  color: var(--accent);
  text-align: right;
}

@media (max-width: 1100px) {
  .heat__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .heat__side {
    border-left: 0;
    border-top: 1px solid var(--border-subtle);
    padding-left: 0;
    padding-top: 14px;
  }

  .heat__stats {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 22px;
  }
}

@media (max-width: 900px) {
  .heat__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .heat__actions {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .heat__head,
  .heat__controls,
  .heat__body {
    margin-left: 14px;
    margin-right: 14px;
  }

  .heat__head {
    padding: 18px 0 0;
  }

  .heat__controls {
    padding: 12px;
    gap: 12px;
  }

  .heat__field select {
    min-width: 92px;
  }
}
</style>
