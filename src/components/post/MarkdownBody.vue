<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { copyText } from '@/lib/clipboard';

defineProps({
  html: {
    type: String,
    default: '',
  },
});

const root = ref(null);
const timers = new Set();

async function onClick(event) {
  const button = event.target.closest('.code-block__copy');
  if (!button || !root.value?.contains(button)) return;

  const code = button.closest('.code-block')?.querySelector('code')?.textContent ?? '';
  button.disabled = true;
  const success = await copyText(code);

  button.textContent = success ? 'COPIED' : 'FAILED';
  button.classList.toggle('is-copied', success);
  button.setAttribute('aria-label', success ? '已复制代码' : '复制失败，请手动选择代码');

  const timer = window.setTimeout(() => {
    button.textContent = 'COPY';
    button.classList.remove('is-copied');
    button.disabled = false;
    button.setAttribute('aria-label', '复制代码');
    timers.delete(timer);
  }, 1600);
  timers.add(timer);
}

function onImageError(event) {
  if (event.target instanceof HTMLImageElement) {
    event.target.classList.add('is-broken');
  }
}

onMounted(() => {
  root.value?.addEventListener('error', onImageError, true);
});

onBeforeUnmount(() => {
  root.value?.removeEventListener('error', onImageError, true);
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
});
</script>

<template>
  <div ref="root" class="md post-body" @click="onClick" v-html="html"></div>
</template>
