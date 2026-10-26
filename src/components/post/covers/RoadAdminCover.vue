<template>
  <div class="cover">
    <aside class="side">
      <div class="logo">
        <span class="logo-mark">O</span>
        <b>巡查管理</b>
      </div>
      <div class="menu">
        <span class="group">工作台</span>
        <span>数据概览</span>
        <span class="active">巡查记录</span>
        <span>巡查结果</span>
        <span>工单管理</span>
        <span>任务管理</span>
        <span>数据大屏</span>
      </div>
      <div class="side-foot">OPS / 01</div>
    </aside>

    <div class="main">
      <div class="top">
        <span class="crumb">巡查中监控 / 巡查记录</span>
        <span class="top-right">
          <i></i>
          <i></i>
          <b>管理员</b>
        </span>
      </div>

      <div class="body">
        <div class="head">
          <div>
            <h4>巡查记录</h4>
            <p>按路线、病害类型和日期筛选</p>
          </div>
          <span class="btn ghost">导出</span>
        </div>

        <div class="filters">
          <i>路线</i>
          <i>病害类型</i>
          <i>日期范围</i>
          <span class="query">查询</span>
          <span class="reset">重置</span>
        </div>

        <div class="grid">
          <div class="table">
            <div class="tr th">
              <span>桩号</span>
              <span>病害类型</span>
              <span>状态</span>
            </div>
            <div class="tr">
              <span class="mono">K12+360</span>
              <span>路面裂缝</span>
              <span><i class="status-chip blue">维修中</i></span>
            </div>
            <div class="tr">
              <span class="mono">K08+120</span>
              <span>路产缺失</span>
              <span><i class="status-chip orange">待分配</i></span>
            </div>
            <div class="tr">
              <span class="mono">K21+740</span>
              <span>坑槽</span>
              <span><i class="status-chip green">已完成</i></span>
            </div>
          </div>

          <div class="map">
            <span class="map-label">GIS / 巡查轨迹</span>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
              <path class="grid-line" d="M0 18H100M0 36H100M0 54H100M22 0V70M50 0V70M78 0V70" />
              <path class="route" d="M12 54C28 48 24 28 42 24S66 40 88 16" />
              <circle class="pin" cx="12" cy="54" r="2.4" />
              <circle class="pin" cx="42" cy="24" r="2.4" />
              <circle class="pin hot" cx="88" cy="16" r="2.8" />
            </svg>
            <div class="route-meta">
              <span>今日巡查</span>
              <b>18.6 km</b>
            </div>
          </div>
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
  font-size: clamp(5px, 1.02cqw, 13px);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #F4F6F9;
  color: #1F2937;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  width: 23%;
  padding: 1.2em 1em;
  background: #17212F;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.55em;
  font-size: 1.02em;
  white-space: nowrap;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 1.55em;
  height: 1.55em;
  border: 1px solid rgba(76, 154, 255, 0.7);
  background: rgba(76, 154, 255, 0.16);
  color: #4C9AFF;
  font-size: 0.82em;
  font-weight: 700;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.menu span {
  padding: 0.48em 0.65em;
  border-radius: 2px;
  color: #B7C3D0;
  font-size: 0.86em;
}

.menu .group {
  padding-left: 0;
  color: #94A3B8;
  font-size: 0.66em;
  letter-spacing: 0.12em;
}

.menu .active {
  background: #263C56;
  color: #fff;
  box-shadow: inset 3px 0 0 #4C9AFF;
}

.side-foot {
  margin-top: auto;
  color: #94A3B8;
  font-family: var(--font-mono);
  font-size: 0.66em;
  letter-spacing: 0.14em;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 14%;
  padding: 0 1.4em;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  color: #475569;
  font-size: 0.8em;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 0.65em;
}

.top-right i {
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  background: #F1F5F9;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.8em;
  min-height: 0;
  padding: 1.05em 1.3em;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
}

.head h4 {
  margin: 0;
  color: #1F2937;
  font-size: 1.5em;
  line-height: 1.2;
}

