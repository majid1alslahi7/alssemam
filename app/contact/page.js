'use client';
import { supabase } from '@/services/supabase';

import { useState } from 'react';
import { addContactRequest } from '@/services/supabase';
import { FaEnvelope, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addContactRequest(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <FaEnvelope size={24} />, label: 'البريد الإلكتروني', value: 'info@alssemam.com', link: 'mailto:info@alssemam.com', color: 'bg-red-500' },
    { icon: <FaWhatsapp size={24} />, label: 'WhatsApp', value: '+967 715122500', link: 'https://wa.me/967715122500', color: 'bg-green-500' },
    { icon: <FaPhone size={24} />, label: 'اتصال هاتفي', value: '+967 715122500', link: 'tel:+967715122500', color: 'bg-blue-500' },
    { icon: <FaMapMarkerAlt size={24} />, label: 'الموقع', value: 'اليمن - صنعاء / السعودية - الرياض', link: null, color: 'bg-purple-500' },
  ];

  const workingHours = [
    { day: 'السبت - الأربعاء', hours: '9:00 ص - 5:00 م' },
    { day: 'الخميس', hours: '9:00 ص - 2:00 م' },
    { day: 'الجمعة', hours: 'عطلة' },
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95">
            نحن هنا للإجابة على استفساراتكم
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.label}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition text-sm">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FaClock size={18} className="text-blue-600" />
                  ساعات العمل
                </h3>
                <div className="space-y-2">
                  {workingHours.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3">
                  <FaCheckCircle size={20} />
                  <span>تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold">الاسم الكامل *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold">رقم الجوال</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="+967 7xxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">الخدمة المطلوبة</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">اختر الخدمة</option>
                      <option>تطوير موقع ويب</option>
                      <option>تطبيق موبايل</option>
                      <option>حلول سحابية</option>
                      <option>تصميم واجهات</option>
                      <option>متجر إلكتروني</option>
                      <option>الذكاء الاصطناعي</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">الرسالة *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    placeholder="اكتب تفاصيل رسالتك هنا..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <FaSpinner className="animate-spin" size={18} /> : <FaPaperPlane size={18} />}
                  {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
