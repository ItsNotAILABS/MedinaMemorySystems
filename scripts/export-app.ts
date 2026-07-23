/**
 * Export App Builder project to generated/<slug>/ on disk.
 * Usage: npx tsx scripts/export-app.ts [projectId]
 */
import { createProject, getProject } from '../src/lib/appBuilderEngine';
import { exportProjectToDisk } from '../src/lib/appBuilderEngineDisk';

const projectIdArg = process.argv[2];

let projectId: string;
if (projectIdArg) {
  if (!getProject(projectIdArg)) {
    console.error('Project not found:', projectIdArg);
    process.exit(1);
  }
  projectId = projectIdArg;
} else {
  const project = createProject({
    name: 'Medina Demo App',
    description: 'Auto-generated runnable demo from Company App Builder',
    backend: 'python',
    frontend: 'react',
    deployTarget: 'saas-vercel',
    entities: [
      {
        name: 'Task',
        fields: [
          { name: 'title', type: 'string', required: true },
          { name: 'done', type: 'boolean', required: false },
        ],
      },
    ],
  });
  projectId = project.id;
}

const result = exportProjectToDisk(projectId);
if (!result?.ok) {
  console.error('Export failed:', result?.error ?? 'unknown error');
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
console.log('\nNext steps:');
console.log(`  cd ${result.outputDir}`);
console.log('  npm install');
console.log('  npm run dev');
