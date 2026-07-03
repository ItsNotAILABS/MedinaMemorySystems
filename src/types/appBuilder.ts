/**
 * App Builder — type system
 * Capsules · WASM · templates · medina-deploy CLI · multi-platform deploy
 */

export type StackTier = 'standard' | 'pro';

export type BackendStack = 'motoko' | 'rust' | 'python';
export type FrontendStack = 'react' | 'html';
export type ProStack = 'node' | 'java';

export type AIMode = 'local' | 'cloud' | 'hybrid';

export type TemplateCategory =
  | 'saas'
  | 'icp'
  | 'crypto'
  | 'enterprise'
  | 'api'
  | 'marketing'
  | 'internal'
  | 'medina-native';

export type DeployTarget =
  | 'saas-vercel'
  | 'saas-cloudflare'
  | 'saas-netlify'
  | 'saas-railway'
  | 'saas-flyio'
  | 'saas-render'
  | 'saas-shopify-hydrogen'
  | 'github-pages'
  | 'aws-amplify'
  | 'supabase'
  | 'docker'
  | 'kubernetes'
  | 'icp-mainnet'
  | 'icp-local'
  | 'wasm-edge'
  | 'blockchain-evm'
  | 'blockchain-base'
  | 'blockchain-solana'
  | 'artifact-export';

export type CapsuleKind = 'wasm-module' | 'canister' | 'worker' | 'sovereign-bundle';

export type ArtifactKind =
  | 'source-bundle'
  | 'design-tokens'
  | 'ui-spec'
  | 'candid'
  | 'token-canister'
  | 'deployment-manifest'
  | 'saas-config'
  | 'deploy-scripts';

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  internal?: boolean;
}

export interface CompanyVaultModule {
  id: string;
  name: string;
  importPath: string;
  description: string;
  internalOnly: boolean;
  stacks: (BackendStack | FrontendStack | ProStack)[];
}

export interface CapsuleManifest {
  id: string;
  name: string;
  version: string;
  kind: CapsuleKind;
  wasmHash?: string;
  candidPath?: string;
  exports: string[];
  imports: string[];
  companyVaultRefs: string[];
  createdAt: string;
}

export interface DesignSpec {
  theme: 'dark' | 'light' | 'medina';
  primaryColor: string;
  fontFamily: string;
  layout: 'dashboard' | 'landing' | 'crud-admin';
  components: string[];
}

export interface TokenSpec {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  standard: 'ICRC-1' | 'ICRC-7' | 'ERC-20';
  mintable: boolean;
  description?: string;
}

export interface AppTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tier: StackTier;
  backend: BackendStack;
  frontend: FrontendStack;
  proStack?: ProStack;
  deployTargets: DeployTarget[];
  entities: CrudEntity[];
  design: DesignSpec;
  medinaFeatures: string[];
  tokenDefault?: Partial<TokenSpec>;
  popular?: boolean;
}

export interface DeployCliScript {
  name: string;
  platform: 'unix' | 'windows' | 'all';
  content: string;
}

export interface DeployPlan {
  target: DeployTarget;
  projectId: string;
  projectName: string;
  status: 'ready' | 'running' | 'done' | 'failed';
  prerequisites: string[];
  steps: string[];
  cliCommand: string;
  scripts: DeployCliScript[];
  envVars?: string[];
  docsUrl?: string;
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  companyId: string;
  templateId?: string;
  tier: StackTier;
  backend: BackendStack;
  frontend: FrontendStack;
  proStack?: ProStack;
  aiMode: AIMode;
  entities: CrudEntity[];
  design: DesignSpec;
  capsules: CapsuleManifest[];
  artifacts: BuildArtifact[];
  deployTarget: DeployTarget;
  deployPlans?: DeployPlan[];
  token?: TokenSpec;
  status: 'draft' | 'scaffolded' | 'built' | 'deployed';
  createdAt: string;
  updatedAt: string;
}

export interface CrudEntity {
  name: string;
  fields: { name: string; type: 'string' | 'number' | 'boolean' | 'text' | 'timestamp'; required?: boolean }[];
}

export interface BuildArtifact {
  id: string;
  kind: ArtifactKind;
  name: string;
  files: GeneratedFile[];
  createdAt: string;
}

export interface DeployResult {
  id: string;
  projectId: string;
  target: DeployTarget;
  url?: string;
  canisterIds?: Record<string, string>;
  txHash?: string;
  status: 'pending' | 'live' | 'failed';
  message: string;
  cliCommand?: string;
  deployPlan?: DeployPlan;
  deployedAt: string;
}

export interface AIBuildAssistResult {
  mode: AIMode;
  modelUsed: string;
  suggestions: string[];
  inferredEntities?: CrudEntity[];
  ulriPrimary?: string;
  memoryStored?: boolean;
  deployRecommendation?: DeployTarget;
}

export const STANDARD_STACKS: { backend: BackendStack; label: string; pct: string }[] = [
  { backend: 'motoko', label: 'Motoko (ICP Canister)', pct: '70%' },
  { backend: 'rust', label: 'Rust (Axum / IC CDK)', pct: '70%' },
  { backend: 'python', label: 'Python (FastAPI CRUD)', pct: '70%' },
];

export const PRO_STACKS: { stack: ProStack | FrontendStack; label: string }[] = [
  { stack: 'react', label: 'React / Next.js UI' },
  { stack: 'html', label: 'HTML + Tailwind UI' },
  { stack: 'node', label: 'Node.js / Express API' },
  { stack: 'java', label: 'Java Spring Boot' },
];
