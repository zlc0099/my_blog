export const categories = [
  {
    slug: 'notes',
    en: 'LEARNING LOG',
    zh: '学习记录',
    desc: '平时学到的、踩过的坑和复盘。',
  },
  {
    slug: 'skill',
    en: 'SKILL',
    zh: 'Skill',
    desc: '本地技能与 Agent 工作流。',
  },
  {
    slug: 'frontend-prompts',
    en: 'FRONTEND PROMPTS',
    zh: '前端提示词',
    desc: '页面、交互和设计系统相关提示词。',
  },
  {
    slug: 'backend-prompts',
    en: 'BACKEND PROMPTS',
    zh: '后端提示词',
    desc: '接口、业务和数据相关提示词。',
  },
  {
    slug: 'ai-division',
    en: 'AI DIVISION',
    zh: 'AI 分工',
    desc: 'Claude Code / Qoder / Trae 的使用分工。',
  },
];

export const categoryMap = Object.fromEntries(categories.map((item) => [item.slug, item]));

export const agentTypes = {
  session: '会话',
  feature: '功能实现',
  refactor: '重构',
  debug: '排查',
  review: '复核',
  doc: '整理',
};
