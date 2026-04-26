'use client';
import { useEffect, useState } from 'react';
import { 
  FaBullseye, FaUsers, FaRocket, FaHeadset, FaCheckCircle, 
  FaTrophy, FaHandshake, FaLightbulb, FaChartLine, FaSmile, 
  FaStar, FaCalendarAlt, FaBuilding, FaGlobe
} from 'react-icons/fa';

export default function AboutPage() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const animateNumbers = () => {
      const targets = { projects: 50, clients: 30, experience: 5, satisfaction: 100 };
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setStats(targets);
          clearInterval(timer);
        } else {
          setStats({
            projects: Math.floor(targets.projects * currentStep / steps),
            clients: Math.floor(targets.clients * currentStep / steps),
            experience: Math.floor(targets.experience * currentStep / steps),
            satisfaction: Math.floor(targets.satisfaction * currentStep / steps)
          });
        }
      }, stepTime);
    };
    animateNumbers();
  }, []);

  const values = [
    { icon: <FaBullseye size={32} />, title: 'رؤية واضحة', desc: 'مستقبل رقمي متكامل لعملائنا', color: 'from-blue-500 to-blue-600' },
    { icon: <FaUsers size={32} />, title: 'فريق مبدع', desc: 'خبراء في أحدث التقنيات', color: 'from-green-500 to-green-600' },
    { icon: <FaRocket size={32} />, title: 'تقنيات حديثة', desc: 'نواكب أحدث التطورات', color: 'from-purple-500 to-purple-600' },
    { icon: <FaHeadset size={32} />, title: 'دعم متواصل', desc: 'خدمة عملاء على مدار الساعة', color: 'from-orange-500 to-orange-600' },
  ];

  const milestones = [
    { year: '2024', title: 'تأسيس الشركة', desc: 'انطلاق رحلة السَّمَام في عالم التقنية', icon: <FaHandshake size={24} /> },
    { year: '2025', title: 'أول 10 مشاريع', desc: 'إنجاز أول 10 مشاريع تقنية ناجحة', icon: <FaCheckCircle size={24} /> },
    { year: '2026', title: 'التوسع الإقليمي', desc: 'التوسع في الأسواق العربية', icon: <FaTrophy size={24} /> },
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95">
            السَّمَام.. سحابة التقنية التي تطلق أعمالكم
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              نحن شركة تقنية متخصصة في تطوير حلول الويب وتطبيقات الهواتف الذكية.
              نؤمن بأن التقنية الجيدة هي التي تجعل الحياة أسهل والأعمال أكثر نجاحاً.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              تأسست السَّمَام لتكون شريكك الموثوق في رحلة التحول الرقمي،
              نقدم حلولاً مبتكرة تساعد عملك على النمو والانتشار كالسحاب في السماء.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.projects}+</div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center gap-1"><FaChartLine size={14} /> مشروع منجز</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.clients}+</div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center gap-1"><FaSmile size={14} /> عميل سعيد</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.experience}+</div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center gap-1"><FaStar size={14} /> سنوات خبرة</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.satisfaction}%</div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center gap-1"><FaCheckCircle size={14} /> رضا العملاء</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">رحلة الإنجاز</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold mb-2">{item.year}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
