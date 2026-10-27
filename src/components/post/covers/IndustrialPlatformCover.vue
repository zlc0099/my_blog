<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>
    <div class="glow glow--a" aria-hidden="true"></div>
    <div class="glow glow--b" aria-hidden="true"></div>

    <div class="industry" aria-hidden="true">
      <span class="factory"></span>
      <span class="tank"></span>
      <span class="pylon"></span>
      <span class="pipe"></span>
    </div>

    <div class="topbar">
      <span class="brand">
        <i class="brand__mark" aria-hidden="true"></i>
        <b>NEXUS</b>
        <small>INDUSTRIAL</small>
      </span>
      <span class="nav">
        <i class="active">平台</i>
        <i>解决方案</i>
        <i>行业案例</i>
        <i>服务</i>
      </span>
      <span class="preview"><i></i> PREVIEW</span>
      <span class="login">进入管理平台</span>
    </div>

    <div class="layout">
      <section class="portal">
        <span class="eyebrow">INDUSTRIAL DIGITAL PLATFORM</span>
        <h4>
          <span>ONE GRID.</span>
          <span>EVERY SIGNAL.</span>
        </h4>
        <p>工厂 · 水务 · 能源的一体化数字运营平台</p>
        <div class="actions">
          <span class="primary">进入管理平台</span>
          <span class="secondary">查看解决方案</span>
        </div>
        <div class="industries">
          <span>FACTORY</span>
          <span>WATER</span>
          <span>ENERGY</span>
          <span>IOT</span>
        </div>
      </section>

      <aside class="admin">
        <div class="panel__head">
          <span>OPERATIONS / OVERVIEW</span>
          <span class="live"><i></i> PREVIEW</span>
        </div>
        <div class="kpis">
          <div><span>DEVICES</span><b></b><em></em></div>
          <div><span>ALERTS</span><b></b><em></em></div>
          <div><span>UPTIME</span><b></b><em></em></div>
        </div>
        <div class="chart">
          <span class="chart__label">TREND / LAYOUT SAMPLE</span>
          <svg viewBox="0 0 200 72" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,58 L18,54 L34,57 L52,44 L68,48 L86,33 L102,39 L120,24 L138,30 L154,18 L172,26 L188,12 L200,16 L200,72 L0,72 Z" fill="rgba(88, 214, 194, 0.10)" />
            <path d="M0,58 L18,54 L34,57 L52,44 L68,48 L86,33 L102,39 L120,24 L138,30 L154,18 L172,26 L188,12 L200,16" fill="none" stroke="#58d6c2" stroke-width="1.4" />
            <path d="M0,62 L22,60 L42,61 L62,52 L82,55 L102,46 L122,49 L142,40 L162,43 L182,34 L200,37" fill="none" stroke="rgba(79, 143, 247, 0.65)" stroke-width="1" stroke-dasharray="3 3" />
          </svg>
        </div>
        <div class="devices">
          <span class="device"><i class="dot dot--ok"></i><b></b><em>NORMAL</em></span>
          <span class="device"><i class="dot dot--warn"></i><b></b><em>WARNING</em></span>
          <span class="device"><i class="dot dot--off"></i><b></b><em>OFFLINE</em></span>
        </div>
        <div class="alert"><span>!</span> ALERT / CHECK REQUIRED <b>→</b></div>
      </aside>
    </div>

    <div class="footer">
      <span>FACTORY / WATER / ENERGY / IOT</span>
      <span>PORTAL + ADMIN / ONE DESIGN SYSTEM</span>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 84% 12%, rgba(240, 179, 91, 0.14), transparent 38%),
    radial-gradient(ellipse at 16% 92%, rgba(88, 214, 194, 0.12), transparent 46%),
    linear-gradient(145deg, #08101b 0%, #0d1825 54%, #09111b 100%);
  color: #ecf3f8;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.2cqw, 14px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(150, 180, 205, 0.075) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(150, 180, 205, 0.075) 1px, transparent 1px);
  background-size: 2.3em 2.3em;
  mask-image: linear-gradient(180deg, #000 0%, transparent 92%);
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.glow--a {
  top: -22%;
  right: 16%;
  width: 46%;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(240, 179, 91, 0.22), transparent 66%);
}

.glow--b {
  bottom: -30%;
  left: -8%;
  width: 54%;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(79, 143, 247, 0.16), transparent 68%);
}

