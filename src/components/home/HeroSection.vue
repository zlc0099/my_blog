<script setup>
import { focusItems } from '@/data/focus';
import { site } from '@/data/site';
import { archiveStats, getLatestEntryLabel } from '@/lib/content';
import { formatDate } from '@/lib/format';

const latestFocus = focusItems[0] || null;
const latestEntry = getLatestEntryLabel();
const lastUpdated = formatDate(archiveStats.latestUpdate);
const year = new Date().getFullYear();
const tickMarks = Array.from({ length: 36 }, (_, index) => index + 1);
</script>

<template>
  <section class="hero">
    <span class="hero__vert" aria-hidden="true">PERSONAL ARCHIVE / LEARNING LOG</span>
    <div class="hero__field" aria-hidden="true"></div>

    <div class="container hero__inner">
      <div class="hero__content">
        <div class="eyebrow hero__eyebrow">
          <span class="eyebrow__tick"></span>
          {{ site.brand }} <span class="hero__slash">/</span> {{ site.tagline }}
        </div>

        <h1 class="hero__title">
          <span class="hero__line">LEARN. BUILD.</span>
          <span class="hero__line hero__line--outline">
            DOCUMENT<span class="hero__dot">.</span>
          </span>
        </h1>

        <p class="hero__lead">{{ site.intro }}</p>
        <p class="hero__cn">持续学习 / 持续构建 / 持续记录</p>

        <div class="hero__actions">
          <RouterLink to="/posts" class="btn btn--primary">
            浏览学习笔记 <span class="btn__arrow">→</span>
          </RouterLink>
          <RouterLink to="/projects" class="btn">
            查看项目记录 <span class="btn__arrow">→</span>
          </RouterLink>
        </div>

        <dl class="hero__status">
          <div>
            <dt>CURRENTLY LEARNING</dt>
            <dd>{{ latestFocus ? latestFocus.topic : '正在整理' }}</dd>
          </div>
          <div>
            <dt>LAST UPDATED</dt>
            <dd>{{ lastUpdated || '—' }}</dd>
          </div>
          <div class="hero__scroll">
            <dt>SCROLL TO EXPLORE</dt>
            <dd class="hero__scroll-line"><span></span></dd>
          </div>
        </dl>
      </div>

      <div class="hero__plate">
        <div class="archive-plate">
          <svg
            class="archive-plate__frame"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0.5 0.5H94.5L99.5 5.5V99.5H5.5L0.5 94.5Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <div class="archive-plate__top">
            <span class="mono">DOSSIER / {{ String(archiveStats.postCount).padStart(3, '0') }}</span>
            <span class="archive-plate__status mono"><i></i> CATALOGUED</span>
          </div>

          <div class="archive-plate__visual">
            <svg class="archive-plate__emblem" viewBox="0 0 360 360" aria-hidden="true">
              <circle cx="180" cy="180" r="148" fill="none" stroke="var(--border-strong)" stroke-width="1" />
              <g class="archive-plate__rotate">
                <circle
                  cx="180"
                  cy="180"
                  r="128"
                  fill="none"
                  stroke="var(--border-primary)"
                  stroke-width="1"
                  stroke-dasharray="2 7"
                />
                <path
                  d="M180 32A148 148 0 0 1 328 180"
                  fill="none"
                  stroke="var(--accent)"
                  stroke-width="2"
                />
              </g>
              <circle cx="180" cy="180" r="92" fill="none" stroke="var(--border-strong)" stroke-width="1" />
              <line x1="22" y1="180" x2="338" y2="180" stroke="var(--border-primary)" stroke-width="1" />
              <line x1="180" y1="22" x2="180" y2="338" stroke="var(--border-primary)" stroke-width="1" />
              <g>
                <line
                  v-for="n in tickMarks"
                  :key="n"
                  x1="180"
                  y1="28"
                  x2="180"
                  y2="42"
                  :stroke="n % 6 === 0 ? 'var(--accent)' : 'var(--border-strong)'"
                  stroke-width="1"
                  :transform="`rotate(${n * 10} 180 180)`"
                />
              </g>
              <rect
                x="158"
                y="158"
                width="44"
                height="44"
                fill="none"
                stroke="var(--text-secondary)"
                stroke-width="1"
                transform="rotate(45 180 180)"
              />
              <rect x="171" y="171" width="18" height="18" fill="var(--accent)" />
              <circle cx="180" cy="180" r="3.5" fill="var(--text-primary)" />
              <text x="180" y="18" text-anchor="middle" class="archive-plate__axis">N</text>
              <text x="344" y="183" text-anchor="middle" class="archive-plate__axis">E</text>
              <text x="180" y="352" text-anchor="middle" class="archive-plate__axis">S</text>
              <text x="16" y="183" text-anchor="middle" class="archive-plate__axis">W</text>
            </svg>
            <span class="archive-plate__tag archive-plate__tag--left mono">A—01</span>
            <span class="archive-plate__tag archive-plate__tag--right mono">GRID / 07</span>
          </div>

          <span class="archive-plate__orange" aria-hidden="true"></span>
          <span class="archive-plate__index" aria-hidden="true">
            {{ String(archiveStats.postCount).padStart(2, '0') }}
          </span>

          <div class="archive-plate__info">
            <div class="archive-plate__info-row">
              <span class="mono">CURRENT FOCUS</span>
              <strong>{{ latestFocus ? latestFocus.topic : '整理中' }}</strong>
            </div>
            <div class="archive-plate__info-row">
              <span class="mono">LATEST ENTRY</span>
              <strong>{{ latestEntry }}</strong>
            </div>
          </div>

          <div class="archive-plate__ticks" aria-hidden="true">
            <span v-for="n in 7" :key="n"></span>
          </div>

          <span class="archive-plate__vertical mono">PERSONAL ARCHIVE — {{ year }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.hero__field {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 60% at 78% 38%, var(--accent-muted), transparent 70%),
    radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: auto, 24px 24px;
  mask-image: linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%);
  pointer-events: none;
}

