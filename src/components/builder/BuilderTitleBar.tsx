'use client';

import { IconMedina } from '@/components/builder/BuilderIcons';

interface Props {
  title?: string;
  onToggleAgent?: () => void;
  agentOpen?: boolean;
}

export default function BuilderTitleBar({ title = 'MedinaMemorySystems', onToggleAgent, agentOpen }: Props) {
  return (
    <header
      className="shrink-0 flex items-center h-[var(--mb-title-h)] px-3 border-b select-none"
      style={{ background: 'var(--mb-bg-surface)', borderColor: 'var(--mb-border)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <IconMedina size={22} />
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--mb-text-primary)' }}>
            Medina Studio
          </div>
          <div className="text-[10px]" style={{ color: 'var(--mb-text-faint)' }}>
            Sovereign App Builder
          </div>
        </div>
      </div>

      {/* Center title — Cursor style */}
      <div className="flex-1 flex justify-center">
        <span
          className="text-[12px] font-medium px-4 py-1 rounded-md"
          style={{ color: 'var(--mb-text-secondary)', background: 'var(--mb-bg-elevated)' }}
        >
          {title}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <button
          type="button"
          onClick={onToggleAgent}
          className="mb-btn mb-btn-ghost text-[11px] py-1.5"
          style={agentOpen ? { borderColor: 'var(--mb-agent)', color: 'var(--mb-agent)' } : undefined}
        >
          Agents Window
        </button>
      </div>
    </header>
  );
}
