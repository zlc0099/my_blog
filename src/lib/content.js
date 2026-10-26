import { categoryMap, categories } from '@/data/taxonomy';
import { readingTime, toTagSlug } from './format';
import { fileSlug, parseFrontmatter } from './frontmatter';

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

function asString(value, fallback = '') {
  return value === undefined || value === null ? fallback : String(value);
}

function asArray(value) {
  return Array.isArray(value) ? value.map(String) : [];
}

const postList = Object.entries(postFiles).map(([path, raw]) => {
  const { data, body } = parseFrontmatter(raw);
  const date = asString(data.date);
  return {
    ...data,
    title: asString(data.title, '未命名档案'),
    slug: asString(data.slug, fileSlug(path)),
    date,
    updated: asString(data.updated, date),
    summary: asString(data.summary),
    category: asString(data.category, 'notes'),
    categoryInfo: categoryMap[asString(data.category)] || {
      slug: asString(data.category, 'notes'),
      en: 'OTHER',
      zh: '其他',
      desc: '',
    },
    tags: asArray(data.tags),
    prompts: asArray(data.prompts),
    featured: Boolean(data.featured),
    sample: Boolean(data.sample),
    project: asString(data.project),
    skillType: asString(data.skillType),
    repoPath: asString(data.repoPath),
    coverStyle: asString(data.coverStyle),
    coverNote: asString(data.coverNote),
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
  const { data, body } = parseFrontmatter(raw);
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
