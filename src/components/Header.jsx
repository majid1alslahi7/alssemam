'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn,
  FaMoon, FaSun, FaBars, FaTimes,
  FaHome, FaCog, FaBuilding, FaFolderOpen, FaEnvelope,
  FaNewspaper, FaBullhorn, FaChevronLeft, FaPhone, FaWhatsapp
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const menuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
        setIsMenuOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const menuItems = [
    { label: 'الرئيسية', path: '/', icon: <FaHome size={18} /> },
    { label: 'الخدمات', path: '/services', icon: <FaCog size={18} /> },
    { label: 'من نحن', path: '/about', icon: <FaBuilding size={18} /> },
    { label: 'أعمالنا', path: '/portfolio', icon: <FaFolderOpen size={18} /> },
    { label: 'السمام نيوز', path: '/news', icon: <FaNewspaper size={18} /> },
    { label: 'الإعلانات', path: '/ads', icon: <FaBullhorn size={18} /> },
    { label: 'اتصل بنا', path: '/contact', icon: <FaEnvelope size={18} /> },
  ];

  const socialIcons = [
    { icon: <FaInstagram size={18} />, url: 'https://instagram.com/alssemam', color: '#E4405F' },
    { icon: <FaFacebookF size={18} />, url: 'https://facebook.com/alssemam', color: '#1877F2' },
    { icon: <FaTwitter size={18} />, url: 'https://twitter.com/alssemam', color: '#1DA1F2' },
    { icon: <FaLinkedinIn size={18} />, url: 'https://linkedin.com/company/alssemam', color: '#0A66C2' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg py-2'
            : 'bg-white dark:bg-gray-900 py-3'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo/logo.webp" 
                alt="شعار شركة السمام" 
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover border-2 border-blue-500"
              />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">شركة السمام</h2>
              <span className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400">alssemam.com</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              {isDark ? <FaSun className="text-yellow-500" size={18} /> : <FaMoon className="text-gray-700" size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85%] bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo/logo.webp" alt="شعار" className="w-10 h-10 rounded-xl border-2 border-blue-500" />
                  <div><h3 className="font-bold">شركة السمام</h3><p className="text-xs text-gray-500">alssemam.com</p></div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><FaTimes size={16} /></button>
              </div>
              <div className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path} href={item.path} onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                      >
                        {item.icon}<span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 rounded-xl">
                  <h4 className="font-semibold mb-3">تواصل معنا</h4>
                  <div className="space-y-2">
                    <a href="tel:+967715122500" className="flex items-center gap-3 hover:text-blue-600"><FaPhone className="text-green-500" /><span dir="ltr">+967 715122500</span></a>
                    <a href="https://wa.me/967715122500" className="flex items-center gap-3 hover:text-blue-600"><FaWhatsapp className="text-green-500" /><span dir="ltr">+967 715122500</span></a>
                    <a href="mailto:info@alssemam.com" className="flex items-center gap-3 hover:text-blue-600"><FaEnvelope className="text-blue-500" /><span>info@alssemam.com</span></a>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-500 text-sm mb-3">تابعنا على</p>
                  <div className="flex gap-3">
                    {socialIcons.map((social, idx) => (
                      <a key={idx} href={social.url} target="_blank" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: social.color + '20', color: social.color }}>{social.icon}</a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
