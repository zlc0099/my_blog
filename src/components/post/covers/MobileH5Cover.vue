<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>

    <div class="caption">
      <span>MOBILE H5 / PERSONAL TOOL</span>
      <span>SAFE AREA · TOUCH · STATES</span>
    </div>

    <div class="stage">
      <div class="phone phone--list">
        <span class="phone__notch"></span>
        <div class="screen">
          <div class="status"><span>9:41</span><span>▮▮▮</span></div>
          <div class="navbar"><b>Archive</b><i>⌕</i></div>
          <div class="chips">
            <span class="is-on">All</span>
            <span>Notes</span>
            <span>Tags</span>
          </div>
          <div class="rows">
            <div v-for="n in 4" :key="n" class="row">
              <span class="thumb"></span>
              <span class="lines"><b></b><i></i></span>
              <span class="chev">›</span>
            </div>
          </div>
          <div class="tabbar"><span class="is-on">Home</span><span>Write</span><span>Me</span></div>
          <span class="homebar"></span>
        </div>
      </div>

      <div class="phone phone--detail">
        <span class="phone__notch"></span>
        <div class="screen screen--detail">
          <div class="status"><span>9:41</span><span>▮▮▮</span></div>
          <div class="detail-head">
            <span class="eyebrow">TODAY / OVERVIEW</span>
            <b>Balance</b>
          </div>
          <div class="amount">¥ 2,480<span>.00</span></div>
          <div class="delta">+12.4% / THIS WEEK</div>
          <div class="chart">
            <i v-for="n in 7" :key="n" :class="`bar bar--${n}`"></i>
          </div>
          <div class="metrics">
            <div><small>INCOME</small><b>¥8.2K</b></div>
            <div><small>SPEND</small><b>¥5.7K</b></div>
          </div>
          <div class="cta">＋ Add record</div>
          <div class="tabbar"><span>Home</span><span class="is-on">Add</span><span>Stats</span></div>
          <span class="homebar"></span>
        </div>
      </div>

      <span class="note note--touch">44 × 44 TOUCH</span>
      <span class="note note--safe">SAFE AREA</span>
      <span class="note note--state">EMPTY / ERROR</span>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 16% 10%, rgba(205, 122, 58, 0.12), transparent 44%),
    radial-gradient(ellipse at 86% 88%, rgba(58, 132, 118, 0.12), transparent 46%),
    #f4f0e8;
  color: #202327;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.18cqw, 14px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(120, 105, 84, 0.09) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(120, 105, 84, 0.09) 1px, transparent 1px);
  background-size: 2.4em 2.4em;
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
  color: #877c6d;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.44em;
  letter-spacing: 0.1em;
}

.caption span:first-child {
  color: #a35f2f;
}

.stage {
  position: relative;
  display: flex;
  height: calc(100% - 1.6em);
  align-items: center;
  justify-content: center;
  padding-bottom: 0.4em;
}

.phone {
  position: relative;
  width: 11.6em;
  height: 21.6em;
  flex: none;
  overflow: hidden;
  border: 1em solid #202327;
  border-radius: 2.1em;
  background: #fbfaf7;
  box-shadow: 0 1.1em 2em rgba(48, 40, 28, 0.18);
}

.phone--list {
  z-index: 1;
  transform: translateX(2.4em) rotate(-7deg);
}

.phone--detail {
  z-index: 2;
  transform: translateX(-2.4em) rotate(4deg);
}

.phone__notch {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 2;
  width: 38%;
  height: 1.15em;
  border-radius: 0 0 0.8em 0.8em;
  background: #202327;
  transform: translateX(-50%);
}

.screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 1.05em 0.8em 0.65em;
  background: #fbfaf7;
}

.status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.2em 0.45em;
  color: #857f73;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  letter-spacing: 0.04em;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3em 0 0.75em;
}

.navbar b {
  font-size: 1.02em;
  letter-spacing: -0.02em;
}

.navbar i {
  display: grid;
  width: 1.7em;
  height: 1.7em;
  place-items: center;
  border: 1px solid #e0d7c7;
  border-radius: 50%;
  color: #7d7568;
  font-size: 0.56em;
  font-style: normal;
}

.chips {
  display: flex;
  gap: 0.3em;
  margin-bottom: 0.6em;
}

.chips span {
  padding: 0.3em 0.55em;
  border: 1px solid #e4dccd;
  border-radius: 999px;
  color: #8a8173;
  font-size: 0.4em;
}

