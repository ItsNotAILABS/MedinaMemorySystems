'use client';

import AppBuilder from '@/components/AppBuilder';
import '@/styles/builder-theme.css';

export default function BuilderPage() {
  return (
    <div className="h-screen overflow-hidden">
      <AppBuilder />
    </div>
  );
}
