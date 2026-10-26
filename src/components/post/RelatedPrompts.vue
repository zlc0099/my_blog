<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { prompts } from '@/data/prompts';
import { copyText } from '@/lib/clipboard';

const props = defineProps({
  ids: {
    type: Array,
    default: () => [],
  },
});

const copiedCode = ref('');
const failedCode = ref('');
let resetTimer = null;

const items = computed(() => {
  const wanted = new Set(props.ids);
  return prompts.filter((prompt) => wanted.has(prompt.code));
});

async function copyPrompt(prompt) {
  const ok = await copyText(prompt.body);
  copiedCode.value = ok ? prompt.code : '';
  failedCode.value = ok ? '' : prompt.code;

  if (resetTimer) window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    copiedCode.value = '';
    failedCode.value = '';
  }, 1800);
}

function copyLabel(prompt) {
  if (copiedCode.value === prompt.code) return 'COPIED';
  if (failedCode.value === prompt.code) return 'FAILED';
  return 'COPY PROMPT';
}

onBeforeUnmount(() => {
  if (resetTimer) window.clearTimeout(resetTimer);
});
</script>

<template>
  <section v-if="items.length" class="related-prompts">
    <div class="related-prompts__head">
      <span class="eyebrow">RELATED PROMPTS / 相关提示词</span>
      <span class="mono related-prompts__count">{{ String(items.length).padStart(2, '0') }} TEMPLATES</span>
    </div>

    <article v-for="prompt in items" :id="prompt.code" :key="prompt.code" class="related-prompt">
      <div class="related-prompt__main">
        <div class="related-prompt__meta">
          <span class="mono">{{ prompt.code }}</span>
          <span class="tag">{{ prompt.target.toUpperCase() }}</span>
        </div>
        <h3>{{ prompt.title }}</h3>
        <p>{{ prompt.goal }}</p>
      </div>

      <button
        type="button"
        class="related-prompt__copy"
        :class="{ 'is-copied': copiedCode === prompt.code }"
        :aria-label="`复制提示词：${prompt.title}`"
        aria-live="polite"
        @click="copyPrompt(prompt)"
      >
        {{ copyLabel(prompt) }}
      </button>

      <details class="related-prompt__details">
        <summary class="mono">
          VIEW PROMPT / 展开提示词 <span>+</span>
        </summary>
        <pre><code>{{ prompt.body }}</code></pre>
      </details>
    </article>
  </section>
</template>

<style scoped>
.related-prompts {
  margin-top: clamp(44px, 6vw, 64px);
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
  scroll-margin-top: calc(var(--header-height) + 32px);
}

.related-prompts__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.related-prompts__count {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.related-prompt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px 24px;
  padding: 20px 22px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  scroll-margin-top: calc(var(--header-height) + 32px);
}

.related-prompt + .related-prompt {
  margin-top: 10px;
}

.related-prompt:hover,
.related-prompt:target {
  border-color: var(--border-strong);
}

.related-prompt__meta {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.related-prompt h3 {
  margin-top: 9px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.related-prompt__main p {
  max-width: 680px;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.75;
}

.related-prompt__copy {
  align-self: start;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.related-prompt__copy:hover {
  border-color: var(--accent);
  color: var(--accent-ink);
}

.related-prompt__copy.is-copied {
  border-color: var(--accent);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.related-prompt__details {
  grid-column: 1 / -1;
}

.related-prompt__details summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 11px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
  cursor: pointer;
  list-style: none;
}

.related-prompt__details summary::-webkit-details-marker {
  display: none;
}

.related-prompt__details summary span {
  color: var(--accent-ink);
  font-size: 12px;
  transition: transform var(--dur-base) var(--ease-out);
}

.related-prompt__details[open] summary span {
  transform: rotate(45deg);
}

.related-prompt__details pre {
  margin-top: 12px;
  padding: 16px;
  border: 1px solid var(--code-border);
  background: var(--code-bg);
  overflow-x: auto;
}

.related-prompt__details code {
  color: var(--code-text);
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.85;
  white-space: pre;
}

@media (max-width: 600px) {
  .related-prompt {
    grid-template-columns: 1fr;
    padding: 17px;
  }

  .related-prompt__copy {
    justify-self: start;
  }
}
</style>
