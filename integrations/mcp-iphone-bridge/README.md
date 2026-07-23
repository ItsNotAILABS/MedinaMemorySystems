# MESIE iPhone Bridge

Cross-platform desktop app that connects your **iPhone ↔ laptop** and exposes a unified **MCP tool surface** for every AI host: Cursor, Claude Desktop, Cline, Continue, OpenCode, Codex, and any MCP-compatible client.

## What it does

| Layer | Function |
|-------|----------|
| **Bluetooth** | Detects paired/connected iPhone on Windows, macOS, Linux |
| **USB** | Full device APIs via `pymobiledevice3` (optional) |
| **MCP** | One stdio server — all AI tools use the same schema |

## Quick start (Windows)

```powershell
cd C:\Users\Medin\mcp-iphone-bridge

# Copy this entire folder from MEDINA: integrations/mcp-iphone-bridge/

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
pip install pymobiledevice3   # optional, for USB screenshots/apps

# Check Bluetooth phone↔laptop link
python -m mesie_bridge bluetooth

# Start MCP server (stdio — used by Cursor)
.\.venv\Scripts\python.exe .\MESIEServer.py
```

## Quick start (macOS / Linux)

```bash
cd ~/mcp-iphone-bridge
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[full]"
python -m mesie_bridge status
python -m mesie_bridge mcp
```

## Pair iPhone via Bluetooth

1. **iPhone**: Settings → Bluetooth → ON → pair your laptop
2. **Windows**: Settings → Bluetooth & devices → confirm iPhone shows **Connected**
3. **Verify**:
   ```powershell
   python -m mesie_bridge bluetooth
   ```
   Or call MCP tool `bluetooth_phone_link`

> Bluetooth confirms the phone↔laptop link. Screen control (tap/swipe/screenshot) needs **USB** (`pymobiledevice3`) or **Appium/WebDriverAgent**.

## MCP config — all desktop AI hosts

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "iphone-bridge": {
      "command": "C:\\Users\\Medin\\mcp-iphone-bridge\\.venv\\Scripts\\python.exe",
      "args": ["C:\\Users\\Medin\\mcp-iphone-bridge\\MESIEServer.py"]
    }
  }
}
```

Auto-generate:

```powershell
python -m mesie_bridge config
```

### Claude Desktop

Same JSON in `claude_desktop_config.json` (Settings → Developer → Edit Config).

### Any MCP client

Point `command` + `args` at your venv Python and `MESIEServer.py`. Transport: **stdio**.

Call MCP tool `mcp_host_config` to get ready-made snippets.

## CLI commands

| Command | Description |
|---------|-------------|
| `python -m mesie_bridge mcp` | Start MCP stdio server |
| `python -m mesie_bridge status` | Full bridge capabilities |
| `python -m mesie_bridge bluetooth` | Phone↔laptop Bluetooth matrix |
| `python -m mesie_bridge devices` | All devices (BT + USB) |
| `python -m mesie_bridge config` | Write `.cursor/mcp.json` |

## MCP tools

### Connectivity
- `ping` — alive check
- `bridge_status` — platform + backends
- `connection_matrix` — Bluetooth + USB link map
- `mcp_host_config` — config for Cursor/Claude/etc.
- `bluetooth_list_devices` — paired BT devices
- `bluetooth_ble_scan` — nearby BLE scan
- `bluetooth_phone_link` — is iPhone connected via BT?
- `list_devices` — all devices
- `select_transport` — auto / bluetooth / usb

### iPhone control
- `iphone_device_info`
- `iphone_screenshot`
- `iphone_list_apps`
- `iphone_tap`, `iphone_swipe`, `iphone_launch_app`
- `iphone_ui_scan`, `iphone_type_text`

### Diagnostics
- `shell` — local command (guarded)

## Architecture

```
MESIEServer.py  →  mesie_bridge.mcp.server  →  BridgeCore
                                                    ├── BluetoothBackend (Windows/macOS/Linux)
                                                    └── UsbBackend (pymobiledevice3)
```

Registered in **MEDINA GO System** as **MCP-31 — iPhone Bridge (MESIE)**.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `can't open file MESIEServer.py` | Run from folder containing `MESIEServer.py` |
| Bluetooth shows paired but not connected | Open Bluetooth settings on both devices |
| No USB device | Trust computer on iPhone; install `pymobiledevice3` |
| MCP red in Cursor | Use absolute paths; restart Cursor completely |
| `bleak` errors | `pip install bleak` |
