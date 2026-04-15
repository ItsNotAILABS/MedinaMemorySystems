import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOVA OVO — Sovereign Intelligence Platform',
  description: 'Unified Memory Temple, Multi-Model Runtime, Governance, and Company Operating Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen overflow-hidden bg-[#0a0a0f] text-slate-200">
        {children}
      </body>
    </html>
  );
}
