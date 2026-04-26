'use client';
import { supabase } from '@/services/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaBullhorn, FaSearch, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';

export default function AdminAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const { data, error } = await supabase
        .from('classified_ads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const { error } = await supabase.from('classified_ads').delete().eq('id', id);
      if (error) {
        alert('خطأ في الحذف');
      } else {
        loadAds();
        alert('تم الحذف بنجاح');
      }
    }
  };

  const toggleFeature = async (id, current) => {
    const { error } = await supabase.from('classified_ads').update({ is_featured: !current }).eq('id', id);
    if (!error) loadAds();
  };

  const toggleStatus = async (id, current) => {
    const newStatus = current === 'active' ? 'expired' : 'active';
    const { error } = await supabase.from('classified_ads').update({ status: newStatus }).eq('id', id);
    if (!error) loadAds();
  };

  const filteredAds = ads.filter(ad =>
    ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (cat) => {
    const names = { jobs: 'وظائف', services: 'خدمات', products: 'منتجات', real_estate: 'عقارات', other: 'أخرى' };
    return names[cat] || cat;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBullhorn className="text-orange-500" />
            إدارة الإعلانات المبوبة
          </h1>
          <p className="text-gray-500 text-sm mt-1">إضافة وتعديل وحذف الإعلانات</p>
        </div>
        <Link href="/admin/ads/new" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md">
          <FaPlus size={14} /> إعلان جديد
        </Link>
      </div>

      {/* بحث */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن إعلان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* جدول الإعلانات */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold">العنوان</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">المعلن</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">المدينة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">مميز</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAds.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">لا توجد إعلانات</td></tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4 font-medium">{ad.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{getCategoryName(ad.category)}</span>
                    </td>
                    <td className="px-6 py-4">{ad.contact_name}</td>
                    <td className="px-6 py-4">
                      {ad.city && <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} className="text-gray-400" />{ad.city}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleFeature(ad.id, ad.is_featured)}>
                        {ad.is_featured ? <FaStar className="text-yellow-500" /> : <FaStar className="text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(ad.id, ad.status)}>
                        {ad.status === 'active' ? (
                          <span className="text-green-600 flex items-center gap-1"><FaCheckCircle size={12} /> نشط</span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1"><FaTimesCircle size={12} /> منتهي</span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link href={`/admin/ads/${ad.id}/view`} className="text-blue-500 hover:text-blue-600 transition" title="عرض"><FaEye size={16} /></Link>
                        <Link href={`/admin/ads/${ad.id}/edit`} className="text-green-500 hover:text-green-600 transition" title="تعديل"><FaEdit size={16} /></Link>
                        <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:text-red-600 transition" title="حذف"><FaTrash size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
