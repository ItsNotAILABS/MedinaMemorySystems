import { createProject } from '../src/lib/appBuilderEngine';
import { orchestrateBuild } from '../src/lib/buildOrchestrator';

async function main() {
  const p = createProject({ name: 'LiveTestApp', backend: 'python', deployTarget: 'saas-vercel' });
  const r = await orchestrateBuild(p, { sessionId: 'test', shell: 'bash' });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

main();
