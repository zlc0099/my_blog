<script setup>
import HeroSection from '@/components/home/HeroSection.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  description: site.projectIntro,
});

const year = new Date().getFullYear();

const modules = [
  {
    no: '01',
    en: 'LEARNING LOG',
    zh: '学习记录',
    desc: '平时记的笔记和复盘。',
    to: '/categories/notes',
  },
  {
    no: '02',
    en: 'SKILL',
    zh: 'Skill',
    desc: '本地技能和 Agent 工作流。',
    to: '/categories/skill',
  },
  {
    no: '03',
    en: 'FRONTEND PROMPTS',
    zh: '前端提示词',
    desc: '页面、交互和设计系统相关提示词。',
    to: '/categories/frontend-prompts',
  },
  {
    no: '04',
    en: 'BACKEND PROMPTS',
    zh: '后端提示词',
    desc: '接口、业务和数据相关提示词。',
    to: '/categories/backend-prompts',
  },
  {
    no: '05',
    en: 'AI DIVISION',
    zh: 'AI 分工',
    desc: 'Claude Code / Qoder / Trae 的使用分工。',
    to: '/categories/ai-division',
  },
  {
    no: '06',
    en: 'MUSINGS',
    zh: '碎碎念',
    desc: '零散的想法、生活片段和随手记录。',
    to: '/categories/musings',
  },
  {
    no: '07',
    en: 'PROJECT RECORDS',
    zh: '项目记录',
    desc: '做过的项目，和当时遇到的问题。',
    to: '/projects',
  },
  {
    no: '08',
    en: 'AI LAB',
    zh: '智能体作业',
    desc: 'Agent 使用记录与 Token 账本。',
    to: '/lab',
  },
  {
    no: '09',
    en: 'ABOUT / DOSSIER',
    zh: '关于我',
    desc: '更完整一点的介绍。',
    to: '/about',
  },
];

const howRows = [
  {
    label: '前端',
    title: 'Vue 3 + Vite',
    desc: '页面、路由和 Markdown 渲染都在这个仓库里，颜色和字体用一套 CSS 变量。',
  },
  {
    label: '内容',
    title: 'Markdown 和本地 JSON',
    desc: '文章和项目是 Markdown，相关提示词挂在对应文章下方；Token 数据从本地 Claude Code 日志聚合。',
  },
  {
    label: '部署',
    title: 'GitHub Pages',
    desc: '构建后是纯静态站点，没有后端和登录。原始对话不会上传。',
  },
];
</script>

<template>
  <div>
    <HeroSection />

    <section id="brief" class="section home-brief">
      <div class="container">
        <div class="brief-grid">
          <div class="brief-left">
            <div class="eyebrow eyebrow--accent">
              <span class="eyebrow__tick"></span>
              01 / ABOUT THIS SITE
            </div>
            <h2>平时学点东西，<br />顺手记下来。</h2>
            <p class="brief-left__code mono">ZLC0099 / PERSONAL NOTES / {{ year }}</p>
          </div>

          <div class="brief-right">
            <p class="brief-right__lead">
              我是 zlc0099，后端写得比前端多一点，主要用 Java / Spring Boot，也会用 Vue 做页面。
            </p>
            <p>
              这个站是我自己用的学习记录。学到的东西、踩过的坑、项目做到哪一步，都会往这里记一笔；用 Claude Code、Qoder、Trae 写代码时的 Token 消耗也顺手记下。
            </p>
            <p>
              写得不系统，也可能很零碎，但翻起来比聊天记录方便。如果你也在折腾类似的东西，随便看看。
            </p>

            <ul class="brief-uses">
              <li>学新东西：把关键结论和踩坑记下来。</li>
              <li>做项目：留一下目标、过程和当时卡住的地方。</li>
              <li>用 Agent：记一下 Token，知道花在哪里。</li>
            </ul>

            <dl class="brief-facts">
              <div>
                <dt>称呼</dt>
                <dd>zlc0099</dd>
              </div>
              <div>
                <dt>主要写</dt>
                <dd>Java / Spring Boot / Vue</dd>
              </div>
              <div>
                <dt>常用</dt>
                <dd>Claude Code / Qoder / Trae</dd>
              </div>
              <div>
                <dt>这里放</dt>
                <dd>文章、提示词、Agent 记录</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="02" title="SITE INDEX" zh="站内有什么" />
        <p class="modules-intro">首页就说到这，具体内容在下面几个地方。</p>

        <nav class="module-index" aria-label="站内索引">
          <RouterLink v-for="item in modules" :key="item.to" :to="item.to">
            <span class="module-index__no mono">{{ item.no }}</span>
            <span class="module-index__en">{{ item.en }}</span>
            <span class="module-index__zh">{{ item.zh }}</span>
            <span class="module-index__desc">{{ item.desc }}</span>
            <span class="module-index__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </nav>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="03" title="HOW IT'S BUILT" zh="怎么做的" />

        <div class="how-list">
          <div v-for="(row, index) in howRows" :key="row.label" class="how-row">
            <span class="how-row__label mono">{{ String(index + 1).padStart(2, '0') }} / {{ row.label }}</span>
            <div>
              <h3>{{ row.title }}</h3>
              <p>{{ row.desc }}</p>
            </div>
          </div>
        </div>

        <div class="home-cta">
          <div class="home-cta__source">
            <span class="eyebrow">SOURCE / REPOSITORY</span>
            <a :href="site.repo" target="_blank" rel="noopener noreferrer">
              github.com/zlc0099/my_blog ↗
            </a>
          </div>
          <div class="home-cta__actions">
            <RouterLink to="/posts" class="btn btn--primary">
              去翻档案 <span class="btn__arrow">→</span>
            </RouterLink>
            <RouterLink to="/lab" class="btn">看看 AI LAB</RouterLink>
          </div>
        </div>
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

