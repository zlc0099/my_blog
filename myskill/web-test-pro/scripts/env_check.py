#!/usr/bin/env python3
"""
环境自检 — 检查 Python / Playwright / 浏览器是否就绪，失败时给出精确安装命令。

用法：
    python scripts/env_check.py
退出码：0 = 环境就绪；1 = 存在缺失项（按输出提示安装后重跑）。
"""

import subprocess
import sys


def main():
    ok = True

    # 1. Python 版本
    v = sys.version_info
    print(f"[1/3] Python {v.major}.{v.minor}.{v.micro}")
    if v < (3, 9):
        print("  ❌ 需要 Python >= 3.9")
        ok = False

    # 2. Playwright 包
    try:
        import playwright  # noqa: F401
        from playwright.sync_api import sync_playwright  # noqa: F401
        print("[2/3] Playwright 包 ✅")
    except ImportError:
        print("[2/3] Playwright 包 ❌ 未安装")
        print("  修复：pip install playwright")
        ok = False
        print("\n结论：环境未就绪（先安装 playwright 包，再装浏览器）")
        sys.exit(1)

    # 3. Chromium 可启动
    print("[3/3] Chromium 启动测试…")
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            b.close()
        print("  ✅ Chromium 正常")
    except Exception as e:
        print("  ❌ Chromium 不可用")
        print(f"  原因摘要：{str(e)[:200]}")
        print("  修复：python -m playwright install chromium")
        ok = False

    print("\n结论：" + ("环境就绪 ✅" if ok else "环境未就绪 ❌（按上方提示修复后重跑）"))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
