'use client';

import { useCallback, useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  done?: string;
  createdAt: string;
}

export default function HomePage() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch('/api/task');
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    fd.forEach((v, k) => { body[k] = k === '' ? Number(v) : String(v); });
    await fetch('/api/task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    e.currentTarget.reset();
    load();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#6366f1' }}>Medina Demo App</h1>
        <p className="text-sm text-slate-500 mt-1">Auto-generated runnable demo from Company App Builder</p>
        <p className="text-xs text-slate-600 mt-1">Template: python · Deploy: saas-vercel</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 p-4 rounded-xl border border-[#1e1e2e] bg-[#12121a] mb-6">
        <h2 className="text-sm font-semibold">New Task</h2>

            <div>
              <label className="block text-xs text-slate-400 mb-1">title *</label>
              <input
                name="title"
                type="text"
                required={true}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">done</label>
              <input
                name="done"
                type="text"
                required={false}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-sm"
              />
            </div>
        <button type="submit" className="mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#6366f1' }}>
          Create
        </button>
      </form>

      <section>
        <h2 className="text-sm font-semibold mb-3">Task list ({loading ? '…' : items.length})</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500 text-sm">No records yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="p-3 rounded-lg border border-[#1e1e2e] bg-[#12121a] text-sm">
                <div><span className="text-slate-500">title:</span> {String(item.title ?? '')}</div>
                <div><span className="text-slate-500">done:</span> {String(item.done ?? '')}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
