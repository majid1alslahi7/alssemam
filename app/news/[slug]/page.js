import { supabase } from "@/services/supabase";
import ArticleClient from "./ArticleClient";

const baseUrl = "https://alssemam.com";

// أضف هذه الدالة المساعدة في أعلى الملف
function decodeSlug(encodedSlug) {
  try {
    // فك ترميز الرابط للتعامل مع العربية
    return decodeURIComponent(encodedSlug);
  } catch {
    // إذا حدث خطأ، أرجع القيمة الأصلية
    return encodedSlug;
  }
}

async function getArticle(slug) {
  // **هذا هو التغيير الأهم: قم بفك ترميز الـ slug قبل البحث به**
  const decodedSlug = decodeSlug(slug);
  
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", decodedSlug) // استخدم القيمة المفوّكة للبحث
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "المقال غير موجود | السمام نيوز",
      robots: { index: false, follow: false },
    };
  }

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
  const article = await getArticle(params.slug);

  if (!article) {
    return (
      <main className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
      </main>
    );
  }

  const url = `${baseUrl}/news/${article.slug}`;
  const image = article.image || `${baseUrl}/logo/logo.webp`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.content?.slice(0, 160),
    image,
    url,
    mainEntityOfPage: url,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ArticleClient article={article} />
    </>
  );
}
 