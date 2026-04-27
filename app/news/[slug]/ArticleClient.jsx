import { supabase } from "@/services/supabase";
import ArticleClient from "./ArticleClient";
import { notFound } from "next/navigation";

const baseUrl = "https://alssemam.com";

async function getArticle(slug) {
  const { data, error } = await supabase
    .from("articles").select("*")
    .eq("slug", slug).eq("is_published", true).single();
  if (error || !data) return null;
  return data;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("articles").select("slug").eq("is_published", true);
  return (data || []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: "المقال غير موجود | السمام نيوز", robots: { index: false } };

  const url = `${baseUrl}/news/${article.slug}`;
  const title = `${article.title} | السمام نيوز`;
  const description =
    article.excerpt ||
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    "مقال تقني من السمام نيوز.";
  const image = article.image || `${baseUrl}/logo/logo.webp`;

  return {
    title,
    description,
    keywords: [
      article.title, "السمام نيوز", "شركة السمام",
      "مقال تقني", "برمجة", "تطوير مواقع",
    ],
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      type: "article",
      siteName: "السمام نيوز",
      locale: "ar_AR",
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at || article.published_at,
      authors: [article.author || "شركة السمام"],
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: [image],
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const url = `${baseUrl}/news/${article.slug}`;
  const image = article.image || `${baseUrl}/logo/logo.webp`;
  const description =
    article.excerpt ||
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    "مقال تقني من السمام نيوز.";

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
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    inLanguage: "ar",
    wordCount: article.content?.split(/\s+/).length || 0,
    author: {
      "@type": "Organization",
      name: article.author || "شركة السمام",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "السمام نيوز",
      url: `${baseUrl}/news`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/logo.webp`,
        width: 512,
        height: 512,
      },
    },
    isPartOf: {
      "@type": "NewsMediaOrganization",
      name: "السمام نيوز",
      url: `${baseUrl}/news`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "السمام نيوز", item: `${baseUrl}/news` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name: article.title,
    description,
    url,
    inLanguage: "ar",
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    isPartOf: { "@type": "WebSite", name: "شركة السمام", url: baseUrl },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <ArticleClient article={article} />
    </>
  );
}