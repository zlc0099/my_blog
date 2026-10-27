<template>
  <div class="cover">
    <div class="sky" aria-hidden="true"></div>
    <div class="stars" aria-hidden="true"></div>
    <div class="moon" aria-hidden="true"></div>
    <div class="rays" aria-hidden="true"></div>
    <div class="ridge ridge--back" aria-hidden="true"></div>
    <div class="ridge ridge--front" aria-hidden="true"></div>

    <div class="nav">
      <span class="brand">
        <i class="brand__mark" aria-hidden="true">✦</i>
        <b>STARFALL</b>
        <small>CHRONICLE</small>
      </span>
      <span class="links">
        <i class="active">世界</i>
        <i>角色</i>
        <i>资讯</i>
        <i>媒体</i>
      </span>
      <span class="tools">JP / 音效</span>
      <span class="download">立即预约</span>
    </div>

    <div class="hero">
      <div class="hero__copy">
        <span class="eyebrow">ANIME RPG / WORLD 01</span>
        <h4>
          <span class="title-a">STARFALL</span>
          <span class="title-b">CHRONICLE</span>
        </h4>
        <p>在星海坠落之后，重新点亮世界。</p>
        <div class="actions">
          <span class="primary">开始冒险</span>
          <span class="secondary">观看预告</span>
        </div>
        <div class="platforms">
          <span>PC</span>
          <span>MOBILE</span>
          <span>CLOUD</span>
        </div>
      </div>

      <div class="character" aria-hidden="true">
        <span class="halo"></span>
        <span class="ring"></span>
        <span class="hair hair--a"></span>
        <span class="hair hair--b"></span>
        <span class="head"></span>
        <span class="body"></span>
        <span class="cape"></span>
        <span class="blade"></span>
      </div>

      <div class="tabs" aria-hidden="true">
        <span class="tab is-active"><i class="portrait portrait--a"></i><b>01</b></span>
        <span class="tab"><i class="portrait portrait--b"></i><b>02</b></span>
        <span class="tab"><i class="portrait portrait--c"></i><b>03</b></span>
      </div>
    </div>

    <div class="bottom">
      <div class="news">
        <span class="news__label">最新资讯</span>
        <span>版本前瞻 · 星海回响</span>
        <span>角色档案更新</span>
      </div>
      <span class="scroll">SCROLL / 01</span>
    </div>

    <div class="vignette" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0a0e20;
  color: #f2f4ff;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.2cqw, 14px);
}

.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 74% 16%, rgba(139, 116, 255, 0.36), transparent 42%),
    radial-gradient(ellipse at 25% 58%, rgba(63, 141, 196, 0.24), transparent 48%),
    radial-gradient(ellipse at 64% 100%, rgba(255, 158, 216, 0.16), transparent 48%),
    linear-gradient(160deg, #0b1028 0%, #101735 48%, #0a0b18 100%);
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.75) 0.6px, transparent 0.6px),
    radial-gradient(rgba(125, 231, 255, 0.55) 0.6px, transparent 0.6px);
  background-position: 0 0, 10px 16px;
  background-size: 34px 34px, 53px 53px;
  opacity: 0.4;
  mask-image: linear-gradient(180deg, #000 0%, transparent 82%);
}

.moon {
  position: absolute;
  top: -12%;
  right: 8%;
  width: 38%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 42% 38%, rgba(255, 255, 255, 0.3), transparent 6%),
    radial-gradient(circle at 53% 44%, rgba(255, 255, 255, 0.14), transparent 11%),
    radial-gradient(circle at 45% 36%, #c4b8ff 0%, #7564c9 48%, #27204d 72%, #0b0e20 100%);
  box-shadow:
    0 0 2.5em rgba(167, 139, 250, 0.35),
    0 0 8em rgba(113, 227, 240, 0.14);
  opacity: 0.8;
}

.rays {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 90%;
  height: 90%;
  background: conic-gradient(
    from 208deg at 68% 45%,
    transparent 0deg 12deg,
    rgba(255, 255, 255, 0.07) 12deg 13deg,
    transparent 13deg 26deg,
    rgba(125, 231, 255, 0.06) 26deg 27deg,
    transparent 27deg 360deg
  );
  transform: rotate(-8deg);
  pointer-events: none;
}

.ridge {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 26%;
  background: #080a16;
  pointer-events: none;
}

