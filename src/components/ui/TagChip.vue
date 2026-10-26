<script setup>
import { toTagSlug } from '@/lib/format';

defineProps({
  tag: {
    type: String,
    required: true,
  },
  link: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <RouterLink v-if="link" class="tag" :to="`/tags/${toTagSlug(tag)}`">#{{ tag }}</RouterLink>
  <span v-else class="tag">#{{ tag }}</span>
</template>
