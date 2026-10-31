<script setup>
import { ref } from 'vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import { site } from '@/data/site';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta({
  title: '关于我',
  description: site.aboutIntro,
});

const aboutPanels = [
  {
    id: 'interests',
    index: '01',
    title: '兴趣爱好',
    preview: '足球 / NBA · 游戏 · 代码 · 跑步健身',
  },
  {
    id: 'principles',
    index: '02',
    title: '学习方式',
    preview: '项目驱动 · 先跑通再抽象 · 问题留档 · 工具服务判断',
  },
  {
    id: 'contact',
    index: '03',
    title: '联系方式',
    preview: 'GitHub · Bilibili · 抖音',
  },
];

const activePanel = ref('interests');

function togglePanel(id) {
  activePanel.value = activePanel.value === id ? null : id;
}

const barcode = [2, 5, 3, 8, 2, 6, 4, 9, 3, 5, 2, 7, 4, 6, 3, 8, 2, 5, 7, 3, 6, 2, 8, 4, 5, 3, 7, 2, 6, 4];
</script>

<template>
  <div>
    <section class="about-hero">
      <div class="about-hero__field" aria-hidden="true"></div>
      <div class="container about-hero__inner">
        <div class="about-hero__main">
          <h1 class="about-hero__title">
            A RECORD OF<br />
            <span class="about-hero__outline">WHAT I LEARN</span><br />
            AND BUILD<span class="about-hero__dot">.</span>
          </h1>
          <p class="about-hero__intro">{{ site.aboutIntro }}</p>
          <div class="about-hero__links">
            <a :href="site.github" class="btn btn--compact" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <RouterLink to="/posts" class="btn btn--compact">浏览学习档案</RouterLink>
          </div>
        </div>

        <aside class="profile-card">
          <div class="profile-card__head">
            <span class="mono profile-card__status"><i></i>{{ site.owner.status }}</span>
          </div>

          <dl class="profile-card__data">
            <div>
              <dt>称呼</dt>
              <dd>{{ site.owner.callsign }}</dd>
            </div>
            <div>
              <dt>方向</dt>
              <dd>{{ site.owner.role }}</dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a :href="site.github" target="_blank" rel="noopener noreferrer">
                  @{{ site.owner.callsign }} ↗
                </a>
              </dd>
            </div>
          </dl>

          <div class="profile-card__barcode" aria-hidden="true">
            <span v-for="(height, index) in barcode" :key="index" :style="{ height: `${height * 3}px` }"></span>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--bordered">
      <div class="container">
        <SectionHeading index="01" title="关于我" />

        <div class="about-accordion">
          <article
            v-for="panel in aboutPanels"
            :key="panel.id"
            class="about-accordion__item"
            :class="{ 'is-active': activePanel === panel.id }"
          >
            <h3 class="about-accordion__heading">
              <button
                :id="`about-tab-${panel.id}`"
                type="button"
                class="about-accordion__trigger"
                :aria-expanded="activePanel === panel.id"
                :aria-controls="`about-panel-${panel.id}`"
                @click="togglePanel(panel.id)"
              >
                <span class="about-accordion__index mono">{{ panel.index }}</span>
                <span class="about-accordion__title">{{ panel.title }}</span>
                <span class="about-accordion__preview">{{ panel.preview }}</span>
                <span class="about-accordion__arrow" aria-hidden="true"></span>
              </button>
            </h3>

            <div
              :id="`about-panel-${panel.id}`"
              class="about-accordion__collapse"
              role="region"
              :aria-labelledby="`about-tab-${panel.id}`"
              :aria-hidden="activePanel !== panel.id"
              :inert="activePanel !== panel.id ? true : undefined"
            >
              <div class="about-accordion__collapse-inner">
                <div class="about-accordion__content">
                  <template v-if="panel.id === 'interests'">
                    <p class="about-interests__intro">{{ site.interestsIntro }}</p>
                    <div class="about-interests">
                      <article v-for="item in site.interests" :key="item.title" class="about-interest">
                        <span class="about-interest__code mono">{{ item.code }}</span>
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.desc }}</p>
                      </article>
                    </div>
                  </template>

                  <template v-else-if="panel.id === 'principles'">
                    <div class="principles">
                      <article v-for="(item, index) in site.philosophy" :key="item.title" class="principle">
                        <span class="principle__index mono">0{{ index + 1 }}</span>
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.desc }}</p>
                      </article>
                    </div>
                  </template>

                  <template v-else>
                    <div class="about-contact">
                      <div class="about-contact__intro">
                        <span class="eyebrow">公开入口</span>
                        <h4>代码、视频和日常，都在这三个地方。</h4>
                        <p>GitHub 放代码，B站和抖音放视频与日常。</p>
                      </div>
                      <div class="about-contact__grid">
                        <a
                          v-for="contact in site.contacts"
                          :key="contact.label"
                          :href="contact.href"
                          class="about-contact__item"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span class="about-contact__label mono">{{ contact.label }}</span>
                          <strong class="about-contact__value">{{ contact.value }}</strong>
                          <span class="about-contact__note">{{ contact.note }}</span>
                          <span class="about-contact__arrow" aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  position: relative;
  padding-block: clamp(56px, 8vw, 96px) clamp(48px, 6vw, 72px);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.about-hero__field {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 78% 30%, var(--accent-muted), transparent 70%),
    radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: auto, 22px 22px;
  mask-image: linear-gradient(to bottom, #000 0%, #000 75%, transparent 100%);
  pointer-events: none;
}

