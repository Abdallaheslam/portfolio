import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const pillId = useId();

  const labels =
    lang === 'ar'
      ? { group: 'مظهر الموقع', light: 'فاتح', dark: 'داكن' }
      : { group: 'Color theme', light: 'Light', dark: 'Dark' };

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-white/10 dark:bg-[#0B1120] shrink-0"
    >
      <button
        type="button"
        onClick={(e) => setTheme('light', e.currentTarget)}
        aria-pressed={theme === 'light'}
        aria-label={lang === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light theme'}
        className={`relative inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'min-h-[34px] px-3 py-1.5 text-xs'
        } ${
          theme === 'light'
            ? 'text-slate-900'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        {theme === 'light' && (
          <motion.span
            layoutId={`theme-pill-${pillId}`}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 420, damping: 32 }
            }
            aria-hidden="true"
            className="absolute inset-0 rounded-md bg-white shadow-xs"
          />
        )}
        <Sun
          className={`relative z-10 h-3.5 w-3.5 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${
            theme === 'light' ? 'rotate-0 scale-105' : '-rotate-45 scale-95'
          }`}
          aria-hidden="true"
        />
        <span className="relative z-10">{labels.light}</span>
      </button>

      <button
        type="button"
        onClick={(e) => setTheme('dark', e.currentTarget)}
        aria-pressed={theme === 'dark'}
        aria-label={lang === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark theme'}
        className={`relative inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'min-h-[34px] px-3 py-1.5 text-xs'
        } ${
          theme === 'dark'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        {theme === 'dark' && (
          <motion.span
            layoutId={`theme-pill-${pillId}`}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 420, damping: 32 }
            }
            aria-hidden="true"
            className="absolute inset-0 rounded-md bg-blue-600 shadow-xs"
          />
        )}
        <Moon
          className={`relative z-10 h-3.5 w-3.5 transition-transform duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-105' : 'rotate-12 scale-95'
          }`}
          aria-hidden="true"
        />
        <span className="relative z-10">{labels.dark}</span>
      </button>
    </div>
  );
}
