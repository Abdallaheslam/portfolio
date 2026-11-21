import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark';

export type ThemeTransitionOrigin =
  | HTMLElement
  | { x: number; y: number }
  | null
  | undefined;

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode, origin?: ThemeTransitionOrigin) => void;
  toggleTheme: (origin?: ThemeTransitionOrigin) => void;
}

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (updateCallback: () => void) => ViewTransitionLike;
};

const STORAGE_KEY = 'portfolio-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Ignore storage read errors in restricted contexts
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyThemeToDocument(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', mode === 'dark' ? '#060A13' : '#F8FAFC');
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore storage write errors in restricted contexts
  }
}

function resolveOriginCoordinates(origin?: ThemeTransitionOrigin): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 0, y: 0 };

  if (origin && 'getBoundingClientRect' in origin) {
    const rect = origin.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  if (origin && typeof origin.x === 'number' && typeof origin.y === 'number') {
    return origin;
  }

  return {
    x: window.innerWidth / 2,
    y: 44,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const transitionToTheme = useCallback(
    (nextMode: ThemeMode, origin?: ThemeTransitionOrigin) => {
      if (nextMode === theme) return;

      const root = document.documentElement;
      const doc = document as DocumentWithViewTransition;
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        applyThemeToDocument(nextMode);
        setThemeState(nextMode);
        return;
      }

      if (typeof doc.startViewTransition === 'function') {
        const { x, y } = resolveOriginCoordinates(origin);
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );

        root.classList.add('theme-transitioning');

        try {
          const transition = doc.startViewTransition(() => {
            applyThemeToDocument(nextMode);
            flushSync(() => {
              setThemeState(nextMode);
            });
          });

          transition.ready
            .then(() => {
              root.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 540,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  pseudoElement: '::view-transition-new(root)',
                },
              );
            })
            .catch(() => {
              // Ignore aborted transitions
            });

          transition.finished
            .catch(() => {
              // Ignore aborted transitions
            })
            .finally(() => {
              root.classList.remove('theme-transitioning');
            });
          return;
        } catch {
          root.classList.remove('theme-transitioning');
        }
      }

      // Synchronized CSS fallback for browsers without View Transitions API
      root.classList.add('theme-fallback-transition');
      applyThemeToDocument(nextMode);
      setThemeState(nextMode);
      window.setTimeout(() => {
        root.classList.remove('theme-fallback-transition');
      }, 320);
    },
    [theme],
  );

  const setTheme = useCallback(
    (mode: ThemeMode, origin?: ThemeTransitionOrigin) => {
      transitionToTheme(mode, origin);
    },
    [transitionToTheme],
  );

  const toggleTheme = useCallback(
    (origin?: ThemeTransitionOrigin) => {
      transitionToTheme(theme === 'dark' ? 'light' : 'dark', origin);
    },
    [theme, transitionToTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
