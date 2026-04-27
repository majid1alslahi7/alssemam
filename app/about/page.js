import AboutPage from '@/components/AboutPage';

/* ============================================================
   SEO Metadata — Static (Server Component)
   ============================================================ */
export const metadata = {
  metadataBase: new URL('https://www.alssemam.com'),

  title: 'من نحن | شركة السمام للحلول التقنية - تطوير المواقع والتطبيقات',
  description:
    'تعرّف على شركة السمام للحلول التقنية المتخصصة في تطوير المواقع وتطبيقات الهواتف وحلول السحابة. فريق من الخبراء بخبرة تزيد عن 5 سنوات وأكثر من 50 مشروعاً ناجحاً.',
  keywords: [
    'شركة السمام',
    'من نحن',
    'شركة تقنية يمنية',
    'تطوير مواقع اليمن',
    'تطوير تطبيقات صنعاء',
    'حلول رقمية',
    'شركة برمجة اليمن',
    'تحول رقمي',
    'حلول سحابية',
    'تطوير ويب السعودية',
  ],

  authors: [{ name: 'شركة السمام للحلول التقنية', url: 'https://www.alssemam.com' }],
  creator: 'شركة السمام للحلول التقنية',
  publisher: 'شركة السمام للحلول التقنية',

  alternates: {
    canonical: 'https://www.alssemam.com/about',
    languages: { 'ar-YE': 'https://www.alssemam.com/about' },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    url: 'https://www.alssemam.com/about',
    siteName: 'شركة السمام للحلول التقنية',
    title: 'من نحن | شركة السمام للحلول التقنية',
    description:
      'شركة السمام — سحابة التقنية التي تطلق أعمالكم. خبرة +5 سنوات، +50 مشروع، +30 عميل راضٍ.',
    images: [
      {
        url: 'https://www.alssemam.com/og/about.png',
        width: 1200,
        height: 630,
        alt: 'شركة السمام للحلول التقنية — من نحن',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@alssemam',
    creator: '@alssemam',
    title: 'من نحن | شركة السمام للحلول التقنية',
    description:
      'شركة السمام — سحابة التقنية التي تطلق أعمالكم. خبرة +5 سنوات، +50 مشروع ناجح.',
    images: ['https://www.alssemam.com/og/about.png'],
  },

  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },

  other: {
    'geo.region': 'YE',
    'geo.placename': 'صنعاء',
    'content-language': 'ar',
    rating: 'general',
  },
};

/* ============================================================
   JSON-LD Structured Data
   ============================================================ */
function AboutJsonLd() {
  const jsonLd = [
    /* 1. Organization */
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.alssemam.com/#organization',
      name: 'شركة السمام للحلول التقنية',
      alternateName: 'Al-Ssemam Tech',
      url: 'https://www.alssemam.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.alssemam.com/logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://www.alssemam.com/og/about.png',
      description:
        'شركة السمام للحلول التقنية متخصصة في تطوير مواقع الويب وتطبيقات الهواتف والحلول السحابية في اليمن والسعودية.',
      foundingDate: '2024',
      foundingLocation: {
        '@type': 'Place',
        name: 'صنعاء، اليمن',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'صنعاء',
          addressCountry: 'YE',
        },
      },
      areaServed: [
        { '@type': 'Country', name: 'اليمن' },
        { '@type': 'Country', name: 'المملكة العربية السعودية' },
      ],
      numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 20 },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+967-715122500',
          contactType: 'customer service',
          availableLanguage: 'Arabic',
          contactOption: 'TollFree',
          areaServed: 'YE',
        },
        {
          '@type': 'ContactPoint',
          email: 'info@alssemam.com',
          contactType: 'sales',
          availableLanguage: 'Arabic',
        },
      ],
      sameAs: [
        'https://wa.me/967715122500',
        'https://www.facebook.com/alssemam',
        'https://www.instagram.com/alssemam',
        'https://twitter.com/alssemam',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'خدمات شركة السمام التقنية',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تطوير مواقع الويب' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تطوير تطبيقات الهواتف' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'الحلول السحابية' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تصميم واجهات المستخدم' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'التجارة الإلكترونية' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'حلول الذكاء الاصطناعي' } },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '30',
        reviewCount: '30',
      },
    },

    /* 2. AboutPage */
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': 'https://www.alssemam.com/about#webpage',
      url: 'https://www.alssemam.com/about',
      name: 'من نحن | شركة السمام للحلول التقنية',
      description:
        'تعرّف على شركة السمام للحلول التقنية — قصتنا، قيمنا، وإنجازاتنا في مجال التقنية.',
      inLanguage: 'ar',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.alssemam.com/#website',
        name: 'شركة السمام للحلول التقنية',
        url: 'https://www.alssemam.com',
        inLanguage: 'ar',
        publisher: { '@id': 'https://www.alssemam.com/#organization' },
      },
      about: { '@id': 'https://www.alssemam.com/#organization' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://www.alssemam.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'من نحن',
            item: 'https://www.alssemam.com/about',
          },
        ],
      },
    },

    /* 3. FAQ */
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'متى تأسست شركة السمام؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'تأسست شركة السمام للحلول التقنية عام 2024 في صنعاء، اليمن.',
          },
        },
        {
          '@type': 'Question',
          name: 'ما هي خدمات شركة السمام؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'تقدم شركة السمام خدمات تطوير مواقع الويب، تطبيقات الهواتف الذكية، الحلول السحابية، تصميم واجهات المستخدم، المتاجر الإلكترونية، وحلول الذكاء الاصطناعي.',
          },
        },
        {
          '@type': 'Question',
          name: 'كم عدد المشاريع التي أنجزتها شركة السمام؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'أنجزت شركة السمام أكثر من 50 مشروعاً تقنياً ناجحاً لأكثر من 30 عميل.',
          },
        },
        {
          '@type': 'Question',
          name: 'أين تتواجد شركة السمام؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'تتواجد شركة السمام في صنعاء، اليمن والرياض، المملكة العربية السعودية، وتخدم عملاءها في جميع أنحاء العالم العربي.',
          },
        },
        {
          '@type': 'Question',
          name: 'هل تقدم شركة السمام دعماً فنياً مستمراً؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'نعم، تقدم شركة السمام دعماً فنياً متواصلاً على مدار الساعة لجميع عملائها.',
          },
        },
      ],
    },

    /* 4. MilestoneEvents */
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'رحلة إنجازات شركة السمام',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Event',
            name: 'تأسيس شركة السمام',
            startDate: '2024-01-01',
            description: 'انطلاق رحلة شركة السمام في عالم التقنية',
            location: { '@type': 'Place', name: 'صنعاء، اليمن' },
            organizer: { '@id': 'https://www.alssemam.com/#organization' },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Event',
            name: 'إنجاز أول 10 مشاريع تقنية',
            startDate: '2025-01-01',
            description: 'إنجاز أول 10 مشاريع تقنية ناجحة',
            organizer: { '@id': 'https://www.alssemam.com/#organization' },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Event',
            name: 'التوسع في الأسواق العربية',
            startDate: '2026-01-01',
            description: 'التوسع الإقليمي في الأسواق العربية',
            organizer: { '@id': 'https://www.alssemam.com/#organization' },
          },
        },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/* ============================================================
   Page Export
   ============================================================ */
export default function AboutServerPage() {
  return (
    <>
      <AboutJsonLd />
      <AboutPage />
    </>
  );
}