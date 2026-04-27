/**
 * 𓂀 MEDINA TERMINAL INSTALLER SDK 𓂀
 *
 * Cross-platform installer configuration for the MEDINA Sovereign Terminal.
 * Builds native installers for Windows (MSI/NSIS), macOS (DMG/PKG), and Linux (AppImage/DEB/RPM).
 *
 * The terminal is an organism — it has a heartbeat (873ms), gates (A/B/C),
 * 5 AI agents (Oro, Nova, Sentinel, Architect, Absorber), and 374+ callable functions.
 *
 * Architecture:
 *   Electron 28+ shell → Single-file HTML organism → Full SDK registry
 *   Each platform gets a native installer + auto-update channel
 *
 * "Terminale est organismus. Organismus est terminale."
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Platform = 'windows' | 'macos' | 'linux';
export type InstallerFormat = 'msi' | 'nsis' | 'dmg' | 'pkg' | 'appimage' | 'deb' | 'rpm';

export interface InstallerConfig {
  platform: Platform;
  formats: InstallerFormat[];
  appName: string;
  appId: string;
  version: string;
  description: string;
  icon: PlatformIcons;
  electronVersion: string;
  nodeVersion: string;
  entryPoint: string;
  features: string[];
  autoUpdate: boolean;
  updateChannel: string;
  signing: SigningConfig;
}

export interface PlatformIcons {
  windows: string;  // .ico
  macos: string;    // .icns
  linux: string;    // .png
}

export interface SigningConfig {
  enabled: boolean;
  certificate?: string;
  notarize?: boolean;  // macOS only
}

export interface ElectronMainConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  titleBarStyle: 'hidden' | 'default' | 'hiddenInset';
  backgroundColor: string;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    sandbox: boolean;
  };
}

export interface BuildOutput {
  platform: Platform;
  format: InstallerFormat;
  filename: string;
  size: string;
  sha256: string;
  downloadUrl: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const HEARTBEAT_MS = 873;
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'MEDINA Terminal';
export const APP_ID = 'com.itsnotailabs.medina-terminal';

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const WINDOWS_CONFIG: InstallerConfig = {
  platform: 'windows',
  formats: ['nsis', 'msi'],
  appName: APP_NAME,
  appId: APP_ID,
  version: APP_VERSION,
  description: 'Sovereign Organism Terminal — Windows Installer',
  icon: {
    windows: 'build/icons/medina-terminal.ico',
    macos: 'build/icons/medina-terminal.icns',
    linux: 'build/icons/medina-terminal.png',
  },
  electronVersion: '28.0.0',
  nodeVersion: '20',
  entryPoint: 'releases/terminal/medina-terminal/index.html',
  features: [
    'Sovereign organism terminal with 873ms heartbeat',
    '6 tabs: Terminal, Calls Registry, Chat, World, Tools, Settings',
    '374+ callable functions with Latin names',
    '96 SDK packages (11 core + 30 extended + 5 AI + 50 tools)',
    '5 AI agents: Oro, Nova, Sentinel, Architect, Absorber',
    'Three-gate security (A/B/C)',
    'World viewer — live SDK landing pages',
    'Cross-chain connectivity (ICP, ETH, BTC, SOL)',
    'φ-harmonic interface with particle field',
    'Native Windows integration (taskbar, notifications, system tray)',
  ],
  autoUpdate: true,
  updateChannel: 'stable',
  signing: {
    enabled: true,
    certificate: 'build/certs/windows-signing.pfx',
  },
};

export const MACOS_CONFIG: InstallerConfig = {
  platform: 'macos',
  formats: ['dmg', 'pkg'],
  appName: APP_NAME,
  appId: APP_ID,
  version: APP_VERSION,
  description: 'Sovereign Organism Terminal — macOS Installer',
  icon: {
    windows: 'build/icons/medina-terminal.ico',
    macos: 'build/icons/medina-terminal.icns',
    linux: 'build/icons/medina-terminal.png',
  },
  electronVersion: '28.0.0',
  nodeVersion: '20',
  entryPoint: 'releases/terminal/medina-terminal/index.html',
  features: [
    'Sovereign organism terminal with 873ms heartbeat',
    '6 tabs: Terminal, Calls Registry, Chat, World, Tools, Settings',
    '374+ callable functions with Latin names',
    '96 SDK packages (11 core + 30 extended + 5 AI + 50 tools)',
    '5 AI agents: Oro, Nova, Sentinel, Architect, Absorber',
    'Three-gate security (A/B/C)',
    'World viewer — live SDK landing pages',
    'Cross-chain connectivity (ICP, ETH, BTC, SOL)',
    'φ-harmonic interface with particle field',
    'Native macOS integration (dock, menu bar, Touch Bar)',
    'Universal Binary (Intel + Apple Silicon)',
  ],
  autoUpdate: true,
  updateChannel: 'stable',
  signing: {
    enabled: true,
    certificate: 'build/certs/macos-signing.p12',
    notarize: true,
  },
};

export const LINUX_CONFIG: InstallerConfig = {
  platform: 'linux',
  formats: ['appimage', 'deb', 'rpm'],
  appName: APP_NAME,
  appId: APP_ID,
  version: APP_VERSION,
  description: 'Sovereign Organism Terminal — Linux Installer',
  icon: {
    windows: 'build/icons/medina-terminal.ico',
    macos: 'build/icons/medina-terminal.icns',
    linux: 'build/icons/medina-terminal.png',
  },
  electronVersion: '28.0.0',
  nodeVersion: '20',
  entryPoint: 'releases/terminal/medina-terminal/index.html',
  features: [
    'Sovereign organism terminal with 873ms heartbeat',
    '6 tabs: Terminal, Calls Registry, Chat, World, Tools, Settings',
    '374+ callable functions with Latin names',
    '96 SDK packages (11 core + 30 extended + 5 AI + 50 tools)',
    '5 AI agents: Oro, Nova, Sentinel, Architect, Absorber',
    'Three-gate security (A/B/C)',
    'World viewer — live SDK landing pages',
    'Cross-chain connectivity (ICP, ETH, BTC, SOL)',
    'φ-harmonic interface with particle field',
    'AppImage (portable), DEB (Debian/Ubuntu), RPM (Fedora/RHEL)',
  ],
  autoUpdate: true,
  updateChannel: 'stable',
  signing: {
    enabled: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ELECTRON MAIN PROCESS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export const ELECTRON_MAIN_CONFIG: ElectronMainConfig = {
  width: 1400,
  height: 900,
  minWidth: 900,
  minHeight: 600,
  titleBarStyle: 'hidden',
  backgroundColor: '#0a0a0f',
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
  },
};

/**
 * Generate Electron main.js content for the terminal app
 */
