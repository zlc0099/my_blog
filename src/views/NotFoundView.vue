<script setup>
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';

const route = useRoute();

usePageMeta({
  title: '404 / FILE NOT FOUND',
  description: '请求的档案不存在，或已经被移动。',
});
</script>

<template>
  <section class="not-found">
    <div class="not-found__field" aria-hidden="true"></div>
    <div class="container not-found__inner">
      <div class="not-found__code-wrap">
        <span class="not-found__code">404</span>
        <span class="not-found__code-label mono">ERROR / FILE MISSING</span>
      </div>

      <div class="not-found__body">
        <div class="eyebrow eyebrow--accent">
          <span class="eyebrow__tick"></span>
          ARCHIVE / NOT FOUND
        </div>
        <h1>这份档案不存在。</h1>
        <p>
          请求的记录可能已被移动、重命名，或者从未建立。检查一下地址，或者回到档案索引重新查找。
        </p>
        <p class="not-found__path mono">{{ route.fullPath }}</p>

        <div class="not-found__actions">
          <RouterLink to="/" class="btn btn--primary">
            返回首页 <span class="btn__arrow">→</span>
          </RouterLink>
          <RouterLink to="/posts" class="btn">浏览全部档案</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  position: relative;
  display: flex;
  min-height: 70vh;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid var(--border-subtle);
}

.not-found__field {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 25% 50%, var(--accent-muted), transparent 70%),
    radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: auto, 22px 22px;
  pointer-events: none;
}

.not-found__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(36px, 6vw, 88px);
  padding-block: clamp(64px, 10vw, 120px);
}

.not-found__code-wrap {
  position: relative;
  padding-left: 24px;
  border-left: 2px solid var(--accent);
}

.not-found__code {
  display: block;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(120px, 18vw, 220px);
  font-weight: 600;
  line-height: 0.8;
  -webkit-text-stroke: 1px var(--text-secondary);
}

.not-found__code-label {
  display: block;
  margin-top: 18px;
  color: var(--accent-ink);
  font-size: 9.5px;
  letter-spacing: 0.16em;
}

.not-found__body h1 {
  margin-top: 18px;
  font-size: clamp(28px, 3.6vw, 44px);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.not-found__body p {
  max-width: 520px;
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.85;
}

.not-found__path {
  margin-top: 18px !important;
  padding: 8px 10px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-muted) !important;
  font-size: 10px !important;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

@media (max-width: 800px) {
  .not-found__inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .not-found__code {
    font-size: 120px;
  }
}
</style>
