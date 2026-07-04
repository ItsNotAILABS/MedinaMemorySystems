'use client';

import { useCallback, useEffect, useState } from 'react';
import { downloadFilesAsZip } from '@/lib/zipDownload';
import type { GeneratedFile } from '@/types/appBuilder';

interface Props {
  projectId: string | null;
  projectName: string;
  onLog: (msg: string) => void;
  onChangesUpdate?: (paths: string[]) => void;
}

function langIcon(path: string): string {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'TS';
  if (path.endsWith('.json')) return '{}';
  if (path.endsWith('.css')) return '#';
  if (path.endsWith('.md')) return 'M↓';
  if (path.endsWith('.sh')) return '$';
  if (path.endsWith('.js')) return 'JS';
  return '◇';
}

export default function BuilderCodeStudio({ projectId, projectName, onLog, onChangesUpdate }: Props) {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modified, setModified] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    onChangesUpdate?.(Array.from(modified));
  }, [modified, onChangesUpdate]);

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
        setModified((m) => new Set([...m, activePath]));
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
    downloadFilesAsZip(
      files.map((f) => ({ path: f.path, content: f.path === activePath && dirty ? content : f.content })),
      slug,
    );
    onLog(`downloaded ${slug}.zip`);
  };

  const lines = content.split('\n');

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-[#858585] text-sm">
        Select or create a project in the sidebar
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Editor tabs */}
      <div className="flex items-center bg-[#252526] border-b border-[#2d2d2d] shrink-0 overflow-x-auto">
        {activePath && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] border-r border-[#2d2d2d] text-[11px] text-[#cccccc]">
            <span className="text-[#519aba]">{langIcon(activePath)}</span>
            <span>{activePath.split('/').pop()}</span>
            {dirty && <span className="w-2 h-2 rounded-full bg-white/80" />}
          </div>
        )}
        <div className="ml-auto flex gap-1 px-2">
          <button type="button" onClick={save} disabled={loading || !dirty} className="px-2 py-0.5 text-[10px] text-[#cccccc] hover:bg-[#37373d] rounded disabled:opacity-40">Save</button>
          <button type="button" onClick={downloadZip} disabled={!files.length} className="px-2 py-0.5 text-[10px] text-[#cccccc] hover:bg-[#37373d] rounded">Export ZIP</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Explorer */}
        <aside className="w-52 border-r border-[#2d2d2d] overflow-y-auto shrink-0 bg-[#252526]">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
            Explorer
          </div>
          {files.map((f) => (
            <button
              key={f.path}
              type="button"
              onClick={() => openFile(f)}
              className={`w-full flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono truncate ${
                activePath === f.path ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
              title={f.path}
            >
              <span className="text-[9px] text-[#519aba] w-4 shrink-0">{langIcon(f.path)}</span>
              <span className="truncate">{f.path}</span>
              {modified.has(f.path) && <span className="text-[#e2c08d] ml-auto">M</span>}
            </button>
          ))}
        </aside>

        {/* Editor */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <div className="w-10 shrink-0 bg-[#1e1e1e] text-right pr-2 pt-3 text-[11px] font-mono text-[#858585] select-none overflow-hidden">
            {lines.map((_, i) => (
              <div key={i} className="leading-[1.5rem] h-6">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setDirty(true); }}
            spellCheck={false}
            className="flex-1 resize-none bg-[#1e1e1e] text-[#d4d4d4] text-[13px] font-mono leading-6 pt-3 pl-2 outline-none caret-white"
            placeholder={loading ? 'Loading…' : ''}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-0.5 bg-[#007acc] text-[11px] text-white shrink-0">
        <span>{activePath ?? '—'}</span>
        <span>Ln {lines.length}, Col 1 · UTF-8 · {files.find((f) => f.path === activePath)?.language ?? 'typescript'}</span>
      </div>
    </div>
  );
}
