'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaNewspaper, FaBullhorn, FaEnvelope, FaComment, FaLightbulb, FaCog, FaEye, FaPlus, FaEdit } from 'react-icons/fa';

export default function AdminDashboardPage() {
  const cards = [
    {
      title: 'المشاريع',
      icon: <FaProjectDiagram size={32} />,
      color: 'from-purple-500 to-purple-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/projects', icon: <FaEye size={14} /> },
        { label: 'إضافة جديد', path: '/admin/projects/new', icon: <FaPlus size={14} /> }
      ]
    },
    {
      title: 'الأخبار والمقالات',
      icon: <FaNewspaper size={32} />,
      color: 'from-green-500 to-green-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/news', icon: <FaEye size={14} /> },
        { label: 'إضافة جديد', path: '/admin/news/new', icon: <FaPlus size={14} /> }
      ]
    },
    {
      title: 'الإعلانات المبوبة',
      icon: <FaBullhorn size={32} />,
      color: 'from-orange-500 to-orange-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/ads', icon: <FaEye size={14} /> },
        { label: 'إضافة جديد', path: '/admin/ads/new', icon: <FaPlus size={14} /> }
      ]
    },
    {
      title: 'طلبات الاتصال',
      icon: <FaEnvelope size={32} />,
      color: 'from-yellow-500 to-yellow-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/contacts', icon: <FaEye size={14} /> }
      ]
    },
    {
      title: 'التعليقات',
      icon: <FaComment size={32} />,
      color: 'from-pink-500 to-pink-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/comments', icon: <FaEye size={14} /> }
      ]
    },
    {
      title: 'الاقتراحات',
      icon: <FaLightbulb size={32} />,
      color: 'from-indigo-500 to-indigo-600',
      actions: [
        { label: 'عرض الكل', path: '/admin/suggestions', icon: <FaEye size={14} /> }
      ]
    },
    {
      title: 'الإعدادات',
      icon: <FaCog size={32} />,
      color: 'from-gray-500 to-gray-600',
      actions: [
        { label: 'تخصيص', path: '/admin/settings', icon: <FaEdit size={14} /> }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">مرحباً بك في لوحة إدارة السمام</p>
      </motion.div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
          الوصول السريع
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
            >
              <div className={`h-1.5 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-5">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-3">{card.title}</h3>
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {card.actions.map((action, idx) => (
                    <Link
                      key={idx}
                      href={action.path}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
