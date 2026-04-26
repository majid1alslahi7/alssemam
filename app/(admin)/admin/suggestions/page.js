'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { FaLightbulb, FaSearch, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';


export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSuggestions(); }, []);

  const loadSuggestions = async () => {
    try {
      const { data, error } = await supabase.from('suggestions').select('*').order('votes_count', { ascending: false });
      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('suggestions').update({ status }).eq('id', id);
    if (!error) loadSuggestions();
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div><div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><FaLightbulb className="text-indigo-500" /> الاقتراحات</h1><p className="text-gray-500 text-sm">إدارة اقتراحات العملاء</p></div>
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 dark:bg-gray-800 border-b"><tr><th className="px-6 py-4 text-right text-sm">العنوان</th><th className="px-6 py-4 text-right text-sm">المستخدم</th><th className="px-6 py-4 text-right text-sm">التصويتات</th><th className="px-6 py-4 text-right text-sm">الحالة</th><th className="px-6 py-4 text-right text-sm">التاريخ</th><th className="px-6 py-4 text-right text-sm">الإجراءات</th></tr></thead><tbody className="divide-y">{suggestions.map((suggestion) => (<tr key={suggestion.id}><td className="px-6 py-4 font-medium">{suggestion.title}</td><td className="px-6 py-4">{suggestion.user_name}</td><td className="px-6 py-4">{suggestion.votes_count || 0}</td><td className="px-6 py-4"><select value={suggestion.status} onChange={(e) => updateStatus(suggestion.id, e.target.value)} className="p-1 border rounded text-sm"><option value="pending">قيد الانتظار</option><option value="reviewed">تم المراجعة</option><option value="implemented">تم التنفيذ</option><option value="rejected">مرفوض</option></select></td><td className="px-6 py-4 text-sm">{new Date(suggestion.created_at).toLocaleDateString('ar-EG')}</td><td className="px-6 py-4"><Link href={`/admin/suggestions/${suggestion.id}/view`} className="text-blue-500"><FaEye /></Link></td></tr>))}</tbody></table></div></div></div>
  );
}
