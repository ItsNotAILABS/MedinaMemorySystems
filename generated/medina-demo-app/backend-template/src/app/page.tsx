// [INTERNAL] Medina Sovereign Auth
import '@medina/vault/auth';
// [INTERNAL] Memory Temple Bridge
import '@medina/vault/memory';
// [INTERNAL] Governance Hooks
import '@medina/vault/governance';
// [INTERNAL] Phi Encryption Layer
import '@medina/vault/crypto';
// [INTERNAL] INT-TOK Exchange
import '@medina/vault/int-tok';
// [INTERNAL] CORTEX WASM Runtime
import '@medina/vault/wasm-cortex';
// [INTERNAL] Deploy Orchestrator
import '@medina/vault/deploy';

'use client';

export default function TaskPage() {
  return (
    <main style={{ background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh', padding: 24 }}>
      <h1 style={{ color: '#6366f1' }}>Medina Demo App</h1>
      <p>Auto-generated runnable demo from Company App Builder</p>
      <section className="grid gap-4 mt-8">
        {/* Task CRUD — crud-admin */}
      </section>
    </main>
  );
}
