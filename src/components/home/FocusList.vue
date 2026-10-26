<script setup>
import { focusItems } from '@/data/focus';
import { getPostBySlug } from '@/lib/content';
import { formatDate, padIndex } from '@/lib/format';
</script>

<template>
  <div>
    <ol class="focus-list">
      <li v-for="(item, index) in focusItems" :key="item.topic" class="focus-item">
        <div class="focus-item__head">
          <span class="focus-item__index mono">{{ padIndex(index + 1) }}</span>
          <span class="tag">{{ item.stage }}</span>
        </div>
        <h3>{{ item.topic }}</h3>
        <p>{{ item.goal }}</p>
        <div class="focus-item__foot">
          <span class="mono">UPDATED {{ formatDate(item.updated) }}</span>
          <RouterLink
            v-if="getPostBySlug(item.post)"
            :to="`/posts/${item.post}`"
            class="focus-item__link"
          >
            RELATED NOTE →
          </RouterLink>
        </div>
      </li>
    </ol>
    <p class="focus-list__note mono">
      MANUALLY MAINTAINED / 当前目标为手动维护，不做自动进度追踪。
    </p>
  </div>
</template>

<style scoped>
.focus-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--border-subtle);
  list-style: none;
  padding: 0;
}

.focus-item {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  padding: 26px 28px;
  border-right: 1px solid var(--border-subtle);
}

.focus-item:first-child {
  padding-left: 0;
}

.focus-item:last-child {
  padding-right: 0;
  border-right: 0;
}

.focus-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.focus-item__index {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.focus-item h3 {
  margin-top: 20px;
  color: var(--text-primary);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0;
}

.focus-item p {
  margin-top: 9px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

.focus-item__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.focus-item__link {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out);
}

.focus-item__link:hover {
  color: var(--accent-ink);
}

.focus-list__note {
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.08em;
}

@media (max-width: 900px) {
  .focus-list {
    grid-template-columns: 1fr;
  }

  .focus-item,
  .focus-item:first-child,
  .focus-item:last-child {
    min-height: auto;
    padding: 24px 0;
    border-right: 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .focus-item:last-child {
    border-bottom: 0;
  }

  .focus-item__foot {
    padding-top: 18px;
  }
}
</style>
