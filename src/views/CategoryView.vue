<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ArchiveBrowser from '@/components/post/ArchiveBrowser.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { categoryMap } from '@/data/taxonomy';

const route = useRoute();
const category = computed(() => categoryMap[String(route.params.slug)]);

const description = computed(() => category.value?.desc || '');
</script>

<template>
  <ArchiveBrowser
    v-if="category"
    :title="category.en"
    :zh="category.zh.toLowerCase() === category.en.toLowerCase() ? '' : category.zh"
    :description="description"
    :locked-category="category.slug"
  />
  <NotFoundView v-else />
</template>
