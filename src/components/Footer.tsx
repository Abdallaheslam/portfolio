import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import ThemeToggle from './ThemeToggle';

export default function Footer() {
  const { lang } = useLanguage();
  const { personal, nav, footer } = getPortfolioContent(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-[#050810] py-10 transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
            {personal.fullName}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {personal.headline} <span aria-hidden="true">·</span> {personal.location}
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400"
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() =>
                trackEvent('Section Click', {
                  section: link.href.replace('#', ''),
                  action: 'footer_link',
                })
              }
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <a
            href={`mailto:${personal.email}`}
            aria-label="Email Abdullah Islam"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={personal.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={personal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col justify-between gap-2 border-t border-slate-200 dark:border-white/[0.06] px-6 pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          &copy; {year} {personal.fullName}. {footer.rights}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {footer.privacyNotice}
        </p>
      </div>
    </footer>
  );
}