.chips .is-on {
  border-color: #202327;
  background: #202327;
  color: #fff;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 0.42em;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.48em;
  border: 1px solid #ece5d8;
  border-radius: 0.75em;
  background: #fff;
}

.thumb {
  width: 2.5em;
  height: 2.5em;
  flex: none;
  border-radius: 0.55em;
  background: linear-gradient(135deg, #e8c9a0, #d8a56a);
}

.row:nth-child(2) .thumb {
  background: linear-gradient(135deg, #b9d8cf, #7fb5a6);
}

.row:nth-child(3) .thumb {
  background: linear-gradient(135deg, #d5c9e8, #a993ca);
}

.row:nth-child(4) .thumb {
  background: linear-gradient(135deg, #e7d5c2, #c9a98c);
}

.lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.32em;
}

.lines b {
  width: 76%;
  height: 0.34em;
  border-radius: 999px;
  background: #2c2f33;
  opacity: 0.75;
}

.lines i {
  width: 52%;
  height: 0.26em;
  border-radius: 999px;
  background: #ddd6c9;
}

.chev {
  color: #aaa294;
  font-size: 0.8em;
}

.tabbar {
  display: flex;
  justify-content: space-around;
  margin-top: auto;
  padding-top: 0.55em;
  border-top: 1px solid #ece5d8;
  color: #a39b8d;
  font-size: 0.4em;
}

.tabbar .is-on {
  color: #202327;
  font-weight: 700;
}

.homebar {
  width: 36%;
  height: 0.22em;
  margin: 0.52em auto 0;
  border-radius: 999px;
  background: #202327;
  opacity: 0.85;
}

.screen--detail {
  background:
    linear-gradient(180deg, rgba(237, 226, 207, 0.7), transparent 36%),
    #fbfaf7;
}

.detail-head {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  margin-top: 0.15em;
}

.eyebrow {
  color: #a35f2f;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.38em;
  letter-spacing: 0.1em;
}

.detail-head b {
  font-size: 1.15em;
  letter-spacing: -0.02em;
}

.amount {
  margin-top: 0.5em;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 2.6em;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
}

.amount span {
  color: #a39b8d;
  font-size: 0.45em;
}

.delta {
  margin-top: 0.55em;
  color: #3d8a78;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  letter-spacing: 0.04em;
}

.chart {
  display: flex;
  height: 5.2em;
  align-items: flex-end;
  gap: 0.38em;
  margin-top: 1em;
  padding-bottom: 0.45em;
  border-bottom: 1px solid #e4dccd;
}

.bar {
  flex: 1;
  border-radius: 0.25em 0.25em 0 0;
  background: linear-gradient(180deg, #d8a56a, #ecd3ae);
}

.bar--1 { height: 34%; }
.bar--2 { height: 58%; }
.bar--3 { height: 46%; }
.bar--4 { height: 72%; }
.bar--5 { height: 62%; }
.bar--6 { height: 88%; background: linear-gradient(180deg, #a35f2f, #d8a56a); }
.bar--7 { height: 76%; }

.metrics {
  display: flex;
  gap: 0.55em;
  margin-top: 0.8em;
}

.metrics div {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25em;
  padding: 0.55em;
  border: 1px solid #ece5d8;
  border-radius: 0.65em;
  background: #fff;
}

.metrics small {
  color: #9a9183;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.34em;
  letter-spacing: 0.08em;
}

.metrics b {
  font-size: 0.8em;
}

.cta {
  margin-top: auto;
  padding: 0.68em;
  border-radius: 0.65em;
  background: #202327;
  color: #fff;
  font-size: 0.48em;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
}

.note {
  position: absolute;
  z-index: 4;
  padding: 0.35em 0.5em;
  border: 1px solid #d8ccb9;
  background: rgba(255, 252, 246, 0.72);
  color: #8c8273;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.36em;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.note--touch {
  top: 24%;
  right: 5%;
}

.note--safe {
  bottom: 12%;
  left: 7%;
}

.note--state {
  right: 6%;
  bottom: 20%;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.5cqw, 12px);
  }

  .phone {
    width: 10.5em;
    height: 20em;
    border-width: 0.8em;
  }

  .phone--list {
    z-index: 1;
    transform: translateX(1.6em) rotate(-7deg);
  }

  .phone--detail {
    transform: translateX(-1.6em) rotate(4deg);
  }

  .note--touch,
  .note--state {
    display: none;
  }

  .caption span:last-child {
    display: none;
  }
}
</style>
