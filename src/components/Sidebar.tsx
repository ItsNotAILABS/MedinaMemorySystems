'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { PanelId, NavItem } from '@/types';
import { COLORS_432 } from '@/lib/icpOrganism';

const NAV_ITEMS: NavItem[] = [
  { id: 'chat', label: 'Chat', icon: '💬', color: '#4a9eff' },
  { id: 'organism', label: 'Organism', icon: 'Ω', color: '#d4a574' },
  { id: 'memory', label: 'Memory', icon: '🧠', color: '#9b7ed9' },
  { id: 'governance', label: 'Governance', icon: '⚖️', color: '#4ade80' },
  { id: 'models', label: 'Models', icon: '⚡', color: '#6366f1' },
  { id: 'devices', label: 'Devices', icon: '📱', color: '#00d4ff' },
  { id: 'company', label: 'Company', icon: '🏢', color: '#ec4899' },
  { id: 'replay', label: 'Replay', icon: '⏮️', color: '#06b6d4' },
  { id: 'settings', label: 'Settings', icon: '⚙️', color: '#94a3b8' },
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
        'flex flex-col border-r backdrop-blur-md transition-all duration-300 z-10',
        collapsed ? 'w-14' : 'w-52',
      )}
      style={{ 
        background: COLORS_432.glassBg,
        borderColor: COLORS_432.glassBorder
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b" style={{ borderColor: COLORS_432.glassBorder }}>
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS_432.oroGold}, ${COLORS_432.novaViolet})`,
            boxShadow: `0 0 15px ${COLORS_432.oroGold}40`
          }}
        >
          M
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate" style={{ color: COLORS_432.oroGold }}>MEDINA</div>
            <div className="text-[10px] text-slate-500 truncate font-mono">Sovereign Organism</div>
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
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200',
            )}
            style={activePanel === item.id ? { 
              background: `${item.color}15`,
              borderLeft: `2px solid ${item.color}`,
              boxShadow: `0 0 15px ${item.color}10`
            } : { 
              borderLeft: '2px solid transparent',
              background: 'transparent'
            }}
          >
            <span className="text-base shrink-0" style={{ filter: activePanel === item.id ? 'none' : 'grayscale(50%)' }}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className="truncate font-medium">{item.label}</span>
            )}
            {!collapsed && item.badge !== undefined && (
              <span 
                className="ml-auto text-[10px] rounded-full px-1.5 py-0.5"
                style={{ background: item.color, color: 'white' }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t" style={{ borderColor: COLORS_432.glassBorder }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </aside>
  );
}
