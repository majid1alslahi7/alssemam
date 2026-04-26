'use client';
import { supabase } from '@/services/supabase';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FaSave, FaTimes, FaProjectDiagram, FaUpload, FaTrash, FaPlus } from 'react-icons/fa';
import Image from 'next/image';

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', category: 'web', short_description: '',
    long_description: '', featured: false, status: 'completed',
    primary_image: '', screenshots: []
  });
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (e.target.name === 'title') {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 100);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPrimaryImageFile(file); setPrimaryPreview(URL.createObjectURL(file)); }
  };

  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files);
    setScreenshotFiles(prev => [...prev, ...files]);
    setScreenshotPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeScreenshot = (i) => {
    setScreenshotFiles(prev => prev.filter((_, idx) => idx !== i));
    setScreenshotPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const uploadImage = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = Date.now() + '-' + Math.random().toString(36).substring(2) + '.' + fileExt;
    const filePath = folder + '/' + fileName;
    await supabase.storage.from('projects').upload(filePath, file);
    const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      let primaryUrl = '', screenshotUrls = [];
      if (primaryImageFile) primaryUrl = await uploadImage(primaryImageFile, 'primary');
      if (screenshotFiles.length) screenshotUrls = await Promise.all(screenshotFiles.map(f => uploadImage(f, 'screenshots')));
      const { error } = await supabase.from('projects').insert([{ ...formData, primary_image: primaryUrl, screenshots: screenshotUrls }]);
      if (error) throw error;
      alert('تم إضافة المشروع بنجاح'); router.push('/admin/projects');
    } catch (error) { alert('حدث خطأ في إضافة المشروع'); } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><FaProjectDiagram className="text-purple-500" /> إضافة مشروع جديد</h1></div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 space-y-5 max-w-3xl">
        <div><label className="block mb-2 font-semibold">عنوان المشروع *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div>
        <div><label className="block mb-2 font-semibold">الرابط المختصر</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div>
        <div className="grid md:grid-cols-2 gap-4"><div><label className="block mb-2 font-semibold">التصنيف *</label><select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800"><option value="web">تطوير مواقع</option><option value="mobile">تطبيقات موبايل</option></select></div><div><label className="flex items-center gap-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> مشروع مميز</label></div></div>
        <div><label className="block mb-2 font-semibold">وصف قصير *</label><textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="3" required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none" /></div>
        <div><label className="block mb-2 font-semibold">وصف طويل *</label><textarea name="long_description" value={formData.long_description} onChange={handleChange} rows="6" required className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none" /></div>
        <div><label className="block mb-2 font-semibold">الصورة الرئيسية *</label><div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4">{primaryPreview ? (<div className="relative w-full h-48 rounded-lg overflow-hidden"><Image src={primaryPreview} alt="Preview" fill className="object-cover" /><button type="button" onClick={() => { setPrimaryImageFile(null); setPrimaryPreview(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><FaTrash size={14} /></button></div>) : (<label className="flex flex-col items-center justify-center cursor-pointer py-8"><FaUpload size={32} className="text-gray-400 mb-2" /><span className="text-sm text-gray-500">اختر صورة رئيسية</span><input type="file" accept="image/*" onChange={handlePrimaryImageChange} className="hidden" /></label>)}</div></div>
        <div><label className="block mb-2 font-semibold">صور الشاشة</label><div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4"><div className="grid grid-cols-3 gap-3 mb-3">{screenshotPreviews.map((preview, index) => (<div key={index} className="relative h-24 rounded-lg overflow-hidden"><Image src={preview} alt="Screenshot" fill className="object-cover" /><button type="button" onClick={() => removeScreenshot(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><FaTrash size={12} /></button></div>))}</div><label className="flex items-center justify-center gap-2 cursor-pointer py-4 border-t border-gray-200 dark:border-gray-700"><FaPlus size={16} className="text-gray-400" /><span className="text-sm text-gray-500">إضافة صور</span><input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="hidden" /></label></div></div>
        <div className="flex gap-4 pt-4"><button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center gap-2"><FaSave size={16} /> {submitting ? 'جاري الإضافة...' : 'إضافة المشروع'}</button><button type="button" onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><FaTimes size={16} /> إلغاء</button></div>
      </form>
    </div>
  );
}
