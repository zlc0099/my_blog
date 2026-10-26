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
          <div class="eyebrow eyebrow--accent">
            <span class="eyebrow__tick"></span>
            {{ site.brand }} / {{ site.tagline }}
          </div>
          <p>{{ site.intro }}</p>
          <a :href="site.github" class="site-footer__github" target="_blank" rel="noopener noreferrer">
            GITHUB / @{{ site.owner.callsign }} ↗
          </a>
        </div>

        <nav class="site-footer__col" aria-label="站点导航">
          <div class="eyebrow">INDEX</div>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/posts">内容档案</RouterLink>
          <RouterLink to="/projects">项目记录</RouterLink>
          <RouterLink to="/about">关于我</RouterLink>
        </nav>

        <nav class="site-footer__col" aria-label="档案分类导航">
          <div class="eyebrow">ARCHIVE</div>
          <RouterLink to="/categories/notes">学习记录</RouterLink>
          <RouterLink to="/categories/skill">Skill</RouterLink>
          <RouterLink to="/categories/frontend-prompts">前端提示词</RouterLink>
          <RouterLink to="/categories/backend-prompts">后端提示词</RouterLink>
          <RouterLink to="/categories/ai-division">AI 分工</RouterLink>
        </nav>

        <div class="site-footer__col">
          <div class="eyebrow">SYSTEM</div>
          <RouterLink to="/lab">AI LAB</RouterLink>
          <span>Vue 3 / Vite</span>
          <span>GitHub Pages</span>
          <span>无后端 · 本地数据</span>
          <RouterLink to="/about">关于本站</RouterLink>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>© {{ year }} {{ site.brand }}</span>
        <span class="site-footer__build">LEARN. BUILD. DOCUMENT.</span>
        <button type="button" @click="scrollToTop">BACK TO TOP ↑</button>
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
  display: grid;
  grid-template-columns: minmax(260px, 2fr) repeat(3, minmax(120px, 1fr));
  gap: clamp(28px, 4vw, 56px);
}

.site-footer__brand p {
  max-width: 320px;
  margin: 16px 0 18px;
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

.site-footer__github {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  transition: color var(--dur-fast) var(--ease-out);
}

.site-footer__github:hover {
  color: var(--accent-ink);
}

.site-footer__col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.site-footer__col .eyebrow {
  margin-bottom: 4px;
}

.site-footer__col a,
.site-footer__col span {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.site-footer__col a:hover {
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .site-footer__top {
    grid-template-columns: 1fr;
  }

  .site-footer__brand {
    grid-column: auto;
  }

  .site-footer__bottom {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .site-footer__build {
    display: none;
  }
}
</style>
