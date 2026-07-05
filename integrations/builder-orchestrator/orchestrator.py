#!/usr/bin/env python3
"""
Medina Builder Orchestrator
Python writes files, runs npm/shell commands, reports JSON lines to stdout.
Usage: python orchestrator.py < build.json
  or:  echo '{"action":"build",...}' | python orchestrator.py
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path


def emit(obj: dict) -> None:
    print(json.dumps(obj), flush=True)


def write_files(project_dir: Path, files: list[dict]) -> list[str]:
    written = []
    for f in files:
        rel = f["path"].replace("\\", "/")
        full = project_dir / rel
        full.parent.mkdir(parents=True, exist_ok=True)
        full.write_text(f.get("content", ""), encoding="utf-8")
        written.append(rel)
    return written


def run_cmd(cmd: str, cwd: Path, shell: str = "auto") -> dict:
    emit({"type": "cmd", "command": cmd, "cwd": str(cwd)})
    if shell == "auto":
        shell = "powershell" if os.name == "nt" else "bash"

    if shell == "powershell":
        proc = subprocess.Popen(
            ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd],
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    elif shell == "wsl":
        proc = subprocess.Popen(
            ["wsl.exe", "bash", "-lc", cmd],
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    else:
        proc = subprocess.Popen(
            cmd,
            cwd=str(cwd),
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )

    out_lines = []
    if proc.stdout:
        for line in proc.stdout:
            line = line.rstrip("\n")
            out_lines.append(line)
            emit({"type": "stdout", "line": line})

    proc.wait()
    emit({"type": "exit", "code": proc.returncode})
    return {"ok": proc.returncode == 0, "code": proc.returncode, "output": "\n".join(out_lines)}


def find_free_port(start: int = 3020) -> int:
    import socket
    for port in range(start, start + 200):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start


def main() -> int:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            emit({"type": "error", "message": "No JSON on stdin"})
            return 1
        req = json.loads(raw)
    except json.JSONDecodeError as e:
        emit({"type": "error", "message": str(e)})
        return 1

    action = req.get("action", "build")
    project_dir = Path(req.get("projectDir", "generated/app"))
    shell = req.get("shell", "auto")

    if action == "write":
        files = req.get("files", [])
        written = write_files(project_dir, files)
        emit({"type": "written", "count": len(written), "files": written})
        return 0

    if action == "build":
        project_dir.mkdir(parents=True, exist_ok=True)
        files = req.get("files", [])
        if files:
            written = write_files(project_dir, files)
            emit({"type": "written", "count": len(written), "files": written})

        port = req.get("port") or find_free_port()
        commands = req.get("commands") or [
            "npm install",
            f"npm run dev -- -p {port}",
        ]

        # Only run install synchronously; dev is started by Node for preview
        for cmd in commands:
            if "npm run dev" in cmd:
                emit({"type": "skip_dev", "note": "dev server started by Node orchestrator", "port": port})
                continue
            result = run_cmd(cmd, project_dir, shell)
            if not result["ok"]:
                emit({"type": "error", "message": f"Command failed: {cmd}"})
                return result["code"]

        emit({
            "type": "done",
            "projectDir": str(project_dir.resolve()),
            "port": port,
            "previewUrl": f"http://127.0.0.1:{port}",
        })
        return 0

    emit({"type": "error", "message": f"Unknown action: {action}"})
    return 1


if __name__ == "__main__":
    sys.exit(main())
