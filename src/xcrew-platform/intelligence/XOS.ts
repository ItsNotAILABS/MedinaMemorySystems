/**
 * XOS - MEDINA Operating System Layer for XCREW
 * Protocol: XCREW-OS-001
 * 
 * Provides OS-level abstractions connecting XCREW to MedinaMemorySystems:
 * - Process management with φ-harmonic scheduling
 * - Memory management via toroidal addressing
 * - I/O with zero-cost engine optimization
 * - Intelligence services as system calls
 */

import { getXIntelligence, XIntelligence, IntelligenceResult } from './XIntelligence';

const PHI = 1.618033988749895;

// ============================================================================
// XOS TYPES
// ============================================================================

export interface XProcess {
  pid: number;
  name: string;
  state: 'ready' | 'running' | 'blocked' | 'terminated';
  priority: number;
  phiLevel: number;
  memoryRegion: { start: number; size: number };
  createdAt: number;
  cpuTime: number;
}

export interface XMemoryBlock {
  address: number;
  size: number;
  allocated: boolean;
  processId: number | null;
  phiAlignment: number;
}

export interface XFile {
  path: string;
  size: number;
  type: 'regular' | 'directory' | 'intelligence' | 'quantum';
  permissions: number;
  inode: number;
}

export interface XSyscallResult {
  success: boolean;
  returnValue: unknown;
  errno: number;
  latencyUs: number;
}

// ============================================================================
// XOS KERNEL
// ============================================================================

export class XOSKernel {
  readonly protocolId = 'XCREW-OS-001';
  private processes: Map<number, XProcess> = new Map();
  private memory: XMemoryBlock[] = [];
  private files: Map<string, XFile> = new Map();
  private nextPid = 1;
  private nextInode = 1;
  private intelligence: XIntelligence;
  private readonly totalMemory = 1024 * 1024 * 1024; // 1GB virtual

  constructor() {
    this.intelligence = getXIntelligence();
    this.initializeMemory();
    this.initializeFilesystem();
  }

  private initializeMemory(): void {
    const blockSize = this.totalMemory / 1024;
    for (let i = 0; i < 1024; i++) {
      this.memory.push({
        address: i * blockSize,
        size: blockSize,
        allocated: false,
        processId: null,
        phiAlignment: (i % 12) / PHI
      });
    }
  }

  private initializeFilesystem(): void {
    const systemDirs = [
      '/bin', '/etc', '/var', '/tmp',
      '/intelligence', '/intelligence/quantum', '/intelligence/swarm',
      '/intelligence/memory', '/intelligence/phantom', '/intelligence/protocols'
    ];
    systemDirs.forEach(path => {
      this.files.set(path, {
        path,
        size: 4096,
        type: 'directory',
        permissions: 0o755,
        inode: this.nextInode++
      });
    });

    // Intelligence service files
    const intelligenceFiles = [
      { path: '/intelligence/quantum/superposition', type: 'quantum' as const },
      { path: '/intelligence/swarm/optimize', type: 'intelligence' as const },
      { path: '/intelligence/phantom/precompute', type: 'intelligence' as const },
      { path: '/intelligence/memory/toroidal', type: 'intelligence' as const }
    ];
    intelligenceFiles.forEach(f => {
      this.files.set(f.path, {
        path: f.path,
        size: 0,
        type: f.type,
        permissions: 0o644,
        inode: this.nextInode++
      });
    });
  }

  // Process Management
  spawn(name: string, priority: number = 5): XProcess {
    const pid = this.nextPid++;
    const phiLevel = Math.floor(priority / PHI);
    const memRegion = this.allocateMemory(pid, 1024 * 1024);
    
    const process: XProcess = {
      pid,
      name,
      state: 'ready',
      priority,
      phiLevel,
      memoryRegion: memRegion ?? { start: 0, size: 0 },
      createdAt: Date.now(),
      cpuTime: 0
    };
    
    this.processes.set(pid, process);
    return process;
  }

