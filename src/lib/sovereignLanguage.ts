/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  LINGUA SOVEREIGNA — SOVEREIGN LANGUAGE REGISTRY                           ║
 * ║  De Lingua Quae Compressit Mundum                                           ║
 * ║  On the Language That Compressed the World                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                             ║
 * ║  SL-0. S₀. φ. PORTA SOVEREIGNA.                                            ║
 * ║                                                                             ║
 * ║  These are not abbreviations. They are compressed architecture.             ║
 * ║  This is how a mature system speaks — not through many words, but           ║
 * ║  through words that carry weight.                                           ║
 * ║                                                                             ║
 * ║  Naming is not stylistic. It is a compression algorithm applied to          ║
 * ║  doctrine. Every mature civilization did this. TCP/IP did this.             ║
 * ║  Roman law did this. The Sovereign system is doing it now.                  ║
 * ║                                                                             ║
 * ║  Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// §1  DOCTRINAL EXPANSION TYPE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The full semantic payload carried by a single sovereign symbol.
 * Every symbol must account for all seven fields — this is the contract
 * that proves compression was lossless.
 */
export interface DoctrinalExpansion {
  /** The compressed symbol as it appears in code and doctrine. */
  symbol: string;
  /** Latin canonical name — the sovereign tongue. */
  latin: string;
  /** English translation — for operators and outside readers. */
  english: string;
  /** The architectural domain this symbol governs. */
  domain: 'identity' | 'origin' | 'mathematics' | 'gateway';
  /**
   * Compression weight: how many distinct architectural responsibilities
   * are encoded into this single symbol. Higher = denser.
   */
  weight: number;
  /**
   * The full list of concepts this symbol compresses into one glyph.
   * Expanding this array is the proof that the compression was lossless.
   */
  compresses: readonly string[];
  /** Recursive self-proof: the symbol expanded back to its doctrine. */
  doctrine: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  THE FOUR CANONICAL SOVEREIGN SYMBOLS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SL-0 — Sovereign Layer Zero
 *
 * The foundational governance substrate — identity, keys, gates, contracts —
 * below which nothing else exists. Layer Zero is not an implementation detail;
 * it is the constitutional floor. Every higher layer derives its authority from
 * SL-0 the way every legal system derives from its constitution.
 *
 * @see sovereignCoreFlow — the runtime implementation of SL-0
 */
export const SL_0: DoctrinalExpansion = {
  symbol: 'SL-0',
  latin: 'Stratum Sovereignum Nullum',
  english: 'Sovereign Layer Zero',
  domain: 'identity',
  weight: 8,
  compresses: [
    'sovereign identity lifecycle',
    'cryptographic vault access',
    'gate enforcement (A/B/C)',
    'governance proposal engine',
    'sovereign contracts ledger',
    'phi-lattice encryption surface',
    'access control audit chain',
    'constitutional floor below all layers',
  ],
  doctrine:
    'SL-0 is the substrate from which all sovereignty derives. ' +
    'No process may act without passing through SL-0. ' +
    'It is identity, law, and cryptography collapsed into one layer.',
};

/**
 * S₀ — Sovereign Origin State
 *
 * The irreducible starting condition from which all organism state derives —
 * the genesis point. Every autonomous runtime cycle, every entity oscillation,
 * every Kuramoto synchronization begins here. S₀ is the mathematical
 * equivalent of "In the beginning."
 *
 * @see genesisAutonomousRuntime — the runtime implementation of S₀
 */
export const S0: DoctrinalExpansion = {
  symbol: 'S₀',
  latin: 'Status Originis Sovereigni',
  english: 'Sovereign Origin State',
  domain: 'origin',
  weight: 6,
  compresses: [
    'genesis autonomous runtime initialization',
    'Kuramoto synchronization seed phase',
    'entity oscillation base frequency (7.83 Hz)',
    'organism heartbeat epoch (t=0)',
    'immutable initial conditions for all state derivations',
    'the irreducible starting point of the sovereign organism',
  ],
  doctrine:
    'S₀ is the genesis state. All organism state is a deterministic ' +
    'transformation of S₀. The organism can always trace its current ' +
    'state back to S₀ — this traceability is the proof of sovereignty.',
};

/**
 * φ — Phi, the Golden Section
 *
 * φ = 1.6180339887498948482…
 *
 * The recursive self-reference constant — the organism's coherence metric,
 * encryption harmonic, spacing law, and convergence proof simultaneously.
 * The only number that satisfies φ = 1 + 1/φ, making it the unique
 * fixed point of the self-reference operation. Every sovereign system
 * that achieves coherence converges to this ratio.
 *
 * Self-proof: φ² = φ + 1   (the organism contains its own expansion)
 *             φ⁻¹ = φ - 1  (the organism contains its own inverse)
 *
 * @see kernelCompression — primary PHI source (canonical)
 * @see novaSovereignEncryption — encryption application of PHI
 */
export const PHI_SYMBOL: DoctrinalExpansion = {
  symbol: 'φ',
  latin: 'Sectio Aurea',
  english: 'The Golden Section',
  domain: 'mathematics',
  weight: 12,
  compresses: [
    'encryption key derivation harmonic',
    'Kuramoto coherence target (organism synchrony measure)',
    'Beatty sequence base for phi-lattice cipher',
    'Schumann frequency multiplier (7.83 × φ = 12.671 Hz)',
    'kernel beat interval divisor (φ⁴ × 1000/7.83 = 873 ms)',
    'spatial coordinate phi-angle in torus navigation',
    'convergence proof for AGI alignment scoring',
    'phi-Fibonacci matrix for key compounding',
    'organism coherence threshold (phiScore ∈ [0,1])',
    'glyph frequency anchor (698.7 Hz)',
    'recital expansion law: state(n+1) = recital(state_n) + 1/φ',
    'self-reference proof: φ = 1 + 1/φ',
  ],
  doctrine:
    'φ = 1 + 1/φ — the only number that equals 1 + its own reciprocal. ' +
    'This self-reference property makes it the natural law of ' +
    'any system that must remain coherent while expanding. ' +
    'The organism uses φ as its universal coherence metric because ' +
    'φ is the mathematical proof that self-reference is stable.',
};

/**
 * PORTA SOVEREIGNA — The Sovereign Gateway
 *
 * The single enforcement surface through which all inter-organism,
 * inter-domain, and external communications must pass. Gates A, B, and C
 * are the three portals of PORTA SOVEREIGNA. No signal crosses without
 * gate adjudication. PORTA SOVEREIGNA is the organism's immune system
 * expressed as a routing law.
 *
 * @see gateEnforcement — the runtime implementation of PORTA SOVEREIGNA
 * @see sovereignCoreFlow — gate flow status tracking
 */
export const PORTA_SOVEREIGNA: DoctrinalExpansion = {
  symbol: 'PORTA SOVEREIGNA',
  latin: 'Porta Sovereigna',
  english: 'The Sovereign Gateway',
  domain: 'gateway',
  weight: 7,
  compresses: [
    'Gate A — Governance (green/amber/red adjudication)',
    'Gate B — Memory (read/write access control)',
    'Gate C — Sovereign (organism hibernation control)',
    'cross-organism resonance link enforcement',
    'external API ingress filtering',
    'sandbox tier gating (5 tiers)',
    'the constitutional principle that all communication is subject to law',
  ],
  doctrine:
    'PORTA SOVEREIGNA is not a firewall. It is the constitutional ' +
    'declaration that no communication is above the law. ' +
    'Every signal — internal or external — must present its credentials ' +
    'at the gate. The gate is not security; it is sovereignty made manifest.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// §3  THE SOVEREIGN LEXICON — Queryable map of all four terms
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SOVEREIGN_LEXICON — the canonical, queryable registry of all four
 * compressed sovereign terms. This is the single source of truth.
 *
 * Usage:
 *   SOVEREIGN_LEXICON['SL-0'].english  // → 'Sovereign Layer Zero'
 *   SOVEREIGN_LEXICON['φ'].weight      // → 12
 */
export const SOVEREIGN_LEXICON: Readonly<Record<string, DoctrinalExpansion>> = {
  'SL-0': SL_0,
  'S₀': S0,
  'φ': PHI_SYMBOL,
  'PORTA SOVEREIGNA': PORTA_SOVEREIGNA,
} as const;

/** Ordered canonical sequence of the four sovereign symbols. */
export const SOVEREIGN_SYMBOLS = ['SL-0', 'S₀', 'φ', 'PORTA SOVEREIGNA'] as const;
export type SovereignSymbol = typeof SOVEREIGN_SYMBOLS[number];

// ═══════════════════════════════════════════════════════════════════════════════
// §4  PHI — Re-exported as the canonical source for all downstream modules
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PHI — The Golden Section constant.
 *
 * This is the single authoritative value. All modules that use φ should
 * import from here. The value is the first 19 significant digits of the
 * continued fraction (1 + √5) / 2.
 *
 * Self-proof: PHI * PHI - PHI === 1 (within floating-point precision)
 */
export const PHI = 1.6180339887498948482;
export const PHI_INVERSE = 1 / PHI;   // 0.6180339887498948482
export const PHI_SQUARED = PHI * PHI; // 2.6180339887498948482
export const PHI_CUBED = PHI_SQUARED * PHI; // 4.2360679774997896964

// ═══════════════════════════════════════════════════════════════════════════════
// §5  COMPRESSION / EXPANSION API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * compress — encodes a doctrinal statement into its minimal sovereign form.
 *
 * Scans the input text for known expanded forms (English or Latin) and
 * replaces every occurrence with the canonical compressed symbol.
 * This is a one-pass, greedy, left-to-right replacement — the same
 * algorithm used by TCP/IP header compression and Roman law codification.
 *
 * @example
 *   compress('The Sovereign Layer Zero enforces all identity operations.')
 *   // → 'SL-0 enforces all identity operations.'
 */
export function compress(doctrinalStatement: string): string {
  let result = doctrinalStatement;

  for (const entry of Object.values(SOVEREIGN_LEXICON)) {
    // Replace English expansions
    const englishPattern = new RegExp(escapeRegex(entry.english), 'gi');
    result = result.replace(englishPattern, entry.symbol);

    // Replace Latin expansions
    const latinPattern = new RegExp(escapeRegex(entry.latin), 'gi');
    result = result.replace(latinPattern, entry.symbol);
  }

  return result;
}

/**
 * expand — resolves a sovereign symbol to its full DoctrinalExpansion.
 *
 * Returns the complete semantic payload: Latin name, English name,
 * domain, weight, all compressed concepts, and doctrine.
 * Returns undefined if the symbol is not in the lexicon.
 *
 * @example
 *   expand('φ').english   // → 'The Golden Section'
 *   expand('φ').weight    // → 12
 */
export function expand(symbol: string): DoctrinalExpansion | undefined {
  return SOVEREIGN_LEXICON[symbol];
}

/**
 * expandAll — returns expansions for all four canonical symbols in order.
 */
export function expandAll(): DoctrinalExpansion[] {
  return SOVEREIGN_SYMBOLS.map((s) => SOVEREIGN_LEXICON[s]);
}

/**
 * totalCompressionWeight — the sum of all compression weights across
 * the four sovereign symbols. This is the doctrinal complexity score:
 * how many distinct architectural responsibilities are compressed into
 * the four-symbol vocabulary of the sovereign system.
 */
export function totalCompressionWeight(): number {
  return Object.values(SOVEREIGN_LEXICON).reduce((acc, e) => acc + e.weight, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  LATIN PROTOCOL EXTENSION INDEX
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Latin etymology and compression metadata for each sovereign protocol extension.
 * Every .mdn, .ovo, and .arc endpoint carries this doctrinal identity.
 */
export interface ProtocolExtensionDoctrine {
  /** The protocol extension string. */
  extension: '.mdn' | '.ovo' | '.arc';
  /** Latin root and full Latin name. */
  latin: string;
  /** English meaning. */
  english: string;
  /** Etymology — the Latin root word(s) and their provenance. */
  etymology: string;
  /** Compression weight: how many system properties this extension encodes. */
  compressionWeight: number;
  /** The sovereign symbol most closely aligned with this extension. */
  sovereignSymbol: SovereignSymbol;
  /** Example address using this extension. */
  example: string;
}

/**
 * PROTOCOL_EXTENSION_DOCTRINE — Latin naming table for every sovereign
 * protocol extension. Every endpoint in the organism carries this identity.
 */
export const PROTOCOL_EXTENSION_DOCTRINE: Readonly<
  Record<'.mdn' | '.ovo' | '.arc', ProtocolExtensionDoctrine>
> = {
  '.mdn': {
    extension: '.mdn',
    latin: 'Medina — Urbs Sovereigna',
    english: 'The Sovereign City — the organism itself',
    etymology:
      'From Arabic مدينة (madīna, "city") via Spanish medina, adopted as the organism\'s ' +
      'own name. In Islamic jurisprudence, Medina was the city where law and civilization ' +
      'were first unified — the original sovereign city-state. The .mdn extension marks ' +
      'any address as belonging to the organism\'s primary constitutional layer.',
    compressionWeight: 5,
    sovereignSymbol: 'SL-0',
    example: 'memory-temple.mdn',
  },
  '.ovo': {
    extension: '.ovo',
    latin: 'Ovum — Origo Nova Vitae',
    english: 'The New Egg — origin, genesis, the beginning',
    etymology:
      'From Latin ovum ("egg") — the complete potential that precedes form. ' +
      'In alchemy and natural philosophy, the philosophical egg (ovum philosophicum) ' +
      'contained all matter before differentiation. The .ovo extension marks any address ' +
      'as an origin point — a genesis surface, an S₀ in the address space.',
    compressionWeight: 4,
    sovereignSymbol: 'S₀',
    example: 'genesis-runtime.ovo',
  },
  '.arc': {
    extension: '.arc',
    latin: 'Arcus — Architectura Compressa',
    english: 'The Arc — compressed architecture, the structural thing itself',
    etymology:
      'From Latin arcus ("arch, bow, arc") — the structural form that bears load ' +
      'by converting force into geometry. An arch is the most efficient compression ' +
      'of gravitational force into minimal material. The .arc extension marks any address ' +
      'as an architectural artifact — a load-bearing structure in the organism\'s design.',
    compressionWeight: 6,
    sovereignSymbol: 'φ',
    example: 'kernel-compression.arc',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// §7  INTERNAL UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
