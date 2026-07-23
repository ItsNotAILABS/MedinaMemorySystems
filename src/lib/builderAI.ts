/**
 * Builder AI — MEDINA inner intelligence for app generation
 * ULRI routing · memory · builder model · wasm compiler · governance check
 */

import { ulriRoute } from '@/lib/ulriEngine';
import { storeMemory } from '@/lib/memoryEngine';
import { checkAllGates } from '@/lib/gateEnforcement';
import { getTemplate, listTemplates } from '@/lib/templateLibrary';
import { listDeployTargets } from '@/lib/deployCli';
import type { AIBuildAssistResult, AIMode, AppProject, CrudEntity, DeployTarget } from '@/types/appBuilder';

const TEMPLATE_KEYWORDS: Record<string, string[]> = {
  'token-launcher-icp': ['token', 'icrc', 'coin', 'crypto', 'launch'],
  'token-launcher-evm': ['erc20', 'ethereum', 'base', 'smart contract'],
  'saas-crud-python': ['crud', 'saas', 'app', 'api', 'admin'],
  'saas-crud-motoko': ['icp', 'canister', 'motoko', 'blockchain'],
  'marketplace-python': ['marketplace', 'shop', 'store', 'product'],
  'governance-portal': ['governance', 'proposal', 'vote', 'gate'],
  'memory-app': ['memory', 'semantic', 'knowledge', 'temple'],
  'agent-workspace': ['agent', 'ai', 'workspace', 'automation'],
  'landing-blog': ['landing', 'blog', 'marketing', 'website'],
};

export function recommendTemplate(prompt: string): string | undefined {
  const lower = prompt.toLowerCase();
  let best: { id: string; score: number } | undefined;
  for (const [id, keywords] of Object.entries(TEMPLATE_KEYWORDS)) {
    const score = keywords.filter((k) => lower.includes(k)).length;
    if (score > 0 && (!best || score > best.score)) best = { id, score };
  }
  return best?.id;
}

export function recommendDeployTarget(project: AppProject, prompt: string): DeployTarget {
  const lower = prompt.toLowerCase();
  if (lower.includes('icp') || lower.includes('canister') || project.backend === 'motoko') {
    return lower.includes('mainnet') ? 'icp-mainnet' : 'icp-local';
  }
  if (lower.includes('solana')) return 'blockchain-solana';
  if (lower.includes('base')) return 'blockchain-base';
  if (lower.includes('ethereum') || lower.includes('evm')) return 'blockchain-evm';
  if (lower.includes('docker')) return 'docker';
  if (lower.includes('fly')) return 'saas-flyio';
  if (lower.includes('railway')) return 'saas-railway';
  if (lower.includes('cloudflare')) return 'saas-cloudflare';
  if (lower.includes('netlify')) return 'saas-netlify';
  return project.deployTarget;
}

export function builderAIAssist(
  project: AppProject,
  prompt: string,
): AIBuildAssistResult {
  const gates = checkAllGates();
  const gateOpen = Object.values(gates).every((g) => g.allowed);

  const ulri = ulriRoute(
    `app builder ${prompt} ${project.backend} ${project.templateId ?? ''} deploy ${project.deployTarget}`,
  );

  const templateRec = recommendTemplate(prompt);
  const deployRec = recommendDeployTarget(project, prompt);

  const suggestions: string[] = [];
  if (templateRec) {
    const t = getTemplate(templateRec);
    if (t) suggestions.push(`Recommended template: ${t.name} — ${t.description}`);
  }
  suggestions.push(`ULRI primary model: ${ulri.primary} (composite routing)`);
  suggestions.push(`Deploy recommendation: ${deployRec}`);
  suggestions.push(
    `Available targets: ${listDeployTargets().slice(0, 6).map((d) => d.label).join(', ')}…`,
  );
  if (!gateOpen) suggestions.push('⚠ Some governance gates are not fully open — review before production deploy');

  suggestions.push(ulri.invocation.response.slice(0, 180));

  let inferredEntities: CrudEntity[] | undefined;
  if (prompt.toLowerCase().includes('user')) {
    inferredEntities = [
      { name: 'User', fields: [{ name: 'email', type: 'string', required: true }, { name: 'name', type: 'string' }] },
    ];
  } else if (prompt.toLowerCase().includes('product')) {
    inferredEntities = [
      { name: 'Product', fields: [{ name: 'name', type: 'string', required: true }, { name: 'price', type: 'number' }] },
    ];
  }

  let memoryStored = false;
  try {
    storeMemory(
      `App Builder: ${project.name} — ${prompt.slice(0, 200)}`,
      'semantic',
      ['app-builder', project.templateId ?? 'custom', project.backend],
    );
    memoryStored = true;
  } catch {
    memoryStored = false;
  }

  return {
    mode: project.aiMode,
    modelUsed: ulri.primary,
    ulriPrimary: ulri.primary,
    suggestions,
    inferredEntities,
    deployRecommendation: deployRec,
    memoryStored,
  };
}

export function listAIContext() {
  return {
    templates: listTemplates().length,
    deployTargets: listDeployTargets().length,
    medinaModels: ['builder', 'wasm-compiler-model', 'strategist', 'memory-curator', 'governance'],
    routing: 'ULRI composite scoring',
    memory: 'Memory Temple auto-store on each AI assist',
    gates: 'Governance gate check before deploy recommendations',
  };
}
