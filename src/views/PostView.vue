<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NotFoundView from '@/views/NotFoundView.vue';
import MarkdownBody from '@/components/post/MarkdownBody.vue';
import RelatedPrompts from '@/components/post/RelatedPrompts.vue';
import TocSidebar from '@/components/post/TocSidebar.vue';
import ReadingProgress from '@/components/post/ReadingProgress.vue';
import TagChip from '@/components/ui/TagChip.vue';
import { site } from '@/data/site';
import {
  getAdjacentPosts,
  getPostBySlug,
  getProjectBySlug,
  getRelatedPosts,
} from '@/lib/content';
import { formatDate } from '@/lib/format';
import { renderMarkdown } from '@/lib/markdown';
import { usePageMeta } from '@/composables/usePageMeta';

const route = useRoute();

const post = computed(() => getPostBySlug(String(route.params.slug)));
const rendered = computed(() =>
  post.value ? renderMarkdown(post.value.body) : { html: '', headings: [] },
);
const adjacent = computed(() =>
  post.value ? getAdjacentPosts(post.value) : { newer: null, older: null },
);
const related = computed(() => (post.value ? getRelatedPosts(post.value) : []));
const relatedProject = computed(() =>
  post.value?.project ? getProjectBySlug(post.value.project) : null,
);

usePageMeta(() =>
  post.value
    ? { title: post.value.title, description: post.value.summary }
    : { title: '404 / FILE NOT FOUND', description: '请求的档案不存在。' },
);
</script>

