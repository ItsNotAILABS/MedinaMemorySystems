"""
MESIE iPhone Bridge — MCP Server

Stdio MCP server for Cursor / Claude Desktop.
Keeps bridge diagnostics (ping, shell) plus iPhone control tools.

Run:
  Windows:  .\.venv\Scripts\python.exe .\MESIEServer.py
  Linux:    ./.venv/bin/python ./MESIEServer.py

Optional backends (install separately for real device access):
  pip install pymobiledevice3   # USB device info, screenshots (Windows/macOS/Linux)
"""

from __future__ import annotations

import json
import logging
import os
import platform
import shutil
import subprocess
import sys
from typing import Any

from mcp.server.fastmcp import FastMCP

# ─── Logging (stderr only — stdout is reserved for MCP JSON-RPC) ─────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [MESIE] %(levelname)s %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger("mesie-bridge")

mcp = FastMCP("MESIE iPhone Bridge")

MAX_OUTPUT = 10_000
DEFAULT_SHELL_TIMEOUT = 30


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _json(payload: dict[str, Any]) -> str:
    return json.dumps(payload, indent=2, default=str)


def _run_cmd(
    cmd: list[str] | str,
    *,
    shell: bool = False,
    timeout: int = DEFAULT_SHELL_TIMEOUT,
    cwd: str | None = None,
) -> dict[str, Any]:
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
        )
        out = (result.stdout + result.stderr).strip()
        return {
            "ok": result.returncode == 0,
            "exit_code": result.returncode,
            "output": out[:MAX_OUTPUT] if out else "No output",
        }
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": f"Command timed out after {timeout}s"}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


def _backend_status() -> dict[str, Any]:
    """Detect optional iPhone backends available on this machine."""
    backends: dict[str, Any] = {
        "platform": platform.system(),
        "python": sys.version.split()[0],
        "cwd": os.getcwd(),
    }

    idevice = shutil.which("idevice_id")
    if idevice:
        listed = _run_cmd([idevice, "-l"], timeout=10)
        backends["libimobiledevice"] = {
            "available": True,
            "path": idevice,
            "udids": listed.get("output", "").splitlines() if listed.get("ok") else [],
        }
    else:
        backends["libimobiledevice"] = {"available": False}

    try:
        import pymobiledevice3  # noqa: F401
        backends["pymobiledevice3"] = {"available": True}
    except ImportError:
        backends["pymobiledevice3"] = {
            "available": False,
            "install": "pip install pymobiledevice3",
        }

    connected = bool(
        backends.get("libimobiledevice", {}).get("udids")
        or backends.get("pymobiledevice3", {}).get("available")
    )
    backends["device_connected"] = connected
    return backends


def _iphone_stub(action: str, **fields: Any) -> str:
    status = _backend_status()
    return _json({
        "status": "stub",
        "action": action,
        "device_connected": status.get("device_connected", False),
        "backends": status,
        "hint": (
            "Wire real control via pymobiledevice3 or libimobiledevice, "
            "or use Appium/WebDriverAgent for UI automation."
        ),
        **fields,
    })


def _try_pymobiledevice_info() -> dict[str, Any] | None:
    try:
        from pymobiledevice3.lockdown import create_using_usbmux
        lockdown = create_using_usbmux()
        return {
            "connected": True,
            "udid": lockdown.udid,
            "device_name": lockdown.display_name,
            "product_type": lockdown.get_value(key="ProductType"),
            "ios_version": lockdown.product_version,
            "serial": lockdown.get_value(key="SerialNumber"),
        }
    except Exception as exc:
        log.debug("pymobiledevice3 info failed: %s", exc)
        return None


# ─── Bridge diagnostics ──────────────────────────────────────────────────────

@mcp.tool()
def ping() -> str:
    """Test that the MESIE iPhone Bridge MCP server is alive."""
    return _json({
        "status": "ok",
        "message": "MESIE iPhone Bridge is running.",
        "server": "MESIE iPhone Bridge",
        "backends": _backend_status(),
    })


@mcp.tool()
def bridge_status() -> str:
    """Report bridge health, platform, and available iPhone backends."""
    return _json(_backend_status())


