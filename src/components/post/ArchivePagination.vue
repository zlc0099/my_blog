<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:page']);

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.page;
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({ key: `p-${index + 1}`, page: index + 1 }));
  }

  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result = [];
  wanted.forEach((page, index) => {
    if (index > 0 && page - wanted[index - 1] > 1) {
      result.push({ key: `gap-${page}`, gap: true });
    }
    result.push({ key: `p-${page}`, page });
  });
  return result;
});

function pad(value) {
  return String(value).padStart(2, '0');
}
</script>

<template>
  <nav v-if="totalPages > 1" class="archive-pagination" aria-label="档案分页">
    <span class="archive-pagination__meta mono">{{ total }} FILES / {{ pad(totalPages) }} PAGES</span>

    <div class="archive-pagination__controls">
      <button
        type="button"
        class="archive-pagination__step"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        ← PREV
      </button>

      <template v-for="item in pages" :key="item.key">
        <span v-if="item.gap" class="archive-pagination__gap mono" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="archive-pagination__page"
          :class="{ 'is-active': item.page === page }"
          :aria-current="item.page === page ? 'page' : undefined"
          :aria-label="`第 ${item.page} 页`"
          @click="emit('update:page', item.page)"
        >
          {{ pad(item.page) }}
        </button>
      </template>

      <button
        type="button"
        class="archive-pagination__step"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        NEXT →
      </button>
    </div>

    <span class="archive-pagination__current mono">PAGE {{ pad(page) }} / {{ pad(totalPages) }}</span>
  </nav>
</template>

<style scoped>
.archive-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 34px;
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
}

.archive-pagination__meta,
.archive-pagination__current {
  color: var(--text-muted);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.archive-pagination__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
}

.archive-pagination__step,
.archive-pagination__page {
  height: 30px;
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.05em;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.archive-pagination__step {
  padding: 0 10px;
}

.archive-pagination__page {
  min-width: 30px;
  padding: 0 7px;
}

.archive-pagination__step:hover:not(:disabled),
.archive-pagination__page:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.archive-pagination__page.is-active {
  border-color: var(--accent-line);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.archive-pagination__step:disabled {
  color: var(--text-muted);
  opacity: 0.42;
  cursor: not-allowed;
}

.archive-pagination__gap {
  padding: 0 2px;
  color: var(--text-muted);
  font-size: 10px;
}

@media (max-width: 720px) {
  .archive-pagination {
    flex-direction: column;
    gap: 12px;
  }

  .archive-pagination__meta,
  .archive-pagination__current {
    order: 2;
    text-align: center;
  }

  .archive-pagination__controls {
    order: 1;
  }
}
</style>
