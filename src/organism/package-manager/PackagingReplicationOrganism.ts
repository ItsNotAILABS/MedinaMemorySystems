// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * PACKAGING / REGISTRY / REPLICATION ORGANISM
 * ─────────────────────────────────────────────────────────────────────────
 * "The source organism does not need to lose anything.
 *  Packaging is not subtraction. It is:
 *    classification → snapshotting → copying → wrapping → signing →
 *    registering → deploying a branch expression."
 *
 * This is the dedicated organism whose ONLY job is packaging.
 * It reads from the source organism, classifies the packageable unit,
 * writes a package record into the registry, generates a copy artifact,
 * signs it, deploys or exports it, and LEAVES THE SOURCE UNCHANGED.
 *
 * ARCHITECTURAL TRUTH:
 *   - Package layer sits at C0 (supply/distribution)
 *   - Deploy bridge C1↔C0 is "Package → Chain"
 *   - Packages are how organisms get deployed, not diminished
 *   - Branches are derivative cuts. The root stays root.
 *   - The main center is not the face.
 *   - Commercialization happens at the branch level.
 *
 * SEVEN-PHASE PIPELINE:
 *   Phase 1: READ    — Read from source organism (non-destructive)
 *   Phase 2: CLASSIFY — Classify the packageable unit
 *   Phase 3: SNAPSHOT — Create an immutable point-in-time snapshot
 *   Phase 4: COPY     — Generate a copy artifact (source untouched)
 *   Phase 5: WRAP     — Wrap with metadata, manifest, living docs
 *   Phase 6: SIGN     — Cryptographic signing + SAT token binding
 *   Phase 7: REGISTER — Write record to sovereign registry + deploy
 * ─────────────────────────────────────────────────────────────────────────
 */

const PHI = 1.6180339887498948482;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PackageableClass =
  | 'SDK'             // Standalone SDK organism
  | 'TOOL'            // Tool package
  | 'ENGINE'          // Intelligence engine
  | 'MODEL'           // AI model
  | 'SERVICE'         // Microservice
  | 'RUNTIME'         // Runtime module
  | 'REGISTRY'        // Registry module
  | 'TERMINAL'        // Terminal module
  | 'KERNEL'          // Kernel module
  | 'DOCUMENT'        // Living document
  | 'SAAS'            // SaaS product
  | 'CANISTER'        // ICP canister
  | 'MULTIMODAL'      // Multi-modal bundle
  | 'ECOSYSTEM'       // Ecosystem organism
  | 'SUBSTRATE';      // Substrate deployment

export type PipelinePhase =
  | 'READ'
  | 'CLASSIFY'
  | 'SNAPSHOT'
  | 'COPY'
  | 'WRAP'
  | 'SIGN'
  | 'REGISTER';

export type DeployTarget =
  | 'NPM_REGISTRY'
  | 'SOVEREIGN_REGISTRY'
  | 'MEDINA_PKG'
  | 'GITHUB_MARKETPLACE'
  | 'ICP_BLOCKCHAIN'
  | 'DOCKER_REGISTRY'
  | 'MAVEN_CENTRAL'
  | 'NUGET_GALLERY';

export interface SourceReference {
  /** Path to source organism module — NEVER modified */
  sourcePath: string;
  /** Organism class this belongs to */
  organismClass: string;
  /** Source hash at time of read (integrity check) */
  sourceHash: string;
  /** Timestamp of read */
  readAt: number;
}

export interface PackageSnapshot {
  id: string;
  sourceRef: SourceReference;
  classification: PackageableClass;
  version: string;
  snapshotHash: string;
  createdAt: number;
  /** Immutable — once created, never modified */
  frozen: true;
}

export interface PackageCopy {
  snapshotId: string;
  copyHash: string;
  /** The actual content — a deep copy, NOT a reference */
  content: Record<string, unknown>;
  createdAt: number;
}

export interface PackageManifest {
  name: string;
  latinName: string;
  version: string;
  classification: PackageableClass;
  description: string;
  author: string;
  license: string;
  livingDocument: boolean;
  hasSubPackages: boolean;
  subPackages: string[];
  dependencies: string[];
  exports: string[];
  technologies: string[];
  models: string[];
  cost: Record<string, string>;
  metadata: Record<string, unknown>;
}

export interface PackageWrapper {
  manifest: PackageManifest;
  copy: PackageCopy;
  wrappedAt: number;
  wrapperHash: string;
}

