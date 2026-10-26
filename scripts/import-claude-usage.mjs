#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
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
  console.log(`Claude Code usage importer

Usage:
  node scripts/import-claude-usage.mjs [options]

Options:
  --source <dir>      Claude Code projects log directory
                      default: ~/.claude/projects
  --out <file>        usage JSON output
                      default: src/data/usage.json
  --notes-dir <dir>   session note directory
                      default: src/content/sessions
  --no-notes          aggregate usage only, generate no note stubs
  --notes-limit <n>   only create notes for the latest N sessions (0 = all)
  --project <name>    only import sessions whose project label matches
  --dry-run           print the summary without writing files
  --help              show this help

Privacy:
  The importer reads local JSONL logs but only writes token totals, timestamps,
  model names, project labels and session ids. It never writes prompt or
  assistant message content to the repository.

Notes:
  Existing note files are never overwritten. Rerun the importer when new
  sessions appear; manual notes and non-Claude records are preserved.
`);
}

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const sourceDir = path.resolve(
  argValue('--source', path.join(os.homedir(), '.claude', 'projects')),
);
const outFile = path.resolve(argValue('--out', path.join(ROOT, 'src', 'data', 'usage.json')));
const notesDir = path.resolve(
  argValue('--notes-dir', path.join(ROOT, 'src', 'content', 'sessions')),
);
const writeNotes = !hasFlag('--no-notes');
const dryRun = hasFlag('--dry-run');
const notesLimit = Math.max(0, Number(argValue('--notes-limit', '0')) || 0);
const projectFilter = argValue('--project', '');

function localDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '').slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  return String(value || '').replaceAll('-', '.');
}

function collectJsonlFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Claude Code log directory not found: ${directory}`);
  }

  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.jsonl')) files.push(fullPath);
    }
  };
  visit(directory);
  return files;
}

function projectLabel(cwd) {
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

function normalizeSession(session) {
  const start = session.firstTs ? localDate(session.firstTs) : session.fileDate;
  const end = session.lastTs ? localDate(session.lastTs) : start;
  const project = projectLabel(topKey(session.cwds));
  const models = new Map(
    [...session.models.entries()].filter(([model]) => model !== '<synthetic>'),
  );
  const model = topKey(models) || topKey(session.models) || 'unknown';
  return {
    sessionId: session.id,
    shortId: session.shortId,
    date: start,
    updated: end,
    project,
    model,
    messages: session.messages,
    sideMessages: session.sideMessages,
    tokensIn: session.input,
    tokensOut: session.output,
    cacheRead: session.cacheRead,
    cacheWrite: session.cacheWrite,
    total:
      session.input + session.output + session.cacheRead + session.cacheWrite,
    firstTs: session.firstTs,
    lastTs: session.lastTs,
  };
}

function noteSlugFor(session, usedSlugs) {
  const base = `cc-${session.date.replaceAll('-', '')}-${session.shortId}`;
  let slug = base;
  let attempt = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${attempt}`;
    attempt += 1;
  }
  usedSlugs.add(slug);
  return slug;
}

function noteTitle(session) {
  return `Claude Code 会话 · ${formatDate(session.date)}${session.project !== 'unknown' ? ` / ${session.project}` : ''}`;
}

function noteStub(session, slug) {
  return `---
title: "${noteTitle(session).replaceAll('"', '\\"')}"
slug: "${slug}"
date: "${session.date}"
updated: "${session.updated}"
agent: "claude-code"
project: "${session.project}"
model: "${session.model}"
session: "${session.shortId}"
auto: true
---

> 这条笔记由本地 Claude Code 日志生成，**不包含对话原文**。补充内容后，可将 frontmatter 中的 \`auto\` 改为 \`false\`。

## 会话目标

待补充：这次会话要解决什么问题？

## 关键判断

- 

## 产出与验证

- 

## 后续

- 
`;
}

async function parseSessionFile(file, seenMessageIds, sessions) {
  const stream = fs.createReadStream(file, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let fileDate = localDate(fs.statSync(file).mtime.toISOString());

  for await (const line of lines) {
    if (!line.includes('"usage"')) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      continue;
    }
    if (entry.type !== 'assistant') continue;
    const message = entry.message;
    const usage = message?.usage;
    if (!message || !usage || typeof usage !== 'object') continue;

    const messageKey = message.id || entry.uuid;
    if (messageKey) {
      if (seenMessageIds.has(messageKey)) continue;
      seenMessageIds.add(messageKey);
    }

    const sid = entry.sessionId || entry.session_id || path.basename(file, '.jsonl');
    let session = sessions.get(sid);
    if (!session) {
      const baseShort = sid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'session';
      session = {
        id: sid,
        shortId: baseShort,
        firstTs: '',
        lastTs: '',
        fileDate,
        cwds: new Map(),
        models: new Map(),
        messages: 0,
        sideMessages: 0,
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
      };
      sessions.set(sid, session);
    }

    const timestamp = entry.timestamp || '';
    if (timestamp && (!session.firstTs || timestamp < session.firstTs)) session.firstTs = timestamp;
    if (timestamp && (!session.lastTs || timestamp > session.lastTs)) session.lastTs = timestamp;
    if (entry.cwd) session.cwds.set(entry.cwd, (session.cwds.get(entry.cwd) || 0) + 1);
    const model = message.model || 'unknown';
    session.models.set(model, (session.models.get(model) || 0) + 1);
    session.messages += 1;
    if (entry.isSidechain) session.sideMessages += 1;
    session.input += Number(usage.input_tokens) || 0;
    session.output += Number(usage.output_tokens) || 0;
    session.cacheRead += Number(usage.cache_read_input_tokens) || 0;
    session.cacheWrite += Number(usage.cache_creation_input_tokens) || 0;
  }
}

