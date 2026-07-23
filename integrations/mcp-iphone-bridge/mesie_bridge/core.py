"""Bridge orchestrator — unifies Bluetooth, USB, and MCP capabilities."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from typing import Any

from mesie_bridge.backends.bluetooth import BluetoothBackend
from mesie_bridge.backends.usb import UsbBackend
from mesie_bridge.platform.detect import get_platform_info

MAX_OUTPUT = 10_000


class BridgeCore:
    """Central bridge: discovers devices across transports and routes tool calls."""

    def __init__(self) -> None:
        self.bluetooth = BluetoothBackend()
        self.usb = UsbBackend()
        self._active_transport: str | None = None

    def to_json(self, payload: dict[str, Any]) -> str:
        return json.dumps(payload, indent=2, default=str)

    def capabilities(self) -> dict[str, Any]:
        bt = self.bluetooth.status()
        usb = self.usb.status()
        transports = []
        if bt.get("ios_connected"):
            transports.append("bluetooth")
        if usb.get("devices"):
            transports.append("usb")
        return {
            "platform": get_platform_info(),
            "mode": os.environ.get("MESIE_BRIDGE_MODE", "auto"),
            "transports": transports,
            "bluetooth": bt,
            "usb": usb,
            "mcp_compatible_hosts": [
                "Cursor", "Claude Desktop", "Cline", "Continue", "OpenCode",
                "Codex", "any MCP stdio or HTTP client",
            ],
            "tools": [
                "ping", "bridge_status", "connection_matrix",
                "bluetooth_list_devices", "bluetooth_ble_scan",
                "list_devices", "select_transport",
                "iphone_device_info", "iphone_screenshot", "iphone_list_apps",
                "iphone_tap", "iphone_swipe", "iphone_launch_app",
                "iphone_ui_scan", "iphone_type_text", "shell",
            ],
        }

    def connection_matrix(self) -> dict[str, Any]:
        matrix = self.bluetooth.connection_matrix()
        matrix["usb"] = self.usb.status()
        matrix["recommended"] = self._recommend_transport()
        return matrix

    def _recommend_transport(self) -> dict[str, str]:
        if self.usb.available() and self.usb.list_devices():
            return {"primary": "usb", "reason": "USB device detected — best for screenshots and app control"}
        if self.bluetooth.status().get("ios_connected"):
            return {
                "primary": "bluetooth",
                "reason": "iPhone paired via Bluetooth — link confirmed; plug in USB for full control",
            }
        return {"primary": "none", "reason": "Pair iPhone via Bluetooth and/or connect USB cable"}

    def list_all_devices(self) -> list[dict[str, Any]]:
        devices: list[dict[str, Any]] = []
        for d in self.bluetooth.list_ios_devices():
            devices.append({**d, "id": d.get("address") or d.get("name"), "kind": "bluetooth"})
        for d in self.usb.list_devices():
            devices.append({**d, "id": d.get("udid"), "kind": "usb"})
        return devices

    def device_info(self) -> dict[str, Any]:
        usb_info = self.usb.device_info()
        if usb_info:
            usb_info["bluetooth_link"] = self.bluetooth.status()
            return {"status": "ok", "device": usb_info, "transport": "usb"}

        ios_bt = self.bluetooth.list_ios_devices()
        connected = [d for d in ios_bt if d.get("connected")]
        if connected:
            return {
                "status": "partial",
                "device": connected[0],
                "transport": "bluetooth",
                "note": "Bluetooth link active. Connect USB for full device APIs.",
            }
        if ios_bt:
            return {
                "status": "paired",
                "device": ios_bt[0],
                "transport": "bluetooth",
                "note": "iPhone paired but not connected over Bluetooth right now.",
            }
        return {
            "status": "unavailable",
            "device": None,
            "hint": "Pair iPhone with laptop via Bluetooth Settings, trust device, enable Bluetooth on both.",
        }

    def run_shell(self, cmd: str, timeout: int = 30, cwd: str = "") -> dict[str, Any]:
        if not cmd.strip():
            return {"ok": False, "error": "cmd is required"}
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=max(1, min(timeout, 120)),
                cwd=cwd or None,
            )
            out = (result.stdout + result.stderr).strip()
            return {
                "ok": result.returncode == 0,
                "exit_code": result.returncode,
                "output": out[:MAX_OUTPUT] if out else "No output",
            }
        except subprocess.TimeoutExpired:
            return {"ok": False, "error": f"Timed out after {timeout}s"}
        except Exception as exc:
            return {"ok": False, "error": str(exc)}

    def stub_action(self, action: str, **fields: Any) -> dict[str, Any]:
        return {
            "status": "stub",
            "action": action,
            "capabilities": self.capabilities(),
            "hint": "Wire Appium/WebDriverAgent or macOS mirroring for UI automation.",
            **fields,
        }

    def generate_host_configs(self) -> dict[str, Any]:
        from mesie_bridge.config import claude_desktop_config, cursor_mcp_config
        return {
            "cursor": cursor_mcp_config(),
            "claude_desktop": claude_desktop_config(),
            "generic": cursor_mcp_config(),
        }
