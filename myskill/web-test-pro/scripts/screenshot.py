#!/usr/bin/env python3
"""
多视口截图工具 — 对一个 URL 在多个视口宽度下截图，可选整页截图。

用法：
    python scripts/screenshot.py http://localhost:5173 --out ./shots
    python scripts/screenshot.py http://localhost:5173 --widths 360,768,1280 --full-page
    python scripts/screenshot.py http://localhost:5173 --widths 1920 --name hero
输出：./shots/<宽度>[<name>].png
"""

import argparse
from pathlib import Path


def main():
    ap = argparse.ArgumentParser(description="多视口截图工具")
    ap.add_argument("url", help="目标 URL")
    ap.add_argument("--out", default="./screenshots", help="输出目录")
    ap.add_argument("--widths", default="360,768,1280",
                    help="逗号分隔的视口宽度（默认 360,768,1280）")
    ap.add_argument("--height", type=int, default=800, help="视口高度")
    ap.add_argument("--full-page", action="store_true", help="整页截图")
    ap.add_argument("--name", default="", help="文件名附加标识")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    from playwright.sync_api import sync_playwright

    saved = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for w in [int(x.strip()) for x in args.widths.split(",")]:
            page = browser.new_page(viewport={"width": w, "height": args.height})
            page.goto(args.url, wait_until="networkidle", timeout=30000)
            suffix = f"-{args.name}" if args.name else ""
            path = out / f"{w}{suffix}.png"
            page.screenshot(path=str(path), full_page=args.full_page)
            saved.append(str(path))
            page.close()
        browser.close()

    for s in saved:
        print(s)


if __name__ == "__main__":
    main()
