-- جدول المقالات/الأخبار
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'news', -- news, article, writing
  image TEXT,
  author TEXT DEFAULT 'السَّمَام',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإعلانات
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  position TEXT DEFAULT 'sidebar', -- sidebar, banner, popup
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التصنيفات
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة بيانات تجريبية
INSERT INTO categories (name, slug) VALUES
('أخبار الشركة', 'company-news'),
('مقالات تقنية', 'tech-articles'),
('كتابات وإبداع', 'creative-writing');

-- إضافة مقالات تجريبية
INSERT INTO articles (title, slug, excerpt, content, category, author) VALUES
('إطلاق موقع السَّمَام الجديد', 'launch-new-website', 'أعلنت شركة السَّمَام عن إطلاق موقعها الإلكتروني الجديد', 'نفخر بإطلاق موقعنا الجديد الذي يقدم خدماتنا بشكل أفضل...', 'news', 'فريق السَّمَام'),
('أهمية تحسين محركات البحث SEO', 'seo-importance', 'تعرف على أهمية SEO وكيف يمكن أن ينمي أعمالك', 'SEO هو عنصر أساسي لنجاح أي موقع إلكتروني...', 'article', 'أحمد محمد'),
('رحلتنا في عالم التقنية', 'our-tech-journey', 'قصة نجاح السَّمَام من البداية إلى الاحترافية', 'بدأت رحلة السَّمَام في عام 2024...', 'writing', 'فريق السَّمَام');
