'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { FaEnvelope, FaSearch, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Loaded contacts:', data);
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status, read_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      alert('خطأ في تحديث الحالة');
    } else {
      loadContacts();
      alert('تم تحديث الحالة بنجاح');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaEnvelope className="text-yellow-500" />
          طلبات الاتصال
        </h1>
        <p className="text-gray-500 text-sm">إدارة طلبات العملاء</p>
        <p className="text-sm text-green-600 mt-1">📊 إجمالي الطلبات: {contacts.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold">الاسم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">البريد</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الخدمة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    لا توجد طلبات اتصال
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4 font-medium">{contact.name}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4">{contact.service || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status}
                        onChange={(e) => updateStatus(contact.id, e.target.value)}
                        className="p-1 border rounded text-sm"
                      >
                        <option value="pending">⏳ قيد الانتظار</option>
                        <option value="read">📖 مقروء</option>
                        <option value="replied">✓ تم الرد</option>
                        <option value="closed">🔒 مغلق</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(contact.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/contacts/${contact.id}/view`} className="text-blue-500 hover:text-blue-600">
                        <FaEye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
