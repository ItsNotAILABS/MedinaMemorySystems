'use client';

import { useCallback, useEffect, useState } from 'react';
import { downloadFilesAsZip } from '@/lib/zipDownload';
import type { GeneratedFile } from '@/types/appBuilder';
import { IconCode } from '@/components/builder/BuilderIcons';

interface Props {
  projectId: string | null;
  projectName: string;
  onLog: (msg: string) => void;
  onChangesUpdate?: (paths: string[]) => void;
}

function extIcon(path: string): string {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.md')) return 'md';
  return 'file';
}

const EXT_COLORS: Record<string, string> = {
  tsx: '#61dafb', ts: '#3178c6', json: '#f1c40f', css: '#563d7c', md: '#519aba', file: '#71717a',
};

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
  useEffect(() => { onChangesUpdate?.(Array.from(modified)); }, [modified, onChangesUpdate]);

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
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ background: 'var(--mb-bg-panel)' }}>
        <IconCode size={32} className="opacity-20" />
        <p className="text-[13px]" style={{ color: 'var(--mb-text-muted)' }}>Select a project to open the editor</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--mb-bg-panel)' }}>
      {/* Breadcrumb bar */}
      <div
        className="flex items-center justify-between px-3 shrink-0 border-b"
        style={{ height: 32, borderColor: 'var(--mb-border)', background: 'var(--mb-bg-elevated)' }}
      >
        <div className="flex items-center gap-2 text-[11px] truncate">
          {activePath && (
            <>
              <span style={{ color: EXT_COLORS[extIcon(activePath)] }}>{extIcon(activePath)}</span>
              <span style={{ color: 'var(--mb-text-secondary)' }}>{activePath}</span>
              {dirty && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--mb-warning)' }} />}
            </>
          )}
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={save} disabled={!dirty || loading} className="mb-btn mb-btn-ghost text-[10px] py-1">Save</button>
          <button type="button" onClick={downloadZip} className="mb-btn mb-btn-ghost text-[10px] py-1">Export</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File tree */}
        <aside
          className="w-56 shrink-0 overflow-y-auto border-r py-1"
          style={{ borderColor: 'var(--mb-border)', background: 'var(--mb-bg-surface)' }}
        >
          <div className="mb-panel-header border-0 py-2">Explorer</div>
          {files.map((f) => {
            const ext = extIcon(f.path);
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => openFile(f)}
                className="w-full flex items-center gap-2 px-3 py-1 text-[11px] transition-colors"
                style={{
                  color: activePath === f.path ? 'var(--mb-text-primary)' : 'var(--mb-text-muted)',
                  background: activePath === f.path ? 'var(--mb-bg-active)' : 'transparent',
                  fontFamily: 'var(--font-jetbrains, var(--mb-font-mono))',
                }}
              >
                <span style={{ color: EXT_COLORS[ext], fontSize: 9, fontWeight: 700 }}>{ext}</span>
                <span className="truncate">{f.path.split('/').pop()}</span>
                {modified.has(f.path) && <span className="ml-auto text-[9px]" style={{ color: 'var(--mb-warning)' }}>M</span>}
              </button>
            );
          })}
        </aside>

        {/* Editor */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <div
            className="w-11 shrink-0 text-right pr-3 pt-4 select-none text-[12px] leading-6"
            style={{ color: 'var(--mb-text-faint)', fontFamily: 'var(--font-jetbrains, var(--mb-font-mono))', background: 'var(--mb-bg-panel)' }}
          >
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setDirty(true); }}
            spellCheck={false}
            className="flex-1 resize-none pt-4 pl-1 outline-none text-[13px] leading-6"
            style={{
              color: 'var(--mb-text-primary)',
              background: 'var(--mb-bg-panel)',
              fontFamily: 'var(--font-jetbrains, var(--mb-font-mono))',
              caretColor: 'var(--mb-accent)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
