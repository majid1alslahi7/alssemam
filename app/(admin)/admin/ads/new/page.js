'use client';
import { supabase } from '@/services/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes, FaBullhorn, FaUpload, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function NewAdPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'other', description: '', price: '', price_type: 'fixed',
    location: '', city: 'صنعاء', contact_name: '', contact_phone: '', contact_email: '', contact_whatsapp: '',
    is_featured: false, is_urgent: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = Date.now() + '-' + Math.random().toString(36).substring(2) + '.' + fileExt;
    const filePath = 'ads/' + fileName;
    await supabase.storage.from('projects').upload(filePath, file);
    const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 100);
      const { error } = await supabase.from('classified_ads').insert([{ ...formData, slug, image: imageUrl, status: 'active' }]);
      if (error) throw error;
      alert('تم إضافة الإعلان بنجاح'); router.push('/admin/ads');
    } catch (error) { alert('حدث خطأ في إضافة الإعلان'); } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><FaBullhorn className="text-orange-500" /> إضافة إعلان جديد</h1></div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 space-y-5 max-w-2xl">
        <div><label className="block mb-2 font-semibold">عنوان الإعلان *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div>
        <div><label className="block mb-2 font-semibold">التصنيف *</label><select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"><option value="jobs">وظائف</option><option value="services">خدمات</option><option value="products">منتجات</option><option value="real_estate">عقارات</option><option value="other">أخرى</option></select></div>
        <div><label className="block mb-2 font-semibold">الوصف *</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none" /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block mb-2">السعر</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div>
          <div><label className="block mb-2">المدينة</label><select name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"><option value="صنعاء">صنعاء</option><option value="عدن">عدن</option><option value="تعز">تعز</option></select></div>
        </div>
        <div><label className="block mb-2 font-semibold">صورة الإعلان</label><div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4">{imagePreview ? (<div className="relative w-full h-48 rounded-lg overflow-hidden"><Image src={imagePreview} alt="Preview" fill className="object-cover" /><button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><FaTrash size={14} /></button></div>) : (<label className="flex flex-col items-center justify-center cursor-pointer py-8"><FaUpload size={32} className="text-gray-400 mb-2" /><span className="text-sm text-gray-500">اختر صورة للإعلان</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label>)}</div></div>
        <div className="border-t pt-4"><h3 className="font-semibold mb-3">معلومات الاتصال</h3><div className="grid md:grid-cols-2 gap-4"><div><label className="block mb-2">الاسم *</label><input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div><div><label className="block mb-2">رقم الهاتف</label><input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div><div><label className="block mb-2">واتساب</label><input type="tel" name="contact_whatsapp" value={formData.contact_whatsapp} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div><div><label className="block mb-2">البريد</label><input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div></div></div>
        <div className="flex items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} /> مميز</label><label className="flex items-center gap-2"><input type="checkbox" name="is_urgent" checked={formData.is_urgent} onChange={handleChange} /> عاجل</label></div>
        <div className="flex gap-4 pt-4"><button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center gap-2"><FaSave size={16} /> {submitting ? 'جاري الإضافة...' : 'إضافة الإعلان'}</button><button type="button" onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><FaTimes size={16} /> إلغاء</button></div>
      </form>
    </div>
  );
}
