'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

const services = [
  {
    id: 1,
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'تطوير مواقع الويب',
    subtitle: 'Web Development',
    desc: 'مواقع حديثة وسريعة متوافقة مع SEO وأحدث المعايير التقنية',
    longDesc: 'نقدم خدمات تطوير مواقع الويب باستخدام أحدث التقنيات مثل React و Next.js و Node.js. نضمن لك موقعاً سريعاً وآمناً ومتوافقاً مع محركات البحث مع أداء Core Web Vitals مثالي.',
    features: ['React / Next.js', 'SEO متقدم', 'أداء فائق', 'أمان عالي', 'تصميم متجاوب'],
    price: 'يبدأ من 500$',
    time: '2-4 أسابيع',
    color: 'from-blue-500 to-cyan-500',
    accent: '#3b82f6',
  },
  {
    id: 2,
    iconPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'تطبيقات المحمول',
    subtitle: 'Mobile Apps',
    desc: 'تطبيقات Android و iOS احترافية بتقنيات حديثة وتجربة مستخدم متفوقة',
    longDesc: 'نطور تطبيقات موبايل احترافية لنظامي Android و iOS باستخدام React Native و Flutter. تجربة مستخدم ممتازة وأداء عالي مع تكامل كامل مع الأنظمة الخلفية.',
    features: ['React Native', 'Flutter', 'تجربة مستخدم ممتازة', 'أداء عالي', 'تكامل مع APIs'],
    price: 'يبدأ من 1000$',
    time: '4-8 أسابيع',
    color: 'from-violet-500 to-purple-500',
    accent: '#8b5cf6',
  },
  {
    id: 3,
    iconPath: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    title: 'الحلول السحابية',
    subtitle: 'Cloud Solutions',
    desc: 'استضافة وحلول سحابية آمنة وقابلة للتوسع على AWS و Azure',
    longDesc: 'نقدم حلولاً سحابية متكاملة باستخدام AWS و Azure و Cloudflare. استضافة آمنة وقابلة للتوسع مع دعم فني على مدار الساعة ونسخ احتياطي تلقائي.',
    features: ['AWS / Azure', 'أمان عالي', 'توسع مرن', 'دعم 24/7', 'نسخ احتياطي يومي'],
    price: 'يبدأ من 200$ شهرياً',
    time: '1-2 أسابيع',
    color: 'from-sky-500 to-indigo-500',
    accent: '#0ea5e9',
  },
  {
    id: 4,
    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    title: 'تصميم واجهات UX/UI',
    subtitle: 'UX/UI Design',
    desc: 'تصاميم جذابة وتجربة مستخدم ممتازة تزيد من معدلات التحويل',
    longDesc: 'نصمم واجهات مستخدم جذابة وسهلة الاستخدام باستخدام Figma و Adobe XD. نضمن تجربة مستخدم ممتازة مبنية على أبحاث المستخدم وأفضل ممارسات UX.',
    features: ['Figma', 'Adobe XD', 'تصميم متجاوب', 'سهولة الاستخدام', 'نماذج تفاعلية'],
    price: 'يبدأ من 300$',
    time: '1-3 أسابيع',
    color: 'from-pink-500 to-rose-500',
    accent: '#ec4899',
  },
  {
    id: 5,
    iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'متاجر إلكترونية',
    subtitle: 'E-Commerce',
    desc: 'حلول متكاملة للتجارة الإلكترونية بنظام دفع آمن وإدارة ذكية',
    longDesc: 'نطور متاجر إلكترونية متكاملة باستخدام Shopify و WooCommerce. نظام دفع آمن وإدارة مخزون وتقارير متقدمة مع تكامل مع جميع بوابات الدفع العربية.',
    features: ['مدفوعات آمنة', 'إدارة مخزون', 'تقارير متقدمة', 'تكامل مع الشحن', 'خصومات وكوبونات'],
    price: 'يبدأ من 800$',
    time: '3-6 أسابيع',
    color: 'from-emerald-500 to-teal-500',
    accent: '#10b981',
  },
  {
    id: 6,
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2',
    title: 'الذكاء الاصطناعي',
    subtitle: 'AI Solutions',
    desc: 'دمج تقنيات الذكاء الاصطناعي في مشاريعك لتحسين الكفاءة والمبيعات',
    longDesc: 'نقدم حلول الذكاء الاصطناعي مثل Chatbots وتحليل البيانات وتوصيات ذكية مع ربط ChatGPT و DeepSeek. نستخدم أحدث تقنيات AI لتحسين أعمالك.',
    features: ['Chatbots', 'تحليل بيانات', 'توصيات ذكية', 'معالجة اللغة العربية', 'تعلم آلة'],
    price: 'يبدأ من 1500$',
    time: '4-8 أسابيع',
    color: 'from-orange-500 to-amber-500',
    accent: '#f97316',
  },
];

