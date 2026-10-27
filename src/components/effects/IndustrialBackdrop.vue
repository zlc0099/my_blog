<template>
  <div class="industrial-backdrop" aria-hidden="true">
    <div class="ind-aurora">
      <span class="aurora aurora--a"></span>
      <span class="aurora aurora--b"></span>
      <span class="aurora aurora--c"></span>
      <span class="aurora-rays"></span>
    </div>

    <div class="ind-grid"></div>
    <div class="ind-diagonals"></div>

    <div class="ind-radar ind-radar--primary">
      <span class="ind-radar__ring"></span>
      <span class="ind-radar__ticks"></span>
      <span class="ind-radar__sweep"></span>
    </div>

    <div class="ind-radar ind-radar--secondary">
      <span class="ind-radar__ring"></span>
      <span class="ind-radar__ticks"></span>
    </div>

    <div class="ind-beam"></div>
    <div class="ind-scan"></div>

    <span class="ind-cross ind-cross--a">+</span>
    <span class="ind-cross ind-cross--b">+</span>
    <span class="ind-cross ind-cross--c">+</span>
  </div>
</template>

<style scoped>
.industrial-backdrop {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  pointer-events: none;
}

.industrial-backdrop::before,
.industrial-backdrop::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    var(--ind-line) 24%,
    var(--ind-line) 76%,
    transparent
  );
  opacity: 0.35;
}

.industrial-backdrop::before {
  left: 28px;
}

.industrial-backdrop::after {
  right: 28px;
}

.ind-aurora {
  position: absolute;
  top: -18%;
  right: -12%;
  left: -12%;
  height: 78%;
  filter: blur(30px);
  opacity: var(--aurora-opacity, 0.85);
  animation: ind-aurora-breathe 34s ease-in-out infinite alternate;
  will-change: opacity, transform;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 56%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 56%, transparent 100%);
}

.aurora {
  position: absolute;
  display: block;
  border-radius: 50%;
}

.aurora--a {
  top: -8%;
  left: -12%;
  width: 78%;
  height: 58%;
  background: linear-gradient(
    102deg,
    transparent 4%,
    var(--aurora-1) 30%,
    var(--aurora-2) 55%,
    transparent 90%
  );
  transform: rotate(-9deg) skewX(-24deg);
  animation: ind-aurora-a 58s ease-in-out infinite alternate;
  will-change: transform;
}

.aurora--b {
  top: 8%;
  right: -14%;
  width: 70%;
  height: 46%;
  background: linear-gradient(
    96deg,
    transparent,
    var(--aurora-3) 30%,
    var(--aurora-1) 62%,
    transparent
  );
  transform: rotate(8deg) skewX(18deg);
  animation: ind-aurora-b 72s ease-in-out infinite alternate;
  will-change: transform;
}

.aurora--c {
  top: 32%;
  left: 18%;
  width: 65%;
  height: 32%;
  background: linear-gradient(
    100deg,
    transparent,
    var(--aurora-2),
    var(--aurora-3),
    transparent
  );
  opacity: 0.55;
  transform: rotate(-4deg) skewX(-10deg);
  animation: ind-aurora-c 46s ease-in-out infinite alternate;
  will-change: transform;
}

.aurora-rays {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    99deg,
    transparent 0 3.2em,
    var(--aurora-ray) 3.2em 3.35em,
    transparent 3.35em 7.8em
  );
  opacity: 0.55;
  transform: skewX(-16deg);
  animation: ind-aurora-rays 90s linear infinite;
  will-change: transform;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent);
}

.ind-grid {
  position: absolute;
  inset: -12%;
  background-image:
    linear-gradient(to right, var(--ind-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ind-grid) 1px, transparent 1px),
    linear-gradient(to right, var(--ind-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ind-line) 1px, transparent 1px);
  background-size:
    96px 96px,
    96px 96px,
    480px 480px,
    480px 480px;
  animation: ind-grid-drift 120s linear infinite;
  will-change: transform;
  -webkit-mask-image: radial-gradient(
    ellipse 78% 68% at 52% 38%,
    #000 0%,
    transparent 78%
  );
  mask-image: radial-gradient(
    ellipse 78% 68% at 52% 38%,
    #000 0%,
    transparent 78%
  );
}

.ind-diagonals {
  position: absolute;
  inset: -20%;
  background: repeating-linear-gradient(
    112deg,
    transparent 0 280px,
    var(--ind-grid) 280px 281px,
    transparent 281px 560px
  );
  animation: ind-diagonals-drift 90s ease-in-out infinite alternate;
  will-change: transform;
  -webkit-mask-image: radial-gradient(
    ellipse 72% 64% at 58% 48%,
    #000 0%,
    transparent 74%
  );
  mask-image: radial-gradient(
    ellipse 72% 64% at 58% 48%,
    #000 0%,
    transparent 74%
  );
}

.ind-radar {
  position: absolute;
  border-radius: 50%;
}

.ind-radar::before {
  content: '';
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--ind-accent) 0%, transparent 62%);
  opacity: 0.22;
}

.ind-radar--primary {
  top: -14vh;
  right: -12vw;
  width: min(66vw, 880px);
  aspect-ratio: 1;
}

.ind-radar--secondary {
  left: -16vw;
  bottom: -24vh;
  width: min(42vw, 560px);
  aspect-ratio: 1;
  opacity: 0.5;
}

.ind-radar__ring {
  position: absolute;
  inset: 8%;
  border: 1px solid var(--ind-line);
  border-radius: 50%;
  transition: border-color 0.6s var(--ease-out);
}

.ind-radar__ring::before,
.ind-radar__ring::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}

