<template>
  <div class="image-cover">
    <img
      :src="resolvedSrc"
      :alt="alt"
      :loading="loading"
      decoding="async"
      draggable="false"
    />
    <span class="image-cover__shade" aria-hidden="true"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  loading: {
    type: String,
    default: 'lazy',
  },
});

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const resolvedSrc = computed(() => {
  if (!props.src.startsWith('/') || props.src.startsWith('//')) return props.src;
  return `${baseUrl}${props.src.slice(1)}`;
});
</script>

<style scoped>
.image-cover {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: var(--cover-ratio, 16 / 9.6);
  overflow: hidden;
  background: var(--bg-deep);
}

.image-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 32%;
  transition: transform 0.65s var(--ease-out);
}

.image-cover__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 52%, rgba(5, 7, 9, 0.42) 100%);
  pointer-events: none;
}
</style>
