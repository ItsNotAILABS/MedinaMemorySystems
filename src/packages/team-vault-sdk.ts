import {
  getMemory,
  pinMemory as pinMemoryEntry,
  queryMemory,
  storeMemory as storeMemoryEntry,
  unpinMemory as unpinMemoryEntry,
} from '@/lib/memoryEngine';
import {
  checkPermission,
  grantPermission,
  listPermissions,
} from '@/lib/permissionsManager';
import {
  createProposal,
  enactProposal,
  getGovernanceStats,
  listProposals,
  openProposal,
  voteOnProposal,
} from '@/lib/governanceEngine';
import {
  getReplayStats,
  listSessions as listReplaySessions,
  startReplaySession,
  stopReplaySession,
} from '@/lib/replayEngine';
import type { GateId, MemoryType, PermissionScope, SpatialCoordinate } from '@/types';

export const TEAM_VAULT_SDK_VERSION = '1.0.0';

export interface TeamVaultSDKConfig {
  principal: string;
  apiVersion?: 'v1';
}

export interface StoreMemoryInput {
  content: string;
  type?: MemoryType;
  tags?: string[];
  coordinates?: Partial<SpatialCoordinate>;
  parentId?: string;
}

export class TeamVaultSDK {
  readonly principal: string;
  readonly apiVersion: 'v1';

  constructor(config: TeamVaultSDKConfig) {
    this.principal = config.principal;
    this.apiVersion = config.apiVersion ?? 'v1';
  }

  private assertScope(scope: PermissionScope): void {
    if (!checkPermission(scope, this.principal)) {
      throw new Error(`Permission denied for scope "${scope}" and principal "${this.principal}".`);
    }
  }

  storeMemory(input: StoreMemoryInput) {
    this.assertScope('memory:write');
    return storeMemoryEntry(
      input.content,
      input.type ?? 'semantic',
      input.tags ?? [],
      input.coordinates,
      input.parentId,
    );
  }

  retrieveMemory(id: string) {
    this.assertScope('memory:read');
    return getMemory(id);
  }

  searchMemory(query: string, limit = 20) {
    this.assertScope('memory:read');
    return queryMemory({ query, limit });
  }

  pinMemory(id: string) {
    this.assertScope('memory:write');
    return pinMemoryEntry(id);
  }

  unpinMemory(id: string) {
    this.assertScope('memory:write');
    return unpinMemoryEntry(id);
  }

  proposeGovernanceChange(
    title: string,
    description: string,
    affectedGates: GateId[] = [],
  ) {
    this.assertScope('governance:propose');
    return createProposal(title, description, this.principal, affectedGates);
  }

  openGovernanceProposal(proposalId: string) {
    this.assertScope('governance:propose');
    return openProposal(proposalId);
  }

  voteGovernanceProposal(
    proposalId: string,
    vote: 'for' | 'against' | 'abstain',
  ) {
    this.assertScope('governance:vote');
    return voteOnProposal(proposalId, vote, this.principal);
  }

  enactGovernanceProposal(proposalId: string) {
    this.assertScope('governance:enact');
    return enactProposal(proposalId);
  }

  listGovernanceProposals() {
    this.assertScope('governance:read');
    return listProposals();
  }

  governanceStatus() {
    this.assertScope('governance:read');
    return getGovernanceStats();
  }

  grantTeamPermission(scope: PermissionScope, grantee: string) {
    this.assertScope('permissions:manage');
    return grantPermission({ scope, grantedTo: grantee }, this.principal);
  }

  listTeamPermissions() {
    this.assertScope('permissions:manage');
    return listPermissions();
  }

  startReplay(name?: string) {
    this.assertScope('replay:read');
    return startReplaySession(name ?? `Vault Session — ${new Date().toISOString()}`);
  }

  stopReplay() {
    this.assertScope('replay:read');
    return stopReplaySession();
  }

  listReplaySessions() {
    this.assertScope('replay:read');
    return listReplaySessions();
  }

  replayStatus() {
    this.assertScope('replay:read');
    return getReplayStats();
  }
}

export function createTeamVaultSDK(principal = 'Sovereign'): TeamVaultSDK {
  return new TeamVaultSDK({ principal, apiVersion: 'v1' });
}

export const PACKAGE_MANIFEST = {
  name: '@medina/team-vault-sdk',
  version: TEAM_VAULT_SDK_VERSION,
  terminal: '/vault',
  apiVersion: 'v1',
  description: 'Sovereign team vault SDK for memory, governance, permissions, and replay.',
  exports: [
    'TeamVaultSDK',
    'createTeamVaultSDK',
    'TEAM_VAULT_SDK_VERSION',
  ],
  compatibility: {
    policy: 'semver',
    majorUpgradeStrategy: 'backward-compatible within v1 APIs',
  },
};
