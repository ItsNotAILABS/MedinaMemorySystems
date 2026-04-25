/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN LANGUAGE TEST SUITE
 * De Lingua Quae Compressit Mundum
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Verifies:
 *   1. All four canonical terms are present and fully typed
 *   2. SOVEREIGN_LEXICON is queryable and complete
 *   3. compress() encodes expanded forms into symbols
 *   4. expand() decodes symbols to full DoctrinalExpansion
 *   5. PHI consistency: same value across all modules
 *   6. Protocol extension doctrine is complete
 *   7. Wiring: SL_0 re-exported from sovereignCoreFlow
 *   8. Wiring: S0 re-exported from genesisAutonomousRuntime
 *   9. Wiring: PORTA_SOVEREIGNA re-exported from gateEnforcement
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  SL_0,
  S0,
  PHI_SYMBOL,
  PORTA_SOVEREIGNA,
  SOVEREIGN_LEXICON,
  SOVEREIGN_SYMBOLS,
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  compress,
  expand,
  expandAll,
  totalCompressionWeight,
  PROTOCOL_EXTENSION_DOCTRINE,
  type DoctrinalExpansion,
  type SovereignSymbol,
} from '../lib/sovereignLanguage';

// ─── §1 Four Canonical Terms Present ─────────────────────────────────────────

describe('Sovereign Language — Four Canonical Terms', () => {
  it('SL_0 is defined with correct symbol', () => {
    expect(SL_0).toBeDefined();
    expect(SL_0.symbol).toBe('SL-0');
  });

  it('S0 is defined with correct symbol', () => {
    expect(S0).toBeDefined();
    expect(S0.symbol).toBe('S₀');
  });

  it('PHI_SYMBOL is defined with correct symbol', () => {
    expect(PHI_SYMBOL).toBeDefined();
    expect(PHI_SYMBOL.symbol).toBe('φ');
  });

  it('PORTA_SOVEREIGNA is defined with correct symbol', () => {
    expect(PORTA_SOVEREIGNA).toBeDefined();
    expect(PORTA_SOVEREIGNA.symbol).toBe('PORTA SOVEREIGNA');
  });
});

// ─── §2 DoctrinalExpansion Shape ─────────────────────────────────────────────

describe('Sovereign Language — DoctrinalExpansion completeness', () => {
  const terms = [SL_0, S0, PHI_SYMBOL, PORTA_SOVEREIGNA];

  it.each(terms)('$symbol has all required fields', (term: DoctrinalExpansion) => {
    expect(typeof term.symbol).toBe('string');
    expect(term.symbol.length).toBeGreaterThan(0);
    expect(typeof term.latin).toBe('string');
    expect(term.latin.length).toBeGreaterThan(0);
    expect(typeof term.english).toBe('string');
    expect(term.english.length).toBeGreaterThan(0);
    expect(['identity', 'origin', 'mathematics', 'gateway']).toContain(term.domain);
    expect(typeof term.weight).toBe('number');
    expect(term.weight).toBeGreaterThan(0);
    expect(Array.isArray(term.compresses)).toBe(true);
    expect(term.compresses.length).toBeGreaterThan(0);
    expect(typeof term.doctrine).toBe('string');
    expect(term.doctrine.length).toBeGreaterThan(0);
  });

  it('each term has at least as many compresses entries as its weight', () => {
    for (const term of terms) {
      expect(term.compresses.length).toBe(term.weight);
    }
  });
});

// ─── §3 Correct Latin Names ───────────────────────────────────────────────────

describe('Sovereign Language — Latin names', () => {
  it('SL-0 has correct Latin name', () => {
    expect(SL_0.latin).toBe('Stratum Sovereignum Nullum');
  });

  it('S₀ has correct Latin name', () => {
    expect(S0.latin).toBe('Status Originis Sovereigni');
  });

  it('φ has correct Latin name', () => {
    expect(PHI_SYMBOL.latin).toBe('Sectio Aurea');
  });

  it('PORTA SOVEREIGNA has correct Latin name', () => {
    expect(PORTA_SOVEREIGNA.latin).toBe('Porta Sovereigna');
  });
});

