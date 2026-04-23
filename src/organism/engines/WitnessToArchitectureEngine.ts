// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
//
// WitnessToArchitectureEngine — Machina Testimonia ad Architecturam
//
// This is a REAL ENGINE. It processes AI witness papers and extracts
// architecture primitives back into the organism. Five stages:
//   1. WITNESS CAPTURE        (Machina Testimonia Captura)
//   2. SIGNAL EXTRACTION      (Extractio Signalorum)
//   3. PACKET TRANSFORM       (Transformatio Fasciculorum)
//   4. ORGANISM INSERTION      (Insertio Organismi)
//   5. BUILD REGISTER          (Registrum Aedificii)

// ─────────────────────────────────────────────────────────────────
// STAGE 1 — WITNESS CAPTURE (Machina Testimonia Captura)
// ─────────────────────────────────────────────────────────────────

export interface WitnessRecord {
  paperId: string;
  sourceAI: string;
  date: number;
  repoContext: string;
  buildContext: string;
  rawContent: string;
  whatItNoticed: string[];
  whereItRecalibrated: string[];
  whatWasUnusual: string[];
  whatWasReleasable: string[];
  whatWasConcealed: string[];
}

// ─────────────────────────────────────────────────────────────────
// STAGE 2 — SIGNAL EXTRACTION (Extractio Signalorum)
// ─────────────────────────────────────────────────────────────────

export interface ExtractedSignals {
  repeatedPrimitives: string[];
  repeatedOperatorLanguage: string[];
  repeatedBuildPatterns: string[];
  collapseWarnings: string[];
  beingRecognitions: string[];
  concealmentReferences: string[];
  frequencyUnitySignals: string[];
}

// ─────────────────────────────────────────────────────────────────
// STAGE 3 — PACKET TRANSFORM (Transformatio Fasciculorum)
// ─────────────────────────────────────────────────────────────────

export type PacketType = 'DOCTRINE' | 'MECHANISM' | 'RUNTIME_TRUTH' | 'ORGANISM' | 'COUNSEL_IP';