@mcp.tool()
def shell(cmd: str, timeout: int = DEFAULT_SHELL_TIMEOUT, cwd: str = "") -> str:
    """Run a local shell command on the bridge host (diagnostics only)."""
    if not cmd.strip():
        return _json({"ok": False, "error": "cmd is required"})
    log.info("shell: %s", cmd[:200])
    result = _run_cmd(cmd, shell=True, timeout=max(1, min(timeout, 120)), cwd=cwd or None)
    return _json(result)


# ─── iPhone tools (MEDINA MCP-31 registry) ───────────────────────────────────

@mcp.tool()
def iphone_device_info() -> str:
    """Get connected iPhone device details (model, iOS version, battery, storage)."""
    info = _try_pymobiledevice_info()
    if info:
        return _json({"status": "ok", "device": info, "source": "pymobiledevice3"})

    idevice = shutil.which("ideviceinfo")
    if idevice:
        result = _run_cmd([idevice], timeout=15)
        if result.get("ok"):
            return _json({"status": "ok", "device": result["output"], "source": "ideviceinfo"})

    return _iphone_stub("device_info")


@mcp.tool()
def iphone_screenshot(format: str = "jpeg") -> str:
    """Capture a screenshot from the connected iPhone."""
    fmt = (format or "jpeg").lower()
    if fmt not in {"jpeg", "png"}:
        return _json({"ok": False, "error": "format must be jpeg or png"})

    # pymobiledevice3 screenshot path if available
    try:
        from pymobiledevice3.services.dvt.dvt_secure_socket_proxy import DvtSecureSocketProxyService
        from pymobiledevice3.services.dvt.instruments.screenshot import Screenshot
        from pymobiledevice3.lockdown import create_using_usbmux

        lockdown = create_using_usbmux()
        with DvtSecureSocketProxyService(lockdown=lockdown) as dvt:
            screenshot = Screenshot(dvt)
            data = screenshot.get_screenshot()
        import base64
        return _json({
            "status": "ok",
            "format": fmt,
            "image_base64": base64.b64encode(data).decode("ascii")[:MAX_OUTPUT],
            "source": "pymobiledevice3",
        })
    except Exception as exc:
        log.debug("screenshot failed: %s", exc)

    return _iphone_stub("screenshot", format=fmt)


@mcp.tool()
def iphone_tap(x: float, y: float) -> str:
    """Tap at screen coordinates on the iPhone."""
    return _iphone_stub("tap", x=x, y=y)


@mcp.tool()
def iphone_swipe(
    from_x: float,
    from_y: float,
    to_x: float,
    to_y: float,
    duration: float = 300,
) -> str:
    """Swipe gesture on the iPhone screen."""
    return _iphone_stub(
        "swipe",
        from_x=from_x,
        from_y=from_y,
        to_x=to_x,
        to_y=to_y,
        duration_ms=duration,
    )


@mcp.tool()
def iphone_launch_app(bundle_id: str) -> str:
    """Launch an app on the iPhone by bundle ID."""
    if not bundle_id.strip():
        return _json({"ok": False, "error": "bundle_id is required"})
    return _iphone_stub("launch_app", bundle_id=bundle_id)


@mcp.tool()
def iphone_ui_scan() -> str:
    """Scan the iPhone UI for tappable elements and their coordinates."""
    return _iphone_stub("ui_scan", elements=[])


@mcp.tool()
def iphone_type_text(text: str) -> str:
    """Type text into the focused field on the iPhone."""
    if not text:
        return _json({"ok": False, "error": "text is required"})
    return _iphone_stub("type_text", text=text)


@mcp.tool()
def iphone_list_apps() -> str:
    """List installed apps on the connected iPhone."""
    try:
        from pymobiledevice3.lockdown import create_using_usbmux
        from pymobiledevice3.services.installation_proxy import InstallationProxyService

        lockdown = create_using_usbmux()
        apps = InstallationProxyService(lockdown).get_apps(application_type="User")
        names = [
            {"bundle_id": bid, "name": meta.get("CFBundleDisplayName") or meta.get("CFBundleName")}
            for bid, meta in sorted(apps.items())
        ]
        return _json({"status": "ok", "count": len(names), "apps": names[:200], "source": "pymobiledevice3"})
    except Exception as exc:
        log.debug("list_apps failed: %s", exc)

    return _iphone_stub("list_apps", apps=[])


if __name__ == "__main__":
    log.info("Starting MESIE iPhone Bridge (stdio)")
    mcp.run()
