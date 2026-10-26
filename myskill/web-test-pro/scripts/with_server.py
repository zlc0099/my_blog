#!/usr/bin/env python3
"""
Start one or more servers, wait for them to be ready, run a command, then clean up.

增强点（相对原版 webapp-testing/with_server.py）：
  1. 支持 --health-url：除端口探测外，可对指定 URL 做 HTTP 探测
     （端口通但服务未就绪的场景，如 dev server 早期绑定端口）
  2. 服务器输出重定向到日志文件（避免 PIPE 缓冲塞满导致子进程阻塞）
  3. 所有服务器并行启动（原版串行等待，多服务时更慢）

用法：
    # 单服务
    python scripts/with_server.py --server "npm run dev" --port 5173 -- python test.py

    # 前后端分离 + HTTP 健康检查
    python scripts/with_server.py \
      --server "python backend/server.py" --port 3000 \
      --server "npm run dev" --port 5173 --health-url http://localhost:5173 \
      -- python test.py
"""

import argparse
import subprocess
import socket
import sys
import time
import urllib.request
from pathlib import Path


def port_ready(port, timeout_s=30):
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False


def url_ready(url, timeout_s=30):
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if resp.status < 500:
                    return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def main():
    ap = argparse.ArgumentParser(description="Run command with managed server(s)")
    ap.add_argument("--server", action="append", dest="servers", required=True,
                    help="服务器启动命令（可重复）")
    ap.add_argument("--port", action="append", dest="ports", type=int, required=True,
                    help="每个服务的端口（数量需与 --server 一致）")
    ap.add_argument("--health-url", action="append", dest="health_urls", default=[],
                    help="可选：HTTP 健康检查 URL（可重复，少于服务数时仅对前 N 个生效）")
    ap.add_argument("--timeout", type=int, default=30, help="每个服务就绪超时秒数")
    ap.add_argument("--log-dir", default=None, help="服务器日志目录（默认临时目录）")
    ap.add_argument("command", nargs=argparse.REMAINDER, help="-- 之后的被测命令")
    args = ap.parse_args()

    if args.command and args.command[0] == "--":
        args.command = args.command[1:]
    if not args.command:
        print("Error: no command after --")
        sys.exit(1)
    if len(args.servers) != len(args.ports):
        print("Error: --server 与 --port 数量不一致")
        sys.exit(1)

    log_dir = Path(args.log_dir) if args.log_dir else Path.cwd()
    procs = []
    try:
        for i, (cmd, port) in enumerate(zip(args.servers, args.ports)):
            print(f"Starting server {i + 1}/{len(args.servers)}: {cmd}")
            log = log_dir / f"server-{i + 1}.log"
            with open(log, "w", encoding="utf-8") as lf:
                procs.append(subprocess.Popen(
                    cmd, shell=True, stdout=lf, stderr=subprocess.STDOUT))
            if not port_ready(port, args.timeout):
                raise RuntimeError(f"端口 {port} 在 {args.timeout}s 内未就绪"
                                   f"（日志：{log}）")
            health = (args.health_urls[i] if i < len(args.health_urls) else None)
            if health:
                if not url_ready(health, args.timeout):
                    raise RuntimeError(f"健康检查 {health} 未通过（日志：{log}）")
                print(f"  port {port} ready + health OK: {health}")
            else:
                print(f"  port {port} ready (log: {log})")

        print(f"\nAll {len(args.servers)} server(s) ready. Running: "
              f"{' '.join(args.command)}\n")
        rc = subprocess.run(args.command).returncode
        sys.exit(rc)
    finally:
        print(f"\nStopping {len(procs)} server(s)...")
        for i, proc in enumerate(procs):
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except Exception:
                proc.kill()
            print(f"  server {i + 1} stopped")


if __name__ == "__main__":
    main()
