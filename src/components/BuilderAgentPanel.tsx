'use client';

import { useState } from 'react';
import { IconAgent, IconSend } from '@/components/builder/BuilderIcons';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

interface Props {
  projectName?: string;
  onAsk: (prompt: string) => Promise<string[] | undefined>;
  loading?: boolean;
}

export default function BuilderAgentPanel({ projectName, onAsk, loading }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: 'I orchestrate real builds — files on disk, npm install, dev server, live preview. Tell me what to build.',
    },
  ]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: prompt }]);
    const suggestions = await onAsk(prompt);
    setMessages((m) => [
      ...m,
      {
        role: 'agent',
        text: suggestions?.join('\n\n') ?? 'Create a project, then ask me to build and run it.',
      },
    ]);
  };

  return (
    <aside
      className="flex flex-col h-full border-l"
      style={{ background: 'var(--mb-bg-surface)', borderColor: 'var(--mb-border)', width: 'var(--mb-agent-w)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ borderColor: 'var(--mb-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--mb-agent-muted)' }}
          >
            <IconAgent size={14} className="text-[var(--mb-agent)]" />
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--mb-text-primary)' }}>New Agent</div>
            <div className="text-[10px]" style={{ color: 'var(--mb-text-faint)' }}>Medina · Auto</div>
          </div>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'var(--mb-agent-muted)', color: 'var(--mb-agent)' }}
        >
          Auto
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className="mb-fade-in">
            <div className="text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--mb-text-faint)' }}>
              {msg.role === 'user' ? 'You' : 'Agent'}
            </div>
            <div
              className="text-[13px] leading-relaxed rounded-lg px-3 py-2.5 whitespace-pre-wrap"
              style={{
                color: msg.role === 'user' ? 'var(--mb-text-primary)' : 'var(--mb-text-secondary)',
                background: msg.role === 'user' ? 'var(--mb-bg-elevated)' : 'transparent',
                border: msg.role === 'user' ? '1px solid var(--mb-border)' : 'none',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[12px] mb-pulse" style={{ color: 'var(--mb-agent)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Orchestrating build…
          </div>
        )}
      </div>

      {/* Composer — Cursor style */}
      <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--mb-border)' }}>
        {projectName && (
          <div className="text-[11px] mb-2 font-mono truncate" style={{ color: 'var(--mb-text-faint)' }}>
            @{projectName}
          </div>
        )}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--mb-bg-elevated)', border: '1px solid var(--mb-border-strong)', boxShadow: 'var(--mb-shadow-panel)' }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Plan, Build, / for skills, @ for context"
            rows={3}
            className="w-full bg-transparent px-4 py-3 text-[13px] outline-none resize-none leading-relaxed"
            style={{ color: 'var(--mb-text-primary)' }}
          />
          <div
            className="flex items-center justify-between px-3 py-2 border-t"
            style={{ borderColor: 'var(--mb-border)', background: 'var(--mb-bg-panel)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] px-2.5 py-1 rounded-md font-medium" style={{ background: 'var(--mb-accent-muted)', color: 'var(--mb-accent)' }}>
                Agent
              </span>
              <span className="text-[11px]" style={{ color: 'var(--mb-text-faint)' }}>Auto</span>
            </div>
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: 'var(--mb-accent)', color: 'white' }}
            >
              <IconSend size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
