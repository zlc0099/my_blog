<script setup>
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import AgentRoster from '@/components/lab/AgentRoster.vue';
import TokenLedger from '@/components/lab/TokenLedger.vue';
import ModelUsage from '@/components/lab/ModelUsage.vue';
import AgentModelTrace from '@/components/lab/AgentModelTrace.vue';
import SessionLog from '@/components/lab/SessionLog.vue';
import { usageSummary } from '@/lib/usage';
import { formatDate, formatTokens } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'AI LAB / AGENT OPERATIONS',
  description: 'Claude Code、Qoder、Trae 的工作分工、模型使用、作业记录与 Token 消耗账本。',
});

const heroMeta = [
  { label: '会话', value: String(usageSummary.agentSessions).padStart(2, '0') },
  { label: '模型', value: String(usageSummary.agentModelCount).padStart(2, '0') },
  { label: 'Token', value: formatTokens(usageSummary.total) },
  { label: '更新', value: formatDate(usageSummary.updated) },
];
</script>

<template>
  <div>
    <PageHero
      title="AI LAB"
      zh="智能体记录"
      description="Claude Code、Qoder、Trae 的分工、模型与 Token 记录。原始对话不发布。"
      :meta="heroMeta"
    />

    <section class="section lab-section">
      <div class="container">
        <div class="lab-intro">
          <div class="lab-intro__text">
            <p>
              Token 来自本地会话日志；Qoder 与 Trae 只统计模型和会话，原始对话不进入仓库。
            </p>
          </div>
          <div class="lab-intro__status">
            <span class="badge">本地数据</span>
            <span class="mono">{{ usageSummary.agentSessions }} 会话 / {{ usageSummary.agentCoverage.length }} 个 Agent / {{ usageSummary.agentModelCount }} 条模型记录</span>
          </div>
        </div>

        <SectionHeading index="01" title="智能体档案" />

        <AgentRoster />

        <div class="lab-block">
          <SectionHeading index="02" title="资源账本" />
          <TokenLedger />
        </div>

        <div class="lab-block">
          <SectionHeading index="03" title="模型使用" />
          <ModelUsage />
          <AgentModelTrace />
        </div>

        <div class="lab-block">
          <SectionHeading index="04" title="作业明细" />
          <SessionLog />
        </div>
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
  font-size: 10px;
  letter-spacing: 0.06em;
  text-align: right;
}

.lab-block {
  margin-top: clamp(52px, 7vw, 84px);
}

.lab-roster-note {
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.05em;
  line-height: 1.8;
}

.lab-maintenance {
  margin-top: 32px;
  color: var(--text-muted);
  font-size: 10px;
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

</style>
