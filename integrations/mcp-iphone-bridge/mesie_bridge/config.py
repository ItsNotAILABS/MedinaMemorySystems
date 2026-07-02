"""Bridge configuration and MCP host config generation."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

PACKAGE_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SERVER_SCRIPT = PACKAGE_ROOT / "MESIEServer.py"


def python_executable() -> str:
    return os.environ.get("MESIE_PYTHON", sys.executable)


def server_script_path() -> str:
    return os.environ.get("MESIE_SERVER_SCRIPT", str(DEFAULT_SERVER_SCRIPT))


def cursor_mcp_config() -> dict[str, Any]:
    return {
        "mcpServers": {
            "iphone-bridge": {
                "command": python_executable(),
                "args": [server_script_path()],
                "env": {
                    "MESIE_BRIDGE_MODE": os.environ.get("MESIE_BRIDGE_MODE", "auto"),
                },
            }
        }
    }


def claude_desktop_config() -> dict[str, Any]:
    return cursor_mcp_config()


def generic_mcp_json() -> str:
    return json.dumps(cursor_mcp_config(), indent=2)


def write_cursor_config(target: Path | None = None) -> Path:
    path = target or (Path.cwd() / ".cursor" / "mcp.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(generic_mcp_json() + "\n", encoding="utf-8")
    return path