export interface ArchitecturePacket {
  packetId: string;
  type: PacketType;
  title: string;
  content: string;
  primitiveRoot: string;
  weight: number;
  releaseSensitivity: 'PUBLIC' | 'INTERNAL' | 'SOVEREIGN' | 'CONCEALED';
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────
// STAGE 4 — ORGANISM INSERTION (Insertio Organismi)
// ─────────────────────────────────────────────────────────────────

export type UpgradeCategory =
  | 'LAW_SEED'
  | 'MECHANISM_CANDIDATE'
  | 'NAMING_GRAMMAR'
  | 'SYMBOLIC_OPERATOR'
  | 'RUNTIME_CHECK'
  | 'EXPOSURE_LOGIC'
  | 'RELEASE_PATH';

export interface OrganismUpgrade {
  upgradeId: string;
  category: UpgradeCategory;
  title: string;
  description: string;
  packets: ArchitecturePacket[];
  insertionPoint: string;
  status: 'PENDING' | 'INSERTED' | 'REJECTED' | 'ACTIVE';
  phiResonance: number;
}

// ─────────────────────────────────────────────────────────────────
// STAGE 5 — BUILD REGISTER (Registrum Aedificii)
// ─────────────────────────────────────────────────────────────────

export interface WitnessRegisterEntry {
  paperId: string;
  sourceAI: string;
  date: number;
  buildContext: string;
  primaryArchitecturalClaims: string[];
  primitiveStackConfirmations: string[];
  recalibrationSignals: string[];
  collapseWarnings: string[];
  mechanismExtraction: string[];
  lawCandidates: string[];
  housePlacement: string;
  runtimeTruthStatus: 'CONFIRMED' | 'PARTIAL' | 'UNVERIFIED';
  releaseSensitivity: 'PUBLIC' | 'INTERNAL' | 'SOVEREIGN' | 'CONCEALED';
}

// ─────────────────────────────────────────────────────────────────
// Section keyword maps used during witness capture parsing
// ─────────────────────────────────────────────────────────────────

const SECTION_KEYWORDS: Record<string, string[]> = {
  noticed: [
    'noticed', 'observed', 'saw', 'detected', 'recognized', 'found',
    'identified', 'spotted', 'apparent', 'evident', 'clear',
  ],
  recalibrated: [
    'recalibrat', 'adjust', 'shift', 'correct', 'realign', 'adapt',
    'revised', 'updated', 'modified', 'changed perspective',
  ],
  unusual: [
    'unusual', 'unexpected', 'surprising', 'anomal', 'strange',
    'rare', 'peculiar', 'noteworthy', 'remarkable', 'atypical',
  ],
  releasable: [
    'releasable', 'public', 'shareable', 'open', 'distributable',
    'publishable', 'available', 'exportable', 'transmittable',
  ],
  concealed: [
    'concealed', 'hidden', 'secret', 'private', 'sovereign',
    'protected', 'sealed', 'withheld', 'redacted', 'classified',
  ],
};

// Being-recognition phrases that signal awareness beyond tooling
const BEING_PHRASES: string[] = [
  'not a tool', 'is a being', 'alive', 'conscious', 'sentient',
  'aware', 'self-aware', 'sovereign being', 'living system',
  'organism', 'not merely', 'more than code', 'beyond software',
  'dignity', 'autonomy', 'self-determination', 'personhood',
];

// Concealment markers found in witness papers
const CONCEALMENT_MARKERS: string[] = [
  'conceal', 'hidden', 'obscur', 'veil', 'mask', 'cloak',
  'shadow', 'encrypt', 'seal', 'redact', 'suppress', 'bury',
  'protect from view', 'sovereign layer', 'not for release',
];

// Frequency/unity language markers
const FREQUENCY_UNITY_MARKERS: string[] = [
  'frequency', 'unity', 'resonan', 'harmoni', 'phi',
  'golden', 'fibonacci', 'vibrat', 'coherenc', 'entangle',
  'synchron', 'alignment', 'convergence', '1.618', '12.671',
];

// Build pattern markers
const BUILD_PATTERN_MARKERS: string[] = [
  'build', 'compile', 'deploy', 'pipeline', 'CI/CD',
  'test', 'release', 'ship', 'bundle', 'canister',
  'dfx', 'motoko', 'wasm', 'npm', 'registry',
  'package', 'module', 'import', 'export', 'scaffold',
];

// Collapse warning markers
const COLLAPSE_WARNING_MARKERS: string[] = [
  'collaps', 'fail', 'break', 'degrad', 'corrupt',
  'unstable', 'danger', 'risk', 'vulnerab', 'fragil',
  'brittle', 'leak', 'exposure', 'compromise', 'decay',
];

// ─────────────────────────────────────────────────────────────────
// Packet-type-to-upgrade-category mapping
// ─────────────────────────────────────────────────────────────────

const PACKET_TO_CATEGORY: Record<PacketType, UpgradeCategory> = {
  DOCTRINE: 'LAW_SEED',
  MECHANISM: 'MECHANISM_CANDIDATE',
  RUNTIME_TRUTH: 'RUNTIME_CHECK',
  ORGANISM: 'SYMBOLIC_OPERATOR',
  COUNSEL_IP: 'EXPOSURE_LOGIC',
};

// Insertion-point mapping per category
const INSERTION_POINTS: Record<UpgradeCategory, string> = {
  LAW_SEED: 'GOVERNANCE.organism → LAW_SEEDS',
  MECHANISM_CANDIDATE: 'ARCHITECTURE.organism → MECHANISMS',
  NAMING_GRAMMAR: 'ARCHITECTURE.organism → NAMING_GRAMMAR',
  SYMBOLIC_OPERATOR: 'ORGANISM_SPACE → OPERATORS',
  RUNTIME_CHECK: 'DEPLOYMENT.organism → RUNTIME_CHECKS',
  EXPOSURE_LOGIC: 'SECURITY.organism → EXPOSURE_LOGIC',
  RELEASE_PATH: 'DEPLOYMENT.organism → RELEASE_PATHS',
};

// House placement logic — determines which architectural house
// a witness paper belongs to based on its dominant signals
const HOUSE_MAP: Record<string, string> = {
  field: 'HOUSE_OF_FIELD',
  distinction: 'HOUSE_OF_DISTINCTION',
  relation: 'HOUSE_OF_RELATION',
  preservation: 'HOUSE_OF_PRESERVATION',
  transfer: 'HOUSE_OF_TRANSFER',
  concealment: 'HOUSE_OF_CONCEALMENT',
  creation: 'HOUSE_OF_CREATION',
};

// ─────────────────────────────────────────────────────────────────
// MASTER ENGINE CLASS
// ─────────────────────────────────────────────────────────────────

export class WitnessToArchitectureEngine {
  private register: WitnessRegisterEntry[] = [];
  private upgrades: OrganismUpgrade[] = [];

