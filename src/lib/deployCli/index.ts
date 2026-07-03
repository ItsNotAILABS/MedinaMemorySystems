/**
 * medina-deploy CLI — unified deploy command generator
 *
 * Users run: npx medina-deploy <target> [options]
 * Or copy generated scripts from the App Builder UI.
 */

import type { AppProject, DeployCliScript, DeployPlan, DeployTarget } from '@/types/appBuilder';

export const MEDINA_DEPLOY_VERSION = '1.0.0';

export function buildDeployPlan(project: AppProject, target: DeployTarget): DeployPlan {
  const slug = project.name.toLowerCase().replace(/\W/g, '-');
  const adapter = DEPLOY_ADAPTERS[target];
  if (!adapter) {
    return {
      target,
      projectId: project.id,
      projectName: project.name,
      status: 'ready',
      prerequisites: [],
      steps: [],
      cliCommand: `medina-deploy ${target} --project ${project.id}`,
      scripts: [],
      docsUrl: 'https://github.com/ItsNotAILABS/MedinaMemorySystems',
    };
  }
  return adapter(project, slug);
}

interface DeployAdapter {
  (project: AppProject, slug: string): DeployPlan;
}

const DEPLOY_ADAPTERS: Partial<Record<DeployTarget, DeployAdapter>> = {
  'icp-local': icpDeploy('local'),
  'icp-mainnet': icpDeploy('ic'),
  'saas-vercel': vercelDeploy,
  'saas-cloudflare': cloudflareDeploy,
  'saas-netlify': netlifyDeploy,
  'saas-railway': railwayDeploy,
  'saas-flyio': flyioDeploy,
  'saas-render': renderDeploy,
  'github-pages': githubPagesDeploy,
  'aws-amplify': awsAmplifyDeploy,
  'supabase': supabaseDeploy,
  'docker': dockerDeploy,
  'kubernetes': kubernetesDeploy,
  'blockchain-evm': evmDeploy('ethereum'),
  'blockchain-base': evmDeploy('base'),
  'blockchain-solana': solanaDeploy,
  'wasm-edge': wasmEdgeDeploy,
  'artifact-export': artifactExport,
  'saas-shopify-hydrogen': shopifyHydrogenDeploy,
};

function icpDeploy(network: 'local' | 'ic'): DeployAdapter {
  return (project, slug) => {
    const canisterName = slug.replace(/-/g, '_');
    const scripts: DeployCliScript[] = [
      {
        name: 'deploy-icp.sh',
        platform: 'unix',
        content: `#!/usr/bin/env bash
set -euo pipefail
# Medina Deploy — ICP (${network})
# Requires: dfx, mops

cd "$(dirname "$0")"
dfx start --background --clean 2>/dev/null || dfx start --background
dfx deploy ${canisterName} --network ${network}
dfx canister id ${canisterName} --network ${network}
`,
      },
      {
        name: 'deploy-icp.ps1',
        platform: 'windows',
        content: `# Medina Deploy — ICP (${network})
# Requires: dfx, mops
dfx start --background
dfx deploy ${canisterName} --network ${network}
dfx canister id ${canisterName} --network ${network}
`,
      },
      {
        name: 'dfx.json',
        platform: 'all',
        content: JSON.stringify({
          version: 1,
          canisters: {
            [canisterName]: {
              type: 'motoko',
              main: 'src/backend/main.mo',
            },
            [`${canisterName}_assets`]: {
              type: 'assets',
              source: ['dist/'],
            },
            ...(project.token ? {
              [`${canisterName}_token`]: {
                type: 'motoko',
                main: `icp/token/${project.token.symbol.toLowerCase()}_token.mo`,
              },
            } : {}),
          },
          defaults: { build: { packtool: 'mops' } },
        }, null, 2),
      },
      {
        name: 'mops.toml',
        platform: 'all',
        content: `[package]
name = "${slug}"
version = "1.0.0"
description = "${project.description || project.name}"
`,
      },
    ];

    return {
      target: network === 'local' ? 'icp-local' : 'icp-mainnet',
      projectId: project.id,
      projectName: project.name,
      status: 'ready',
      prerequisites: ['dfx >= 0.24', 'mops', network === 'ic' ? 'ICP wallet + cycles' : 'local replica'],
      steps: [
        'Generate Motoko canister from template',
        'dfx start --background',
        `dfx deploy ${canisterName} --network ${network}`,
        project.token ? `dfx deploy ${canisterName}_token --network ${network}` : 'Skip token canister',
        'dfx deploy assets canister',
        'Wire frontend to canister IDs',
      ],
      cliCommand: `medina-deploy icp --network ${network} --project ${slug}`,
      scripts,
      envVars: network === 'ic' ? ['DFX_IDENTITY', 'ICP_WALLET'] : [],
      docsUrl: 'https://internetcomputer.org/docs/current/developer-docs/getting-started/install',
    };
  };
}

