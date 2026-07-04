'use client';

import { useState } from 'react';

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
      text: 'Medina Agent ready. Plan, build, and deploy — describe your app or ask about templates, ICP, tokens, and deploy targets.',
    },
  ]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: prompt }]);
    const suggestions = await onAsk(prompt);
    if (suggestions?.length) {
      setMessages((m) => [...m, { role: 'agent', text: suggestions.join('\n\n') }]);
    } else {
      setMessages((m) => [...m, { role: 'agent', text: 'Select a project first, or try: "SaaS CRUD on Vercel" or "token launcher on ICP".' }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] border-l border-[#2d2d2d]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d2d] shrink-0">
        <span className="text-xs font-semibold text-[#cccccc]">New Agent</span>
        <span className="text-[10px] text-[#858585]">Auto</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-xs leading-relaxed ${msg.role === 'user' ? 'text-[#9cdcfe]' : 'text-[#cccccc]'}`}>
            {msg.role === 'user' && <span className="text-[10px] text-[#858585] block mb-0.5">You</span>}
            {msg.role === 'agent' && <span className="text-[10px] text-[#858585] block mb-0.5">Agent</span>}
            <div className="whitespace-pre-wrap">{msg.text}</div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-[#858585] animate-pulse">Thinking…</div>}
      </div>

      <div className="p-3 border-t border-[#2d2d2d] shrink-0">
        {projectName && (
          <div className="text-[10px] text-[#858585] mb-2 truncate">@{projectName}</div>
        )}
        <div className="rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Plan, Build, / for skills, @ for context"
            rows={3}
            className="w-full bg-transparent px-3 py-2 text-xs text-[#cccccc] outline-none resize-none placeholder:text-[#6e7681]"
          />
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#3c3c3c]">
            <div className="flex gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#37373d] text-[#cccccc]">Agent</span>
              <span className="text-[10px] px-2 py-0.5 text-[#858585]">Auto</span>
            </div>
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-1 rounded bg-[#007acc] text-white disabled:opacity-40 hover:bg-[#1c8ad9]"
              title="Send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