.industry {
  position: absolute;
  right: 0;
  bottom: 2.2em;
  left: 0;
  height: 27%;
  opacity: 0.72;
  pointer-events: none;
}

.factory {
  position: absolute;
  bottom: 0;
  left: 2%;
  width: 28%;
  height: 72%;
  background: #070d16;
  clip-path: polygon(0 44%, 18% 20%, 34% 36%, 50% 10%, 66% 30%, 82% 14%, 100% 42%, 100% 100%, 0 100%);
}

.tank {
  position: absolute;
  bottom: 0;
  left: 34%;
  width: 8%;
  height: 52%;
  border-radius: 50% 50% 0 0;
  background: linear-gradient(180deg, #111c2a, #070d16);
  border-top: 1px solid rgba(88, 214, 194, 0.22);
}

.pylon {
  position: absolute;
  right: 18%;
  bottom: 0;
  width: 1px;
  height: 78%;
  background: rgba(150, 180, 205, 0.18);
  box-shadow: 0 0 0 0.4em rgba(150, 180, 205, 0.03);
}

.pylon::before,
.pylon::after {
  content: '';
  position: absolute;
  left: -1.8em;
  width: 3.6em;
  height: 1px;
  background: rgba(150, 180, 205, 0.18);
}

.pylon::before {
  top: 30%;
}

.pylon::after {
  top: 48%;
}

.pipe {
  position: absolute;
  right: 0;
  bottom: 18%;
  width: 34%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(150, 180, 205, 0.18), transparent);
}

.topbar {
  position: relative;
  z-index: 5;
  display: flex;
  height: 2.8em;
  flex: none;
  align-items: center;
  gap: 0.8em;
  padding: 0 1em;
  border-bottom: 1px solid rgba(150, 180, 205, 0.14);
  background: linear-gradient(180deg, rgba(7, 12, 21, 0.82), rgba(7, 12, 21, 0.32));
  font-size: 0.56em;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 0.35em;
  white-space: nowrap;
}

.brand__mark {
  width: 0.9em;
  height: 0.9em;
  border: 1px solid #f0b35b;
  background: linear-gradient(135deg, rgba(240, 179, 91, 0.7), transparent);
  transform: rotate(45deg);
}

.brand b {
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 1.35em;
  letter-spacing: 0.12em;
}

.brand small {
  color: #8fa4b8;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.66em;
  letter-spacing: 0.12em;
}

.nav {
  display: flex;
  gap: 0.35em;
  margin-left: 0.6em;
}

.nav i {
  padding: 0.35em 0.4em;
  color: #8fa4b8;
  font-size: 0.9em;
  font-style: normal;
  white-space: nowrap;
}

.nav .active {
  color: #f0b35b;
}

.preview {
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-left: auto;
  color: #8fa4b8;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.8em;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.preview i {
  width: 0.42em;
  height: 0.42em;
  border-radius: 50%;
  background: #58d6c2;
  box-shadow: 0 0 0.4em rgba(88, 214, 194, 0.7);
}

.login {
  padding: 0.38em 0.7em;
  border: 1px solid rgba(240, 179, 91, 0.65);
  border-radius: 0.15em;
  background: rgba(240, 179, 91, 0.1);
  color: #f6cd8e;
  font-size: 0.82em;
  white-space: nowrap;
}

.layout {
  position: relative;
  z-index: 3;
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 1.4em;
  padding: 1.1em 1em 0.4em;
}

.portal {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 1.2em;
}

.eyebrow {
  color: #58d6c2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.52em;
  letter-spacing: 0.16em;
}

.portal h4 {
  display: flex;
  flex-direction: column;
  margin-top: 0.45em;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-weight: 600;
  line-height: 0.84;
}

.portal h4 span:first-child {
  color: #f4f8fb;
  font-size: 3.4em;
  letter-spacing: 0.02em;
}

.portal h4 span:last-child {
  margin-top: 0.16em;
  color: transparent;
  font-size: 2.05em;
  letter-spacing: 0.05em;
  -webkit-text-stroke: 1px rgba(240, 179, 91, 0.75);
}

.portal p {
  margin-top: 0.75em;
  color: #aebdca;
  font-size: 0.64em;
  letter-spacing: 0.03em;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.95em;
}

