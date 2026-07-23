import './globals.css';

export const metadata = {
  title: 'Medina Demo App',
  description: 'Auto-generated runnable demo from Company App Builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
