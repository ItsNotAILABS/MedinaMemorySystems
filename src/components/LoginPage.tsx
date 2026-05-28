'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

type AuthView = 'login' | 'register';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(email, password, displayName);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text-blue mb-1">NOVA OVO</h1>
          <p className="text-sm text-slate-500 font-mono">Sovereign Intelligence Platform</p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel-strong p-8">
          {/* Tab Switch */}
          <div className="flex mb-6 bg-[#0a0a12] rounded-lg p-1">
            <button
              onClick={() => { setView('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'login'
                  ? 'bg-[#1a1a2e] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setView('register'); setError(''); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'register'
                  ? 'bg-[#1a1a2e] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cmd-input w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cmd-input w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:from-blue-400 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="cmd-input w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="Commander Medina"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cmd-input w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cmd-input w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={4}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium text-sm hover:from-purple-400 hover:to-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Footer info */}
          <div className="mt-6 pt-4 border-t border-[#1e1e2e]">
            <p className="text-center text-[11px] text-slate-600 font-mono">
              {view === 'login'
                ? "Don't have an account? Switch to Register tab above."
                : 'First registered user becomes the Owner.'}
            </p>
          </div>
        </div>

        {/* Platform info */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-700 font-mono">
            MEDINA Memory Systems · Sovereign · φ-Coherent
          </p>
        </div>
      </div>
    </div>
  );
}
