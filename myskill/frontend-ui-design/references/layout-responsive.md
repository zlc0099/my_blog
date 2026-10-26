# 布局与响应式设计原则

## 1. 页面骨架

```html
<body>
  <header>  <!-- 顶部导航：高度 56–64px，sticky -->
  <main>    <!-- 内容区：max-width 限制 + 水平居中 -->
  <footer>  <!-- 页脚 -->
</body>
```

### 容器宽度档位

| 场景 | max-width |
| --- | --- |
| 阅读型（文章） | 65–75ch |
| 常规页面 | 1120–1280px |
| Dashboard / 后台 | 全宽 + 侧栏 240–280px |

```css
.container { max-width: 1200px; margin-inline: auto; padding-inline: clamp(16px, 4vw, 32px); }
```

## 2. 栅格与常见布局模式

- **卡片流**：`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;` —— 不写死列数，自动响应。
- **侧栏布局**：`grid-template-columns: 260px 1fr;` 移动端折叠为顶部栏或抽屉。
- **居中窄表单**：`max-width: 480px; margin-inline: auto;`
- **图文两栏**：`grid-template-columns: minmax(0,1fr) minmax(0,1fr)` 或 `1.2fr 1fr`；移动端堆叠。
- **圣杯/页头页脚吸底**：

```css
body { min-height: 100dvh; display: flex; flex-direction: column; }
main { flex: 1; }
```

优先用 Flexbox（一维）与 Grid（二维），避免 float 与绝对定位布局。所有 `<img>`、`iframe`、`video` 设置 `max-width: 100%; height: auto;`。

## 3. 响应式断点

移动优先，只定义 3–4 个断点，用 `min-width`：

```css
/* 基础样式 = 移动端 (≥360px) */
@media (min-width: 768px)  { /* 平板 */ }
@media (min-width: 1024px) { /* 桌面 */ }
@media (min-width: 1440px) { /* 大屏（可选） */ }
```

各断点的典型变化：

| 变化点 | 移动 | 平板 | 桌面 |
| --- | --- | --- | --- |
| 导航 | 汉堡/底部 Tab | 完整导航 | 完整导航 + 更多项 |
| 卡片列数 | 1 | 2 | 3–4 |
| 侧栏 | 隐藏/抽屉 | 可见 | 可见 |
| 字号 | 基准 | +1 档 | 标题可再 +1 档 |
| 表格 | 横向滚动或卡片化 | 完整 | 完整 |

## 4. 流式与自适应技巧

- **流式字号**（少写媒体查询）：`font-size: clamp(28px, 5vw, 48px);` 用于 Hero 标题。
- **流式间距**：`padding: clamp(16px, 4vw, 32px);`
- **优先用 `gap` 而非 margin 实现元素间距**，避免首尾多余间距。
- **`aspect-ratio`** 控制图片/卡片比例（如 `aspect-ratio: 16 / 9`），防布局抖动。
- 图片加 `loading="lazy"` 与 `width/height` 属性（或 `aspect-ratio`）防止 CLS。

## 5. 响应式检查底线

- 在 360px、768px、1280px 三档宽度下目视检查：无横向滚动条、无文字截断（除非 `text-overflow: ellipsis` 有意为之）、点击目标不重叠。
- 弹窗在移动端改为底部抽屉或全屏（`inset: 0` + 圆角置顶）。
- 桌面 hover 效果在触屏设备无意义：重要操作不能只靠 hover 暴露；可用 `@media (hover: hover)` 包裹 hover 样式。
- 横屏超宽内容（表格/代码块）局部 `overflow-x: auto`，不要让整页滚动。
