'use client';

import { useState } from 'react';
import { IconGlobe, IconPlay } from '@/components/builder/BuilderIcons';

interface Props {
  url: string | null;
  loading?: boolean;
  projectDir?: string;
}

export default function BuilderAppPreview({ url, loading, projectDir }: Props) {
  const [key, setKey] = useState(0);
  const [inputUrl, setInputUrl] = useState(url ?? '');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: 'var(--mb-bg-base)' }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--mb-accent)', borderTopColor: 'transparent' }}
        />
        <div className="text-center">
          <p className="text-[14px] font-medium" style={{ color: 'var(--mb-text-primary)' }}>Building your app</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--mb-text-muted)' }}>Writing files · npm install · starting dev server</p>
          {projectDir && <p className="text-[11px] mt-2 font-mono" style={{ color: 'var(--mb-text-faint)' }}>{projectDir}</p>}
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center" style={{ background: 'var(--mb-bg-base)' }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'var(--mb-accent-muted)' }}
        >
          <IconGlobe size={28} className="text-[var(--mb-accent)]" />
        </div>
        <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--mb-text-primary)' }}>Live App Preview</h3>
        <p className="text-[13px] max-w-sm leading-relaxed" style={{ color: 'var(--mb-text-muted)' }}>
          Your generated app runs locally and appears here — the same way Cursor runs localhost after{' '}
          <code className="px-1.5 py-0.5 rounded text-[11px]" style={{ background: 'var(--mb-bg-elevated)' }}>npm run dev</code>
        </p>
        <div className="flex items-center gap-2 mt-6 text-[12px]" style={{ color: 'var(--mb-text-faint)' }}>
          <IconPlay size={12} />
          Click Build & Run to launch
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--mb-bg-base)' }}>
      {/* Browser chrome — Cursor-style */}
      <div
        className="flex items-center gap-2 px-3 shrink-0 border-b"
        style={{ height: 40, borderColor: 'var(--mb-border)', background: 'var(--mb-bg-elevated)' }}
      >
        <div className="flex gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-mono"
          style={{ background: 'var(--mb-bg-input)', border: '1px solid var(--mb-border)' }}
        >
          <IconGlobe size={12} className="opacity-40 shrink-0" />
          <input
            value={inputUrl || url}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: 'var(--mb-text-secondary)' }}
          />
        </div>
        <button type="button" onClick={() => setKey((k) => k + 1)} className="mb-btn mb-btn-ghost text-[10px] py-1">Reload</button>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mb-btn mb-btn-primary text-[10px] py-1">Open ↗</a>
      </div>
      <iframe
        key={key}
        src={url}
        title="Live Preview"
        className="flex-1 w-full border-0 min-h-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
