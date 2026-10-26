<template>
  <div class="cover">
    <div class="checker" aria-hidden="true"></div>

    <div class="pet" aria-hidden="true">
      <i class="hair back"></i>
      <i class="face"></i>
      <i class="eye l"></i>
      <i class="eye r"></i>
      <i class="mouth"></i>
      <i class="hair front"></i>
      <i class="body"></i>
    </div>

    <div class="bubble">
      <span class="agent">AGENT USAGE</span>
      <b class="value">1.28M</b>
      <span class="unit">TOKENS / TODAY</span>
      <div class="summary">本月 24.6M · 缓存 96%</div>
      <div class="sessions">
        <span><em>project-a</em><i>328K</i></span>
        <span><em>project-b</em><i>214K</i></span>
      </div>
      <span class="tip">10s 后自动收起</span>
    </div>

    <div class="menu">
      <span>大小 50%</span>
      <span>点击穿透</span>
      <span>随机走动</span>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #141619;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(5px, 1.02cqw, 13px);
}

.checker {
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(#191c20 0% 25%, #101214 0% 50%) 0 0 / 1.4em 1.4em;
  opacity: 0.9;
}

.pet {
  position: absolute;
  bottom: 12%;
  left: 11%;
  width: 20%;
  height: 64%;
}

.pet i {
  position: absolute;
  display: block;
}

.hair.back {
  top: 2%;
  left: 8%;
  width: 84%;
  height: 78%;
  border-radius: 46% 46% 38% 38%;
  background: #5b4a7d;
}

.face {
  top: 16%;
  left: 20%;
  width: 60%;
  height: 50%;
  border-radius: 48%;
  background: #ffe8d6;
}

.eye {
  top: 40%;
  width: 6%;
  height: 7%;
  border-radius: 50%;
  background: #2f2a35;
}

.eye.l {
  left: 36%;
}

.eye.r {
  left: 58%;
}

.mouth {
  top: 52%;
  left: 47%;
  width: 8%;
  height: 4%;
  border-radius: 0 0 50% 50%;
  background: #c77b6b;
}

.hair.front {
  top: 8%;
  left: 12%;
  width: 76%;
  height: 26%;
  border-radius: 50% 50% 42% 42%;
  background: #6b5b8e;
  clip-path: polygon(0 0, 100% 0, 100% 58%, 82% 36%, 66% 72%, 50% 40%, 32% 74%, 16% 38%, 0 60%);
}

.body {
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 36%;
  border-radius: 40% 40% 18% 18%;
  background: #3f3a56;
  box-shadow: inset 0 0.35em 0 rgba(255, 255, 255, 0.08);
}

.bubble {
  position: absolute;
  top: 7%;
  right: 8%;
  bottom: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.12em;
  width: 46%;
  padding: 1.6em 1.8em;
  border: 2px solid #2f2a35;
  border-radius: 48% 52% 46% 54% / 54% 55% 45% 46%;
  background: #fffdf6;
  box-shadow: 0 0.8em 1.8em rgba(0, 0, 0, 0.3);
  color: #2f2a35;
  text-align: center;
}

.agent {
  color: #7d7489;
  font-family: var(--font-mono);
  font-size: 0.58em;
  letter-spacing: 0.12em;
}

.value {
  color: #b94a2f;
  font-family: var(--font-display);
  font-size: 2.9em;
  font-weight: 700;
  line-height: 1.02;
  font-variant-numeric: tabular-nums;
}

.unit {
  color: #7d7489;
  font-family: var(--font-mono);
  font-size: 0.52em;
  letter-spacing: 0.12em;
}

.summary {
  width: 88%;
  margin-top: 0.3em;
  padding: 0.32em 0.4em;
  border-top: 1px dashed rgba(47, 42, 53, 0.24);
  border-bottom: 1px dashed rgba(47, 42, 53, 0.24);
  background: rgba(255, 240, 214, 0.4);
  color: #5d5668;
  font-size: 0.52em;
  white-space: nowrap;
}

.sessions {
  display: flex;
  flex-direction: column;
  gap: 0.18em;
  width: 82%;
  padding-top: 0.25em;
}

.sessions span {
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
  padding: 0.16em 0.35em;
  border-radius: 0.3em;
  font-size: 0.52em;
}

.sessions span:nth-child(odd) {
  background: rgba(47, 42, 53, 0.05);
}

.sessions em {
  overflow: hidden;
  font-style: normal;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sessions i {
  color: #b4532a;
  font-family: var(--font-mono);
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.tip {
  margin-top: 0.28em;
  color: #9a93a5;
  font-size: 0.48em;
}

.menu {
  position: absolute;
  right: 7%;
  bottom: 6%;
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  padding: 0.35em 0.55em;
  border: 1px solid #2f2a35;
  border-radius: 0.35em;
  background: #fffdf6;
  box-shadow: 0 0.4em 0.9em rgba(0, 0, 0, 0.24);
}

.menu span {
  color: #5d5668;
  font-size: 0.52em;
  white-space: nowrap;
}

@container (max-width: 520px) {
  .sessions span:nth-child(2),
  .menu,
  .tip {
    display: none;
  }

  .bubble {
    width: 58%;
    padding: 0.9em 1em;
  }

  .value {
    font-size: 2em;
  }
}
</style>
