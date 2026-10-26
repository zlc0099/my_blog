<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NotFoundView from '@/views/NotFoundView.vue';
import MarkdownBody from '@/components/post/MarkdownBody.vue';
import TocSidebar from '@/components/post/TocSidebar.vue';
import ProjectGlyph from '@/components/project/ProjectGlyph.vue';
import { getPostsForProject, getProjectBySlug } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { renderMarkdown } from '@/lib/markdown';
import { usePageMeta } from '@/composables/usePageMeta';

const route = useRoute();
const project = computed(() => getProjectBySlug(String(route.params.slug)));
const rendered = computed(() =>
  project.value ? renderMarkdown(project.value.body) : { html: '', headings: [] },
);
const relatedPosts = computed(() => (project.value ? getPostsForProject(project.value) : []));

usePageMeta(() =>
  project.value
    ? { title: project.value.title, description: project.value.summary }
    : { title: '404 / FILE NOT FOUND', description: '请求的项目记录不存在。' },
);
</script>

<template>
  <NotFoundView v-if="!project" />
  <article v-else class="project-page">
    <header class="project-header">
      <div class="project-header__field" aria-hidden="true"></div>
      <div class="container">
        <RouterLink to="/projects" class="project-back mono">← BACK TO OPERATIONS</RouterLink>

        <div class="project-header__grid">
          <div class="project-header__main">
            <div class="project-meta mono">
              <span>{{ project.status }}</span>
              <span class="project-meta__sep">/</span>
              <span>{{ project.period }}</span>
              <span class="project-meta__sep">/</span>
              <span>{{ project.archiveCode }}</span>
            </div>
            <h1 class="project-title">{{ project.title }}</h1>
            <p class="project-summary">{{ project.summary }}</p>

            <ul class="project-stack">
              <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
            </ul>

            <div class="project-actions">
              <a
                v-if="project.demo"
                :href="project.demo"
                class="btn btn--primary btn--compact"
                target="_blank"
                rel="noopener noreferrer"
              >
                访问线上版本 ↗
              </a>
              <a
                v-if="project.repo"
                :href="project.repo"
                class="btn btn--compact"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub 仓库 ↗
              </a>
              <span v-if="!project.demo && !project.repo" class="project-actions__none mono">
                LOCAL PROJECT / 暂无公开链接
              </span>
            </div>
          </div>

          <div class="project-header__side" aria-hidden="true">
            <span class="project-header__code">{{ project.archiveCode }}</span>
            <span class="mono">OPERATION / FILE</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container project-layout">
      <div class="project-content">
        <div class="project-cover">
          <ProjectGlyph :seed="project.slug" />
          <span class="project-cover__label mono">{{ project.archiveCode }} / BLUEPRINT</span>
        </div>

        <MarkdownBody :html="rendered.html" />

        <section v-if="relatedPosts.length" class="project-related">
          <div class="project-related__head">
            <span class="eyebrow">RELATED NOTES / 相关笔记</span>
            <span class="mono project-related__count">{{ String(relatedPosts.length).padStart(2, '0') }} FILES</span>
          </div>
          <div class="project-related__list">
            <RouterLink
              v-for="post in relatedPosts"
              :key="post.slug"
              :to="`/posts/${post.slug}`"
              class="project-related__item"
            >
              <span class="project-related__code mono">{{ post.archiveCode }}</span>
              <span class="project-related__title">{{ post.title }}</span>
              <span class="project-related__category mono">{{ post.categoryInfo.zh }}</span>
              <span class="project-related__arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </section>

        <div class="project-footer">
          <RouterLink to="/projects" class="btn btn--compact">← 返回项目列表</RouterLink>
          <span class="mono project-footer__date">RECORDED {{ formatDate(project.date) }}</span>
        </div>
      </div>

      <aside class="project-sidebar">
        <div class="project-facts">
          <div class="eyebrow project-facts__head">DOSSIER / 项目档案</div>
          <dl>
            <div>
              <dt>STATUS</dt>
              <dd>{{ project.status }}</dd>
            </div>
            <div>
              <dt>PERIOD</dt>
              <dd>{{ project.period }}</dd>
            </div>
            <div>
              <dt>FILE</dt>
              <dd>{{ project.archiveCode }}</dd>
            </div>
            <div>
              <dt>RECORDED</dt>
              <dd>{{ formatDate(project.date) }}</dd>
            </div>
          </dl>

          <div class="project-facts__stack">
            <span class="eyebrow">STACK</span>
            <ul>
              <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
            </ul>
          </div>

          <div v-if="project.repo || project.demo" class="project-facts__links">
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              LIVE SITE ↗
            </a>
            <a
              v-if="project.repo"
              :href="project.repo"
              target="_blank"
              rel="noopener noreferrer"
            >
              REPOSITORY ↗
            </a>
          </div>
        </div>

        <TocSidebar v-if="rendered.headings.length" :headings="rendered.headings" />
      </aside>
    </div>
  </article>
