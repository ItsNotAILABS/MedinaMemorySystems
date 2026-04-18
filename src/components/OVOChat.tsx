'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { ChatMessage, ModelFamily, StructuredResponse, UlriScore, UlriConsensusInfo } from '@/types';
import { sovereignId } from '@/lib/sovereign-id';

interface EnhancedChatMessage extends ChatMessage {
  ulriScores?: UlriScore[];
  consensus?: UlriConsensusInfo;
  routingLatency?: number;
}

const MODEL_COLORS: Record<string, string> = {
  strategist: '#3b82f6',
  builder: '#10b981',
  analyst: '#6366f1',
  governance: '#f59e0b',
  'memory-curator': '#8b5cf6',
  operations: '#ec4899',
  risk: '#ef4444',
  projection: '#06b6d4',
};

const WELCOME_MESSAGE: EnhancedChatMessage = {
  id: 'welcome',
  role: 'system',
  content: `Welcome to **NOVA OVO** — Sovereign Intelligence Platform.

Powered by **ULRI** — Unified Layered Routing Intelligence (MEDINA Sovereign). Your messages are scored across three sovereign layers: keyword affinity, organism resonance, and gate weight — then routed to the optimal model.

**Commands:**
• \`/memory find <query>\` — Search memory
• \`/govern list\` — List proposals
• \`/model list\` — List model families
• \`/organism status\` — View organism state
• \`/help\` — Full command reference

Toggle **Consensus Mode** for multi-model intelligence synthesis.`,
  timestamp: new Date().toISOString(),
};

const QUICK_COMMANDS = [
  { label: 'Memory', cmd: '/memory list', icon: '🧠' },
  { label: 'Gates', cmd: '/govern gates', icon: '⚖️' },
  { label: 'Models', cmd: '/model list', icon: '⚡' },
  { label: 'Organism', cmd: '/organism status', icon: '◉' },
];

