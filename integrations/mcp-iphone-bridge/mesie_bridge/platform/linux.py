"""Linux Bluetooth paired-device detection."""

from __future__ import annotations

import re
import shutil
import subprocess
from typing import Any

IPHONE_HINTS = ("iphone", "ipad", "ios", "apple")


def list_paired_bluetooth_devices() -> list[dict[str, Any]]:
    if shutil.which("bluetoothctl"):
        return _via_bluetoothctl()
    return []


def _via_bluetoothctl() -> list[dict[str, Any]]:
    try:
        result = subprocess.run(
            ["bluetoothctl", "devices"],
            capture_output=True,
            text=True,
            timeout=15,
        )
        devices: list[dict[str, Any]] = []
        for line in result.stdout.splitlines():
            m = re.match(r"Device\s+([0-9A-F:]+)\s+(.+)", line, re.I)
            if not m:
                continue
            address, name = m.group(1), m.group(2).strip()
            info = subprocess.run(
                ["bluetoothctl", "info", address],
                capture_output=True,
                text=True,
                timeout=10,
            )
            connected = "Connected: yes" in info.stdout
            devices.append({
                "name": name,
                "address": address,
                "status": "connected" if connected else "paired",
                "connected": connected,
                "transport": "bluetooth_classic",
                "platform_source": "linux_bluetoothctl",
                "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
            })
        return devices
    except Exception:
        return []
