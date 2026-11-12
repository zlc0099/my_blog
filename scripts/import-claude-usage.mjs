#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import {
  aggregateModels,
  buildUsageSummary,
  createUsageState,
  dedupeShortIds,
  ingestEntry,
  localDate,
  sumTokens,
  toUsageRecords,
} from '../src/lib/claude-usage.js';

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

async function parseSessionFile(file, state) {
  const stream = fs.createReadStream(file, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const fileDate = localDate(fs.statSync(file).mtime.toISOString());
  const fallbackSessionId = path.basename(file, '.jsonl');

  for await (const line of lines) {
    if (!line.includes('"usage"')) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      continue;
    }
    ingestEntry(state, entry, fallbackSessionId, fileDate);
  }
}

async function main() {
  const files = collectJsonlFiles(sourceDir);
  if (!files.length) throw new Error(`No .jsonl logs found under: ${sourceDir}`);

  const state = createUsageState();
  for (const file of files) {
    await parseSessionFile(file, state);
  }

  const summary = buildUsageSummary(state);
  let normalized = summary.sessions;

  if (projectFilter) {
    normalized = normalized.filter((session) => session.project === projectFilter);
  }

  normalized.sort((a, b) => b.date.localeCompare(a.date) || b.updated.localeCompare(a.updated));

  const models = aggregateModels(normalized);
  dedupeShortIds(normalized);

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

  const importedRecords = toUsageRecords(normalized);

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

  const totals = { total: sumTokens(records) };

  const payload = {
    demo: false,
    source: 'claude-code-logs',
    updated: localDate(new Date().toISOString()),
    note: '由本地 Claude Code 会话日志聚合，不包含对话原文。tokensIn 为未缓存输入，tokensOut 为输出，cacheRead / cacheWrite 单列；总量包含缓存读写。模型维度按每条 assistant 消息的 model 聚合，同一会话可能包含多个模型。Qoder / Trae 的本地应用未保存 Token 明细，AI LAB 仅展示其模型与会话统计。',
    models,
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
  console.log(
    `models:              ${models.map((model) => `${model.model} ${(model.total / 1_000_000).toFixed(2)}M`).join(', ') || '-'}`,
  );
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
