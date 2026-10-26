<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const progress = ref(0);
let ticking = false;

function update() {
  ticking = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(update);
}

onMounted(() => {
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <div class="reading-progress" aria-hidden="true">
    <span :style="{ width: `${progress}%` }"></span>
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 60;
  height: 2px;
  background: transparent;
  pointer-events: none;
}

.reading-progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 80ms linear;
}
</style>
