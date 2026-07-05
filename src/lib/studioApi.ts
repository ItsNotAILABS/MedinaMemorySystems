/**
 * Studio API bootstrap — hydrate + persist (medina-builder server only)
 */
import {
  hydrateProjects,
  listProjects,
  createProject,
  getProject,
  updateProjectFile,
  exportProjectToDisk,
} from '@/lib/appBuilderEngine';
import { loadProjectsFromDisk, saveProjectsToDisk, getStudioCapabilities } from '@/lib/studioPersistence';
import { orchestrateBuild, orchestrateFromPrompt } from '@/lib/buildOrchestrator';
import type { ShellKind } from '@/lib/localTerminal';
import type { DeployTarget, TokenSpec } from '@/types/appBuilder';

let hydrated = false;

export function ensureStudioHydrated(): void {
  if (hydrated) return;
  hydrateProjects(loadProjectsFromDisk());
  hydrated = true;
}

export function persistStudio(): void {
  saveProjectsToDisk(listProjects());
}

export function studioCapabilities() {
  ensureStudioHydrated();
  return getStudioCapabilities();
}

export function studioCreate(input: Parameters<typeof createProject>[0]) {
  ensureStudioHydrated();
  const project = createProject(input);
  persistStudio();
  return project;
}

export function studioUpdateFile(id: string, filePath: string, content: string) {
  ensureStudioHydrated();
  const project = updateProjectFile(id, filePath, content);
  if (project) persistStudio();
  return project;
}

export function studioExportDisk(id: string) {
  ensureStudioHydrated();
  const result = exportProjectToDisk(id);
  if (result?.ok) persistStudio();
  return result;
}

export async function studioBuildAndRun(
  projectId: string,
  opts: { shell?: ShellKind; sessionId?: string } = {},
) {
  ensureStudioHydrated();
  const project = getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found' };
  const result = await orchestrateBuild(project, opts);
  if (result.ok) {
    const updated = getProject(projectId);
    if (updated) {
      updated.status = 'built';
      persistStudio();
    }
  }
  return result;
}

export async function studioFromPrompt(
  projectId: string,
  prompt: string,
  opts: { shell?: ShellKind; sessionId?: string } = {},
) {
  ensureStudioHydrated();
  const project = getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found', message: 'Project not found' };
  const result = await orchestrateFromPrompt(project, prompt, opts);
  if (result.ok) persistStudio();
  return result;
}

export { listProjects, getProject, createProject };
