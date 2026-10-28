<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ArchiveBrowser from '@/components/post/ArchiveBrowser.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { categoryMap } from '@/data/taxonomy';

const route = useRoute();
const category = computed(() => categoryMap[String(route.params.slug)]);

const description = computed(() => {
  if (!category.value) return '';
  return `${category.value.desc.replace(/[。.!！?？]$/, '')}。浏览该分类下的全部记录。`;
});
</script>

<template>
  <ArchiveBrowser
    v-if="category"
    eyebrow="ARCHIVE / CATEGORY"
    :title="category.en"
    :zh="category.zh.toLowerCase() === category.en.toLowerCase() ? '' : category.zh"
    :description="description"
    :serial="`CATEGORY / ${category.slug.toUpperCase()}`"
    :locked-category="category.slug"
  />
  <NotFoundView v-else />
</template>
