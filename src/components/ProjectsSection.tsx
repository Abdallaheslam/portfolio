import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  FlaskConical,
  Github,
  Globe,
  Layers,
  Star,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getPortfolioContent,
  type ProjectItem,
  type ProjectMetric,
} from '../data/portfolioData';
import { GITHUB_USERNAME } from '../data/githubActivity';
import { trackEvent } from '../utils/analytics';
import ProjectMockupPreview from './ProjectMockupPreview';
import ProjectReadmeTool from './ProjectReadmeTool';

type FilterType = 'all' | 'web' | 'systems' | 'design' | 'mobile-backend';

const TECH_ACCENT_DOT: Record<string, string> = {
  'Node.js': 'bg-emerald-500',
  'Express.js': 'bg-slate-400 dark:bg-slate-300',
  MongoDB: 'bg-green-500',
  Flutter: 'bg-sky-500',
  Dart: 'bg-cyan-500',
  Firebase: 'bg-amber-500',
  JavaScript: 'bg-yellow-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-blue-500',
  Postman: 'bg-orange-400',
  'PWA Manifest': 'bg-blue-600 dark:bg-blue-400',
  'JSON-LD SEO': 'bg-indigo-500 dark:bg-indigo-400',
  'Arabic RTL': 'bg-sky-500',
  'POS System': 'bg-emerald-500',
  'Offline-First Sync': 'bg-teal-500',
  'Inventory & Reports': 'bg-amber-500',
  '80mm Print & CSV': 'bg-indigo-500 dark:bg-indigo-400',
  'Role-Based Access': 'bg-blue-600 dark:bg-blue-400',
  'Canva AI': 'bg-cyan-500',
  'Graphic Design': 'bg-indigo-500 dark:bg-indigo-400',
  'Product Marketing': 'bg-blue-600 dark:bg-blue-400',
  'Ad Banners': 'bg-sky-500',
  'Bilingual Copy': 'bg-emerald-500',
  Authentication: 'bg-teal-500',
  'CRUD Operations': 'bg-blue-500',
};

function TechStackBadges({ stack }: { stack: string[] }) {
  return (
    <ul
      dir="ltr"
      aria-label="Project technologies"
      className="flex flex-wrap gap-1.5 rtl:justify-end"
    >
      {stack.map((tech) => {
        const dotColor = TECH_ACCENT_DOT[tech] ?? 'bg-blue-500/80';
        return (
          <li
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 font-mono text-[11px] font-medium text-slate-700 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
            />
            <span>{tech}</span>
          </li>
        );
      })}
    </ul>
  );
}

const METRIC_ICON_MAP: Record<ProjectMetric['icon'], typeof Code2> = {
  languages: Code2,
  stars: Star,
  hosting: Globe,
  architecture: Layers,
  testing: FlaskConical,
  database: Database,
};

