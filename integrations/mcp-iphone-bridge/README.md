# MESIE iPhone Bridge — Setup

Your error means the **Python venv exists** but **`MESIEServer.py` is missing** from the project folder. The MCP package is installed; you just need the server script.

## Quick fix (Windows)

From PowerShell in `C:\Users\Medin\mcp-iphone-bridge`:

```powershell
# 1. Copy MESIEServer.py from this MEDINA repo folder:
#    integrations/mcp-iphone-bridge/MESIEServer.py
#    → C:\Users\Medin\mcp-iphone-bridge\MESIEServer.py

# 2. Confirm the file exists
Get-ChildItem .\MESIEServer.py

# 3. Run the server (should start and wait on stdio — no error)
.\.venv\Scripts\python.exe .\MESIEServer.py
```

If step 3 exits immediately with no error, that is normal for stdio MCP — Cursor spawns the process when the MCP server connects.

## Cursor MCP config (Windows)

Use **absolute paths** with backslashes escaped in JSON:

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

Place this in your project's `.cursor/mcp.json` or in global Cursor MCP settings. **Fully quit and restart Cursor** after saving.

## Linux / macOS

```json
{
  "mcpServers": {
    "iphone-bridge": {
      "command": "/home/MESIE/mcp-iphone-bridge/.venv/bin/python",
      "args": ["/home/MESIE/mcp-iphone-bridge/MESIEServer.py"]
    }
  }
}
```

## Find your entry point if the filename differs

```powershell
Get-ChildItem -Recurse -Filter *.py | Select-Object FullName
```

If you see `server.py` or `main.py` instead, use that path in `args`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `can't open file '...\MESIEServer.py'` | Copy `MESIEServer.py` into the project root (this folder). |
| MCP shows red / disconnected in Cursor | Check paths are absolute; restart Cursor completely. |
| Server starts but tools return stubs | Expected until you wire real iPhone control (USB/WiFi/Appium). |
| `No module named 'mcp'` | Run `pip install -r requirements.txt` inside `.venv`. |

## Tools exposed

### Bridge diagnostics
| Tool | Description |
|------|-------------|
| `ping` | Confirm the MCP server is alive |
| `bridge_status` | Platform, backends, connected UDIDs |
| `shell` | Run a local diagnostic command on the bridge host |

### iPhone control (MEDINA MCP-31)
| Tool | Description |
|------|-------------|
| `iphone_device_info` | Device model, iOS version (live if pymobiledevice3 installed) |
| `iphone_screenshot` | Screen capture |
| `iphone_tap` | Tap at (x, y) |
| `iphone_swipe` | Swipe gesture |
| `iphone_launch_app` | Launch by bundle ID |
| `iphone_ui_scan` | UI element scan |
| `iphone_type_text` | Type into focused field |
| `iphone_list_apps` | Installed apps |

Install optional backend for real USB device data:

```powershell
pip install pymobiledevice3
```

Registered in MEDINA GO System as **MCP-31 — iPhone Bridge (MESIE)**.

## Fresh install

```powershell
cd C:\Users\Medin\mcp-iphone-bridge
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt   # copy requirements.txt from this folder too
.\.venv\Scripts\python.exe .\MESIEServer.py
```
