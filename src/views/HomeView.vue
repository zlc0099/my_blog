<script setup>
import HeroSection from '@/components/home/HeroSection.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  description: site.projectIntro,
});

const modules = [
  { no: '01', zh: '学习记录', to: '/categories/notes' },
  { no: '02', zh: 'Skill', to: '/categories/skill' },
  { no: '03', zh: '前端提示词', to: '/categories/frontend-prompts' },
  { no: '04', zh: '后端提示词', to: '/categories/backend-prompts' },
  { no: '05', zh: 'AI 分工', to: '/categories/ai-division' },
  { no: '06', zh: '碎碎念', to: '/categories/musings' },
  { no: '07', zh: '项目记录', to: '/projects' },
  { no: '08', zh: 'AI LAB', to: '/lab' },
  { no: '09', zh: '关于我', to: '/about' },
];
</script>

<template>
  <div>
    <HeroSection />

    <section id="brief" class="section home-brief">
      <div class="container">
        <div class="brief-grid">
          <div class="brief-left">
            <h2>平时学点东西，<br />顺手记下来。</h2>
          </div>

          <div class="brief-right">
            <p class="brief-right__lead">
              我是 zlc0099，后端写得比前端多一点，主要用 Java / Spring Boot，也会用 Vue 做页面。
            </p>
            <p>
              这个站是我自己用的学习记录。学到的东西、踩过的坑、项目做到哪一步，都会往这里记一笔；用 Claude Code、Qoder、Trae 写代码时的 Token 消耗也顺手记下。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="01" title="目录" />

        <nav class="module-index" aria-label="站内索引">
          <RouterLink v-for="item in modules" :key="item.to" :to="item.to">
            <span class="module-index__no mono">{{ item.no }}</span>
            <span class="module-index__zh">{{ item.zh }}</span>
            <span class="module-index__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-brief {
  padding-top: clamp(56px, 7vw, 88px);
}

.brief-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(36px, 6vw, 96px);
  align-items: start;
}

.brief-left h2 {
  max-width: 540px;
  margin-top: 24px;
  color: var(--text-primary);
  font-size: clamp(32px, 4.2vw, 50px);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.brief-right__lead {
  color: var(--text-primary);
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.85;
}

.brief-right > p:not(.brief-right__lead) {
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.95;
}

.module-index {
  border-top: 1px solid var(--border-subtle);
}

.module-index a {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 24px;
  gap: 18px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.module-index a:hover {
  background: var(--bg-secondary);
  box-shadow: inset 2px 0 0 var(--accent);
}

.module-index__no {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.module-index__zh {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.module-index__arrow {
  color: var(--text-muted);
  font-size: 17px;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.module-index a:hover .module-index__arrow {
  color: var(--accent-ink);
  transform: translateX(3px);
}

@media (max-width: 960px) {
  .brief-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .module-index a {
    grid-template-columns: 34px minmax(0, 1fr) 20px;
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .module-index a {
    grid-template-columns: 26px minmax(0, 1fr) 18px;
    gap: 10px;
    padding: 15px 0;
  }

  .module-index__no {
    align-self: start;
    padding-top: 4px;
  }

  .module-index__zh {
    font-size: 17px;
  }
}
</style>
