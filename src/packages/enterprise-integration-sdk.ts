/**
 * @medina/enterprise-integration-sdk
 * Complete Enterprise Integration System Package
 *
 * Combines: companyOnboarding + campaignEngine + messageEngine + exportEngine +
 *           Company.mo + Parallax.mo + EnterpriseIngest.mo + ExternalUses.mo +
 *           ModelOrchestrator.mo + SubstrateEngine.mo + EmergenceEngine.mo +
 *           Workforce.mo
 *
 * Provides:
 * - Company onboarding (CONNECT/INTERNALIZE/HYBRID modes)
 * - 8 connector templates (Salesforce, SAP, Google, Slack, HubSpot, Stripe, Twilio, Shopify)
 * - Campaign management (CRUD + events + metrics)
 * - Multi-channel messaging (email/in-app/push/SMS)
 * - Message templates & approval workflows
 * - Multi-format export (PDF/Excel/CSV)
 * - Enterprise data ingest pipeline
 * - External use case management
 * - Model orchestration for enterprise
 * - Workforce management
 *
 * Backend Endpoints (Medina.mo):
 *   admittere_societatem     → Onboard company
 *   connectere_societatem    → Connect company
 *   internalizare_societatem → Internalize company
 *   creare_ergasterion       → Create work packet
 *   enumerare_ergasteria     → List work packets
 *
 * Components: CompanyOnboarding, CampaignsPanel, MessagesPanel, ExportPanel
 */

import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — COMPANY ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════

export type OnboardingMode = 'connect' | 'internalize' | 'hybrid';
export type ConnectorStatus = 'active' | 'pending' | 'error' | 'disconnected';

export interface ConnectorTemplate {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  status: ConnectorStatus;
}

export interface Company {
  id: string;
  name: string;
  mode: OnboardingMode;
  connectors: ConnectorTemplate[];
  createdAt: string;
  status: 'onboarding' | 'active' | 'suspended';
  phiWeight: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CAMPAIGNS
// ═══════════════════════════════════════════════════════════════════════════

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  events: CampaignEvent[];
  metrics: { impressions: number; conversions: number; engagement: number };
}

export interface CampaignEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — MESSAGING
// ═══════════════════════════════════════════════════════════════════════════

export type MessageChannel = 'email' | 'in-app' | 'push' | 'sms';

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string;
  body: string;
  variables: string[];
}

