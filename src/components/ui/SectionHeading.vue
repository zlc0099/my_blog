<script setup>
defineProps({
  index: {
    type: String,
    default: '01',
  },
  title: {
    type: String,
    required: true,
  },
  zh: {
    type: String,
    default: '',
  },
  actionTo: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: 'VIEW ALL',
  },
});
</script>

<template>
  <div class="section-heading">
    <span class="section-heading__index">{{ index }}</span>
    <h2 class="section-heading__title">
      {{ title }}<span v-if="zh" class="section-heading__zh">/ {{ zh }}</span>
    </h2>
    <span class="section-heading__line" aria-hidden="true"></span>
    <div class="section-heading__action">
      <slot name="action">
        <RouterLink v-if="actionTo" :to="actionTo" class="section-heading__link">
          {{ actionLabel }} →
        </RouterLink>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: clamp(24px, 4vw, 40px);
}

.section-heading__index {
  padding-top: 7px;
  color: var(--accent-ink);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
}

.section-heading__title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  text-transform: uppercase;
}

.section-heading__zh {
  margin-left: 10px;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: none;
}

.section-heading__line {
  flex: 1;
  height: 1px;
  margin-top: 22px;
  background: var(--border-subtle);
}

.section-heading__action {
  flex: none;
  padding-top: 6px;
}

.section-heading__link {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out);
}

.section-heading__link:hover {
  color: var(--accent-ink);
}

@media (max-width: 720px) {
  .section-heading {
    flex-wrap: wrap;
  }

  .section-heading__line {
    display: none;
  }

  .section-heading__action {
    width: 100%;
    padding-top: 0;
    padding-left: 26px;
  }

  .section-heading__title {
    font-size: 30px;
  }

  .section-heading__zh {
    font-size: 12px;
  }
}
</style>
