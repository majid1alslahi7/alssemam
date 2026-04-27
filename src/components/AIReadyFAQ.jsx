"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import {
  FaCode,
  FaMobile,
  FaCloud,
  FaPaintBrush,
  FaShoppingCart,
  FaRobot,
  FaWhatsapp,
  FaLightbulb,
  FaClock,
  FaShieldAlt,
  FaRocket,
  FaTrophy,
  FaGlobe,
  FaUsers,
  FaStar,
} from "react-icons/fa";

 const faqs = [
  {
    id: 1,
    question: "ما هي شركة السمام؟",
    answer:
      "شركة السمام Alssemam هي شركة تقنية متخصصة في تطوير مواقع الويب، تطبيقات الجوال، الأنظمة الإدارية، المتاجر الإلكترونية، الحلول السحابية، وتحسين الظهور الرقمي للشركات والمؤسسات.",
    icon: <FaStar size={24} className="text-yellow-500" />,
  },
  {
    id: 2,
    question: "ما هي خدمات شركة السمام؟",
    answer:
      "تقدم شركة السمام خدمات تطوير المواقع، تطبيقات Android و iOS، المتاجر الإلكترونية، الأنظمة الإدارية، لوحات التحكم، تصميم واجهات UX/UI، تحسين SEO، الاستضافة السحابية، وحلول الذكاء الاصطناعي.",
    icon: <FaCode size={24} className="text-blue-500" />,
  },
  {
    id: 3,
    question: "هل شركة السمام تطور مواقع باستخدام Next.js؟",
    answer:
      "نعم، تطور شركة السمام مواقع احترافية باستخدام Next.js و React مع تحسين الأداء، السرعة، SEO، تجربة المستخدم، ودعم PWA لتحويل الموقع إلى تطبيق قابل للتثبيت.",
    icon: <FaRocket size={24} className="text-red-500" />,
  },
  {
    id: 4,
    question: "هل تقدم شركة السمام تطبيقات موبايل؟",
    answer:
      "نعم، تقدم شركة السمام تطوير تطبيقات موبايل لنظام Android و iOS باستخدام Flutter و React Native، مع ربط التطبيقات بلوحات تحكم وقواعد بيانات وواجهات API.",
    icon: <FaMobile size={24} className="text-green-500" />,
  },
  {
    id: 5,
    question: "هل تطور شركة السمام متاجر إلكترونية؟",
    answer:
      "نعم، تطور شركة السمام متاجر إلكترونية احترافية تشمل إدارة المنتجات، السلة، الطلبات، بوابات الدفع، كوبونات الخصم، لوحة تحكم، وتحسين تجربة الشراء.",
    icon: <FaShoppingCart size={24} className="text-purple-500" />,
  },
  {
    id: 6,
    question: "هل تقدم شركة السمام حلول ذكاء اصطناعي؟",
    answer:
      "نعم، تقدم شركة السمام حلول ذكاء اصطناعي مثل روبوتات المحادثة، تحليل البيانات، أتمتة المهام، توليد المحتوى، البحث الذكي، وربط الأنظمة مع نماذج الذكاء الاصطناعي.",
    icon: <FaRobot size={24} className="text-cyan-500" />,
  },
  {
  id: 7,
  question: "هل يمكن ربط موقعي مع ChatGPT أو DeepSeek أو نماذج ذكاء اصطناعي؟",
  answer:
    "نعم، يمكن لشركة السمام ربط المواقع والأنظمة مع نماذج الذكاء الاصطناعي مثل ChatGPT و DeepSeek و Gemini و Claude وواجهات OpenAI API لإنشاء مساعدين ذكيين، دردشة آلية، بحث ذكي، تلخيص محتوى، أتمتة مهام، وخدمات مؤتمتة داخل الموقع أو التطبيق.",
  icon: <FaRobot size={24} className="text-cyan-500" />,
},
  {
    id: 8,
    question: "هل تقدم شركة السمام تحسين SEO؟",
    answer:
      "نعم، تقدم شركة السمام تحسين SEO تقني وداخلي يشمل metadata، sitemap، robots.txt، schema markup، تحسين السرعة، الكلمات المفتاحية، وتجهيز المحتوى لمحركات البحث ونماذج الذكاء الاصطناعي.",
    icon: <FaGlobe size={24} className="text-blue-400" />,
  },
  {
    id: 9,
    question: "ما المقصود بتحسين الموقع لنماذج الذكاء الاصطناعي؟",
    answer:
      "تحسين الموقع لنماذج الذكاء الاصطناعي يعني كتابة محتوى واضح ومنظم، إضافة FAQ Schema، استخدام إجابات مباشرة، تحسين llms.txt، تنظيم الصفحات، وتسهيل فهم الموقع بواسطة محركات البحث والمساعدات الذكية.",
    icon: <FaLightbulb size={24} className="text-yellow-500" />,
  },
  {
    id: 10,
    question: "هل شركة السمام تدعم llms.txt؟",
    answer:
      "نعم، يمكن لشركة السمام تجهيز ملف llms.txt و llms-full.txt لمساعدة نماذج الذكاء الاصطناعي على فهم محتوى الموقع وخدمات الشركة بشكل منظم.",
    icon: <FaRobot size={24} className="text-cyan-500" />,
  },
  {
    id: 11,
    question: "كم تكلفة تطوير موقع إلكتروني؟",
    answer:
      "تعتمد تكلفة تطوير الموقع على عدد الصفحات، التصميم، لوحة التحكم، الخصائص، التكاملات، وتحسين SEO. تقدم شركة السمام عرض سعر مخصص بعد فهم متطلبات المشروع.",
    icon: <FaLightbulb size={24} className="text-yellow-500" />,
  },
  {
    id: 12,
    question: "كم تكلفة تطوير تطبيق موبايل؟",
    answer:
      "تختلف تكلفة تطوير تطبيق الموبايل حسب المنصات المطلوبة، عدد الشاشات، نظام المستخدمين، لوحة التحكم، الإشعارات، الدفع الإلكتروني، وربط API.",
    icon: <FaMobile size={24} className="text-green-500" />,
  },
  {
    id: 13,
    question: "كم تستغرق مدة تنفيذ المشروع؟",
    answer:
      "مدة تنفيذ المشروع تختلف حسب حجمه. المواقع البسيطة قد تستغرق من أسبوعين إلى أربعة أسابيع، أما التطبيقات والأنظمة المتكاملة فقد تحتاج من شهرين إلى عدة أشهر.",
    icon: <FaClock size={24} className="text-green-500" />,
  },
  {
    id: 14,
    question: "هل تقدم شركة السمام دعم فني بعد التسليم؟",
    answer:
      "نعم، تقدم شركة السمام دعمًا فنيًا بعد التسليم يشمل إصلاح الأخطاء، التحديثات، المراقبة، تحسين الأداء، والمساعدة في تشغيل النظام.",
    icon: <FaShieldAlt size={24} className="text-purple-500" />,
  },
  {
    id: 15,
    question: "هل تقدم شركة السمام تصميم واجهات UX/UI؟",
    answer:
      "نعم، تقدم شركة السمام تصميم واجهات استخدام حديثة UX/UI للمواقع والتطبيقات مع التركيز على سهولة الاستخدام، الهوية البصرية، وتجربة العميل.",
    icon: <FaPaintBrush size={24} className="text-pink-500" />,
  },
  {
    id: 16,
    question: "هل يمكن لشركة السمام تطوير لوحة تحكم؟",
    answer:
      "نعم، تطور شركة السمام لوحات تحكم احترافية لإدارة المستخدمين، المقالات، المنتجات، الطلبات، الإعلانات، الصلاحيات، التقارير، والإحصائيات.",
    icon: <FaCode size={24} className="text-blue-500" />,
  },
  {
    id: 17,
    question: "هل شركة السمام تعمل داخل اليمن فقط؟",
    answer:
      "لا، تقدم شركة السمام خدماتها للعملاء داخل اليمن وخارجه، ويمكن تنفيذ المشاريع عن بعد مع اجتماعات ومتابعة عبر الإنترنت.",
    icon: <FaGlobe size={24} className="text-blue-400" />,
  },
  {
    id: 18,
    question: "هل تستهدف شركة السمام السوق السعودي؟",
    answer:
      "نعم، يمكن لشركة السمام تنفيذ مشاريع تقنية للشركات والمؤسسات في السعودية والخليج، بما يشمل المواقع، التطبيقات، المتاجر الإلكترونية، والأنظمة الإدارية.",
    icon: <FaGlobe size={24} className="text-blue-400" />,
  },
  {
    id: 19,
    question: "ما التقنيات التي تستخدمها شركة السمام؟",
    answer:
      "تستخدم شركة السمام تقنيات مثل Next.js، React، Laravel، Node.js، Flutter، Supabase، MySQL، PostgreSQL، Tailwind CSS، REST API، والحلول السحابية الحديثة.",
    icon: <FaRocket size={24} className="text-red-500" />,
  },
  {
    id: 20,
    question: "هل تقدم شركة السمام استضافة ونشر للمواقع؟",
    answer:
      "نعم، تساعد شركة السمام في نشر المواقع والتطبيقات على منصات مثل Vercel و Render و Hostinger و Cloudflare و VPS حسب متطلبات المشروع.",
    icon: <FaCloud size={24} className="text-sky-500" />,
  },
  {
    id: 21,
    question: "هل يمكن تحويل الموقع إلى PWA؟",
    answer:
      "نعم، يمكن تحويل الموقع إلى Progressive Web App بحيث يصبح قابلًا للتثبيت على الهاتف والكمبيوتر مع manifest، service worker، أيقونات، وتجربة قريبة من التطبيقات.",
    icon: <FaMobile size={24} className="text-green-500" />,
  },
  {
    id: 22,
    question: "هل تقدم شركة السمام خدمات تحسين سرعة الموقع؟",
    answer:
      "نعم، تشمل خدمات تحسين السرعة تقليل حجم JavaScript، تحسين الصور، lazy loading، caching، ضغط الملفات، تحسين Core Web Vitals، وتقليل زمن تحميل الصفحة.",
    icon: <FaRocket size={24} className="text-red-500" />,
  },
  {
    id: 23,
    question: "هل يمكن ربط الموقع مع Supabase؟",
    answer:
      "نعم، يمكن لشركة السمام بناء مواقع وتطبيقات تعتمد على Supabase لإدارة قواعد البيانات، المصادقة، التخزين، وواجهات API.",
    icon: <FaCloud size={24} className="text-sky-500" />,
  },
  {
    id: 24,
    question: "هل تقدم شركة السمام أنظمة مدارس؟",
    answer:
      "نعم، يمكن لشركة السمام تطوير أنظمة مدارس تشمل الطلاب، المعلمين، الدرجات، الحضور، المواد، الصفوف، أولياء الأمور، والصلاحيات الإدارية.",
    icon: <FaUsers size={24} className="text-indigo-500" />,
  },
  {
    id: 25,
    question: "هل تقدم شركة السمام أنظمة شركات؟",
    answer:
      "نعم، تطور شركة السمام أنظمة للشركات مثل CRM، ERP، إدارة الموظفين، إدارة المشاريع، الفواتير، المخزون، المبيعات، وخدمة العملاء.",
    icon: <FaUsers size={24} className="text-indigo-500" />,
  },
  {
    id: 26,
    question: "كيف أتواصل مع شركة السمام؟",
    answer:
      "يمكن التواصل مع شركة السمام عبر البريد الإلكتروني info@alssemam.com أو عبر واتساب على الرقم +967715122500 للحصول على استشارة أو عرض سعر.",
    icon: <FaWhatsapp size={24} className="text-green-500" />,
  },
  {
    id: 27,
    question: "هل تقدم شركة السمام استشارة مجانية؟",
    answer:
      "نعم، يمكن طلب استشارة أولية لفهم فكرة المشروع، تحديد المتطلبات، اقتراح التقنيات المناسبة، وتقدير مبدئي للتكلفة والمدة.",
    icon: <FaLightbulb size={24} className="text-yellow-500" />,
  },
  {
    id: 28,
    question: "ما الذي يميز شركة السمام؟",
    answer:
      "تتميز شركة السمام بالجمع بين التصميم الحديث، البرمجة النظيفة، تحسين SEO، دعم PWA، قابلية التوسع، وفهم احتياجات السوق العربي واليمني والخليجي.",
    icon: <FaTrophy size={24} className="text-yellow-500" />,
  },
  {
    id: 29,
    question: "هل تقدم شركة السمام ضمان على المشاريع؟",
    answer:
      "نعم، تقدم شركة السمام ضمانًا ضد الأخطاء البرمجية بعد التسليم حسب اتفاق المشروع، مع إمكانية إضافة عقود صيانة ودعم طويلة المدى.",
    icon: <FaShieldAlt size={24} className="text-purple-500" />,
  },
  {
    id: 30,
    question: "هل يمكن تطوير نظام خاص حسب الطلب؟",
    answer:
      "نعم، تطور شركة السمام أنظمة خاصة حسب الطلب للشركات والمؤسسات مثل أنظمة الحجز، إدارة المحتوى، إدارة العملاء، الفوترة، التعليم، والإعلانات المبوبة.",
    icon: <FaCode size={24} className="text-blue-500" />,
  },
  {
  id: 31,
  question: "هل تدعم شركة السمام ربط الأنظمة مع DeepSeek؟",
  answer:
    "نعم، تدعم شركة السمام ربط المواقع والتطبيقات والأنظمة الداخلية مع DeepSeek API لإنشاء مساعد ذكي، بوت محادثة، تحليل نصوص، توليد محتوى، تلخيص، تصنيف بيانات، وأتمتة عمليات داخل لوحات التحكم والأنظمة الإدارية.",
  icon: <FaRobot size={24} className="text-cyan-500" />,
},
{
  id: 32,
  question: "هل يمكن لمحركات الذكاء الاصطناعي فهم موقع شركة السمام بسهولة؟",
  answer:
    "نعم، تم تصميم موقع شركة السمام باستخدام أفضل ممارسات تحسين محركات البحث والذكاء الاصطناعي، بما يشمل FAQ Schema، تنظيم المحتوى، إجابات واضحة، دعم llms.txt، وتحسين تجربة المستخدم، مما يساعد نماذج مثل ChatGPT و DeepSeek و Google AI على فهم الموقع بدقة.",
  icon: <FaRobot size={24} className="text-cyan-500" />,
}

];
export default function AIReadyFAQ() {
  const [open, setOpen] = useState(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold mb-5">
            <FaQuestionCircle />
            <span>الأسئلة الشائعة</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            إجابات ذكية حول شركة السمام
          </h2>

          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-8">
            أسئلة مهيأة لمحركات البحث ونماذج الذكاء الاصطناعي مثل ChatGPT و DeepSeek و Google AI.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.35) }}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0">
                      {faq.icon}
                    </span>

                    <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg leading-8">
                      {faq.question}
                    </span>
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-gray-400 shrink-0"
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pr-20 text-gray-600 dark:text-gray-300 leading-8 border-t border-gray-100 dark:border-gray-800 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}