import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import TreeCanvas from '../components/TreeCanvas';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Lock, Mail, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await register(username, email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.error === 'USER_EXISTS'
          ? 'An account with that email already exists.'
          : 'Failed to create account. Try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`relative flex min-h-screen items-center justify-center px-4 overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-space-base' : 'bg-[#d8ece0]'
    }`}>
      {/* 3D Gyan Tree Canvas */}
      <TreeCanvas interactive={true} opacity={0.95} />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* 3D Glassmorphic Auth Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl p-8 shadow-3d animate-fade-in-up transition-colors duration-300 glass-panel-elevated ${
          isDark ? 'text-white' : 'text-emerald-950'
        }`}
      >
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-t-3xl" />

        <div className="mb-6 text-center">
          {/* 3D Floating Brand Icon */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-mono font-medium mb-2 border ${
              isDark
                ? 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            GYAN TREE • LIVING GROVE
          </div>

          <h1
            className={`text-2xl font-extrabold tracking-tight font-display ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}
          >
            Plant Your Gyan Tree
          </h1>
          <p className={`mt-1 text-xs ${isDark ? 'text-emerald-200/70' : 'text-emerald-700/80'}`}>
            Start cultivating AI synthesized study notes in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-emerald-200' : 'text-emerald-900'
              }`}
            >
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                required
                minLength={2}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-emerald-900/80 bg-space-bg/80 text-white placeholder:text-emerald-300/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-emerald-200 bg-emerald-50/50 text-emerald-950 placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-emerald-200' : 'text-emerald-900'
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-emerald-900/80 bg-space-bg/80 text-white placeholder:text-emerald-300/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-emerald-200 bg-emerald-50/50 text-emerald-950 placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-emerald-200' : 'text-emerald-900'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/70" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-emerald-900/80 bg-space-bg/80 text-white placeholder:text-emerald-300/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-emerald-200 bg-emerald-50/50 text-emerald-950 placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Begin Living Tree Journey</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-emerald-600 dark:text-emerald-300/70">
          Already cultivating notes?{' '}
          <Link
            to="/login"
            className="font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition"
          >
            Sign In
          </Link>
        </p>

        <div
          className={`mt-6 border-t pt-4 text-center ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-mono ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Fast & Secure Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
