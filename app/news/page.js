import { supabase } from "@/services/supabase";
import NewsClient from "./NewsClient";

const baseUrl = "https://alssemam.com";

export const metadata = {
  title: "السمام نيوز | أخبار التقنية والبرمجة",
  description:
    "السمام نيوز منصة تقنية تقدم أخبار ومقالات عن البرمجة، تطوير المواقع، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين SEO.",
  alternates: {
    canonical: `${baseUrl}/news`,
  },
  openGraph: {
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description:
      "أحدث الأخبار والمقالات التقنية من شركة السمام في البرمجة وتطوير المواقع والتطبيقات.",
    url: `${baseUrl}/news`,
    siteName: "شركة السمام",
    type: "website",
    locale: "ar_AR",
    images: [
      {
        url: `${baseUrl}/logo/logo.webp`,
        width: 512,
        height: 512,
        alt: "السمام نيوز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description:
      "أحدث الأخبار والمقالات التقنية من شركة السمام.",
    images: [`${baseUrl}/logo/logo.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
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
        name: "السمام نيوز",
        url: `${baseUrl}/news`,
        logo: `${baseUrl}/logo/logo.webp`,
        parentOrganization: {
          "@type": "Organization",
          name: "شركة السمام",
          url: baseUrl,
        },
      },
      {
        "@type": "CollectionPage",
        name: "السمام نيوز",
        description:
          "أخبار ومقالات تقنية حول البرمجة وتطوير المواقع والتطبيقات والذكاء الاصطناعي.",
        url: `${baseUrl}/news`,
        inLanguage: "ar",
      },
      {
        "@type": "ItemList",
        name: "مقالات السمام نيوز",
        itemListElement: articles.slice(0, 20).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/news/${article.slug}`,
          name: article.title,
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