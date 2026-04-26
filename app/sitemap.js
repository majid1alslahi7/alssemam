import { supabase } from '@/services/supabase';

export default async function sitemap() {
  const baseUrl = 'https://alssemam.com';

  // الصفحات الثابتة الأساسية
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ads`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  try {
    // جلب المشاريع من قاعدة البيانات
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at');

    const projectRoutes = projects?.map((project) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: new Date(project.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) || [];

    // جلب المقالات من قاعدة البيانات
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .eq('is_published', true);

    const articleRoutes = articles?.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) || [];

    // جلب الإعلانات من قاعدة البيانات
    const { data: ads } = await supabase
      .from('classified_ads')
      .select('slug, updated_at')
      .eq('status', 'active');

    const adRoutes = ads?.map((ad) => ({
      url: `${baseUrl}/ads/${ad.slug}`,
      lastModified: new Date(ad.updated_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.6,
    })) || [];

    // دمج جميع المسارات
    return [...staticRoutes, ...projectRoutes, ...articleRoutes, ...adRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
