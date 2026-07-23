/**
 * Capsule Registry — WASM / canister / sovereign bundles
 */

import { sovereignId } from '@/lib/sovereign-id';
import type { CapsuleKind, CapsuleManifest, GeneratedFile } from '@/types/appBuilder';

const capsules: Map<string, CapsuleManifest> = new Map();

export function createCapsule(input: {
  name: string;
  kind: CapsuleKind;
  files: GeneratedFile[];
  companyVaultRefs?: string[];
}): CapsuleManifest {
  const id = sovereignId();
  const exports = input.files
    .filter((f) => !f.internal)
    .map((f) => f.path.replace(/[^a-zA-Z0-9]/g, '_'));

  const manifest: CapsuleManifest = {
    id,
    name: input.name,
    version: '1.0.0',
    kind: input.kind,
    wasmHash: input.kind === 'wasm-module' ? `sha256:${id.slice(0, 16)}` : undefined,
    candidPath: input.files.find((f) => f.path.endsWith('.did'))?.path,
    exports,
    imports: input.companyVaultRefs ?? [],
    companyVaultRefs: input.companyVaultRefs ?? [],
    createdAt: new Date().toISOString(),
  };
  capsules.set(id, manifest);
  return manifest;
}

export function listCapsules(): CapsuleManifest[] {
  return Array.from(capsules.values());
}

export function getCapsule(id: string): CapsuleManifest | undefined {
  return capsules.get(id);
}

export function buildWasmCapsule(name: string, files: GeneratedFile[]): { capsule: CapsuleManifest; wasmBundle: GeneratedFile } {
  const capsule = createCapsule({
    name,
    kind: 'wasm-module',
    files,
    companyVaultRefs: files.filter((f) => f.internal).map((f) => f.path),
  });

  const wasmBundle: GeneratedFile = {
    path: `capsules/${name}.wasm`,
    language: 'wasm',
    content: `// WASM capsule ${capsule.id}\n// Build: wasm-pack build --target web\n// Modules: ${capsule.exports.join(', ')}`,
    internal: false,
  };

  return { capsule, wasmBundle };
}

export function buildSovereignBundle(name: string, files: GeneratedFile[]): CapsuleManifest {
  return createCapsule({ name, kind: 'sovereign-bundle', files, companyVaultRefs: ['medina-auth', 'medina-phi-crypto'] });
}
