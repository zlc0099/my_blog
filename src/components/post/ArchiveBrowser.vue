<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '@/components/ui/PageHero.vue';
import ArchiveRow from '@/components/post/ArchiveRow.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { archiveStats, categoriesWithCount, posts, tags } from '@/lib/content';
import { formatDate, toTagSlug } from '@/lib/format';
import { stripMarkdown } from '@/lib/text';
import { usePageMeta } from '@/composables/usePageMeta';

const props = defineProps({
  eyebrow: {
    type: String,
    default: 'ARCHIVE / CONTENT',
  },
  title: {
    type: String,
    default: 'CONTENT ARCHIVE',
  },
  zh: {
    type: String,
    default: '内容档案',
  },
  description: {
    type: String,
    default: '学习记录、Skill、前端/后端提示词和 AI 分工。按模块、标签或关键词检索。',
  },
  serial: {
    type: String,
    default: 'ARCHIVE / CONTENT',
  },
  lockedCategory: {
    type: String,
    default: '',
  },
  lockedTag: {
    type: String,
    default: '',
  },
});

const PAGE_SIZE = 6;
const route = useRoute();
const router = useRouter();

const searchInput = ref(String(route.query.q || ''));
const limit = ref(PAGE_SIZE);
let searchTimer = null;

const searchTerm = computed(() => String(route.query.q || '').trim());
const activeCategory = computed(() => props.lockedCategory || String(route.query.category || ''));
const activeTag = computed(() => props.lockedTag || String(route.query.tag || ''));

const filteredPosts = computed(() => {
  const keyword = searchTerm.value.toLowerCase();
  return posts.filter((post) => {
    if (activeCategory.value && post.category !== activeCategory.value) return false;
    if (
      activeTag.value &&
      !post.tags.some((tag) => toTagSlug(tag) === activeTag.value)
    ) {
      return false;
    }
    if (!keyword) return true;

    const haystack = [
      post.title,
      post.summary,
      post.categoryInfo.en,
      post.categoryInfo.zh,
      post.tags.join(' '),
      stripMarkdown(post.body),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  });
});

const visiblePosts = computed(() => filteredPosts.value.slice(0, limit.value));
const remaining = computed(() => Math.max(0, filteredPosts.value.length - visiblePosts.value.length));
const hasFilters = computed(() =>
  Boolean(
    searchTerm.value ||
      searchInput.value ||
      (!props.lockedCategory && activeCategory.value) ||
      (!props.lockedTag && activeTag.value),
  ),
);

const heroMeta = computed(() => [
  { label: 'FILES', value: String(archiveStats.postCount).padStart(2, '0') },
  { label: 'MATCHED', value: String(filteredPosts.value.length).padStart(2, '0') },
  { label: 'UPDATED', value: formatDate(archiveStats.latestUpdate) },
]);

usePageMeta(() => ({
  title: props.zh ? `${props.title} / ${props.zh}` : props.title,
  description: props.description,
}));

watch(
  () => route.query.q,
  (value) => {
    const next = String(value || '');
    if (next !== searchInput.value) searchInput.value = next;
  },
);

watch(searchInput, (value) => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    const next = value.trim();
    if (next === searchTerm.value) return;
    updateQuery({ q: next || undefined });
  }, 220);
});

watch([activeCategory, activeTag], () => {
  limit.value = PAGE_SIZE;
});

watch([() => props.lockedCategory, () => props.lockedTag], () => {
  limit.value = PAGE_SIZE;
  searchInput.value = '';
  const nextQuery = { ...route.query };
  delete nextQuery.q;
  delete nextQuery.tag;
  if (Object.keys(nextQuery).length !== Object.keys(route.query).length) {
    router.replace({ path: route.path, query: nextQuery });
  }
});

function updateQuery(patch) {
  const next = { ...route.query };
  Object.entries(patch).forEach(([key, value]) => {
    if (value) next[key] = value;
    else delete next[key];
  });
  router.replace({ path: route.path, query: next });
}

function setCategory(slug) {
  if (slug === 'skill') {
    router.push('/categories/skill');
    return;
  }
  updateQuery({ category: slug || undefined });
}

function toggleTag(slug) {
  updateQuery({ tag: activeTag.value === slug ? undefined : slug });
}

function clearSearch() {
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  updateQuery({ q: undefined });
}

function clearFilters() {
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  const next = { ...route.query };
  delete next.q;
  delete next.tag;
  if (!props.lockedCategory) delete next.category;
  router.replace({ path: route.path, query: next });
}

function loadMore() {
  limit.value += PAGE_SIZE;
}

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer);
});
</script>

