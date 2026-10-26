#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function argValue(flag, fallback) {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  const value = args[index + 1];
  return value && !value.startsWith('--') ? value : fallback;
}

function hasFlag(flag) {
  return args.includes(flag);
}

function printHelp() {
  console.log(`Qoder / Trae local model trace importer

Usage:
  node scripts/import-agent-models.mjs [options]

Options:
  --qoder-db <file>   Qoder main.sqlite
                      default: latest %APPDATA%/com.qodercn.app.*/main.sqlite
  --trae-dir <dir>    Trae CN data directory
                      default: %APPDATA%/Trae CN
  --out <file>        output JSON
                      default: src/data/agent-models.json
  --dry-run           print the summary without writing files
  --help              show this help

Requires Node.js 22.5+ for the built-in node:sqlite module.

Privacy:
  Only model names, session counts, activity counts and date ranges are
  written. Conversation text, titles, workspace paths and session ids are
  never exported. Neither app stores usable token usage locally, so Qoder and
  Trae entries do not contain token fields.
`);
}

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const outFile = path.resolve(
  argValue('--out', path.join(ROOT, 'src', 'data', 'agent-models.json')),
);
const dryRun = hasFlag('--dry-run');
const explicitQoderDb = argValue('--qoder-db', '');
const explicitTraeDir = argValue('--trae-dir', '');

function localDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '').slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromEpochMs(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return '';
  return localDate(number);
}

function dateFromLine(line) {
  const match = String(line).match(/^(\d{4}-\d{2}-\d{2})T/);
  return match ? match[1] : '';
}

function minDate(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  return a < b ? a : b;
}

function maxDate(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  return a > b ? a : b;
}

function listFiles(directory, targetName, result = []) {
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) listFiles(fullPath, targetName, result);
    else if (entry.isFile() && entry.name === targetName) result.push(fullPath);
  }
  return result;
}

function findQoderDb() {
  if (explicitQoderDb) {
    const resolved = path.resolve(explicitQoderDb);
    if (!fs.existsSync(resolved)) throw new Error(`Qoder database not found: ${resolved}`);
    return resolved;
  }
  const appData = process.env.APPDATA;
  if (!appData) return '';
  const candidates = fs
    .readdirSync(appData, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^com\.qodercn\.app\./i.test(entry.name))
    .map((entry) => path.join(appData, entry.name, 'main.sqlite'))
    .filter((file) => fs.existsSync(file))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return candidates[0] || '';
}

