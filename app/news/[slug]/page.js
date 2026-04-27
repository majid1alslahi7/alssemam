import { supabase } from "@/services/supabase";
import ArticleClient from "./ArticleClient";

const baseUrl = "https://alssemam.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanText(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeDecode(value = "") {
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

async function getArticle(slug) {
  const decodedSlug = safeDecode(slug);

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", decodedSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase article error:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getArticle failed:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

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

  const url = `${baseUrl}/news/${encodeURIComponent(article.slug)}`;
  const title = `${article.title} | السمام نيوز`;
  const description =
    article.excerpt ||
    cleanText(article.content).slice(0, 160) ||
    "مقال تقني من السمام نيوز.";

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
      siteName: "السمام نيوز",
      locale: "ar_AR",
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

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const article = await getArticle(slug);

  if (!article) {
    return (
      <main className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
        <p className="text-gray-500">قد يكون الرابط غير صحيح أو المقال غير منشور.</p>
      </main>
    );
  }

  const url = `${baseUrl}/news/${encodeURIComponent(article.slug)}`;
  const image = article.image || `${baseUrl}/logo/logo.webp`;

  const description =
    article.excerpt ||
    cleanText(article.content).slice(0, 160) ||
    "مقال تقني من السمام نيوز.";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description,
        image,
        url,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        datePublished: article.published_at || article.created_at,
        dateModified:
          article.updated_at || article.published_at || article.created_at,
        inLanguage: "ar",
        author: {
          "@type": "Organization",
          name: article.author || "شركة السمام",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "السمام نيوز",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo/logo.webp`,
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