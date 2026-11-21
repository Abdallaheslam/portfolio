import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { downloadCvPdf } from '../utils/generateCvPdf';
import { trackEvent } from '../utils/analytics';
import ThemeToggle from './ThemeToggle';

export default function Hero() {
  const { lang } = useLanguage();
  const { personal, heroIntro, heroActions } = getPortfolioContent(lang);
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-8 pb-16 sm:pt-10 sm:pb-24"
    >
      {/* Subtle architectural radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 end-0 h-[480px] w-[480px] rounded-full bg-blue-600/[0.06] dark:bg-blue-600/[0.07] blur-[120px]"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Top Hero Utility Row: Location / Availability & Theme Switcher */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-wide text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{personal.location}</span>
            </span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              ·
            </span>
            <span>{personal.shortAvailability}</span>
          </div>

          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Brand & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-7"
          >
            <div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
                {lang === 'en' ? personal.displayName.toUpperCase() : personal.displayName}
              </h1>

              <p className="mt-3 text-lg font-semibold text-blue-600 dark:text-blue-400 sm:text-xl">
                {personal.headline}
              </p>

              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100 sm:text-lg">
                &ldquo;{personal.tagline}&rdquo;
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {heroIntro}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  onClick={() =>
                    trackEvent('Section Click', { section: 'projects', action: 'hero_cta' })
                  }
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{heroActions.viewProjects}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    downloadCvPdf();
                    trackEvent('CV Download', { section: 'hero', action: 'download_pdf' });
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 hover:border-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.09] dark:hover:border-white/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>{heroActions.downloadCv}</span>
                </button>

                <a
                  href="#contact"
                  onClick={() =>
                    trackEvent('Section Click', { section: 'contact', action: 'hero_cta' })
                  }
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.05] transition-colors whitespace-nowrap shrink-0"
                >
                  <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span>{heroActions.contactMe}</span>
                </a>
              </div>

              {/* Social Links & Full Name Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/[0.08] pt-5">
                <div className="flex items-center gap-3">
                  <a
                    href={personal.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abdullah Islam on LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-white transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={personal.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abdullah Islam on GitHub"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <span className="ms-1 text-xs text-slate-500 dark:text-slate-400">
                    {heroActions.socialLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {personal.fullName} <span aria-hidden="true">·</span> {personal.academicTag}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentic Profile Photograph */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative h-full min-h-[340px] sm:min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-[#F4F6F9] shadow-lg dark:shadow-2xl">
              {!imgError ? (
                <img
                  src={personal.profilePhoto}
                  alt={personal.profilePhotoAlt}
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-slate-100 dark:bg-[#0B1120] p-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/10 font-display text-2xl font-bold text-blue-600 dark:text-blue-400">
                    AI
                  </div>
                  <p className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
                    {personal.fullName}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {personal.headline}
                  </p>
                </div>
              )}

              {/* Subtle bottom contrast scrim for grounded integration */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#060A13]/85 via-[#060A13]/35 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">{personal.fullName}</p>
                  <p className="text-xs text-slate-200/90">{personal.photoSubtitle}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
