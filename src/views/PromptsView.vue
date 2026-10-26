<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import { prompts } from '@/data/prompts';
import { workflows } from '@/data/workflows';
import { promptTargets } from '@/data/taxonomy';
import { copyText } from '@/lib/clipboard';
import { padIndex } from '@/lib/format';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'PROMPT & WORKFLOW / 提示词与工作流',
  description: '全栈需求拆解、后端实现、前端页面、系统化排障与 Agent Skill 封装的个人提示词模板。',
});

const activeTarget = ref('all');
const feedback = ref({ code: '', ok: false });
let feedbackTimer = null;

const filteredPrompts = computed(() =>
  activeTarget.value === 'all'
    ? prompts
    : prompts.filter((prompt) => prompt.target === activeTarget.value),
);

const targetCounts = computed(() =>
  Object.fromEntries(
    promptTargets.map((target) => [
      target.id,
      target.id === 'all'
        ? prompts.length
        : prompts.filter((prompt) => prompt.target === target.id).length,
    ]),
  ),
);

const heroMeta = [
  { label: 'TEMPLATES', value: String(prompts.length).padStart(2, '0') },
  { label: 'PLAYBOOKS', value: String(workflows.length).padStart(2, '0') },
  { label: 'MODE', value: 'COPY-READY' },
];

async function copyPrompt(prompt) {
  const ok = await copyText(prompt.body);
  feedback.value = { code: prompt.code, ok };

  if (feedbackTimer) window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    feedback.value = { code: '', ok: false };
  }, 1800);
}

function copyLabel(prompt) {
  if (feedback.value.code !== prompt.code) return 'COPY PROMPT';
  return feedback.value.ok ? 'COPIED' : 'FAILED';
}

function targetLabel(id) {
  return promptTargets.find((target) => target.id === id)?.label || id.toUpperCase();
}

onBeforeUnmount(() => {
  if (feedbackTimer) window.clearTimeout(feedbackTimer);
});
</script>

<template>
  <div>
    <PageHero
      eyebrow="LAB / PROMPTS"
      title="PROMPT & WORKFLOW"
      zh="提示词与工作流"
      description="全栈需求拆解、后端实现、前端页面、系统化排障和 Agent Skill 封装的个人模板。所有提示词都可以直接复制，并按项目上下文替换变量。"
      serial="LAB / PROMPTS"
      :meta="heroMeta"
    />

    <section class="section prompts-section">
      <div class="container">
        <div class="prompts-note">
          <span class="eyebrow eyebrow--accent">
            <span class="eyebrow__tick"></span>
            PROTOCOL LIBRARY / 模板库
          </span>
          <p>提示词中的变量以双花括号标记；复制后替换为你的实际上下文。</p>
        </div>

        <SectionHeading index="01" title="WORKFLOW PLAYBOOKS" zh="工作流" />

        <div class="workflow-grid">
          <article v-for="workflow in workflows" :key="workflow.code" class="workflow">
            <header class="workflow__head">
              <span class="mono workflow__code">{{ workflow.code }}</span>
              <span class="tag">{{ workflow.steps.length }} STEPS</span>
            </header>
            <h2>{{ workflow.title }}</h2>
            <p class="workflow__zh">{{ workflow.zh }}</p>
            <p class="workflow__desc">{{ workflow.desc }}</p>

            <ol class="workflow__steps">
              <li v-for="(step, index) in workflow.steps" :key="step.title">
                <span class="workflow__num mono">{{ padIndex(index + 1) }}</span>
                <div>
                  <strong>{{ step.title }}</strong>
                  <p>{{ step.desc }}</p>
                </div>
              </li>
            </ol>
          </article>
        </div>

        <div class="prompts-block">
          <SectionHeading index="02" title="PROMPT LIBRARY" zh="提示词库" />

          <div class="prompt-filters">
            <span class="eyebrow">TARGET</span>
            <div class="prompt-filters__options">
              <button
                v-for="target in promptTargets"
                :key="target.id"
                type="button"
                class="filter-chip"
                :class="{ 'is-active': activeTarget === target.id }"
                @click="activeTarget = target.id"
              >
                {{ target.label }} <span>{{ String(targetCounts[target.id]).padStart(2, '0') }}</span>
              </button>
            </div>
            <span class="prompt-filters__count mono">{{ String(filteredPrompts.length).padStart(2, '0') }} TEMPLATES</span>
          </div>

          <div class="prompt-list">
            <article
              v-for="prompt in filteredPrompts"
              :id="prompt.code"
              :key="prompt.code"
              class="prompt-card"
            >
              <div class="prompt-card__main">
                <div class="prompt-card__meta">
                  <span class="mono">{{ prompt.code }}</span>
                  <span class="tag">{{ targetLabel(prompt.target) }}</span>
                </div>
                <h3>{{ prompt.title }}</h3>
                <p class="prompt-card__goal">{{ prompt.goal }}</p>
              </div>

              <button
                type="button"
                class="prompt-copy"
                :class="{ 'is-copied': feedback.code === prompt.code && feedback.ok }"
                :aria-label="`复制提示词：${prompt.title}`"
                aria-live="polite"
                @click="copyPrompt(prompt)"
              >
                {{ copyLabel(prompt) }}
              </button>

              <details class="prompt-card__details">
                <summary class="mono">
                  VIEW TEMPLATE / 展开提示词 <span>+</span>
                </summary>
                <pre><code>{{ prompt.body }}</code></pre>
              </details>
            </article>
          </div>
        </div>

        <p class="prompts-foot mono">
          MANUAL TEMPLATES / 个人维护 · 按项目上下文替换变量 · 不代替方案判断
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.prompts-section {
  padding-top: clamp(32px, 5vw, 52px);
}

