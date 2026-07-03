/**
 * Company App Builder — type system
 * Capsules · WASM · multi-stack scaffolds · blockchain · SaaS deploy
 */

export type StackTier = 'standard' | 'pro';

export type BackendStack = 'motoko' | 'rust' | 'python';
export type FrontendStack = 'react' | 'html';
export type ProStack = 'node' | 'java';

export type AIMode = 'local' | 'cloud' | 'hybrid';

export type DeployTarget =
  | 'saas-vercel'
  | 'saas-cloudflare'
  | 'docker'
  | 'icp-mainnet'
  | 'icp-local'
  | 'wasm-edge'
  | 'blockchain-evm'
  | 'artifact-export';

export type CapsuleKind = 'wasm-module' | 'canister' | 'worker' | 'sovereign-bundle';

export type ArtifactKind =
  | 'source-bundle'
  | 'design-tokens'
  | 'ui-spec'
  | 'candid'
  | 'token-canister'
  | 'deployment-manifest'
  | 'saas-config';

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

export interface AppProject {
  id: string;
  name: string;
  description: string;
  companyId: string;
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
  deployedAt: string;
}

export interface AIBuildAssistResult {
  mode: AIMode;
  modelUsed: string;
  suggestions: string[];
  inferredEntities?: CrudEntity[];
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
