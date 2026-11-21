import type { Language } from '../context/LanguageContext';
import { withBaseUrl } from '../utils/assetUrl';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  locationOrSite: string;
  period: string;
  current?: boolean;
  responsibilities: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  expectedGraduation: string;
  statusNote: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  icon: 'languages' | 'stars' | 'hosting' | 'architecture' | 'testing' | 'database';
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'web' | 'systems' | 'design' | 'mobile-backend';
  categoryLabel: string;
  description: string;
  expandedDescription: string;
  highlights: string[];
  metrics: ProjectMetric[];
  stack: string[];
  repoSlug?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  screenshots: ProjectScreenshot[];
  previewType: 'screenshot' | 'flutter-ui' | 'nodejs-api';
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface PortfolioContent {
  nav: {
    brand: string;
    links: { label: string; href: string }[];
    downloadCv: string;
    downloadMyCv: string;
    appearance: string;
    skipToContent: string;
  };
  personal: {
    displayName: string;
    fullName: string;
    headline: string;
    tagline: string;
    availability: string;
    shortAvailability: string;
    location: string;
    email: string;
    phone: string;
    phoneHref: string;
    linkedinUrl: string;
    githubUrl: string;
    profilePhoto: string;
    profilePhotoAlt: string;
    photoSubtitle: string;
    academicTag: string;
  };
  heroIntro: string;
  heroActions: {
    viewProjects: string;
    downloadCv: string;
    contactMe: string;
    socialLabel: string;
  };
  about: {
    kicker: string;
    heading: string;
    summary: string;
    facts: { label: string; value: string }[];
  };
  experienceSection: {
    kicker: string;
    heading: string;
    subheading: string;
    workTitle: string;
    educationTitle: string;
    expectedGradPrefix: string;
  };
  experience: ExperienceItem[];
  education: EducationItem;
  projectsSection: {
    kicker: string;
    heading: string;
    subheading: string;
    filters: { id: 'all' | 'web' | 'systems' | 'design' | 'mobile-backend'; label: string }[];
    galleryLabel: string;
    inspectLabel: string;
    viewDetails: string;
    closeModal: string;
    liveDemo: string;
    repository: string;
    viewScope: string;
    overviewHeading: string;
    capabilitiesHeading: string;
    metricsHeading: string;
    stackHeading: string;
    openLiveDemo: string;
    viewGithubRepo: string;
    unavailablePreview: string;
  };
  projects: ProjectItem[];
  githubActivitySection: {
    kicker: string;
    heading: string;
    subheading: string;
    viewProfile: string;
    metrics: {
      totalContributions: string;
      activeDays: string;
      peakDay: string;
      publicRepos: string;
    };
    calendarTitle: string;
    calendarHint: string;
    contributionSingular: string;
    contributionPlural: string;
    noContributions: string;
    less: string;
    more: string;
    monthlyTitle: string;
    recentReposTitle: string;
    updatedPrefix: string;
    liveSyncedNote: string;
    snapshotNote: string;
  };
  skillsSection: {
    kicker: string;
    heading: string;
    subheading: string;
    coreTitle: string;
    coreSubtitle: string;
    languagesTitle: string;
    languagesSubtitle: string;
  };
  technicalSkills: SkillCategory[];
  coreSkills: string[];
  languages: LanguageItem[];
  cvSection: {
    kicker: string;
    heading: string;
    description: string;
    metaNote: string;
    downloadButton: string;
    previewButton: string;
    modalTitlePrefix: string;
    downloadPdfShort: string;
    printLabel: string;
    summaryHeading: string;
    experienceHeading: string;
    educationHeading: string;
    skillsHeading: string;
    coreSkillsHeading: string;
    languagesHeading: string;
    viewer: {
      fileLabel: string;
      page: string;
      of: string;
      prevPage: string;
      nextPage: string;
      zoomOut: string;
      zoomIn: string;
      fitWidth: string;
      singlePage: string;
      allPages: string;
      fullscreen: string;
      closePreview: string;
      loadingPdf: string;
    };
  };
  contactSection: {
    kicker: string;
    heading: string;
    subheading: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    copy: string;
    copied: string;
    formTitle: string;
    formIntroBefore: string;
    formIntroAfter: string;
    nameLabel: string;
    namePlaceholder: string;
    emailInputLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    copyDraftButton: string;
    draftCopied: string;
    statusMessagePrefix: string;
    statusMessageSuffix: string;
    errors: {
      name: string;
      email: string;
      subject: string;
      message: string;
    };
  };
  reviewsSection: {
    kicker: string;
    heading: string;
    subheading: string;
    averageLabel: string;
    totalRatingsSingular: string;
    totalRatingsPlural: string;
    noReviewsYet: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    ratingLabel: string;
    ratingHints: string[];
    commentLabel: string;
    commentPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successMessage: string;
    loadingMessage: string;
    errorMessage: string;
    emptyStateTitle: string;
    emptyStateBody: string;
    validation: {
      name: string;
      rating: string;
      comment: string;
    };
  };
  footer: {
    rights: string;
    privacyNotice: string;
  };
}

