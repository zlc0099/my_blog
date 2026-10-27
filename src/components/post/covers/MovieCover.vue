<template>
  <div class="cover">
    <div class="grain" aria-hidden="true"></div>
    <div class="glow" aria-hidden="true"></div>

    <div class="topbar">
      <span class="brand">FRAME<span>ARCHIVE</span></span>
      <span class="nav">
        <i class="active">发现</i>
        <i>片单</i>
        <i>影评</i>
      </span>
      <span class="search">搜索电影 / 人物</span>
      <span class="avatar" aria-hidden="true"></span>
    </div>

    <div class="hero">
      <div class="poster-card">
        <div class="poster-art">
          <span class="poster-kicker">FEATURED</span>
          <span class="poster-title">NIGHT<br />FRAME</span>
          <span class="poster-ring" aria-hidden="true"></span>
        </div>
        <span class="poster-code">POSTER / 01</span>
      </div>

      <div class="hero-info">
        <span class="eyebrow">FEATURED FILM / 01</span>
        <h4>NIGHT FRAME</h4>
        <div class="meta">
          <span>DRAMA</span>
          <span>MYSTERY</span>
          <span>01:58</span>
        </div>
        <p>A cinematic study in light, shadow and the space between frames.</p>
        <div class="actions">
          <span class="primary">VIEW DETAILS</span>
          <span class="secondary">＋ WATCHLIST</span>
        </div>
        <div class="curated">
          <span class="star" aria-hidden="true">★</span>
          <span>CURATED PICK</span>
          <span class="curated__meta">SELECTED / 2026</span>
        </div>
      </div>
    </div>

    <div class="strip">
      <div class="strip-head">
        <span>TRENDING NOW</span>
        <span>VIEW ALL →</span>
      </div>
      <div class="strip-row">
        <div class="mini">
          <span class="mini-art mini-art--a"></span>
          <b>STILL 01</b>
          <small>DRAMA</small>
        </div>
        <div class="mini">
          <span class="mini-art mini-art--b"></span>
          <b>STILL 02</b>
          <small>NOIR</small>
        </div>
        <div class="mini">
          <span class="mini-art mini-art--c"></span>
          <b>STILL 03</b>
          <small>SCI-FI</small>
        </div>
        <div class="mini">
          <span class="mini-art mini-art--d"></span>
          <b>STILL 04</b>
          <small>CLASSIC</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: 0.85em 1em 0.9em;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 82% 8%, rgba(229, 184, 92, 0.13), transparent 42%),
    radial-gradient(ellipse at 10% 90%, rgba(72, 112, 145, 0.16), transparent 50%),
    linear-gradient(145deg, #101114 0%, #15171b 52%, #101114 100%);
  color: #f5f5f7;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.25cqw, 14px);
}

.grain {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.16) 0.6px, transparent 0.6px),
    linear-gradient(180deg, transparent 0 96%, rgba(229, 184, 92, 0.24) 96% 97%, transparent 97%);
  background-size: 4px 4px, 100% 100%;
  opacity: 0.24;
  pointer-events: none;
}

.glow {
  position: absolute;
  top: -25%;
  right: 12%;
  width: 48%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 184, 92, 0.2), transparent 68%);
  pointer-events: none;
}

.topbar {
  position: relative;
  z-index: 1;
  display: flex;
  height: 2.2em;
  flex: none;
  align-items: center;
  gap: 0.7em;
  padding: 0 0.7em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.35em;
  background: rgba(32, 34, 41, 0.76);
  color: #b3b5bd;
  font-size: 0.66em;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 0.28em;
  color: #f5f5f7;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 1.15em;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.brand span {
  color: #e5b85c;
  font-size: 0.7em;
  letter-spacing: 0.06em;
}

.nav {
  display: flex;
  gap: 0.25em;
}

.nav i {
  padding: 0.32em 0.5em;
  color: #858995;
  font-size: 0.85em;
  font-style: normal;
  white-space: nowrap;
}

.nav .active {
  border-bottom: 1px solid #e5b85c;
  color: #f5f5f7;
}

.search {
  margin-left: auto;
  padding: 0.38em 0.65em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.25em;
  color: #858995;
  font-size: 0.78em;
  white-space: nowrap;
}

.avatar {
  width: 1.55em;
  height: 1.55em;
  border: 1px solid rgba(229, 184, 92, 0.55);
  border-radius: 50%;
  background: linear-gradient(145deg, #30333b, #17191e);
}

.hero {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 0;
  flex: 1;
  gap: 1.1em;
}

.poster-card {
  display: flex;
  width: 25%;
  min-width: 6.2em;
  flex-direction: column;
  gap: 0.35em;
}

.poster-art {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.45em;
  background:
    radial-gradient(circle at 67% 27%, rgba(229, 184, 92, 0.38), transparent 25%),
    linear-gradient(162deg, #273545 0%, #121820 58%, #090b0e 100%);
  box-shadow: 0 0.5em 1.4em rgba(0, 0, 0, 0.42);
}

.poster-art::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, transparent 0 40%, rgba(255, 255, 255, 0.06) 41%, transparent 42%),
    repeating-linear-gradient(90deg, transparent 0 12%, rgba(255, 255, 255, 0.035) 12% 12.5%, transparent 12.5% 24%);
  mix-blend-mode: screen;
}

