import type {
  TerminalCapability,
  TerminalCompatibilityContract,
  TerminalNegotiationRequest,
  TerminalNegotiationResult,
  TerminalProtocolDescriptor,
} from '@/types/terminal-contracts';

export const TERMINAL_PROTOCOL_VERSION = '1.0.0' as const;
export const TERMINAL_API_VERSION = 'v1' as const;

export const DEFAULT_TERMINAL_CAPABILITIES: TerminalCapability[] = [
  'command-execution',
  'command-routing',
  'health-check',
  'lifecycle-control',
  'session-management',
];

function parseVersion(version: string): [number, number, number] {
  const [major = '0', minor = '0', patch = '0'] = version.split('.');
  return [Number(major), Number(minor), Number(patch)];
}

export function compareVersions(a: string, b: string): number {
  const left = parseVersion(a);
  const right = parseVersion(b);
  for (let i = 0; i < 3; i++) {
    if (left[i] > right[i]) return 1;
    if (left[i] < right[i]) return -1;
  }
  return 0;
}

export function buildTerminalProtocolDescriptor(
  terminalId: string,
  capabilities: TerminalCapability[] = DEFAULT_TERMINAL_CAPABILITIES,
): TerminalProtocolDescriptor {
  return {
    terminalId,
    protocolName: 'MEDINA_TERMINAL_PROTOCOL',
    protocolVersion: TERMINAL_PROTOCOL_VERSION,
    apiVersion: TERMINAL_API_VERSION,
    capabilities,
  };
}

export function negotiateTerminalProtocol(
  descriptor: TerminalProtocolDescriptor,
  contract: TerminalCompatibilityContract,
  request: TerminalNegotiationRequest,
): TerminalNegotiationResult {
  const reasons: string[] = [];

  if (compareVersions(request.clientProtocolVersion, contract.minimumProtocolVersion) < 0) {
    reasons.push(
      `Client protocol ${request.clientProtocolVersion} is below minimum ${contract.minimumProtocolVersion}.`,
    );
  }

  if (!contract.compatibleApiVersions.includes(request.requestedApiVersion)) {
    reasons.push(
      `Requested API ${request.requestedApiVersion} is not compatible with ${contract.compatibleApiVersions.join(', ')}.`,
    );
  }

  const missingRequired = contract.requiredCapabilities.filter(
    (capability) => !descriptor.capabilities.includes(capability),
  );
  if (missingRequired.length > 0) {
    reasons.push(`Terminal missing required capabilities: ${missingRequired.join(', ')}.`);
  }

  const enabledCapabilities = request.requestedCapabilities.filter(
    (capability) => descriptor.capabilities.includes(capability),
  );

  if (enabledCapabilities.length === 0) {
    reasons.push('No requested capabilities could be enabled.');
  }

  const compatible = reasons.length === 0;
  return {
    compatible,
    agreedApiVersion: compatible ? request.requestedApiVersion : descriptor.apiVersion,
    enabledCapabilities,
    reasons,
  };
}

export function determineTerminalHealth(
  lastHeartbeat: number,
  now = Date.now(),
): 'ONLINE' | 'DEGRADED' | 'OFFLINE' {
  const delta = Math.max(0, now - lastHeartbeat);
  if (delta <= 120_000) return 'ONLINE';
  if (delta <= 300_000) return 'DEGRADED';
  return 'OFFLINE';
}
