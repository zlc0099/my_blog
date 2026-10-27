<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchOverlay } from '@/composables/useSearchOverlay';
import { getSearchResultCount, searchArchive } from '@/lib/search';

const router = useRouter();
const { isSearchOpen, openSearch, closeSearch } = useSearchOverlay();

const dialogRef = ref(null);
const inputRef = ref(null);
const query = ref('');
const activeIndex = ref(0);
const quickQueries = ['Agent', 'MySQL', 'Vue', 'Spring Boot'];

const groups = computed(() => {
  let index = 0;
  return searchArchive(query.value).map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, globalIndex: index++ })),
  }));
});

const results = computed(() => groups.value.flatMap((group) => group.items));
const resultCount = computed(() => getSearchResultCount(groups.value));

function requestClose() {
  if (dialogRef.value?.open) dialogRef.value.close();
  else closeSearch();
}

function onNativeClose() {
  closeSearch();
}

watch(query, () => {
  activeIndex.value = 0;
});

watch(isSearchOpen, async (open) => {
  if (open) {
    query.value = '';
    activeIndex.value = 0;
    await nextTick();
    if (dialogRef.value && !dialogRef.value.open) dialogRef.value.showModal();
    inputRef.value?.focus();
  } else if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
});

function move(delta) {
  if (!results.value.length) return;
  const total = results.value.length;
  activeIndex.value = (activeIndex.value + delta + total) % total;
  nextTick(() => {
    const element = document.querySelector(`[data-search-index="${activeIndex.value}"]`);
    element?.scrollIntoView({ block: 'nearest' });
  });
}

function openActive() {
  const item = results.value[activeIndex.value];
  if (!item) return;
  requestClose();
  router.push(item.to);
}

function runQuickQuery(value) {
  query.value = value;
  inputRef.value?.focus();
}

function onGlobalKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialogRef.value?.open) requestClose();
    else openSearch();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown);
});
</script>

<template>
  <dialog
    ref="dialogRef"
    class="search-dialog"
    aria-labelledby="search-title"
    @close="onNativeClose"
    @click.self="requestClose"
  >
    <div class="search-panel">
      <div class="search-panel__bar">
        <span id="search-title" class="eyebrow eyebrow--accent">
          <span class="eyebrow__tick"></span>
          ARCHIVE SEARCH / 检索
        </span>
        <button class="search-panel__close" type="button" @click="requestClose">ESC ×</button>
      </div>

      <div class="search-field">
        <svg class="search-field__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4" />
          <path d="m13 13 4 4" stroke="currentColor" stroke-width="1.4" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="搜索标题、标签、正文…"
          aria-label="搜索文章和项目"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="openActive"
        />
        <span v-if="query.trim()" class="search-field__count" aria-live="polite">
          {{ resultCount }} RESULTS
        </span>
      </div>

      <div class="search-results">
        <div v-if="!query.trim()" class="search-placeholder">
          <div class="search-placeholder__code">QUERY / 000</div>
          <p>输入关键词开始检索，范围包括文章、项目和提示词。</p>
          <div class="search-placeholder__quick">
            <span class="eyebrow">TRY / 试试</span>
            <button
              v-for="item in quickQueries"
              :key="item"
              type="button"
              class="tag"
              @click="runQuickQuery(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div v-else-if="!groups.length" class="search-empty">
          <div class="search-empty__code">NO MATCHING ENTRIES</div>
          <p>没有找到相关记录，试试更短或更具体的关键词。</p>
        </div>

        <template v-else>
          <section v-for="group in groups" :key="group.type" class="search-group">
            <div class="search-group__label eyebrow">{{ group.label }}</div>
            <ul class="search-group__list">
              <li v-for="item in group.items" :key="`${item.type}-${item.title}`">
                <RouterLink
                  :to="item.to"
                  class="search-result"
                  :class="{ 'is-active': item.globalIndex === activeIndex }"
                  :data-search-index="item.globalIndex"
                  @click="requestClose"
                  @mouseenter="activeIndex = item.globalIndex"
                >
                  <span class="search-result__code">{{ item.code }}</span>
                  <span class="search-result__body">
                    <span class="search-result__title">{{ item.title }}</span>
                    <span class="search-result__excerpt">{{ item.excerpt }}</span>
                  </span>
                  <span class="search-result__meta">{{ item.meta }}</span>
                  <span class="search-result__arrow" aria-hidden="true">→</span>
                </RouterLink>
              </li>
            </ul>
          </section>
        </template>
      </div>

      <div class="search-footer">
        <span>↑↓ SELECT</span>
        <span>ENTER OPEN</span>
        <span>ESC CLOSE</span>
        <span class="search-footer__brand">PERSONAL ARCHIVE / INDEX</span>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.search-dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-body);
}

.search-dialog::backdrop {
  background: var(--overlay);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.search-dialog[open] {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(16px, 9vh, 96px) var(--gutter) 24px;
}

.search-panel {
  position: relative;
  display: flex;
  width: min(100%, 820px);
  max-height: min(740px, calc(100vh - 140px));
  flex-direction: column;
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-panel);
  animation: search-in var(--dur-base) var(--ease-out);
}

.search-panel::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 64px;
  height: 2px;
  background: var(--accent);
}

@keyframes search-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-panel__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.search-panel__close {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  transition: color var(--dur-fast) var(--ease-out);
}

.search-panel__close:hover {
  color: var(--accent-ink);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.search-field__icon {
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--accent);
}

.search-field input {
  width: 100%;
  height: 66px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 20px;
  letter-spacing: 0.01em;
}

.search-field input::placeholder {
  color: var(--text-muted);
}

.search-field__count {
  flex: none;
  color: var(--accent-ink);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.search-results {
  min-height: 220px;
  overflow-y: auto;
  padding: 4px 18px 18px;
}

.search-placeholder,
.search-empty {
  padding: 34px 4px 24px;
}

.search-placeholder__code,
.search-empty__code {
  margin-bottom: 10px;
  color: var(--accent-ink);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
}

.search-placeholder p,
.search-empty p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.search-placeholder__quick {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.search-placeholder__quick .tag {
  cursor: pointer;
}

.search-group__label {
  margin: 18px 0 6px;
}

.search-group__list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.search-result {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) auto 18px;
  gap: 14px;
  align-items: center;
  margin-inline: -10px;
  padding: 11px 10px;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.search-result:hover,
.search-result.is-active {
  background: var(--bg-secondary);
  box-shadow: inset 2px 0 0 var(--accent);
}

.search-result__code {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.search-result__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.search-result__title {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result__excerpt {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result__meta {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.search-result__arrow {
  color: var(--text-muted);
  font-size: 13px;
  transition: transform var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.search-result:hover .search-result__arrow,
.search-result.is-active .search-result__arrow {
  color: var(--accent-ink);
  transform: translateX(2px);
}

.search-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 18px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.search-footer__brand {
  margin-left: auto;
}

@media (max-width: 640px) {
  .search-dialog[open] {
    padding: 0;
    align-items: stretch;
  }

  .search-panel {
    width: 100%;
    height: 100%;
    max-height: none;
    border-top: 0;
    border-right: 0;
    border-left: 0;
  }

  .search-results {
    flex: 1;
  }

  .search-field input {
    height: 58px;
    font-size: 17px;
  }

  .search-field__count {
    display: none;
  }

  .search-result {
    grid-template-columns: 60px minmax(0, 1fr) 16px;
    gap: 10px;
  }

  .search-result__meta {
    display: none;
  }

  .search-result__code {
    font-size: 10px;
  }

  .search-footer__brand {
    display: none;
  }
}
</style>
