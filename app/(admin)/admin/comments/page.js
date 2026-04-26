'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { FaComment, FaSearch, FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';


export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComments(); }, []);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase.from('comments').select('*, projects(title)').order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const approveComment = async (id) => {
    const { error } = await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    if (!error) loadComments();
  };

  const deleteComment = async (id) => {
    if (confirm('هل أنت متأكد؟')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) loadComments();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div><div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><FaComment className="text-pink-500" /> التعليقات</h1><p className="text-gray-500 text-sm">إدارة تعليقات المستخدمين</p></div>
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 dark:bg-gray-800 border-b"><tr><th className="px-6 py-4 text-right text-sm">المستخدم</th><th className="px-6 py-4 text-right text-sm">التعليق</th><th className="px-6 py-4 text-right text-sm">المشروع</th><th className="px-6 py-4 text-right text-sm">التقييم</th><th className="px-6 py-4 text-right text-sm">الحالة</th><th className="px-6 py-4 text-right text-sm">الإجراءات</th></tr></thead><tbody className="divide-y">{comments.map((comment) => (<tr key={comment.id}><td className="px-6 py-4">{comment.user_name}</td><td className="px-6 py-4 max-w-xs">{comment.content.substring(0, 100)}...</td><td className="px-6 py-4">{comment.projects?.title || '-'}</td><td className="px-6 py-4">{comment.rating ? `${comment.rating} ★` : '-'}</td><td className="px-6 py-4">{comment.is_approved ? <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> موافق</span> : <span className="text-yellow-600 flex items-center gap-1"><FaTimesCircle /> قيد المراجعة</span>}</td><td className="px-6 py-4"><div className="flex gap-2">{!comment.is_approved && <button onClick={() => approveComment(comment.id)} className="text-green-500"><FaCheckCircle /></button>}<button onClick={() => deleteComment(comment.id)} className="text-red-500"><FaTrash /></button></div></td></tr>))}</tbody></table></div></div></div>
  );
}
