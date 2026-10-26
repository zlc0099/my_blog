<template>
  <div class="cover">
    <aside class="side">
      <div class="logo">
        <span class="logo-mark">业</span>
        <b>业务管理</b>
      </div>
      <div class="menu">
        <span class="active">项目总览</span>
        <span>招标管理</span>
        <span>投标管理</span>
        <span>评标管理</span>
        <span>归档管理</span>
      </div>
      <div class="side-foot">ADMIN / 01</div>
    </aside>

    <div class="main">
      <div class="top">
        <span class="crumb">工作台 / 项目总览</span>
        <span class="top-right">
          <i class="dot"></i>
          <i class="dot"></i>
          <b>管理员</b>
        </span>
      </div>

      <div class="body">
        <div class="head">
          <div>
            <h4>项目总览</h4>
            <p>企业级业务管理平台</p>
          </div>
          <span class="btn">+ 新建项目</span>
        </div>

        <div class="kpis">
          <div class="kpi">
            <span>进行中项目</span>
            <b>36</b>
            <em>本周 +4</em>
          </div>
          <div class="kpi">
            <span>待审核公告</span>
            <b>08</b>
            <em>需处理</em>
          </div>
          <div class="kpi">
            <span>待评标</span>
            <b>12</b>
            <em>今日 3</em>
          </div>
        </div>

        <div class="table">
          <div class="tr th">
            <span>项目名称</span>
            <span>类型</span>
            <span>状态</span>
            <span>截止</span>
          </div>
          <div class="tr">
            <span>项目 A</span>
            <span>公开招标</span>
            <span><i class="status-chip blue">评标中</i></span>
            <span class="num">10-28</span>
          </div>
          <div class="tr">
            <span>项目 B</span>
            <span>邀请招标</span>
            <span><i class="status-chip green">已公示</i></span>
            <span class="num">10-30</span>
          </div>
          <div class="tr">
            <span>项目 C</span>
            <span>公开招标</span>
            <span><i class="status-chip orange">待审核</i></span>
            <span class="num">11-02</span>
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
  background: #F5F7FA;
  color: #1F2937;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  width: 23%;
  padding: 1.2em 1em;
  background: #fff;
  border-right: 1px solid #E5E7EB;
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
  border-radius: 2px;
  background: #1677FF;
  color: #fff;
  font-size: 0.82em;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}

.menu span {
  padding: 0.5em 0.7em;
  border-left: 2px solid transparent;
  border-radius: 2px;
  color: #4B5563;
  font-size: 0.9em;
}

.menu .active {
  border-left-color: #1677FF;
  background: #E6F4FF;
  color: #1677FF;
  font-weight: 600;
}

.side-foot {
  margin-top: auto;
  color: #8C959F;
  font-family: var(--font-mono);
  font-size: 0.68em;
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
  border-bottom: 1px solid #E5E7EB;
  font-size: 0.82em;
}

.crumb {
  color: #8C959F;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 0.7em;
  color: #4B5563;
}

.dot {
  width: 1.1em;
  height: 1.1em;
  border: 1px solid #E5E7EB;
  border-radius: 50%;
  background: #FAFBFC;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.95em;
  min-height: 0;
  padding: 1.1em 1.4em;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
}

.head h4 {
  margin: 0;
  font-size: 1.55em;
  line-height: 1.2;
}

.head p {
  margin: 0.28em 0 0;
  color: #8C959F;
  font-size: 0.8em;
}

.btn {
  padding: 0.55em 0.95em;
  border-radius: 3px;
  background: #1677FF;
  color: #fff;
  font-size: 0.8em;
  font-weight: 600;
  white-space: nowrap;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75em;
}

.kpi {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  padding: 0.8em 0.9em;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  background: #fff;
}

.kpi span {
  color: #8C959F;
  font-size: 0.76em;
}

.kpi b {
  color: #1F2937;
  font-family: var(--font-display);
  font-size: 2.1em;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.kpi em {
  color: #1677FF;
  font-size: 0.7em;
  font-style: normal;
}

.table {
  overflow: hidden;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  background: #fff;
}

.tr {
  display: grid;
  grid-template-columns: 2.4fr 1fr 0.9fr 0.7fr;
  align-items: center;
  gap: 0.6em;
  padding: 0.62em 0.9em;
  border-top: 1px solid #F5F7FA;
  color: #4B5563;
  font-size: 0.76em;
}

.tr:first-child {
  border-top: 0;
}

.tr.th {
  background: #FAFBFC;
  color: #8C959F;
  font-size: 0.68em;
}

.tr span:first-child {
  overflow: hidden;
  color: #1F2937;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.num {
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.status-chip {
  display: inline-block;
  padding: 0.2em 0.5em;
  border-radius: 2px;
  font-size: 0.92em;
  font-style: normal;
  white-space: nowrap;
}

.status-chip.blue {
  background: #EFF6FF;
  color: #1677FF;
}

.status-chip.green {
  background: #F0FDF4;
  color: #16A34A;
}

.status-chip.orange {
  background: #FFFBEB;
  color: #D97706;
}

@container (max-width: 520px) {
  .menu span:nth-child(n + 4),
  .kpi:nth-child(3),
  .tr:nth-child(n + 4) {
    display: none;
  }

  .side {
    width: 26%;
  }
}
</style>
