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
import DevicesPanel from '@/components/DevicesPanel';
import OroTerminal from '@/components/OroTerminal';
import type { PanelId } from '@/types';

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<PanelId>('chat');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | undefined>();

  const handleTaskSubmit = useCallback((task: string) => {
    setCurrentTask(task);
    setIsTerminalOpen(true);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat': return <OVOChat onTaskSubmit={handleTaskSubmit} />;
      case 'memory': return <MemoryTemple />;
      case 'governance': return <GovernancePanel />;
      case 'models': return <ModelRuntime />;
      case 'company': return <CompanyOnboarding />;
      case 'replay': return <ReplayPanel />;
      case 'permissions': return <PermissionsPanel />;
      case 'devices': return <DevicesPanel />;
      default: return <OVOChat onTaskSubmit={handleTaskSubmit} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
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
