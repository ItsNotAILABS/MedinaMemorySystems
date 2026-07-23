#!/usr/bin/env node
/**
 * Export App Builder project to disk (no npm install/build).
 * Usage: npx tsx scripts/export-app.ts [projectId]
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const r = spawnSync(
  'npx',
  ['tsx', path.join(root, 'scripts/export-app.ts'), ...process.argv.slice(2)],
  { cwd: root, stdio: 'inherit', shell: true }
);
process.exit(r.status ?? 1);
