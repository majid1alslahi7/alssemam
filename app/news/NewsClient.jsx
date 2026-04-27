"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaEye,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaFire,
  FaTimes,
  FaCode,
  FaRobot,
  FaGlobe,
  FaMobileAlt,
  FaRocket,
} from "react-icons/fa";
import Image from "next/image";

export default function NewsClient({ initialArticles = [] }) {
  const [articles] = useState(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 9;
  const featuredArticle = articles[0] || null;

  const categories = [
    { id: "all", name: "الكل", icon: <FaNewspaper size={14} /> },
    { id: "news", name: "أخبار", icon: <FaFire size={14} /> },
    { id: "article", name: "مقالات", icon: <FaNewspaper size={14} /> },
    { id: "writing", name: "كتابات", icon: <FaNewspaper size={14} /> },
  ];

  const normalizeArabic = (text = "") =>
    text
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[ًٌٍَُِّْ]/g, "");

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = normalizeArabic(searchTerm);

      filtered = filtered.filter(
        (article) =>
          normalizeArabic(article.title).includes(term) ||
          normalizeArabic(article.excerpt).includes(term) ||
          normalizeArabic(article.content).includes(term)
      );
    }

    return filtered;
  }, [articles, selectedCategory, searchTerm]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const getCategoryStyle = (category) => {
    switch (category) {
      case "news":
        return { bg: "bg-blue-500", text: "text-white", label: "خبر" };
      case "article":
        return { bg: "bg-green-500", text: "text-white", label: "مقال" };
      case "writing":
        return { bg: "bg-purple-500", text: "text-white", label: "كتابة" };
      default:
        return { bg: "bg-gray-500", text: "text-white", label: category || "مقال" };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900">
          <motion.div
            animate={{ scale: [1, 1.18, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 16 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <FaNewspaper size={44} className="text-blue-100" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
              السمام نيوز
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100 leading-9">
              منصة تقنية تابعة لشركة السمام تقدم أخبار ومقالات في البرمجة،
              تطوير مواقع الويب، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين
              الظهور في محركات البحث.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
              >
                خدمات شركة السمام
              </Link>
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-gray-900 dark:text-white">
            أخبار التقنية والبرمجة من السمام نيوز
          </h2>

          <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-9">
            <p>
              السمام نيوز هي منصة محتوى تقنية تهدف إلى نشر المعرفة الرقمية
              باللغة العربية، وتقديم مقالات عملية حول تطوير المواقع، تطبيقات
              الموبايل، الذكاء الاصطناعي، تحسين SEO، وتجارب بناء المنتجات
              الرقمية.
            </p>

            <p>
              نركز على تقديم محتوى واضح ومفيد لأصحاب الأعمال، رواد المشاريع،
              المطورين، والشركات التي تبحث عن حلول تقنية تساعدها على النمو
              والتحول الرقمي.
            </p>

            <p>
              تغطي مقالات السمام نيوز موضوعات مثل Next.js و React و Laravel و
              Flutter و Supabase و DeepSeek و ChatGPT، مع نصائح عملية لتحسين
              الأداء والظهور في Google ومحركات الذكاء الاصطناعي.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10">
            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaNewspaper className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">{articles.length}</strong>
              <span className="text-sm text-gray-500">مقال منشور</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaCode className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">Web</strong>
              <span className="text-sm text-gray-500">تطوير مواقع</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaMobileAlt className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">Apps</strong>
              <span className="text-sm text-gray-500">تطبيقات موبايل</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaRobot className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">AI</strong>
              <span className="text-sm text-gray-500">ذكاء اصطناعي</span>
            </div>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <FaFire className="text-orange-500" />
                المقال المميز
              </h2>
            </motion.div>

            <Link href={`/news/${featuredArticle.slug}`} className="block">
              <motion.article
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl group border border-gray-100 dark:border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-72 md:h-full min-h-[320px]">
                    {featuredArticle.image ? (
                      <Image
                        src={featuredArticle.image}
                        alt={`صورة مقال ${featuredArticle.title}`}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <FaNewspaper size={64} className="text-white/30" />
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          getCategoryStyle(featuredArticle.category).bg
                        } ${getCategoryStyle(featuredArticle.category).text}`}
                      >
                        {getCategoryStyle(featuredArticle.category).label}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 md:p-10 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-extrabold mb-4 group-hover:text-blue-600 transition leading-[1.5]">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-5 leading-8 line-clamp-4">
                      {featuredArticle.excerpt ||
                        featuredArticle.content?.substring(0, 220)}
                      ...
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaUser size={12} /> {featuredArticle.author || "السمام"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={12} />
                        {new Date(
                          featuredArticle.published_at || featuredArticle.created_at
                        ).toLocaleDateString("ar-EG")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={12} /> {featuredArticle.views_count || 0}
                      </span>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold">
                      قراءة المقال <FaArrowLeft size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      <section className="sticky top-16 z-30 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border-y border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الأخبار والمقالات..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  aria-label="مسح البحث"
                >
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
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
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

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
              <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">
                لا توجد مقالات مطابقة
              </h3>
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
                    <motion.article key={article.id} variants={cardVariants}>
                      <Link href={`/news/${article.slug}`} className="block h-full">
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
                          <div className="relative h-48 overflow-hidden">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={`صورة مقال ${article.title}`}
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
                            <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2 leading-8">
                              {article.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-7">
                              {article.excerpt || article.content?.substring(0, 140)}...
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt size={10} />
                                {new Date(
                                  article.published_at || article.created_at
                                ).toLocaleDateString("ar-EG")}
                              </span>

                              <span className="flex items-center gap-1">
                                <FaEye size={10} />
                                {article.views_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                    aria-label="الصفحة السابقة"
                  >
                    <FaArrowRight size={14} />
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        aria-label={`الصفحة ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                    aria-label="الصفحة التالية"
                  >
                    <FaArrowLeft size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            لماذا تتابع السمام نيوز؟
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaRocket className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">محتوى عملي</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نركز على مقالات قابلة للتطبيق تساعدك على فهم التقنية واستخدامها
                في مشروعك.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaGlobe className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">تحسين SEO</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                ننشر محتوى يساعد أصحاب المواقع على تحسين ظهورهم في Google
                ومحركات البحث.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaRobot className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">جاهزية الذكاء الاصطناعي</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نغطي موضوعات تساعد المواقع على الظهور والفهم داخل نماذج الذكاء
                الاصطناعي مثل ChatGPT و DeepSeek.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              هل تريد تطوير موقع أو تطبيق احترافي؟
            </h2>

            <p className="max-w-2xl mx-auto mb-6 leading-8 text-blue-100">
              شركة السمام تساعدك في بناء موقع أو تطبيق أو نظام رقمي متكامل
              مع تحسين SEO وتجربة المستخدم.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold">
                خدماتنا
              </Link>
              <Link href="/contact" className="bg-blue-900/40 text-white px-6 py-3 rounded-xl font-bold border border-white/20">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="py-8 bg-gray-50 dark:bg-gray-900" aria-label="روابط داخلية">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/services" className="text-blue-600 font-bold">
            خدمات شركة السمام
          </Link>
          <Link href="/portfolio" className="text-blue-600 font-bold">
            أعمالنا
          </Link>
          <Link href="/about" className="text-blue-600 font-bold">
            من نحن
          </Link>
          <Link href="/contact" className="text-blue-600 font-bold">
            اتصل بنا
          </Link>
          <Link href="/llms.txt" className="text-blue-600 font-bold">
            AI Index
          </Link>
        </div>
      </nav>
    </main>
  );
}