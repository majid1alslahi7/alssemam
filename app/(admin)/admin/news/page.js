'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaNewspaper, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) alert('خطأ في الحذف');
      else { loadArticles(); alert('تم الحذف بنجاح'); }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    const { error } = await supabase.from('articles').update({ is_published: !currentStatus }).eq('id', id);
    if (error) alert('خطأ في تحديث الحالة');
    else loadArticles();
  };

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><FaNewspaper className="text-green-500" /> إدارة الأخبار والمقالات</h1><p className="text-gray-500 text-sm mt-1">إضافة وتعديل وحذف الأخبار والمقالات</p></div>
        <Link href="/admin/news/new" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"><FaPlus size={14} /> مقال جديد</Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-4 mb-6"><div className="relative"><FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="ابحث عن مقال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div></div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 dark:bg-gray-800 border-b"><tr><th className="px-6 py-4 text-right text-sm">العنوان</th><th className="px-6 py-4 text-right text-sm">التصنيف</th><th className="px-6 py-4 text-right text-sm">الكاتب</th><th className="px-6 py-4 text-right text-sm">الحالة</th><th className="px-6 py-4 text-right text-sm">التاريخ</th><th className="px-6 py-4 text-right text-sm">الإجراءات</th></tr></thead><tbody className="divide-y">{filteredArticles.map((article) => (<tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"><td className="px-6 py-4 font-medium">{article.title}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${article.category === 'news' ? 'bg-blue-100 text-blue-700' : article.category === 'article' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{article.category === 'news' ? 'أخبار' : article.category === 'article' ? 'مقال' : 'كتابة'}</span></td><td className="px-6 py-4">{article.author}</td><td className="px-6 py-4"><button onClick={() => togglePublish(article.id, article.is_published)}>{article.is_published ? <span className="flex items-center gap-1 text-green-600"><FaCheckCircle /> منشور</span> : <span className="flex items-center gap-1 text-red-600"><FaTimesCircle /> غير منشور</span>}</button></td><td className="px-6 py-4 text-sm">{new Date(article.created_at).toLocaleDateString('ar-EG')}</td><td className="px-6 py-4"><div className="flex gap-3"><Link href={`/admin/news/${article.id}/view`} className="text-blue-500"><FaEye /></Link><Link href={`/admin/news/${article.id}/edit`} className="text-green-500"><FaEdit /></Link><button onClick={() => handleDelete(article.id)} className="text-red-500"><FaTrash /></button></div></td></tr>))}</tbody></table></div></div>
    </div>
  );
}
