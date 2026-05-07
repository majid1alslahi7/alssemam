'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('admin_token');
    const isLoginPage = pathname === '/admin/login';
    if (!token && !isLoginPage) router.push('/admin/login');
    if (token && isLoginPage) router.push('/admin');
  }, [pathname, mounted, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* شريط علوي بسيط جداً */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-blue-600">لوحة التحكم</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('ar-EG')}</span>
            <button 
              onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }} 
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>
      
      {/* المحتوى فقط - بدون قائمة جانبية */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
