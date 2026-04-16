'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import OVOChat from '@/components/OVOChat';
import MemoryTemple from '@/components/MemoryTemple';
import GovernancePanel from '@/components/GovernancePanel';
import ModelRuntime from '@/components/ModelRuntime';
import CompanyOnboarding from '@/components/CompanyOnboarding';
import ReplayPanel from '@/components/ReplayPanel';
import PermissionsPanel from '@/components/PermissionsPanel';
import OrganismField from '@/components/OrganismField';
import OrganismPanel from '@/components/OrganismPanel';
import DevicesPanel from '@/components/DevicesPanel';
import MessagesPanel from '@/components/MessagesPanel';
import CampaignsPanel from '@/components/CampaignsPanel';
import ExportPanel from '@/components/ExportPanel';
import OroTerminal from '@/components/OroTerminal';
import type { PanelId } from '@/types';
import { COLORS_432 } from '@/lib/icpOrganism';

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<PanelId>('organism');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | undefined>();

  const handleTaskSubmit = useCallback((task: string) => {
    setCurrentTask(task);
    setIsTerminalOpen(true);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat': return <OVOChat onTaskSubmit={handleTaskSubmit} />;
      case 'organism': return <OrganismPanel />;
      case 'memory': return <MemoryTemple />;
      case 'governance': return <GovernancePanel />;
      case 'models': return <ModelRuntime />;
      case 'company': return <CompanyOnboarding />;
      case 'replay': return <ReplayPanel />;
      case 'permissions': return <PermissionsPanel />;
      case 'devices': return <DevicesPanel />;
      case 'messages': return <MessagesPanel />;
      case 'campaigns': return <CampaignsPanel />;
      case 'export': return <ExportPanel />;
      case 'settings': return <SettingsPlaceholder />;
      default: return <OrganismPanel />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: COLORS_432.root }}>
      <Sidebar activePanel={activePanel} onNavigate={setActivePanel} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <OrganismField />
        <main className="flex-1 overflow-hidden">
          {renderPanel()}
        </main>
      </div>

      {/* Oro Terminal - Slides in from right when task is given */}
      <OroTerminal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        currentTask={currentTask}
      />
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
      <span className="text-6xl">⚙️</span>
      <span className="font-mono">Settings Hub</span>
      <span className="text-sm text-slate-600">Devices • Permissions • Contracts • Frequencies</span>
    </div>
  );
}
