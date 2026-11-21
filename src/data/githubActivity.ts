import type { Language } from '../context/LanguageContext';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubRepoSummary {
  name: string;
  htmlUrl: string;
  language: string | null;
  pushedAt: string;
}

export interface GitHubActivityData {
  username: string;
  profileUrl: string;
  totalContributions: number;
  contributions: ContributionDay[];
  publicRepos: number;
  recentRepos: GitHubRepoSummary[];
  isLiveSynced: boolean;
}

export interface MonthlyCommitSummary {
  key: string;
  label: string;
  count: number;
}

export const GITHUB_USERNAME = 'Abdallaheslam';
export const GITHUB_PROFILE_URL = 'https://github.com/Abdallaheslam';

// Verified public GitHub calendar activity for @Abdallaheslam (rolling window 2025-11-09 -> 2026-11-14)
const VERIFIED_NONZERO_COUNTS: Record<string, { count: number; level: 1 | 2 | 3 | 4 }> = {
  '2025-12-06': { count: 1, level: 1 },
  '2025-12-07': { count: 5, level: 1 },
  '2025-12-08': { count: 4, level: 1 },
  '2025-12-13': { count: 6, level: 2 },
  '2025-12-17': { count: 2, level: 1 },
  '2025-12-18': { count: 38, level: 4 },
  '2025-12-19': { count: 5, level: 1 },
  '2025-12-20': { count: 22, level: 4 },
  '2025-12-21': { count: 5, level: 1 },
  '2025-12-22': { count: 4, level: 1 },
  '2025-12-23': { count: 2, level: 1 },
  '2025-12-24': { count: 5, level: 1 },
  '2025-12-25': { count: 22, level: 4 },
  '2025-12-26': { count: 22, level: 4 },
  '2025-12-27': { count: 63, level: 4 },
  '2025-12-29': { count: 1, level: 1 },
  '2026-01-07': { count: 93, level: 4 },
  '2026-01-08': { count: 1, level: 1 },
  '2026-01-18': { count: 3, level: 1 },
  '2026-02-23': { count: 1, level: 1 },
  '2026-09-18': { count: 3, level: 1 },
  '2026-09-23': { count: 1, level: 1 },
};

const VERIFIED_RECENT_REPOS: GitHubRepoSummary[] = [
  {
    name: 'OpenCreator',
    htmlUrl: 'https://github.com/Abdallaheslam/OpenCreator',
    language: 'TypeScript',
    pushedAt: '2026-09-23T15:36:31Z',
  },
  {
    name: 'elostaz',
    htmlUrl: 'https://github.com/Abdallaheslam/elostaz',
    language: 'TypeScript',
    pushedAt: '2026-09-18T18:37:00Z',
  },
  {
    name: 'ostaz.ai7',
    htmlUrl: 'https://github.com/Abdallaheslam/ostaz.ai7',
    language: 'HTML',
    pushedAt: '2026-01-08T07:45:45Z',
  },
  {
    name: 'almuluk-store-test',
    htmlUrl: 'https://github.com/Abdallaheslam/almuluk-store-test',
    language: 'HTML',
    pushedAt: '2025-12-26T22:14:49Z',
  },
];

function buildVerifiedContributions(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const start = new Date(Date.UTC(2025, 10, 9)); // 2025-11-09 (Sunday)
  const totalDays = 371; // 53 full weeks

  for (let i = 0; i < totalDays; i++) {
    const current = new Date(start.getTime() + i * 86_400_000);
    const iso = current.toISOString().slice(0, 10);
    const entry = VERIFIED_NONZERO_COUNTS[iso];
    days.push({
      date: iso,
      count: entry ? entry.count : 0,
      level: entry ? entry.level : 0,
    });
  }

  return days;
}

export function getVerifiedGitHubSnapshot(): GitHubActivityData {
  const contributions = buildVerifiedContributions();
  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);

  return {
    username: GITHUB_USERNAME,
    profileUrl: GITHUB_PROFILE_URL,
    totalContributions,
    contributions,
    publicRepos: 13,
    recentRepos: VERIFIED_RECENT_REPOS,
    isLiveSynced: false,
  };
}

