"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/services/supabase";
import {
  FaSearch,
  FaStar,
  FaEye,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaLaptopCode,
  FaMobileAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaCheckCircle,
  FaCode,
  FaRocket,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    web: 0,
    mobile: 0,
    featured: 0,
  });

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const projectsPerPage = 6;

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, activeCategory, searchTerm]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const projectsData = data || [];
      setProjects(projectsData);
      setStats({
        total: projectsData.length,
        web: projectsData.filter((p) => p.category === "web").length,
        mobile: projectsData.filter((p) => p.category === "mobile").length,
        featured: projectsData.filter((p) => p.featured).length,
      });
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeArabic = (text = "") =>
    text
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[ًٌٍَُِّْ]/g, "");

  const filterProjects = () => {
    let filtered = [...projects];

    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchTerm) {
      const term = normalizeArabic(searchTerm);
      filtered = filtered.filter(
        (p) =>
          normalizeArabic(p.title).includes(term) ||
          normalizeArabic(p.short_description).includes(term)
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const categories = [
    {
      id: "all",
      name: "جميع المشاريع",
      icon: <FaLayerGroup size={14} />,
      count: stats.total,
    },
    {
      id: "web",
      name: "تطوير مواقع",
      icon: <FaLaptopCode size={14} />,
      count: stats.web,
    },
    {
      id: "mobile",
      name: "تطبيقات موبايل",
      icon: <FaMobileAlt size={14} />,
      count: stats.mobile,
    },
  ];

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "أعمال شركة السمام",
        description:
          "معرض أعمال شركة السمام في تطوير مواقع الويب وتطبيقات الموبايل والأنظمة الرقمية.",
        url: "https://alssemam.com/portfolio",
        inLanguage: "ar",
        isPartOf: {
          "@type": "WebSite",
          name: "شركة السمام",
          url: "https://alssemam.com",
        },
      },
      {
        "@type": "Organization",
        name: "شركة السمام",
        alternateName: "Alssemam",
        url: "https://alssemam.com",
        logo: "https://alssemam.com/logo/logo.webp",
        email: "info@alssemam.com",
        telephone: "+967715122500",
      },
      {
        "@type": "ItemList",
        name: "قائمة مشاريع شركة السمام",
        itemListElement: projects.slice(0, 20).map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://alssemam.com/project/${project.slug}`,
          name: project.title,
        })),
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={isHeroInView ? { opacity: 1 } : {}}
        className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 18 }}
            className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ repeat: Infinity, duration: 22 }}
            className="absolute bottom-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 mb-5"
          >
            <FaStar className="text-yellow-400" />
            معرض أعمال شركة السمام
          </motion.span>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            className="text-3xl md:text-6xl font-extrabold mb-5"
          >
            أعمالنا في تطوير المواقع والتطبيقات
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100 leading-9"
          >
            نماذج من مشاريع شركة السمام في تطوير مواقع الويب، تطبيقات
            الموبايل، الأنظمة الرقمية، المتاجر الإلكترونية، والحلول التقنية
            الحديثة.
          </motion.p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              خدماتنا
            </Link>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              اطلب مشروعك
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-gray-900 dark:text-white">
            معرض مشاريع شركة السمام
          </h2>

          <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-9">
            <p>
              تعرض هذه الصفحة مجموعة من أعمال شركة السمام Alssemam في تطوير
              مواقع الويب وتطبيقات الموبايل والأنظمة الرقمية. نحرص في كل مشروع
              على الجمع بين التصميم الاحترافي، الأداء العالي، الأمان، وتجربة
              المستخدم السلسة.
            </p>

            <p>
              تشمل مشاريعنا مواقع الشركات، المتاجر الإلكترونية، تطبيقات
              الخدمات، أنظمة الإدارة، لوحات التحكم، ومشاريع التحول الرقمي
              للشركات والمؤسسات في اليمن والسعودية والأسواق العربية.
            </p>

            <p>
              تعتمد شركة السمام على تقنيات حديثة مثل Next.js و React و Flutter
              و Supabase و Laravel و Node.js لبناء حلول قابلة للتوسع ومهيأة
              لمحركات البحث ونماذج الذكاء الاصطناعي.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10">
            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaLayerGroup className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">{stats.total}</strong>
              <span className="text-sm text-gray-500">إجمالي المشاريع</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaLaptopCode className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">{stats.web}</strong>
              <span className="text-sm text-gray-500">مواقع ويب</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaMobileAlt className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">{stats.mobile}</strong>
              <span className="text-sm text-gray-500">تطبيقات موبايل</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaStar className="mx-auto text-yellow-500 text-3xl mb-3" />
              <strong className="block text-2xl">{stats.featured}</strong>
              <span className="text-sm text-gray-500">مشاريع مميزة</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-y border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label="مسح البحث"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 md:px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold transition ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
              <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold">لا توجد مشاريع مطابقة</h3>
              <p className="text-gray-500 mt-2">
                جرّب البحث بكلمة أخرى أو اختر جميع المشاريع.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
              >
                {currentProjects.map((project) => (
                  <motion.article key={project.id} variants={cardVariants}>
                    <Link href={`/project/${project.slug}`} className="block h-full">
                      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="relative h-48 sm:h-52 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
                          {project.primary_image ? (
                            <img
                              src={project.primary_image}
                              alt={`مشروع ${project.title} من أعمال شركة السمام`}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {project.category === "web" ? (
                                <FaLaptopCode size={44} className="text-white/80" />
                              ) : (
                                <FaMobileAlt size={44} className="text-white/80" />
                              )}
                            </div>
                          )}

                          {project.featured && (
                            <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                              <FaStar size={9} /> مميز
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="px-4 py-2 bg-white text-blue-600 rounded-xl font-semibold text-sm flex items-center gap-2">
                              عرض التفاصيل <FaExternalLinkAlt size={12} />
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 line-clamp-1">
                            {project.title}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-7">
                            {project.short_description}
                          </p>

                          <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="flex items-center gap-1">
                              <FaEye size={10} /> {project.views_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={10} />
                              {project.created_at
                                ? new Date(project.created_at).toLocaleDateString("ar-EG")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition"
                    aria-label="الصفحة السابقة"
                  >
                    <FaArrowRight size={12} className="mx-auto" />
                  </button>

                  <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    صفحة {currentPage} من {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition"
                    aria-label="الصفحة التالية"
                  >
                    <FaArrowLeft size={12} className="mx-auto" />
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
            كيف تنفذ شركة السمام المشاريع التقنية؟
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaCode className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">تحليل المتطلبات</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نبدأ بفهم هدف المشروع، الجمهور المستهدف، الخصائص المطلوبة،
                وطريقة تحقيق أفضل نتيجة تقنية وتجارية.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaRocket className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">تطوير وتنفيذ</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نستخدم تقنيات حديثة لبناء مشروع سريع، آمن، متجاوب، وقابل
                للتطوير مستقبلاً.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaGlobe className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">نشر وتحسين SEO</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نهيئ المشروع للفهرسة في محركات البحث، ونحسن السرعة وتجربة
                المستخدم والظهور الرقمي.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              هل تريد تنفيذ مشروع مشابه؟
            </h2>
            <p className="max-w-2xl mx-auto mb-6 leading-8 text-blue-100">
              تواصل مع شركة السمام لتحويل فكرتك إلى موقع أو تطبيق أو نظام رقمي
              احترافي قابل للنمو.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold"
              >
                <FaPhoneAlt /> تواصل معنا
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-blue-900/40 text-white px-6 py-3 rounded-xl font-bold border border-white/20"
              >
                <FaCheckCircle /> تصفح الخدمات
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
          <Link href="/about" className="text-blue-600 font-bold">
            من نحن
          </Link>
          <Link href="/news" className="text-blue-600 font-bold">
            السمام نيوز
          </Link>
          <Link href="/ads" className="text-blue-600 font-bold">
            الإعلانات
          </Link>
          <Link href="/contact" className="text-blue-600 font-bold">
            اتصل بنا
          </Link>
        </div>
      </nav>
    </div>
  );
}