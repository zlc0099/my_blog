<template>
  <div class="cover">
    <div class="scan" aria-hidden="true"></div>

    <header>
      <b class="brand">CATALOG</b>
      <nav>
        <span class="active">RELEASES</span>
        <span>ARTISTS</span>
        <span>RANKING</span>
      </nav>
      <span class="search">SEARCH DATABASE...</span>
      <span class="status">ONLINE</span>
    </header>

    <div class="statusbar">
      <span>SYS.STATUS : ONLINE</span>
      <span>CATALOG / GLOBAL MEDIA ARCHIVE</span>
      <span>BUILD 2026.09</span>
    </div>

    <div class="body">
      <aside>
        <span class="label">GENRE / 001</span>
        <span class="active">ALL RELEASES</span>
        <span>AMBIENT</span>
        <span>JAZZ</span>
        <span>ROCK</span>
        <span>ELECTRONIC</span>
      </aside>

      <main>
        <div class="section">
          <span class="no">01</span>
          <b>LATEST RELEASES</b>
          <i>VIEW ALL →</i>
        </div>

        <div class="covers">
          <div class="album">
            <i class="art a1"></i>
            <b>RELEASE 01</b>
            <em>1997 / 4.2</em>
          </div>
          <div class="album">
            <i class="art a2"></i>
            <b>RELEASE 02</b>
            <em>1971 / 4.5</em>
          </div>
          <div class="album">
            <i class="art a3"></i>
            <b>RELEASE 03</b>
            <em>1973 / 4.1</em>
          </div>
        </div>

      </main>
    </div>

    <footer>
      <span>TRACK 07 / 12</span>
      <span>RUNTIME 04:38</span>
      <span class="live">SSE / SYNCED</span>
    </footer>
  </div>
</template>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background:
    repeating-linear-gradient(0deg, rgba(240, 241, 237, 0.014) 0 1px, transparent 1px 3px),
    linear-gradient(rgba(240, 241, 237, 0.012) 1px, transparent 1px) 0 0 / 3em 3em,
    linear-gradient(90deg, rgba(240, 241, 237, 0.012) 1px, transparent 1px) 0 0 / 3em 3em,
    #0d0f10;
  color: #f0f1ed;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(5px, 1.02cqw, 13px);
}

.scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(231, 229, 163, 0.05) 50%, transparent 100%);
  pointer-events: none;
}

header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.2em;
  flex: 0 0 13%;
  padding: 0 1.1em;
  border-bottom: 1px solid #292d2e;
  background: #111415;
}

.brand {
  color: #f0f1ed;
  font-size: 1.15em;
  letter-spacing: 0.34em;
  white-space: nowrap;
}

nav {
  display: flex;
  align-items: center;
  gap: 0.2em;
}

nav span {
  padding: 0.42em 0.55em;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.56em;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

nav .active {
  color: #e7e5a3;
  box-shadow: inset 0 -1px 0 #e7e5a3;
}

.search {
  flex: 1;
  max-width: 16em;
  margin-left: auto;
  padding: 0.42em 0.65em;
  border: 1px solid #292d2e;
  background: #16191a;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.55em;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  color: #a7acaa;
  font-family: var(--font-mono);
  font-size: 0.54em;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.status::before {
  width: 0.45em;
  height: 0.45em;
  border-radius: 50%;
  background: #5fd39b;
  box-shadow: 0 0 0.5em rgba(95, 211, 155, 0.7);
  content: '';
}

.statusbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  flex: 0 0 6%;
  padding: 0 1.1em;
  border-bottom: 1px solid #222627;
  background: #111415;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.48em;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  min-height: 0;
}

aside {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  width: 19%;
  padding: 0.9em 0.8em;
  border-right: 1px solid #222627;
}

aside .label {
  margin-bottom: 0.4em;
  color: #5a5c3a;
  font-family: var(--font-mono);
  font-size: 0.5em;
  letter-spacing: 0.14em;
}

aside span:not(.label) {
  padding: 0.42em 0.4em;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.56em;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

aside .active {
  border-left: 1px solid #e7e5a3;
  background: rgba(231, 229, 163, 0.06);
  color: #e7e5a3;
}

main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.6em;
  min-width: 0;
  padding: 0.8em 1em;
}

.section {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  padding-bottom: 0.35em;
  border-bottom: 1px solid #292d2e;
}

.section .no {
  color: #e7e5a3;
  font-family: var(--font-mono);
  font-size: 0.55em;
}

.section b {
  color: #f0f1ed;
  font-size: 0.66em;
  letter-spacing: 0.14em;
}

.section i {
  margin-left: auto;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.5em;
  font-style: normal;
  letter-spacing: 0.1em;
}

.covers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6em;
}

.album {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  min-width: 0;
}

.art {
  display: block;
  aspect-ratio: 5 / 3;
  border: 1px solid #292d2e;
}

.a1 {
  background:
    linear-gradient(135deg, rgba(231, 229, 163, 0.9), transparent 46%),
    repeating-linear-gradient(90deg, #37474f 0 0.4em, #263238 0.4em 0.8em);
}

.a2 {
  background:
    radial-gradient(circle at 32% 30%, #e7e5a3 0 8%, transparent 9%),
    linear-gradient(160deg, #2f3e46, #151a1c 68%);
}

.a3 {
  background:
    linear-gradient(45deg, transparent 46%, rgba(231, 229, 163, 0.5) 47% 53%, transparent 54%),
    linear-gradient(160deg, #3c3a2a, #171815);
}

.album b {
  overflow: hidden;
  color: #d6d8d2;
  font-size: 0.55em;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album em {
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.48em;
  font-style: normal;
  letter-spacing: 0.06em;
}

footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.2em;
  flex: 0 0 7%;
  padding: 0 1.1em;
  border-top: 1px solid #222627;
  background: #111415;
  color: #707675;
  font-family: var(--font-mono);
  font-size: 0.48em;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

footer .live {
  margin-left: auto;
  color: #e7e5a3;
}

@container (max-width: 520px) {
  nav span:nth-child(n + 3),
  aside,
  .album:nth-child(3),
  footer span:nth-child(2) {
    display: none;
  }

  .body {
    display: block;
  }

  main {
    height: 100%;
  }
}
</style>