export function generateElectronMain(): string {
  return `// 𓂀 MEDINA Terminal — Electron Main Process
const { app, BrowserWindow, Menu, Tray, nativeTheme } = require('electron');
const path = require('path');

const PHI = ${PHI};
const HEARTBEAT_MS = ${HEARTBEAT_MS};

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: ${ELECTRON_MAIN_CONFIG.width},
    height: ${ELECTRON_MAIN_CONFIG.height},
    minWidth: ${ELECTRON_MAIN_CONFIG.minWidth},
    minHeight: ${ELECTRON_MAIN_CONFIG.minHeight},
    titleBarStyle: '${ELECTRON_MAIN_CONFIG.titleBarStyle}',
    backgroundColor: '${ELECTRON_MAIN_CONFIG.backgroundColor}',
    icon: path.join(__dirname, 'build/icons/medina-terminal.png'),
    webPreferences: {
      nodeIntegration: ${ELECTRON_MAIN_CONFIG.webPreferences.nodeIntegration},
      contextIsolation: ${ELECTRON_MAIN_CONFIG.webPreferences.contextIsolation},
      sandbox: ${ELECTRON_MAIN_CONFIG.webPreferences.sandbox},
    },
  });

  mainWindow.loadFile('releases/terminal/medina-terminal/index.html');

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark';
  createWindow();

  // System tray
  tray = new Tray(path.join(__dirname, 'build/icons/medina-terminal.png'));
  tray.setToolTip('𓂀 MEDINA Terminal — Sovereign Organism');
  tray.on('click', () => {
    if (mainWindow) mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

console.log('𓂀 MEDINA Terminal v${APP_VERSION} — φ = ' + PHI);
`;
}

/**
 * Generate electron-builder.yml content for cross-platform builds
 */
