'use client';
import { supabase } from '@/services/supabase';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getClassifiedAds } from '@/services/supabase';
import {
  FaSearch, FaMapMarkerAlt, FaCalendar, FaEye, FaStar,
  FaFilter, FaTimes, FaBriefcase, FaSearchLocation,
  FaTools, FaBox, FaHome, FaCalendarAlt, FaBullhorn,
  FaDollarSign, FaImage, FaChevronRight, FaFire
} from 'react-icons/fa';
import Image from 'next/image';

export default function ClassifiedAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    city: 'all'
  });
  const [featuredAds, setFeaturedAds] = useState([]);

  const categories = [
    { id: 'all', name: 'الكل', icon: <FaBullhorn size={16} />, color: 'from-blue-500 to-blue-600' },
    { id: 'jobs', name: 'وظائف', icon: <FaBriefcase size={16} />, color: 'from-green-500 to-green-600' },
    { id: 'lost', name: 'فقدان', icon: <FaSearchLocation size={16} />, color: 'from-red-500 to-red-600' },
    { id: 'services', name: 'خدمات', icon: <FaTools size={16} />, color: 'from-purple-500 to-purple-600' },
    { id: 'products', name: 'منتجات', icon: <FaBox size={16} />, color: 'from-orange-500 to-orange-600' },
    { id: 'real_estate', name: 'عقارات', icon: <FaHome size={16} />, color: 'from-yellow-500 to-yellow-600' },
    { id: 'events', name: 'فعاليات', icon: <FaCalendarAlt size={16} />, color: 'from-pink-500 to-pink-600' },
    { id: 'other', name: 'أخرى', icon: <FaBullhorn size={16} />, color: 'from-gray-500 to-gray-600' }
  ];

  const cities = ['الكل', 'صنعاء', 'عدن', 'تعز', 'الحديدة', 'المكلا', 'إب', 'ذمار', 'عن بعد'];

  useEffect(() => {
    loadAds();
  }, [filters]);

  const loadAds = async () => {
    try {
      const data = await getClassifiedAds(filters);
      const activeAds = data.filter(ad => ad.status === 'active');
      setAds(activeAds || []);
      
      // الإعلانات المميزة
      const featured = activeAds.filter(ad => ad.is_featured).slice(0, 3);
      setFeaturedAds(featured);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      jobs: 'from-green-500 to-green-600',
      lost: 'from-red-500 to-red-600',
      services: 'from-purple-500 to-purple-600',
      products: 'from-orange-500 to-orange-600',
      real_estate: 'from-yellow-500 to-yellow-600',
      events: 'from-pink-500 to-pink-600',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[category] || 'from-blue-500 to-blue-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      jobs: <FaBriefcase size={40} className="text-white/70" />,
      lost: <FaSearchLocation size={40} className="text-white/70" />,
      services: <FaTools size={40} className="text-white/70" />,
      products: <FaBox size={40} className="text-white/70" />,
      real_estate: <FaHome size={40} className="text-white/70" />,
      events: <FaCalendarAlt size={40} className="text-white/70" />,
      other: <FaBullhorn size={40} className="text-white/70" />
    };
    return icons[category] || <FaBullhorn size={40} className="text-white/70" />;
  };

  const getCategoryName = (category) => {
    const names = {
      jobs: 'وظائف', lost: 'فقدان', services: 'خدمات', products: 'منتجات',
      real_estate: 'عقارات', events: 'فعاليات', other: 'أخرى'
    };
    return names[category] || category;
  };

  const formatPrice = (price, priceType) => {
    if (!price) return null;
    if (priceType === 'negotiable') return `${price} $ (قابل للتفاوض)`;
    if (priceType === 'hourly') return `${price} $ / ساعة`;
    if (priceType === 'daily') return `${price} $ / يوم`;
    if (priceType === 'monthly') return `${price} $ / شهر`;
    return `${price} $`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 15 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <FaBullhorn size={56} className="text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">الإعلانات المبوبة</h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              وظائف، خدمات، منتجات، عقارات، إعلانات فقدان، وأكثر
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="currentColor" className="text-gray-50 dark:text-gray-900"/>
          </svg>
        </div>
      </section>

      {/* إعلانات مميزة */}
      {featuredAds.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                إعلانات مميزة
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredAds.map((ad, index) => (
                <Link key={ad.id} href={`/ads/${ad.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group"
                  >
                    <div className={`relative h-40 bg-gradient-to-r ${getCategoryColor(ad.category)}`}>
                      {ad.image ? (
                        <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getCategoryIcon(ad.category)}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaStar size={10} /> مميز
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1 line-clamp-1">{ad.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{ad.description}</p>
                      {ad.price && (
                        <p className="text-blue-600 font-bold mt-2">{formatPrice(ad.price, ad.price_type)}</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* شريط البحث والتصفية */}
      <section className="sticky top-16 z-30 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative max-w-md">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الإعلانات..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <FaFilter /> فلترة
                {showFilters && <FaChevronRight size={12} className="rotate-90" />}
              </motion.button>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">المدينة</label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900"
                    >
                      {cities.map(city => (
                        <option key={city} value={city === 'الكل' ? 'all' : city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* معرض الإعلانات */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {ads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">لا توجد إعلانات مطابقة</h3>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {ads.map((ad) => (
                <motion.div key={ad.id} variants={cardVariants}>
                  <Link href={`/ads/${ad.slug}`}>
                    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className={`relative h-44 bg-gradient-to-r ${getCategoryColor(ad.category)}`}>
                        {ad.image ? (
                          <Image
                            src={ad.image}
                            alt={ad.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getCategoryIcon(ad.category)}
                          </div>
                        )}
                        
                        {ad.is_featured && (
                          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <FaStar size={10} /> مميز
                          </div>
                        )}
                        
                        {ad.is_urgent && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                            عاجل
                          </div>
                        )}

                        <div className="absolute bottom-3 right-3">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {getCategoryName(ad.category)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition line-clamp-1">
                          {ad.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
                          {ad.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          {ad.city && (
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt size={10} className="text-blue-500" />
                              {ad.city}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaEye size={10} className="text-blue-500" />
                            {ad.views_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendar size={10} className="text-blue-500" />
                            {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        </div>

                        {ad.price && (
                          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-blue-600 font-bold text-lg">
                              {formatPrice(ad.price, ad.price_type)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
