import { useState, useEffect } from 'react';
import { Download, Languages, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { downloadCvPdf } from '../utils/generateCvPdf';
import { trackEvent } from '../utils/analytics';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const content = getPortfolioContent(lang);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#060A13]/88 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08]'
          : 'bg-white/75 dark:bg-[#060A13]/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {content.nav.brand}
        </a>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-5 xl:gap-7">
          {content.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() =>
                trackEvent('Section Click', {
                  section: link.href.replace('#', ''),
                  action: 'navbar_link',
                })
              }
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action + Mobile/Tablet Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              const nextLang = lang === 'en' ? 'ar' : 'en';
              toggleLang();
              trackEvent('Language Switch', { section: 'navbar', label: nextLang });
            }}
            aria-label={lang === 'en' ? 'Switch language to Arabic' : 'Switch language to English'}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.09] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadCvPdf();
              trackEvent('CV Download', { section: 'navbar', action: 'download_pdf' });
            }}
            className="hidden sm:inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 lg:px-4 text-xs sm:text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{content.nav.downloadCv}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#090F1D] px-6 py-4"
        >
          <div className="flex flex-col gap-1">
            {content.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="flex min-h-[44px] items-center text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/[0.08]">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {content.nav.appearance}
              </span>
              <ThemeToggle compact />
            </div>
            <button
              type="button"
              onClick={() => {
                downloadCvPdf();
                setMobileOpen(false);
              }}
              className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{content.nav.downloadMyCv}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
