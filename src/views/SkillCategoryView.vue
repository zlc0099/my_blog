<script setup>
import { computed } from 'vue';
import PageHero from '@/components/ui/PageHero.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import ArchiveRow from '@/components/post/ArchiveRow.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import { posts } from '@/lib/content';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: 'SKILL ARCHIVE / 技能档案',
  description: '自制 Skill 与常用非自制 Skill 的档案索引；自制技能完整源码放在 GitHub 的 myskill 目录。',
});

const skillPosts = computed(() => posts.filter((post) => post.category === 'skill'));
const selfSkills = computed(() => skillPosts.value.filter((post) => post.skillType === 'self'));
const commonSkills = computed(() => skillPosts.value.filter((post) => post.skillType !== 'self'));

const heroMeta = computed(() => [
  { label: 'SELF-MADE', value: String(selfSkills.value.length).padStart(2, '0') },
  { label: 'COMMON', value: String(commonSkills.value.length).padStart(2, '0') },
  { label: 'TOTAL', value: String(skillPosts.value.length).padStart(2, '0') },
]);
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

    <section class="section skill-section">
      <div class="container">
        <div class="skill-group">
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

          <div v-if="selfSkills.length" class="archive-list">
            <ArchiveRow v-for="post in selfSkills" :key="post.slug" :post="post" />
          </div>
          <EmptyState v-else code="SKILL / SELF-EMPTY" title="还没有自制 Skill 记录" description="本地 Skill 还在整理中。" />
        </div>

        <div class="skill-group">
          <SectionHeading index="02" title="COMMON SKILL" zh="常用 Skill（非自制）" />

          <p class="skill-group__note">
            来自插件、市场或本地安装的常用 Skill。不是每份都跟着仓库上传；文章里标注了来源和实际调用情况。
          </p>

          <div v-if="commonSkills.length" class="archive-list">
            <ArchiveRow v-for="post in commonSkills" :key="post.slug" :post="post" />
          </div>
          <EmptyState v-else code="SKILL / COMMON-EMPTY" title="还没有常用 Skill 记录" description="安装记录还在整理中。" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.skill-section {
  padding-top: clamp(32px, 5vw, 52px);
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

.archive-list {
  border-top: 1px solid var(--border-subtle);
}
</style>
