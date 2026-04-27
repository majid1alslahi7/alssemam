"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNewspaper, FaCalendarAlt, FaEye, FaSearch, FaArrowLeft, FaArrowRight,
  FaUser, FaFire, FaTimes, FaCode, FaRobot, FaGlobe, FaMobileAlt, FaRocket,
  FaClock,
} from "react-icons/fa";
import Image from "next/image";

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
    </div>
  );
}

// ─── Category Badge ──────────────────────────────────────────────────────────
function getCategoryStyle(category) {
  const map = {
    news: { bg: "bg-blue-500", text: "text-white", label: "خبر" },
    article: { bg: "bg-emerald-500", text: "text-white", label: "مقال" },
    writing: { bg: "bg-violet-500", text: "text-white", label: "كتابة" },
  };
  return map[category] || { bg: "bg-gray-500", text: "text-white", label: category || "مقال" };
}

// ─── Article Card ────────────────────────────────────────────────────────────
function ArticleCard({ article, index }) {
  const style = getCategoryStyle(article.category);
  const readingTime = Math.max(1, Math.round((article.content?.split(/\s+/).length || 200) / 200));

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 120, damping: 18 }}
      className="h-full"
    >
      <Link href={`/news/${article.slug}`} className="block h-full" aria-label={`قراءة: ${article.title}`}>
        <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden flex-shrink-0">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center" aria-hidden="true">
                <FaNewspaper size={44} className="text-white/25" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" aria-hidden="true" />
            <div className="absolute top-3 right-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} shadow-sm`}>
                {style.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-base font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-7">
              {article.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-7">
              {article.excerpt || article.content?.substring(0, 140)}...
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
              <time dateTime={article.published_at || article.created_at} className="flex items-center gap-1">
                <FaCalendarAlt size={9} aria-hidden="true" />
                {new Date(article.published_at || article.created_at).toLocaleDateString("ar-EG")}
              </time>
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <FaEye size={9} aria-hidden="true" />
                  {(article.views_count || 0).toLocaleString("ar-EG")}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock size={9} aria-hidden="true" />
                  {readingTime} د
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ─── Featured Article ─────────────────────────────────────────────────────────
function FeaturedArticle({ article }) {
  const style = getCategoryStyle(article.category);
  return (
    <section className="py-10" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4">
        <h2
          id="featured-heading"
          className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-5"
        >
          <FaFire className="text-orange-500" aria-hidden="true" />
          المقال المميز
        </h2>
        <Link href={`/news/${article.slug}`} aria-label={`قراءة المقال المميز: ${article.title}`}>
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl group border border-gray-100 dark:border-gray-800"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-72 md:h-full min-h-[340px]">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center" aria-hidden="true">
                    <FaNewspaper size={64} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${style.bg} ${style.text} shadow-md`}>
                    {style.label}
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-[1.5]">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-5 leading-8 line-clamp-3">
                  {article.excerpt || article.content?.substring(0, 200)}...
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1.5">
                    <FaUser size={12} aria-hidden="true" />
                    {article.author || "شركة السمام"}
                  </span>
                  <time dateTime={article.published_at || article.created_at} className="flex items-center gap-1.5">
                    <FaCalendarAlt size={12} aria-hidden="true" />
                    {new Date(article.published_at || article.created_at).toLocaleDateString("ar-EG")}
                  </time>
                  <span className="flex items-center gap-1.5">
                    <FaEye size={12} aria-hidden="true" />
                    {(article.views_count || 0).toLocaleString("ar-EG")}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  قراءة المقال
                  <FaArrowLeft size={13} aria-hidden="true" />
                </span>
              </div>
            </div>
          </motion.article>
        </Link>
      </div>
    </section>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === total || Math.abs(p - current) <= 1);

  return (
    <nav aria-label="التصفح بين الصفحات" className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => onChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        aria-label="الصفحة السابقة"
        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <FaArrowRight size={13} aria-hidden="true" />
      </button>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {visible.reduce((acc, p, i, arr) => {
          if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, []).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-label={`الصفحة ${p}`}
              aria-current={current === p ? "page" : undefined}
              className={`w-10 h-10 rounded-xl transition font-medium text-sm ${
                current === p
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onChange(Math.min(current + 1, total))}
        disabled={current === total}
        aria-label="الصفحة التالية"
        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <FaArrowLeft size={13} aria-hidden="true" />
      </button>
    </nav>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NewsClient({ initialArticles = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimer = useRef(null);
  const articlesPerPage = 9;

  const normalizeArabic = useCallback((text = "") =>
    text.toLowerCase()
      .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه")
      .replace(/ى/g, "ي").replace(/[ًٌٍَُِّْ]/g, ""),
    []
  );

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);
    setIsLoading(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(val);
      setCurrentPage(1);
      setIsLoading(false);
    }, 350);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handleCategory = useCallback((id) => {
    setSelectedCategory(id);
    setCurrentPage(1);
  }, []);

  const filteredArticles = useMemo(() => {
    let list = [...initialArticles];
    if (selectedCategory !== "all") list = list.filter((a) => a.category === selectedCategory);
    if (searchTerm.trim()) {
      const term = normalizeArabic(searchTerm);
      list = list.filter((a) =>
        normalizeArabic(a.title).includes(term) ||
        normalizeArabic(a.excerpt || "").includes(term) ||
        normalizeArabic(a.content || "").includes(term)
      );
    }
    return list;
  }, [initialArticles, selectedCategory, searchTerm, normalizeArabic]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const categories = [
    { id: "all", name: "الكل", count: initialArticles.length },
    { id: "news", name: "أخبار", count: initialArticles.filter((a) => a.category === "news").length },
    { id: "article", name: "مقالات", count: initialArticles.filter((a) => a.category === "article").length },
    { id: "writing", name: "كتابات", count: initialArticles.filter((a) => a.category === "writing").length },
  ];

  const featuredArticle = initialArticles[0] || null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="rtl" lang="ar">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 overflow-hidden" aria-labelledby="news-hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6" aria-hidden="true">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <FaNewspaper size={40} className="text-blue-100" />
              </div>
            </div>
            <h1 id="news-hero-heading" className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              السمام نيوز
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100/90 leading-9 mb-8">
              منصة تقنية تابعة لشركة السمام تقدم أخبار ومقالات في البرمجة،
              تطوير مواقع الويب، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين
              الظهور في محركات البحث.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
                خدمات شركة السمام
              </Link>
              <Link href="/contact" className="bg-blue-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition border border-white/20">
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEO Content Block ── */}
      <section className="py-14 bg-white dark:bg-gray-900" aria-labelledby="about-news-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 id="about-news-heading" className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            أخبار التقنية والبرمجة من السمام نيوز
          </h2>
          <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-9">
            <p>
              السمام نيوز منصة محتوى تقنية تهدف إلى نشر المعرفة الرقمية باللغة العربية، وتقديم مقالات عملية حول
              تطوير المواقع، تطبيقات الموبايل، الذكاء الاصطناعي، تحسين SEO، وتجارب بناء المنتجات الرقمية.
            </p>
            <p>
              نركز على تقديم محتوى واضح ومفيد لأصحاب الأعمال، رواد المشاريع، المطورين، والشركات الباحثة
              عن حلول تقنية تساعدها على النمو والتحول الرقمي.
            </p>
            <p>
              تغطي مقالات السمام نيوز موضوعات مثل Next.js و React و Laravel و Flutter و Supabase
              و DeepSeek و ChatGPT، مع نصائح عملية لتحسين الأداء والظهور في Google.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10" role="list" aria-label="إحصائيات">
            {[
              { Icon: FaNewspaper, value: initialArticles.length, label: "مقال منشور" },
              { Icon: FaCode, value: "Web", label: "تطوير مواقع" },
              { Icon: FaMobileAlt, value: "Apps", label: "تطبيقات موبايل" },
              { Icon: FaRobot, value: "AI", label: "ذكاء اصطناعي" },
            ].map(({ Icon, value, label }) => (
              <div
                key={label}
                className="bg-blue-50 dark:bg-gray-800 p-5 rounded-2xl text-center border border-blue-100/50 dark:border-gray-700"
                role="listitem"
              >
                <Icon className="mx-auto text-blue-600 text-3xl mb-3" aria-hidden="true" />
                <strong className="block text-2xl font-bold text-gray-900 dark:text-white">{value}</strong>
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Article ── */}
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}

      {/* ── Filter Bar ── */}
      <div className="sticky top-16 z-30 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md" role="search">
              <label htmlFor="article-search" className="sr-only">ابحث في المقالات</label>
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} aria-hidden="true" />
              <input
                id="article-search"
                type="search"
                placeholder="ابحث في الأخبار والمقالات..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pr-11 pl-10 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white placeholder-gray-400"
                aria-label="ابحث في المقالات"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="مسح البحث"
                >
                  <FaTimes className="text-gray-400" size={13} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap" role="group" aria-label="تصفية حسب الفئة">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategory(cat.id)}
                  aria-pressed={selectedCategory === cat.id}
                  aria-label={`${cat.name} (${cat.count} مقال)`}
                  className={`px-4 py-2.5 rounded-xl transition text-sm font-medium flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
                  }`}>{cat.count}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <section className="py-12" aria-labelledby="articles-grid-heading">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 id="articles-grid-heading" className="text-lg font-bold text-gray-800 dark:text-white">
              {filteredArticles.length > 0 ? (
                <>
                  {filteredArticles.length} {filteredArticles.length === 1 ? "مقال" : "مقالات"}
                  {searchTerm && <span className="text-gray-400 font-normal"> لـ &quot;{searchTerm}&quot;</span>}
                </>
              ) : null}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : filteredArticles.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800"
              >
                <FaSearch size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  لا توجد مقالات مطابقة
                </h3>
                {searchTerm && (
                  <button onClick={clearSearch} className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    مسح البحث
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label="قائمة المقالات"
              >
                {currentArticles.map((article, i) => (
                  <div key={article.id} role="listitem">
                    <ArticleCard article={article} index={i} />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
        </div>
      </section>

      {/* ── Why Section ── */}
      <section className="py-16 bg-white dark:bg-gray-900" aria-labelledby="why-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 id="why-heading" className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            لماذا تتابع السمام نيوز؟
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { Icon: FaRocket, title: "محتوى عملي", desc: "مقالات قابلة للتطبيق تساعدك على فهم التقنية واستخدامها في مشروعك." },
              { Icon: FaGlobe, title: "تحسين SEO", desc: "محتوى يساعد أصحاب المواقع على تحسين ظهورهم في Google ومحركات البحث." },
              { Icon: FaRobot, title: "جاهزية الذكاء الاصطناعي", desc: "نغطي موضوعات تساعد المواقع على الظهور في نماذج ChatGPT و DeepSeek." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <Icon className="text-blue-600 text-3xl mb-4" aria-hidden="true" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-7 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl shadow-blue-700/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">هل تريد تطوير موقع أو تطبيق احترافي؟</h2>
            <p className="max-w-2xl mx-auto mb-6 leading-8 text-blue-100">
              شركة السمام تساعدك في بناء موقع أو تطبيق أو نظام رقمي متكامل مع تحسين SEO وتجربة المستخدم.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-blue-700 px-7 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
                خدماتنا
              </Link>
              <Link href="/contact" className="bg-white/10 text-white px-7 py-3 rounded-xl font-bold border border-white/30 hover:bg-white/20 transition">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internal Links ── */}
      <nav className="py-8 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800" aria-label="روابط داخلية">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { href: "/services", label: "خدمات شركة السمام" },
            { href: "/portfolio", label: "أعمالنا" },
            { href: "/about", label: "من نحن" },
            { href: "/contact", label: "اتصل بنا" },
            { href: "/llms.txt", label: "AI Index" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}