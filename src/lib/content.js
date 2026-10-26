import { JSON_SCHEMA, load as loadYaml } from 'js-yaml';
import { categoryMap, categories } from '@/data/taxonomy';
import { milestones } from '@/data/milestones';
import { formatDate, readingTime, toTagSlug } from './format';

const postFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const projectFiles = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parseFile(raw) {
  const normalized = String(raw || '').replace(/^\uFEFF/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(normalized);
  if (!match) return { data: {}, body: normalized };
  return {
    data: loadYaml(match[1], { schema: JSON_SCHEMA }) || {},
    body: match[2],
  };
}

function fileSlug(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

function asString(value, fallback = '') {
  return value === undefined || value === null ? fallback : String(value);
}

function asArray(value) {
  return Array.isArray(value) ? value.map(String) : [];
}

const postList = Object.entries(postFiles).map(([path, raw]) => {
  const { data, body } = parseFile(raw);
  const date = asString(data.date);
  return {
    ...data,
    title: asString(data.title, '未命名档案'),
    slug: asString(data.slug, fileSlug(path)),
    date,
    updated: asString(data.updated, date),
    summary: asString(data.summary),
    category: asString(data.category, 'engineering'),
    categoryInfo: categoryMap[asString(data.category)] || {
      slug: asString(data.category, 'engineering'),
      en: 'OTHER',
      zh: '其他',
      desc: '',
    },
    tags: asArray(data.tags),
    featured: Boolean(data.featured),
    sample: Boolean(data.sample),
    project: asString(data.project),
    body,
    readingTime: readingTime(body),
    year: date.slice(0, 4),
  };
});

postList.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
postList.forEach((post, index) => {
  post.archiveCode = `ARCH-${String(index + 1).padStart(3, '0')}`;
});
postList.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

const projectList = Object.entries(projectFiles).map(([path, raw]) => {
  const { data, body } = parseFile(raw);
  const date = asString(data.date);
  return {
    ...data,
    title: asString(data.title, '未命名项目'),
    slug: asString(data.slug, fileSlug(path)),
    date,
    period: asString(data.period, date.slice(0, 7).replace('-', '.')),
    status: asString(data.status, '进行中'),
    summary: asString(data.summary),
    stack: asArray(data.stack),
    related: asArray(data.related),
    repo: asString(data.repo),
    demo: asString(data.demo),
    featured: Boolean(data.featured),
    body,
    year: date.slice(0, 4),
  };
});

projectList.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
projectList.forEach((project, index) => {
  project.archiveCode = `OPS-${String(index + 1).padStart(3, '0')}`;
});
projectList.sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));

export const posts = postList;
export const projects = projectList;

export const categoriesWithCount = categories.map((category) => ({
  ...category,
  count: posts.filter((post) => post.category === category.slug).length,
}));

const tagMap = new Map();
posts.forEach((post) => {
  post.tags.forEach((tag) => {
    const slug = toTagSlug(tag);
    const current = tagMap.get(slug) || { slug, name: tag, count: 0 };
    current.count += 1;
    tagMap.set(slug, current);
  });
});

export const tags = [...tagMap.values()].sort(
  (a, b) => b.count - a.count || a.name.localeCompare(b.name),
);

export const latestUpdate = [...posts.map((post) => post.updated), ...projects.map((project) => project.date)]
  .filter(Boolean)
  .sort()
  .at(-1);

export const archiveStats = {
  postCount: posts.length,
  projectCount: projects.length,
  categoryCount: categoriesWithCount.filter((category) => category.count > 0).length,
  tagCount: tags.length,
  latestUpdate,
};

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) || null;
}

export function getPostsByTag(slug) {
  return posts.filter((post) => post.tags.some((tag) => toTagSlug(tag) === slug));
}

export function getAdjacentPosts(post) {
  const index = posts.findIndex((item) => item.slug === post.slug);
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getRelatedPosts(post, limit = 3) {
  return posts
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      const sharedTags = item.tags.filter((tag) => post.tags.includes(tag)).length;
      const score = sharedTags * 2 + (item.category === post.category ? 1 : 0);
      return { post: item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post);
}

export function getPostsForProject(project) {
  const explicit = project.related
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean);
  const attached = posts.filter((post) => post.project === project.slug);
  return [...new Map([...explicit, ...attached].map((post) => [post.slug, post])).values()];
}

export function getRecentUpdates(limit = 6) {
  return posts
    .map((post) => ({
      date: post.updated || post.date,
      title: post.title,
      summary: post.summary,
      to: `/posts/${post.slug}`,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getTimelineEntries() {
  const postEntries = posts.map((post) => ({
    type: 'post',
    code: post.archiveCode,
    date: post.date,
    title: post.title,
    summary: post.summary,
    meta: post.categoryInfo.zh,
    to: `/posts/${post.slug}`,
  }));

  const projectEntries = projects.map((project) => ({
    type: 'project',
    code: project.archiveCode,
    date: project.date,
    title: project.title,
    summary: project.summary,
    meta: project.status,
    to: `/projects/${project.slug}`,
  }));

  const milestoneEntries = milestones.map((milestone) => ({
    type: 'milestone',
    code: milestone.code,
    date: milestone.date,
    title: milestone.title,
    summary: milestone.desc,
    meta: 'MILESTONE',
    to: '',
  }));

  return [...postEntries, ...projectEntries, ...milestoneEntries].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getLatestEntryLabel() {
  const latest = posts[0];
  if (!latest) return 'NO ENTRIES';
  return `${latest.archiveCode} / ${formatDate(latest.date)}`;
}