.brief-left__code {
  margin-top: 30px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
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

.brief-uses {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 22px;
  padding: 16px 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  list-style: none;
}

.brief-uses li {
  position: relative;
  padding-left: 16px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.75;
}

.brief-uses li::before {
  content: '';
  position: absolute;
  top: 0.78em;
  left: 0;
  width: 6px;
  height: 1px;
  background: var(--accent);
}

.brief-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 22px;
  border-top: 1px solid var(--border-subtle);
}

.brief-facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.brief-facts div:nth-child(odd) {
  padding-right: 24px;
  border-right: 1px solid var(--border-subtle);
}

.brief-facts div:nth-child(even) {
  padding-left: 24px;
}

.brief-facts dt {
  flex: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.brief-facts dd {
  color: var(--text-primary);
  font-size: 11.5px;
  text-align: right;
}

.modules-intro {
  margin-top: -12px;
  margin-bottom: 20px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.8;
}

.module-index {
  border-top: 1px solid var(--border-subtle);
}

.module-index a {
  display: grid;
  grid-template-columns: 42px 200px 110px minmax(0, 1fr) 24px;
  gap: 18px;
  align-items: center;
  padding: 17px 0;
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

.module-index__en {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1;
}

.module-index__zh {
  color: var(--text-secondary);
  font-size: 12.5px;
}

.module-index__desc {
  color: var(--text-muted);
  font-size: 12.5px;
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

.how-list {
  border-top: 1px solid var(--border-subtle);
}

.how-row {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 28px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.how-row__label {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.06em;
}

.how-row h3 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.how-row p {
  max-width: 720px;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.85;
}

.home-cta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}

.home-cta__source {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-cta__source a {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  transition: color var(--dur-fast) var(--ease-out);
}

.home-cta__source a:hover {
  color: var(--accent-ink);
}

.home-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

@media (max-width: 960px) {
  .brief-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .how-row {
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 18px;
  }

  .module-index a {
    grid-template-columns: 34px 170px 100px minmax(0, 1fr) 20px;
    gap: 12px;
  }

  .home-cta {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
  }
}

@media (max-width: 720px) {
  .brief-facts {
    grid-template-columns: 1fr;
  }

  .brief-facts div:nth-child(odd) {
    padding-right: 0;
    border-right: 0;
  }

  .brief-facts div:nth-child(even) {
    padding-left: 0;
  }

  .module-index a {
    grid-template-columns: 26px minmax(0, 1fr) 18px;
    grid-template-rows: auto auto auto;
    gap: 5px 10px;
    padding: 15px 0;
  }

  .module-index__no {
    grid-row: 1 / span 3;
    align-self: start;
    padding-top: 3px;
  }

  .module-index__en {
    grid-column: 2;
    font-size: 20px;
  }

  .module-index__zh {
    grid-column: 2;
    font-size: 12px;
  }

  .module-index__desc {
    grid-column: 2;
    font-size: 12px;
  }

  .module-index__arrow {
    grid-column: 3;
    grid-row: 1 / span 3;
  }

  .how-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .how-row h3 {
    font-size: 16px;
  }
}
</style>
