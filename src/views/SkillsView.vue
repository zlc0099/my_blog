<script setup>
import PageHero from '@/components/ui/PageHero.vue';
import { skills } from '@/data/skills';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'SKILL LIBRARY / 技能库',
  description: '把重复流程封装成跨 Agent 可复用的 SKILL.md 工作规范。',
});

const heroMeta = [
  { label: 'SKILLS', value: String(skills.length).padStart(2, '0') },
  { label: 'FORMAT', value: 'SKILL.md' },
  { label: 'MODE', value: 'MULTI-AGENT' },
];
</script>

<template>
  <div>
    <PageHero
      eyebrow="LAB / SKILLS"
      title="SKILL LIBRARY"
      zh="技能库"
      description="把前端设计、全栈开发流程和 Web 测试验收固化成可复用的工作规范。这里展示的是实际在用的本地技能，而不是虚构的能力清单。"
      serial="LAB / SKILLS"
      :meta="heroMeta"
    />

    <section class="section skills-section">
      <div class="container">
        <div class="skills-note">
          <span class="eyebrow eyebrow--accent">
            <span class="eyebrow__tick"></span>
            LOCAL SKILLS / 本地技能
          </span>
          <p>所有技能均以 SKILL.md 描述，不绑定特定 Agent 平台。</p>
        </div>

        <div class="skill-list">
          <article v-for="skill in skills" :key="skill.code" class="skill-row">
            <aside class="skill-row__aside">
              <span class="skill-row__code mono">{{ skill.code }}</span>
              <span class="skill-row__status mono"><i></i>{{ skill.status }}</span>
              <span class="skill-row__category mono">{{ skill.category }}</span>
            </aside>

            <div class="skill-row__body">
              <div class="skill-row__head">
                <div>
                  <h2>{{ skill.title }}</h2>
                  <p class="skill-row__name mono">{{ skill.name }}</p>
                </div>
                <span class="tag skill-row__invoke">{{ skill.invoke }}</span>
              </div>

              <p class="skill-row__summary">{{ skill.summary }}</p>

              <ul class="skill-row__caps">
                <li v-for="capability in skill.capabilities" :key="capability" class="tag">
                  {{ capability }}
                </li>
              </ul>

              <div class="skill-row__compat">
                <span class="eyebrow">COMPATIBLE</span>
                <span v-for="agent in skill.compat" :key="agent" class="mono">{{ agent }}</span>
              </div>
            </div>
          </article>
        </div>

        <div class="skills-footer">
          <span class="mono">SOURCE / LOCAL SKILL.md</span>
          <RouterLink to="/lab/prompts" class="text-link">查看提示词与工作流 →</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.skills-section {
  padding-top: clamp(32px, 5vw, 52px);
}

.skills-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.skills-note p {
  color: var(--text-muted);
  font-size: 12px;
}

.skill-list {
  border-top: 1px solid var(--border-subtle);
}

.skill-row {
  position: relative;
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-base) var(--ease-out);
}

.skill-row::before {
  content: '';
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 0;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--dur-base) var(--ease-out);
}

.skill-row:hover {
  background: var(--bg-secondary);
}

.skill-row:hover::before {
  transform: scaleY(1);
}

.skill-row__aside {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 24px;
  border-right: 1px solid var(--border-subtle);
}

.skill-row__code {
  color: var(--accent-ink);
  font-size: 9.5px;
  letter-spacing: 0.1em;
}

.skill-row__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.skill-row__status i {
  width: 5px;
  height: 5px;
  background: var(--success);
}

.skill-row__category {
  margin-top: auto;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.skill-row__body {
  padding: 28px 24px;
}

.skill-row__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.skill-row__head h2 {
  font-size: clamp(22px, 2.6vw, 28px);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.skill-row__name {
  margin-top: 7px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.skill-row__invoke {
  flex: none;
}

.skill-row__summary {
  max-width: 760px;
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.85;
}

.skill-row__caps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
  list-style: none;
  padding: 0;
}

.skill-row__compat {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.03em;
}

.skill-row__compat .eyebrow {
  font-size: 8px;
}

.skill-row__compat .mono {
  position: relative;
  padding-right: 10px;
}

.skill-row__compat .mono:not(:last-child)::after {
  content: '/';
  position: absolute;
  right: 2px;
  color: var(--border-strong);
}

.skills-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.skills-footer .text-link {
  font-size: 12px;
}

@media (max-width: 800px) {
  .skill-row {
    grid-template-columns: 1fr;
  }

  .skill-row__aside {
    flex-direction: row;
    align-items: center;
    padding: 18px 20px;
    border-right: 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .skill-row__category {
    margin-top: 0;
    margin-left: auto;
  }

  .skill-row__body {
    padding: 22px 20px;
  }

  .skills-note {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .skills-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
