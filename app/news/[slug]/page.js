import { supabase } from "@/services/supabase";
import ArticleClient from "./ArticleClient";
import { notFound } from "next/navigation";

const baseUrl = "https://alssemam.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeDecodeSlug(slug = "") {
  try {
    return decodeURIComponent(String(slug));
  } catch {
    return String(slug);
  }
}

function stripHtml(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getDescription(article) {
  return (
    article?.excerpt ||
    stripHtml(article?.content || "").slice(0, 160) ||
    "مقال تقني من السمام نيوز."
  );
}

async function getArticle(slug) {
  try {
    const decodedSlug = safeDecodeSlug(slug);

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", decodedSlug)
      .eq("is_published", true)
      .limit(1)
      .single();

    if (error || !data) {
      console.error("Article fetch error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getArticle server error:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "المقال غير موجود | السمام نيوز",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `${baseUrl}/news/${article.slug}`;
  const title = `${article.title} | السمام نيوز`;
  const description = getDescription(article);
  const image = article.image || `${baseUrl}/logo/logo.webp`;

  return {
    title,
    description,
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
      publishedTime: article.published_at || article.created_at || undefined,
      modifiedTime:
        article.updated_at ||
        article.published_at ||
        article.created_at ||
        undefined,
      authors: [article.author || "شركة السمام"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title || "السمام نيوز",
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
  const slug = params?.slug;
  const article = await getArticle(slug);

  if (!article) notFound();

  const url = `${baseUrl}/news/${article.slug}`;
  const image = article.image || `${baseUrl}/logo/logo.webp`;
  const description = getDescription(article);
  const cleanContent = stripHtml(article.content || "");
  const wordCount = cleanContent ? cleanContent.split(/\s+/).length : 0;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description,
        image,
        url,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        datePublished: article.published_at || article.created_at || undefined,
        dateModified:
          article.updated_at ||
          article.published_at ||
          article.created_at ||
          undefined,
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
      },
      {
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
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <ArticleClient article={article} />
    </>
  );
}