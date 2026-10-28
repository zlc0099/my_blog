<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>

    <div class="caption">
      <span>SAAS / CONSOLE</span>
      <span>TENANT · ROLE · QUOTA</span>
    </div>

    <div class="board">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand__mark"></span>
          <span class="brand__text">
            <b>CONSOLE</b>
            <i>SAAS PLATFORM</i>
          </span>
        </div>

        <div class="workspace">
          <span class="workspace__dot"></span>
          <span class="workspace__name">ACME / GROWTH</span>
          <span class="workspace__chev">⌄</span>
        </div>

        <nav class="nav">
          <span class="nav__item is-on"><i></i>Overview</span>
          <span class="nav__item"><i></i>Customers</span>
          <span class="nav__item"><i></i>Billing</span>
          <span class="nav__item"><i></i>Team</span>
          <span class="nav__item"><i></i>Integrations</span>
          <span class="nav__item"><i></i>Settings</span>
        </nav>

        <div class="side-usage">
          <div class="side-usage__row"><span>SEATS USED</span><b>18 / 25</b></div>
          <span class="side-usage__bar"><i></i></span>
        </div>

        <div class="user">
          <span class="user__avatar">AC</span>
          <span class="user__meta"><b>A. Chen</b><i>ADMIN</i></span>
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <span class="crumb">Workspace <em>/</em> Overview</span>
          <span class="search">Search customers, invoices…</span>
          <span class="bell"><i></i></span>
          <span class="topbar__avatar"></span>
        </div>

        <div class="kpis">
          <div class="kpi">
            <span class="kpi__label">MRR</span>
            <b class="kpi__value">$48.2K</b>
            <span class="kpi__delta is-up">+12.4%</span>
          </div>
          <div class="kpi">
            <span class="kpi__label">ACTIVE SEATS</span>
            <b class="kpi__value">1,284</b>
            <span class="kpi__delta is-up">+8.1%</span>
          </div>
          <div class="kpi">
            <span class="kpi__label">API CALLS</span>
            <b class="kpi__value">2.4M</b>
            <span class="kpi__delta is-down">-3.2%</span>
          </div>
        </div>

        <div class="lower">
          <div class="panel chart">
            <div class="panel__head">
              <b>Revenue</b>
              <span class="pill pill--soft">30D</span>
            </div>
            <div class="chart__plot">
              <span class="chart__line line-a"></span>
              <span class="chart__line line-b"></span>
              <span class="chart__line line-c"></span>
              <div class="bars">
                <i style="--h: 20%"></i>
                <i style="--h: 32%"></i>
                <i style="--h: 28%"></i>
                <i style="--h: 44%"></i>
                <i style="--h: 38%"></i>
                <i style="--h: 52%"></i>
                <i style="--h: 48%"></i>
                <i style="--h: 66%"></i>
                <i style="--h: 58%"></i>
                <i style="--h: 74%"></i>
                <i style="--h: 68%"></i>
                <i class="is-on" style="--h: 88%"></i>
              </div>
            </div>
            <div class="chart__axis">
              <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
            </div>
          </div>

          <div class="stack">
            <div class="panel table">
              <div class="panel__head">
                <b>Recent invoices</b>
                <span class="link">VIEW ALL</span>
              </div>
              <div class="tr th">
                <span>CUSTOMER</span><span>PLAN</span><span>STATUS</span>
              </div>
              <div class="tr">
                <span class="cust"><i></i><b>North Labs</b></span>
                <span class="muted">Growth</span>
                <span class="bill-tag bill-tag--paid">PAID</span>
              </div>
              <div class="tr">
                <span class="cust"><i></i><b>Parallel Co.</b></span>
                <span class="muted">Scale</span>
                <span class="bill-tag bill-tag--due">DUE</span>
              </div>
              <div class="tr">
                <span class="cust"><i></i><b>Fieldwork</b></span>
                <span class="muted">Starter</span>
                <span class="bill-tag bill-tag--paid">PAID</span>
              </div>
              <div class="tr">
                <span class="cust"><i></i><b>Arcadia</b></span>
                <span class="muted">Growth</span>
                <span class="bill-tag bill-tag--paid">PAID</span>
              </div>
              <span class="sync">Synced 4m ago · 48 invoices</span>
            </div>

            <div class="panel mini">
              <div class="panel__head">
                <b>Top accounts</b>
                <span class="link">MRR</span>
              </div>
              <div class="mini__row">
                <span>North Labs</span>
                <span class="mini__bar"><i style="width: 86%"></i></span>
                <b>$8.4K</b>
              </div>
              <div class="mini__row">
                <span>Parallel Co.</span>
                <span class="mini__bar"><i style="width: 64%"></i></span>
                <b>$6.1K</b>
              </div>
              <div class="mini__row">
                <span>Arcadia</span>
                <span class="mini__bar"><i style="width: 42%"></i></span>
                <b>$3.8K</b>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside class="rail">
        <div class="plan">
          <div class="plan__head">
            <span>GROWTH PLAN</span>
            <span class="plan__trial">TRIAL</span>
          </div>
          <div class="plan__price"><b>$49</b><span>/ MO</span><em>12 DAYS LEFT</em></div>
          <div class="quota">
            <div class="quota__row"><span>SEATS</span><b>18 / 25</b></div>
            <span class="quota__bar"><i style="width: 72%"></i></span>
            <div class="quota__row"><span>STORAGE</span><b>62%</b></div>
            <span class="quota__bar"><i style="width: 62%"></i></span>
            <div class="quota__row"><span>API</span><b>44%</b></div>
            <span class="quota__bar"><i style="width: 44%"></i></span>
          </div>
          <span class="upgrade">UPGRADE PLAN</span>
        </div>

        <div class="activity">
          <div class="activity__head"><b>ACTIVITY</b><span>LIVE</span></div>
          <div class="event"><i class="event__dot event__dot--green"></i><span>Invoice paid</span><em>2m</em></div>
          <div class="event"><i class="event__dot event__dot--blue"></i><span>Member invited</span><em>1h</em></div>
          <div class="event"><i class="event__dot event__dot--amber"></i><span>Plan upgraded</span><em>3h</em></div>
        </div>

        <div class="team">
          <div class="team__head"><b>TEAM</b><span>12 MEMBERS</span></div>
          <div class="avatars">
            <i class="av av--1">AC</i>
            <i class="av av--2">JL</i>
            <i class="av av--3">MK</i>
            <i class="av av--4">RS</i>
            <i class="av av--more">+8</i>
          </div>
          <div class="roles">
            <span>OWNER</span><span>ADMIN</span><span>MEMBER</span>
          </div>
          <div class="connects">
            <span><i class="dot dot--on"></i>Stripe</span>
            <span><i class="dot dot--on"></i>Slack</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 8% 0%, rgba(37, 99, 235, 0.08), transparent 40%),
    radial-gradient(ellipse at 96% 100%, rgba(2, 132, 199, 0.05), transparent 42%),
    #f5f7fa;
  color: #111827;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.18cqw, 14px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(17, 24, 39, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(17, 24, 39, 0.035) 1px, transparent 1px);
  background-size: 2.4em 2.4em;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 0%, transparent 88%);
  pointer-events: none;
}

