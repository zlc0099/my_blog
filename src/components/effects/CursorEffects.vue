<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const canvasRef = ref(null);
let context = null;
let frame = 0;
let width = 0;
let height = 0;
let dpr = 1;
let lastTime = 0;
let lastPoint = null;
let trail = [];
let ripples = [];
let active = false;
let accent = '245, 166, 35';
let particle = '242, 243, 244';

function readColors() {
  const root = getComputedStyle(document.documentElement);
  const accentValue = root.getPropertyValue('--accent-rgb').trim();
  const particleValue = root.getPropertyValue('--particle-rgb').trim();
  if (accentValue) accent = accentValue;
  if (particleValue) particle = particleValue;
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
}

function schedule() {
  if (active) return;
  active = true;
  lastTime = 0;
  frame = window.requestAnimationFrame(loop);
}

function loop(time) {
  const delta = lastTime ? Math.min(0.06, (time - lastTime) / 1000) : 0;
  lastTime = time;
  draw(time, delta);

  if (trail.length || ripples.length) {
    frame = window.requestAnimationFrame(loop);
  } else {
    active = false;
    frame = 0;
    context.clearRect(0, 0, width, height);
  }
}

function draw(time, delta) {
  if (!context) return;
  context.clearRect(0, 0, width, height);

  trail = trail.filter((point) => {
    point.life -= delta * 2.6;
    return point.life > 0;
  });

  trail.forEach((point, index) => {
    const progress = index / Math.max(1, trail.length - 1);
    const radius = 0.7 + progress * 1.4;
    const alpha = point.life * 0.22 * (0.4 + progress * 0.6);
    context.beginPath();
    context.fillStyle = `rgba(${particle}, ${alpha})`;
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
  });

  ripples = ripples.filter((ripple) => {
    const age = (time - ripple.start) / 520;
    ripple.age = age;
    return age < 1;
  });

  ripples.forEach((ripple) => {
    const progress = Math.max(0, Math.min(1, ripple.age));
    const eased = 1 - (1 - progress) * (1 - progress);
    const radius = 3 + eased * 26;
    context.beginPath();
    context.strokeStyle = `rgba(${accent}, ${(1 - progress) * 0.4})`;
    context.lineWidth = 1.4;
    context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
    context.stroke();

    for (let i = 0; i < 4; i += 1) {
      const angle = ripple.angle + (Math.PI / 2) * i;
      const distance = radius * 0.9;
      context.beginPath();
      context.fillStyle = `rgba(${accent}, ${(1 - progress) * 0.5})`;
      context.arc(
        ripple.x + Math.cos(angle) * distance,
        ripple.y + Math.sin(angle) * distance,
        1.2,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  });
}

function onPointerMove(event) {
  if (event.pointerType !== 'mouse') return;
  const point = { x: event.clientX, y: event.clientY, life: 1 };
  if (lastPoint) {
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    if (distance < 3) return;
  }
  lastPoint = point;
  trail.push(point);
  if (trail.length > 16) trail.shift();
  schedule();
}

function onPointerDown(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  ripples.push({
    x: event.clientX,
    y: event.clientY,
    start: performance.now(),
    age: 0,
    angle: Math.random() * Math.PI * 2,
  });
  schedule();
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || coarse) {
    canvas.remove();
    return;
  }

  context = canvas.getContext('2d');
  readColors();
  resize();

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
});

onBeforeUnmount(() => {
  if (frame) window.cancelAnimationFrame(frame);
  window.removeEventListener('resize', resize);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerdown', onPointerDown);
});
</script>

<template>
  <canvas ref="canvasRef" class="cursor-effects" aria-hidden="true"></canvas>
</template>

<style scoped>
.cursor-effects {
  position: fixed;
  inset: 0;
  z-index: 90;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>