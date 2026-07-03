#!/usr/bin/env node
/**
 * medina-deploy — unified deploy CLI for Medina App Builder projects
 *
 * Usage:
 *   npx medina-deploy icp --network local --project my-app
 *   npx medina-deploy vercel --project my-app
 *   npx medina-deploy evm --chain base --project my-app
 *   medina-deploy --help
 */

const args = process.argv.slice(2);
const target = args[0];
const projectIdx = args.indexOf('--project');
const project = projectIdx >= 0 ? args[projectIdx + 1] : 'my-app';
const networkIdx = args.indexOf('--network');
const network = networkIdx >= 0 ? args[networkIdx + 1] : 'local';
const chainIdx = args.indexOf('--chain');
const chain = chainIdx >= 0 ? args[chainIdx + 1] : 'ethereum';

const HELP = `
medina-deploy v1.0.0 — Medina Company App Builder deploy CLI

TARGETS:
  icp          ICP canister deploy (dfx)     --network local|ic
  vercel       Vercel SaaS                   --project NAME
  cloudflare   Cloudflare Workers            --project NAME
  netlify      Netlify                       --project NAME
  railway      Railway                       --project NAME
  flyio        Fly.io                        --project NAME
  render       Render                        --project NAME
  docker       Docker compose                --project NAME
  k8s          Kubernetes                    --project NAME
  evm          Ethereum / Base               --chain ethereum|base
  solana       Solana Anchor                 --project NAME
  wasm         WASM edge capsule             --project NAME
  export       Export artifact ZIP           --project NAME

Generate full deploy scripts from the Medina App Builder UI (Deploy tab).
`;

if (!target || target === '--help' || target === '-h') {
  console.log(HELP);
  process.exit(0);
}

const slug = project.toLowerCase().replace(/\W/g, '-');

switch (target) {
  case 'icp':
    console.log(`# ICP deploy (${network}) for ${slug}`);
    console.log(`dfx start --background`);
    console.log(`dfx deploy --network ${network}`);
    break;
  case 'vercel':
    console.log(`vercel deploy --prod --name ${slug}`);
    break;
  case 'cloudflare':
    console.log(`wrangler deploy`);
    break;
  case 'evm':
    console.log(`forge script script/Deploy.s.sol --rpc-url $${chain.toUpperCase()}_RPC --broadcast`);
    break;
  case 'docker':
    console.log(`docker compose up --build`);
    break;
  default:
    console.log(`Target: ${target} | Project: ${slug}`);
    console.log(`See deploy/ folder in your App Builder project for full scripts.`);
}
