'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getClassifiedAds } from '@/services/supabase';
import {
  FaSearch, FaMapMarkerAlt, FaCalendar, FaEye, FaStar,
  FaFilter, FaBriefcase, FaSearchLocation, FaTools,
  FaBox, FaHome, FaCalendarAlt, FaBullhorn, FaChevronRight
} from 'react-icons/fa';
import Image from 'next/image';

/* ────────────────────────────────────────
   Static data — outside component
─────────────────────────────────────────*/
const CATEGORIES = [
  { id: 'all',        name: 'الكل',    color: 'from-blue-500 to-blue-600'   },
  { id: 'jobs',       name: 'وظائف',  color: 'from-green-500 to-green-600' },
  { id: 'lost',       name: 'فقدان',  color: 'from-red-500 to-red-600'     },
  { id: 'services',   name: 'خدمات',  color: 'from-purple-500 to-purple-600'},
  { id: 'products',   name: 'منتجات', color: 'from-orange-500 to-orange-600'},
  { id: 'real_estate',name: 'عقارات', color: 'from-yellow-500 to-yellow-600'},
  { id: 'events',     name: 'فعاليات',color: 'from-pink-500 to-pink-600'   },
  { id: 'other',      name: 'أخرى',   color: 'from-gray-500 to-gray-600'   }
];

const CITIES = ['الكل','صنعاء','عدن','تعز','الحديدة','المكلا','إب','ذمار','عن بعد'];

const CATEGORY_NAMES = {
  jobs:'وظائف', lost:'فقدان', services:'خدمات', products:'منتجات',
  real_estate:'عقارات', events:'فعاليات', other:'أخرى'
};

const CATEGORY_COLORS = {
  jobs:'from-green-500 to-green-600', lost:'from-red-500 to-red-600',
  services:'from-purple-500 to-purple-600', products:'from-orange-500 to-orange-600',
  real_estate:'from-yellow-500 to-yellow-600', events:'from-pink-500 to-pink-600',
  other:'from-gray-500 to-gray-600'
};

function getCategoryColor(cat) { return CATEGORY_COLORS[cat] || 'from-blue-500 to-blue-600'; }
function getCategoryName(cat)  { return CATEGORY_NAMES[cat]  || cat; }

function formatPrice(price, priceType) {
  if (!price) return null;
  if (priceType === 'negotiable') return `${price} $ (قابل للتفاوض)`;
  if (priceType === 'hourly')     return `${price} $ / ساعة`;
  if (priceType === 'daily')      return `${price} $ / يوم`;
  if (priceType === 'monthly')    return `${price} $ / شهر`;
  return `${price} $`;
}

/* SVG Icons — replacing react-icons for category thumbnails */
const CategorySVG = ({ cat, size = 40 }) => {
  const cls = `text-white/70`;
  const s   = size;
  switch (cat) {
    case 'jobs':        return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
    case 'lost':        return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
    case 'services':    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case 'products':    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case 'real_estate': return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'events':      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    default:            return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
  }
};

