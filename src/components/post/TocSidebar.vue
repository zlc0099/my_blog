<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  headings: {
    type: Array,
    default: () => [],
  },
});

const activeId = ref('');

let ticking = false;

function updateActive() {
  ticking = false;
  if (!props.headings.length) return;

  let current = props.headings[0].id;
  for (const heading of props.headings) {
    const element = document.getElementById(heading.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= 150) current = heading.id;
    else break;
  }
  activeId.value = current;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateActive);
}

function select(id) {
  activeId.value = id;
}

onMounted(() => {
  updateActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});

watch(
  () => props.headings,
  () => nextTick(updateActive),
  { deep: true },
);
</script>

<template>
  <aside v-if="headings.length" class="toc-sidebar">
    <div class="toc-sidebar__head">
      <span class="eyebrow">目录</span>
      <span class="toc-sidebar__count mono">{{ String(headings.length).padStart(2, '0') }}</span>
    </div>

    <nav class="toc-sidebar__nav" aria-label="文章目录">
      <ol class="toc-sidebar__list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="[`toc-sidebar__item--h${heading.level}`, { 'is-active': activeId === heading.id }]"
        >
          <a :href="`#${heading.id}`" @click="select(heading.id)">
            <span class="toc-sidebar__marker" aria-hidden="true"></span>
            <span class="toc-sidebar__text">{{ heading.text }}</span>
          </a>
        </li>
      </ol>
    </nav>
  </aside>
</template>

<style scoped>
.toc-sidebar {
  position: sticky;
  top: calc(var(--header-height) + 32px);
  display: flex;
  max-height: calc(100vh - var(--header-height) - 64px);
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
  padding-left: 20px;
}

.toc-sidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.toc-sidebar__count {
  color: var(--text-muted);
  font-size: 10px;
}

.toc-sidebar__nav {
  min-height: 0;
  overflow-y: auto;
  padding-block: 10px;
}

.toc-sidebar__list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.toc-sidebar__list a {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 6px 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
  transition: color var(--dur-fast) var(--ease-out);
}

.toc-sidebar__list a:hover {
  color: var(--text-primary);
}

.toc-sidebar__marker {
  flex: none;
  width: 5px;
  height: 5px;
  margin-top: 7px;
  border: 1px solid var(--border-strong);
  transition: background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.toc-sidebar__item--h3 a {
  padding-left: 14px;
  font-size: 11.5px;
}

.toc-sidebar__item--h4 a {
  padding-left: 28px;
  font-size: 11px;
}

.toc-sidebar__list li.is-active a {
  color: var(--text-primary);
}

.toc-sidebar__list li.is-active .toc-sidebar__marker {
  border-color: var(--accent);
  background: var(--accent);
}

.toc-sidebar__text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
