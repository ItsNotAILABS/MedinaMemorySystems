// ═══════════════════════════════════════════════════════════════
// GO SYSTEM TYPES — Medina GO Systems
// Enterprise AI Infrastructure Platform
// 10 Divisions · 50 AI Models · 30 MCP Servers · 100 Scrapers · 20 Workflows
// ═══════════════════════════════════════════════════════════════

// ─── Divisions ───────────────────────────────────────────────────────────────

export type GODivision =
  | 'INFRASTRUCTURE'
  | 'CODING_AGENTS'
  | 'CRAWLING'
  | 'MCP_SERVERS'
  | 'ERROR_MONITORING'
  | 'DESKTOP_COMMAND'
  | 'CONTEXT_DOCS'
  | 'WORKFLOWS'
  | 'SCRAPING'
  | 'TESTING';

// ─── AI Model Families ───────────────────────────────────────────────────────

export type GOModelFamily =
  | 'Crawling'
  | 'Context/Docs'
  | 'Desktop Commander'
  | 'Sentry Error Monitoring'
  | 'Coding Agent Tools'
  | 'Infrastructure'
  | 'Workflow'
  | 'Testing';

export type GOModelStatus = 'active' | 'idle' | 'loading' | 'error' | 'offline';

export interface GOModel {
  id: string;           // GOM-01 → GOM-50
  name: string;
  family: GOModelFamily;
  division: GODivision;
  description: string;
  capabilities: string[];
  status: GOModelStatus;
  version: string;
  lastActive: string;
  invocationCount: number;
  avgLatencyMs: number;
}

// ─── MCP Servers ─────────────────────────────────────────────────────────────

export type MCPServerStatus = 'running' | 'stopped' | 'starting' | 'error' | 'maintenance';

export interface MCPServer {
  id: string;           // MCP-01 → MCP-30
  name: string;
  division: GODivision;
  description: string;
  capabilities: string[];
  status: MCPServerStatus;
  port: number;
  protocol: 'stdio' | 'http' | 'ws';
  connectedClients: number;
  uptime: number;       // seconds
  lastHealthCheck: string;
}

// ─── Scrapers ────────────────────────────────────────────────────────────────

export type ScraperCategory =
  | 'E-Commerce'
  | 'Social Media'
  | 'Jobs'
  | 'Real Estate'
  | 'News'
  | 'Finance/Crypto'
  | 'Developer'
  | 'Government';

export type ScraperStatus = 'active' | 'paused' | 'error' | 'rate-limited' | 'disabled';

export interface GOScraper {
  id: string;           // SCR-001 → SCR-100
  name: string;
  category: ScraperCategory;
  targetDomain: string;
  description: string;
  status: ScraperStatus;
  schedule: string;     // cron expression
  lastRun: string;
  totalRuns: number;
  successRate: number;  // 0–1
  avgDurationMs: number;
  dataPointsCollected: number;
}

// ─── Automated Workflows ─────────────────────────────────────────────────────

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed' | 'pending';

export interface GOWorkflow {
  id: string;           // WF-01 → WF-20
  name: string;
  division: GODivision;
  description: string;
  triggerType: 'schedule' | 'event' | 'manual' | 'webhook';
  schedule?: string;    // cron expression if schedule-triggered
  steps: WorkflowStep[];
  status: WorkflowStatus;
  lastRun: string;
  totalRuns: number;
  successRate: number;  // 0–1
  avgDurationMs: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'parallel' | 'approval';
  dependsOn: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
}

// ─── Fleet Status ────────────────────────────────────────────────────────────

export interface GOFleetStatus {
  divisions: GODivisionInfo[];
  models: { total: number; active: number; byFamily: Record<GOModelFamily, number> };
  mcpServers: { total: number; running: number; byStatus: Record<MCPServerStatus, number> };
  scrapers: { total: number; active: number; byCategory: Record<ScraperCategory, number> };
  workflows: { total: number; active: number; byStatus: Record<WorkflowStatus, number> };
  timestamp: string;
}

export interface GODivisionInfo {
  id: GODivision;
  name: string;
  modelCount: number;
  mcpServerCount: number;
  scraperCount: number;
  workflowCount: number;
  health: 'healthy' | 'degraded' | 'critical';
}

// ─── Query Types ─────────────────────────────────────────────────────────────

export interface GOQuery {
  type: 'models' | 'mcpServers' | 'scrapers' | 'workflows' | 'divisions' | 'all';
  division?: GODivision;
  family?: GOModelFamily;
  category?: ScraperCategory;
  status?: string;
  limit?: number;
}
