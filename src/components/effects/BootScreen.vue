<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let alreadyBooted = false;
try {
  alreadyBooted = sessionStorage.getItem('pa-booted') === '1';
} catch (error) {
  alreadyBooted = false;
}

const skipBoot = reduced || alreadyBooted;
const hidden = ref(skipBoot);
const leaving = ref(false);
const progress = ref(skipBoot ? 100 : 10);

let target = skipBoot ? 100 : 24;
let rafId = 0;
let lastTime = 0;
let finished = false;
const timers = [];

const ticks = Array.from({ length: 24 }, (_, index) => index + 1);

const status = computed(() => {
  if (progress.value < 35) return '载入档案';
  if (progress.value < 74) return '读取内容';
  if (progress.value < 99) return '整理中';
  return '完成';
});

const displayProgress = computed(() =>
  String(Math.round(progress.value)).padStart(3, '0'),
);

function schedule(callback, delay) {
  const id = window.setTimeout(callback, delay);
  timers.push(id);
  return id;
}

function loop(time) {
  if (finished) return;
  const delta = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
  lastTime = time;

  const speed = target >= 100 ? 3.4 : 1.5;
  progress.value += (target - progress.value) * Math.min(1, delta * speed);

  if (target >= 100 && progress.value >= 99.4) {
    complete();
    return;
  }
  rafId = window.requestAnimationFrame(loop);
}

function complete() {
  if (finished) return;
  finished = true;
  leaving.value = true;
  progress.value = 100;
  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = 0;

  try {
    sessionStorage.setItem('pa-booted', '1');
  } catch (error) {
    // Session storage is optional; the boot screen simply shows again later.
  }

  schedule(() => {
    hidden.value = true;
    document.documentElement.classList.remove('is-booting');
  }, 700);
}

function skip() {
  if (finished) return;
  target = 100;
  progress.value = 100;
  complete();
}

onMounted(() => {
  if (skipBoot) {
    document.documentElement.classList.remove('is-booting');
    return;
  }

  document.documentElement.classList.add('is-booting');
  rafId = window.requestAnimationFrame(loop);

  schedule(() => {
    target = 52;
  }, 150);

  document.fonts?.ready
    .then(() => {
      target = 80;
    })
    .catch(() => {});

  const onLoad = () => {
    target = 94;
  };
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });

  schedule(() => {
    target = 100;
  }, 900);

  schedule(() => {
    complete();
  }, 1800);
});

onBeforeUnmount(() => {
  if (rafId) window.cancelAnimationFrame(rafId);
  timers.forEach((timer) => window.clearTimeout(timer));
  document.documentElement.classList.remove('is-booting');
});
</script>

<template>
  <div
    v-if="!hidden"
    class="boot"
    :class="{ 'is-leaving': leaving }"
    role="progressbar"
    tabindex="0"
    aria-label="页面加载进度"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(progress)"
    @click="skip"
    @keydown.enter.prevent="skip"
    @keydown.space.prevent="skip"
  >
    <div class="boot__panel boot__panel--left"></div>
    <div class="boot__panel boot__panel--right"></div>
    <span class="boot__seam" aria-hidden="true"></span>

    <div class="boot__content">
      <div class="boot__brand">
        <span class="boot__mark" aria-hidden="true">
          <svg viewBox="0 0 36 36">
            <path d="M4 4h21l7 7v21H4z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M25 4v7h7" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M11 16h14M11 21h14M11 26h8" stroke="currentColor" stroke-width="1.5" />
            <rect x="22" y="24" width="5" height="5" fill="#F5A623" />
          </svg>
        </span>
        <span class="boot__brand-text">
          <span class="boot__name">PERSONAL ARCHIVE</span>
        </span>
      </div>

      <div class="boot__bar">
        <span class="boot__bar-fill" :style="{ width: `${progress}%` }"></span>
      </div>

      <div class="boot__meta mono">
        <span>{{ status }}</span>
        <span>{{ displayProgress }}%</span>
      </div>

      <div class="boot__ticks" aria-hidden="true">
        <span
          v-for="tick in ticks"
          :key="tick"
          :class="{ 'is-on': tick <= (progress / 100) * ticks.length }"
        ></span>
      </div>

      <p class="boot__skip mono">CLICK TO SKIP / 点击跳过</p>
    </div>
  </div>
</template>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: 300;
  cursor: pointer;
  overflow: hidden;
}

.boot__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.5%;
  background:
    radial-gradient(var(--grid-dot) 1px, transparent 1px),
    radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-muted), transparent 70%),
    linear-gradient(180deg, var(--bg-base), var(--bg-deep) 70%, var(--bg-base));
  background-size: 22px 22px, auto, 100% 100%;
  transition: transform 0.72s cubic-bezier(0.7, 0, 0.25, 1) 0.12s;
}

.boot__panel--left {
  left: 0;
}

.boot__panel--right {
  right: 0;
}

.boot.is-leaving .boot__panel--left {
  transform: translateX(-102%);
}

.boot.is-leaving .boot__panel--right {
  transform: translateX(102%);
}

.boot__seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--accent);
  box-shadow: 0 0 18px rgba(var(--accent-rgb), 0.55);
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.36s var(--ease-out);
}

.boot.is-leaving .boot__seam {
  transform: scaleY(1);
}

.boot__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 24px;
  transition: opacity 0.3s var(--ease-out);
}

.boot.is-leaving .boot__content {
  opacity: 0;
}

.boot__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.boot__mark {
  width: 34px;
  height: 34px;
  color: var(--text-primary);
}

.boot__mark svg {
  width: 100%;
  height: 100%;
}

.boot__brand-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.boot__name {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
}

.boot__sub {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.16em;
}

.boot__bar {
  position: relative;
  width: min(420px, 78vw);
  height: 2px;
  background: var(--border-subtle);
  overflow: hidden;
}

.boot__bar-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--accent);
  transition: width 0.16s linear;
}

.boot__meta {
  display: flex;
  width: min(420px, 78vw);
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.boot__ticks {
  display: flex;
  gap: 5px;
}

.boot__ticks span {
  width: 1px;
  height: 8px;
  background: var(--border-primary);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.boot__ticks span.is-on {
  background: var(--accent);
}

.boot__skip {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

@media (max-width: 560px) {
  .boot__name {
    font-size: 21px;
  }

  .boot__mark {
    width: 28px;
    height: 28px;
  }

  .boot__ticks {
    gap: 3px;
  }

  .boot__skip {
    font-size: 10px;
  }
}
</style>