export const PORTFOLIO_DATA_EN: PortfolioContent = {
  nav: {
    brand: 'Abdullah Islam',
    links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Reviews', href: '#reviews' },
      { label: 'Contact', href: '#contact' },
    ],
    downloadCv: 'Download CV',
    downloadMyCv: 'Download My CV',
    appearance: 'Appearance',
    skipToContent: 'Skip to main content',
  },
  personal: {
    displayName: 'Abdullah Islam',
    fullName: 'Abdullah Eslam Hassan',
    headline: 'Software Engineer | Web, Backend & Mobile Development',
    tagline:
      'Building Reliable Web, Backend, and Mobile Software Backed by Real-World Technical Operations.',
    availability:
      'Open to Junior Software Engineer, Full-Stack Developer, and Backend/Frontend/Flutter roles in Egypt and internationally (on-site or remote).',
    shortAvailability: 'Open to Software Engineering Roles (On-site / Remote)',
    location: 'Benha, Egypt',
    email: 'abdallaheslam815@gmail.com',
    phone: '+20 115 599 6956',
    phoneHref: '+201155996956',
    linkedinUrl: 'https://www.linkedin.com/in/abdallah-islam/',
    githubUrl: 'https://github.com/Abdallaheslam',
    profilePhoto: '/assets/aistudio/ChatGPT_Image_Jun_9__2026__03_35_32_PM_35d45928.png',
    profilePhotoAlt: 'Portrait of Abdullah Eslam Hassan working on a laptop',
    photoSubtitle: 'Software Engineer · B.Sc. Computer Science',
    academicTag: 'B.Sc. Computer Science',
  },
  heroIntro:
    'Computer Science undergraduate (2023–2027) building full-stack web applications, REST APIs, and cross-platform apps with JavaScript, Node.js, Express, MongoDB, Flutter, and Firebase — alongside serving as IT Support Focal Point & Team Lead at Holool for Programming (El Sheikh Zayed).',
  heroActions: {
    viewProjects: 'View Engineering Projects',
    downloadCv: 'Download My CV',
    contactMe: 'Contact Me',
    socialLabel: 'LinkedIn · GitHub',
  },
  about: {
    kicker: 'About Me',
    heading: 'Software engineering focus strengthened by production IT operations.',
    summary:
      'Computer Science undergraduate focused on software engineering, web development, backend APIs, and modern responsive applications. Experienced in building full-stack JavaScript applications (Node.js, Express, MongoDB), Firebase-backed apps, and Arabic RTL web storefronts. Alongside software development, serves as IT Support Focal Point & Team Lead at Holool for Programming in El Sheikh Zayed, bringing strong team direction, troubleshooting, and documentation into engineering work.',
    facts: [
      { label: 'Full Name', value: 'Abdullah Eslam Hassan' },
      { label: 'Engineering Focus', value: 'Full-Stack Web, REST APIs & Modern UI' },
      { label: 'Academic Track', value: 'B.Sc. Computer Science (2023 – 2027)' },
      { label: 'Current Leadership', value: 'IT Focal Point · Holool for Programming' },
    ],
  },
  experienceSection: {
    kicker: 'Background',
    heading: 'Work Experience & Education',
    subheading:
      'Hands-on IT team leadership and freelance web development alongside formal Computer Science study.',
    workTitle: 'Work Experience',
    educationTitle: 'Education',
    expectedGradPrefix: 'Expected Graduation',
  },
  experience: [
    {
      id: 'holool',
      role: 'IT Support Focal Point & Team Lead',
      company: 'Holool for Programming',
      locationOrSite: 'El Sheikh Zayed',
      period: 'July 2025 – Present',
      current: true,
      responsibilities: [
        'Serve as the primary IT Focal Point, responsible for managing and directing the on-site support team.',
        'Assign daily technical tasks, guide team members on troubleshooting workflows, and oversee incident resolution.',
        'Supervise hardware, software, printer, and network support across clinical and administrative workstations.',
        'Coordinate directly between hospital staff, management, and the IT team while maintaining incident documentation and equipment readiness.',
      ],
    },
    {
      id: 'dragons-unity',
      role: 'Online HR Recruiter',
      company: 'Dragons Unity',
      locationOrSite: 'Remote',
      period: '2 months',
      responsibilities: [
        'Managed online recruitment activities and candidate outreach.',
        'Screened applicants and coordinated interview scheduling.',
        'Organized candidate information and maintained structured recruitment records.',
      ],
    },
    {
      id: 'freelance',
      role: 'Freelance Web Developer',
      company: 'Self-Employed · Freelance',
      locationOrSite: 'Remote · Egypt',
      period: 'Project-Based',
      responsibilities: [
        'Designed and built responsive Arabic (RTL) and bilingual (RTL/LTR) websites using HTML, CSS, JavaScript, and modern UI patterns.',
        'Delivered custom web storefronts and service landing pages with direct WhatsApp ordering and mobile-first layouts.',
        'Collaborated remotely with clients on project-based engagements to gather requirements, refine UI/UX designs, and deploy production websites.',
      ],
    },
  ],
  education: {
    degree: 'Bachelor of Computer Science (B.Sc.)',
    institution: 'Modern Academy for Computer Science and Management Technology',
    location: 'Maadi, Cairo, Egypt',
    period: '2023 – 2027',
    expectedGraduation: '2027',
    statusNote:
      'Coursework and practical focus covering object-oriented programming, databases, software development fundamentals, and modern web and mobile technologies.',
  },
  projectsSection: {
    kicker: 'Software Engineering Portfolio',
    heading: 'Featured Engineering Projects',
    subheading:
      'Production-deployed web applications, RESTful backend services, and cross-platform mobile apps demonstrating clean architecture, API validation, and responsive UI.',
    filters: [
      { id: 'all', label: 'All Projects' },
      { id: 'web', label: 'Web Applications' },
      { id: 'systems', label: 'Systems & POS' },
      { id: 'design', label: 'Design & Canva AI' },
    ],
    galleryLabel: 'Gallery',
    inspectLabel: 'Inspect',
    viewDetails: 'Details',
    closeModal: 'Close',
    liveDemo: 'Live Demo',
    repository: 'Repository',
    viewScope: 'View Project Details',
    overviewHeading: 'Expanded Overview',
    capabilitiesHeading: 'Complete Feature List',
    metricsHeading: 'Key Project Metrics',
    stackHeading: 'Technology Stack',
    openLiveDemo: 'Open Live Demo',
    viewGithubRepo: 'View GitHub Repo',
    unavailablePreview: 'Screenshot preview unavailable',
  },
  projects: [
    {
      id: 'ostaz-ai7',
      title: 'Ostaz AI7',
      subtitle: 'Online Supermarket Web App & PWA',
      category: 'web',
      categoryLabel: 'Web Application & PWA',
      description:
        'An Arabic RTL online supermarket web application ("سوبر ماركت الأستاذ") engineered with Progressive Web App metadata and Schema.org Store markup, featuring search, category browsing, and cart workflows.',
      expandedDescription:
        'Designed and deployed as a full Arabic RTL online supermarket storefront ("سوبر ماركت الأستاذ"), built to feel responsive and app-like across both desktop browsers and mobile viewports. The architecture combines semantic HTML, modular CSS, and interactive JavaScript with a Progressive Web App (PWA) manifest and Schema.org Store JSON-LD structured data for search visibility.',
      highlights: [
        'Sticky storefront top bar featuring live product search input, Sign In, and Create Account actions.',
        'Promotional hero banner highlighting seasonal offers, discount coupons, and quick browse actions.',
        'Interactive category browsing grid for rapid filtering across supermarket product sections.',
        'Rich product cards displaying before/after EGP pricing, percentage discount badges, wishlist, share, quick-view, and add-to-cart controls.',
        'Mobile-oriented bottom navigation bar (Home, Products, Categories, Offers, Cart, Favorites, Notifications) with badge counters.',
        'Configured with PWA Manifest metadata and Schema.org Store JSON-LD markup.',
      ],
      metrics: [
        { label: 'Languages', value: 'HTML · JS · CSS', icon: 'languages' },
        { label: 'Hosting', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'GitHub Stars', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'PWA Manifest', 'JSON-LD SEO'],
      repoSlug: 'ostaz.ai7',
      liveDemoUrl: 'https://abdallaheslam.github.io/ostaz.ai7/',
      githubUrl: 'https://github.com/Abdallaheslam/ostaz.ai7',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_ccc49532.png',
          alt: 'Ostaz AI7 online supermarket home view with search bar, promotions, and categories',
          caption: 'Storefront home with search bar, promotional banner, and category grid',
        },
        {
          src: '/assets/aistudio/image_d5d14036.png',
          alt: 'Ostaz AI7 new products grid with discount tags, ratings, and add to cart buttons',
          caption: 'New products catalog with discount tags, ratings, and add-to-cart actions',
        },
        {
          src: '/assets/aistudio/image_577043ca.png',
          alt: 'Ostaz AI7 sign-in modal with email, password, and Google authentication',
          caption: 'User sign-in modal with email/password and Google login option',
        },
        {
          src: '/assets/aistudio/image_65ac76d3.png',
          alt: 'Ostaz AI7 create account registration modal',
          caption: 'Account registration modal with validation rules',
        },
        {
          src: '/assets/aistudio/image_95aa5641.png',
          alt: 'Ostaz AI7 shopping cart modal with quantity controls and order total',
          caption: 'Shopping cart modal with quantity controls, shipping summary, and checkout',
        },
      ],
    },
    {
      id: 'al-molok-coffee',
      title: 'Al Molok Coffee',
      subtitle: 'Arabic Specialty Coffee E-Commerce Storefront',
      category: 'web',
      categoryLabel: 'Web Storefront',
      description:
        'A responsive Arabic RTL storefront for a specialty coffee brand ("المُلوك"), featuring a full-bleed hero banner, coffee product catalog with EGP pricing, and WhatsApp ordering.',
      expandedDescription:
        'Custom Arabic RTL e-commerce storefront created for specialty coffee brand "Al Molok Coffee" (قهوة الملوك). Crafted to pair visual brand storytelling with frictionless mobile and desktop purchasing through clear EGP pricing, tasting profile descriptions, and immediate WhatsApp order handoff.',
      highlights: [
        'Native Arabic RTL typography and responsive grid layout tailored for mobile and desktop shoppers.',
        'Full-bleed atmospheric hero landing section with immediate "Order Now" call to action.',
        'Curated coffee product catalog cards displaying variety names, roast/flavor descriptions, and EGP pricing.',
        'Per-product order buttons paired with a persistent floating WhatsApp button for direct customer ordering.',
      ],
      metrics: [
        { label: 'Languages', value: 'HTML · CSS · JS', icon: 'languages' },
        { label: 'Hosting', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'GitHub Stars', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'RTL Layout'],
      repoSlug: 'almuluk-store-test',
      liveDemoUrl: 'https://abdallaheslam.github.io/almuluk-store-test/',
      githubUrl: 'https://github.com/Abdallaheslam/almuluk-store-test',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_1a2fef9d.png',
          alt: 'Al Molok Coffee hero section showing Arabic headline and order CTA',
          caption: 'Hero landing view with Arabic brand messaging and WhatsApp integration',
        },
        {
          src: '/assets/aistudio/image_513d41ba.png',
          alt: 'Al Molok Coffee product catalog grid with coffee varieties and EGP pricing',
          caption: 'Product catalog grid displaying coffee origins, descriptions, and EGP pricing',
        },
        {
          src: '/assets/aistudio/image_c7335f5c.png',
          alt: 'Al Molok Coffee customer reviews section with star ratings and review action',
          caption: 'Customer testimonials section with star ratings and review submission trigger',
        },
        {
          src: '/assets/aistudio/image_25bb91b3.png',
          alt: 'Al Molok Coffee order channels and dark footer with contact information',
          caption: 'Direct order channels (phone, Facebook, WhatsApp) and branded Arabic footer',
        },
      ],
    },
    {
      id: 'ai7',
      title: 'AI7',
      subtitle: 'Web Development Services Landing Page',
      category: 'web',
      categoryLabel: 'Frontend Web',
      description:
        'An Arabic RTL web development service website ("AI7 – تطوير مواقع احترافية") presenting personal, commercial, and institutional website services with mission and vision framing.',
      expandedDescription:
        'Responsive Arabic RTL services landing page for "AI7 – تطوير مواقع احترافية", built to showcase professional website design and development offerings for individuals, businesses, and organizations. Structured with clean section navigation, visual brand identity, and clear conversion actions.',
      highlights: [
        'Clean RTL navigation header connecting Home, About, Services, and Contact sections.',
        'Gradient hero showcase presenting the brand tagline and service positioning clearly.',
        'Dedicated Mission, Vision, and Core Values card highlighting quality, creativity, and timely delivery.',
        'Dual primary actions guiding visitors to browse available web services or request a custom site.',
      ],
      metrics: [
        { label: 'Languages', value: 'CSS · HTML · JS', icon: 'languages' },
        { label: 'Hosting', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'GitHub Stars', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'Responsive Design', 'Tajawal Font'],
      repoSlug: 'ai7',
      liveDemoUrl: 'https://abdallaheslam.github.io/ai7/',
      githubUrl: 'https://github.com/Abdallaheslam/ai7',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_689b9c30.png',
          alt: 'AI7 Arabic web development services hero section and navigation bar',
          caption: 'Hero section with Arabic service overview, mission/vision card, and CTAs',
        },
        {
          src: '/assets/aistudio/image_063a9fa7.png',
          alt: 'AI7 About section presenting developer specializations and technical stack',
          caption: 'About section highlighting specialization areas and frontend technologies',
        },
        {
          src: '/assets/aistudio/image_c889058e.png',
          alt: 'AI7 web development service packages with EGP pricing tiers',
          caption: 'Service packages covering personal, commercial, and institutional websites',
        },
        {
          src: '/assets/aistudio/image_c497e9e0.png',
          alt: 'AI7 contact channels section with email, WhatsApp, TikTok, and Instagram',
          caption: 'Contact channels grid and project inquiry banner',
        },
      ],
    },
    {
      id: 'elostaz-pos',
      title: 'El Ostaz Smart POS',
      subtitle: 'Supermarket POS, Inventory & Financial Management System',
      category: 'systems',
      categoryLabel: 'POS & Management System',
      description:
        'A full-featured Arabic RTL supermarket Point of Sale (POS) & management system ("نظام الأستاذ الذكي لمبيعات السوبرماركت") with barcode checkout, 14% VAT calculation, 80mm thermal receipts, offline-first sync, warehouse audits, and financial reporting.',
      expandedDescription:
        'End-to-end Arabic RTL Point of Sale and retail management system engineered for supermarket operations. Features role-based instant switching between General Manager and Cashier, barcode & quick-scan checkout with 14% VAT and multi-payment methods (Cash, Card/Meeza, Loyalty Points), offline sale persistence with auto-sync, Zebra barcode label printing, profit margin simulation, warehouse stock-alert audits, and CSV/Excel financial exports.',
      highlights: [
        'Instant role-based access portal switching smoothly between General Manager (full control) and Sales Cashier.',
        'Fast Cashier POS terminal with international barcode lookup, quick-scan shortcuts, category filters, and automatic 14% VAT invoicing.',
        'Multi-payment checkout supporting Cash, Card/Meeza, and Loyalty Points with offline sale saving and automatic online resync.',
        'Formatted 80mm thermal receipt printing with tax registration number, invoice ID, cashier metadata, and itemized breakdown.',
        'Admin Product & Pricing portal featuring barcode generation, Zebra label printing, low-stock badges, and live profit margin simulator (+5%, +10%, 20% margin).',
        'Warehouse Audit & Financial Reports dashboards with low-shelf stock alerts, stock movement logs, weekly charts, loyalty points audit, and CSV/Excel export.',
      ],
      metrics: [
        { label: 'Architecture', value: 'POS & Inventory', icon: 'architecture' },
        { label: 'Hosting', value: 'elostaz.ai.studio', icon: 'hosting' },
        { label: 'Sync Mode', value: 'Offline-First', icon: 'database' },
      ],
      stack: [
        'Arabic RTL',
        'POS System',
        'Offline-First Sync',
        'Inventory & Reports',
        '80mm Print & CSV',
        'Role-Based Access',
      ],
      liveDemoUrl: 'https://elostaz.ai.studio/',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_afb9072c.png',
          alt: 'El Ostaz Smart POS role selection login portal for General Manager and Sales Cashier',
          caption: 'Role-based quick sign-in screen for Manager and Cashier accounts',
        },
        {
          src: '/assets/aistudio/image_63fbc984.png',
          alt: 'El Ostaz Smart POS cashier checkout interface with barcode search, stock levels, VAT 14%, and payment methods',
          caption: 'Cashier POS terminal with barcode scanning, 14% VAT calculation, and payment selector',
        },
        {
          src: '/assets/aistudio/image_edc9af77.png',
          alt: 'El Ostaz Smart POS admin product catalog, barcode generator, Zebra label print, and profit margin simulator',
          caption: 'Admin products & pricing portal with Zebra barcode labels and profit simulator',
        },
        {
          src: '/assets/aistudio/image_8a07320a.png',
          alt: 'El Ostaz Smart POS warehouse inventory audit dashboard showing stock units, market value, and low-stock alerts',
          caption: 'Warehouse inventory management, stock valuation, and shelf shortage alerts',
        },
        {
          src: '/assets/aistudio/image_2a70a467.png',
          alt: 'El Ostaz Smart POS financial reports, net profit metrics, CSV/Excel export, and weekly sales analytics',
          caption: 'Financial reports, net profit tracking, loyalty audit, and CSV/Excel export',
        },
        {
          src: '/assets/aistudio/image_9a3a4791.png',
          alt: 'El Ostaz Smart POS offline-saved sale confirmation and 80mm thermal tax receipt preview',
          caption: '80mm thermal tax receipt print preview with offline auto-sync status',
        },
      ],
    },
    {
      id: 'veyona-pharm-design',
      title: 'Veyona Pharm Campaign',
      subtitle: 'Commercial Beauty & Care Visual Suite via Canva AI',
      category: 'design',
      categoryLabel: 'Graphic Design · Canva AI',
      description:
        'A cohesive promotional advertising suite designed with Canva AI for Veyona Pharm skincare and relief products (Veyona Soap, Hyaloram Cream, Missy Spray & Gel), featuring bundle offer tiers and bilingual marketing copy.',
      expandedDescription:
        'Commercial brand and performance-marketing campaign designed using Canva AI. Crafted custom dark-slate studio product compositions, atmospheric lighting, clean iconography, and conversion-focused bundle layouts (GET 1, GET 2 10% OFF, GET 3 12% OFF, and GET 4 + 50 EGP Discount & Free Delivery) tailored for social ads and e-commerce banners.',
      highlights: [
        'Produced the full multi-banner campaign layout and studio-lit product staging using Canva AI workflows.',
        'Built four progressive bundle offer creatives (GET 1, GET 2 10% OFF, GET 3 12% OFF, GET 4) with clear visual hierarchy.',
        'Designed a dedicated hero offer banner highlighting 50 EGP Discount + Free Delivery for Veyona Soap, Hyaloram Cream, and Missy Gel/Spray.',
        'Integrated bilingual Arabic & English marketing copy paired with clean benefit iconography and high-contrast typography.',
      ],
      metrics: [
        { label: 'Design Tool', value: 'Canva AI', icon: 'architecture' },
        { label: 'Deliverables', value: '5 Ad Creatives', icon: 'architecture' },
        { label: 'Languages', value: 'AR · EN', icon: 'languages' },
      ],
      stack: [
        'Canva AI',
        'Graphic Design',
        'Product Marketing',
        'Ad Banners',
        'Bilingual Copy',
      ],
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_99eeb68c.png',
          alt: 'Veyona Pharm GET 4 Choose Any 4 Products banner with 50 EGP discount and free delivery created in Canva AI',
          caption: 'GET 4 bundle offer banner (50 EGP Discount + Free Delivery)',
        },
        {
          src: '/assets/aistudio/image_25e6401a.png',
          alt: 'Veyona Pharm Exclusive Beauty Collection bilingual Arabic and English hero banner designed with Canva AI',
          caption: 'Hero bilingual campaign banner (Veyona Pharm — Exclusive Beauty Collection)',
        },
        {
          src: '/assets/aistudio/image_403d91d9.png',
          alt: 'Veyona Pharm GET 1 Choose Your Favorite Product promotional banner designed in Canva AI',
          caption: 'GET 1 single-product spotlight banner with benefit icons',
        },
        {
          src: '/assets/aistudio/image_ed2d948e.png',
          alt: 'Veyona Pharm GET 2 Choose Any 2 Products 10% OFF promotional banner created in Canva AI',
          caption: 'GET 2 bundle banner featuring 10% OFF promotional badge',
        },
        {
          src: '/assets/aistudio/image_93b3054c.png',
          alt: 'Veyona Pharm GET 3 Choose Any 3 Products 12% OFF promotional banner designed in Canva AI',
          caption: 'GET 3 bundle banner featuring 12% OFF offer and vertical feature strip',
        },
      ],
    },
  ],
  githubActivitySection: {
    kicker: 'Open Source & Commit Consistency',
    heading: 'GitHub Contributions & Commit Frequency',
    subheading:
      'Public contribution calendar, monthly commit volume, and recently updated software repositories from @Abdallaheslam.',
    viewProfile: 'View GitHub Profile',
    metrics: {
      totalContributions: '12-Month Contributions',
      activeDays: 'Active Coding Days',
      peakDay: 'Peak Single-Day Commits',
      publicRepos: 'Public Repositories',
    },
    calendarTitle: '53-Week Contribution Calendar',
    calendarHint: 'Hover or focus any day cell to inspect daily commit activity',
    contributionSingular: 'contribution',
    contributionPlural: 'contributions',
    noContributions: 'No public contributions',
    less: 'Less',
    more: 'More',
    monthlyTitle: 'Monthly Commit Frequency (Trailing 12 Months)',
    recentReposTitle: 'Recently Updated Repositories',
    updatedPrefix: 'Pushed',
    liveSyncedNote: 'Live data synced from public GitHub API (@Abdallaheslam)',
    snapshotNote: 'Showing verified public GitHub snapshot (@Abdallaheslam)',
  },
  skillsSection: {
    kicker: 'Engineering Stack',
    heading: 'Technical Skills, Core Competencies & Languages',
    subheading:
      'Programming languages, backend and database technologies, developer tooling, and operational IT systems.',
    coreTitle: 'Engineering & Professional Strengths',
    coreSubtitle:
      'Problem-solving, collaboration, and execution habits developed across software projects and live technical operations.',
    languagesTitle: 'Languages',
    languagesSubtitle: 'Communication proficiency for local and international engineering teams.',
  },
  technicalSkills: [
    {
      id: 'programming',
      title: 'Programming & Mobile',
      description: 'Frontend web interfaces, server-side JavaScript, and cross-platform mobile apps.',
      items: [
        'JavaScript',
        'HTML',
        'CSS',
        'Node.js',
        'Express.js',
        'Dart',
        'Flutter',
      ],
    },
    {
      id: 'databases',
      title: 'Backend & Databases',
      description: 'Data modeling, persistence, authentication, and core OOP architecture.',
      items: ['MongoDB', 'SQL', 'Firebase', 'OOP', 'CRUD Operations'],
    },
    {
      id: 'tools',
      title: 'Developer & Design Tools',
      description: 'Version control, API validation, interface prototyping, and AI visual design.',
      items: ['Git & GitHub', 'VS Code', 'Postman', 'Figma', 'UI/UX Design', 'Canva & Canva AI'],
    },
    {
      id: 'it-support',
      title: 'Systems & IT Operations',
      description: 'Production troubleshooting, workstations, networking, and end-user enablement.',
      items: [
        'IT Support & Troubleshooting',
        'Hardware & Software Support',
        'Printer & Network Support',
        'Windows',
        'Microsoft Office',
      ],
    },
  ],
  coreSkills: [
    'Team Coordination',
    'Customer Communication',
    'Attention to Detail',
    'Accuracy & Quality Focus',
    'Time Management',
    'Task Organization',
    'Quick Learning',
    'Working Under Pressure',
    'Remote Work',
  ],
  languages: [
    { language: 'Arabic', proficiency: 'Native' },
    { language: 'English', proficiency: 'Intermediate (B1)' },
  ],
  cvSection: {
    kicker: 'Curriculum Vitae',
    heading: "Download Abdullah Islam's CV",
    description:
      'Formatted for hiring managers and applicant tracking systems (ATS). Includes IT support operations, project-based Freelance Web Developer experience (remote collaboration & responsive bilingual RTL/LTR websites), B.Sc. Computer Science details, and technical skills.',
    metaNote: 'Format: PDF (A4) · Updated 2026 · File: Abdullah_Islam_CV.pdf',
    downloadButton: 'Download CV (PDF)',
    previewButton: 'Preview CV',
    modalTitlePrefix: 'CV Preview',
    downloadPdfShort: 'Download PDF',
    printLabel: 'Print',
    summaryHeading: 'Professional Summary',
    experienceHeading: 'Work Experience',
    educationHeading: 'Education',
    skillsHeading: 'Technical Skills',
    coreSkillsHeading: 'Core Skills',
    languagesHeading: 'Languages',
    viewer: {
      fileLabel: 'Abdullah_Islam_CV.pdf',
      page: 'Page',
      of: 'of',
      prevPage: 'Previous page',
      nextPage: 'Next page',
      zoomOut: 'Zoom out',
      zoomIn: 'Zoom in',
      fitWidth: 'Fit width',
      singlePage: 'Single Page',
      allPages: 'All Pages',
      fullscreen: 'Expand',
      closePreview: 'Close preview',
      loadingPdf: 'Rendering PDF document...',
    },
  },
  contactSection: {
    kicker: 'Get in Touch',
    heading: 'Contact & Software Engineering Inquiries',
    subheading:
      'Available for technical interviews, coding assessments, and junior software engineering opportunities.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    locationLabel: 'Location',
    copy: 'Copy',
    copied: 'Copied',
    formTitle: 'Compose an Email Inquiry',
    formIntroBefore: 'Fill out the fields below to open your email application pre-addressed to',
    formIntroAfter: ', or copy the formatted message for webmail.',
    nameLabel: 'Your Name',
    namePlaceholder: 'Recruiter or Engineering Manager',
    emailInputLabel: 'Your Email',
    emailPlaceholder: 'name@company.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Software Engineer Opportunity / Technical Interview',
    messageLabel: 'Message',
    messagePlaceholder: 'Share role details, interview availability, or project questions...',
    submitButton: 'Open in Email App',
    copyDraftButton: 'Copy Drafted Message',
    draftCopied: 'Draft Copied',
    statusMessagePrefix: 'Opening your email client to send this message to',
    statusMessageSuffix:
      '. If your browser has no default mail app configured, use "Copy Drafted Message" below.',
    errors: {
      name: 'Please enter your name (at least 2 characters).',
      email: 'Please enter a valid email address.',
      subject: 'Please enter a short subject.',
      message: 'Please enter a message (at least 10 characters).',
    },
  },
  reviewsSection: {
    kicker: 'Public Guestbook & Feedback',
    heading: 'Visitor Reviews & Ratings',
    subheading:
      'Share your opinion on my portfolio, projects, or collaboration experience — no sign-in or account required.',
    averageLabel: 'Average Rating',
    totalRatingsSingular: 'review',
    totalRatingsPlural: 'reviews',
    noReviewsYet: 'Be the first to rate',
    formTitle: 'Leave a Review',
    formSubtitle: 'Enter your name, choose a star rating, and write your comment directly.',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    ratingLabel: 'Your Rating',
    ratingHints: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    commentLabel: 'Your Comment',
    commentPlaceholder: 'Share your thoughts about the projects, design, or work quality...',
    submitButton: 'Publish Review',
    submittingButton: 'Publishing...',
    successMessage: 'Thank you! Your review has been published.',
    loadingMessage: 'Loading visitor reviews...',
    errorMessage: 'Could not complete the request right now. Please try again shortly.',
    emptyStateTitle: 'No reviews submitted yet',
    emptyStateBody: 'Be the first visitor to leave a rating and comment using the form.',
    validation: {
      name: 'Please enter your name (2 to 60 characters).',
      rating: 'Please select a star rating between 1 and 5.',
      comment: 'Please write a comment (5 to 600 characters).',
    },
  },
  footer: {
    rights: 'All rights reserved.',
    privacyNotice: 'Privacy-first, cookieless analytics · Respects Do Not Track & GPC',
  },
};

