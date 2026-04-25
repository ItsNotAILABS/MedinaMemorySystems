import {
  type BuildPhase, type AgentBuildRole, type BuildStatus, type SandboxTier,
  type ExportFormat, type KernelState, type RuntimeEntityClass,
  getBuildAgents, getBuildAgent, getBuildAgentsByRole, activateBuildAgent,
  createBuildArtifact, deployArtifact, getBuildArtifacts, getArtifactsByStatus,
  getArtifactsByPhase, getBuildSuccessRate,
  getGenesisEntities, getGenesisEntity, getEntitiesByClass,
  syncGenesisEntity, syncAllGenesisEntities, healGenesisEntity,
  executeKernel, getKernelExecutions, getKernelExecutionsByState, getKernelSuccessRate,
  openSandboxSession, sealSandboxSession, getSandboxSessions, getActiveSandboxes, getSandboxesByTier,
  createExportJob, processExportJob, processAllPendingExports, getExportJobs, getReadyExports,
  getPackageSubstrates, getPackagesByType, getPackage, verifyPackageCoherence,
  runBuilderRuntimeCycle, getBuilderRuntimeCycles, getBuilderRuntimeDashboard,
} from '../lib/builderRuntimeFlow';

describe('Builder Runtime Flow — Build Agents', () => {
  it('returns 8 pre-seeded agents', () => {
    expect(getBuildAgents().length).toBe(8);
  });

  it('each agent has required fields', () => {
    for (const a of getBuildAgents()) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.role).toBeTruthy();
      expect(a.specialty.length).toBeGreaterThan(0);
      expect(a.fieldGradientStrength).toBeGreaterThanOrEqual(0);
    }
  });

  it('getBuildAgent retrieves by id', () => {
    const agents = getBuildAgents();
    const found = getBuildAgent(agents[0].id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(agents[0].name);
  });

  it('getBuildAgent returns undefined for unknown', () => {
    expect(getBuildAgent('ghost')).toBeUndefined();
  });

  it('getBuildAgentsByRole filters correctly', () => {
    const testers = getBuildAgentsByRole('tester');
    expect(testers.length).toBe(1);
    expect(testers[0].name).toBe('Tester-Nexus');
  });

  it('activateBuildAgent sets status to building', () => {
    const agent = getBuildAgentsByRole('scaffolder')[0];
    agent.status = 'idle'; // reset
    const result = activateBuildAgent(agent.id, 'scaffold');
    expect(result).toBeDefined();
    expect(result!.status).toBe('building');
    expect(result!.currentPhase).toBe('scaffold');
  });

  it('all 8 roles are present', () => {
    const roles = new Set(getBuildAgents().map(a => a.role));
    const expected: AgentBuildRole[] = ['scaffolder', 'compiler', 'linker', 'tester', 'optimizer', 'packager', 'deployer', 'verifier'];
    for (const r of expected) expect(roles).toContain(r);
  });
});

describe('Builder Runtime Flow — Artifacts', () => {
  it('createBuildArtifact creates an artifact', () => {
    const agent = getBuildAgents()[0];
    const artifact = createBuildArtifact('test-artifact', 'compile', agent.id);
    expect(artifact.id).toBeTruthy();
    expect(['passing', 'failing']).toContain(artifact.status);
    expect(artifact.testsRun).toBeGreaterThan(0);
    expect(artifact.phiChecksum).toBeGreaterThan(0);
  });

  it('artifact test pass count <= tests run', () => {
    const agent = getBuildAgents()[1];
    const artifact = createBuildArtifact('check-artifact', 'test', agent.id);
    expect(artifact.testsPassing).toBeLessThanOrEqual(artifact.testsRun);
  });

  it('deployArtifact deploys a passing artifact', () => {
    const agent = getBuildAgents()[2];
    // Create artifacts until one passes
    let artifact = createBuildArtifact('deploy-test', 'deploy', agent.id);
    for (let i = 0; i < 10 && artifact.status !== 'passing'; i++) {
      artifact = createBuildArtifact(`deploy-test-${i}`, 'deploy', agent.id);
    }
    if (artifact.status === 'passing') {
      const deployed = deployArtifact(artifact.id);
      expect(deployed!.status).toBe('deployed');
      expect(deployed!.deployedAt).toBeTruthy();
    }
  });

  it('getBuildSuccessRate returns 0-1', () => {
    const rate = getBuildSuccessRate();
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(1);
  });

  it('getArtifactsByPhase filters correctly', () => {
    const compileArtifacts = getArtifactsByPhase('compile');
    for (const a of compileArtifacts) expect(a.phase).toBe('compile');
  });
});

describe('Builder Runtime Flow — Genesis Entities', () => {
  it('getGenesisEntities returns 5 pre-seeded entities', () => {
    expect(getGenesisEntities().length).toBe(5);
  });

  it('each entity has a valid class', () => {
    const valid: RuntimeEntityClass[] = ['genesis', 'phantom', 'builder', 'executor', 'validator'];
    for (const e of getGenesisEntities()) expect(valid).toContain(e.class);
  });

  it('syncGenesisEntity updates heartbeat', () => {
    const entity = getGenesisEntities()[0];
    const result = syncGenesisEntity(entity.id);
    expect(result).toBeDefined();
    expect(result!.phase).toBe('sync');
    expect(result!.lastHeartbeat).toBeTruthy();
  });

  it('syncGenesisEntity returns undefined for unknown id', () => {
    expect(syncGenesisEntity('ghost')).toBeUndefined();
  });

  it('syncAllGenesisEntities syncs all 5', () => {
    const results = syncAllGenesisEntities();
    expect(results.length).toBe(5);
  });

  it('healGenesisEntity increments recovery count', () => {
    const entity = getGenesisEntities()[0];
    const before = entity.recoveryCount;
    healGenesisEntity(entity.id);
    expect(entity.recoveryCount).toBe(before + 1);
  });

  it('getEntitiesByClass filters correctly', () => {
    const builders = getEntitiesByClass('builder');
    expect(builders.length).toBe(1);
  });
});

