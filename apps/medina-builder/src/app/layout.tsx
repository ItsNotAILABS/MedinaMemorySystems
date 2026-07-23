import type { Metadata } from 'next';
import './globals.css';
import BuilderFonts from './BuilderFonts';

export const metadata: Metadata = {
  title: 'Medina Studio — Sovereign App Builder',
  description: 'Build, run, and deploy apps with AI — PowerShell, WSL, live preview',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <BuilderFonts>{children}</BuilderFonts>
      </body>
    </html>
  );
}
