"""Windows Bluetooth paired-device detection."""

from __future__ import annotations

import json
import subprocess
from typing import Any

IPHONE_HINTS = ("iphone", "ipad", "ios", "apple")


def list_paired_bluetooth_devices() -> list[dict[str, Any]]:
    """List paired Bluetooth devices via PowerShell (Windows 10/11)."""
    ps = r"""
Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue |
  Where-Object { $_.FriendlyName -and $_.Status -ne 'Unknown' } |
  Select-Object FriendlyName, Status, InstanceId |
  ConvertTo-Json -Compress
"""
    try:
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps],
            capture_output=True,
            text=True,
            timeout=20,
        )
        if result.returncode != 0 or not result.stdout.strip():
            return _fallback_wmic()
        raw = json.loads(result.stdout)
        items = raw if isinstance(raw, list) else [raw]
        devices = []
        for item in items:
            name = str(item.get("FriendlyName", ""))
            devices.append({
                "name": name,
                "status": str(item.get("Status", "unknown")).lower(),
                "connected": str(item.get("Status", "")).lower() == "ok",
                "transport": "bluetooth_classic",
                "platform_source": "windows_pnp",
                "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
            })
        return devices
    except Exception:
        return _fallback_wmic()


def _fallback_wmic() -> list[dict[str, Any]]:
    try:
        result = subprocess.run(
            ["wmic", "path", "Win32_PnPEntity", "where",
             "Name like '%Bluetooth%'", "get", "Name,Status", "/format:csv"],
            capture_output=True,
            text=True,
            timeout=15,
        )
        devices = []
        for line in result.stdout.splitlines():
            if "Bluetooth" not in line or line.startswith("Node"):
                continue
            parts = [p.strip() for p in line.split(",") if p.strip()]
            if len(parts) >= 2:
                name = parts[-1] if "Bluetooth" in parts[-1] else parts[0]
                status = parts[1] if len(parts) > 2 else "unknown"
                devices.append({
                    "name": name,
                    "status": status.lower(),
                    "connected": "ok" in status.lower(),
                    "transport": "bluetooth_classic",
                    "platform_source": "windows_wmic",
                    "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
                })
        return devices
    except Exception:
        return []