.caption {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7em 0.9em 0;
  color: #7b8494;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  letter-spacing: 0.1em;
}

.caption span:first-child {
  color: #2563eb;
}

.board {
  position: relative;
  z-index: 1;
  display: grid;
  height: calc(100% - 1.55em);
  grid-template-columns: 0.64fr 2.32fr 0.94fr;
  gap: 0.55em;
  padding: 0.6em 0.85em 0.75em;
}

.sidebar,
.topbar,
.kpi,
.panel,
.plan,
.activity,
.team {
  border: 1px solid #e5e7eb;
  border-radius: 0.5em;
  background: #fff;
}

.sidebar {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.55em;
  padding: 0.65em 0.55em;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.45em;
}

.brand__mark {
  width: 1.35em;
  height: 1.35em;
  flex: none;
  border-radius: 0.3em;
  background: linear-gradient(135deg, #2563eb, #0284c7);
  box-shadow: inset 0 0 0 0.18em rgba(255, 255, 255, 0.28);
}

.brand__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.1em;
}

.brand__text b {
  font-size: 0.58em;
  letter-spacing: 0.04em;
}

.brand__text i {
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.3em;
  font-style: normal;
  letter-spacing: 0.09em;
}

.workspace {
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.4em 0.45em;
  border: 1px solid #dbeafe;
  border-radius: 0.35em;
  background: #eff6ff;
}

.workspace__dot {
  width: 0.55em;
  height: 0.55em;
  flex: none;
  border-radius: 0.12em;
  background: #2563eb;
}

.workspace__name {
  overflow: hidden;
  color: #1e40af;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.34em;
  letter-spacing: 0.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace__chev {
  margin-left: auto;
  color: #60a5fa;
  font-size: 0.4em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
}

.nav__item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.42em 0.45em;
  border-radius: 0.3em;
  color: #6b7280;
  font-size: 0.44em;
  white-space: nowrap;
}

.nav__item i {
  width: 0.7em;
  height: 0.7em;
  flex: none;
  border: 1px solid #cbd5e1;
  border-radius: 0.15em;
}

