/**
 * Full runnable project scaffolds — complete apps users can npm install && npm run dev
 */

import type { AppProject, GeneratedFile } from '@/types/appBuilder';
import { scaffoldProject } from '@/lib/stackTemplates';
import { buildDeployPlan } from '@/lib/deployCli';

function slug(name: string): string {
  return name.toLowerCase().replace(/\W/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'medina-app';
}

function entityName(project: AppProject): string {
  return project.entities[0]?.name ?? 'Record';
}

function entityLower(project: AppProject): string {
  return entityName(project).toLowerCase();
}

/** Complete Next.js 15 CRUD app — runs standalone after export */
export function generateFullNextApp(project: AppProject): GeneratedFile[] {
  const s = slug(project.name);
  const entity = entityName(project);
  const el = entityLower(project);
  const color = project.design.primaryColor;
  const fields = project.entities[0]?.fields ?? [{ name: 'title', type: 'string' as const, required: true }];
  const deployPlan = buildDeployPlan(project, project.deployTarget);

  const fieldRows = fields.map((f) => `
            <div>
              <label className="block text-xs text-slate-400 mb-1">${f.name}${f.required ? ' *' : ''}</label>
              <input
                name="${f.name}"
                type="${f.type === 'number' ? 'number' : 'text'}"
                required={${!!f.required}}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-sm"
              />
            </div>`).join('\n');

  const files: GeneratedFile[] = [
    {
      path: 'next-env.d.ts',
      language: 'typescript',
      content: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
`,
    },
    {
      path: 'package.json',
      language: 'json',
      content: JSON.stringify({
        name: s,
        version: '1.0.0',
        private: true,
        engines: { node: '>=20' },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
          deploy: deployPlan.cliCommand,
        },
        dependencies: {
          next: '^15.5.20',
          react: '^18.3.0',
          'react-dom': '^18.3.0',
          clsx: '^2.1.1',
        },
        devDependencies: {
          '@types/node': '^20',
          '@types/react': '^18',
          '@types/react-dom': '^18',
          autoprefixer: '^10.4.19',
          postcss: '^8.4.38',
          tailwindcss: '^3.4.4',
          typescript: '^5',
        },
      }, null, 2),
    },
    {
      path: '.nvmrc',
      language: 'text',
      content: '22\n',
    },
    {
      path: 'next.config.js',
      language: 'javascript',
      content: `/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };
`,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
        exclude: ['node_modules'],
      }, null, 2),
    },
    {
      path: 'tailwind.config.ts',
      language: 'typescript',
      content: `import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: '${color}' } } },
  plugins: [],
};
export default config;
`,
    },
    {
      path: 'postcss.config.js',
      language: 'javascript',
      content: `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`,
    },
    {
      path: 'src/app/globals.css',
      language: 'css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
body { background: #0a0a0f; color: #e2e8f0; }
`,
    },
    {
      path: 'src/app/layout.tsx',
      language: 'typescript',
      content: `import './globals.css';

export const metadata = {
  title: '${project.name}',
  description: '${project.description || project.name + ' — built with Medina App Builder'}',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ fontFamily: '${project.design.fontFamily}' }}>
        {children}
      </body>
    </html>
  );
}
`,
    },
    {
      path: 'src/app/page.tsx',
      language: 'typescript',
      content: `'use client';

import { useCallback, useEffect, useState } from 'react';

interface ${entity} {
  id: string;
${fields.map((f) => `  ${f.name}${f.required ? '' : '?'}: ${f.type === 'number' ? 'number' : 'string'};`).join('\n')}
  createdAt: string;
}

export default function HomePage() {
  const [items, setItems] = useState<${entity}[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch('/api/${el}');
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    fd.forEach((v, k) => { body[k] = k === '${fields.find(f => f.type === 'number')?.name ?? ''}' ? Number(v) : String(v); });
    await fetch('/api/${el}', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    e.currentTarget.reset();
    load();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '${color}' }}>${project.name}</h1>
        <p className="text-sm text-slate-500 mt-1">${project.description || 'Medina-generated CRUD app'}</p>
        <p className="text-xs text-slate-600 mt-1">Template: ${project.templateId ?? project.backend} · Deploy: ${project.deployTarget}</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 p-4 rounded-xl border border-[#1e1e2e] bg-[#12121a] mb-6">
        <h2 className="text-sm font-semibold">New ${entity}</h2>
${fieldRows}
        <button type="submit" className="mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '${color}' }}>
          Create
        </button>
      </form>

      <section>
        <h2 className="text-sm font-semibold mb-3">${entity} list ({loading ? '…' : items.length})</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500 text-sm">No records yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="p-3 rounded-lg border border-[#1e1e2e] bg-[#12121a] text-sm">
                ${fields.map((f) => `<div><span className="text-slate-500">${f.name}:</span> {String(item.${f.name} ?? '')}</div>`).join('\n                ')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
`,
    },
    {
      path: `src/app/api/${el}/route.ts`,
      language: 'typescript',
      content: `import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ${entity} {
  id: string;
${fields.map((f) => `  ${f.name}${f.required ? '' : '?'}: ${f.type === 'number' ? 'number' : 'string'};`).join('\n')}
  createdAt: string;
}

const store: ${entity}[] = [];

export async function GET() {
  return NextResponse.json({ items: store });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item: ${entity} = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  store.push(item);
  return NextResponse.json(item, { status: 201 });
}
`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      content: `# ${project.name}

Built with **Medina Company App Builder**.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Deploy

\`\`\`bash
${deployPlan.cliCommand}
\`\`\`

## Stack

- Frontend: Next.js 15 + React + Tailwind
- Backend template: ${project.backend}${project.proStack ? ' + ' + project.proStack : ''}
- Deploy target: ${project.deployTarget}

${deployPlan.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`,
    },
    ...deployPlan.scripts.map((script) => ({
      path: `deploy/${script.name}`,
      content: script.content,
      language: 'shell' as const,
    })),
  ];

  // Include backend template source files for ICP/Python/Rust
  files.push(...scaffoldProject(project).map((f) => ({
    ...f,
    path: `backend-template/${f.path}`,
  })));

  if (project.token) {
    files.push({
      path: 'medina.json',
      language: 'json',
      content: JSON.stringify({
        name: project.name,
        templateId: project.templateId,
        token: project.token,
        deployTarget: project.deployTarget,
        generatedAt: new Date().toISOString(),
      }, null, 2),
    });
  }

  return files;
}

export function buildCompleteProject(project: AppProject): GeneratedFile[] {
  return generateFullNextApp(project);
}

export { slug as projectSlug };
