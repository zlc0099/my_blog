<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import ArchiveCard from '@/components/post/ArchiveCard.vue';
import ArchivePagination from '@/components/post/ArchivePagination.vue';
import { posts } from '@/lib/content';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'SKILL ARCHIVE / 技能档案',
  description: '自制 Skill 与常用非自制 Skill 的档案索引；自制技能完整源码放在 GitHub 的 myskill 目录。',
});

const PAGE_SIZE = 9;
const route = useRoute();
const router = useRouter();
const sectionRef = ref(null);

const skillPosts = computed(() => posts.filter((post) => post.category === 'skill'));
const selfSkills = computed(() => skillPosts.value.filter((post) => post.skillType === 'self'));
const commonSkills = computed(() => skillPosts.value.filter((post) => post.skillType !== 'self'));

const currentPage = ref(Math.max(1, Number(route.query.page) || 1));
const totalPages = computed(() => Math.max(1, Math.ceil(skillPosts.value.length / PAGE_SIZE)));
const safePage = computed(() => Math.min(currentPage.value, totalPages.value));
const pagedSkills = computed(() => {
  const start = (safePage.value - 1) * PAGE_SIZE;
  return skillPosts.value.slice(start, start + PAGE_SIZE);
});
const pageSelfSkills = computed(() => pagedSkills.value.filter((post) => post.skillType === 'self'));
const pageCommonSkills = computed(() => pagedSkills.value.filter((post) => post.skillType !== 'self'));

const heroMeta = computed(() => [
  { label: 'SELF-MADE', value: String(selfSkills.value.length).padStart(2, '0') },
  { label: 'COMMON', value: String(commonSkills.value.length).padStart(2, '0') },
  { label: 'TOTAL', value: String(skillPosts.value.length).padStart(2, '0') },
]);

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
    const query = { ...route.query };
    if (total > 1) query.page = String(total);
    else delete query.page;
    router.replace({ path: route.path, query });
  },
  { immediate: true },
);

function goToPage(page) {
  const next = Math.max(1, Math.min(totalPages.value, page));
  if (next === safePage.value) return;

  currentPage.value = next;
  const query = { ...route.query };
  if (next > 1) query.page = String(next);
  else delete query.page;
  router.replace({ path: route.path, query });

  nextTick(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRef.value?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  });
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="ARCHIVE / SKILL"
      title="SKILL ARCHIVE"
      zh="技能档案"
      description="分成两栏：我自己写的 Skill，以及平时在用、但不是自制的 Skill。自制技能的完整源码在 GitHub 的 myskill 目录。"
      serial="ARCHIVE / SKILL"
      :meta="heroMeta"
    />

    <section ref="sectionRef" class="section skill-section">
      <div class="container">
        <div v-if="pageSelfSkills.length" class="skill-group">
          <SectionHeading index="01" title="SELF-MADE SKILL" zh="自制 Skill">
            <template #action>
              <a
                :href="`${site.repo}/tree/main/myskill`"
                class="skill-group__github mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB / myskill ↗
              </a>
            </template>
          </SectionHeading>

          <p class="skill-group__note">
            这三份技能是我自己维护的，完整目录（SKILL.md、references、脚本）在 GitHub 的
            <a :href="`${site.repo}/tree/main/myskill`" target="_blank" rel="noopener noreferrer">myskill</a>
            下。文章正文展示 SKILL.md 主体。
          </p>

          <div class="skill-grid">
            <ArchiveCard v-for="post in pageSelfSkills" :key="post.slug" :post="post" />
          </div>
        </div>

        <div v-if="pageCommonSkills.length" class="skill-group">
          <SectionHeading index="02" title="COMMON SKILL" zh="常用 Skill（非自制）" />

          <p class="skill-group__note">
            平时在用的非自制 Skill，按用途整理。
          </p>

          <div class="skill-grid">
            <ArchiveCard v-for="post in pageCommonSkills" :key="post.slug" :post="post" />
          </div>
        </div>

        <ArchivePagination
          :page="safePage"
          :total-pages="totalPages"
          :total="skillPosts.length"
          @update:page="goToPage"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.skill-section {
  padding-top: clamp(32px, 5vw, 52px);
  scroll-margin-top: calc(var(--header-height) + 24px);
}

.skill-group + .skill-group {
  margin-top: clamp(48px, 7vw, 76px);
}

.skill-group__note {
  max-width: 800px;
  margin-top: -12px;
  margin-bottom: 22px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.85;
}

.skill-group__note a {
  color: var(--text-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border-strong);
}

.skill-group__note a:hover {
  color: var(--accent-ink);
}

.skill-group__github {
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 0.06em;
  transition: color var(--dur-fast) var(--ease-out);
}

.skill-group__github:hover {
  color: var(--accent-ink);
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px 22px;
}

@media (max-width: 1100px) {
  .skill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .skill-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
}
</style>
