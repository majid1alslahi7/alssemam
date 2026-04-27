'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/services/supabase';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

/* ─────────────────────────────────────────
   SVG Icon Components (no react-icons)
───────────────────────────────────────────*/
const Icon = {
  ArrowRight:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Heart:       ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Bookmark:    ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Share:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Close:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Whatsapp:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  Mail:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  User:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Flag:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Dollar:      () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Star:        () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Eye:         () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Calendar:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Location:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:       () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Copy:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Link:        () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  /* Social */
  Facebook:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  Twitter:     () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Telegram:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  Instagram:   () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  ShareNative: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Bullhorn:    () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/30"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Check:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
};

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────────*/
const CATEGORY_NAMES = {
  jobs:'وظائف', lost:'فقدان', services:'خدمات',
  products:'منتجات', real_estate:'عقارات', events:'فعاليات', other:'أخرى'
};
function getCategoryName(cat) { return CATEGORY_NAMES[cat] || cat; }

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────────*/
export default function AdDetailsPage() {
  const { slug } = useParams();
  const [ad,           setAd]           = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [showReport,   setShowReport]   = useState(false);
  const [showShare,    setShowShare]    = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [liked,        setLiked]        = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [reportData,   setReportData]   = useState({ reason: '', description: '' });
  const [showPhone,    setShowPhone]    = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [relatedAds,   setRelatedAds]   = useState([]);

  useEffect(() => { if (slug) loadAd(); }, [slug]);

  const loadAd = async () => {
    try {
      const { data, error } = await supabase
        .from('classified_ads').select('*').eq('slug', slug).single();
      if (error) throw error;
      setAd(data);

      const likedAds = JSON.parse(localStorage.getItem('likedAds') || '[]');
      if (likedAds.includes(data.id)) setLiked(true);
      const savedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
      if (savedAds.includes(data.id)) setSaved(true);

      await supabase
        .from('classified_ads')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

      const { data: related } = await supabase
        .from('classified_ads').select('*')
        .eq('category', data.category).eq('status', 'active')
        .neq('id', data.id).limit(3);
      setRelatedAds(related || []);
    } catch (error) {
      console.error('Error loading ad:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Actions ── */
  const handleLike = () => {
    if (liked) { toast.success('لقد أعجبت بهذا الإعلان مسبقاً'); return; }
    setLiked(true);
    const likedAds = JSON.parse(localStorage.getItem('likedAds') || '[]');
    if (!likedAds.includes(ad.id)) {
      likedAds.push(ad.id);
      localStorage.setItem('likedAds', JSON.stringify(likedAds));
    }
    toast.success('شكراً لإعجابك بالإعلان!');
  };

  const handleSave = () => {
    const savedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
    if (saved) {
      setSaved(false);
      localStorage.setItem('savedAds', JSON.stringify(savedAds.filter(id => id !== ad.id)));
      toast.success('تم إزالة الإعلان من المحفوظات');
    } else {
      setSaved(true);
      if (!savedAds.includes(ad.id)) {
        savedAds.push(ad.id);
        localStorage.setItem('savedAds', JSON.stringify(savedAds));
      }
      toast.success('تم حفظ الإعلان');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('تعذر نسخ الرابط'));
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: ad?.description?.substring(0, 100),
          url: window.location.href
        });
        toast.success('تمت المشاركة بنجاح');
        setShowShare(false);
      } catch (err) {
        if (err.name !== 'AbortError') toast.error('تعذرت المشاركة');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShare = (platform) => {
    const url   = window.location.href;
    const title = ad?.title || 'إعلان';
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      email:    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
      setShowShare(false);
    }
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.success('تم نسخ الرابط! الصقه في انستجرام');
    setShowShare(false);
  };

  const handlePhoneClick = async () => {
    setShowPhone(true);
    await supabase.from('classified_ads')
      .update({ phone_clicks: (ad.phone_clicks || 0) + 1 }).eq('id', ad.id);
    window.location.href = `tel:${ad.contact_phone}`;
  };

  const handleWhatsappClick = async () => {
    setShowWhatsapp(true);
    await supabase.from('classified_ads')
      .update({ whatsapp_clicks: (ad.whatsapp_clicks || 0) + 1 }).eq('id', ad.id);
    window.open(`https://wa.me/${ad.contact_whatsapp?.replace(/[^0-9]/g, '')}`, '_blank', 'noopener,noreferrer');
  };

  const handleReport = async () => {
    if (!reportData.reason) { toast.error('الرجاء اختيار سبب الإبلاغ'); return; }
    try {
      await supabase.from('ad_reports').insert([{
        ad_id: ad.id,
        reason: reportData.reason,
        description: reportData.description
      }]);
      toast.success('تم إرسال البلاغ بنجاح');
      setShowReport(false);
    } catch {
      toast.error('حدث خطأ في إرسال البلاغ');
    }
  };

  /* ── Loading / Not Found ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="جاري تحميل الإعلان">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  if (!ad) {
    return (
      <main className="pt-32 text-center min-h-screen" role="main">
        <h1 className="text-2xl font-bold mb-4">الإعلان غير موجود</h1>
        <p className="text-gray-500 mb-6">ربما تم حذف الإعلان أو انتهت صلاحيته.</p>
        <Link href="/ads" className="text-blue-600 hover:underline inline-flex items-center gap-2">
          <Icon.ArrowRight />
          العودة إلى الإعلانات
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16" role="main">
      <Toaster position="top-center" />

      <div className="container mx-auto px-4">

        {/* ── Breadcrumb (visible + semantic) ── */}
        <nav aria-label="مسار التنقل" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap" role="list">
            <li><Link href="/" className="hover:text-blue-600 transition">الرئيسية</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li><Link href="/ads" className="hover:text-blue-600 transition">الإعلانات المبوبة</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li>
              <Link href={`/ads?category=${ad.category}`} className="hover:text-blue-600 transition">
                {getCategoryName(ad.category)}
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]" aria-current="page">
              {ad.title}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              itemScope
              itemType="https://schema.org/Product"
            >
              {/* Ad Image */}
              <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-600 to-indigo-600">
                {ad.image ? (
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                    itemProp="image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                    <Icon.Bullhorn />
                  </div>
                )}

                {ad.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-lg" aria-label="إعلان مميز">
                    <Icon.Star /> مميز
                  </div>
                )}
                {ad.is_urgent && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm shadow-lg" aria-label="إعلان عاجل">
                    عاجل
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 overflow-visible">

                {/* Title + Action Buttons */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <h1
                    className="text-2xl md:text-3xl font-bold leading-snug"
                    itemProp="name"
                  >
                    {ad.title}
                  </h1>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Like */}
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      aria-label={liked ? 'تم الإعجاب بالإعلان' : 'أعجبني هذا الإعلان'}
                      aria-pressed={liked}
                      className={`p-2 rounded-full transition ${liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Icon.Heart filled={liked} />
                    </motion.button>

                    {/* Save */}
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={handleSave}
                      aria-label={saved ? 'إزالة من المحفوظات' : 'حفظ الإعلان'}
                      aria-pressed={saved}
                      className={`p-2 rounded-full transition ${saved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}
                    >
                      <Icon.Bookmark filled={saved} />
                    </motion.button>

                    {/* Share */}
                    <div className="relative overflow-visible">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setShowShare(!showShare)}
                        aria-label="مشاركة الإعلان"
                        aria-expanded={showShare}
                        aria-haspopup="true"
                        className="p-2 rounded-full text-gray-400 hover:text-blue-600 transition"
                      >
                        <Icon.Share />
                      </motion.button>

                      {/* Share Dropdown */}
                      <AnimatePresence>
                        {showShare && (
                          <motion.div
                            role="dialog"
                            aria-label="خيارات المشاركة"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 z-[100] w-80 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <p className="font-bold text-gray-800 dark:text-white text-lg">مشاركة الإعلان</p>
                              <button
                                onClick={() => setShowShare(false)}
                                aria-label="إغلاق قائمة المشاركة"
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
                              >
                                <Icon.Close />
                              </button>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4">
                              {[
                                { key: 'whatsapp',  label: 'واتساب',   Icon: Icon.Whatsapp,    bg: 'bg-green-50 dark:bg-green-900/20',  onClick: () => handleShare('whatsapp') },
                                { key: 'facebook',  label: 'فيسبوك',   Icon: Icon.Facebook,    bg: 'bg-blue-50 dark:bg-blue-900/20',    onClick: () => handleShare('facebook') },
                                { key: 'twitter',   label: 'إكس',      Icon: Icon.Twitter,     bg: 'bg-gray-100 dark:bg-gray-700',      onClick: () => handleShare('twitter') },
                                { key: 'telegram',  label: 'تليجرام',  Icon: Icon.Telegram,    bg: 'bg-sky-50 dark:bg-sky-900/20',      onClick: () => handleShare('telegram') },
                                { key: 'instagram', label: 'انستجرام', Icon: Icon.Instagram,   bg: 'bg-pink-50 dark:bg-pink-900/20',    onClick: handleInstagramShare },
                                { key: 'email',     label: 'بريد',     Icon: Icon.Mail,        bg: 'bg-gray-50 dark:bg-gray-700',       onClick: () => handleShare('email') },
                                { key: 'copy',      label: copied ? 'تم النسخ' : 'نسخ', Icon: Icon.Copy, bg: 'bg-gray-50 dark:bg-gray-700', onClick: handleCopyLink },
                                { key: 'native',    label: 'مشاركة',   Icon: Icon.ShareNative, bg: 'bg-blue-50 border border-blue-200', onClick: handleNativeShare }
                              ].map(({ key, label, Icon: BtnIcon, bg, onClick }) => (
                                <button
                                  key={key}
                                  onClick={onClick}
                                  aria-label={`مشاركة عبر ${label}`}
                                  className={`flex flex-col items-center gap-1.5 p-2 ${bg} rounded-xl hover:opacity-80 transition`}
                                >
                                  <BtnIcon />
                                  <span className="text-xs">{label}</span>
                                </button>
                              ))}
                            </div>

                            {/* Copy URL bar */}
                            <div className="pt-4 border-t">
                              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <input
                                  type="text"
                                  value={typeof window !== 'undefined' ? window.location.href : ''}
                                  readOnly
                                  aria-label="رابط الإعلان"
                                  className="flex-1 bg-transparent text-xs outline-none text-gray-600 dark:text-gray-300 min-w-0"
                                />
                                <button
                                  onClick={handleCopyLink}
                                  aria-label="نسخ الرابط"
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs whitespace-nowrap hover:bg-blue-700 transition flex items-center gap-1"
                                >
                                  <Icon.Link />
                                  {copied ? 'تم النسخ' : 'نسخ'}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Meta Tags */}
                <div
                  className="flex flex-wrap gap-3 mb-6 pb-6 border-b"
                  aria-label="معلومات الإعلان"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 rounded-full text-sm">
                    {getCategoryName(ad.category)}
                  </span>
                  {ad.city && (
                    <span className="flex items-center gap-1 text-sm text-gray-500" itemProp="availableAtOrFrom">
                      <Icon.Location />
                      <span itemProp="name">{ad.city}</span>
                    </span>
                  )}
                  <time
                    dateTime={ad.created_at}
                    className="flex items-center gap-1 text-sm text-gray-500"
                    itemProp="validFrom"
                  >
                    <Icon.Calendar />
                    {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                  </time>
                  <span className="flex items-center gap-1 text-sm text-gray-500" aria-label={`${ad.views_count || 0} مشاهدة`}>
                    <Icon.Eye />
                    {ad.views_count || 0} مشاهدة
                  </span>
                </div>

                {/* Description */}
                <section aria-labelledby="ad-description-heading" className="mb-6">
                  <h2 id="ad-description-heading" className="text-xl font-bold mb-3">وصف الإعلان</h2>
                  <p
                    className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                    itemProp="description"
                  >
                    {ad.description}
                  </p>
                </section>

                {/* Price */}
                {ad.price && (
                  <div
                    className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200"
                    itemScope
                    itemType="https://schema.org/Offer"
                    itemProp="offers"
                  >
                    <div className="flex items-center gap-3 text-green-700">
                      <Icon.Dollar />
                      <span
                        className="font-bold text-2xl"
                        itemProp="price"
                        content={ad.price}
                      >
                        {ad.price} $
                      </span>
                      <meta itemProp="priceCurrency" content="USD" />
                      {ad.price_type === 'negotiable' && (
                        <span className="text-sm bg-green-200 dark:bg-green-800 px-3 py-1 rounded-full">
                          قابل للتفاوض
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Related Ads */}
                {relatedAds.length > 0 && (
                  <aside aria-labelledby="related-heading" className="mt-8 pt-6 border-t">
                    <h3 id="related-heading" className="text-lg font-bold mb-4">إعلانات مشابهة</h3>
                    <ul className="grid grid-cols-3 gap-3 list-none p-0 m-0" role="list">
                      {relatedAds.slice(0, 3).map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/ads/${item.slug}`}
                            aria-label={`${item.title}${item.price ? ' - ' + item.price + ' $' : ''}`}
                          >
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                              <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                              {item.price && (
                                <p className="text-blue-600 text-xs mt-1">{item.price} $</p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </motion.article>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1" aria-label="معلومات الناشر والتواصل">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                itemScope
                itemType="https://schema.org/Person"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon.User />
                  معلومات الناشر
                </h2>

                {/* Publisher Avatar */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
                    aria-hidden="true"
                  >
                    {ad.contact_name?.charAt(0)?.toUpperCase() || 'م'}
                  </div>
                  <div>
                    <p className="font-semibold" itemProp="name">
                      {ad.contact_name || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Icon.Clock />
                      نُشر في <time dateTime={ad.created_at}>{new Date(ad.created_at).toLocaleDateString('ar-EG')}</time>
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3" role="group" aria-label="خيارات التواصل">
                  {ad.contact_phone && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handlePhoneClick}
                      aria-label={showPhone ? `الاتصال على ${ad.contact_phone}` : 'إظهار رقم الهاتف'}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition"
                      itemProp="telephone"
                      content={ad.contact_phone}
                    >
                      <Icon.Phone />
                      {showPhone ? ad.contact_phone : 'إظهار رقم الهاتف'}
                    </motion.button>
                  )}

                  {ad.contact_whatsapp && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleWhatsappClick}
                      aria-label={showWhatsapp ? `فتح واتساب ${ad.contact_whatsapp}` : 'التواصل عبر واتساب'}
                      className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition"
                    >
                      <Icon.Whatsapp />
                      {showWhatsapp ? ad.contact_whatsapp : 'إرسال رسالة واتساب'}
                    </motion.button>
                  )}

                  {ad.contact_email && (
                    <a
                      href={`mailto:${ad.contact_email}`}
                      aria-label={`إرسال بريد إلكتروني إلى ${ad.contact_email}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition"
                      itemProp="email"
                      content={ad.contact_email}
                    >
                      <Icon.Mail />
                      إرسال بريد إلكتروني
                    </a>
                  )}
                </div>

                {/* Report */}
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowReport(true)}
                    aria-label="الإبلاغ عن هذا الإعلان كمخالف"
                    className="w-full text-red-600 hover:text-red-700 py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-red-50 transition"
                  >
                    <Icon.Flag />
                    الإبلاغ عن إعلان مخالف
                  </button>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* ── Report Modal ── */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            onClick={() => setShowReport(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 id="report-modal-title" className="text-xl font-bold flex items-center gap-2">
                  <span className="text-red-500"><Icon.Flag /></span>
                  الإبلاغ عن إعلان مخالف
                </h3>
                <button
                  onClick={() => setShowReport(false)}
                  aria-label="إغلاق نافذة الإبلاغ"
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <Icon.Close />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="report-reason" className="block mb-2 font-medium text-sm">
                    سبب الإبلاغ <span aria-hidden="true">*</span>
                    <span className="sr-only">(مطلوب)</span>
                  </label>
                  <select
                    id="report-reason"
                    value={reportData.reason}
                    onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                    required
                    aria-required="true"
                    className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="">اختر سبب الإبلاغ</option>
                    <option value="spam">بريد عشوائي / إعلان مزعج</option>
                    <option value="scam">احتيال أو نصب</option>
                    <option value="inappropriate">محتوى غير لائق</option>
                    <option value="duplicate">إعلان مكرر</option>
                    <option value="other">سبب آخر</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="report-description" className="block mb-2 font-medium text-sm">
                    تفاصيل إضافية
                  </label>
                  <textarea
                    id="report-description"
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    rows="3"
                    placeholder="أضف تفاصيل إضافية تساعدنا على مراجعة البلاغ..."
                    className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 resize-none focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleReport}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  إرسال البلاغ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}