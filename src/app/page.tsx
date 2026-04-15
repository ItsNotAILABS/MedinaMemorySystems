'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import OVOChat from '@/components/OVOChat';
import MemoryTemple from '@/components/MemoryTemple';
import GovernancePanel from '@/components/GovernancePanel';
import ModelRuntime from '@/components/ModelRuntime';
import CompanyOnboarding from '@/components/CompanyOnboarding';
import ReplayPanel from '@/components/ReplayPanel';
import PermissionsPanel from '@/components/PermissionsPanel';
import OrganismField from '@/components/OrganismField';
import type { PanelId } from '@/types';

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<PanelId>('chat');

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat': return <OVOChat />;
      case 'memory': return <MemoryTemple />;
      case 'governance': return <GovernancePanel />;
      case 'models': return <ModelRuntime />;
      case 'company': return <CompanyOnboarding />;
      case 'replay': return <ReplayPanel />;
      case 'permissions': return <PermissionsPanel />;
      default: return <OVOChat />;
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
    </div>
  );
}
