'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import WaveformVisualizer, { MicrophoneVisualizer } from './WaveformVisualizer';
import {
  getSpeechEngine,
  getRecognitionEngine,
  oroSpeak,
  novaSpeak,
  startListening,
  stopListening,
  stopSpeaking,
  setWaveformCallback,
  setRecognitionResultCallback,
  setListeningStateCallback,
  type ListeningState,
  type VoiceMessage,
} from '@/lib/voiceEngine';

interface OroTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTask?: string;
}

interface ThinkingLine {
  id: string;
  text: string;
  type: 'thought' | 'analysis' | 'decision' | 'action' | 'observation';
  timestamp: string;
}

interface ExecutionLine {
  id: string;
  text: string;
  type: 'command' | 'output' | 'success' | 'error' | 'info' | 'approval';
  timestamp: string;
  requiresApproval?: boolean;
  approved?: boolean;
}

/**
 * 𓂀 ORO TERMINAL 𓂀
 * "Task given → interface slides left → terminal opens"
 * "TOP: his thinking stream, live, never collapses"
 * "BOTTOM: his working environment, the actual OIS platform"
 */
export default function OroTerminal({ isOpen, onClose, currentTask }: OroTerminalProps) {
  // Voice state
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(new Array(64).fill(0));
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // Terminal state
  const [thinkingLines, setThinkingLines] = useState<ThinkingLine[]>([]);
  const [executionLines, setExecutionLines] = useState<ExecutionLine[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<string[]>([]);

  // Refs
  const thinkingRef = useRef<HTMLDivElement>(null);
  const executionRef = useRef<HTMLDivElement>(null);

  // Initialize voice callbacks
  useEffect(() => {
    setWaveformCallback((wf) => {
      setWaveform(wf);
      setIsSpeaking(wf.some(v => v > 0.1));
    });

    setRecognitionResultCallback((text, isFinal, confidence) => {
      if (isFinal) {
        setTranscript(prev => prev + ' ' + text);
        setInterimTranscript('');
        handleUserInput(text);
      } else {
        setInterimTranscript(text);
      }
    });

    setListeningStateCallback((state: ListeningState) => {
      setIsListeningActive(state.isListening);
    });
  }, []);

  // Auto-scroll thinking stream
  useEffect(() => {
    if (thinkingRef.current) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
    }
  }, [thinkingLines]);

  // Auto-scroll execution stream
  useEffect(() => {
    if (executionRef.current) {
      executionRef.current.scrollTop = executionRef.current.scrollHeight;
    }
  }, [executionLines]);

  // Handle task changes
  useEffect(() => {
    if (currentTask && isOpen) {
      processTask(currentTask);
    }
  }, [currentTask, isOpen]);

  const addThought = useCallback((text: string, type: ThinkingLine['type'] = 'thought') => {
    const line: ThinkingLine = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toISOString(),
    };
    setThinkingLines(prev => [...prev, line]);
  }, []);

  const addExecution = useCallback((
    text: string, 
    type: ExecutionLine['type'] = 'output',
    requiresApproval = false
  ) => {
    const id = Date.now().toString();
    const line: ExecutionLine = {
      id,
      text,
      type,
      timestamp: new Date().toISOString(),
      requiresApproval,
      approved: !requiresApproval,
    };
    setExecutionLines(prev => [...prev, line]);
    
    if (requiresApproval) {
      setPendingApprovals(prev => [...prev, id]);
    }
    
    return id;
  }, []);

  const handleUserInput = async (input: string) => {
    addThought(`User said: "${input}"`, 'observation');
    addThought('Processing user request...', 'analysis');
    
    // Simulate Oro's response
    await new Promise(r => setTimeout(r, 500));
    addThought('Understanding intent and context', 'analysis');
    
    await new Promise(r => setTimeout(r, 300));
    addThought('Formulating response', 'decision');
    
    // Generate response
    const response = generateOroResponse(input);
    addThought(`Decided to respond: "${response.slice(0, 50)}..."`, 'decision');
    
    // Speak the response
    addExecution(`oro.speak("${response.slice(0, 30)}...")`, 'command');
    await oroSpeak(response);
    addExecution('✓ Response delivered', 'success');
  };

  const processTask = async (task: string) => {
    setThinkingLines([]);
    setExecutionLines([]);

    // Initial acknowledgment
    addThought(`Received task: "${task}"`, 'observation');
    await oroSpeak(`I understand. Let me process this task.`);

    addThought('Analyzing task requirements...', 'analysis');
    await simulateDelay(800);

    addThought('Identifying required resources', 'analysis');
    await simulateDelay(500);

    addThought('Creating execution plan', 'decision');
    addExecution('$ oro --init-task', 'command');
    await simulateDelay(300);
    addExecution('Task initialized: ' + task.slice(0, 40) + '...', 'info');

    // Simulated task execution
    addThought('Beginning execution sequence', 'action');
    addExecution('$ oro --execute', 'command');
    
    // Add approval step
    const approvalId = addExecution(
      'Action requires approval: Proceeding with task execution',
      'approval',
      true
    );

    addThought('Awaiting human approval...', 'observation');
  };

  const handleApprove = (lineId: string) => {
    setExecutionLines(prev => prev.map(line => 
      line.id === lineId ? { ...line, approved: true } : line
    ));
    setPendingApprovals(prev => prev.filter(id => id !== lineId));
    
    addThought('Approval received, continuing execution', 'observation');
    addExecution('✓ Approved - continuing', 'success');
    
    // Continue execution after approval
    setTimeout(() => {
      addExecution('$ oro --continue', 'command');
      addExecution('Execution resumed...', 'info');
    }, 300);
  };

  const handleReject = (lineId: string) => {
    setExecutionLines(prev => prev.map(line => 
      line.id === lineId ? { ...line, approved: false } : line
    ));
    setPendingApprovals(prev => prev.filter(id => id !== lineId));
    
    addThought('Action rejected by user', 'observation');
    addExecution('✗ Rejected - halting execution', 'error');
  };

  const toggleListening = () => {
    if (isListeningActive) {
      stopListening();
      setIsListeningActive(false);
    } else {
      startListening();
      setIsListeningActive(true);
    }
  };

  const simulateDelay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const generateOroResponse = (input: string): string => {
    const responses = [
      "I've analyzed your request and I'm ready to proceed.",
      "Understood. I'll begin processing this now.",
      "That's an interesting approach. Let me evaluate the options.",
      "I see what you're asking for. I'll handle this carefully.",
      "Processing your request through the appropriate channels.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!isOpen) return null;

  return (
    <div 
      className={clsx(
        'fixed inset-0 z-50 flex',
        'animate-slide-in-right'
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Terminal Panel */}
      <div className="relative ml-auto w-[70vw] h-full bg-[#0a0a0f] border-l border-[#1e1e2e] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-200 font-mono">
              ORO TERMINAL
            </span>
            <span className="text-xs text-slate-500">
              Sovereign Intelligence Interface
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Microphone toggle */}
            <button
              onClick={toggleListening}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                isListeningActive
                  ? 'bg-green-600/20 border border-green-500/50 text-green-400'
                  : 'bg-[#1e1e2e] border border-[#2d2d42] text-slate-400 hover:text-slate-200'
              )}
            >
              {isListeningActive ? '🎤 Listening...' : '🎤 Start Mic'}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Voice Visualizers */}
        <div className="flex border-b border-[#1e1e2e] bg-[#0d0d15]">
          <div className="flex-1 px-4 py-2 border-r border-[#1e1e2e]">
            <div className="text-[10px] text-slate-500 mb-1 font-mono">USER INPUT</div>
            <MicrophoneVisualizer 
              isListening={isListeningActive} 
              color="#10b981"
              height={40}
            />
            {(transcript || interimTranscript) && (
              <div className="mt-2 text-xs text-slate-400 font-mono truncate">
                {transcript}
                <span className="text-slate-600">{interimTranscript}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 px-4 py-2">
            <div className="text-[10px] text-slate-500 mb-1 font-mono">ORO OUTPUT</div>
            <WaveformVisualizer 
              waveform={waveform} 
              isActive={isSpeaking}
              color="#3b82f6"
              height={40}
            />
          </div>
        </div>

        {/* Split Terminal View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TOP: Thinking Stream */}
          <div className="flex-1 border-b border-[#1e1e2e] flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-[#0f0f18] border-b border-[#1e1e2e] flex items-center gap-2">
              <span className="text-purple-400">🧠</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">
                THINKING STREAM
              </span>
              <span className="text-[10px] text-slate-500">
                (live, never collapses)
              </span>
            </div>
            
            <div 
              ref={thinkingRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs"
            >
              {thinkingLines.map((line) => (
                <ThinkingLineComponent key={line.id} line={line} />
              ))}
              {thinkingLines.length === 0 && (
                <div className="text-slate-600 italic">
                  Waiting for task...
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: Execution Environment */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-[#0f0f18] border-b border-[#1e1e2e] flex items-center gap-2">
              <span className="text-green-400">⚡</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">
                EXECUTION ENVIRONMENT
              </span>
              <span className="text-[10px] text-slate-500">
                (OIS Platform)
              </span>
              {pendingApprovals.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono">
                  {pendingApprovals.length} PENDING APPROVAL
                </span>
              )}
            </div>
            
            <div 
              ref={executionRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs bg-[#0a0a0f]"
            >
              {executionLines.map((line) => (
                <ExecutionLineComponent 
                  key={line.id} 
                  line={line}
                  onApprove={() => handleApprove(line.id)}
                  onReject={() => handleReject(line.id)}
                />
              ))}
              {executionLines.length === 0 && (
                <div className="text-slate-600">
                  $ <span className="cursor-blink">▋</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingLineComponent({ line }: { line: ThinkingLine }) {
  const colors: Record<ThinkingLine['type'], string> = {
    thought: 'text-slate-400',
    analysis: 'text-purple-400',
    decision: 'text-blue-400',
    action: 'text-green-400',
    observation: 'text-amber-400',
  };

  const prefixes: Record<ThinkingLine['type'], string> = {
    thought: '💭',
    analysis: '🔍',
    decision: '⚡',
    action: '▶️',
    observation: '👁️',
  };

  return (
    <div className={clsx('flex gap-2', colors[line.type])}>
      <span className="opacity-60">{prefixes[line.type]}</span>
      <span className="opacity-40 shrink-0">
        {new Date(line.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })}
      </span>
      <span>{line.text}</span>
    </div>
  );
}

function ExecutionLineComponent({ 
  line, 
  onApprove, 
  onReject 
}: { 
  line: ExecutionLine;
  onApprove: () => void;
  onReject: () => void;
}) {
  const colors: Record<ExecutionLine['type'], string> = {
    command: 'text-cyan-400',
    output: 'text-slate-300',
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-slate-500',
    approval: 'text-amber-400',
  };

  const prefixes: Record<ExecutionLine['type'], string> = {
    command: '$',
    output: '→',
    success: '✓',
    error: '✗',
    info: 'ℹ',
    approval: '⚠',
  };

  return (
    <div className={clsx('flex items-start gap-2', colors[line.type])}>
      <span className="opacity-60 shrink-0">{prefixes[line.type]}</span>
      <span className="flex-1">{line.text}</span>
      
      {line.type === 'approval' && line.requiresApproval && line.approved === undefined && (
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onApprove}
            className="px-2 py-0.5 rounded bg-green-600/20 hover:bg-green-600/40 text-green-400 text-[10px] transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-2 py-0.5 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[10px] transition-colors"
          >
            Reject
          </button>
        </div>
      )}
      
      {line.type === 'approval' && line.approved === true && (
        <span className="text-green-400 text-[10px]">✓</span>
      )}
      
      {line.type === 'approval' && line.approved === false && (
        <span className="text-red-400 text-[10px]">✗</span>
      )}
    </div>
  );
}
