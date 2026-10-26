<script setup>
import TagChip from '@/components/ui/TagChip.vue';
import { formatDate } from '@/lib/format';

defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article class="archive-row">
    <div class="archive-row__side">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      <span class="archive-row__code">{{ post.archiveCode }}</span>
      <span v-if="post.sample" class="badge archive-row__badge">SAMPLE</span>
    </div>

    <div class="archive-row__main">
      <div class="archive-row__meta">
        <RouterLink :to="`/categories/${post.category}`" class="archive-row__category">
          {{ post.categoryInfo.en }} / {{ post.categoryInfo.zh }}
        </RouterLink>
        <span class="archive-row__sep">·</span>
        <span :title="'按正文字数估算'">{{ post.readingTime }} MIN READ</span>
      </div>

      <h3 class="archive-row__title">
        <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
      </h3>

      <p class="archive-row__summary">{{ post.summary }}</p>

      <ul v-if="post.tags.length" class="tag-list archive-row__tags">
        <li v-for="tag in post.tags" :key="tag">
          <TagChip :tag="tag" />
        </li>
      </ul>
    </div>

    <div class="archive-row__aside">
      <span class="archive-row__read">READ</span>
      <RouterLink :to="`/posts/${post.slug}`" class="archive-row__arrow" :aria-label="`阅读：${post.title}`">
        →
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.archive-row {
  position: relative;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) 42px;
  gap: clamp(18px, 3vw, 34px);
  margin-inline: -16px;
  padding: 26px 16px;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-base) var(--ease-out);
}

.archive-row::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: 14px;
  left: 0;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--dur-base) var(--ease-out);
}

.archive-row:hover {
  background: var(--bg-secondary);
}

.archive-row:hover::before {
  transform: scaleY(1);
}

.archive-row__side {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 18px;
  border-right: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
}

.archive-row__side time {
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.archive-row__code {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.archive-row__badge {
  align-self: flex-start;
  margin-top: 4px;
}

.archive-row__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.archive-row__category {
  position: relative;
  z-index: 2;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-row__category:hover {
  color: var(--accent-ink);
}

.archive-row__sep {
  color: var(--border-strong);
}

.archive-row__title {
  margin-top: 9px;
  font-size: clamp(20px, 2.1vw, 26px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.archive-row__title a {
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-row__title a::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}

.archive-row__title a:hover {
  color: var(--accent-ink);
}

.archive-row__summary {
  max-width: 680px;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.75;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.archive-row__tags {
  position: relative;
  z-index: 2;
  margin-top: 13px;
}

.archive-row__aside {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 4px;
}

.archive-row__read {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  writing-mode: vertical-rl;
}

.archive-row__arrow {
  position: relative;
  z-index: 2;
  color: var(--text-muted);
  font-size: 22px;
  line-height: 1;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.archive-row:hover .archive-row__arrow {
  color: var(--accent-ink);
  transform: translate(2px, -2px);
}

@media (max-width: 900px) {
  .archive-row {
    grid-template-columns: 108px minmax(0, 1fr) 34px;
    gap: 20px;
  }

  .archive-row__side {
    padding-right: 14px;
  }
}

@media (max-width: 720px) {
  .archive-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    margin-inline: -8px;
    padding: 22px 8px;
  }

  .archive-row__side {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 0;
    border-right: 0;
  }

  .archive-row__badge {
    margin-top: 0;
  }

  .archive-row__title {
    font-size: 20px;
  }

  .archive-row__summary {
    -webkit-line-clamp: 3;
  }

  .archive-row__aside {
    display: none;
  }
}
</style>
