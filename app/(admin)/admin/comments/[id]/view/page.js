'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaArrowRight, FaUser, FaStar, FaCalendar, FaComment, FaCheckCircle, FaThumbsUp } from 'react-icons/fa';

export default function ViewCommentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [comment, setComment] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadComment();
  }, [id]);

  const loadComment = async () => {
    try {
      const { data, error } = await supabase.from('comments').select('*').eq('id', id).single();
      if (error) throw error;
      setComment(data);
      if (data.project_id) {
        const { data: proj } = await supabase.from('projects').select('title').eq('id', data.project_id).single();
        setProject(proj);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async () => {
    const { error } = await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    if (error) {
      alert('خطأ في الموافقة');
    } else {
      loadComment();
      alert('تم الموافقة على التعليق');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!comment) {
    return <div className="text-center py-12"><h2 className="text-xl font-bold">التعليق غير موجود</h2><Link href="/admin/comments" className="text-blue-600 mt-4 inline-block">العودة إلى التعليقات</Link></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaComment className="text-pink-500" />
          تفاصيل التعليق
        </h1>
        <p className="text-gray-500 text-sm mt-1">#{comment.id}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                {comment.user_name?.charAt(0) || 'م'}
              </div>
              <div>
                <p className="font-semibold text-lg">{comment.user_name}</p>
                <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('ar-EG')}</p>
              </div>
            </div>
            {!comment.is_approved && (
              <button onClick={approveComment} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition">
                <FaCheckCircle size={14} /> الموافقة على التعليق
              </button>
            )}
          </div>

          {comment.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < comment.rating ? 'text-yellow-500' : 'text-gray-300'} size={16} />
              ))}
              <span className="text-sm text-gray-500 mr-2">({comment.rating} نجوم)</span>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="whitespace-pre-line">{comment.content}</p>
          </div>

          {project && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📌 على مشروع:</span>
              <Link href={`/admin/projects/${comment.project_id}/view`} className="text-blue-600 hover:underline">
                {project.title}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaThumbsUp size={14} />
            <span>{comment.likes_count || 0} إعجاب</span>
          </div>

          <div className={`inline-flex px-3 py-1 rounded-full text-sm ${comment.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {comment.is_approved ? 'موافق عليه' : 'قيد المراجعة'}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/comments" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowRight size={14} /> العودة إلى التعليقات
        </Link>
      </div>
    </div>
  );
}
