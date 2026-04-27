import { supabase } from "@/services/supabase";
import NewsClient from "./NewsClient";

const baseUrl = "https://alssemam.com";

export const metadata = {
  title: "السمام نيوز | أخبار التقنية والبرمجة والذكاء الاصطناعي",
  description:
    "السمام نيوز منصة تقنية تقدم أخبار ومقالات عن البرمجة، تطوير مواقع الويب، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين SEO باللغة العربية.",
  keywords: [
    "السمام نيوز", "أخبار تقنية", "مقالات برمجة", "تطوير مواقع",
    "تطبيقات موبايل", "ذكاء اصطناعي", "SEO عربي", "شركة السمام",
  ],
  alternates: { canonical: `${baseUrl}/news` },
  openGraph: {
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description: "أحدث الأخبار والمقالات التقنية من شركة السمام.",
    url: `${baseUrl}/news`,
    siteName: "شركة السمام",
    type: "website",
    locale: "ar_AR",
    images: [{ url: `${baseUrl}/logo/logo.webp`, width: 1200, height: 630, alt: "السمام نيوز" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description: "أحدث الأخبار والمقالات التقنية من شركة السمام.",
    images: [`${baseUrl}/logo/logo.webp`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles").select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export default async function NewsPage() {
  const articles = await getArticles();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": `${baseUrl}/news#organization`,
        name: "السمام نيوز",
        url: `${baseUrl}/news`,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo/logo.webp`,
          width: 512,
          height: 512,
        },
        inLanguage: "ar",
        parentOrganization: {
          "@type": "Organization",
          name: "شركة السمام",
          url: baseUrl,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/news#webpage`,
        name: "السمام نيوز | أخبار التقنية والبرمجة",
        description: "أخبار ومقالات تقنية حول البرمجة وتطوير المواقع والتطبيقات والذكاء الاصطناعي.",
        url: `${baseUrl}/news`,
        inLanguage: "ar",
        publisher: { "@id": `${baseUrl}/news#organization` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "الرئيسية", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "السمام نيوز", item: `${baseUrl}/news` },
          ],
        },
      },
      {
        "@type": "ItemList",
        name: "مقالات السمام نيوز",
        description: "أحدث المقالات التقنية المنشورة في السمام نيوز",
        numberOfItems: articles.length,
        itemListElement: articles.slice(0, 20).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/news/${article.slug}`,
          name: article.title,
          image: article.image || `${baseUrl}/logo/logo.webp`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <NewsClient initialArticles={articles} />
    </>
  );
}