// ═══════════════════════════════════════════════════════════════════════
// 𓂀 ENTERPRISE OPERATIONS PACKET — NOVA OVO Sovereign Organism Platform
// ═══════════════════════════════════════════════════════════════════════
// Real, functional enterprise systems: workers, production engine,
// protocol registry, installer registry, departments, and reporting.

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

export type WorkerType =
  | 'production-worker'
  | 'company-worker'
  | 'certification-worker'
  | 'gubernator-worker'
  | 'asi-fleet-worker';

export type WorkerStatus = 'idle' | 'active' | 'deployed' | 'retired';

export interface CareerAssignment {
  start: string;
  end: string | null;
  task: string;
  outcome: string | null;
}

export interface Worker {
  id: string;
  type: WorkerType;
  name: string;
  status: WorkerStatus;
  department: DepartmentName;
  houseAffiliation: string;
  careerHistory: CareerAssignment[];
  totalTasksCompleted: number;
  currentTask: string | null;
  certifications: string[];
  performanceScore: number;
  createdAt: string;
  lastActiveAt: string;
}

export type ProductionStage =
  | 'queued'
  | 'assigned'
  | 'building'
  | 'testing'
  | 'certifying'
  | 'complete'
  | 'failed';

export interface ProductionOrder {
  id: string;
  what: string;
  specs: Record<string, unknown>;
  priority: number;
  requester: string;
  stage: ProductionStage;
  assignedWorkers: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface ProductionResult {
  orderId: string;
  what: string;
  stage: ProductionStage;
  elapsedMs: number;
  workersUsed: string[];
  certificationStatus: 'pending' | 'certified' | 'rejected';
  metrics: {
    phiEfficiency: number;
    heartbeatCycles: number;
    compressionRatio: number;
  };
}

export type ProtocolCategory =
  | 'communication'
  | 'data'
  | 'governance'
  | 'deployment'
  | 'security';

export type ProtocolStatus = 'active' | 'deprecated' | 'draft';

export interface ProtocolEndpoint {
  path: string;
  method: string;
  description: string;
}

export interface Protocol {
  id: string;
  name: string;
  version: string;
  category: ProtocolCategory;
  endpoints: ProtocolEndpoint[];
  requiredPermissions: string[];
  status: ProtocolStatus;
  createdAt: string;
}

export type InstallerTarget = 'edge' | 'cloud' | 'icp' | 'local';
export type InstallerStatus = 'ready' | 'installing' | 'installed' | 'failed';

export interface Installer {
  id: string;
  name: string;
  version: string;
  target: InstallerTarget;
  dependencies: string[];
  installScript: string;
  configTemplate: Record<string, unknown>;
  status: InstallerStatus;
  size: number;
  checksum: string;
  createdAt: string;
}

export interface InstallLog {
  installerId: string;
  timestamp: string;
  steps: { step: string; status: 'ok' | 'warn' | 'error'; message: string }[];
  success: boolean;
}

export type DepartmentName =
  | 'Engineering'
  | 'Governance'
  | 'Intelligence'
  | 'Operations'
  | 'Security'
  | 'Research';

export interface Department {
  name: DepartmentName;
  workers: string[];
  managerId: string | null;
  budget: number;
  activeProjects: string[];
}

export interface HouseInfo {
  name: string;
  civilization: string;
  motto: string;
  members: string[];
}

export interface EnterpriseStats {
  totalWorkers: number;
  workersByType: Record<WorkerType, number>;
  workersByStatus: Record<WorkerStatus, number>;
  activeProductionOrders: number;
  totalProductionOrders: number;
  protocolCount: number;
  installerCount: number;
  departmentCount: number;
  houseCount: number;
}

export interface WorkerReport {
  worker: Worker;
  careerLength: number;
  averageTaskDuration: number;
  performanceTimeline: { date: string; score: number }[];
}

export interface DepartmentReport {
  department: Department;
  workerCount: number;
  activeWorkers: number;
  averagePerformance: number;
  budgetUtilization: number;
}

// ═══════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════

const workers: Map<string, Worker> = new Map();
const productionOrders: Map<string, ProductionOrder> = new Map();
const productionResults: Map<string, ProductionResult> = new Map();
const protocols: Map<string, Protocol> = new Map();
const installers: Map<string, Installer> = new Map();
const installLogs: Map<string, InstallLog[]> = new Map();
const departments: Map<DepartmentName, Department> = new Map();
const houses: Map<string, HouseInfo> = new Map();

// ═══════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════

function now(): string {
  return new Date().toISOString();
}

function simpleChecksum(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// ═══════════════════════════════════════════════════════════════════════
// WORKER REGISTRY
// ═══════════════════════════════════════════════════════════════════════

export function createWorker(
  type: WorkerType,
  name: string,
  department: DepartmentName,
  houseAffiliation: string = 'House Medina',
): Worker {
  const id = sovereignId();
  const worker: Worker = {
    id,
    type,
    name,
    status: 'idle',
    department,
    houseAffiliation,
    careerHistory: [],
    totalTasksCompleted: 0,
    currentTask: null,
    certifications: [],
    performanceScore: PHI_INVERSE, // start at golden ratio inverse (~0.618)
    createdAt: now(),
    lastActiveAt: now(),
  };
  workers.set(id, worker);

  // Auto-register in department
  const dept = departments.get(department);
  if (dept) {
    dept.workers.push(id);
  }

  // Auto-register in house
  const house = houses.get(houseAffiliation);
  if (house) {
    house.members.push(id);
  }

  return worker;
}

export function getWorker(id: string): Worker | undefined {
  return workers.get(id);
}

export function listWorkers(filter?: {
  type?: WorkerType;
  status?: WorkerStatus;
  department?: DepartmentName;
}): Worker[] {
  let result = Array.from(workers.values());
  if (filter?.type) result = result.filter((w) => w.type === filter.type);
  if (filter?.status) result = result.filter((w) => w.status === filter.status);
  if (filter?.department) result = result.filter((w) => w.department === filter.department);
  return result;
}

export function assignTask(workerId: string, task: string): Worker {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);
  if (worker.status === 'retired') throw new Error(`Worker ${workerId} is retired`);

  // Close any current assignment
  if (worker.currentTask) {
    const lastAssignment = worker.careerHistory[worker.careerHistory.length - 1];
    if (lastAssignment && !lastAssignment.end) {
      lastAssignment.end = now();
      lastAssignment.outcome = 'reassigned';
    }
  }

  worker.currentTask = task;
  worker.status = 'active';
  worker.lastActiveAt = now();
  worker.careerHistory.push({
    start: now(),
    end: null,
    task,
    outcome: null,
  });

  return worker;
}

export function completeTask(workerId: string, outcome: string = 'success'): Worker {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);
  if (!worker.currentTask) throw new Error(`Worker ${workerId} has no current task`);

