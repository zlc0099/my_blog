import { posts, projects } from './content';
import { prompts } from '@/data/prompts';
import { stripMarkdown, truncateText } from './text';
import { formatDate } from './format';


const promptPostMap = new Map();
posts.forEach((post) => {
  post.prompts.forEach((code) => {
    if (!promptPostMap.has(code)) promptPostMap.set(code, post);
  });
});

const searchIndex = [
  ...posts.map((post) => ({
    type: 'post',
    group: '文章',
    code: post.archiveCode,
    title: post.title,
    summary: post.summary,
    meta: `${post.categoryInfo.zh} · ${formatDate(post.date)}`,
    tags: post.tags,
    body: stripMarkdown(post.body),
    to: `/posts/${post.slug}`,
  })),
  ...projects.map((project) => ({
    type: 'project',
    group: '项目',
    code: project.archiveCode,
    title: project.title,
    summary: project.summary,
    meta: `${project.status} · ${project.period}`,
    tags: project.stack,
    body: stripMarkdown(project.body),
    to: `/projects/${project.slug}`,
  })),
  ...prompts
    .filter((prompt) => promptPostMap.has(prompt.code))
    .map((prompt) => {
      const post = promptPostMap.get(prompt.code);
      return {
        type: 'prompt',
        group: '提示词',
        code: prompt.code,
        title: prompt.title,
        summary: prompt.goal,
        meta: prompt.target.toUpperCase(),
        tags: [prompt.target],
        body: prompt.body,
        to: `/posts/${post.slug}#${prompt.code}`,
      };
    }),
];

const groupOrder = ['post', 'project', 'prompt'];

function scoreItem(item, query) {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const tags = item.tags.join(' ').toLowerCase();
  const body = item.body.toLowerCase();
  let score = 0;

  if (title === query) score += 16;
  if (title.startsWith(query)) score += 8;
  if (title.includes(query)) score += 6;
  if (tags.includes(query)) score += 5;
  if (summary.includes(query)) score += 4;
  if (body.includes(query)) score += 1;

  return score;
}

export function searchArchive(rawQuery) {
  const query = String(rawQuery || '').trim().toLowerCase();
  if (!query) return [];

  const matches = searchIndex
    .map((item) => ({ ...item, score: scoreItem(item, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 24);

  return groupOrder
    .map((type) => {
      const items = matches.filter((item) => item.type === type).slice(0, 5);
      if (!items.length) return null;
      return {
        type,
        label: items[0].group,
        items: items.map((item) => ({
          ...item,
          excerpt: truncateText(item.summary || item.body, 90),
        })),
      };
    })
    .filter(Boolean);
}

export function getSearchResultCount(groups) {
  return groups.reduce((total, group) => total + group.items.length, 0);
}
