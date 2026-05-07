'use client';
import { supabase } from '@/services/supabase';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaEdit, FaTrash, FaBullhorn, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaEye, FaDollarSign, FaStar, FaWhatsapp, FaImage } from 'react-icons/fa';
import Image from 'next/image';

export default function ViewAdPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAd = useCallback(async () => {
    const { data } = await supabase.from('classified_ads').select('*').eq('id', id).single();
    setAd(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) loadAd();
  }, [id, loadAd]);

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      await supabase.from('classified_ads').delete().eq('id', id);
      router.push('/admin/ads');
    }
  };

  const getCategoryName = (cat) => {
    const names = { jobs: 'وظائف', services: 'خدمات', products: 'منتجات', real_estate: 'عقارات', other: 'أخرى' };
    return names[cat] || cat;
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!ad) return <div className="text-center py-12"><h2 className="text-xl font-bold">الإعلان غير موجود</h2><Link href="/admin/ads" className="text-blue-600">العودة للإعلانات</Link></div>;

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/ads" className="text-blue-600 hover:underline flex items-center gap-2"><FaArrowRight size={14} /> العودة للإعلانات</Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
          {ad.image ? <Image src={ad.image} alt={ad.title} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FaBullhorn size={64} className="text-white/30" /></div>}
          {ad.is_featured && <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1"><FaStar size={12} /> مميز</div>}
          {ad.is_urgent && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm">عاجل</div>}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2"><FaBullhorn className="text-orange-500" /> {ad.title}</h1>
            <div className="flex gap-2">
              <Link href={`/admin/ads/${id}/edit`} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaEdit size={14} /> تعديل</Link>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTrash size={14} /> حذف</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b">
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">{getCategoryName(ad.category)}</span>
            {ad.city && <span className="flex items-center gap-1 text-sm text-gray-500"><FaMapMarkerAlt className="text-blue-500" />{ad.city}</span>}
            <span className="flex items-center gap-1 text-sm text-gray-500"><FaCalendar className="text-blue-500" />{new Date(ad.created_at).toLocaleDateString('ar-EG')}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><FaEye className="text-blue-500" />{ad.views_count || 0} مشاهدة</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">وصف الإعلان</h3>
              <p className="text-gray-600 whitespace-pre-line">{ad.description}</p>
              {ad.price && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700"><FaDollarSign size={20} /><span className="font-bold text-xl">{ad.price} $</span></div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">معلومات الناشر</h3>
              <p className="flex items-center gap-2 mb-2"><FaUser className="text-gray-400" /> {ad.contact_name}</p>
              {ad.contact_phone && <p className="flex items-center gap-2 mb-2"><FaPhone className="text-gray-400" /> {ad.contact_phone}</p>}
              {ad.contact_whatsapp && <p className="flex items-center gap-2 mb-2"><FaWhatsapp className="text-gray-400" /> {ad.contact_whatsapp}</p>}
              {ad.contact_email && <p className="flex items-center gap-2 mb-2"><FaEnvelope className="text-gray-400" /> {ad.contact_email}</p>}
              {ad.location && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {ad.location}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