async function main() {
  const files = collectJsonlFiles(sourceDir);
  if (!files.length) throw new Error(`No .jsonl logs found under: ${sourceDir}`);

  const sessions = new Map();
  const seenMessageIds = new Set();

  for (const file of files) {
    await parseSessionFile(file, seenMessageIds, sessions);
  }

  let normalized = [...sessions.values()]
    .map(normalizeSession)
    .filter((session) => session.total > 0);

  if (projectFilter) {
    normalized = normalized.filter((session) => session.project === projectFilter);
  }

  normalized.sort((a, b) => b.date.localeCompare(a.date) || b.updated.localeCompare(a.updated));

  const usedShortIds = new Map();
  for (const session of normalized) {
    let shortId = session.shortId;
    let attempt = 2;
    while (usedShortIds.has(shortId)) {
      shortId = `${session.shortId}${attempt}`;
      attempt += 1;
    }
    usedShortIds.set(shortId, true);
    session.shortId = shortId;
  }

  const usedSlugs = new Set();
  const noteResults = [];
  normalized.forEach((session, index) => {
    const slug = noteSlugFor(session, usedSlugs);
    const notePath = path.join(notesDir, `${slug}.md`);
    const exists = fs.existsSync(notePath);
    const shouldCreate =
      writeNotes && !exists && (notesLimit === 0 || index < notesLimit);
    if (shouldCreate && !dryRun) {
      fs.mkdirSync(notesDir, { recursive: true });
      fs.writeFileSync(notePath, noteStub(session, slug), { flag: 'wx' });
    }
    if (exists || shouldCreate) {
      session.note = slug;
      noteResults.push({ slug, created: shouldCreate && !exists, existing: exists });
    } else {
      session.note = '';
    }
  });

  const importedRecords = normalized.map((session) => ({
    date: session.date,
    updated: session.updated,
    agent: 'claude-code',
    task: `Claude Code 会话${session.project !== 'unknown' ? ` · ${session.project}` : ''}`,
    type: 'session',
    model: session.model,
    project: session.project,
    session: session.shortId,
    messages: session.messages,
    startedAt: session.firstTs,
    endedAt: session.lastTs,
    tokensIn: session.tokensIn,
    tokensOut: session.tokensOut,
    cacheRead: session.cacheRead,
    cacheWrite: session.cacheWrite,
    note: session.note,
    source: 'claude-code-import',
  }));

  let existing = null;
  try {
    existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  } catch (error) {
    existing = null;
  }

  const preserved = [];
  if (existing && existing.demo !== true) {
    for (const record of existing.records || []) {
      if (record.source === 'claude-code-import') continue;
      if (record.manual === true || record.agent !== 'claude-code' || !record.session) {
        preserved.push(record);
      }
    }
  }

  const records = [...preserved, ...importedRecords].sort(
    (a, b) => String(b.date || '').localeCompare(String(a.date || '')),
  );

  const totals = records.reduce(
    (summary, record) => {
      summary.total +=
        (Number(record.tokensIn) || 0) +
        (Number(record.tokensOut) || 0) +
        (Number(record.cacheRead) || 0) +
        (Number(record.cacheWrite) || 0);
      return summary;
    },
    { total: 0 },
  );

  const payload = {
    demo: false,
    source: 'claude-code-logs',
    updated: localDate(new Date().toISOString()),
    note: '由本地 Claude Code 会话日志聚合，不包含对话原文。tokensIn 为未缓存输入，tokensOut 为输出，cacheRead / cacheWrite 单列；总量包含缓存读写。Qoder / Trae 暂无自动导入，需要手动记录。',
    records,
  };

  const createdNotes = noteResults.filter((item) => item.created).length;
  const existingNotes = noteResults.filter((item) => item.existing).length;
  const activeProjectLabels = [...new Set(normalized.map((session) => session.project))];

  console.log(`scanned files:       ${files.length}`);
  console.log(`unique sessions:     ${normalized.length}`);
  console.log(`preserved records:   ${preserved.length}`);
  console.log(`total tokens:        ${totals.total} (${(totals.total / 1_000_000).toFixed(2)}M)`);
  console.log(`date range:          ${normalized.at(-1)?.date || '-'} -> ${normalized[0]?.date || '-'}`);
  console.log(`projects:            ${activeProjectLabels.join(', ') || '-'}`);
  console.log(`new note stubs:      ${createdNotes}`);
  console.log(`existing notes kept: ${existingNotes}`);

  if (dryRun) {
    console.log('dry run: no files written');
    return;
  }

  fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`usage written:       ${path.relative(ROOT, outFile)}`);
  if (writeNotes) console.log(`notes directory:     ${path.relative(ROOT, notesDir)}`);
  console.log('raw transcripts were not written');
}

main().catch((error) => {
  console.error(`import failed: ${error.message}`);
  process.exitCode = 1;
});
