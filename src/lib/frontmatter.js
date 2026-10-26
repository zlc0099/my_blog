import { JSON_SCHEMA, load as loadYaml } from 'js-yaml';

export function parseFrontmatter(raw) {
  const normalized = String(raw || '').replace(/^\uFEFF/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(normalized);
  if (!match) return { data: {}, body: normalized };
  return {
    data: loadYaml(match[1], { schema: JSON_SCHEMA }) || {},
    body: match[2],
  };
}

export function fileSlug(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}
