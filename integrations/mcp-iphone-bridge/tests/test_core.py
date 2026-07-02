"""Tests for MESIE Bridge core."""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Allow importing mesie_bridge from parent directory
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from mesie_bridge.core import BridgeCore  # noqa: E402


def test_capabilities_structure():
    bridge = BridgeCore()
    caps = bridge.capabilities()
    assert "platform" in caps
    assert "bluetooth" in caps
    assert "usb" in caps
    assert "mcp_compatible_hosts" in caps
    assert "iphone_device_info" in caps["tools"]


def test_connection_matrix():
    bridge = BridgeCore()
    matrix = bridge.connection_matrix()
    assert "bluetooth" in matrix
    assert "usb" in matrix
    assert "recommended" in matrix


def test_device_info_returns_dict():
    bridge = BridgeCore()
    info = bridge.device_info()
    assert "status" in info


def test_generate_host_configs():
    bridge = BridgeCore()
    configs = bridge.generate_host_configs()
    assert "cursor" in configs
    assert "iphone-bridge" in configs["cursor"]["mcpServers"]


def test_to_json():
    bridge = BridgeCore()
    out = bridge.to_json({"ok": True})
    parsed = json.loads(out)
    assert parsed["ok"] is True