.ind-radar__ring::before {
  inset: 10%;
  border: 1px dashed var(--ind-grid);
  animation: ind-rotate 180s linear infinite reverse;
}

.ind-radar__ring::after {
  inset: 24%;
  border: 1px solid var(--ind-line);
  opacity: 0.55;
}

.ind-radar__ticks {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(
    from 0deg,
    var(--ind-line) 0deg 0.35deg,
    transparent 0.35deg 4.5deg
  );
  animation: ind-rotate 160s linear infinite;
  will-change: transform;
  -webkit-mask-image: radial-gradient(
    circle,
    transparent 0 43%,
    #000 43.5% 46%,
    transparent 46.5%
  );
  mask-image: radial-gradient(
    circle,
    transparent 0 43%,
    #000 43.5% 46%,
    transparent 46.5%
  );
}

.ind-radar__sweep {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg 305deg,
    var(--ind-accent) 352deg,
    transparent 360deg
  );
  animation: ind-rotate 52s linear infinite;
  opacity: 0.5;
  will-change: transform;
  -webkit-mask-image: radial-gradient(
    circle,
    transparent 0 24%,
    #000 25% 68%,
    transparent 69%
  );
  mask-image: radial-gradient(
    circle,
    transparent 0 24%,
    #000 25% 68%,
    transparent 69%
  );
}

.ind-radar--secondary .ind-radar__ticks {
  animation-duration: 220s;
  animation-direction: reverse;
}

.ind-radar--secondary .ind-radar__ring::before {
  animation-duration: 240s;
}

.ind-beam {
  position: absolute;
  top: -45vh;
  left: -20vw;
  width: 58vw;
  height: 190vh;
  background: linear-gradient(
    90deg,
    transparent,
    var(--ind-beam) 46%,
    transparent
  );
  animation: ind-beam-drift 54s ease-in-out infinite alternate;
  will-change: transform;
}

.ind-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--ind-scan) 12%,
    var(--ind-scan) 88%,
    transparent
  );
  box-shadow: 0 0 18px var(--ind-scan);
  opacity: 0;
  animation: ind-scan 26s linear infinite;
  will-change: transform;
}

.ind-cross {
  position: absolute;
  color: var(--ind-line);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1;
  opacity: 0.6;
  transition: color 0.6s var(--ease-out);
}

.ind-cross--a {
  top: 22%;
  left: 7%;
}

.ind-cross--b {
  top: 64%;
  right: 12%;
}

.ind-cross--c {
  bottom: 14%;
  left: 26%;
}

@keyframes ind-grid-drift {
  from {
    transform: translate3d(-96px, -96px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ind-diagonals-drift {
  from {
    transform: translate3d(-16px, -8px, 0);
  }
  to {
    transform: translate3d(16px, 8px, 0);
  }
}

@keyframes ind-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ind-aurora-breathe {
  from {
    transform: translate3d(-1.4%, 0, 0);
    opacity: calc(var(--aurora-opacity, 0.85) * 0.82);
  }
  to {
    transform: translate3d(1.4%, 0.8%, 0);
    opacity: var(--aurora-opacity, 0.85);
  }
}

@keyframes ind-aurora-a {
  from {
    transform: translate3d(-2.5%, 0, 0) rotate(-9deg) skewX(-24deg);
  }
  to {
    transform: translate3d(3.5%, 2%, 0) rotate(-6deg) skewX(-20deg);
  }
}

@keyframes ind-aurora-b {
  from {
    transform: translate3d(2.5%, -1%, 0) rotate(8deg) skewX(18deg);
  }
  to {
    transform: translate3d(-3%, 1.5%, 0) rotate(5deg) skewX(22deg);
  }
}

@keyframes ind-aurora-c {
  from {
    transform: translate3d(-1.5%, 0, 0) rotate(-4deg) skewX(-10deg);
  }
  to {
    transform: translate3d(2%, -2%, 0) rotate(-2deg) skewX(-16deg);
  }
}

@keyframes ind-aurora-rays {
  from {
    transform: translate3d(-4%, 0, 0) skewX(-16deg);
  }
  to {
    transform: translate3d(4%, 0, 0) skewX(-16deg);
  }
}

@keyframes ind-beam-drift {
  from {
    transform: translate3d(-14vw, 0, 0) rotate(17deg);
  }
  to {
    transform: translate3d(24vw, 0, 0) rotate(17deg);
  }
}

@keyframes ind-scan {
  0% {
    transform: translateY(-4vh);
    opacity: 0;
  }
  7% {
    opacity: 0.45;
  }
  90% {
    opacity: 0.45;
  }
  100% {
    transform: translateY(104vh);
    opacity: 0;
  }
}

@media (max-width: 720px) {
  .industrial-backdrop {
    opacity: 0.8;
  }

  .ind-grid {
    background-size:
      72px 72px,
      72px 72px,
      360px 360px,
      360px 360px;
  }

  .ind-radar--primary {
    top: 0;
    right: -38vw;
    width: 96vw;
    opacity: 0.7;
  }

  .ind-radar--secondary {
    display: none;
  }

  .ind-aurora {
    filter: blur(20px);
    opacity: 0.8;
  }

  .aurora-rays {
    display: none;
  }

  .ind-beam {
    left: -40vw;
    width: 96vw;
    opacity: 0.65;
  }

  .ind-cross--b,
  .ind-cross--c {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .industrial-backdrop,
  .industrial-backdrop *,
  .industrial-backdrop *::before,
  .industrial-backdrop *::after {
    animation: none !important;
  }

  .industrial-backdrop {
    opacity: 0.55;
  }
}
</style>
