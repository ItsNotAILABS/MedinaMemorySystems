"""MESIE Bridge CLI."""

from __future__ import annotations

import argparse
import json
import sys

from mesie_bridge import __version__
from mesie_bridge.config import write_cursor_config
from mesie_bridge.core import BridgeCore
from mesie_bridge.mcp.server import configure_logging, run_stdio


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="mesie-bridge",
        description="MESIE iPhone Bridge — MCP server for all desktop AI hosts",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("mcp", help="Start MCP stdio server (Cursor, Claude, etc.)")
    sub.add_parser("status", help="Print bridge + Bluetooth + USB status")
    sub.add_parser("devices", help="List all devices")
    sub.add_parser("bluetooth", help="Bluetooth phone↔laptop link status")

    cfg = sub.add_parser("config", help="Write .cursor/mcp.json")
    cfg.add_argument("--path", default="", help="Output path (default: ./.cursor/mcp.json)")

    args = parser.parse_args(argv)
    bridge = BridgeCore()

    if args.command == "mcp" or args.command is None:
        configure_logging()
        run_stdio()
        return 0

    if args.command == "status":
        print(json.dumps(bridge.capabilities(), indent=2))
        return 0

    if args.command == "devices":
        print(json.dumps(bridge.list_all_devices(), indent=2))
        return 0

    if args.command == "bluetooth":
        print(json.dumps(bridge.bluetooth.connection_matrix(), indent=2))
        return 0

    if args.command == "config":
        from pathlib import Path
        path = write_cursor_config(Path(args.path) if args.path else None)
        print(f"Wrote {path}")
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
