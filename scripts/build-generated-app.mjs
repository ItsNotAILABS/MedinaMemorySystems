#!/usr/bin/env node
/**
 * Build a real runnable app on disk from App Builder.
 * Usage: node scripts/build-generated-app.mjs [projectId]
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

console.log('📁 Exporting project to disk...');
execSync('npx tsx scripts/export-app.ts ' + (process.argv[2] ?? ''), {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

// Read output dir from generated folder (latest or demo)
import fs from 'fs';
const generatedRoot = path.join(root, 'generated');
const slug = process.argv[2]
  ? fs.readdirSync(generatedRoot).find(Boolean)
  : 'medina-demo-app';
const outDir = path.join(generatedRoot, slug ?? 'medina-demo-app');

if (!fs.existsSync(path.join(outDir, 'package.json'))) {
  console.error('No package.json found at', outDir);
  process.exit(1);
}

console.log('\n📦 Installing dependencies...');
execSync('npm install', { cwd: outDir, stdio: 'inherit' });

console.log('\n🔨 Building...');
execSync('npm run build', { cwd: outDir, stdio: 'inherit' });

console.log('\n✅ App built at:', outDir);
console.log('   Run: cd', outDir, '&& npm run dev');