.prompts-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(32px, 5vw, 48px);
}

.prompts-note p {
  color: var(--text-muted);
  font-size: 12px;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.workflow {
  position: relative;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  padding: clamp(22px, 3vw, 30px);
}

.workflow::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 56px;
  height: 2px;
  background: var(--accent);
}

.workflow__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.workflow__code {
  color: var(--accent-ink);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.workflow h2 {
  margin-top: 20px;
  font-family: var(--font-display);
  font-size: clamp(30px, 3.4vw, 40px);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
}

.workflow__zh {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.workflow__desc {
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.8;
}

.workflow__steps {
  display: flex;
  flex-direction: column;
  margin-top: 22px;
  list-style: none;
  padding: 0;
}

.workflow__steps li {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid var(--border-subtle);
}

.workflow__num {
  padding-top: 2px;
  color: var(--accent-ink);
  font-size: 8.5px;
  letter-spacing: 0.06em;
}

.workflow__steps strong {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.workflow__steps p {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 11.5px;
  line-height: 1.7;
}

.prompts-block {
  margin-top: clamp(52px, 7vw, 80px);
}

.prompt-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.prompt-filters__options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.prompt-filters__count {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.filter-chip span {
  color: var(--text-muted);
  font-size: 8px;
}

.filter-chip:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.filter-chip.is-active {
  border-color: var(--accent-line);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.filter-chip.is-active span {
  color: var(--accent-ink);
}

.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prompt-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px 24px;
  padding: 22px 24px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  scroll-margin-top: calc(var(--header-height) + 32px);
  transition: border-color var(--dur-base) var(--ease-out);
}

.prompt-card:hover,
.prompt-card:target {
  border-color: var(--border-strong);
}

.prompt-card:target {
  border-left: 2px solid var(--accent);
}

.prompt-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-ink);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

.prompt-card h3 {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 19px;
  font-weight: 600;
}

.prompt-card__goal {
  max-width: 760px;
  margin-top: 7px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.75;
}

.prompt-copy {
  align-self: start;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.prompt-copy:hover {
  border-color: var(--accent);
  color: var(--accent-ink);
}

.prompt-copy.is-copied {
  border-color: var(--accent);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.prompt-card__details {
  grid-column: 1 / -1;
}

.prompt-card__details summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.08em;
  cursor: pointer;
  list-style: none;
}

.prompt-card__details summary::-webkit-details-marker {
  display: none;
}

.prompt-card__details summary span {
  color: var(--accent-ink);
  font-size: 13px;
}

.prompt-card__details[open] summary span {
  transform: rotate(45deg);
}

.prompt-card__details pre {
  margin-top: 14px;
  padding: 18px;
  border: 1px solid var(--code-border);
  background: var(--code-bg);
  overflow-x: auto;
}

.prompt-card__details code {
  color: var(--code-text);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.85;
  white-space: pre;
}

.prompts-foot {
  margin-top: 28px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.08em;
}

@media (max-width: 860px) {
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .prompts-note {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 600px) {
  .prompt-card {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .prompt-copy {
    justify-self: start;
  }

  .prompt-filters__count {
    width: 100%;
    margin-left: 0;
  }
}
</style>
