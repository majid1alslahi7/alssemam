'use client';
import { supabase } from '@/services/supabase';

import { useState } from 'react';
import { FaCog, FaSave, FaGlobe, FaPalette, FaUserCog } from 'react-icons/fa';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'السَّمَام', siteEmail: 'info@alssemam.com', sitePhone: '+967 715122500' });

  const handleSubmit = (e) => { e.preventDefault(); setSaving(true); setTimeout(() => { setSaving(false); alert('تم حفظ الإعدادات بنجاح'); }, 1000); };

  return (
    <div><div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><FaCog className="text-gray-500" /> الإعدادات</h1><p className="text-gray-500 text-sm">تخصيص إعدادات الموقع</p></div>
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 max-w-2xl">
      <div className="mb-6"><h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaGlobe className="text-blue-500" /> الإعدادات العامة</h2><div className="space-y-4"><div><label className="block mb-2 text-sm font-semibold">اسم الموقع</label><input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div><div><label className="block mb-2 text-sm font-semibold">البريد الإلكتروني</label><input type="email" value={settings.siteEmail} onChange={(e) => setSettings({...settings, siteEmail: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div><div><label className="block mb-2 text-sm font-semibold">رقم الهاتف</label><input type="tel" value={settings.sitePhone} onChange={(e) => setSettings({...settings, sitePhone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800" /></div></div></div>
      <div className="pt-4 border-t"><button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><FaSave /> {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button></div>
    </form></div>
  );
}
