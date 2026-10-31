<script setup>
import { ref } from 'vue';
import { site } from '@/data/site';

const year = new Date().getFullYear();
const projectIndex = String(year).slice(-2);
const tickMarks = Array.from({ length: 36 }, (_, index) => index + 1);
const avatarSrc = `${import.meta.env.BASE_URL}${site.avatarHd || site.avatar}`;
const avatarInitial = site.owner.callsign.slice(0, 1).toUpperCase();
const avatarFailed = ref(false);
const plateRef = ref(null);

function canHover() {
  return window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches;
}

function onPlateEnter() {
  if (!canHover() || !plateRef.value) return;
  plateRef.value.classList.add('is-hovered');
}

function onPlateMove(event) {
  if (!canHover() || !plateRef.value) return;

  const rect = plateRef.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  plateRef.value.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
  plateRef.value.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
  plateRef.value.style.setProperty('--shift-x', `${(x * 12).toFixed(1)}px`);
  plateRef.value.style.setProperty('--shift-y', `${(y * 12).toFixed(1)}px`);
  plateRef.value.classList.add('is-hovered');
}

function resetPlate() {
  if (!plateRef.value) return;
  plateRef.value.classList.remove('is-hovered');
  plateRef.value.style.setProperty('--tilt-x', '0deg');
  plateRef.value.style.setProperty('--tilt-y', '0deg');
  plateRef.value.style.setProperty('--shift-x', '0px');
  plateRef.value.style.setProperty('--shift-y', '0px');
}
</script>

<template>
  <section class="hero">
    <div class="hero__field" aria-hidden="true"></div>

    <div class="container hero__inner">
      <div class="hero__content">
        <h1 class="hero__title">
          <span class="hero__line">LEARN. BUILD.</span>
          <span class="hero__line hero__line--outline">
            DOCUMENT<span class="hero__dot">.</span>
          </span>
        </h1>

        <p class="hero__lead">{{ site.selfIntro }}</p>

        <div class="hero__actions">
          <RouterLink to="/posts" class="btn btn--primary">
            浏览学习档案 <span class="btn__arrow">→</span>
          </RouterLink>
          <RouterLink to="/about" class="btn">
            关于我 <span class="btn__arrow">→</span>
          </RouterLink>
        </div>
      </div>

      <div class="hero__plate">
        <div
          ref="plateRef"
          class="archive-plate"
          @mouseenter="onPlateEnter"
          @mousemove="onPlateMove"
          @mouseleave="resetPlate"
        >
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

            <figure class="archive-photo">
              <div class="archive-photo__frame">
                <img
                  v-if="!avatarFailed"
                  :src="avatarSrc"
                  :alt="`${site.owner.callsign} 的 GitHub 头像`"
                  decoding="async"
                  @error="avatarFailed = true"
                />
                <span v-else class="archive-photo__fallback" aria-hidden="true">{{ avatarInitial }}</span>
                <span class="archive-photo__scan" aria-hidden="true"></span>
                <i class="archive-photo__corner tl"></i>
                <i class="archive-photo__corner tr"></i>
                <i class="archive-photo__corner bl"></i>
                <i class="archive-photo__corner br"></i>
              </div>
              <figcaption class="archive-photo__id">
                <strong>{{ site.owner.callsign }}</strong>
              </figcaption>
            </figure>

            <span class="archive-plate__orange" aria-hidden="true"></span>
            <span class="archive-plate__index" aria-hidden="true">{{ projectIndex }}</span>

            <div class="archive-plate__ticks" aria-hidden="true">
              <span v-for="n in 7" :key="n"></span>
            </div>
          </div>
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
  font-size: 10px;
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
  font-size: 10px;
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
  grid-template-columns: 0.85fr 1.35fr 0.8fr;
  gap: 24px;
  margin-top: clamp(38px, 6vh, 68px);
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.hero__status dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
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
  animation: plate-in 0.7s var(--ease-out) both;
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
  transform:
    perspective(1000px)
    rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg))
    translate3d(var(--shift-x, 0px), calc(var(--shift-y, 0px) - var(--lift, 0px)), 0);
  transform-style: preserve-3d;
  transition: transform 520ms var(--ease-out), filter 320ms var(--ease-out);
  will-change: transform;
}