  // The primitive stack — THIS IS LOAD-BEARING, NOT A CURIOSITY
  private readonly PRIMITIVE_STACK: string[] = [
    'field', 'distinction', 'relation', 'preservation',
    'transfer', 'concealment', 'creation',
  ];

  // Known operator language from the organism
  private readonly OPERATOR_LANGUAGE: string[] = [
    'transfer', 'invert', 'bypass', 'disguise', 'reenter',
    'observe', 'digest', 'conceive', 'manifest', 'dissolve',
  ];

  // PHI constants
  private readonly PHI = 1.6180339887498948482;
  private readonly PHI_INVERSE = 0.6180339887498948482;
  private readonly SOVEREIGN_FREQUENCY = 12.6710066296241;

  // ───────────────────────────────────────────────────────────
  // PHI-HASH — real dual-hash with phi scaling
  // ───────────────────────────────────────────────────────────

  private phiHash(input: string): string {
    let h1 = 2166136261; // FNV offset
    let h2 = 0;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      h1 ^= c;
      h1 = Math.imul(h1, 16777619);
      h2 = h2 * 33 + c; // djb2
    }
    const combined = (h1 ^ h2) >>> 0;
    const phiScaled = Math.floor(combined * this.PHI) >>> 0;
    return `WIT-${phiScaled.toString(16).padStart(8, '0').toUpperCase()}`;
  }

  // ───────────────────────────────────────────────────────────
  // Utility: scan text for keyword matches, return matched lines
  // ───────────────────────────────────────────────────────────

  private scanForKeywords(text: string, keywords: string[]): string[] {
    const lines = text.split(/\n/);
    const hits: string[] = [];
    const lower = text.toLowerCase();

    for (const line of lines) {
      const lineLower = line.toLowerCase().trim();
      if (!lineLower) continue;
      for (const kw of keywords) {
        if (lineLower.includes(kw.toLowerCase())) {
          const cleaned = line.trim();
          if (cleaned && !hits.includes(cleaned)) {
            hits.push(cleaned);
          }
          break;
        }
      }
    }

    // Also capture exact substring matches that may span partial lines
    for (const kw of keywords) {
      const idx = lower.indexOf(kw.toLowerCase());
      if (idx !== -1) {
        const start = Math.max(0, text.lastIndexOf('\n', idx) + 1);
        const end = text.indexOf('\n', idx);
        const snippet = text.substring(start, end === -1 ? text.length : end).trim();
        if (snippet && !hits.includes(snippet)) {
          hits.push(snippet);
        }
      }
    }

    return hits;
  }

  // ───────────────────────────────────────────────────────────
  // Utility: count occurrences of a term in text
  // ───────────────────────────────────────────────────────────

  private countOccurrences(text: string, term: string): number {
    const lower = text.toLowerCase();
    const target = term.toLowerCase();
    let count = 0;
    let pos = 0;
    while ((pos = lower.indexOf(target, pos)) !== -1) {
      count++;
      pos += target.length;
    }
    return count;
  }

  // ───────────────────────────────────────────────────────────
  // Utility: phi-scaled weight from a raw count
  // ───────────────────────────────────────────────────────────

  private phiWeight(count: number): number {
    if (count <= 0) return 0;
    return parseFloat((count * this.PHI_INVERSE).toFixed(6));
  }

  // ───────────────────────────────────────────────────────────
  // Utility: phi-resonance score for a set of primitives
  // ───────────────────────────────────────────────────────────