// ─── §4 Correct Domains ──────────────────────────────────────────────────────

describe('Sovereign Language — Domains', () => {
  it('SL-0 domain is identity', () => expect(SL_0.domain).toBe('identity'));
  it('S₀ domain is origin', () => expect(S0.domain).toBe('origin'));
  it('φ domain is mathematics', () => expect(PHI_SYMBOL.domain).toBe('mathematics'));
  it('PORTA SOVEREIGNA domain is gateway', () => expect(PORTA_SOVEREIGNA.domain).toBe('gateway'));
});

// ─── §5 Compression Weights ───────────────────────────────────────────────────

describe('Sovereign Language — Compression weights', () => {
  it('SL-0 weight is 8', () => expect(SL_0.weight).toBe(8));
  it('S₀ weight is 6', () => expect(S0.weight).toBe(6));
  it('φ weight is 12', () => expect(PHI_SYMBOL.weight).toBe(12));
  it('PORTA SOVEREIGNA weight is 7', () => expect(PORTA_SOVEREIGNA.weight).toBe(7));

  it('total compression weight is 33', () => {
    expect(totalCompressionWeight()).toBe(33);
  });

  it('φ has the highest compression weight', () => {
    const weights = [SL_0, S0, PHI_SYMBOL, PORTA_SOVEREIGNA].map((t) => t.weight);
    expect(Math.max(...weights)).toBe(PHI_SYMBOL.weight);
  });
});

// ─── §6 SOVEREIGN_LEXICON ────────────────────────────────────────────────────

describe('Sovereign Language — SOVEREIGN_LEXICON', () => {
  it('contains all four canonical symbols', () => {
    expect(SOVEREIGN_LEXICON['SL-0']).toBeDefined();
    expect(SOVEREIGN_LEXICON['S₀']).toBeDefined();
    expect(SOVEREIGN_LEXICON['φ']).toBeDefined();
    expect(SOVEREIGN_LEXICON['PORTA SOVEREIGNA']).toBeDefined();
  });

  it('has exactly four entries', () => {
    expect(Object.keys(SOVEREIGN_LEXICON).length).toBe(4);
  });

  it('SOVEREIGN_SYMBOLS lists all four in canonical order', () => {
    expect(SOVEREIGN_SYMBOLS).toEqual(['SL-0', 'S₀', 'φ', 'PORTA SOVEREIGNA']);
    expect(SOVEREIGN_SYMBOLS.length).toBe(4);
  });

  it('every SOVEREIGN_SYMBOLS entry is in SOVEREIGN_LEXICON', () => {
    for (const sym of SOVEREIGN_SYMBOLS) {
      expect(SOVEREIGN_LEXICON[sym]).toBeDefined();
    }
  });

  it('expandAll() returns all four in canonical order', () => {
    const all = expandAll();
    expect(all.length).toBe(4);
    expect(all[0].symbol).toBe('SL-0');
    expect(all[1].symbol).toBe('S₀');
    expect(all[2].symbol).toBe('φ');
    expect(all[3].symbol).toBe('PORTA SOVEREIGNA');
  });
});

// ─── §7 expand() API ─────────────────────────────────────────────────────────

describe('Sovereign Language — expand()', () => {
  it('expand("SL-0") returns SL_0', () => {
    const e = expand('SL-0');
    expect(e).toBeDefined();
    expect(e!.symbol).toBe('SL-0');
    expect(e!.english).toBe('Sovereign Layer Zero');
  });

  it('expand("S₀") returns S0', () => {
    const e = expand('S₀');
    expect(e).toBeDefined();
    expect(e!.symbol).toBe('S₀');
    expect(e!.english).toBe('Sovereign Origin State');
  });

  it('expand("φ") returns PHI_SYMBOL', () => {
    const e = expand('φ');
    expect(e).toBeDefined();
    expect(e!.symbol).toBe('φ');
    expect(e!.english).toBe('The Golden Section');
  });

  it('expand("PORTA SOVEREIGNA") returns PORTA_SOVEREIGNA', () => {
    const e = expand('PORTA SOVEREIGNA');
    expect(e).toBeDefined();
    expect(e!.symbol).toBe('PORTA SOVEREIGNA');
    expect(e!.english).toBe('The Sovereign Gateway');
  });

  it('expand() returns undefined for unknown symbol', () => {
    expect(expand('UNKNOWN')).toBeUndefined();
    expect(expand('')).toBeUndefined();
    expect(expand('sl-0')).toBeUndefined(); // case-sensitive
  });
});

