'use client';
import { supabase } from '@/services/supabase';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getArticles } from '@/services/supabase';
import { 
  FaNewspaper, FaCalendarAlt, FaEye, FaTag, FaSearch, 
  FaArrowLeft, FaArrowRight, FaImage, FaUser, FaFire,
  FaClock, FaChevronRight, FaTimes
} from 'react-icons/fa';
import Image from 'next/image';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const articlesPerPage = 9;

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    try {
      const data = await getArticles(selectedCategory !== 'all' ? selectedCategory : null);
      const publishedArticles = data.filter(a => a.is_published);
      setArticles(publishedArticles || []);
      
      // اختيار مقال مميز (أحدث مقال)
      if (publishedArticles.length > 0) {
        setFeaturedArticle(publishedArticles[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const categories = [
    { id: 'all', name: 'الكل', icon: <FaNewspaper size={14} /> },
    { id: 'news', name: 'أخبار', icon: <FaFire size={14} /> },
    { id: 'article', name: 'مقالات', icon: <FaNewspaper size={14} /> },
    { id: 'writing', name: 'كتابات', icon: <FaNewspaper size={14} /> },
  ];

  const getCategoryStyle = (category) => {
    switch(category) {
      case 'news': return { bg: 'bg-blue-500', text: 'text-white', label: 'خبر' };
      case 'article': return { bg: 'bg-green-500', text: 'text-white', label: 'مقال' };
      case 'writing': return { bg: 'bg-purple-500', text: 'text-white', label: 'كتابة' };
      default: return { bg: 'bg-gray-500', text: 'text-white', label: category };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
              <FaNewspaper size={56} className="text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">السمام نيوز</h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              أحدث الأخبار والمقالات التقنية من عالم البرمجة والتطوير
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

      {/* مقال مميز */}
      {featuredArticle && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaFire className="text-orange-500" />
                المقال المميز
              </h2>
            </motion.div>

            <Link href={`/news/${featuredArticle.slug}`}>
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl group"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-full">
                    {featuredArticle.image ? (
                      <Image
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <FaNewspaper size={64} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getCategoryStyle(featuredArticle.category).bg} ${getCategoryStyle(featuredArticle.category).text}`}>
                        {getCategoryStyle(featuredArticle.category).label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {featuredArticle.excerpt || featuredArticle.content?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaUser size={12} /> {featuredArticle.author || 'السمام'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={12} /> {new Date(featuredArticle.published_at).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={12} /> {featuredArticle.views_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* قسم البحث والتصفية */}
      <section className="sticky top-16 z-30 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الأخبار والمقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaTimes className="text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* معرض المقالات */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">لا توجد مقالات مطابقة</h3>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentArticles.map((article) => {
                  const style = getCategoryStyle(article.category);
                  return (
                    <motion.div key={article.id} variants={cardVariants}>
                      <Link href={`/news/${article.slug}`}>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <div className="relative h-48 overflow-hidden">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-110 transition duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <FaNewspaper size={48} className="text-white/30" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                {style.label}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                              {article.excerpt || article.content?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt size={10} />
                                {new Date(article.published_at).toLocaleDateString('ar-EG')}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaEye size={10} />
                                {article.views_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* الترقيم */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-3 mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                  >
                    <FaArrowRight size={14} />
                  </motion.button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl transition ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                  >
                    <FaArrowLeft size={14} />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
