import {
  // Types
  WorkerType,
  WorkerStatus,
  ProductionStage,
  ProtocolCategory,
  ProtocolStatus,
  InstallerTarget,
  DepartmentName,

  // Worker Registry
  createWorker,
  getWorker,
  listWorkers,
  assignTask,
  completeTask,
  deployWorker,
  retireWorker,
  addCertification,

  // Production Engine
  createProductionOrder,
  getProductionOrder,
  listProductionOrders,
  assignWorkersToOrder,
  advanceProductionStage,
  failProductionOrder,
  getProductionResult,

  // Protocol Registry
  registerProtocol,
  getProtocol,
  getProtocolByName,
  listProtocols,
  activateProtocol,
  deprecateProtocol,

  // Installer Registry
  registerInstaller,
  getInstaller,
  getInstallerByName,
  listInstallers,
  simulateInstall,
  getInstallLog,

  // Departments & Houses
  initDepartment,
  getDepartment,
  listDepartments,
  setDepartmentManager,
  addProjectToDepartment,
  initHouse,
  getHouse,
  listHouses,

  // Stats & Reporting
  getEnterpriseStats,
  getWorkerReport,
  getDepartmentReport,

  // Lifecycle
  resetEnterpriseState,
  bootstrapEnterprise,
} from '../lib/enterpriseOperationsPacket';

// Reset state before each test to ensure isolation
beforeEach(() => {
  bootstrapEnterprise();
});

// ═══════════════════════════════════════════════════════════════════
// WORKER REGISTRY
// ═══════════════════════════════════════════════════════════════════