export const PORTFOLIO_DATA_AR: PortfolioContent = {
  nav: {
    brand: 'عبدالله إسلام',
    links: [
      { label: 'المشاريع', href: '#projects' },
      { label: 'المهارات', href: '#skills' },
      { label: 'نبذة عني', href: '#about' },
      { label: 'الخبرات', href: '#experience' },
      { label: 'الآراء', href: '#reviews' },
      { label: 'تواصل', href: '#contact' },
    ],
    downloadCv: 'تحميل السيرة الذاتية',
    downloadMyCv: 'تحميل السيرة الذاتية',
    appearance: 'المظهر',
    skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  },
  personal: {
    displayName: 'عبدالله إسلام',
    fullName: 'عبدالله إسلام حسن',
    headline: 'مهندس برمجيات | تطوير الويب والخوادم وتطبيقات الهاتف',
    tagline: 'بناء برمجيات ويب وخوادم وتطبيقات هاتف موثوقة مدعومة بخبرة تشغيلية حقيقية.',
    availability:
      'متاح لفرص مهندس برمجيات مبتدئ، مطور Full-Stack، وتطوير الواجهات والخوادم وتطبيقات Flutter في مصر وخارجها (حضوري أو عن بُعد).',
    shortAvailability: 'متاح لفرص هندسة البرمجيات (حضوري / عن بُعد)',
    location: 'بنها، مصر',
    email: 'abdallaheslam815@gmail.com',
    phone: '+20 115 599 6956',
    phoneHref: '+201155996956',
    linkedinUrl: 'https://www.linkedin.com/in/abdallah-islam/',
    githubUrl: 'https://github.com/Abdallaheslam',
    profilePhoto: '/assets/aistudio/ChatGPT_Image_Jun_9__2026__03_35_32_PM_35d45928.png',
    profilePhotoAlt: 'صورة شخصية لعبدالله إسلام حسن أثناء العمل على الحاسوب المحمول',
    photoSubtitle: 'مهندس برمجيات · بكالوريوس علوم الحاسب',
    academicTag: 'بكالوريوس علوم الحاسب',
  },
  heroIntro:
    'طالب علوم حاسب (2023–2027) أبني تطبيقات الويب الكاملة وواجهات البرمجة (REST APIs) والتطبيقات الحديثة باستخدام JavaScript وNode.js وExpress وMongoDB وFlutter وFirebase — بالتوازي مع عملي كـ IT Support Focal Point وقائد فريق الدعم الفني في شركة Holool for Programming بالشيخ زايد.',
  heroActions: {
    viewProjects: 'استعرض المشاريع البرمجية',
    downloadCv: 'تحميل السيرة الذاتية',
    contactMe: 'تواصل معي',
    socialLabel: 'لينكدإن · جيت هب',
  },
  about: {
    kicker: 'نبذة عني',
    heading: 'تركيز على هندسة البرمجيات مدعوم بخبرة تشغيلية في بيئة عمل فعلية.',
    summary:
      'طالب علوم حاسب أركز على هندسة البرمجيات، تطوير تطبيقات الويب، بناء واجهات البرمجة الخلفية (APIs)، وتصميم المواقع المتجاوبة. أمتلك خبرة عملية في تطوير تطبيقات JavaScript وNode.js وExpress وMongoDB وربط خدمات Firebase وتطوير متاجر ومواقع عربية متجاوبة. إلى جانب البرمجة، أعمل كـ IT Support Focal Point ومسؤول عن إدارة وتوجيه فريق الدعم الفني في شركة Holool for Programming بالشيخ زايد، مما يعزز مهارات القيادة وحل المشكلات والتوثيق.',
    facts: [
      { label: 'الاسم الكامل', value: 'عبدالله إسلام حسن' },
      { label: 'التخصص الهندسي', value: 'تطوير الويب، الخوادم والواجهات' },
      { label: 'المسار الأكاديمي', value: 'بكالوريوس علوم الحاسب (2023 – 2027)' },
      { label: 'الدور القيادي الحالي', value: 'IT Focal Point · Holool for Programming' },
    ],
  },
  experienceSection: {
    kicker: 'المسيرة المهنية والأكاديمية',
    heading: 'الخبرات العملية والتعليم',
    subheading:
      'قيادة وتوجيه فريق الدعم الفني والعمل الحر في تطوير الويب بالتوازي مع الدراسة الأكاديمية في علوم الحاسب.',
    workTitle: 'الخبرات العملية',
    educationTitle: 'التعليم',
    expectedGradPrefix: 'التخرج المتوقع',
  },
  experience: [
    {
      id: 'holool',
      role: 'نقطة الاتصال الرئيسية والمسؤول عن فريق الدعم الفني (IT Focal Point)',
      company: 'Holool for Programming',
      locationOrSite: 'El Sheikh Zayed',
      period: 'يوليو 2025 – حتى الآن',
      current: true,
      responsibilities: [
        'العمل كنقطة الاتصال الرئيسية (Focal Point) والمسؤول المباشر عن إدارة وتوجيه فريق الدعم الفني بالموقع.',
        'توزيع المهام اليومية على أعضاء الفريق، متابعة تنفيذ الإصلاحات، وتوجيههم في التعامل مع الأعطال الحرجة.',
        'الإشراف على دعم الأجهزة والبرمجيات والطابعات والشبكات لمحطات العمل الطبية والإدارية بالمستشفى.',
        'التنسيق المباشر مع إدارة المستشفى لضمان استقرار الأنظمة وتوثيق البلاغات والحفاظ على جاهزية المعدات.',
      ],
    },
    {
      id: 'dragons-unity',
      role: 'مسؤول توظيف عبر الإنترنت (Online HR Recruiter)',
      company: 'Dragons Unity',
      locationOrSite: 'عن بُعد',
      period: 'شهران',
      responsibilities: [
        'إدارة أنشطة التوظيف عبر الإنترنت والتواصل مع المتقدمين.',
        'فرز المرشحين وتنسيق مواعيد المقابلات الشخصية.',
        'تنظيم بيانات المرشحين وحفظ سجلات التوظيف بشكل منظم.',
      ],
    },
    {
      id: 'freelance',
      role: 'مطور ويب مستقل (Freelance Web Developer)',
      company: 'عمل حر (Freelance)',
      locationOrSite: 'عن بُعد · مصر',
      period: 'حسب المشاريع',
      responsibilities: [
        'تصميم وتطوير مواقع ويب متجاوبة ثنائية اللغة (RTL/LTR) وباللغة العربية باستخدام HTML وCSS وJavaScript.',
        'بناء متاجر إلكترونية وصفحات تعريفية مخصصة للخدمات مع ربط الطلبات المباشر عبر واتساب وتوافق كامل مع الهواتف.',
        'التعاون المباشر مع العملاء عن بُعد في تنفيذ المشاريع لفهم المتطلبات وتحسين واجهة وتجربة المستخدم (UI/UX) ونشر المواقع.',
      ],
    },
  ],
  education: {
    degree: 'بكالوريوس علوم الحاسب (B.Sc.)',
    institution: 'الأكاديمية الحديثة لعلوم الكمبيوتر وتكنولوجيا الإدارة',
    location: 'المعادي، القاهرة، مصر',
    period: '2023 – 2027',
    expectedGraduation: '2027',
    statusNote:
      'دراسة وتطبيق عملي يشمل البرمجة كائنية التوجه، قواعد البيانات، أساسيات تطوير البرمجيات، وتقنيات الويب وتطبيقات الهاتف.',
  },
  projectsSection: {
    kicker: 'معرض الأعمال البرمجية',
    heading: 'أبرز المشاريع الهندسية',
    subheading:
      'تطبيقات ويب منشورة، خوادم REST API، وتطبيقات هاتف متعددة المنصات توضح جودة الكود وتنظيم قواعد البيانات وتجربة المستخدم.',
    filters: [
      { id: 'all', label: 'كل المشاريع' },
      { id: 'web', label: 'تطبيقات الويب' },
      { id: 'systems', label: 'الأنظمة وPOS' },
      { id: 'design', label: 'التصميم وCanva AI' },
    ],
    galleryLabel: 'المعرض',
    inspectLabel: 'معاينة',
    viewDetails: 'التفاصيل',
    closeModal: 'إغلاق',
    liveDemo: 'معاينة حية',
    repository: 'الكود المصدري',
    viewScope: 'عرض تفاصيل المشروع',
    overviewHeading: 'نظرة عامة موسعة',
    capabilitiesHeading: 'قائمة المميزات الكاملة',
    metricsHeading: 'مؤشرات المشروع التقنية',
    stackHeading: 'التقنيات المستخدمة',
    openLiveDemo: 'فتح الموقع المباشر',
    viewGithubRepo: 'عرض مستودع GitHub',
    unavailablePreview: 'المعاينة غير متاحة حالياً',
  },
  projects: [
    {
      id: 'ostaz-ai7',
      title: 'سوبر ماركت الأستاذ (Ostaz AI7)',
      subtitle: 'تطبيق ويب ومتجر بقالة إلكتروني (PWA)',
      category: 'web',
      categoryLabel: 'تطبيق ويب PWA',
      description:
        'تطبيق ويب عربي لمتجر بقالة إلكتروني («سوبر ماركت الأستاذ») مزود ببيانات تطبيق الويب التقدمي (PWA) ووسوم Schema.org، يشمل شريط بحث وتصفح التصنيفات وسلة التسوق.',
      expandedDescription:
        'تطبيق ويب متكامل باللغة العربية (RTL) لمتجر بقالة إلكتروني («سوبر ماركت الأستاذ»)، مصمم لتقديم تجربة متجاوبة وسلسة على سطح المكتب والهاتف. يجمع البناء بين HTML وCSS وJavaScript مع إعدادات تطبيق الويب التقدمي (PWA Manifest) وبيانات Schema.org المهيكلة لتحسين الظهور في محركات البحث.',
      highlights: [
        'شريط علوي يتضمن محرك بحث فوري عن المنتجات وأزرار تسجيل الدخول وإنشاء الحساب.',
        'لافتة ترويجية رئيسية لعرض الخصومات الموسمية واستخدام كوبونات الخصم.',
        'شبكة تصنيفات تفاعلية لسرعة تصفح أقسام المنتجات الغذائية والاستهلاكية.',
        'بطاقات منتجات تعرض السعر قبل وبعد الخصم، نسبة التوفير، أزرار المفضلة والمشاركة والإضافة للعربة.',
        'شريط تنقل سفلي متكامل للهاتف (الرئيسية، المنتجات، التصنيفات، العروض، العربة، المفضلة، الإشعارات).',
        'مهيأ بملف PWA Manifest وبيانات Store JSON-LD لمحركات البحث.',
      ],
      metrics: [
        { label: 'اللغات المستخدمة', value: 'HTML · JS · CSS', icon: 'languages' },
        { label: 'الاستضافة', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'نجوم GitHub', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'PWA Manifest', 'JSON-LD SEO'],
      repoSlug: 'ostaz.ai7',
      liveDemoUrl: 'https://abdallaheslam.github.io/ostaz.ai7/',
      githubUrl: 'https://github.com/Abdallaheslam/ostaz.ai7',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_ccc49532.png',
          alt: 'الصفحة الرئيسية لسوبر ماركت الأستاذ مع البحث والتصنيفات',
          caption: 'الصفحة الرئيسية مع شريط البحث ولافتة العروض والتصنيفات',
        },
        {
          src: '/assets/aistudio/image_d5d14036.png',
          alt: 'قسم المنتجات الجديدة في سوبر ماركت الأستاذ مع الخصومات والتقييمات',
          caption: 'قسم المنتجات الجديدة مع نسب الخصم والتقييمات وأزرار الإضافة للعربة',
        },
        {
          src: '/assets/aistudio/image_577043ca.png',
          alt: 'نافذة تسجيل الدخول في سوبر ماركت الأستاذ',
          caption: 'نافذة تسجيل الدخول بالبريد الإلكتروني أو عبر Google',
        },
        {
          src: '/assets/aistudio/image_65ac76d3.png',
          alt: 'نافذة إنشاء حساب جديد في سوبر ماركت الأستاذ',
          caption: 'نافذة إنشاء حساب جديد مع التحقق من كلمة المرور',
        },
        {
          src: '/assets/aistudio/image_95aa5641.png',
          alt: 'نافذة عربة التسوق في سوبر ماركت الأستاذ مع الإجمالي والشحن',
          caption: 'عربة التسوق مع التحكم في الكميات وحساب الشحن وإتمام الطلب',
        },
      ],
    },
    {
      id: 'al-molok-coffee',
      title: 'قهوة الملوك (Al Molok Coffee)',
      subtitle: 'متجر إلكتروني عربي للقهوة المختصة',
      category: 'web',
      categoryLabel: 'متجر إلكتروني',
      description:
        'واجهة متجر إلكتروني متجاوبة باللغة العربية (RTL) لعلامة قهوة الملوك، تضم قسماً ترحيبياً كاملاً وبطاقات منتجات بالأسعار مع ربط مباشر بواتساب.',
      expandedDescription:
        'متجر إلكتروني متجاوب باللغة العربية (RTL) مصمم لعلامة «قهوة الملوك» للبن المختص. يجمع التصميم بين الهوية البصرية الدافئة وعرض أصناف البن وتفاصيل النكهات والأسعار بالجنيه المصري، مع مسار طلب سريع ومباشر عبر واتساب.',
      highlights: [
        'تخطيط عربي كامل (RTL) متجاوب مع شاشات الهواتف والحواسيب.',
        'قسم افتتاحي بارز يحمل الهوية البصرية للعلامة وزر دعوة مباشرة للطلب.',
        'شبكة منتجات تعرض أصناف القهوة المختصة ووصف النكهات والأسعار بالجنيه المصري.',
        'زر واتساب عائم وأزرار طلب مخصصة لكل منتج لتسهيل إتمام الطلبات فوراً.',
      ],
      metrics: [
        { label: 'اللغات المستخدمة', value: 'HTML · CSS · JS', icon: 'languages' },
        { label: 'الاستضافة', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'نجوم GitHub', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'RTL Layout'],
      repoSlug: 'almuluk-store-test',
      liveDemoUrl: 'https://abdallaheslam.github.io/almuluk-store-test/',
      githubUrl: 'https://github.com/Abdallaheslam/almuluk-store-test',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_1a2fef9d.png',
          alt: 'الواجهة الرئيسية لموقع قهوة الملوك',
          caption: 'الواجهة الافتتاحية مع الهوية البصرية العربية وزر الطلب الفوري',
        },
        {
          src: '/assets/aistudio/image_513d41ba.png',
          alt: 'شبكة منتجات قهوة الملوك مع الأسعار بالجنيه المصري',
          caption: 'كتالوج المنتجات مع أصناف البن والأسعار وأزرار الطلب',
        },
        {
          src: '/assets/aistudio/image_c7335f5c.png',
          alt: 'قسم آراء عملاء قهوة الملوك وتقييمات النجوم',
          caption: 'قسم آراء العملاء مع التقييمات بالنجوم وزر إضافة تقييم جديد',
        },
        {
          src: '/assets/aistudio/image_25bb91b3.png',
          alt: 'طرق الطلب والتواصل وتذييل صفحة قهوة الملوك',
          caption: 'قسم طرق الطلب والتواصل المباشر مع الفوتر العربي للعلامة التجارية',
        },
      ],
    },
    {
      id: 'ai7',
      title: 'منصة AI7',
      subtitle: 'صفحة تعريفية لخدمات تطوير المواقع',
      category: 'web',
      categoryLabel: 'واجهات ويب',
      description:
        'موقع ويب عربي لتقديم خدمات تصميم وتطوير المواقع الإلكترونية الاحترافية، يعرض المهمة والرؤية والقيم مع تنقل سلس وأزرار طلب الخدمة.',
      expandedDescription:
        'موقع تعريفي عربي (RTL) لمنصة «AI7 – تطوير مواقع احترافية» لعرض خدمات تصميم وبرمجة المواقع للأفراد والشركات والمؤسسات. يقدم الموقع هوية بصرية متماسكة وهيكل أقسام واضح لربط الزوار بالخدمات وقنوات التواصل.',
      highlights: [
        'شريط تنقل عربي واضح يربط أقسام الرئيسية، عني، الخدمات، وتواصل.',
        'واجهة افتتاحية متدرجة الألوان تعرض رسالة المنصة بوضوح واحترافية.',
        'بطاقة مخصصة لعرض المهمة والرؤية والقيم الأساسية للجودة والإبداع والالتزام بالوقت.',
        'أزرار إجراءات مباشرة لاستعراض باقات الخدمات وطلب تصميم موقع جديد.',
      ],
      metrics: [
        { label: 'اللغات المستخدمة', value: 'CSS · HTML · JS', icon: 'languages' },
        { label: 'الاستضافة', value: 'GitHub Pages', icon: 'hosting' },
        { label: 'نجوم GitHub', value: '0', icon: 'stars' },
      ],
      stack: ['HTML', 'CSS', 'Responsive Design', 'Tajawal Font'],
      repoSlug: 'ai7',
      liveDemoUrl: 'https://abdallaheslam.github.io/ai7/',
      githubUrl: 'https://github.com/Abdallaheslam/ai7',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_689b9c30.png',
          alt: 'الصفحة الرئيسية لموقع AI7 لتطوير المواقع الاحترافية',
          caption: 'القسم الرئيسي مع بطاقة المهمة والرؤية وأزرار الإجراءات',
        },
        {
          src: '/assets/aistudio/image_063a9fa7.png',
          alt: 'قسم عني في موقع AI7 لعرض التخصصات والتقنيات المستخدمة',
          caption: 'قسم «عني» لعرض مجالات التخصص والتقنيات البرمجية',
        },
        {
          src: '/assets/aistudio/image_c889058e.png',
          alt: 'قسم خدمات تطوير المواقع والباقات المتاحة في AI7',
          caption: 'باقات المواقع الشخصية والتجارية والمؤسسية مع الأسعار',
        },
        {
          src: '/assets/aistudio/image_c497e9e0.png',
          alt: 'قسم التواصل في موقع AI7 عبر البريد والواتساب ومنصات التواصل',
          caption: 'قنوات التواصل المباشر وبانر بدء المشروع',
        },
      ],
    },
    {
      id: 'elostaz-pos',
      title: 'نظام الأستاذ الذكي (El Ostaz POS)',
      subtitle: 'نظام نقاط بيع (POS) وإدارة مخازن وتقارير مالية للسوبرماركت',
      category: 'systems',
      categoryLabel: 'نظام إدارة ونقاط بيع (POS)',
      description:
        'نظام متكامل باللغة العربية (RTL) لإدارة مبيعات السوبرماركت ونقاط البيع، يشمل قراءة الباركود، حساب ضريبة القيمة المضافة 14%، طباعة فواتير 80 مم، العمل أوفلاين مع المزامنة التلقائية، جرد المخزن، والتقارير المالية.',
      expandedDescription:
        'منظومة إدارة ونقاط بيع ذكية متكاملة باللغة العربية (RTL) مخصصة لتشغيل السوبرماركت. تضم صلاحيات متعددة بين المدير العام والكاشير، شاشة كاشير سريعة تدعم الباركود الدولي والدفع النقدي والبطاقات ونقاط الولاء، حفظ المبيعات أوفلاين والمزامنة فور توفر الاتصال، طباعة ملصقات Zebra، محاكاة هوامش الربح، تنبيهات نواقص المخزن، وتصدير تقارير المبيعات بصيغة CSV/Excel.',
      highlights: [
        'بوابة دخول سريعة متعددة الصلاحيات للتبديل بين حساب المدير العام والكاشير.',
        'شاشة كاشير احترافية تدعم البحث بالباركود الدولي، المسح السريع، وحساب ضريبة القيمة المضافة (14%) تلقائياً.',
        'دعم طرق دفع متعددة (نقدي، فيزا/ميزة، نقاط الولاء) مع حفظ الفواتير أوفلاين والمزامنة التلقائية.',
        'طباعة إيصالات حرارية قياس 80 مم متكاملة برقم الفاتورة والرقم الضريبي وتفاصيل الأصناف.',
        'بوابة إدارة الأصناف والأسعار مع توليد الباركود، طباعة ملصقات Zebra، ومحاكاة فورية لهامش الربح (+5%، +10%، 20%).',
        'بوابة المخزن والتقارير المالية لمتابعة تنبيهات نواقص الرفوف، مسار الأصناف، نقاط العملاء، وتصدير CSV/Excel.',
      ],
      metrics: [
        { label: 'نوع النظام', value: 'POS والمخازن', icon: 'architecture' },
        { label: 'الاستضافة', value: 'elostaz.ai.studio', icon: 'hosting' },
        { label: 'التشغيل', value: 'Offline-First', icon: 'database' },
      ],
      stack: [
        'Arabic RTL',
        'POS System',
        'Offline-First Sync',
        'Inventory & Reports',
        '80mm Print & CSV',
        'Role-Based Access',
      ],
      liveDemoUrl: 'https://elostaz.ai.studio/',
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_afb9072c.png',
          alt: 'شاشة تسجيل الدخول واختيار الحساب بين المدير العام والكاشير في نظام الأستاذ الذكي',
          caption: 'شاشة اختيار الحساب والدخول السريع للمدير العام والكاشير',
        },
        {
          src: '/assets/aistudio/image_63fbc984.png',
          alt: 'شاشة الكاشير ونقطة البيع في نظام الأستاذ الذكي مع الباركود والضريبة وطرق الدفع',
          caption: 'شاشة الكاشير السريعة مع البحث بالباركود وحساب الضريبة 14% وطرق الدفع',
        },
        {
          src: '/assets/aistudio/image_edc9af77.png',
          alt: 'بوابة إدارة الأصناف والتسعير في نظام الأستاذ مع ملصقات Zebra ومحاكاة الأرباح',
          caption: 'إدارة الأصناف والأسعار وطباعة ملصقات Zebra ومحاكاة هوامش الربح',
        },
        {
          src: '/assets/aistudio/image_8a07320a.png',
          alt: 'بوابة الجرد وإدارة المخازن السنوية وتنبيهات نواقص الرفوف في نظام الأستاذ',
          caption: 'لوحة جرد المخزن والقيمة السوقية وتنبيهات الأصناف التي قاربت على النفاذ',
        },
        {
          src: '/assets/aistudio/image_2a70a467.png',
          alt: 'لوحة التقارير والأرباح وتصدير CSV وExcel وتحليل المبيعات الأسبوعية في نظام الأستاذ',
          caption: 'التقارير المالية وصافي الأرباح وتدقيق نقاط العملاء وتصدير CSV/Excel',
        },
        {
          src: '/assets/aistudio/image_9a3a4791.png',
          alt: 'معاينة فاتورة الإيصال الحراري 80 مم وتأكيد حفظ البيع في وضع أوفلاين بنظام الأستاذ',
          caption: 'معاينة وطباعة الإيصال الضريبي 80 مم مع دعم وضع الأوفلاين والمزامنة',
        },
      ],
    },
    {
      id: 'veyona-pharm-design',
      title: 'حملة تصميمات Veyona Pharm',
      subtitle: 'سلسلة تصميمات دعائية وإعلانية احترافية بواسطة Canva AI',
      category: 'design',
      categoryLabel: 'التصميم الإعلاني · Canva AI',
      description:
        'مجموعة بانرات وتصميمات إعلانية متكاملة تم تنفيذها بواسطة Canva AI لمنتجات العناية والجمال من Veyona Pharm (Veyona Soap وHyaloram Cream وMissy Spray & Gel)، مع عروض الباقات المتدرجة.',
      expandedDescription:
        'حملة تصميمات بصرية وتسويقية متكاملة تم إنتاجها باستخدام Canva AI لعلامة Veyona Pharm. شملت تنسيق إضاءة الاستوديو للمنتجات على خلفيات داكنة، أيقونات المزايا، وصياغة عروض البيع المتدرجة (GET 1 وGET 2 خصم 10% وGET 3 خصم 12% وGET 4 بخصم 50 جنيه + شحن مجاني) لتناسب حملات السوشيال ميديا والمتاجر.',
      highlights: [
        'تنفيذ كامل التصميمات وتركيب المنتجات والإضاءة البصرية باستخدام أدوات Canva AI.',
        'تصميم 4 عروض ترويجية متكاملة (GET 1، GET 2 بخصم 10%، GET 3 بخصم 12%، وGET 4).',
        'تصميم بانر رئيسي لعرض الـ 4 منتجات (خصم 50 جنيه + توصيل مجاني) لمنتجات Veyona Soap وHyaloram وMissy.',
        'دمج نصوص تسويقية ثنائية اللغة (عربي/إنجليزي) مع أيقونات واضحة لمزايا العناية والراحة.',
      ],
      metrics: [
        { label: 'أداة التصميم', value: 'Canva AI', icon: 'architecture' },
        { label: 'المخرجات', value: '5 بانرات إعلانية', icon: 'architecture' },
        { label: 'اللغات', value: 'AR · EN', icon: 'languages' },
      ],
      stack: [
        'Canva AI',
        'Graphic Design',
        'Product Marketing',
        'Ad Banners',
        'Bilingual Copy',
      ],
      previewType: 'screenshot',
      screenshots: [
        {
          src: '/assets/aistudio/image_99eeb68c.png',
          alt: 'تصميم بانر عرض GET 4 منتجات Veyona Pharm بخصم 50 جنيه وتوصيل مجاني باستخدام Canva AI',
          caption: 'بانر عرض GET 4 (خصم 50 جنيه + توصيل مجاني)',
        },
        {
          src: '/assets/aistudio/image_25e6401a.png',
          alt: 'تصميم البانر الرئيسي ثنائي اللغة لعلامة Veyona Pharm — عناية متكاملة لجمال صحي وحياة أفضل بواسطة Canva AI',
          caption: 'البانر الرئيسي ثنائي اللغة (Veyona Pharm — Exclusive Beauty Collection)',
        },
        {
          src: '/assets/aistudio/image_403d91d9.png',
          alt: 'تصميم بانر عرض GET 1 لاختيار المنتج المفضل من Veyona Pharm بواسطة Canva AI',
          caption: 'بانر عرض GET 1 لعرض المنتجات مع أيقونات المزايا',
        },
        {
          src: '/assets/aistudio/image_ed2d948e.png',
          alt: 'تصميم بانر عرض GET 2 مع خصم 10% لمنتجات Veyona Pharm بواسطة Canva AI',
          caption: 'بانر عرض GET 2 مع خصم 10% عند اختيار منتجين',
        },
        {
          src: '/assets/aistudio/image_93b3054c.png',
          alt: 'تصميم بانر عرض GET 3 مع خصم 12% لمنتجات Veyona Pharm بواسطة Canva AI',
          caption: 'بانر عرض GET 3 مع خصم 12% وتنسيق طولي لمزايا العناية',
        },
      ],
    },
  ],
  githubActivitySection: {
    kicker: 'المساهمات والالتزام البرمجي',
    heading: 'نشاط GitHub وتواتر المساهمات البرمجية',
    subheading:
      'تقويم المساهمات العامة على مدار العام، التوزيع الشهري للتعديلات، وأحدث المستودعات البرمجية لحساب @Abdallaheslam.',
    viewProfile: 'عرض ملف GitHub',
    metrics: {
      totalContributions: 'مساهمات آخر 12 شهراً',
      activeDays: 'أيام البرمجة النشطة',
      peakDay: 'أعلى نشاط في يوم واحد',
      publicRepos: 'المستودعات العامة',
    },
    calendarTitle: 'تقويم المساهمات (53 أسبوعاً)',
    calendarHint: 'مرر المؤشر أو حدد أي مربع يومي لعرض عدد المساهمات في ذلك اليوم',
    contributionSingular: 'مساهمة',
    contributionPlural: 'مساهمات',
    noContributions: 'لا توجد مساهمات عامة',
    less: 'أقل',
    more: 'أكثر',
    monthlyTitle: 'التواتر الشهري للمساهمات (آخر 12 شهراً)',
    recentReposTitle: 'أحدث المستودعات المحدّثة',
    updatedPrefix: 'آخر دفع للكود',
    liveSyncedNote: 'بيانات محدثة مباشرة من واجهة GitHub العامة (@Abdallaheslam)',
    snapshotNote: 'يعرض نسخة موثقة من سجل GitHub العام (@Abdallaheslam)',
  },
  skillsSection: {
    kicker: 'المكدس التقني',
    heading: 'المهارات البرمجية، الكفاءات الأساسية واللغات',
    subheading:
      'لغات البرمجة، تقنيات الخوادم وقواعد البيانات، أدوات التطوير، والخبرة التشغيلية في الأنظمة.',
    coreTitle: 'المهارات الهندسية والمهنية',
    coreSubtitle:
      'مهارات حل المشكلات والتعاون المكتسبة من المشاريع البرمجية والعمل التشغيلي.',
    languagesTitle: 'اللغات',
    languagesSubtitle: 'مستوى إجادة اللغات للعمل مع الفرق الهندسية المحلية والدولية.',
  },
  technicalSkills: [
    {
      id: 'programming',
      title: 'البرمجة والموبايل',
      description: 'تطوير واجهات الويب، خوادم JavaScript، وتطبيقات الهاتف.',
      items: [
        'JavaScript',
        'HTML',
        'CSS',
        'Node.js',
        'Express.js',
        'Dart',
        'Flutter',
      ],
    },
    {
      id: 'databases',
      title: 'الخوادم وقواعد البيانات',
      description: 'تنظيم البيانات، المصادقة، وأنماط البرمجة كائنية التوجه.',
      items: ['MongoDB', 'SQL', 'Firebase', 'البرمجة كائنية التوجه (OOP)', 'عمليات CRUD'],
    },
    {
      id: 'tools',
      title: 'أدوات التطوير والتصميم',
      description: 'إدارة الإصدارات، اختبار واجهات البرمجة، وتصميم الواجهات والمحتوى البصري بالذكاء الاصطناعي.',
      items: ['Git و GitHub', 'VS Code', 'Postman', 'Figma', 'تصميم UI/UX', 'Canva و Canva AI'],
    },
    {
      id: 'it-support',
      title: 'الأنظمة والدعم التشغيلي',
      description: 'تشخيص الأعطال، الشبكات، ودعم بيئات العمل الإنتاجية.',
      items: [
        'الدعم الفني واستكشاف الأعطال',
        'دعم الأجهزة والبرمجيات',
        'دعم الطابعات والشبكات',
        'أنظمة Windows',
        'حزمة Microsoft Office',
      ],
    },
  ],
  coreSkills: [
    'تنسيق الفريق',
    'التواصل مع العملاء',
    'الاهتمام بالتفاصيل',
    'الدقة والتركيز على الجودة',
    'إدارة الوقت',
    'تنظيم المهام',
    'سرعة التعلم',
    'العمل تحت الضغط',
    'العمل عن بُعد',
  ],
  languages: [
    { language: 'العربية', proficiency: 'اللغة الأم' },
    { language: 'الإنجليزية', proficiency: 'متوسط (B1)' },
  ],
  cvSection: {
    kicker: 'السيرة الذاتية',
    heading: 'تحميل السيرة الذاتية لعبدالله إسلام',
    description:
      'منسقة لمسؤولي التوظيف وأنظمة تتبع المتقدمين (ATS). تشمل خبرة الدعم الفني، العمل الحر كمطور ويب مستقل (تنفيذ المشاريع عن بُعد وبناء مواقع متجاوبة ثنائية اللغة RTL/LTR)، دراسة علوم الحاسب، والمهارات التقنية.',
    metaNote: 'الصيغة: PDF (A4) · محدّثة 2026 · اسم الملف: Abdullah_Islam_CV.pdf',
    downloadButton: 'تحميل السيرة الذاتية (PDF)',
    previewButton: 'معاينة السيرة الذاتية',
    modalTitlePrefix: 'معاينة السيرة الذاتية',
    downloadPdfShort: 'تحميل PDF',
    printLabel: 'طباعة',
    summaryHeading: 'الملخص المهني',
    experienceHeading: 'الخبرات العملية',
    educationHeading: 'التعليم',
    skillsHeading: 'المهارات التقنية',
    coreSkillsHeading: 'المهارات الأساسية',
    languagesHeading: 'اللغات',
    viewer: {
      fileLabel: 'Abdullah_Islam_CV.pdf',
      page: 'صفحة',
      of: 'من',
      prevPage: 'الصفحة السابقة',
      nextPage: 'الصفحة التالية',
      zoomOut: 'تصغير',
      zoomIn: 'تكبير',
      fitWidth: 'ملاءمة العرض',
      singlePage: 'صفحة واحدة',
      allPages: 'كل الصفحات',
      fullscreen: 'تكبير العرض',
      closePreview: 'إغلاق المعاينة',
      loadingPdf: 'جارٍ تجهيز معاينة ملف PDF...',
    },
  },
  contactSection: {
    kicker: 'التواصل والتوظيف',
    heading: 'تواصل معي لفرص هندسة البرمجيات',
    subheading:
      'متاح للمقابلات التقنية، الاختبارات البرمجية، وفرص مهندس برمجيات مبتدئ.',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'رقم الهاتف',
    locationLabel: 'الموقع',
    copy: 'نسخ',
    copied: 'تم النسخ',
    formTitle: 'إرسال رسالة بريد إلكتروني',
    formIntroBefore: 'املأ الحقول التالية لفتح تطبيق البريد الإلكتروني لديك موجهاً إلى',
    formIntroAfter: '، أو انسخ نص الرسالة لاستخدامه عبر بريد الويب.',
    nameLabel: 'الاسم',
    namePlaceholder: 'اسم مسؤول التوظيف أو مدير الهندسة',
    emailInputLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@company.com',
    subjectLabel: 'الموضوع',
    subjectPlaceholder: 'فرصة عمل مهندس برمجيات / مقابلة تقنية',
    messageLabel: 'الرسالة',
    messagePlaceholder: 'شارك تفاصيل الوظيفة أو موعد المقابلة أو أي استفسار...',
    submitButton: 'فتح في تطبيق البريد',
    copyDraftButton: 'نسخ مسودة الرسالة',
    draftCopied: 'تم نسخ المسودة',
    statusMessagePrefix: 'جارٍ فتح تطبيق البريد الإلكتروني لإرسال الرسالة إلى',
    statusMessageSuffix:
      '. إذا لم يكن لديك برنامج بريد افتراضي، يمكنك استخدام زر «نسخ مسودة الرسالة» أدناه.',
    errors: {
      name: 'يرجى إدخال الاسم (حرفان على الأقل).',
      email: 'يرجى إدخال بريد إلكتروني صحيح.',
      subject: 'يرجى إدخال عنوان مختصر للموضوع.',
      message: 'يرجى كتابة رسالة لا تقل عن 10 أحرف.',
    },
  },
  reviewsSection: {
    kicker: 'آراء وتقييمات الزوار',
    heading: 'شاركني رأيك وتقييمك',
    subheading:
      'مساحة مفتوحة للزوار والعملاء لكتابة آرائهم وتقييماتهم مباشرة دون الحاجة لأي تسجيل دخول أو إنشاء حساب.',
    averageLabel: 'متوسط التقييم',
    totalRatingsSingular: 'تقييم',
    totalRatingsPlural: 'تقييمات',
    noReviewsYet: 'كن أول من يضيف تقييماً',
    formTitle: 'أضف رأيك وتقييمك',
    formSubtitle: 'اكتب اسمك، واختر عدد النجوم، ثم اكتب تعليقك للنشر فوراً.',
    nameLabel: 'الاسم',
    namePlaceholder: 'أدخل اسمك',
    ratingLabel: 'التقييم',
    ratingHints: ['ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'],
    commentLabel: 'التعليق',
    commentPlaceholder: 'اكتب رأيك في الموقع، المشاريع، أو تجربة التعامل...',
    submitButton: 'نشر التقييم',
    submittingButton: 'جارٍ النشر...',
    successMessage: 'شكراً لك! تم نشر رأيك وتقييمك بنجاح.',
    loadingMessage: 'جارٍ تحميل آراء الزوار...',
    errorMessage: 'تعذر إتمام العملية حالياً. يرجى المحاولة مرة أخرى.',
    emptyStateTitle: 'لا توجد تقييمات مضافة بعد',
    emptyStateBody: 'كن أول من يشارك رأيه وتقييمه عبر النموذج المجاور.',
    validation: {
      name: 'يرجى إدخال الاسم (من حرفين إلى 60 حرفاً).',
      rating: 'يرجى اختيار التقييم من 1 إلى 5 نجوم.',
      comment: 'يرجى كتابة تعليق (من 5 إلى 600 حرف).',
    },
  },
  footer: {
    rights: 'جميع الحقوق محفوظة.',
    privacyNotice: 'تحليلات تحترم الخصوصية دون ملفات تعريف ارتباط · تحترم إشارة عدم التتبع',
  },
};

function normalizePortfolioAssets(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    personal: {
      ...content.personal,
      profilePhoto: withBaseUrl(content.personal.profilePhoto),
    },
    projects: content.projects.map((project) => ({
      ...project,
      screenshots: project.screenshots.map((shot) => ({
        ...shot,
        src: withBaseUrl(shot.src),
      })),
    })),
  };
}

const RESOLVED_PORTFOLIO_EN = normalizePortfolioAssets(PORTFOLIO_DATA_EN);
const RESOLVED_PORTFOLIO_AR = normalizePortfolioAssets(PORTFOLIO_DATA_AR);

export const PORTFOLIO_DATA = RESOLVED_PORTFOLIO_EN;

export function getPortfolioContent(lang: Language): PortfolioContent {
  return lang === 'ar' ? RESOLVED_PORTFOLIO_AR : RESOLVED_PORTFOLIO_EN;
}
