<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '@/components/ui/PageHero.vue';
import ArchiveCard from '@/components/post/ArchiveCard.vue';
import ArchivePagination from '@/components/post/ArchivePagination.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { archiveStats, categoriesWithCount, posts } from '@/lib/content';
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
    default: '学习记录、Skill、前端/后端提示词和 AI 分工。按分类或关键词检索。',
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

const PAGE_SIZE = 9;
const route = useRoute();
const router = useRouter();

const searchInput = ref(String(route.query.q || ''));
const currentPage = ref(Math.max(1, Number(route.query.page) || 1));
const gridRef = ref(null);
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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)));
const safePage = computed(() => Math.min(currentPage.value, totalPages.value));
const pagedPosts = computed(() => {
  const start = (safePage.value - 1) * PAGE_SIZE;
  return filteredPosts.value.slice(start, start + PAGE_SIZE);
});
const pageStart = computed(() =>
  filteredPosts.value.length ? (safePage.value - 1) * PAGE_SIZE + 1 : 0,
);
const pageEnd = computed(() => Math.min(safePage.value * PAGE_SIZE, filteredPosts.value.length));
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
    currentPage.value = 1;
    updateQuery({ q: next || undefined, page: undefined });
  }, 220);
});

watch([() => props.lockedCategory, () => props.lockedTag], () => {
  currentPage.value = 1;
  searchInput.value = '';
  const nextQuery = { ...route.query };
  delete nextQuery.q;
  delete nextQuery.tag;
  delete nextQuery.page;
  if (Object.keys(nextQuery).length !== Object.keys(route.query).length) {
    router.replace({ path: route.path, query: nextQuery });
  }
});

watch(
  () => route.query.page,
  (value) => {
    currentPage.value = Math.max(1, Number(value) || 1);
  },
);

watch(
  totalPages,
  (total) => {
    if (currentPage.value <= total) return;
    currentPage.value = total;
    updateQuery({ page: total > 1 ? total : undefined });
  },
  { immediate: true },
);

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
  currentPage.value = 1;
  updateQuery({ category: slug || undefined, page: undefined });
}

function clearSearch() {
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  currentPage.value = 1;
  updateQuery({ q: undefined, page: undefined });
}

function clearFilters() {
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  currentPage.value = 1;
  const next = { ...route.query };
  delete next.q;
  delete next.tag;
  delete next.page;
  if (!props.lockedCategory) delete next.category;
  router.replace({ path: route.path, query: next });
}

function goToPage(page) {
  const next = Math.max(1, Math.min(totalPages.value, page));
  if (next === safePage.value) return;

  currentPage.value = next;
  updateQuery({ page: next > 1 ? next : undefined });

  nextTick(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gridRef.value?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  });
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
              <span>SHOWING {{ String(pageStart).padStart(2, '0') }}–{{ String(pageEnd).padStart(2, '0') }} / {{ String(filteredPosts.length).padStart(2, '0') }}</span>
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
        </div>

        <div v-if="pagedPosts.length" ref="gridRef" class="archive-grid">
          <ArchiveCard v-for="post in pagedPosts" :key="post.slug" :post="post" />
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

        <ArchivePagination
          :page="safePage"
          :total-pages="totalPages"
          :total="filteredPosts.length"
          @update:page="goToPage"
        />
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

.archive-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px 22px;
  margin-top: 28px;
  scroll-margin-top: calc(var(--header-height) + 24px);
}

.archive-section :deep(.empty-state) {
  margin-top: 28px;
}

@media (max-width: 1100px) {
  .archive-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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

@media (max-width: 700px) {
  .archive-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
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
