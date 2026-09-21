import { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu, Network, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Ingesting & Tokenizing Query', icon: Cpu },
  { label: 'Constructing Semantic Knowledge Graph', icon: Network },
  { label: 'Synthesizing Technical Markdown Notes', icon: Brain },
  { label: 'Compiling Mermaid Architectural DAG', icon: Sparkles },
];

export default function SynthesisProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStep((step) => (step < STEPS.length - 1 ? step + 1 : step));
    }, 3200);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 max-w-lg w-full rounded-3xl glass-panel-glow text-center animate-fade-in-up">
      {/* 3D Revolving Holographic Radar */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        {/* Outer orbital rings */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-400/10 to-transparent blur-md animate-pulse-glow" />

        {/* Central Pulsing 3D Node */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/40">
          <Brain className="h-7 w-7 animate-pulse text-white" />
        </div>
      </div>

      {/* Title & Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 text-xs font-mono text-indigo-300 mb-3 shadow-inner">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>NEURAL SYNTHESIS PIPELINE</span>
        <span className="text-slate-400">• {seconds}s</span>
      </div>

      <h3 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl font-display">
        Synthesizing Comprehensive Notes
      </h3>
      <p className="mt-1 text-xs text-slate-400 font-mono">
        Leveraging Antigravity Deep Note Reasoning & Schema Extraction
      </p>

      {/* Pipeline Step Sequence */}
      <div className="mt-6 w-full space-y-2.5 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-300 ${
                isCurrent
                  ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-200 shadow-md shadow-indigo-900/30'
                  : isDone
                  ? 'border-slate-800/80 bg-slate-900/30 text-slate-300'
                  : 'border-transparent bg-slate-900/10 text-slate-600'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isCurrent
                    ? 'bg-indigo-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse'
                    : 'bg-slate-800/50 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-medium block truncate">
                  {step.label}
                </span>
              </div>

              {isCurrent && (
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