.ridge--back {
  clip-path: polygon(0 78%, 12% 46%, 21% 65%, 33% 28%, 43% 54%, 57% 18%, 68% 45%, 79% 30%, 91% 58%, 100% 40%, 100% 100%, 0 100%);
  background: #11162d;
  opacity: 0.85;
}

.ridge--front {
  height: 20%;
  clip-path: polygon(0 66%, 14% 28%, 25% 55%, 38% 36%, 52% 72%, 66% 38%, 79% 62%, 90% 40%, 100% 58%, 100% 100%, 0 100%);
  background: #070912;
}

.nav {
  position: relative;
  z-index: 5;
  display: flex;
  height: 3em;
  flex: none;
  align-items: center;
  gap: 1em;
  padding: 0 1em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(7, 10, 24, 0.72), rgba(7, 10, 24, 0.18));
  font-size: 0.62em;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 0.38em;
  white-space: nowrap;
}

.brand__mark {
  color: #f4c97a;
  font-size: 1em;
  font-style: normal;
}

.brand b {
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 1.35em;
  letter-spacing: 0.1em;
}

.brand small {
  color: #9ea7cc;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.62em;
  letter-spacing: 0.12em;
}

.links {
  display: flex;
  gap: 0.35em;
  margin-left: 0.8em;
}

.links i {
  position: relative;
  padding: 0.35em 0.45em;
  color: #b5bddc;
  font-size: 0.88em;
  font-style: normal;
  white-space: nowrap;
}

.links .active {
  color: #f4c97a;
}

.links .active::after {
  content: '';
  position: absolute;
  right: 0.45em;
  bottom: 0.1em;
  left: 0.45em;
  height: 1px;
  background: #f4c97a;
}

.tools {
  margin-left: auto;
  color: #8994bb;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.82em;
  white-space: nowrap;
}

.download {
  padding: 0.42em 0.8em;
  border: 1px solid rgba(244, 201, 122, 0.8);
  border-radius: 0.18em;
  background: linear-gradient(180deg, rgba(244, 201, 122, 0.18), rgba(244, 201, 122, 0.05));
  color: #f8d99b;
  font-size: 0.82em;
  white-space: nowrap;
}

.hero {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 0;
  flex: 1;
  padding: 0.9em 1.2em 0;
}

.hero__copy {
  position: relative;
  z-index: 3;
  display: flex;
  width: 55%;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 1.8em;
}

.eyebrow {
  color: #7de7ff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.58em;
  letter-spacing: 0.16em;
}

.hero__copy h4 {
  display: flex;
  flex-direction: column;
  margin-top: 0.45em;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-weight: 600;
  line-height: 0.82;
}