const stats = [
  { value: 150, suffix: '+', label: 'مشروع منجز' },
  { value: 98, suffix: '%', label: 'رضا العملاء' },
  { value: 5, suffix: '+', label: 'سنوات خبرة' },
  { value: 24, suffix: '/7', label: 'دعم فني' },
];

const process = [
  { num: '01', title: 'التحليل والتخطيط', desc: 'ندرس متطلباتك ونضع خطة تفصيلية للمشروع' },
  { num: '02', title: 'التصميم والتطوير', desc: 'نصمم ونطور الحل بأعلى معايير الجودة' },
  { num: '03', title: 'الاختبار والمراجعة', desc: 'نختبر كل شيء بدقة ونراجع مع العميل' },
  { num: '04', title: 'الإطلاق والدعم', desc: 'نطلق المشروع ونوفر دعماً مستمراً بعد التسليم' },
];

const faqs = [
  { q: 'كم تستغرق عملية تطوير الموقع؟', a: 'يعتمد الوقت على حجم المشروع، عادةً من أسبوعين إلى ثمانية أسابيع. نحدد الجدول الزمني بدقة في مرحلة التحليل.' },
  { q: 'هل تقدمون دعماً بعد إطلاق المشروع؟', a: 'نعم، نقدم دعماً فنياً على مدار 24/7 مع ضمان صيانة لمدة 3 أشهر مجاناً بعد التسليم.' },
  { q: 'ما طرق الدفع المتاحة؟', a: 'نقبل التحويل البنكي وبطاقات الائتمان وPayPal. عادةً نأخذ 40% مقدماً والباقي عند التسليم.' },
  { q: 'هل تعملون مع الشركات خارج المملكة؟', a: 'نعم، نخدم عملاء في جميع أنحاء المنطقة العربية وعالمياً مع دعم كامل عن بُعد.' },
];

