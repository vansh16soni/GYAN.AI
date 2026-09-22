import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className = '' }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Sunlit Sacred Grove Mode' : 'Switch to Midnight Bioluminescent Mode'}
      title={isDark ? 'Switch to Sunlit Grove Mode' : 'Switch to Midnight Mode'}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 select-none shadow-md backdrop-blur-md active:scale-95 ${
        isDark
          ? 'border-emerald-900/80 bg-space-card/85 text-emerald-300 hover:border-emerald-500/60 hover:bg-space-cardHover hover:text-emerald-100 shadow-black/30'
          : 'border-emerald-200 bg-white/85 text-emerald-800 hover:border-emerald-400 hover:bg-white hover:text-emerald-950 shadow-emerald-500/10'
      } ${className}`}
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-emerald-400 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      ) : (
        <Sun className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      )}
    </button>
  );
}
