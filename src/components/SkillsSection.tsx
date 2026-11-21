import { Code2, Database, Globe, MonitorCog, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';

const CATEGORY_ICONS: Record<string, typeof MonitorCog> = {
  programming: Code2,
  databases: Database,
  tools: Wrench,
  'it-support': MonitorCog,
};

export default function SkillsSection() {
  const { lang } = useLanguage();
  const { technicalSkills, coreSkills, languages, skillsSection } = getPortfolioContent(lang);

  return (
    <section id="skills" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            {skillsSection.kicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {skillsSection.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {skillsSection.subheading}
          </p>
        </div>

        {/* 4 Technical Skill Categories */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {technicalSkills.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] || Code2;
            return (
              <div
                key={category.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 shadow-xs dark:shadow-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-400">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-200 dark:border-white/[0.08] pt-4 text-sm text-slate-700 dark:text-slate-200">
                  {category.items.map((skill) => (
                    <li key={skill} className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/80 dark:bg-blue-500/80"
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Core Skills & Languages Row */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Core Skills */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 shadow-xs dark:shadow-none lg:col-span-8">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {skillsSection.coreTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {skillsSection.coreSubtitle}
            </p>

            <ul className="mt-5 grid grid-cols-1 gap-y-2.5 gap-x-6 sm:grid-cols-3">
              {coreSkills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500"
                  />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 shadow-xs dark:shadow-none lg:col-span-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {skillsSection.languagesTitle}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {skillsSection.languagesSubtitle}
            </p>

            <dl className="mt-5 divide-y divide-slate-200 dark:divide-white/[0.08]">
              {languages.map((item) => (
                <div
                  key={item.language}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <dt className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.language}
                  </dt>
                  <dd className="font-mono text-xs text-blue-600 dark:text-blue-400">
                    {item.proficiency}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
