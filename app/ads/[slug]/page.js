import { supabase } from '@/services/supabase';
import AdDetailsPage from '@/components/AdDetailsPage';

/* ────────────────────────────────────────
   Dynamic Metadata per Ad
─────────────────────────────────────────*/
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: ad } = await supabase
    .from('classified_ads')
    .select('title, description, image, category, city, price, created_at, contact_name')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!ad) {
    return {
      title: 'الإعلان غير موجود | السمام',
      robots: { index: false, follow: false }
    };
  }

  const categoryNames = {
    jobs: 'وظائف', lost: 'فقدان', services: 'خدمات',
    products: 'منتجات', real_estate: 'عقارات', events: 'فعاليات', other: 'أخرى'
  };

  const categoryName = categoryNames[ad.category] || ad.category;
  const shortDesc = ad.description?.substring(0, 160) || '';
  const pageUrl = `https://alssemam.com/ads/${slug}`;
  const imageUrl = ad.image || 'https://alssemam.com/og/ads.jpg';

  const titleParts = [ad.title];
  if (ad.city) titleParts.push(ad.city);
  titleParts.push(categoryName, 'السمام');

  return {
    title: titleParts.join(' | '),
    description: shortDesc,
    keywords: [
      ad.title, categoryName, ad.city || 'اليمن',
      'إعلانات مبوبة', 'السمام', categoryName + ' اليمن',
      ad.category === 'jobs' ? 'وظائف شاغرة' : 'بيع وشراء'
    ].filter(Boolean),
    authors: [{ name: ad.contact_name || 'السمام', url: 'https://alssemam.com' }],
    creator: 'السمام',
    publisher: 'السمام',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
    },
    alternates: {
      canonical: pageUrl,
      languages: { 'ar-YE': pageUrl }
    },
    openGraph: {
      type: 'article',
      locale: 'ar_YE',
      url: pageUrl,
      siteName: 'السمام',
      title: `${ad.title} | ${categoryName} - السمام`,
      description: shortDesc,
      publishedTime: ad.created_at,
      section: categoryName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ad.title,
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@alssemam',
      creator: '@alssemam',
      title: `${ad.title} | السمام`,
      description: shortDesc,
      images: [imageUrl]
    }
  };
}

/* ────────────────────────────────────────
   JSON-LD Structured Data (Dynamic)
─────────────────────────────────────────*/
async function AdJsonLd({ slug }) {
  const { data: ad } = await supabase
    .from('classified_ads')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!ad) return null;

  const categoryNames = {
    jobs: 'وظائف', lost: 'فقدان', services: 'خدمات',
    products: 'منتجات', real_estate: 'عقارات', events: 'فعاليات', other: 'أخرى'
  };

  const pageUrl = `https://alssemam.com/ads/${slug}`;

  /* Build the main item type based on category */
  let mainEntity = {
    '@type': 'Article',
    '@id': `${pageUrl}#ad`,
    headline: ad.title,
    description: ad.description,
    url: pageUrl,
    datePublished: ad.created_at,
    dateModified: ad.updated_at || ad.created_at,
    inLanguage: 'ar',
    author: {
      '@type': 'Person',
      name: ad.contact_name || 'مستخدم السمام'
    },
    publisher: {
      '@type': 'Organization',
      name: 'السمام',
      url: 'https://alssemam.com',
      logo: { '@type': 'ImageObject', url: 'https://alssemam.com/logo.png' }
    }
  };

  if (ad.image) {
    mainEntity.image = {
      '@type': 'ImageObject',
      url: ad.image,
      width: 1200,
      height: 630
    };
  }

  /* Product schema for products/real_estate */
  let productSchema = null;
  if (['products', 'real_estate', 'services'].includes(ad.category) && ad.price) {
    productSchema = {
      '@type': 'Product',
      name: ad.title,
      description: ad.description,
      url: pageUrl,
      offers: {
        '@type': 'Offer',
        price: ad.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        seller: {
          '@type': 'Person',
          name: ad.contact_name || 'مستخدم السمام'
        }
      }
    };
    if (ad.image) productSchema.image = ad.image;
  }

  /* JobPosting schema for jobs */
  let jobSchema = null;
  if (ad.category === 'jobs') {
    jobSchema = {
      '@type': 'JobPosting',
      title: ad.title,
      description: ad.description,
      datePosted: ad.created_at,
      validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      hiringOrganization: {
        '@type': 'Organization',
        name: ad.contact_name || 'جهة التوظيف',
        sameAs: 'https://alssemam.com'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: ad.city || 'صنعاء',
          addressCountry: 'YE'
        }
      },
      ...(ad.price && {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: { '@type': 'QuantitativeValue', value: ad.price, unitText: 'MONTH' }
        }
      })
    };
  }

  /* Event schema */
  let eventSchema = null;
  if (ad.category === 'events') {
    eventSchema = {
      '@type': 'Event',
      name: ad.title,
      description: ad.description,
      startDate: ad.created_at,
      location: {
        '@type': 'Place',
        name: ad.city || 'اليمن',
        address: {
          '@type': 'PostalAddress',
          addressLocality: ad.city || 'صنعاء',
          addressCountry: 'YE'
        }
      },
      organizer: {
        '@type': 'Person',
        name: ad.contact_name || 'منظم الفعالية'
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
    };
  }

  const graph = [
    {
      '@type': 'WebPage',
      '@id': pageUrl,
      url: pageUrl,
      name: ad.title,
      description: ad.description?.substring(0, 160),
      inLanguage: 'ar',
      isPartOf: { '@id': 'https://alssemam.com/#website' },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://alssemam.com' },
        { '@type': 'ListItem', position: 2, name: 'الإعلانات المبوبة', item: 'https://alssemam.com/ads' },
        { '@type': 'ListItem', position: 3, name: categoryNames[ad.category] || ad.category, item: `https://alssemam.com/ads?category=${ad.category}` },
        { '@type': 'ListItem', position: 4, name: ad.title, item: pageUrl }
      ]
    },
    mainEntity
  ];

  if (productSchema) graph.push(productSchema);
  if (jobSchema) graph.push(jobSchema);
  if (eventSchema) graph.push(eventSchema);

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ────────────────────────────────────────
   Static Params for SSG (optional)
─────────────────────────────────────────*/
export async function generateStaticParams() {
  const { data: ads } = await supabase
    .from('classified_ads')
    .select('slug')
    .eq('status', 'active')
    .limit(100);

  return (ads || []).map((ad) => ({ slug: ad.slug }));
}

export default async function AdPage({ params }) {
  return (
    <>
      <AdJsonLd slug={params.slug} />
      <AdDetailsPage />
    </>
  );
}