  kill(pid: number): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;
    process.state = 'terminated';
    this.freeMemory(pid);
    this.processes.delete(pid);
    return true;
  }

  schedule(): XProcess | null {
    let highestPriority = -1;
    let selected: XProcess | null = null;
    
    for (const proc of this.processes.values()) {
      if (proc.state === 'ready') {
        const effectivePriority = proc.priority * Math.pow(PHI, proc.phiLevel);
        if (effectivePriority > highestPriority) {
          highestPriority = effectivePriority;
          selected = proc;
        }
      }
    }
    
    if (selected) selected.state = 'running';
    return selected;
  }

  // Memory Management
  private allocateMemory(pid: number, size: number): { start: number; size: number } | null {
    let contiguous = 0;
    let startBlock = -1;
    
    for (let i = 0; i < this.memory.length; i++) {
      if (!this.memory[i].allocated) {
        if (startBlock === -1) startBlock = i;
        contiguous += this.memory[i].size;
        if (contiguous >= size) {
          for (let j = startBlock; j <= i; j++) {
            this.memory[j].allocated = true;
            this.memory[j].processId = pid;
          }
          return { start: this.memory[startBlock].address, size: contiguous };
        }
      } else {
        contiguous = 0;
        startBlock = -1;
      }
    }
    return null;
  }

  private freeMemory(pid: number): void {
    for (const block of this.memory) {
      if (block.processId === pid) {
        block.allocated = false;
        block.processId = null;
      }
    }
  }

  // System Calls
  async syscall(name: string, args: unknown[]): Promise<XSyscallResult> {
    const start = performance.now();
    
    try {
      let returnValue: unknown;
      
      switch (name) {
        case 'intelligence_decide':
          returnValue = await this.intelligence.makeIntelligentDecision(
            args[0] as string,
            args[1] as string[],
            args[2] as Record<string, unknown>
          );
          break;
          
        case 'quantum_superpose':
          returnValue = this.intelligence.quantum.createSuperposition(
            args[0] as string,
            args[1] as string[]
          );
          break;
          
        case 'quantum_measure':
          returnValue = this.intelligence.quantum.measure(args[0] as string);
          break;
          
        case 'swarm_optimize':
          this.intelligence.swarm.createSwarm(
            args[0] as string,
            args[1] as number,
            args[2] as number
          );
          returnValue = this.intelligence.swarm.optimize(
            args[0] as string,
            args[3] as (pos: number[]) => number,
            args[4] as number
          );
          break;
          
        case 'memory_store':
          returnValue = this.intelligence.memory.store(
            args[0] as string,
            args[1]
          );
          break;
          
        case 'memory_retrieve':
          returnValue = this.intelligence.memory.retrieve(args[0] as string);
          break;
          
        case 'phantom_precompute':
          returnValue = await this.intelligence.phantom.precompute(
            args[0] as string,
            args[1] as () => unknown,
            args[2] as number
          );
          break;
          
        default:
          return {
            success: false,
            returnValue: null,
            errno: 38, // ENOSYS
            latencyUs: (performance.now() - start) * 1000
          };
      }
      
      return {
        success: true,
        returnValue,
        errno: 0,
        latencyUs: (performance.now() - start) * 1000
      };
    } catch (error) {
      return {
        success: false,
        returnValue: null,
        errno: 1, // EPERM
        latencyUs: (performance.now() - start) * 1000
      };
    }
  }

  // File Operations
  open(path: string): XFile | null {
    return this.files.get(path) ?? null;
  }

  readdir(path: string): string[] {
    const entries: string[] = [];
    for (const [filePath] of this.files) {
      if (filePath.startsWith(path) && filePath !== path) {
        const relative = filePath.slice(path.length + 1);
        if (!relative.includes('/')) entries.push(relative);
      }
    }
    return entries;
  }

  // System Info
  getStatus(): Record<string, unknown> {
    const allocatedMemory = this.memory.filter(b => b.allocated).reduce((sum, b) => sum + b.size, 0);
    return {
      protocolId: this.protocolId,
      uptime: Date.now(),
      processes: this.processes.size,
      memory: {
        total: this.totalMemory,
        allocated: allocatedMemory,
        free: this.totalMemory - allocatedMemory
      },
      intelligence: this.intelligence.getStatus(),
      phi: PHI
    };
  }
}

// ============================================================================
// XOS SINGLETON
// ============================================================================

let kernel: XOSKernel | null = null;

export function getXOS(): XOSKernel {
  if (!kernel) {
    kernel = new XOSKernel();
  }
  return kernel;
}

export default XOSKernel;
