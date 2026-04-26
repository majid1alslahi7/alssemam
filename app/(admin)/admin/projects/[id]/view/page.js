'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaArrowRight, FaStar, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import Image from 'next/image';

export default function ViewProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error) throw error;
      setProject(data);
      setActiveImage(data.primary_image);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        alert('خطأ في الحذف');
      } else {
        alert('تم الحذف بنجاح');
        router.push('/admin/projects');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">المشروع غير موجود</h2>
        <Link href="/admin/projects" className="text-blue-600 mt-4 inline-block">
          العودة إلى المشاريع
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-gray-500 text-sm mt-1">تفاصيل المشروع</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/projects/${id}/edit`} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition">
            <FaEdit size={14} /> تعديل
          </Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 transition">
            <FaTrash size={14} /> حذف
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold">معرض الصور</h3>
            </div>
            <div className="p-4">
              {activeImage && (
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
                  <Image src={activeImage} alt={project.title} fill className="object-cover" />
                </div>
              )}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {project.screenshots.map((url, index) => (
                    <div
                      key={index}
                      className={`relative h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${activeImage === url ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setActiveImage(url)}
                    >
                      <Image src={url} alt={`Screenshot ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {!project.primary_image && !project.screenshots?.length && (
                <div className="text-center py-8 text-gray-400">
                  <FaImage size={48} className="mx-auto mb-2" />
                  <p>لا توجد صور للمشروع</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">الوصف القصير</h3>
                <p className="text-gray-600 dark:text-gray-300">{project.short_description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">الوصف الكامل</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{project.long_description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">معلومات المشروع</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">التصنيف</span>
                <span className="font-medium">{project.category === 'web' ? 'تطوير مواقع' : 'تطبيقات موبايل'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">مميز</span>
                <span>{project.featured ? <FaStar className="text-yellow-500 inline" /> : 'لا'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المشاهدات</span>
                <span>{project.views_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ الإضافة</span>
                <span>{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الرابط</span>
                <Link href={`/project/${project.slug}`} target="_blank" className="text-blue-600 text-sm">
                  /project/{project.slug}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/projects" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowRight size={14} /> العودة إلى المشاريع
        </Link>
      </div>
    </div>
  );
}
