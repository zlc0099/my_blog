<script setup>
import ProjectGlyph from './ProjectGlyph.vue';

defineProps({
  project: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'standard',
  },
});
</script>

<template>
  <article class="project-card" :class="`project-card--${variant}`">
    <RouterLink
      :to="`/projects/${project.slug}`"
      class="project-card__cover"
      :aria-label="`查看项目：${project.title}`"
    >
      <ProjectGlyph :seed="project.slug" />
      <span class="project-card__cover-code mono">{{ project.archiveCode }}</span>
      <span class="project-card__cover-status mono">{{ project.status }}</span>
      <span class="project-card__cover-index mono" aria-hidden="true">
        {{ project.period }}
      </span>
    </RouterLink>

    <div class="project-card__body">
      <div class="project-card__meta">
        <span class="eyebrow">{{ project.period }} / {{ project.status }}</span>
        <span v-if="project.featured" class="badge">FEATURED</span>
      </div>

      <h3 class="project-card__title">
        <RouterLink :to="`/projects/${project.slug}`">{{ project.title }}</RouterLink>
      </h3>
      <p class="project-card__summary">{{ project.summary }}</p>

      <ul v-if="project.stack.length" class="project-card__stack">
        <li v-for="(tech, index) in project.stack" :key="tech">
          {{ tech }}<span v-if="index < project.stack.length - 1">/</span>
        </li>
      </ul>

      <div class="project-card__foot">
        <RouterLink :to="`/projects/${project.slug}`" class="project-card__link">
          VIEW RECORD <span aria-hidden="true">→</span>
        </RouterLink>
        <div class="project-card__external">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开线上演示"
          >
            LIVE ↗
          </a>
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开仓库"
          >
            REPO ↗
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  transition: border-color var(--dur-base) var(--ease-out);
}

.project-card:hover {
  border-color: var(--border-strong);
}

.project-card__cover {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.project-card__cover .project-glyph {
  position: absolute;
  inset: 0;
}

.project-card:hover .project-glyph {
  transform: scale(1.02);
}

.project-card__cover-code,
.project-card__cover-status,
.project-card__cover-index {
  position: absolute;
  z-index: 1;
  color: var(--text-secondary);
  font-size: 8.5px;
  letter-spacing: 0.1em;
}

.project-card__cover-code {
  top: 16px;
  left: 18px;
  color: var(--text-primary);
}

.project-card__cover-status {
  top: 16px;
  right: 18px;
  padding: 3px 6px;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

.project-card__cover-index {
  right: 18px;
  bottom: 14px;
  color: var(--text-muted);
}

.project-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
}

.project-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-card__title {
  margin-top: 12px;
  font-size: clamp(22px, 2.2vw, 27px);
  font-weight: 600;
  line-height: 1.3;
}

.project-card__title a:hover {
  color: var(--accent-ink);
}

.project-card__summary {
  margin-top: 9px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
  list-style: none;
  padding: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
}

.project-card__stack span {
  margin-left: 6px;
  color: var(--border-strong);
}

.project-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
}

.project-card__link {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
}

.project-card__link:hover {
  color: var(--accent-ink);
}

.project-card__link span {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease-out);
}

.project-card__link:hover span {
  transform: translateX(3px);
}

.project-card__external {
  display: flex;
  gap: 12px;
}

.project-card__external a {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.06em;
  transition: color var(--dur-fast) var(--ease-out);
}

.project-card__external a:hover {
  color: var(--accent-ink);
}

.project-card--featured .project-card__cover {
  aspect-ratio: 16 / 7.6;
}

.project-card--featured .project-card__body {
  padding: clamp(24px, 3vw, 34px);
}

.project-card--featured .project-card__title {
  font-size: clamp(28px, 3.2vw, 38px);
}

.project-card--featured .project-card__summary {
  max-width: 720px;
  font-size: 14px;
}

.project-card--compact {
  display: grid;
  grid-template-columns: 40% minmax(0, 1fr);
  height: 100%;
}

.project-card--compact .project-card__cover {
  height: 100%;
  min-height: 220px;
  aspect-ratio: auto;
  border-right: 1px solid var(--border-subtle);
  border-bottom: 0;
}

.project-card--compact .project-card__body {
  padding: 22px;
}

.project-card--compact .project-card__title {
  font-size: 20px;
}

.project-card--compact .project-card__summary {
  -webkit-line-clamp: 2;
  font-size: 12.5px;
}

.project-card--compact .project-card__stack {
  margin-top: 12px;
}

.project-card--compact .project-card__foot {
  padding-top: 16px;
}

@media (max-width: 760px) {
  .project-card--compact {
    grid-template-columns: 1fr;
  }

  .project-card--compact .project-card__cover {
    min-height: 0;
    aspect-ratio: 16 / 7;
    border-right: 0;
    border-bottom: 1px solid var(--border-subtle);
  }
}
</style>
