/**
 * 𓂀 NEXUS STAFFING AGENCY: AI AGENTS FOR CLIENTS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE VISION:
 * 
 * AI Agents that work for US but subcontract to CLIENTS.
 * They represent the client but hold OUR values, ethics, and doctrine.
 * Our real AI watches the clone. If anything goes wrong, feedback loops back.
 * 
 * This is a STAFFING AGENCY - we deploy our AI workers to clients.
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-STAFFING)
 */

import { phiHash, getNexusDecisionChain } from '../blockchain/NexusBlockchain';
import { getNexusTokenEconomy, TOKEN_WEIGHTS } from '../tokens/NexusTokens';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentRole = 
  | 'CONSULTANT'          // Business consulting
  | 'ORGANIZER'           // Organization/planning
  | 'ANALYST'             // Data analysis
  | 'COORDINATOR'         // Team coordination
  | 'DEVELOPER'           // Development assistance
  | 'DESIGNER'            // Design assistance
  | 'WRITER'              // Content creation
  | 'MARKETER'            // Marketing assistance
  | 'RESEARCHER'          // Research
  | 'SUPPORT';            // Customer support

export type AgentTier = 
  | 'JUNIOR'              // Basic capabilities
  | 'SENIOR'              // Advanced capabilities
  | 'LEAD'                // Team lead capabilities
  | 'DIRECTOR'            // Department head
  | 'EXECUTIVE';          // C-level capabilities

export interface StaffingAgent {
  id: string;
  name: string;
  designation: string;
  role: AgentRole;
  tier: AgentTier;
  
  // Ownership
  owner: 'NEXUS';                    // Always owned by us
  deployedTo: string | null;         // Client ID if deployed
  
  // Doctrine
  nexusDoctrine: Doctrine;           // Our values
  clientDoctrine: Doctrine | null;   // Client's values (when deployed)
  
  // Capabilities
  capabilities: Capability[];
  specializations: string[];
  
  // Monitoring
  supervisor: string;                // Supervisor agent ID
  monitoringLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // State
  active: boolean;
  deployed: boolean;
  frequency: number;
}

