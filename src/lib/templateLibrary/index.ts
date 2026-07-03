/**
 * Built-in template library — ready-to-use app blueprints for all user tiers
 */

import type {
  AppTemplate,
  BackendStack,
  CrudEntity,
  DesignSpec,
  DeployTarget,
  StackTier,
  TemplateCategory,
} from '@/types/appBuilder';

const BASE_DESIGN: DesignSpec = {
  theme: 'medina',
  primaryColor: '#6366f1',
  fontFamily: 'Inter, system-ui, sans-serif',
  layout: 'crud-admin',
  components: ['DataTable', 'Form', 'Nav', 'Toast'],
};

export const TEMPLATE_LIBRARY: AppTemplate[] = [
  // ── Standard 70% stacks ─────────────────────────────────────────────────
  {
    id: 'saas-crud-python',
    name: 'SaaS CRUD (Python + React)',
    category: 'saas',
    description: 'FastAPI backend + React admin — the default for 70% of users',
    tier: 'standard',
    backend: 'python',
    frontend: 'react',
    deployTargets: ['saas-vercel', 'saas-railway', 'saas-render', 'docker'],
    entities: [{ name: 'Record', fields: [{ name: 'title', type: 'string', required: true }, { name: 'status', type: 'string' }] }],
    design: { ...BASE_DESIGN, layout: 'crud-admin' },
    medinaFeatures: ['auth', 'memory-bridge'],
    popular: true,
  },
  {
    id: 'saas-crud-motoko',
    name: 'ICP SaaS (Motoko + React)',
    category: 'icp',
    description: 'Motoko canister CRUD + React frontend — deploy to Internet Computer',
    tier: 'standard',
    backend: 'motoko',
    frontend: 'react',
    deployTargets: ['icp-local', 'icp-mainnet', 'wasm-edge'],
    entities: [{ name: 'Item', fields: [{ name: 'title', type: 'string', required: true }] }],
    design: { ...BASE_DESIGN, primaryColor: '#29abe2', layout: 'crud-admin' },
    medinaFeatures: ['auth', 'governance', 'phi-crypto'],
    popular: true,
  },
  {
    id: 'saas-crud-rust',
    name: 'SaaS CRUD (Rust + React)',
    category: 'saas',
    description: 'Axum API + React — high-performance backend',
    tier: 'standard',
    backend: 'rust',
    frontend: 'react',
    deployTargets: ['saas-flyio', 'docker', 'kubernetes'],
    entities: [{ name: 'Resource', fields: [{ name: 'name', type: 'string', required: true }] }],
    design: BASE_DESIGN,
    medinaFeatures: ['auth', 'wasm-cortex'],
  },
  {
    id: 'token-launcher-icp',
    name: 'Token Launcher (ICRC-1)',
    category: 'crypto',
    description: 'Launch ICRC-1 token + admin dashboard on ICP',
    tier: 'standard',
    backend: 'motoko',
    frontend: 'react',
    deployTargets: ['icp-mainnet', 'icp-local'],
    entities: [{ name: 'Holder', fields: [{ name: 'principal', type: 'string', required: true }, { name: 'balance', type: 'number' }] }],
    design: { ...BASE_DESIGN, primaryColor: '#f59e0b', layout: 'dashboard' },
    medinaFeatures: ['phi-crypto', 'governance', 'int-tok'],
    tokenDefault: { symbol: 'TKN', standard: 'ICRC-1', decimals: 8, initialSupply: '1000000000' },
    popular: true,
  },
  {
    id: 'token-launcher-evm',
    name: 'Token Launcher (ERC-20)',
    category: 'crypto',
    description: 'ERC-20 deploy + mint dashboard — Base, Ethereum, Polygon',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'node',
    deployTargets: ['blockchain-base', 'blockchain-evm', 'saas-vercel'],
    entities: [{ name: 'Wallet', fields: [{ name: 'address', type: 'string', required: true }] }],
    design: { ...BASE_DESIGN, primaryColor: '#627eea', layout: 'dashboard' },
    medinaFeatures: ['phi-crypto'],
    tokenDefault: { symbol: 'MED', standard: 'ERC-20', decimals: 18, initialSupply: '1000000000' },
    popular: true,
  },
  {
    id: 'marketplace-python',
    name: 'Marketplace',
    category: 'saas',
    description: 'Listings, orders, payments — Python + React',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'node',
    deployTargets: ['saas-vercel', 'saas-railway', 'docker'],
    entities: [
      { name: 'Product', fields: [{ name: 'name', type: 'string', required: true }, { name: 'price', type: 'number', required: true }] },
      { name: 'Order', fields: [{ name: 'productId', type: 'string', required: true }, { name: 'quantity', type: 'number' }] },
    ],
    design: { ...BASE_DESIGN, layout: 'dashboard', components: ['ProductGrid', 'Cart', 'Checkout', 'Nav'] },
    medinaFeatures: ['auth', 'memory-bridge', 'int-tok'],
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    category: 'internal',
    description: 'Internal ops dashboard with Medina governance hooks',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'node',
    deployTargets: ['saas-vercel', 'docker', 'kubernetes'],
    entities: [{ name: 'Metric', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'number' }] }],
    design: { ...BASE_DESIGN, layout: 'dashboard', components: ['Chart', 'KPI', 'Table', 'Sidebar'] },
    medinaFeatures: ['auth', 'governance', 'memory-bridge', 'deploy-orchestrator'],
    popular: true,
  },
  {
    id: 'landing-blog',
    name: 'Landing + Blog',
    category: 'marketing',
    description: 'Marketing site with CMS blog — static + edge deploy',
    tier: 'standard',
    backend: 'python',
    frontend: 'react',
    deployTargets: ['saas-vercel', 'saas-netlify', 'saas-cloudflare', 'github-pages'],
    entities: [{ name: 'Post', fields: [{ name: 'title', type: 'string', required: true }, { name: 'body', type: 'text' }] }],
    design: { ...BASE_DESIGN, layout: 'landing', primaryColor: '#8b5cf6', components: ['Hero', 'BlogList', 'Footer'] },
    medinaFeatures: ['memory-bridge'],
  },
  {
    id: 'api-microservice',
    name: 'API Microservice',
    category: 'api',
    description: 'Headless API only — Node or Python, no UI',
    tier: 'pro',
    backend: 'python',
    frontend: 'html',
    proStack: 'node',
    deployTargets: ['saas-railway', 'saas-flyio', 'docker', 'kubernetes'],
    entities: [{ name: 'Endpoint', fields: [{ name: 'path', type: 'string', required: true }] }],
    design: { ...BASE_DESIGN, layout: 'crud-admin' },
    medinaFeatures: ['auth', 'int-tok'],
  },
  {
    id: 'java-enterprise',
    name: 'Enterprise API (Java Spring)',
    category: 'enterprise',
    description: 'Spring Boot REST for pro users — Java backend + React UI',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'java',
    deployTargets: ['docker', 'kubernetes', 'aws-amplify'],
    entities: [{ name: 'Account', fields: [{ name: 'email', type: 'string', required: true }, { name: 'role', type: 'string' }] }],
    design: BASE_DESIGN,
    medinaFeatures: ['auth', 'governance', 'phi-crypto'],
  },
  {
    id: 'icp-social-dapp',
    name: 'ICP Social dApp',
    category: 'icp',
    description: 'On-chain social feed — Motoko + asset canister UI',
    tier: 'standard',
    backend: 'motoko',
    frontend: 'react',
    deployTargets: ['icp-mainnet', 'icp-local'],
    entities: [{ name: 'Post', fields: [{ name: 'author', type: 'string', required: true }, { name: 'content', type: 'text', required: true }] }],
    design: { ...BASE_DESIGN, primaryColor: '#29abe2', layout: 'dashboard' },
    medinaFeatures: ['auth', 'governance', 'memory-bridge'],
  },
  {
    id: 'governance-portal',
    name: 'Governance Portal',
    category: 'medina-native',
    description: 'Medina-native proposals, gates, audit — your company governance UI',
    tier: 'pro',
    backend: 'motoko',
    frontend: 'react',
    deployTargets: ['icp-mainnet', 'saas-vercel', 'docker'],
    entities: [{ name: 'Proposal', fields: [{ name: 'title', type: 'string', required: true }, { name: 'status', type: 'string' }] }],
    design: { ...BASE_DESIGN, primaryColor: '#10b981', layout: 'dashboard' },
    medinaFeatures: ['governance', 'auth', 'memory-bridge', 'phi-crypto'],
    popular: true,
  },
  {
    id: 'memory-app',
    name: 'Memory Temple App',
    category: 'medina-native',
    description: 'Semantic memory app powered by Medina Memory Temple',
    tier: 'standard',
    backend: 'python',
    frontend: 'react',
    deployTargets: ['saas-vercel', 'icp-mainnet', 'docker'],
    entities: [{ name: 'Memory', fields: [{ name: 'content', type: 'text', required: true }, { name: 'tags', type: 'string' }] }],
    design: { ...BASE_DESIGN, primaryColor: '#8b5cf6', layout: 'dashboard' },
    medinaFeatures: ['memory-bridge', 'auth'],
  },
  {
    id: 'agent-workspace',
    name: 'AI Agent Workspace',
    category: 'medina-native',
    description: 'Multi-agent workspace with local+cloud AI routing',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'node',
    deployTargets: ['saas-vercel', 'docker', 'wasm-edge'],
    entities: [{ name: 'Task', fields: [{ name: 'prompt', type: 'text', required: true }, { name: 'agent', type: 'string' }] }],
    design: { ...BASE_DESIGN, layout: 'dashboard', components: ['Chat', 'AgentList', 'TaskQueue'] },
    medinaFeatures: ['int-tok', 'memory-bridge', 'wasm-cortex', 'deploy-orchestrator'],
    popular: true,
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    category: 'saas',
    description: 'Product catalog, cart, checkout flow',
    tier: 'pro',
    backend: 'python',
    frontend: 'react',
    proStack: 'node',
    deployTargets: ['saas-vercel', 'saas-shopify-hydrogen', 'docker'],
    entities: [
      { name: 'Product', fields: [{ name: 'name', type: 'string', required: true }, { name: 'price', type: 'number' }] },
      { name: 'CartItem', fields: [{ name: 'productId', type: 'string' }, { name: 'qty', type: 'number' }] },
    ],
    design: { ...BASE_DESIGN, layout: 'landing', components: ['ProductCard', 'Cart', 'Checkout'] },
    medinaFeatures: ['auth', 'int-tok'],
  },
  {
    id: 'solana-dapp',
    name: 'Solana dApp Starter',
    category: 'crypto',
    description: 'Solana program scaffold + React wallet UI',
    tier: 'pro',
    backend: 'rust',
    frontend: 'react',
    deployTargets: ['blockchain-solana', 'saas-vercel'],
    entities: [{ name: 'Wallet', fields: [{ name: 'pubkey', type: 'string', required: true }] }],
    design: { ...BASE_DESIGN, primaryColor: '#9945ff', layout: 'dashboard' },
    medinaFeatures: ['phi-crypto'],
  },
];

