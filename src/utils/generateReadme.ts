import {
  PORTFOLIO_DATA_EN,
  type ProjectItem,
} from '../data/portfolioData';

export type ReadmeLicense = 'MIT' | 'Apache-2.0' | 'Proprietary';

export interface ReadmeGeneratorOptions {
  includeBadges: boolean;
  includeScreenshots: boolean;
  includeSetupGuide: boolean;
  includeStructure: boolean;
  license: ReadmeLicense;
}

const TECH_BADGE_SLUGS: Record<string, { label: string; color: string; logo?: string }> = {
  HTML: { label: 'HTML5', color: 'E34F26', logo: 'html5' },
  CSS: { label: 'CSS3', color: '1572B6', logo: 'css3' },
  JavaScript: { label: 'JavaScript', color: 'F7DF1E', logo: 'javascript' },
  TypeScript: { label: 'TypeScript', color: '3178C6', logo: 'typescript' },
  React: { label: 'React', color: '20232A', logo: 'react' },
  'Node.js': { label: 'Node.js', color: '339933', logo: 'nodedotjs' },
  'Express.js': { label: 'Express.js', color: '000000', logo: 'express' },
  MongoDB: { label: 'MongoDB', color: '47A248', logo: 'mongodb' },
  Flutter: { label: 'Flutter', color: '02569B', logo: 'flutter' },
  Dart: { label: 'Dart', color: '0175C2', logo: 'dart' },
  Firebase: { label: 'Firebase', color: 'DD2C00', logo: 'firebase' },
  'PWA Manifest': { label: 'PWA_Ready', color: '5A0FC8', logo: 'pwa' },
  'JSON-LD SEO': { label: 'Schema.org_SEO', color: '2563EB' },
  'RTL Layout': { label: 'Arabic_RTL', color: '0EA5E9' },
  'Arabic RTL': { label: 'Arabic_RTL', color: '0EA5E9' },
  'POS System': { label: 'POS_System', color: '16A34A' },
  'Offline-First Sync': { label: 'Offline--First_Sync', color: '0D9488' },
  'Inventory & Reports': { label: 'Inventory_%26_Reports', color: 'D97706' },
  '80mm Print & CSV': { label: '80mm_Receipt_%26_CSV', color: '4F46E5' },
  'Role-Based Access': { label: 'Role--Based_Access', color: '2563EB' },
  'Canva AI': { label: 'Canva_AI', color: '00C4CC', logo: 'canva' },
  'Graphic Design': { label: 'Graphic_Design', color: '4F46E5' },
  'Product Marketing': { label: 'Product_Marketing', color: '2563EB' },
  'Ad Banners': { label: 'Ad_Banners', color: '0284C7' },
  'Bilingual Copy': { label: 'Bilingual_AR--EN', color: '16A34A' },
  'Responsive Design': { label: 'Responsive_UI', color: '2563EB' },
  'Tajawal Font': { label: 'Tajawal_Typography', color: '334155' },
};

function encodeShieldSegment(input: string): string {
  return encodeURIComponent(input.replace(/-/g, '--').replace(/_/g, '__').replace(/\s+/g, '_'));
}

function buildTechBadge(tech: string): string {
  const entry = TECH_BADGE_SLUGS[tech];
  if (entry) {
    const logoPart = entry.logo ? `&logo=${encodeURIComponent(entry.logo)}&logoColor=white` : '';
    return `![${tech}](https://img.shields.io/badge/${encodeShieldSegment(entry.label)}-${entry.color}?style=flat-square${logoPart})`;
  }
  return `![${tech}](https://img.shields.io/badge/${encodeShieldSegment(tech)}-1E293B?style=flat-square)`;
}

function inferProjectStructure(project: ProjectItem): string {
  const slug = project.repoSlug || project.id;
  const hasPwa = project.stack.some((s) => s.toLowerCase().includes('pwa'));

  if (hasPwa) {
    return `${slug}/
├── index.html          # Semantic RTL storefront entry & Schema.org markup
├── manifest.json       # Progressive Web App metadata & icons
├── sw.js               # Service worker caching strategy
├── css/
│   └── style.css       # Responsive grid, tokens & RTL layout rules
├── js/
│   └── app.js          # Search, categories, cart & modal workflows
└── assets/
    └── images/         # Product catalog & UI visual assets`;
  }

  return `${slug}/
├── index.html          # Responsive RTL HTML5 structure & SEO metadata
├── css/
│   └── styles.css      # Mobile-first layout, typography & theme styles
├── js/
│   └── main.js         # Interactive components & client actions
└── assets/
    └── images/         # Brand visuals & media files`;
}

function resolveCanonicalEnglishProject(projectId: string, fallback: ProjectItem): ProjectItem {
  return PORTFOLIO_DATA_EN.projects.find((p) => p.id === projectId) ?? fallback;
}

