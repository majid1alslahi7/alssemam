'use client';

import { useState } from 'react';
import { addContactRequest } from '@/services/supabase';
import {
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaPaperPlane,
} from 'react-icons/fa';
import Link from 'next/link';

// =========================================================
//  Contact Info & Working Hours — خارج الـ component
//  لتجنّب إعادة الإنشاء في كل render
// =========================================================
const CONTACT_INFO = [
  {
    id: 'email',
    label: 'البريد الإلكتروني',
    value: 'info@alssemam.com',
    link: 'mailto:info@alssemam.com',
    color: 'bg-red-500',
    ariaLabel: 'أرسل بريدًا إلكترونيًا إلى السمام للتقنية',
    rel: null,
  },
  {
    id: 'whatsapp',
    label: 'واتساب',
    value: '+967 715122500',
    link: 'https://wa.me/967715122500',
    color: 'bg-green-500',
    ariaLabel: 'تواصل عبر واتساب مع السمام للتقنية',
    rel: 'noopener noreferrer',
  },
  {
    id: 'phone',
    label: 'اتصال هاتفي',
    value: '+967 715122500',
    link: 'tel:+967715122500',
    color: 'bg-blue-500',
    ariaLabel: 'اتصل هاتفيًا بالسمام للتقنية',
    rel: null,
  },
  {
    id: 'location',
    label: 'الموقع الجغرافي',
    value: 'اليمن - صنعاء / السعودية - الرياض',
    link: null,
    color: 'bg-purple-500',
    ariaLabel: null,
    rel: null,
  },
];

const WORKING_HOURS = [
  { day: 'السبت - الأربعاء', hours: '9:00 ص - 5:00 م' },
  { day: 'الخميس', hours: '9:00 ص - 2:00 م' },
  { day: 'الجمعة', hours: 'عطلة' },
];

const SERVICES = [
  { value: 'web-development', label: 'تطوير موقع ويب' },
  { value: 'mobile-app', label: 'تطبيق موبايل' },
  { value: 'cloud-solutions', label: 'حلول سحابية' },
  { value: 'ui-design', label: 'تصميم واجهات' },
  { value: 'ecommerce', label: 'متجر إلكتروني' },
  { value: 'ai-solutions', label: 'الذكاء الاصطناعي' },
];

const ICONS_MAP = {
  email: <FaEnvelope size={22} aria-hidden="true" />,
  whatsapp: <FaWhatsapp size={22} aria-hidden="true" />,
  phone: <FaPhone size={22} aria-hidden="true" />,
  location: <FaMapMarkerAlt size={22} aria-hidden="true" />,
};

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

