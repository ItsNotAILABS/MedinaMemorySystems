import { createTeamVaultSDK } from '@/packages/team-vault-sdk';

describe('TeamVaultSDK', () => {
  it('stores and retrieves memory entries for a sovereign principal', () => {
    const sdk = createTeamVaultSDK('Sovereign');
    const entry = sdk.storeMemory({
      content: 'team vault sdk test memory',
      tags: ['team-vault-sdk-test'],
    });

    const retrieved = sdk.retrieveMemory(entry.id);
    expect(retrieved?.id).toBe(entry.id);

    const search = sdk.searchMemory('team vault sdk test memory', 5);
    expect(search.entries.some((item) => item.id === entry.id)).toBe(true);
  });

  it('enforces permission boundaries for non-sovereign principals', () => {
    const sdk = createTeamVaultSDK('Public');
    expect(() =>
      sdk.storeMemory({ content: 'should fail for public write' }),
    ).toThrow(/Permission denied/);
  });

  it('supports governance and replay flows through the SDK', () => {
    const sdk = createTeamVaultSDK('Sovereign');
    sdk.grantTeamPermission('governance:vote', 'Sovereign');

    const proposal = sdk.proposeGovernanceChange(
      'Team Vault Governance Proposal',
      'Validate governance wiring for team vault sdk',
      ['A'],
    );
    const opened = sdk.openGovernanceProposal(proposal.id);
    expect(opened?.status).toBe('open');

    const voted = sdk.voteGovernanceProposal(proposal.id, 'for');
    expect(voted?.votes.for).toBeGreaterThan(0);

    const replay = sdk.startReplay('Team Vault Replay Session');
    expect(replay.status).toBe('recording');
    const stopped = sdk.stopReplay();
    expect(stopped?.status).toBe('complete');
  });
});
