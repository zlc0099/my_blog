<template>
  <div class="cover">
    <div class="glow" aria-hidden="true"></div>
    <div class="scan" aria-hidden="true"></div>

    <div class="frame">
      <i class="corner tl"></i>
      <i class="corner tr"></i>
      <i class="corner bl"></i>
      <i class="corner br"></i>

      <div class="top">
        <span class="sys">CITY / MONITOR</span>
        <h4>城市运行监测平台</h4>
        <span class="time">2026.10.26 20:14</span>
      </div>

      <div class="layout">
        <div class="col">
          <div class="panel kpi">
            <span class="label">巡检任务 / TOTAL</span>
            <b class="num">1,284</b>
            <em>今日 +36</em>
          </div>
          <div class="panel">
            <span class="label">病害趋势 / 7D</span>
            <div class="bars">
              <i style="--h: 32%"></i>
              <i style="--h: 48%"></i>
              <i style="--h: 40%"></i>
              <i style="--h: 66%"></i>
              <i style="--h: 58%"></i>
              <i style="--h: 82%"></i>
              <i style="--h: 72%"></i>
            </div>
          </div>
        </div>

        <div class="map">
          <svg viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
            <path class="map-grid" d="M0 30H200M0 60H200M0 90H200M40 0V120M80 0V120M120 0V120M160 0V120" />
            <polygon
              class="map-shape"
              points="28,72 42,38 84,24 120,30 152,22 174,48 166,80 128,96 92,92 54,102"
            />
            <path class="map-line" d="M28 72L84 60L120 66L166 80M84 60L84 24M120 66L120 30" />
            <circle class="map-dot" cx="84" cy="60" r="2.4" />
            <circle class="map-dot" cx="120" cy="66" r="2.4" />
            <circle class="map-dot hot" cx="152" cy="42" r="3" />
          </svg>
          <div class="map-center">
            <b>96.4<span>%</span></b>
            <small>巡查覆盖率</small>
          </div>
          <span class="map-tag">CITY / 9 DISTRICTS</span>
        </div>

        <div class="col">
          <div class="panel">
            <span class="label">工单状态 / ORDER</span>
            <div class="donut-row">
              <div class="donut"></div>
              <div class="legend">
                <span><i class="gold"></i>待维修 32</span>
                <span><i class="pale"></i>维修中 18</span>
                <span><i class="dim"></i>已完成 64</span>
              </div>
            </div>
          </div>
          <div class="panel">
            <span class="label">区域事件 / AREA</span>
            <div class="lines">
              <span><i style="--w: 84%"></i></span>
              <span><i style="--w: 62%"></i></span>
              <span><i style="--w: 46%"></i></span>
              <span><i style="--w: 70%"></i></span>
            </div>
          </div>
        </div>
      </div>

      <div class="ticker">
        <span>SSE / LIVE</span>
        <i></i>
        <span>车辆在线 42</span>
        <span>团队空闲 6</span>
        <span>今日工单 118</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  padding: 0.65em;
  background:
    radial-gradient(ellipse at 50% 42%, rgba(37, 137, 255, 0.12) 0%, rgba(8, 11, 16, 0.4) 48%, #05070B 100%),
    linear-gradient(180deg, #080B10 0%, #05070B 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(5px, 1.02cqw, 13px);
  color: #E8EDF4;
}

.glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 72% 28%, rgba(37, 137, 255, 0.1), transparent 40%),
    radial-gradient(ellipse at 20% 80%, rgba(214, 179, 106, 0.06), transparent 44%);
  pointer-events: none;
}

.scan {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(73, 183, 255, 0.02) 0px,
    rgba(73, 183, 255, 0.02) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
}

.frame {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(214, 179, 106, 0.3);
  background: rgba(5, 7, 11, 0.45);
  box-shadow: inset 0 0 4em rgba(37, 137, 255, 0.04);
}

.corner {
  position: absolute;
  z-index: 2;
  width: 1.5em;
  height: 1.5em;
  border-color: rgba(214, 179, 106, 0.7);
  border-style: solid;
  pointer-events: none;
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

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 14%;
  padding: 0 1.1em;
  border-bottom: 1px solid #263341;
  background: linear-gradient(90deg, rgba(37, 137, 255, 0.08), transparent 34%, transparent 68%, rgba(214, 179, 106, 0.06));
}

.top h4 {
  margin: 0;
  color: #F0D38A;
  font-size: 1.35em;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-shadow: 0 0 0.8em rgba(214, 179, 106, 0.25);
  white-space: nowrap;
}

