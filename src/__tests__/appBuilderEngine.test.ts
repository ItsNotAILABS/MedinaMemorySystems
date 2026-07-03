/**
 * Tests for appBuilderEngine, template library, deploy CLI
 */

let builder: typeof import('@/lib/appBuilderEngine');
let templates: typeof import('@/lib/templateLibrary');
let deployCli: typeof import('@/lib/deployCli');

beforeEach(() => {
  jest.resetModules();
  builder = require('@/lib/appBuilderEngine');
  templates = require('@/lib/templateLibrary');
  deployCli = require('@/lib/deployCli');
});

describe('Template Library', () => {
  it('should have 16+ built-in templates', () => {
    expect(templates.listTemplates().length).toBeGreaterThanOrEqual(16);
  });

  it('should include popular templates', () => {
    const popular = templates.listTemplates({ popular: true });
    expect(popular.length).toBeGreaterThan(0);
    expect(popular.some((t) => t.id === 'saas-crud-python')).toBe(true);
  });

  it('should apply template to project config', () => {
    const applied = templates.applyTemplate('token-launcher-icp', { name: 'MyToken' });
    expect(applied?.backend).toBe('motoko');
    expect(applied?.name).toBe('MyToken');
    expect(applied?.tokenDefault ?? applied?.deployTarget).toBeDefined();
  });
});

describe('Deploy CLI', () => {
  it('should list 18 deploy targets', () => {
    expect(deployCli.listDeployTargets().length).toBeGreaterThanOrEqual(18);
  });

  it('should generate ICP deploy plan with dfx scripts', () => {
    const p = builder.createProject({ name: 'ICPApp', templateId: 'saas-crud-motoko' });
    const plan = deployCli.buildDeployPlan(p, 'icp-local');
    expect(plan.cliCommand).toContain('medina-deploy icp');
    expect(plan.scripts.some((s) => s.name === 'dfx.json')).toBe(true);
    expect(plan.scripts.some((s) => s.name.includes('deploy-icp'))).toBe(true);
  });

  it('should generate Vercel deploy plan', () => {
    const p = builder.createProject({ name: 'SaaSApp', backend: 'python' });
    const plan = deployCli.buildDeployPlan(p, 'saas-vercel');
    expect(plan.steps).toContain('vercel --prod');
  });
});

describe('Company App Builder Engine v2', () => {
  it('should expose manifest with templates and CLI', () => {
    const m = builder.APP_BUILDER_MANIFEST;
    expect(m.version).toBe('2.1.0');
    expect(m.templates).toBeGreaterThanOrEqual(16);
    expect(m.deployTargets).toBeGreaterThanOrEqual(18);
    expect(m.cli).toContain('medina-deploy');
  });

  it('should create project from template', () => {
    const p = builder.createProject({ name: 'Shop', templateId: 'marketplace-python' });
    expect(p.templateId).toBe('marketplace-python');
    expect(p.entities.length).toBeGreaterThan(1);
  });

  it('should scaffold with generated files', () => {
    const p = builder.createProject({ name: 'CrudApp', backend: 'motoko', tier: 'pro', proStack: 'node' });
    const scaffolded = builder.scaffold(p.id);
    expect(scaffolded?.status).toBe('scaffolded');
    expect(scaffolded?.artifacts[0]?.files.some((f) => f.path.includes('.mo'))).toBe(true);
  });

  it('should attach deploy scripts on deploy', () => {
    const p = builder.createProject({ name: 'DeployApp', backend: 'python', deployTarget: 'icp-local' });
    builder.scaffold(p.id);
    const result = builder.deploy(p.id, 'icp-local');
    expect(result?.cliCommand).toContain('medina-deploy');
    expect(result?.deployPlan?.scripts.length).toBeGreaterThan(0);
    const updated = builder.getProject(p.id);
    expect(updated?.artifacts.some((a) => a.kind === 'deploy-scripts')).toBe(true);
  });

  it('should create token artifacts', () => {
    const p = builder.createProject({ name: 'TokenApp', templateId: 'token-launcher-icp' });
    expect(p.token?.standard).toBe('ICRC-1');
  });

  it('should ai-assist with ULRI and deploy recommendation', () => {
    const p = builder.createProject({ name: 'AIApp', aiMode: 'hybrid' });
    const result = builder.aiAssist(p.id, 'launch token on icp mainnet');
    expect(result?.ulriPrimary).toBeDefined();
    expect(result?.deployRecommendation).toMatch(/icp/);
    expect(result?.suggestions.length).toBeGreaterThan(0);
  });

  it('should export runnable project files to disk', () => {
    const fs = require('fs');
    const path = require('path');
    const p = builder.createProject({ name: 'DiskApp', backend: 'python', deployTarget: 'saas-vercel' });
    const result = builder.exportProjectToDisk(p.id, path.join(process.cwd(), 'generated-test'));
    expect(result?.ok).toBe(true);
    expect(result?.fileCount).toBeGreaterThan(5);
    expect(fs.existsSync(path.join(result!.outputDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(result!.outputDir, 'src/app/page.tsx'))).toBe(true);
    fs.rmSync(path.join(process.cwd(), 'generated-test'), { recursive: true, force: true });
  });
});