.head p {
  margin: 0.25em 0 0;
  color: #64748B;
  font-size: 0.76em;
}

.btn {
  padding: 0.52em 0.95em;
  border: 1px solid #E2E8F0;
  border-radius: 3px;
  background: #fff;
  color: #475569;
  font-size: 0.78em;
  white-space: nowrap;
}

.filters {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.65em 0.8em;
  border: 1px solid #E2E8F0;
  border-radius: 3px;
  background: #fff;
}

.filters i {
  flex: 0 1 22%;
  padding: 0.36em 0.5em;
  border: 1px solid #E2E8F0;
  border-radius: 2px;
  color: #94A3B8;
  font-size: 0.7em;
  font-style: normal;
}

.filters .query,
.filters .reset {
  padding: 0.4em 0.75em;
  border-radius: 2px;
  font-size: 0.72em;
  white-space: nowrap;
}

.filters .query {
  margin-left: auto;
  background: #2563EB;
  color: #fff;
}

.filters .reset {
  border: 1px solid #E2E8F0;
  color: #475569;
}

.grid {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 0.8em;
  min-height: 0;
}

.table {
  overflow: hidden;
  align-self: start;
  border: 1px solid #E2E8F0;
  border-radius: 3px;
  background: #fff;
}

.tr {
  display: grid;
  grid-template-columns: 1fr 1.3fr 0.9fr;
  align-items: center;
  gap: 0.5em;
  padding: 0.62em 0.8em;
  border-top: 1px solid #EDF0F4;
  color: #475569;
  font-size: 0.74em;
}

.tr:first-child {
  border-top: 0;
}

.tr.th {
  background: #F8FAFC;
  color: #64748B;
  font-size: 0.66em;
}

.mono {
  font-family: var(--font-mono);
  font-size: 0.94em;
}

.status-chip {
  display: inline-block;
  padding: 0.2em 0.48em;
  border: 1px solid transparent;
  border-radius: 2px;
  font-size: 0.92em;
  font-style: normal;
  white-space: nowrap;
}

.status-chip.blue {
  border-color: #BFDBFE;
  background: #EFF6FF;
  color: #1D4ED8;
}

.status-chip.orange {
  border-color: #FDE68A;
  background: #FFFBEB;
  color: #B45309;
}

.status-chip.green {
  border-color: #BBF7D0;
  background: #F0FDF4;
  color: #15803D;
}

.map {
  position: relative;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  border-radius: 3px;
  background:
    radial-gradient(circle at 62% 38%, rgba(37, 99, 235, 0.10), transparent 44%),
    #F8FAFC;
}

.map svg {
  width: 100%;
  height: 100%;
}

.grid-line {
  fill: none;
  stroke: rgba(37, 99, 235, 0.12);
  stroke-width: 0.5;
}

.route {
  fill: none;
  stroke: #2563EB;
  stroke-width: 1.6;
  stroke-dasharray: 3 2;
}

.pin {
  fill: #2563EB;
  stroke: #fff;
  stroke-width: 0.8;
}

.pin.hot {
  fill: #B45309;
}

.map-label {
  position: absolute;
  top: 0.6em;
  left: 0.7em;
  color: #64748B;
  font-family: var(--font-mono);
  font-size: 0.62em;
  letter-spacing: 0.08em;
}

.route-meta {
  position: absolute;
  right: 0.6em;
  bottom: 0.6em;
  display: flex;
  align-items: baseline;
  gap: 0.35em;
  padding: 0.35em 0.5em;
  background: rgba(255, 255, 255, 0.9);
  color: #64748B;
  font-size: 0.62em;
}

.route-meta b {
  color: #2563EB;
  font-family: var(--font-mono);
  font-size: 1.1em;
}

@container (max-width: 520px) {
  .menu span:nth-child(n + 5),
  .grid {
    display: block;
  }

  .map {
    display: none;
  }

  .filters i:nth-child(n + 3) {
    display: none;
  }
}
</style>
