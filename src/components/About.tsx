import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';

export default function About() {
  const { lang } = useLanguage();
  const { about, personal } = getPortfolioContent(lang);

  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Section Label */}
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              {about.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {about.heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {personal.availability}
            </p>
          </div>

          {/* Bio Prose & Factual Metadata */}
          <div className="lg:col-span-8">
            <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[1.0625rem]">
              {about.summary}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 dark:border-white/[0.08] pt-8 sm:grid-cols-2">
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] px-5 py-4 shadow-xs dark:shadow-none"
                >
                  <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-display text-sm font-semibold text-slate-900 dark:text-white">
                    {fact.value}
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
