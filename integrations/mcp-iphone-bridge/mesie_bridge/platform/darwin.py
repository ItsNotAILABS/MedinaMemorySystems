"""macOS Bluetooth paired-device detection."""

from __future__ import annotations

import re
import subprocess
from typing import Any

IPHONE_HINTS = ("iphone", "ipad", "ios", "apple")


def list_paired_bluetooth_devices() -> list[dict[str, Any]]:
    try:
        result = subprocess.run(
            ["system_profiler", "SPBluetoothDataType", "-json"],
            capture_output=True,
            text=True,
            timeout=25,
        )
        if result.returncode == 0 and result.stdout.strip():
            return _parse_json_profiler(result.stdout)
    except Exception:
        pass
    return _parse_text_profiler()


def _parse_json_profiler(stdout: str) -> list[dict[str, Any]]:
    import json
    devices: list[dict[str, Any]] = []
    try:
        data = json.loads(stdout)
        bt = data.get("SPBluetoothDataType", [{}])[0]
        for section_key in ("device_connected", "device_not_connected"):
            section = bt.get(section_key, {})
            if not isinstance(section, dict):
                continue
            for name, meta in section.items():
                if not isinstance(meta, dict):
                    continue
                connected = section_key == "device_connected"
                devices.append({
                    "name": name,
                    "status": "connected" if connected else "paired",
                    "connected": connected,
                    "address": meta.get("device_address", ""),
                    "transport": "bluetooth_classic",
                    "platform_source": "macos_profiler",
                    "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
                })
    except Exception:
        pass
    return devices


def _parse_text_profiler() -> list[dict[str, Any]]:
    try:
        result = subprocess.run(
            ["system_profiler", "SPBluetoothDataType"],
            capture_output=True,
            text=True,
            timeout=25,
        )
        devices: list[dict[str, Any]] = []
        current: dict[str, Any] | None = None
        in_connected = False
        for line in result.stdout.splitlines():
            if "Connected:" in line:
                in_connected = True
                continue
            if "Not Connected:" in line:
                in_connected = False
                continue
            m = re.match(r"^\s{6}([^:]+):\s*$", line)
            if m:
                if current:
                    devices.append(current)
                name = m.group(1).strip()
                current = {
                    "name": name,
                    "status": "connected" if in_connected else "paired",
                    "connected": in_connected,
                    "transport": "bluetooth_classic",
                    "platform_source": "macos_profiler_text",
                    "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
                }
        if current:
            devices.append(current)
        return devices
    except Exception:
        return []
