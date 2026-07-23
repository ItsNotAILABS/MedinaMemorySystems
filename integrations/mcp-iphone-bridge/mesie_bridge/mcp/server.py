"""MCP server — tool surface for all AI hosts (Cursor, Claude, etc.)."""

from __future__ import annotations

import logging
import sys

from mcp.server.fastmcp import FastMCP

from mesie_bridge.core import BridgeCore

log = logging.getLogger("mesie-bridge.mcp")
bridge = BridgeCore()
mcp = FastMCP("MESIE iPhone Bridge")


def _j(payload: dict) -> str:
    return bridge.to_json(payload)


# ─── Bridge / connectivity ───────────────────────────────────────────────────

@mcp.tool()
def ping() -> str:
    """Test that the MESIE iPhone Bridge MCP server is alive."""
    return _j({
        "status": "ok",
        "message": "MESIE iPhone Bridge is running.",
        "version": "1.0.0",
    })


@mcp.tool()
def bridge_status() -> str:
    """Full bridge health: platform, Bluetooth link, USB, capabilities."""
    return _j(bridge.capabilities())


@mcp.tool()
def connection_matrix() -> str:
    """Show how phone and laptop are connected (Bluetooth + USB)."""
    return _j(bridge.connection_matrix())


@mcp.tool()
def mcp_host_config() -> str:
    """Generate MCP config snippets for Cursor, Claude Desktop, and other hosts."""
    return _j(bridge.generate_host_configs())


# ─── Bluetooth ───────────────────────────────────────────────────────────────

@mcp.tool()
def bluetooth_list_devices() -> str:
    """List Bluetooth-paired devices; highlights iPhone/iPad when found."""
    return _j({
        "devices": bridge.bluetooth.list_devices(),
        "ios_devices": bridge.bluetooth.list_ios_devices(),
        "status": bridge.bluetooth.status(),
    })


@mcp.tool()
def bluetooth_ble_scan(timeout: float = 5.0) -> str:
    """Scan nearby BLE devices (requires bleak: pip install bleak)."""
    return _j({
        "devices": bridge.bluetooth.ble_scan(timeout=timeout),
        "timeout_seconds": timeout,
    })


@mcp.tool()
def bluetooth_phone_link() -> str:
    """Check if iPhone is paired/connected to this laptop via Bluetooth."""
    status = bridge.bluetooth.status()
    return _j({
        "phone_laptop_bluetooth": status.get("ios_connected", False),
        "ios_devices": bridge.bluetooth.list_ios_devices(),
        "status": status,
        "setup_hint": (
            "On iPhone: Settings → Bluetooth → ensure laptop is paired and connected. "
            "On Windows: Settings → Bluetooth & devices → confirm iPhone shows Connected."
        ),
    })


# ─── Device listing ────────────────────────────────────────────────────────────

@mcp.tool()
def list_devices() -> str:
    """List all known devices across Bluetooth and USB."""
    return _j({"devices": bridge.list_all_devices(), "recommended": bridge._recommend_transport()})


@mcp.tool()
def select_transport(transport: str = "auto") -> str:
    """Select active transport: auto, bluetooth, or usb."""
    valid = {"auto", "bluetooth", "usb"}
    if transport not in valid:
        return _j({"ok": False, "error": f"transport must be one of {sorted(valid)}"})
    rec = bridge._recommend_transport() if transport == "auto" else {"primary": transport}
    return _j({"ok": True, "selected": rec})


# ─── iPhone control ────────────────────────────────────────────────────────────

@mcp.tool()
def iphone_device_info() -> str:
    """Get iPhone details — USB first, then Bluetooth pairing status."""
    return _j(bridge.device_info())


@mcp.tool()
def iphone_screenshot(format: str = "jpeg") -> str:
    """Capture iPhone screenshot (USB / pymobiledevice3 required)."""
    fmt = (format or "jpeg").lower()
    if fmt not in {"jpeg", "png"}:
        return _j({"ok": False, "error": "format must be jpeg or png"})
    b64 = bridge.usb.screenshot_base64()
    if b64:
        return _j({"status": "ok", "format": fmt, "image_base64": b64[:10000], "transport": "usb"})
    return _j(bridge.stub_action("screenshot", format=fmt, bluetooth=bridge.bluetooth.status()))


@mcp.tool()
def iphone_list_apps() -> str:
    """List installed iPhone apps (USB required)."""
    apps = bridge.usb.list_apps()
    if apps:
        return _j({"status": "ok", "count": len(apps), "apps": apps, "transport": "usb"})
    return _j(bridge.stub_action("list_apps", apps=[], bluetooth=bridge.bluetooth.status()))


@mcp.tool()
def iphone_tap(x: float, y: float) -> str:
    """Tap at screen coordinates on the iPhone."""
    return _j(bridge.stub_action("tap", x=x, y=y))


@mcp.tool()
def iphone_swipe(from_x: float, from_y: float, to_x: float, to_y: float, duration: float = 300) -> str:
    """Swipe on the iPhone screen."""
    return _j(bridge.stub_action("swipe", from_x=from_x, from_y=from_y, to_x=to_x, to_y=to_y, duration_ms=duration))


@mcp.tool()
def iphone_launch_app(bundle_id: str) -> str:
    """Launch an iPhone app by bundle ID."""
    if not bundle_id.strip():
        return _j({"ok": False, "error": "bundle_id is required"})
    return _j(bridge.stub_action("launch_app", bundle_id=bundle_id))


@mcp.tool()
def iphone_ui_scan() -> str:
    """Scan iPhone UI for tappable elements."""
    return _j(bridge.stub_action("ui_scan", elements=[]))


@mcp.tool()
def iphone_type_text(text: str) -> str:
    """Type text into the focused iPhone field."""
    if not text:
        return _j({"ok": False, "error": "text is required"})
    return _j(bridge.stub_action("type_text", text=text))


# ─── Diagnostics ─────────────────────────────────────────────────────────────

@mcp.tool()
def shell(cmd: str, timeout: int = 30, cwd: str = "") -> str:
    """Run a local shell command on the bridge host (diagnostics only)."""
    return _j(bridge.run_shell(cmd, timeout=timeout, cwd=cwd))


def run_stdio() -> None:
    """Start MCP stdio transport (default for Cursor / Claude Desktop)."""
    log.info("MESIE Bridge MCP stdio starting")
    mcp.run()


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [MESIE] %(levelname)s %(message)s",
        stream=sys.stderr,
    )
