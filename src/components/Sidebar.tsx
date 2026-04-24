'use client';

import { useState } from 'react';
import { cls } from '@/lib/sovereign-cls';
import { usePlatformSync } from '@/hooks/usePlatformSync';
import type { PanelId, NavItem } from '@/types';

const NAV_ITEMS: NavItem[] = [
  { id: 'chat', label: 'Chat', icon: '💬', color: '#3b82f6' },
  { id: 'jarvis', label: 'JARVIS', icon: '𓂀', color: '#00d4ff' },
  { id: 'memory', label: 'Memory', icon: '🧠', color: '#8b5cf6' },
  { id: 'governance', label: 'Governance', icon: '⚖️', color: '#10b981' },
  { id: 'models', label: 'Models', icon: '⚡', color: '#6366f1' },
  { id: 'company', label: 'Company', icon: '🏢', color: '#ec4899' },
  { id: 'replay', label: 'Replay', icon: '⏮️', color: '#06b6d4' },
  { id: 'permissions', label: 'Perms', icon: '🔐', color: '#f59e0b' },
];

interface SidebarProps {
  activePanel: PanelId;
  onNavigate: (panel: PanelId) => void;
}

export default function Sidebar({ activePanel, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const sync = usePlatformSync();

  const getBadge = (id: PanelId): number | undefined => {
    switch (id) {
      case 'memory': return sync.memory.total || undefined;
      case 'governance': return sync.governance.open || undefined;
      case 'models': return sync.models.stats.totalInvocations || undefined;
      case 'replay': return sync.replay.currentlyRecording ? 1 : undefined;
      default: return undefined;
    }
  };

  return (
    <aside
      className={cls(
        'flex flex-col bg-[#12121a] border-r border-[#1e1e2e] transition-all duration-300 z-10',
        collapsed ? 'w-14' : 'w-52',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-[#1e1e2e]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 relative">
          N
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 4px rgba(16,185,129,0.6)' }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold gradient-text-blue truncate">NOVA OVO</div>
            <div className="text-[10px] text-slate-500 truncate font-mono">
              ULRI (Sovereign) · Beat {sync.beat}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const badge = getBadge(item.id);
          const isActive = activePanel === item.id;
          const isRecording = item.id === 'replay' && sync.replay.currentlyRecording;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cls(
                'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left transition-all duration-150 text-sm group relative',
                isActive
                  ? 'bg-[#1a1a2e] text-white'
                  : 'text-slate-400 hover:bg-[#1a1a26] hover:text-slate-200',
              )}
              style={isActive ? { borderLeft: `2px solid ${item.color}` } : { borderLeft: '2px solid transparent' }}
            >
              <span className="text-base shrink-0 relative">
                {item.icon}
                {isRecording && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </span>
              {!collapsed && (
                <span className="truncate font-medium">{item.label}</span>
              )}
              {!collapsed && badge !== undefined && (
                <span
                  className="ml-auto text-white text-[10px] rounded-full px-1.5 py-0.5 font-mono"
                  style={{ background: item.color }}
                >
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              {collapsed && badge !== undefined && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle + sync info */}
      <div className="p-2 border-t border-[#1e1e2e] space-y-1">
        {!collapsed && (
          <div className="text-[9px] text-slate-600 font-mono px-2 py-1">
            Sync: {new Date(sync.timestamp).toLocaleTimeString()}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1a1a26] transition-colors text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </aside>
  );
}
