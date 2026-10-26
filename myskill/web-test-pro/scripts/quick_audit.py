#!/usr/bin/env python3
"""
Quick Audit — 一键页面体检。无需写测试代码，对一个 URL 做全面的健康检查。

检查项：
  1. 未捕获 JS 异常（pageerror）
  2. console 错误与警告（分级统计）
  3. 失败的网络请求（requestfailed，含 DNS/超时/CORS）
  4. HTTP 响应状态 >= 400
  5. 基础可访问性：img 缺 alt、表单控件缺 label、缺 <html lang>、
     按钮/链接无可访问名称
  6. 响应式：多视口截图 + 横向滚动检测（scrollWidth > clientWidth）
  7. 性能：DOM 加载完成 / 页面完全加载耗时（navigation timing）

输出：JSON 结果 + Markdown 报告 + 各视口截图，写入 --out 目录。
退出码：0 = 无 error 级问题；1 = 存在 JS 异常 / console error / HTTP 错误，
可用于 CI 判定。

用法：
    python scripts/quick_audit.py http://localhost:5173
    python scripts/quick_audit.py http://localhost:5173 --out ./audit-result
    python scripts/quick_audit.py https://example.com --viewports 375,768,1440 --timeout 45
建议配合 with_server.py 使用，自动管理服务器生命周期。
"""

import argparse
import json
import sys
import time
from datetime import datetime
from pathlib import Path

A11Y_SNIPPET = """
() => {
  const issues = [];
  const push = (el, issue) => {
    let sel = el.tagName.toLowerCase();
    if (el.id) sel += '#' + el.id;
    else if (el.className && typeof el.className === 'string')
      sel += '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.');
    issues.push({ selector: sel, issue });
  };
  document.querySelectorAll('img').forEach(el => {
    if (!el.hasAttribute('alt')) push(el, '图片缺少 alt 属性');
  });
  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.type === 'hidden') return;
    const hasLabel = (el.id && document.querySelector('label[for="' + el.id + '"]'))
      || el.closest('label')
      || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (!hasLabel) push(el, '表单控件缺少关联 label');
  });
  if (!document.documentElement.getAttribute('lang'))
    push(document.documentElement, '<html> 缺少 lang 属性');
  document.querySelectorAll('button, a[href], [role="button"]').forEach(el => {
    const named = (el.innerText || '').trim()
      || el.getAttribute('aria-label') || el.getAttribute('title')
      || (el.querySelector('img[alt]') || {}).alt;
    if (!named) push(el, '可点击元素无可访问名称');
  });
  return issues;
}
"""

HSCROLL_SNIPPET = """() => document.documentElement.scrollWidth
      - document.documentElement.clientWidth"""

PERF_SNIPPET = """() => {
  const t = performance.getEntriesByType('navigation')[0];
  return t ? {
    domContentLoaded: Math.round(t.domContentLoadedEventEnd),
    load: Math.round(t.loadEventEnd),
    transferKB: Math.round((t.transferSize || 0) / 1024),
  } : null;
}"""


def new_recorders():
    return {"console": [], "pageerrors": [], "reqfailed": [], "badresp": []}


def attach(page, rec):
    page.on("console", lambda m: rec["console"].append(
        {"type": m.type, "text": m.text[:500]}) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: rec["pageerrors"].append(str(e)[:500]))
    page.on("requestfailed", lambda r: rec["reqfailed"].append(
        {"url": r.url[:300], "failure": r.failure}))
    page.on("response", lambda r: rec["badresp"].append(
        {"url": r.url[:300], "status": r.status}) if r.status >= 400 else None)


