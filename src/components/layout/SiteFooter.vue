<script setup>
import { site } from '@/data/site';
import { scrollToTop } from '@/lib/scroll';

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <div class="site-footer__mark" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <span class="site-footer__name">{{ site.brand }}</span>
          <p>{{ site.intro }}</p>
        </div>

        <nav class="site-footer__nav" aria-label="页脚导航">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/posts">档案</RouterLink>
          <RouterLink to="/projects">项目</RouterLink>
          <RouterLink to="/lab">AI LAB</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
          <a :href="site.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <span>© {{ year }} {{ site.brand }}</span>
        <button type="button" @click="scrollToTop">回到顶部 ↑</button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  margin-top: clamp(32px, 5vw, 64px);
  border-top: 1px solid var(--border-subtle);
  padding-block: clamp(40px, 6vw, 64px) 24px;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--gutter);
  width: 56px;
  height: 1px;
  background: var(--accent);
}

.site-footer__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(28px, 6vw, 80px);
}

.site-footer__brand p {
  max-width: 320px;
  margin: 16px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.site-footer__mark {
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
}

.site-footer__mark span {
  display: block;
  width: 22px;
  height: 3px;
  background: var(--border-strong);
}

.site-footer__mark span:first-child {
  width: 42px;
  background: var(--accent);
}

.site-footer__name {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 22px;
  padding-top: 4px;
}

.site-footer__nav a {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  transition: color var(--dur-fast) var(--ease-out);
}

.site-footer__nav a:hover {
  color: var(--accent-ink);
}

.site-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: clamp(40px, 6vw, 64px);
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
}

.site-footer__bottom button {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  transition: color var(--dur-fast) var(--ease-out);
}

.site-footer__bottom button:hover {
  color: var(--accent-ink);
}

@media (max-width: 900px) {
  .site-footer__top {
    flex-direction: column;
    gap: 28px;
  }
}

@media (max-width: 560px) {
  .site-footer__bottom {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
