import { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu, Network, CheckCircle2, TreePine } from 'lucide-react';

const STEPS = [
  { label: 'Grounding Root Ingestion & Query Parse', icon: Cpu },
  { label: 'Spreading Living Neural Branches', icon: Network },
  { label: 'Synthesizing Crystalline Foliage Notes', icon: Brain },
  { label: 'Generating Interactive Architectural Graphs', icon: Sparkles },
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
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border border-dashed border-teal-400/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-400/10 to-transparent blur-md animate-pulse-glow" />

        {/* Central Pulsing 3D Node */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/40">
          <TreePine className="h-7 w-7 animate-pulse text-white" />
        </div>
      </div>

      {/* Title & Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-mono text-emerald-300 mb-3 shadow-inner">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>GYAN TREE SYNTHESIS PIPELINE</span>
        <span className="text-emerald-400/70">• {seconds}s</span>
      </div>

      <h3 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl font-display">
        Growing High-Density Knowledge Tree
      </h3>
      <p className="mt-1 text-xs text-emerald-300/80 font-mono">
        Extracting Deep Structural Reasoning & Syntactic Leaves
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
                  ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-200 shadow-md shadow-emerald-900/40'
                  : isDone
                  ? 'border-emerald-900/80 bg-space-card/40 text-emerald-300'
                  : 'border-transparent bg-space-card/10 text-emerald-600'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse'
                    : 'bg-space-card text-emerald-700'
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
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
