'use client';
import { supabase } from '@/services/supabase';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  FaArrowRight, FaTimes, FaChevronLeft, FaChevronRight, 
  FaImage, FaDownload, FaShare, FaExpand, FaCompress,
  FaPlay, FaPause, FaCamera, FaDesktop, FaMobileAlt
} from 'react-icons/fa';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function ProjectGalleryPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    if (slug) loadProject();
  }, [slug]);

  useEffect(() => {
    let interval;
    if (slideshowActive && showLightbox) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % allImages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [slideshowActive, showLightbox, allImages.length]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      setProject(data);
      
      // تجميع كل الصور
      const images = [];
      if (data.primary_image) images.push({ url: data.primary_image, type: 'primary', label: 'الصورة الرئيسية' });
      if (data.screenshots && Array.isArray(data.screenshots)) {
        data.screenshots.forEach((url, i) => {
          images.push({ url, type: 'screenshot', label: `لقطة شاشة ${i + 1}` });
        });
      }
      setAllImages(images);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setActiveIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSlideshowActive(false);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${project?.slug}-image-${activeIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('تم تحميل الصورة');
    } catch (error) {
      toast.error('فشل تحميل الصورة');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    const url = allImages[activeIndex]?.url;
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success('تم نسخ رابط الصورة');
    }
  };

  // أنيميشنات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
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

  if (!project) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">المشروع غير موجود</h1>
        <Link href="/portfolio" className="text-blue-600 hover:underline">
          العودة إلى أعمالنا
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <section className="relative pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link 
              href={`/project/${slug}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <FaArrowRight size={14} />
              العودة إلى تفاصيل المشروع
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <FaCamera className="text-blue-500" />
                معرض الصور
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {project.title} - {allImages.length} صورة
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setGridView(!gridView)}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {gridView ? <FaImage size={18} /> : <FaImage size={18} />}
              </button>
              {allImages.length > 0 && (
                <button
                  onClick={() => openLightbox(0)}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition flex items-center gap-2"
                >
                  <FaPlay size={14} />
                  عرض الشرائح
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* معرض الصور */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {allImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaImage size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">لا توجد صور للمشروع</h3>
            </motion.div>
          ) : gridView ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {allImages.map((image, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  layoutId={`image-${index}`}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-700"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.label}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {image.label}
                      </p>
                      {image.type === 'primary' && (
                        <span className="inline-block mt-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          رئيسية
                        </span>
                      )}
                    </div>
                  </div>

                  {/* أيقونة التكبير */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg">
                    <FaExpand size={14} className="text-gray-700 dark:text-gray-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {allImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{image.label}</h4>
                      {image.type === 'primary' && (
                        <span className="text-xs text-blue-600">الصورة الرئيسية</span>
                      )}
                    </div>
                    <FaChevronLeft className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center"
          >
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white z-10">
              <button
                onClick={closeLightbox}
                className="p-3 hover:bg-white/10 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>

              <div className="text-center">
                <p className="font-medium">{allImages[activeIndex]?.label}</p>
                <p className="text-sm text-gray-400">
                  {activeIndex + 1} / {allImages.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSlideshowActive(!slideshowActive)}
                  className="p-3 hover:bg-white/10 rounded-full transition"
                  title={slideshowActive ? 'إيقاف' : 'تشغيل'}
                >
                  {slideshowActive ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 hover:bg-white/10 rounded-full transition"
                >
                  <FaShare size={16} />
                </button>
                <button
                  onClick={() => handleDownload(allImages[activeIndex]?.url)}
                  className="p-3 hover:bg-white/10 rounded-full transition"
                >
                  <FaDownload size={16} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-3 hover:bg-white/10 rounded-full transition"
                >
                  {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 p-4 hover:bg-white/10 rounded-full transition text-white z-10"
            >
              <FaChevronLeft size={24} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 p-4 hover:bg-white/10 rounded-full transition text-white z-10"
            >
              <FaChevronRight size={24} />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full max-w-5xl"
                >
                  <Image
                    src={allImages[activeIndex]?.url}
                    alt={allImages[activeIndex]?.label}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2 px-4 overflow-x-auto py-2">
                {allImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setActiveIndex(index);
                      setSlideshowActive(false);
                    }}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition ${
                      activeIndex === index 
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Progress Bar for Slideshow */}
            {slideshowActive && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 origin-left"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
