import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Video, BookOpen, Layers, Network, Terminal, Compass, SlidersHorizontal } from 'lucide-react';
import TiltCard from './TiltCard';
import { useTheme } from '../context/ThemeContext';
import { SettingsType } from '../config/presets';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  settings?: SettingsType | null;
  onOpenSettings?: () => void;
};

const SUGGESTIONS = [
  {
    title: 'Transformers Attention Mechanism',
    desc: 'Self-attention math, Q/K/V vectors & multi-head architecture',
    icon: Network,
    prompt: 'Attention Mechanism in Transformers and Multi-Head Attention',
    badge: 'Deep Learning',
  },
  {
    title: 'TCP vs UDP 3-Way Handshake',
    desc: 'Connection states, packet headers, ACK/SYN flow & reliability',
    icon: Layers,
    prompt: 'TCP vs UDP 3-Way Handshake with Mermaid diagram and packet flow',
    badge: 'Networking',
  },
  {
    title: 'Distributed Systems Raft Consensus',
    desc: 'Leader election, log replication, split votes and heartbeat timers',
    icon: Compass,
    prompt: 'Raft Consensus Algorithm Leader Election and Log Replication',
    badge: 'Architecture',
  },
  {
    title: 'MIT CS Lecture: Dynamic Programming',
    desc: 'Memoization vs tabulation, Bellman equations & optimal substructure',
    icon: Video,
    prompt: 'https://youtu.be/OQ5jsbhAv_M',
    badge: 'YouTube Demo',
  },
];

const MODES = [
  { id: 'comprehensive', label: 'Structured Breakdown', icon: BookOpen },
  { id: 'architectural', label: 'Architecture & Diagrams', icon: Network },
  { id: 'algorithms', label: 'Code & Complexity', icon: Terminal },
];

export default function InputBox({
  value,
  onChange,
  onSubmit,
  loading,
  settings,
  onOpenSettings,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [selectedMode, setSelectedMode] = useState('comprehensive');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 6 * 24)}px`;
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSubmit();
    }
  }

  const presetName = settings?.preset || 'standard';
  const languageName = settings?.language || 'english';
  const difficultyName = settings?.difficulty || 'auto';

  return (
    <div className="w-full max-w-3xl px-4 animate-fade-in-up relative z-10">
      {/* Top Formal Gyan Forest Brand Hero with Rich Frosted Glassmorphism */}
      <div className="relative mb-6 text-center rounded-3xl p-6 sm:p-8 shadow-3d glass-panel-elevated overflow-hidden transition-all duration-300">
        {/* Top Edge Ambient Light Filament */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-mono mb-4 backdrop-blur-md border transition-colors ${
            isDark
              ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300 shadow-sm'
              : 'border-emerald-300 bg-white/85 text-emerald-900 shadow-sm'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className={`font-semibold tracking-wide ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            GYAN TREE • 3D NEURAL SYNTHESIS
          </span>
          <span className={isDark ? 'text-emerald-400/90 font-medium' : 'text-emerald-700 font-semibold'}>
            • Forest Core
          </span>
        </div>

        <h1
          className={`text-3xl font-extrabold tracking-tight sm:text-5xl font-display leading-[1.15] ${
            isDark
              ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]'
              : 'text-emerald-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
          }`}
        >
          Branch Out Knowledge{' '}
          <span className={`text-shimmer ${isDark ? 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]' : ''}`}>
            through the Living Neural Tree
          </span>
        </h1>

        <p
          className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed font-medium ${
            isDark
              ? 'text-emerald-100/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]'
              : 'text-emerald-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
          }`}
        >
          Grow deep technical understanding from any concept or lecture URL. Experience living 3D notes,
          algorithmic complexity graphs, and interactive architectural diagrams.
        </p>

        {/* Synthesis Mode Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/50'
                    : isDark
                    ? 'bg-space-card/90 text-emerald-200 hover:text-white border border-emerald-900/70 hover:border-emerald-600'
                    : 'bg-white/80 text-emerald-900 hover:text-emerald-950 border border-emerald-300 hover:border-emerald-400 shadow-sm'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Settings Summary Badge Above Input */}
      {onOpenSettings && (
        <div className="mb-3 flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              Using:{' '}
              <strong className="capitalize text-emerald-950 dark:text-emerald-100 font-medium">
                {presetName} preset
              </strong>{' '}
              · <span className="capitalize">{languageName}</span> ·{' '}
              <span className="capitalize">{difficultyName} difficulty</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 text-xs font-semibold underline underline-offset-2 transition"
          >
            Change
          </button>
        </div>
      )}

      {/* Main 3D Elevated Forest Glass Input Card */}
      <div
        className={`rounded-3xl p-4 shadow-3d transition-all focus-within:border-emerald-500/80 focus-within:shadow-neon-emerald glass-panel-elevated`}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Enter a topic or paste a YouTube URL (e.g. Distributed Consensus, Raft, or MIT OpenCourseWare link)..."
          className={`max-h-[160px] min-h-[56px] w-full resize-none bg-transparent px-3 py-2 text-sm outline-none leading-relaxed font-sans ${
            isDark
              ? 'text-white placeholder:text-emerald-200/40'
              : 'text-emerald-950 placeholder:text-emerald-800/50'
          }`}
        />

        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t pt-3 px-2 ${
            isDark ? 'border-emerald-900/50' : 'border-emerald-300/40'
          }`}
        >
          <div
            className={`flex items-center gap-3 text-xs font-mono ${
              isDark ? 'text-emerald-300/70' : 'text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-1">
              <kbd
                className={`rounded px-1.5 py-0.5 text-[11px] border ${
                  isDark
                    ? 'bg-space-card text-emerald-200 border-emerald-800'
                    : 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80 shadow-inner'
                }`}
              >
                Enter ↵
              </kbd>
              <span>to synthesize</span>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="hidden sm:inline">Living Gyan Tree synthesis</span>
          </div>

          <button
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Nourishing Tree…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-200 transition-transform group-hover:rotate-12" />
                <span>Grow Tree Notes</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Prompt Suggestion Matrix */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between px-1">
          <span
            className={`text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-emerald-400' : 'text-emerald-800 font-bold'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            Curated Synthesis Blueprints
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <TiltCard
                key={idx}
                onClick={() => {
                  onChange(s.prompt);
                  if (ref.current) ref.current.focus();
                }}
                className={`group cursor-pointer rounded-2xl p-3.5 transition-all text-left border ${
                  isDark
                    ? 'border-emerald-900/60 bg-space-card/70 hover:border-emerald-500/50 hover:bg-space-cardHover shadow-3d hover:shadow-neon-emerald'
                    : 'border-emerald-300/60 bg-[#e2f3e8]/75 hover:border-emerald-400 hover:bg-[#eaf7ef]/90 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
                        isDark
                          ? 'bg-emerald-950 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white'
                          : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold font-display text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {s.title}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase shrink-0 border ${
                      isDark
                        ? 'border-emerald-800 bg-emerald-950/70 text-emerald-300'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {s.badge}
                  </span>
                </div>
                <p
                  className={`mt-2 text-[11px] line-clamp-2 leading-relaxed ${
                    isDark ? 'text-emerald-300/70' : 'text-emerald-800/80'
                  }`}
                >
                  {s.desc}
                </p>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
