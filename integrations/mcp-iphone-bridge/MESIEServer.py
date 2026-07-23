#!/usr/bin/env python3
"""
MESIE iPhone Bridge — entry point for Cursor / Claude Desktop / all MCP hosts.

  Windows:  .\.venv\Scripts\python.exe .\MESIEServer.py
  macOS:    ./.venv/bin/python ./MESIEServer.py
  Linux:    ./.venv/bin/python ./MESIEServer.py

Equivalent: python -m mesie_bridge mcp
"""

from mesie_bridge.mcp.server import configure_logging, run_stdio

if __name__ == "__main__":
    configure_logging()
    run_stdio()
