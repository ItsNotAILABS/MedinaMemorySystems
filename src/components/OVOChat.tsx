'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import type { ChatMessage, ModelFamily, StructuredResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import WaveformVisualizer, { MicrophoneVisualizer } from './WaveformVisualizer';
import {
  oroSpeak,
  startListening,
  stopListening,
  setWaveformCallback,
  setRecognitionResultCallback,
  setListeningStateCallback,
  type ListeningState,
} from '@/lib/voiceEngine';

interface OVOChatProps {
  onTaskSubmit?: (task: string) => void;
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

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'system',
  content: `𓂀 Welcome to **NOVA OVO** — Sovereign Intelligence Platform.

I am **ORO**, your Primary Sovereign Intelligence. Speak to me using your microphone, or type commands:

• \`/memory find <query>\` — Search memory
• \`/govern list\` — List proposals
• \`/model invoke <model> <prompt>\` — Invoke model
• \`/organism status\` — View organism state
• \`/help\` — Full command reference

Press the **🎤 Mic** button to start voice conversation.`,
  timestamp: new Date().toISOString(),
};

const QUICK_COMMANDS = [
  { label: 'Memory', cmd: '/memory list' },
  { label: 'Gates', cmd: '/govern gates' },
  { label: 'Models', cmd: '/model list' },
  { label: 'Organism', cmd: '/organism status' },
];

export default function OVOChat({ onTaskSubmit }: OVOChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(new Array(64).fill(0));
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize voice callbacks
  useEffect(() => {
    setWaveformCallback((wf) => {
      setWaveform(wf);
      setIsSpeaking(wf.some(v => v > 0.1));
    });

    setRecognitionResultCallback((text, isFinal, confidence) => {
      if (isFinal && text.trim()) {
        setInterimTranscript('');
        void handleSend(text);
      } else {
        setInterimTranscript(text);
      }
    });

    setListeningStateCallback((state: ListeningState) => {
      setIsListening(state.isListening);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const loadingMsg: ChatMessage = {
      id: uuidv4(),
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
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json() as ChatMessage & { processingTime?: number };

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...data,
          id: data.id ?? uuidv4(),
          processing: false,
        },
      ]);

      // Speak the response if voice mode is active
      if (isListening && data.content) {
        await oroSpeak(data.content.slice(0, 200)); // Limit speech length
      }

      // Check if this is a task that should open the terminal
      if (content.toLowerCase().includes('task:') || 
          content.toLowerCase().startsWith('build ') ||
          content.toLowerCase().startsWith('create ') ||
          content.toLowerCase().startsWith('generate ')) {
        onTaskSubmit?.(content);
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: uuidv4(),
          role: 'assistant',
          content: 'Error: Failed to connect to NOVA OVO API.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, isListening, onTaskSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header with Voice Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">𓂀</span>
          <h1 className="text-sm font-semibold text-slate-200">ORO</h1>
          <span className="text-xs text-slate-500 ml-1">Sovereign Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            onClick={toggleListening}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              isListening
                ? 'bg-green-600/20 border border-green-500/50 text-green-400 animate-pulse'
                : 'bg-[#1e1e2e] border border-[#2d2d42] text-slate-400 hover:text-slate-200'
            )}
          >
            <span>{isListening ? '🎤' : '🎤'}</span>
            {isListening ? 'Listening...' : 'Voice'}
          </button>
          
          {/* Quick Commands */}
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.cmd}
              onClick={() => void handleSend(qc.cmd)}
              className="px-2 py-1 text-[10px] rounded bg-[#1e1e2e] text-slate-400 hover:bg-[#2a2a3e] hover:text-slate-200 transition-colors font-mono"
            >
              {qc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Visualizers */}
      {(isListening || isSpeaking) && (
        <div className="flex border-b border-[#1e1e2e] bg-[#0d0d15]">
          <div className="flex-1 px-4 py-2 border-r border-[#1e1e2e]">
            <MicrophoneVisualizer 
              isListening={isListening} 
              color="#10b981"
              height={32}
            />
            {interimTranscript && (
              <div className="mt-1 text-xs text-slate-500 font-mono truncate">
                {interimTranscript}
              </div>
            )}
          </div>
          <div className="flex-1 px-4 py-2">
            <WaveformVisualizer 
              waveform={waveform} 
              isActive={isSpeaking}
              color="#3b82f6"
              height={32}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
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
            placeholder={isListening ? "Listening for voice input..." : "Type a message or /command…"}
            rows={1}
            className={clsx(
              'w-full cmd-input rounded-lg px-4 py-3 pr-24 text-sm resize-none',
              'bg-[#12121a] border border-[#1e1e2e] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20',
              'text-slate-200 placeholder-slate-600 outline-none',
              'font-mono',
            )}
            style={{ minHeight: 48, maxHeight: 120 }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {input.trim() && (
              <span className="text-[10px] text-slate-600 font-mono">⏎</span>
            )}
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || loading}
              className={clsx(
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
          <span>⌘ Enter to send</span>
          <span>•</span>
          <span>Shift+Enter for newline</span>
          <span>•</span>
          <span>Type / for commands</span>
          <span>•</span>
          <span className={isListening ? 'text-green-400' : ''}>
            {isListening ? '🎤 Voice active' : 'Voice off'}
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (message.processing) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="w-6 h-6 rounded bg-[#1e1e2e] flex items-center justify-center text-xs shrink-0 mt-0.5">
          ⚡
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-3">
          <span className="text-blue-400 font-mono text-sm">
            Processing<span className="cursor-blink">▋</span>
          </span>
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-lg px-4 py-3 animate-fade-in">
        <div className="text-xs text-slate-500 mb-1.5 font-mono">SYSTEM</div>
        <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
          {formatContent(message.content)}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-2xl bg-blue-600/20 border border-blue-500/30 rounded-lg px-4 py-2.5">
          <div className="text-sm text-slate-200 font-mono whitespace-pre-wrap">{message.content}</div>
          <div className="text-[10px] text-slate-500 mt-1 text-right">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    );
  }

  const modelColor = message.modelUsed ? (MODEL_COLORS[message.modelUsed] ?? '#6b7280') : '#6b7280';

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div
        className="w-6 h-6 rounded shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
        style={{ background: modelColor }}
      >
        {message.modelUsed ? message.modelUsed[0].toUpperCase() : 'N'}
      </div>
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-1.5">
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
          {message.commandParsed?.valid && (
            <span className="text-[10px] font-mono text-slate-500">
              {message.commandParsed.raw}
            </span>
          )}
          <span className="text-[10px] text-slate-600">{formatTime(message.timestamp)}</span>
        </div>

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
      {truncated && <span className="text-slate-600">\n… ({lines.length - 12} more lines)</span>}
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
