'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Save token in cookie (for middleware) and localStorage (for API)
      document.cookie = `token=${response.data.accessToken}; path=/`;
      localStorage.setItem('token', response.data.accessToken);

      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-mesh-glow min-h-screen flex items-center justify-center p-6 relative">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-gold-400 transition-colors mb-8 uppercase tracking-widest"
        >
          ← Back to Studio Website
        </Link>

        {/* Card Container */}
        <div className="glass-card p-8 md:p-10 rounded-3xl border-neutral-900 shadow-2xl relative">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">SECURE PORTAL</span>
            <h1 className="font-serif text-3xl font-bold mt-2 text-neutral-100">Admin Control</h1>
            <p className="text-xs text-neutral-500 mt-2">Sign in to manage bookings, confirm reservations, and view stats.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-950/30 border border-red-500/20 text-red-300 text-xs px-4 py-3.5 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Email Address</label>
              <input
                required
                type="email"
                placeholder="admin@maheshstudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-900 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold py-3.5 rounded-xl transition-all duration-300 tracking-wider shadow-lg hover:shadow-gold-500/10 cursor-pointer disabled:opacity-50 text-xs uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-neutral-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  VERIFYING ACCESS...
                </span>
              ) : (
                'SIGN IN TO PANEL'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-neutral-600 uppercase tracking-widest mt-8">
          Authorized personnel only. Activities are monitored.
        </p>
      </div>
    </main>
  );
}