export default function OVOChat() {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [consensusMode, setConsensusMode] = useState(false);
  const [showRouting, setShowRouting] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: EnhancedChatMessage = {
      id: sovereignId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const loadingMsg: EnhancedChatMessage = {
      id: sovereignId(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      processing: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, useConsensus: consensusMode }),
      });
      const data = await res.json() as EnhancedChatMessage & { processingTime?: number };

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...data,
          id: data.id ?? sovereignId(),
          processing: false,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: sovereignId(),
          role: 'assistant',
          content: 'Error: Failed to connect to NOVA OVO API.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, consensusMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">💬</span>
          <h1 className="text-sm font-semibold text-slate-200">OVO Chat</h1>
          <span className="text-[10px] text-slate-500 font-mono ml-1">ULRI (MEDINA Sovereign)</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Consensus toggle */}
          <button
            onClick={() => setConsensusMode(!consensusMode)}
            className={cls(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all',
              consensusMode
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'bg-[#1e1e2e] text-slate-500 border border-transparent hover:text-slate-300',
            )}
          >
            <span className={cls('w-1.5 h-1.5 rounded-full transition-colors', consensusMode ? 'bg-blue-400' : 'bg-slate-600')} />
            Consensus {consensusMode ? 'ON' : 'OFF'}
          </button>
          {/* Quick commands */}
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.cmd}
              onClick={() => void handleSend(qc.cmd)}
              className="px-2 py-1 text-[10px] rounded bg-[#1e1e2e] text-slate-400 hover:bg-[#2a2a3e] hover:text-slate-200 transition-colors font-mono flex items-center gap-1"
            >
              <span>{qc.icon}</span>
              {qc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showRoutingId={showRouting}
            onToggleRouting={(id) => setShowRouting(showRouting === id ? null : id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-[#1e1e2e] bg-[#0d0d15]">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={consensusMode ? 'Multi-model consensus mode… Type a message or /command' : 'Type a message or /command…'}
            rows={1}
            className={cls(
              'w-full cmd-input rounded-lg px-4 py-3 pr-28 text-sm resize-none',
              'bg-[#12121a] border focus:ring-1 outline-none font-mono',
              'text-slate-200 placeholder-slate-600',
              consensusMode
                ? 'border-blue-500/30 focus:border-blue-500 focus:ring-blue-500/20'
                : 'border-[#1e1e2e] focus:border-blue-500 focus:ring-blue-500/20',
            )}
            style={{ minHeight: 48, maxHeight: 120 }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {consensusMode && (
              <span className="text-[9px] text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-500/10">
                3x
              </span>
            )}
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || loading}
              className={cls(
                'px-3 py-1.5 rounded text-sm font-medium transition-all',
                input.trim() && !loading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-[#1e1e2e] text-slate-600 cursor-not-allowed',
              )}
            >
              {loading ? '…' : '→'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600">
          <span>Enter to send</span>
          <span>•</span>
          <span>Shift+Enter for newline</span>
          <span>•</span>
          <span>Type / for commands</span>
          {consensusMode && (
            <>
              <span>•</span>
              <span className="text-blue-400">Consensus: top 3 models synthesized</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  showRoutingId,
  onToggleRouting,
}: {
  message: EnhancedChatMessage;
  showRoutingId: string | null;
  onToggleRouting: (id: string) => void;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const showRouting = showRoutingId === message.id;

  if (message.processing) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="w-7 h-7 rounded-lg bg-[#1e1e2e] flex items-center justify-center text-xs shrink-0 mt-0.5">
          <span className="animate-pulse">⚡</span>
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-3">
          <span className="text-blue-400 font-mono text-sm">
            ULRI sovereign routing<span className="cursor-blink">▋</span>
          </span>
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-lg px-4 py-3 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">SYSTEM</span>
        </div>
        <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
          {formatContent(message.content)}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-2xl bg-blue-600/15 border border-blue-500/25 rounded-lg px-4 py-2.5">
          <div className="text-sm text-slate-200 font-mono whitespace-pre-wrap">{message.content}</div>
          <div className="text-[10px] text-slate-500 mt-1 text-right">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    );
  }

  const modelColor = message.modelUsed ? (MODEL_COLORS[message.modelUsed] ?? '#6b7280') : '#6b7280';
  const hasUlri = message.ulriScores && message.ulriScores.length > 0;

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div
        className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold text-white"
        style={{ background: modelColor, boxShadow: `0 0 8px ${modelColor}40` }}
      >
        {message.modelUsed ? message.modelUsed[0].toUpperCase() : 'N'}
      </div>
      <div className="flex-1 max-w-3xl">
        {/* Model label and routing info */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {message.modelUsed && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                color: modelColor,
                background: `${modelColor}18`,
                border: `1px solid ${modelColor}30`,
              }}
            >
              {message.modelUsed}
            </span>
          )}
          {message.consensus && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              consensus {(message.consensus.agreementScore * 100).toFixed(0)}%
              <span className="text-blue-300 ml-1">
                [{message.consensus.models.map((m) => m[0].toUpperCase()).join('+')}]
              </span>
            </span>
          )}
          {message.routingLatency !== undefined && (
            <span className="text-[10px] text-slate-600 font-mono">{message.routingLatency}ms</span>
          )}
          {hasUlri && (
            <button
              onClick={() => onToggleRouting(message.id)}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e2e] text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showRouting ? '▾ ULRI' : '▸ ULRI'}
            </button>
          )}
          {message.commandParsed?.valid && (
            <span className="text-[10px] font-mono text-slate-500">
              {message.commandParsed.raw}
            </span>
          )}
          <span className="text-[10px] text-slate-600">{formatTime(message.timestamp)}</span>
        </div>

        {/* ULRI Routing visualization */}
        {showRouting && hasUlri && (
          <div className="mb-2 bg-[#0a0a12] border border-[#1e1e2e] rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-500 font-mono mb-2">ULRI Sovereign Routing — (Kw×0.45 + Org×0.30 + Gate×0.25)</div>
            {message.ulriScores!.map((score) => {
              const color = MODEL_COLORS[score.modelId] ?? '#6b7280';
              const pct = Math.min(100, score.compositeScore * 500);
              return (
                <div key={score.modelId} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono w-20 shrink-0" style={{ color }}>{score.modelId}</span>
                  <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 w-10 text-right">
                    {(score.compositeScore * 100).toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Response content */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-3">
          {message.structuredResponse ? (
            <StructuredResponseView response={message.structuredResponse} />
          ) : (
            <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StructuredResponseView({ response }: { response: StructuredResponse }) {
  const TYPE_COLORS: Record<string, string> = {
    memory: '#8b5cf6',
    governance: '#10b981',
    model: '#3b82f6',
    company: '#ec4899',
    organism: '#f59e0b',
    help: '#06b6d4',
    error: '#ef4444',
    info: '#6b7280',
  };

  const color = TYPE_COLORS[response.type] ?? '#6b7280';

  return (
    <div>
      <div
        className="text-xs font-mono mb-2 px-1.5 py-0.5 rounded inline-block"
        style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {response.type.toUpperCase()}
      </div>
      <div className="text-sm text-slate-200 font-mono mb-2">{response.title}</div>
      <DataPreview data={response.data} />
    </div>
  );
}

function DataPreview({ data }: { data: unknown }) {
  if (!data || (typeof data === 'object' && Object.keys(data as object).length === 0)) return null;

  const str = JSON.stringify(data, null, 2);
  const lines = str.split('\n');
  const preview = lines.slice(0, 12).join('\n');
  const truncated = lines.length > 12;

  return (
    <pre className="text-[11px] text-slate-400 bg-[#0a0a0f] rounded p-2 overflow-x-auto max-h-48 overflow-y-auto font-mono leading-relaxed">
      {preview}
      {truncated && <span className="text-slate-600">{'\n'}… ({lines.length - 12} more lines)</span>}
    </pre>
  );
}

function formatContent(content: string): React.ReactNode {
  return content.split('\n').map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-[#1e1e2e] px-1 rounded text-blue-300">$1</code>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < content.split('\n').length - 1 && '\n'}
      </span>
    );
  });
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
