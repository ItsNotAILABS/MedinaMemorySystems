'use client';

import { useCallback, useEffect, useState } from 'react';
import { downloadFilesAsZip } from '@/lib/zipDownload';
import type { GeneratedFile } from '@/types/appBuilder';

interface Props {
  projectId: string | null;
  projectName: string;
  onLog: (msg: string) => void;
}

export default function BuilderCodeStudio({ projectId, projectName, onLog }: Props) {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFiles = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/builder?action=source-files&id=${projectId}`);
      const data = await res.json();
      if (data.success && data.data?.length) {
        setFiles(data.data);
        if (!activePath || !data.data.find((f: GeneratedFile) => f.path === activePath)) {
          setActivePath(data.data[0].path);
          setContent(data.data[0].content);
        }
        setDirty(false);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, activePath]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const openFile = (f: GeneratedFile) => {
    setActivePath(f.path);
    setContent(f.content);
    setDirty(false);
  };

  const save = async () => {
    if (!projectId || !activePath) return;
    setLoading(true);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-file', id: projectId, path: activePath, content }),
      });
      const data = await res.json();
      if (data.success) {
        onLog(`saved ${activePath}`);
        setDirty(false);
        setFiles((prev) => prev.map((f) => (f.path === activePath ? { ...f, content } : f)));
      } else {
        onLog(`save failed: ${data.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    if (!files.length) return;
    const slug = projectName.toLowerCase().replace(/\W/g, '-') || 'medina-app';
    downloadFilesAsZip(files.map((f) => ({ path: f.path, content: f.path === activePath && dirty ? content : f.content })), slug);
    onLog(`downloaded ${slug}.zip`);
  };

  if (!projectId) {
    return <p className="text-sm text-amber-500/80">Select or create a project to open Code Studio</p>;
  }

  const active = files.find((f) => f.path === activePath);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[420px] border border-[#1e1e2e] rounded-xl overflow-hidden bg-[#0a0a0f]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1e2e] bg-[#12121a] shrink-0">
        <div>
          <span className="text-xs font-semibold text-indigo-300">Code Studio</span>
          <span className="text-[10px] text-slate-500 ml-2">{files.length} files · edit before export</span>
        </div>
        <div className="flex gap-2">
          <button onClick={loadFiles} disabled={loading} className="px-2 py-1 text-[10px] rounded bg-[#1a1a2e] text-slate-400 hover:text-white">Refresh</button>
          <button onClick={save} disabled={loading || !dirty} className="px-2 py-1 text-[10px] rounded bg-indigo-700 text-white disabled:opacity-40">Save</button>
          <button onClick={downloadZip} disabled={!files.length} className="px-2 py-1 text-[10px] rounded bg-emerald-800 text-white disabled:opacity-40">Download ZIP</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-56 border-r border-[#1e1e2e] overflow-y-auto shrink-0 bg-[#0d0d14]">
          {files.map((f) => (
            <button
              key={f.path}
              onClick={() => openFile(f)}
              className={`w-full text-left px-2 py-1.5 text-[10px] font-mono truncate border-b border-[#1e1e2e]/50 ${
                activePath === f.path ? 'bg-indigo-900/30 text-indigo-200' : 'text-slate-500 hover:bg-[#1a1a2e]'
              }`}
              title={f.path}
            >
              {f.path}
            </button>
          ))}
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-3 py-1 text-[10px] font-mono text-slate-500 border-b border-[#1e1e2e] shrink-0 flex justify-between">
            <span>{activePath ?? '—'}</span>
            {dirty && <span className="text-amber-500">unsaved</span>}
          </div>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setDirty(true); }}
            spellCheck={false}
            className="flex-1 w-full resize-none bg-[#0a0a0f] text-slate-200 text-xs font-mono p-3 outline-none leading-relaxed"
            placeholder={loading ? 'Loading…' : 'Select a file'}
          />
          {active && (
            <div className="px-3 py-1 text-[10px] text-slate-600 border-t border-[#1e1e2e] shrink-0">
              {active.language} · {content.split('\n').length} lines
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
