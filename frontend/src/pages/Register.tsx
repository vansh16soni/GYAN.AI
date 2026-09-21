import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import AntigravityCanvas from '../components/AntigravityCanvas';
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
        err?.response?.data?.error === 'EMAIL_TAKEN'
          ? 'Email already registered.'
          : 'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden transition-colors duration-300">
      {/* 3D Antigravity Canvas */}
      <AntigravityCanvas interactive={true} opacity={isDark ? 0.8 : 0.65} />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle showLabel={true} />
      </div>

      {/* 3D Glassmorphic Auth Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl p-8 shadow-3d animate-fade-in-up transition-colors duration-300 ${
          isDark
            ? 'glass-panel-elevated text-white'
            : 'bg-white/85 backdrop-blur-xl border border-slate-200 text-slate-800 shadow-2xl shadow-indigo-500/10'
        }`}
      >
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 rounded-t-3xl" />

        <div className="mb-6 text-center">
          {/* 3D Floating Brand Icon */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-mono font-medium mb-2 border ${
              isDark
                ? 'border-indigo-500/30 bg-indigo-950/40 text-cyan-300'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ANTIGRAVITY NOTE ENGINE
          </div>

          <h1
            className={`text-2xl font-extrabold tracking-tight font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Create Account
          </h1>
          <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Start synthesizing deep structured notes in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                minLength={2}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg/80 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'border-slate-300 bg-slate-50/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg/80 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'border-slate-300 bg-slate-50/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg/80 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'border-slate-300 bg-slate-50/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div
          className={`mt-6 flex items-center justify-center gap-1.5 text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <span>Already registered?</span>
          <Link
            to="/login"
            className="font-bold text-indigo-500 hover:text-indigo-600 hover:underline transition"
          >
            Sign in
          </Link>
        </div>

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