.nav__item.is-on {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.nav__item.is-on i {
  border-color: #2563eb;
  background: #2563eb;
}

.side-usage {
  margin-top: auto;
  padding-top: 0.55em;
  border-top: 1px solid #f1f5f9;
}

.side-usage__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.28em;
  letter-spacing: 0.04em;
}

.side-usage__row b {
  color: #374151;
  font-weight: 600;
}

.side-usage__bar {
  display: block;
  height: 0.3em;
  margin-top: 0.3em;
  overflow: hidden;
  border-radius: 999px;
  background: #eff6ff;
}

.side-usage__bar i {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.user {
  display: flex;
  align-items: center;
  gap: 0.45em;
  padding-top: 0.45em;
  border-top: 1px solid #f1f5f9;
}

.user__avatar {
  display: grid;
  width: 1.35em;
  height: 1.35em;
  flex: none;
  place-items: center;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.36em;
  font-weight: 700;
}

.user__meta {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.user__meta b {
  font-size: 0.4em;
}

.user__meta i {
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.29em;
  font-style: normal;
  letter-spacing: 0.06em;
}

.main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5em;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 0.65em;
  padding: 0.45em 0.65em;
}

.crumb {
  color: #111827;
  font-size: 0.45em;
  font-weight: 600;
  white-space: nowrap;
}

.crumb em {
  padding: 0 0.3em;
  color: #cbd5e1;
  font-style: normal;
}

.search {
  display: flex;
  height: 1.65em;
  flex: 1;
  align-items: center;
  padding: 0 0.7em;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
  color: #9aa3b2;
  font-size: 0.36em;
}

.bell {
  position: relative;
  width: 0.9em;
  height: 1em;
  border: 1px solid #cbd5e1;
  border-radius: 0.5em 0.5em 0.2em 0.2em;
}

.bell i {
  position: absolute;
  top: -0.1em;
  right: -0.1em;
  width: 0.35em;
  height: 0.35em;
  border: 1px solid #fff;
  border-radius: 50%;
  background: #dc2626;
}

.topbar__avatar {
  width: 1.3em;
  height: 1.3em;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
}

.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em;
}

.kpi {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  padding: 0.5em 0.55em;
}

.kpi__label {
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.31em;
  letter-spacing: 0.08em;
}

.kpi__value {
  font-size: 1.15em;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.kpi__delta {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.31em;
}

.kpi__delta.is-up {
  color: #16a34a;
}

.kpi__delta.is-down {
  color: #d97706;
}

.lower {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: 1.32fr 1fr;
  gap: 0.5em;
}

.stack {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 0.5em;
}

.stack .table {
  flex: 1.55;
}

.stack .mini {
  flex: 1;
}

.panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 0.55em 0.6em;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4em;
}

.panel__head b {
  font-size: 0.48em;
}

.pill {
  padding: 0.2em 0.5em;
  border-radius: 999px;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.29em;
  letter-spacing: 0.04em;
}

.pill--soft {
  background: #eff6ff;
  color: #2563eb;
}

.link {
  color: #2563eb;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.28em;
  letter-spacing: 0.05em;
}

.chart__plot {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: flex-end;
  padding-top: 0.55em;
}

.chart__line {
  position: absolute;
  right: 0;
  left: 0;
  height: 1px;
  background: #f1f5f9;
}

.line-a {
  top: 28%;
}

.line-b {
  top: 55%;
}

.line-c {
  top: 82%;
}

.bars {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.3em;
  padding: 0 0.15em 0.1em;
}

