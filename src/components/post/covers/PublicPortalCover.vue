<template>
  <div class="cover">
    <div class="dots" aria-hidden="true"></div>

    <div class="nav">
      <span class="brand">
        <i class="brand-mark"></i>
        <b>公共资源服务</b>
      </span>
      <span class="links">
        <i class="active">首页</i>
        <i>项目公告</i>
        <i>办事指南</i>
        <i>企业服务</i>
      </span>
      <span class="login">企业登录</span>
    </div>

    <div class="hero">
      <span class="eyebrow">PUBLIC RESOURCE TRADING</span>
      <h4>公共项目<br />公开交易服务</h4>
      <p>项目查询 · 投标报名 · 结果公示</p>
      <div class="search">
        <span>搜索项目名称或编号</span>
        <i>搜索</i>
      </div>
      <div class="trust">
        <span>CA 认证</span>
        <span>全程留痕</span>
        <span>信息公开</span>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <span class="no">01</span>
        <b>项目查询</b>
        <em>查看招标公告与答疑</em>
      </div>
      <div class="card">
        <span class="no">02</span>
        <b>投标报名</b>
        <em>在线递交报名材料</em>
      </div>
      <div class="card">
        <span class="no">03</span>
        <b>结果公示</b>
        <em>中标候选人查询</em>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.85em 0.9em 0.9em;
  background:
    radial-gradient(ellipse at 78% 8%, rgba(43, 119, 199, 0.42), transparent 55%),
    radial-gradient(ellipse at 8% 100%, rgba(22, 140, 140, 0.24), transparent 58%),
    linear-gradient(135deg, #0b1d30 0%, #0e2c4e 48%, #174a7e 100%);
  color: #fff;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(5px, 1.02cqw, 13px);
}

.dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px);
  background-size: 1.6em 1.6em;
  mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
  opacity: 0.28;
  pointer-events: none;
}

.nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.8em;
  height: 2.7em;
  padding: 0 0.8em;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #19233e;
  box-shadow: 0 0.5em 1.2em rgba(5, 15, 30, 0.22);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.45em;
  font-size: 0.88em;
  white-space: nowrap;
}

.brand-mark {
  width: 1.35em;
  height: 1.35em;
  border-radius: 0.22em;
  background: linear-gradient(135deg, #174a7e, #2b77c7);
}

.links {
  display: flex;
  align-items: center;
  gap: 0.2em;
  margin-left: 0.4em;
}

.links i {
  padding: 0.42em 0.6em;
  border-radius: 999px;
  color: #4f5b75;
  font-size: 0.72em;
  font-style: normal;
  white-space: nowrap;
}

.links .active {
  background: #eaf1f8;
  color: #174a7e;
  font-weight: 600;
}

.login {
  margin-left: auto;
  padding: 0.45em 0.8em;
  border-radius: 999px;
  background: linear-gradient(135deg, #174a7e, #2b77c7);
  color: #fff;
  font-size: 0.7em;
  white-space: nowrap;
}

.hero {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45em;
  padding: 0 0.8em;
}

.eyebrow {
  padding: 0.32em 0.65em;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #eaf6ff;
  font-family: var(--font-mono);
  font-size: 0.58em;
  letter-spacing: 0.1em;
}

.hero h4 {
  margin: 0.15em 0 0;
  color: #fff;
  font-size: 2.25em;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.06;
}

.hero p {
  margin: 0;
  color: rgba(234, 246, 255, 0.82);
  font-size: 0.76em;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.5em;
  width: min(24em, 62%);
  margin-top: 0.2em;
  padding: 0.3em 0.32em 0.3em 0.8em;
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
}

.search span {
  flex: 1;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.68em;
  white-space: nowrap;
}

.search i {
  padding: 0.42em 0.8em;
  border-radius: 999px;
  background: #e9a23b;
  color: #1b2333;
  font-size: 0.66em;
  font-style: normal;
  font-weight: 700;
  white-space: nowrap;
}

.trust {
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-top: 0.15em;
}

.trust span {
  padding: 0.22em 0.55em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.6em;
}

.cards {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65em;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  padding: 0.75em 0.8em;
  border: 1px solid rgba(227, 233, 242, 0.9);
  border-radius: 0.85em;
  background: #fff;
  color: #243247;
  box-shadow: 0 0.4em 1em rgba(5, 15, 30, 0.14);
}

.card .no {
  color: #168c8c;
  font-family: var(--font-mono);
  font-size: 0.58em;
  letter-spacing: 0.1em;
}

.card b {
  font-size: 0.84em;
}

.card em {
  color: #6b7788;
  font-size: 0.64em;
  font-style: normal;
}

@container (max-width: 520px) {
  .links i:nth-child(n + 3),
  .trust,
  .card:nth-child(3) {
    display: none;
  }

  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero h4 {
    font-size: 1.9em;
  }
}
</style>
