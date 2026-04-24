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
 *   1. All 100 micro workers come online immediately
 *   2. Heartbeats start pulsing at φ-derived intervals
 *   3. The organism is alive before any client connects
 *   4. Any user who opens a page sees workers already running
 *
 * This is the production enterprise. Always on.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export async function register() {
  // Only boot workers on the server side (not in Edge runtime or client)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { bootServerWorkers } = await import(
      '@/organism/workers/ServerWorkerRuntime'
    );

    console.log('[𓂀 INSTRUMENTATION] Next.js server process starting — booting organism...');
    bootServerWorkers();
    console.log('[𓂀 INSTRUMENTATION] Organism is ALIVE. 100 micro workers running. No page load needed.');
  }
}