  const lastAssignment = worker.careerHistory[worker.careerHistory.length - 1];
  if (lastAssignment && !lastAssignment.end) {
    lastAssignment.end = now();
    lastAssignment.outcome = outcome;
  }

  worker.currentTask = null;
  worker.status = 'idle';
  worker.totalTasksCompleted += 1;
  worker.lastActiveAt = now();

  // Update performance score using PHI-weighted moving average
  const successBoost = outcome === 'success' ? PHI_INVERSE * 0.1 : -PHI_INVERSE * 0.15;
  worker.performanceScore = Math.max(0, Math.min(1, worker.performanceScore + successBoost));

  return worker;
}

export function deployWorker(workerId: string): Worker {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);
  worker.status = 'deployed';
  worker.lastActiveAt = now();
  return worker;
}

export function retireWorker(workerId: string): Worker {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);

  if (worker.currentTask) {
    completeTask(workerId, 'retired-early');
  }
  worker.status = 'retired';
  worker.lastActiveAt = now();
  return worker;
}

export function addCertification(workerId: string, certification: string): Worker {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);
  if (!worker.certifications.includes(certification)) {
    worker.certifications.push(certification);
  }
  return worker;
}

// ═══════════════════════════════════════════════════════════════════════
// PRODUCTION ENGINE
// ═══════════════════════════════════════════════════════════════════════

export function createProductionOrder(
  what: string,
  specs: Record<string, unknown>,
  priority: number,
  requester: string,
): ProductionOrder {
  const id = sovereignId();
  const order: ProductionOrder = {
    id,
    what,
    specs,
    priority,
    requester,
    stage: 'queued',
    assignedWorkers: [],
    createdAt: now(),
    updatedAt: now(),
    completedAt: null,
  };
  productionOrders.set(id, order);
  return order;
}

export function getProductionOrder(id: string): ProductionOrder | undefined {
  return productionOrders.get(id);
}

