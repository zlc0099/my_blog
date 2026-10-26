<script setup>
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import AgentRoster from '@/components/lab/AgentRoster.vue';
import TokenLedger from '@/components/lab/TokenLedger.vue';
import SessionLog from '@/components/lab/SessionLog.vue';
import { usageSummary } from '@/lib/usage';
import { skills } from '@/data/skills';
import { prompts } from '@/data/prompts';
import { formatDate, formatTokens } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'AI LAB / AGENT OPERATIONS',
  description: 'Claude Code、Qoder、Trae 的工作分工、作业记录与 Token 消耗账本。',
});

const heroMeta = [
  { label: 'SESSIONS', value: String(usageSummary.sessions).padStart(2, '0') },
  { label: 'TOKENS', value: formatTokens(usageSummary.total) },
  { label: 'UPDATED', value: formatDate(usageSummary.updated) },
];
</script>

<template>
  <div>
    <PageHero
      eyebrow="AI LAB / AGENT OPERATIONS"
      title="AGENT OPERATIONS"
      zh="智能体作业记录"
      description="记录 Claude Code、Qoder、Trae 在真实开发流程中的分工，以及每次任务消耗的资源。不是自动追踪，而是手动维护的作业账本。"
      serial="LAB / OPS"
      :meta="heroMeta"
    />

    <section class="section lab-section">
      <div class="container">
        <div class="lab-intro">
          <div class="lab-intro__text">
            <span class="eyebrow eyebrow--accent">
              <span class="eyebrow__tick"></span>
              MANUAL LEDGER / 手动账本
            </span>
            <p>
              Token 数据保存为仓库内的 JSON 文件，页面只做聚合与展示。示例数据已明确标记，替换后即可成为真实记录；没有自动采集，也不伪造实时状态。
            </p>
          </div>
          <div class="lab-intro__status">
            <span v-if="usageSummary.isDemo" class="badge">DEMO DATA</span>
            <span class="mono">{{ usageSummary.sessions }} SESSIONS / {{ usageSummary.activeMonths }} MONTHS</span>
          </div>
        </div>

        <SectionHeading index="01" title="AGENT ROSTER" zh="智能体档案" />

        <AgentRoster />

        <div class="lab-block">
          <SectionHeading index="02" title="TOKEN LEDGER" zh="资源账本" />
          <TokenLedger />
        </div>

        <div class="lab-block">
          <SectionHeading index="03" title="SESSION LOG" zh="作业明细" />
          <SessionLog />
        </div>

        <div class="lab-block lab-links">
          <RouterLink to="/lab/skills" class="lab-link">
            <span class="eyebrow">SKILL LIBRARY / 技能库</span>
            <strong>把重复流程封装成可调用技能</strong>
            <span class="lab-link__meta mono">{{ skills.length }} ACTIVE SKILLS →</span>
          </RouterLink>
          <RouterLink to="/lab/prompts" class="lab-link">
            <span class="eyebrow">PROMPT & WORKFLOW / 提示词</span>
            <strong>全栈规划、排障模板与 Agent 工作流</strong>
            <span class="lab-link__meta mono">{{ prompts.length }} TEMPLATES →</span>
          </RouterLink>
        </div>

        <p class="lab-maintenance mono">
          DATA SOURCE / src/data/usage.json · 手动维护 · 无自动追踪 ·
          演示标记关闭后可用于真实记录
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lab-section {
  padding-top: clamp(32px, 5vw, 52px);
}

.lab-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: clamp(36px, 5vw, 56px);
  padding: 22px 24px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent);
  background: var(--bg-secondary);
}

.lab-intro__text {
  max-width: 760px;
}

.lab-intro__text p {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.85;
}

.lab-intro__status {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-align: right;
}

.lab-block {
  margin-top: clamp(52px, 7vw, 84px);
}

.lab-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.lab-link {
  position: relative;
  display: flex;
  min-height: 170px;
  flex-direction: column;
  gap: 14px;
  padding: 26px;
  background: var(--bg-primary);
  transition: background-color var(--dur-base) var(--ease-out);
}

.lab-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease-out);
}

.lab-link:hover {
  background: var(--bg-secondary);
}

.lab-link:hover::before {
  width: 64px;
}

.lab-link strong {
  max-width: 380px;
  color: var(--text-primary);
  font-size: 21px;
  font-weight: 600;
  line-height: 1.4;
}

.lab-link__meta {
  margin-top: auto;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.lab-maintenance {
  margin-top: 32px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.06em;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .lab-intro {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .lab-intro__status {
    align-items: flex-start;
    text-align: left;
  }
}

@media (max-width: 720px) {
  .lab-links {
    grid-template-columns: 1fr;
  }

  .lab-link {
    min-height: 140px;
    padding: 22px;
  }
}
</style>