function findTraeDir() {
  if (explicitTraeDir) {
    const resolved = path.resolve(explicitTraeDir);
    if (!fs.existsSync(resolved)) throw new Error(`Trae data directory not found: ${resolved}`);
    return resolved;
  }
  const appData = process.env.APPDATA;
  if (!appData) return '';
  for (const name of ['Trae CN', 'Trae']) {
    const candidate = path.join(appData, name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return '';
}

function snapshotDatabase(files) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pa-agent-models-'));
  const available = files.filter((file) => fs.existsSync(file));
  if (!available.length) throw new Error('database file not found');
  for (const file of available) {
    fs.copyFileSync(file, path.join(tempDir, path.basename(file)));
  }
  return tempDir;
}

function cleanup(directory) {
  if (!directory) return;
  try {
    fs.rmSync(directory, { recursive: true, force: true });
  } catch (error) {
    // Temp cleanup is best effort.
  }
}

async function readQoder() {
  const dbFile = findQoderDb();
  if (!dbFile) {
    console.warn('qoder: database not found, preserving existing entry');
    return null;
  }

  let tempDir = '';
  let db;
  try {
    const { DatabaseSync } = await import('node:sqlite');
    tempDir = snapshotDatabase([dbFile, `${dbFile}-wal`, `${dbFile}-shm`]);
    db = new DatabaseSync(path.join(tempDir, 'main.sqlite'));
    const rows = db
      .prepare(
        `select s.session_id,
                s.model,
                s.created_at,
                s.updated_at,
                count(m.message_id) as messages,
                sum(case when json_extract(m.payload_json, '$.role') = 'assistant' then 1 else 0 end) as replies
           from chat_sessions s
           left join chat_session_messages m on m.session_id = s.session_id
          where s.deleted_at is null
            and s.model is not null
            and s.model <> ''
          group by s.session_id
          order by s.created_at`,
      )
      .all();

    const modelMap = new Map();
    const sessions = new Set();
    let periodFirst = '';
    let periodLast = '';
    let totalReplies = 0;

    for (const row of rows) {
      const model = String(row.model).trim();
      if (!model) continue;
      const first = dateFromEpochMs(row.created_at);
      const last = dateFromEpochMs(row.updated_at) || first;
      const replies = Number(row.replies) || 0;
      sessions.add(row.session_id);
      periodFirst = minDate(periodFirst, first);
      periodLast = maxDate(periodLast, last);
      totalReplies += replies;

      const entry = modelMap.get(model) || {
        model,
        sessions: 0,
        activity: 0,
        first: '',
        last: '',
      };
      entry.sessions += 1;
      entry.activity += replies;
      entry.first = minDate(entry.first, first);
      entry.last = maxDate(entry.last, last);
      modelMap.set(model, entry);
    }

    const models = [...modelMap.values()].sort(
      (a, b) => b.sessions - a.sessions || b.activity - a.activity || a.model.localeCompare(b.model),
    );
    return {
      agent: 'qoder',
      source: 'qoder-local-db',
      sourceLabel: 'LOCAL DB',
      tokensAvailable: false,
      activityLabel: 'REPLIES',
      sessions: sessions.size,
      activity: totalReplies,
      period: { first: periodFirst, last: periodLast },
      models,
    };
  } finally {
    db?.close();
    cleanup(tempDir);
  }
}

function cleanModelName(value) {
  let name = String(value || '').trim().replace(/_null$/i, '');
  name = name.replace(/^solo_(?:agent|coder|work|design)_\d+__?/i, '');
  name = name.replace(/^agent_\d+__?/i, '');
  name = name.replace(/^\d+_-_/, '');
  return name.trim();
}

function addTrace(trace, sessionId, model, date, counted) {
  if (!sessionId || !model) return;
  let session = trace.get(sessionId);
  if (!session) {
    session = { models: new Map(), first: '', last: '' };
    trace.set(sessionId, session);
  }
  session.first = minDate(session.first, date);
  session.last = maxDate(session.last, date);
  const entry = session.models.get(model) || { activity: 0, first: '', last: '' };
  if (counted) entry.activity += 1;
  entry.first = minDate(entry.first, date);
  entry.last = maxDate(entry.last, date);
  session.models.set(model, entry);
}

function parseTraeLogs(traeDir, trace, seenRequests) {
  const files = listFiles(path.join(traeDir, 'logs'), 'renderer.log');
  const snapshotPattern = /start stream selection snapshot (\{.*\})\s*$/;
  const entryPattern = /startStream entry (\{.*\})\s*$/;
  let filesRead = 0;
  let requests = 0;

  for (const file of files) {
    filesRead += 1;
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line.includes('startStream entry') && !line.includes('start stream selection snapshot')) {
        continue;
      }
      const match = snapshotPattern.exec(line) || entryPattern.exec(line);
      if (!match) continue;
      let payload;
      try {
        payload = JSON.parse(match[1]);
      } catch (error) {
        continue;
      }
      const sessionId = payload.sessionId || payload.chatSessionId || '';
      if (!sessionId || sessionId.startsWith('__v2')) continue;
      const model = cleanModelName(
        payload.modelName ||
          payload.options?.model ||
          payload.requestTracking?.model ||
          '',
      );
      if (!model) continue;
      const requestId = payload.userMessageId || line.slice(0, 24);
      const key = `${sessionId}|${requestId}`;
      if (seenRequests.has(key)) continue;
      seenRequests.add(key);
      const date = dateFromLine(line);
      addTrace(trace, sessionId, model, date, true);
      requests += 1;
    }
  }

  return { filesRead, requests };
}

async function readTraeCache(traeDir, trace, logSessions) {
  const dbFile = path.join(traeDir, 'User', 'globalStorage', 'state.vscdb');
  if (!fs.existsSync(dbFile)) return { cachedSessions: 0 };

  let tempDir = '';
  let db;
  try {
    const { DatabaseSync } = await import('node:sqlite');
    tempDir = snapshotDatabase([dbFile, `${dbFile}-wal`, `${dbFile}-shm`]);
    db = new DatabaseSync(path.join(tempDir, 'state.vscdb'));
    const rows = db
      .prepare(
        `select key, value
           from ItemTable
          where key like 'ai-chat.chatQueryCompletion.v1.%'`,
      )
      .all();

    let cachedSessions = 0;
    const seen = new Set();
    for (const row of rows) {
      const raw = Buffer.isBuffer(row.value) ? row.value.toString('utf8') : String(row.value);
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (error) {
        continue;
      }
      const response = payload.response || {};
      const sessionId = response.sessionId || '';
      const model = cleanModelName(response.modelName || '');
      if (!sessionId || !model || seen.has(sessionId) || logSessions.has(sessionId)) continue;
      seen.add(sessionId);
      const date = dateFromEpochMs(payload.savedAt);
      addTrace(trace, sessionId, model, date, true);
      cachedSessions += 1;
    }
    return { cachedSessions };
  } finally {
    db?.close();
    cleanup(tempDir);
  }
}

