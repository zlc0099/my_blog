// 纯解析与聚合逻辑：Node 导入器与浏览器端「我的用量」共用同一份实现。
// 只读取 usage / model / timestamp / cwd 等统计字段，不保留对话原文。

export function localDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '').slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function projectLabel(cwd) {
  if (!cwd) return 'unknown';
  const normalized = String(cwd).replaceAll('\\', '/').replace(/\/+$/, '');
  if (/^[A-Za-z]:\/Users\/[^/]+$/.test(normalized)) return 'home';
  if (/^\/home\/[^/]+$/.test(normalized) || /^\/Users\/[^/]+$/.test(normalized)) return 'home';
  const parts = normalized.split('/').filter(Boolean);
  const last = parts.at(-1) || 'unknown';
  return last.replace(/[^\w.-]+/g, '-').slice(0, 40) || 'unknown';
}

function topKey(counter) {
  return [...counter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

export function createUsageState() {
  return { sessions: new Map(), seenMessageIds: new Set() };
}

export function ingestEntry(state, entry, fallbackSessionId, fileDate = '') {
  if (!entry || entry.type !== 'assistant') return false;
  const message = entry.message;
  const usage = message?.usage;
  if (!message || !usage || typeof usage !== 'object') return false;

  const messageKey = message.id || entry.uuid;
  if (messageKey) {
    if (state.seenMessageIds.has(messageKey)) return false;
    state.seenMessageIds.add(messageKey);
  }

  const sid = entry.sessionId || entry.session_id || fallbackSessionId;
  let session = state.sessions.get(sid);
  if (!session) {
    const baseShort = String(sid).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'session';
    session = {
      id: sid,
      shortId: baseShort,
      firstTs: '',
      lastTs: '',
      fileDate,
      cwds: new Map(),
      models: new Map(),
      modelUsage: new Map(),
      messages: 0,
      sideMessages: 0,
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    };
    state.sessions.set(sid, session);
  }

  const timestamp = entry.timestamp || '';
  if (timestamp && (!session.firstTs || timestamp < session.firstTs)) session.firstTs = timestamp;
  if (timestamp && (!session.lastTs || timestamp > session.lastTs)) session.lastTs = timestamp;
  if (entry.cwd) session.cwds.set(entry.cwd, (session.cwds.get(entry.cwd) || 0) + 1);
  const model = message.model || 'unknown';
  session.models.set(model, (session.models.get(model) || 0) + 1);
  session.messages += 1;
  if (entry.isSidechain) session.sideMessages += 1;
  const tokensIn = Number(usage.input_tokens) || 0;
  const tokensOut = Number(usage.output_tokens) || 0;
  const cacheRead = Number(usage.cache_read_input_tokens) || 0;
  const cacheWrite = Number(usage.cache_creation_input_tokens) || 0;
  session.input += tokensIn;
  session.output += tokensOut;
  session.cacheRead += cacheRead;
  session.cacheWrite += cacheWrite;
  if (model !== '<synthetic>') {
    const modelStat = session.modelUsage.get(model) || {
      messages: 0,
      tokensIn: 0,
      tokensOut: 0,
      cacheRead: 0,
      cacheWrite: 0,
    };
    modelStat.messages += 1;
    modelStat.tokensIn += tokensIn;
    modelStat.tokensOut += tokensOut;
    modelStat.cacheRead += cacheRead;
    modelStat.cacheWrite += cacheWrite;
    session.modelUsage.set(model, modelStat);
  }
  return true;
}

export function normalizeSession(session) {
  const start = session.firstTs ? localDate(session.firstTs) : session.fileDate;
  const end = session.lastTs ? localDate(session.lastTs) : start;
  const project = projectLabel(topKey(session.cwds));
  const models = new Map(
    [...session.models.entries()].filter(([model]) => model !== '<synthetic>'),
  );
  const model = topKey(models) || topKey(session.models) || 'unknown';
  const modelUsage = [...session.modelUsage.entries()]
    .map(([name, stat]) => ({
      model: name,
      messages: stat.messages,
      tokensIn: stat.tokensIn,
      tokensOut: stat.tokensOut,
      cacheRead: stat.cacheRead,
      cacheWrite: stat.cacheWrite,
      total: stat.tokensIn + stat.tokensOut + stat.cacheRead + stat.cacheWrite,
    }))
    .sort((a, b) => b.total - a.total);
  return {
    sessionId: session.id,
    shortId: session.shortId,
    date: start,
    updated: end,
    project,
    model,
    modelUsage,
    messages: session.messages,
    sideMessages: session.sideMessages,
    tokensIn: session.input,
    tokensOut: session.output,
    cacheRead: session.cacheRead,
    cacheWrite: session.cacheWrite,
    total: session.input + session.output + session.cacheRead + session.cacheWrite,
    firstTs: session.firstTs,
    lastTs: session.lastTs,
  };
}

export function aggregateModels(sessions) {
  const modelMap = new Map();
  for (const session of sessions) {
    for (const usage of session.modelUsage) {
      const entry = modelMap.get(usage.model) || {
        model: usage.model,
        agent: 'claude-code',
        sessions: 0,
        messages: 0,
        tokensIn: 0,
        tokensOut: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      };
      entry.sessions += 1;
      entry.messages += usage.messages;
      entry.tokensIn += usage.tokensIn;
      entry.tokensOut += usage.tokensOut;
      entry.cacheRead += usage.cacheRead;
      entry.cacheWrite += usage.cacheWrite;
      entry.total += usage.total;
      modelMap.set(usage.model, entry);
    }
  }
  return [...modelMap.values()].sort((a, b) => b.total - a.total);
}

export function buildUsageSummary(state) {
  const sessions = [...state.sessions.values()]
    .map(normalizeSession)
    .filter((session) => session.total > 0)
    .sort((a, b) => b.date.localeCompare(a.date) || b.updated.localeCompare(a.updated));
  return { sessions, models: aggregateModels(sessions) };
}

export function dedupeShortIds(sessions) {
  const used = new Map();
  for (const session of sessions) {
    let shortId = session.shortId;
    let attempt = 2;
    while (used.has(shortId)) {
      shortId = `${session.shortId}${attempt}`;
      attempt += 1;
    }
    used.set(shortId, true);
    session.shortId = shortId;
  }
  return sessions;
}

export function toUsageRecords(sessions) {
  return sessions.map((session) => ({
    date: session.date,
    updated: session.updated,
    agent: 'claude-code',
    task: `Claude Code 会话${session.project !== 'unknown' ? ` · ${session.project}` : ''}`,
    type: 'session',
    model: session.model,
    models: session.modelUsage.map((usage) => usage.model),
    project: session.project,
    session: session.shortId,
    messages: session.messages,
    startedAt: session.firstTs,
    endedAt: session.lastTs,
    tokensIn: session.tokensIn,
    tokensOut: session.tokensOut,
    cacheRead: session.cacheRead,
    cacheWrite: session.cacheWrite,
    note: session.note || '',
    source: 'claude-code-import',
  }));
}

export function sumTokens(records) {
  return records.reduce(
    (sum, record) =>
      sum +
      (Number(record.tokensIn) || 0) +
      (Number(record.tokensOut) || 0) +
      (Number(record.cacheRead) || 0) +
      (Number(record.cacheWrite) || 0),
    0,
  );
}