.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em 0.8em;
  border-radius: 0.15em;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.52em;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.primary {
  border: 1px solid #f0b35b;
  background: linear-gradient(180deg, #f6cd8e, #cf933b);
  color: #1b1408;
  font-weight: 600;
}

.secondary {
  border: 1px solid rgba(150, 180, 205, 0.35);
  background: rgba(8, 16, 27, 0.5);
  color: #c8d5df;
}

.industries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7em;
  margin-top: 1.1em;
  color: #6f8599;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.45em;
  letter-spacing: 0.1em;
}

.admin {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5em;
  margin-bottom: 0.6em;
  padding: 0.65em;
  overflow: hidden;
  border: 1px solid rgba(150, 180, 205, 0.22);
  border-top: 2px solid #f0b35b;
  background:
    linear-gradient(180deg, rgba(18, 30, 44, 0.94), rgba(10, 19, 30, 0.94));
  box-shadow: 0 0.8em 2em rgba(0, 0, 0, 0.28);
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6em;
  color: #8fa4b8;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.44em;
  letter-spacing: 0.08em;
}

.live {
  display: flex;
  align-items: center;
  gap: 0.3em;
  color: #58d6c2;
}

.live i {
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: #58d6c2;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.35em;
}

.kpis div {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  padding: 0.4em 0.45em;
  border: 1px solid rgba(150, 180, 205, 0.14);
  background: rgba(7, 14, 24, 0.52);
}

.kpis span {
  color: #758ba0;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.38em;
  letter-spacing: 0.06em;
}

.kpis b {
  width: 58%;
  height: 0.4em;
  background: #c8d5df;
  opacity: 0.65;
}

.kpis em {
  width: 82%;
  height: 0.24em;
  background: rgba(88, 214, 194, 0.4);
}

.chart {
  position: relative;
  flex: 1;
  min-height: 3.6em;
  padding-top: 0.45em;
  border: 1px solid rgba(150, 180, 205, 0.12);
  background:
    repeating-linear-gradient(0deg, transparent 0 1.1em, rgba(150, 180, 205, 0.08) 1.1em 1.12em),
    rgba(7, 14, 24, 0.42);
}

.chart__label {
  position: absolute;
  top: 0.35em;
  left: 0.45em;
  color: #6f8599;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.35em;
  letter-spacing: 0.05em;
}

.chart svg {
  display: block;
  width: 100%;
  height: 100%;
}

.devices {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.device {
  display: grid;
  grid-template-columns: 0.35em minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.4em;
  padding: 0.26em 0.35em;
  border: 1px solid rgba(150, 180, 205, 0.1);
  background: rgba(7, 14, 24, 0.38);
}

.dot {
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
}

.dot--ok {
  background: #58d6c2;
}

.dot--warn {
  background: #f0b35b;
}

.dot--off {
  background: #6f8599;
}

.device b {
  width: 62%;
  height: 0.27em;
  border-radius: 999px;
  background: rgba(200, 213, 223, 0.38);
}

.device em {
  color: #758ba0;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.34em;
  font-style: normal;
  letter-spacing: 0.04em;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.36em 0.45em;
  border-left: 2px solid #f0b35b;
  background: rgba(240, 179, 91, 0.08);
  color: #d9b57d;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.36em;
  letter-spacing: 0.04em;
}

.alert span {
  display: inline-flex;
  width: 1em;
  height: 1em;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0b35b;
  border-radius: 50%;
  color: #f0b35b;
}

.alert b {
  margin-left: auto;
  color: #f0b35b;
}

.footer {
  position: relative;
  z-index: 4;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  height: 2em;
  margin: 0 1em;
  border-top: 1px solid rgba(150, 180, 205, 0.13);
  color: #6f8599;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.08em;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.55cqw, 14px);
  }

  .topbar {
    gap: 0.5em;
    padding: 0 0.65em;
  }

  .nav {
    display: none;
  }

  .layout {
    gap: 0.7em;
    padding: 0.75em 0.65em 0.25em;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }

  .portal {
    padding-bottom: 0.8em;
  }

  .portal h4 span:first-child {
    font-size: 2.7em;
  }

  .portal h4 span:last-child {
    font-size: 1.6em;
  }

  .portal p {
    font-size: 0.55em;
  }

  .industries {
    display: none;
  }

  .admin {
    padding: 0.45em;
  }

  .devices {
    display: none;
  }

  .footer {
    margin: 0 0.65em;
  }

  .footer span:last-child {
    display: none;
  }

  .preview {
    font-size: 0.7em;
  }
}
</style>
