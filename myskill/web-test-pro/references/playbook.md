# 测试场景手册（Playbook）

定向编写 Playwright 测试脚本时，按本手册选择场景与判定标准。

## 0. 通用脚本骨架（必须遵守）

每个测试脚本必须输出**结构化结果汇总**并以退出码表达成败，供 CI 与上层 Agent 判定：

```python
import sys, json
from playwright.sync_api import sync_playwright

results = []  # [{name, pass, detail}]

def check(name, condition, detail=""):
    results.append({"name": name, "pass": bool(condition), "detail": detail})

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:5173", wait_until="networkidle")
    # ... check() 各项
    browser.close()

passed = sum(r["pass"] for r in results)
print(json.dumps({"passed": passed, "total": len(results),
                  "failed": [r for r in results if not r["pass"]]},
                 ensure_ascii=False, indent=2))
sys.exit(0 if passed == len(results) else 1)
```

规则：

- 动态页面先 `wait_for_load_state("networkidle")` 再查 DOM。
- 优先用语义选择器 `page.get_by_role("button", name="提交")`，其次 `get_by_label` / `get_by_text`，最后才是 CSS；禁止依赖生成式 class 名（如 `.css-1x2abc`）。
- 等待元素用 `expect`-style 轮询（`page.wait_for_selector`）而非固定 `wait_for_timeout`；确需等待动画完成时才用短超时。
- 每个用例独立：一个 `check` 失败不阻断后续检查（除非是前置条件）。

## 1. 功能交互测试

| 场景 | 操作 | 判定 |
| --- | --- | --- |
| 导航可达 | 点击每个导航项 | URL 变化 + 目标区块出现 |
| 表单提交 | 填写 → 提交 | 成功提示出现 / URL 跳转 / 列表新增记录 |
| 表单校验 | 空值/非法格式提交 | 错误提示可见，且**未**发出提交请求 |
| 搜索/筛选 | 输入关键词 | 结果数量或内容变化 |
| 分页/加载更多 | 点击下一页 | 新内容出现且旧内容保留 |
| 弹窗 | 打开 → ESC → 点遮罩 | 均可关闭，关闭后页面可交互 |
| 删除确认 | 点删除 → 确认 | 记录消失；有撤销则提示出现 |

示例（表单校验）：

```python
page.get_by_role("button", name="提交").click()
err = page.get_by_text("请输入邮箱")
check("空邮箱校验提示", err.is_visible())
check("校验时不发请求", page.evaluate("window.__submitCalled !== true"))
```

## 2. 响应式测试

- 用 `scripts/screenshot.py` 在 360 / 768 / 1280 截图，目视 + 程序双检。
- 程序判定横向溢出：

```python
overflow = page.evaluate(
    "document.documentElement.scrollWidth - document.documentElement.clientWidth")
check("无横向滚动", overflow <= 1, f"溢出 {overflow}px")
```

- 菜单在移动视口可打开且可关闭；触控目标 ≥ 44px（`locator.bounding_box()` 检查宽高）。
- 检查 360px 下文本不与兄弟元素重叠（抽查关键元素 `bounding_box()` 相交判断，可选）。

## 3. 可访问性快检

- `quick_audit.py` 已覆盖：img alt、label 关联、lang、可访问名称。
- 手工补充：Tab 键前 10 次都能落在可见元素上：

```python
from playwright.sync_api import expect
for i in range(10):
    page.keyboard.press("Tab")
    focused = page.evaluate("document.activeElement?.tagName")
    check(f"Tab#{i+1} 焦点可达", focused not in (None, "BODY"))
```

## 4. 性能快检阈值

| 指标 | 阈值（警告） | 采集 |
| --- | --- | --- |
| DOM 加载完成 | ≤ 2000ms | `performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd` |
| 完全加载 | ≤ 4000ms | `loadEventEnd` |
| console.error | = 0 | 监听 console |
| 未捕获 JS 异常 | = 0 | 监听 pageerror |
| 失败请求 | = 0 | 监听 requestfailed |

以上全部由 `scripts/quick_audit.py` 自动采集，性能专项无需重写。

## 5. 错误预算与验收标准

默认验收线（可按项目放宽，但须在报告中注明）：

- ❌ 阻断（exit 1）：未捕获 JS 异常、console.error、HTTP ≥400、页面无法打开、核心流程走不通
- ⚠️ 警告（报告标注）：console.warning、a11y 缺失、移动端触控目标 < 44px、加载 > 4s
- ✅ 通过：全部核心 check 通过且无阻断项

## 6. 常见坑

- SPA 路由跳转后 `networkidle` 可能永不触发（长轮询/WebSocket）：改用 `wait_for_selector` 等目标元素。
- Dev server 首次编译慢：`with_server.py --timeout 120`。
- 有 Cloudflare/登录墙的站点：先在脚本中处理登录（保存 `storage_state` 复用），再做测试。
- Windows 下路径一律用 `pathlib.Path`，不要硬编码 `/mnt/...` 或反斜杠。
