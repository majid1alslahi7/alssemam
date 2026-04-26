'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/services/supabase';
import {
  FaMapMarkerAlt, FaCalendar, FaEye, FaPhone, FaWhatsapp,
  FaEnvelope, FaFlag, FaShareAlt, FaArrowRight, FaUser,
  FaDollarSign, FaBullhorn, FaStar, FaTimes, FaImage,
  FaClock, FaCheckCircle, FaCopy, FaHeart, FaBookmark,
  FaFacebookF, FaTelegram, FaInstagram, FaLink, FaShare
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function AdDetailsPage() {
  const { slug } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportData, setReportData] = useState({ reason: '', description: '' });
  const [showPhone, setShowPhone] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [relatedAds, setRelatedAds] = useState([]);

  useEffect(() => {
    if (slug) loadAd();
  }, [slug]);

  const loadAd = async () => {
    try {
      const { data, error } = await supabase.from('classified_ads').select('*').eq('slug', slug).single();
      if (error) throw error;
      setAd(data);
      
      const likedAds = JSON.parse(localStorage.getItem('likedAds') || '[]');
      if (likedAds.includes(data.id)) setLiked(true);
      const savedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
      if (savedAds.includes(data.id)) setSaved(true);
      
      await supabase.from('classified_ads').update({ views_count: (data.views_count || 0) + 1 }).eq('id', data.id);
      
      const { data: related } = await supabase.from('classified_ads').select('*').eq('category', data.category).eq('status', 'active').neq('id', data.id).limit(3);
      setRelatedAds(related || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (liked) { toast.success('لقد أعجبت بهذا الإعلان مسبقاً'); return; }
    setLiked(true);
    const likedAds = JSON.parse(localStorage.getItem('likedAds') || '[]');
    if (!likedAds.includes(ad.id)) { likedAds.push(ad.id); localStorage.setItem('likedAds', JSON.stringify(likedAds)); }
    toast.success('شكراً لإعجابك بالإعلان!');
  };

  const handleSave = () => {
    if (saved) {
      setSaved(false);
      const savedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
      localStorage.setItem('savedAds', JSON.stringify(savedAds.filter(id => id !== ad.id)));
      toast.success('تم إزالة الإعلان من المحفوظات');
    } else {
      setSaved(true);
      const savedAds = JSON.parse(localStorage.getItem('savedAds') || '[]');
      if (!savedAds.includes(ad.id)) { savedAds.push(ad.id); localStorage.setItem('savedAds', JSON.stringify(savedAds)); }
      toast.success('تم حفظ الإعلان');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: ad?.title, text: ad?.description?.substring(0, 100), url: window.location.href });
        toast.success('تمت المشاركة بنجاح');
        setShowShare(false);
      } catch (err) {
        if (err.name !== 'AbortError') toast.error('تعذرت المشاركة');
      }
    } else {
      handleCopyLink();
      toast.success('تم نسخ الرابط، يمكنك مشاركته الآن');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('تعذر نسخ الرابط'));
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = ad?.title || 'إعلان';
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`; break;
      case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShare(false);
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.success('تم نسخ الرابط! الصقه في انستجرام');
    setShowShare(false);
  };

  const handlePhoneClick = async () => {
    setShowPhone(true);
    await supabase.from('classified_ads').update({ phone_clicks: (ad.phone_clicks || 0) + 1 }).eq('id', ad.id);
    window.location.href = `tel:${ad.contact_phone}`;
  };

  const handleWhatsappClick = async () => {
    setShowWhatsapp(true);
    await supabase.from('classified_ads').update({ whatsapp_clicks: (ad.whatsapp_clicks || 0) + 1 }).eq('id', ad.id);
    window.open(`https://wa.me/${ad.contact_whatsapp?.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleReport = async () => {
    if (!reportData.reason) { toast.error('الرجاء اختيار سبب الإبلاغ'); return; }
    try {
      await supabase.from('ad_reports').insert([{ ad_id: ad.id, reason: reportData.reason, description: reportData.description }]);
      toast.success('تم إرسال البلاغ بنجاح');
      setShowReport(false);
    } catch (error) {
      toast.error('حدث خطأ في إرسال البلاغ');
    }
  };

  const getCategoryName = (cat) => {
    const names = { jobs: 'وظائف', lost: 'فقدان', services: 'خدمات', products: 'منتجات', real_estate: 'عقارات', events: 'فعاليات', other: 'أخرى' };
    return names[cat] || cat;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  if (!ad) return <div className="pt-32 text-center min-h-screen"><h1 className="text-2xl font-bold">الإعلان غير موجود</h1><Link href="/ads" className="text-blue-600">العودة إلى الإعلانات</Link></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/ads" className="text-blue-600 hover:underline inline-flex items-center gap-2"><FaArrowRight size={14} />العودة إلى الإعلانات</Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-600 to-indigo-600">
                {ad.image ? <Image src={ad.image} alt={ad.title} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FaBullhorn size={80} className="text-white/30" /></div>}
                {ad.is_featured && <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-lg"><FaStar size={12} />مميز</div>}
                {ad.is_urgent && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm shadow-lg">عاجل</div>}
              </div>

              <div className="p-6 md:p-8 overflow-visible">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold">{ad.title}</h1>
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLike} className={`p-2 rounded-full ${liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}><FaHeart size={20} /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave} className={`p-2 rounded-full ${saved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}><FaBookmark size={20} /></motion.button>
                    <div className="relative overflow-visible">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowShare(!showShare)} className="p-2 rounded-full text-gray-400 hover:text-blue-600"><FaShareAlt size={20} /></motion.button>
                      <AnimatePresence>
                        {showShare && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 z-[100] w-[360px] border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4"><p className="font-bold text-gray-800 dark:text-white text-lg">مشاركة الإعلان</p><button onClick={() => setShowShare(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500"><FaTimes size={14} /></button></div>
                            <div className="grid grid-cols-4 gap-3 mb-4">
                              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-1.5 p-2 bg-green-50 dark:bg-green-900/20 rounded-xl"><FaWhatsapp className="text-green-500 text-2xl" /><span className="text-xs">واتساب</span></button>
                              <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><FaFacebookF className="text-blue-600 text-2xl" /><span className="text-xs">فيسبوك</span></button>
                              <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 dark:bg-gray-700 rounded-xl"><FaXTwitter className="text-gray-800 dark:text-white text-2xl" /><span className="text-xs">إكس</span></button>
                              <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-1.5 p-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl"><FaTelegram className="text-sky-500 text-2xl" /><span className="text-xs">تليجرام</span></button>
                              <button onClick={handleInstagramShare} className="flex flex-col items-center gap-1.5 p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl"><FaInstagram className="text-pink-500 text-2xl" /><span className="text-xs">انستجرام</span></button>
                              <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"><FaEnvelope className="text-gray-500 text-2xl" /><span className="text-xs">بريد</span></button>
                              <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"><FaCopy className="text-gray-500 text-2xl" /><span className="text-xs">{copied ? 'تم النسخ' : 'نسخ'}</span></button>
                              <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5 p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"><FaShare className="text-blue-600 text-2xl" /><span className="text-xs text-blue-600">مشاركة</span></button>
                            </div>
                            <div className="pt-4 border-t"><div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"><input type="text" value={typeof window !== 'undefined' ? window.location.href : ''} readOnly className="flex-1 bg-transparent text-sm outline-none" /><button onClick={handleCopyLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><FaLink size={12} />{copied ? 'تم النسخ' : 'نسخ'}</button></div></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b">
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 rounded-full text-sm">{getCategoryName(ad.category)}</span>
                  {ad.city && <span className="flex items-center gap-1 text-sm text-gray-500"><FaMapMarkerAlt className="text-blue-500" />{ad.city}</span>}
                  <span className="flex items-center gap-1 text-sm text-gray-500"><FaCalendar className="text-blue-500" />{new Date(ad.created_at).toLocaleDateString('ar-EG')}</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500"><FaEye className="text-blue-500" />{ad.views_count || 0}</span>
                </div>

                <div className="mb-6"><h2 className="text-xl font-bold mb-3">وصف الإعلان</h2><p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{ad.description}</p></div>

                {ad.price && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 text-green-700"><FaDollarSign size={24} /><span className="font-bold text-2xl">{ad.price} $</span>{ad.price_type === 'negotiable' && <span className="text-sm bg-green-200 dark:bg-green-800 px-3 py-1 rounded-full">قابل للتفاوض</span>}</div>
                  </div>
                )}

                {relatedAds.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-bold mb-4">إعلانات مشابهة</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {relatedAds.slice(0, 3).map((item) => (
                        <Link key={item.id} href={`/ads/${item.slug}`}><div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100"><p className="font-medium text-sm line-clamp-1">{item.title}</p>{item.price && <p className="text-blue-600 text-xs mt-1">{item.price} $</p>}</div></Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaUser className="text-blue-500" />معلومات الناشر</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">{ad.contact_name?.charAt(0) || 'م'}</div>
                  <div><p className="font-semibold">{ad.contact_name || 'مستخدم'}</p><p className="text-xs text-gray-500"><FaClock className="inline mr-1" size={10} />عضو منذ {new Date(ad.created_at).toLocaleDateString('ar-EG')}</p></div>
                </div>

                <div className="space-y-3">
                  {ad.contact_phone && <motion.button whileHover={{ scale: 1.02 }} onClick={handlePhoneClick} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"><FaPhone size={16} />{showPhone ? ad.contact_phone : 'إظهار رقم الهاتف'}</motion.button>}
                  {ad.contact_whatsapp && <motion.button whileHover={{ scale: 1.02 }} onClick={handleWhatsappClick} className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"><FaWhatsapp size={16} />{showWhatsapp ? ad.contact_whatsapp : 'إرسال واتساب'}</motion.button>}
                  {ad.contact_email && <a href={`mailto:${ad.contact_email}`} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"><FaEnvelope size={16} />إرسال بريد إلكتروني</a>}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button onClick={() => setShowReport(true)} className="w-full text-red-600 hover:text-red-700 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"><FaFlag size={14} />الإبلاغ عن إعلان مخالف</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReport(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><FaFlag className="text-red-500" />الإبلاغ عن إعلان مخالف</h3><button onClick={() => setShowReport(false)} className="text-gray-500"><FaTimes size={20} /></button></div>
              <div className="space-y-4">
                <div><label className="block mb-2">سبب الإبلاغ *</label><select value={reportData.reason} onChange={(e) => setReportData({...reportData, reason: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700"><option value="">اختر سبب الإبلاغ</option><option value="spam">بريد عشوائي</option><option value="scam">احتيال</option><option value="inappropriate">محتوى غير لائق</option><option value="duplicate">إعلان مكرر</option><option value="other">سبب آخر</option></select></div>
                <div><label className="block mb-2">تفاصيل إضافية</label><textarea value={reportData.description} onChange={(e) => setReportData({...reportData, description: e.target.value})} rows="3" className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 resize-none"></textarea></div>
                <button onClick={handleReport} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl">إرسال البلاغ</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