def main():
    ap = argparse.ArgumentParser(description="一键页面体检（Quick Audit）")
    ap.add_argument("url", help="要体检的页面 URL")
    ap.add_argument("--out", default="./audit-result", help="报告与截图输出目录")
    ap.add_argument("--viewports", default="360,768,1280",
                    help="逗号分隔的视口宽度（默认 360,768,1280，高度按 800 计）")
    ap.add_argument("--timeout", type=int, default=30, help="页面加载超时秒数")
    ap.add_argument("--headed", action="store_true", help="有头模式运行（调试用）")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    viewports = []
    for w in args.viewports.split(","):
        w = int(w.strip())
        viewports.append((f"{w}px", w, 800))

    from playwright.sync_api import sync_playwright

    result = {
        "url": args.url,
        "time": datetime.now().isoformat(timespec="seconds"),
        "viewports": {},
        "console": [], "pageerrors": [], "requestfailed": [], "http_errors": [],
        "a11y_issues": [], "perf": None,
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not args.headed)
        for name, w, h in viewports:
            page = browser.new_page(viewport={"width": w, "height": h})
            rec = new_recorders()
            attach(page, rec)
            t0 = time.time()
            page.goto(args.url, wait_until="networkidle", timeout=args.timeout * 1000)
            wait_ms = int((time.time() - t0) * 1000)

            vp = {"horizontal_scroll": page.evaluate(HSCROLL_SNIPPET) > 1,
                  "load_wait_ms": wait_ms}
            shot = out / f"viewport-{w}.png"
            page.screenshot(path=str(shot), full_page=True)
            vp["screenshot"] = str(shot)

            if name == viewports[-1][0] or w == max(v[1] for v in viewports):
                # 主视口（最大宽度）收集详细数据，避免重复记录
                result["console"] = rec["console"]
                result["pageerrors"] = rec["pageerrors"]
                result["requestfailed"] = rec["reqfailed"]
                result["http_errors"] = rec["badresp"]
                result["a11y_issues"] = page.evaluate(A11Y_SNIPPET)
                result["perf"] = page.evaluate(PERF_SNIPPET)
            result["viewports"][name] = vp
            page.close()
        browser.close()

    # ---- 判定 ----
    errors = []
    if result["pageerrors"]:
        errors.append(f"存在 {len(result['pageerrors'])} 个未捕获 JS 异常")
    n_ce = sum(1 for c in result["console"] if c["type"] == "error")
    if n_ce:
        errors.append(f"存在 {n_ce} 条 console.error")
    if result["http_errors"]:
        errors.append(f"存在 {len(result['http_errors'])} 个 HTTP >=400 响应")
    if result["requestfailed"]:
        errors.append(f"存在 {len(result['requestfailed'])} 个失败网络请求")
    result["pass"] = not errors
    result["errors_summary"] = errors

    # ---- 输出 ----
    (out / "audit.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    md = [f"# 页面体检报告 — {args.url}", "", f"- 时间：{result['time']}",
          f"- 结论：**{'✅ 通过' if result['pass'] else '❌ 未通过'}**", ""]
    if errors:
        md.append("## 阻断问题")
        md += [f"- {e}" for e in errors] + [""]
    md.append("## 响应式检查")
    md.append("| 视口 | 横向滚动 | 截图 |")
    md.append("| --- | --- | --- |")
    for name, vp in result["viewports"].items():
        md.append(f"| {name} | {'❌ 有（内容溢出）' if vp['horizontal_scroll'] else '✅ 无'} | `{Path(vp['screenshot']).name}` |")
    if result["perf"]:
        md += ["", "## 性能（主视口）",
               f"- DOM 加载完成：{result['perf']['domContentLoaded']} ms",
               f"- 页面完全加载：{result['perf']['load']} ms",
               f"- 主文档传输：{result['perf']['transferKB']} KB"]
    if result["a11y_issues"]:
        md += ["", f"## 可访问性问题（{len(result['a11y_issues'])}）"]
        md += [f"- `{i['selector']}` — {i['issue']}" for i in result["a11y_issues"][:30]]
    if result["pageerrors"]:
        md += ["", "## JS 异常详情"]
        md += [f"- {e}" for e in result["pageerrors"][:20]]
    if result["http_errors"] or result["requestfailed"]:
        md += ["", "## 网络问题详情"]
        md += [f"- [{r['status']}] {r['url']}" for r in result["http_errors"][:20]]
        md += [f"- [失败] {r['url']}（{r['failure']}）" for r in result["requestfailed"][:20]]
    if result["console"]:
        md += ["", "## Console（error/warning）"]
        md += [f"- [{c['type']}] {c['text']}" for c in result["console"][:30]]
    report = out / "report.md"
    report.write_text("\n".join(md), encoding="utf-8")

    print(json.dumps({"pass": result["pass"], "report": str(report),
                      "json": str(out / "audit.json"), "errors": errors},
                     ensure_ascii=False, indent=2))
    sys.exit(0 if result["pass"] else 1)


if __name__ == "__main__":
    main()
