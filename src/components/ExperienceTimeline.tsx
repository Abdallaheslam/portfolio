import { Briefcase, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';

export default function ExperienceTimeline() {
  const { lang } = useLanguage();
  const { experience, education, experienceSection } = getPortfolioContent(lang);

  return (
    <section id="experience" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            {experienceSection.kicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {experienceSection.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {experienceSection.subheading}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Work Experience Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-white/[0.08] pb-3">
              <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {experienceSection.workTitle}
              </h3>
            </div>

            <ol className="relative mt-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:start-[7px] before:w-px before:bg-slate-200 dark:before:bg-white/[0.1]">
              {experience.map((item) => (
                <li key={item.id} className="relative ps-8">
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 start-0 h-[15px] w-[15px] rounded-full border-2 ${
                      item.current
                        ? 'border-blue-600 dark:border-blue-500 bg-slate-50 dark:bg-[#060A13]'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#060A13]'
                    }`}
                  />

                  <article className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs dark:shadow-none">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        {item.role}
                      </h4>
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                        {item.period}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.company}
                      </span>
                      <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                        ·
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {item.locationOrSite}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {item.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                          />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          {/* Education Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-white/[0.08] pb-3">
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {experienceSection.educationTitle}
              </h3>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 shadow-xs dark:shadow-none">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400 tabular-nums">
                  {education.period}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {experienceSection.expectedGradPrefix}: {education.expectedGraduation}
                </span>
              </div>

              <h4 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
                {education.degree}
              </h4>

              <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                {education.institution}
              </p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {education.location}
              </p>

              <p className="mt-4 border-t border-slate-200 dark:border-white/[0.08] pt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {education.statusNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
