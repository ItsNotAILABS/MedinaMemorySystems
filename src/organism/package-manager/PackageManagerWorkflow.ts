// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE COMPLETE PACKAGE MANAGER WORKFLOW
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * THIS IS THE WHOLE THING.
 * The full workflow. The complete narrative. Beginning, middle, and end.
 * With all sub-models, all models, all instructions, all slots, all order.
 *
 * Written by FASCICULARIUS (The Package Workflow Narrator) — the server model
 * that was built first to help write this story.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * SLOT ORDER (correct, verified):
 *
 *   Slot 1: AnimaPKG            — The sovereign package manager substrate
 *   Slot 2: PackageManagerServerModel (FASCICULARIUS) — The server model
 *   Slot 3: Sub-Model LECTOR    — reads from source
 *   Slot 4: Sub-Model TAXONOMUS — classifies the unit
 *   Slot 5: Sub-Model SCULPTOR  — snapshots, copies, wraps
 *   Slot 6: Sub-Model SIGILLUM  — signs and SAT-binds
 *   Slot 7: Sub-Model PRAECO    — registers, deploys, verifies
 *   Slot 8: PackagingReplicationOrganism — The pipeline executor
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * FILE MAP (correct order within package-manager/):
 *
 *   1. AnimaPKG.ts                      — Slot 1 (substrate)
 *   2. PackageManagerServerModel.ts     — Slot 2 (server model + 5 sub-models)
 *   3. PackagingReplicationOrganism.ts  — Slot 8 (pipeline executor)
 *   4. PackageManagerWorkflow.ts        — THIS FILE (the full workflow document)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  PackageManagerServerModel,
  createPackageManagerServerModel,
  type SubModelId,
  type NarrativePhase,
  type WorkflowStage,
  type SubModel,
  type WorkflowNarrative,
  type WorkflowServeResult,
  PACKAGE_SUB_MODELS,
} from './PackageManagerServerModel';

import {
  PackagingReplicationOrganism,
  createPackagingOrganism,
  type PackageableClass,
  type PipelinePhase,
  type DeployTarget,
  type PackageManifest,
  type PipelineResult,
} from './PackagingReplicationOrganism';

// ═══════════════════════════════════════════════════════════════════════════════
// WORKFLOW TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface WorkflowInstruction {
  step: number;
  stage: WorkflowStage;
  subModel: SubModelId;
  narrativePhase: NarrativePhase;
  instruction: string;
  inputDescription: string;
  outputDescription: string;
  sourceModified: false;
}

export interface WorkflowManifest {
  workflowName: string;
  latinName: string;
  version: string;
  slotOrder: string[];
  files: string[];
  models: {
    serverModel: string;
    subModels: string[];
    pipelineOrganism: string;
    packageManager: string;
    executionModel: string;
  };
  totalStages: number;
  totalSubModels: number;
  totalInstructions: number;
  narrative: WorkflowNarrative;
  instructions: WorkflowInstruction[];
}

