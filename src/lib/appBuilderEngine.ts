/**
 * Company App Builder Engine
 * Templates · medina-deploy CLI · multi-platform · MEDINA inner AI
 */

import { sovereignId } from '@/lib/sovereign-id';
import { buildSovereignBundle, buildWasmCapsule } from '@/lib/capsuleRegistry';
import { createTokenArtifacts } from '@/lib/tokenFactory';
import { scaffoldProject } from '@/lib/stackTemplates';
import { COMPANY_VAULT, vaultModulesForStack } from '@/lib/companyVault';
import { applyTemplate, getTemplate, listTemplates, templateCategories } from '@/lib/templateLibrary';
import { buildDeployPlan, listDeployTargets, MEDINA_DEPLOY_VERSION } from '@/lib/deployCli';
import { builderAIAssist, listAIContext } from '@/lib/builderAI';
import type {
  AIMode,
  AppProject,
  AIBuildAssistResult,
  BuildArtifact,
  CrudEntity,
  DeployPlan,
  DeployResult,
  DeployTarget,
  DesignSpec,
  GeneratedFile,
  StackTier,
  TokenSpec,
} from '@/types/appBuilder';

const projects: Map<string, AppProject> = new Map();
const deployHistory: DeployResult[] = [];

const DEFAULT_DESIGN: DesignSpec = {
  theme: 'medina',
  primaryColor: '#6366f1',
  fontFamily: 'Inter, system-ui, sans-serif',
  layout: 'crud-admin',
  components: ['DataTable', 'Form', 'Nav', 'Toast'],
};

export function listProjects(): AppProject[] {
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getProject(id: string): AppProject | undefined {
  return projects.get(id);
}

export function createProject(input: {
  name: string;
  description?: string;
  companyId?: string;
  templateId?: string;
  tier?: StackTier;
  backend?: AppProject['backend'];
  frontend?: AppProject['frontend'];
  proStack?: AppProject['proStack'];
  aiMode?: AIMode;
  deployTarget?: DeployTarget;
  entities?: CrudEntity[];
}): AppProject {
  const fromTemplate = input.templateId ? applyTemplate(input.templateId, { name: input.name }) : undefined;
  const template = input.templateId ? getTemplate(input.templateId) : undefined;
  const now = new Date().toISOString();

  const project: AppProject = {
    id: sovereignId(),
    name: fromTemplate?.name ?? input.name,
    description: fromTemplate?.description ?? input.description ?? '',
    companyId: input.companyId ?? 'default',
    templateId: input.templateId,
    tier: fromTemplate?.tier ?? input.tier ?? 'standard',
    backend: fromTemplate?.backend ?? input.backend ?? 'python',
    frontend: fromTemplate?.frontend ?? input.frontend ?? 'react',
    proStack: fromTemplate?.proStack ?? (input.tier === 'pro' ? input.proStack ?? 'node' : undefined),
    aiMode: input.aiMode ?? 'hybrid',
    entities: fromTemplate?.entities ?? input.entities ?? [{ name: 'Record', fields: [{ name: 'title', type: 'string', required: true }] }],
    design: fromTemplate?.design ?? { ...DEFAULT_DESIGN },
    capsules: [],
    artifacts: [],
    deployTarget: fromTemplate?.deployTarget ?? input.deployTarget ?? 'saas-vercel',
    deployPlans: [],
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  if (template?.tokenDefault && !project.token) {
    project.token = {
      name: `${project.name} Token`,
      symbol: template.tokenDefault.symbol ?? 'TKN',
      decimals: template.tokenDefault.decimals ?? 8,
      initialSupply: template.tokenDefault.initialSupply ?? '1000000000',
      standard: template.tokenDefault.standard ?? 'ICRC-1',
      mintable: true,
    };
  }

  projects.set(project.id, project);
  return project;
}

export function updateProjectDesign(id: string, design: Partial<DesignSpec>): AppProject | undefined {
  const p = projects.get(id);
  if (!p) return undefined;
  p.design = { ...p.design, ...design };
  p.updatedAt = new Date().toISOString();
  return p;
}

export function aiAssist(projectId: string, prompt: string): AIBuildAssistResult | undefined {
  const project = projects.get(projectId);
  if (!project) return undefined;
  return builderAIAssist(project, prompt);
}

export function scaffold(id: string): AppProject | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  const files = scaffoldProject(project);
  const sourceArtifact: BuildArtifact = {
    id: sovereignId(),
    kind: 'source-bundle',
    name: `${project.name}-scaffold`,
    files,
    createdAt: new Date().toISOString(),
  };

  project.artifacts.push(sourceArtifact);
  project.status = 'scaffolded';
  project.updatedAt = new Date().toISOString();
  return project;
}

export function buildCapsules(id: string): AppProject | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  if (!project.artifacts.find((a) => a.kind === 'source-bundle')) scaffold(id);

  const files = project.artifacts.find((a) => a.kind === 'source-bundle')?.files ?? [];
  const { capsule, wasmBundle } = buildWasmCapsule(project.name, files);
  const sovereign = buildSovereignBundle(project.name, files);

  project.capsules.push(capsule, sovereign);
  project.artifacts.push({
    id: sovereignId(),
    kind: 'deployment-manifest',
    name: `${project.name}-wasm-capsule`,
    files: [wasmBundle],
    createdAt: new Date().toISOString(),
  });
  project.status = 'built';
  project.updatedAt = new Date().toISOString();
  return project;
}

export function createProjectToken(id: string, spec: TokenSpec): AppProject | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  const { files, tokenId } = createTokenArtifacts(spec);
  project.token = spec;
  project.artifacts.push({
    id: tokenId,
    kind: 'token-canister',
    name: `${spec.symbol}-token`,
    files,
    createdAt: new Date().toISOString(),
  });
  project.updatedAt = new Date().toISOString();
  return project;
}