.about-hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  align-items: center;
  gap: clamp(40px, 6vw, 88px);
}

.about-hero__title {
  margin-top: 22px;
  font-family: var(--font-display);
  font-size: clamp(46px, 6.4vw, 84px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 0.92;
  text-transform: uppercase;
}

.about-hero__outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--text-secondary);
}

.about-hero__dot {
  color: var(--accent);
  -webkit-text-stroke: 0;
}

.about-hero__intro {
  max-width: 620px;
  margin-top: 26px;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.95;
}

.about-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 26px;
}

.profile-card {
  position: relative;
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(var(--grid-dot) 1px, transparent 1px),
    var(--bg-secondary);
  background-size: 20px 20px, 100% 100%;
  padding: 22px;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 56px;
  height: 2px;
  background: var(--accent);
}

.profile-card__head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.profile-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.profile-card__status i {
  width: 5px;
  height: 5px;
  background: var(--accent);
}

.profile-card__data {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 18px;
}

.profile-card__data div {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 14px;
  align-items: baseline;
}

.profile-card__data dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.profile-card__data dd {
  color: var(--text-primary);
  font-size: 11.5px;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.profile-card__data a {
  color: var(--text-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border-strong);
}

.profile-card__data a:hover {
  color: var(--accent-ink);
}

.profile-card__barcode {
  display: flex;
  height: 32px;
  align-items: flex-end;
  gap: 3px;
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
  opacity: 0.55;
}

.profile-card__barcode span {
  flex: 1;
  max-width: 4px;
  background: var(--text-secondary);
}

.about-accordion {
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  background: var(--border-subtle);
  overflow: hidden;
}

.about-accordion__item {
  background: var(--bg-primary);
}

.about-accordion__item + .about-accordion__item {
  border-top: 1px solid var(--border-subtle);
}

.about-accordion__heading {
  margin: 0;
}

.about-accordion__trigger {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 18px 22px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out);
}

.about-accordion__trigger:hover,
.about-accordion__trigger:focus-visible,
.about-accordion__item.is-active .about-accordion__trigger {
  background: var(--bg-secondary);
}