.title-a {
  background: linear-gradient(180deg, #ffffff 0%, #dce9ff 42%, #9fb7ef 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 3.8em;
  letter-spacing: 0.03em;
  filter: drop-shadow(0 0 0.12em rgba(167, 196, 255, 0.35));
}

.title-b {
  margin-top: 0.18em;
  color: transparent;
  font-size: 1.75em;
  letter-spacing: 0.16em;
  -webkit-text-stroke: 1px rgba(244, 201, 122, 0.8);
}

.hero__copy p {
  margin-top: 0.75em;
  color: #c5cbe4;
  font-size: 0.72em;
  letter-spacing: 0.03em;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55em;
  margin-top: 1em;
}

.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55em 0.9em;
  border-radius: 0.2em;
  font-size: 0.62em;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.primary {
  border: 1px solid #f4c97a;
  background: linear-gradient(180deg, #f8d99b 0%, #d7a94e 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  color: #211a0f;
  font-weight: 600;
}

.secondary {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(8, 12, 30, 0.44);
  color: #dfe4ff;
}

.platforms {
  display: flex;
  gap: 0.75em;
  margin-top: 0.9em;
  color: #7f8bb5;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.5em;
  letter-spacing: 0.1em;
}

.character {
  position: absolute;
  right: 9%;
  bottom: 8%;
  width: 38%;
  height: 86%;
  pointer-events: none;
}

.halo {
  position: absolute;
  top: 2%;
  left: 19%;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(244, 201, 122, 0.28), transparent 64%);
  filter: blur(0.2em);
}

.ring {
  position: absolute;
  top: 4%;
  left: 13%;
  width: 74%;
  aspect-ratio: 1;
  border: 1px solid rgba(125, 231, 255, 0.32);
  border-radius: 50%;
}

.ring::after {
  content: '';
  position: absolute;
  inset: 14%;
  border: 1px dashed rgba(244, 201, 122, 0.24);
  border-radius: 50%;
}

.hair {
  position: absolute;
  z-index: 1;
  top: 15%;
  width: 42%;
  height: 56%;
  border-radius: 55% 45% 52% 48%;
  background: linear-gradient(150deg, #292448 0%, #55437b 54%, #17172f 100%);
  box-shadow: inset 0.12em 0 0 rgba(125, 231, 255, 0.28);
}

.hair--a {
  left: 23%;
  transform: rotate(-8deg);
}

.hair--b {
  right: 21%;
  transform: scaleX(-1) rotate(-8deg);
}

.head {
  position: absolute;
  z-index: 2;
  top: 20%;
  left: 38%;
  width: 24%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(155deg, #514567 0%, #211d3b 52%, #0b0a17 100%);
  box-shadow:
    inset -0.18em -0.1em 0 rgba(125, 231, 255, 0.18),
    0 0 0.6em rgba(244, 201, 122, 0.16);
}

.head::after {
  content: '';
  position: absolute;
  top: 52%;
  left: 23%;
  width: 36%;
  height: 1px;
  background: linear-gradient(90deg, #7de7ff, #f4c97a);
  box-shadow: 0 0 0.5em rgba(125, 231, 255, 0.85);
  opacity: 0.85;
}

.body {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 28%;
  width: 44%;
  height: 58%;
  background: linear-gradient(160deg, #1a1835 0%, #443566 46%, #121327 100%);
  clip-path: polygon(50% 0%, 67% 9%, 82% 36%, 100% 100%, 0% 100%, 18% 36%, 33% 9%);
}

.cape {
  position: absolute;
  z-index: 1;
  right: 8%;
  bottom: 0;
  left: 8%;
  height: 55%;
  background: linear-gradient(150deg, rgba(114, 169, 232, 0.34), rgba(167, 139, 250, 0.12) 58%, transparent 100%);
  clip-path: polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%);
}

.blade {
  position: absolute;
  z-index: 0;
  top: 22%;
  right: 8%;
  width: 0.14em;
  height: 62%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(125, 231, 255, 0.24));
  box-shadow: 0 0 0.8em rgba(125, 231, 255, 0.55);
  transform: rotate(13deg);
}

.tabs {
  position: absolute;
  right: 1em;
  bottom: 1.4em;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.tab {
  display: flex;
  width: 2.2em;
  height: 2.7em;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.18em;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.18em;
  background: rgba(7, 10, 24, 0.58);
  color: #8f9ac0;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.5em;
}

.tab.is-active {
  border-color: #f4c97a;
  color: #f4c97a;
}

.portrait {
  width: 0.95em;
  height: 1.15em;
  border-radius: 0.12em;
  background: linear-gradient(160deg, #8f7bcd, #1c1d3a);
}

.portrait--b {
  background: linear-gradient(160deg, #78b8d9, #202546);
}

.portrait--c {
  background: linear-gradient(160deg, #d99bc6, #29203d);
}

.bottom {
  position: relative;
  z-index: 5;
  display: flex;
  height: 2.5em;
  flex: none;
  align-items: center;
  gap: 1em;
  margin: 0 1.2em;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  color: #a9b2d2;
  font-size: 0.55em;
}

.news {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 1em;
  overflow: hidden;
  white-space: nowrap;
}

.news__label {
  padding-right: 0.8em;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  color: #f4c97a;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  letter-spacing: 0.08em;
}

.scroll {
  margin-left: auto;
  color: #6f7ca6;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.vignette {
  position: absolute;
  inset: 0;
  z-index: 6;
  background:
    linear-gradient(90deg, rgba(4, 7, 20, 0.62) 0%, transparent 52%),
    linear-gradient(180deg, rgba(4, 7, 20, 0.3) 0%, transparent 30%, rgba(4, 7, 20, 0.42) 100%);
  pointer-events: none;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.55cqw, 14px);
  }

  .nav {
    gap: 0.6em;
    padding: 0 0.7em;
  }

  .links {
    margin-left: 0.3em;
  }

  .hero {
    padding: 0.7em 0.8em 0;
  }

  .hero__copy {
    width: 64%;
  }

  .character {
    right: 5%;
    width: 44%;
  }

  .tabs {
    right: 0.7em;
  }

  .bottom {
    margin: 0 0.8em;
  }

  .news span:nth-child(3) {
    display: none;
  }
}
</style>
