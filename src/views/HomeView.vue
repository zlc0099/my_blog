<script setup>
import { computed } from 'vue';
import HeroSection from '@/components/home/HeroSection.vue';
import DomainGrid from '@/components/home/DomainGrid.vue';
import LabTeaser from '@/components/home/LabTeaser.vue';
import FocusList from '@/components/home/FocusList.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import ArchiveRow from '@/components/post/ArchiveRow.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import TimelineList from '@/components/timeline/TimelineList.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { posts, projects } from '@/lib/content';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  description: `${site.intro} 包含学习档案、项目记录、Agent 作业与 Token 账本。`,
});

const recentPosts = computed(() => posts.slice(0, 4));
const featuredProject = computed(() => projects.find((project) => project.featured) || projects[0] || null);
const sideProjects = computed(() =>
  projects.filter((project) => project.slug !== featuredProject.value?.slug).slice(0, 2),
);
</script>

<template>
  <div>
    <HeroSection />

    <section class="section home-recent">
      <div class="container">
        <SectionHeading
          index="01"
          title="RECENT ENTRIES"
          zh="最近记录"
          action-to="/posts"
          action-label="ALL ENTRIES"
        />
        <div v-if="recentPosts.length" class="archive-list">
          <ArchiveRow v-for="post in recentPosts" :key="post.slug" :post="post" />
        </div>
        <EmptyState
          v-else
          code="ARCHIVE / EMPTY"
          title="档案还没有内容"
          description="第一篇学习记录正在整理中。"
        >
          <RouterLink to="/posts" class="btn btn--compact">浏览档案</RouterLink>
        </EmptyState>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="02"
          title="KNOWLEDGE DOMAINS"
          zh="学习领域"
          action-to="/posts"
          action-label="BROWSE ARCHIVE"
        />
        <DomainGrid />
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="03"
          title="AGENT OPERATIONS"
          zh="作业与资源账本"
          action-to="/lab"
          action-label="OPEN AI LAB"
        />
        <LabTeaser />
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="04"
          title="CURRENT FOCUS"
          zh="当前专注"
          action-to="/about"
          action-label="ABOUT ME"
        />
        <FocusList />
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="05"
          title="SELECTED PROJECTS"
          zh="精选项目"
          action-to="/projects"
          action-label="ALL PROJECTS"
        />

        <div v-if="featuredProject" class="home-projects">
          <ProjectCard :project="featuredProject" variant="featured" />
          <div v-if="sideProjects.length" class="home-projects__side">
            <ProjectCard
              v-for="project in sideProjects"
              :key="project.slug"
              :project="project"
              variant="compact"
            />
          </div>
        </div>

        <EmptyState
          v-else
          code="OPERATIONS / EMPTY"
          title="还没有项目记录"
          description="项目完成后会在这里留下实现过程与复盘。"
        >
          <RouterLink to="/projects" class="btn btn--compact">查看项目页</RouterLink>
        </EmptyState>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="06"
          title="LEARNING TIMELINE"
          zh="学习时间线"
          action-to="/timeline"
          action-label="FULL TIMELINE"
        />
        <TimelineList :limit="6" compact />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-recent {
  padding-top: clamp(56px, 7vw, 88px);
}

.archive-list {
  border-top: 1px solid var(--border-subtle);
}

.home-projects {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.85fr);
  gap: 14px;
  align-items: stretch;
}

.home-projects__side {
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  gap: 14px;
}

@media (max-width: 960px) {
  .home-projects {
    grid-template-columns: 1fr;
  }

  .home-projects__side {
    grid-auto-rows: auto;
  }
}
</style>