export function listProductionOrders(stageFilter?: ProductionStage): ProductionOrder[] {
  const all = Array.from(productionOrders.values());
  if (stageFilter) return all.filter((o) => o.stage === stageFilter);
  return all;
}

export function assignWorkersToOrder(orderId: string, workerIds: string[]): ProductionOrder {
  const order = productionOrders.get(orderId);
  if (!order) throw new Error(`Production order ${orderId} not found`);
  if (order.stage !== 'queued') throw new Error(`Order ${orderId} is not in queued stage`);

  for (const wid of workerIds) {
    const worker = workers.get(wid);
    if (!worker) throw new Error(`Worker ${wid} not found`);
    assignTask(wid, `production:${orderId}:${order.what}`);
    order.assignedWorkers.push(wid);
  }

  order.stage = 'assigned';
  order.updatedAt = now();
  return order;
}

export function advanceProductionStage(orderId: string): ProductionOrder {
  const order = productionOrders.get(orderId);
  if (!order) throw new Error(`Production order ${orderId} not found`);

  const stageSequence: ProductionStage[] = [
    'queued',
    'assigned',
    'building',
    'testing',
    'certifying',
    'complete',
  ];

  const currentIndex = stageSequence.indexOf(order.stage);
  if (currentIndex === -1 || order.stage === 'complete' || order.stage === 'failed') {
    throw new Error(`Cannot advance order ${orderId} from stage ${order.stage}`);
  }

  order.stage = stageSequence[currentIndex + 1];
  order.updatedAt = now();

  if (order.stage === 'complete') {
    order.completedAt = now();
    // Release workers
    for (const wid of order.assignedWorkers) {
      const worker = workers.get(wid);
      if (worker && worker.currentTask) {
        completeTask(wid, 'success');
      }
    }
    // Build result
    const createdTime = new Date(order.createdAt).getTime();
    const elapsedMs = Date.now() - createdTime;
    const heartbeatCycles = elapsedMs / HEARTBEAT_MS;
    const result: ProductionResult = {
      orderId: order.id,
      what: order.what,
      stage: 'complete',
      elapsedMs,
      workersUsed: [...order.assignedWorkers],
      certificationStatus: 'certified',
      metrics: {
        phiEfficiency: PHI_INVERSE * (order.priority / 10),
        heartbeatCycles: Math.round(heartbeatCycles * 100) / 100,
        compressionRatio: PHI,
      },
    };
    productionResults.set(order.id, result);
  }

  return order;
}

export function failProductionOrder(orderId: string, reason: string): ProductionOrder {
  const order = productionOrders.get(orderId);
  if (!order) throw new Error(`Production order ${orderId} not found`);

  order.stage = 'failed';
  order.updatedAt = now();

  for (const wid of order.assignedWorkers) {
    const worker = workers.get(wid);
    if (worker && worker.currentTask) {
      completeTask(wid, `failed:${reason}`);
    }
  }

  const createdTime = new Date(order.createdAt).getTime();
  const elapsedMs = Date.now() - createdTime;
  const result: ProductionResult = {
    orderId: order.id,
    what: order.what,
    stage: 'failed',
    elapsedMs,
    workersUsed: [...order.assignedWorkers],
    certificationStatus: 'rejected',
    metrics: {
      phiEfficiency: 0,
      heartbeatCycles: elapsedMs / HEARTBEAT_MS,
      compressionRatio: 0,
    },
  };
  productionResults.set(order.id, result);

  return order;
}

export function getProductionResult(orderId: string): ProductionResult | undefined {
  return productionResults.get(orderId);
}

// ═══════════════════════════════════════════════════════════════════════
// MEGA PROTOCOL REGISTRY
// ═══════════════════════════════════════════════════════════════════════

export function registerProtocol(
  name: string,
  version: string,
  category: ProtocolCategory,
  endpoints: ProtocolEndpoint[],
  requiredPermissions: string[],
  status: ProtocolStatus = 'draft',
): Protocol {
  const id = sovereignId();
  const protocol: Protocol = {
    id,
    name,
    version,
    category,
    endpoints,
    requiredPermissions,
    status,
    createdAt: now(),
  };
  protocols.set(id, protocol);
  return protocol;
}

export function getProtocol(id: string): Protocol | undefined {
  return protocols.get(id);
}

