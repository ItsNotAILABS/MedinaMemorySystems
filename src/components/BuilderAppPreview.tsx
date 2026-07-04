'use client';

import { useState } from 'react';

interface Props {
  url: string | null;
  loading?: boolean;
  projectDir?: string;
}

export default function BuilderAppPreview({ url, loading, projectDir }: Props) {
  const [key, setKey] = useState(0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-[#858585]">
        <div className="w-8 h-8 border-2 border-[#007acc] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Building app… npm install · starting dev server</p>
        {projectDir && <p className="text-[10px] font-mono mt-2 text-[#6e7681]">{projectDir}</p>}
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-[#858585] p-6 text-center">
        <p className="text-sm mb-2">Live App Preview</p>
        <p className="text-xs max-w-md">
          Create a project → click <strong className="text-[#4ec9b0]">Build & Run App</strong> in the terminal.
          Your app runs locally and appears here — same as running in Cursor PowerShell.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#2d2d2d] bg-[#252526] shrink-0">
        <span className="text-[10px] text-[#858585]">Preview</span>
        <input
          readOnly
          value={url}
          className="flex-1 bg-[#3c3c3c] border border-[#3c3c3c] rounded px-2 py-0.5 text-[11px] text-[#cccccc] font-mono"
        />
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="px-2 py-0.5 text-[10px] bg-[#37373d] rounded hover:bg-[#4f4f4f]"
        >
          Reload
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-0.5 text-[10px] bg-[#007acc] text-white rounded hover:bg-[#1c8ad9]"
        >
          Open ↗
        </a>
      </div>
      <iframe
        key={key}
        src={url}
        title="App Preview"
        className="flex-1 w-full border-0 bg-white min-h-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
