import { v4 as uuidv4 } from 'uuid';
import type { Company, Connector, ConnectorStatus, ConnectorType, OnboardingMode } from '@/types';

// ─── Store ─────────────────────────────────────────────────────────────────────

const companies: Map<string, Company> = new Map();

const connectorTemplates: { name: string; type: ConnectorType; icon: string }[] = [
  { name: 'Salesforce CRM', type: 'crm', icon: '🔵' },
  { name: 'SAP ERP', type: 'erp', icon: '🟡' },
  { name: 'Google Workspace', type: 'email', icon: '📧' },
  { name: 'Microsoft 365', type: 'calendar', icon: '📅' },
  { name: 'AWS S3 Storage', type: 'storage', icon: '🗄️' },
  { name: 'Slack', type: 'communication', icon: '💬' },
  { name: 'Tableau Analytics', type: 'analytics', icon: '📊' },
  { name: 'Custom API', type: 'custom', icon: '🔌' },
];

// Seed a default company
(function seed() {
  const now = new Date().toISOString();
  const connectors: Connector[] = connectorTemplates.map((t, i) => ({
    id: uuidv4(),
    name: t.name,
    type: t.type,
    status: (i < 3 ? 'connected' : i < 5 ? 'pending' : 'disconnected') as ConnectorStatus,
    mode: 'hybrid',
    lastSync: i < 3 ? now : undefined,
    dataPoints: i < 3 ? Math.floor(Math.random() * 10000) + 1000 : 0,
    icon: t.icon,
  }));

  const company: Company = {
    id: uuidv4(),
    name: 'NOVA OVO Demo Corp',
    mode: 'hybrid',
    connectors,
    onboardedAt: now,
    memoryEntries: 247,
    governanceActive: true,
  };

  companies.set(company.id, company);
})();

// ─── Operations ───────────────────────────────────────────────────────────────

export function listCompanies(): Company[] {
  return Array.from(companies.values());
}

export function getCompany(id: string): Company | undefined {
  return companies.get(id);
}

export function getDefaultCompany(): Company | undefined {
  return companies.values().next().value as Company | undefined;
}

export function createCompany(name: string, mode: OnboardingMode): Company {
  const now = new Date().toISOString();
  const connectors: Connector[] = connectorTemplates.map((t) => ({
    id: uuidv4(),
    name: t.name,
    type: t.type,
    status: 'disconnected' as ConnectorStatus,
    mode,
    icon: t.icon,
  }));

  const company: Company = {
    id: uuidv4(),
    name,
    mode,
    connectors,
    onboardedAt: now,
    memoryEntries: 0,
    governanceActive: false,
  };

  companies.set(company.id, company);
  return company;
}

export function setCompanyMode(companyId: string, mode: OnboardingMode): Company | null {
  const company = companies.get(companyId);
  if (!company) return null;
  const updated = { ...company, mode };
  companies.set(companyId, updated);
  return updated;
}

export function connectConnector(companyId: string, connectorId: string): Connector | null {
  const company = companies.get(companyId);
  if (!company) return null;

  const connectorIdx = company.connectors.findIndex((c) => c.id === connectorId);
  if (connectorIdx === -1) return null;

  const updated = {
    ...company.connectors[connectorIdx],
    status: 'connected' as ConnectorStatus,
    lastSync: new Date().toISOString(),
    dataPoints: Math.floor(Math.random() * 5000) + 500,
  };

  const updatedConnectors = [...company.connectors];
  updatedConnectors[connectorIdx] = updated;
  companies.set(companyId, { ...company, connectors: updatedConnectors });
  return updated;
}

export function syncConnector(companyId: string, connectorId: string): Connector | null {
  const company = companies.get(companyId);
  if (!company) return null;

  const connectorIdx = company.connectors.findIndex((c) => c.id === connectorId);
  if (connectorIdx === -1) return null;

  const existing = company.connectors[connectorIdx];
  if (existing.status !== 'connected') return null;

  const updated = {
    ...existing,
    lastSync: new Date().toISOString(),
    dataPoints: (existing.dataPoints ?? 0) + Math.floor(Math.random() * 100),
  };

  const updatedConnectors = [...company.connectors];
  updatedConnectors[connectorIdx] = updated;
  companies.set(companyId, { ...company, connectors: updatedConnectors });
  return updated;
}

export function getOnboardingStats(companyId: string): {
  connected: number;
  pending: number;
  disconnected: number;
  totalDataPoints: number;
} | null {
  const company = companies.get(companyId);
  if (!company) return null;

  return {
    connected: company.connectors.filter((c) => c.status === 'connected').length,
    pending: company.connectors.filter((c) => c.status === 'pending').length,
    disconnected: company.connectors.filter((c) => c.status === 'disconnected').length,
    totalDataPoints: company.connectors.reduce((sum, c) => sum + (c.dataPoints ?? 0), 0),
  };
}
