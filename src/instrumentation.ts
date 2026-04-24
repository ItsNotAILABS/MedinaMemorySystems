// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 INSTRUMENTATION — ORGANISM BOOT AT PROCESS START 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Next.js instrumentation hook. This file runs ONCE when the server process
 * starts — before any page load, before any request, before any user action.
 *
 * "There's no page load. There's no nothing. This is the whole system.
 *  They should have been on 10 seconds ago."
 *
 * When the Next.js server process boots:
 *   1. All 100 micro worker careers come online immediately
 *   2. All 260 marketplace tools register and activate
 *   3. All 55 enterprise protocols begin flowing
 *   4. Heartbeats start pulsing at φ-derived intervals
 *   5. The organism is alive before any client connects
 *   6. Any user who opens a page sees everything already running
 *
 * This is the production enterprise. Always on.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export async function register() {
  // Only boot on the server side (not in Edge runtime or client)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof globalThis !== 'undefined' && typeof (globalThis as Record<string, unknown>).process !== 'undefined') {
    const proc = (globalThis as Record<string, unknown>).process as { env?: Record<string, string | undefined> };
    if (proc.env?.NEXT_RUNTIME === 'nodejs') {
      console.log('[𓂀 INSTRUMENTATION] Next.js server process starting — booting organism...');

      // 1. Boot all 100 career flows
      const { bootServerWorkers } = await import(
        '@/organism/workers/ServerWorkerRuntime'
      );
      bootServerWorkers();
      console.log('[𓂀 INSTRUMENTATION] 100 careers flowing. No page load needed.');

      // 2. Boot the Call Marketplace (260 tools + 55 protocols)
      const { bootCallMarketplace } = await import(
        '@/lib/callMarketplaceEngine'
      );
      bootCallMarketplace();
      console.log('[𓂀 INSTRUMENTATION] Call Marketplace LIVE. 260 tools registered. 55 protocols active.');

      console.log('[𓂀 INSTRUMENTATION] Organism is FULLY ALIVE. Workers + Marketplace + Protocols. Always on.');
    }
  }
}