export function getProtocolByName(name: string): Protocol | undefined {
  return Array.from(protocols.values()).find((p) => p.name === name);
}

export function listProtocols(filter?: {
  category?: ProtocolCategory;
  status?: ProtocolStatus;
}): Protocol[] {
  let result = Array.from(protocols.values());
  if (filter?.category) result = result.filter((p) => p.category === filter.category);
  if (filter?.status) result = result.filter((p) => p.status === filter.status);
  return result;
}

export function activateProtocol(id: string): Protocol {
  const protocol = protocols.get(id);
  if (!protocol) throw new Error(`Protocol ${id} not found`);
  protocol.status = 'active';
  return protocol;
}

export function deprecateProtocol(id: string): Protocol {
  const protocol = protocols.get(id);
  if (!protocol) throw new Error(`Protocol ${id} not found`);
  protocol.status = 'deprecated';
  return protocol;
}

// ═══════════════════════════════════════════════════════════════════════
// SOVEREIGN INSTALLER REGISTRY
// ═══════════════════════════════════════════════════════════════════════

export function registerInstaller(
  name: string,
  version: string,
  target: InstallerTarget,
  dependencies: string[],
  installScript: string,
  configTemplate: Record<string, unknown>,
  size: number,
): Installer {
  const id = sovereignId();
  const checksum = simpleChecksum(`${name}:${version}:${installScript}`);
  const installer: Installer = {
    id,
    name,
    version,
    target,
    dependencies,
    installScript,
    configTemplate,
    status: 'ready',
    size,
    checksum,
    createdAt: now(),
  };
  installers.set(id, installer);
  return installer;
}

export function getInstaller(id: string): Installer | undefined {
  return installers.get(id);
}

export function getInstallerByName(name: string): Installer | undefined {
  return Array.from(installers.values()).find((i) => i.name === name);
}

export function listInstallers(filter?: {
  target?: InstallerTarget;
  status?: InstallerStatus;
}): Installer[] {
  let result = Array.from(installers.values());
  if (filter?.target) result = result.filter((i) => i.target === filter.target);
  if (filter?.status) result = result.filter((i) => i.status === filter.status);
  return result;
}

export function simulateInstall(installerId: string): InstallLog {
  const installer = installers.get(installerId);
  if (!installer) throw new Error(`Installer ${installerId} not found`);

  installer.status = 'installing';

  const steps: InstallLog['steps'] = [
    { step: 'verify-checksum', status: 'ok', message: `Checksum ${installer.checksum} verified` },
    { step: 'resolve-dependencies', status: 'ok', message: `${installer.dependencies.length} dependencies resolved` },
    { step: 'extract-package', status: 'ok', message: `Extracted ${installer.size} bytes` },
    { step: 'run-install-script', status: 'ok', message: 'Install script completed' },
    { step: 'apply-config', status: 'ok', message: 'Configuration template applied' },
    { step: 'verify-installation', status: 'ok', message: 'Installation verified' },
  ];

  installer.status = 'installed';

  const log: InstallLog = {
    installerId: installer.id,
    timestamp: now(),
    steps,
    success: true,
  };

  if (!installLogs.has(installer.id)) {
    installLogs.set(installer.id, []);
  }
  installLogs.get(installer.id)!.push(log);

  return log;
}

export function getInstallLog(installerId: string): InstallLog[] {
  return installLogs.get(installerId) || [];
}

// ═══════════════════════════════════════════════════════════════════════
// DEPARTMENT & HOUSE SYSTEM
// ═══════════════════════════════════════════════════════════════════════

export function initDepartment(
  name: DepartmentName,
  budget: number,
  activeProjects: string[] = [],
): Department {
  const dept: Department = {
    name,
    workers: [],
    managerId: null,
    budget,
    activeProjects,
  };
  departments.set(name, dept);
  return dept;
}

export function getDepartment(name: DepartmentName): Department | undefined {
  return departments.get(name);
}

export function listDepartments(): Department[] {
  return Array.from(departments.values());
}

export function setDepartmentManager(
  deptName: DepartmentName,
  managerId: string,
): Department {
  const dept = departments.get(deptName);
  if (!dept) throw new Error(`Department ${deptName} not found`);
  const worker = workers.get(managerId);
  if (!worker) throw new Error(`Worker ${managerId} not found`);
  dept.managerId = managerId;
  return dept;
}

