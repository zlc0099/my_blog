<script setup>
import { archiveStats, categoriesWithCount, projects } from '@/lib/content';

const bySlug = Object.fromEntries(categoriesWithCount.map((category) => [category.slug, category]));
const order = ['backend', 'ai-tools', 'frontend', 'database', 'engineering'];

const domains = [
  ...order.map((slug, index) => {
    const category = bySlug[slug];
    return {
      no: String(index + 1).padStart(2, '0'),
      variant: index % 3,
      en: category.en,
      zh: category.zh,
      desc: category.desc,
      count: category.count,
      unit: 'ENTRIES',
      to: `/categories/${category.slug}`,
    };
  }),
  {
    no: '06',
    variant: 2,
    en: 'PROJECT LOG',
    zh: '项目记录',
    desc: '可运行的项目与完整实现记录',
    count: projects.length,
    unit: 'OPS',
    to: '/projects',
  },
];

const totalEntries = archiveStats.postCount;
</script>

<template>
  <div class="domains-wrap">
    <div class="domains">
      <RouterLink
        v-for="domain in domains"
        :key="domain.to"
        :to="domain.to"
        class="domain"
      >
        <span class="domain__no mono">{{ domain.no }}</span>

        <span class="domain__glyph" aria-hidden="true">
          <svg viewBox="0 0 160 160" fill="none">
            <template v-if="domain.variant === 0">
              <circle cx="108" cy="52" r="36" stroke="currentColor" stroke-width="1" />
              <line x1="16" y1="138" x2="144" y2="10" stroke="currentColor" stroke-width="1" />
              <rect x="24" y="108" width="18" height="18" fill="var(--accent)" />
            </template>
            <template v-else-if="domain.variant === 1">
              <path d="M8 118h144M8 96h96M8 74h52" stroke="currentColor" stroke-width="1" />
              <rect x="104" y="24" width="38" height="38" stroke="currentColor" stroke-width="1" />
              <rect x="116" y="36" width="14" height="14" fill="var(--accent)" />
            </template>
            <template v-else>
              <path d="M18 18h62v62H18zM80 80h62v62H80z" stroke="currentColor" stroke-width="1" />
              <path d="M18 80h62M80 18v62" stroke="currentColor" stroke-width="1" />
              <rect x="106" y="24" width="12" height="12" fill="var(--accent)" />
            </template>
          </svg>
        </span>

        <div class="domain__content">
          <span class="eyebrow">{{ domain.en }}</span>
          <h3>{{ domain.zh }}</h3>
          <p>{{ domain.desc }}</p>
        </div>

        <div class="domain__foot">
          <span class="domain__count mono">
            {{ String(domain.count).padStart(2, '0') }} {{ domain.unit }}
          </span>
          <span class="domain__arrow" aria-hidden="true">→</span>
        </div>
      </RouterLink>
    </div>

    <div class="domains-wrap__meta mono">
      <span>{{ String(totalEntries).padStart(2, '0') }} FILES / {{ domains.length }} DOMAINS</span>
      <span>INDEX UPDATED / {{ archiveStats.latestUpdate?.replaceAll('-', '.') }}</span>
    </div>
  </div>
</template>

<style scoped>
.domains {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.domain {
  position: relative;
  display: flex;
  min-height: 186px;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  background: var(--bg-primary);
  overflow: hidden;
  transition: background-color var(--dur-base) var(--ease-out);
}

.domain:nth-child(1) {
  grid-column: span 7;
  min-height: 256px;
}

.domain:nth-child(2) {
  grid-column: span 5;
  min-height: 256px;
}

.domain:nth-child(n + 3) {
  grid-column: span 3;
}

.domain::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease-out);
}

.domain:hover {
  background: var(--bg-secondary);
}

.domain:hover::before {
  width: 54px;
}

.domain__no {
  position: absolute;
  top: 20px;
  right: 22px;
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.domain__glyph {
  position: absolute;
  right: -16px;
  bottom: 22px;
  width: 150px;
  height: 150px;
  color: var(--border-primary);
  opacity: 0.75;
  transition: transform var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
}

.domain:nth-child(1) .domain__glyph,
.domain:nth-child(2) .domain__glyph {
  right: 16px;
  bottom: 24px;
  width: 190px;
  height: 190px;
}

.domain:hover .domain__glyph {
  color: var(--border-strong);
  transform: translate(-4px, -4px);
}

.domain__content {
  position: relative;
  z-index: 1;
  max-width: 78%;
}

.domain:nth-child(1) .domain__content,
.domain:nth-child(2) .domain__content {
  max-width: 66%;
}

.domain__content h3 {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: clamp(21px, 2.2vw, 27px);
  font-weight: 600;
  letter-spacing: 0;
}

.domain__content p {
  max-width: 300px;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.7;
}

.domain__foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.domain__count {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.domain__arrow {
  color: var(--text-muted);
  font-size: 16px;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.domain:hover .domain__arrow {
  color: var(--accent-ink);
  transform: translateX(3px);
}

.domains-wrap__meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.1em;
}

@media (max-width: 1000px) {
  .domains {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .domain,
  .domain:nth-child(1),
  .domain:nth-child(2),
  .domain:nth-child(n + 3) {
    grid-column: span 1;
    min-height: 200px;
  }

  .domain:nth-child(1) .domain__glyph,
  .domain:nth-child(2) .domain__glyph {
    width: 160px;
    height: 160px;
  }
}

@media (max-width: 620px) {
  .domains {
    grid-template-columns: 1fr;
  }

  .domain,
  .domain:nth-child(1),
  .domain:nth-child(2),
  .domain:nth-child(n + 3) {
    min-height: 164px;
    padding: 22px;
  }

  .domain__content,
  .domain:nth-child(1) .domain__content,
  .domain:nth-child(2) .domain__content {
    max-width: 80%;
  }

  .domain__glyph {
    right: -10px;
    bottom: 10px;
    width: 130px;
    height: 130px;
  }

  .domain:nth-child(1) .domain__glyph,
  .domain:nth-child(2) .domain__glyph {
    width: 140px;
    height: 140px;
  }
}
</style>
