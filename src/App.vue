<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import SearchOverlay from '@/components/search/SearchOverlay.vue';
import BackToTop from '@/components/ui/BackToTop.vue';
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <SiteHeader />
  <main id="main" class="site-main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
  <SearchOverlay />
  <BackToTop />
</template>
