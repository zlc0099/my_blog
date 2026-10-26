<template>
  <div class="cover">
    <div class="sky" aria-hidden="true"></div>
    <i class="cloud c1" aria-hidden="true"></i>
    <i class="cloud c2" aria-hidden="true"></i>
    <div class="ground" aria-hidden="true"></div>

    <div class="panel">
      <i class="corner tl"></i>
      <i class="corner tr"></i>
      <i class="corner bl"></i>
      <i class="corner br"></i>
      <span class="badge">MY LIST / 2026</span>
      <h4>年度选择</h4>
      <p>从候选里挑出你想要的那一个</p>
      <div class="slots">
        <i class="s1"></i>
        <i class="s2"></i>
        <i class="s3"></i>
        <i class="s4"></i>
        <i class="s5"></i>
      </div>
    </div>

    <span class="chapter" aria-hidden="true">CHAPTER 01 / SELECT</span>

    <div class="dialogue">
      <span class="name">YOU</span>
      <p>先做选择，再决定下一步。</p>
      <div class="choices">
        <span class="active">开始填写</span>
        <span>看看示例</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #9CCCEB;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(5px, 1.02cqw, 13px);
  color: #25364A;
}

.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 8%, rgba(245, 250, 255, 0.55), transparent 46%),
    radial-gradient(ellipse at 12% 92%, rgba(100, 143, 199, 0.12), transparent 44%),
    linear-gradient(180deg, #9CCCEB 0%, #DDEAF4 56%, #F5FAFF 100%);
}

.cloud {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  filter: blur(0.7em);
}

.c1 {
  top: 12%;
  right: 10%;
  width: 15em;
  height: 3.4em;
}

.c2 {
  top: 26%;
  left: 2%;
  width: 11em;
  height: 2.6em;
  opacity: 0.7;
}

.ground {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 34%;
  background:
    linear-gradient(180deg, rgba(100, 143, 199, 0.1), rgba(100, 143, 199, 0.02)),
    linear-gradient(180deg, #DDEAF4, #F5FAFF);
  clip-path: polygon(0 38%, 10% 30%, 22% 40%, 36% 18%, 50% 32%, 62% 22%, 76% 36%, 88% 24%, 100% 34%, 100% 100%, 0 100%);
}

.panel {
  position: absolute;
  top: 13%;
  left: 7%;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  width: 58%;
  padding: 1.15em 1.25em 1.2em;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 1em;
  background: rgba(248, 252, 255, 0.76);
  box-shadow: 0 12px 36px rgba(42, 72, 104, 0.12);
  backdrop-filter: blur(18px) saturate(125%);
}

.corner {
  position: absolute;
  width: 1.6em;
  height: 1.6em;
  border-color: #648FC7;
  border-style: solid;
}

.corner.tl {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
}

.corner.tr {
  top: -1px;
  right: -1px;
  border-width: 2px 2px 0 0;
}

.corner.bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2px 2px;
}

.corner.br {
  right: -1px;
  bottom: -1px;
  border-width: 0 2px 2px 0;
}

.badge {
  align-self: flex-start;
  padding: 0.28em 0.65em;
  background: #648FC7;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.56em;
  letter-spacing: 0.12em;
}

.panel h4 {
  margin: 0.2em 0 0;
  color: #25364A;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 2.2em;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.15;
}

.panel p {
  margin: 0;
  color: #607287;
  font-size: 0.72em;
}

.slots {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.35em;
  margin-top: 0.35em;
}

.slots i {
  display: block;
  aspect-ratio: 2 / 3;
  border: 1px solid rgba(37, 54, 74, 0.12);
}

.slots .s1 {
  background: linear-gradient(160deg, #648FC7, #3F6FA8);
}

.slots .s2 {
  background: linear-gradient(160deg, #C99554, #8F6B3F);
}

.slots .s3 {
  background: linear-gradient(160deg, #4D9A83, #356C5C);
}

.slots .s4 {
  background: linear-gradient(160deg, #8B9AAA, #607287);
}

.slots .s5 {
  background: linear-gradient(160deg, #A7B3BF, #5A6E85);
}

.chapter {
  position: absolute;
  top: 16%;
  right: 5%;
  color: #8B9AAA;
  font-family: var(--font-mono);
  font-size: 0.55em;
  letter-spacing: 0.18em;
  writing-mode: vertical-rl;
}

.dialogue {
  position: absolute;
  right: 6%;
  bottom: 7%;
  left: 6%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.4em 1.2em;
  padding: 0.8em 1em;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 1em;
  background: rgba(248, 252, 255, 0.82);
  box-shadow: 0 12px 36px rgba(42, 72, 104, 0.12);
  backdrop-filter: blur(18px) saturate(125%);
}

.name {
  position: absolute;
  top: -1.35em;
  left: 0.9em;
  padding: 0.25em 0.8em;
  background: #648FC7;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.56em;
  letter-spacing: 0.14em;
}

.dialogue p {
  grid-column: 1;
  margin: 0;
  color: #25364A;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 0.8em;
  line-height: 1.6;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}

.choices span {
  padding: 0.38em 0.8em;
  border: 1px solid rgba(37, 54, 74, 0.18);
  border-radius: 0.4em;
  background: rgba(255, 255, 255, 0.36);
  color: #607287;
  font-size: 0.62em;
  white-space: nowrap;
  text-align: center;
}

.choices .active {
  border-color: #648FC7;
  background: #648FC7;
  color: #fff;
}

@container (max-width: 520px) {
  .slots,
  .chapter,
  .c2 {
    display: none;
  }

  .panel {
    width: 66%;
    top: 10%;
  }

  .panel h4 {
    font-size: 1.8em;
  }

  .dialogue p {
    font-size: 0.7em;
  }
}
</style>