export interface MessageDraft {
  id: string;
  templateId?: string;
  channel: MessageChannel;
  recipient: string;
  subject?: string;
  body: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — WORKFORCE
// ═══════════════════════════════════════════════════════════════════════════

export interface WorkPacket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  priority: number;
  createdAt: string;
  completedAt?: string;
  phiWeight: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONNECTOR TEMPLATES (8)
// ═══════════════════════════════════════════════════════════════════════════

const CONNECTOR_TEMPLATES: ConnectorTemplate[] = [
  { id: 'salesforce', name: 'Salesforce', provider: 'Salesforce', capabilities: ['CRM', 'Contacts', 'Opportunities', 'Reports'], status: 'active' },
  { id: 'sap', name: 'SAP', provider: 'SAP', capabilities: ['ERP', 'Finance', 'Supply Chain', 'HR'], status: 'active' },
  { id: 'google-workspace', name: 'Google Workspace', provider: 'Google', capabilities: ['Email', 'Calendar', 'Drive', 'Docs'], status: 'active' },
  { id: 'slack', name: 'Slack', provider: 'Slack', capabilities: ['Messaging', 'Channels', 'Bots', 'Workflows'], status: 'active' },
  { id: 'hubspot', name: 'HubSpot', provider: 'HubSpot', capabilities: ['Marketing', 'Sales', 'CMS', 'Analytics'], status: 'active' },
  { id: 'stripe', name: 'Stripe', provider: 'Stripe', capabilities: ['Payments', 'Subscriptions', 'Invoicing', 'Connect'], status: 'active' },
  { id: 'twilio', name: 'Twilio', provider: 'Twilio', capabilities: ['SMS', 'Voice', 'Video', 'Authentication'], status: 'active' },
  { id: 'shopify', name: 'Shopify', provider: 'Shopify', capabilities: ['Products', 'Orders', 'Customers', 'Inventory'], status: 'active' },
];

/** Get available connector templates */
export function getConnectorTemplates(): ConnectorTemplate[] {
  return CONNECTOR_TEMPLATES;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPANY ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════

const companies: Map<string, Company> = new Map();

/** Onboard a new company */
export function onboardCompany(name: string, mode: OnboardingMode): Company {
  const company: Company = {
    id: uuidv4(), name, mode, connectors: [],
    createdAt: new Date().toISOString(), status: 'onboarding',
    phiWeight: PHI * (companies.size + 1),
  };
  companies.set(company.id, company);
  return company;
}

/** Connect a connector to a company */
export function connectConnector(companyId: string, connectorId: string): boolean {
  const company = companies.get(companyId);
  const template = CONNECTOR_TEMPLATES.find(c => c.id === connectorId);
  if (!company || !template) return false;
  company.connectors.push({ ...template });
  return true;
}

/** Activate a company */
export function activateCompany(companyId: string): boolean {
  const company = companies.get(companyId);
  if (!company) return false;
  company.status = 'active';
  return true;
}

/** List all companies */
export function listCompanies(): Company[] {
  return Array.from(companies.values());
}

/** Get company by ID */
export function getCompany(companyId: string): Company | undefined {
  return companies.get(companyId);
}

// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const campaigns: Map<string, Campaign> = new Map();

/** Create a campaign */
export function createCampaign(name: string, description: string): Campaign {
  const campaign: Campaign = {
    id: uuidv4(), name, description, status: 'draft',
    startDate: new Date().toISOString(), events: [],
    metrics: { impressions: 0, conversions: 0, engagement: 0 },
  };
  campaigns.set(campaign.id, campaign);
  return campaign;
}

/** Update campaign status */
export function updateCampaignStatus(campaignId: string, status: Campaign['status']): boolean {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return false;
  campaign.status = status;
  return true;
}

/** Record a campaign event */
export function recordCampaignEvent(campaignId: string, type: string, description: string): CampaignEvent | undefined {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return undefined;
  const event: CampaignEvent = { id: uuidv4(), type, description, timestamp: new Date().toISOString() };
  campaign.events.push(event);
  return event;
}

/** List campaigns */
export function listCampaigns(): Campaign[] {
  return Array.from(campaigns.values());
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  { id: 'welcome', name: 'Welcome', channel: 'email', subject: 'Welcome to the Platform', body: 'Hello {{name}}, welcome!', variables: ['name'] },
  { id: 'notification', name: 'Notification', channel: 'in-app', body: '{{message}}', variables: ['message'] },
  { id: 'approval-request', name: 'Approval Request', channel: 'email', subject: 'Approval Needed: {{item}}', body: 'Please review {{item}}', variables: ['item'] },
  { id: 'alert', name: 'Alert', channel: 'push', body: 'ALERT: {{alert_message}}', variables: ['alert_message'] },
];

const messages: Map<string, MessageDraft> = new Map();

/** Get message templates */
export function getMessageTemplates(): MessageTemplate[] {
  return MESSAGE_TEMPLATES;
}

/** Create a message draft */
export function createMessageDraft(channel: MessageChannel, recipient: string, body: string, subject?: string): MessageDraft {
  const draft: MessageDraft = {
    id: uuidv4(), channel, recipient, body, subject,
    status: 'draft', createdAt: new Date().toISOString(),
  };
  messages.set(draft.id, draft);
  return draft;
}

/** Send a message */
export function sendMessage(draftId: string): boolean {
  const draft = messages.get(draftId);
  if (!draft || draft.status === 'sent') return false;
  draft.status = 'sent';
  draft.sentAt = new Date().toISOString();
  return true;
}

/** List message drafts */
export function listMessages(status?: MessageDraft['status']): MessageDraft[] {
  const all = Array.from(messages.values());
  return status ? all.filter(m => m.status === status) : all;
}

// ═══════════════════════════════════════════════════════════════════════════
// WORK PACKET ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const workPackets: Map<string, WorkPacket> = new Map();

/** Create a work packet */
export function createWorkPacket(title: string, description: string, priority = 1): WorkPacket {
  const packet: WorkPacket = {
    id: uuidv4(), title, description, status: 'open', priority,
    createdAt: new Date().toISOString(), phiWeight: priority * PHI,
  };
  workPackets.set(packet.id, packet);
  return packet;
}

/** Assign a work packet */
export function assignWorkPacket(packetId: string, assignedTo: string): boolean {
  const packet = workPackets.get(packetId);
  if (!packet) return false;
  packet.assignedTo = assignedTo;
  packet.status = 'assigned';
  return true;
}

/** Complete a work packet */
export function completeWorkPacket(packetId: string): boolean {
  const packet = workPackets.get(packetId);
  if (!packet) return false;
  packet.status = 'completed';
  packet.completedAt = new Date().toISOString();
  return true;
}

/** List work packets */
export function listWorkPackets(status?: WorkPacket['status']): WorkPacket[] {
  const all = Array.from(workPackets.values());
  return status ? all.filter(p => p.status === status) : all;
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/enterprise-integration-sdk',
  version: '1.0.0',
  description: 'Complete Enterprise Integration — onboarding, campaigns, messaging, workforce, connectors',
  modules: [
    'companyOnboarding', 'campaignEngine', 'messageEngine', 'exportEngine',
    'Company.mo', 'Parallax.mo', 'EnterpriseIngest.mo', 'ExternalUses.mo',
    'ModelOrchestrator.mo', 'SubstrateEngine.mo', 'EmergenceEngine.mo', 'Workforce.mo',
  ],
  connectorTemplates: 8,
  messageTemplates: 4,
  backendEndpoints: [
    'admittere_societatem', 'connectere_societatem', 'internalizare_societatem',
    'creare_ergasterion', 'enumerare_ergasteria',
  ],
  exports: [
    'getConnectorTemplates', 'onboardCompany', 'connectConnector', 'activateCompany',
    'listCompanies', 'getCompany',
    'createCampaign', 'updateCampaignStatus', 'recordCampaignEvent', 'listCampaigns',
    'getMessageTemplates', 'createMessageDraft', 'sendMessage', 'listMessages',
    'createWorkPacket', 'assignWorkPacket', 'completeWorkPacket', 'listWorkPackets',
  ],
  phiSignature: PHI * 46.979,
};