/* Animation Variants */
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────────*/
export default function ClassifiedAdsPage() {
  const [ads,          setAds]          = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showFilters,  setShowFilters]  = useState(false);
  const [featuredAds,  setFeaturedAds]  = useState([]);
  const [filters, setFilters] = useState({ category: 'all', search: '', city: 'all' });

  useEffect(() => { loadAds(); }, [filters]);

  const loadAds = async () => {
    try {
      const data = await getClassifiedAds(filters);
      const active   = (data || []).filter(ad => ad.status === 'active');
      setAds(active);
      setFeaturedAds(active.filter(ad => ad.is_featured).slice(0, 3));
    } catch (err) {
      console.error('Error loading ads:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading Skeleton ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        role="status"
        aria-label="جاري تحميل الإعلانات"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ── Hero ── */}
      <section
        aria-label="قسم الإعلانات المبوبة"
        className="relative pt-24 pb-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" aria-hidden="true">
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
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-center mb-4" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-200">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">الإعلانات المبوبة</h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              وظائف، خدمات، منتجات، عقارات، إعلانات فقدان، وأكثر في اليمن والسعودية
            </p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 120" fill="none">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
              fill="currentColor"
              className="text-gray-50 dark:text-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* ── Featured Ads ── */}
      {featuredAds.length > 0 && (
        <section aria-labelledby="featured-heading" className="py-8">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h2 id="featured-heading" className="text-2xl font-bold flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                إعلانات مميزة
              </h2>
            </motion.div>

            <ul className="grid md:grid-cols-3 gap-6 list-none p-0 m-0" role="list">
              {featuredAds.map((ad, index) => (
                <li key={ad.id}>
                  <Link
                    href={`/ads/${ad.slug}`}
                    aria-label={`إعلان مميز: ${ad.title}${ad.city ? ' - ' + ad.city : ''}`}
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                    >
                      <div className={`relative h-40 bg-gradient-to-r ${getCategoryColor(ad.category)}`}>
                        {ad.image ? (
                          <Image
                            src={ad.image}
                            alt={ad.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                            <CategorySVG cat={ad.category} size={40} />
                          </div>
                        )}
                        <div
                          className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          aria-label="إعلان مميز"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          مميز
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1 line-clamp-1 group-hover:text-blue-600 transition">{ad.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{ad.description}</p>
                        {ad.price && (
                          <p className="text-blue-600 font-bold mt-2" aria-label={`السعر: ${formatPrice(ad.price, ad.price_type)}`}>
                            {formatPrice(ad.price, ad.price_type)}
                          </p>
                        )}
                      </div>
                    </motion.article>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Search & Filters ── */}
      <section
        aria-label="البحث والتصفية"
        className="sticky top-16 z-30 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative max-w-md">
              <label htmlFor="ads-search" className="sr-only">ابحث في الإعلانات</label>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                id="ads-search"
                type="search"
                placeholder="ابحث في الإعلانات..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                autoComplete="off"
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="filters-panel"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                فلترة
              </motion.button>

              <label htmlFor="category-select" className="sr-only">اختر التصنيف</label>
              <select
                id="category-select"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                id="filters-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city-select" className="block text-sm mb-2 font-medium">المدينة</label>
                    <select
                      id="city-select"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900"
                    >
                      {CITIES.map(city => (
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

      {/* ── Ads Grid ── */}
      <section aria-labelledby="ads-grid-heading" className="py-12">
        <div className="container mx-auto px-4">
          <h2 id="ads-grid-heading" className="sr-only">
            {filters.category !== 'all' ? `إعلانات ${getCategoryName(filters.category)}` : 'جميع الإعلانات'}
          </h2>

          {ads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              role="status"
              aria-live="polite"
            >
              <svg
                width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="mx-auto text-gray-300 mb-4" aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-500">لا توجد إعلانات مطابقة لبحثك</h3>
              <p className="text-gray-400 mt-2 text-sm">حاول تغيير كلمات البحث أو التصنيف</p>
            </motion.div>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
              role="list"
              aria-live="polite"
              aria-label={`${ads.length} إعلان`}
            >
              {ads.map((ad) => (
                <motion.li key={ad.id} variants={cardVariants}>
                  <Link
                    href={`/ads/${ad.slug}`}
                    aria-label={`${ad.title}${ad.city ? ' في ' + ad.city : ''}${ad.price ? ' - ' + formatPrice(ad.price, ad.price_type) : ''}`}
                  >
                    <article className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">

                      {/* Card Image */}
                      <div className={`relative h-44 bg-gradient-to-r ${getCategoryColor(ad.category)}`}>
                        {ad.image ? (
                          <Image
                            src={ad.image}
                            alt={ad.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                            <CategorySVG cat={ad.category} size={40} />
                          </div>
                        )}

                        {ad.is_featured && (
                          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg" aria-label="إعلان مميز">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            مميز
                          </div>
                        )}

                        {ad.is_urgent && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg" aria-label="إعلان عاجل">
                            عاجل
                          </div>
                        )}

                        <div className="absolute bottom-3 right-3">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {getCategoryName(ad.category)}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition line-clamp-1">
                          {ad.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
                          {ad.description}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3" aria-label="معلومات الإعلان">
                          {ad.city && (
                            <span className="flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" aria-hidden="true">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                              <span>{ad.city}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1" aria-label={`${ad.views_count || 0} مشاهدة`}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" aria-hidden="true">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                            {ad.views_count || 0}
                          </span>
                          <time
                            dateTime={ad.created_at}
                            className="flex items-center gap-1"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" aria-hidden="true">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                          </time>
                        </div>

                        {/* Price */}
                        {ad.price && (
                          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-blue-600 font-bold text-lg" aria-label={`السعر: ${formatPrice(ad.price, ad.price_type)}`}>
                              {formatPrice(ad.price, ad.price_type)}
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </section>
    </main>
  );
}