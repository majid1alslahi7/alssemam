-- جدول الإعلانات المبوبة
CREATE TABLE IF NOT EXISTS classified_ads (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- jobs, lost, services, products, real_estate, events, other
  subcategory TEXT,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  price_type TEXT DEFAULT 'fixed', -- fixed, negotiable, free, hourly, daily, monthly
  location TEXT,
  city TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  images TEXT[], -- مصفوفة روابط الصور
  youtube_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- active, expired, sold, deleted
  views_count INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  user_id UUID, -- معرف المستخدم (لربطه بـ Supabase Auth)
  user_name TEXT,
  user_email TEXT,
  expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإبلاغ عن الإعلانات
CREATE TABLE IF NOT EXISTS ad_reports (
  id SERIAL PRIMARY KEY,
  ad_id INTEGER REFERENCES classified_ads(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_email TEXT,
  reason TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المفضلة
CREATE TABLE IF NOT EXISTS ad_favorites (
  id SERIAL PRIMARY KEY,
  ad_id INTEGER REFERENCES classified_ads(id) ON DELETE CASCADE,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ad_id, user_id)
);

-- إضافة بيانات تجريبية
INSERT INTO classified_ads (title, slug, category, description, price, location, contact_name, contact_phone, contact_email, is_featured) VALUES
('مطلوب مطور React Native', 'job-react-native-developer', 'jobs', 'نبحث عن مطور React Native للعمل عن بعد، خبرة سنة على الأقل', 1500, 'عن بعد', 'أحمد محمد', '0501234567', 'ahmed@example.com', true),
('فقدت هاتف Samsung S23', 'lost-samsung-s23', 'lost', 'فقدت هاتف Samsung S23 في منطقة التحرير، لمن يعثر عليه يتصل', NULL, 'صنعاء', 'خالد علي', '0771234567', 'khalid@example.com', true),
('تصميم لوجو احترافي', 'logo-design-service', 'services', 'أقدم خدمة تصميم لوجو احترافي بأسعار منافسة', 50, 'أونلاين', 'سارة أحمد', '0551234567', 'sara@example.com', false),
('لابتوب Dell XPS للبيع', 'dell-xps-for-sale', 'products', 'لابتوب Dell XPS 13 بحالة ممتازة، معالج i7، رام 16GB، SSD 512GB', 2500, 'عدن', 'محمد عبدالله', '0731234567', 'mohammed@example.com', true);