.bars i {
  width: 100%;
  max-width: 2.2em;
  height: var(--h);
  flex: 1;
  border-radius: 0.18em 0.18em 0 0;
  background: linear-gradient(180deg, #bfdbfe, #dbeafe);
}

.bars i.is-on {
  background: linear-gradient(180deg, #2563eb, #60a5fa);
}

.chart__axis {
  display: flex;
  justify-content: space-between;
  padding-top: 0.3em;
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.27em;
}

.table {
  gap: 0.1em;
}

.tr {
  display: grid;
  grid-template-columns: 1.35fr 0.8fr 0.62fr;
  align-items: center;
  gap: 0.4em;
  min-height: 1.75em;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.36em;
}

.tr.th {
  min-height: 1.5em;
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.27em;
  letter-spacing: 0.06em;
}

.cust {
  display: flex;
  align-items: center;
  gap: 0.4em;
  min-width: 0;
}

.cust i {
  width: 0.8em;
  height: 0.8em;
  flex: none;
  border-radius: 0.18em;
  background: #e2e8f0;
}

.cust b {
  overflow: hidden;
  font-size: 1em;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.muted {
  color: #6b7280;
}

.bill-tag {
  justify-self: start;
  padding: 0.18em 0.45em;
  border-radius: 999px;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.82em;
  letter-spacing: 0.04em;
}

.bill-tag--paid {
  background: #f0fdf4;
  color: #16a34a;
}

.bill-tag--due {
  background: #fffbeb;
  color: #b45309;
}

.sync {
  margin-top: auto;
  padding-top: 0.4em;
  border-top: 1px solid #f1f5f9;
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.26em;
  letter-spacing: 0.03em;
}

.mini {
  gap: 0.15em;
}

.mini__row {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr auto;
  align-items: center;
  gap: 0.4em;
  color: #4b5563;
  font-size: 0.3em;
}

.mini__bar {
  display: block;
  height: 0.3em;
  overflow: hidden;
  border-radius: 999px;
  background: #f1f5f9;
}

.mini__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #93c5fd, #2563eb);
}

.mini__row b {
  color: #111827;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.9em;
  font-weight: 600;
}

.rail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5em;
}

.plan {
  overflow: hidden;
  padding-bottom: 0.55em;
}

.plan__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45em 0.55em;
  background: linear-gradient(120deg, #1d4ed8, #2563eb);
  color: #eff6ff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.32em;
  letter-spacing: 0.06em;
}

.plan__trial {
  padding: 0.15em 0.45em;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.plan__price {
  display: flex;
  align-items: baseline;
  gap: 0.25em;
  padding: 0.45em 0.55em 0.25em;
}

.plan__price b {
  font-size: 1.15em;
}

.plan__price span {
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.32em;
}

.plan__price em {
  margin-left: auto;
  color: #2563eb;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.29em;
  font-style: normal;
  letter-spacing: 0.03em;
}

.quota {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  padding: 0 0.55em;
}

.quota__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.28em;
  letter-spacing: 0.04em;
}

.quota__row b {
  color: #374151;
  font-weight: 600;
}

.quota__bar {
  display: block;
  height: 0.28em;
  overflow: hidden;
  border-radius: 999px;
  background: #eff6ff;
}

.quota__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.upgrade {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5em 0.55em 0;
  padding: 0.4em;
  border-radius: 0.35em;
  background: #111827;
  color: #fff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.3em;
  letter-spacing: 0.08em;
}

.team {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  padding: 0.55em;
}

.team__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.28em;
  letter-spacing: 0.05em;
}

.team__head b {
  color: #111827;
  font-size: 1.15em;
}

.avatars {
  display: flex;
  align-items: center;
}

.av {
  display: grid;
  width: 1.45em;
  height: 1.45em;
  margin-right: -0.3em;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #1e3a8a;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.31em;
  font-style: normal;
  font-weight: 700;
}

.av--1 {
  background: #dbeafe;
}

.av--2 {
  background: #ede9fe;
  color: #5b21b6;
}

.av--3 {
  background: #dcfce7;
  color: #166534;
}

.av--4 {
  background: #ffedd5;
  color: #9a3412;
}

.av--more {
  background: #f1f5f9;
  color: #475569;
}

.roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
}

.roles span {
  padding: 0.15em 0.4em;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.26em;
  letter-spacing: 0.04em;
}

.connects {
  display: flex;
  gap: 0.55em;
  padding-top: 0.35em;
  border-top: 1px solid #f1f5f9;
}

.connects span {
  display: flex;
  align-items: center;
  gap: 0.3em;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.27em;
  letter-spacing: 0.03em;
}

.activity {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.1em;
  padding: 0.55em;
}

.activity__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.15em;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.28em;
  letter-spacing: 0.05em;
}

.activity__head b {
  color: #111827;
  font-size: 1.15em;
}

.event {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.4em;
  padding: 0.42em 0;
  border-bottom: 1px solid #f1f5f9;
  color: #4b5563;
  font-size: 0.33em;
}

.event:last-child {
  border-bottom: 0;
}

.event em {
  color: #9aa3b2;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.85em;
  font-style: normal;
}

.event__dot {
  width: 0.45em;
  height: 0.45em;
  border-radius: 50%;
}

.event__dot--green {
  background: #16a34a;
}

.event__dot--blue {
  background: #2563eb;
}

.event__dot--amber {
  background: #d97706;
}

.dot {
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
}

.dot--on {
  background: #16a34a;
  box-shadow: 0 0 0 0.12em rgba(22, 163, 74, 0.15);
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.5cqw, 12px);
  }

  .board {
    grid-template-columns: 1fr;
    padding: 0.5em 0.65em 0.6em;
  }

  .sidebar,
  .rail {
    display: none;
  }

  .caption span:last-child {
    display: none;
  }

  .kpi:nth-child(3) {
    display: none;
  }

  .kpis {
    grid-template-columns: repeat(2, 1fr);
  }

  .lower {
    grid-template-columns: 1fr;
  }

  .table {
    display: none;
  }
}
</style>