</template>

<style scoped>
.project-header {
  position: relative;
  padding-block: 30px clamp(36px, 5vw, 52px);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.project-header__field {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(to right, transparent 20%, #000 70%, #000 100%);
  pointer-events: none;
}

.project-back {
  position: relative;
  display: inline-block;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  transition: color var(--dur-fast) var(--ease-out);
}

.project-back:hover {
  color: var(--accent-ink);
}

.project-header__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 40px;
  margin-top: 32px;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-meta__sep {
  color: var(--border-strong);
}

.project-title {
  max-width: 900px;
  margin-top: 16px;
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.1;
}

.project-summary {
  max-width: 760px;
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.9;
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.project-stack li {
  padding: 4px 8px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
}

.project-actions__none {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.project-header__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  padding-bottom: 6px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.14em;
}

.project-header__code {
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(40px, 4.4vw, 60px);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 0.9;
  -webkit-text-stroke: 1px var(--border-strong);
}

.project-layout {
  display: grid;
  grid-template-columns: minmax(0, var(--article-width)) 260px;
  justify-content: space-between;
  gap: clamp(32px, 5vw, 64px);
  padding-block: clamp(36px, 5vw, 56px) clamp(48px, 7vw, 80px);
  align-items: start;
}

.project-content {
  min-width: 0;
}

.project-cover {
  position: relative;
  height: clamp(180px, 25vw, 280px);
  margin-bottom: 40px;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.project-cover .project-glyph {
  position: absolute;
  inset: 0;
}

.project-cover__label {
  position: absolute;
  right: 16px;
  bottom: 14px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.project-related {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}

.project-related__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-related__count {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.project-related__list {
  margin-top: 10px;
}

.project-related__item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto 16px;
  gap: 14px;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.project-related__code {
  color: var(--text-muted);
  font-size: 10px;
}

.project-related__title {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.project-related__item:hover .project-related__title {
  color: var(--accent-ink);
}

.project-related__category {
  color: var(--text-muted);
  font-size: 10px;
}

.project-related__arrow {
  color: var(--text-muted);
  font-size: 13px;
  transition: transform var(--dur-base) var(--ease-out);
}

.project-related__item:hover .project-related__arrow {
  color: var(--accent-ink);
  transform: translateX(2px);
}

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 44px;
  padding-top: 22px;
  border-top: 1px solid var(--border-subtle);
}

.project-footer__date {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.project-sidebar {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.project-facts {
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  padding: 18px;
}

.project-facts__head {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.project-facts dl {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.project-facts dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.project-facts dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.project-facts dd {
  color: var(--text-primary);
  font-size: 11.5px;
  text-align: right;
}

.project-facts__stack {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}

.project-facts__stack ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  list-style: none;
  padding: 0;
}

.project-facts__stack li {
  padding: 3px 6px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
}

.project-facts__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}

.project-facts__links a {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  transition: color var(--dur-fast) var(--ease-out);
}

.project-facts__links a:hover {
  color: var(--accent-ink);
}

@media (max-width: 1100px) {
  .project-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-content {
    width: 100%;
    max-width: var(--article-width);
    margin-inline: auto;
  }

  .project-sidebar {
    display: none;
  }
}

@media (max-width: 720px) {
  .project-header__grid {
    grid-template-columns: 1fr;
    margin-top: 24px;
  }

  .project-header__side {
    display: none;
  }

  .project-title {
    font-size: 34px;
  }

  .project-summary {
    font-size: 14px;
  }

  .project-cover {
    height: 200px;
  }

  .project-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-related__item {
    grid-template-columns: 60px minmax(0, 1fr) 14px;
    gap: 10px;
  }

  .project-related__category {
    display: none;
  }
}
</style>
