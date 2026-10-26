<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { site } from '@/data/site';
import { useTheme } from '@/composables/useTheme';
import { useSearchOverlay } from '@/composables/useSearchOverlay';

const route = useRoute();
const { theme, toggleTheme } = useTheme();
const { openSearch } = useSearchOverlay();

const navItems = [
  { index: '00', label: '首页', en: 'HOME', to: '/', match: ['/'] },
  { index: '01', label: '档案', en: 'ARCHIVE', to: '/posts', match: ['/posts', '/categories', '/tags'] },
  { index: '02', label: '项目', en: 'PROJECTS', to: '/projects', match: ['/projects'] },
  { index: '03', label: 'AI LAB', en: 'LAB', to: '/lab', match: ['/lab'] },
  { index: '04', label: '时间线', en: 'TIMELINE', to: '/timeline', match: ['/timeline'] },
];

const year = new Date().getFullYear();
const isScrolled = ref(false);
const menuOpen = ref(false);
const menuButton = ref(null);
const closeButton = ref(null);
let previousOverflow = '';

function isActive(item) {
  if (item.to === '/') return route.path === '/';
  return item.match.some((base) => route.path === base || route.path.startsWith(`${base}/`));
}

function onScroll() {
  isScrolled.value = window.scrollY > 12;
}

function openMenu() {
  menuOpen.value = true;
}

function closeMenu(restoreFocus = true) {
  menuOpen.value = false;
  if (restoreFocus) nextTick(() => menuButton.value?.focus());
}

function toggleMenu() {
  if (menuOpen.value) closeMenu(true);
  else openMenu();
}

function openSearchFromMenu() {
  closeMenu(false);
  openSearch();
}

function onKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) closeMenu(true);
}

watch(menuOpen, (open) => {
  if (open) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nextTick(() => closeButton.value?.focus());
  } else {
    document.body.style.overflow = previousOverflow;
  }
});

watch(
  () => route.fullPath,
  () => closeMenu(false),
);

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = previousOverflow;
});
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand" aria-label="PERSONAL ARCHIVE 首页">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 36 36">
            <path d="M4 4h21l7 7v21H4z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M25 4v7h7" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M11 16h14M11 21h14M11 26h8" stroke="currentColor" stroke-width="1.5" />
            <rect x="22" y="24" width="5" height="5" fill="#F5A623" />
          </svg>
        </span>
        <span class="brand__text">
          <span class="brand__name">{{ site.brand }}</span>
          <span class="brand__sub">{{ site.tagline }} / 001</span>
        </span>
      </RouterLink>

      <nav class="site-nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="site-nav__link"
          :class="{ 'is-active': isActive(item) }"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <span class="site-nav__index">{{ item.index }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button
          class="header-action header-action--search"
          type="button"
          aria-label="打开搜索"
          @click="openSearch"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4" />
            <path d="m13 13 4 4" stroke="currentColor" stroke-width="1.4" />
          </svg>
          <span class="header-action__label">SEARCH</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button
          class="header-action header-action--icon"
          type="button"
          :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          :title="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'dark'" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="3.2" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M16 4l-1.4 1.4M5.4 14.6 4 16"
              stroke="currentColor"
              stroke-width="1.4"
            />
          </svg>
          <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M16.5 12.7A7 7 0 0 1 7.3 3.5a7 7 0 1 0 9.2 9.2Z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <RouterLink
          to="/about"
          class="header-action header-action--about"
          :class="{ 'is-active': route.path === '/about' }"
        >
          <span class="header-action__label">关于</span>
        </RouterLink>

        <button
          ref="menuButton"
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="站内导航"
      >
        <div class="mobile-menu__top">
          <span class="eyebrow eyebrow--accent">
            <span class="eyebrow__tick"></span>
            NAVIGATION / 导航
          </span>
          <button ref="closeButton" class="mobile-menu__close" type="button" @click="closeMenu(true)">
            CLOSE ×
          </button>
        </div>

        <nav class="mobile-menu__nav" aria-label="移动端导航">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="{ 'is-active': isActive(item) }"
            :aria-current="isActive(item) ? 'page' : undefined"
            @click="closeMenu(false)"
          >
            <span class="mobile-menu__index">{{ item.index }}</span>
            <span class="mobile-menu__label">{{ item.label }}</span>
            <span class="mobile-menu__en">{{ item.en }}</span>
          </RouterLink>
          <RouterLink to="/about" :class="{ 'is-active': route.path === '/about' }" @click="closeMenu(false)">
            <span class="mobile-menu__index">05</span>
            <span class="mobile-menu__label">关于</span>
            <span class="mobile-menu__en">ABOUT</span>
          </RouterLink>
        </nav>

        <div class="mobile-menu__actions">
          <button type="button" @click="openSearchFromMenu">搜索 / SEARCH</button>
          <button type="button" @click="toggleTheme">
            主题 / {{ theme === 'dark' ? '浅色模式' : '深色模式' }}
          </button>
          <a :href="site.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>

        <div class="mobile-menu__foot mono">
          <span>PERSONAL ARCHIVE</span>
          <span>© {{ year }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);
  border-bottom: 1px solid transparent;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  transition: border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-out);
}

