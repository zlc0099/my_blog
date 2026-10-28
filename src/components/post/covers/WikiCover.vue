<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>

    <div class="caption">
      <span>WIKI / ENCYCLOPEDIA</span>
      <span>INFOBOX · TOC · SPOILER · LINKS</span>
    </div>

    <div class="board">
      <aside class="toc">
        <span class="toc__title">CONTENTS</span>
        <span class="toc__item is-on">01 / Overview</span>
        <span class="toc__item">02 / Story</span>
        <span class="toc__item">03 / Characters</span>
        <span class="toc__item">04 / Staff</span>
        <span class="toc__item">05 / Music</span>
        <span class="toc__item">06 / Release</span>
        <span class="toc__item">07 / Reception</span>
        <span class="toc__foot">72CH / READING</span>
      </aside>

      <main class="article">
        <div class="article__head">
          <span class="type-tag type-tag--game">GAME / RPG</span>
          <h4>Wandering Star</h4>
          <span class="orig">原名 / 星を巡る物語</span>
          <div class="meta-row">
            <span class="pill">ACTION RPG</span>
            <span class="pill">MULTI-PLATFORM</span>
            <span class="pill pill--muted">VERIFIED</span>
          </div>
        </div>

        <div class="section">
          <div class="h2"><i class="h2__bar"></i>Overview<span class="anchor">¶</span></div>
          <p class="lines"><i></i><i></i><i class="short"></i></p>
          <p class="lines"><i></i><i class="short"></i></p>
        </div>

        <div class="spoiler">
          <span class="spoiler__warn">⚠</span>
          <span>Spoiler content / click to expand</span>
          <span class="spoiler__chev">▾</span>
        </div>

        <div class="section">
          <div class="h3">▸ Characters</div>
          <div class="table">
            <div class="tr th"><span>NAME</span><span>CV</span><span>ROLE</span></div>
            <div class="tr">
              <span class="name"><i class="avatar"></i><b></b></span>
              <span class="bar bar--cv"></span>
              <span class="role role--main"></span>
            </div>
            <div class="tr">
              <span class="name"><i class="avatar"></i><b></b></span>
              <span class="bar bar--cv"></span>
              <span class="role"></span>
            </div>
            <div class="tr">
              <span class="name"><i class="avatar"></i><b></b></span>
              <span class="bar bar--cv"></span>
              <span class="role"></span>
            </div>
          </div>
        </div>

        <div class="article__links">
          <span class="wiki-link">[[Related Entry]]</span>
          <span class="wiki-link wiki-link--missing">[[Unwritten Entry?]]</span>
        </div>
      </main>

      <aside class="infobox">
        <div class="infobox__top">
          <span class="type-tag type-tag--anime">ANIME</span>
          <span class="infobox__code">INFO / 01</span>
        </div>
        <div class="poster">
          <span class="poster__moon"></span>
          <span class="poster__figure"></span>
          <span class="poster__line"></span>
        </div>
        <div class="infobox__names">
          <b>星を巡る物語</b>
          <span>Wandering Star</span>
        </div>
        <dl class="fields">
          <div><dt>原作</dt><dd>—</dd></div>
          <div><dt>导演</dt><dd>—</dd></div>
          <div><dt>平台</dt><dd>PC / PS5</dd></div>
          <div><dt>状态</dt><dd><em>连载中</em></dd></div>
          <div><dt>官网</dt><dd>↗</dd></div>
        </dl>
      </aside>
    </div>

    <span class="note note--sticky">STICKY INFOBOX</span>
    <span class="note note--spoiler">分级剧透 / FOLD</span>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 12% 8%, rgba(108, 92, 231, 0.08), transparent 42%),
    radial-gradient(ellipse at 92% 92%, rgba(255, 107, 129, 0.07), transparent 44%),
    #fafafa;
  color: #2d3436;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.18cqw, 14px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(108, 92, 231, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(108, 92, 231, 0.06) 1px, transparent 1px);
  background-size: 2.2em 2.2em;
  mask-image: radial-gradient(ellipse at 50% 46%, #000 0%, transparent 84%);
  pointer-events: none;
}

