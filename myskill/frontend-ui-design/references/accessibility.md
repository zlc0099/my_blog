# 可访问性要求（WCAG 2.1 AA 基线）

可访问性是交付标准，不是可选项。以下规则在所有项目中强制执行。

## 1. 颜色对比度

| 内容 | 最低对比度 |
| --- | --- |
| 正文（<24px） | 4.5:1 |
| 大字号（≥24px 或 ≥18.66px 粗体） | 3:1 |
| 非文本 UI（边框、图标、焦点环） | 3:1 |

- 检查方法：浏览器 DevTools 取色器自带对比度读数；或对 Token 逐一计算 `(L1+0.05)/(L2+0.05)`。
- 常见红线：灰字放在白底上低于 `#767676` 不合格；主色按钮上的白字需实测，`#F59E0B` 这类亮黄橙底 + 白字通常不达标（改用深色文字）。
- **颜色不能作为唯一信息载体**：错误 = 红色 + 图标 + 文字；图表 = 颜色 + 形状/图案/标签。

## 2. 焦点与键盘

- **禁止裸写 `outline: none`**。移除默认 outline 的同时必须提供替代焦点样式：

```css
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 2px; }
```

- 所有交互元素（链接、按钮、输入、开关）Tab 可达、Enter/Space 可激活。
- 逻辑顺序：DOM 顺序 = 视觉顺序，不要用 CSS order 重排交互元素。
- 弹窗打开：焦点移入第一个可聚焦元素，`Tab` 循环限制在弹窗内（focus trap），关闭后焦点还原到触发按钮。
- 快捷键若使用单字符键，需可在设置中关闭或改为仅 `修饰键 + 字符` 触发。

## 3. 语义化与 ARIA

- 优先用原生元素：`<button>` 而非 `div onclick`；`<a href>` 而非 JS 跳转；`<nav>/<main>/<header>/<footer>/<ul>` 结构化。
- 图片必须有 `alt`：装饰图 `alt=""`，功能图（如放大镜按钮内的图标）描述功能而非外观。
- 表单：`<label for>` 关联；错误用 `aria-invalid="true"` + `aria-describedby` 指向错误文案。
- 动态区域：Toast 用 `role="status"`（alert 用 `role="alert"`）；加载中 `aria-busy="true"`。
- 自定义开关/下拉必须补全角色与键盘行为（`role="switch" aria-checked` / `role="listbox"` + 方向键），否则直接用原生 `<input type="checkbox">` / `<select>`。
- 图标按钮必须 `aria-label`（如关闭 ×、汉堡菜单）。

## 4. 触控与响应

- 触控目标 ≥ 44×44px（视觉可以小于，但热区不能）；相邻目标间距 ≥ 8px。
- hover-only 信息（tooltip）在触屏上要有点击/长按替代路径。
- 输入框字体 ≥ 16px，避免 iOS 聚焦自动放大。

## 5. 其他

- 页面 `<html lang="zh-CN">`；文档 `<title>` 唯一且达意。
- 跳过导航：`<main>` 前提供"跳到主要内容"锚链接（获得焦点时可见）。
- 动效遵循 `prefers-reduced-motion`（见 motion.md 第 4 节）。
- 深浅色模式同时遵循 `prefers-color-scheme`，两套模式下都重新验证对比度。
- 缩放 200% 下不出现内容丢失或横向滚动（使用相对单位 `rem`，根字号不要锁死）。