// ─── §8 compress() API ───────────────────────────────────────────────────────

describe('Sovereign Language — compress()', () => {
  it('compresses "Sovereign Layer Zero" to "SL-0"', () => {
    const result = compress('Sovereign Layer Zero enforces all identity operations.');
    expect(result).toContain('SL-0');
    expect(result).not.toContain('Sovereign Layer Zero');
  });

  it('compresses "Sovereign Origin State" to "S₀"', () => {
    const result = compress('The Sovereign Origin State is the genesis point.');
    expect(result).toContain('S₀');
    expect(result).not.toContain('Sovereign Origin State');
  });

  it('compresses "The Golden Section" to "φ"', () => {
    const result = compress('The Golden Section is the coherence constant.');
    expect(result).toContain('φ');
    expect(result).not.toContain('The Golden Section');
  });

  it('compresses "The Sovereign Gateway" to "PORTA SOVEREIGNA"', () => {
    const result = compress('All signals pass through The Sovereign Gateway.');
    expect(result).toContain('PORTA SOVEREIGNA');
    expect(result).not.toContain('The Sovereign Gateway');
  });

  it('compresses Latin name "Stratum Sovereignum Nullum" to "SL-0"', () => {
    const result = compress('Stratum Sovereignum Nullum est fundamentum.');
    expect(result).toContain('SL-0');
  });

  it('compresses Latin name "Sectio Aurea" to "φ"', () => {
    const result = compress('Sectio Aurea est constans cohaerens.');
    expect(result).toContain('φ');
  });

  it('is case-insensitive for English terms', () => {
    const result = compress('sovereign layer zero is the base.');
    expect(result).toContain('SL-0');
  });

  it('returns unchanged string when no known terms are present', () => {
    const input = 'This sentence contains no sovereign terms.';
    expect(compress(input)).toBe(input);
  });

  it('compresses multiple terms in one statement', () => {
    const result = compress(
      'Sovereign Layer Zero secures access through The Sovereign Gateway, guided by The Golden Section.'
    );
    expect(result).toContain('SL-0');
    expect(result).toContain('PORTA SOVEREIGNA');
    expect(result).toContain('φ');
  });
});

// ─── §9 Compress-Expand Round-trip ───────────────────────────────────────────

describe('Sovereign Language — lossless round-trip proof', () => {
  it('compress(english) then expand(symbol) recovers the original expansion for SL-0', () => {
    const original = expand('SL-0')!;
    const compressed = compress(original.english);
    const recovered = expand(compressed.trim());
    expect(recovered).toBeDefined();
    expect(recovered!.symbol).toBe(original.symbol);
  });

  it('compress(english) then expand(symbol) recovers the original expansion for S₀', () => {
    const original = expand('S₀')!;
    const compressed = compress(original.english);
    const recovered = expand(compressed.trim());
    expect(recovered).toBeDefined();
    expect(recovered!.symbol).toBe(original.symbol);
  });

  it('compress(english) then expand(symbol) recovers the original expansion for φ', () => {
    const original = expand('φ')!;
    const compressed = compress(original.english);
    const recovered = expand(compressed.trim());
    expect(recovered).toBeDefined();
    expect(recovered!.symbol).toBe(original.symbol);
  });

  it('compress(english) then expand(symbol) recovers the original expansion for PORTA SOVEREIGNA', () => {
    const original = expand('PORTA SOVEREIGNA')!;
    const compressed = compress(original.english);
    const recovered = expand(compressed.trim());
    expect(recovered).toBeDefined();
    expect(recovered!.symbol).toBe(original.symbol);
  });
});

