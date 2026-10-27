<template>
  <div
    ref="rootRef"
    class="anime-carousel"
    :class="{ 'is-hovered': hovered }"
    aria-hidden="true"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div class="anime-carousel__stage">
      <div
        class="anime-carousel__strip"
        :style="{ gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))` }"
      >
        <div
          v-for="slot in SLOT_COUNT"
          :key="slot"
          class="anime-carousel__frame"
        >
          <img
            v-for="(image, index) in images"
            :key="image.src"
            :src="image.src"
            alt=""
            :class="{ 'is-active': index === activeIndexFor(slot) }"
            decoding="async"
            draggable="false"
          />
        </div>
      </div>
      <span class="anime-carousel__shade"></span>
      <span class="anime-carousel__label mono">ANIME STILLS / ARCHIVE</span>
      <span class="anime-carousel__count mono">
        {{ String(offset + 1).padStart(2, '0') }} /
        {{ String(images.length).padStart(2, '0') }} · 60S LOOP
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const base = import.meta.env.BASE_URL;

const sourceImages = [
  { src: `${base}anime/lucky-star.webp` },
  { src: `${base}anime/still-girl.webp` },
  { src: `${base}anime/haruhi-sos.webp` },
  { src: `${base}anime/hyouka.webp` },
  { src: `${base}anime/arknights-keyvisual.webp` },
  { src: `${base}anime/arknights-breaking.webp` },
  { src: `${base}anime/fate-stay-night.webp` },
];

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

const images = shuffled(sourceImages);
const SLOT_COUNT = Math.min(4, images.length);
const offset = ref(Math.floor(Math.random() * images.length));
const hovered = ref(false);
const rootRef = ref(null);

let rotateTimer = 0;
let canTilt = false;

function activeIndexFor(slot) {
  return (offset.value + slot - 1) % images.length;
}

function resetTilt() {
  if (!rootRef.value) return;
  rootRef.value.style.setProperty('--tilt-x', '0deg');
  rootRef.value.style.setProperty('--tilt-y', '0deg');
  rootRef.value.style.setProperty('--shift-x', '0px');
  rootRef.value.style.setProperty('--shift-y', '0px');
  hovered.value = false;
}

function onMove(event) {
  if (!canTilt || !rootRef.value) return;
  const rect = rootRef.value.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  rootRef.value.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
  rootRef.value.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
  rootRef.value.style.setProperty('--shift-x', `${(x * 7).toFixed(2)}px`);
  rootRef.value.style.setProperty('--shift-y', `${(y * 4).toFixed(2)}px`);
  hovered.value = true;
}

function onLeave() {
  resetTilt();
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce;
  if (reduce) return;

  rotateTimer = window.setInterval(() => {
    offset.value = (offset.value + 1) % images.length;
  }, 60000);
});

onBeforeUnmount(() => {
  if (rotateTimer) window.clearInterval(rotateTimer);
});
</script>

<style scoped>
.anime-carousel {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --shift-x: 0px;
  --shift-y: 0px;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  user-select: none;
}

.anime-carousel__stage {
  position: relative;
  width: 100%;
  height: 100%;
  transform:
    perspective(1100px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y))
    translate3d(var(--shift-x), var(--shift-y), 0)
    scale(1);
  transform-style: preserve-3d;
  transition: transform 0.4s var(--ease-out);
}

.anime-carousel.is-hovered .anime-carousel__stage {
  transform:
    perspective(1100px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y))
    translate3d(var(--shift-x), var(--shift-y), 0)
    scale(1.012);
}

.anime-carousel__strip {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}

.anime-carousel__frame {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  background: var(--bg-deep);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.anime-carousel__frame::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.anime-carousel__frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transform: scale(1.001);
  transition: opacity 1.15s ease, transform 0.5s var(--ease-out);
}

.anime-carousel__frame img.is-active {
  opacity: 1;
  transform: scale(1.012);
}

.anime-carousel.is-hovered .anime-carousel__frame img.is-active {
  transform: scale(1.055);
}

.anime-carousel__shade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  height: 34px;
  background: linear-gradient(180deg, transparent, rgba(6, 8, 10, 0.68));
  pointer-events: none;
}

.anime-carousel__label {
  position: absolute;
  bottom: 9px;
  left: 12px;
  z-index: 4;
  color: #f1f3f5;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.anime-carousel__count {
  position: absolute;
  right: 12px;
  bottom: 9px;
  z-index: 4;
  color: rgba(255, 255, 255, 0.78);
  font-size: 8.5px;
  letter-spacing: 0.08em;
}

@media (prefers-reduced-motion: reduce) {
  .anime-carousel__stage,
  .anime-carousel__frame img {
    transition: none;
  }

  .anime-carousel.is-hovered .anime-carousel__stage {
    transform: none;
  }

  .anime-carousel.is-hovered .anime-carousel__frame img.is-active {
    transform: scale(1.012);
  }
}
</style>