function vercelDeploy(project: AppProject, slug: string): DeployPlan {
  return {
    target: 'saas-vercel',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: ['vercel CLI', 'Vercel account'],
    steps: ['npm run build', 'vercel --prod'],
    cliCommand: `medina-deploy vercel --project ${slug}`,
    scripts: [{
      name: 'deploy-vercel.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nnpm run build\nvercel deploy --prod --name ${slug}\n`,
    }],
    envVars: ['VERCEL_TOKEN', 'VERCEL_ORG_ID'],
    docsUrl: 'https://vercel.com/docs/cli',
  };
}

function cloudflareDeploy(project: AppProject, slug: string): DeployPlan {
  return {
    target: 'saas-cloudflare',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: ['wrangler CLI', 'Cloudflare account'],
    steps: ['npm run build', 'wrangler deploy'],
    cliCommand: `medina-deploy cloudflare --project ${slug}`,
    scripts: [{
      name: 'wrangler.toml',
      platform: 'all',
      content: `name = "${slug}"\nmain = "dist/worker.js"\ncompatibility_date = "2024-01-01"\n`,
    }, {
      name: 'deploy-cloudflare.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nnpm run build\nwrangler deploy\n`,
    }],
    envVars: ['CLOUDFLARE_API_TOKEN'],
    docsUrl: 'https://developers.cloudflare.com/workers/wrangler/',
  };
}

function netlifyDeploy(_project: AppProject, slug: string): DeployPlan {
  return baseSaasPlan('saas-netlify', slug, 'netlify deploy --prod', ['NETLIFY_AUTH_TOKEN'], 'https://docs.netlify.com/cli/get-started/');
}

function railwayDeploy(_project: AppProject, slug: string): DeployPlan {
  return baseSaasPlan('saas-railway', slug, 'railway up', ['RAILWAY_TOKEN'], 'https://docs.railway.app/guides/cli');
}

function flyioDeploy(_project: AppProject, slug: string): DeployPlan {
  return {
    target: 'saas-flyio',
    projectId: _project.id,
    projectName: _project.name,
    status: 'ready',
    prerequisites: ['flyctl CLI'],
    steps: ['fly launch', 'fly deploy'],
    cliCommand: `medina-deploy flyio --project ${slug}`,
    scripts: [{
      name: 'fly.toml',
      platform: 'all',
      content: `app = "${slug}"\nprimary_region = "iad"\n\n[build]\n  dockerfile = "Dockerfile"\n`,
    }],
    envVars: ['FLY_API_TOKEN'],
    docsUrl: 'https://fly.io/docs/flyctl/',
  };
}

function renderDeploy(_project: AppProject, slug: string): DeployPlan {
  return baseSaasPlan('saas-render', slug, 'render deploy', ['RENDER_API_KEY'], 'https://render.com/docs/cli');
}

function githubPagesDeploy(_project: AppProject, slug: string): DeployPlan {
  return {
    target: 'github-pages',
    projectId: _project.id,
    projectName: _project.name,
    status: 'ready',
    prerequisites: ['git', 'GitHub repo'],
    steps: ['npm run build', 'gh-pages deploy dist'],
    cliCommand: `medina-deploy github-pages --project ${slug}`,
    scripts: [{
      name: 'deploy-ghpages.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nnpm run build\nnpx gh-pages -d dist\n`,
    }],
    envVars: ['GITHUB_TOKEN'],
    docsUrl: 'https://pages.github.com/',
  };
}