// ─── §10 PHI Consistency ─────────────────────────────────────────────────────

describe('Sovereign Language — PHI consistency', () => {
  it('PHI is 1.6180339887498948482', () => {
    expect(PHI).toBe(1.6180339887498948482);
  });

  it('PHI matches the value in kernelCompression', async () => {
    const { PHI: PHI_KC } = await import('../lib/kernelCompression');
    expect(PHI).toBe(PHI_KC);
  });

  it('PHI matches the value in novaSovereignEncryption', async () => {
    const { PHI: PHI_NSE } = await import('../lib/novaSovereignEncryption');
    expect(PHI).toBeCloseTo(PHI_NSE, 10);
  });

  it('PHI self-reference proof: PHI * PHI - PHI === 1 (within float precision)', () => {
    expect(PHI * PHI - PHI).toBeCloseTo(1, 10);
  });

  it('PHI_INVERSE is 1/PHI', () => {
    expect(PHI_INVERSE).toBeCloseTo(1 / PHI, 15);
  });

  it('PHI_SQUARED is PHI * PHI', () => {
    expect(PHI_SQUARED).toBeCloseTo(PHI * PHI, 10);
  });

  it('PHI_CUBED is PHI * PHI * PHI', () => {
    expect(PHI_CUBED).toBeCloseTo(PHI * PHI * PHI, 8);
  });

  it('PHI self-reference: PHI² = PHI + 1 (the golden section law)', () => {
    expect(PHI_SQUARED).toBeCloseTo(PHI + 1, 10);
  });

  it('PHI_SYMBOL.doctrine references the self-reference proof', () => {
    expect(PHI_SYMBOL.doctrine).toContain('1 + 1/φ');
  });
});

// ─── §11 Protocol Extension Doctrine ─────────────────────────────────────────

describe('Sovereign Language — Protocol Extension Doctrine', () => {
  const extensions = ['.mdn', '.ovo', '.arc'] as const;

  it.each(extensions)('%s has all required fields', (ext) => {
    const doc = PROTOCOL_EXTENSION_DOCTRINE[ext];
    expect(doc).toBeDefined();
    expect(doc.extension).toBe(ext);
    expect(typeof doc.latin).toBe('string');
    expect(doc.latin.length).toBeGreaterThan(0);
    expect(typeof doc.english).toBe('string');
    expect(doc.english.length).toBeGreaterThan(0);
    expect(typeof doc.etymology).toBe('string');
    expect(doc.etymology.length).toBeGreaterThan(0);
    expect(typeof doc.compressionWeight).toBe('number');
    expect(doc.compressionWeight).toBeGreaterThan(0);
    expect(SOVEREIGN_SYMBOLS).toContain(doc.sovereignSymbol as SovereignSymbol);
    expect(typeof doc.example).toBe('string');
    expect(doc.example).toContain(ext);
  });

  it('.mdn is linked to SL-0', () => {
    expect(PROTOCOL_EXTENSION_DOCTRINE['.mdn'].sovereignSymbol).toBe('SL-0');
  });

  it('.ovo is linked to S₀', () => {
    expect(PROTOCOL_EXTENSION_DOCTRINE['.ovo'].sovereignSymbol).toBe('S₀');
  });

  it('.arc is linked to φ', () => {
    expect(PROTOCOL_EXTENSION_DOCTRINE['.arc'].sovereignSymbol).toBe('φ');
  });

  it('.arc has the highest compression weight among extensions', () => {
    const weights = extensions.map((e) => PROTOCOL_EXTENSION_DOCTRINE[e].compressionWeight);
    expect(Math.max(...weights)).toBe(PROTOCOL_EXTENSION_DOCTRINE['.arc'].compressionWeight);
  });
});

// ─── §12 Wiring — SL_0 re-exported from sovereignCoreFlow ───────────────────

