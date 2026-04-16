'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { PanelId, NavItem } from '@/types';

const NAV_ITEMS: NavItem[] = [
  { id: 'chat', label: 'ORO', icon: '𓂀', color: '#3b82f6' },
  { id: 'memory', label: 'Memory', icon: '🧠', color: '#8b5cf6' },
  { id: 'governance', label: 'Governance', icon: '⚖️', color: '#10b981' },
  { id: 'models', label: 'Models', icon: '⚡', color: '#6366f1' },
  { id: 'company', label: 'Company', icon: '🏢', color: '#ec4899' },
  { id: 'messages', label: 'Messages', icon: '✉️', color: '#0ea5e9' },
  { id: 'campaigns', label: 'Campaigns', icon: '📢', color: '#f97316' },
  { id: 'export', label: 'Export', icon: '📤', color: '#22c55e' },
  { id: 'replay', label: 'Replay', icon: '⏮️', color: '#06b6d4' },
  { id: 'permissions', label: 'Perms', icon: '🔐', color: '#f59e0b' },
  { id: 'devices', label: 'Devices', icon: '📱', color: '#14b8a6' },
];

interface SidebarProps {
  activePanel: PanelId;
  onNavigate: (panel: PanelId) => void;
}

export default function Sidebar({ activePanel, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'flex flex-col bg-[#12121a] border-r border-[#1e1e2e] transition-all duration-300 z-10',
        collapsed ? 'w-14' : 'w-52',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-[#1e1e2e]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          N
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold gradient-text-blue truncate">NOVA OVO</div>
            <div className="text-[10px] text-slate-500 truncate">Sovereign Platform</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left transition-all duration-150 text-sm group',
              activePanel === item.id
                ? 'bg-[#1a1a2e] text-white'
                : 'text-slate-400 hover:bg-[#1a1a26] hover:text-slate-200',
            )}
            style={activePanel === item.id ? { borderLeft: `2px solid ${item.color}` } : { borderLeft: '2px solid transparent' }}
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="truncate font-medium">{item.label}</span>
            )}
            {!collapsed && item.badge !== undefined && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[#1e1e2e]">
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
