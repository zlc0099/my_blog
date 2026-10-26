<script setup>
defineProps({
  code: {
    type: String,
    default: 'NO DATA',
  },
  title: {
    type: String,
    default: '这里还没有记录',
  },
  description: {
    type: String,
    default: '内容正在整理中，稍后再来看看。',
  },
});
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__code">{{ code }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(28px, 5vw, 48px);
  border: 1px dashed var(--border-primary);
  background: var(--bg-secondary);
}

.empty-state::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 28px;
  height: 28px;
  border-top: 1px solid var(--accent);
  border-left: 1px solid var(--accent);
}

.empty-state__code {
  margin-bottom: 12px;
  color: var(--accent-ink);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
}

.empty-state h3 {
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 600;
}

.empty-state p {
  max-width: 480px;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.empty-state__actions:empty {
  display: none;
}
</style>
