<script setup>
import StyleCover from '@/components/post/StyleCover.vue';
import DefaultCover from '@/components/post/covers/DefaultCover.vue';
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
  <article class="archive-card">
    <RouterLink
      :to="`/posts/${post.slug}`"
      class="archive-card__cover"
      :aria-label="`阅读：${post.title}`"
    >
      <StyleCover
        v-if="post.coverStyle"
        :variant="post.coverStyle"
        :label="post.coverNote || post.title"
      />
      <DefaultCover v-else :post="post" />
    </RouterLink>

    <div class="archive-card__body">
      <div class="archive-card__meta mono">
        <span class="archive-card__code">{{ post.archiveCode }}</span>
        <RouterLink :to="`/categories/${post.category}`" class="archive-card__category">
          {{ post.categoryInfo.en }}
        </RouterLink>
        <span class="archive-card__sep">/</span>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span v-if="post.sample" class="badge">SAMPLE</span>
      </div>

      <h3 class="archive-card__title">
        <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
      </h3>

      <p class="archive-card__summary">{{ post.summary }}</p>

      <div class="archive-card__foot">
        <ul v-if="post.tags.length" class="tag-list archive-card__tags">
          <li v-for="tag in post.tags.slice(0, 3)" :key="tag">
            <TagChip :tag="tag" />
          </li>
        </ul>
        <span class="archive-card__read mono">{{ post.readingTime }} MIN</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.archive-card {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  transition: transform 0.34s var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-out),
    box-shadow 0.34s var(--ease-out);
}

.archive-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  z-index: 3;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.42s var(--ease-out);
  pointer-events: none;
}

.archive-card:hover,
.archive-card:focus-within {
  z-index: 2;
  border-color: var(--accent-line);
  background: var(--bg-secondary);
  box-shadow: var(--card-hover-shadow);
  transform: translateY(-6px);
}

.archive-card:hover::before,
.archive-card:focus-within::before {
  transform: scaleX(1);
}

.archive-card__cover {
  --cover-ratio: 16 / 9.6;
  position: relative;
  display: block;
  aspect-ratio: 16 / 9.6;
  overflow: hidden;
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border-subtle);
}

.archive-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    transparent 42%,
    rgba(5, 7, 9, 0.34) 100%
  );
  opacity: 0;
  transition: opacity 0.34s var(--ease-out);
  pointer-events: none;
}

.archive-card:hover .archive-card__cover::after,
.archive-card:focus-within .archive-card__cover::after {
  opacity: 1;
}

.archive-card__cover :deep(.style-cover),
.archive-card__cover :deep(.default-cover) {
  transition: transform 0.65s var(--ease-out);
}

.archive-card:hover .archive-card__cover :deep(.style-cover),
.archive-card:hover .archive-card__cover :deep(.default-cover),
.archive-card:focus-within .archive-card__cover :deep(.style-cover),
.archive-card:focus-within .archive-card__cover :deep(.default-cover) {
  transform: scale(1.035);
}

.archive-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 15px 17px 17px;
}

.archive-card__meta {
  display: flex;
  align-items: center;
  gap: 7px;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
}

.archive-card__code {
  color: var(--accent-ink);
}

.archive-card__category {
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-card__category:hover {
  color: var(--accent-ink);
}

.archive-card__sep {
  color: var(--border-strong);
}

.archive-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 9px;
  font-size: clamp(19px, 1.6vw, 23px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.archive-card__title a {
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-card__title a:hover {
  color: var(--accent-ink);
}

.archive-card:hover .archive-card__title a,
.archive-card:focus-within .archive-card__title a {
  color: var(--accent-ink);
}

.archive-card__summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.75;
}

.archive-card__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
}

.archive-card__tags {
  gap: 5px;
  min-width: 0;
}

.archive-card__tags :deep(.tag) {
  height: 21px;
  padding: 0 6px;
  font-size: 9.5px;
}

.archive-card__read {
  flex: none;
  color: var(--text-muted);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-card:hover .archive-card__read,
.archive-card:focus-within .archive-card__read {
  color: var(--accent-ink);
}

@media (prefers-reduced-motion: reduce) {
  .archive-card,
  .archive-card__cover :deep(.style-cover),
  .archive-card__cover :deep(.default-cover),
  .archive-card::before,
  .archive-card__cover::after {
    transition: none;
  }

  .archive-card:hover,
  .archive-card:focus-within {
    transform: none;
  }

  .archive-card:hover .archive-card__cover :deep(.style-cover),
  .archive-card:hover .archive-card__cover :deep(.default-cover),
  .archive-card:focus-within .archive-card__cover :deep(.style-cover),
  .archive-card:focus-within .archive-card__cover :deep(.default-cover) {
    transform: none;
  }
}

@media (max-width: 720px) {
  .archive-card__cover {
    aspect-ratio: 16 / 9;
  }

  .archive-card__body {
    padding: 13px 14px 15px;
  }

  .archive-card__title {
    font-size: 19px;
  }
}
</style>
