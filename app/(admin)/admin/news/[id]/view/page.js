'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaArrowRight, FaCalendarAlt, FaUser, FaEye, FaEdit, FaTrash, FaNewspaper, FaCheckCircle, FaTimesCircle, FaImage } from 'react-icons/fa';
import Image from 'next/image';

export default function ViewArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadArticle(); }, [id]);

  const loadArticle = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) alert('خطأ في الحذف');
      else { alert('تم الحذف بنجاح'); router.push('/admin/news'); }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!article) return <div className="text-center py-12"><h2 className="text-xl font-bold">المقال غير موجود</h2><Link href="/admin/news" className="text-blue-600 mt-4 inline-block">العودة إلى المقالات</Link></div>;

  const categoryLabels = { news: 'أخبار', article: 'مقال تقني', writing: 'كتابة وإبداع' };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FaNewspaper className="text-green-500" /> تفاصيل المقال</h1>
          <p className="text-gray-500 text-sm mt-1">#{article.id} - {article.title}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/news/${id}/edit`} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><FaEdit size={14} /> تعديل</Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><FaTrash size={14} /> حذف</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {article.image && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
              <div className="relative w-full h-64 md:h-80">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>
            </div>
          )}
          {!article.image && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-8 text-center text-gray-400">
              <FaImage size={48} className="mx-auto mb-2" />
              <p>لا توجد صورة للمقال</p>
            </div>
          )}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 space-y-4">
              {article.excerpt && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-600 dark:text-gray-300 italic">{article.excerpt}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">المحتوى</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{article.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">معلومات المقال</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${article.category === 'news' ? 'bg-blue-100 text-blue-700' : article.category === 'article' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{categoryLabels[article.category]}</span>
              </div>
              <div className="flex items-center gap-2">{article.is_published ? <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> منشور</span> : <span className="text-red-600 flex items-center gap-1"><FaTimesCircle /> غير منشور</span>}</div>
              <div className="flex items-center gap-2"><FaUser size={14} className="text-gray-400" /><span>{article.author || 'السمام'}</span></div>
              <div className="flex items-center gap-2"><FaCalendarAlt size={14} className="text-gray-400" /><span>{new Date(article.created_at).toLocaleDateString('ar-EG')}</span></div>
              <div className="flex items-center gap-2"><FaEye size={14} className="text-gray-400" /><span>{article.views_count || 0} مشاهدة</span></div>
              <div className="pt-2"><Link href={`/news/${article.slug}`} target="_blank" className="text-blue-600 text-sm">/news/{article.slug}</Link></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/news" className="text-blue-600 hover:underline flex items-center gap-2"><FaArrowRight size={14} /> العودة إلى المقالات</Link>
      </div>
    </div>
  );
}
