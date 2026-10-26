<script setup>
import { computed } from 'vue';
import { getTimelineEntries } from '@/lib/content';
import { formatDateShort } from '@/lib/format';

const props = defineProps({
  entries: {
    type: Array,
    default: null,
  },
  limit: {
    type: Number,
    default: 0,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const typeLabels = {
  post: 'LOG / 文章',
  project: 'OPS / 项目',
  milestone: 'EVT / 里程碑',
};

const groups = computed(() => {
  const all = props.entries || getTimelineEntries();
  const visible = props.limit ? all.slice(0, props.limit) : all;
  const map = new Map();
  visible.forEach((entry) => {
    const year = String(entry.date).slice(0, 4);
    if (!map.has(year)) map.set(year, []);
    map.get(year).push(entry);
  });
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, entries]) => ({ year, entries }));
});
</script>

<template>
  <div class="timeline" :class="{ 'timeline--compact': compact }">
    <section v-for="group in groups" :key="group.year" class="timeline__year">
      <div class="timeline__year-label">
        <span class="timeline__year-number">{{ group.year }}</span>
        <span class="timeline__year-count mono">{{ String(group.entries.length).padStart(2, '0') }} ENTRIES</span>
      </div>

      <ol class="timeline__entries">
        <li v-for="entry in group.entries" :key="`${entry.type}-${entry.code}-${entry.title}`">
          <span
            class="timeline__marker"
            :class="`timeline__marker--${entry.type}`"
            aria-hidden="true"
          ></span>
          <time class="timeline__date mono" :datetime="entry.date">{{ formatDateShort(entry.date) }}</time>
          <div class="timeline__body">
            <div class="eyebrow timeline__meta">
              <span>{{ entry.code }}</span>
              <span class="timeline__sep">/</span>
              <span>{{ typeLabels[entry.type] }}</span>
            </div>
            <RouterLink v-if="entry.to" :to="entry.to" class="timeline__title">
              {{ entry.title }}
            </RouterLink>
            <h3 v-else class="timeline__title">{{ entry.title }}</h3>
            <p>{{ entry.summary }}</p>
          </div>
          <span class="timeline__type mono">{{ entry.meta }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.timeline__year {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  padding-bottom: clamp(36px, 5vw, 56px);
}

.timeline__year:last-child {
  padding-bottom: 0;
}

.timeline__year-label {
  padding-top: 2px;
}

.timeline__year-number {
  display: block;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(54px, 6vw, 76px);
  font-weight: 600;
  line-height: 0.85;
  letter-spacing: 0.01em;
}

.timeline__year-count {
  display: block;
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.14em;
}

.timeline__entries {
  margin-left: 5px;
  padding: 0;
  border-left: 1px solid var(--border-primary);
  list-style: none;
}

.timeline__entries li {
  position: relative;
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) auto;
  gap: 18px;
  padding: 0 0 28px 26px;
}

.timeline__entries li:last-child {
  padding-bottom: 0;
}

.timeline__marker {
  position: absolute;
  top: 4px;
  left: -4px;
  width: 7px;
  height: 7px;
  background: var(--accent);
}

.timeline__marker--project {
  background: transparent;
  border: 1px solid var(--accent);
}

.timeline__marker--milestone {
  background: var(--bg-primary);
  border: 1px solid var(--text-secondary);
  transform: rotate(45deg);
}

.timeline__date {
  padding-top: 2px;
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.timeline__meta {
  font-size: 8px;
}

.timeline__sep {
  color: var(--border-strong);
}

.timeline__title {
  display: block;
  margin-top: 6px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.45;
}

a.timeline__title:hover {
  color: var(--accent-ink);
}

.timeline__body p {
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.75;
}

.timeline__type {
  padding-top: 2px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.timeline--compact .timeline__year {
  grid-template-columns: 112px minmax(0, 1fr);
  padding-bottom: 32px;
}

.timeline--compact .timeline__year-number {
  font-size: 48px;
}

.timeline--compact .timeline__entries li {
  padding-bottom: 20px;
}

.timeline--compact .timeline__title {
  font-size: 15.5px;
}

.timeline--compact .timeline__body p {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 760px) {
  .timeline__year,
  .timeline--compact .timeline__year {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .timeline__year-label {
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  .timeline__year-number,
  .timeline--compact .timeline__year-number {
    font-size: 44px;
  }

  .timeline__year-count {
    margin-top: 0;
  }

  .timeline__entries {
    margin-left: 4px;
  }

  .timeline__entries li {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    padding-left: 22px;
  }

  .timeline__date {
    padding-top: 0;
  }

  .timeline__meta {
    margin-top: 2px;
  }

  .timeline__type {
    display: none;
  }

  .timeline--compact .timeline__body p {
    -webkit-line-clamp: 2;
  }
}
</style>
