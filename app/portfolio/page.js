'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { 
  FaSearch, FaStar, FaEye, FaCalendarAlt, FaArrowLeft, FaArrowRight, 
  FaLaptopCode, FaMobileAlt, FaTimes, FaFilter, FaExternalLinkAlt, FaLayerGroup
} from 'react-icons/fa';
import Image from 'next/image';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, web: 0, mobile: 0, featured: 0 });
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
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const projectsData = data || [];
      setProjects(projectsData);
      setStats({
        total: projectsData.length,
        web: projectsData.filter(p => p.category === 'web').length,
        mobile: projectsData.filter(p => p.category === 'mobile').length,
        featured: projectsData.filter(p => p.featured).length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const categories = [
    { id: 'all', name: 'جميع المشاريع', icon: <FaLayerGroup size={14} />, count: stats.total },
    { id: 'web', name: 'تطوير مواقع', icon: <FaLaptopCode size={14} />, count: stats.web },
    { id: 'mobile', name: 'تطبيقات موبايل', icon: <FaMobileAlt size={14} />, count: stats.mobile },
  ];

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.section ref={heroRef} initial={{ opacity: 0 }} animate={isHeroInView ? { opacity: 1 } : {}} className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 20 }} className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={isHeroInView ? { y: 0, opacity: 1 } : {}} className="text-3xl md:text-5xl font-bold mb-3">أعمالنا</motion.h1>
          <motion.p initial={{ y: 30, opacity: 0 }} animate={isHeroInView ? { y: 0, opacity: 1 } : {}} className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">نفخر بتقديم أفضل الحلول التقنية المبتكرة لعملائنا</motion.p>
        </div>
      </motion.section>

      <section className="sticky top-16 z-30 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="ابحث عن مشروع..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-12 pl-4 py-2.5 border rounded-xl bg-white dark:bg-gray-900" />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute left-3 top-1/2 -translate-y-1/2"><FaTimes size={14} /></button>}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 md:px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs md:text-sm ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {cat.icon}<span className="hidden sm:inline">{cat.name}</span><span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16"><div className="text-5xl mb-4">🔍</div><h3 className="text-xl font-semibold">لا توجد مشاريع مطابقة</h3></div>
          ) : (
            <>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {currentProjects.map((project) => (
                  <motion.div key={project.id} variants={cardVariants}>
                    <Link href={`/project/${project.slug}`} className="block h-full">
                      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="relative h-48 sm:h-52 bg-gradient-to-br from-blue-600 to-indigo-600">
                          {project.primary_image ? (
                            <img src={project.primary_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">{project.category === 'web' ? <FaLaptopCode size={40} className="text-white/80" /> : <FaMobileAlt size={40} className="text-white/80" />}</div>
                          )}
                          {project.featured && <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><FaStar size={8} /> مميز</span>}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="px-4 py-2 bg-white text-blue-600 rounded-xl font-semibold text-sm flex items-center gap-2">عرض التفاصيل <FaExternalLinkAlt size={12} /></span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 line-clamp-1">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.short_description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                            <span className="flex items-center gap-1"><FaEye size={10} /> {project.views_count || 0}</span>
                            <span className="flex items-center gap-1"><FaCalendarAlt size={10} /> {new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white"><FaArrowRight size={12} /></button>
                  <span className="px-4 py-2">صفحة {currentPage} من {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white"><FaArrowLeft size={12} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