function ProjectMetricCards({
  metrics,
  liveStars,
  lang,
}: {
  metrics: ProjectMetric[];
  liveStars?: number;
  lang: 'en' | 'ar';
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric) => {
        const Icon = METRIC_ICON_MAP[metric.icon] || Code2;
        const displayValue =
          metric.icon === 'stars' && typeof liveStars === 'number'
            ? liveStars.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')
            : metric.value;

        return (
          <div
            key={metric.label}
            className="min-w-0 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-2 dark:border-white/[0.06] dark:bg-white/[0.025]"
          >
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <Icon
                className={`h-3 w-3 shrink-0 ${
                  metric.icon === 'stars'
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{metric.label}</span>
            </div>
            <p
              title={displayValue}
              className="mt-1 truncate font-mono text-[11px] font-semibold text-slate-900 dark:text-white tabular-nums"
            >
              {displayValue}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectsSection() {
  const { lang } = useLanguage();
  const { projects, projectsSection } = getPortfolioContent(lang);
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'preview' | 'readme'>('preview');
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardActiveSlide, setCardActiveSlide] = useState<Record<string, number>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [repoStars, setRepoStars] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    const slugs = projects
      .map((p) => p.repoSlug)
      .filter((slug): slug is string => Boolean(slug));

    Promise.allSettled(
      slugs.map((slug) =>
        fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${slug}`, {
          signal: controller.signal,
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => ({ slug, stars: data?.stargazers_count })),
      ),
    ).then((results) => {
      if (controller.signal.aborted) return;
      const next: Record<string, number> = {};
      for (const r of results) {
        if (
          r.status === 'fulfilled' &&
          r.value &&
          typeof r.value.stars === 'number'
        ) {
          next[r.value.slug] = r.value.stars;
        }
      }
      if (Object.keys(next).length > 0) {
        setRepoStars(next);
      }
    });

    return () => controller.abort();
  }, [projects]);

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const selectedProject: ProjectItem | null = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const openProjectModal = (
    project: ProjectItem,
    initialSlide = 0,
    initialTab: 'preview' | 'readme' = 'preview',
  ) => {
    setSelectedProjectId(project.id);
    setActiveSlide(initialSlide);
    setModalTab(initialTab);
    trackEvent('Project Inspect', {
      section: 'projects',
      label: `${project.id}:${initialTab}`,
    });
  };

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectId(null);
      } else if (
        modalTab === 'preview' &&
        e.key === 'ArrowRight' &&
        selectedProject.screenshots.length > 1
      ) {
        setActiveSlide((prev) => (prev + 1) % selectedProject.screenshots.length);
      } else if (
        modalTab === 'preview' &&
        e.key === 'ArrowLeft' &&
        selectedProject.screenshots.length > 1
      ) {
        setActiveSlide(
          (prev) =>
            (prev - 1 + selectedProject.screenshots.length) %
            selectedProject.screenshots.length,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProject, modalTab]);

  const markImageFailed = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <section id="projects" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              {projectsSection.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {projectsSection.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {projectsSection.subheading}
            </p>
          </div>

          {/* Interactive Filter Segmented Control + README Generator Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="group"
              aria-label="Filter projects by category"
              className="inline-flex w-fit items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-[#0B1120] p-1"
            >
              {projectsSection.filters.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilter(tab.id);
                    trackEvent('Project Filter', { section: 'projects', label: tab.id });
                  }}
                  className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {projects[0] && (
              <button
                type="button"
                onClick={() => openProjectModal(projects[0], 0, 'readme')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-blue-500/50 hover:text-blue-600 dark:border-white/[0.1] dark:bg-[#0B1120] dark:text-slate-200 dark:hover:border-blue-400/50 dark:hover:text-blue-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileCode2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>{lang === 'ar' ? 'مولّد README.md' : 'README.md Tool'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div
          className={`mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 ${
            filteredProjects.length === 4 ? '' : 'lg:grid-cols-3'
          }`}
        >
          {filteredProjects.map((project) => {
            const leadImage = project.screenshots[0];
            const isBroken = leadImage ? failedImages[leadImage.src] : false;

            return (
              <motion.article
                key={project.id}
                onClick={() => openProjectModal(project)}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] shadow-xs hover:shadow-md dark:shadow-none dark:hover:shadow-xl dark:hover:shadow-black/30 transition-[border-color,box-shadow] duration-200 hover:border-blue-500/50 dark:hover:border-blue-500/40 cursor-pointer"
              >
                {/* Preview Area */}
                <div
                  className={`relative w-full overflow-hidden border-b border-slate-200 dark:border-white/[0.08] ${
                    project.category === 'design'
                      ? 'aspect-[16/11] bg-[#050B16]'
                      : 'aspect-[16/10] bg-slate-100 dark:bg-[#070B14]'
                  }`}
                >
                  {project.previewType === 'screenshot' && leadImage && !isBroken ? (
                    project.category === 'design' ? (
                      (() => {
                        const activeIdx = Math.min(
                          cardActiveSlide[project.id] ?? 0,
                          project.screenshots.length - 1,
                        );
                        const activeShot = project.screenshots[activeIdx] ?? leadImage;
                        return (
                          <div dir="ltr" className="flex h-full w-full flex-col bg-[#050B16]">
                            {/* Full Uncropped 16:9 Studio Stage */}
                            <div className="relative flex-1 min-h-0 flex items-center justify-center p-1.5 overflow-hidden">
                              {!failedImages[activeShot.src] ? (
                                <img
                                  src={activeShot.src}
                                  alt={activeShot.alt}
                                  referrerPolicy="no-referrer"
                                  onError={() => markImageFailed(activeShot.src)}
                                  className="h-full w-full rounded-[6px] object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                  {project.title}
                                </div>
                              )}
                            </div>

                            {/* Interactive 5-Banner Studio Filmstrip */}
                            <div className="grid grid-cols-5 gap-1.5 border-t border-white/10 bg-[#030711] px-2 py-1.5 shrink-0">
                              {project.screenshots.map((shot, idx) => {
                                const isCurrent = idx === activeIdx;
                                return (
                                  <button
                                    key={shot.src}
                                    type="button"
                                    onMouseEnter={() =>
                                      setCardActiveSlide((prev) => ({
                                        ...prev,
                                        [project.id]: idx,
                                      }))
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isCurrent) {
                                        openProjectModal(project, idx);
                                      } else {
                                        setCardActiveSlide((prev) => ({
                                          ...prev,
                                          [project.id]: idx,
                                        }));
                                      }
                                    }}
                                    aria-label={`${projectsSection.inspectLabel} ${project.title}: ${shot.caption}`}
                                    aria-pressed={isCurrent}
                                    className={`relative aspect-[16/9] overflow-hidden rounded-[4px] border bg-[#060D1A] transition-all cursor-pointer ${
                                      isCurrent
                                        ? 'border-blue-400 ring-1 ring-blue-400/60 opacity-100'
                                        : 'border-white/10 opacity-65 hover:opacity-100'
                                    }`}
                                  >
                                    {!failedImages[shot.src] ? (
                                      <img
                                        src={shot.src}
                                        alt={shot.alt}
                                        referrerPolicy="no-referrer"
                                        onError={() => markImageFailed(shot.src)}
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <span className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                                        {idx + 1}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()
                    ) : project.screenshots.length === 1 ? (
                      <img
                        src={leadImage.src}
                        alt={leadImage.alt}
                        referrerPolicy="no-referrer"
                        onError={() => markImageFailed(leadImage.src)}
                        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div
                        dir="ltr"
                        className={`grid h-full w-full gap-1 bg-slate-200/80 dark:bg-[#0D1526] p-1 ${
                          project.screenshots.length >= 5
                            ? 'grid-cols-6 grid-rows-2'
                            : project.screenshots.length === 4
                              ? 'grid-cols-2 grid-rows-2'
                              : project.screenshots.length === 3
                                ? 'grid-cols-2 grid-rows-2'
                                : 'grid-cols-2 grid-rows-1'
                        }`}
                      >
                        {project.screenshots.slice(0, 5).map((shot, idx) => {
                          let spanClass = '';
                          if (project.screenshots.length >= 5) {
                            spanClass = idx < 2 ? 'col-span-3' : 'col-span-2';
                          } else if (project.screenshots.length === 3 && idx === 0) {
                            spanClass = 'row-span-2';
                          }

                          const focusClass =
                            project.screenshots.length >= 5 && idx >= 2
                              ? 'object-center'
                              : 'object-top';

                          return (
                            <button
                              key={shot.src}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProjectModal(project, idx);
                              }}
                              aria-label={`${projectsSection.inspectLabel} ${project.title}: ${shot.caption}`}
                              className={`relative overflow-hidden rounded-[6px] border border-slate-300/60 dark:border-white/10 bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${spanClass}`}
                            >
                              {!failedImages[shot.src] ? (
                                <img
                                  src={shot.src}
                                  alt={shot.alt}
                                  referrerPolicy="no-referrer"
                                  onError={() => markImageFailed(shot.src)}
                                  className={`h-full w-full object-cover ${focusClass} transition-transform duration-300 hover:scale-105`}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#0B1325] text-[10px] text-slate-400">
                                  {idx + 1}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )
                  ) : project.previewType === 'flutter-ui' ||
                    project.previewType === 'nodejs-api' ? (
                    <div dir="ltr" className="h-full w-full">
                      <ProjectMockupPreview type={project.previewType} />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B1325] p-6 text-center">
                      <p className="font-display text-base font-semibold text-white">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{project.subtitle}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProjectModal(
                        project,
                        project.category === 'design'
                          ? (cardActiveSlide[project.id] ?? 0)
                          : 0,
                      );
                    }}
                    aria-label={`${projectsSection.inspectLabel} ${project.title}`}
                    className={`absolute end-3 ${
                      project.category === 'design' ? 'top-2.5' : 'bottom-3'
                    } inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#060A13]/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm group-hover:border-blue-400 group-hover:bg-blue-600 transition-colors cursor-pointer`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {project.screenshots.length > 1
                        ? `${projectsSection.galleryLabel} (${project.screenshots.length})`
                        : projectsSection.inspectLabel}
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {project.categoryLabel}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {project.subtitle}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4 border-t border-slate-200 dark:border-white/[0.08] pt-4">
                    {/* Concise Engineering Metric Badges */}
                    <ProjectMetricCards
                      metrics={project.metrics}
                      liveStars={project.repoSlug ? repoStars[project.repoSlug] : undefined}
                      lang={lang}
                    />

                    {/* Visual Technology Stack Badges */}
                    <TechStackBadges stack={project.stack} />

                    {/* Action Links */}
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackEvent('Project Demo Click', {
                              section: 'projects',
                              label: project.id,
                            });
                          }}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>{projectsSection.liveDemo}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackEvent('Project Repo Click', {
                              section: 'projects',
                              label: project.id,
                            });
                          }}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.08] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          <Github className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{projectsSection.repository}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectModal(project);
                        }}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-500/40 hover:bg-blue-50/70 hover:text-blue-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {!project.liveDemoUrl && !project.githubUrl
                            ? projectsSection.viewScope
                            : projectsSection.viewDetails}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Project Detail & Screenshot Gallery Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="project-detail-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 dark:bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
            onClick={() => setSelectedProjectId(null)}
          >
            <motion.div
              key={selectedProject.id}
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
              className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0B1120] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 dark:border-white/[0.08] dark:bg-[#0B1120]/95 px-6 py-4 backdrop-blur-md">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                    {selectedProject.categoryLabel}
                  </p>
                  <h3
                    id="project-modal-title"
                    className="mt-0.5 font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate"
                  >
                    {selectedProject.title}{' '}
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      — {selectedProject.subtitle}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div
                    role="tablist"
                    aria-label={lang === 'ar' ? 'أوضاع عرض المشروع' : 'Project view mode'}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/[0.08] dark:bg-[#060A13]"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={modalTab === 'preview'}
                      onClick={() => setModalTab('preview')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        modalTab === 'preview'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{lang === 'ar' ? 'المعاينة' : 'Preview'}</span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={modalTab === 'readme'}
                      onClick={() => setModalTab('readme')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        modalTab === 'readme'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>README.md</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(null)}
                    aria-label={projectsSection.closeModal}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.1] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {modalTab === 'readme' ? (
                  <ProjectReadmeTool
                    project={selectedProject}
                    allProjects={projects}
                    onSelectProject={(id) => {
                      setSelectedProjectId(id);
                      setActiveSlide(0);
                    }}
                    repoStars={repoStars}
                    lang={lang}
                  />
                ) : (
                  <>
                {/* Large Screenshot Gallery or Interactive Architecture Preview */}
                {selectedProject.screenshots.length > 0 ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 shadow-inner">
                      {!failedImages[selectedProject.screenshots[activeSlide].src] ? (
                        <img
                          src={selectedProject.screenshots[activeSlide].src}
                          alt={selectedProject.screenshots[activeSlide].alt}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            markImageFailed(
                              selectedProject.screenshots[activeSlide].src,
                            )
                          }
                          className="h-full w-full object-contain bg-slate-950"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          {projectsSection.unavailablePreview}
                        </div>
                      )}

                      {selectedProject.screenshots.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSlide(
                                (prev) =>
                                  (prev - 1 + selectedProject.screenshots.length) %
                                  selectedProject.screenshots.length,
                              )
                            }
                            aria-label="Previous screenshot"
                            className="absolute top-1/2 left-3 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#060A13]/85 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSlide(
                                (prev) =>
                                  (prev + 1) % selectedProject.screenshots.length,
                              )
                            }
                            aria-label="Next screenshot"
                            className="absolute top-1/2 right-3 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#060A13]/85 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span>{selectedProject.screenshots[activeSlide].caption}</span>
                      {selectedProject.screenshots.length > 1 && (
                        <span className="font-mono tabular-nums">
                          {activeSlide + 1} / {selectedProject.screenshots.length}
                        </span>
                      )}
                    </div>

                    {/* Clickable Thumbnail Strip */}
                    {selectedProject.screenshots.length > 1 && (
                      <div className="flex items-center gap-3 overflow-x-auto pt-1 pb-1">
                        {selectedProject.screenshots.map((shot, idx) => {
                          const isActive = idx === activeSlide;
                          const isDesign = selectedProject.category === 'design';
                          return (
                            <button
                              key={shot.src}
                              type="button"
                              onClick={() => setActiveSlide(idx)}
                              aria-label={shot.caption}
                              aria-current={isActive ? 'true' : undefined}
                              className={`relative shrink-0 overflow-hidden rounded-lg border bg-[#050B16] transition-all cursor-pointer ${
                                isDesign ? 'aspect-[16/9] w-36' : 'aspect-[16/10] w-32'
                              } ${
                                isActive
                                  ? 'border-blue-600 ring-2 ring-blue-500/30 dark:border-blue-400'
                                  : 'border-slate-200 opacity-70 hover:opacity-100 dark:border-white/10'
                              }`}
                            >
                              {!failedImages[shot.src] ? (
                                <img
                                  src={shot.src}
                                  alt={shot.alt}
                                  referrerPolicy="no-referrer"
                                  className={`h-full w-full ${
                                    isDesign ? 'object-contain' : 'object-cover object-top'
                                  }`}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] text-slate-400">
                                  {idx + 1}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    dir="ltr"
                    className="h-80 sm:h-96 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10"
                  >
                    <ProjectMockupPreview
                      type={
                        selectedProject.previewType === 'flutter-ui'
                          ? 'flutter-ui'
                          : 'nodejs-api'
                      }
                    />
                  </div>
                )}

                {/* Expanded Overview, Complete Feature List & Technical Stack */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <h4 className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                        {projectsSection.overviewHeading}
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
                        {selectedProject.expandedDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                        {projectsSection.capabilitiesHeading}
                      </h4>
                      <ul className="mt-3 grid grid-cols-1 gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                        {selectedProject.highlights.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-5 border-t border-slate-200 dark:border-white/[0.08] pt-6 lg:border-t-0 lg:border-s lg:pt-0 lg:ps-6">
                    <div>
                      <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                        {projectsSection.metricsHeading}
                      </h4>
                      <div className="mt-3">
                        <ProjectMetricCards
                          metrics={selectedProject.metrics}
                          liveStars={
                            selectedProject.repoSlug
                              ? repoStars[selectedProject.repoSlug]
                              : undefined
                          }
                          lang={lang}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                        {projectsSection.stackHeading}
                      </h4>
                      <div className="mt-3">
                        <TechStackBadges stack={selectedProject.stack} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2">
                      {selectedProject.liveDemoUrl && (
                        <a
                          href={selectedProject.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('Project Demo Click', {
                              section: 'projects-modal',
                              label: selectedProject.id,
                            })
                          }
                          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                          <span>{projectsSection.openLiveDemo}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('Project Repo Click', {
                              section: 'projects-modal',
                              label: selectedProject.id,
                            })
                          }
                          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.09] transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{projectsSection.viewGithubRepo}</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProjectId(null)}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-200 bg-transparent px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        {projectsSection.closeModal}
                      </button>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
