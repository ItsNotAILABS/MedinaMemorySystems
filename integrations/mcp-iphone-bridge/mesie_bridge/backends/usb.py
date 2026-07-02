"""USB backend via pymobiledevice3 / libimobiledevice."""

from __future__ import annotations

import shutil
import subprocess
from typing import Any

from mesie_bridge.backends.base import DeviceBackend


class UsbBackend(DeviceBackend):
    name = "usb"

    def available(self) -> bool:
        return self._has_pymobiledevice3() or shutil.which("idevice_id") is not None

    def status(self) -> dict[str, Any]:
        return {
            "available": self.available(),
            "pymobiledevice3": self._has_pymobiledevice3(),
            "libimobiledevice": shutil.which("idevice_id") is not None,
            "devices": self.list_devices(),
        }

    def list_devices(self) -> list[dict[str, Any]]:
        devices: list[dict[str, Any]] = []
        if self._has_pymobiledevice3():
            try:
                from pymobiledevice3.usbmux import list_devices
                for dev in list_devices():
                    devices.append({
                        "udid": dev.serial,
                        "transport": "usb",
                        "connection_type": str(getattr(dev, "connection_type", "usb")),
                        "source": "pymobiledevice3",
                    })
            except Exception as exc:
                devices.append({"error": str(exc), "source": "pymobiledevice3"})
        idevice = shutil.which("idevice_id")
        if idevice:
            try:
                result = subprocess.run([idevice, "-l"], capture_output=True, text=True, timeout=10)
                for udid in result.stdout.strip().splitlines():
                    if udid and not any(d.get("udid") == udid for d in devices):
                        devices.append({"udid": udid, "transport": "usb", "source": "idevice_id"})
            except Exception:
                pass
        return devices

    def device_info(self) -> dict[str, Any] | None:
        try:
            from pymobiledevice3.lockdown import create_using_usbmux
            lockdown = create_using_usbmux()
            return {
                "udid": lockdown.udid,
                "device_name": lockdown.display_name,
                "product_type": lockdown.get_value(key="ProductType"),
                "ios_version": lockdown.product_version,
                "serial": lockdown.get_value(key="SerialNumber"),
                "transport": "usb",
                "source": "pymobiledevice3",
            }
        except Exception:
            return None

    def list_apps(self, limit: int = 200) -> list[dict[str, Any]]:
        try:
            from pymobiledevice3.lockdown import create_using_usbmux
            from pymobiledevice3.services.installation_proxy import InstallationProxyService
            lockdown = create_using_usbmux()
            apps = InstallationProxyService(lockdown).get_apps(application_type="User")
            return [
                {"bundle_id": bid, "name": meta.get("CFBundleDisplayName") or meta.get("CFBundleName")}
                for bid, meta in sorted(apps.items())
            ][:limit]
        except Exception:
            return []

    def screenshot_base64(self) -> str | None:
        try:
            import base64
            from pymobiledevice3.lockdown import create_using_usbmux
            from pymobiledevice3.services.dvt.dvt_secure_socket_proxy import DvtSecureSocketProxyService
            from pymobiledevice3.services.dvt.instruments.screenshot import Screenshot
            lockdown = create_using_usbmux()
            with DvtSecureSocketProxyService(lockdown=lockdown) as dvt:
                data = Screenshot(dvt).get_screenshot()
            return base64.b64encode(data).decode("ascii")
        except Exception:
            return None

    @staticmethod
    def _has_pymobiledevice3() -> bool:
        try:
            import pymobiledevice3  # noqa: F401
            return True
        except ImportError:
            return False
