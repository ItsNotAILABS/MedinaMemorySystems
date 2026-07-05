/** Shared capability flags — static (browser) vs server (medina-builder) */

export interface StudioCapabilities {
  serverMode: boolean;
  terminal: boolean;
  orchestrate: boolean;
  diskExport: boolean;
  livePreview: boolean;
  pythonOrchestrator: boolean;
  generatedRoot: string | null;
}

export const SERVER_MODE_HINT = 'Run Medina Studio server: npm run builder:dev (port 3001)';

export function staticStudioCapabilities(): StudioCapabilities {
  return {
    serverMode: false,
    terminal: false,
    orchestrate: false,
    diskExport: false,
    livePreview: false,
    pythonOrchestrator: false,
    generatedRoot: null,
  };
}

export function serverModeRequiredResponse() {
  return {
    success: false,
    error: `Server mode required. ${SERVER_MODE_HINT}`,
    hint: SERVER_MODE_HINT,
    timestamp: new Date().toISOString(),
  };
}