<template>
  <NotFoundView v-if="!post" />
  <article v-else class="post-page">
    <ReadingProgress />

    <header class="post-header">
      <div class="post-header__field" aria-hidden="true"></div>
      <div class="container">
        <RouterLink to="/posts" class="post-back mono">← BACK TO ARCHIVE</RouterLink>

        <div class="post-header__grid">
          <div class="post-header__main">
            <div class="post-meta mono">
              <RouterLink :to="`/categories/${post.category}`" class="post-meta__category">
                {{ post.categoryInfo.en }}
                <template v-if="post.categoryInfo.zh.toLowerCase() !== post.categoryInfo.en.toLowerCase()">
                  / {{ post.categoryInfo.zh }}
                </template>
              </RouterLink>
              <span class="post-meta__sep">/</span>
              <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              <template v-if="post.updated !== post.date">
                <span class="post-meta__sep">/</span>
                <span>UPDATED {{ formatDate(post.updated) }}</span>
              </template>
              <span class="post-meta__sep">/</span>
              <span>{{ post.readingTime }} MIN READ</span>
              <span v-if="post.sample" class="badge" title="示例内容，可替换为真实记录">SAMPLE</span>
            </div>

            <h1 class="post-title">{{ post.title }}</h1>
            <p class="post-summary">{{ post.summary }}</p>

            <ul v-if="post.tags.length" class="tag-list post-tags">
              <li v-for="tag in post.tags" :key="tag">
                <TagChip :tag="tag" />
              </li>
            </ul>
          </div>

          <div class="post-header__side" aria-hidden="true">
            <span class="post-header__code">{{ post.archiveCode }}</span>
            <span class="post-header__side-label mono">FILE / ENTRY</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container post-layout">
      <div class="post-content">
        <details v-if="rendered.headings.length" class="toc-mobile">
          <summary>
            <span class="eyebrow">TABLE OF CONTENTS / 目录</span>
            <span class="mono toc-mobile__count">
              {{ String(rendered.headings.length).padStart(2, '0') }} SECTIONS +
            </span>
          </summary>
          <nav aria-label="移动端文章目录">
            <a
              v-for="(heading, index) in rendered.headings"
              :key="heading.id"
              :href="`#${heading.id}`"
              :class="`toc-mobile__link toc-mobile__link--h${heading.level}`"
            >
              <span class="mono">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ heading.text }}
            </a>
          </nav>
        </details>

        <a
          v-if="post.repoPath"
          :href="`${site.repo}/tree/main/${post.repoPath}`"
          class="post-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="eyebrow">GITHUB / 源码</span>
          <strong>完整源码在 GitHub：{{ post.repoPath }} ↗</strong>
        </a>

        <MarkdownBody :html="rendered.html" />

        <RelatedPrompts v-if="post.prompts.length" :ids="post.prompts" />

        <RouterLink
          v-if="relatedProject"
          :to="`/projects/${relatedProject.slug}`"
          class="post-project"
        >
          <span class="eyebrow">RELATED OPERATION</span>
          <strong>{{ relatedProject.title }}</strong>
          <span class="mono">{{ relatedProject.archiveCode }} →</span>
        </RouterLink>

        <footer class="post-footer">
          <div>
            <span class="eyebrow">TAGGED AS / 标签</span>
            <ul v-if="post.tags.length" class="tag-list post-footer__tags">
              <li v-for="tag in post.tags" :key="tag">
                <TagChip :tag="tag" />
              </li>
            </ul>
          </div>
          <span class="post-footer__end mono">END OF FILE / {{ post.archiveCode }}</span>
        </footer>

        <nav class="post-pagination" aria-label="文章导航">
          <RouterLink
            v-if="adjacent.older"
            :to="`/posts/${adjacent.older.slug}`"
            class="post-pagination__item"
          >
            <span class="post-pagination__label mono">PREVIOUS / 上一篇</span>
            <strong>{{ adjacent.older.title }}</strong>
            <span class="post-pagination__date mono">{{ formatDate(adjacent.older.date) }}</span>
          </RouterLink>
          <span v-else class="post-pagination__placeholder mono">ARCHIVE / START</span>

          <RouterLink
            v-if="adjacent.newer"
            :to="`/posts/${adjacent.newer.slug}`"
            class="post-pagination__item post-pagination__item--next"
          >
            <span class="post-pagination__label mono">NEXT / 下一篇</span>
            <strong>{{ adjacent.newer.title }}</strong>
            <span class="post-pagination__date mono">{{ formatDate(adjacent.newer.date) }}</span>
          </RouterLink>
          <span v-else class="post-pagination__placeholder mono">END OF ARCHIVE</span>
        </nav>

        <section v-if="related.length" class="post-related">
          <div class="post-related__head">
            <span class="eyebrow">RELATED NOTES / 相关笔记</span>
            <RouterLink to="/posts" class="mono post-related__all">ALL NOTES →</RouterLink>
          </div>
          <div class="post-related__list">
            <RouterLink
              v-for="item in related"
              :key="item.slug"
              :to="`/posts/${item.slug}`"
              class="post-related__item"
            >
              <span class="post-related__code mono">{{ item.archiveCode }}</span>
              <span class="post-related__title">{{ item.title }}</span>
              <span class="post-related__category mono">{{ item.categoryInfo.zh }}</span>
              <span class="post-related__arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </section>
      </div>

      <TocSidebar v-if="rendered.headings.length" :headings="rendered.headings" />
    </div>
  </article>
</template>

<style scoped>
.post-page {
  position: relative;
}

.post-header {
  position: relative;
  padding-block: 30px clamp(36px, 5vw, 52px);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.post-header__field {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(to right, transparent 20%, #000 70%, #000 100%);
  pointer-events: none;
}

.post-back {
  position: relative;
  display: inline-block;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  transition: color var(--dur-fast) var(--ease-out);
}

.post-back:hover {
  color: var(--accent-ink);
}

.post-header__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 40px;
  margin-top: 32px;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post-meta__category {
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}

.post-meta__category:hover {
  color: var(--accent-ink);
}

.post-meta__sep {
  color: var(--border-strong);
}

.post-title {
  max-width: 920px;
  margin-top: 18px;
  color: var(--text-primary);
  font-size: clamp(32px, 4.4vw, 54px);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.16;
}

.post-summary {
  max-width: 780px;
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.9;
}

.post-tags {
  margin-top: 20px;
}

.post-header__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  padding-bottom: 6px;
}

.post-header__code {
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(40px, 4.4vw, 60px);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 0.9;
  -webkit-text-stroke: 1px var(--border-strong);
}

.post-header__side-label {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.14em;
}

.post-layout {
  display: grid;
  grid-template-columns: minmax(0, var(--article-width)) var(--sidebar-width);
  justify-content: space-between;
  gap: clamp(32px, 5vw, 72px);
  padding-block: clamp(40px, 6vw, 64px) clamp(48px, 7vw, 80px);
  align-items: start;
}

.post-content {
  min-width: 0;
}

.toc-mobile {
  display: none;
  margin-bottom: 28px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.toc-mobile summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
}

.toc-mobile summary::-webkit-details-marker {
  display: none;
}

.toc-mobile__count {
  color: var(--text-muted);
  font-size: 10px;
}

.toc-mobile nav {
  display: flex;
  flex-direction: column;
  padding: 4px 16px 14px;
  border-top: 1px solid var(--border-subtle);
}

.toc-mobile__link {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
  border-bottom: 1px solid var(--border-subtle);
}

.toc-mobile__link:last-child {
  border-bottom: 0;
}

.toc-mobile__link span {
  margin-right: 8px;
  color: var(--text-muted);
  font-size: 10px;
}

.toc-mobile__link--h3 {
  padding-left: 16px;
  font-size: 12px;
}

.toc-mobile__link--h4 {
  padding-left: 32px;
  font-size: 11.5px;
}

.post-repo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
  padding: 16px 18px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent);
  background: var(--bg-secondary);
  transition: border-color var(--dur-base) var(--ease-out);
}

