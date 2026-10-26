<script setup>
import { computed } from 'vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import FocusList from '@/components/home/FocusList.vue';
import { site } from '@/data/site';
import { agents } from '@/data/agents';
import { focusItems } from '@/data/focus';
import { archiveStats, projects } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'ABOUT / DOSSIER',
  description: site.aboutIntro,
});

const focusLine = computed(() => focusItems.map((item) => item.topic).join(' / '));
const barcode = [2, 5, 3, 8, 2, 6, 4, 9, 3, 5, 2, 7, 4, 6, 3, 8, 2, 5, 7, 3, 6, 2, 8, 4, 5, 3, 7, 2, 6, 4];
</script>

<template>
  <div>
    <section class="about-hero">
      <div class="about-hero__field" aria-hidden="true"></div>
      <div class="container about-hero__inner">
        <div class="about-hero__main">
          <div class="eyebrow eyebrow--accent">
            <span class="eyebrow__tick"></span>
            ABOUT / DOSSIER
          </div>
          <h1 class="about-hero__title">
            A RECORD OF<br />
            <span class="about-hero__outline">WHAT I LEARN</span><br />
            AND BUILD<span class="about-hero__dot">.</span>
          </h1>
          <p class="about-hero__intro">{{ site.aboutIntro }}</p>
          <div class="about-hero__links">
            <a :href="site.github" class="btn btn--compact" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <RouterLink to="/posts" class="btn btn--compact">浏览学习档案</RouterLink>
          </div>
        </div>

        <aside class="profile-card">
          <div class="profile-card__head">
            <span class="mono">PROFILE / 001</span>
            <span class="mono profile-card__status"><i></i>{{ site.owner.status }}</span>
          </div>

          <dl class="profile-card__data">
            <div>
              <dt>CALLSIGN</dt>
              <dd>{{ site.owner.callsign }}</dd>
            </div>
            <div>
              <dt>ROLE</dt>
              <dd>{{ site.owner.role }}</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd>{{ focusLine }}</dd>
            </div>
            <div>
              <dt>TOOLS</dt>
              <dd>{{ agents.map((agent) => agent.name).join(' / ') }}</dd>
            </div>
            <div>
              <dt>GITHUB</dt>
              <dd>
                <a :href="site.github" target="_blank" rel="noopener noreferrer">
                  @{{ site.owner.callsign }} ↗
                </a>
              </dd>
            </div>
          </dl>

          <div class="profile-card__barcode" aria-hidden="true">
            <span v-for="(height, index) in barcode" :key="index" :style="{ height: `${height * 3}px` }"></span>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="01" title="CURRENT FOCUS" zh="当前关注" />
        <FocusList />
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="02" title="TOOLCHAIN" zh="工具链" />
        <div class="about-tools">
          <div v-for="agent in agents" :key="agent.id" class="about-tool">
            <span class="about-tool__code mono">{{ agent.code }}</span>
            <div>
              <strong>{{ agent.name }}</strong>
              <p>{{ agent.role }}</p>
            </div>
            <span class="about-tool__mode mono">{{ agent.mode }}</span>
          </div>
        </div>
        <p class="about-note mono">
          TOOLS ARE EXECUTION LAYERS / 工具只是执行层，方案判断与最终验收由人负责。
        </p>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="03" title="PRINCIPLES" zh="学习方式" />
        <div class="principles">
          <article v-for="(item, index) in site.philosophy" :key="item.title" class="principle">
            <span class="principle__index mono">0{{ index + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading
          index="04"
          title="PROJECT EXPERIENCE"
          zh="项目经历"
          action-to="/projects"
          action-label="ALL PROJECTS"
        />
        <div class="about-projects">
          <RouterLink
            v-for="project in projects"
            :key="project.slug"
            :to="`/projects/${project.slug}`"
            class="about-project"
          >
            <div class="about-project__main">
              <span class="mono about-project__meta">{{ project.archiveCode }} / {{ project.period }} / {{ project.status }}</span>
              <h3>{{ project.title }}</h3>
              <p>{{ project.summary }}</p>
            </div>
            <div class="about-project__side">
              <span class="about-project__stack mono">{{ project.stack.slice(0, 3).join(' · ') }}</span>
              <span class="about-project__arrow" aria-hidden="true">→</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="05" title="CONTACT" zh="联系方式" />
        <div class="about-contact">
          <div>
            <span class="eyebrow">OPEN CHANNEL / 公开入口</span>
            <h2>GitHub 是唯一的公开联系方式。</h2>
            <p>项目代码、站点更新与后续学习记录会同步到 GitHub。这里不展示未经确认的个人信息。</p>
          </div>
          <a :href="site.github" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
            github.com/zlc0099 ↗
          </a>
        </div>

        <div class="about-siteinfo mono">
          <span>SITE / Vue 3 + Vite · GitHub Pages · 无后端</span>
          <span>SOURCE / Markdown + JSON</span>
          <span>UPDATED / {{ formatDate(archiveStats.latestUpdate) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  position: relative;
  padding-block: clamp(56px, 8vw, 96px) clamp(48px, 6vw, 72px);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.about-hero__field {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 78% 30%, var(--accent-muted), transparent 70%),
    radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: auto, 22px 22px;
  mask-image: linear-gradient(to bottom, #000 0%, #000 75%, transparent 100%);
  pointer-events: none;
}

.about-hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  align-items: center;
  gap: clamp(40px, 6vw, 88px);
}

.about-hero__title {
  margin-top: 22px;
  font-family: var(--font-display);
  font-size: clamp(46px, 6.4vw, 84px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 0.92;
  text-transform: uppercase;
}

.about-hero__outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--text-secondary);
}

.about-hero__dot {
  color: var(--accent);
  -webkit-text-stroke: 0;
}

.about-hero__intro {
  max-width: 620px;
  margin-top: 26px;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.95;
}

.about-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 26px;
}

.profile-card {
  position: relative;
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(var(--grid-dot) 1px, transparent 1px),
    var(--bg-secondary);
  background-size: 20px 20px, 100% 100%;
  padding: 22px;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 56px;
  height: 2px;
  background: var(--accent);
}

.profile-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.profile-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.profile-card__status i {
  width: 5px;
  height: 5px;
  background: var(--accent);
}

.profile-card__data {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 18px;
}

.profile-card__data div {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 14px;
  align-items: baseline;
}

.profile-card__data dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.profile-card__data dd {
  color: var(--text-primary);
  font-size: 11.5px;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.profile-card__data a {
  color: var(--text-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border-strong);
}

.profile-card__data a:hover {
  color: var(--accent-ink);
}

.profile-card__barcode {
  display: flex;
  height: 32px;
  align-items: flex-end;
  gap: 3px;
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
  opacity: 0.55;
}

.profile-card__barcode span {
  flex: 1;
  max-width: 4px;
  background: var(--text-secondary);
}

.about-tools {
  border-top: 1px solid var(--border-subtle);
}

.about-tool {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.about-tool:hover {
  background: var(--bg-secondary);
}

.about-tool__code {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.about-tool strong {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

.about-tool p {
  margin-top: 3px;
  color: var(--text-muted);
  font-size: 11.5px;
}

.about-tool__mode {
  padding: 3px 6px;
  border: 1px solid var(--border-primary);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.about-note {
  margin-top: 16px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.principles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.principle {
  position: relative;
  min-height: 170px;
  padding: 24px;
  background: var(--bg-primary);
}

.principle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease-out);
}

.principle:hover::before {
  width: 42px;
}

.principle__index {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.principle h3 {
  margin-top: 24px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.principle p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.8;
}

.about-projects {
  border-top: 1px solid var(--border-subtle);
}

.about-project {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.about-project:hover {
  background: var(--bg-secondary);
}

.about-project__meta {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.about-project h3 {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 600;
}

.about-project:hover h3 {
  color: var(--accent-ink);
}

.about-project p {
  max-width: 760px;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.75;
}

.about-project__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.about-project__stack {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  text-align: right;
}

.about-project__arrow {
  color: var(--text-muted);
  font-size: 20px;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.about-project:hover .about-project__arrow {
  color: var(--accent-ink);
  transform: translateX(3px);
}

.about-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: clamp(24px, 4vw, 36px);
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent);
  background: var(--bg-secondary);
}

.about-contact h2 {
  margin-top: 12px;
  font-size: clamp(22px, 2.8vw, 30px);
  font-weight: 600;
}

.about-contact p {
  max-width: 560px;
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.85;
}

.about-siteinfo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin-top: 20px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
}

@media (max-width: 980px) {
  .about-hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .profile-card {
    max-width: 520px;
  }
}

@media (max-width: 720px) {
  .about-hero__title {
    font-size: 44px;
  }

  .principles {
    grid-template-columns: 1fr;
  }

  .about-tool {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .about-tool__mode {
    display: none;
  }

  .about-project {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .about-project__side {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }

  .about-project__stack {
    text-align: left;
  }

  .about-contact {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
  }
}
</style>
