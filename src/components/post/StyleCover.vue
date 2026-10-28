<script setup>
import { computed } from 'vue';
import GovAdminCover from './covers/GovAdminCover.vue';
import RoadAdminCover from './covers/RoadAdminCover.vue';
import PublicPortalCover from './covers/PublicPortalCover.vue';
import DataScreenCover from './covers/DataScreenCover.vue';
import VisualNovelCover from './covers/VisualNovelCover.vue';
import DossierCover from './covers/DossierCover.vue';
import SonataCover from './covers/SonataCover.vue';
import PetWidgetCover from './covers/PetWidgetCover.vue';
import Y2kCover from './covers/Y2kCover.vue';
import MovieCover from './covers/MovieCover.vue';
import AnimeGameCover from './covers/AnimeGameCover.vue';
import AdminLayoutCover from './covers/AdminLayoutCover.vue';
import IndustrialPlatformCover from './covers/IndustrialPlatformCover.vue';
import MobileH5Cover from './covers/MobileH5Cover.vue';
import WikiCover from './covers/WikiCover.vue';
import SaasCover from './covers/SaasCover.vue';

const props = defineProps({
  variant: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '风格示意',
  },
});

const covers = {
  'gov-admin': GovAdminCover,
  'road-admin': RoadAdminCover,
  'public-portal': PublicPortalCover,
  'data-screen': DataScreenCover,
  'visual-novel': VisualNovelCover,
  dossier: DossierCover,
  sonata: SonataCover,
  'pet-widget': PetWidgetCover,
  y2k: Y2kCover,
  movie: MovieCover,
  'anime-game': AnimeGameCover,
  'admin-layout': AdminLayoutCover,
  'industrial-platform': IndustrialPlatformCover,
  'mobile-h5': MobileH5Cover,
  wiki: WikiCover,
  saas: SaasCover,
};

const cover = computed(() => covers[props.variant] || null);
</script>

<template>
  <div v-if="cover" class="style-cover" role="img" :aria-label="`${label}：抽象样式示意`">
    <component :is="cover" />
  </div>
</template>

<style scoped>
.style-cover {
  position: relative;
  width: 100%;
  aspect-ratio: var(--cover-ratio, 16 / 6.6);
  overflow: hidden;
  container-type: inline-size;
  background: #0b0d0f;
}

@media (max-width: 720px) {
  .style-cover {
    aspect-ratio: 16 / 9;
  }
}
</style>