describe('Worker Registry', () => {
  it('should create a production-worker', () => {
    const w = createWorker('production-worker', 'Builder Alpha', 'Engineering');
    expect(w.type).toBe('production-worker');
    expect(w.name).toBe('Builder Alpha');
    expect(w.department).toBe('Engineering');
    expect(w.status).toBe('idle');
    expect(w.id).toBeDefined();
  });

  it('should create a company-worker', () => {
    const w = createWorker('company-worker', 'Onboarding Bot', 'Operations');
    expect(w.type).toBe('company-worker');
  });

  it('should create a certification-worker', () => {
    const w = createWorker('certification-worker', 'Certifier One', 'Security');
    expect(w.type).toBe('certification-worker');
  });

  it('should create a gubernator-worker', () => {
    const w = createWorker('gubernator-worker', 'Governor Prime', 'Governance');
    expect(w.type).toBe('gubernator-worker');
  });

  it('should create an asi-fleet-worker', () => {
    const w = createWorker('asi-fleet-worker', 'Fleet Node X', 'Intelligence');
    expect(w.type).toBe('asi-fleet-worker');
  });

  it('should initialize performance score near PHI_INVERSE (~0.618)', () => {
    const w = createWorker('production-worker', 'Phi Worker', 'Engineering');
    expect(w.performanceScore).toBeCloseTo(0.618, 2);
  });

  it('should start with empty career history', () => {
    const w = createWorker('production-worker', 'Fresh', 'Engineering');
    expect(w.careerHistory).toHaveLength(0);
    expect(w.totalTasksCompleted).toBe(0);
    expect(w.currentTask).toBeNull();
  });

  it('should retrieve a worker by id', () => {
    const w = createWorker('production-worker', 'Findable', 'Engineering');
    const found = getWorker(w.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe('Findable');
  });

  it('should return undefined for unknown worker id', () => {
    expect(getWorker('nonexistent-id')).toBeUndefined();
  });

  it('should list workers filtered by type', () => {
    createWorker('production-worker', 'A', 'Engineering');
    createWorker('production-worker', 'B', 'Engineering');
    createWorker('company-worker', 'C', 'Operations');
    const productionWorkers = listWorkers({ type: 'production-worker' });
    expect(productionWorkers.length).toBe(2);
  });

  it('should list workers filtered by status', () => {
    const w = createWorker('production-worker', 'Active One', 'Engineering');
    assignTask(w.id, 'build stuff');
    const active = listWorkers({ status: 'active' });
    expect(active.length).toBeGreaterThanOrEqual(1);
  });

  it('should list workers filtered by department', () => {
    createWorker('production-worker', 'Eng Worker', 'Engineering');
    createWorker('company-worker', 'Gov Worker', 'Governance');
    const eng = listWorkers({ department: 'Engineering' });
    expect(eng.every((w) => w.department === 'Engineering')).toBe(true);
  });

  it('should auto-register worker in department', () => {
    const w = createWorker('production-worker', 'Dept Worker', 'Engineering');
    const dept = getDepartment('Engineering');
    expect(dept!.workers).toContain(w.id);
  });

  it('should auto-register worker in house', () => {
    const w = createWorker('production-worker', 'House Worker', 'Engineering', 'House Medina');
    const house = getHouse('House Medina');
    expect(house!.members).toContain(w.id);
  });
});

// ═══════════════════════════════════════════════════════════════════
// CAREER TRACKING
// ═══════════════════════════════════════════════════════════════════

describe('Career Tracking', () => {
  it('should assign a task to a worker', () => {
    const w = createWorker('production-worker', 'Tasker', 'Engineering');
    assignTask(w.id, 'build widget');
    const updated = getWorker(w.id)!;
    expect(updated.status).toBe('active');
    expect(updated.currentTask).toBe('build widget');
    expect(updated.careerHistory).toHaveLength(1);
  });

  it('should complete a task', () => {
    const w = createWorker('production-worker', 'Completer', 'Engineering');
    assignTask(w.id, 'task-one');
    completeTask(w.id, 'success');
    const updated = getWorker(w.id)!;
    expect(updated.status).toBe('idle');
    expect(updated.currentTask).toBeNull();
    expect(updated.totalTasksCompleted).toBe(1);
    expect(updated.careerHistory[0].outcome).toBe('success');
    expect(updated.careerHistory[0].end).not.toBeNull();
  });

  it('should increase performance score on success', () => {
    const w = createWorker('production-worker', 'Winner', 'Engineering');
    const initialScore = w.performanceScore;
    assignTask(w.id, 'winning-task');
    completeTask(w.id, 'success');
    expect(getWorker(w.id)!.performanceScore).toBeGreaterThan(initialScore);
  });

  it('should decrease performance score on failure', () => {
    const w = createWorker('production-worker', 'Loser', 'Engineering');
    const initialScore = w.performanceScore;
    assignTask(w.id, 'failing-task');
    completeTask(w.id, 'failed');
    expect(getWorker(w.id)!.performanceScore).toBeLessThan(initialScore);
  });

  it('should handle reassignment by closing previous assignment', () => {
    const w = createWorker('production-worker', 'Reassigned', 'Engineering');
    assignTask(w.id, 'task-a');
    assignTask(w.id, 'task-b');
    const updated = getWorker(w.id)!;
    expect(updated.careerHistory).toHaveLength(2);
    expect(updated.careerHistory[0].outcome).toBe('reassigned');
    expect(updated.careerHistory[0].end).not.toBeNull();
    expect(updated.currentTask).toBe('task-b');
  });

  it('should deploy a worker', () => {
    const w = createWorker('production-worker', 'Deployer', 'Engineering');
    deployWorker(w.id);
    expect(getWorker(w.id)!.status).toBe('deployed');
  });

  it('should retire a worker', () => {
    const w = createWorker('production-worker', 'Retiree', 'Engineering');
    retireWorker(w.id);
    expect(getWorker(w.id)!.status).toBe('retired');
  });

  it('should retire a worker who has a current task', () => {
    const w = createWorker('production-worker', 'Busy Retiree', 'Engineering');
    assignTask(w.id, 'important-task');
    retireWorker(w.id);
    const updated = getWorker(w.id)!;
    expect(updated.status).toBe('retired');
    expect(updated.currentTask).toBeNull();
    expect(updated.totalTasksCompleted).toBe(1);
  });

  it('should throw when assigning task to retired worker', () => {
    const w = createWorker('production-worker', 'Retired', 'Engineering');
    retireWorker(w.id);
    expect(() => assignTask(w.id, 'impossible')).toThrow('retired');
  });

  it('should throw when completing task with no current task', () => {
    const w = createWorker('production-worker', 'No Task', 'Engineering');
    expect(() => completeTask(w.id)).toThrow('no current task');
  });

  it('should add certifications to a worker', () => {
    const w = createWorker('certification-worker', 'Cert Expert', 'Security');
    addCertification(w.id, 'ISO-27001');
    addCertification(w.id, 'SOC2');
    expect(getWorker(w.id)!.certifications).toEqual(['ISO-27001', 'SOC2']);
  });

  it('should not duplicate certifications', () => {
    const w = createWorker('certification-worker', 'Duper', 'Security');
    addCertification(w.id, 'ISO-27001');
    addCertification(w.id, 'ISO-27001');
    expect(getWorker(w.id)!.certifications).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════════
// PRODUCTION ENGINE
// ═══════════════════════════════════════════════════════════════════

describe('Production Engine', () => {
  it('should create a production order', () => {
    const order = createProductionOrder('Widget', { color: 'blue' }, 5, 'admin');
    expect(order.what).toBe('Widget');
    expect(order.stage).toBe('queued');
    expect(order.priority).toBe(5);
    expect(order.requester).toBe('admin');
  });

  it('should retrieve a production order by id', () => {
    const order = createProductionOrder('Gadget', {}, 3, 'user');
    expect(getProductionOrder(order.id)).toBeDefined();
  });

  it('should list all production orders', () => {
    createProductionOrder('A', {}, 1, 'u1');
    createProductionOrder('B', {}, 2, 'u2');
    expect(listProductionOrders().length).toBeGreaterThanOrEqual(2);
  });

  it('should list production orders filtered by stage', () => {
    const order = createProductionOrder('Filtered', {}, 1, 'u');
    const w = createWorker('production-worker', 'PW', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);
    const assigned = listProductionOrders('assigned');
    expect(assigned.some((o) => o.id === order.id)).toBe(true);
    expect(listProductionOrders('queued').every((o) => o.id !== order.id)).toBe(true);
  });

  it('should assign workers to an order', () => {
    const order = createProductionOrder('Assembly', {}, 7, 'boss');
    const w1 = createWorker('production-worker', 'W1', 'Engineering');
    const w2 = createWorker('production-worker', 'W2', 'Engineering');
    const updated = assignWorkersToOrder(order.id, [w1.id, w2.id]);
    expect(updated.stage).toBe('assigned');
    expect(updated.assignedWorkers).toHaveLength(2);
    expect(getWorker(w1.id)!.status).toBe('active');
  });

  it('should throw when assigning workers to non-queued order', () => {
    const order = createProductionOrder('Double', {}, 1, 'u');
    const w = createWorker('production-worker', 'PW', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);
    const w2 = createWorker('production-worker', 'PW2', 'Engineering');
    expect(() => assignWorkersToOrder(order.id, [w2.id])).toThrow('not in queued stage');
  });

  it('should advance through production stages', () => {
    const order = createProductionOrder('Pipeline', {}, 5, 'mgr');
    const w = createWorker('production-worker', 'Worker', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);

    advanceProductionStage(order.id); // assigned → building
    expect(getProductionOrder(order.id)!.stage).toBe('building');

    advanceProductionStage(order.id); // building → testing
    expect(getProductionOrder(order.id)!.stage).toBe('testing');

    advanceProductionStage(order.id); // testing → certifying
    expect(getProductionOrder(order.id)!.stage).toBe('certifying');

    advanceProductionStage(order.id); // certifying → complete
    expect(getProductionOrder(order.id)!.stage).toBe('complete');
  });

  it('should release workers and create result on completion', () => {
    const order = createProductionOrder('Complete Me', {}, 8, 'boss');
    const w = createWorker('production-worker', 'Finisher', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);

    advanceProductionStage(order.id); // → building
    advanceProductionStage(order.id); // → testing
    advanceProductionStage(order.id); // → certifying
    advanceProductionStage(order.id); // → complete

    const result = getProductionResult(order.id);
    expect(result).toBeDefined();
    expect(result!.certificationStatus).toBe('certified');
    expect(result!.workersUsed).toContain(w.id);
    expect(result!.metrics.phiEfficiency).toBeGreaterThan(0);
    expect(result!.metrics.heartbeatCycles).toBeGreaterThanOrEqual(0);

    // Worker should be idle after release
    expect(getWorker(w.id)!.status).toBe('idle');
  });

  it('should throw when advancing a completed order', () => {
    const order = createProductionOrder('Done', {}, 1, 'u');
    const w = createWorker('production-worker', 'W', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);
    advanceProductionStage(order.id);
    advanceProductionStage(order.id);
    advanceProductionStage(order.id);
    advanceProductionStage(order.id);
    expect(() => advanceProductionStage(order.id)).toThrow('Cannot advance');
  });

  it('should fail a production order', () => {
    const order = createProductionOrder('Doomed', {}, 2, 'u');
    const w = createWorker('production-worker', 'Doomy', 'Engineering');
    assignWorkersToOrder(order.id, [w.id]);
    failProductionOrder(order.id, 'specs unclear');

    expect(getProductionOrder(order.id)!.stage).toBe('failed');
    const result = getProductionResult(order.id);
    expect(result!.certificationStatus).toBe('rejected');
    expect(result!.metrics.phiEfficiency).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════
// PROTOCOL REGISTRY
// ═══════════════════════════════════════════════════════════════════

describe('Protocol Registry', () => {
  it('should have 20 pre-seeded protocols', () => {
    const all = listProtocols();
    expect(all.length).toBe(20);
  });

  it('should find sovereign-heartbeat protocol by name', () => {
    const p = getProtocolByName('sovereign-heartbeat');
    expect(p).toBeDefined();
    expect(p!.category).toBe('communication');
    expect(p!.status).toBe('active');
  });

  it('should find memory-write protocol by name', () => {
    const p = getProtocolByName('memory-write');
    expect(p).toBeDefined();
    expect(p!.category).toBe('data');
  });

  it('should find gate-enforcement protocol by name', () => {
    const p = getProtocolByName('gate-enforcement');
    expect(p).toBeDefined();
    expect(p!.category).toBe('governance');
  });

  it('should register a new protocol', () => {
    const p = registerProtocol(
      'test-proto',
      '0.1.0',
      'communication',
      [{ path: '/test', method: 'GET', description: 'Test' }],
      ['test:read'],
      'draft',
    );
    expect(p.name).toBe('test-proto');
    expect(p.status).toBe('draft');
    expect(listProtocols().length).toBe(21);
  });

  it('should get a protocol by id', () => {
    const p = registerProtocol('by-id', '1.0.0', 'data', [], [], 'draft');
    const found = getProtocol(p.id);
    expect(found!.name).toBe('by-id');
  });

  it('should filter protocols by category', () => {
    const comms = listProtocols({ category: 'communication' });
    expect(comms.length).toBeGreaterThanOrEqual(3);
    expect(comms.every((p) => p.category === 'communication')).toBe(true);
  });

  it('should filter protocols by status', () => {
    const drafts = listProtocols({ status: 'draft' });
    expect(drafts.length).toBeGreaterThanOrEqual(2);
    expect(drafts.every((p) => p.status === 'draft')).toBe(true);
  });

  it('should activate a protocol', () => {
    const p = registerProtocol('to-activate', '1.0.0', 'security', [], [], 'draft');
    activateProtocol(p.id);
    expect(getProtocol(p.id)!.status).toBe('active');
  });

  it('should deprecate a protocol', () => {
    const p = getProtocolByName('sovereign-heartbeat')!;
    deprecateProtocol(p.id);
    expect(getProtocol(p.id)!.status).toBe('deprecated');
  });

  it('should throw when activating nonexistent protocol', () => {
    expect(() => activateProtocol('fake-id')).toThrow('not found');
  });
});

// ═══════════════════════════════════════════════════════════════════
// INSTALLER REGISTRY
// ═══════════════════════════════════════════════════════════════════

describe('Installer Registry', () => {
  it('should have 15 pre-seeded installers', () => {
    const all = listInstallers();
    expect(all.length).toBe(15);
  });

  it('should find nova-ovo-core installer by name', () => {
    const i = getInstallerByName('nova-ovo-core');
    expect(i).toBeDefined();
    expect(i!.target).toBe('local');
    expect(i!.status).toBe('ready');
  });

  it('should find memory-temple installer by name', () => {
    const i = getInstallerByName('memory-temple');
    expect(i).toBeDefined();
    expect(i!.dependencies).toContain('nova-ovo-core');
  });

  it('should register a new installer', () => {
    const i = registerInstaller(
      'test-installer',
      '0.1.0',
      'local',
      [],
      'echo install',
      { debug: true },
      1024,
    );
    expect(i.name).toBe('test-installer');
    expect(i.checksum).toBeDefined();
    expect(listInstallers().length).toBe(16);
  });

  it('should get an installer by id', () => {
    const i = registerInstaller('by-id-inst', '1.0.0', 'cloud', [], 'echo go', {}, 2048);
    const found = getInstaller(i.id);
    expect(found!.name).toBe('by-id-inst');
  });

  it('should filter installers by target', () => {
    const edge = listInstallers({ target: 'edge' });
    expect(edge.length).toBeGreaterThanOrEqual(2);
    expect(edge.every((i) => i.target === 'edge')).toBe(true);
  });

  it('should filter installers by status', () => {
    const ready = listInstallers({ status: 'ready' });
    expect(ready.length).toBeGreaterThanOrEqual(15);
  });

  it('should simulate an install successfully', () => {
    const installer = getInstallerByName('nova-ovo-core')!;
    const log = simulateInstall(installer.id);
    expect(log.success).toBe(true);
    expect(log.steps.length).toBe(6);
    expect(log.steps.every((s) => s.status === 'ok')).toBe(true);
    expect(getInstaller(installer.id)!.status).toBe('installed');
  });

  it('should record install logs', () => {
    const installer = getInstallerByName('organism-sdk')!;
    simulateInstall(installer.id);
    const logs = getInstallLog(installer.id);
    expect(logs.length).toBe(1);
    expect(logs[0].installerId).toBe(installer.id);
  });

  it('should return empty logs for uninstalled package', () => {
    expect(getInstallLog('no-such-id')).toEqual([]);
  });

  it('should throw when simulating install for nonexistent installer', () => {
    expect(() => simulateInstall('fake-id')).toThrow('not found');
  });
});

// ═══════════════════════════════════════════════════════════════════
// DEPARTMENT & HOUSE SYSTEM
// ═══════════════════════════════════════════════════════════════════

describe('Department & House System', () => {
  it('should have 6 pre-seeded departments', () => {
    expect(listDepartments().length).toBe(6);
  });

  it('should retrieve Engineering department', () => {
    const dept = getDepartment('Engineering');
    expect(dept).toBeDefined();
    expect(dept!.budget).toBe(1000000);
    expect(dept!.activeProjects.length).toBeGreaterThanOrEqual(2);
  });

  it('should set a department manager', () => {
    const w = createWorker('gubernator-worker', 'Manager', 'Engineering');
    setDepartmentManager('Engineering', w.id);
    expect(getDepartment('Engineering')!.managerId).toBe(w.id);
  });

  it('should throw when setting manager with nonexistent worker', () => {
    expect(() => setDepartmentManager('Engineering', 'fake-id')).toThrow('not found');
  });

  it('should add a project to a department', () => {
    addProjectToDepartment('Engineering', 'new-project');
    const dept = getDepartment('Engineering')!;
    expect(dept.activeProjects).toContain('new-project');
  });

  it('should have 5 pre-seeded houses', () => {
    expect(listHouses().length).toBe(5);
  });

  it('should retrieve House Medina', () => {
    const house = getHouse('House Medina');
    expect(house).toBeDefined();
    expect(house!.civilization).toBe('Sovereign Core');
    expect(house!.motto).toBe('Memory is sovereignty');
  });

  it('should create a new house', () => {
    initHouse('House Test', 'Test Civ', 'Testing is knowing');
    const house = getHouse('House Test');
    expect(house).toBeDefined();
    expect(house!.members).toHaveLength(0);
  });

  it('should throw when adding project to nonexistent department', () => {
    expect(() => addProjectToDepartment('Nonexistent' as DepartmentName, 'x')).toThrow('not found');
  });
});

// ═══════════════════════════════════════════════════════════════════
// STATS & REPORTING
// ═══════════════════════════════════════════════════════════════════

describe('Stats & Reporting', () => {
  it('should return enterprise stats', () => {
    createWorker('production-worker', 'S1', 'Engineering');
    createWorker('company-worker', 'S2', 'Operations');
    const stats = getEnterpriseStats();
    expect(stats.totalWorkers).toBeGreaterThanOrEqual(2);
    expect(stats.protocolCount).toBe(20);
    expect(stats.installerCount).toBe(15);
    expect(stats.departmentCount).toBe(6);
    expect(stats.houseCount).toBe(5);
  });

  it('should count workers by type', () => {
    createWorker('production-worker', 'T1', 'Engineering');
    createWorker('production-worker', 'T2', 'Engineering');
    createWorker('asi-fleet-worker', 'T3', 'Intelligence');
    const stats = getEnterpriseStats();
    expect(stats.workersByType['production-worker']).toBeGreaterThanOrEqual(2);
    expect(stats.workersByType['asi-fleet-worker']).toBeGreaterThanOrEqual(1);
  });

  it('should count workers by status', () => {
    const w = createWorker('production-worker', 'Active', 'Engineering');
    assignTask(w.id, 'be active');
    const stats = getEnterpriseStats();
    expect(stats.workersByStatus.active).toBeGreaterThanOrEqual(1);
  });

  it('should count active production orders', () => {
    createProductionOrder('Active Order', {}, 1, 'u');
    const stats = getEnterpriseStats();
    expect(stats.activeProductionOrders).toBeGreaterThanOrEqual(1);
    expect(stats.totalProductionOrders).toBeGreaterThanOrEqual(1);
  });

  it('should generate a worker report', () => {
    const w = createWorker('production-worker', 'Reporter', 'Engineering');
    assignTask(w.id, 'task-1');
    completeTask(w.id, 'success');
    assignTask(w.id, 'task-2');
    completeTask(w.id, 'success');

    const report = getWorkerReport(w.id);
    expect(report.worker.id).toBe(w.id);
    expect(report.careerLength).toBe(2);
    expect(report.performanceTimeline.length).toBe(2);
  });

  it('should throw when getting report for nonexistent worker', () => {
    expect(() => getWorkerReport('fake-id')).toThrow('not found');
  });

  it('should generate a department report', () => {
    const w = createWorker('production-worker', 'Dept Reporter', 'Engineering');
    assignTask(w.id, 'reporting');

    const report = getDepartmentReport('Engineering');
    expect(report.department.name).toBe('Engineering');
    expect(report.workerCount).toBeGreaterThanOrEqual(1);
    expect(report.activeWorkers).toBeGreaterThanOrEqual(1);
    expect(report.averagePerformance).toBeGreaterThan(0);
  });

  it('should throw when getting report for nonexistent department', () => {
    expect(() => getDepartmentReport('Nonexistent' as DepartmentName)).toThrow('not found');
  });

  it('should report zero average task duration with no completed tasks', () => {
    const w = createWorker('production-worker', 'Fresh Reporter', 'Engineering');
    const report = getWorkerReport(w.id);
    expect(report.averageTaskDuration).toBe(0);
    expect(report.performanceTimeline).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════
// RESET & BOOTSTRAP
// ═══════════════════════════════════════════════════════════════════

describe('Reset & Bootstrap', () => {
  it('should reset all state', () => {
    createWorker('production-worker', 'Doomed', 'Engineering');
    resetEnterpriseState();
    expect(listWorkers().length).toBe(0);
    expect(listProtocols().length).toBe(0);
    expect(listInstallers().length).toBe(0);
    expect(listDepartments().length).toBe(0);
    expect(listHouses().length).toBe(0);
  });

  it('should re-bootstrap with seed data', () => {
    resetEnterpriseState();
    bootstrapEnterprise();
    expect(listProtocols().length).toBe(20);
    expect(listInstallers().length).toBe(15);
    expect(listDepartments().length).toBe(6);
    expect(listHouses().length).toBe(5);
  });
});