.about-accordion__index {
  flex: none;
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.about-accordion__title {
  flex: none;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}

.about-accordion__preview {
  max-width: 56%;
  margin-left: auto;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 11.5px;
  line-height: 1.65;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(4px);
  transition: opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.about-accordion__trigger:hover .about-accordion__preview,
.about-accordion__trigger:focus-visible .about-accordion__preview,
.about-accordion__item.is-active .about-accordion__preview {
  opacity: 1;
  transform: none;
}

.about-accordion__arrow {
  flex: none;
  width: 8px;
  height: 8px;
  margin-right: 3px;
  border-right: 1px solid var(--text-muted);
  border-bottom: 1px solid var(--text-muted);
  transform: rotate(45deg);
  transition: transform 180ms var(--ease-out);
}

.about-accordion__item.is-active .about-accordion__arrow {
  transform: rotate(225deg);
}

.about-accordion__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 260ms var(--ease-out);
}

.about-accordion__item.is-active .about-accordion__collapse {
  grid-template-rows: 1fr;
}

.about-accordion__collapse-inner {
  min-height: 0;
  overflow: hidden;
}

.about-accordion__item.is-active .about-accordion__collapse-inner {
  border-top: 1px solid var(--border-subtle);
}

.about-accordion__content {
  padding: 20px 22px 26px;
}

@media (prefers-reduced-motion: reduce) {
  .about-accordion__collapse,
  .about-accordion__arrow,
  .about-accordion__preview {
    transition: none;
  }
}

.about-interests__intro {
  max-width: 760px;
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.95;
}

.about-interests {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.about-interest {
  position: relative;
  min-height: 160px;
  padding: 24px;
  background: var(--bg-primary);
}

.about-interest::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease-out);
}

.about-interest:hover::before {
  width: 42px;
}

.about-interest__code {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.about-interest h4 {
  margin-top: 24px;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
}

.about-interest p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.8;
}

.principles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--border-subtle);
  background: var(--border-subtle);
}

.principle {
  position: relative;
  min-height: 170px;
  padding: 24px;
  background: var(--bg-primary);
}

.principle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width var(--dur-base) var(--ease-out);
}

.principle:hover::before {
  width: 42px;
}

.principle__index {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.principle h4 {
  margin-top: 24px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.principle p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.8;
}

.about-contact {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(24px, 4vw, 48px);
}

.about-accordion__content .about-contact {
  border: 0;
  padding: 0;
  background: transparent;
}

.about-contact h4 {
  margin-top: 12px;
  font-size: clamp(22px, 2.8vw, 30px);
  font-weight: 600;
}

.about-contact__intro p {
  max-width: 560px;
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.85;
}

.about-contact__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-content: start;
}

.about-contact__item {
  display: flex;
  flex-direction: column;
  min-height: 140px;
  padding: 16px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: inherit;
  transition: border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.about-contact__item:hover {
  border-color: var(--border-strong);
  background: var(--bg-secondary);
}

.about-contact__label {
  color: var(--accent-ink);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.about-contact__value {
  margin-top: 12px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.about-contact__note {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 11.5px;
  line-height: 1.65;
}

.about-contact__arrow {
  align-self: flex-end;
  margin-top: auto;
  color: var(--text-muted);
  font-size: 18px;
  transition: color var(--dur-fast) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.about-contact__item:hover .about-contact__arrow {
  color: var(--accent-ink);
  transform: translate(2px, -2px);
}

.about-contact__item.is-pending {
  border-style: dashed;
}

.about-contact__item.is-pending .about-contact__label,
.about-contact__item.is-pending .about-contact__value {
  color: var(--text-muted);
}

.about-contact__item.is-pending .about-contact__value {
  font-weight: 500;
}

@media (max-width: 980px) {
  .about-hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .profile-card {
    max-width: 520px;
  }

  .about-contact {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .about-hero__title {
    font-size: 44px;
  }

  .principles {
    grid-template-columns: 1fr;
  }

  .about-accordion__trigger {
    gap: 10px;
    padding: 16px 14px;
  }

  .about-accordion__title {
    font-size: 17px;
  }

  .about-accordion__index {
    font-size: 9px;
  }

  .about-accordion__preview {
    display: none;
  }

  .about-accordion__content {
    padding: 18px 14px 20px;
  }

  .about-interests {
    grid-template-columns: 1fr;
  }

  .about-contact {
    gap: 22px;
  }

  .about-contact__grid {
    grid-template-columns: 1fr;
  }
}
</style>
