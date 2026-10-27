<template>
  <div class="cover">
    <div class="grid" aria-hidden="true"></div>

    <div class="caption">
      <span>LAYOUT SYSTEM / ADMIN</span>
      <span>LIST · FORM · DETAIL</span>
    </div>

    <div class="board">
      <aside class="side">
        <span class="logo"><i></i><b>ADMIN</b><small>UI</small></span>
        <span class="nav-item is-active">Overview</span>
        <span class="nav-item">Records</span>
        <span class="nav-item">Forms</span>
        <span class="nav-item">Settings</span>
        <span class="nav-skeleton"></span>
        <span class="nav-skeleton"></span>
        <span class="side-foot">LAYOUT / 01</span>
      </aside>

      <div class="work">
        <div class="topbar">
          <span class="crumb">PAGES / LIST</span>
          <span class="top-tools"><i>⌕</i><i>◌</i><b></b></span>
        </div>

        <div class="pagehead">
          <div>
            <span class="eyebrow">LIST PAGE / SECTION</span>
            <h4>Data Management</h4>
          </div>
          <span class="primary">＋ New</span>
        </div>

        <div class="filters">
          <span class="filter"></span>
          <span class="filter"></span>
          <span class="filter filter--short"></span>
          <b class="search">Search</b>
          <i class="reset">Reset</i>
        </div>

        <div class="body">
          <div class="table">
            <div class="tr th">
              <span>ID</span>
              <span>NAME</span>
              <span>STATUS</span>
              <span>UPDATED</span>
              <span>ACTIONS</span>
            </div>
            <div v-for="row in 4" :key="row" class="tr">
              <span class="bar bar--code"></span>
              <span class="bar bar--name"></span>
              <span class="status"></span>
              <span class="bar bar--date"></span>
              <span class="row-actions"><i></i><i></i></span>
            </div>
            <div class="pager">
              <span class="pager__page is-active">01</span>
              <span class="pager__page">02</span>
              <span class="pager__page">03</span>
              <span class="pager__spacer"></span>
              <span class="pager__count"></span>
            </div>
          </div>

          <aside class="inspector">
            <span class="eyebrow">DETAIL / FORM</span>
            <div class="field">
              <i></i>
              <span class="bar bar--label"></span>
              <span class="control"></span>
            </div>
            <div class="field">
              <i></i>
              <span class="bar bar--label"></span>
              <span class="control"></span>
            </div>
            <div class="field field--wide">
              <span class="bar bar--label"></span>
              <span class="control control--area"></span>
            </div>
            <div class="inspector__foot">
              <span class="ghost">Cancel</span>
              <span class="save">Save</span>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <span class="measure measure--left" aria-hidden="true">24</span>
    <span class="measure measure--right" aria-hidden="true">16</span>
    <span class="measure measure--bottom" aria-hidden="true">8 / 12 / 16</span>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45em;
  padding: 0.7em 0.85em;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 8% 4%, rgba(37, 99, 235, 0.08), transparent 42%),
    radial-gradient(ellipse at 96% 100%, rgba(15, 159, 143, 0.08), transparent 44%),
    #eef2f7;
  color: #1f2937;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(6px, 1.18cqw, 14px);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: 2.2em 2.2em;
  mask-image: radial-gradient(ellipse at 50% 48%, #000 0%, transparent 86%);
  pointer-events: none;
}

.caption {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.46em;
  letter-spacing: 0.1em;
}

.caption span:first-child {
  color: #2563eb;
}

.board {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  border: 1px solid #aebdd0;
  border-radius: 0.35em;
  background: #ffffff;
  box-shadow: 0.2em 0.3em 0 rgba(54, 82, 120, 0.1);
}

.side {
  display: flex;
  width: 17%;
  min-width: 4.8em;
  flex-direction: column;
  gap: 0.4em;
  padding: 0.7em 0.55em;
  border-right: 1px solid #253247;
  background: #16202e;
  color: #cbd5e1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.35em;
  color: #f8fafc;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 0.78em;
  letter-spacing: 0.06em;
}

.logo i {
  width: 0.95em;
  height: 0.95em;
  border: 1px solid #60a5fa;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.logo small {
  color: #60a5fa;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.55em;
}

