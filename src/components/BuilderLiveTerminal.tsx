'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ShellKind = 'powershell' | 'wsl' | 'bash';

interface TerminalLine {
  ts: string;
  shell: ShellKind;
  stream: 'stdout' | 'stderr' | 'system';
  text: string;
}

interface Props {
  sessionId?: string;
  onBuildAndRun?: () => void;
  building?: boolean;
}

export default function BuilderLiveTerminal({ sessionId = 'default', onBuildAndRun, building }: Props) {
  const [shell, setShell] = useState<ShellKind>(typeof window !== 'undefined' && navigator.userAgent.includes('Windows') ? 'powershell' : 'bash');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pollLog = useCallback(async () => {
    try {
      const res = await fetch(`/api/terminal?action=log&sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success && data.data) setLines(data.data);
    } catch { /* server-only */ }
  }, [sessionId]);

  useEffect(() => {
    pollLog();
    const id = setInterval(pollLog, 1500);
    return () => clearInterval(id);
  }, [pollLog]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const exec = async (command: string) => {
    if (!command.trim() || running) return;
    setRunning(true);
    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exec', command, shell, sessionId }),
      });
      const data = await res.json();
      if (data.success) await pollLog();
      else {
        setLines((l) => [...l, {
          ts: new Date().toISOString(),
          shell,
          stream: 'stderr',
          text: data.error ?? data.data?.stderr ?? 'Command failed',
        }]);
      }
    } catch (e) {
      setLines((l) => [...l, {
        ts: new Date().toISOString(),
        shell,
        stream: 'stderr',
        text: `Terminal API unavailable — run medina-builder locally (npm run builder:dev). ${e}`,
      }]);
    } finally {
      setRunning(false);
    }
  };

  const prompt = shell === 'powershell' ? 'PS>' : shell === 'wsl' ? 'wsl $' : '$';

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-[11px]">
      <div className="flex items-center border-b border-[#2d2d2d] shrink-0 bg-[#252526]">
        {(['powershell', 'wsl', 'bash'] as ShellKind[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setShell(s)}
            className={`px-3 py-1 capitalize border-r border-[#2d2d2d] ${
              shell === s ? 'bg-[#1e1e1e] text-white border-b-2 border-b-[#007acc]' : 'text-[#858585]'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={onBuildAndRun}
          disabled={building}
          className="ml-2 px-3 py-1 bg-[#238636] text-white rounded text-[10px] disabled:opacity-50 hover:bg-[#2ea043]"
        >
          {building ? 'Building…' : '▶ Build & Run App'}
        </button>
        <button
          type="button"
          onClick={async () => {
            await fetch('/api/terminal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'clear', sessionId }),
            });
            setLines([]);
            pollLog();
          }}
          className="ml-auto px-2 py-1 text-[#858585] hover:text-white text-[10px]"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 leading-relaxed min-h-0">
        {lines.length === 0 && (
          <div className="text-[#858585]">
            Real terminal — commands run on your machine via medina-builder server.
            <br />
            Try: npm run builder:dev · cd generated\your-app · npm install
          </div>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.stream === 'stderr' ? 'text-[#f48771]' :
              line.stream === 'system' ? 'text-[#569cd6]' :
              'text-[#cccccc]'
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center border-t border-[#2d2d2d] px-2 py-1 shrink-0 bg-[#1e1e1e]">
        <span className="text-[#569cd6] mr-2 shrink-0">{prompt}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              exec(input);
              setInput('');
            }
          }}
          disabled={running}
          placeholder="Enter command — runs real PowerShell / WSL / bash on your PC"
          className="flex-1 bg-transparent outline-none text-[#cccccc] placeholder:text-[#6e7681]"
        />
      </div>
    </div>
  );
}
