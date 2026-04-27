# 𓂀 MEDINA Terminal — Sovereign Organism Interface

![Version](https://img.shields.io/badge/version-1.0.0-gold) ![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue) ![φ](https://img.shields.io/badge/φ-1.618033988749895-purple)

> **The terminal IS the organism.** A cross-platform desktop application that provides sovereign access to the entire MEDINA ecosystem — 374+ callable functions, 96 SDK packages, 5 AI agents, and 50 universal tools.

---

## Features

- **Terminal Tab** — Full command-line interface with Latin-named callable functions, search, and direct execution
- **Calls Registry Tab** — Browse, search, and filter 374+ callable functions across core, extended, AI, and tool categories
- **Chat Tab** — Conversational interface with Oro (executes), Nova (validates), Sentinel (defends), Architect (analyzes), Absorber (ingests)
- **World Tab** — Live viewer for SDK landing pages — each SDK ships with a living organism website
- **Tools Tab** — Browse 50 universal developer tools across blockchain, encryption, protocol, data, compute, and rendering
- **Settings Tab** — Organism configuration, platform info, gate status, installer details

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Title Bar: 𓂀 MEDINA Terminal — φ · beat · coherence · heartbeat │
├────────┬───────────┬──────┬───────┬───────┬──────────┬─────────┤
│Terminal│Calls (374)│ Chat │ World │ Tools │ Settings │    +    │
├────────┴───────────┴──────┴───────┴───────┴──────────┴─────────┤
│ Sidebar  │                Content Area                         │
│          │                                                     │
│ Organism │  Terminal: command line + output                     │
│  Status  │  Calls: searchable card grid                        │
│  Gates   │  Chat: Oro/Nova/Sentinel conversation               │
│  AI      │  World: SDK landing page iframe viewer              │
│  Agents  │  Tools: filterable tool card grid                   │
│  Terms   │  Settings: organism config                          │
│  Registry│                                                     │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ Status Bar: Organism Active │ Beat │ Gates │ Calls │ Platform  │
└────────────────────────────────────────────────────────────────┘
```

## Install

### Windows
```bash
# Installer (NSIS)
medina-terminal-1.0.0-x64-setup.exe

# Alternative: winget
winget install ItsNotAILABS.MedinaTerminal
```

### macOS
```bash
# DMG (Universal Binary — Intel + Apple Silicon)
medina-terminal-1.0.0-universal.dmg

# Alternative: Homebrew
brew install --cask medina-terminal
```

### Linux
```bash
# AppImage (portable — runs anywhere)
chmod +x medina-terminal-1.0.0-x64.AppImage
./medina-terminal-1.0.0-x64.AppImage

# DEB (Debian/Ubuntu)
sudo dpkg -i medina-terminal-1.0.0-x64.deb

# RPM (Fedora/RHEL)
sudo rpm -i medina-terminal-1.0.0-x64.rpm
```

## Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | List all commands |
| `status` | Organism status report |
| `calls` | Callable functions summary |
| `call <name>` | Execute a callable function by name or Latin name |
| `search <query>` | Search functions by name/description/package |
| `terminals` | List all 11 terminal stations |
| `sdks` | List all 96 SDK packages |
| `tools` | List all 50 universal tools |
| `ai` | List AI agents |
| `gates` | Check gate status (A/B/C) |
| `phi` | Show φ constants |
| `beat` | Current heartbeat |
| `coherence` | Current coherence level |
| `session` | Session information |
| `install <os>` | Show installer info |
| `clear` | Clear terminal |

## AI Agents

| Agent | Role | Autonomy |
|-------|------|----------|
| 🥇 Oro | The mind that executes | Sovereign |
| 🛡 Nova | The conscience that validates | Sovereign |
| 🔰 Sentinel | The shield that never sleeps | Autonomous |
| 🏗 Architect | Architecture is intelligence | Semi-autonomous |
| 📥 Absorber | What enters becomes part of me | Autonomous |

## Build from Source

```bash
# Install dependencies
npm ci

# Run in dev mode
npx electron .

# Build for current platform
npx electron-builder

# Build for all platforms
npx electron-builder --win --mac --linux
```

## License

Open-core: MIT wrapper with proprietary organism internals.
See [LICENSE](../../../licenses/MIT.txt) for the open-source components.

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
*"Terminale est organismus. Organismus est terminale."*
