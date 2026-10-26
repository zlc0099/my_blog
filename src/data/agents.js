export const agents = [
  {
    id: 'claude-code',
    code: 'AGT-01',
    name: 'Claude Code',
    mode: 'CLI',
    role: '深度重构 / 长上下文分析',
    summary: '终端内完成跨文件重构、方案复核和证据化排障，适合需要完整上下文的改动。',
  },
  {
    id: 'qoder',
    code: 'AGT-02',
    name: 'Qoder',
    mode: 'IDE',
    role: '全栈实现 / 仓库级任务',
    summary: '在工作区内联动前后端改动，适合从需求拆解到页面、接口一起落地。',
  },
  {
    id: 'trae',
    code: 'AGT-03',
    name: 'Trae',
    mode: 'IDE',
    role: '前端迭代 / 快速原型',
    summary: '用于界面微调、样式试验和快速验证，把视觉想法先跑成可看的页面。',
  },
];

export const agentMap = Object.fromEntries(agents.map((agent) => [agent.id, agent]));
