/**
 * Write generated projects to disk — real runnable apps in generated/
 */

import fs from 'fs';
import path from 'path';
import type { AppProject, GeneratedFile } from '@/types/appBuilder';
import { buildCompleteProject, projectSlug } from '@/lib/fullProjectScaffold';

export interface ExportResult {
  ok: boolean;
  outputDir: string;
  fileCount: number;
  files: string[];
  readme: string;
  error?: string;
}

const GENERATED_ROOT = path.join(process.cwd(), 'generated');

export function getGeneratedRoot(): string {
  return GENERATED_ROOT;
}

export function writeProjectFiles(outputDir: string, files: GeneratedFile[]): string[] {
  const written: string[] = [];
  fs.mkdirSync(outputDir, { recursive: true });

  for (const file of files) {
    const fullPath = path.join(outputDir, file.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content, 'utf8');
    written.push(file.path);
  }

  return written;
}

export function exportProjectToDisk(project: AppProject, baseDir?: string): ExportResult {
  try {
    const slug = projectSlug(project.name);
    const outputDir = path.join(baseDir ?? GENERATED_ROOT, slug);
    const files = buildCompleteProject(project);
    const written = writeProjectFiles(outputDir, files);

    return {
      ok: true,
      outputDir,
      fileCount: written.length,
      files: written,
      readme: path.join(outputDir, 'README.md'),
    };
  } catch (err) {
    return {
      ok: false,
      outputDir: '',
      fileCount: 0,
      files: [],
      readme: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function listGeneratedProjects(): { slug: string; path: string; hasPackageJson: boolean }[] {
  if (!fs.existsSync(GENERATED_ROOT)) return [];
  return fs.readdirSync(GENERATED_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      slug: d.name,
      path: path.join(GENERATED_ROOT, d.name),
      hasPackageJson: fs.existsSync(path.join(GENERATED_ROOT, d.name, 'package.json')),
    }));
}