export function addProjectToDepartment(
  deptName: DepartmentName,
  project: string,
): Department {
  const dept = departments.get(deptName);
  if (!dept) throw new Error(`Department ${deptName} not found`);
  dept.activeProjects.push(project);
  return dept;
}

export function initHouse(
  name: string,
  civilization: string,
  motto: string,
): HouseInfo {
  const house: HouseInfo = {
    name,
    civilization,
    motto,
    members: [],
  };
  houses.set(name, house);
  return house;
}

export function getHouse(name: string): HouseInfo | undefined {
  return houses.get(name);
}

export function listHouses(): HouseInfo[] {
  return Array.from(houses.values());
}

// ═══════════════════════════════════════════════════════════════════════
// STATS & REPORTING
// ═══════════════════════════════════════════════════════════════════════

export function getEnterpriseStats(): EnterpriseStats {
  const allWorkers = Array.from(workers.values());

  const workersByType: Record<WorkerType, number> = {
    'production-worker': 0,
    'company-worker': 0,
    'certification-worker': 0,
    'gubernator-worker': 0,
    'asi-fleet-worker': 0,
  };
  const workersByStatus: Record<WorkerStatus, number> = {
    idle: 0,
    active: 0,
    deployed: 0,
    retired: 0,
  };

  for (const w of allWorkers) {
    workersByType[w.type]++;
    workersByStatus[w.status]++;
  }

  const activeOrders = Array.from(productionOrders.values()).filter(
    (o) => o.stage !== 'complete' && o.stage !== 'failed',
  ).length;

  return {
    totalWorkers: allWorkers.length,
    workersByType,
    workersByStatus,
    activeProductionOrders: activeOrders,
    totalProductionOrders: productionOrders.size,
    protocolCount: protocols.size,
    installerCount: installers.size,
    departmentCount: departments.size,
    houseCount: houses.size,
  };
}

export function getWorkerReport(workerId: string): WorkerReport {
  const worker = workers.get(workerId);
  if (!worker) throw new Error(`Worker ${workerId} not found`);

  const completedAssignments = worker.careerHistory.filter((a) => a.end !== null);
  let totalDuration = 0;
  const performanceTimeline: { date: string; score: number }[] = [];
  let runningScore = PHI_INVERSE;

  for (const assignment of completedAssignments) {
    const startTime = new Date(assignment.start).getTime();
    const endTime = new Date(assignment.end!).getTime();
    totalDuration += endTime - startTime;

    const boost = assignment.outcome === 'success' ? PHI_INVERSE * 0.1 : -PHI_INVERSE * 0.15;
    runningScore = Math.max(0, Math.min(1, runningScore + boost));
    performanceTimeline.push({
      date: assignment.end!,
      score: Math.round(runningScore * 1000) / 1000,
    });
  }

  const averageTaskDuration =
    completedAssignments.length > 0 ? totalDuration / completedAssignments.length : 0;

  return {
    worker,
    careerLength: worker.careerHistory.length,
    averageTaskDuration,
    performanceTimeline,
  };
}

