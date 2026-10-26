<script setup>
import { computed } from 'vue';

const props = defineProps({
  seed: {
    type: String,
    required: true,
  },
});

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const art = computed(() => {
  const random = mulberry32(hashString(props.seed));
  const circle = {
    cx: Math.round(330 + random() * 170),
    cy: Math.round(70 + random() * 100),
    r: Math.round(46 + random() * 58),
  };
  const diagonal = {
    x1: Math.round(30 + random() * 120),
    y1: Math.round(280 + random() * 50),
    x2: Math.round(450 + random() * 120),
    y2: Math.round(20 + random() * 90),
  };
  const accent = {
    x: Math.round(36 + random() * 240),
    y: Math.round(160 + random() * 90),
    w: Math.round(40 + random() * 80),
    h: Math.round(8 + random() * 22),
  };
  const brace = {
    x: Math.round(500 + random() * 40),
    y: Math.round(40 + random() * 120),
    size: Math.round(28 + random() * 30),
  };
  return { circle, diagonal, accent, brace };
});

const gridColumns = Array.from({ length: 12 }, (_, index) => (index + 1) * 50);
const gridRows = Array.from({ length: 6 }, (_, index) => (index + 1) * 56);
</script>

<template>
  <svg
    class="project-glyph"
    viewBox="0 0 600 340"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <g class="project-glyph__grid">
      <line v-for="x in gridColumns" :key="`x-${x}`" :x1="x" y1="0" :x2="x" y2="340" />
      <line v-for="y in gridRows" :key="`y-${y}`" x1="0" :y1="y" x2="600" :y2="y" />
    </g>

    <line
      :x1="art.diagonal.x1"
      :y1="art.diagonal.y1"
      :x2="art.diagonal.x2"
      :y2="art.diagonal.y2"
      stroke="var(--border-strong)"
      stroke-width="1"
    />

    <circle
      :cx="art.circle.cx"
      :cy="art.circle.cy"
      :r="art.circle.r"
      fill="none"
      stroke="var(--border-strong)"
      stroke-width="1"
    />
    <circle
      :cx="art.circle.cx"
      :cy="art.circle.cy"
      :r="art.circle.r + 14"
      fill="none"
      stroke="var(--border-primary)"
      stroke-width="1"
      stroke-dasharray="2 6"
    />
    <line
      :x1="art.circle.cx - art.circle.r - 18"
      :y1="art.circle.cy"
      :x2="art.circle.cx + art.circle.r + 18"
      :y2="art.circle.cy"
      stroke="var(--border-primary)"
      stroke-width="1"
    />

    <path
      :d="`M${art.brace.x} ${art.brace.y}v${art.brace.size}h${art.brace.size}`"
      fill="none"
      stroke="var(--border-strong)"
      stroke-width="1"
    />

    <rect
      :x="art.accent.x"
      :y="art.accent.y"
      :width="art.accent.w"
      :height="art.accent.h"
      fill="var(--accent)"
    />

    <g class="project-glyph__ticks">
      <line x1="18" y1="24" x2="48" y2="24" />
      <line x1="18" y1="24" x2="18" y2="54" />
      <line x1="582" y1="316" x2="552" y2="316" />
      <line x1="582" y1="316" x2="582" y2="286" />
    </g>
  </svg>
</template>

<style scoped>
.project-glyph {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--bg-elevated);
  transition: transform 0.5s var(--ease-out);
}

.project-glyph__grid line {
  stroke: var(--grid-dot);
  stroke-width: 1;
}

.project-glyph__ticks line {
  stroke: var(--text-muted);
  stroke-width: 1;
}
</style>
