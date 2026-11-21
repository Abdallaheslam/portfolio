import type { Language } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { toAbsoluteAssetUrl } from './assetUrl';

export interface SeoReviewSummary {
  ratingCount: number;
  ratingValue: number;
  recentReviews?: {
    author: string;
    rating: number;
    comment: string;
    datePublished?: string;
  }[];
}

const SEO_COPY: Record<
  Language,
  {
    title: string;
    description: string;
    locale: string;
    alternateLocale: string;
    imageAlt: string;
  }
> = {
  en: {
    title: 'Abdullah Islam | Software Developer & UI/UX Designer',
    description:
      'Explore the portfolio of Abdullah Eslam Hassan, Software Developer & UI/UX Designer crafting responsive web apps and backend systems. View projects & CV.',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    imageAlt: 'Abdullah Eslam Hassan — Software Developer & UI/UX Designer Portfolio',
  },
  ar: {
    title: 'عبدالله إسلام | مطور برمجيات ومصمم واجهات UI/UX',
    description:
      'تصفح معرض أعمال عبدالله إسلام حسن، مطور برمجيات ومصمم واجهات UI/UX ومسؤول دعم فني في مصر. استعرض مشاريع الويب، المهارات التقنية، وحمّل السيرة الذاتية.',
    locale: 'ar_EG',
    alternateLocale: 'en_US',
    imageAlt: 'عبدالله إسلام حسن — معرض أعمال مطور البرمجيات ومصمم واجهات UI/UX',
  },
};

const PROJECT_SCHEMA_CATEGORY: Record<string, string> = {
  'ostaz-ai7': 'ShoppingApplication',
  'al-molok-coffee': 'ShoppingApplication',
  ai7: 'BusinessApplication',
  'elostaz-pos': 'BusinessApplication',
  'veyona-pharm-design': 'DesignApplication',
};

function setMetaContent(
  selector: string,
  content: string,
  createAttr?: { attr: 'property' | 'name'; value: string },
) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element && createAttr) {
    element = document.createElement('meta');
    element.setAttribute(createAttr.attr, createAttr.value);
    document.head.appendChild(element);
  }
  if (element) {
    element.setAttribute('content', content);
  }
}

