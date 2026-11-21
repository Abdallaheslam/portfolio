import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, Code2, ExternalLink, Flame, FolderGit2, GitCommitHorizontal, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchLiveGitHubActivity,
  getVerifiedGitHubSnapshot,
  groupContributionsIntoWeeks,
  summarizeMonthlyActivity,
  type ContributionDay,
  type GitHubActivityData,
} from '../data/githubActivity';
import { getPortfolioContent } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';

const LEVEL_COLORS: Record<ContributionDay['level'], string> = {
  0: 'bg-slate-200/80 dark:bg-white/[0.06]',
  1: 'bg-blue-200 dark:bg-blue-950/95 dark:ring-1 dark:ring-blue-800/50',
  2: 'bg-blue-400 dark:bg-blue-700',
  3: 'bg-blue-500 dark:bg-blue-500',
  4: 'bg-blue-700 dark:bg-blue-400',
};

const LANGUAGE_DOT_COLOR: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-sky-500',
  Dart: 'bg-cyan-500',
  Python: 'bg-emerald-500',
};

function formatDisplayDate(isoDate: string, lang: 'en' | 'ar'): string {
  const dateObj = new Date(isoDate.includes('T') ? isoDate : `${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(dateObj);
}

export default function GitHubActivitySection() {
  const { lang } = useLanguage();
  const { githubActivitySection } = getPortfolioContent(lang);
  const shouldReduceMotion = useReducedMotion();

  const [activity, setActivity] = useState<GitHubActivityData>(() =>
    getVerifiedGitHubSnapshot(),
  );
  const [inspectedDay, setInspectedDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchLiveGitHubActivity(controller.signal)
      .then((liveData) => {
        if (!controller.signal.aborted) {
          setActivity(liveData);
        }
      })
      .catch(() => {
        // Silently keep verified public GitHub snapshot when offline or rate-limited
      });
    return () => controller.abort();
  }, []);

  const { weeks, monthLabels } = useMemo(
    () => groupContributionsIntoWeeks(activity.contributions, lang),
    [activity.contributions, lang],
  );

  const monthlySummary = useMemo(
    () => summarizeMonthlyActivity(activity.contributions, lang),
    [activity.contributions, lang],
  );

  const maxMonthlyCount = useMemo(
    () => Math.max(1, ...monthlySummary.map((m) => m.count)),
    [monthlySummary],
  );

  const stats = useMemo(() => {
    let activeDays = 0;
    let peakCount = 0;
    let peakDate = '';

    for (const day of activity.contributions) {
      if (day.count > 0) {
        activeDays += 1;
        if (day.count > peakCount) {
          peakCount = day.count;
          peakDate = day.date;
        }
      }
    }

    return {
      activeDays,
      peakCount,
      peakDate,
    };
  }, [activity.contributions]);

  const metricCards = [
    {
      label: githubActivitySection.metrics.totalContributions,
      value: activity.totalContributions.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      icon: GitCommitHorizontal,
    },
    {
      label: githubActivitySection.metrics.activeDays,
      value: stats.activeDays.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      icon: Calendar,
    },
    {
      label: githubActivitySection.metrics.peakDay,
      value: stats.peakCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      subValue: stats.peakDate ? formatDisplayDate(stats.peakDate, lang) : undefined,
      icon: Flame,
    },
    {
      label: githubActivitySection.metrics.publicRepos,
      value: activity.publicRepos.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      icon: FolderGit2,
    },
  ];

  const getContributionUnit = (count: number) =>
    count === 1
      ? githubActivitySection.contributionSingular
      : githubActivitySection.contributionPlural;

  return (
    <section id="github-activity" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              {githubActivitySection.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {githubActivitySection.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {githubActivitySection.subheading}
            </p>
          </div>

          <a
            href={activity.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('GitHub Activity Profile Click', {
                section: 'github-activity',
                label: activity.username,
              })
            }
            className="inline-flex min-h-[42px] w-fit shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:border-blue-500/40 hover:bg-slate-50 dark:border-white/15 dark:bg-[#0B1120] dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06] dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{githubActivitySection.viewProfile}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
          </a>
        </div>

        {/* Summary Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-4 sm:p-5 shadow-xs dark:shadow-none"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {card.label}
                  </span>
                  <Icon
                    className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2.5 flex items-baseline justify-between gap-2">
                  <p className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {card.value}
                  </p>
                  {card.subValue && (
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {card.subValue}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 53-Week Contribution Heatmap */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              {githubActivitySection.calendarTitle}
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>{githubActivitySection.less}</span>
              {([0, 1, 2, 3, 4] as const).map((level) => (
                <span
                  key={level}
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_COLORS[level]}`}
                />
              ))}
              <span>{githubActivitySection.more}</span>
            </div>
          </div>

          <div dir="ltr" className="mt-5 overflow-x-auto pb-2">
            <div className="inline-flex min-w-max flex-col">
              {/* Month Header Row */}
              <div className="relative mb-1.5 ms-8 h-4">
                {monthLabels.map((month) => (
                  <span
                    key={`${month.label}-${month.colIndex}`}
                    style={{ left: `${month.colIndex * 15}px` }}
                    className="absolute top-0 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
                  >
                    {month.label}
                  </span>
                ))}
              </div>

              {/* Day Labels + Week Grid */}
              <div className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="grid grid-rows-7 gap-[3px] w-6 text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none"
                >
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Mon</span>
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Wed</span>
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Fri</span>
                  <span className="h-[12px] leading-[12px]" />
                </div>

                <div
                  role="grid"
                  aria-label={githubActivitySection.calendarTitle}
                  className="flex gap-[3px]"
                >
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} role="row" className="grid grid-rows-7 gap-[3px]">
                      {week.map((day, dayIdx) => {
                        if (!day) {
                          return (
                            <span
                              key={`empty-${weekIdx}-${dayIdx}`}
                              aria-hidden="true"
                              className="h-[12px] w-[12px]"
                            />
                          );
                        }

                        const isInspected = inspectedDay?.date === day.date;
                        const daySummary =
                          day.count > 0
                            ? `${day.count} ${getContributionUnit(day.count)} on ${day.date}`
                            : `${githubActivitySection.noContributions} on ${day.date}`;

                        return (
                          <button
                            key={day.date}
                            type="button"
                            onMouseEnter={() => setInspectedDay(day)}
                            onFocus={() => setInspectedDay(day)}
                            onClick={() => setInspectedDay(day)}
                            aria-label={daySummary}
                            className={`h-[12px] w-[12px] rounded-[2.5px] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                              LEVEL_COLORS[day.level]
                            } ${isInspected ? 'scale-125 ring-1 ring-slate-900 dark:ring-white' : ''}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Day Inspection Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-white/[0.06] pt-3 text-xs">
            <p className="font-mono text-slate-600 dark:text-slate-300">
              {inspectedDay ? (
                <>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatDisplayDate(inspectedDay.date, lang)}
                  </span>
                  {' · '}
                  <span className="text-blue-600 dark:text-blue-400">
                    {inspectedDay.count > 0
                      ? `${inspectedDay.count.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} ${getContributionUnit(inspectedDay.count)}`
                      : githubActivitySection.noContributions}
                  </span>
                </>
              ) : (
                <span className="font-sans text-slate-500 dark:text-slate-400">
                  {githubActivitySection.calendarHint}
                </span>
              )}
            </p>

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {activity.isLiveSynced
                ? githubActivitySection.liveSyncedNote
                : githubActivitySection.snapshotNote}
            </span>
          </div>
        </div>

        {/* Lower Split: Monthly Commit Frequency + Recently Pushed Repositories */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Monthly Commit Frequency Bar Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs dark:shadow-none lg:col-span-7">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              {githubActivitySection.monthlyTitle}
            </h3>

            <div
              dir="ltr"
              className="mt-6 grid grid-cols-12 items-end gap-2 sm:gap-3 h-40 pt-5"
            >
              {monthlySummary.map((month) => {
                const heightPct =
                  month.count === 0
                    ? 4
                    : Math.max(10, Math.round((month.count / maxMonthlyCount) * 100));

                return (
                  <div
                    key={month.key}
                    className="flex h-full flex-col items-center justify-end gap-1.5"
                  >
                    <span className="font-mono text-[10px] font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                      {month.count > 0 ? month.count : ''}
                    </span>
                    <div className="flex w-full flex-1 items-end justify-center">
                      <motion.div
                        initial={shouldReduceMotion ? false : { scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: `${heightPct}%`, originY: 1 }}
                        title={`${month.label}: ${month.count}`}
                        className={`w-full max-w-[26px] rounded-t-md ${
                          month.count > 0
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-600 dark:to-blue-400'
                            : 'bg-slate-200/80 dark:bg-white/[0.06]'
                        }`}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {month.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recently Updated Repositories */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs dark:shadow-none lg:col-span-5">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              {githubActivitySection.recentReposTitle}
            </h3>

            <ul className="mt-4 divide-y divide-slate-100 dark:divide-white/[0.06]">
              {activity.recentRepos.map((repo) => {
                const langDot =
                  (repo.language && LANGUAGE_DOT_COLOR[repo.language]) || 'bg-blue-500';
                return (
                  <li key={repo.name} className="py-3 first:pt-0 last:pb-0">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent('GitHub Repo Activity Click', {
                          section: 'github-activity',
                          label: repo.name,
                        })
                      }
                      className="group flex items-center justify-between gap-3 rounded-lg -mx-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Code2
                            className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          <span className="truncate font-mono text-xs font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                            {repo.name}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          {repo.language && (
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                aria-hidden="true"
                                className={`h-1.5 w-1.5 rounded-full ${langDot}`}
                              />
                              <span>{repo.language}</span>
                            </span>
                          )}
                          <span className="font-mono">
                            {githubActivitySection.updatedPrefix}{' '}
                            {formatDisplayDate(repo.pushedAt, lang)}
                          </span>
                        </div>
                      </div>

                      <ExternalLink
                        className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
