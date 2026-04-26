'use client';
import { supabase } from '@/services/supabase';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaEnvelope, FaSignInAlt, FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email === 'admin@alssemam.com' && password === 'admin123') {
      localStorage.setItem('admin_token', 'dummy_token');
      router.push('/admin');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserShield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تسجيل الدخول</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">لوحة تحكم السَّمَام</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-semibold">البريد الإلكتروني</label>
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="admin@alssemam.com" required />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-semibold">كلمة المرور</label>
            <div className="relative">
              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 pl-12 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
              <FaLock size={14} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg">
            <FaSignInAlt size={16} /> {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>للاختبار: admin@alssemam.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