describe('Sovereign Language — Wiring: SL_0 from sovereignCoreFlow', () => {
  it('sovereignCoreFlow re-exports SL_0 with correct symbol', async () => {
    const { SL_0: wiredSL0 } = await import('../lib/sovereignCoreFlow');
    expect(wiredSL0).toBeDefined();
    expect(wiredSL0.symbol).toBe('SL-0');
    expect(wiredSL0.domain).toBe('identity');
  });

  it('sovereignCoreFlow SL_0 is the same object as in sovereignLanguage', async () => {
    const { SL_0: wiredSL0 } = await import('../lib/sovereignCoreFlow');
    expect(wiredSL0.latin).toBe(SL_0.latin);
    expect(wiredSL0.weight).toBe(SL_0.weight);
  });
});

// ─── §13 Wiring — S0 re-exported from genesisAutonomousRuntime ──────────────

describe('Sovereign Language — Wiring: S0 from genesisAutonomousRuntime', () => {
  it('genesisAutonomousRuntime re-exports S0 with correct symbol', async () => {
    const { S0: wiredS0 } = await import('../lib/genesisAutonomousRuntime');
    expect(wiredS0).toBeDefined();
    expect(wiredS0.symbol).toBe('S₀');
    expect(wiredS0.domain).toBe('origin');
  });

  it('genesisAutonomousRuntime S0 is the same object as in sovereignLanguage', async () => {
    const { S0: wiredS0 } = await import('../lib/genesisAutonomousRuntime');
    expect(wiredS0.latin).toBe(S0.latin);
    expect(wiredS0.weight).toBe(S0.weight);
  });
});

// ─── §14 Wiring — PORTA_SOVEREIGNA re-exported from gateEnforcement ─────────

describe('Sovereign Language — Wiring: PORTA_SOVEREIGNA from gateEnforcement', () => {
  it('gateEnforcement re-exports PORTA_SOVEREIGNA with correct symbol', async () => {
    const { PORTA_SOVEREIGNA: wiredPorta } = await import('../lib/gateEnforcement');
    expect(wiredPorta).toBeDefined();
    expect(wiredPorta.symbol).toBe('PORTA SOVEREIGNA');
    expect(wiredPorta.domain).toBe('gateway');
  });

  it('gateEnforcement PORTA_SOVEREIGNA is the same object as in sovereignLanguage', async () => {
    const { PORTA_SOVEREIGNA: wiredPorta } = await import('../lib/gateEnforcement');
    expect(wiredPorta.latin).toBe(PORTA_SOVEREIGNA.latin);
    expect(wiredPorta.weight).toBe(PORTA_SOVEREIGNA.weight);
  });
});

// ─── §15 medinaOS getProtocolOptions — Latin extension ───────────────────────

describe('Sovereign Language — medinaOS.getProtocolOptions() Latin doctrine', () => {
  it('getProtocolOptions returns latin field for each extension', async () => {
    const { getProtocolOptions } = await import('../lib/medinaOS');
    const opts = getProtocolOptions();
    expect(opts.length).toBe(3);
    for (const opt of opts) {
      expect(typeof opt.latin).toBe('string');
      expect(opt.latin.length).toBeGreaterThan(0);
      expect(typeof opt.etymology).toBe('string');
      expect(opt.etymology.length).toBeGreaterThan(0);
      expect(typeof opt.compressionWeight).toBe('number');
      expect(opt.compressionWeight).toBeGreaterThan(0);
    }
  });

  it('.mdn option has correct Latin name', async () => {
    const { getProtocolOptions } = await import('../lib/medinaOS');
    const mdn = getProtocolOptions().find((o) => o.extension === '.mdn')!;
    expect(mdn.latin).toBe('Medina — Urbs Sovereigna');
  });

  it('.ovo option has correct Latin name', async () => {
    const { getProtocolOptions } = await import('../lib/medinaOS');
    const ovo = getProtocolOptions().find((o) => o.extension === '.ovo')!;
    expect(ovo.latin).toBe('Ovum — Origo Nova Vitae');
  });

  it('.arc option has correct Latin name', async () => {
    const { getProtocolOptions } = await import('../lib/medinaOS');
    const arc = getProtocolOptions().find((o) => o.extension === '.arc')!;
    expect(arc.latin).toBe('Arcus — Architectura Compressa');
  });
});
