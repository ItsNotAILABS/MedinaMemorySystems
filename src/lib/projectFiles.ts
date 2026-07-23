/**
 * Client-safe project file resolution (no Node fs)
 */
import type { AppProject, GeneratedFile } from '@/types/appBuilder';
import { buildCompleteProject } from '@/lib/fullProjectScaffold';

export interface ExportResult {
  ok: boolean;
  outputDir: string;
  fileCount: number;
  files: string[];
  readme: string;
  error?: string;
}

export function resolveProjectFiles(project: AppProject): GeneratedFile[] {
  const files = buildCompleteProject(project);
  if (!project.fileOverrides) return files;
  return files.map((f) => ({
    ...f,
    content: project.fileOverrides![f.path] ?? f.content,
  }));
}
