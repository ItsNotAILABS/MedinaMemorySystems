/**
 * Company Vault — internal MEDINA infrastructure modules.
 * Auto-imported into generated apps; source stays hidden (internalOnly).
 */

import type { CompanyVaultModule } from '@/types/appBuilder';

export const COMPANY_VAULT: CompanyVaultModule[] = [
  {
    id: 'medina-auth',
    name: 'Medina Sovereign Auth',
    importPath: '@medina/vault/auth',
    description: 'Gate-enforced auth + principal binding',
    internalOnly: true,
    stacks: ['motoko', 'rust', 'python', 'node', 'react'],
  },
  {
    id: 'medina-memory-bridge',
    name: 'Memory Temple Bridge',
    importPath: '@medina/vault/memory',
    description: 'Semantic memory sync for generated apps',
    internalOnly: true,
    stacks: ['motoko', 'python', 'node', 'react'],
  },
  {
    id: 'medina-governance-hooks',
    name: 'Governance Hooks',
    importPath: '@medina/vault/governance',
    description: 'Proposal + audit trail integration',
    internalOnly: true,
    stacks: ['motoko', 'rust', 'python', 'node'],
  },
  {
    id: 'medina-phi-crypto',
    name: 'Phi Encryption Layer',
    importPath: '@medina/vault/crypto',
    description: 'Sovereign encryption primitives',
    internalOnly: true,
    stacks: ['motoko', 'rust', 'python', 'java'],
  },
  {
    id: 'medina-int-tok',
    name: 'INT-TOK Exchange',
    importPath: '@medina/vault/int-tok',
    description: 'AI credit + inference billing bridge',
    internalOnly: true,
    stacks: ['python', 'node', 'react'],
  },
  {
    id: 'medina-wasm-cortex',
    name: 'CORTEX WASM Runtime',
    importPath: '@medina/vault/wasm-cortex',
    description: 'Near-native WASM compute capsule host',
    internalOnly: true,
    stacks: ['rust', 'motoko', 'react'],
  },
  {
    id: 'medina-deploy-orchestrator',
    name: 'Deploy Orchestrator',
    importPath: '@medina/vault/deploy',
    description: 'SaaS + ICP + edge unified deploy',
    internalOnly: true,
    stacks: ['node', 'python', 'rust'],
  },
];

export function vaultModulesForStack(
  backend: string,
  frontend: string,
  pro?: string,
): CompanyVaultModule[] {
  const stacks = new Set([backend, frontend, pro].filter(Boolean));
  return COMPANY_VAULT.filter((m) => m.stacks.some((s) => stacks.has(s)));
}

export function vaultImportBlock(modules: CompanyVaultModule[], lang: 'ts' | 'py' | 'mo' | 'rs' | 'java'): string {
  if (modules.length === 0) return '';
  const lines = modules.map((m) => {
    switch (lang) {
      case 'ts':
        return `// [INTERNAL] ${m.name}\nimport '${m.importPath}';`;
      case 'py':
        return `# [INTERNAL] ${m.name}\nfrom medina_vault import ${m.id.replace(/-/g, '_')}`;
      case 'mo':
        return `// [INTERNAL] ${m.name} — wired at deploy\n// import ${m.id}`;
      case 'rs':
        return `// [INTERNAL] ${m.name}\n// use medina_vault::${m.id.replace(/-/g, "_")};`;
      case 'java':
        return `// [INTERNAL] ${m.name}\n// import com.medina.vault.${m.id.replace(/-/g, '.')};`;
      default:
        return '';
    }
  });
  return lines.join('\n') + '\n';
}
