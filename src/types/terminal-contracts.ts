export type ProtocolVersion = `${number}.${number}.${number}`;

export type TerminalCapability =
  | 'command-execution'
  | 'command-routing'
  | 'health-check'
  | 'lifecycle-control'
  | 'session-management'
  | 'streaming-output'
  | 'governance-audit';

export type TerminalLifecycleState =
  | 'registered'
  | 'created'
  | 'activating'
  | 'active'
  | 'deactivated'
  | 'degraded'
  | 'offline'
  | 'error';

export interface TerminalProtocolDescriptor {
  terminalId: string;
  protocolName: string;
  protocolVersion: ProtocolVersion;
  apiVersion: string;
  capabilities: TerminalCapability[];
}

export interface TerminalCompatibilityContract {
  minimumProtocolVersion: ProtocolVersion;
  compatibleApiVersions: string[];
  requiredCapabilities: TerminalCapability[];
  deprecatedApiVersions?: string[];
}

export interface TerminalNegotiationRequest {
  terminalId: string;
  requestedApiVersion: string;
  requestedCapabilities: TerminalCapability[];
  clientProtocolVersion: ProtocolVersion;
}

export interface TerminalNegotiationResult {
  compatible: boolean;
  agreedApiVersion: string;
  enabledCapabilities: TerminalCapability[];
  reasons: string[];
}

export interface SubTerminalSession {
  sessionId: string;
  terminalId: string;
  createdAt: string;
  activatedAt?: string;
  deactivatedAt?: string;
  state: TerminalLifecycleState;
  lastCommandAt?: string;
  commandCount: number;
  negotiatedApiVersion?: string;
  enabledCapabilities: TerminalCapability[];
}
