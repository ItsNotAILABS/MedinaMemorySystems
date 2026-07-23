/**
 * Server-only project persistence — survives medina-builder restarts
 */
import fs from 'fs';
import path from 'path';
import { getRepoRoot } from '@/lib/localTerminal';
import type { StudioCapabilities } from '@/lib/studioCapabilities';
import type { AppProject } from '@/types/appBuilder';

const STATE_PATH = () => path.join(getRepoRoot(), 'generated', '.medina-studio-state.json');

export function loadProjectsFromDisk(): AppProject[] {
  try {
    const p = STATE_PATH();
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, 'utf8')) as { projects?: AppProject[] };
    return data.projects ?? [];
  } catch {
    return [];
  }
}

export function saveProjectsToDisk(projects: AppProject[]): void {
  const p = STATE_PATH();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify({ projects, savedAt: new Date().toISOString() }, null, 2), 'utf8');
}

export function getStudioCapabilities(): StudioCapabilities {
  return {
    serverMode: true,
    terminal: true,
    orchestrate: true,
    diskExport: true,
    livePreview: true,
    pythonOrchestrator: fs.existsSync(path.join(getRepoRoot(), 'integrations/builder-orchestrator/orchestrator.py')),
    generatedRoot: path.join(getRepoRoot(), 'generated'),
  };
}