<template>
  <div>
    <PageHero
      :eyebrow="eyebrow"
      :title="title"
      :zh="zh"
      :description="description"
      :serial="serial"
      :meta="heroMeta"
    />

    <section class="archive-section">
      <div class="container">
        <div class="archive-controls">
          <div class="archive-search-row">
            <div class="archive-search">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4" />
                <path d="m13 13 4 4" stroke="currentColor" stroke-width="1.4" />
              </svg>
              <input
                v-model="searchInput"
                type="search"
                placeholder="搜索标题、摘要、标签或正文…"
                aria-label="搜索学习档案"
                autocomplete="off"
                spellcheck="false"
              />
              <button
                v-if="searchInput"
                class="archive-search__clear"
                type="button"
                aria-label="清空搜索"
                @click="clearSearch"
              >
                ×
              </button>
            </div>

            <div class="archive-summary mono">
              <span>SHOWING {{ String(visiblePosts.length).padStart(2, '0') }} / {{ String(filteredPosts.length).padStart(2, '0') }}</span>
              <button v-if="hasFilters" type="button" class="archive-clear" @click="clearFilters">
                CLEAR FILTERS ×
              </button>
            </div>
          </div>

          <div v-if="!lockedCategory" class="filter-group">
            <span class="eyebrow filter-group__label">CATEGORY</span>
            <div class="filter-options">
              <button
                type="button"
                class="filter-chip"
                :class="{ 'is-active': !activeCategory }"
                @click="setCategory('')"
              >
                全部 <span>{{ String(posts.length).padStart(2, '0') }}</span>
              </button>
              <button
                v-for="category in categoriesWithCount"
                :key="category.slug"
                type="button"
                class="filter-chip"
                :class="{ 'is-active': activeCategory === category.slug }"
                @click="setCategory(category.slug)"
              >
                {{ category.zh }} <span>{{ String(category.count).padStart(2, '0') }}</span>
              </button>
            </div>
          </div>

          <div v-if="!lockedTag && tags.length" class="filter-group">
            <span class="eyebrow filter-group__label">TAGS</span>
            <div class="filter-options">
              <button
                v-for="tag in tags"
                :key="tag.slug"
                type="button"
                class="filter-chip filter-chip--tag"
                :class="{ 'is-active': activeTag === tag.slug }"
                @click="toggleTag(tag.slug)"
              >
                #{{ tag.name }} <span>{{ tag.count }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="visiblePosts.length" class="archive-list">
          <ArchiveRow v-for="post in visiblePosts" :key="post.slug" :post="post" />
        </div>

        <EmptyState
          v-else-if="posts.length"
          code="ARCHIVE / NO MATCH"
          title="没有匹配的档案"
          description="试着缩短关键词，或者清除当前筛选条件。"
        >
          <button type="button" class="btn btn--compact" @click="clearFilters">
            CLEAR FILTERS
          </button>
        </EmptyState>

        <EmptyState
          v-else
          code="ARCHIVE / EMPTY"
          title="档案还没有内容"
          description="内容整理中，稍后再来看看。"
        />

        <div v-if="remaining > 0" class="archive-load">
          <button type="button" class="btn" @click="loadMore">
            LOAD MORE <span class="mono archive-load__count">+{{ remaining }}</span>
          </button>
        </div>

        <p v-else-if="filteredPosts.length > PAGE_SIZE" class="archive-end mono">
          END OF INDEX / 已显示全部 {{ filteredPosts.length }} 条记录
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.archive-section {
  padding-block: clamp(28px, 4vw, 44px) 0;
}

.archive-controls {
  padding-bottom: 26px;
  border-bottom: 1px solid var(--border-subtle);
}

.archive-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.archive-search {
  display: flex;
  width: min(100%, 540px);
  height: 48px;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.archive-search:focus-within {
  border-color: var(--accent);
}

.archive-search svg {
  width: 17px;
  height: 17px;
  flex: none;
  color: var(--text-muted);
}

.archive-search input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 13.5px;
}

.archive-search input::placeholder {
  color: var(--text-muted);
}

.archive-search input::-webkit-search-cancel-button {
  display: none;
}

.archive-search__clear {
  flex: none;
  color: var(--text-muted);
  font-size: 18px;
  line-height: 1;
}

.archive-search__clear:hover {
  color: var(--accent-ink);
}

.archive-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.archive-clear {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  transition: color var(--dur-fast) var(--ease-out);
}

.archive-clear:hover {
  color: var(--accent-ink);
}

.filter-group {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 16px;
  margin-top: 20px;
  align-items: start;
}

.filter-group__label {
  padding-top: 7px;
  font-size: 10px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  transition: color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.filter-chip span {
  color: var(--text-muted);
  font-size: 10px;
}

.filter-chip:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.filter-chip.is-active {
  border-color: var(--accent-line);
  background: var(--accent-muted);
  color: var(--accent-ink);
}

.filter-chip.is-active span {
  color: var(--accent-ink);
}

.filter-chip--tag {
  height: 26px;
  padding: 0 8px;
  font-size: 10px;
  border-color: transparent;
}

.filter-chip--tag:hover,
.filter-chip--tag.is-active {
  border-color: var(--accent-line);
}

.archive-list {
  border-bottom: 0;
}

.archive-section :deep(.empty-state) {
  margin-top: 28px;
}

.archive-load {
  display: flex;
  justify-content: center;
  margin-top: 34px;
}

.archive-load__count {
  color: var(--text-muted);
  font-size: 10px;
}

.archive-end {
  margin-top: 28px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-align: center;
}

@media (max-width: 900px) {
  .archive-search-row {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .archive-search {
    width: 100%;
  }

  .archive-summary {
    justify-content: space-between;
  }

  .filter-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .filter-group__label {
    padding-top: 0;
  }
}

@media (max-width: 560px) {
  .filter-chip {
    height: 28px;
    padding: 0 8px;
    font-size: 10px;
  }

  .archive-summary {
    font-size: 10px;
  }
}
</style>
