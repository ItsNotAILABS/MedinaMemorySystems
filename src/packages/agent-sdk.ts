import {
  buildTerminalProtocolDescriptor,
  negotiateTerminalProtocol,
  TERMINAL_API_VERSION,
  TERMINAL_PROTOCOL_VERSION,
} from '@/lib/terminalProtocol';
import type {
  TerminalCapability,
  TerminalCompatibilityContract,
} from '@/types/terminal-contracts';
import { TeamVaultSDK, createTeamVaultSDK } from './team-vault-sdk';

export type AgentAutonomy = 'observe' | 'recommend' | 'act' | 'sovereign';

export interface AgentCapability {
  name: string;
  description: string;
  requiredTerminalCapabilities: TerminalCapability[];
}

export interface AgentTaskRequest {
  instruction: string;
  persistResult?: boolean;
  tags?: string[];
}

export interface AgentTaskResult {
  accepted: boolean;
  summary: string;
  storedMemoryId?: string;
}

export interface AgentSDKConfig {
  agentId: string;
  autonomy: AgentAutonomy;
  principal?: string;
}

const DEFAULT_COMPATIBILITY_CONTRACT: TerminalCompatibilityContract = {
  minimumProtocolVersion: '1.0.0',
  compatibleApiVersions: ['v1'],
  requiredCapabilities: ['command-execution', 'lifecycle-control'],
};

export class SovereignAgentSDK {
  readonly agentId: string;
  readonly autonomy: AgentAutonomy;
  readonly vault: TeamVaultSDK;

  constructor(config: AgentSDKConfig) {
    this.agentId = config.agentId;
    this.autonomy = config.autonomy;
    this.vault = createTeamVaultSDK(config.principal ?? 'Sovereign');
  }

  negotiateTerminal(
    terminalId: string,
    requestedCapabilities: TerminalCapability[],
    contract = DEFAULT_COMPATIBILITY_CONTRACT,
  ) {
    return negotiateTerminalProtocol(
      buildTerminalProtocolDescriptor(terminalId),
      contract,
      {
        terminalId,
        requestedApiVersion: TERMINAL_API_VERSION,
        requestedCapabilities,
        clientProtocolVersion: TERMINAL_PROTOCOL_VERSION,
      },
    );
  }

  executeTask(request: AgentTaskRequest): AgentTaskResult {
    if (this.autonomy === 'observe') {
      return {
        accepted: false,
        summary: 'Agent autonomy is observe-only; execution was not permitted.',
      };
    }

    const summary = `[${this.agentId}] ${request.instruction}`.slice(0, 500);
    if (!request.persistResult) {
      return { accepted: true, summary };
    }

    const entry = this.vault.storeMemory({
      content: summary,
      type: 'semantic',
      tags: ['agent-sdk', this.agentId, ...(request.tags ?? [])],
    });

    return {
      accepted: true,
      summary,
      storedMemoryId: entry.id,
    };
  }

  governanceSafeProposal(title: string, description: string) {
    if (this.autonomy === 'observe') {
      throw new Error('Observe-only agents cannot propose governance changes.');
    }
    return this.vault.proposeGovernanceChange(title, description, ['A']);
  }
}

export function createSovereignAgentSDK(config: AgentSDKConfig): SovereignAgentSDK {
  return new SovereignAgentSDK(config);
}

export const PACKAGE_MANIFEST = {
  name: '@medina/agent-sdk',
  version: '1.0.0',
  terminal: '/agents/contracts',
  description: 'Agent-focused SDK for terminal negotiation, safe execution, and team vault integration.',
  exports: ['SovereignAgentSDK', 'createSovereignAgentSDK'],
  compatibilityContract: DEFAULT_COMPATIBILITY_CONTRACT,
};
