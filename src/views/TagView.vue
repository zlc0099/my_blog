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
</script>

<template>
  <ArchiveBrowser
    eyebrow="ARCHIVE / TAG"
    title="TAG ARCHIVE"
    :zh="`#${tag.name}`"
    :description="`所有标记为 #${tag.name} 的学习记录与项目笔记。`"
    :serial="`TAG / ${tag.slug.toUpperCase()}`"
    :locked-tag="tag.slug"
  />
</template>