export function syncSeoMetadata(lang: Language, reviewSummary?: SeoReviewSummary) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const copy = SEO_COPY[lang];
  const content = getPortfolioContent(lang);
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  const absoluteImageUrl = toAbsoluteAssetUrl(content.personal.profilePhoto);

  document.title = copy.title;

  setMetaContent('meta[name="description"]', copy.description);
  setMetaContent('meta[property="og:title"]', copy.title);
  setMetaContent('meta[property="og:description"]', copy.description);
  setMetaContent('meta[property="og:url"]', canonicalUrl, {
    attr: 'property',
    value: 'og:url',
  });
  setMetaContent('meta[property="og:locale"]', copy.locale);
  setMetaContent('meta[property="og:locale:alternate"]', copy.alternateLocale);
  setMetaContent('meta[property="og:image"]', absoluteImageUrl);
  setMetaContent('meta[property="og:image:alt"]', copy.imageAlt);

  setMetaContent('meta[name="twitter:title"]', copy.title);
  setMetaContent('meta[name="twitter:description"]', copy.description);
  setMetaContent('meta[name="twitter:image"]', absoluteImageUrl);
  setMetaContent('meta[name="twitter:image:alt"]', copy.imageAlt, {
    attr: 'name',
    value: 'twitter:image:alt',
  });

  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  const projectItems = content.projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'WebApplication',
      name: project.title,
      description: project.description,
      url: project.liveDemoUrl || canonicalUrl,
      applicationCategory: PROJECT_SCHEMA_CATEGORY[project.id] ?? 'WebApplication',
      operatingSystem: 'All',
      inLanguage: 'ar',
      keywords: project.stack.join(', '),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: { '@id': `${canonicalUrl}#person` },
      ...(project.screenshots[0]
        ? { image: toAbsoluteAssetUrl(project.screenshots[0].src) }
        : {}),
    },
  }));

  const websiteEntity: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': `${canonicalUrl}#website`,
    url: canonicalUrl,
    name: copy.title,
    description: copy.description,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${canonicalUrl}#person` },
  };

  if (reviewSummary && reviewSummary.ratingCount > 0) {
    websiteEntity.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(reviewSummary.ratingValue.toFixed(1)),
      reviewCount: reviewSummary.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };

    if (reviewSummary.recentReviews && reviewSummary.recentReviews.length > 0) {
      websiteEntity.review = reviewSummary.recentReviews.slice(0, 5).map((rev) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: rev.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: rev.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: rev.comment,
        ...(rev.datePublished ? { datePublished: rev.datePublished } : {}),
      }));
    }
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${canonicalUrl}#profile-page`,
        url: canonicalUrl,
        name: copy.title,
        description: copy.description,
        dateCreated: '2026-01-01T00:00:00Z',
        dateModified: new Date().toISOString(),
        inLanguage: lang,
        mainEntity: { '@id': `${canonicalUrl}#person` },
      },
      {
        '@type': 'Person',
        '@id': `${canonicalUrl}#person`,
        name: content.personal.fullName,
        alternateName: ['Abdullah Islam', 'عبدالله إسلام', 'Abdullah Eslam Hassan'],
        jobTitle:
          lang === 'ar'
            ? 'مطور برمجيات ومصمم واجهات UI/UX ومسؤول دعم فني'
            : 'Software Developer, UI/UX Designer & IT Support Focal Point',
        description: copy.description,
        url: canonicalUrl,
        email: `mailto:${content.personal.email}`,
        telephone: content.personal.phoneHref,
        image: absoluteImageUrl,
        mainEntityOfPage: { '@id': `${canonicalUrl}#profile-page` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Benha',
          addressRegion: 'Qalyubia',
          addressCountry: 'EG',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Professional Inquiries',
          email: `mailto:${content.personal.email}`,
          telephone: content.personal.phoneHref,
          availableLanguage: ['Arabic', 'English'],
        },
        hasOccupation: [
          {
            '@type': 'Occupation',
            name: 'Software Developer',
            occupationLocation: { '@type': 'Country', name: 'Egypt' },
          },
          {
            '@type': 'Occupation',
            name: 'UI/UX Designer',
            occupationLocation: { '@type': 'Country', name: 'Egypt' },
          },
          {
            '@type': 'Occupation',
            name: 'IT Support Team Lead',
            occupationLocation: { '@type': 'City', name: 'El Sheikh Zayed' },
          },
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'Holool for Programming',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'El Sheikh Zayed',
            addressCountry: 'EG',
          },
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Modern Academy for Computer Science and Management Technology',
        },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: "Bachelor's Degree",
          name: 'Bachelor of Computer Science (B.Sc.)',
          recognizedBy: {
            '@type': 'CollegeOrUniversity',
            name: 'Modern Academy for Computer Science and Management Technology',
          },
        },
        knowsLanguage: ['Arabic', 'English'],
        knowsAbout: [
          'Software Engineering',
          'Full-Stack Web Development',
          'UI/UX Design',
          'Figma',
          'Canva AI',
          'Responsive Web Design',
          'RTL Web Design',
          'IT Support',
          'HTML',
          'CSS',
          'JavaScript',
          'TypeScript',
          'React',
          'Node.js',
          'Express.js',
          'MongoDB',
          'Flutter',
          'Dart',
          'Firebase',
          'SQL',
          'REST APIs',
          'Progressive Web Apps (PWA)',
          'Git',
          'GitHub',
          'Technical SEO',
        ],
        sameAs: [content.personal.linkedinUrl, content.personal.githubUrl],
      },
      websiteEntity,
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#projects-list`,
        name:
          lang === 'ar'
            ? 'أبرز مشاريع تطوير البرمجيات وتصميم الواجهات'
            : 'Featured Software Development & UI/UX Projects',
        itemListElement: projectItems,
      },
    ],
  };

  const jsonLdScript = document.getElementById('seo-jsonld');
  if (jsonLdScript) {
    jsonLdScript.textContent = JSON.stringify(graph);
  }
}