.hero__vert {
  position: absolute;
  top: 48%;
  left: 16px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.22em;
  writing-mode: vertical-rl;
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(350px, 0.82fr);
  align-items: center;
  gap: clamp(40px, 6vw, 88px);
  min-height: min(84vh, 860px);
  padding-block: clamp(52px, 7vw, 88px);
}

.hero__eyebrow {
  color: var(--text-secondary);
}

.hero__slash {
  color: var(--border-strong);
}

.hero__title {
  margin-top: 24px;
  font-family: var(--font-display);
  font-size: clamp(58px, 8vw, 108px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 0.85;
  text-transform: uppercase;
}

.hero__line {
  display: block;
}

.hero__line--outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--text-secondary);
}

.hero__dot {
  color: var(--accent);
  -webkit-text-stroke: 0;
}

.hero__lead {
  max-width: 460px;
  margin-top: 28px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.9;
}

.hero__cn {
  margin-top: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
}

.hero__status {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1fr;
  gap: 24px;
  margin-top: clamp(38px, 6vh, 68px);
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.hero__status dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.12em;
}

.hero__status dd {
  margin-top: 6px;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.4;
}

.hero__scroll-line {
  position: relative;
  display: block;
  width: 64px;
  height: 1px;
  margin-top: 12px !important;
  background: var(--border-primary);
  overflow: hidden;
}

.hero__scroll-line span {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 24px;
  background: var(--accent);
  animation: scroll-sweep 2.8s ease-in-out infinite;
}

@keyframes scroll-sweep {
  0%,
  100% {
    transform: translateX(-24px);
  }
  50% {
    transform: translateX(64px);
  }
}

.hero__plate {
  width: min(100%, 470px);
  justify-self: end;
}

.archive-plate {
  position: relative;
  display: flex;
  aspect-ratio: 4 / 5;
  max-height: 580px;
  flex-direction: column;
  padding: 24px;
  background:
    radial-gradient(var(--grid-dot) 1px, transparent 1px),
    linear-gradient(155deg, var(--bg-elevated) 0%, var(--bg-secondary) 52%, var(--bg-primary) 100%);
  background-size: 22px 22px, 100% 100%;
  clip-path: polygon(
    0 0,
    calc(100% - 28px) 0,
    100% 28px,
    100% 100%,
    28px 100%,
    0 calc(100% - 28px)
  );
  overflow: hidden;
  animation: plate-in 0.7s var(--ease-out) both;
}

@keyframes plate-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.archive-plate__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--border-strong);
  pointer-events: none;
}

.archive-plate__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.14em;
}

.archive-plate__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 8px;
}

.archive-plate__status i {
  width: 5px;
  height: 5px;
  background: var(--accent);
}

.archive-plate__visual {
  position: relative;
  display: grid;
  flex: 1;
  place-items: center;
  padding-block: 8px;
}

.archive-plate__emblem {
  width: min(88%, 330px);
  height: auto;
  color: var(--text-primary);
}

.archive-plate__axis {
  fill: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.archive-plate__rotate {
  transform-origin: 180px 180px;
  animation: emblem-spin 80s linear infinite;
}

@keyframes emblem-spin {
  to {
    transform: rotate(360deg);
  }
}

.archive-plate__tag {
  position: absolute;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.archive-plate__tag--left {
  top: 16%;
  left: 2%;
}

.archive-plate__tag--right {
  right: 4%;
  bottom: 18%;
  writing-mode: vertical-rl;
}

.archive-plate__orange {
  position: absolute;
  top: 58%;
  left: 0;
  width: 6px;
  height: 74px;
  background: var(--accent);
}

.archive-plate__index {
  position: absolute;
  top: 88px;
  right: 20px;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 110px;
  font-weight: 600;
  line-height: 1;
  opacity: 0.035;
  pointer-events: none;
}

.archive-plate__info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px 26px 2px 0;
  border-top: 1px solid var(--border-subtle);
}

.archive-plate__info-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.archive-plate__info-row span {
  flex: none;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.archive-plate__info-row strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 500;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-plate__ticks {
  position: absolute;
  bottom: 104px;
  left: 22px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.archive-plate__ticks span {
  width: 10px;
  height: 1px;
  background: var(--border-strong);
}

.archive-plate__ticks span:nth-child(odd) {
  width: 18px;
}

.archive-plate__vertical {
  position: absolute;
  top: 86px;
  right: 12px;
  color: var(--text-muted);
  font-size: 8px;
  letter-spacing: 0.16em;
  writing-mode: vertical-rl;
}

@media (max-width: 1200px) {
  .hero__vert {
    display: none;
  }
}

@media (max-width: 980px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 48px;
    min-height: auto;
    padding-block: 56px 64px;
  }

  .hero__plate {
    width: min(100%, 520px);
    justify-self: start;
  }

  .archive-plate {
    aspect-ratio: 1 / 1;
    max-height: none;
  }
}

@media (max-width: 720px) {
  .hero__title {
    font-size: clamp(48px, 13vw, 72px);
  }

  .hero__lead {
    margin-top: 22px;
    font-size: 14px;
  }

  .hero__actions {
    margin-top: 26px;
  }

  .hero__status {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 36px;
  }

  .hero__scroll {
    grid-column: 1 / -1;
  }

  .archive-plate {
    aspect-ratio: auto;
    min-height: 400px;
    padding: 20px;
  }

  .archive-plate__emblem {
    width: min(84%, 280px);
  }

  .archive-plate__vertical {
    display: none;
  }
}
</style>