function useCountUp(target, duration = 2000, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

function StatCard({ value, suffix, label, trigger }) {
  const count = useCountUp(value, 1800, trigger);
  return (
    <div className="text-center">
      <div className="text-5xl font-black text-white mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {count}{suffix}
      </div>
      <div className="text-blue-300 text-sm font-medium tracking-widest uppercase">{label}</div>
    </div>
  );
}

function ServiceCard({ service, onClick, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <article
      ref={ref}
      onClick={onClick}
      aria-label={`خدمة ${service.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59,130,246,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: service.accent }} />
      <div className="relative p-7">
        <div className="mb-5 flex items-center justify-between">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={service.iconPath} />
            </svg>
          </div>
          <span className="text-xs font-mono text-gray-500 tracking-widest">{service.subtitle}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>{service.title}</h3>
        <p className="text-gray-400 text-sm leading-7 mb-5">{service.desc}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {service.features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full text-gray-300 font-mono"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              {f}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">يبدأ من </span>
            <span className="text-white font-bold" style={{ color: service.accent }}>{service.price.replace('يبدأ من ', '')}</span>
          </div>
          <button className={`text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 group-hover:gap-3`}
            style={{ color: service.accent }} aria-label={`اعرف المزيد عن ${service.title}`}>
            اعرف المزيد
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedService]);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'خدمات شركة السمام للتطوير التقني',
    description: 'خدمات تطوير مواقع الويب وتطبيقات المحمول والذكاء الاصطناعي من شركة السمام Alssemam',
    provider: {
      '@type': 'Organization',
      name: 'شركة السمام Alssemam',
      url: 'https://alssemam.com',
      serviceArea: 'المملكة العربية السعودية والوطن العربي',
    },
    offers: services.map(s => ({
      '@type': 'Offer',
      name: s.title,
      description: s.longDesc,
      price: s.price,
    })),
  };

  return (
    <>
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        :root {
          --bg-deep: #020817;
          --bg-card: rgba(15,23,42,0.7);
          --border: rgba(59,130,246,0.15);
          --gold: #f59e0b;
          --blue: #3b82f6;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
        }
        * { box-sizing: border-box; }
        body { direction: rtl; }
        .hero-grid {
          background-image:
            linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .modal-overlay {
          animation: fadeIn 0.25s ease;
        }
        .modal-panel {
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .float-anim { animation: float 5s ease-in-out infinite; }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(59,130,246,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .pulse-ring { animation: pulse-ring 2.5s infinite; }
        .card-hover-line::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card-hover-line:hover::after { opacity: 1; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #93c5fd 0%, #ffffff 50%, #93c5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .faq-answer {
          transition: max-height 0.35s ease, opacity 0.3s ease;
          overflow: hidden;
        }
        .scrollbar-custom::-webkit-scrollbar { width: 4px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.4); border-radius: 9999px; }
      `}</style>

      <div
        dir="rtl"
        lang="ar"
        className="min-h-screen"
        style={{ background: 'var(--bg-deep)', fontFamily: "'Cairo', sans-serif", color: 'var(--text-primary)' }}
      >
        {/* ─── Breadcrumb (SEO) ─── */}
        <nav
          aria-label="breadcrumb"
          className="pt-28 pb-0"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          style={{ paddingRight: '1.5rem' }}
        >
          <ol className="container mx-auto px-6 flex items-center gap-2 text-sm text-gray-500">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-blue-400 transition" itemProp="item">
                <span itemProp="name">الرئيسية</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-gray-600">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-blue-400">الخدمات</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        {/* ─── HERO ─── */}
        <header
          className="relative overflow-hidden hero-grid pt-14 pb-28"
          role="banner"
        >
          <div className="glow-orb w-[500px] h-[500px] -top-32 -right-32 opacity-20"
            style={{ background: 'radial-gradient(circle, #1d4ed8, transparent)' }} />
          <div className="glow-orb w-[400px] h-[400px] bottom-0 left-0 opacity-10"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-blue-300 mb-8 pulse-ring"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" style={{ boxShadow: '0 0 8px #60a5fa' }} />
                شركة السمام — خبرة تقنية متميزة منذ 2019
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="shimmer-text">خدماتنا التقنية</span>
                <br />
                <span className="text-3xl md:text-4xl font-light text-gray-400 mt-2 block">
                  حلول رقمية متكاملة لنمو أعمالكم
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-8 mb-10">
                نقدم مجموعة شاملة من الخدمات التقنية المتخصصة من تطوير المواقع والتطبيقات
                إلى حلول الذكاء الاصطناعي، مع ضمان أعلى معايير الجودة والأمان.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 8px 30px rgba(59,130,246,0.35)' }}
                >
                  ابدأ مشروعك الآن
                </Link>
                <a
                  href="#services"
                  className="px-8 py-3.5 rounded-xl font-bold text-gray-300 transition-all duration-300 hover:text-white hover:border-blue-500"
                  style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}
                >
                  استعرض الخدمات
                </a>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="float-anim absolute top-20 left-10 w-16 h-16 rounded-xl opacity-20 hidden lg:block"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transform: 'rotate(20deg)' }} />
          <div className="float-anim absolute bottom-10 right-16 w-10 h-10 rounded-lg opacity-15 hidden lg:block"
            style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', animationDelay: '1.5s', transform: 'rotate(-15deg)' }} />
        </header>

        {/* ─── SERVICES GRID ─── */}
        <main id="services">
          <section aria-labelledby="services-heading" className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-14">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase block mb-3">— ما نقدمه</span>
                <h2 id="services-heading" className="text-4xl font-black text-white">
                  خدماتنا المتخصصة
                </h2>
                <p className="text-gray-400 mt-3 max-w-xl mx-auto">
                  كل خدمة مصممة لتلبية احتياجات عملك الرقمي بدقة واحترافية
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {services.map((service, i) => (
                  <div key={service.id} role="listitem">
                    <ServiceCard
                      service={service}
                      index={i}
                      onClick={() => setSelectedService(service)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── STATS ─── */}
          <section
            ref={statsRef}
            aria-label="احصاءات الشركة"
            className="py-20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}
          >
            <div className="glow-orb w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {stats.map((s, i) => (
                  <StatCard key={i} {...s} trigger={statsVisible} />
                ))}
              </div>
            </div>
          </section>

          {/* ─── PROCESS ─── */}
          <section aria-labelledby="process-heading" className="py-20"
            style={{ background: 'rgba(15,23,42,0.5)' }}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-14">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase block mb-3">— كيف نعمل</span>
                <h2 id="process-heading" className="text-4xl font-black text-white">منهجية العمل</h2>
                <p className="text-gray-400 mt-3">نتبع منهجية احترافية تضمن نجاح مشروعك</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6 relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-9 right-[12.5%] left-[12.5%] h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }} />
                {process.map((step, i) => (
                  <div key={i} className="text-center relative group">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-black font-mono relative z-10 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', boxShadow: '0 8px 25px rgba(59,130,246,0.3)' }}>
                      {step.num}
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-7">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── WHY US ─── */}
          <section aria-labelledby="why-heading" className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-14">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase block mb-3">— مميزاتنا</span>
                <h2 id="why-heading" className="text-4xl font-black text-white">لماذا تختار شركة السمام؟</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                    title: 'جودة لا تُضاهى',
                    desc: 'نلتزم بأعلى معايير الجودة في كل مشروع ونستخدم أفضل الممارسات العالمية',
                    color: '#3b82f6',
                  },
                  {
                    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
                    title: 'دعم فني 24/7',
                    desc: 'فريقنا متاح على مدار الساعة لحل أي مشكلة وضمان استمرارية عملك',
                    color: '#10b981',
                  },
                  {
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    title: 'تسليم في الموعد',
                    desc: 'نلتزم بالجداول الزمنية المتفق عليها دون المساس بجودة العمل',
                    color: '#f59e0b',
                  },
                ].map((item, i) => (
                  <div key={i} className="relative p-7 rounded-2xl group card-hover-line overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(59,130,246,0.12)' }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      <svg className="w-7 h-7" fill="none" stroke={item.color} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SEO TEXT SECTION ─── */}
          <section
            aria-labelledby="seo-section-heading"
            className="py-20"
            style={{ background: 'rgba(15,23,42,0.5)', borderTop: '1px solid rgba(59,130,246,0.08)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
          >
            <div className="container mx-auto px-6 max-w-4xl">
              <h2 id="seo-section-heading" className="text-3xl font-black text-white mb-6">
                خدمات شركة السمام للتطوير التقني
              </h2>
              <p className="text-gray-400 leading-9 mb-6">
                تقدم شركة السمام <strong className="text-gray-300">Alssemam</strong> مجموعة متكاملة من خدمات تطوير مواقع الويب
                وتطبيقات المحمول والحلول الرقمية الحديثة، حيث نساعد الشركات والمؤسسات على التحول الرقمي
                وتحقيق نمو فعلي في أعمالهم عبر الإنترنت.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                لماذا تحتاج إلى خدمات تطوير مواقع وتطبيقات؟
              </h3>
              <p className="text-gray-400 leading-9 mb-6">
                في العصر الرقمي، أصبح وجود موقع إلكتروني أو تطبيق موبايل أمراً أساسياً لأي نشاط تجاري.
                يساعدك الموقع في الوصول إلى عملائك بسهولة، بينما يمنحك التطبيق تجربة مستخدم متقدمة
                تزيد من ولاء العملاء وتعزز معدلات التحويل.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-5">
                مميزات خدمات شركة السمام
              </h3>
              <ul className="space-y-3 text-gray-400 mb-8">
                {[
                  'تصميم احترافي متوافق مع جميع الأجهزة والشاشات',
                  'تحسين SEO متقدم لظهور الموقع في نتائج جوجل الأولى',
                  'سرعة تحميل عالية وأداء ممتاز وفق معايير Core Web Vitals',
                  'أمان عالي وحماية البيانات ومعايير OWASP',
                  'دعم فني مستمر بعد التسليم مع SLA مضمون',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                خدماتنا في الذكاء الاصطناعي
              </h3>
              <p className="text-gray-400 leading-9">
                نوفر حلول ذكاء اصطناعي متقدمة مثل Chatbots وربط المواقع مع ChatGPT و DeepSeek
                لإنشاء أنظمة ذكية تساعد في تحسين تجربة المستخدم وزيادة المبيعات وأتمتة خدمة العملاء
                مع دعم كامل للغة العربية.
              </p>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section aria-labelledby="faq-heading" className="py-20">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="text-center mb-14">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase block mb-3">— أسئلة شائعة</span>
                <h2 id="faq-heading" className="text-4xl font-black text-white">الأسئلة المتكررة</h2>
              </div>
              <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                    style={{ border: `1px solid ${openFaq === i ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.12)'}`, background: 'rgba(15,23,42,0.7)' }}
                    itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                    <button
                      className="w-full flex items-center justify-between p-5 text-right"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-bold text-white" itemProp="name">{faq.q}</span>
                      <svg
                        className="w-5 h-5 text-blue-400 flex-shrink-0 transition-transform duration-300"
                        style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className="faq-answer"
                      style={{ maxHeight: openFaq === i ? '200px' : '0px', opacity: openFaq === i ? 1 : 0 }}
                      itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p className="px-5 pb-5 text-gray-400 text-sm leading-8" itemProp="text">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section aria-labelledby="cta-heading" className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f172a 100%)' }}>
            <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"
              style={{ background: 'radial-gradient(circle, #1d4ed8, transparent)' }} />
            <div className="container mx-auto px-6 text-center relative z-10">
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-black text-white mb-5">
                هل أنت جاهز لتحويل أعمالك رقمياً؟
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-8">
                تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 15px 40px rgba(59,130,246,0.4)' }}
                >
                  احصل على استشارة مجانية
                </Link>
                <Link
                  href="/portfolio"
                  className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  شاهد أعمالنا
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ─── SERVICE MODAL ─── */}
        {selectedService && (
          <div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelectedService(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="modal-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-custom rounded-2xl"
              style={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.25)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal top gradient */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${selectedService.color} rounded-t-2xl`} />

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center`}
                      style={{ boxShadow: `0 8px 25px ${selectedService.accent}40` }}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={selectedService.iconPath} />
                      </svg>
                    </div>
                    <div>
                      <h2 id="modal-title" className="text-2xl font-black text-white">{selectedService.title}</h2>
                      <span className="text-sm font-mono text-gray-500">{selectedService.subtitle}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
                    aria-label="اغلق"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-400 leading-8 mb-7">{selectedService.longDesc}</p>

                <div className="mb-7">
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">المميزات الرئيسية</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedService.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg text-sm"
                        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke={selectedService.accent} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-7">
                  <div className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">السعر التقديري</p>
                      <p className="font-bold text-emerald-400 text-sm">{selectedService.price}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">مدة التنفيذ</p>
                      <p className="font-bold text-blue-400 text-sm">{selectedService.time}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
                  style={{ background: `linear-gradient(135deg, ${selectedService.accent}cc, ${selectedService.accent})`, boxShadow: `0 12px 35px ${selectedService.accent}35` }}
                >
                  اطلب هذه الخدمة الآن
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}