.archive-plate.is-hovered {
  --lift: 6px;
  filter: drop-shadow(0 26px 50px rgba(0, 0, 0, 0.38));
  transition-duration: 120ms, 320ms;
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
  font-size: 10px;
  letter-spacing: 0.14em;
}

.archive-plate__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 10px;
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
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(88%, 330px);
  height: auto;
  color: var(--text-primary);
  opacity: 0.26;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.archive-plate__axis {
  fill: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
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
  font-size: 10px;
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

.archive-photo {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(52%, 210px);
  margin: 0;
  transform: translate3d(
    calc(var(--shift-x, 0px) * 0.45),
    calc(var(--shift-y, 0px) * 0.45),
    0
  );
  transition: transform 520ms var(--ease-out);
}

.archive-plate.is-hovered .archive-photo {
  transition-duration: 120ms;
}

.archive-photo__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.archive-photo__frame {
  position: relative;
  margin-top: 7px;
  aspect-ratio: 1;
  border: 1px solid var(--border-strong);
  background: var(--bg-deep);
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 14px),
    calc(100% - 14px) 100%,
    0 100%
  );
  overflow: hidden;
  transition: border-color var(--dur-fast) var(--ease-out);
}

.archive-plate.is-hovered .archive-photo__frame {
  border-color: var(--accent-line);
}

.archive-photo__frame img,
.archive-photo__fallback {
  display: block;
  width: 100%;
  height: 100%;
}

.archive-photo__frame img {
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.05) saturate(0.9);
  transform: scale(1.01);
  transition: transform 600ms var(--ease-out), filter var(--dur-base) var(--ease-out);
}

.archive-plate.is-hovered .archive-photo__frame img {
  filter: grayscale(0.05) contrast(1.08) saturate(1);
  transform: scale(1.045);
}

.archive-photo__fallback {
  display: grid;
  place-items: center;
  background: var(--bg-secondary);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 600;
}

.archive-photo__frame::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(245, 166, 35, 0.06), transparent 38%, rgba(11, 13, 15, 0.42));
  content: '';
  pointer-events: none;
}

.archive-photo__scan {
  position: absolute;
  top: -45%;
  right: 0;
  left: 0;
  z-index: 3;
  height: 36%;
  background: linear-gradient(180deg, transparent, rgba(245, 166, 35, 0.22), transparent);
  opacity: 0;
  pointer-events: none;
}

.archive-plate.is-hovered .archive-photo__scan {
  opacity: 1;
  animation: photo-scan 3.2s linear infinite;
}

@keyframes photo-scan {
  to {
    transform: translateY(420%);
  }
}

.archive-photo__corner {
  position: absolute;
  z-index: 4;
  width: 14px;
  height: 14px;
  border-color: var(--accent);
  border-style: solid;
  pointer-events: none;
}

.archive-photo__corner.tl {
  top: 7px;
  left: 7px;
  border-width: 1px 0 0 1px;
}

.archive-photo__corner.tr {
  top: 7px;
  right: 7px;
  border-width: 1px 1px 0 0;
}

.archive-photo__corner.bl {
  bottom: 7px;
  left: 7px;
  border-width: 0 0 1px 1px;
}

.archive-photo__corner.br {
  right: 7px;
  bottom: 7px;
  border-width: 0 1px 1px 0;
}

.archive-photo__id {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 7px;
  padding-top: 6px;
  border-top: 1px solid var(--border-subtle);
}

.archive-photo__id span {
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.archive-photo__id strong {
  overflow: hidden;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  font-size: 10px;
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
  font-size: 10px;
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
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 36px;
  }

  .archive-plate {
    aspect-ratio: auto;
    min-height: 400px;
    padding: 20px;
  }

  .archive-photo {
    width: min(52%, 180px);
  }

  .archive-plate__emblem {
    width: min(84%, 280px);
  }

  .archive-plate__vertical {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .archive-plate,
  .archive-photo,
  .archive-photo__frame img {
    transform: none;
    transition: none;
  }

  .archive-plate__rotate,
  .archive-photo__scan,
  .hero__scroll-line span {
    animation: none;
  }
}
</style>