.caption {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7em 0.9em 0;
  color: #7a8189;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.1em;
}

.caption span:first-child {
  color: #6c5ce7;
}

.board {
  position: relative;
  z-index: 1;
  display: grid;
  height: calc(100% - 1.8em);
  grid-template-columns: 0.55fr 1.75fr 0.95fr;
  gap: 0.6em;
  padding: 0.65em 0.9em 0.75em;
}

.toc {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.38em;
  padding: 0.7em 0.6em;
  border-right: 1px solid #e7e9ee;
}

.toc__title {
  margin-bottom: 0.4em;
  color: #9aa1aa;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  letter-spacing: 0.1em;
}

.toc__item {
  padding: 0.22em 0 0.22em 0.55em;
  border-left: 1px solid transparent;
  color: #7f8790;
  font-size: 0.46em;
  white-space: nowrap;
}

.toc__item.is-on {
  border-left-color: #6c5ce7;
  background: rgba(108, 92, 231, 0.08);
  color: #4b3fc4;
  font-weight: 600;
}

.toc__foot {
  margin-top: auto;
  color: #a4abb4;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.38em;
  letter-spacing: 0.08em;
}

.article {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.75em;
  padding: 0.6em 0.4em;
}

.article__head {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.type-tag {
  align-self: flex-start;
  padding: 0.22em 0.5em;
  border-radius: 999px;
  background: #eef1ff;
  color: #4b3fc4;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.38em;
  letter-spacing: 0.06em;
}

.type-tag--game {
  background: #eeebff;
  color: #5a4bd6;
}

.type-tag--anime {
  background: #ffecef;
  color: #d94b63;
}

.article__head h4 {
  margin-top: 0.2em;
  color: #1f2428;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 2.1em;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 0.95;
}

.orig {
  color: #8d949d;
  font-size: 0.44em;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin-top: 0.25em;
}

.pill {
  padding: 0.2em 0.45em;
  border: 1px solid #e2e5eb;
  border-radius: 999px;
  color: #747c85;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.34em;
  letter-spacing: 0.04em;
}

.pill--muted {
  border-color: #d8f0e6;
  background: #f1fbf6;
  color: #2e8a68;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.35em;
}

.h2 {
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding-bottom: 0.28em;
  border-bottom: 1px solid #e7e9ee;
  color: #252a2f;
  font-size: 0.74em;
  font-weight: 700;
}

.h2__bar {
  width: 0.28em;
  height: 0.9em;
  background: #6c5ce7;
}

.anchor {
  margin-left: auto;
  color: #b6bcc4;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.7em;
  font-weight: 400;
}

.h3 {
  color: #3a4046;
  font-size: 0.52em;
  font-weight: 600;
}

.lines {
  display: flex;
  flex-wrap: wrap;
  gap: 0.24em;
}

.lines i {
  height: 0.26em;
  flex: 1 1 38%;
  border-radius: 999px;
  background: #dfe3e8;
}

.lines i.short {
  flex-basis: 22%;
}

.spoiler {
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.45em 0.55em;
  border: 1px dashed #e17055;
  border-radius: 0.35em;
  background: #fff3ef;
  color: #a94b35;
  font-size: 0.42em;
}

.spoiler__warn {
  font-size: 1em;
}

.spoiler__chev {
  margin-left: auto;
  color: #c57a68;
}

.table {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eceff1;
}

.tr {
  display: grid;
  grid-template-columns: 1.35fr 1fr 0.8fr;
  align-items: center;
  gap: 0.5em;
  min-height: 1.5em;
  border-bottom: 1px solid #eceff1;
  color: #8c949d;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.35em;
  letter-spacing: 0.04em;
}

.tr.th {
  color: #9aa1aa;
  background: #f5f6fa;
}

.name {
  display: flex;
  align-items: center;
  gap: 0.35em;
}

.avatar {
  width: 1.5em;
  height: 1.5em;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #d8d2f6, #a79be8);
}

.name b {
  width: 55%;
  height: 0.26em;
  border-radius: 999px;
  background: #cdd3db;
}

.bar--cv {
  width: 62%;
  height: 0.26em;
  border-radius: 999px;
  background: #dfe3e8;
}

.role {
  width: 1.9em;
  height: 0.75em;
  border-radius: 999px;
  background: #eef0f4;
}

.role--main {
  background: #eeebff;
  outline: 1px solid #cfc7ff;
}

.article__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  margin-top: auto;
}

