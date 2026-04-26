'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaQuestionCircle, 
  FaLightbulb,
  FaCode,
  FaMobile,
  FaCloud,
  FaPaintBrush,
  FaShoppingCart,
  FaRobot,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaShieldAlt,
  FaRocket,
  FaStar,
  FaTrophy,
  FaUsers,
  FaGlobe
} from 'react-icons/fa';

const faqs = [
  {
    id: 1,
    question: "ما هي خدمات شركة السمام؟",
    answer: "السمام تقدم 6 خدمات رئيسية متكاملة: تطوير مواقع الويب باستخدام أحدث تقنيات React و Next.js، تطبيقات المحمول لنظامي Android و iOS، الحلول السحابية المتكاملة على AWS و Azure و Cloudflare، تصميم واجهات المستخدم UX/UI الاحترافية، المتاجر الإلكترونية المتطورة، وحلول الذكاء الاصطناعي وتعلم الآلة.",
    icon: <FaCode size={24} className="text-blue-500" />
  },
  {
    id: 2,
    question: "كم تكلفة تطوير موقع أو تطبيق؟",
    answer: "تختلف التكلفة حسب حجم المشروع ومتطلباته. نقدم عروضاً مخصصة لكل عميل بعد دراسة احتياجاته. بشكل عام، المواقع البسيطة تبدأ من 500$، التطبيقات المتكاملة من 1000$، الحلول السحابية من 200$ شهرياً. للاستفسار، يرجى التواصل معنا على info@alssemam.com أو واتساب +967715122500 للحصول على عرض سعر مجاني.",
    icon: <FaLightbulb size={24} className="text-yellow-500" />
  },
  {
    id: 3,
    question: "كم تستغرق مدة تنفيذ المشروع؟",
    answer: "تختلف مدة التنفيذ حسب حجم المشروع: المواقع البسيطة 2-4 أسابيع، المواقع المتوسطة 1-2 شهر، التطبيقات المتكاملة 2-3 أشهر، المشاريع الكبيرة 3-6 أشهر. نلتزم بالجداول الزمنية المتفق عليها مع عملائنا، ونقدم تقارير أسبوعية عن التقدم.",
    icon: <FaClock size={24} className="text-green-500" />
  },
  {
    id: 4,
    question: "هل تقدمون خدمات دعم فني بعد التسليم؟",
    answer: "نعم، نقدم حزمة دعم فني شاملة لمدة 3 أشهر مجاناً بعد تسليم المشروع، وتشمل: إصلاح الأخطاء البرمجية، تحديثات أمنية دورية، دعم فني عبر الواتساب والبريد الإلكتروني على مدار الساعة، وضمان جودة الأداء. يمكن تمديد فترة الدعم حسب رغبة العميل.",
    icon: <FaShieldAlt size={24} className="text-purple-500" />
  },
  {
    id: 5,
    question: "ما هي التقنيات التي تستخدمونها؟",
    answer: "نستخدم أحدث التقنيات في السوق: React.js و Next.js و Vue.js لتطوير الواجهات الأمامية، Node.js و Laravel و Django للخلفية، React Native و Flutter و Kotlin لتطبيقات الموبايل، MongoDB و PostgreSQL و MySQL لقواعد البيانات، AWS و Azure و Cloudflare للاستضافة السحابية، TensorFlow و LangChain للذكاء الاصطناعي.",
    icon: <FaRocket size={24} className="text-red-500" />
  },
  {
    id: 6,
    question: "كيف أتواصل مع فريق السمام؟",
    answer: "يمكنك التواصل معنا عبر عدة قنوات: البريد الإلكتروني info@alssemam.com، واتساب +967715122500، أو عبر منصات التواصل الاجتماعي Instagram و X و Facebook و LinkedIn و TikTok و YouTube. فريقنا يرد على جميع الاستفسارات خلال 24 ساعة كحد أقصى.",
    icon: <FaWhatsapp size={24} className="text-green-500" />
  },
  {
    id: 7,
    question: "هل تعملون في اليمن والسعودية فقط؟",
    answer: "نعمل مع عملاء من جميع أنحاء العالم، لكننا نركز بشكل خاص على السوقين اليمني والسعودي. نقدم خدماتنا عن بعد وبشكل كامل عبر الإنترنت، مع إمكانية الاجتماعات عبر Zoom أو Google Meet أو Teams. لدينا عملاء في الإمارات ومصر والأردن وأوروبا وأمريكا.",
    icon: <FaGlobe size={24} className="text-blue-400" />
  },
  {
    id: 8,
    question: "ما هي ضمانات الجودة التي تقدمونها؟",
    answer: "نقدم ضماناً لمدة سنة كاملة على جميع المشاريع ضد الأخطاء البرمجية، مع تحديثات أمنية دورية، ونسخ احتياطي يومي للبيانات، وسرعة استجابة قصوى للدعم الفني لا تتجاوز 24 ساعة. كما نقدم ضمان استرداد الأموال إذا لم تكن راضياً عن الخدمة خلال أول 30 يوماً.",
    icon: <FaTrophy size={24} className="text-yellow-500" />
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AIReadyFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFaqs(
      faqs.filter(faq => 
        faq.question.toLowerCase().includes(term) || 
        faq.answer.toLowerCase().includes(term)
      )
    );
  };

  // Schema Markup للذكاء الاصطناعي
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <FaQuestionCircle className="text-blue-600 dark:text-blue-400" size={16} />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">الأسئلة الشائعة</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              إجابات على أسئلتكم
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              نقدم إجابات شاملة لأكثر الأسئلة شيوعاً حول خدمات السمام
            </p>
          </motion.div>

          {/* شريط البحث */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <FaQuestionCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </motion.div>

          {/* قائمة الأسئلة */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            {filteredFaqs.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة لبحثك</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  عرض جميع الأسئلة
                </button>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  className="mb-4"
                >
                  <motion.button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-right p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
                        {faq.icon}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openIndex === index ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl border-t border-gray-100 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* قسم اتصل بنا */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              لم تجد إجابة لسؤالك؟
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:info@alssemam.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <FaEnvelope size={18} />
                <span>info@alssemam.com</span>
              </a>
              <a
                href="https://wa.me/967715122500"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <FaWhatsapp size={18} />
                <span>واتساب</span>
              </a>
              <a
                href="tel:+967715122500"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <FaPhone size={18} />
                <span>اتصال مباشر</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AIReadyFAQ;
