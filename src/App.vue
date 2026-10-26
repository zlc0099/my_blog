<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import SearchOverlay from '@/components/search/SearchOverlay.vue';
import BackToTop from '@/components/ui/BackToTop.vue';
import ParticleField from '@/components/effects/ParticleField.vue';
import CursorEffects from '@/components/effects/CursorEffects.vue';
import BootScreen from '@/components/effects/BootScreen.vue';
</script>

<template>
  <BootScreen />
  <ParticleField />
  <CursorEffects />

  <a class="skip-link" href="#main">跳到主要内容</a>
  <SiteHeader />
  <main id="main" class="site-main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
  <SearchOverlay />
  <BackToTop />
</template>