.wiki-link {
  padding: 0.22em 0.45em;
  border-radius: 999px;
  background: #eef1ff;
  color: #4b3fc4;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.35em;
}

.wiki-link--missing {
  border: 1px dashed #e17055;
  background: transparent;
  color: #c25a43;
}

.infobox {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.45em;
  padding: 0.6em;
  border: 1px solid #dfe6e9;
  border-radius: 0.5em;
  background: #f5f6fa;
  box-shadow: 0 0.5em 1.2em rgba(45, 52, 54, 0.06);
}

.infobox__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.infobox__code {
  color: #a4abb4;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.32em;
  letter-spacing: 0.08em;
}

.poster {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 0.35em;
  background:
    radial-gradient(circle at 72% 28%, rgba(255, 255, 255, 0.85), transparent 22%),
    linear-gradient(155deg, #2d2a4a 0%, #51478c 45%, #c07a8f 100%);
}

.poster__moon {
  position: absolute;
  top: 12%;
  right: 14%;
  width: 1.9em;
  height: 1.9em;
  border-radius: 50%;
  background: #f6e8d6;
  box-shadow: 0 0 1.2em rgba(246, 232, 214, 0.55);
}

.poster__figure {
  position: absolute;
  bottom: -8%;
  left: 42%;
  width: 18%;
  height: 58%;
  border-radius: 50% 50% 20% 20%;
  background: #1b1928;
  transform: rotate(-8deg);
}

.poster__line {
  position: absolute;
  right: -12%;
  bottom: 18%;
  width: 72%;
  height: 1px;
  background: rgba(246, 232, 214, 0.45);
  transform: rotate(-24deg);
}

.infobox__names {
  display: flex;
  flex-direction: column;
  gap: 0.12em;
  text-align: center;
}

.infobox__names b {
  font-size: 0.55em;
  letter-spacing: 0.02em;
}

.infobox__names span {
  color: #8d949d;
  font-size: 0.36em;
}

.fields {
  display: flex;
  flex-direction: column;
}

.fields div {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 0.4em;
  padding: 0.28em 0;
  border-bottom: 1px dashed #dfe3e8;
}

.fields div:last-child {
  border-bottom: 0;
}

.fields dt {
  color: #858d96;
  font-size: 0.36em;
}

.fields dd {
  color: #2d3436;
  font-size: 0.38em;
  text-align: right;
  white-space: nowrap;
}

.fields dd em {
  color: #2e8a68;
  font-style: normal;
}

.note {
  position: absolute;
  z-index: 3;
  padding: 0.3em 0.5em;
  border: 1px solid #dcd2c2;
  background: rgba(255, 255, 255, 0.7);
  color: #8b8274;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.34em;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.note--sticky {
  top: 22%;
  right: 3%;
}

.note--spoiler {
  bottom: 8%;
  left: 7%;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.5cqw, 12px);
  }

  .board {
    grid-template-columns: 1.6fr 1fr;
    gap: 0.45em;
    padding: 0.55em 0.65em;
  }

  .toc,
  .note {
    display: none;
  }

  .article__head h4 {
    font-size: 1.65em;
  }

  .caption span:last-child {
    display: none;
  }

  .fields div:nth-child(n + 4) {
    display: none;
  }
}
</style>
