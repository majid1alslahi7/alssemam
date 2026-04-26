'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaArrowRight, FaUser, FaEnvelope, FaPhone, FaCalendar, FaComment, FaCheckCircle, FaEdit } from 'react-icons/fa';

export default function ViewContactPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      const { data, error } = await supabase.from('contact_requests').select('*').eq('id', id).single();
      if (error) throw error;
      setContact(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    const { error } = await supabase.from('contact_requests').update({ status, read_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      alert('خطأ في تحديث الحالة');
    } else {
      loadContact();
      alert('تم تحديث الحالة بنجاح');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!contact) {
    return <div className="text-center py-12"><h2 className="text-xl font-bold">الطلب غير موجود</h2><Link href="/admin/contacts" className="text-blue-600 mt-4 inline-block">العودة إلى الطلبات</Link></div>;
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    read: 'مقروء',
    replied: 'تم الرد',
    closed: 'مغلق'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaEnvelope className="text-yellow-500" />
            تفاصيل طلب الاتصال
          </h1>
          <p className="text-gray-500 text-sm mt-1">#{contact.id} - {contact.name}</p>
        </div>
        <div className="flex gap-3">
          <select
            value={contact.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
          >
            <option value="pending">قيد الانتظار</option>
            <option value="read">مقروء</option>
            <option value="replied">تم الرد</option>
            <option value="closed">مغلق</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FaUser className="text-blue-500" size={20} />
              <div>
                <p className="text-xs text-gray-500">الاسم</p>
                <p className="font-semibold">{contact.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FaEnvelope className="text-blue-500" size={20} />
              <div>
                <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                <p className="font-semibold">{contact.email}</p>
              </div>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <FaPhone className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-gray-500">رقم الجوال</p>
                  <p className="font-semibold">{contact.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FaCalendar className="text-blue-500" size={20} />
              <div>
                <p className="text-xs text-gray-500">تاريخ الإرسال</p>
                <p className="font-semibold">{new Date(contact.created_at).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">الخدمة المطلوبة</label>
            <p className="font-semibold">{contact.service || 'غير محدد'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">الرسالة</label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="whitespace-pre-line">{contact.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <div className={`px-3 py-1 rounded-full text-sm ${statusColors[contact.status]}`}>
              {statusLabels[contact.status]}
            </div>
            {contact.read_at && (
              <span className="text-xs text-gray-400">قرأ في: {new Date(contact.read_at).toLocaleString('ar-EG')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/admin/contacts" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowRight size={14} /> العودة إلى الطلبات
        </Link>
      </div>
    </div>
  );
}