export function listTemplates(filter?: { category?: TemplateCategory; tier?: StackTier; popular?: boolean }): AppTemplate[] {
  let list = [...TEMPLATE_LIBRARY];
  if (filter?.category) list = list.filter((t) => t.category === filter.category);
  if (filter?.tier) list = list.filter((t) => t.tier === filter.tier || t.tier === 'standard');
  if (filter?.popular) list = list.filter((t) => t.popular);
  return list;
}

export function getTemplate(id: string): AppTemplate | undefined {
  return TEMPLATE_LIBRARY.find((t) => t.id === id);
}

export function templateCategories(): { id: TemplateCategory; label: string; count: number }[] {
  const cats: TemplateCategory[] = ['saas', 'icp', 'crypto', 'enterprise', 'api', 'marketing', 'internal', 'medina-native'];
  return cats.map((id) => ({
    id,
    label: id.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    count: TEMPLATE_LIBRARY.filter((t) => t.category === id).length,
  })).filter((c) => c.count > 0);
}

export function applyTemplate(templateId: string, overrides?: { name?: string; companyId?: string }): Partial<{
  name: string;
  description: string;
  tier: StackTier;
  backend: BackendStack;
  frontend: 'react' | 'html';
  proStack: 'node' | 'java';
  deployTarget: DeployTarget;
  entities: CrudEntity[];
  design: DesignSpec;
  templateId: string;
}> | undefined {
  const t = getTemplate(templateId);
  if (!t) return undefined;
  return {
    name: overrides?.name ?? t.name,
    description: t.description,
    tier: t.tier,
    backend: t.backend,
    frontend: t.frontend,
    proStack: t.proStack,
    deployTarget: t.deployTargets[0],
    entities: t.entities,
    design: t.design,
    templateId: t.id,
  };
}
