import { supabase } from "@/services/supabase";

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://alssemam.com";
  const now = new Date();

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ads`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  try {
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .not("slug", "is", null);

    if (projectsError) throw projectsError;

    const projectRoutes =
      projects?.map((project) => ({
        url: `${baseUrl}/project/${project.slug}`,
        lastModified: project.updated_at
          ? new Date(project.updated_at)
          : now,
        changeFrequency: "weekly",
        priority: 0.7,
      })) || [];

    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("is_published", true)
      .not("slug", "is", null);

    if (articlesError) throw articlesError;

    const articleRoutes =
      articles?.map((article) => ({
        url: `${baseUrl}/news/${article.slug}`,
        lastModified: article.updated_at
          ? new Date(article.updated_at)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    const { data: ads, error: adsError } = await supabase
      .from("classified_ads")
      .select("slug, updated_at")
      .eq("status", "active")
      .not("slug", "is", null);

    if (adsError) throw adsError;

    const adRoutes =
      ads?.map((ad) => ({
        url: `${baseUrl}/ads/${ad.slug}`,
        lastModified: ad.updated_at ? new Date(ad.updated_at) : now,
        changeFrequency: "daily",
        priority: 0.6,
      })) || [];

    return [...staticRoutes, ...projectRoutes, ...articleRoutes, ...adRoutes];
  } catch (error) {
    console.error("Sitemap error:", error);
    return staticRoutes;
  }
}