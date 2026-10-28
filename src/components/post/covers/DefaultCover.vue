<template>
  <div class="default-cover" :class="`default-cover--${post.category}`">
    <div class="default-cover__grid" aria-hidden="true"></div>
    <div class="default-cover__beam" aria-hidden="true"></div>

    <div class="default-cover__top">
      <span>{{ post.categoryInfo.en }}</span>
      <span>{{ post.archiveCode }}</span>
    </div>

    <div class="default-cover__center">
      <span class="default-cover__code">{{ post.archiveCode }}</span>
      <span class="default-cover__zh">{{ post.categoryInfo.zh }}</span>
    </div>

    <div class="default-cover__bottom">
      <span>PERSONAL ARCHIVE</span>
      <span>FILE / ENTRY</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.default-cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.1em 1.2em;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 82% 16%, var(--accent-muted), transparent 52%),
    var(--bg-secondary);
  color: var(--text-primary);
  container-type: inline-size;
  font-family: var(--font-mono);
  font-size: clamp(7px, 2.1cqw, 12px);
}

.default-cover__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 1.6em 1.6em;
  mask-image: linear-gradient(135deg, #000 0%, transparent 72%);
  pointer-events: none;
}

.default-cover__beam {
  position: absolute;
  top: -40%;
  right: 12%;
  width: 1px;
  height: 180%;
  background: linear-gradient(180deg, transparent, var(--accent-line), transparent);
  transform: rotate(24deg);
  opacity: 0.7;
}

.default-cover__beam::after {
  position: absolute;
  top: 34%;
  right: -3.2em;
  width: 6.4em;
  height: 6.4em;
  border: 1px solid var(--border-strong);
  content: '';
  transform: rotate(45deg);
}

.default-cover__top,
.default-cover__bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1em;
  color: var(--text-muted);
  font-size: 0.58em;
  letter-spacing: 0.1em;
}

.default-cover__top span:first-child {
  overflow: hidden;
  color: var(--accent-ink);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.default-cover__center {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  min-width: 0;
}

.default-cover__code {
  color: transparent;
  font-family: var(--font-display);
  font-size: 4.2em;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 0.9;
  -webkit-text-stroke: 1px var(--border-strong);
  transition: -webkit-text-stroke-color var(--dur-base) var(--ease-out);
}

.default-cover__zh {
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 1.25em;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

:global(.archive-card:hover) .default-cover__code {
  -webkit-text-stroke-color: var(--accent);
}

.default-cover__bottom span:last-child {
  color: var(--text-muted);
  white-space: nowrap;
}

.default-cover--ai-division .default-cover__top span:first-child {
  color: var(--text-secondary);
}
</style>
