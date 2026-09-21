import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface Props {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Bright Light Mode' : 'Switch to Dark Mode'}
      className={`group relative inline-flex items-center gap-2 rounded-2xl border transition-all duration-300 select-none ${
        isDark
          ? 'border-slate-800 bg-space-card/90 text-slate-300 hover:border-indigo-500/50 hover:bg-space-cardHover hover:text-white shadow-sm'
          : 'border-slate-200 bg-white/90 text-slate-700 hover:border-indigo-400 hover:bg-slate-50 hover:text-indigo-600 shadow-md shadow-slate-200/50'
      } px-3 py-1.5 backdrop-blur-md ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Icon Indicator */}
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-lg transition-transform duration-300 ${
            isDark
              ? 'bg-indigo-950/80 text-cyan-300 group-hover:scale-110'
              : 'bg-amber-100 text-amber-600 group-hover:scale-110'
          }`}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 transition-transform" />
          ) : (
            <Sun className="h-3.5 w-3.5 transition-transform animate-spin-slow" />
          )}
        </div>
      </div>

      <span className="font-mono text-xs font-semibold">
        {isDark ? 'Dark' : 'Bright'}
      </span>

      {showLabel && (
        <span className="text-[10px] font-mono opacity-60">
          ({isDark ? 'Antigravity' : 'Daylight'})
        </span>
      )}
    </button>
  );
}