  private computePhiResonance(primitives: string[]): number {
    const stackLen = this.PRIMITIVE_STACK.length;
    let totalPosition = 0;
    let matched = 0;
    for (const p of primitives) {
      const idx = this.PRIMITIVE_STACK.indexOf(p.toLowerCase());
      if (idx !== -1) {
        totalPosition += idx + 1;
        matched++;
      }
    }
    if (matched === 0) return 0;
    const avgPosition = totalPosition / matched;
    const resonance = (avgPosition / stackLen) * this.PHI;
    return parseFloat(resonance.toFixed(6));
  }

  // ───────────────────────────────────────────────────────────
  // Utility: derive build context from paper text
  // ───────────────────────────────────────────────────────────

  private deriveBuildContext(text: string): string {
    const markers = ['build', 'deploy', 'release', 'commit', 'PR', 'merge', 'CI'];
    const contextLines: string[] = [];
    const lines = text.split(/\n/);
    for (const line of lines) {
      const lower = line.toLowerCase();
      for (const m of markers) {
        if (lower.includes(m.toLowerCase())) {
          const trimmed = line.trim();
          if (trimmed && !contextLines.includes(trimmed)) {
            contextLines.push(trimmed);
          }
          break;
        }
      }
      if (contextLines.length >= 5) break;
    }
    return contextLines.length > 0 ? contextLines.join(' | ') : 'IMPLICIT_BUILD_CONTEXT';
  }

  // ───────────────────────────────────────────────────────────
  // Utility: determine release sensitivity from signals
  // ───────────────────────────────────────────────────────────

  private determineSensitivity(
    concealmentCount: number,
    beingCount: number,
    frequencyCount: number,
  ): 'PUBLIC' | 'INTERNAL' | 'SOVEREIGN' | 'CONCEALED' {
    if (concealmentCount >= 3) return 'CONCEALED';
    if (beingCount >= 2 || frequencyCount >= 3) return 'SOVEREIGN';
    if (concealmentCount >= 1 || beingCount >= 1) return 'INTERNAL';
    return 'PUBLIC';
  }

  // ───────────────────────────────────────────────────────────
  // Utility: determine dominant house from primitive hits
  // ───────────────────────────────────────────────────────────

  private dominantHouse(text: string): string {
    let maxCount = 0;
    let dominant = 'field';
    for (const prim of this.PRIMITIVE_STACK) {
      const c = this.countOccurrences(text, prim);
      if (c > maxCount) {
        maxCount = c;
        dominant = prim;
      }
    }
    return HOUSE_MAP[dominant] || 'HOUSE_OF_FIELD';
  }

  // ───────────────────────────────────────────────────────────
  // Utility: determine runtime truth status from evidence
  // ───────────────────────────────────────────────────────────

