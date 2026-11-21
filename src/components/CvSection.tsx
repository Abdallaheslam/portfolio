import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Download, Eye, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { CV_RESUME_DATA, downloadCvPdf } from '../utils/generateCvPdf';
import { trackEvent } from '../utils/analytics';
import InteractivePdfViewer from './InteractivePdfViewer';

export default function CvSection() {
  const { lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { personal, cvSection } = getPortfolioContent(lang);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  useEffect(() => {
    if (!fullscreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [fullscreenOpen]);

  const handleDownload = () => {
    downloadCvPdf();
    trackEvent('CV Download', { section: 'cv', action: 'download_pdf' });
  };

  const handleOpenFullscreen = () => {
    setFullscreenOpen(true);
    trackEvent('CV Preview', { section: 'cv', action: 'open_fullscreen_viewer' });
  };

  const handlePrint = () => {
    trackEvent('CV Print', { section: 'cv', action: 'print' });
    window.print();
  };

  const fallbackResumeSheet = (
    <div dir="ltr" className="p-8 sm:p-10 space-y-6 text-sm text-slate-900">
      <div className="border-b border-slate-200 pb-5">
        <h4 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          {CV_RESUME_DATA.name}
        </h4>
        <p className="mt-1 font-semibold text-blue-700">{CV_RESUME_DATA.headline}</p>
        <p className="mt-2 text-xs text-slate-600">{CV_RESUME_DATA.contact}</p>
      </div>

      <div>
        <h5 className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase">
          Professional Summary
        </h5>
        <p className="mt-2 leading-relaxed text-slate-700">{CV_RESUME_DATA.summary}</p>
      </div>

      <div>
        <h5 className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase">
          Professional Experience
        </h5>
        <div className="mt-3 space-y-4">
          {CV_RESUME_DATA.experience.map((job) => (
            <div key={job.role}>
              <p className="font-bold text-slate-900">{job.role}</p>
              <p className="text-xs font-medium text-slate-600">{job.meta}</p>
              <ul className="mt-1.5 list-disc space-y-1 ps-5 text-xs leading-relaxed text-slate-700">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase">
          Education
        </h5>
        <p className="mt-2 font-bold text-slate-900">{CV_RESUME_DATA.education.degree}</p>
        <p className="text-xs text-slate-700">{CV_RESUME_DATA.education.institution}</p>
        <p className="text-xs text-slate-500">{CV_RESUME_DATA.education.period}</p>
      </div>

      <div>
        <h5 className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase">
          Technical Skills
        </h5>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc ps-5 text-xs text-slate-700">
          {CV_RESUME_DATA.technicalSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase">
          Projects
        </h5>
        <div className="mt-2.5 space-y-3">
          {CV_RESUME_DATA.projects.map((proj) => (
            <div key={proj.title}>
              <p className="font-bold text-slate-900">{proj.title}</p>
              <ul className="mt-1 list-disc space-y-1 ps-5 text-xs text-slate-700">
                {proj.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-200 pt-4 text-xs">
        <div>
          <h5 className="font-display font-bold tracking-wider text-blue-700 uppercase">
            Core Skills
          </h5>
          <ul className="mt-1.5 list-disc space-y-1 ps-5 text-slate-700">
            {CV_RESUME_DATA.coreSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-display font-bold tracking-wider text-blue-700 uppercase">
            Languages
          </h5>
          <ul className="mt-1.5 list-disc space-y-1 ps-5 text-slate-700">
            {CV_RESUME_DATA.languages.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <section id="cv" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 space-y-6">
        {/* Header & Primary CV Actions */}
        <div className="flex flex-col justify-between gap-8 rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-7 sm:p-10 shadow-xs dark:shadow-none lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>{cvSection.kicker}</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {cvSection.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              {cvSection.description}
            </p>
            <p className="mt-3 font-mono text-xs text-slate-500 dark:text-slate-400">
              {cvSection.metaNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{cvSection.downloadButton}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenFullscreen}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.09] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>{cvSection.previewButton}</span>
            </button>
          </div>
        </div>

        {/* Inline Interactive PDF Viewer */}
        <InteractivePdfViewer
          onOpenFullscreen={handleOpenFullscreen}
          onDownload={handleDownload}
          onPrint={handlePrint}
          fallbackContent={fallbackResumeSheet}
        />
      </div>

      {/* Fullscreen Interactive PDF Viewer Modal */}
      <AnimatePresence>
        {fullscreenOpen && (
          <motion.div
            key="cv-pdf-fullscreen-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${cvSection.modalTitlePrefix} — ${personal.fullName}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 dark:bg-black/85 p-3 sm:p-6 backdrop-blur-sm"
            onClick={() => setFullscreenOpen(false)}
          >
            <motion.div
              key="cv-pdf-fullscreen-panel"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.98, y: 10 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98, y: 8 }
              }
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-[92vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <InteractivePdfViewer
                isFullscreen
                onCloseFullscreen={() => setFullscreenOpen(false)}
                onDownload={handleDownload}
                onPrint={handlePrint}
                fallbackContent={fallbackResumeSheet}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
