import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Medina App Builder',
  description: 'Build real runnable apps — export to disk, deploy anywhere',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
