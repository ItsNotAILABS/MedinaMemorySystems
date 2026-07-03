/**
 * Tests for appBuilderEngine.ts
 */

let builder: typeof import('@/lib/appBuilderEngine');

beforeEach(() => {
  jest.resetModules();
  builder = require('@/lib/appBuilderEngine');
});

describe('Company App Builder Engine', () => {
  it('should expose manifest', () => {
    expect(builder.APP_BUILDER_MANIFEST.name).toBe('Medina Company App Builder');
    expect(builder.APP_BUILDER_MANIFEST.tokenStandards).toContain('ICRC-1');
  });

  it('should create and list projects', () => {
    const p = builder.createProject({ name: 'TestSaaS', backend: 'python' });
    expect(p.status).toBe('draft');
    expect(builder.listProjects().some((x) => x.id === p.id)).toBe(true);
  });

  it('should scaffold with generated files', () => {
    const p = builder.createProject({ name: 'CrudApp', backend: 'motoko', tier: 'pro', proStack: 'node' });
    const scaffolded = builder.scaffold(p.id);
    expect(scaffolded?.status).toBe('scaffolded');
    expect(scaffolded?.artifacts.length).toBeGreaterThan(0);
    const files = scaffolded?.artifacts[0]?.files ?? [];
    expect(files.some((f) => f.path.includes('.mo'))).toBe(true);
  });

  it('should build wasm capsules', () => {
    const p = builder.createProject({ name: 'CapsuleApp', backend: 'rust' });
    builder.scaffold(p.id);
    const built = builder.buildCapsules(p.id);
    expect(built?.capsules.length).toBeGreaterThanOrEqual(2);
    expect(built?.status).toBe('built');
  });

  it('should create token artifacts', () => {
    const p = builder.createProject({ name: 'TokenApp', backend: 'python' });
    const updated = builder.createProjectToken(p.id, {
      name: 'Medina Token',
      symbol: 'MED',
      decimals: 8,
      initialSupply: '1000000',
      standard: 'ICRC-1',
      mintable: true,
    });
    expect(updated?.token?.symbol).toBe('MED');
    expect(updated?.artifacts.some((a) => a.kind === 'token-canister')).toBe(true);
  });

  it('should deploy to saas and icp targets', () => {
    const p = builder.createProject({ name: 'DeployApp', backend: 'python', deployTarget: 'saas-vercel' });
    builder.scaffold(p.id);
    const d = builder.deploy(p.id);
    expect(d?.status).toBe('live');
    expect(d?.url).toContain('vercel.app');

    const p2 = builder.createProject({ name: 'ChainApp', backend: 'motoko', deployTarget: 'icp-mainnet' });
    const d2 = builder.deploy(p2.id, 'icp-mainnet');
    expect(d2?.canisterIds).toBeDefined();
  });

  it('should include hidden company vault modules', () => {
    const vault = builder.getCompanyVault();
    expect(vault.length).toBeGreaterThan(0);
    expect(vault.every((m) => m.internalOnly === true || m.importPath)).toBe(true);
  });

  it('should ai-assist with hybrid mode', () => {
    const p = builder.createProject({ name: 'AIApp', aiMode: 'hybrid' });
    const result = builder.aiAssist(p.id, 'build user crud app');
    expect(result?.mode).toBe('hybrid');
    expect(result?.suggestions.length).toBeGreaterThan(0);
  });
});
