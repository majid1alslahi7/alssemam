'use client';
import { supabase } from '@/services/supabase';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import {
  FaCode, FaMobile, FaCloud, FaPaintBrush, FaShoppingCart, FaRobot,
  FaProjectDiagram, FaSmile, FaTrophy, FaClock, FaChartLine,
  FaArrowRight, FaCheckCircle, FaStar, FaUsers, FaRocket,
  FaShieldAlt, FaHeadset, FaGlobe, FaLightbulb, FaCrown,
  FaBuilding, FaEnvelope, FaPhoneAlt, FaQuoteRight, FaArrowDown,
  FaCheck, FaChartPie, FaUserAstronaut, FaHandshake, FaGem
} from 'react-icons/fa';
import { getProjects } from '@/services/supabase';
import AIReadyFAQ from '../src/components/AIReadyFAQ';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    satisfaction: 0
  });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: servicesRef, inView: servicesInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (statsInView) {
      const targets = { projects: 150, clients: 120, experience: 8, satisfaction: 100 };
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedStats(targets);
          clearInterval(timer);
        } else {
          setAnimatedStats({
            projects: Math.floor(targets.projects * currentStep / steps),
            clients: Math.floor(targets.clients * currentStep / steps),
            experience: Math.floor(targets.experience * currentStep / steps),
            satisfaction: Math.floor(targets.satisfaction * currentStep / steps)
          });
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [statsInView]);

  const services = [
    { icon: <FaCode size={28} />, title: 'تطوير مواقع الويب', desc: 'مواقع حديثة وسريعة متوافقة مع SEO', color: 'from-blue-500 to-blue-600', delay: 0 },
    { icon: <FaMobile size={28} />, title: 'تطبيقات المحمول', desc: 'تطبيقات Android و iOS احترافية', color: 'from-green-500 to-green-600', delay: 0.1 },
    { icon: <FaCloud size={28} />, title: 'الحلول السحابية', desc: 'استضافة وحلول سحابية آمنة', color: 'from-purple-500 to-purple-600', delay: 0.2 },
    { icon: <FaPaintBrush size={28} />, title: 'تصميم واجهات UX/UI', desc: 'تصاميم جذابة وتجربة مستخدم ممتازة', color: 'from-pink-500 to-pink-600', delay: 0.3 },
    { icon: <FaShoppingCart size={28} />, title: 'متاجر إلكترونية', desc: 'حلول متكاملة للتجارة الإلكترونية', color: 'from-orange-500 to-orange-600', delay: 0.4 },
    { icon: <FaRobot size={28} />, title: 'الذكاء الاصطناعي', desc: 'دمج تقنيات الذكاء الاصطناعي', color: 'from-red-500 to-red-600', delay: 0.5 }
  ];

  const features = [
    { icon: <FaRocket size={22} />, title: 'سرعة فائقة', desc: 'أداء ممتاز وزمن استجابة سريع' },
    { icon: <FaShieldAlt size={22} />, title: 'أمان عالي', desc: 'حماية متقدمة لبياناتك' },
    { icon: <FaLightbulb size={22} />, title: 'حلول مبتكرة', desc: 'أفكار جديدة خارج الصندوق' },
    { icon: <FaHeadset size={22} />, title: 'دعم 24/7', desc: 'فريق دعم متاح طوال الوقت' },
    { icon: <FaGlobe size={22} />, title: 'خدمات عالمية', desc: 'نخدم عملاء من جميع أنحاء العالم' },
    { icon: <FaCrown size={22} />, title: 'جودة عالية', desc: 'نلتزم بأعلى معايير الجودة' }
  ];

  const coreValues = [
    { icon: <FaGem size={24} />, title: 'الإتقان', desc: 'نؤمن بأن الإتقان في العمل عبادة' },
    { icon: <FaHandshake size={24} />, title: 'المصداقية', desc: 'الصدق والشفافية أساس علاقتنا' },
    { icon: <FaUserAstronaut size={24} />, title: 'الابتكار', desc: 'نبحث دائماً عن الجديد والمفيد' },
    { icon: <FaChartPie size={24} />, title: 'الشراكة', desc: 'نجاح عملائنا هو نجاح لنا' }
  ];

  const stats = [
    { icon: <FaProjectDiagram size={24} />, value: animatedStats.projects, label: 'مشروع منجز', suffix: '+' },
    { icon: <FaSmile size={24} />, value: animatedStats.clients, label: 'عميل سعيد', suffix: '+' },
    { icon: <FaTrophy size={24} />, value: animatedStats.experience, label: 'سنوات خبرة', suffix: '' },
    { icon: <FaChartLine size={24} />, value: animatedStats.satisfaction, label: 'رضا العملاء', suffix: '%' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white overflow-hidden"
      >
        {/* خلفية متحركة */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute top-20 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.5, 1, 1.5], rotate: [0, -90, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl"
          />
        </div>

        {/* شبكة خلفية */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* شارة */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20"
            >
              <FaStar className="text-yellow-400 animate-pulse" size={14} />
              <span className="text-sm font-medium">شركة السمام للتقنية والحلول البرمجية</span>
              <FaStar className="text-yellow-400 animate-pulse" size={14} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
                نطلق أعمالكم
              </span>
              <br />
              في آفاق التقنية
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-orange-400 block mt-2 text-4xl md:text-6xl"
              >
                كالسَّمَامِ
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100 leading-relaxed"
            >
              شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول، 
              نقدم حلولاً تقنية مبتكرة تساعد عملك على النمو والانتشار.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-5 justify-center"
            >
              <Link
                href="/contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/30"
              >
                <span className="flex items-center gap-2">
                  ابدأ مشروعك الآن
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full font-semibold transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                استكشف أعمالنا
              </Link>
            </motion.div>

            {/* شعارات الثقة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/60 text-sm"
            >
              <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> جودة مضمونة</div>
              <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> دعم فني 24/7</div>
              <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> أسعار تنافسية</div>
            </motion.div>
          </motion.div>
        </div>

        {/* سهم التمرير */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/50 text-sm">اكتشف المزيد</span>
            <FaArrowDown className="text-white/70 text-xl" />
          </div>
        </motion.div>
      </motion.section>

      {/* نبذة عن الشركة - قسم جديد ومطور */}
      <section ref={aboutRef} className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* الجانب الأيمن - النص */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full">
                  من نحن
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  شركة السمام
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300">
                  كالسَّمَامِ في العلو والارتقاء
                </span>
              </h2>

              <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={aboutInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="text-lg"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400">شركة السمام</span> هي شركة تقنية رائدة ومتخصصة في تطوير مواقع الويب المتقدمة وتطبيقات الهواتف الذكية بأنواعها، نقدم حلولاً تقنية مبتكرة ومتكاملة تساعد أعمالكم على النمو والتوسع والانتشار في الفضاء الرقمي الواسع.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={aboutInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  className="relative pl-6 border-r-4 border-blue-500"
                >
                  <FaQuoteRight className="absolute right-0 top-0 text-blue-200 dark:text-blue-800 text-3xl opacity-50" />
                  نسمو بطموحنا <span className="font-semibold text-blue-600 dark:text-blue-400">كالسَّمَامِ</span> في العلو والارتقاء، ونحلق في آفاق الإبداع والتميز، ونرسخ جذورنا في أرض الواقع بكل ثبات وإتقان، لنبني لعملائنا حضوراً رقمياً استثنائياً يليق بمكانتهم وتطلعاتهم.
                </motion.p>
              </div>

              {/* القيم الأساسية */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mt-8"
              >
                {coreValues.map((value, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white">{value.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={aboutInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                >
                  تعرف علينا أكثر <FaArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* الجانب الأيسر - بطاقات متحركة */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* بطاقة الرؤية */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative z-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl mb-6"
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <FaRocket size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">رؤيتنا</h3>
                <p className="text-white/90 leading-relaxed">
                  نطمح أن نكون الخيار الأول والوجهة المفضلة للشركات والمؤسسات الطموحة الباحثة عن التميز الرقمي في اليمن والمنطقة العربية.
                </p>
              </motion.div>

              {/* بطاقة الرسالة */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl mr-8"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <FaHandshake size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">رسالتنا</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  تمكين الأعمال والمشاريع من تحقيق أقصى إمكاناتها في العالم الرقمي، من خلال تقديم حلول تقنية متطورة وتصاميم إبداعية آسرة.
                </p>
              </motion.div>

              {/* عنصر زخرفي */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* إحصائيات الشركة */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* باقي الأقسام كما هي */}
      {/* الخدمات */}
      <section ref={servicesRef} className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full">
              ما نقدمه
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">خدماتنا الاحترافية</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات التقنية لتنمية أعمالكم
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* المشاريع الأخيرة */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full">
              أحدث أعمالنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">مشاريعنا المميزة</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نفخر بتقديم أفضل الحلول التقنية لعملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/project/${project.slug}`}>
                  <div className="h-52 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                    {project.primary_image ? (
                      <Image src={project.primary_image} alt={project.title} fill className="object-cover" />
                    ) : (
                      project.category === 'web' ? <FaCode size={56} className="text-white/30" /> : <FaMobile size={56} className="text-white/30" />
                    )}
                    {project.featured && (
                      <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                        <FaStar size={10} /> مميز
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{project.short_description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/30"
            >
              عرض جميع المشاريع <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full">
              لماذا نحن
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">لماذا تختار السمام؟</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              نقدم لك الأفضل في عالم التقنية مع التزام كامل بالجودة والاحترافية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم FAQ */}
      <AIReadyFAQ />
    </div>
  );
}