function awsAmplifyDeploy(_project: AppProject, slug: string): DeployPlan {
  return baseSaasPlan('aws-amplify', slug, 'amplify publish', ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'], 'https://docs.amplify.aws/cli/');
}

function supabaseDeploy(_project: AppProject, slug: string): DeployPlan {
  return {
    target: 'supabase',
    projectId: _project.id,
    projectName: _project.name,
    status: 'ready',
    prerequisites: ['supabase CLI'],
    steps: ['supabase link', 'supabase db push', 'supabase functions deploy'],
    cliCommand: `medina-deploy supabase --project ${slug}`,
    scripts: [],
    envVars: ['SUPABASE_ACCESS_TOKEN', 'SUPABASE_PROJECT_REF'],
    docsUrl: 'https://supabase.com/docs/guides/cli',
  };
}

function dockerDeploy(_project: AppProject, slug: string): DeployPlan {
  return {
    target: 'docker',
    projectId: _project.id,
    projectName: _project.name,
    status: 'ready',
    prerequisites: ['Docker'],
    steps: ['docker build', 'docker run'],
    cliCommand: `medina-deploy docker --project ${slug}`,
    scripts: [{
      name: 'Dockerfile',
      platform: 'all',
      content: `FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nEXPOSE 3000\nCMD ["npm","start"]\n`,
    }, {
      name: 'docker-compose.yml',
      platform: 'all',
      content: `services:\n  ${slug}:\n    build: .\n    ports:\n      - "3000:3000"\n`,
    }],
    envVars: [],
    docsUrl: 'https://docs.docker.com/',
  };
}

function kubernetesDeploy(_project: AppProject, slug: string): DeployPlan {
  return {
    target: 'kubernetes',
    projectId: _project.id,
    projectName: _project.name,
    status: 'ready',
    prerequisites: ['kubectl', 'cluster access'],
    steps: ['kubectl apply -f k8s/'],
    cliCommand: `medina-deploy k8s --project ${slug}`,
    scripts: [{
      name: 'k8s/deployment.yaml',
      platform: 'all',
      content: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${slug}\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: ${slug}\n  template:\n    metadata:\n      labels:\n        app: ${slug}\n    spec:\n      containers:\n        - name: app\n          image: ${slug}:latest\n          ports:\n            - containerPort: 3000\n`,
    }],
    envVars: ['KUBECONFIG'],
    docsUrl: 'https://kubernetes.io/docs/tasks/tools/',
  };
}

function evmDeploy(chain: 'ethereum' | 'base'): DeployAdapter {
  return (project, slug) => ({
    target: chain === 'base' ? 'blockchain-base' : 'blockchain-evm',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: ['foundry or hardhat', `${chain} RPC`, 'deployer wallet'],
    steps: [
      'forge build',
      `forge create --rpc-url $${chain.toUpperCase()}_RPC --private-key $DEPLOYER_KEY`,
      'Verify on block explorer',
    ],
    cliCommand: `medina-deploy evm --chain ${chain} --project ${slug}`,
    scripts: [{
      name: 'deploy-evm.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nforge build\nforge script script/Deploy.s.sol --rpc-url $${chain.toUpperCase()}_RPC --broadcast\n`,
    }],
    envVars: [`${chain.toUpperCase()}_RPC`, 'DEPLOYER_PRIVATE_KEY'],
    docsUrl: chain === 'base' ? 'https://docs.base.org/' : 'https://ethereum.org/developers',
  });
}

function solanaDeploy(project: AppProject, slug: string): DeployPlan {
  return {
    target: 'blockchain-solana',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: ['solana CLI', 'anchor'],
    steps: ['anchor build', 'anchor deploy'],
    cliCommand: `medina-deploy solana --project ${slug}`,
    scripts: [{
      name: 'deploy-solana.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nanchor build\nanchor deploy --provider.cluster devnet\n`,
    }],
    envVars: ['SOLANA_WALLET', 'ANCHOR_PROVIDER_URL'],
    docsUrl: 'https://www.anchor-lang.com/docs/installation',
  };
}

