'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  FaCogs, FaMobile, FaCloud, FaPaintBrush, FaShoppingCart, FaRobot,
  FaCheckCircle, FaArrowLeft, FaArrowRight, FaClock, FaDollarSign,
  FaShieldAlt, FaTachometerAlt, FaUsers, FaHeadset
} from 'react-icons/fa';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      id: 1,
      icon: <FaCogs size={40} />, 
      title: 'تطوير مواقع الويب', 
      desc: 'مواقع حديثة وسريعة متوافقة مع SEO وأحدث المعايير',
      longDesc: 'نقدم خدمات تطوير مواقع الويب باستخدام أحدث التقنيات مثل React و Next.js و Node.js. نضمن لك موقعاً سريعاً وآمناً ومتوافقاً مع محركات البحث.',
      features: ['React/Next.js', 'SEO متقدم', 'أداء فائق', 'أمان عالي', 'تصميم متجاوب'],
      price: 'يبدأ من 500$',
      time: '2-4 أسابيع'
    },
    { 
      id: 2,
      icon: <FaMobile size={40} />, 
      title: 'تطبيقات المحمول', 
      desc: 'تطبيقات Android و iOS احترافية بتقنيات حديثة',
      longDesc: 'نطور تطبيقات موبايل احترافية لنظامي Android و iOS باستخدام React Native و Flutter. تجربة مستخدم ممتازة وأداء عالي.',
      features: ['React Native', 'Flutter', 'تجربة مستخدم ممتازة', 'أداء عالي', 'تكامل مع APIs'],
      price: 'يبدأ من 1000$',
      time: '4-8 أسابيع'
    },
    { 
      id: 3,
      icon: <FaCloud size={40} />, 
      title: 'الحلول السحابية', 
      desc: 'استضافة وحلول سحابية آمنة وقابلة للتوسع',
      longDesc: 'نقدم حلولاً سحابية متكاملة باستخدام AWS و Azure و Cloudflare. استضافة آمنة وقابلة للتوسع مع دعم فني على مدار الساعة.',
      features: ['AWS/Azure', 'أمان عالي', 'توسع مرن', 'دعم 24/7', 'نسخ احتياطي يومي'],
      price: 'يبدأ من 200$ شهرياً',
      time: '1-2 أسابيع'
    },
    { 
      id: 4,
      icon: <FaPaintBrush size={40} />, 
      title: 'تصميم واجهات UX/UI', 
      desc: 'تصاميم جذابة وتجربة مستخدم ممتازة',
      longDesc: 'نصمم واجهات مستخدم جذابة وسهلة الاستخدام باستخدام Figma و Adobe XD. نضمن تجربة مستخدم ممتازة تزيد من تفاعل الزوار.',
      features: ['Figma', 'Adobe XD', 'تصميم متجاوب', 'سهولة الاستخدام', 'نماذج تفاعلية'],
      price: 'يبدأ من 300$',
      time: '1-3 أسابيع'
    },
    { 
      id: 5,
      icon: <FaShoppingCart size={40} />, 
      title: 'متاجر إلكترونية', 
      desc: 'حلول متكاملة للتجارة الإلكترونية',
      longDesc: 'نطور متاجر إلكترونية متكاملة باستخدام Shopify و WooCommerce. نظام دفع آمن وإدارة مخزون وتقارير متقدمة.',
      features: ['مدفوعات آمنة', 'إدارة مخزون', 'تقارير متقدمة', 'تكامل مع الشحن', 'خصومات وكوبونات'],
      price: 'يبدأ من 800$',
      time: '3-6 أسابيع'
    },
    { 
      id: 6,
      icon: <FaRobot size={40} />, 
      title: 'الذكاء الاصطناعي', 
      desc: 'دمج تقنيات الذكاء الاصطناعي في مشاريعك',
      longDesc: 'نقدم حلول الذكاء الاصطناعي مثل Chatbots وتحليل البيانات وتوصيات ذكية. نستخدم أحدث تقنيات AI لتحسين أعمالك.',
      features: ['Chatbots', 'تحليل بيانات', 'توصيات ذكية', 'معالجة اللغة العربية', 'تعلم آلة'],
      price: 'يبدأ من 1500$',
      time: '4-8 أسابيع'
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدماتنا</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95">
            نقدم مجموعة متكاملة من الخدمات التقنية لتنمية أعمالكم
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="p-6">
                  <div className="text-blue-600 dark:text-blue-400 mb-4 transform group-hover:scale-110 transition">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition">
                    اعرف المزيد <FaArrowLeft size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-blue-600 dark:text-blue-400">{selectedService.icon}</div>
                <button onClick={() => setSelectedService(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedService.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedService.longDesc}</p>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">المميزات:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedService.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <FaCheckCircle className="text-green-500" size={14} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">السعر</p>
                    <p className="font-semibold">{selectedService.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">مدة التنفيذ</p>
                    <p className="font-semibold">{selectedService.time}</p>
                  </div>
                </div>
              </div>

              <Link href="/contact" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition">
                اطلب الخدمة الآن
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار شركة السمام؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <FaTachometerAlt size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">جودة عالية</h3>
              <p className="text-gray-600 dark:text-gray-300">نضمن لك أفضل جودة في التنفيذ</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <FaHeadset size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">دعم فني</h3>
              <p className="text-gray-600 dark:text-gray-300">دعم فني على مدار الساعة</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <FaShieldAlt size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">تسليم في الوقت</h3>
              <p className="text-gray-600 dark:text-gray-300">نلتزم بالجداول الزمنية المتفق عليها</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
