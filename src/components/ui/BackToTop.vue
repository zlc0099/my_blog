<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { scrollToTop } from '@/lib/scroll';

const visible = ref(false);

function onScroll() {
  visible.value = window.scrollY > 720;
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <Transition name="fade">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 16V4M4 10l6-6 6 6" stroke="currentColor" stroke-width="1.4" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-strong);
  background: var(--bg-primary);
  color: var(--text-secondary);
  transition: color var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-out);
}

.back-to-top:hover {
  border-color: var(--accent);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.back-to-top svg {
  width: 18px;
  height: 18px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 560px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 38px;
    height: 38px;
  }
}
</style>
