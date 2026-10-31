<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ArchiveBrowser from '@/components/post/ArchiveBrowser.vue';
import { tags } from '@/lib/content';

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const tag = computed(
  () => tags.find((item) => item.slug === slug.value) || { name: slug.value, slug: slug.value, count: 0 },
);

const displayZh = computed(() =>
  slug.value === 'musings' ? '碎碎念' : `#${tag.value.name}`,
);
</script>

<template>
  <ArchiveBrowser
    title="TAG"
    :zh="displayZh"
    description=""
    :locked-tag="tag.slug"
  />
</template>
