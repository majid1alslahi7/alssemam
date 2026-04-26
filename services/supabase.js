import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========== المشاريع ==========
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// ========== المقالات والأخبار ==========
export const getArticles = async (category = null, limit = null) => {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getArticleBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
};

export const getLatestArticles = async (limit = 5) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

// ========== الإعلانات المبوبة ==========
export const getClassifiedAds = async (filters = {}) => {
  try {
    let query = supabase
      .from('classified_ads')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters.city && filters.city !== 'all') {
      query = query.eq('city', filters.city);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error in getClassifiedAds:', err);
    return [];
  }
};

export const getClassifiedAdBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('classified_ads')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error in getClassifiedAdBySlug:', err);
    return null;
  }
};

export const createClassifiedAd = async (adData) => {
  const slug = adData.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
  
  const { data, error } = await supabase
    .from('classified_ads')
    .insert([{ ...adData, slug, status: 'active' }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// دوال الإبلاغ والنقرات
export const reportClassifiedAd = async (reportData) => {
  const { data, error } = await supabase
    .from('ad_reports')
    .insert([reportData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const incrementPhoneClick = async (adId) => {
  const { error } = await supabase
    .from('classified_ads')
    .update({ phone_clicks: supabase.rpc('increment', { x: 1 }) })
    .eq('id', adId);
  
  if (error) console.error('Error incrementing phone click:', error);
};

export const incrementWhatsappClick = async (adId) => {
  const { error } = await supabase
    .from('classified_ads')
    .update({ whatsapp_clicks: supabase.rpc('increment', { x: 1 }) })
    .eq('id', adId);
  
  if (error) console.error('Error incrementing whatsapp click:', error);
};

export const addContactRequest = async (request) => {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert([request])
    .select();
  
  if (error) throw error;
  return data[0];
};

export default supabase;
