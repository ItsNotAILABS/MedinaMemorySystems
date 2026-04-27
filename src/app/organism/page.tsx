import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '𓂀 MEDINA — Sovereign Intelligence Platform',
  description: 'MEDINA Memory Systems — 97 SDKs, 374+ callable functions, 5 AI agents. Download the sovereign terminal for Windows, macOS, and Linux.',
};

export default function OrganismLandingPage() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/organism/index.html"
        className="w-full h-full border-none"
        title="MEDINA Organism — Sovereign Intelligence Platform"
      />
    </div>
  );
}
