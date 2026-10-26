<script setup>
import { computed, ref } from 'vue';
import PageHero from '@/components/ui/PageHero.vue';
import TimelineList from '@/components/timeline/TimelineList.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { archiveStats, getTimelineEntries } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'LEARNING TIMELINE / 学习时间线',
  description: '文章、项目与阶段里程碑组成的个人学习时间线。',
});

const entries = getTimelineEntries();
const activeType = ref('all');

const filters = computed(() => [
  { id: 'all', label: 'ALL / 全部', count: entries.length },
  { id: 'post', label: 'LOG / 文章', count: entries.filter((entry) => entry.type === 'post').length },
  { id: 'project', label: 'OPS / 项目', count: entries.filter((entry) => entry.type === 'project').length },
  {
    id: 'milestone',
    label: 'EVT / 里程碑',
    count: entries.filter((entry) => entry.type === 'milestone').length,
  },
]);

const filteredEntries = computed(() =>
  activeType.value === 'all'
    ? entries
    : entries.filter((entry) => entry.type === activeType.value),
);

const yearCount = new Set(entries.map((entry) => String(entry.date).slice(0, 4))).size;

const heroMeta = [
  { label: 'ENTRIES', value: String(entries.length).padStart(2, '0') },
  { label: 'YEARS', value: String(yearCount).padStart(2, '0') },
  { label: 'UPDATED', value: formatDate(archiveStats.latestUpdate) },
];
</script>

<template>
  <div>
    <PageHero
      eyebrow="ARCHIVE / CHRONICLE"
      title="LEARNING TIMELINE"
      zh="学习时间线"
      description="由文章发布日期、项目记录和手动维护的阶段里程碑聚合而成。按时间回看学习路径，也标记值得记住的节点。"
      serial="ARCHIVE / CHRONICLE"
      :meta="heroMeta"
    />

    <section class="section timeline-section">
      <div class="container">
        <div class="timeline-filters">
          <span class="eyebrow">FILTER</span>
          <div class="timeline-filters__options">
            <button
              v-for="filter in filters"
              :key="filter.id"
              type="button"
              class="filter-chip"
              :class="{ 'is-active': activeType === filter.id }"
              @click="activeType = filter.id"
            >
              {{ filter.label }} <span>{{ String(filter.count).padStart(2, '0') }}</span>
            </button>
          </div>
          <span class="timeline-filters__count mono">
            {{ String(filteredEntries.length).padStart(2, '0') }} VISIBLE
          </span>
        </div>

        <TimelineList v-if="filteredEntries.length" :entries="filteredEntries" />

        <EmptyState
          v-else
          code="CHRONICLE / EMPTY"
          title="这个筛选下没有记录"
          description="切换其他类型，或者先添加新的文章和项目记录。"
        >
          <button type="button" class="btn btn--compact" @click="activeType = 'all'">
            SHOW ALL
          </button>
        </EmptyState>

        <p class="timeline-note mono">
          SOURCE / 文章日期 + 项目记录 + src/data/milestones.js · 自动聚合排序
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.timeline-section {
  padding-top: clamp(32px, 5vw, 52px);
}

.timeline-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-bottom: clamp(32px, 5vw, 48px);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.timeline-filters__options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.timeline-filters__count {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.filter-chip span {
  color: var(--text-muted);
  font-size: 8px;
}

.filter-chip:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.filter-chip.is-active {
  border-color: var(--accent-line);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.filter-chip.is-active span {
  color: var(--accent-ink);
}

.timeline-note {
  margin-top: 32px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.06em;
}

@media (max-width: 600px) {
  .timeline-filters__count {
    width: 100%;
    margin-left: 0;
  }
}
</style>