function wasmEdgeDeploy(project: AppProject, slug: string): DeployPlan {
  return {
    target: 'wasm-edge',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: ['wasm-pack', 'Medina CORTEX WASM runtime'],
    steps: ['wasm-pack build --target web', 'Publish capsule to edge mesh'],
    cliCommand: `medina-deploy wasm --project ${slug}`,
    scripts: [{
      name: 'deploy-wasm.sh',
      platform: 'all',
      content: `#!/usr/bin/env bash\nwasm-pack build --target web --out-dir pkg\n# Publish to Medina edge via medina-deploy wasm push\n`,
    }],
    envVars: ['MEDINA_EDGE_TOKEN'],
    docsUrl: 'https://rustwasm.github.io/wasm-pack/',
  };
}

function artifactExport(project: AppProject, slug: string): DeployPlan {
  return {
    target: 'artifact-export',
    projectId: project.id,
    projectName: project.name,
    status: 'ready',
    prerequisites: [],
    steps: ['Bundle all generated files', 'Download ZIP'],
    cliCommand: `medina-deploy export --project ${slug} --output ./dist/${slug}.zip`,
    scripts: [],
    envVars: [],
    docsUrl: '',
  };
}

function shopifyHydrogenDeploy(_project: AppProject, slug: string): DeployPlan {
  return baseSaasPlan('saas-shopify-hydrogen', slug, 'shopify hydrogen deploy', ['SHOPIFY_CLI_TOKEN'], 'https://shopify.dev/docs/custom-storefronts/hydrogen');
}

function baseSaasPlan(
  target: DeployTarget,
  slug: string,
  deployCmd: string,
  envVars: string[],
  docsUrl: string,
): DeployPlan {
  return {
    target,
    projectId: slug,
    projectName: slug,
    status: 'ready',
    prerequisites: [`${target} CLI`],
    steps: ['npm run build', deployCmd],
    cliCommand: `medina-deploy ${target.replace('saas-', '')} --project ${slug}`,
    scripts: [{
      name: `deploy-${target}.sh`,
      platform: 'all',
      content: `#!/usr/bin/env bash\nnpm run build\n${deployCmd}\n`,
    }],
    envVars,
    docsUrl,
  };
}

export function listDeployTargets(): { id: DeployTarget; label: string; category: string; cli: string }[] {
  return [
    { id: 'saas-vercel', label: 'Vercel', category: 'SaaS', cli: 'medina-deploy vercel' },
    { id: 'saas-cloudflare', label: 'Cloudflare Workers', category: 'SaaS', cli: 'medina-deploy cloudflare' },
    { id: 'saas-netlify', label: 'Netlify', category: 'SaaS', cli: 'medina-deploy netlify' },
    { id: 'saas-railway', label: 'Railway', category: 'SaaS', cli: 'medina-deploy railway' },
    { id: 'saas-flyio', label: 'Fly.io', category: 'SaaS', cli: 'medina-deploy flyio' },
    { id: 'saas-render', label: 'Render', category: 'SaaS', cli: 'medina-deploy render' },
    { id: 'github-pages', label: 'GitHub Pages', category: 'Static', cli: 'medina-deploy github-pages' },
    { id: 'aws-amplify', label: 'AWS Amplify', category: 'Cloud', cli: 'medina-deploy aws' },
    { id: 'supabase', label: 'Supabase', category: 'Backend', cli: 'medina-deploy supabase' },
    { id: 'docker', label: 'Docker', category: 'Container', cli: 'medina-deploy docker' },
    { id: 'kubernetes', label: 'Kubernetes', category: 'Container', cli: 'medina-deploy k8s' },
    { id: 'icp-local', label: 'ICP Local (dfx)', category: 'Blockchain', cli: 'medina-deploy icp --network local' },
    { id: 'icp-mainnet', label: 'ICP Mainnet', category: 'Blockchain', cli: 'medina-deploy icp --network ic' },
    { id: 'blockchain-evm', label: 'Ethereum / EVM', category: 'Blockchain', cli: 'medina-deploy evm --chain ethereum' },
    { id: 'blockchain-base', label: 'Base L2', category: 'Blockchain', cli: 'medina-deploy evm --chain base' },
    { id: 'blockchain-solana', label: 'Solana', category: 'Blockchain', cli: 'medina-deploy solana' },
    { id: 'wasm-edge', label: 'WASM Edge', category: 'Edge', cli: 'medina-deploy wasm' },
    { id: 'artifact-export', label: 'Export ZIP', category: 'Export', cli: 'medina-deploy export' },
  ];
}

export { buildDeployPlan as getDeployPlan };
