'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, 
  FaTiktok, FaYoutube, FaWhatsapp, FaPhone, FaEnvelope, 
  FaHeart, FaPaperPlane, FaArrowUp, FaMapMarkerAlt 
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/alssemam', icon: <FaInstagram size={20} />, color: '#E4405F' },
    { name: 'Facebook', url: 'https://facebook.com/alssemam', icon: <FaFacebookF size={20} />, color: '#1877F2' },
    { name: 'X (Twitter)', url: 'https://twitter.com/alssemam', icon: <FaTwitter size={20} />, color: '#1DA1F2' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/alssemam', icon: <FaLinkedinIn size={20} />, color: '#0A66C2' },
    { name: 'TikTok', url: 'https://tiktok.com/@alssemam', icon: <FaTiktok size={20} />, color: '#000000' },
    { name: 'YouTube', url: 'https://youtube.com/@alssemam', icon: <FaYoutube size={20} />, color: '#FF0000' }
  ];

  const contactMethods = [
    { name: 'WhatsApp', url: 'https://wa.me/967715122500', icon: <FaWhatsapp size={18} />, value: '+967 715122500', color: '#25D366' },
    { name: 'اتصال هاتفي', url: 'tel:+967715122500', icon: <FaPhone size={18} />, value: '+967 715122500', color: '#34B7F1' },
    { name: 'البريد الإلكتروني', url: 'mailto:info@alssemam.com', icon: <FaEnvelope size={18} />, value: 'info@alssemam.com', color: '#EA4335' },
    { name: 'الموقع', icon: <FaMapMarkerAlt size={18} />, value: 'اليمن - صنعاء', color: '#FF6B6B' }
  ];

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الخدمات', path: '/services' },
    { name: 'من نحن', path: '/about' },
    { name: 'أعمالنا', path: '/portfolio' },
    { name: 'السمام نيوز', path: '/news' },
    { name: 'الإعلانات المبوبة', path: '/ads' },
    { name: 'اتصل بنا', path: '/contact' }
  ];

  const services = [
    { name: 'تطوير مواقع الويب', path: '/services' },
    { name: 'تطبيقات المحمول', path: '/services' },
    { name: 'الحلول السحابية', path: '/services' },
    { name: 'تصميم واجهات UX/UI', path: '/services' },
    { name: 'متاجر إلكترونية', path: '/services' }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('الرجاء إدخال البريد الإلكتروني');
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      toast.success('تم الاشتراك بنجاح! شكراً لك');
      setEmail('');
      setSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <Toaster position="top-center" />
      
      {/* النشرة البريدية */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">اشترك في نشرتنا البريدية</h3>
                <p className="text-blue-100 text-sm md:text-base">احصل على آخر التحديثات والعروض الحصرية</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaPaperPlane size={16} />
                  {subscribing ? 'جاري الاشتراك...' : 'اشتراك'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* عن الشركة */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo/logo.webp" 
                alt="شعار شركة السمام" 
                className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">شركة السمام</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400">alssemam.com</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
              نُطْلِقُ أعمالَكُمْ في آفاق التقنية كالسَّمَام. شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول.
            </p>
            <div className="space-y-2">
              {contactMethods.map((method, index) => (
                method.url ? (
                  <a
                    key={index}
                    href={method.url}
                    target={method.name === 'اتصال هاتفي' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm"
                  >
                    <span style={{ color: method.color }}>{method.icon}</span>
                    <span dir={method.name === 'WhatsApp' || method.name === 'اتصال هاتفي' ? 'ltr' : 'rtl'}>
                      {method.value}
                    </span>
                  </a>
                ) : (
                  <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                    <span style={{ color: method.color }}>{method.icon}</span>
                    <span>{method.value}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 group-hover:w-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* خدماتنا */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">خدماتنا</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 group-hover:w-2 transition-all"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تابعنا */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">تابعنا على</h4>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:shadow-md transition-all"
                  style={{ color: social.color }}
                >
                  {social.icon}
                  <span className="text-xs text-gray-600 dark:text-gray-400">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 flex-wrap justify-center">
              © {currentYear} شركة السمام - Alssemam. جميع الحقوق محفوظة
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                صنع بـ 
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaHeart size={14} className="text-red-500" />
                </motion.span>
                في اليمن
              </span>
            </p>
            <p className="text-xs text-gray-400">alssemam.com</p>
          </div>
        </div>
      </div>

      {/* زر العودة للأعلى */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="العودة للأعلى"
          >
            <FaArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
