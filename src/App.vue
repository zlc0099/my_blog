<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import SearchOverlay from '@/components/search/SearchOverlay.vue';
import BackToTop from '@/components/ui/BackToTop.vue';
import ParticleField from '@/components/effects/ParticleField.vue';
import IndustrialBackdrop from '@/components/effects/IndustrialBackdrop.vue';
import CursorEffects from '@/components/effects/CursorEffects.vue';
import BootScreen from '@/components/effects/BootScreen.vue';
</script>

<template>
  <BootScreen />
  <ParticleField />
  <IndustrialBackdrop />
  <CursorEffects />

  <a class="skip-link" href="#main">跳到主要内容</a>
  <SiteHeader />
  <main id="main" class="site-main" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
  <SearchOverlay />
  <BackToTop />
</template>

<style>
.route-enter-active,
.route-leave-active {
  will-change: opacity, transform;
}

.route-enter-active {
  transition: opacity 0.34s var(--ease-out), transform 0.34s var(--ease-out);
}

.route-leave-active {
  transition: opacity 0.18s var(--ease-out), transform 0.18s var(--ease-out);
  pointer-events: none;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .route-enter-active,
  .route-leave-active {
    transition: none;
  }
}
</style>
