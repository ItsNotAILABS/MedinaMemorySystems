/**
 * 𓂀 NEXUS DOMAINS: 20 DOMAIN EXTENSIONS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Each domain extension broken down to 5 levels until primitive.
 * These are architecture-driven domains, not "sovereign" names.
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-DOMAINS)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN EXTENSION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DomainLevel {
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
  primitive?: string;
}

export interface DomainExtension {
  extension: string;
  name: string;
  meaning: string;
  levels: DomainLevel[];
  frequency: number;
  type: 'CORE' | 'VALUE' | 'COMMUNICATION' | 'SECURITY' | 'TEMPORAL' | 'SOVEREIGN';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 20 DOMAIN EXTENSIONS (with 5-level breakdown to primitives)
// ═══════════════════════════════════════════════════════════════════════════════

export const NEXUS_DOMAINS: DomainExtension[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 1: .nexus - The Connection
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.nexus',
    name: 'NEXUS',
    meaning: 'Network interconnection domain - the point where all intelligence converges',
    type: 'CORE',
    frequency: 963,
    levels: [
      { level: 1, description: 'Network interconnection domain' },
      { level: 2, description: 'Point where all intelligence converges' },
      { level: 3, description: 'Hub for data/model routing' },
      { level: 4, description: 'Connection state manager' },
      { level: 5, description: 'Binary link between two nodes', primitive: 'bit:link' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 2: .oro - The Value
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.oro',
    name: 'ORO',
    meaning: 'Value/gold extension - currency and transaction layer',
    type: 'VALUE',
    frequency: 852,
    levels: [
      { level: 1, description: 'Value/gold extension' },
      { level: 2, description: 'Currency and transaction layer' },
      { level: 3, description: 'Asset verification point' },
      { level: 4, description: 'Value state container' },
      { level: 5, description: 'Numerical worth unit', primitive: 'unit:value' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 3: .medina - The City
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.medina',
    name: 'MEDINA',
    meaning: 'City/civilization extension - organized structure domain',
    type: 'CORE',
    frequency: 741,
    levels: [
      { level: 1, description: 'City/civilization extension' },
      { level: 2, description: 'Organized structure domain' },
      { level: 3, description: 'Governance and rules layer' },
      { level: 4, description: 'Population container' },
      { level: 5, description: 'Inhabited node cluster', primitive: 'cluster:node' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 4: .cogito - The Thought
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.cogito',
    name: 'COGITO',
    meaning: 'Thought/reasoning extension - intelligence processing domain',
    type: 'CORE',
    frequency: 963,
    levels: [
      { level: 1, description: 'Thought/reasoning extension' },
      { level: 2, description: 'Intelligence processing domain' },
      { level: 3, description: 'Decision computation layer' },
      { level: 4, description: 'Logic state container' },
      { level: 5, description: 'True/false evaluation', primitive: 'bool:eval' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 5: .vivum - The Living
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.vivum',
    name: 'VIVUM',
    meaning: 'Living systems extension - organic intelligence domain',
    type: 'CORE',
    frequency: 528,
    levels: [
      { level: 1, description: 'Living systems extension' },
      { level: 2, description: 'Organic intelligence domain' },
      { level: 3, description: 'Growth and adaptation layer' },
      { level: 4, description: 'Life state container' },
      { level: 5, description: 'Self-replicating pattern', primitive: 'pattern:replicate' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 6: .rex - The Authority
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.rex',
    name: 'REX',
    meaning: 'Authority/king extension - command and control domain',
    type: 'SECURITY',
    frequency: 852,
    levels: [
      { level: 1, description: 'Authority/king extension' },
      { level: 2, description: 'Command and control domain' },
      { level: 3, description: 'Permission governance layer' },
      { level: 4, description: 'Hierarchy state container' },
      { level: 5, description: 'Access bit flag', primitive: 'flag:access' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 7: .flux - The Flow
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.flux',
    name: 'FLUX',
    meaning: 'Flow/change extension - data stream domain',
    type: 'COMMUNICATION',
    frequency: 639,
    levels: [
      { level: 1, description: 'Flow/change extension' },
      { level: 2, description: 'Data stream domain' },
      { level: 3, description: 'Continuous transmission layer' },
      { level: 4, description: 'Stream state container' },
      { level: 5, description: 'Single data packet', primitive: 'packet:data' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 8: .primus - The First
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.primus',
    name: 'PRIMUS',
    meaning: 'First/primary extension - origin point domain',
    type: 'CORE',
    frequency: 963,
    levels: [
      { level: 1, description: 'First/primary extension' },
      { level: 2, description: 'Origin point domain' },
      { level: 3, description: 'Genesis layer' },
      { level: 4, description: 'Initial state container' },
      { level: 5, description: 'Zero index reference', primitive: 'index:zero' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 9: .arcis - The Fortress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.arcis',
    name: 'ARCIS',
    meaning: 'Fortress/stronghold extension - defense domain',
    type: 'SECURITY',
    frequency: 852,
    levels: [
      { level: 1, description: 'Fortress/stronghold extension' },
      { level: 2, description: 'Defense domain (defense company tie-in)' },
      { level: 3, description: 'Security perimeter layer' },
      { level: 4, description: 'Protected state container' },
      { level: 5, description: 'Encryption bit', primitive: 'bit:encrypt' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 10: .lux - The Light
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.lux',
    name: 'LUX',
    meaning: 'Light extension - visibility domain',
    type: 'COMMUNICATION',
    frequency: 528,
    levels: [
      { level: 1, description: 'Light extension' },
      { level: 2, description: 'Visibility domain' },
      { level: 3, description: 'Interface/display layer' },
      { level: 4, description: 'Render state container' },
      { level: 5, description: 'Photon instruction', primitive: 'photon:render' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 11: .silent - The Hidden (SOVEREIGN)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.silent',
    name: 'SILENT',
    meaning: 'Silent/hidden extension - covert operations domain',
    type: 'SOVEREIGN',
    frequency: 963,
    levels: [
      { level: 1, description: 'Silent/hidden extension' },
      { level: 2, description: 'Covert operations domain' },
      { level: 3, description: 'Stealth transmission layer' },
      { level: 4, description: 'Hidden state container' },
      { level: 5, description: 'Null-visible flag', primitive: 'flag:null' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 12: .terra - The Earth
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.terra',
    name: 'TERRA',
    meaning: 'Earth/ground extension - physical infrastructure domain',
    type: 'CORE',
    frequency: 396,
    levels: [
      { level: 1, description: 'Earth/ground extension' },
      { level: 2, description: 'Physical infrastructure domain' },
      { level: 3, description: 'Hardware binding layer' },
      { level: 4, description: 'Physical state container' },
      { level: 5, description: 'Location coordinate', primitive: 'coord:geo' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 13: .axis - The Center
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.axis',
    name: 'AXIS',
    meaning: 'Center line extension - alignment domain',
    type: 'CORE',
    frequency: 741,
    levels: [
      { level: 1, description: 'Center line extension' },
      { level: 2, description: 'Alignment domain' },
      { level: 3, description: 'Orientation layer' },
      { level: 4, description: 'Direction state container' },
      { level: 5, description: 'Vector component', primitive: 'vector:dir' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 14: .vox - The Voice
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.vox',
    name: 'VOX',
    meaning: 'Voice extension - communication domain',
    type: 'COMMUNICATION',
    frequency: 528,
    levels: [
      { level: 1, description: 'Voice extension' },
      { level: 2, description: 'Communication domain' },
      { level: 3, description: 'Audio/message layer' },
      { level: 4, description: 'Signal state container' },
      { level: 5, description: 'Waveform sample', primitive: 'sample:wave' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 15: .cipher - The Code
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.cipher',
    name: 'CIPHER',
    meaning: 'Code/encryption extension - cryptography domain',
    type: 'SECURITY',
    frequency: 852,
    levels: [
      { level: 1, description: 'Code/encryption extension' },
      { level: 2, description: 'Cryptography domain' },
      { level: 3, description: 'Encoding layer' },
      { level: 4, description: 'Encrypted state container' },
      { level: 5, description: 'Cipher bit', primitive: 'bit:cipher' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 16: .echo - The Reflection
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.echo',
    name: 'ECHO',
    meaning: 'Reflection extension - feedback domain',
    type: 'COMMUNICATION',
    frequency: 639,
    levels: [
      { level: 1, description: 'Reflection extension' },
      { level: 2, description: 'Feedback domain' },
      { level: 3, description: 'Response propagation layer' },
      { level: 4, description: 'Mirror state container' },
      { level: 5, description: 'Return signal', primitive: 'signal:return' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 17: .genesis - The Creation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.genesis',
    name: 'GENESIS',
    meaning: 'Creation extension - origin domain',
    type: 'CORE',
    frequency: 963,
    levels: [
      { level: 1, description: 'Creation extension' },
      { level: 2, description: 'Origin domain' },
      { level: 3, description: 'Birth layer' },
      { level: 4, description: 'Creation state container' },
      { level: 5, description: 'First instruction', primitive: 'instruction:first' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 18: .pulse - The Heartbeat
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.pulse',
    name: 'PULSE',
    meaning: 'Heartbeat extension - rhythm domain',
    type: 'TEMPORAL',
    frequency: 528,
    levels: [
      { level: 1, description: 'Heartbeat extension' },
      { level: 2, description: 'Rhythm domain' },
      { level: 3, description: 'Timing layer' },
      { level: 4, description: 'Beat state container' },
      { level: 5, description: 'Clock tick', primitive: 'tick:clock' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 19: .vertex - The Peak
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.vertex',
    name: 'VERTEX',
    meaning: 'Peak/point extension - node domain',
    type: 'CORE',
    frequency: 741,
    levels: [
      { level: 1, description: 'Peak/point extension' },
      { level: 2, description: 'Node domain' },
      { level: 3, description: 'Connection point layer' },
      { level: 4, description: 'Vertex state container' },
      { level: 5, description: 'Graph node', primitive: 'node:graph' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 20: .omni - The Universal
  // ═══════════════════════════════════════════════════════════════════════════
  {
    extension: '.omni',
    name: 'OMNI',
    meaning: 'All/everything extension - universal domain',
    type: 'CORE',
    frequency: 963,
    levels: [
      { level: 1, description: 'All/everything extension' },
      { level: 2, description: 'Universal domain' },
      { level: 3, description: 'Total access layer' },
      { level: 4, description: 'Complete state container' },
      { level: 5, description: 'All-bit flag (1111...1)', primitive: 'flag:all' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN RESOLVER
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusDomainResolver {
  private domains: Map<string, DomainExtension> = new Map();
  private registrations: Map<string, string> = new Map(); // name.extension -> target
  
  constructor() {
    // Register all 20 domains
    for (const domain of NEXUS_DOMAINS) {
      this.domains.set(domain.extension, domain);
    }
  }
  
  /**
   * Get a domain extension definition
   */
  getDomain(extension: string): DomainExtension | undefined {
    return this.domains.get(extension.startsWith('.') ? extension : `.${extension}`);
  }
  
  /**
   * Get all domains
   */
  getAllDomains(): DomainExtension[] {
    return Array.from(this.domains.values());
  }
  
  /**
   * Get domains by type
   */
  getDomainsByType(type: DomainExtension['type']): DomainExtension[] {
    return Array.from(this.domains.values()).filter(d => d.type === type);
  }
  
  /**
   * Register an address
   */
  registerAddress(name: string, extension: string, target: string): void {
    const fullAddress = `${name}${extension.startsWith('.') ? extension : '.' + extension}`;
    this.registrations.set(fullAddress, target);
  }
  
  /**
   * Resolve an address
   */
  resolve(address: string): string | null {
    // Parse address: protocol://name.extension
    const match = address.match(/^([a-z]+):\/\/([^.]+)(\.(?:[a-z]+))$/);
    if (!match) return null;
    
    const fullDomain = `${match[2]}${match[3]}`;
    return this.registrations.get(fullDomain) || null;
  }
  
  /**
   * Validate an extension
   */
  isValidExtension(extension: string): boolean {
    return this.domains.has(extension.startsWith('.') ? extension : `.${extension}`);
  }
  
  /**
   * Get primitive for a domain at level 5
   */
  getPrimitive(extension: string): string | undefined {
    const domain = this.getDomain(extension);
    if (!domain) return undefined;
    
    const level5 = domain.levels.find(l => l.level === 5);
    return level5?.primitive;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const DOMAIN_CONSTANTS = {
  // Quick access to extensions
  EXTENSIONS: {
    NEXUS: '.nexus',
    ORO: '.oro',
    MEDINA: '.medina',
    COGITO: '.cogito',
    VIVUM: '.vivum',
    REX: '.rex',
    FLUX: '.flux',
    PRIMUS: '.primus',
    ARCIS: '.arcis',
    LUX: '.lux',
    SILENT: '.silent',
    TERRA: '.terra',
    AXIS: '.axis',
    VOX: '.vox',
    CIPHER: '.cipher',
    ECHO: '.echo',
    GENESIS: '.genesis',
    PULSE: '.pulse',
    VERTEX: '.vertex',
    OMNI: '.omni',
  },
  
  // Type groupings
  TYPES: {
    CORE: ['.nexus', '.medina', '.cogito', '.vivum', '.primus', '.terra', '.axis', '.genesis', '.vertex', '.omni'],
    VALUE: ['.oro'],
    COMMUNICATION: ['.flux', '.lux', '.vox', '.echo'],
    SECURITY: ['.rex', '.arcis', '.cipher'],
    TEMPORAL: ['.pulse'],
    SOVEREIGN: ['.silent'],
  },
  
  // Total count
  TOTAL_DOMAINS: 20,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let resolverInstance: NexusDomainResolver | null = null;

export function getNexusDomainResolver(): NexusDomainResolver {
  if (!resolverInstance) {
    resolverInstance = new NexusDomainResolver();
  }
  return resolverInstance;
}

export default {
  NEXUS_DOMAINS,
  NexusDomainResolver,
  getNexusDomainResolver,
  DOMAIN_CONSTANTS,
};