export function generateBuilderConfig(): string {
  return `# 𓂀 MEDINA Terminal — electron-builder configuration
appId: "${APP_ID}"
productName: "${APP_NAME}"
copyright: "Copyright © 2026 ItsNotAILABS — Alfredo Medina Hernandez"

directories:
  output: dist
  buildResources: build

files:
  - "releases/terminal/medina-terminal/index.html"
  - "main.js"
  - "package.json"

win:
  target:
    - target: nsis
      arch: [x64, arm64]
    - target: msi
      arch: [x64]
  icon: build/icons/medina-terminal.ico
  artifactName: "medina-terminal-\${version}-\${arch}-setup.\${ext}"

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  installerIcon: build/icons/medina-terminal.ico
  uninstallerIcon: build/icons/medina-terminal.ico
  license: licenses/MIT.txt

mac:
  target:
    - target: dmg
      arch: [x64, arm64, universal]
    - target: pkg
      arch: [universal]
  icon: build/icons/medina-terminal.icns
  category: public.app-category.developer-tools
  artifactName: "medina-terminal-\${version}-\${arch}.\${ext}"
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist

dmg:
  title: "\${productName} \${version}"
  backgroundColor: "#0a0a0f"

linux:
  target:
    - target: AppImage
      arch: [x64, arm64]
    - target: deb
      arch: [x64, arm64]
    - target: rpm
      arch: [x64]
  icon: build/icons/medina-terminal.png
  category: Development
  artifactName: "medina-terminal-\${version}-\${arch}.\${ext}"
  synopsis: "Sovereign Organism Terminal"
  description: "Cross-platform sovereign terminal for the MEDINA Memory Systems organism with 374+ callable functions, 96 SDK packages, and 5 AI agents."

deb:
  depends:
    - gconf2
    - gconf-service
    - libnotify4
    - libappindicator1
    - libxtst6
    - libnss3

publish:
  provider: github
  owner: ItsNotAILABS
  repo: MedinaMemorySystems
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD OUTPUTS (expected artifacts)
// ═══════════════════════════════════════════════════════════════════════════

export const EXPECTED_OUTPUTS: BuildOutput[] = [
  // Windows
  { platform: 'windows', format: 'nsis', filename: 'medina-terminal-1.0.0-x64-setup.exe', size: '~85MB', sha256: '', downloadUrl: '' },
  { platform: 'windows', format: 'nsis', filename: 'medina-terminal-1.0.0-arm64-setup.exe', size: '~85MB', sha256: '', downloadUrl: '' },
  { platform: 'windows', format: 'msi', filename: 'medina-terminal-1.0.0-x64-setup.msi', size: '~90MB', sha256: '', downloadUrl: '' },
  // macOS
  { platform: 'macos', format: 'dmg', filename: 'medina-terminal-1.0.0-universal.dmg', size: '~120MB', sha256: '', downloadUrl: '' },
  { platform: 'macos', format: 'dmg', filename: 'medina-terminal-1.0.0-x64.dmg', size: '~80MB', sha256: '', downloadUrl: '' },
  { platform: 'macos', format: 'dmg', filename: 'medina-terminal-1.0.0-arm64.dmg', size: '~80MB', sha256: '', downloadUrl: '' },
  { platform: 'macos', format: 'pkg', filename: 'medina-terminal-1.0.0-universal.pkg', size: '~125MB', sha256: '', downloadUrl: '' },
  // Linux
  { platform: 'linux', format: 'appimage', filename: 'medina-terminal-1.0.0-x64.AppImage', size: '~85MB', sha256: '', downloadUrl: '' },
  { platform: 'linux', format: 'appimage', filename: 'medina-terminal-1.0.0-arm64.AppImage', size: '~85MB', sha256: '', downloadUrl: '' },
  { platform: 'linux', format: 'deb', filename: 'medina-terminal-1.0.0-x64.deb', size: '~60MB', sha256: '', downloadUrl: '' },
  { platform: 'linux', format: 'deb', filename: 'medina-terminal-1.0.0-arm64.deb', size: '~60MB', sha256: '', downloadUrl: '' },
  { platform: 'linux', format: 'rpm', filename: 'medina-terminal-1.0.0-x64.rpm', size: '~65MB', sha256: '', downloadUrl: '' },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getConfigForPlatform(platform: Platform): InstallerConfig {
  switch (platform) {
    case 'windows': return WINDOWS_CONFIG;
    case 'macos': return MACOS_CONFIG;
    case 'linux': return LINUX_CONFIG;
    default: throw new Error(`Unknown platform: ${platform}`);
  }
}

export function getAllConfigs(): InstallerConfig[] {
  return [WINDOWS_CONFIG, MACOS_CONFIG, LINUX_CONFIG];
}

export function getOutputsForPlatform(platform: Platform): BuildOutput[] {
  return EXPECTED_OUTPUTS.filter(o => o.platform === platform);
}

export const INSTALLER_MANIFEST = {
  app: APP_NAME,
  appId: APP_ID,
  version: APP_VERSION,
  platforms: ['windows', 'macos', 'linux'] as Platform[],
  totalInstallers: EXPECTED_OUTPUTS.length,
  electronVersion: '28.0.0',
  nodeVersion: '20',
  entryPoint: 'releases/terminal/medina-terminal/index.html',
  features: {
    tabs: 6,
    callableFunctions: 374,
    sdkPackages: 96,
    universalTools: 50,
    aiAgents: 5,
    terminals: 11,
  },
  heartbeatMs: HEARTBEAT_MS,
  phi: PHI,
  doctrine: 'Terminale est organismus. Organismus est terminale.',
};
