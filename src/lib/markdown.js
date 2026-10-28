import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import GithubSlugger from 'github-slugger';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yamlLanguage from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yamlLanguage);

const slugger = new GithubSlugger();
const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const languageAliases = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  java: 'java',
  html: 'xml',
  xml: 'xml',
  vue: 'xml',
  css: 'css',
  sql: 'sql',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
};

const languageLabels = {
  js: 'JS',
  javascript: 'JS',
  ts: 'TS',
  typescript: 'TS',
  java: 'JAVA',
  html: 'HTML',
  xml: 'HTML',
  vue: 'VUE',
  css: 'CSS',
  sql: 'SQL',
  bash: 'SH',
  sh: 'SH',
  shell: 'SH',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  text: 'TEXT',
  plaintext: 'TEXT',
  md: 'MD',
  markdown: 'MD',
};

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
});

md.use(anchor, {
  level: [2, 3, 4],
  slugify: (value) => slugger.slug(value),
});

md.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const info = token.info.trim();
  const [rawLanguage = 'text', ...rest] = info.split(/\s+/);
  const language = rawLanguage.toLowerCase() || 'text';
  const hint = md.utils.escapeHtml(rest.join(' '));
  const label = md.utils.escapeHtml(languageLabels[language] || language.toUpperCase());
  const normalized = languageAliases[language] || language;
  let highlighted;

  if (hljs.getLanguage(normalized)) {
    try {
      highlighted = hljs.highlight(token.content, {
        language: normalized,
        ignoreIllegals: true,
      }).value;
    } catch (error) {
      highlighted = md.utils.escapeHtml(token.content);
    }
  } else {
    highlighted = md.utils.escapeHtml(token.content);
  }

  return `<div class="code-block" data-lang="${label}">
  <div class="code-block__bar">
    <span class="code-block__meta"><span class="code-block__lang">${label}</span>${hint ? `<span class="code-block__hint">${hint}</span>` : ''}</span>
    <button class="code-block__copy" type="button" aria-label="复制代码" aria-live="polite">COPY</button>
  </div>
  <pre><code class="hljs">${highlighted}</code></pre>
</div>`;
};

md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
md.renderer.rules.table_close = () => '</table></div>\n';

md.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const src = token.attrGet('src');
  if (src && src.startsWith('/') && !src.startsWith('//')) {
    token.attrSet('src', `${baseUrl}${src.slice(1)}`);
  }
  token.attrSet('loading', 'lazy');
  token.attrSet('decoding', 'async');
  return self.renderToken(tokens, index, options);
};

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const href = tokens[index].attrGet('href') || '';
  if (/^https?:\/\//i.test(href)) {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noopener noreferrer');
  }
  return self.renderToken(tokens, index, options);
};

export function renderMarkdown(source) {
  slugger.reset();
  const html = md.render(source || '');
  const documentNode = new DOMParser().parseFromString(html, 'text/html');
  const headings = [...documentNode.querySelectorAll('h2, h3, h4')]
    .map((heading) => ({
      id: heading.id,
      text: heading.textContent.trim(),
      level: Number(heading.tagName.slice(1)),
    }))
    .filter((heading) => heading.id && heading.text);

  headings.forEach(({ id }) => {
    const heading = documentNode.getElementById(id);
    if (!heading) return;
    const link = documentNode.createElement('a');
    link.className = 'heading-anchor';
    link.href = `#${id}`;
    link.textContent = '#';
    link.setAttribute('aria-label', '跳转到此章节');
    heading.appendChild(link);
  });

  return {
    html: documentNode.body.innerHTML,
    headings,
  };
}

export function stripMarkdown(source) {
  return String(source || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