.poster-ring {
  position: absolute;
  top: 18%;
  right: 12%;
  width: 55%;
  aspect-ratio: 1;
  border: 1px solid rgba(229, 184, 92, 0.48);
  border-radius: 50%;
}

.poster-ring::after {
  content: '';
  position: absolute;
  inset: 22%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
}

.poster-kicker {
  position: relative;
  z-index: 1;
  padding: 0 0.8em;
  color: #e5b85c;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.5em;
  letter-spacing: 0.16em;
}

.poster-title {
  position: relative;
  z-index: 1;
  padding: 0.15em 0.5em 0.6em;
  color: #f5f5f7;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 2.25em;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 0.82;
}

.poster-code {
  color: #858995;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.48em;
  letter-spacing: 0.08em;
}

.hero-info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-right: 1em;
}

.eyebrow {
  color: #e5b85c;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.55em;
  letter-spacing: 0.16em;
}

.hero-info h4 {
  margin-top: 0.45em;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 3.05em;
  font-weight: 600;
  letter-spacing: 0.025em;
  line-height: 0.9;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  margin-top: 0.65em;
  color: #b3b5bd;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.5em;
  letter-spacing: 0.08em;
}

.meta span {
  padding-right: 0.45em;
  border-right: 1px solid rgba(255, 255, 255, 0.14);
}

.meta span:last-child {
  border-right: 0;
}

.hero-info p {
  max-width: 24em;
  margin-top: 0.75em;
  color: #b3b5bd;
  font-size: 0.62em;
  line-height: 1.55;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.9em;
}

.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.48em 0.7em;
  border-radius: 0.25em;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.5em;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.primary {
  border: 1px solid #e5b85c;
  background: linear-gradient(180deg, #f1c875, #c9983e);
  color: #1c1710;
  font-weight: 600;
}

.secondary {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #d4d6dc;
}

.curated {
  display: flex;
  align-items: center;
  gap: 0.4em;
  margin-top: auto;
  padding-top: 0.7em;
  color: #d4d6dc;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.46em;
  letter-spacing: 0.08em;
}

.curated .star {
  color: #e5b85c;
  font-size: 1.2em;
}

.curated__meta {
  margin-left: 0.4em;
  color: #858995;
}

.strip {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 0;
  flex: none;
  flex-direction: column;
  gap: 0.45em;
  padding-top: 0.7em;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.strip-head {
  display: flex;
  justify-content: space-between;
  color: #858995;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.48em;
  letter-spacing: 0.1em;
}

.strip-head span:last-child {
  color: #e5b85c;
}

.strip-row {
  display: flex;
  gap: 0.65em;
}

.mini {
  display: grid;
  min-width: 0;
  flex: 1;
  grid-template-columns: 1.8em minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 0.45em;
  align-items: center;
}

.mini-art {
  grid-row: 1 / 3;
  display: block;
  aspect-ratio: 2 / 3;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.25em;
  background: #202229;
}

.mini-art--a {
  background:
    radial-gradient(circle at 70% 24%, rgba(229, 184, 92, 0.45), transparent 28%),
    linear-gradient(155deg, #263241, #0b0e12);
}

.mini-art--b {
  background:
    linear-gradient(120deg, transparent 42%, rgba(255, 255, 255, 0.2) 43%, transparent 45%),
    linear-gradient(155deg, #3b3030, #0d0b0c);
}

.mini-art--c {
  background:
    radial-gradient(circle at 30% 70%, rgba(114, 169, 232, 0.42), transparent 30%),
    linear-gradient(155deg, #17293a, #090d12);
}

.mini-art--d {
  background:
    linear-gradient(160deg, rgba(229, 184, 92, 0.35), transparent 40%),
    linear-gradient(155deg, #2e2b25, #0b0b0a);
}

.mini b {
  overflow: hidden;
  color: #d4d6dc;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 0.82em;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini small {
  color: #858995;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.06em;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.6cqw, 14px);
    gap: 0.65em;
    padding: 0.7em;
  }

  .hero {
    gap: 0.8em;
  }

  .poster-card {
    width: 30%;
  }

  .hero-info {
    padding-right: 0;
  }

  .hero-info h4 {
    font-size: 2.7em;
  }

  .strip-row .mini:nth-child(4) {
    display: none;
  }
}
</style>
