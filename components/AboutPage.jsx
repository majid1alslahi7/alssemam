'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FaBullseye, FaUsers, FaRocket, FaHeadset, FaCheckCircle,
  FaTrophy, FaHandshake, FaChartLine, FaSmile,
  FaStar, FaHome, FaChevronLeft,
} from 'react-icons/fa';

/* ============================================================
   Counter Hook — only animates when element enters viewport
   ============================================================ */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const stepTime = 20;
    const steps = duration / stepTime;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(target * currentStep / steps));
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/* ============================================================
   StatCard
   ============================================================ */
function StatCard({ target, suffix, label, icon: Icon, index }) {
  const { count, ref } = useCountUp(target);

  return (
    <div
      ref={ref}
      className="text-center group"
      style={{ animationDelay: `${index * 150}ms` }}
      itemProp="description"
    >
      <div
        className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums"
        aria-label={`${target}${suffix} ${label}`}
      >
        {count}
        <span className="text-3xl">{suffix}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-3 flex items-center justify-center gap-2 font-medium">
        <Icon size={15} aria-hidden="true" />
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   ValueCard
   ============================================================ */
function ValueCard({ icon: Icon, title, desc, color, index }) {
  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-7 text-center
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl
                     flex items-center justify-center text-white mx-auto mb-5
                     group-hover:scale-110 transition-transform duration-300 shadow-lg`}
        aria-hidden="true"
      >
        <Icon size={30} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </article>
  );
}

/* ============================================================
   MilestoneCard
   ============================================================ */
function MilestoneCard({ year, title, desc, icon: Icon, index, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* connector line between cards */}
      {!isLast && (
        <div
          className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-white/20"
          aria-hidden="true"
        />
      )}
      <div
        className="relative w-16 h-16 bg-white/20 rounded-full flex items-center justify-center
                     mb-5 border-2 border-white/30 shadow-lg z-10"
        aria-hidden="true"
      >
        <Icon size={24} className="text-white" />
      </div>
      <time
        dateTime={`${year}-01-01`}
        className="text-3xl font-extrabold text-yellow-300 mb-2 block"
      >
        {year}
      </time>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
}

/* ============================================================
   Main Client Component
   ============================================================ */
export default function AboutPage() {
  const stats = [
    { target: 50, suffix: '+', label: 'مشروع منجز',   icon: FaChartLine  },
    { target: 30, suffix: '+', label: 'عميل سعيد',     icon: FaSmile      },
    { target: 5,  suffix: '+', label: 'سنوات خبرة',    icon: FaStar       },
    { target: 100, suffix: '%', label: 'رضا العملاء',  icon: FaCheckCircle },
  ];

  const values = [
    { icon: FaBullseye, title: 'رؤية واضحة',  desc: 'مستقبل رقمي متكامل لعملائنا بأعلى معايير الجودة',         color: 'from-blue-500 to-blue-600'   },
    { icon: FaUsers,   title: 'فريق مبدع',    desc: 'خبراء ومختصون في أحدث التقنيات والأدوات الحديثة',         color: 'from-green-500 to-green-600'  },
    { icon: FaRocket,  title: 'تقنيات حديثة', desc: 'نواكب أحدث التطورات التقنية لتقديم أفضل الحلول',           color: 'from-purple-500 to-purple-600' },
    { icon: FaHeadset, title: 'دعم متواصل',   desc: 'خدمة عملاء متميزة على مدار الساعة طوال أيام الأسبوع',    color: 'from-orange-500 to-orange-600' },
  ];

  const milestones = [
    { year: '2024', title: 'تأسيس الشركة',     desc: 'انطلاق رحلة شركة السمام في عالم التقنية من صنعاء، اليمن', icon: FaHandshake },
    { year: '2025', title: 'أول 10 مشاريع',   desc: 'إنجاز أول 10 مشاريع تقنية ناجحة لعملاء في اليمن والسعودية', icon: FaCheckCircle },
    { year: '2026', title: 'التوسع الإقليمي', desc: 'التوسع في الأسواق العربية وإطلاق منصات تقنية متكاملة',      icon: FaTrophy    },
  ];

  return (
    <main
      id="main-content"
      className="pt-24 pb-16"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      {/* ─── Breadcrumb ─── */}
      <nav
        aria-label="مسار التنقل"
        className="container mx-auto px-4 py-3"
      >
        <ol
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
              itemProp="item"
            >
              <FaHome size={12} aria-hidden="true" />
              <span itemProp="name">الرئيسية</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true"><FaChevronLeft size={10} /></li>
          <li
            aria-current="page"
            itemScope
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
          >
            <span itemProp="name" className="text-blue-600 font-medium">من نحن</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* ─── Hero ─── */}
      <section
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900
                     text-white py-24 overflow-hidden"
        aria-label="مقدمة الصفحة"
      >
        {/* decorative blobs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative container mx-auto px-4 text-center">
          {/* decorative icon as SVG — no emoji */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              width="72"
              height="72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path
                d="M20 38 C20 28 44 28 44 38"
                stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"
              />
              <circle cx="32" cy="22" r="7" fill="white" fillOpacity="0.85" />
              <circle cx="18" cy="30" r="4" fill="white" fillOpacity="0.5" />
              <circle cx="46" cy="30" r="4" fill="white" fillOpacity="0.5" />
            </svg>
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight"
            itemProp="name"
          >
            من نحن
          </h1>
          <p
            className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-100 leading-relaxed"
            itemProp="description"
          >
            شركة السمام — سحابة التقنية التي تطلق أعمالكم
          </p>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 30C840 36 960 40 1080 44C1200 48 1320 52 1380 54L1440 56V80H0Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section
        className="py-20"
        aria-labelledby="story-heading"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="name" content="شركة السمام للحلول التقنية" />
        <meta itemProp="foundingDate" content="2024" />
        <meta itemProp="url" content="https://www.alssemam.com" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300
                             text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
              قصتنا
            </span>
            <h2
              id="story-heading"
              className="text-3xl md:text-4xl font-extrabold mb-8"
            >
              رحلتنا في عالم التقنية
            </h2>
            <div className="space-y-5 text-lg text-gray-600 dark:text-gray-300 leading-loose" itemProp="description">
              <p>
                نحن شركة <strong className="text-gray-900 dark:text-white">السمام للحلول التقنية</strong>،
                متخصصون في تطوير حلول الويب وتطبيقات الهواتف الذكية. نؤمن بأن التقنية الجيدة
                هي التي تجعل الحياة أسهل والأعمال أكثر نجاحاً وازدهاراً.
              </p>
              <p>
                تأسست شركة السمام لتكون شريكك الموثوق في رحلة التحول الرقمي،
                نقدم حلولاً مبتكرة تساعد عملك على النمو والانتشار كالسحاب في السماء —
                بلا حدود، بلا قيود.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href="/services"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl
                           font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/30
                           hover:-translate-y-0.5"
              >
                استكشف خدماتنا
              </Link>
              <Link
                href="/contact"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-semibold
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section
        className="bg-gray-50 dark:bg-gray-800/60 py-20 border-y border-gray-100 dark:border-gray-700/50"
        aria-labelledby="stats-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="stats-heading" className="sr-only">إحصائيات شركة السمام</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <StatCard key={i} index={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section
        className="py-20"
        aria-labelledby="values-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700
                             dark:text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              قيمنا
            </span>
            <h2
              id="values-heading"
              className="text-3xl md:text-4xl font-extrabold"
            >
              ما يميزنا عن غيرنا
            </h2>
          </div>

          <ul
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
            aria-label="قيم الشركة"
          >
            {values.map((v, i) => (
              <li key={i} role="listitem">
                <ValueCard index={i} {...v} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Milestones ─── */}
      <section
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900
                     text-white py-20 overflow-hidden"
        aria-labelledby="milestones-heading"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold
                             px-4 py-1.5 rounded-full mb-4">
              رحلة الإنجاز
            </span>
            <h2
              id="milestones-heading"
              className="text-3xl md:text-4xl font-extrabold"
            >
              محطات النجاح
            </h2>
          </div>

          {/* Timeline line */}
          <div className="relative">
            <div
              className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-white/20 z-0"
              aria-hidden="true"
            />
            <ol
              className="grid md:grid-cols-3 gap-12 relative z-10"
              aria-label="مراحل تطور الشركة"
            >
              {milestones.map((m, i) => (
                <li key={i}>
                  <MilestoneCard {...m} index={i} isLast={i === milestones.length - 1} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section
        className="py-20"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl
                         p-10 md:p-14 text-center text-white shadow-2xl
                         shadow-blue-500/20 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%)',
                backgroundSize: '60px 60px',
                backgroundPosition: '0 0, 30px 30px',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2
                id="cta-heading"
                className="text-3xl md:text-4xl font-extrabold mb-4"
              >
                هل أنت مستعد للتحول الرقمي؟
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                انضم إلى أكثر من 30 عميل يثقون بخبرتنا. ابدأ مشروعك اليوم معنا.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 py-4
                             rounded-2xl transition-all duration-200 shadow-xl hover:shadow-white/20
                             hover:-translate-y-0.5"
                >
                  ابدأ مشروعك الآن
                </Link>
                <Link
                  href="/services"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30
                             font-semibold px-10 py-4 rounded-2xl transition-all duration-200"
                >
                  استكشف خدماتنا
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ (visible for users + SEO) ─── */}
      <section
        className="py-12 bg-gray-50 dark:bg-gray-800/40"
        aria-labelledby="faq-heading"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <h2
            id="faq-heading"
            className="text-2xl font-extrabold text-center mb-10"
          >
            الأسئلة الشائعة
          </h2>
          <dl className="space-y-4">
            {[
              {
                q: 'متى تأسست شركة السمام؟',
                a: 'تأسست شركة السمام للحلول التقنية عام 2024 في صنعاء، اليمن.',
              },
              {
                q: 'ما هي خدمات شركة السمام؟',
                a: 'تقدم شركة السمام خدمات تطوير مواقع الويب، تطبيقات الهواتف الذكية، الحلول السحابية، تصميم واجهات المستخدم، المتاجر الإلكترونية، وحلول الذكاء الاصطناعي.',
              },
              {
                q: 'كم عدد المشاريع التي أنجزتها شركة السمام؟',
                a: 'أنجزت شركة السمام أكثر من 50 مشروعاً تقنياً ناجحاً لأكثر من 30 عميل.',
              },
              {
                q: 'أين تتواجد شركة السمام؟',
                a: 'تتواجد شركة السمام في صنعاء، اليمن والرياض، المملكة العربية السعودية، وتخدم عملاءها في جميع أنحاء العالم العربي.',
              },
              {
                q: 'هل تقدم شركة السمام دعماً فنياً مستمراً؟',
                a: 'نعم، تقدم شركة السمام دعماً فنياً متواصلاً على مدار الساعة لجميع عملائها.',
              },
            ].map(({ q, a }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm
                           border border-gray-100 dark:border-gray-700"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <dt
                  className="font-bold text-gray-900 dark:text-white mb-2"
                  itemProp="name"
                >
                  {q}
                </dt>
                <dd
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}