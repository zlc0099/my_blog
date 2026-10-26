<script setup>
import { computed } from 'vue';
import PageHero from '@/components/ui/PageHero.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { latestUpdate, projects } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'PROJECT RECORDS / 项目记录',
  description: '实际开发项目的目标、实现过程、关键问题与复盘。',
});

const onlineCount = computed(
  () => projects.filter((project) => project.status === '已上线').length,
);

const heroMeta = computed(() => [
  { label: 'OPERATIONS', value: String(projects.length).padStart(2, '0') },
  { label: 'ONLINE', value: String(onlineCount.value).padStart(2, '0') },
  { label: 'UPDATED', value: formatDate(latestUpdate) },
]);
</script>

<template>
  <div>
    <PageHero
      eyebrow="OPERATIONS / PROJECTS"
      title="PROJECT RECORDS"
      zh="项目记录"
      description="不只是结果截图，而是项目的目标、实现过程、关键问题与复盘。所有外链均为真实地址。"
      serial="OPERATIONS / INDEX"
      :meta="heroMeta"
    />

    <section class="section projects-section">
      <div class="container">
        <div class="projects-summary">
          <span class="eyebrow">IMPLEMENTATION LOG / 实现记录</span>
          <p class="mono">ONLINE {{ String(onlineCount).padStart(2, '0') }} / TOTAL {{ String(projects.length).padStart(2, '0') }}</p>
        </div>

        <div v-if="projects.length" class="projects-grid">
          <div
            v-for="(project, index) in projects"
            :key="project.slug"
            class="projects-grid__slot"
            :class="{ 'projects-grid__slot--wide': index === 0 }"
          >
            <ProjectCard
              :project="project"
              :variant="index === 0 ? 'featured' : 'standard'"
            />
          </div>
        </div>

        <EmptyState
          v-else
          code="OPERATIONS / EMPTY"
          title="还没有项目记录"
          description="完成项目后会在这里留下目标、实现过程和复盘。"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.projects-section {
  padding-top: clamp(32px, 5vw, 52px);
}

.projects-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.projects-summary p {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.projects-grid__slot {
  min-width: 0;
}

.projects-grid__slot--wide {
  grid-column: 1 / -1;
}

@media (max-width: 860px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid__slot--wide {
    grid-column: auto;
  }
}

@media (max-width: 560px) {
  .projects-summary {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