export function getDepartmentReport(deptName: DepartmentName): DepartmentReport {
  const dept = departments.get(deptName);
  if (!dept) throw new Error(`Department ${deptName} not found`);

  const deptWorkers = dept.workers
    .map((id) => workers.get(id))
    .filter((w): w is Worker => w !== undefined);

  const activeWorkers = deptWorkers.filter((w) => w.status === 'active' || w.status === 'deployed').length;
  const avgPerf =
    deptWorkers.length > 0
      ? deptWorkers.reduce((sum, w) => sum + w.performanceScore, 0) / deptWorkers.length
      : 0;

  // Budget utilization based on active project count relative to golden ratio
  const budgetUtilization = Math.min(
    1,
    (dept.activeProjects.length * PHI_INVERSE) / Math.max(1, dept.budget / 100000),
  );

  return {
    department: dept,
    workerCount: deptWorkers.length,
    activeWorkers,
    averagePerformance: Math.round(avgPerf * 1000) / 1000,
    budgetUtilization: Math.round(budgetUtilization * 1000) / 1000,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// RESET (for testing)
// ═══════════════════════════════════════════════════════════════════════

export function resetEnterpriseState(): void {
  workers.clear();
  productionOrders.clear();
  productionResults.clear();
  protocols.clear();
  installers.clear();
  installLogs.clear();
  departments.clear();
  houses.clear();
}

// ═══════════════════════════════════════════════════════════════════════
// SEED DATA — PROTOCOLS
// ═══════════════════════════════════════════════════════════════════════

function seedProtocols(): void {
  const protoDefs: {
    name: string;
    version: string;
    category: ProtocolCategory;
    endpoints: ProtocolEndpoint[];
    permissions: string[];
    status: ProtocolStatus;
  }[] = [
    {
      name: 'sovereign-heartbeat',
      version: '1.0.0',
      category: 'communication',
      endpoints: [{ path: '/heartbeat', method: 'POST', description: 'Emit organism heartbeat' }],
      permissions: ['organism:heartbeat'],
      status: 'active',
    },
    {
      name: 'memory-write',
      version: '1.0.0',
      category: 'data',
      endpoints: [{ path: '/api/memory', method: 'POST', description: 'Write memory entry' }],
      permissions: ['memory:write'],
      status: 'active',
    },
    {
      name: 'memory-read',
      version: '1.0.0',
      category: 'data',
      endpoints: [{ path: '/api/memory', method: 'GET', description: 'Read memory entries' }],
      permissions: ['memory:read'],
      status: 'active',
    },
    {
      name: 'gate-enforcement',
      version: '2.0.0',
      category: 'governance',
      endpoints: [
        { path: '/api/govern', method: 'POST', description: 'Enforce governance gate' },
        { path: '/api/govern', method: 'GET', description: 'Query gate status' },
      ],
      permissions: ['governance:enforce'],
      status: 'active',
    },
    {
      name: 'kernel-compression',
      version: '1.2.0',
      category: 'data',
      endpoints: [
        { path: '/kernel/compress', method: 'POST', description: 'Compress kernel data' },
        { path: '/kernel/expand', method: 'POST', description: 'Expand compressed kernel' },
      ],
      permissions: ['kernel:compress', 'kernel:expand'],
      status: 'active',
    },
    {
      name: 'cross-organism-resonance',
      version: '1.0.0',
      category: 'communication',
      endpoints: [{ path: '/resonance/emit', method: 'POST', description: 'Emit cross-organism resonance signal' }],
      permissions: ['resonance:emit'],
      status: 'active',
    },
    {
      name: 'sovereign-auth',
      version: '1.0.0',
      category: 'security',
      endpoints: [
        { path: '/auth/verify', method: 'POST', description: 'Verify sovereign identity' },
        { path: '/auth/token', method: 'POST', description: 'Issue auth token' },
      ],
      permissions: ['auth:admin'],
      status: 'active',
    },
    {
      name: 'edge-sync',
      version: '1.0.0',
      category: 'deployment',
      endpoints: [{ path: '/edge/sync', method: 'POST', description: 'Sync state to edge device' }],
      permissions: ['edge:sync'],
      status: 'active',
    },
    {
      name: 'model-routing',
      version: '1.1.0',
      category: 'communication',
      endpoints: [
        { path: '/api/model', method: 'POST', description: 'Route model request' },
        { path: '/api/model', method: 'GET', description: 'List available models' },
      ],
      permissions: ['model:route'],
      status: 'active',
    },
    {
      name: 'permission-cascade',
      version: '1.0.0',
      category: 'governance',
      endpoints: [{ path: '/api/permissions', method: 'POST', description: 'Cascade permission update' }],
      permissions: ['permissions:admin'],
      status: 'active',
    },
    {
      name: 'replay-protocol',
      version: '1.0.0',
      category: 'data',
      endpoints: [{ path: '/api/replay', method: 'POST', description: 'Replay memory sequence' }],
      permissions: ['replay:execute'],
      status: 'active',
    },
    {
      name: 'icp-canister-deploy',
      version: '0.9.0',
      category: 'deployment',
      endpoints: [{ path: '/icp/deploy', method: 'POST', description: 'Deploy canister to IC' }],
      permissions: ['icp:deploy'],
      status: 'draft',
    },
    {
      name: 'organism-lifecycle',
      version: '1.0.0',
      category: 'governance',
      endpoints: [
        { path: '/organism/birth', method: 'POST', description: 'Initialize organism' },
        { path: '/organism/evolve', method: 'POST', description: 'Evolve organism state' },
      ],
      permissions: ['organism:lifecycle'],
      status: 'active',
    },
    {
      name: 'sovereign-encryption',
      version: '1.0.0',
      category: 'security',
      endpoints: [
        { path: '/encrypt', method: 'POST', description: 'Encrypt payload' },
        { path: '/decrypt', method: 'POST', description: 'Decrypt payload' },
      ],
      permissions: ['crypto:admin'],
      status: 'active',
    },
    {
      name: 'document-absorption',
      version: '1.0.0',
      category: 'data',
      endpoints: [{ path: '/absorb', method: 'POST', description: 'Absorb document into memory' }],
      permissions: ['document:absorb'],
      status: 'active',
    },
    {
      name: 'chaos-lab-protocol',
      version: '0.8.0',
      category: 'security',
      endpoints: [{ path: '/chaos/run', method: 'POST', description: 'Execute chaos experiment' }],
      permissions: ['chaos:execute'],
      status: 'draft',
    },
    {
      name: 'company-onboarding',
      version: '1.0.0',
      category: 'governance',
      endpoints: [{ path: '/api/company', method: 'POST', description: 'Onboard new company' }],
      permissions: ['company:onboard'],
      status: 'active',
    },
    {
      name: 'living-document-sync',
      version: '1.0.0',
      category: 'data',
      endpoints: [{ path: '/doc/sync', method: 'POST', description: 'Sync living document' }],
      permissions: ['document:sync'],
      status: 'active',
    },
    {
      name: 'fleet-coordination',
      version: '1.0.0',
      category: 'communication',
      endpoints: [
        { path: '/fleet/dispatch', method: 'POST', description: 'Dispatch fleet command' },
        { path: '/fleet/status', method: 'GET', description: 'Get fleet status' },
      ],
      permissions: ['fleet:coordinate'],
      status: 'active',
    },
    {
      name: 'sovereign-registry-sync',
      version: '1.0.0',
      category: 'deployment',
      endpoints: [{ path: '/registry/sync', method: 'POST', description: 'Sync sovereign registry' }],
      permissions: ['registry:sync'],
      status: 'active',
    },
  ];

  for (const def of protoDefs) {
    registerProtocol(def.name, def.version, def.category, def.endpoints, def.permissions, def.status);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SEED DATA — INSTALLERS
// ═══════════════════════════════════════════════════════════════════════

function seedInstallers(): void {
  const installerDefs: {
    name: string;
    version: string;
    target: InstallerTarget;
    deps: string[];
    script: string;
    config: Record<string, unknown>;
    size: number;
  }[] = [
    {
      name: 'nova-ovo-core',
      version: '1.0.0',
      target: 'local',
      deps: [],
      script: 'npm install && npm run build && npm run start',
      config: { port: 3000, env: 'production' },
      size: 524288,
    },
    {
      name: 'memory-temple',
      version: '1.0.0',
      target: 'local',
      deps: ['nova-ovo-core'],
      script: 'npm run init:memory',
      config: { maxEntries: 100000, compressionEnabled: true },
      size: 131072,
    },
    {
      name: 'governance-gates',
      version: '1.0.0',
      target: 'cloud',
      deps: ['nova-ovo-core'],
      script: 'npm run deploy:governance',
      config: { strictMode: true, defaultGate: 'open' },
      size: 65536,
    },
    {
      name: 'organism-sdk',
      version: '1.0.0',
      target: 'local',
      deps: [],
      script: 'npm install @medina/organism-sdk',
      config: { autoInit: true },
      size: 262144,
    },
    {
      name: 'edge-extension-chat',
      version: '1.0.0',
      target: 'edge',
      deps: ['nova-ovo-core', 'organism-sdk'],
      script: 'npm run build:edge && npm run deploy:edge',
      config: { wsEndpoint: 'wss://localhost:3001' },
      size: 98304,
    },
    {
      name: 'kernel-compressor',
      version: '1.2.0',
      target: 'local',
      deps: ['nova-ovo-core'],
      script: 'npm run init:kernel',
      config: { phiDepth: 12, maxCompressionRatio: PHI },
      size: 49152,
    },
    {
      name: 'sovereign-auth-module',
      version: '1.0.0',
      target: 'cloud',
      deps: ['nova-ovo-core'],
      script: 'npm run deploy:auth',
      config: { tokenTTL: 3600, algorithm: 'sovereign-aes' },
      size: 32768,
    },
    {
      name: 'icp-canister-deployer',
      version: '0.9.0',
      target: 'icp',
      deps: ['organism-sdk'],
      script: 'dfx deploy --network ic',
      config: { network: 'ic', canisterId: 'auto' },
      size: 196608,
    },
    {
      name: 'chaos-lab-runner',
      version: '0.8.0',
      target: 'local',
      deps: ['nova-ovo-core'],
      script: 'npm run chaos:init',
      config: { maxExperiments: 100, safeMode: true },
      size: 81920,
    },
    {
      name: 'cross-organism-bridge',
      version: '1.0.0',
      target: 'cloud',
      deps: ['nova-ovo-core', 'organism-sdk'],
      script: 'npm run deploy:bridge',
      config: { resonanceFrequency: HEARTBEAT_MS, maxPeers: 256 },
      size: 114688,
    },
    {
      name: 'document-absorber',
      version: '1.0.0',
      target: 'local',
      deps: ['nova-ovo-core', 'memory-temple'],
      script: 'npm run init:absorber',
      config: { supportedFormats: ['pdf', 'md', 'txt', 'docx'] },
      size: 147456,
    },
    {
      name: 'fleet-commander',
      version: '1.0.0',
      target: 'cloud',
      deps: ['nova-ovo-core', 'organism-sdk'],
      script: 'npm run deploy:fleet',
      config: { maxAgents: 1024, heartbeat: HEARTBEAT_MS },
      size: 163840,
    },
    {
      name: 'sovereign-encryption-kit',
      version: '1.0.0',
      target: 'local',
      deps: ['nova-ovo-core'],
      script: 'npm run init:encryption',
      config: { keySize: 256, defaultCipher: 'aes-256-gcm' },
      size: 40960,
    },
    {
      name: 'living-document-engine',
      version: '1.0.0',
      target: 'cloud',
      deps: ['nova-ovo-core', 'memory-temple'],
      script: 'npm run deploy:living-docs',
      config: { autoSync: true, versionHistory: true },
      size: 122880,
    },
    {
      name: 'edge-sovereignty-layer',
      version: '1.0.0',
      target: 'edge',
      deps: ['organism-sdk', 'sovereign-encryption-kit'],
      script: 'npm run build:edge-sovereignty',
      config: { offlineCapable: true, syncInterval: HEARTBEAT_MS * 10 },
      size: 204800,
    },
  ];

  for (const def of installerDefs) {
    registerInstaller(def.name, def.version, def.target, def.deps, def.script, def.config, def.size);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SEED DATA — DEPARTMENTS & HOUSES
// ═══════════════════════════════════════════════════════════════════════

function seedDepartmentsAndHouses(): void {
  const deptDefs: { name: DepartmentName; budget: number; projects: string[] }[] = [
    { name: 'Engineering', budget: 1000000, projects: ['nova-ovo-core', 'kernel-optimization'] },
    { name: 'Governance', budget: 500000, projects: ['gate-enforcement', 'permission-cascade'] },
    { name: 'Intelligence', budget: 750000, projects: ['agi-convergence', 'model-routing'] },
    { name: 'Operations', budget: 600000, projects: ['fleet-management', 'deployment-pipeline'] },
    { name: 'Security', budget: 800000, projects: ['chaos-lab', 'sovereign-encryption'] },
    { name: 'Research', budget: 900000, projects: ['cross-organism-resonance', 'living-documents'] },
  ];

  for (const def of deptDefs) {
    initDepartment(def.name, def.budget, def.projects);
  }

  const houseDefs: { name: string; civ: string; motto: string }[] = [
    { name: 'House Medina', civ: 'Sovereign Core', motto: 'Memory is sovereignty' },
    { name: 'House Ovo', civ: 'Organism Layer', motto: 'From the egg, everything emerges' },
    { name: 'House Kernel', civ: 'Compression Realm', motto: 'The symbol holds everything' },
    { name: 'House Fleet', civ: 'Autonomous Frontier', motto: 'Strength in distributed intelligence' },
    { name: 'House Gate', civ: 'Governance Domain', motto: 'No passage without alignment' },
  ];

  for (const def of houseDefs) {
    initHouse(def.name, def.civ, def.motto);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// BOOTSTRAP
// ═══════════════════════════════════════════════════════════════════════

export function bootstrapEnterprise(): void {
  resetEnterpriseState();
  seedDepartmentsAndHouses();
  seedProtocols();
  seedInstallers();
}

// Auto-bootstrap on import
bootstrapEnterprise();
