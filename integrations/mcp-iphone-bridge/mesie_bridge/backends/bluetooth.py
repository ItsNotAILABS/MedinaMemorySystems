"""Bluetooth backend — paired devices, BLE scan, link status."""

from __future__ import annotations

import asyncio
import platform
from typing import Any

from mesie_bridge.backends.base import DeviceBackend
from mesie_bridge.platform import detect

IPHONE_HINTS = ("iphone", "ipad", "ios", "apple")


class BluetoothBackend(DeviceBackend):
    name = "bluetooth"

    def available(self) -> bool:
        return True  # platform enumeration always attempted

    def status(self) -> dict[str, Any]:
        paired = self.list_devices()
        ios_devices = [d for d in paired if d.get("likely_ios")]
        connected_ios = [d for d in ios_devices if d.get("connected")]
        return {
            "available": True,
            "paired_count": len(paired),
            "ios_paired_count": len(ios_devices),
            "ios_connected_count": len(connected_ios),
            "ios_connected": len(connected_ios) > 0,
            "active_device": connected_ios[0] if connected_ios else (ios_devices[0] if ios_devices else None),
            "note": (
                "Bluetooth pairing confirms phone↔laptop link. "
                "Screen control still requires USB (pymobiledevice3) or Appium/WDA. "
                "BLE companion channel is available for custom MESIE mobile apps."
            ),
        }

    def list_devices(self) -> list[dict[str, Any]]:
        system = platform.system().lower()
        if system == "windows":
            from mesie_bridge.platform.windows import list_paired_bluetooth_devices
            return list_paired_bluetooth_devices()
        if system == "darwin":
            from mesie_bridge.platform.darwin import list_paired_bluetooth_devices
            return list_paired_bluetooth_devices()
        if system == "linux":
            from mesie_bridge.platform.linux import list_paired_bluetooth_devices
            return list_paired_bluetooth_devices()
        return []

    def list_ios_devices(self) -> list[dict[str, Any]]:
        return [d for d in self.list_devices() if d.get("likely_ios")]

    def ble_scan(self, timeout: float = 5.0) -> list[dict[str, Any]]:
        """Scan for nearby BLE devices (cross-platform via bleak)."""
        try:
            return asyncio.run(self._ble_scan_async(timeout))
        except Exception as exc:
            return [{"error": str(exc), "hint": "pip install bleak"}]

    async def _ble_scan_async(self, timeout: float) -> list[dict[str, Any]]:
        from bleak import BleakScanner

        found = await BleakScanner.discover(timeout=timeout)
        results: list[dict[str, Any]] = []
        for device in found:
            name = device.name or ""
            results.append({
                "name": name or "(unknown)",
                "address": device.address,
                "rssi": getattr(device, "rssi", None),
                "transport": "ble",
                "likely_ios": any(h in name.lower() for h in IPHONE_HINTS),
            })
        return results

    def connection_matrix(self) -> dict[str, Any]:
        """Summarize how phone and laptop are linked."""
        paired = self.list_devices()
        ios = self.list_ios_devices()
        return {
            "platform": detect.get_platform_info(),
            "bluetooth": {
                "paired_devices": paired,
                "ios_devices": ios,
                "phone_laptop_bluetooth": any(d.get("connected") for d in ios),
            },
        }
