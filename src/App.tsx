import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { getPortfolioContent } from './data/portfolioData';
import { trackPageView } from './utils/analytics';
import ScrollProgressBar from './components/ScrollProgressBar';
import SectionDivider from './components/SectionDivider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ExperienceTimeline from './components/ExperienceTimeline';
import ProjectsSection from './components/ProjectsSection';
import GitHubActivitySection from './components/GitHubActivitySection';
import SkillsSection from './components/SkillsSection';
import CvSection from './components/CvSection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function PortfolioShell() {
  const { lang } = useLanguage();
  const content = getPortfolioContent(lang);

  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060A13] dark:text-slate-100 transition-colors duration-200">
      <ScrollProgressBar />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {content.nav.skipToContent}
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <GitHubActivitySection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <About />
        <SectionDivider />
        <ExperienceTimeline />
        <SectionDivider />
        <CvSection />
        <SectionDivider />
        <ReviewsSection />
        <SectionDivider />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionConfig reducedMotion="user">
          <PortfolioShell />
        </MotionConfig>
      </LanguageProvider>
    </ThemeProvider>
  );
}
