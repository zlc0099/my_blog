<script setup>
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import AgentRoster from '@/components/lab/AgentRoster.vue';
import TokenLedger from '@/components/lab/TokenLedger.vue';
import SessionLog from '@/components/lab/SessionLog.vue';
import { usageSummary } from '@/lib/usage';
import { formatDate, formatTokens } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'AI LAB / AGENT OPERATIONS',
  description: 'Claude Code、Qoder、Trae 的工作分工、作业记录与 Token 消耗账本。',
});

const heroMeta = [
  { label: 'SESSIONS', value: String(usageSummary.sessions).padStart(2, '0') },
  { label: 'PROCESSED', value: formatTokens(usageSummary.total) },
  { label: 'UPDATED', value: formatDate(usageSummary.updated) },
];
</script>

<template>
  <div>
    <PageHero
      eyebrow="AI LAB / AGENT OPERATIONS"
      title="AGENT OPERATIONS"
      zh="智能体作业记录"
      description="记录 Claude Code、Qoder、Trae 在真实开发流程中的分工与资源消耗。Claude Code 数据从本机会话日志聚合，原始对话不在站点发布；Qoder / Trae 目前手动维护。"
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
              Claude Code Token 由本机 JSONL 会话日志聚合：未缓存输入、输出与缓存读写分别统计，总量包含缓存。原始对话不会进入仓库或页面；Qoder / Trae 尚无自动导入，需手动记录。
            </p>
          </div>
          <div class="lab-intro__status">
            <span class="badge">{{ usageSummary.sourceLabel }}</span>
            <span class="mono">{{ usageSummary.sessions }} SESSIONS / {{ usageSummary.activeMonths }} MONTHS</span>
          </div>
        </div>

        <SectionHeading index="01" title="AGENT ROSTER" zh="智能体档案" />

        <AgentRoster />
        <p class="lab-roster-note mono">
          AUTO IMPORT / Claude Code 会话来自本地日志；Qoder / Trae 暂无记录，可在 usage.json 中手动补充。
        </p>

        <div class="lab-block">
          <SectionHeading index="02" title="TOKEN LEDGER" zh="资源账本" />
          <TokenLedger />
        </div>

        <div class="lab-block">
          <SectionHeading index="03" title="SESSION LOG" zh="作业明细" />
          <SessionLog />
        </div>

        <p class="lab-maintenance mono">
          DATA SOURCE / scripts/import-claude-usage.mjs · src/data/usage.json ·
          本机会话日志聚合 · 原始对话不进入仓库
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
