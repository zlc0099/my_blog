# 交互动效与微动效

## 1. 基础参数

```css
--duration-fast: 150ms;   /* hover、active、色彩过渡 */
--duration-base: 240ms;   /* 展开/收起、元素进出 */
--duration-slow: 360ms;   /* 弹窗、抽屉、页面级切换 */
--ease: cubic-bezier(0.4, 0, 0.2, 1);        /* 标准：进出通用 */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* 入场：快起缓停 */
```

- 超过 500ms 的 UI 动效一律视为过慢；小于 100ms 则用户感知不到，不如不做。
- **只对 `transform` 与 `opacity` 做过渡**；`width/height/top/left` 会触发重排，禁用（必要时用 `transform: scaleX()` 或 Grid `grid-template-rows: 0fr → 1fr` 代替高度动画）。
- 列表级联入场用 `transition-delay: calc(var(--i) * 40ms)`，总时长仍 ≤ 400ms，级联项 ≤ 8 个。

## 2. 各场景动效规范

| 场景 | 动效 | 参数 |
| --- | --- | --- |
| 按钮 hover | 背景色变化（+可选 `translateY(-1px)` 或阴影升级） | fast |
| 按钮 active | `translateY(1px)` 按压感 | 80–100ms |
| 卡片 hover | `translateY(-2px)` + 阴影 md | base |
| 弹窗入场 | overlay 淡入 + 面板 `scale(0.96→1)` + 淡入 | slow, ease-out |
| 抽屉 | `translateX(100% → 0)` | base–slow, ease-out |
| Toast | 底部/顶部滑入 + 淡入；离场直接淡出 | base |
| 下拉菜单 | `scale(0.98→1)` + 淡入，`transform-origin` 对准触发方向 | fast, ease-out |
| 折叠面板 | `grid-template-rows: 0fr → 1fr` + overflow hidden | base |
| 点赞/收藏 | `scale(1 → 1.3 → 1)` 弹一下 + 颜色变化 | 300ms, ease-out |
| 复制成功 | 图标短暂替换为 ✓ 后还原 | 1.5s 停留 |
| Tab 切换 | 指示条 `transform: translateX()` 滑动 | fast |

微动效用于**反馈与引导**，不用于装饰；同一界面同时进行的动效不超过 2–3 处。

## 3. 骨架屏（Skeleton）

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--color-gray-100) 25%, var(--color-gray-200) 37%, var(--color-gray-100) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
```

- 骨架块布局尽量与真实内容一致（标题条 + 文本条 ×2 + 图片块），减少加载完成后的跳动。
- 预期加载 > 300ms 才显示骨架；快速响应直接渲染，避免闪烁。

## 4. 无障碍降级（必须实现）

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 5. 滚动与页面切换

- 平滑滚动：`html { scroll-behavior: smooth; }`（锚点跳转；reduced-motion 下自动失效）。
- 视差、滚动驱动的大动画慎用；如使用必须 `will-change: transform` 限定层数，且移动端禁用。
- 入场动效（滚动到视口内 fade-up）用 `IntersectionObserver` 一次性触发，元素 `opacity: 0 → 1; translateY(16px → 0)`，单元素 ≤ 300ms。