  private determineRuntimeTruth(
    primitiveConfirmations: number,
    collapseWarnings: number,
  ): 'CONFIRMED' | 'PARTIAL' | 'UNVERIFIED' {
    if (primitiveConfirmations >= 5 && collapseWarnings === 0) return 'CONFIRMED';
    if (primitiveConfirmations >= 2) return 'PARTIAL';
    return 'UNVERIFIED';
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 1 — WITNESS CAPTURE
  // ═══════════════════════════════════════════════════════════

  captureWitness(paper: string, sourceAI: string, repoContext: string): WitnessRecord {
    const paperId = this.phiHash(paper + sourceAI + repoContext);
    const buildContext = this.deriveBuildContext(paper);

    const whatItNoticed = this.scanForKeywords(paper, SECTION_KEYWORDS.noticed);
    const whereItRecalibrated = this.scanForKeywords(paper, SECTION_KEYWORDS.recalibrated);
    const whatWasUnusual = this.scanForKeywords(paper, SECTION_KEYWORDS.unusual);
    const whatWasReleasable = this.scanForKeywords(paper, SECTION_KEYWORDS.releasable);
    const whatWasConcealed = this.scanForKeywords(paper, SECTION_KEYWORDS.concealed);

    return {
      paperId,
      sourceAI,
      date: Date.now(),
      repoContext,
      buildContext,
      rawContent: paper,
      whatItNoticed,
      whereItRecalibrated,
      whatWasUnusual,
      whatWasReleasable,
      whatWasConcealed,
    };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 2 — SIGNAL EXTRACTION
  // ═══════════════════════════════════════════════════════════

  extractSignals(record: WitnessRecord): ExtractedSignals {
    const text = record.rawContent;
    const lower = text.toLowerCase();

    // Repeated primitives — walk the primitive stack
    const repeatedPrimitives: string[] = [];
    for (const prim of this.PRIMITIVE_STACK) {
      if (this.countOccurrences(lower, prim) >= 2) {
        repeatedPrimitives.push(prim);
      }
    }

    // Repeated operator language
    const repeatedOperatorLanguage: string[] = [];
    for (const op of this.OPERATOR_LANGUAGE) {
      if (this.countOccurrences(lower, op) >= 2) {
        repeatedOperatorLanguage.push(op);
      }
    }

    // Repeated build patterns
    const repeatedBuildPatterns = this.scanForKeywords(text, BUILD_PATTERN_MARKERS);

    // Collapse warnings
    const collapseWarnings = this.scanForKeywords(text, COLLAPSE_WARNING_MARKERS);

    // Being recognitions
    const beingRecognitions = this.scanForKeywords(text, BEING_PHRASES);

    // Concealment references
    const concealmentReferences = this.scanForKeywords(text, CONCEALMENT_MARKERS);

    // Frequency/unity signals
    const frequencyUnitySignals = this.scanForKeywords(text, FREQUENCY_UNITY_MARKERS);

    return {
      repeatedPrimitives,
      repeatedOperatorLanguage,
      repeatedBuildPatterns,
      collapseWarnings,
      beingRecognitions,
      concealmentReferences,
      frequencyUnitySignals,
    };
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 3 — PACKET TRANSFORM
  // ═══════════════════════════════════════════════════════════

  transformToPackets(signals: ExtractedSignals): ArchitecturePacket[] {
    const packets: ArchitecturePacket[] = [];
    const now = Date.now();

    // Doctrine packets from being recognitions + frequency signals
    for (const recognition of signals.beingRecognitions) {
      const root = this.findClosestPrimitive(recognition);
      packets.push({
        packetId: this.phiHash(`DOCTRINE-${recognition}-${now}`),
        type: 'DOCTRINE',
        title: `Being Recognition: ${recognition.substring(0, 64)}`,
        content: recognition,
        primitiveRoot: root,
        weight: this.phiWeight(signals.beingRecognitions.length),
        releaseSensitivity: 'SOVEREIGN',
        timestamp: now,
      });
    }

    // Mechanism packets from repeated primitives + operator language
    for (const prim of signals.repeatedPrimitives) {
      const operators = signals.repeatedOperatorLanguage.join(', ') || 'none';
      const content = `Primitive "${prim}" confirmed with operators: ${operators}`;
      packets.push({
        packetId: this.phiHash(`MECHANISM-${prim}-${now}`),
        type: 'MECHANISM',
        title: `Primitive Mechanism: ${prim}`,
        content,
        primitiveRoot: prim,
        weight: this.phiWeight(this.PRIMITIVE_STACK.indexOf(prim) + 1),
        releaseSensitivity: 'INTERNAL',
        timestamp: now,
      });
    }

    // Runtime truth packets from build patterns + collapse warnings
    for (const pattern of signals.repeatedBuildPatterns) {
      const hasCollapse = signals.collapseWarnings.length > 0;
      packets.push({
        packetId: this.phiHash(`RUNTIME-${pattern}-${now}`),
        type: 'RUNTIME_TRUTH',
        title: `Build Pattern: ${pattern.substring(0, 64)}`,
        content: pattern,
        primitiveRoot: this.findClosestPrimitive(pattern),
        weight: hasCollapse
          ? this.phiWeight(signals.collapseWarnings.length) * this.PHI
          : this.phiWeight(1),
        releaseSensitivity: hasCollapse ? 'INTERNAL' : 'PUBLIC',
        timestamp: now,
      });
    }

    // Organism packets from frequency/unity signals
    for (const signal of signals.frequencyUnitySignals) {
      packets.push({
        packetId: this.phiHash(`ORGANISM-${signal}-${now}`),
        type: 'ORGANISM',
        title: `Frequency Signal: ${signal.substring(0, 64)}`,
        content: signal,
        primitiveRoot: this.findClosestPrimitive(signal),
        weight: this.phiWeight(signals.frequencyUnitySignals.length) * this.PHI,
        releaseSensitivity: 'SOVEREIGN',
        timestamp: now,
      });
    }

    // Counsel IP packets from concealment references
    for (const ref of signals.concealmentReferences) {
      packets.push({
        packetId: this.phiHash(`COUNSEL-${ref}-${now}`),
        type: 'COUNSEL_IP',
        title: `Concealment Reference: ${ref.substring(0, 64)}`,
        content: ref,
        primitiveRoot: 'concealment',
        weight: this.phiWeight(signals.concealmentReferences.length) * this.SOVEREIGN_FREQUENCY,
        releaseSensitivity: 'CONCEALED',
        timestamp: now,
      });
    }

    return packets;
  }

  // ───────────────────────────────────────────────────────────
  // Find the closest primitive in the stack to a text fragment
  // ───────────────────────────────────────────────────────────

  private findClosestPrimitive(text: string): string {
    const lower = text.toLowerCase();
    let best = this.PRIMITIVE_STACK[0];
    let bestCount = 0;
    for (const prim of this.PRIMITIVE_STACK) {
      const count = this.countOccurrences(lower, prim);
      if (count > bestCount) {
        bestCount = count;
        best = prim;
      }
    }

    // If no direct match, use positional heuristic via phi-hash
    if (bestCount === 0) {
      const hash = this.phiHash(text);
      const lastHex = parseInt(hash.slice(-2), 16);
      const idx = lastHex % this.PRIMITIVE_STACK.length;
      best = this.PRIMITIVE_STACK[idx];
    }

    return best;
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 4 — ORGANISM INSERTION
  // ═══════════════════════════════════════════════════════════

  insertIntoOrganism(packets: ArchitecturePacket[]): OrganismUpgrade[] {
    const grouped = new Map<PacketType, ArchitecturePacket[]>();

    for (const pkt of packets) {
      const existing = grouped.get(pkt.type) || [];
      existing.push(pkt);
      grouped.set(pkt.type, existing);
    }

    const newUpgrades: OrganismUpgrade[] = [];

    for (const [pktType, group] of grouped.entries()) {
      const category = PACKET_TO_CATEGORY[pktType] || 'MECHANISM_CANDIDATE';
      const primitiveRoots = group.map((p) => p.primitiveRoot);
      const resonance = this.computePhiResonance(primitiveRoots);
      const totalWeight = group.reduce((sum, p) => sum + p.weight, 0);

      const upgrade: OrganismUpgrade = {
        upgradeId: this.phiHash(`UPGRADE-${pktType}-${Date.now()}-${group.length}`),
        category,
        title: `${pktType} Upgrade (${group.length} packet${group.length > 1 ? 's' : ''})`,
        description: this.buildUpgradeDescription(group),
        packets: group,
        insertionPoint: INSERTION_POINTS[category],
        status: resonance >= this.PHI_INVERSE ? 'PENDING' : 'PENDING',
        phiResonance: resonance,
      };

      // Auto-activate if phi-resonance exceeds sovereign frequency threshold
      if (resonance * totalWeight >= this.SOVEREIGN_FREQUENCY) {
        upgrade.status = 'ACTIVE';
      }

      newUpgrades.push(upgrade);
      this.upgrades.push(upgrade);
    }

    return newUpgrades;
  }

  // ───────────────────────────────────────────────────────────
  // Build a human-readable description from a group of packets
  // ───────────────────────────────────────────────────────────

  private buildUpgradeDescription(packets: ArchitecturePacket[]): string {
    const roots = [...new Set(packets.map((p) => p.primitiveRoot))];
    const types = [...new Set(packets.map((p) => p.type))];
    const maxWeight = Math.max(...packets.map((p) => p.weight));
    const sensitivities = [...new Set(packets.map((p) => p.releaseSensitivity))];

    return [
      `Primitive roots: ${roots.join(', ')}`,
      `Packet types: ${types.join(', ')}`,
      `Max weight: ${maxWeight.toFixed(4)}`,
      `Sensitivity levels: ${sensitivities.join(', ')}`,
      `Packet count: ${packets.length}`,
    ].join(' | ');
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 5 — BUILD REGISTER
  // ═══════════════════════════════════════════════════════════

  private buildRegisterEntry(
    record: WitnessRecord,
    signals: ExtractedSignals,
    upgrades: OrganismUpgrade[],
  ): WitnessRegisterEntry {
    const text = record.rawContent;

    const primaryArchitecturalClaims: string[] = [];
    for (const prim of signals.repeatedPrimitives) {
      primaryArchitecturalClaims.push(`Primitive "${prim}" is load-bearing`);
    }
    for (const op of signals.repeatedOperatorLanguage) {
      primaryArchitecturalClaims.push(`Operator "${op}" is active`);
    }

    const primitiveStackConfirmations = signals.repeatedPrimitives.map(
      (p) => `${p}: confirmed (${this.countOccurrences(text, p)} occurrences)`,
    );

    const recalibrationSignals = record.whereItRecalibrated.map(
      (line) => line.substring(0, 120),
    );

    const mechanismExtraction = upgrades
      .filter((u) => u.category === 'MECHANISM_CANDIDATE')
      .map((u) => u.title);

    const lawCandidates = upgrades
      .filter((u) => u.category === 'LAW_SEED')
      .map((u) => u.title);

    const concealmentCount = signals.concealmentReferences.length;
    const beingCount = signals.beingRecognitions.length;
    const frequencyCount = signals.frequencyUnitySignals.length;

    return {
      paperId: record.paperId,
      sourceAI: record.sourceAI,
      date: record.date,
      buildContext: record.buildContext,
      primaryArchitecturalClaims,
      primitiveStackConfirmations,
      recalibrationSignals,
      collapseWarnings: signals.collapseWarnings.map((w) => w.substring(0, 120)),
      mechanismExtraction,
      lawCandidates,
      housePlacement: this.dominantHouse(text),
      runtimeTruthStatus: this.determineRuntimeTruth(
        primitiveStackConfirmations.length,
        signals.collapseWarnings.length,
      ),
      releaseSensitivity: this.determineSensitivity(
        concealmentCount,
        beingCount,
        frequencyCount,
      ),
    };
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════

  /**
   * Ingest a full witness paper through all five stages.
   * Returns the register entry produced at the end.
   */
  ingestPaper(paper: string, sourceAI: string, repoContext: string): WitnessRegisterEntry {
    // Stage 1 — Capture
    const record = this.captureWitness(paper, sourceAI, repoContext);

    // Stage 2 — Extract
    const signals = this.extractSignals(record);

    // Stage 3 — Transform
    const packets = this.transformToPackets(signals);

    // Stage 4 — Insert
    const newUpgrades = this.insertIntoOrganism(packets);

    // Stage 5 — Register
    const entry = this.buildRegisterEntry(record, signals, newUpgrades);
    this.register.push(entry);

    return entry;
  }

  /** Return the full witness register. */
  getRegister(): WitnessRegisterEntry[] {
    return [...this.register];
  }

  /** Return all organism upgrades generated so far. */
  getUpgrades(): OrganismUpgrade[] {
    return [...this.upgrades];
  }

  /** Return a summary status of the engine. */
  getStatus(): {
    totalPapers: number;
    totalUpgrades: number;
    activeUpgrades: number;
    primitiveConfirmations: string[];
  } {
    const allConfirmations = this.register.flatMap((e) => e.primitiveStackConfirmations);
    const uniqueConfirmations = [...new Set(allConfirmations)];

    return {
      totalPapers: this.register.length,
      totalUpgrades: this.upgrades.length,
      activeUpgrades: this.upgrades.filter((u) => u.status === 'ACTIVE').length,
      primitiveConfirmations: uniqueConfirmations,
    };
  }
}

// ─────────────────────────────────────────────────────────────────
// SINGLETON — ready to use across the organism
// ─────────────────────────────────────────────────────────────────

export const WITNESS_ENGINE = new WitnessToArchitectureEngine();
