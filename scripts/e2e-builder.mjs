#!/usr/bin/env node
/**
 * End-to-end Medina Studio builder test (requires medina-builder on port 3001)
 * Usage: node scripts/e2e-builder.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? 'http://localhost:3001';
const TIMEOUT_MS = 240_000;

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const { data } = await fetchJson('/api/builder?action=capabilities');
      if (data.success) return data.data;
    } catch { /* retry */ }
    await sleep(1000);
  }
  throw new Error(`Server not reachable at ${BASE}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`[e2e] Medina Studio E2E → ${BASE}`);
  const caps = await waitForServer();
  console.log('[e2e] capabilities:', JSON.stringify(caps));
  if (!caps.serverMode) throw new Error('Expected serverMode=true');

  const name = `E2E-${Date.now()}`;
  console.log(`[e2e] create-and-run: ${name}`);
  const { status, data } = await fetchJson('/api/builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create-and-run',
      name,
      templateId: 'saas-crud-python',
      deployTarget: 'saas-vercel',
      sessionId: 'e2e',
      shell: process.platform === 'win32' ? 'powershell' : 'bash',
    }),
  });

  if (!data.success) {
    console.error('[e2e] create-and-run failed:', data);
    process.exit(1);
  }

  const previewUrl = data.data?.previewUrl?.replace('localhost', '127.0.0.1');
  const projectDir = data.data?.projectDir;
  console.log('[e2e] build result:', { status, previewUrl, projectDir, fileCount: data.data?.fileCount });

  if (!previewUrl) throw new Error('No previewUrl returned');

  const deadline = Date.now() + TIMEOUT_MS;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(previewUrl);
      if (res.ok) {
        ready = true;
        console.log(`[e2e] preview OK (${res.status}) → ${previewUrl}`);
        break;
      }
    } catch { /* warming up */ }
    await sleep(2000);
  }

  if (!ready) throw new Error(`Preview not ready: ${previewUrl}`);

  const { data: projects } = await fetchJson('/api/builder?action=projects');
  const found = projects.data?.find((p) => p.name === name);
  console.log('[e2e] persisted project:', found ? found.id : 'NOT FOUND');
  if (!found) throw new Error('Project not persisted');

  console.log('[e2e] PASS');
}

main().catch((err) => {
  console.error('[e2e] FAIL:', err.message);
  process.exit(1);
});