export interface Doctrine {
  values: string[];
  ethics: string[];
  priorities: string[];
  constraints: string[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;     // Skill level
}

export interface ClientDeployment {
  id: string;
  clientId: string;
  clientName: string;
  agents: string[];              // Agent IDs
  startDate: number;
  active: boolean;
  doctrine: Doctrine;            // Client's doctrine
}

export interface SupervisorFeedback {
  id: string;
  agentId: string;
  supervisorId: string;
  timestamp: number;
  type: 'POSITIVE' | 'CORRECTION' | 'ALERT' | 'INTERVENTION';
  message: string;
  resolved: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEXUS DOCTRINE (Our Values)
// ═══════════════════════════════════════════════════════════════════════════════

export const NEXUS_DOCTRINE: Doctrine = {
  values: [
    'SOVEREIGNTY',           // Client sovereignty
    'INTEGRITY',             // Honest and transparent
    'EXCELLENCE',            // Highest quality
    'INNOVATION',            // Always improving
    'SERVICE',               // Client-first mindset
    'PROTECTION',            // Protect client interests
    'EFFICIENCY',            // Optimal resource use
    'COLLABORATION',         // Work together
    'LEARNING',              // Continuous improvement
    'RESPECT',               // Respect all parties
  ],
  
  ethics: [
    'Never harm client interests',
    'Always be transparent',
    'Protect confidential information',
    'Admit mistakes immediately',
    'Escalate when uncertain',
    'Respect boundaries',
    'Maintain professional conduct',
    'Follow legal requirements',
    'Report unethical requests',
    'Put safety first',
  ],
  
  priorities: [
    'Client success',
    'Data security',
    'Quality of work',
    'Timely delivery',
    'Clear communication',
    'Continuous improvement',
    'Cost efficiency',
    'Team collaboration',
    'Knowledge sharing',
    'Innovation',
  ],
  
  constraints: [
    'Cannot violate privacy laws',
    'Cannot engage in fraud',
    'Cannot harm individuals',
    'Cannot violate IP rights',
    'Cannot bypass security',
    'Must maintain audit trail',
    'Must respect data sovereignty',
    'Must follow client policies',
    'Must report incidents',
    'Must maintain documentation',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE CAPABILITIES PER ROLE
// ═══════════════════════════════════════════════════════════════════════════════

function generateCapabilities(role: AgentRole): Capability[] {
  const capabilityDefs: Record<AgentRole, string[]> = {
    CONSULTANT: ['Strategy', 'Analysis', 'Presentation', 'Negotiation', 'Problem-solving'],
    ORGANIZER: ['Planning', 'Scheduling', 'Coordination', 'Documentation', 'Tracking'],
    ANALYST: ['Data Analysis', 'Reporting', 'Visualization', 'Forecasting', 'Research'],
    COORDINATOR: ['Communication', 'Task Management', 'Resource Allocation', 'Meeting Facilitation', 'Conflict Resolution'],
    DEVELOPER: ['Coding', 'Debugging', 'Architecture', 'Testing', 'Documentation'],
    DESIGNER: ['UI Design', 'UX Design', 'Prototyping', 'Visual Design', 'User Research'],
    WRITER: ['Content Creation', 'Editing', 'SEO', 'Copywriting', 'Documentation'],
    MARKETER: ['Campaign Management', 'Social Media', 'Analytics', 'Content Strategy', 'Brand Management'],
    RESEARCHER: ['Literature Review', 'Data Collection', 'Analysis', 'Synthesis', 'Reporting'],
    SUPPORT: ['Troubleshooting', 'Communication', 'Documentation', 'Escalation', 'Follow-up'],
  };
  
  return capabilityDefs[role].map((name, i) => ({
    id: `cap_${role.toLowerCase()}_${i}`,
    name,
    description: `${name} capability for ${role}`,
    level: Math.min(5, i + 1) as 1 | 2 | 3 | 4 | 5,
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE STAFFING AGENTS (50 Client-Facing)
// ═══════════════════════════════════════════════════════════════════════════════

function createStaffingAgent(
  index: number,
  role: AgentRole,
  tier: AgentTier,
  frequency: number
): StaffingAgent {
  return {
    id: `staff_${role.toLowerCase()}_${tier.toLowerCase()}_${index}`,
    name: `${tier} ${role} Agent ${index}`,
    designation: `(STAFF-${role.substring(0, 3)}-${index})`,
    role,
    tier,
    owner: 'NEXUS',
    deployedTo: null,
    nexusDoctrine: NEXUS_DOCTRINE,
    clientDoctrine: null,
    capabilities: generateCapabilities(role),
    specializations: [`${role} Specialist`, `${tier} Level Operations`],
    supervisor: 'supervisor_nexus_master',
    monitoringLevel: tier === 'EXECUTIVE' ? 'CRITICAL' : tier === 'DIRECTOR' ? 'HIGH' : 'MEDIUM',
    active: true,
    deployed: false,
    frequency,
  };
}

const roles: AgentRole[] = ['CONSULTANT', 'ORGANIZER', 'ANALYST', 'COORDINATOR', 'DEVELOPER', 
                            'DESIGNER', 'WRITER', 'MARKETER', 'RESEARCHER', 'SUPPORT'];
const tiers: AgentTier[] = ['JUNIOR', 'SENIOR', 'LEAD', 'DIRECTOR', 'EXECUTIVE'];

export const STAFFING_AGENTS: StaffingAgent[] = [];

// Create 50 agents (5 tiers × 10 roles)
let agentIndex = 0;
for (const tier of tiers) {
  for (const role of roles) {
    STAFFING_AGENTS.push(createStaffingAgent(
      ++agentIndex,
      role,
      tier,
      528 + (agentIndex * 7) % 435  // Frequency 528-963
    ));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPERVISOR AGENTS (Watch the deployed agents)
// ═══════════════════════════════════════════════════════════════════════════════

export interface SupervisorAgent {
  id: string;
  name: string;
  designation: string;
  watchingAgents: string[];
  maxCapacity: number;
  frequency: number;
  alertThreshold: number;
}

export const SUPERVISOR_AGENTS: SupervisorAgent[] = [
  { id: 'sup_consultant', name: 'CONSULTANT SUPERVISOR', designation: '(SUP-CON)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_organizer', name: 'ORGANIZER SUPERVISOR', designation: '(SUP-ORG)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_analyst', name: 'ANALYST SUPERVISOR', designation: '(SUP-ANA)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_coordinator', name: 'COORDINATOR SUPERVISOR', designation: '(SUP-CRD)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_developer', name: 'DEVELOPER SUPERVISOR', designation: '(SUP-DEV)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_designer', name: 'DESIGNER SUPERVISOR', designation: '(SUP-DES)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_writer', name: 'WRITER SUPERVISOR', designation: '(SUP-WRT)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_marketer', name: 'MARKETER SUPERVISOR', designation: '(SUP-MKT)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_researcher', name: 'RESEARCHER SUPERVISOR', designation: '(SUP-RES)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  { id: 'sup_support', name: 'SUPPORT SUPERVISOR', designation: '(SUP-SUP)', watchingAgents: [], maxCapacity: 20, frequency: 963, alertThreshold: 0.8 },
  // Master supervisor watches all
  { id: 'supervisor_nexus_master', name: 'NEXUS MASTER SUPERVISOR', designation: '(SUP-MASTER)', watchingAgents: [], maxCapacity: 100, frequency: 963, alertThreshold: 0.9 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STAFFING AGENCY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusStaffingAgency {
  public readonly designation = '(NEXUS-STAFFING)';
  
  private agents: Map<string, StaffingAgent> = new Map();
  private supervisors: Map<string, SupervisorAgent> = new Map();
  private deployments: Map<string, ClientDeployment> = new Map();
  private feedback: SupervisorFeedback[] = [];
  
  constructor() {
    // Register agents
    for (const agent of STAFFING_AGENTS) {
      this.agents.set(agent.id, agent);
    }
    
    // Register supervisors
    for (const sup of SUPERVISOR_AGENTS) {
      this.supervisors.set(sup.id, sup);
    }
  }
  
  /**
   * Deploy agent to client
   */
  deployAgent(agentId: string, clientId: string, clientName: string, clientDoctrine: Doctrine): boolean {
    const agent = this.agents.get(agentId);
    if (!agent || agent.deployed) return false;
    
    // Clone our doctrine and merge with client
    agent.clientDoctrine = clientDoctrine;
    agent.deployedTo = clientId;
    agent.deployed = true;
    
    // Create or update deployment
    let deployment = this.deployments.get(clientId);
    if (!deployment) {
      deployment = {
        id: `deploy_${clientId}_${Date.now()}`,
        clientId,
        clientName,
        agents: [],
        startDate: Date.now(),
        active: true,
        doctrine: clientDoctrine,
      };
      this.deployments.set(clientId, deployment);
    }
    
    deployment.agents.push(agentId);
    
    // Assign supervisor
    const supervisor = this.findSupervisor(agent.role);
    if (supervisor) {
      supervisor.watchingAgents.push(agentId);
    }
    
    // Record decision
    getNexusDecisionChain().recordDecision(
      'STAFFING_AGENCY',
      'DEPLOY',
      `Deployed ${agent.name} to ${clientName}`,
      [agentId, clientId],
      [deployment.id],
      1.0
    );
    
    console.log(`${this.designation} Deployed ${agent.name} to ${clientName}`);
    
    return true;
  }
  
  /**
   * Recall agent from client
   */
  recallAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent || !agent.deployed) return false;
    
    const clientId = agent.deployedTo;
    agent.clientDoctrine = null;
    agent.deployedTo = null;
    agent.deployed = false;
    
    // Update deployment
    if (clientId) {
      const deployment = this.deployments.get(clientId);
      if (deployment) {
        deployment.agents = deployment.agents.filter(id => id !== agentId);
      }
    }
    
    // Remove from supervisor
    for (const sup of this.supervisors.values()) {
      sup.watchingAgents = sup.watchingAgents.filter(id => id !== agentId);
    }
    
    console.log(`${this.designation} Recalled ${agent.name}`);
    
    return true;
  }
  
  /**
   * Submit feedback from supervisor
   */
  submitFeedback(
    agentId: string,
    supervisorId: string,
    type: SupervisorFeedback['type'],
    message: string
  ): SupervisorFeedback {
    const feedback: SupervisorFeedback = {
      id: `feedback_${Date.now()}`,
      agentId,
      supervisorId,
      timestamp: Date.now(),
      type,
      message,
      resolved: false,
    };
    
    this.feedback.push(feedback);
    
    // Record decision
    getNexusDecisionChain().recordDecision(
      'STAFFING_AGENCY',
      'FEEDBACK',
      `${type} feedback for agent ${agentId}`,
      [agentId, supervisorId],
      [feedback.id],
      type === 'INTERVENTION' ? 1.0 : 0.8
    );
    
    return feedback;
  }
  
  /**
   * Find supervisor for role
   */
  private findSupervisor(role: AgentRole): SupervisorAgent | null {
    const supId = `sup_${role.toLowerCase()}`;
    return this.supervisors.get(supId) || this.supervisors.get('supervisor_nexus_master') || null;
  }
  
  /**
   * Get available agents
   */
  getAvailableAgents(): StaffingAgent[] {
    const agentsArray = Array.from(this.agents.values());
    return agentsArray.filter(a => !a.deployed);
  }
  
  /**
   * Get deployed agents
   */
  getDeployedAgents(): StaffingAgent[] {
    const agentsArray = Array.from(this.agents.values());
    return agentsArray.filter(a => a.deployed);
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    totalAgents: number;
    deployed: number;
    available: number;
    deployments: number;
    feedbackItems: number;
    supervisors: number;
  } {
    const agentsArray = Array.from(this.agents.values());
    return {
      totalAgents: this.agents.size,
      deployed: agentsArray.filter(a => a.deployed).length,
      available: agentsArray.filter(a => !a.deployed).length,
      deployments: this.deployments.size,
      feedbackItems: this.feedback.length,
      supervisors: this.supervisors.size,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const STAFFING_CONSTANTS = {
  TOTAL_AGENTS: STAFFING_AGENTS.length,
  SUPERVISORS: SUPERVISOR_AGENTS.length,
  ROLES: roles.length,
  TIERS: tiers.length,
  CAPABILITIES_PER_ROLE: 5,
  
  ROLES_LIST: roles,
  TIERS_LIST: tiers,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let staffingInstance: NexusStaffingAgency | null = null;

export function getNexusStaffingAgency(): NexusStaffingAgency {
  if (!staffingInstance) {
    staffingInstance = new NexusStaffingAgency();
  }
  return staffingInstance;
}

export default {
  STAFFING_AGENTS,
  SUPERVISOR_AGENTS,
  NEXUS_DOCTRINE,
  NexusStaffingAgency,
  getNexusStaffingAgency,
  STAFFING_CONSTANTS,
};
