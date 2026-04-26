'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaProjectDiagram, FaSearch } from 'react-icons/fa';


export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        alert('خطأ في الحذف');
      } else {
        loadProjects();
        alert('تم الحذف بنجاح');
      }
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <FaProjectDiagram className="text-purple-500" />
            إدارة المشاريع
          </h1>
          <p className="text-gray-500 text-sm mt-1">إضافة وتعديل وحذف المشاريع</p>
        </div>
        <Link href="/admin/projects/new" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md">
          <FaPlus size={14} /> مشروع جديد
        </Link>
      </div>

      {/* بحث */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن مشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* جدول المشاريع */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold">العنوان</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">مميز</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">المشاهدات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium">{project.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${project.category === 'web' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {project.category === 'web' ? 'تطوير مواقع' : 'تطبيقات موبايل'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{project.featured ? <FaStar className="text-yellow-500" /> : '-'}</td>
                  <td className="px-6 py-4">{project.views_count || 0}</td>
                  <td className="px-6 py-4 text-sm">{new Date(project.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/projects/${project.id}/view`} className="text-blue-500 hover:text-blue-600 transition" title="عرض">
                        <FaEye size={16} />
                      </Link>
                      <Link href={`/admin/projects/${project.id}/edit`} className="text-green-500 hover:text-green-600 transition" title="تعديل">
                        <FaEdit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-600 transition" title="حذف">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