export function getDeployPlan(id: string, target?: DeployTarget): DeployPlan | undefined {
  const project = projects.get(id);
  if (!project) return undefined;
  const t = target ?? project.deployTarget;
  return buildDeployPlan(project, t);
}

export function attachDeployScripts(id: string, target?: DeployTarget): AppProject | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  const plan = buildDeployPlan(project, target ?? project.deployTarget);
  project.deployPlans = project.deployPlans ?? [];
  project.deployPlans.push(plan);

  if (plan.scripts.length > 0) {
    project.artifacts.push({
      id: sovereignId(),
      kind: 'deploy-scripts',
      name: `deploy-${plan.target}`,
      files: plan.scripts.map((s) => ({
        path: `deploy/${s.name}`,
        content: s.content,
        language: s.name.endsWith('.json') ? 'json' : s.name.endsWith('.yaml') ? 'yaml' : 'shell',
      })),
      createdAt: new Date().toISOString(),
    });
  }

  project.updatedAt = new Date().toISOString();
  return project;
}

export function deploy(id: string, target?: DeployTarget): DeployResult | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  const deployTarget = target ?? project.deployTarget;
  const plan = buildDeployPlan(project, deployTarget);
  attachDeployScripts(id, deployTarget);

  const slug = project.name.toLowerCase().replace(/\W/g, '-');
  const result: DeployResult = {
    id: sovereignId(),
    projectId: id,
    target: deployTarget,
    status: 'live',
    message: '',
    cliCommand: plan.cliCommand,
    deployPlan: plan,
    deployedAt: new Date().toISOString(),
  };

  switch (deployTarget) {
    case 'saas-vercel':
      result.url = `https://${slug}.vercel.app`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'saas-cloudflare':
      result.url = `https://${slug}.workers.dev`;
      result.message = `Ready — run: wrangler deploy (see deploy/ scripts)`;
      break;
    case 'saas-netlify':
      result.url = `https://${slug}.netlify.app`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'saas-railway':
      result.url = `https://${slug}.up.railway.app`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'saas-flyio':
      result.url = `https://${slug}.fly.dev`;
      result.message = `Ready — run: fly deploy`;
      break;
    case 'saas-render':
      result.url = `https://${slug}.onrender.com`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'github-pages':
      result.url = `https://your-org.github.io/${slug}`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'aws-amplify':
      result.url = `https://${slug}.amplifyapp.com`;
      result.message = `Ready — run: amplify publish`;
      break;
    case 'supabase':
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'icp-mainnet':
    case 'icp-local': {
      const network = deployTarget === 'icp-local' ? 'local' : 'ic';
      result.canisterIds = {
        backend: `${slug.replace(/-/g, '_')} (run dfx deploy)`,
        assets: `${slug.replace(/-/g, '_')}_assets`,
        ...(project.token ? { token: `${slug.replace(/-/g, '_')}_token` } : {}),
      };
      result.message = `ICP deploy plan ready — run: medina-deploy icp --network ${network}\nOr: dfx deploy (see deploy/dfx.json)`;
      break;
    }
    case 'wasm-edge':
      result.url = `wasm://${slug}/capsule/${project.capsules[0]?.id ?? 'build-first'}`;
      result.message = `Ready — run: ${plan.cliCommand}`;
      break;
    case 'blockchain-evm':
    case 'blockchain-base':
      result.txHash = `(pending — run ${plan.cliCommand})`;
      result.message = `EVM deploy scripts in deploy/ folder`;
      break;
    case 'blockchain-solana':
      result.message = `Ready — run: anchor deploy`;
      break;
    case 'docker':
      result.url = `http://localhost:3000`;
      result.message = `Ready — run: docker compose up`;
      break;
    case 'kubernetes':
      result.message = `Ready — run: kubectl apply -f deploy/k8s/`;
      break;
    case 'artifact-export':
      result.message = `Exported ${project.artifacts.length} artifacts — run: ${plan.cliCommand}`;
      break;
    default:
      result.status = 'failed';
      result.message = 'Unknown deploy target';
  }

  if (result.status === 'live') {
    project.status = 'deployed';
    project.deployTarget = deployTarget;
    project.updatedAt = new Date().toISOString();
  }

  deployHistory.push(result);
  return result;
}

export function listDeployHistory(projectId?: string): DeployResult[] {
  return projectId ? deployHistory.filter((d) => d.projectId === projectId) : [...deployHistory];
}

export function exportProjectBundle(id: string): GeneratedFile[] | undefined {
  const project = projects.get(id);
  if (!project) return undefined;
  return project.artifacts.flatMap((a) => a.files);
}

export function getCompanyVault() {
  return COMPANY_VAULT.map((m) => ({
    ...m,
    importPath: m.internalOnly ? '[hidden]' : m.importPath,
  }));
}

export {
  listTemplates,
  getTemplate,
  templateCategories,
  listDeployTargets,
  listAIContext,
};

export const APP_BUILDER_MANIFEST = {
  name: 'Medina Company App Builder',
  version: '2.0.0',
  cli: `medina-deploy v${MEDINA_DEPLOY_VERSION}`,
  templates: listTemplates().length,
  deployTargets: listDeployTargets().length,
  stacks: { standard: ['motoko', 'rust', 'python'], pro: ['react', 'html', 'node', 'java'] },
  aiModes: ['local', 'cloud', 'hybrid'],
  tokenStandards: ['ICRC-1', 'ICRC-7', 'ERC-20'],
  medinaAI: listAIContext(),
} as const;