.sys,
.time {
  color: #6F7D8D;
  font-family: var(--font-mono);
  font-size: 0.58em;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.layout {
  display: grid;
  flex: 1;
  grid-template-columns: 24% minmax(0, 1fr) 24%;
  gap: 0.7em;
  min-height: 0;
  padding: 0.7em;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  min-height: 0;
}

.panel {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.4em;
  min-height: 0;
  padding: 0.65em 0.7em;
  border: 1px solid #263341;
  background: #0D131C;
}

.label {
  color: #6F7D8D;
  font-family: var(--font-mono);
  font-size: 0.58em;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.kpi .num {
  color: #F0D38A;
  font-family: var(--font-display);
  font-size: 2.7em;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.kpi em {
  color: #D6B36A;
  font-size: 0.62em;
  font-style: normal;
}

.bars {
  display: flex;
  flex: 1;
  align-items: flex-end;
  gap: 0.3em;
  min-height: 2.2em;
}

.bars i {
  flex: 1;
  height: var(--h);
  background: linear-gradient(180deg, #49B7FF, rgba(37, 137, 255, 0.25));
  box-shadow: 0 0 0.6em rgba(37, 137, 255, 0.25);
}

.map {
  position: relative;
  overflow: hidden;
  border: 1px solid #263341;
  background:
    radial-gradient(ellipse at center, rgba(37, 137, 255, 0.1), transparent 62%),
    #0D131C;
}

.map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.map-grid {
  fill: none;
  stroke: #15202B;
  stroke-width: 0.5;
}

.map-shape {
  fill: rgba(37, 137, 255, 0.12);
  stroke: #2589FF;
  stroke-width: 1;
  filter: drop-shadow(0 0 3px rgba(37, 137, 255, 0.45));
}

.map-line {
  fill: none;
  stroke: rgba(73, 183, 255, 0.55);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

.map-dot {
  fill: #49B7FF;
  filter: drop-shadow(0 0 2px rgba(73, 183, 255, 0.9));
}

.map-dot.hot {
  fill: #F0D38A;
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
  transform: translate(-50%, -50%);
  text-align: center;
}

.map-center b {
  color: #F0D38A;
  font-family: var(--font-display);
  font-size: 3.1em;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 0.5em rgba(214, 179, 106, 0.4);
}

.map-center b span {
  font-size: 0.42em;
}

.map-center small {
  color: #A4B0BE;
  font-size: 0.6em;
  letter-spacing: 0.12em;
}

.map-tag {
  position: absolute;
  right: 0.6em;
  bottom: 0.5em;
  color: #6F7D8D;
  font-family: var(--font-mono);
  font-size: 0.5em;
  letter-spacing: 0.12em;
}

.donut-row {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.8em;
  min-height: 0;
}

.donut {
  width: 3.6em;
  height: 3.6em;
  border-radius: 50%;
  background: conic-gradient(
    #2589FF 0 34%,
    #35D4E8 34% 56%,
    rgba(37, 137, 255, 0.18) 56% 100%
  );
  -webkit-mask: radial-gradient(circle, transparent 52%, #000 54%);
  mask: radial-gradient(circle, transparent 52%, #000 54%);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  color: #A4B0BE;
  font-size: 0.58em;
}

.legend span {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.legend i {
  width: 0.55em;
  height: 0.55em;
}

.legend .gold {
  background: #2589FF;
}

.legend .pale {
  background: #35D4E8;
}

.legend .dim {
  background: rgba(37, 137, 255, 0.28);
}

.lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 0.45em;
}

.lines span {
  display: block;
  height: 0.45em;
  background: rgba(37, 137, 255, 0.12);
}

.lines i {
  display: block;
  width: var(--w);
  height: 100%;
  background: linear-gradient(90deg, rgba(37, 137, 255, 0.25), #49B7FF);
}

.ticker {
  display: flex;
  align-items: center;
  gap: 1.2em;
  flex: 0 0 9%;
  padding: 0 1.1em;
  border-top: 1px solid #202C38;
  color: #6F7D8D;
  font-family: var(--font-mono);
  font-size: 0.56em;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.ticker span:first-child {
  color: #49B7FF;
}

.ticker i {
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: #35C98A;
  box-shadow: 0 0 0.5em #35C98A;
}

@container (max-width: 520px) {
  .top h4 {
    font-size: 1.1em;
  }

  .sys,
  .time,
  .ticker span:nth-child(n + 4),
  .col:last-child {
    display: none;
  }

  .layout {
    grid-template-columns: 28% minmax(0, 1fr);
  }
}
</style>
