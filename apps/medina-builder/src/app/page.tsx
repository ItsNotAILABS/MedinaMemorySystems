'use client';

import AppBuilder from '@/components/AppBuilder';

export default function BuilderPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-[#1e1e2e] px-4 py-2 flex items-center justify-between bg-[#0a0a0f]">
        <div>
          <h1 className="text-sm font-bold text-indigo-400">Medina Company App Builder</h1>
          <p className="text-[10px] text-slate-500">Code Studio · ZIP export · Deploy anywhere</p>
        </div>
        <code className="text-[10px] text-slate-600">npm run build-app</code>
      </header>
      <main className="flex-1 overflow-hidden">
        <AppBuilder />
      </main>
    </div>
  );
}
