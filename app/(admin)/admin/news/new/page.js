'use client';
import { supabase } from '@/services/supabase';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FaSave, FaTimes, FaNewspaper, FaUpload, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function NewArticlePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'news',
    excerpt: '',
    content: '',
    author: 'السمام',
    is_published: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (e.target.name === 'title') {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 100);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `articles/${fileName}`;
    
    const { error } = await supabase.storage.from('projects').upload(filePath, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const articleData = {
        ...formData,
        image: imageUrl,
        published_at: formData.is_published ? new Date().toISOString() : null
      };

      const { error } = await supabase.from('articles').insert([articleData]);
      if (error) throw error;
      alert('تم إضافة المقال بنجاح');
      router.push('/admin/news');
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ في إضافة المقال');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaNewspaper className="text-green-500" />
          إضافة مقال جديد
        </h1>
        <p className="text-gray-500 text-sm mt-1">أضف خبراً أو مقالاً جديداً</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 space-y-5 max-w-3xl">
        <div>
          <label className="block mb-2 font-semibold">العنوان *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">التصنيف *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800">
              <option value="news">أخبار</option>
              <option value="article">مقال تقني</option>
              <option value="writing">كتابة وإبداع</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">الكاتب</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">ملخص قصير</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none" placeholder="ملخص قصير للمقال (يظهر في البطاقة)" />
        </div>

        <div>
          <label className="block mb-2 font-semibold">المحتوى *</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="10" required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none" placeholder="اكتب محتوى المقال هنا..." />
        </div>

        <div>
          <label className="block mb-2 font-semibold">صورة المقال</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                  <FaTrash size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                <FaUpload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">اختر صورة للمقال</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4" />
            نشر مباشرة
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center gap-2">
            <FaSave size={16} /> {submitting ? 'جاري النشر...' : 'نشر المقال'}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
            <FaTimes size={16} /> إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
