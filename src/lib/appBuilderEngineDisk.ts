/**
 * Server-only disk export for App Builder (uses fs — do not import from client bundles)
 */
import { getProject, scaffold } from '@/lib/appBuilderEngine';
import {
  exportProjectToDisk as writeProjectToDisk,
  listGeneratedProjects,
} from '@/lib/projectExporter';
import type { ExportResult } from '@/lib/projectFiles';

export function exportProjectToDisk(id: string, baseDir?: string): ExportResult | undefined {
  const project = getProject(id);
  if (!project) return undefined;
  if (!project.artifacts.find((a) => a.kind === 'source-bundle')) scaffold(id);
  const result = writeProjectToDisk(project, baseDir);
  if (result.ok) {
    project.status = 'built';
    project.updatedAt = new Date().toISOString();
  }
  return result;
}

export { listGeneratedProjects, type ExportResult };
