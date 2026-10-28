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

const description = computed(() =>
  slug.value === 'musings'
    ? '所有标记为 #musings 的碎碎念与零散记录。'
    : `所有标记为 #${tag.value.name} 的学习记录与项目笔记。`,
);

const displayZh = computed(() =>
  slug.value === 'musings' ? '碎碎念' : `#${tag.value.name}`,
);
</script>

<template>
  <ArchiveBrowser
    eyebrow="ARCHIVE / TAG"
    title="TAG ARCHIVE"
    :zh="displayZh"
    :description="description"
    :serial="`TAG / ${tag.slug.toUpperCase()}`"
    :locked-tag="tag.slug"
  />
</template>
