<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  zh: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  serial: {
    type: String,
    default: '',
  },
  meta: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <header class="page-hero">
    <div class="page-hero__field" aria-hidden="true"></div>
    <div class="container page-hero__inner">
      <div class="page-hero__main">
        <div class="eyebrow eyebrow--accent">
          <span class="eyebrow__tick"></span>
          {{ eyebrow }}
        </div>
        <h1 class="page-hero__title">
          {{ title }}<span v-if="zh" class="page-hero__zh">/ {{ zh }}</span>
        </h1>
        <p v-if="description" class="page-hero__desc">{{ description }}</p>
      </div>

      <div v-if="meta.length" class="page-hero__meta">
        <div v-for="item in meta" :key="item.label" class="page-hero__meta-item">
          <span class="page-hero__meta-label">{{ item.label }}</span>
          <span class="page-hero__meta-value">{{ item.value }}</span>
        </div>
      </div>

      <span v-if="serial" class="page-hero__serial">{{ serial }}</span>
    </div>
  </header>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding-block: clamp(56px, 8vw, 96px) clamp(32px, 5vw, 52px);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.page-hero__field {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(to right, transparent 12%, #000 55%, #000 100%);
  opacity: 0.8;
  pointer-events: none;
}

.page-hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 40px;
}

.page-hero__title {
  margin-top: 18px;
  font-family: var(--font-display);
  font-size: clamp(44px, 6vw, 76px);
  font-weight: 600;
  letter-spacing: 0.012em;
  line-height: 0.94;
  text-transform: uppercase;
}

.page-hero__zh {
  display: inline-block;
  margin-left: 14px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.24em;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: none;
  vertical-align: middle;
}

.page-hero__desc {
  max-width: 620px;
  margin-top: 22px;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.85;
}

.page-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  padding-bottom: 4px;
  padding-left: 28px;
  border-left: 1px solid var(--border-subtle);
}

.page-hero__meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.page-hero__meta-label {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.page-hero__meta-value {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
}

.page-hero__serial {
  position: absolute;
  top: 4px;
  right: var(--gutter);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  writing-mode: vertical-rl;
}

@media (max-width: 900px) {
  .page-hero__inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .page-hero__meta {
    padding-left: 0;
    border-left: 0;
    gap: 22px;
  }

  .page-hero__serial {
    display: none;
  }
}

@media (max-width: 560px) {
  .page-hero__title {
    font-size: 38px;
  }

  .page-hero__zh {
    display: block;
    margin: 10px 0 0;
    font-size: 13px;
  }

  .page-hero__desc {
    margin-top: 16px;
    font-size: 13.5px;
  }
}
</style>
