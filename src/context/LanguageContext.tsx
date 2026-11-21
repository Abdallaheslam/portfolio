import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextValue {
  lang: Language;
  isRtl: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const STORAGE_KEY = 'portfolio-lang';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage write errors
    }
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRtl: lang === 'ar',
        setLang,
        toggleLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
