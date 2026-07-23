'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  lines: string[];
  onCommand?: (cmd: string) => void;
}

export default function BuilderTerminal({ lines, onCommand }: Props) {
  const [tab, setTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
  const [sessions] = useState(['powershell', 'wsl', 'builder']);
  const [activeSession, setActiveSession] = useState(0);
  const [input, setInput] = useState('');
  const [localLines, setLocalLines] = useState<string[]>([
    'PS C:\\Users\\Medin\\MedinaMemorySystems> npm run builder:dev',
    '',
    '> medina-builder@1.0.0 dev',
    '> next dev -p 3001',
    '',
    '  ▲ Next.js 15.5.20',
    '  - Local:   http://localhost:3001',
    '',
    ' ✓ Ready',
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localLines, lines]);

  const run = () => {
    if (!input.trim()) return;
    const cmd = input.trim();
    setLocalLines((l) => [...l, `> ${cmd}`]);
    onCommand?.(cmd);
    if (cmd === 'clear') setLocalLines([]);
    else if (cmd.startsWith('npm run')) {
      setLocalLines((l) => [...l, '', `Running ${cmd}…`, '']);
    }
    setInput('');
  };

  const allLines = tab === 'output' ? lines : localLines;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc]">
      <div className="flex items-center border-b border-[#2d2d2d] shrink-0">
        {(['terminal', 'output', 'problems'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-[11px] capitalize border-b-2 ${
              tab === t ? 'border-[#007acc] text-white' : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 px-2">
          {sessions.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSession(i)}
              className={`px-2 py-0.5 text-[10px] rounded ${
                activeSession === i ? 'bg-[#37373d] text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
        {allLines.map((line, i) => (
          <div key={i} className={line.startsWith('✓') ? 'text-[#4ec9b0]' : line.startsWith('>') ? 'text-[#569cd6]' : ''}>
            {line || '\u00A0'}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {tab === 'terminal' && (
        <div className="flex items-center border-t border-[#2d2d2d] px-2 py-1 shrink-0">
          <span className="text-[#569cd6] mr-2 shrink-0">
            {activeSession === 1 ? 'MESIE@CommandCenter:~$' : 'PS>'}
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            className="flex-1 bg-transparent outline-none text-[11px] font-mono"
            placeholder="Enter command…"
          />
        </div>
      )}
    </div>
  );
}