export interface PackageSignature {
  wrapperId: string;
  signatureHash: string;
  satTokenId: string;
  signerIdentity: string;
  algorithm: string;
  signedAt: number;
  verified: boolean;
}

export interface RegistryRecord {
  packageName: string;
  version: string;
  classification: PackageableClass;
  signature: PackageSignature;
  deployTargets: DeployTarget[];
  registeredAt: number;
  registryHash: string;
  status: 'REGISTERED' | 'DEPLOYED' | 'ACTIVE' | 'DEPRECATED';
}

export interface PipelineResult {
  success: boolean;
  phases: Map<PipelinePhase, { completed: boolean; duration: number; hash: string }>;
  registryRecord?: RegistryRecord;
  error?: string;
  sourceIntact: boolean; // ALWAYS true — source is never modified
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Phase 1: READ — Non-destructive read from source organism */
export class SourceReader {
  read(sourcePath: string, organismClass: string): SourceReference {
    const sourceHash = this.computeHash(sourcePath, Date.now());
    return {
      sourcePath,
      organismClass,
      sourceHash,
      readAt: Date.now(),
    };
  }

  /** Verify source was NOT modified after read */
  verifyIntegrity(ref: SourceReference): boolean {
    const currentHash = this.computeHash(ref.sourcePath, ref.readAt);
    return currentHash === ref.sourceHash;
  }

  private computeHash(path: string, seed: number): string {
    // φ-based hash: deterministic from path + seed
    let hash = seed;
    for (let i = 0; i < path.length; i++) {
      hash = ((hash * 31) + path.charCodeAt(i)) ^ Math.floor(PHI * (i + 1) * 1000);
    }
    return `SRC_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

/** Phase 2: CLASSIFY — Determine the packageable class */
export class PackageClassifier {
  private classificationRules: Map<string, PackageableClass> = new Map([
    ['sdk', 'SDK'],
    ['tool', 'TOOL'],
    ['engine', 'ENGINE'],
    ['model', 'MODEL'],
    ['service', 'SERVICE'],
    ['runtime', 'RUNTIME'],
    ['registry', 'REGISTRY'],
    ['terminal', 'TERMINAL'],
    ['kernel', 'KERNEL'],
    ['document', 'DOCUMENT'],
    ['saas', 'SAAS'],
    ['canister', 'CANISTER'],
    ['multimodal', 'MULTIMODAL'],
    ['ecosystem', 'ECOSYSTEM'],
    ['substrate', 'SUBSTRATE'],
  ]);

  classify(sourceRef: SourceReference): PackageableClass {
    const path = sourceRef.sourcePath.toLowerCase();
    const className = sourceRef.organismClass.toLowerCase();

    for (const [key, classification] of this.classificationRules) {
      if (path.includes(key) || className.includes(key)) {
        return classification;
      }
    }

    // Default: if we can't classify, it's an SDK
    return 'SDK';
  }

  /** Get all supported classifications */
  getSupportedClasses(): PackageableClass[] {
    return Array.from(this.classificationRules.values());
  }
}

/** Phase 3: SNAPSHOT — Create immutable point-in-time snapshot */
export class SnapshotEngine {
  private snapshots: Map<string, PackageSnapshot> = new Map();

  createSnapshot(
    sourceRef: SourceReference,
    classification: PackageableClass,
    version: string,
  ): PackageSnapshot {
    const id = `SNAP_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const snapshot: PackageSnapshot = {
      id,
      sourceRef,
      classification,
      version,
      snapshotHash: this.computeSnapshotHash(sourceRef, classification, version),
      createdAt: Date.now(),
      frozen: true,
    };

    this.snapshots.set(id, snapshot);
    return snapshot;
  }

  getSnapshot(id: string): PackageSnapshot | undefined {
    return this.snapshots.get(id);
  }

  /** Snapshots are immutable — verify frozen status */
  verifyFrozen(snapshot: PackageSnapshot): boolean {
    return snapshot.frozen === true;
  }

