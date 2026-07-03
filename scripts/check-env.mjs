#!/usr/bin/env node
/** Pre-flight checks before starting the builder */
import { execSync } from 'child_process';

const major = Number(process.version.slice(1).split('.')[0]);
if (major < 20) {
  console.error(`\n❌ Node ${process.version} is too old. Install Node 20+ or 22 LTS from https://nodejs.org\n`);
  process.exit(1);
}
if (major < 22) {
  console.warn(`\n⚠️  Node ${process.version} works, but Node 22 LTS is recommended.\n`);
}

try {
  execSync('npm ls --prefix apps/medina-builder next --depth=0', { stdio: 'ignore' });
} catch {
  console.log('📦 Installing medina-builder dependencies…');
  execSync('npm install --prefix apps/medina-builder', { stdio: 'inherit' });
}