// =========================================================
//  ContactPage Component
// =========================================================
export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await addContactRequest(formData);
      setSubmitted(true);
      setFormData(INITIAL_FORM);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // ── lang + dir على مستوى الصفحة تُعيَّن في layout.js ──
    <div dir="rtl" lang="ar">

      {/* ── Breadcrumb — Navigation + SEO ── */}
      <nav
        aria-label="مسار التنقل"
        className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto px-4 py-2">
          <ol
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <Link
                href="/"
                itemProp="item"
                className="hover:text-blue-600 transition-colors"
              >
                <span itemProp="name">الرئيسية</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li aria-hidden="true" className="text-gray-400">
              /
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <span
                itemProp="name"
                aria-current="page"
                className="text-blue-600 font-medium"
              >
                تواصل معنا
              </span>
              <meta itemProp="position" content="2" />
              <meta
                itemProp="item"
                content="https://www.alssemam.com/contact"
              />
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        aria-labelledby="contact-heading"
        className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          {/* H1 — كلمة مفتاحية رئيسية واضحة */}
          <h1
            id="contact-heading"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            تواصل معنا — السمام للتقنية
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95">
            نحن هنا للإجابة على استفساراتكم حول خدمات تطوير المواقع،
            التطبيقات، والحلول التقنية في اليمن والسعودية.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main
        id="main-content"
        className="container mx-auto px-4 py-12"
        itemScope
        itemType="https://schema.org/ContactPage"
      >
        <meta
          itemProp="name"
          content="تواصل مع السمام للتقنية"
        />
        <meta
          itemProp="description"
          content="صفحة التواصل مع شركة السمام للتقنية لطلب خدمات تطوير المواقع والتطبيقات"
        />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Sidebar: Contact Info ── */}
          <aside
            aria-label="معلومات الاتصال وساعات العمل"
            className="lg:col-span-1"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <meta itemProp="name" content="السمام للتقنية" />
              <meta itemProp="url" content="https://www.alssemam.com" />

              <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>

              {/* Contact Items */}
              <address className="not-italic space-y-4">
                {CONTACT_INFO.map((info) => (
                  <div
                    key={info.id}
                    className="flex items-start gap-4"
                  >
                    <div
                      className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center text-white shrink-0`}
                      aria-hidden="true"
                    >
                      {ICONS_MAP[info.id]}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {info.label}
                      </h3>

                      {info.id === 'email' && (
                        <a
                          href={info.link}
                          aria-label={info.ariaLabel}
                          itemProp="email"
                          className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          {info.value}
                        </a>
                      )}

                      {info.id === 'phone' && (
                        <a
                          href={info.link}
                          aria-label={info.ariaLabel}
                          itemProp="telephone"
                          className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          {info.value}
                        </a>
                      )}

                      {info.id === 'whatsapp' && (
                        <a
                          href={info.link}
                          aria-label={info.ariaLabel}
                          target="_blank"
                          rel={info.rel}
                          className="text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors text-sm font-medium"
                        >
                          {info.value}
                        </a>
                      )}

                      {info.id === 'location' && (
                        <p
                          itemProp="address"
                          itemScope
                          itemType="https://schema.org/PostalAddress"
                          className="text-gray-600 dark:text-gray-300 text-sm"
                        >
                          <span itemProp="addressLocality">
                            {info.value}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </address>

              {/* Working Hours */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3
                  className="font-semibold mb-4 flex items-center gap-2"
                  id="working-hours-heading"
                >
                  <FaClock
                    size={18}
                    className="text-blue-600"
                    aria-hidden="true"
                  />
                  ساعات العمل
                </h3>

                <dl
                  aria-labelledby="working-hours-heading"
                  className="space-y-2"
                  itemScope
                  itemType="https://schema.org/OpeningHoursSpecification"
                >
                  {WORKING_HOURS.map((item) => (
                    <div
                      key={item.day}
                      className="flex justify-between text-sm"
                    >
                      <dt className="text-gray-600 dark:text-gray-300">
                        {item.day}
                      </dt>
                      <dd className="font-medium text-gray-800 dark:text-gray-100">
                        {item.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Quick WhatsApp CTA */}
              <a
                href="https://wa.me/967715122500"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل الآن عبر واتساب مع السمام للتقنية"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors text-sm"
              >
                <FaWhatsapp size={18} aria-hidden="true" />
                تواصل الآن عبر واتساب
              </a>
            </div>
          </aside>

          {/* ── Main Form Section ── */}
          <section
            aria-labelledby="form-heading"
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
              <h2 id="form-heading" className="text-2xl font-bold mb-2">
                أرسل لنا رسالة
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                سيتواصل معك فريقنا خلال ساعات العمل في أقرب وقت ممكن.
              </p>

              {/* Success Message — ARIA Live Region */}
              <div aria-live="polite" aria-atomic="true">
                {submitted && (
                  <div
                    role="status"
                    className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3"
                  >
                    <FaCheckCircle size={20} aria-hidden="true" />
                    <span>
                      تم إرسال رسالتك بنجاح! سيتواصل معك فريق السمام للتقنية
                      قريباً.
                    </span>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-3"
                  >
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
                aria-label="نموذج التواصل مع السمام للتقنية"
              >
                {/* Row 1: Name + Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block mb-2 font-semibold text-sm"
                    >
                      الاسم الكامل
                      <span aria-label="حقل مطلوب" className="text-red-500 mr-1">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby="name-hint"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                      placeholder="أدخل اسمك الكامل"
                    />
                    <span id="name-hint" className="sr-only">
                      أدخل اسمك الكامل كما يظهر في وثائقك الرسمية
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block mb-2 font-semibold text-sm"
                    >
                      البريد الإلكتروني
                      <span aria-label="حقل مطلوب" className="text-red-500 mr-1">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      aria-required="true"
                      inputMode="email"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                {/* Row 2: Phone + Service */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block mb-2 font-semibold text-sm"
                    >
                      رقم الجوال
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                      placeholder="+967 7xxxxxxx"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block mb-2 font-semibold text-sm"
                    >
                      الخدمة المطلوبة
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                    >
                      <option value="">اختر الخدمة</option>
                      {SERVICES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block mb-2 font-semibold text-sm"
                  >
                    الرسالة
                    <span aria-label="حقل مطلوب" className="text-red-500 mr-1">
                      *
                    </span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    aria-required="true"
                    aria-describedby="message-hint"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none text-sm"
                    placeholder="اكتب تفاصيل رسالتك أو مشروعك هنا..."
                  />
                  <span id="message-hint" className="sr-only">
                    اشرح طلبك بوضوح ليتمكن الفريق من مساعدتك بشكل أفضل
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  aria-disabled={submitting}
                  aria-busy={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {submitting ? (
                    <>
                      <FaSpinner
                        className="animate-spin"
                        size={18}
                        aria-hidden="true"
                      />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={18} aria-hidden="true" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  بإرسال هذا النموذج، توافق على{' '}
                  <Link
                    href="/privacy"
                    className="underline hover:text-blue-600 transition-colors"
                  >
                    سياسة الخصوصية
                  </Link>{' '}
                  الخاصة بنا. لن نشارك بياناتك مع أي طرف ثالث.
                </p>
              </form>
            </div>
          </section>
        </div>

        {/* ── FAQ Section — تعزيز SEO بكلمات مفتاحية ذات صلة ── */}
        <section
          aria-labelledby="faq-heading"
          className="mt-16"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <h2
            id="faq-heading"
            className="text-2xl font-bold text-center mb-8"
          >
            الأسئلة الشائعة
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'ما هي مجالات عمل السمام للتقنية؟',
                a: 'نتخصص في تطوير مواقع الويب، تطبيقات الموبايل، الحلول السحابية، تصميم واجهات المستخدم، المتاجر الإلكترونية، وحلول الذكاء الاصطناعي.',
              },
              {
                q: 'كم يستغرق الرد على طلبات التواصل؟',
                a: 'نسعى للرد خلال 24 ساعة في أيام العمل. يمكنك أيضاً التواصل الفوري عبر واتساب.',
              },
              {
                q: 'هل تعملون مع عملاء خارج اليمن والسعودية؟',
                a: 'نعم، نقدم خدماتنا لعملاء في جميع أنحاء العالم العربي وخارجه.',
              },
              {
                q: 'كيف يمكنني الحصول على عرض سعر؟',
                a: 'أرسل تفاصيل مشروعك عبر النموذج أعلاه أو تواصل معنا مباشرة عبر واتساب وسنرسل لك عرض سعر مخصص.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <h3
                  itemProp="name"
                  className="font-semibold mb-2 text-gray-800 dark:text-gray-100"
                >
                  {faq.q}
                </h3>
                <div
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p
                    itemProp="text"
                    className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}