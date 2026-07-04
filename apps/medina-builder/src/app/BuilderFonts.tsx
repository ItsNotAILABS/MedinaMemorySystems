'use client';

import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export default function BuilderFonts({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${jetbrains.variable} h-full`} style={{ fontFamily: 'var(--font-inter), var(--mb-font-ui)' }}>
      {children}
    </div>
  );
}