interface RawContributionsApiResponse {
  total?: Record<string, number>;
  contributions?: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

interface RawGitHubUserResponse {
  public_repos?: number;
}

interface RawGitHubRepoResponse {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
  description: string | null;
}

export async function fetchLiveGitHubActivity(
  signal?: AbortSignal,
): Promise<GitHubActivityData> {
  const fallback = getVerifiedGitHubSnapshot();

  const [contribResult, userResult, reposResult] = await Promise.allSettled([
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
      signal,
    }).then((res) => {
      if (!res.ok) throw new Error(`Contributions status ${res.status}`);
      return res.json() as Promise<RawContributionsApiResponse>;
    }),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      signal,
    }).then((res) => {
      if (!res.ok) throw new Error(`User status ${res.status}`);
      return res.json() as Promise<RawGitHubUserResponse>;
    }),
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`,
      { signal },
    ).then((res) => {
      if (!res.ok) throw new Error(`Repos status ${res.status}`);
      return res.json() as Promise<RawGitHubRepoResponse[]>;
    }),
  ]);

  let contributions = fallback.contributions;
  let totalContributions = fallback.totalContributions;
  let hasLiveCalendar = false;

  if (
    contribResult.status === 'fulfilled' &&
    Array.isArray(contribResult.value.contributions) &&
    contribResult.value.contributions.length > 0
  ) {
    contributions = contribResult.value.contributions.map((day) => {
      const clampedLevel = Math.max(0, Math.min(4, Number(day.level) || 0)) as
        | 0
        | 1
        | 2
        | 3
        | 4;
      return {
        date: day.date,
        count: Number(day.count) || 0,
        level: clampedLevel,
      };
    });
    totalContributions =
      contribResult.value.total?.lastYear ??
      contributions.reduce((sum, day) => sum + day.count, 0);
    hasLiveCalendar = true;
  }

  let publicRepos = fallback.publicRepos;
  if (
    userResult.status === 'fulfilled' &&
    typeof userResult.value.public_repos === 'number'
  ) {
    publicRepos = userResult.value.public_repos;
  }

  let recentRepos = fallback.recentRepos;
  if (reposResult.status === 'fulfilled' && Array.isArray(reposResult.value)) {
    const curated = reposResult.value
      .filter(
        (repo) =>
          repo.name.toLowerCase() !== 'salomi' &&
          (repo.language !== null || (repo.description?.length ?? 0) > 10),
      )
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        htmlUrl: repo.html_url,
        language: repo.language,
        pushedAt: repo.pushed_at,
      }));
    if (curated.length > 0) {
      recentRepos = curated;
    }
  }

  return {
    username: GITHUB_USERNAME,
    profileUrl: GITHUB_PROFILE_URL,
    totalContributions,
    contributions,
    publicRepos,
    recentRepos,
    isLiveSynced: hasLiveCalendar,
  };
}

export function groupContributionsIntoWeeks(
  days: ContributionDay[],
  lang: Language,
): {
  weeks: Array<Array<ContributionDay | null>>;
  monthLabels: Array<{ label: string; colIndex: number }>;
} {
  if (days.length === 0) {
    return { weeks: [], monthLabels: [] };
  }

  const weeks: Array<Array<ContributionDay | null>> = [];
  const firstDate = new Date(`${days[0].date}T00:00:00Z`);
  const leadingEmptyDays = firstDate.getUTCDay();

  let currentWeek: Array<ContributionDay | null> = Array(leadingEmptyDays).fill(null);
  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  const monthLabels: Array<{ label: string; colIndex: number }> = [];
  let lastMonth = '';
  let lastColIndex = -4;

  weeks.forEach((week, colIndex) => {
    const firstValidDay = week.find((d): d is ContributionDay => d !== null);
    if (!firstValidDay) return;
    const monthKey = firstValidDay.date.slice(0, 7);
    if (monthKey !== lastMonth) {
      lastMonth = monthKey;
      if (colIndex - lastColIndex >= 3) {
        const dateObj = new Date(`${firstValidDay.date}T00:00:00Z`);
        monthLabels.push({
          label: formatter.format(dateObj),
          colIndex,
        });
        lastColIndex = colIndex;
      }
    }
  });

  return { weeks, monthLabels };
}

export function summarizeMonthlyActivity(
  days: ContributionDay[],
  lang: Language,
): MonthlyCommitSummary[] {
  const buckets = new Map<string, number>();

  for (const day of days) {
    const monthKey = day.date.slice(0, 7);
    buckets.set(monthKey, (buckets.get(monthKey) ?? 0) + day.count);
  }

  const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  // Take the trailing 12 distinct months for a crisp 12-bar frequency strip
  const entries = Array.from(buckets.entries()).slice(-12);

  return entries.map(([key, count]) => {
    const dateObj = new Date(`${key}-01T00:00:00Z`);
    return {
      key,
      label: formatter.format(dateObj),
      count,
    };
  });
}