.site-header.is-scrolled {
  border-bottom-color: var(--border-subtle);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.site-header__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.brand__mark {
  flex: none;
  width: 30px;
  height: 30px;
  color: var(--text-primary);
}

.brand__mark svg {
  width: 100%;
  height: 100%;
}

.brand__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.brand__name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.brand__sub {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.16em;
  line-height: 1;
  white-space: nowrap;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.site-nav__link {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 9px 12px;
  color: var(--text-secondary);
  font-size: 13.5px;
  transition: color var(--dur-fast) var(--ease-out);
}

.site-nav__link::after {
  content: '';
  position: absolute;
  right: 12px;
  bottom: 0;
  left: 12px;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-base) var(--ease-out);
}

.site-nav__link:hover {
  color: var(--text-primary);
}

.site-nav__link.is-active {
  color: var(--text-primary);
}

.site-nav__link.is-active::after {
  transform: scaleX(1);
}

.site-nav__index {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.06em;
}

.site-nav__link.is-active .site-nav__index {
  color: var(--accent-ink);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.header-action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.header-action:hover {
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.header-action--icon {
  width: 34px;
  justify-content: center;
  padding: 0;
}

.header-action svg {
  width: 16px;
  height: 16px;
}

.header-action kbd {
  padding: 2px 5px;
  border: 1px solid var(--border-primary);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.05em;
}

.header-action--about.is-active {
  color: var(--accent-ink);
}

.menu-toggle {
  display: none;
  width: 36px;
  height: 34px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid var(--border-primary);
}

.menu-toggle span {
  width: 16px;
  height: 1px;
  background: var(--text-primary);
  transition: transform var(--dur-base) var(--ease-out);
}

.menu-toggle[aria-expanded='true'] span:first-child {
  transform: translateY(3px) rotate(45deg);
}

.menu-toggle[aria-expanded='true'] span:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 20px var(--gutter) 28px;
  background: var(--bg-primary);
  overflow-y: auto;
}

.mobile-menu::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 240px;
  height: 240px;
  border: 1px solid var(--accent-line);
  background: var(--accent-muted);
  transform: rotate(18deg);
  pointer-events: none;
}

.mobile-menu__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 4px 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-menu__close {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.mobile-menu__close:hover {
  color: var(--accent-ink);
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
}

.mobile-menu__nav a {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: baseline;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-menu__index {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
}

.mobile-menu__label {
  font-size: 26px;
  font-weight: 500;
  line-height: 1.1;
}

.mobile-menu__en {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
}

.mobile-menu__nav a.is-active .mobile-menu__label,
.mobile-menu__nav a:hover .mobile-menu__label {
  color: var(--accent-ink);
}

.mobile-menu__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.mobile-menu__actions button,
.mobile-menu__actions a {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mobile-menu__actions button:hover,
.mobile-menu__actions a:hover {
  border-color: var(--accent-line);
  color: var(--accent-ink);
}

.mobile-menu__foot {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 40px;
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1180px) {
  .header-action__label,
  .header-action kbd {
    display: none;
  }

  .header-action--search {
    width: 34px;
    justify-content: center;
    padding: 0;
  }
}

@media (max-width: 980px) {
  .site-header__inner {
    grid-template-columns: 1fr auto;
  }

  .site-nav,
  .header-action--about {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }
}

@media (max-width: 560px) {
  .brand__sub {
    display: none;
  }

  .brand__name {
    font-size: 18px;
  }

  .brand__mark {
    width: 26px;
    height: 26px;
  }
}
</style>
