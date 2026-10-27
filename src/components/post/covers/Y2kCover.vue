<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>
    <span class="spark spark--a" aria-hidden="true">✦</span>
    <span class="spark spark--b" aria-hidden="true">✦</span>
    <span class="spark spark--c" aria-hidden="true">✧</span>

    <div class="window">
      <div class="window__bar">
        <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="window__title">STARLIGHT / PERSONAL HOME</span>
        <span class="window__online">● ONLINE</span>
      </div>

      <div class="window__body">
        <aside class="side">
          <span class="side__brand">SITE<br />INDEX</span>
          <span class="side__link is-active">HOME</span>
          <span class="side__link">DIARY</span>
          <span class="side__link">LINKS</span>
          <span class="side__link">GUESTBOOK</span>
          <span class="side__badge">WEB RING</span>
        </aside>

        <section class="main">
          <div class="main__eyebrow">EARLY INTERNET / Y2K</div>
          <div class="main__title">
            <span class="chrome">Y2K</span>
            <span class="outline">RETRO WEB</span>
          </div>
          <p class="main__copy">A little corner of the old web.</p>
          <div class="main__actions">
            <span class="aqua">ENTER SITE</span>
            <span class="pixel-button">GUESTBOOK</span>
          </div>
          <div class="main__updates">
            <b>★ SITE UPDATES</b>
            <span>new diary entry</span>
            <span>web ring updated</span>
            <span>sign the guestbook</span>
          </div>
          <div class="badges">
            <span>WWW</span>
            <span>HTML 3.2</span>
            <span>★ LINKS</span>
          </div>
          <span class="main__new">NEW!</span>
          <span class="main__star" aria-hidden="true">✦</span>
          <div class="main__marquee">
            <span>★ WELCOME TO MY HOMEPAGE ★ Y2K FOREVER ★</span>
          </div>
        </section>
      </div>

      <div class="statusbar">
        <span>READY</span>
        <span>Y2K / RETRO INTERNET</span>
      </div>
    </div>

    <div class="sticker" aria-hidden="true">
      <span>✦</span>
      <b>WEB</b>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8em;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 18% 8%, rgba(113, 227, 240, 0.55), transparent 42%),
    radial-gradient(ellipse at 88% 18%, rgba(255, 158, 216, 0.5), transparent 42%),
    radial-gradient(ellipse at 70% 100%, rgba(167, 139, 250, 0.4), transparent 55%),
    linear-gradient(135deg, #eaf2ff 0%, #dfeaff 46%, #f6e8ff 100%);
  color: #20273a;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.3cqw, 15px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(70, 120, 180, 0.13) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(70, 120, 180, 0.13) 1px, transparent 1px);
  background-size: 2.2em 2.2em;
  mask-image: linear-gradient(180deg, #000 0%, transparent 90%);
  opacity: 0.75;
  pointer-events: none;
}

.window {
  position: relative;
  z-index: 1;
  display: flex;
  width: 96%;
  height: 90%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #93a8c4;
  border-radius: 0.45em;
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    0.12em 0.18em 0 rgba(58, 87, 130, 0.14),
    0 0.5em 1.3em rgba(61, 87, 139, 0.22);
}

.window__bar {
  display: flex;
  height: 2.7em;
  flex: none;
  align-items: center;
  gap: 0.55em;
  padding: 0 0.7em;
  border-bottom: 1px solid #9baec8;
  background: linear-gradient(180deg, #ffffff 0%, #e8eef5 48%, #c8d4e3 100%);
  color: #4a5b74;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.72em;
  letter-spacing: 0.06em;
}

.window__dots {
  display: inline-flex;
  gap: 0.35em;
}

.window__dots i {
  width: 0.55em;
  height: 0.55em;
  border: 1px solid rgba(70, 100, 140, 0.35);
  border-radius: 50%;
  background: #ff9ed8;
}

.window__dots i:nth-child(2) {
  background: #ffe27a;
}

.window__dots i:nth-child(3) {
  background: #71e3f0;
}

.window__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window__online {
  margin-left: auto;
  color: #2d8a72;
  white-space: nowrap;
}

.window__body {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: 24% minmax(0, 1fr);
}

.side {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 0.4em;
  padding: 0.7em 0.6em;
  border-right: 1px solid #b9c9dd;
  background: linear-gradient(180deg, #e7f1ff 0%, #f8ebff 100%);
}

.side__brand {
  margin-bottom: 0.3em;
  color: #395274;
  font-family: 'Arial Black', 'Arial', sans-serif;
  font-size: 0.95em;
  letter-spacing: 0.08em;
  line-height: 1.05;
}

.side__link {
  padding: 0.4em 0.45em;
  border: 1px solid transparent;
  border-radius: 0.2em;
  color: #5e6f86;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.68em;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.side__link.is-active {
  border-color: #64aada;
  background: linear-gradient(180deg, #c5f8ff 0%, #75d7fa 55%, #438ff0 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
  color: #123e73;
  font-weight: 600;
}

.side__badge {
  margin-top: auto;
  padding: 0.4em 0.3em;
  border: 1px solid #9caec4;
  border-radius: 0.15em;
  background: linear-gradient(180deg, #ffffff 0%, #dce3eb 52%, #a8b6c7 100%);
  color: #475a73;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.58em;
  letter-spacing: 0.06em;
  text-align: center;
}

.main {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 1em 1.1em 2.2em;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 92% 8%, rgba(255, 158, 216, 0.32), transparent 44%),
    radial-gradient(ellipse at 12% 100%, rgba(113, 227, 240, 0.26), transparent 48%);
}

.main__eyebrow {
  color: #6b7d94;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.62em;
  letter-spacing: 0.12em;
}

.main__title {
  display: flex;
  flex-direction: column;
  margin-top: 0.45em;
  line-height: 0.86;
}

.chrome {
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #dce3eb 20%,
    #ffffff 36%,
    #a8b6c7 52%,
    #f5f7fa 68%,
    #8d9eb2 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'Arial Black', 'Arial', sans-serif;
  font-size: 5.2em;
  letter-spacing: 0.01em;
  filter: drop-shadow(0 0.06em 0 rgba(61, 86, 120, 0.42));
}

.outline {
  margin-top: 0.14em;
  color: transparent;
  font-family: 'Arial Black', 'Arial', sans-serif;
  font-size: 1.5em;
  letter-spacing: 0.02em;
  -webkit-text-stroke: 1px #6b9bd8;
}

.main__copy {
  margin-top: 0.7em;
  color: #61748c;
  font-size: 0.72em;
  line-height: 1.5;
}

.main__actions {
  display: flex;
  align-items: center;
  gap: 0.45em;
  margin-top: 0.9em;
}

.aqua,
.pixel-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.aqua {
  padding: 0.55em 0.8em;
  border: 1px solid #4d91d8;
  border-radius: 0.4em;
  background: linear-gradient(180deg, #c5f8ff 0%, #75d7fa 45%, #438ff0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -2px 0 rgba(36, 91, 160, 0.18),
    0 0.12em 0 rgba(50, 83, 133, 0.2);
  color: #103c6f;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.66em;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.pixel-button {
  padding: 0.5em 0.65em;
  border: 1px solid #a6b8ce;
  background: linear-gradient(180deg, #ffffff, #dce3eb);
  color: #5b6d84;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.58em;
  letter-spacing: 0.04em;
}

.main__updates {
  position: absolute;
  top: 42%;
  right: 1.1em;
  display: flex;
  width: 34%;
  min-width: 7.5em;
  flex-direction: column;
  gap: 0.35em;
  padding: 0.6em 0.7em;
  border: 1px solid #a6b8ce;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0.12em 0.16em 0 rgba(82, 108, 146, 0.12);
  color: #5a6d85;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.55em;
  line-height: 1.4;
}

.main__updates b {
  color: #416187;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.main__updates span {
  white-space: nowrap;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  margin-top: auto;
  max-width: 66%;
}

.badges span {
  padding: 0.3em 0.4em;
  border: 1px solid #a6b8ce;
  border-radius: 0.15em;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(222, 232, 244, 0.9));
  color: #4d6382;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.54em;
  letter-spacing: 0.04em;
}

.main__new {
  position: absolute;
  top: 0.9em;
  right: 0.9em;
  padding: 0.28em 0.42em;
  border: 1px solid #ffffff;
  border-radius: 0.2em;
  background: linear-gradient(135deg, #ff9ed8, #a78bfa);
  box-shadow: 0.1em 0.12em 0 rgba(102, 76, 154, 0.25);
  color: #ffffff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.58em;
  font-weight: 600;
  letter-spacing: 0.04em;
  transform: rotate(-5deg);
}

.main__star {
  position: absolute;
  right: 0.55em;
  bottom: 1.5em;
  background: linear-gradient(180deg, #ffffff 5%, #ff9ed8 48%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 5.4em;
  line-height: 1;
  opacity: 0.9;
  transform: rotate(12deg);
  filter: drop-shadow(0.05em 0.08em 0 rgba(91, 65, 140, 0.25));
}

.main__marquee {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  padding: 0.35em 0.7em;
  border-top: 1px solid #a7b9ce;
  background: linear-gradient(180deg, #eef3f9, #d3deeb);
  color: #536a88;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.54em;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.statusbar {
  display: flex;
  height: 1.65em;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 0.8em;
  padding: 0 0.7em;
  border-top: 1px solid #9baec8;
  background: linear-gradient(180deg, #eef3f9, #d3deeb);
  color: #5d7089;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.06em;
}

.sticker {
  position: absolute;
  right: 0.5em;
  bottom: 0.7em;
  z-index: 2;
  display: flex;
  width: 2.8em;
  height: 2.8em;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9ed8, #a78bfa);
  box-shadow:
    0 0 0 1px #8f7bc8,
    0.14em 0.18em 0 rgba(71, 55, 112, 0.22);
  color: #ffffff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  line-height: 1;
  transform: rotate(9deg);
}

.sticker span {
  font-size: 1em;
}

.sticker b {
  margin-top: 0.2em;
  font-size: 0.42em;
  letter-spacing: 0.06em;
}

.spark {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  line-height: 1;
  text-shadow:
    0 0 0.3em rgba(88, 169, 248, 0.9),
    0.08em 0.08em 0 rgba(167, 139, 250, 0.6);
  pointer-events: none;
}

.spark--a {
  top: 0.7em;
  left: 0.7em;
  font-size: 1em;
}

.spark--b {
  top: 2.1em;
  right: 1em;
  color: #ffe27a;
  font-size: 0.7em;
}

.spark--c {
  bottom: 1.4em;
  left: 1.3em;
  color: #71e3f0;
  font-size: 0.75em;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.8cqw, 14px);
  }

  .window {
    width: 97%;
    height: 92%;
  }
}
</style>
