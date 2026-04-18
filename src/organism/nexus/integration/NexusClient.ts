/**
 * 𓂀 NEXUS CLIENT INTEGRATION: TERMINAL TAKEOVER & DIGITAL TWIN 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE VISION:
 * 
 * 1. Not a new SaaS system to deploy - JOINS their existing terminal
 * 2. Takes over a PART of their system (not the whole thing)
 * 3. Progressive trust model - opens more capabilities over time
 * 4. Platform agnostic - Slack, Excel, anywhere
 * 5. Cross-device continuity - same experience everywhere
 * 6. Digital twin of their entire business
 * 7. Client-facing AIs that represent clients (borrowed subcontractors)
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-CLIENT)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT INTEGRATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TrustLevel = 
  | 'ONBOARDING'    // Initial contact
  | 'TRIAL'         // Testing the system
  | 'TRUSTED'       // Full access
  | 'PARTNER'       // Deep integration
  | 'SOVEREIGN';    // Full sovereignty

export type Platform = 
  | 'TERMINAL'      // Native terminal
  | 'SLACK'         // Slack workspace
  | 'TEAMS'         // Microsoft Teams
  | 'DISCORD'       // Discord
  | 'EXCEL'         // Microsoft Excel
  | 'SHEETS'        // Google Sheets
  | 'WEB'           // Web browser
  | 'DESKTOP'       // Desktop app
  | 'MOBILE'        // Mobile app
  | 'CLI'           // Command line
  | 'API';          // Direct API

export interface ClientOrganization {
  id: string;
  name: string;
  domain: string;
  trustLevel: TrustLevel;
  platforms: Platform[];
  terminals: Terminal[];
  employees: Employee[];
  digitalTwin: DigitalTwin;
  borrowedAIs: BorrowedAI[];
  integrations: Integration[];
  createdAt: number;
  lastActive: number;
}

export interface Terminal {
  id: string;
  organizationId: string;
  type: 'WINDOWS' | 'MAC' | 'LINUX' | 'CLOUD';
  deviceId: string;
  userId: string;
  nexusPartition: TerminalPartition;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  lastSync: number;
}

export interface TerminalPartition {
  id: string;
  terminalId: string;
  percentage: number;  // % of terminal under NEXUS control
  capabilities: string[];
  sandboxes: Sandbox[];
  permissions: Permission[];
}

export interface Sandbox {
  id: string;
  name: string;
  type: 'DEVELOPMENT' | 'TESTING' | 'PRODUCTION' | 'ISOLATED';
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  active: boolean;
}

export interface Permission {
  resource: string;
  level: 'READ' | 'WRITE' | 'EXECUTE' | 'FULL';
  granted: boolean;
}

export interface Employee {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  terminals: string[];  // Terminal IDs
  trustLevel: TrustLevel;
  personalAI: BorrowedAI | null;
}

export interface DigitalTwin {
  id: string;
  organizationId: string;
  name: string;
  status: 'BUILDING' | 'ACTIVE' | 'SYNCING' | 'DORMANT';
  completeness: number;  // 0-100%
  entities: TwinEntity[];
  connections: TwinConnection[];
  lastSync: number;
}

export interface TwinEntity {
  id: string;
  type: 'DEPARTMENT' | 'TEAM' | 'PROCESS' | 'ASSET' | 'DATA' | 'PERSON';
  name: string;
  properties: Record<string, unknown>;
  frequency: number;
}

export interface TwinConnection {
  sourceId: string;
  targetId: string;
  type: 'REPORTS_TO' | 'OWNS' | 'USES' | 'PRODUCES' | 'CONSUMES';
  strength: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BORROWED AI (Subcontractor Model)
// ═══════════════════════════════════════════════════════════════════════════════

export interface BorrowedAI {
  id: string;
  nexusAgentId: string;       // Original NEXUS agent ID
  organizationId: string;      // Client who borrowed it
  employeeId: string | null;   // Specific employee (null = org-wide)
  designation: string;
  name: string;
  
  // Ownership
  ownedBy: 'NEXUS';           // Always owned by NEXUS
  borrowedBy: string;          // Client organization ID
  
  // Role
  role: 'TRANSLATOR' | 'ASSISTANT' | 'ANALYST' | 'EXECUTOR';
  
  // Capabilities (subset of full agent capabilities)
  capabilities: string[];
  restrictions: string[];
  
  // State
  active: boolean;
  processedCount: number;
  createdAt: number;
  lastActive: number;
}

export interface Integration {
  id: string;
  organizationId: string;
  platform: Platform;
  name: string;
  config: Record<string, unknown>;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING' | 'ERROR';
  borrowedAI: BorrowedAI | null;  // AI handling this integration
  lastSync: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT INTEGRATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusClientEngine {
  public readonly designation = '(NEXUS-CLIENT-ENGINE)';
  
  private organizations: Map<string, ClientOrganization> = new Map();
  private terminals: Map<string, Terminal> = new Map();
  private borrowedAIs: Map<string, BorrowedAI> = new Map();
  private orgCounter = 0;
  private terminalCounter = 0;
  private aiCounter = 0;
  
  /**
   * Initialize the client engine
   */
  async initialize(): Promise<void> {
    console.log(`${this.designation} Initializing client integration engine...`);
    console.log(`  Trust progression: ONBOARDING → TRIAL → TRUSTED → PARTNER → SOVEREIGN`);
    console.log(`  Supported platforms: ${['TERMINAL', 'SLACK', 'TEAMS', 'DISCORD', 'EXCEL', 'SHEETS', 'WEB', 'DESKTOP', 'MOBILE', 'CLI', 'API'].join(', ')}`);
    console.log(`${this.designation} Ready for client connections`);
  }
  
  /**
   * Onboard a new client organization
   */
  onboardOrganization(name: string, domain: string): ClientOrganization {
    const id = `org_${++this.orgCounter}_${Date.now()}`;
    
    const org: ClientOrganization = {
      id,
      name,
      domain,
      trustLevel: 'ONBOARDING',
      platforms: [],
      terminals: [],
      employees: [],
      digitalTwin: this.createDigitalTwin(id, name),
      borrowedAIs: [],
      integrations: [],
      createdAt: Date.now(),
      lastActive: Date.now(),
    };
    
    this.organizations.set(id, org);
    console.log(`${this.designation} Onboarded: ${name} (${domain})`);
    
    return org;
  }
  
  /**
   * Create a digital twin for an organization
   */
  private createDigitalTwin(orgId: string, name: string): DigitalTwin {
    return {
      id: `twin_${orgId}`,
      organizationId: orgId,
      name: `${name} Digital Twin`,
      status: 'BUILDING',
      completeness: 0,
      entities: [],
      connections: [],
      lastSync: Date.now(),
    };
  }
  
  /**
   * Connect a terminal to NEXUS
   */
  connectTerminal(
    orgId: string,
    userId: string,
    type: Terminal['type'],
    deviceId: string
  ): Terminal | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;
    
    const terminalId = `term_${++this.terminalCounter}_${Date.now()}`;
    
    const terminal: Terminal = {
      id: terminalId,
      organizationId: orgId,
      type,
      deviceId,
      userId,
      nexusPartition: {
        id: `part_${terminalId}`,
        terminalId,
        percentage: 10, // Start with 10% control
        capabilities: ['BASIC_QUERY', 'FILE_READ'],
        sandboxes: [],
        permissions: [],
      },
      status: 'CONNECTED',
      lastSync: Date.now(),
    };
    
    this.terminals.set(terminalId, terminal);
    org.terminals.push(terminal);
    
    console.log(`${this.designation} Terminal connected: ${type} (${deviceId})`);
    console.log(`  Partition: ${terminal.nexusPartition.percentage}% under NEXUS control`);
    
    return terminal;
  }
  
  /**
   * Expand terminal partition (as trust builds)
   */
  expandPartition(terminalId: string, additionalPercentage: number): boolean {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) return false;
    
    const org = this.organizations.get(terminal.organizationId);
    if (!org) return false;
    
    // Check trust level allows expansion
    const maxByTrust: Record<TrustLevel, number> = {
      ONBOARDING: 10,
      TRIAL: 25,
      TRUSTED: 50,
      PARTNER: 75,
      SOVEREIGN: 100,
    };
    
    const max = maxByTrust[org.trustLevel];
    const newPercentage = Math.min(
      terminal.nexusPartition.percentage + additionalPercentage,
      max
    );
    
    terminal.nexusPartition.percentage = newPercentage;
    
    console.log(`${this.designation} Partition expanded: ${newPercentage}%`);
    
    return true;
  }
  
  /**
   * Create a sandbox for an employee
   */
  createSandbox(
    terminalId: string,
    name: string,
    type: Sandbox['type']
  ): Sandbox | null {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) return null;
    
    const sandbox: Sandbox = {
      id: `sandbox_${Date.now()}`,
      name,
      type,
      resources: {
        cpu: 1,
        memory: 1024,
        storage: 10240,
      },
      active: true,
    };
    
    terminal.nexusPartition.sandboxes.push(sandbox);
    
    console.log(`${this.designation} Sandbox created: ${name} (${type})`);
    
    return sandbox;
  }
  
  /**
   * Borrow an AI agent for a client (subcontractor model)
   */
  borrowAI(
    nexusAgentId: string,
    orgId: string,
    employeeId: string | null,
    role: BorrowedAI['role'],
    capabilities: string[]
  ): BorrowedAI | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;
    
    const id = `borrowed_${++this.aiCounter}_${Date.now()}`;
    
    const borrowedAI: BorrowedAI = {
      id,
      nexusAgentId,
      organizationId: orgId,
      employeeId,
      designation: `(CLIENT-AI-${this.aiCounter})`,
      name: `${org.name} AI ${this.aiCounter}`,
      
      // Always owned by NEXUS
      ownedBy: 'NEXUS',
      borrowedBy: orgId,
      
      role,
      capabilities,
      restrictions: ['NO_EXTERNAL_DATA', 'AUDIT_LOGGED'],
      
      active: true,
      processedCount: 0,
      createdAt: Date.now(),
      lastActive: Date.now(),
    };
    
    this.borrowedAIs.set(id, borrowedAI);
    org.borrowedAIs.push(borrowedAI);
    
    console.log(`${this.designation} AI borrowed: ${borrowedAI.name}`);
    console.log(`  Role: ${role}`);
    console.log(`  Owned by: NEXUS (borrowed by ${org.name})`);
    
    return borrowedAI;
  }
  
  /**
   * Add an integration (platform connection)
   */
  addIntegration(
    orgId: string,
    platform: Platform,
    name: string,
    config: Record<string, unknown>
  ): Integration | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;
    
    // Create a borrowed AI for this integration
    const ai = this.borrowAI(
      'agent_cortex', // Default to cortex agent
      orgId,
      null,
      'TRANSLATOR',
      ['PLATFORM_TRANSLATE', 'MESSAGE_ROUTE', 'STATE_SYNC']
    );
    
    const integration: Integration = {
      id: `integ_${Date.now()}`,
      organizationId: orgId,
      platform,
      name,
      config,
      status: 'CONNECTED',
      borrowedAI: ai,
      lastSync: Date.now(),
    };
    
    org.integrations.push(integration);
    org.platforms.push(platform);
    
    console.log(`${this.designation} Integration added: ${platform} - ${name}`);
    
    return integration;
  }
  
  /**
   * Upgrade trust level
   */
  upgradeTrust(orgId: string, newLevel: TrustLevel): boolean {
    const org = this.organizations.get(orgId);
    if (!org) return false;
    
    const levels: TrustLevel[] = ['ONBOARDING', 'TRIAL', 'TRUSTED', 'PARTNER', 'SOVEREIGN'];
    const currentIdx = levels.indexOf(org.trustLevel);
    const newIdx = levels.indexOf(newLevel);
    
    if (newIdx <= currentIdx) return false;
    
    org.trustLevel = newLevel;
    
    console.log(`${this.designation} Trust upgraded: ${org.name} → ${newLevel}`);
    
    return true;
  }
  
  /**
   * Sync digital twin
   */
  syncDigitalTwin(orgId: string, entities: TwinEntity[], connections: TwinConnection[]): boolean {
    const org = this.organizations.get(orgId);
    if (!org) return false;
    
    org.digitalTwin.entities = [...org.digitalTwin.entities, ...entities];
    org.digitalTwin.connections = [...org.digitalTwin.connections, ...connections];
    org.digitalTwin.completeness = Math.min(
      org.digitalTwin.completeness + (entities.length + connections.length),
      100
    );
    org.digitalTwin.status = 'ACTIVE';
    org.digitalTwin.lastSync = Date.now();
    
    console.log(`${this.designation} Digital twin synced: ${org.digitalTwin.completeness}% complete`);
    
    return true;
  }
  
  /**
   * Get organization
   */
  getOrganization(orgId: string): ClientOrganization | undefined {
    return this.organizations.get(orgId);
  }
  
  /**
   * Get all organizations
   */
  getAllOrganizations(): ClientOrganization[] {
    return Array.from(this.organizations.values());
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    organizations: number;
    terminals: number;
    borrowedAIs: number;
    integrations: number;
    avgTwinCompleteness: number;
  } {
    let totalCompleteness = 0;
    let totalIntegrations = 0;
    
    const orgsArray = Array.from(this.organizations.values());
    for (const org of orgsArray) {
      totalCompleteness += org.digitalTwin.completeness;
      totalIntegrations += org.integrations.length;
    }
    
    return {
      organizations: this.organizations.size,
      terminals: this.terminals.size,
      borrowedAIs: this.borrowedAIs.size,
      integrations: totalIntegrations,
      avgTwinCompleteness: this.organizations.size > 0 
        ? totalCompleteness / this.organizations.size 
        : 0,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-DEVICE CONTINUITY
// ═══════════════════════════════════════════════════════════════════════════════

export class CrossDeviceContinuity {
  public readonly designation = '(NEXUS-CONTINUITY)';
  
  private sessions: Map<string, SessionState> = new Map();
  
  /**
   * Create a session that can span devices
   */
  createSession(userId: string, orgId: string): SessionState {
    const session: SessionState = {
      id: `session_${Date.now()}`,
      userId,
      orgId,
      currentDevice: null,
      devices: [],
      state: {},
      cursor: { x: 0, y: 0 },
      createdAt: Date.now(),
      lastActive: Date.now(),
    };
    
    this.sessions.set(session.id, session);
    return session;
  }
  
  /**
   * Transfer session to another device
   */
  transferToDevice(sessionId: string, deviceId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.currentDevice = deviceId;
    if (!session.devices.includes(deviceId)) {
      session.devices.push(deviceId);
    }
    session.lastActive = Date.now();
    
    console.log(`${this.designation} Session transferred to device: ${deviceId}`);
    
    return true;
  }
  
  /**
   * Update session state
   */
  updateState(sessionId: string, key: string, value: unknown): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.state[key] = value;
    session.lastActive = Date.now();
    
    return true;
  }
  
  /**
   * Get session state
   */
  getState(sessionId: string): Record<string, unknown> | null {
    const session = this.sessions.get(sessionId);
    return session?.state || null;
  }
}

export interface SessionState {
  id: string;
  userId: string;
  orgId: string;
  currentDevice: string | null;
  devices: string[];
  state: Record<string, unknown>;
  cursor: { x: number; y: number };
  createdAt: number;
  lastActive: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CLIENT_CONSTANTS = {
  TRUST_LEVELS: ['ONBOARDING', 'TRIAL', 'TRUSTED', 'PARTNER', 'SOVEREIGN'],
  
  PLATFORMS: [
    'TERMINAL', 'SLACK', 'TEAMS', 'DISCORD', 'EXCEL', 
    'SHEETS', 'WEB', 'DESKTOP', 'MOBILE', 'CLI', 'API'
  ],
  
  PARTITION_LIMITS: {
    ONBOARDING: 10,
    TRIAL: 25,
    TRUSTED: 50,
    PARTNER: 75,
    SOVEREIGN: 100,
  },
  
  AI_ROLES: ['TRANSLATOR', 'ASSISTANT', 'ANALYST', 'EXECUTOR'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETONS
// ═══════════════════════════════════════════════════════════════════════════════

let clientEngineInstance: NexusClientEngine | null = null;
let continuityInstance: CrossDeviceContinuity | null = null;

export function getNexusClientEngine(): NexusClientEngine {
  if (!clientEngineInstance) {
    clientEngineInstance = new NexusClientEngine();
  }
  return clientEngineInstance;
}

export function getCrossDeviceContinuity(): CrossDeviceContinuity {
  if (!continuityInstance) {
    continuityInstance = new CrossDeviceContinuity();
  }
  return continuityInstance;
}

export default {
  NexusClientEngine,
  CrossDeviceContinuity,
  getNexusClientEngine,
  getCrossDeviceContinuity,
  CLIENT_CONSTANTS,
};
