<template>
  <div class="cover">
    <section class="half dark">
      <span class="theme">DARK / INDUSTRIAL</span>
      <div class="file">
        <div class="file-top">
          <span>ARCH-024</span>
          <span>2026.10.26</span>
        </div>
        <h4>档案编辑风</h4>
        <p>深色工业科幻 / 橙色强调</p>
        <div class="rows">
          <span><i>01</i>学习记录</span>
          <span><i>02</i>项目复盘</span>
          <span><i>03</i>Agent 分工</span>
        </div>
        <div class="stamp">FILE / 001</div>
      </div>
    </section>

    <section class="half paper">
      <span class="theme">PAPER / DOSSIER</span>
      <div class="file">
        <div class="file-top">
          <span>ARCH-024</span>
          <span>2026.10.26</span>
        </div>
        <h4>档案编辑风</h4>
        <p>纸质档案 / 衬线排版</p>
        <div class="rows">
          <span><i>01</i>学习记录</span>
          <span><i>02</i>项目复盘</span>
          <span><i>03</i>Agent 分工</span>
        </div>
        <div class="stamp">FILE / 001</div>
      </div>
    </section>

    <span class="seam mono">DUAL THEME</span>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  font-size: clamp(5px, 1.02cqw, 13px);
}

.half {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dark {
  background:
    radial-gradient(rgba(242, 243, 244, 0.075) 1px, transparent 1px) 0 0 / 1.5em 1.5em,
    linear-gradient(180deg, #0b0d0f, #111417);
  color: #f2f3f4;
}

.paper {
  background:
    repeating-linear-gradient(0deg, rgba(26, 29, 31, 0.055) 0 1px, transparent 1px 1.5em),
    #f2efe9;
  color: #1a1d1f;
}

.theme {
  position: absolute;
  top: 0.9em;
  left: 0.9em;
  color: #7d838a;
  font-family: var(--font-mono);
  font-size: 0.55em;
  letter-spacing: 0.14em;
}

.paper .theme {
  color: #6b7176;
}

.file {
  position: relative;
  width: 72%;
  padding: 1em 1.05em;
  border: 1px solid #353a3f;
  background: rgba(24, 27, 30, 0.86);
}

.paper .file {
  border-color: #d0cabe;
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0.35em 0.45em 0 rgba(179, 172, 160, 0.22);
}

.file-top {
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
  padding-bottom: 0.45em;
  border-bottom: 1px solid #353a3f;
  color: #7d838a;
  font-family: var(--font-mono);
  font-size: 0.52em;
  letter-spacing: 0.08em;
}

.paper .file-top {
  border-bottom-color: #d0cabe;
  color: #6b7176;
}

.file h4 {
  margin: 0.55em 0 0.2em;
  color: #f5a623;
  font-family: var(--font-display);
  font-size: 1.7em;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.paper .file h4 {
  color: #1a1d1f;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.file p {
  margin: 0 0 0.6em;
  color: #a5a9ad;
  font-size: 0.6em;
}

.paper .file p {
  color: #6b7176;
}

.rows {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #353a3f;
}

.paper .rows {
  border-top-color: #d0cabe;
}

.rows span {
  display: flex;
  align-items: baseline;
  gap: 0.55em;
  padding: 0.36em 0;
  border-bottom: 1px solid #262a2e;
  color: #cfd2d5;
  font-size: 0.6em;
}

.paper .rows span {
  border-bottom-color: #e0dbd1;
  color: #2d3134;
}

.rows i {
  color: #f5a623;
  font-family: var(--font-mono);
  font-size: 0.86em;
  font-style: normal;
}

.paper .rows i {
  color: #965a00;
}

.stamp {
  position: absolute;
  right: 0.6em;
  bottom: 0.5em;
  padding: 0.22em 0.45em;
  border: 1px solid rgba(245, 166, 35, 0.65);
  color: #f5a623;
  font-family: var(--font-mono);
  font-size: 0.5em;
  letter-spacing: 0.1em;
  transform: rotate(-7deg);
}

.paper .stamp {
  border-color: rgba(150, 90, 0, 0.55);
  color: #965a00;
}

.seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: rgba(245, 166, 35, 0.55);
  transform: translateX(-50%);
}

.seam::after {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0.3em 0.55em;
  border: 1px solid rgba(245, 166, 35, 0.55);
  background: #121416;
  color: #f5a623;
  content: 'DUAL THEME';
  font-size: 0.48em;
  letter-spacing: 0.12em;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

@container (max-width: 520px) {
  .rows span:nth-child(n + 3),
  .stamp {
    display: none;
  }

  .file {
    width: 80%;
    padding: 0.7em;
  }

  .file h4 {
    font-size: 1.4em;
  }
}
</style>