async function readTrae() {
  const traeDir = findTraeDir();
  if (!traeDir) {
    console.warn('trae: data directory not found, preserving existing entry');
    return null;
  }

  const trace = new Map();
  const seenRequests = new Set();
  const logStats = parseTraeLogs(traeDir, trace, seenRequests);
  const logSessions = new Set(trace.keys());
  const cacheStats = await readTraeCache(traeDir, trace, logSessions);

  const modelMap = new Map();
  let periodFirst = '';
  let periodLast = '';
  let totalActivity = 0;

  for (const session of trace.values()) {
    periodFirst = minDate(periodFirst, session.first);
    periodLast = maxDate(periodLast, session.last);
    for (const [model, entry] of session.models.entries()) {
      totalActivity += entry.activity;
      const aggregate = modelMap.get(model) || {
        model,
        sessions: 0,
        activity: 0,
        first: '',
        last: '',
      };
      aggregate.sessions += 1;
      aggregate.activity += entry.activity;
      aggregate.first = minDate(aggregate.first, entry.first);
      aggregate.last = maxDate(aggregate.last, entry.last);
      modelMap.set(model, aggregate);
    }
  }

  const models = [...modelMap.values()].sort(
    (a, b) => b.sessions - a.sessions || b.activity - a.activity || a.model.localeCompare(b.model),
  );

  return {
    agent: 'trae',
    source: 'trae-local-trace',
    sourceLabel: 'LOCAL TRACE',
    tokensAvailable: false,
    activityLabel: 'CALLS',
    sessions: trace.size,
    activity: totalActivity,
    period: { first: periodFirst, last: periodLast },
    models,
    evidence: {
      logFiles: logStats.filesRead,
      logRequests: logStats.requests,
      cachedSessions: cacheStats.cachedSessions,
    },
  };
}

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
  } catch (error) {
    return null;
  }
}

async function main() {
  const existing = loadExisting();
  const existingAgents = new Map(
    (existing?.agents || []).map((agent) => [agent.agent, agent]),
  );
  const freshAgents = new Map();

  for (const [id, reader] of [
    ['qoder', readQoder],
    ['trae', readTrae],
  ]) {
    try {
      const result = await reader();
      if (result) freshAgents.set(id, result);
      else if (existingAgents.has(id)) freshAgents.set(id, existingAgents.get(id));
    } catch (error) {
      console.warn(`${id}: ${error.message}`);
      if (existingAgents.has(id)) {
        console.warn(`${id}: preserving existing entry`);
        freshAgents.set(id, existingAgents.get(id));
      }
    }
  }

  if (!freshAgents.size) {
    throw new Error('No Qoder or Trae statistics could be read.');
  }

  const agents = ['qoder', 'trae']
    .map((id) => freshAgents.get(id))
    .filter(Boolean);

  const payload = {
    demo: false,
    source: 'local-agent-trace',
    updated: localDate(new Date()),
    note: '由本机 Qoder 会话库与 Trae 本地日志 / 完成缓存聚合。仅包含模型名、会话数、活动数与日期范围；不包含对话、标题、路径、会话 ID 或 Token 明细。',
    agents,
  };

  for (const agent of agents) {
    const models = agent.models
      .map((model) => `${model.model} ${model.sessions}s/${model.activity}${agent.activityLabel.toLowerCase()}`)
      .join(', ');
    console.log(`${agent.agent}: ${agent.sessions} sessions, ${agent.activity} ${agent.activityLabel.toLowerCase()}, ${agent.models.length} models`);
    console.log(`  ${models || '-'}`);
    console.log(
      `  period: ${agent.period.first || '-'} -> ${agent.period.last || '-'} · ${agent.sourceLabel}`,
    );
    if (agent.evidence) {
      console.log(
        `  evidence: ${agent.evidence.logFiles} log files, ${agent.evidence.logRequests} logged calls, ${agent.evidence.cachedSessions} cached sessions`,
      );
    }
  }

  if (dryRun) {
    console.log('dry run: no files written');
    return;
  }

  fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`model trace written: ${path.relative(ROOT, outFile)}`);
  console.log('conversation content, titles and paths were not written');
}

main().catch((error) => {
  console.error(`import failed: ${error.message}`);
  process.exitCode = 1;
});
