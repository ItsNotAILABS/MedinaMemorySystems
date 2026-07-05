'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconPlay, IconTerminal } from '@/components/builder/BuilderIcons';

type ShellKind = 'powershell' | 'wsl' | 'bash';

interface TerminalLine {
  ts: string;
  shell: ShellKind;
  stream: 'stdout' | 'stderr' | 'system';
  text: string;
}

interface Props {
  sessionId?: string;
  shell?: ShellKind;
  onShellChange?: (shell: ShellKind) => void;
  onBuildAndRun?: () => void;
  building?: boolean;
}

const SHELL_LABELS: Record<ShellKind, { label: string; color: string }> = {
  powershell: { label: 'PowerShell', color: 'var(--mb-terminal-ps)' },
  wsl: { label: 'WSL', color: 'var(--mb-terminal-wsl)' },
  bash: { label: 'bash', color: 'var(--mb-text-secondary)' },
};

function defaultShell(): ShellKind {
  if (typeof window !== 'undefined' && navigator.userAgent.includes('Windows')) return 'powershell';
  return 'bash';
}

export default function BuilderLiveTerminal({
  sessionId = 'default',
  shell: shellProp,
  onShellChange,
  onBuildAndRun,
  building,
}: Props) {
  const [shellInternal, setShellInternal] = useState<ShellKind>(defaultShell);
  const shell = shellProp ?? shellInternal;
  const setShell = (s: ShellKind) => {
    setShellInternal(s);
    onShellChange?.(s);
  };
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pollLog = useCallback(async () => {
    try {
      const res = await fetch(`/api/terminal?action=log&sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success && data.data) setLines(data.data);
    } catch { /* local server only */ }
  }, [sessionId]);

  useEffect(() => {
    pollLog();
    const id = setInterval(pollLog, 1200);
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
    } finally {
      setRunning(false);
    }
  };

  const prompt = shell === 'powershell' ? 'PS' : shell === 'wsl' ? 'wsl' : '$';

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--mb-bg-panel)' }}>
      {/* Terminal chrome */}
      <div
        className="flex items-center gap-1 px-2 border-b shrink-0"
        style={{ borderColor: 'var(--mb-border)', height: 32 }}
      >
        <IconTerminal size={14} className="ml-1 opacity-50" />
        {(['powershell', 'wsl', 'bash'] as ShellKind[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setShell(s)}
            className="px-3 py-1 text-[11px] font-medium rounded-md transition-all"
            style={{
              color: shell === s ? SHELL_LABELS[s].color : 'var(--mb-text-faint)',
              background: shell === s ? 'var(--mb-bg-active)' : 'transparent',
            }}
          >
            {SHELL_LABELS[s].label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onBuildAndRun}
          disabled={building}
          className="mb-btn mb-btn-success text-[11px] py-1 mr-1"
        >
          <IconPlay size={12} />
          {building ? 'Building…' : 'Build & Run'}
        </button>
      </div>

      {/* Output */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 min-h-0 mb-mono text-[12px] leading-[1.6]"
        style={{ fontFamily: 'var(--font-jetbrains, var(--mb-font-mono))' }}
      >
        {lines.length === 0 && (
          <div style={{ color: 'var(--mb-text-faint)' }}>
            <span style={{ color: 'var(--mb-success)' }}>●</span> Terminal connected — commands execute on your machine
          </div>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.stream === 'stderr' ? 'var(--mb-danger)' :
                line.stream === 'system' ? SHELL_LABELS[line.shell]?.color ?? 'var(--mb-text-muted)' :
                'var(--mb-text-secondary)',
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-t shrink-0"
        style={{ borderColor: 'var(--mb-border)', background: 'var(--mb-bg-elevated)' }}
      >
        <span className="mb-mono text-[12px] font-semibold shrink-0" style={{ color: SHELL_LABELS[shell].color }}>
          {prompt} ›
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { exec(input); setInput(''); } }}
          disabled={running}
          placeholder="Run command on your PC…"
          className="flex-1 bg-transparent outline-none mb-mono text-[12px]"
          style={{ color: 'var(--mb-text-primary)', fontFamily: 'var(--font-jetbrains, var(--mb-font-mono))' }}
        />
      </div>
    </div>
  );
}