export function generateProjectReadme(
  inputProject: ProjectItem,
  options: ReadmeGeneratorOptions,
  liveStars?: number,
): string {
  const project = resolveCanonicalEnglishProject(inputProject.id, inputProject);
  const { personal } = PORTFOLIO_DATA_EN;
  const repoSlug = project.repoSlug || project.id;
  const repoPath = `Abdallaheslam/${repoSlug}`;

  const sections: string[] = [];

  // Header & Badges
  const headerLines: string[] = [
    `# ${project.title}`,
    '',
    `> **${project.subtitle}** — ${project.categoryLabel}`,
  ];

  if (options.includeBadges) {
    const badgeRows: string[] = [];
    if (project.githubUrl) {
      badgeRows.push(
        `[![GitHub Repo](https://img.shields.io/badge/GitHub-${encodeShieldSegment(repoSlug)}-181717?style=flat-square&logo=github)](${project.githubUrl})`,
      );
      if (typeof liveStars === 'number') {
        badgeRows.push(
          `[![GitHub Stars](https://img.shields.io/github/stars/${repoPath}?style=flat-square&color=2563EB)](${project.githubUrl}/stargazers)`,
        );
      }
    }
    if (project.liveDemoUrl) {
      badgeRows.push(
        `[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-16A34A?style=flat-square&logo=googlechrome&logoColor=white)](${project.liveDemoUrl})`,
      );
    }
    badgeRows.push(
      `[![License](https://img.shields.io/badge/License-${encodeShieldSegment(options.license)}-0F172A?style=flat-square)](#license)`,
    );

    headerLines.push('', badgeRows.join(' '));
    headerLines.push(project.stack.map(buildTechBadge).join(' '));
  }

  if (project.liveDemoUrl || project.githubUrl) {
    const quickLinks: string[] = [];
    if (project.liveDemoUrl) {
      quickLinks.push(`[Live Demo](${project.liveDemoUrl})`);
    }
    if (project.githubUrl) {
      quickLinks.push(`[GitHub Repository](${project.githubUrl})`);
    }
    headerLines.push('', `**Quick Links:** ${quickLinks.join(' · ')}`);
  }

  sections.push(headerLines.join('\n'));

  // Overview
  sections.push(
    [
      '## Overview',
      '',
      project.expandedDescription,
    ].join('\n'),
  );

  // Key Features
  if (project.highlights.length > 0) {
    sections.push(
      [
        '## Key Features',
        '',
        ...project.highlights.map((item) => `- ${item}`),
      ].join('\n'),
    );
  }

  // Tech Stack & Metrics
  const stackLines: string[] = [
    '## Tech Stack & Highlights',
    '',
    '| Category | Details |',
    '| :--- | :--- |',
    `| **Stack** | ${project.stack.join(', ')} |`,
    ...project.metrics.map((m) => {
      const val =
        m.icon === 'stars' && typeof liveStars === 'number'
          ? String(liveStars)
          : m.value;
      return `| **${m.label}** | ${val} |`;
    }),
  ];
  sections.push(stackLines.join('\n'));

  // Screenshots
  if (options.includeScreenshots && project.screenshots.length > 0) {
    const screenshotLines: string[] = [
      '## Screenshots',
      '',
      '| Preview | Description |',
      '| :--- | :--- |',
      ...project.screenshots.map(
        (shot) =>
          `| ![${shot.alt}](.${shot.src}) | ${shot.caption} |`,
      ),
    ];
    sections.push(screenshotLines.join('\n'));
  }

  // Project Structure
  if (options.includeStructure) {
    sections.push(
      [
        '## Project Structure',
        '',
        '```text',
        inferProjectStructure(project),
        '```',
      ].join('\n'),
    );
  }

  // Getting Started
  if (options.includeSetupGuide) {
    const cloneUrl = project.githubUrl
      ? `${project.githubUrl}.git`
      : `https://github.com/Abdallaheslam/${repoSlug}.git`;

    sections.push(
      [
        '## Getting Started',
        '',
        'Run a local copy on your machine:',
        '',
        '```bash',
        '# 1. Clone the repository',
        `git clone ${cloneUrl}`,
        '',
        '# 2. Navigate into the project directory',
        `cd ${repoSlug}`,
        '',
        '# 3. Serve locally (any static HTTP server works)',
        'npx serve .',
        '```',
        '',
        'Alternatively, open `index.html` with the VS Code **Live Server** extension.',
      ].join('\n'),
    );
  }

  // Author & Contact
  sections.push(
    [
      '## Author',
      '',
      `**${personal.fullName}** (${personal.displayName}) — ${personal.academicTag}`,
      '',
      `- GitHub: [@Abdallaheslam](${personal.githubUrl})`,
      `- LinkedIn: [abdallah-islam](${personal.linkedinUrl})`,
      `- Email: [${personal.email}](mailto:${personal.email})`,
    ].join('\n'),
  );

  // License
  const licenseNote =
    options.license === 'MIT'
      ? `This project is licensed under the **MIT License** — feel free to use and adapt with attribution.`
      : options.license === 'Apache-2.0'
        ? `This project is licensed under the **Apache License 2.0**.`
        : `All rights reserved. Proprietary project built by **${personal.fullName}**.`;

  sections.push(['## License', '', licenseNote].join('\n'));

  return sections.join('\n\n') + '\n';
}
