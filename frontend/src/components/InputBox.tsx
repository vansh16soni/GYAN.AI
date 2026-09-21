import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Video, BookOpen, Layers, Network, Terminal, Compass } from 'lucide-react';
import TiltCard from './TiltCard';
import { useTheme } from '../context/ThemeContext';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
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

export default function InputBox({ value, onChange, onSubmit, loading }: Props) {
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

  return (
    <div className="w-full max-w-3xl px-4 animate-fade-in-up relative z-10">
      {/* Top Formal Antigravity Brand Hero */}
      <div className="mb-8 text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono mb-4 backdrop-blur-md border transition-colors ${
            isDark
              ? 'border-indigo-500/30 bg-indigo-950/40 text-indigo-300 shadow-sm'
              : 'border-indigo-200 bg-indigo-50/90 text-indigo-700 shadow-sm'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className={`font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ANTIGRAVITY NOTE ENGINE
          </span>
          <span className={isDark ? 'text-indigo-400/80' : 'text-indigo-600'}>• v2.4</span>
        </div>

        <h1
          className={`text-3xl font-extrabold tracking-tight sm:text-5xl font-display leading-[1.15] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Synthesize Structured Knowledge{' '}
          <span className="text-shimmer">at the Speed of Thought</span>
        </h1>

        <p
          className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Input any technical concept, system topic, or YouTube URL. Get high-density markdown notes,
          algorithmic complexity breakdowns, and interactive Mermaid diagrams.
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
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/50'
                    : isDark
                    ? 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Elevated Glass Input Card */}
      <div
        className={`rounded-3xl p-4 shadow-3d transition-all focus-within:border-indigo-500/80 focus-within:shadow-neon-indigo ${
          isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/90 border-indigo-200'
        }`}
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
              ? 'text-white placeholder:text-slate-500'
              : 'text-slate-900 placeholder:text-slate-400'
          }`}
        />

        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t pt-3 px-2 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div
            className={`flex items-center gap-3 text-xs font-mono ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            <div className="flex items-center gap-1">
              <kbd
                className={`rounded px-1.5 py-0.5 text-[11px] border ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300 shadow-inner'
                }`}
              >
                Enter ↵
              </kbd>
              <span>to synthesize</span>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="hidden sm:inline">Markdown + Mermaid output</span>
          </div>

          <button
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Synthesizing…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-cyan-200 transition-transform group-hover:rotate-12" />
                <span>Generate Notes</span>
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
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Curated Synthesis Blueprints
          </span>
          <span className="text-[11px] font-mono text-slate-400">Click to load</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <TiltCard
                key={item.title}
                tiltDegree={8}
                onClick={() => onChange(item.prompt)}
                glowColor={isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)'}
                className={`cursor-pointer p-3.5 transition-all text-left group ${
                  isDark
                    ? 'glass-panel border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/60'
                    : 'glass-panel bg-white/80 border-slate-200 hover:border-indigo-400 hover:bg-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isDark
                        ? 'bg-indigo-950/60 border border-indigo-800/40 text-cyan-400 group-hover:scale-105'
                        : 'bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:scale-105'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-xs font-bold truncate font-display ${
                          isDark
                            ? 'text-slate-200 group-hover:text-white'
                            : 'text-slate-800 group-hover:text-indigo-600'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isDark
                            ? 'bg-slate-800 text-indigo-300 border-slate-700/60'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] line-clamp-2 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
