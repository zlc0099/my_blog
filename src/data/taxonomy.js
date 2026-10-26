export const categories = [
  {
    slug: 'backend',
    en: 'BACKEND',
    zh: '后端开发',
    desc: 'Java · Spring Boot · 接口与架构',
  },
  {
    slug: 'frontend',
    en: 'FRONTEND',
    zh: '前端开发',
    desc: 'Vue 3 · 交互 · 设计系统',
  },
  {
    slug: 'database',
    en: 'DATABASE',
    zh: '数据库',
    desc: 'MySQL · Redis · 查询优化',
  },
  {
    slug: 'engineering',
    en: 'ENGINEERING',
    zh: '工程实践',
    desc: '调试 · 复盘 · 工程质量',
  },
  {
    slug: 'ai-tools',
    en: 'AI & TOOLS',
    zh: 'AI 与工具',
    desc: 'Claude Code · Trae · Qoder',
  },
];

export const categoryMap = Object.fromEntries(categories.map((item) => [item.slug, item]));

export const agentTypes = {
  feature: '功能实现',
  refactor: '重构',
  debug: '排查',
  review: '复核',
  doc: '整理',
};

export const promptTargets = [
  { id: 'all', label: 'ALL' },
  { id: 'fullstack', label: 'FULLSTACK' },
  { id: 'backend', label: 'BACKEND' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'debug', label: 'DEBUG' },
  { id: 'agent', label: 'AGENT' },
];