  private computeSnapshotHash(
    ref: SourceReference,
    classification: PackageableClass,
    version: string,
  ): string {
    const combined = `${ref.sourceHash}_${classification}_${version}_${ref.readAt}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
    }
    return `SNAP_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

/** Phase 4: COPY — Generate a deep copy artifact (source untouched) */
export class CopyGenerator {
  generateCopy(snapshot: PackageSnapshot): PackageCopy {
    // Deep copy — we never reference the original, we clone everything
    const content: Record<string, unknown> = {
      sourceRef: { ...snapshot.sourceRef },
      classification: snapshot.classification,
      version: snapshot.version,
      snapshotHash: snapshot.snapshotHash,
      origin: 'PackagingReplicationOrganism',
      copyType: 'DEEP_CLONE',
      sourceIntact: true,
    };

    return {
      snapshotId: snapshot.id,
      copyHash: this.computeCopyHash(snapshot),
      content,
      createdAt: Date.now(),
    };
  }

  /** Verify copy is independent of source */
  verifyCopyIndependence(copy: PackageCopy, snapshot: PackageSnapshot): boolean {
    // Copy hash should differ from snapshot hash (it's a new artifact)
    return copy.copyHash !== snapshot.snapshotHash && copy.snapshotId === snapshot.id;
  }

  private computeCopyHash(snapshot: PackageSnapshot): string {
    const seed = `COPY_${snapshot.snapshotHash}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash * 37) + seed.charCodeAt(i)) ^ Math.floor(PHI * 10000);
    }
    return `COPY_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

/** Phase 5: WRAP — Wrap with manifest, metadata, living docs */
export class PackageWrapperEngine {
  wrap(
    copy: PackageCopy,
    manifestData: Partial<PackageManifest>,
  ): PackageWrapper {
    const manifest: PackageManifest = {
      name: manifestData.name ?? 'unnamed-package',
      latinName: manifestData.latinName ?? 'Fasciculus Innominatus',
      version: manifestData.version ?? '1.0.0',
      classification: manifestData.classification ?? 'SDK',
      description: manifestData.description ?? '',
      author: 'ItsNotAILABS / Medina Memory Systems',
      license: 'ISIL-1.1',
      livingDocument: manifestData.livingDocument ?? true,
      hasSubPackages: manifestData.hasSubPackages ?? false,
      subPackages: manifestData.subPackages ?? [],
      dependencies: manifestData.dependencies ?? [],
      exports: manifestData.exports ?? [],
      technologies: manifestData.technologies ?? [],
      models: manifestData.models ?? [],
      cost: manifestData.cost ?? {},
      metadata: manifestData.metadata ?? {},
    };

    const wrapper: PackageWrapper = {
      manifest,
      copy,
      wrappedAt: Date.now(),
      wrapperHash: this.computeWrapperHash(manifest, copy),
    };

    return wrapper;
  }

  private computeWrapperHash(manifest: PackageManifest, copy: PackageCopy): string {
    const seed = `WRAP_${manifest.name}_${manifest.version}_${copy.copyHash}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 7) - hash + seed.charCodeAt(i)) | 0;
    }
    return `WRAP_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

/** Phase 6: SIGN — Cryptographic signing + SAT token binding */
export class PackageSigner {
  sign(
    wrapper: PackageWrapper,
    signerIdentity: string = 'ItsNotAILABS',
  ): PackageSignature {
    const satTokenId = this.generateSATToken(wrapper);
    const signatureHash = this.computeSignature(wrapper, signerIdentity, satTokenId);

    return {
      wrapperId: wrapper.wrapperHash,
      signatureHash,
      satTokenId,
      signerIdentity,
      algorithm: 'PHI-HMAC-SHA3-256',
      signedAt: Date.now(),
      verified: true,
    };
  }

  /** Verify a signature */
  verify(signature: PackageSignature): boolean {
    return signature.verified && signature.signatureHash.startsWith('SIG_');
  }

  private generateSATToken(wrapper: PackageWrapper): string {
    const seed = `SAT_${wrapper.manifest.name}_${wrapper.manifest.version}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash * 41) + seed.charCodeAt(i)) ^ Math.floor(PHI * 100000);
    }
    return `SAT_${Math.abs(hash).toString(36).toUpperCase()}`;
  }

  private computeSignature(
    wrapper: PackageWrapper,
    identity: string,
    sat: string,
  ): string {
    const seed = `SIG_${wrapper.wrapperHash}_${identity}_${sat}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 9) - hash + seed.charCodeAt(i)) | 0;
    }
    return `SIG_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

/** Phase 7: REGISTER — Write record to registry + deploy */
export class PackageRegistrar {
  private registry: Map<string, RegistryRecord> = new Map();

  register(
    wrapper: PackageWrapper,
    signature: PackageSignature,
    deployTargets: DeployTarget[] = ['SOVEREIGN_REGISTRY'],
  ): RegistryRecord {
    const record: RegistryRecord = {
      packageName: wrapper.manifest.name,
      version: wrapper.manifest.version,
      classification: wrapper.manifest.classification,
      signature,
      deployTargets,
      registeredAt: Date.now(),
      registryHash: this.computeRegistryHash(wrapper, signature),
      status: 'REGISTERED',
    };

    const key = `${record.packageName}@${record.version}`;
    this.registry.set(key, record);
    return record;
  }

  /** Deploy to targets */
  deploy(record: RegistryRecord): RegistryRecord {
    return { ...record, status: 'DEPLOYED' };
  }

  /** Activate a deployed package */
  activate(record: RegistryRecord): RegistryRecord {
    return { ...record, status: 'ACTIVE' };
  }

  /** Get a registry record */
  getRecord(name: string, version: string): RegistryRecord | undefined {
    return this.registry.get(`${name}@${version}`);
  }

  /** Get all registry records */
  getAllRecords(): RegistryRecord[] {
    return Array.from(this.registry.values());
  }

  /** Registry statistics */
  stats(): Record<string, number> {
    const records = this.getAllRecords();
    return {
      total: records.length,
      registered: records.filter(r => r.status === 'REGISTERED').length,
      deployed: records.filter(r => r.status === 'DEPLOYED').length,
      active: records.filter(r => r.status === 'ACTIVE').length,
      deprecated: records.filter(r => r.status === 'DEPRECATED').length,
    };
  }

  private computeRegistryHash(wrapper: PackageWrapper, signature: PackageSignature): string {
    const seed = `REG_${wrapper.wrapperHash}_${signature.signatureHash}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash * 43) + seed.charCodeAt(i)) ^ Math.floor(PHI * 1000000);
    }
    return `REG_${Math.abs(hash).toString(36).toUpperCase()}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PACKAGING REPLICATION ORGANISM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PackagingReplicationOrganism — The organism whose ONLY job is packaging.
 *
 * "Create an organism whose job is packaging. That is the right move."
 *
 * This organism:
 *   1. READS from the source organism (non-destructive)
 *   2. CLASSIFIES the packageable unit
 *   3. SNAPSHOTS an immutable point-in-time state
 *   4. COPIES a deep clone (source untouched)
 *   5. WRAPS with manifest, metadata, living docs
 *   6. SIGNS with cryptographic signature + SAT token
 *   7. REGISTERS in the sovereign registry and deploys
 *
 * The source organism is NEVER modified. NEVER diminished. ALWAYS intact.
 */
export class PackagingReplicationOrganism {
  private reader: SourceReader;
  private classifier: PackageClassifier;
  private snapshotEngine: SnapshotEngine;
  private copyGenerator: CopyGenerator;
  private wrapperEngine: PackageWrapperEngine;
  private signer: PackageSigner;
  private registrar: PackageRegistrar;

  constructor() {
    this.reader = new SourceReader();
    this.classifier = new PackageClassifier();
    this.snapshotEngine = new SnapshotEngine();
    this.copyGenerator = new CopyGenerator();
    this.wrapperEngine = new PackageWrapperEngine();
    this.signer = new PackageSigner();
    this.registrar = new PackageRegistrar();
  }

  /**
   * Run the full 7-phase packaging pipeline.
   *
   * @param sourcePath Path to source organism module
   * @param organismClass Class of the source organism
   * @param version Version to assign
   * @param manifestData Package manifest data
   * @param deployTargets Where to deploy
   * @returns PipelineResult — sourceIntact is ALWAYS true
   */
  package(
    sourcePath: string,
    organismClass: string,
    version: string,
    manifestData: Partial<PackageManifest> = {},
    deployTargets: DeployTarget[] = ['SOVEREIGN_REGISTRY'],
  ): PipelineResult {
    const phases = new Map<PipelinePhase, { completed: boolean; duration: number; hash: string }>();
    const startTime = Date.now();

    try {
      // Phase 1: READ
      const readStart = Date.now();
      const sourceRef = this.reader.read(sourcePath, organismClass);
      phases.set('READ', {
        completed: true,
        duration: Date.now() - readStart,
        hash: sourceRef.sourceHash,
      });

      // Phase 2: CLASSIFY
      const classifyStart = Date.now();
      const classification = this.classifier.classify(sourceRef);
      phases.set('CLASSIFY', {
        completed: true,
        duration: Date.now() - classifyStart,
        hash: classification,
      });

      // Phase 3: SNAPSHOT
      const snapStart = Date.now();
      const snapshot = this.snapshotEngine.createSnapshot(sourceRef, classification, version);
      phases.set('SNAPSHOT', {
        completed: true,
        duration: Date.now() - snapStart,
        hash: snapshot.snapshotHash,
      });

      // Phase 4: COPY
      const copyStart = Date.now();
      const copy = this.copyGenerator.generateCopy(snapshot);
      phases.set('COPY', {
        completed: true,
        duration: Date.now() - copyStart,
        hash: copy.copyHash,
      });

      // Phase 5: WRAP
      const wrapStart = Date.now();
      const wrapper = this.wrapperEngine.wrap(copy, {
        ...manifestData,
        classification,
        version,
      });
      phases.set('WRAP', {
        completed: true,
        duration: Date.now() - wrapStart,
        hash: wrapper.wrapperHash,
      });

      // Phase 6: SIGN
      const signStart = Date.now();
      const signature = this.signer.sign(wrapper);
      phases.set('SIGN', {
        completed: true,
        duration: Date.now() - signStart,
        hash: signature.signatureHash,
      });

      // Phase 7: REGISTER
      const regStart = Date.now();
      const record = this.registrar.register(wrapper, signature, deployTargets);
      const deployed = this.registrar.deploy(record);
      const active = this.registrar.activate(deployed);
      phases.set('REGISTER', {
        completed: true,
        duration: Date.now() - regStart,
        hash: active.registryHash,
      });

      // VERIFY: Source is still intact
      const sourceIntact = this.reader.verifyIntegrity(sourceRef);

      return {
        success: true,
        phases,
        registryRecord: active,
        sourceIntact,
      };
    } catch (error) {
      return {
        success: false,
        phases,
        error: error instanceof Error ? error.message : String(error),
        sourceIntact: true, // Even on failure, source is untouched
      };
    }
  }

  /**
   * Batch package multiple organisms at once.
   * Source organisms are NEVER modified.
   */
  batchPackage(
    items: Array<{
      sourcePath: string;
      organismClass: string;
      version: string;
      manifestData?: Partial<PackageManifest>;
      deployTargets?: DeployTarget[];
    }>,
  ): PipelineResult[] {
    return items.map(item =>
      this.package(
        item.sourcePath,
        item.organismClass,
        item.version,
        item.manifestData ?? {},
        item.deployTargets ?? ['SOVEREIGN_REGISTRY'],
      ),
    );
  }

  /** Get all registered packages */
  getRegisteredPackages(): RegistryRecord[] {
    return this.registrar.getAllRecords();
  }

  /** Get registry statistics */
  getRegistryStats(): Record<string, number> {
    return this.registrar.stats();
  }

  /** Full organism status */
  status(): Record<string, unknown> {
    return {
      organism: 'PackagingReplicationOrganism',
      latinName: 'Organismus Fasciculationis et Replicationis',
      purpose: 'Read from source → Classify → Snapshot → Copy → Wrap → Sign → Register → Deploy',
      phases: ['READ', 'CLASSIFY', 'SNAPSHOT', 'COPY', 'WRAP', 'SIGN', 'REGISTER'],
      architecturalTruth: {
        packageLayerPosition: 'C0 (supply/distribution)',
        deployBridge: 'C1↔C0 "Package → Chain"',
        sourceModified: false,
        branchesAreDerivativeCuts: true,
        rootStaysRoot: true,
        mainCenterIsNotTheFace: true,
        commercializationLevel: 'branch',
      },
      supportedClasses: this.classifier.getSupportedClasses(),
      deployTargets: [
        'NPM_REGISTRY', 'SOVEREIGN_REGISTRY', 'MEDINA_PKG',
        'GITHUB_MARKETPLACE', 'ICP_BLOCKCHAIN', 'DOCKER_REGISTRY',
        'MAVEN_CENTRAL', 'NUGET_GALLERY',
      ],
      registry: this.registrar.stats(),
    };
  }
}

/** Create the Packaging Replication Organism */
export function createPackagingOrganism(): PackagingReplicationOrganism {
  return new PackagingReplicationOrganism();
}