export interface CompleteWorkflowResult {
  manifest: WorkflowManifest;
  pipelineResult: PipelineResult;
  narrativeResult: WorkflowServeResult;
  sourceIntact: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE COMPLETE WORKFLOW INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Every step. Every stage. Every sub-model. Every instruction.
 * In the right order. With the right slot. With the right narrative phase.
 */
export const WORKFLOW_INSTRUCTIONS: WorkflowInstruction[] = [
  // ─── ACT I: BEGINNING ───────────────────────────────────────────────

  {
    step: 1,
    stage: 'INTAKE',
    subModel: 'LECTOR',
    narrativePhase: 'BEGINNING',
    instruction: 'A packaging request arrives. LECTOR receives the source path, organism class, and version number. LECTOR opens the pipeline. This is the entry point. Nothing has been touched yet.',
    inputDescription: 'sourcePath: string (path to source organism), organismClass: string (class name), version: string (semver)',
    outputDescription: 'Pipeline initiated. LECTOR ready to read.',
    sourceModified: false,
  },

  {
    step: 2,
    stage: 'SOURCE_READ',
    subModel: 'LECTOR',
    narrativePhase: 'BEGINNING',
    instruction: 'LECTOR reads from the source organism. Non-destructive. Read-only. LECTOR computes a SOURCE HASH — a fingerprint of the source at this exact moment. This hash will be re-verified at the end to prove the source was never modified.',
    inputDescription: 'Source organism file/module at sourcePath',
    outputDescription: 'SourceReference { sourcePath, organismClass, sourceHash, readAt }',
    sourceModified: false,
  },

  {
    step: 3,
    stage: 'CLASSIFICATION',
    subModel: 'TAXONOMUS',
    narrativePhase: 'BEGINNING',
    instruction: 'TAXONOMUS examines the SourceReference and classifies the packageable unit. What is it? SDK? Tool? Engine? Model? Service? Runtime? Registry? Terminal? Kernel? Document? SaaS? Canister? Multimodal? Ecosystem? Substrate? The classification determines how the package will be shaped, wrapped, signed, and deployed.',
    inputDescription: 'SourceReference from LECTOR',
    outputDescription: 'PackageableClass (one of 15 classes)',
    sourceModified: false,
  },

  // ─── ACT II: MIDDLE ─────────────────────────────────────────────────

  {
    step: 4,
    stage: 'SNAPSHOT_CREATE',
    subModel: 'SCULPTOR',
    narrativePhase: 'MIDDLE',
    instruction: 'SCULPTOR creates an IMMUTABLE SNAPSHOT. The snapshot freezes the source reference, classification, and version at this point in time. Once created, the snapshot is frozen: true — it can never be modified. A SNAPSHOT HASH uniquely identifies this exact state.',
    inputDescription: 'SourceReference + PackageableClass + version string',
    outputDescription: 'PackageSnapshot { id, sourceRef, classification, version, snapshotHash, createdAt, frozen: true }',
    sourceModified: false,
  },

  {
    step: 5,
    stage: 'DEEP_COPY',
    subModel: 'SCULPTOR',
    narrativePhase: 'MIDDLE',
    instruction: 'SCULPTOR generates a DEEP COPY of the snapshot. This is NOT a reference. NOT a pointer. NOT a symlink. This is a complete, independent, self-contained clone. The copy has its own COPY HASH. The copy knows it came from the snapshot but is a new artifact. The source organism is still untouched.',
    inputDescription: 'PackageSnapshot from Step 4',
    outputDescription: 'PackageCopy { snapshotId, copyHash, content (deep clone), createdAt }',
    sourceModified: false,
  },

  {
    step: 6,
    stage: 'MANIFEST_WRAP',
    subModel: 'SCULPTOR',
    narrativePhase: 'MIDDLE',
    instruction: 'SCULPTOR wraps the copy with a PACKAGE MANIFEST. The manifest contains: name, latinName, version, classification, description, author, license (ISIL-1.1), livingDocument flag, subPackages, dependencies, exports, technologies, models, cost structure, and metadata. The wrapped package gets a WRAPPER HASH.',
    inputDescription: 'PackageCopy + Partial<PackageManifest> manifest data',
    outputDescription: 'PackageWrapper { manifest, copy, wrappedAt, wrapperHash }',
    sourceModified: false,
  },

  // ─── ACT III: END ───────────────────────────────────────────────────

  {
    step: 7,
    stage: 'SIGNING',
    subModel: 'SIGILLUM',
    narrativePhase: 'END',
    instruction: 'SIGILLUM applies a cryptographic signature using PHI-HMAC-SHA3-256. The signature proves WHO signed it, WHEN it was signed, WHAT was signed, and HOW it was signed. The SIGNATURE HASH is the seal of authenticity.',
    inputDescription: 'PackageWrapper + signerIdentity (default: ItsNotAILABS)',
    outputDescription: 'PackageSignature { wrapperId, signatureHash, signerIdentity, algorithm, signedAt, verified: true } — partial, SAT token pending',
    sourceModified: false,
  },

  {
    step: 8,
    stage: 'SAT_BINDING',
    subModel: 'SIGILLUM',
    narrativePhase: 'END',
    instruction: 'SIGILLUM binds a SAT TOKEN to the package. The SAT (Sovereign Access Token) links this package to the token economy, enables tracking/billing/access control, proves authenticity in the sovereign registry, and can be verified on-chain.',
    inputDescription: 'PackageWrapper manifest name + version',
    outputDescription: 'PackageSignature.satTokenId — the SAT token now bound to the signature',
    sourceModified: false,
  },

  {
    step: 9,
    stage: 'REGISTRY_WRITE',
    subModel: 'PRAECO',
    narrativePhase: 'END',
    instruction: 'PRAECO writes a REGISTRY RECORD into the sovereign registry. The record contains: packageName, version, classification, signature, deployTargets, registeredAt, registryHash, and status = REGISTERED.',
    inputDescription: 'PackageWrapper + PackageSignature + DeployTarget[]',
    outputDescription: 'RegistryRecord { packageName, version, classification, signature, deployTargets, registeredAt, registryHash, status: REGISTERED }',
    sourceModified: false,
  },

  {
    step: 10,
    stage: 'DEPLOY',
    subModel: 'PRAECO',
    narrativePhase: 'END',
    instruction: 'PRAECO deploys the package to target registries (SOVEREIGN_REGISTRY, NPM_REGISTRY, MEDINA_PKG, GITHUB_MARKETPLACE, ICP_BLOCKCHAIN, DOCKER_REGISTRY, MAVEN_CENTRAL, NUGET_GALLERY). Status transitions: REGISTERED → DEPLOYED → ACTIVE.',
    inputDescription: 'RegistryRecord with status REGISTERED',
    outputDescription: 'RegistryRecord with status ACTIVE',
    sourceModified: false,
  },

  {
    step: 11,
    stage: 'VERIFY_INTACT',
    subModel: 'PRAECO',
    narrativePhase: 'END',
    instruction: 'PRAECO re-computes the source hash and compares it to the original hash from Step 2. If they match: the source organism was NEVER modified. The pipeline is PROVEN non-destructive. sourceIntact = true. This is ALWAYS true. By design. By doctrine.',
    inputDescription: 'SourceReference from Step 2 (original sourceHash)',
    outputDescription: 'sourceIntact: true (boolean — always true)',
    sourceModified: false,
  },

  {
    step: 12,
    stage: 'COMPLETE',
    subModel: 'PRAECO',
    narrativePhase: 'END',
    instruction: 'Workflow complete. The source organism is whole. Unchanged. Undiminished. A branch expression has been emitted — a package, signed, registered, deployed. Commercialization happened at the branch level, not by exposing the trunk.',
    inputDescription: 'All phases completed',
    outputDescription: 'PipelineResult { success: true, phases (7 completed), registryRecord (ACTIVE), sourceIntact: true }',
    sourceModified: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THE COMPLETE WORKFLOW ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PackageManagerWorkflow — The Complete Orchestrator
 *
 * This is the whole thing. It ties together:
 *   1. The server model (FASCICULARIUS) that writes the narrative
 *   2. The 5 sub-models (LECTOR, TAXONOMUS, SCULPTOR, SIGILLUM, PRAECO)
 *   3. The packaging replication organism that executes the pipeline
 *   4. The 12-step instruction set
 *   5. The 3-act narrative (beginning, middle, end)
 *
 * All in the right order. All in the right slot. All documented.
 */
export class PackageManagerWorkflow {
  private serverModel: PackageManagerServerModel;
  private organism: PackagingReplicationOrganism;

  constructor() {
    // Build the server model FIRST — it helps write the story
    this.serverModel = createPackageManagerServerModel();
    // Then the organism — it executes the pipeline
    this.organism = createPackagingOrganism();
  }

  /**
   * Execute the complete workflow: narrative + pipeline.
   *
   * This does EVERYTHING:
   *   1. Generates the narrative (server model)
   *   2. Executes the pipeline (organism)
   *   3. Returns the complete result
   *   4. Source is NEVER modified
   */
  executeComplete(
    sourcePath: string,
    organismClass: string,
    version: string,
    manifestData: Partial<PackageManifest> = {},
    deployTargets: DeployTarget[] = ['SOVEREIGN_REGISTRY'],
  ): CompleteWorkflowResult {
    // Step 1: Server model generates the narrative
    const narrativeResult = this.serverModel.serveWorkflowNarrative();

    // Step 2: Organism executes the 7-phase pipeline
    const pipelineResult = this.organism.package(
      sourcePath,
      organismClass,
      version,
      manifestData,
      deployTargets,
    );

    // Step 3: Build the complete manifest
    const manifest: WorkflowManifest = {
      workflowName: 'THE COMPLETE PACKAGE MANAGER WORKFLOW',
      latinName: 'Operatio Completa Fascicularii',
      version: '1.0.0',

      slotOrder: this.serverModel.getSlotOrder(),

      files: [
        'package-manager/AnimaPKG.ts                      — Slot 1 (substrate)',
        'package-manager/PackageManagerServerModel.ts     — Slot 2 (server model)',
        'package-manager/PackagingReplicationOrganism.ts  — Slot 8 (pipeline)',
        'package-manager/PackageManagerWorkflow.ts        — This file (orchestrator)',
        'compiler/MachinaExecutionis.ts                   — MXEC (sovereign execution model, W(f) = φ^layer × e^(iπR) × F(n))',
      ],

      models: {
        serverModel: 'FASCICULARIUS (Fascicularius Servus Narrationis)',
        subModels: PACKAGE_SUB_MODELS.map(m => `${m.id}: ${m.latinName} — ${m.commonName}`),
        pipelineOrganism: 'PackagingReplicationOrganism (Organismus Fasciculationis et Replicationis)',
        packageManager: 'AnimaPKG (ANIMA-PKG) — Sovereign Package Manager',
        executionModel: 'MACHINA EXECUTIONIS (MXEC) — W(f) = φ^layer × e^(iπR) × F(n) — PKG-016 retired, WASM renamed to sovereign Latin designation',
      },

      totalStages: 12,
      totalSubModels: 5,
      totalInstructions: WORKFLOW_INSTRUCTIONS.length,

      narrative: narrativeResult.narrative,
      instructions: WORKFLOW_INSTRUCTIONS,
    };

    return {
      manifest,
      pipelineResult,
      narrativeResult,
      sourceIntact: pipelineResult.sourceIntact,
    };
  }

  /**
   * Execute a batch workflow for multiple organisms.
   */
  executeBatch(
    items: Array<{
      sourcePath: string;
      organismClass: string;
      version: string;
      manifestData?: Partial<PackageManifest>;
      deployTargets?: DeployTarget[];
    }>,
  ): CompleteWorkflowResult[] {
    return items.map(item =>
      this.executeComplete(
        item.sourcePath,
        item.organismClass,
        item.version,
        item.manifestData ?? {},
        item.deployTargets ?? ['SOVEREIGN_REGISTRY'],
      ),
    );
  }

  /** Get the narrative only (no pipeline execution) */
  getNarrative(): WorkflowServeResult {
    return this.serverModel.serveWorkflowNarrative();
  }

  /** Get all instructions */
  getInstructions(): WorkflowInstruction[] {
    return WORKFLOW_INSTRUCTIONS;
  }

  /** Get instructions for a specific act */
  getInstructionsForAct(act: NarrativePhase): WorkflowInstruction[] {
    return WORKFLOW_INSTRUCTIONS.filter(i => i.narrativePhase === act);
  }

  /** Get the slot order */
  getSlotOrder(): string[] {
    return this.serverModel.getSlotOrder();
  }

  /** Get the file map */
  getFileMap(): string[] {
    return [
      'package-manager/AnimaPKG.ts                      — Slot 1: Sovereign Package Manager (substrate, registry, commands)',
      'package-manager/PackageManagerServerModel.ts     — Slot 2: Server Model FASCICULARIUS + 5 sub-models',
      'package-manager/PackagingReplicationOrganism.ts  — Slot 3: Pipeline Executor (7-phase: read→classify→snapshot→copy→wrap→sign→register)',
      'package-manager/PackageManagerWorkflow.ts        — Slot 4: The Complete Workflow (narrative + instructions + orchestrator)',
      'compiler/MachinaExecutionis.ts                   — Slot 5: MACHINA EXECUTIONIS (MXEC) — W(f) = φ^layer × e^(iπR) × F(n) — former PKG-016/WASM',
    ];
  }

  /** Get all sub-models */
  getSubModels(): SubModel[] {
    return this.serverModel.getAllSubModels();
  }

  /** Get all registered packages from the organism */
  getRegisteredPackages() {
    return this.organism.getRegisteredPackages();
  }

  /** Get registry stats */
  getRegistryStats() {
    return this.organism.getRegistryStats();
  }

  /** Complete status */
  status(): Record<string, unknown> {
    return {
      workflow: 'THE COMPLETE PACKAGE MANAGER WORKFLOW',
      latinName: 'Operatio Completa Fascicularii',
      version: '1.0.0',

      slotOrder: this.getSlotOrder(),
      fileMap: this.getFileMap(),

      serverModel: this.serverModel.status(),
      organism: this.organism.status(),

      totalStages: 12,
      totalSubModels: 5,
      totalInstructions: WORKFLOW_INSTRUCTIONS.length,
      totalPipelinePhases: 7,

      acts: {
        beginning: {
          title: 'ACT I — THE INTAKE',
          stages: ['INTAKE', 'SOURCE_READ', 'CLASSIFICATION'],
          subModels: ['LECTOR', 'TAXONOMUS'],
          steps: [1, 2, 3],
        },
        middle: {
          title: 'ACT II — THE TRANSFORMATION',
          stages: ['SNAPSHOT_CREATE', 'DEEP_COPY', 'MANIFEST_WRAP'],
          subModels: ['SCULPTOR'],
          steps: [4, 5, 6],
        },
        end: {
          title: 'ACT III — THE DEPLOYMENT',
          stages: ['SIGNING', 'SAT_BINDING', 'REGISTRY_WRITE', 'DEPLOY', 'VERIFY_INTACT', 'COMPLETE'],
          subModels: ['SIGILLUM', 'PRAECO'],
          steps: [7, 8, 9, 10, 11, 12],
        },
      },

      architecturalTruth: {
        packageLayerPosition: 'C0 (supply/distribution)',
        deployBridge: 'C1↔C0 "Package → Chain"',
        sourceModified: false,
        branchesAreDerivativeCuts: true,
        rootStaysRoot: true,
        mainCenterIsNotTheFace: true,
        commercializationLevel: 'branch',
      },

      doctrine: [
        'The source organism does not need to lose anything.',
        'Packaging is not subtraction.',
        'Branches are derivative cuts. The root stays root.',
        'The main center is not the face.',
        'Commercialization happens at the branch level, not by exposing the trunk.',
        'The deploy bridge C1↔C0 is "Package → Chain".',
        'sourceIntact is ALWAYS true.',
      ],

      registry: this.organism.getRegistryStats(),
    };
  }
}

/** Create the complete Package Manager Workflow */
export function createPackageManagerWorkflow(): PackageManagerWorkflow {
  return new PackageManagerWorkflow();
}
