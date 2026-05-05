'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaCode, FaMobile, FaCloud, FaPaintBrush, FaShoppingCart, FaRobot,
  FaProjectDiagram, FaSmile, FaTrophy, FaChartLine,
  FaArrowRight, FaCheckCircle, FaStar, FaRocket,
  FaShieldAlt, FaHeadset, FaGlobe, FaLightbulb, FaCrown,
  FaQuoteRight, FaArrowDown,
  FaChartPie, FaUserAstronaut, FaHandshake, FaGem,
  FaPlay, FaAward, FaUsers, FaBolt, FaHeart
} from 'react-icons/fa';
import { getProjects } from '@/services/supabase';
import AIReadyFAQ from '../src/components/AIReadyFAQ';

// ============================================================
// JSON-LD Schema Component
// ============================================================
function JsonLdSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://alssemam.com/#organization',
        name: 'شركة السمام للتقنية والحلول البرمجية',
        alternateName: 'Alssemam Tech',
        url: 'https://alssemam.com',
        logo: 'https://alssemam.com/logo/logo.webp',
        description: 'شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول والحلول التقنية المتكاملة',
        foundingDate: '2016',
        areaServed: ['SA', 'YE', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
        serviceType: [
          'تطوير مواقع الويب',
          'تطبيقات المحمول',
          'الحلول السحابية',
          'تصميم UX/UI',
          'متاجر إلكترونية',
          'الذكاء الاصطناعي',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English'],
        },
        sameAs: [
          'https://twitter.com/alssemam',
          'https://linkedin.com/company/alssemam',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://alssemam.com/#website',
        url: 'https://alssemam.com',
        name: 'شركة السمام',
        inLanguage: 'ar',
        publisher: { '@id': 'https://alssemam.com/#organization' },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://alssemam.com/#webpage',
        url: 'https://alssemam.com',
        name: 'شركة السمام - تطوير مواقع وتطبيقات احترافية',
        description:
          'شركة السمام رائدة في تطوير مواقع الويب وتطبيقات المحمول. نقدم حلول تقنية مبتكرة لتنمية أعمالكم.',
        isPartOf: { '@id': 'https://alssemam.com/#website' },
        about: { '@id': 'https://alssemam.com/#organization' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://alssemam.com' },
          ],
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// Floating Particles Background
// ============================================================
function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ============================================================
// Scroll Progress Bar
// ============================================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 origin-left z-[9999]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

// ============================================================
// Section Header Component
// ============================================================
function SectionHeader({ badge, title, desc, light = false }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`inline-flex items-center gap-2 font-semibold text-xs uppercase tracking-widest px-5 py-2 rounded-full mb-5 ${
          light
            ? 'text-orange-400 bg-white/10 border border-white/20'
            : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${light ? 'bg-orange-400' : 'bg-blue-600 dark:bg-blue-400'} animate-pulse`} />
        {badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl md:text-5xl font-bold mb-5 leading-tight ${
          light ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`max-w-2xl mx-auto text-lg leading-relaxed ${
            light ? 'text-white/65' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}

// ============================================================
// Stat Card Component
// ============================================================
function StatCard({ icon, value, suffix, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative text-center p-8 rounded-3xl bg-white dark:bg-gray-800/80 shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tabular-nums">
          {value}
          <span className="text-blue-600 dark:text-blue-400">{suffix}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// Service Card Component
// ============================================================
function ServiceCard({ icon, title, desc, color, index, href = '/services' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      whileHover={{ y: -12 }}
      className="group relative bg-white dark:bg-gray-800/80 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-400 overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-500`}
      />
      <div className="relative z-10">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{desc}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-hover:gap-2.5 transition-all duration-300"
          aria-label={`اعرف المزيد عن ${title}`}
        >
          اعرف المزيد <FaArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================
// Process Step Component
// ============================================================
function ProcessStep({ number, title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/30 z-10 relative">
          {number}
        </div>
        {index < 3 && (
          <div
            className="absolute top-1/2 -left-full w-full border-t-2 border-dashed border-blue-200 dark:border-blue-800 -translate-y-1/2 hidden md:block"
            aria-hidden="true"
          />
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ============================================================
// Testimonial Card Component
// ============================================================
function TestimonialCard({ name, role, company, text, rating, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      className="relative bg-white dark:bg-gray-800/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <FaQuoteRight className="text-blue-100 dark:text-blue-900/50 text-6xl absolute -top-2 -right-2" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex gap-1 mb-4" aria-label={`تقييم ${rating} من 5`}>
          {Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} className="text-yellow-400" size={14} />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">"{text}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white text-sm">{name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{role} - {company}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main HomePage Component
// ============================================================
export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({ projects: 0, clients: 0, experience: 0, satisfaction: 0 });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 60]);

  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (!statsInView) return;
    const targets = { projects: 150, clients: 120, experience: 8, satisfaction: 100 };
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (currentStep >= steps) {
        setAnimatedStats(targets);
        clearInterval(timer);
      } else {
        setAnimatedStats({
          projects: Math.floor(targets.projects * eased),
          clients: Math.floor(targets.clients * eased),
          experience: Math.floor(targets.experience * eased),
          satisfaction: Math.floor(targets.satisfaction * eased),
        });
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [statsInView]);

  const scrollToNext = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  const services = useMemo(
    () => [
      { icon: <FaCode size={26} />, title: 'تطوير مواقع الويب', desc: 'مواقع حديثة وسريعة متوافقة مع SEO وأفضل المعايير التقنية', color: 'from-blue-500 to-blue-700', href: '/services#web' },
      { icon: <FaMobile size={26} />, title: 'تطبيقات المحمول', desc: 'تطبيقات Android و iOS احترافية بتجربة مستخدم استثنائية', color: 'from-emerald-500 to-emerald-700', href: '/services#mobile' },
      { icon: <FaCloud size={26} />, title: 'الحلول السحابية', desc: 'بنية تحتية سحابية آمنة وقابلة للتوسع مع دعم متواصل', color: 'from-violet-500 to-violet-700', href: '/services#cloud' },
      { icon: <FaPaintBrush size={26} />, title: 'تصميم واجهات UX/UI', desc: 'تصاميم جذابة تجمع بين الجمال والوظيفية وسهولة الاستخدام', color: 'from-pink-500 to-pink-700', href: '/services#design' },
      { icon: <FaShoppingCart size={26} />, title: 'متاجر إلكترونية', desc: 'حلول متكاملة للتجارة الإلكترونية مع نظام دفع آمن', color: 'from-orange-500 to-orange-700', href: '/services#ecommerce' },
      { icon: <FaRobot size={26} />, title: 'الذكاء الاصطناعي', desc: 'دمج تقنيات AI لتحسين أعمالك وزيادة كفاءة العمليات', color: 'from-red-500 to-red-700', href: '/services#ai' },
    ],
    []
  );

  const features = useMemo(
    () => [
      { icon: <FaRocket size={20} />, title: 'سرعة فائقة', desc: 'أداء ممتاز وزمن استجابة سريع يضمن تجربة مستخدم مثالية' },
      { icon: <FaShieldAlt size={20} />, title: 'أمان عالي', desc: 'حماية متقدمة لبياناتك وفق أعلى المعايير الأمنية العالمية' },
      { icon: <FaLightbulb size={20} />, title: 'حلول مبتكرة', desc: 'أفكار إبداعية خارج الصندوق تُحدث فارقاً حقيقياً' },
      { icon: <FaHeadset size={20} />, title: 'دعم 24/7', desc: 'فريق دعم محترف متاح على مدار الساعة طوال العام' },
      { icon: <FaGlobe size={20} />, title: 'خدمات عالمية', desc: 'نخدم عملاء من جميع أنحاء الوطن العربي والعالم' },
      { icon: <FaCrown size={20} />, title: 'جودة استثنائية', desc: 'نلتزم بأعلى معايير الجودة في كل مشروع ننجزه' },
    ],
    []
  );

  const coreValues = useMemo(
    () => [
      { icon: <FaGem size={20} />, title: 'الإتقان', desc: 'نؤمن بأن الإتقان في العمل عبادة' },
      { icon: <FaHandshake size={20} />, title: 'المصداقية', desc: 'الصدق والشفافية أساس علاقتنا' },
      { icon: <FaUserAstronaut size={20} />, title: 'الابتكار', desc: 'نبحث دائماً عن الجديد والمفيد' },
      { icon: <FaChartPie size={20} />, title: 'الشراكة', desc: 'نجاح عملائنا هو نجاح لنا' },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { icon: <FaProjectDiagram size={22} />, value: animatedStats.projects, label: 'مشروع منجز', suffix: '+' },
      { icon: <FaSmile size={22} />, value: animatedStats.clients, label: 'عميل سعيد', suffix: '+' },
      { icon: <FaTrophy size={22} />, value: animatedStats.experience, label: 'سنوات خبرة', suffix: '' },
      { icon: <FaChartLine size={22} />, value: animatedStats.satisfaction, label: 'رضا العملاء', suffix: '%' },
    ],
    [animatedStats]
  );

  const processSteps = useMemo(
    () => [
      { number: '01', title: 'الاستشارة والتخطيط', desc: 'نستمع لأهدافك ونضع خطة تفصيلية للمشروع' },
      { number: '02', title: 'التصميم والنماذج', desc: 'نصمم واجهات جذابة ونقدم نماذج للمراجعة' },
      { number: '03', title: 'التطوير والبرمجة', desc: 'نبرمج المشروع بأعلى معايير الجودة' },
      { number: '04', title: 'الإطلاق والمتابعة', desc: 'نطلق المشروع ونتابع الأداء باستمرار' },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: 'محمد العمري',
        role: 'مدير تقنية المعلومات',
        company: 'شركة الخليج التجارية',
        text: 'شركة السمام قدمت لنا منصة رقمية استثنائية تجاوزت توقعاتنا. الفريق محترف ومتعاون والنتائج تتحدث عن نفسها.',
        rating: 5,
      },
      {
        name: 'سارة الزهراني',
        role: 'صاحبة مشروع',
        company: 'متجر أناقة',
        text: 'تجربة رائعة من البداية للنهاية. المتجر الإلكتروني الذي طوروه لي زاد مبيعاتي بنسبة 200% خلال ثلاثة أشهر فقط.',
        rating: 5,
      },
      {
        name: 'أحمد بن سالم',
        role: 'المدير التنفيذي',
        company: 'مجموعة النخبة',
        text: 'أنصح الجميع بالتعامل مع السمام. جودة عالية وأسعار منافسة وفريق يتقن عمله ويلتزم بالمواعيد.',
        rating: 5,
      },
    ],
    []
  );

  return (
    <>
      <JsonLdSchema />
      <ScrollProgress />

      <main id="main-content" className="overflow-x-hidden" dir="rtl">
        {/* ================================================
            Hero Section
        ================================================ */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-[92svh] pt-28 pb-16 md:pt-32 md:pb-20 flex items-center justify-center bg-[#061225] text-white overflow-hidden"
          aria-label="القسم الرئيسي"
        >
          {/* Branded logo background */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.img
              src="/logo/logo.webp"
              alt=""
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.24, scale: [1.08, 1.12, 1.08], x: [0, -16, 0], y: [0, 10, 0] }}
              transition={{ opacity: { duration: 0.8 }, scale: { repeat: Infinity, duration: 18, ease: 'easeInOut' }, x: { repeat: Infinity, duration: 18, ease: 'easeInOut' }, y: { repeat: Infinity, duration: 18, ease: 'easeInOut' } }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#061225]/78" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,18,37,0.98)_0%,rgba(6,18,37,0.86)_43%,rgba(6,18,37,0.68)_100%)]" />
            <div className="hero-logo-wave hero-logo-wave-one absolute -inset-x-20 top-16 h-52 md:h-64 opacity-45" />
            <div className="hero-logo-wave hero-logo-wave-two absolute -inset-x-20 bottom-0 h-56 md:h-72 opacity-35" />
          </div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(212,175,55,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(74,159,229,0.45) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
            aria-hidden="true"
          />

          <motion.div style={{ y: heroY }} className="container mx-auto px-4 relative z-10 w-full max-w-full overflow-hidden">
            <div className="text-center max-w-6xl mx-auto w-full min-w-0 overflow-hidden">
              {/* Trust badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className="inline-flex max-w-[min(100%,24rem)] flex-wrap items-center justify-center gap-2 px-4 py-2.5 md:px-5 bg-white/10 backdrop-blur-xl rounded-2xl mb-7 md:mb-9 border border-white/18 shadow-lg shadow-black/20"
              >
                <div className="flex flex-shrink-0 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar key={s} className="text-yellow-400" size={11} />
                  ))}
                </div>
                <span className="min-w-0 text-xs sm:text-sm font-semibold text-white/95 whitespace-normal">شركة السمام للتقنية والحلول البرمجية</span>
                <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mx-auto w-full max-w-[calc(100vw-2rem)] md:max-w-5xl text-[2.15rem] sm:text-[2.65rem] md:text-6xl lg:text-7xl font-black mb-6 leading-[1.14] md:leading-[1.12] tracking-normal [text-wrap:balance]"
              >
                <span className="block text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.42)]">
                  نطلق أعمالكم
                </span>
                <span className="block text-[#dceeff] drop-shadow-[0_3px_18px_rgba(0,0,0,0.42)]">
                  في آفاق التقنية
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
                  className="block mt-2 text-[2rem] sm:text-[2.25rem] md:text-5xl lg:text-6xl text-[#d7aa3f] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                  كالسَّمَامِ
                </motion.span>
              </motion.h1>

              {/* Sub-heading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="text-sm sm:text-base md:text-xl w-full max-w-[21rem] sm:max-w-2xl md:max-w-3xl mx-auto mb-9 md:mb-10 px-1 text-white/84 leading-7 sm:leading-8 md:leading-9 font-medium"
              >
                شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول، نقدم حلولاً تقنية مبتكرة
                تساعد عملك على النمو والانتشار الواسع.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 md:mb-12"
              >
                <Link
                  href="/contact"
                  className="group relative min-h-14 w-full max-w-[21rem] px-7 md:px-8 py-4 bg-[#d7aa3f] hover:bg-[#e7be58] text-[#061225] rounded-2xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-2xl shadow-black/25 overflow-hidden flex items-center justify-center sm:w-auto"
                  aria-label="ابدأ مشروعك الآن - تواصل معنا"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2.5">
                    ابدأ مشروعك الآن
                    <FaRocket size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/portfolio"
                  className="group min-h-14 w-full max-w-[21rem] px-7 md:px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/17 rounded-2xl font-semibold text-base transition-all duration-300 border border-white/24 hover:border-white/45 flex items-center justify-center gap-2.5 sm:w-auto"
                  aria-label="استكشف أعمالنا ومشاريعنا"
                >
                  استكشف أعمالنا
                  <FaPlay size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto text-white/88 text-sm"
                aria-label="مميزاتنا"
              >
                {['جودة مضمونة 100%', 'دعم فني 24/7', 'أسعار تنافسية', 'تسليم في الموعد'].map((item, i) => (
                  <div key={i} className="flex min-h-12 w-full max-w-[21rem] mx-auto items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/8 px-4 py-3 backdrop-blur-sm shadow-lg shadow-black/10">
                    <FaCheckCircle className="text-[#d7aa3f] flex-shrink-0" size={14} />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            onClick={scrollToNext}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer group"
            aria-label="انتقل للقسم التالي"
          >
            <span className="text-xs tracking-widest uppercase font-medium">اكتشف المزيد</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5 group-hover:border-white/40 transition-colors">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-2.5 bg-white/40 rounded-full"
              />
            </div>
          </motion.button>
        </motion.section>

        {/* ================================================
            Stats Section
        ================================================ */}
        <section
          ref={statsRef}
          className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
          aria-label="إحصائيات شركة السمام"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {stats.map((stat, i) => (
                <StatCard key={i} index={i} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================
            About Section
        ================================================ */}
        <section
          className="py-28 bg-white dark:bg-gray-900 overflow-hidden"
          aria-labelledby="about-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-5 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  من نحن
                </span>

                <h2
                  id="about-heading"
                  className="text-4xl md:text-5xl font-black mb-7 leading-tight"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    شركة السمام
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-400">
                    كالسَّمَامِ في العلو والارتقاء
                  </span>
                </h2>

                <div className="space-y-5 mb-10">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    <strong className="text-blue-600 dark:text-blue-400">شركة السمام</strong> شركة
                    تقنية رائدة متخصصة في تطوير مواقع الويب المتقدمة وتطبيقات الهواتف الذكية،
                    نقدم حلولاً تقنية مبتكرة تساعد أعمالكم على النمو والتوسع في الفضاء الرقمي.
                  </p>
                  <blockquote className="relative pr-6 border-r-4 border-blue-500 py-1">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                      نسمو بطموحنا{' '}
                      <strong className="text-blue-600 dark:text-blue-400 not-italic">كالسَّمَامِ</strong>{' '}
                      في العلو والارتقاء، لنبني لعملائنا حضوراً رقمياً استثنائياً يليق
                      بمكانتهم وتطلعاتهم.
                    </p>
                  </blockquote>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-2 gap-3 mb-10" role="list" aria-label="قيمنا الأساسية">
                  {coreValues.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      role="listitem"
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        {v.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">{v.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{v.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all duration-300 text-base border-b-2 border-blue-200 dark:border-blue-800 hover:border-blue-600 dark:hover:border-blue-400 pb-0.5"
                  aria-label="تعرف على شركة السمام أكثر"
                >
                  تعرف علينا أكثر <FaArrowRight size={13} />
                </Link>
              </motion.div>

              {/* Cards Side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative space-y-5"
              >
                {/* Vision Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-5">
                      <FaRocket size={26} />
                    </div>
                    <h3 className="text-2xl font-black mb-3">رؤيتنا</h3>
                    <p className="text-white/85 leading-relaxed">
                      أن نكون الخيار الأول للشركات الطموحة الباحثة عن التميز الرقمي في الوطن
                      العربي.
                    </p>
                  </div>
                </motion.div>

                {/* Mission Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-gray-900/60 mr-10 overflow-hidden"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/25">
                    <FaHandshake size={26} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-gray-800 dark:text-white">رسالتنا</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    تمكين الأعمال من تحقيق أقصى إمكاناتها في العالم الرقمي بحلول متطورة
                    وتصاميم إبداعية.
                  </p>
                </motion.div>

                {/* Floating achievements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-700"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <FaAward size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 dark:text-white text-lg leading-none">+150</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">مشروع مكتمل</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative blurs */}
                <div className="absolute -top-14 -right-14 w-40 h-40 bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" aria-hidden="true" />
                <div className="absolute -bottom-14 -left-14 w-56 h-56 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" aria-hidden="true" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================
            Services Section
        ================================================ */}
        <section
          className="py-28 bg-gray-50/70 dark:bg-gray-800/50"
          aria-labelledby="services-heading"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="ما نقدمه"
              title={<>خدماتنا <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">الاحترافية</span></>}
              desc="نقدم مجموعة متكاملة من الخدمات التقنية المتطورة لتنمية أعمالكم وتحقيق أهدافكم الرقمية"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7" role="list" aria-label="خدمات شركة السمام">
              {services.map((service, i) => (
                <div role="listitem" key={i}>
                  <ServiceCard {...service} index={i} />
                </div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-14"
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 hover:scale-105"
                aria-label="استعرض جميع خدماتنا"
              >
                استعرض جميع الخدمات <FaArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ================================================
            Process Section
        ================================================ */}
        <section
          className="py-28 bg-white dark:bg-gray-900"
          aria-labelledby="process-heading"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="كيف نعمل"
              title={<>خطواتنا نحو <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">النجاح</span></>}
              desc="عملية واضحة ومنظمة تضمن لك مشروعاً ناجحاً من أول يوم حتى الإطلاق"
            />
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connection line */}
              <div
                className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 dark:from-blue-900 dark:via-indigo-800 dark:to-blue-900 hidden md:block"
                aria-hidden="true"
              />
              {processSteps.map((step, i) => (
                <ProcessStep key={i} index={i} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================
            Projects Section
        ================================================ */}
        {projects.length > 0 && (
          <section
            className="py-28 bg-gray-50 dark:bg-gray-800"
            aria-labelledby="projects-heading"
          >
            <div className="container mx-auto px-4">
              <SectionHeader
                badge="أحدث أعمالنا"
                title={<>مشاريعنا <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">المميزة</span></>}
                desc="نفخر بتقديم أفضل الحلول التقنية لعملائنا حول العالم"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {projects.slice(0, 6).map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.6 }}
                    whileHover={{ y: -10 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 group"
                  >
                    <Link
                      href={`/project/${project.slug}`}
                      aria-label={`عرض مشروع ${project.title}`}
                    >
                      <div className="h-52 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                        {project.primary_image ? (
                          <Image
                            src={project.primary_image}
                            alt={`${project.title} - مشروع شركة السمام`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="text-white/20">
                            {project.category === 'web' ? <FaCode size={60} /> : <FaMobile size={60} />}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {project.featured && (
                          <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-lg">
                            <FaStar size={10} /> مميز
                          </span>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white/95 text-blue-600 text-xs px-4 py-1.5 rounded-full font-bold whitespace-nowrap shadow-lg">
                            عرض المشروع
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                          {project.short_description}
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-14"
              >
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25"
                  aria-label="عرض جميع مشاريع شركة السمام"
                >
                  عرض جميع المشاريع <FaArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* ================================================
            Why Us (Features) Section
        ================================================ */}
        <section
          className="py-28 bg-gradient-to-br from-[#020818] via-[#0a1628] to-[#0d1f3c] text-white relative overflow-hidden"
          aria-labelledby="features-heading"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeader
              badge="لماذا نحن"
              title={<>لماذا تختار <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">السمام؟</span></>}
              desc="نقدم لك الأفضل في عالم التقنية مع التزام كامل بالجودة والاحترافية في كل مشروع"
              light
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" role="list" aria-label="مميزات شركة السمام">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  role="listitem"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-orange-500/20">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">{f.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================
            Testimonials Section
        ================================================ */}
        <section
          className="py-28 bg-gray-50 dark:bg-gray-800"
          aria-labelledby="testimonials-heading"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="آراء عملائنا"
              title={<>ماذا يقول <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">عملاؤنا</span></>}
              desc="نفخر بثقة عملائنا ونسعى دائماً لتجاوز توقعاتهم"
            />
            <div className="grid md:grid-cols-3 gap-7">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} index={i} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================
            CTA Section
        ================================================ */}
        <section
          className="py-28 bg-white dark:bg-gray-900"
          aria-label="قسم الدعوة للتواصل"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 md:p-20 text-white text-center overflow-hidden shadow-2xl shadow-blue-500/20"
            >
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], rotate: [0, 60, 0] }}
                  transition={{ repeat: Infinity, duration: 18 }}
                  className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1.3, 1, 1.3], rotate: [0, -45, 0] }}
                  transition={{ repeat: Infinity, duration: 14 }}
                  className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full"
                />
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}
                />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-8"
                >
                  <FaRocket size={36} />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  هل أنت مستعد لإطلاق
                  <span className="block text-orange-300">مشروعك الرقمي؟</span>
                </h2>
                <p className="text-white/75 text-lg mb-10 leading-relaxed">
                  تواصل معنا اليوم وسنساعدك في تحويل فكرتك إلى واقع رقمي متميز.
                  استشارتك الأولى مجانية تماماً.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-9 py-4 bg-white text-blue-600 rounded-full font-black hover:bg-orange-50 transition-all duration-300 hover:scale-105 shadow-xl shadow-black/10 flex items-center gap-2.5"
                    aria-label="ابدأ مشروعك الآن مع شركة السمام"
                  >
                    ابدأ مشروعك الآن
                    <FaArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-9 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/25 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                    aria-label="استعرض خدمات شركة السمام"
                  >
                    استعرض خدماتنا
                  </Link>
                </div>
                <p className="mt-8 text-white/45 text-sm flex items-center justify-center gap-2">
                  <FaHeart className="text-red-400" size={12} />
                  انضم لأكثر من 120 عميل سعيد وثق بخدماتنا
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================================================
            SEO Text Section
        ================================================ */}
        <section
          className="py-20 bg-gray-50 dark:bg-gray-800/50"
          aria-labelledby="seo-content-heading"
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="seo-content-heading"
              className="text-3xl font-black mb-6 text-gray-800 dark:text-white"
            >
              خدمات شركة السمام للتطوير التقني
            </h2>
            <p className="mb-5 text-gray-600 dark:text-gray-300 leading-8">
              تقدم <strong>شركة السمام Alssemam</strong> مجموعة متكاملة من خدمات تطوير مواقع
              الويب وتطبيقات المحمول والحلول الرقمية الحديثة، حيث نساعد الشركات والمؤسسات على
              التحول الرقمي وتحقيق نمو فعلي في أعمالهم عبر الإنترنت.
            </p>
            <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-800 dark:text-white">
              لماذا تحتاج إلى خدمات تطوير مواقع وتطبيقات؟
            </h3>
            <p className="mb-5 text-gray-600 dark:text-gray-300 leading-8">
              في العصر الرقمي، أصبح الحضور الإلكتروني ضرورة لا رفاهية. موقعك الإلكتروني أو
              تطبيقك هو واجهتك الأولى أمام العملاء على مدار الساعة.
            </p>
            <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-800 dark:text-white">
              مميزات خدمات شركة السمام
            </h3>
            <ul
              className="space-y-3 text-gray-600 dark:text-gray-300 mb-8"
              aria-label="قائمة مميزات شركة السمام"
            >
              {[
                'تصميم احترافي متوافق مع جميع الأجهزة والشاشات',
                'تحسين SEO متقدم لظهور موقعك في صدارة نتائج جوجل',
                'سرعة تحميل عالية وأداء ممتاز وفق معايير Core Web Vitals',
                'أمان عالي وحماية البيانات وفق أحدث المعايير الأمنية',
                'دعم فني مستمر وصيانة دورية بعد التسليم',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-800 dark:text-white">
              خدماتنا في الذكاء الاصطناعي
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-8">
              نوفر حلول ذكاء اصطناعي متقدمة مثل Chatbots وربط المواقع مع ChatGPT و DeepSeek،
              لإنشاء أنظمة ذكية تساعد في تحسين تجربة المستخدم وزيادة المبيعات.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <AIReadyFAQ />
      </main>
    </>
  );
}
