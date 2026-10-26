export const skills = [
  {
    code: 'SKL-01',
    name: 'frontend-ui-design',
    title: '前端 UI 设计规范',
    category: 'FRONTEND',
    status: 'ACTIVE',
    summary:
      '把视觉风格拆成可执行的 Design Token、布局、组件与可访问性规则，避免页面各写一套颜色和圆角。',
    capabilities: ['Design Tokens', '响应式布局', '组件美化', '微动效', '可访问性'],
    compat: ['Claude Code', 'Codex', 'Cursor', 'Qoder'],
    invoke: '显式调用',
  },
  {
    code: 'SKL-02',
    name: 'fullstack-dev-workflow',
    title: '全栈开发工作流',
    category: 'FULLSTACK',
    status: 'ACTIVE',
    summary:
      '强制先澄清、再列原子任务清单，按 TDD 执行并留下证据化验收；Bug 排查走独立复现与回归流程。',
    capabilities: ['需求澄清', '原子任务清单', 'TDD 执行', '系统化排障', '交接文档'],
    compat: ['Claude Code', 'Cursor', 'Codex', 'Qoder', 'WorkBuddy'],
    invoke: '自动触发',
  },
  {
    code: 'SKL-03',
    name: 'web-test-pro',
    title: 'Web 页面测试与体检',
    category: 'QA',
    status: 'ACTIVE',
    summary:
      '在 Playwright 基础上增强页面体检：JS 异常、失败请求、可访问性、多视口截图与性能指标一次完成。',
    capabilities: ['页面体检', '多视口截图', '失败请求检测', '可访问性快检', '测试报告'],
    compat: ['Claude Code', 'Codex', 'Cursor', 'Qoder'],
    invoke: '显式调用',
  },
];