.post-repo:hover {
  border-color: var(--border-strong);
  border-left-color: var(--accent);
}

.post-repo strong {
  color: var(--text-primary);
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.post-project {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
  padding: 16px 18px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent);
  background: var(--bg-secondary);
  transition: border-color var(--dur-base) var(--ease-out);
}

.post-project:hover {
  border-color: var(--border-strong);
  border-left-color: var(--accent);
}

.post-project strong {
  font-size: 15px;
  font-weight: 500;
}

.post-project .mono {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
}

.post-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 56px;
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
}

.post-footer__tags {
  margin-top: 10px;
}

.post-footer__end {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.post-pagination {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 36px;
}

.post-pagination__item,
.post-pagination__placeholder {
  display: flex;
  min-height: 108px;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border: 1px solid var(--border-subtle);
}

.post-pagination__item {
  transition: border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-out);
}

.post-pagination__item:hover {
  border-color: var(--border-strong);
  background: var(--bg-secondary);
}

.post-pagination__item--next {
  align-items: flex-end;
  text-align: right;
}

.post-pagination__label {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.post-pagination__item strong {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.post-pagination__item:hover strong {
  color: var(--accent-ink);
}

.post-pagination__date {
  margin-top: auto;
  color: var(--text-muted);
  font-size: 10px;
}

.post-pagination__placeholder {
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  border-style: dashed;
}

.post-related {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}

.post-related__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.post-related__all {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.post-related__all:hover {
  color: var(--accent-ink);
}

.post-related__list {
  margin-top: 12px;
}

.post-related__item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto 16px;
  gap: 14px;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.post-related__code {
  color: var(--text-muted);
  font-size: 10px;
}

.post-related__title {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.post-related__item:hover .post-related__title {
  color: var(--accent-ink);
}

.post-related__category {
  color: var(--text-muted);
  font-size: 10px;
}

.post-related__arrow {
  color: var(--text-muted);
  font-size: 13px;
  transition: transform var(--dur-base) var(--ease-out);
}

.post-related__item:hover .post-related__arrow {
  color: var(--accent-ink);
  transform: translateX(2px);
}

@media (max-width: 1100px) {
  .post-layout {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
  }

  .post-content {
    width: 100%;
    max-width: var(--article-width);
    margin-inline: auto;
  }

  .toc-mobile {
    display: block;
  }
}

@media (max-width: 720px) {
  .post-header {
    padding-block: 24px 32px;
  }

  .post-header__grid {
    grid-template-columns: 1fr;
    gap: 0;
    margin-top: 24px;
  }

  .post-header__side {
    display: none;
  }

  .post-title {
    font-size: 30px;
    line-height: 1.22;
  }

  .post-summary {
    font-size: 14px;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .post-pagination {
    grid-template-columns: 1fr;
  }

  .post-pagination__item--next {
    align-items: flex-start;
    text-align: left;
  }

  .post-related__item {
    grid-template-columns: 60px minmax(0, 1fr) 14px;
    gap: 10px;
  }

  .post-related__category {
    display: none;
  }
}
</style>