.nav-item {
  padding: 0.34em 0.4em;
  border-left: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.5em;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.nav-item.is-active {
  border-left-color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  color: #e0f2fe;
}

.nav-skeleton {
  width: 56%;
  height: 0.28em;
  margin-left: 0.4em;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
}

.side-foot {
  margin-top: auto;
  color: #64748b;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.08em;
}

.work {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  background: #f8fafc;
}

.topbar {
  display: flex;
  height: 1.9em;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 0.8em;
  padding: 0 0.75em;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  color: #94a3b8;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.46em;
  letter-spacing: 0.06em;
}

.top-tools {
  display: flex;
  align-items: center;
  gap: 0.45em;
  font-style: normal;
}

.top-tools i {
  font-style: normal;
}

.top-tools b {
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  background: #dbeafe;
  border: 1px solid #93c5fd;
}

.pagehead {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  padding: 0.7em 0.85em 0.5em;
}

.eyebrow {
  color: #2563eb;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.42em;
  letter-spacing: 0.1em;
}

.pagehead h4 {
  margin-top: 0.25em;
  color: #0f172a;
  font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1;
}

.primary {
  padding: 0.36em 0.55em;
  border: 1px solid #1d4ed8;
  border-radius: 0.18em;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.46em;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.filters {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.35em;
  padding: 0.45em 0.85em;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.filter {
  width: 18%;
  height: 1.05em;
  border: 1px solid #cbd5e1;
  border-radius: 0.12em;
  background: #f8fafc;
}

.filter--short {
  width: 12%;
}

.search,
.reset {
  padding: 0.28em 0.5em;
  border: 1px solid #cbd5e1;
  border-radius: 0.12em;
  color: #64748b;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  font-style: normal;
  white-space: nowrap;
}

.search {
  margin-left: auto;
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.body {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 0.55em;
  padding: 0.55em 0.75em 0.65em;
}

.table {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.25em;
  background: #ffffff;
}

.tr {
  display: grid;
  grid-template-columns: 0.7fr 1.5fr 0.8fr 0.9fr 0.8fr;
  align-items: center;
  gap: 0.5em;
  min-height: 2em;
  padding: 0 0.6em;
  border-bottom: 1px solid #f1f5f9;
}

.tr.th {
  min-height: 1.8em;
  border-bottom-color: #e2e8f0;
  background: #f8fafc;
  color: #7c8aa0;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.38em;
  letter-spacing: 0.04em;
}

.bar {
  display: block;
  height: 0.3em;
  border-radius: 999px;
  background: #e2e8f0;
}

.bar--code {
  width: 58%;
}

.bar--name {
  width: 72%;
}

.bar--date {
  width: 64%;
}

.bar--label {
  width: 42%;
}

.status {
  width: 2.4em;
  height: 0.85em;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  background: #f0fdf4;
}

.status::after {
  content: '';
  display: block;
  width: 45%;
  height: 0.22em;
  margin: 0.25em auto 0;
  border-radius: 999px;
  background: #86efac;
}

.row-actions {
  display: flex;
  gap: 0.28em;
}

.row-actions i {
  width: 0.65em;
  height: 0.65em;
  border: 1px solid #dbe3ee;
  border-radius: 0.12em;
}

.pager {
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-top: auto;
  padding: 0.45em 0.6em;
  border-top: 1px solid #e2e8f0;
}

.pager__page {
  width: 1.2em;
  height: 1.2em;
  border: 1px solid #cbd5e1;
  border-radius: 0.12em;
  color: #64748b;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  line-height: 1.1em;
  text-align: center;
}

.pager__page.is-active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.pager__spacer {
  flex: 1;
}

.pager__count {
  width: 3.4em;
  height: 0.28em;
  border-radius: 999px;
  background: #e2e8f0;
}

.inspector {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.6em;
  border: 1px solid #e2e8f0;
  border-left: 2px solid #2563eb;
  border-radius: 0.25em;
  background: #ffffff;
}

.field {
  display: grid;
  grid-template-columns: 0.25em minmax(0, 1fr);
  gap: 0.2em 0.4em;
  align-items: center;
}

.field i {
  grid-row: 1 / 3;
  width: 0.18em;
  height: 100%;
  background: #bfdbfe;
}

.control {
  display: block;
  width: 100%;
  height: 1.1em;
  border: 1px solid #cbd5e1;
  border-radius: 0.12em;
  background: #f8fafc;
}

.field--wide {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.control--area {
  height: 2.3em;
}

.inspector__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.35em;
  margin-top: auto;
  padding-top: 0.35em;
  border-top: 1px solid #e2e8f0;
}

.ghost,
.save {
  padding: 0.3em 0.5em;
  border: 1px solid #cbd5e1;
  border-radius: 0.12em;
  color: #64748b;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  white-space: nowrap;
}

.save {
  border-color: #1d4ed8;
  background: #2563eb;
  color: #ffffff;
}

.measure {
  position: absolute;
  z-index: 2;
  color: #3b82f6;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.4em;
  letter-spacing: 0.06em;
  opacity: 0.8;
}

.measure--left {
  top: 50%;
  left: 0.2em;
  transform: rotate(-90deg);
}

.measure--right {
  top: 46%;
  right: 0.2em;
  transform: rotate(90deg);
}

.measure--bottom {
  right: 1em;
  bottom: 0.35em;
}

@media (max-width: 720px) {
  .cover {
    font-size: clamp(6px, 1.55cqw, 13px);
    padding: 0.55em 0.6em;
  }

  .side {
    width: 19%;
    min-width: 4.2em;
    padding: 0.5em 0.4em;
  }

  .nav-item {
    font-size: 0.46em;
  }

  .body {
    grid-template-columns: minmax(0, 1fr);
  }

  .inspector {
    display: none;
  }

  .measure--left,
  .measure--right {
    display: none;
  }

  .caption span:last-child {
    display: none;
  }
}
</style>
