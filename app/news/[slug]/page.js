import { supabase } from "@/services/supabase";
import ArticleClient from "./ArticleClient";
import { notFound } from "next/navigation";

const baseUrl = "https://alssemam.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getArticle(slug) {
  const decodedSlug = decodeURIComponent(slug);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;

  return data;
}

function stripHtml(text = "") {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getDescription(article) {
  return (
    article.excerpt ||
    stripHtml(article.content || "").slice(0, 160) ||
    "مقال تقني من السمام نيوز حول البرمجة وتطوير المواقع والتطبيقات."
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "المقال غير موجود | السمام نيوز",
      description: "هذا المقال غير متوفر حالياً في السمام نيوز.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `${baseUrl}/news/${encodeURIComponent(article.slug)}`;
  const title = `${article.title} | السمام نيوز`;
  const description = getDescription(article);
  const image = article.image || `${baseUrl}/logo/logo.webp`;

  return {
    title,
    description,
    keywords: [
      article.title,
      article.category || "مقال تقني",
      "السمام نيوز",
      "شركة السمام",
      "تطوير مواقع",
      "برمجة",
      "Next.js",
      "React",
      "SEO",
      "ذكاء اصطناعي",
      "تطبيقات موبايل",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "شركة السمام",
      locale: "ar_AR",
      publishedTime: article.published_at || article.created_at,
      modifiedTime:
        article.updated_at || article.published_at || article.created_at,
      authors: [article.author || "شركة السمام"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const url = `${baseUrl}/news/${encodeURIComponent(article.slug)}`;
  const image = article.image || `${baseUrl}/logo/logo.webp`;
  const description = getDescription(article);
  const cleanContent = stripHtml(article.content || "");
  const wordCount = cleanContent ? cleanContent.split(/\s+/).length : 0;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: article.published_at || article.created_at,
    dateModified:
      article.updated_at || article.published_at || article.created_at,
    inLanguage: "ar",
    wordCount,
    articleSection: article.category || "تقنية",
    author: {
      "@type": "Organization",
      name: article.author || "شركة السمام",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "شركة السمام",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/logo.webp`,
        width: 512,
        height: 512,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "السمام نيوز",
        item: `${baseUrl}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: article.title,
    description,
    url,
    inLanguage: "ar",
    isPartOf: {
      "@type": "WebSite",
      name: "شركة السمام",
      url: baseUrl,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      <ArticleClient article={article} />
    </>
  );
}