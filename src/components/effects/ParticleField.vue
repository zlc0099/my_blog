<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const canvasRef = ref(null);
let context = null;
let frame = 0;
let particles = [];
let width = 0;
let height = 0;
let dpr = 1;
let lastTime = 0;
let color = '242, 243, 244';
let reduced = false;
let themeObserver = null;

function readParticleColor() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--particle-rgb')
    .trim();
  if (value) color = value;
}

function createParticles() {
  const count = Math.min(
    70,
    Math.max(26, Math.round((width * height) / 26000)),
  );
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.5 + Math.random() * 1.3,
    alpha: 0.06 + Math.random() * 0.2,
    vx: (Math.random() - 0.5) * 3.2,
    vy: -0.8 - Math.random() * 5,
    phase: Math.random() * Math.PI * 2,
    sway: 2 + Math.random() * 6,
  }));
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas || !context) return;
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
  draw(0);
}

function draw(delta) {
  if (!context) return;
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    if (!reduced) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.phase += delta * 0.35;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;
      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
    }

    const offset = reduced ? 0 : Math.sin(particle.phase) * particle.sway;
    context.beginPath();
    context.fillStyle = `rgba(${color}, ${particle.alpha})`;
    context.arc(particle.x + offset, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  }
}

function loop(time) {
  const delta = lastTime ? Math.min(0.06, (time - lastTime) / 1000) : 0;
  lastTime = time;
  draw(delta);
  frame = window.requestAnimationFrame(loop);
}

function start() {
  if (reduced || frame) return;
  lastTime = 0;
  frame = window.requestAnimationFrame(loop);
}

function stop() {
  if (!frame) return;
  window.cancelAnimationFrame(frame);
  frame = 0;
}

function onVisibilityChange() {
  if (document.hidden) stop();
  else start();
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  context = canvas.getContext('2d');
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readParticleColor();
  resize();
  start();

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  themeObserver = new MutationObserver(readParticleColor);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onBeforeUnmount(() => {
  stop();
  window.removeEventListener('resize', resize);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  themeObserver?.disconnect();
});
</script>

<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.particle-field {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>