import ContactPage from '@/components/ContactPage';

export const metadata = {
  title: 'تواصل معنا | السمام للتقنية - خدمات تطوير المواقع والتطبيقات',
  description:
    'تواصل مع فريق السمام للتقنية للاستفسار عن خدمات تطوير المواقع، تطبيقات الموبايل، الحلول السحابية، وتصميم واجهات المستخدم. نحن في اليمن والسعودية.',
  keywords: [
    'تواصل معنا',
    'السمام للتقنية',
    'تطوير مواقع اليمن',
    'تطوير تطبيقات موبايل',
    'شركة تقنية صنعاء',
    'شركة تقنية الرياض',
    'خدمات سحابية',
    'تصميم واجهات مستخدم',
    'متجر إلكتروني',
    'ذكاء اصطناعي',
    'web development Yemen',
    'software company Saudi Arabia',
  ],
  authors: [{ name: 'السمام للتقنية', url: 'https://www.alssemam.com' }],
  creator: 'السمام للتقنية',
  publisher: 'السمام للتقنية',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.alssemam.com/contact',
    languages: {
      'ar-YE': 'https://www.alssemam.com/contact',
      'ar-SA': 'https://www.alssemam.com/contact',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    url: 'https://www.alssemam.com/contact',
    siteName: 'السمام للتقنية',
    title: 'تواصل معنا | السمام للتقنية',
    description:
      'تواصل مع فريق السمام للتقنية للاستفسار عن خدمات تطوير المواقع والتطبيقات والحلول التقنية المتكاملة.',
    images: [
      {
        url: 'https://www.alssemam.com/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'تواصل مع السمام للتقنية',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تواصل معنا | السمام للتقنية',
    description:
      'تواصل مع فريق السمام للتقنية للاستفسار عن خدمات تطوير المواقع والتطبيقات.',
    images: ['https://www.alssemam.com/og-contact.jpg'],
    creator: '@alssemam',
    site: '@alssemam',
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    // yandex: 'YANDEX_CODE',
    // bing: 'BING_CODE',
  },
  category: 'technology',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://www.alssemam.com/contact#contactpage',
      name: 'تواصل مع السمام للتقنية',
      description:
        'صفحة التواصل مع شركة السمام للتقنية - خدمات تطوير المواقع والتطبيقات في اليمن والسعودية',
      url: 'https://www.alssemam.com/contact',
      inLanguage: 'ar',
      isPartOf: {
        '@id': 'https://www.alssemam.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.alssemam.com/contact#breadcrumb',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.alssemam.com/contact#breadcrumb',
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
          name: 'تواصل معنا',
          item: 'https://www.alssemam.com/contact',
        },
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.alssemam.com/#organization',
      name: 'السمام للتقنية',
      alternateName: 'Alssemam Tech',
      url: 'https://www.alssemam.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.alssemam.com/logo/logo.webp',
        width: 200,
        height: 60,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+967-715-122500',
          contactType: 'customer service',
          availableLanguage: ['Arabic'],
          areaServed: ['YE', 'SA'],
          hoursAvailable: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Saturday',
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
              ],
              opens: '09:00',
              closes: '17:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Thursday'],
              opens: '09:00',
              closes: '14:00',
            },
          ],
        },
      ],
      email: 'info@alssemam.com',
      sameAs: [
        'https://wa.me/967715122500',
        'https://twitter.com/alssemam',
        'https://www.linkedin.com/company/alssemam',
      ],
      address: [
        {
          '@type': 'PostalAddress',
          addressLocality: 'صنعاء',
          addressCountry: 'YE',
        },
        {
          '@type': 'PostalAddress',
          addressLocality: 'الرياض',
          addressCountry: 'SA',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.alssemam.com/#website',
      url: 'https://www.alssemam.com',
      name: 'السمام للتقنية',
      description: 'شركة تقنية متخصصة في تطوير المواقع والتطبيقات والحلول الرقمية',
      inLanguage: 'ar',
      publisher: {
        '@id': 'https://www.alssemam.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.alssemam.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function ContactRoute() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPage />
    </>
  );
}
