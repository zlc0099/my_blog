# 组件美化最佳实践

所有组件统一从 `assets/design-tokens.css` 取值。以下给出通用规则与可直接套用的示例。

## 1. 按钮（Button）

四态齐全：`hover / active / focus-visible / disabled`。层级：**Primary 每屏最多 1 个**，其余用 Secondary 或 Ghost。

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  height: 40px; padding: 0 20px;           /* 触控区不足时用 min-height: 44px */
  font: 500 var(--text-sm)/1 var(--font-sans);
  border: 1px solid transparent; border-radius: var(--radius-md);
  cursor: pointer; user-select: none;
  transition: background-color var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease),
              transform var(--duration-fast) var(--ease);
}
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover { background: var(--color-primary-hover); box-shadow: var(--shadow-sm); }
.btn--primary:active { background: var(--color-primary-active); transform: translateY(1px); }
.btn--secondary { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text); }
.btn--secondary:hover { background: var(--color-gray-100); }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

尺寸：sm 32px / md 40px / lg 48px。图标按钮最小 40×40px。禁用态除降透明度外，保留语义（`aria-disabled` 或 `disabled` 属性）。

## 2. 输入框（Input / Select / Textarea）

```css
.field { display: grid; gap: 8px; }
.field label { font-size: var(--text-sm); font-weight: 500; color: var(--color-text); }
.field input {
  height: 40px; padding: 0 12px;
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  background: var(--color-surface); color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}
.field input:hover { border-color: var(--color-gray-400); }
.field input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); outline: none; }
.field input:disabled { background: var(--color-gray-100); cursor: not-allowed; }
.field--error input { border-color: var(--color-danger); }
.field .hint { font-size: var(--text-xs); color: var(--color-text-secondary); }
.field .error-msg { font-size: var(--text-xs); color: var(--color-danger); }
```

规则：

- label 必须用 `<label for>` 关联；错误信息用 `aria-describedby` 关联到输入框，并设 `aria-invalid="true"`。
- 错误提示放在输入框下方，同时用颜色 + 图标/文字表达（不能只变红）。
- 占位符不是 label：placeholder 为浅灰且可在获得焦点后仍可读的辅助信息。
- 校验时机：失焦时校验，输入中不报错（避免打扰）。

## 3. 卡片（Card）

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: box-shadow var(--duration-base) var(--ease), transform var(--duration-base) var(--ease);
}
.card--interactive:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.card--interactive { cursor: pointer; }
```

- 卡片三要素：标题（`--text-lg`，600）、描述（`--text-sm`，次级色）、操作区。整体可点时包一层 `<a>` 或在标题内放真实链接。
- 卡片内层级用"间距 + 字重"区分，不加第二条分割线；确需分割用 `border-top: 1px solid var(--color-border-light)`。
- 列表卡片统一高度策略：内容对齐用 flex/grid，不要硬编码高度。

## 4. 导航（Nav）

顶部导航：高 56–64px、`backdrop-filter: blur(8px)` + 半透明背景营造现代感、sticky 置顶。

```css
.nav { position: sticky; top: 0; z-index: 100;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(8px); border-bottom: 1px solid var(--color-border-light); }
.nav a { padding: 8px 12px; border-radius: var(--radius-sm); color: var(--color-text-secondary); }
.nav a[aria-current="page"] { color: var(--color-primary); background: var(--color-primary-light); font-weight: 600; }
```

- 当前页高亮必须明显（颜色 + 背景/下划线二选一），用 `aria-current="page"` 标记。
- 移动端：≤3 个入口用底部 Tab Bar；更多用汉堡 + 抽屉（带遮罩、ESC 可关）。
- 侧栏导航：项高 36–40px，图标 + 文字，选中态用浅色底 + 主色文字/左侧 2px 指示条。

## 5. 表格

- 表头：`--text-xs`、次级色、600 字重、大写（英文场景）+ 底部 1px 边框。
- 行 hover：`background: var(--color-gray-50)`；斑马纹可选但与 hover 二选一。
- 数字列右对齐 + `font-variant-numeric: tabular-nums`。
- 移动端：列数 >4 时改为"卡片化"（每行变一张卡片）或横向滚动容器。

## 6. 弹层（Modal / Drawer / Toast）

```css
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: grid; place-items: center; z-index: 1000; }
.modal { background: var(--color-surface); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); max-width: 480px; width: calc(100% - 32px); padding: 24px; }
```

- 必须可 ESC 关闭、点遮罩关闭（破坏性确认除外）；打开时锁定 body 滚动、焦点移入弹窗（见 accessibility.md）。
- Toast：右上角（移动端顶部居中），3–4 秒自动消失，带语义色左侧条，`role="status"`。

## 7. 标签 / 徽章（Badge / Tag）

浅色底 + 深色字的"浅色派"更现代：`background: var(--color-primary-light); color: var(--color-primary-text);`。语义色徽章（成功/警告/危险）同样遵循该模式，高度 20–24px、全圆角。

## 8. 空状态 / 加载 / 错误

- 空状态 = 插画或图标 + 一句话说明 + 行动按钮（如"上传第一个文件"）。
- 加载优先用骨架屏（灰色块 + shimmer 动画，见 motion.md），按钮内加载用 spinner + 禁用 + 文案"提交中…"。
- 错误页给"发生了什么 + 用户能做什么 + 重试按钮"。
