'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaArrowRight, FaUser, FaCalendar, FaLightbulb, FaThumbsUp, FaReply } from 'react-icons/fa';

export default function ViewSuggestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadSuggestion();
  }, [id]);

  const loadSuggestion = async () => {
    try {
      const { data, error } = await supabase.from('suggestions').select('*').eq('id', id).single();
      if (error) throw error;
      setSuggestion(data);
      setReplyText(data.admin_reply || '');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    const { error } = await supabase.from('suggestions').update({ status }).eq('id', id);
    if (error) {
      alert('خطأ في تحديث الحالة');
    } else {
      loadSuggestion();
      alert('تم تحديث الحالة بنجاح');
    }
  };

  const submitReply = async () => {
    setSubmitting(true);
    const { error } = await supabase.from('suggestions').update({ admin_reply: replyText, replied_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      alert('خطأ في إرسال الرد');
    } else {
      alert('تم إرسال الرد بنجاح');
      loadSuggestion();
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!suggestion) {
    return <div className="text-center py-12"><h2 className="text-xl font-bold">الاقتراح غير موجود</h2><Link href="/admin/suggestions" className="text-blue-600 mt-4 inline-block">العودة إلى الاقتراحات</Link></div>;
  }

  const categoryLabels = {
    feature: 'ميزة جديدة',
    improvement: 'تحسين',
    bug: 'خطأ',
    other: 'أخرى'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    implemented: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    reviewed: 'تم المراجعة',
    implemented: 'تم التنفيذ',
    rejected: 'مرفوض'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaLightbulb className="text-indigo-500" />
            تفاصيل الاقتراح
          </h1>
          <p className="text-gray-500 text-sm mt-1">#{suggestion.id} - {suggestion.title}</p>
        </div>
        <select
          value={suggestion.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
        >
          <option value="pending">قيد الانتظار</option>
          <option value="reviewed">تم المراجعة</option>
          <option value="implemented">تم التنفيذ</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {suggestion.user_name?.charAt(0) || 'م'}
                </div>
                <div>
                  <p className="font-semibold">{suggestion.user_name}</p>
                  <p className="text-xs text-gray-400">{new Date(suggestion.created_at).toLocaleString('ar-EG')}</p>
                </div>
              </div>

              <div>
                <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  {categoryLabels[suggestion.category] || suggestion.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{suggestion.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{suggestion.content}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaThumbsUp size={14} />
                <span>{suggestion.votes_count || 0} صوت</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaReply size={16} className="text-blue-500" />
              رد المسؤول
            </h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="6"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="اكتب ردك هنا..."
            />
            <button
              onClick={submitReply}
              disabled={submitting}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الرد'}
            </button>

            {suggestion.admin_reply && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400 mb-2">آخر رد: {new Date(suggestion.replied_at).toLocaleString('ar-EG')}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm">{suggestion.admin_reply}</p>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm ${statusColors[suggestion.status]}`}>
                {statusLabels[suggestion.status]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/suggestions" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowRight size={14} /> العودة إلى الاقتراحات
        </Link>
      </div>
    </div>
  );
}
