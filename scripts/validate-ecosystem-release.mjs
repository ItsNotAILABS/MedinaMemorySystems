import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'docs/release-harness/README.md',
  'docs/release-harness/model-cards/medina-memory-continuity.md',
  'docs/release-harness/release-packages/v1.0.0/RELEASE.md',
  'docs/release-harness/release-packages/v1.0.0/release-manifest.json',
  'schemas/ecosystem-feeder.schema.json',
  'schemas/memory-release.schema.json'
];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `missing ${file}`);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/release-harness/release-packages/v1.0.0/release-manifest.json'), 'utf8'));
assert.equal(manifest.schema, 'nova-ecosystem-feeder-release-v1');
assert.equal(manifest.repo, 'ItsNotAILABS/MedinaMemorySystems');
assert.ok(Array.isArray(manifest.evidence) && manifest.evidence.length >= 5);
assert.ok(Array.isArray(manifest.boundaries) && manifest.boundaries.includes('no unbounded memory retention claim'));
assert.equal(manifest.approvals.operator, false);
const banned = [/perfect memory/i, /guaranteed recall/i, /private data exfiltration/i, /unbounded retention/i];
for (const file of required) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const pattern of banned) assert.equal(pattern.test(text), false, `${file} contains banned phrase ${pattern}`);
}
console.log(JSON.stringify({ ok: true, checked: required.length, release: manifest.release }, null, 2));
