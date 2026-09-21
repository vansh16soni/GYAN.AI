import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Mail,
  Shield,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  CheckCircle2,
  Key,
  Cpu,
  Keyboard,
  ArrowLeft,
  Check,
} from 'lucide-react';

type Props = {
  onBack: () => void;
  onLogout: () => void;
};

export default function SettingsView({ onBack, onLogout }: Props) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedId, setCopiedId] = useState(false);

  let userName = 'Antigravity User';
  let userEmail = 'user@gyan.ai';
  let userId = 'gyan_user_' + Math.random().toString(36).substring(2, 9);

  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.username) userName = u.username;
      if (u.email) userEmail = u.email;
      if (u.id || u._id) userId = u.id || u._id;
    }
  } catch {}

  function handleCopyUserId() {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 relative z-10">
      {/* Top Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm ${
            isDark
              ? 'border-slate-800 bg-space-card/80 text-slate-300 hover:border-slate-700 hover:bg-space-cardHover hover:text-white'
              : 'border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${
            isDark
              ? 'border-indigo-500/30 bg-indigo-950/40 text-cyan-300'
              : 'border-indigo-200 bg-indigo-50 text-indigo-700'
          }`}
        >
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span>Application Settings</span>
        </div>
      </div>

      {/* Main Settings Card Container */}
      <div className="space-y-6">
        {/* Section 1: User Profile & Account Details */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-6 border-b pb-4 border-slate-700/20">
            <User className="h-5 w-5 text-indigo-500" />
            <h2
              className={`text-lg font-bold font-display tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              User Profile & Details
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Avatar and Main Info */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white text-2xl font-black font-mono shadow-lg shadow-indigo-500/30">
                {userName.charAt(0).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-base font-bold font-display ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {userName}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-500 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{userEmail}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                  <Key className="h-3 w-3 text-cyan-400" />
                  <span>ID: {userId.substring(0, 14)}...</span>
                  <button
                    onClick={handleCopyUserId}
                    className="ml-1 text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    {copiedId ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-500 transition-all hover:bg-rose-500/20 active:scale-95 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Account</span>
            </button>
          </div>

          {/* Account Security Banner */}
          <div
            className={`mt-6 flex items-center justify-between rounded-2xl p-3.5 text-xs border ${
              isDark
                ? 'border-slate-800 bg-space-card/60 text-slate-300'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Session Authenticated via Secure JWT Token</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Status: Active</span>
          </div>
        </div>

        {/* Section 2: Appearance & Theme Switch Option */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-700/20">
            <div className="flex items-center gap-2.5">
              <Sun className="h-5 w-5 text-sky-400" />
              <h2
                className={`text-lg font-bold font-display tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Interface Theme & Appearance
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Current: <strong className="text-indigo-400 capitalize">{theme}</strong>
            </span>
          </div>

          <p className={`text-xs mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select your preferred visual aesthetic. The theme switch instantly adapts the 3D antigravity canvas, notes renderer, and sidebar controls.
          </p>

          {/* Visual Theme Switcher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Theme Card */}
            <div
              onClick={() => setTheme('dark')}
              className={`group relative flex flex-col justify-between rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isDark
                  ? 'border-indigo-500 bg-space-card shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                      Space Dark
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Deep Obsidian & Neon</p>
                  </div>
                </div>

                {isDark && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Theme Mini Preview Graphic */}
              <div className="mt-3 rounded-xl border border-slate-800 bg-[#090a10] p-3 text-[10px] space-y-1.5 font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="h-2 w-3/4 rounded bg-indigo-900/60" />
                <div className="h-2 w-1/2 rounded bg-slate-800" />
              </div>
            </div>

            {/* Light Theme Card */}
            <div
              onClick={() => setTheme('light')}
              className={`group relative flex flex-col justify-between rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                !isDark
                  ? 'border-indigo-500 bg-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 bg-space-card/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 border border-amber-200">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                      Luminous Light
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Clean White & Slate</p>
                  </div>
                </div>

                {!isDark && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Theme Mini Preview Graphic */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-100 p-3 text-[10px] space-y-1.5 font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="h-2 w-3/4 rounded bg-indigo-200" />
                <div className="h-2 w-1/2 rounded bg-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Antigravity AI Engine & Shortcuts */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-4 border-b pb-4 border-slate-700/20">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <h2
              className={`text-lg font-bold font-display tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Synthesis Preferences & Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div
              className={`rounded-2xl p-4 border ${
                isDark ? 'border-slate-800 bg-space-card/60' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>AI Note Generator</span>
              </div>
              <p className="text-[11px] text-slate-400">
                OpenAI GPT-4o-mini engine with multi-format transcription and synthesis.
              </p>
            </div>

            <div
              className={`rounded-2xl p-4 border ${
                isDark ? 'border-slate-800 bg-space-card/60' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Keyboard className="h-4 w-4 text-sky-400" />
                <span>Shortcuts</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                <kbd className="rounded bg-slate-700/40 px-1 py-0.5 text-[10px] text-indigo-400">Enter</kbd> to synthesize, <kbd className="rounded bg-slate-700/40 px-1 py-0.5 text-[10px] text-indigo-400">Esc</kbd> to exit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