describe('Builder Runtime Flow — Kernel Execution', () => {
  it('executeKernel returns a kernel execution', () => {
    const exec = executeKernel('kernel-001');
    expect(exec.id).toBeTruthy();
    expect(exec.kernelId).toBe('kernel-001');
    expect(exec.compressionRatio).toBeGreaterThanOrEqual(0);
    expect(exec.compressionRatio).toBeLessThanOrEqual(1);
    expect(exec.outputGlyph).toBeTruthy();
    expect(typeof exec.success).toBe('boolean');
  });

  it('torusCoordinate has theta and phi', () => {
    const exec = executeKernel('kernel-002');
    expect(exec.torusCoordinate.theta).toBeGreaterThanOrEqual(0);
    expect(exec.torusCoordinate.phi).toBeGreaterThanOrEqual(0);
  });

  it('getKernelSuccessRate returns 0-1', () => {
    const rate = getKernelSuccessRate();
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(1);
  });

  it('getKernelExecutionsByState filters correctly', () => {
    for (const e of getKernelExecutionsByState('compressed')) {
      expect(e.state).toBe('compressed');
    }
  });
});

describe('Builder Runtime Flow — Sandbox', () => {
  it('openSandboxSession creates an active session', () => {
    const s = openSandboxSession('test-sandbox', 'ephemeral');
    expect(s.id).toBeTruthy();
    expect(s.status).toBe('active');
    expect(s.tier).toBe('ephemeral');
    expect(s.isolationScore).toBeGreaterThanOrEqual(0);
  });

  it('sealSandboxSession marks as sealed', () => {
    const s = openSandboxSession('to-seal', 'persistent');
    const sealed = sealSandboxSession(s.id);
    expect(sealed!.status).toBe('sealed');
  });

  it('getSandboxesByTier filters correctly', () => {
    openSandboxSession('isolated-1', 'isolated');
    const isolated = getSandboxesByTier('isolated');
    expect(isolated.length).toBeGreaterThan(0);
    for (const s of isolated) expect(s.tier).toBe('isolated');
  });

  it('getActiveSandboxes returns only active', () => {
    for (const s of getActiveSandboxes()) expect(s.status).toBe('active');
  });
});

describe('Builder Runtime Flow — Exports', () => {
  it('createExportJob queues a job', () => {
    const job = createExportJob('artifact-123', 'json');
    expect(job.id).toBeTruthy();
    expect(job.status).toBe('queued');
    expect(job.format).toBe('json');
    expect(job.phiSigned).toBe(true);
  });

  it('processExportJob generates the export', () => {
    const job = createExportJob('artifact-456', 'pdf');
    const result = processExportJob(job.id);
    expect(result!.status).toBe('ready');
    expect(result!.sizeBytes).toBeGreaterThan(0);
    expect(result!.downloadUrl).toBeTruthy();
    expect(result!.autoDelivered).toBe(true);
  });

  it('getReadyExports returns only ready jobs', () => {
    for (const j of getReadyExports()) expect(j.status).toBe('ready');
  });
});

describe('Builder Runtime Flow — Packages', () => {
  it('getPackageSubstrates returns 6 pre-seeded packages', () => {
    expect(getPackageSubstrates().length).toBe(6);
  });

  it('packages have valid types', () => {
    const valid = ['core', 'organism', 'extension', 'sovereign', 'icp'];
    for (const p of getPackageSubstrates()) expect(valid).toContain(p.type);
  });

  it('verifyPackageCoherence updates coherence score', () => {
    const pkg = getPackageSubstrates()[0];
    const result = verifyPackageCoherence(pkg.id);
    expect(result).toBeDefined();
    expect(result!.coherenceScore).toBeGreaterThanOrEqual(0);
    expect(result!.coherenceScore).toBeLessThanOrEqual(1);
  });

  it('getPackagesByType filters correctly', () => {
    const sovereign = getPackagesByType('sovereign');
    for (const p of sovereign) expect(p.type).toBe('sovereign');
  });
});

describe('Builder Runtime Flow — Cycle & Dashboard', () => {
  it('runBuilderRuntimeCycle returns a complete cycle', () => {
    const cycle = runBuilderRuntimeCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.agentsActivated).toBe(8);
    expect(cycle.artifactsBuilt).toBe(8);
    expect(cycle.genesisEntitiesSynced).toBe(5);
    expect(cycle.packagesVerified).toBe(6);
    expect(cycle.buildSuccessRate).toBeGreaterThanOrEqual(0);
    expect(cycle.buildSuccessRate).toBeLessThanOrEqual(1);
    expect(cycle.phiCoherence).toBeGreaterThanOrEqual(0);
  });

  it('getBuilderRuntimeCycles accumulates', () => {
    const before = getBuilderRuntimeCycles().length;
    runBuilderRuntimeCycle();
    expect(getBuilderRuntimeCycles().length).toBeGreaterThan(before);
  });

  it('getBuilderRuntimeDashboard returns correct structure', () => {
    const dash = getBuilderRuntimeDashboard();
    expect(dash.id).toBe('builder-runtime-dashboard');
    expect(dash.totalAgents).toBe(8);
    expect(dash.genesisEntities).toBe(5);
    expect(dash.packageSubstrates).toBe(6);
    expect(['green', 'yellow', 'red']).toContain(dash.buildHealth);
  });
});
