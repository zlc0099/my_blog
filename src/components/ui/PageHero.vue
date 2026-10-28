<script setup>
import AnimeCarousel from '@/components/effects/AnimeCarousel.vue';

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
  notice: {
    type: String,
    default: '',
  },
  anime: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <header class="page-hero">
    <div class="page-hero__field" aria-hidden="true"></div>
    <div v-if="anime" class="page-hero__anime-band" aria-hidden="true">
      <AnimeCarousel />
    </div>
    <div class="container page-hero__inner">
      <div class="page-hero__main">
        <div class="eyebrow eyebrow--accent">
          <span class="eyebrow__tick"></span>
          {{ eyebrow }}
        </div>
        <div class="page-hero__heading">
          <h1 class="page-hero__title">
            {{ title }}<span v-if="zh" class="page-hero__zh">/ {{ zh }}</span>
          </h1>
          <p v-if="notice" class="page-hero__notice">
            <span class="page-hero__notice-label">PERSONAL NOTE</span>
            {{ notice }}
          </p>
        </div>
        <p v-if="description" class="page-hero__desc">{{ description }}</p>
      </div>

      <div class="page-hero__aside">
        <div v-if="meta.length" class="page-hero__meta">
          <div v-for="item in meta" :key="item.label" class="page-hero__meta-item">
            <span class="page-hero__meta-label">{{ item.label }}</span>
            <span class="page-hero__meta-value">{{ item.value }}</span>
          </div>
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
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 40px;
}

.page-hero__anime-band {
  position: absolute;
  top: 4px;
  left: 50%;
  z-index: 2;
  width: min(calc(100% - var(--gutter) * 2 - 32px), var(--content-width));
  height: clamp(58px, 5.5vw, 74px);
  transform: translateX(-50%);
}

.page-hero__inner::before {
  content: '';
  position: absolute;
  inset: -18px -20px;
  z-index: -1;
  border: 1px solid var(--hero-glass-border);
  background: var(--hero-glass);
  -webkit-backdrop-filter: var(--glass-filter);
  backdrop-filter: var(--glass-filter);
  pointer-events: none;
}

.page-hero__main,
.page-hero__meta {
  position: relative;
  z-index: 1;
}

.page-hero__aside {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.page-hero__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px 20px;
  margin-top: 18px;
}

.page-hero__notice {
  max-width: 340px;
  margin: 0 0 8px;
  padding-left: 12px;
  border-left: 2px solid var(--accent-line);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.75;
}

.page-hero__notice-label {
  display: inline-block;
  margin-right: 6px;
  color: var(--accent-ink);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  vertical-align: 1px;
}

.page-hero__title {
  margin-top: 0;
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
  z-index: 3;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  writing-mode: vertical-rl;
}

@media (max-width: 1100px) {
  .page-hero__anime-band {
    display: none;
  }
}

@media (max-width: 900px) {
  .page-hero__inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .page-hero__inner::before {
    inset: -14px -16px;
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
  .page-hero__heading {
    gap: 8px 12px;
  }

  .page-hero__notice {
    max-width: 100%;
    margin-bottom: 0;
  }

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
