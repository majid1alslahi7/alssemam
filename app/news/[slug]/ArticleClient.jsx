"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { getLatestArticles, supabase } from "@/services/supabase";
import {
  FaArrowRight, FaCalendarAlt, FaEye, FaHeart, FaShareAlt,
  FaNewspaper, FaUser, FaClock, FaComment, FaPaperPlane,
  FaReply, FaTimes, FaWhatsapp, FaFacebookF, FaLink,
  FaTelegram, FaInstagram, FaEnvelope, FaCopy, FaShare,
  FaCheckCircle, FaBookmark, FaList,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

// ─── Utility: estimate reading time ────────────────────────────────────────
function calcReadingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Sub-component: Reading Progress Bar ───────────────────────────────────
function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 z-[9999] origin-left"
      aria-hidden="true"
    />
  );
}

// ─── Sub-component: Table of Contents ──────────────────────────────────────
function TableOfContents({ content }) {
  const [activeId, setActiveId] = useState("");
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split("\n");
    return lines
      .filter((l) => l.startsWith("## ") || l.startsWith("### "))
      .map((l, i) => ({
        id: `heading-${i}`,
        text: l.replace(/^#{2,3}\s/, ""),
        level: l.startsWith("### ") ? 3 : 2,
      }));
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="جدول المحتويات"
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-2xl p-5 mb-8"
    >
      <h2 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 text-base">
        <FaList className="text-blue-500" size={14} />
        جدول المحتويات
      </h2>
      <ul className="space-y-1.5" role="list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? "pr-4" : ""}
            role="listitem"
          >
            <a
              href={`#${h.id}`}
              className={`text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                activeId === h.id
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {h.level === 3 ? "· " : ""}
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Sub-component: Share Panel ────────────────────────────────────────────
function SharePanel({ article, articleUrl, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(articleUrl).then(() => {
      setCopied(true);
      toast.success("تم نسخ الرابط");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [articleUrl]);

  const handleShare = useCallback(
    (platform) => {
      const title = article.title || "مقال";
      const urls = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + articleUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(articleUrl)}`,
      };
      if (urls[platform]) {
        window.open(urls[platform], "_blank", "width=600,height=400");
        onClose();
      }
    },
    [article, articleUrl, onClose]
  );

  const platforms = [
    { key: "whatsapp", label: "واتساب", color: "bg-green-50 dark:bg-green-900/20", iconColor: "text-green-500", Icon: FaWhatsapp },
    { key: "facebook", label: "فيسبوك", color: "bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-600", Icon: FaFacebookF },
    { key: "twitter", label: "إكس", color: "bg-gray-100 dark:bg-gray-700", iconColor: "text-gray-800 dark:text-white", Icon: FaXTwitter },
    { key: "telegram", label: "تيليجرام", color: "bg-sky-50 dark:bg-sky-900/20", iconColor: "text-sky-500", Icon: FaTelegram },
    { key: "email", label: "بريد", color: "bg-gray-50 dark:bg-gray-800", iconColor: "text-gray-500", Icon: FaEnvelope },
    { key: "copy", label: copied ? "تم" : "نسخ", color: "bg-gray-50 dark:bg-gray-800", iconColor: copied ? "text-green-500" : "text-gray-500", Icon: copied ? FaCheckCircle : FaCopy, action: handleCopy },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute top-full left-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 z-[200] w-[340px] border border-gray-100 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="مشاركة المقال"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-gray-800 dark:text-white">مشاركة المقال</p>
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <FaTimes size={13} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {platforms.map(({ key, label, color, iconColor, Icon, action }) => (
          <button
            key={key}
            onClick={action ?? (() => handleShare(key))}
            className={`flex flex-col items-center gap-1.5 p-3 ${color} rounded-xl transition hover:opacity-80 active:scale-95`}
            aria-label={`مشاركة عبر ${label}`}
          >
            <Icon className={`${iconColor} text-xl`} />
            <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
        <input
          type="text"
          value={articleUrl}
          readOnly
          className="flex-1 bg-transparent text-xs outline-none text-gray-500 dark:text-gray-300 truncate"
          aria-label="رابط المقال"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          aria-label="نسخ الرابط"
        >
          <FaLink size={10} />
          {copied ? "تم" : "نسخ"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Sub-component: Comment Item ───────────────────────────────────────────
function CommentItem({ comment, onReply }) {
  const initial = comment.user_name?.charAt(0)?.toUpperCase() || "م";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 py-4 border-b border-gray-100 dark:border-gray-700/60 last:border-0"
    >
      <div
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm select-none"
        aria-hidden="true"
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-gray-800 dark:text-white text-sm">
            {comment.user_name}
          </span>
          <time
            dateTime={comment.created_at}
            className="text-xs text-gray-400"
          >
            {new Date(comment.created_at).toLocaleDateString("ar-EG", {
              year: "numeric", month: "short", day: "numeric",
            })}
          </time>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-7 mb-2">
          {comment.content}
        </p>
        <button
          onClick={() => onReply(comment)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          aria-label={`الرد على ${comment.user_name}`}
        >
          <FaReply size={11} />
          رد
        </button>

        {comment.replies?.length > 0 && (
          <div
            className="mt-3 space-y-3 pr-4 border-r-2 border-blue-100 dark:border-blue-900/40"
            role="list"
            aria-label="الردود"
          >
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-2" role="listitem">
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  aria-hidden="true"
                >
                  {reply.user_name?.charAt(0)?.toUpperCase() || "م"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-xs text-gray-800 dark:text-white">{reply.user_name}</span>
                    <time dateTime={reply.created_at} className="text-xs text-gray-400">
                      {new Date(reply.created_at).toLocaleDateString("ar-EG")}
                    </time>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-6">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ArticleClient({ article }) {
  const [latestArticles, setLatestArticles] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", email: "", content: "" });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const shareRef = useRef(null);

  const readingTime = useMemo(() => calcReadingTime(article.content || ""), [article.content]);

  const articleUrl = useMemo(
    () => typeof window !== "undefined"
      ? window.location.href
      : `https://alssemam.com/news/${article.slug}`,
    [article.slug]
  );

  // Close share on outside click
  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    loadLatestArticles();
    loadComments(article.id);
    incrementViews();
    const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    const bookmarkedArticles = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
    if (likedArticles.includes(article.id)) setLiked(true);
    if (bookmarkedArticles.includes(article.id)) setBookmarked(true);
  }, [article.id]);

  const loadLatestArticles = async () => {
    try {
      const data = await getLatestArticles(4);
      setLatestArticles(data || []);
    } catch (e) { console.error(e); }
  };

  const incrementViews = async () => {
    try {
      const { data } = await supabase
        .from("articles").select("views_count").eq("slug", article.slug).single();
      await supabase.from("articles")
        .update({ views_count: (data?.views_count || 0) + 1 })
        .eq("slug", article.slug);
    } catch (e) { /* silent */ }
  };

  const loadComments = async (articleId) => {
    try {
      const { data } = await supabase
        .from("comments").select("*")
        .eq("article_id", articleId).is("parent_id", null)
        .order("created_at", { ascending: false });

      const withReplies = await Promise.all(
        (data || []).map(async (c) => {
          const { data: replies } = await supabase
            .from("comments").select("*")
            .eq("parent_id", c.id)
            .order("created_at", { ascending: true });
          return { ...c, replies: replies || [] };
        })
      );
      setComments(withReplies.filter((c) => c.is_approved !== false));
    } catch (e) { console.error(e); }
  };

  const handleLike = useCallback(() => {
    if (liked) { toast("لقد أعجبت بهذا المقال مسبقاً", { icon: "💙" }); return; }
    setLiked(true);
    const arr = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    if (!arr.includes(article.id)) {
      arr.push(article.id);
      localStorage.setItem("likedArticles", JSON.stringify(arr));
    }
    toast.success("شكراً لإعجابك!");
  }, [liked, article.id]);

  const handleBookmark = useCallback(() => {
    const next = !bookmarked;
    setBookmarked(next);
    const arr = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
    const updated = next ? [...arr, article.id] : arr.filter((id) => id !== article.id);
    localStorage.setItem("bookmarkedArticles", JSON.stringify(updated));
    toast.success(next ? "تم حفظ المقال" : "تم إلغاء الحفظ");
  }, [bookmarked, article.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.content.trim()) {
      toast.error("الرجاء إدخال الاسم والتعليق");
      return;
    }
    setSubmittingComment(true);
    try {
      const { error } = await supabase.from("comments").insert([{
        article_id: article.id,
        user_name: newComment.name.trim(),
        user_email: newComment.email || null,
        content: replyTo
          ? `@${replyTo.user_name} ${newComment.content.trim()}`
          : newComment.content.trim(),
        is_approved: true,
        parent_id: replyTo?.id || null,
      }]);
      if (error) throw error;
      toast.success("تم إرسال تعليقك!");
      setNewComment({ name: "", email: "", content: "" });
      setReplyTo(null);
      await loadComments(article.id);
    } catch {
      toast.error("حدث خطأ في إرسال التعليق");
    } finally {
      setSubmittingComment(false);
    }
  };

  const categoryStyle = useMemo(() => {
    const map = {
      news: { bg: "bg-blue-500", text: "text-white", label: "خبر" },
      article: { bg: "bg-emerald-500", text: "text-white", label: "مقال" },
      writing: { bg: "bg-violet-500", text: "text-white", label: "كتابة" },
    };
    return map[article.category] || { bg: "bg-gray-500", text: "text-white", label: article.category };
  }, [article.category]);

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-16"
      dir="rtl"
      lang="ar"
    >
      <ReadingProgressBar />
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "inherit", direction: "rtl" } }} />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav aria-label="مسار التنقل" className="mb-6 pt-4">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap" role="list">
            <li role="listitem"><Link href="/" className="hover:text-blue-600 transition">الرئيسية</Link></li>
            <li role="listitem" aria-hidden="true" className="text-gray-300">/</li>
            <li role="listitem"><Link href="/news" className="hover:text-blue-600 transition">السمام نيوز</Link></li>
            <li role="listitem" aria-hidden="true" className="text-gray-300">/</li>
            <li role="listitem" className="text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[200px]" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main Article ── */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
              itemScope
              itemType="https://schema.org/Article"
            >
              {/* Hero Image */}
              <div className="relative h-72 md:h-[420px]">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 66vw"
                    className="object-cover"
                    itemProp="image"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center" aria-hidden="true">
                    <FaNewspaper size={80} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${categoryStyle.bg} ${categoryStyle.text}`}>
                    {categoryStyle.label}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {/* Title */}
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 leading-[1.6] text-gray-900 dark:text-white"
                  itemProp="headline"
                >
                  {article.title}
                </h1>

                {/* Meta row */}
                <div
                  className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800"
                  aria-label="معلومات المقال"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white" aria-hidden="true">
                      <FaUser size={15} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm" itemProp="author">{article.author || "شركة السمام"}</p>
                      <p className="text-xs text-gray-400">كاتب المقال</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FaCalendarAlt size={12} aria-hidden="true" />
                    <time
                      dateTime={article.published_at || article.created_at}
                      itemProp="datePublished"
                    >
                      {new Date(article.published_at || article.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FaEye size={12} aria-hidden="true" />
                    <span>{(article.views_count || 0).toLocaleString("ar-EG")} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FaClock size={12} aria-hidden="true" />
                    <span>{readingTime} دقائق قراءة</span>
                  </div>
                </div>

                {/* Excerpt highlight */}
                {article.excerpt && (
                  <blockquote
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-4 border-blue-500 p-5 rounded-xl mb-8"
                    itemProp="description"
                  >
                    <p className="text-gray-700 dark:text-gray-200 leading-8 font-medium">
                      {article.excerpt}
                    </p>
                  </blockquote>
                )}

                {/* Table of contents */}
                <TableOfContents content={article.content} />

                {/* About section */}
                <section aria-labelledby="about-heading" className="mb-8">
                  <h2 id="about-heading" className="text-xl font-bold mb-3 text-gray-800 dark:text-white">حول هذا المقال</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-8">
                    هذا المقال من السمام نيوز يقدّم محتوى تقنياً يساعد القراء على فهم موضوع{" "}
                    <strong className="text-blue-600 dark:text-blue-400">{article.title}</strong>{" "}
                    ضمن مجالات تطوير المواقع، تطبيقات الموبايل، الذكاء الاصطناعي، والتحول الرقمي.
                  </p>
                </section>

                {/* Main content */}
                <div
                  className="prose prose-lg dark:prose-invert max-w-none mb-10 prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-blue-500 prose-code:bg-gray-100 dark:prose-code:bg-gray-800"
                  itemProp="articleBody"
                >
                  <div className="text-gray-700 dark:text-gray-300 leading-[2] whitespace-pre-line">
                    {article.content}
                  </div>
                </div>

                {/* Internal links */}
                <nav aria-label="روابط ذات صلة" className="mb-8 p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h2 className="font-bold mb-3 text-gray-800 dark:text-white text-sm">روابط مهمة</h2>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {[
                      { href: "/services", label: "خدماتنا" },
                      { href: "/portfolio", label: "أعمالنا" },
                      { href: "/contact", label: "تواصل معنا" },
                      { href: "/news", label: "السمام نيوز" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  {/* Like */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleLike}
                    aria-label={liked ? "تم الإعجاب" : "أعجبني"}
                    aria-pressed={liked}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
                      liked
                        ? "bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-800/40"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaHeart className={liked ? "text-red-500 fill-red-500" : ""} size={15} />
                    <span className="text-sm">{liked ? "تم الإعجاب" : "أعجبني"}</span>
                  </motion.button>

                  {/* Bookmark */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleBookmark}
                    aria-label={bookmarked ? "إلغاء الحفظ" : "حفظ المقال"}
                    aria-pressed={bookmarked}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
                      bookmarked
                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 border border-amber-200 dark:border-amber-800/40"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaBookmark size={14} />
                    <span className="text-sm">{bookmarked ? "محفوظ" : "حفظ"}</span>
                  </motion.button>

                  {/* Share */}
                  <div className="relative" ref={shareRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setShowShare((s) => !s)}
                      aria-label="مشاركة المقال"
                      aria-expanded={showShare}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition text-sm"
                    >
                      <FaShareAlt size={14} />
                      مشاركة
                    </motion.button>
                    <AnimatePresence>
                      {showShare && (
                        <SharePanel
                          article={article}
                          articleUrl={articleUrl}
                          onClose={() => setShowShare(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* ── Comments ── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-10"
              aria-labelledby="comments-heading"
            >
              <h2
                id="comments-heading"
                className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white"
              >
                <FaComment className="text-blue-500" size={18} />
                التعليقات
                <span className="text-sm font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                  {comments.length}
                </span>
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-10 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700" noValidate>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">
                  {replyTo ? `الرد على ${replyTo.user_name}` : "اكتب تعليقاً"}
                </h3>

                <AnimatePresence>
                  {replyTo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 px-4 py-2.5 rounded-xl"
                    >
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        رد على <strong>@{replyTo.user_name}</strong>
                      </span>
                      <button type="button" onClick={() => setReplyTo(null)} aria-label="إلغاء الرد" className="text-gray-400 hover:text-gray-600 transition">
                        <FaTimes size={13} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="اسمك *"
                    value={newComment.name}
                    onChange={(e) => setNewComment((p) => ({ ...p, name: e.target.value }))}
                    className="p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                    aria-required="true"
                    aria-label="اسمك"
                  />
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني (اختياري)"
                    value={newComment.email}
                    onChange={(e) => setNewComment((p) => ({ ...p, email: e.target.value }))}
                    className="p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    aria-label="بريدك الإلكتروني"
                  />
                </div>
                <textarea
                  placeholder="شاركنا رأيك..."
                  value={newComment.content}
                  onChange={(e) => setNewComment((p) => ({ ...p, content: e.target.value }))}
                  rows={4}
                  className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-3 transition"
                  required
                  aria-required="true"
                  aria-label="تعليقك"
                />
                <motion.button
                  type="submit"
                  disabled={submittingComment}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/20"
                >
                  <FaPaperPlane size={13} />
                  {submittingComment ? "جاري الإرسال..." : "إرسال التعليق"}
                </motion.button>
              </form>

              {/* Comments list */}
              <div role="list" aria-label="قائمة التعليقات">
                {comments.length === 0 ? (
                  <div className="text-center py-14 text-gray-400">
                    <FaComment size={36} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
                    <p className="text-sm">لا توجد تعليقات بعد — كن أول من يعلق!</p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} role="listitem">
                      <CommentItem
                        comment={c}
                        onReply={(comment) => {
                          setReplyTo(comment);
                          setNewComment((p) => ({ ...p, content: "" }));
                          document.getElementById("comments-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1" aria-label="الشريط الجانبي">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="sticky top-24 space-y-6"
            >
              {/* Latest articles */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <FaNewspaper className="text-blue-500" size={16} />
                  أحدث المقالات
                </h3>
                <div className="space-y-4" role="list">
                  {latestArticles
                    .filter((a) => a.id !== article.id)
                    .slice(0, 3)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="flex gap-3 group"
                        role="listitem"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-500">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-110 transition duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                              <FaNewspaper size={18} className="text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-6 mb-1">
                            {item.title}
                          </h4>
                          <time
                            dateTime={item.published_at || item.created_at}
                            className="text-xs text-gray-400"
                          >
                            {new Date(item.published_at || item.created_at).toLocaleDateString("ar-EG")}
                          </time>
                        </div>
                      </Link>
                    ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/news" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1.5">
                    عرض جميع الأخبار <FaArrowRight size={11} />
                  </Link>
                </div>
              </div>

              {/* CTA card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                <h3 className="font-bold text-lg mb-2">هل تحتاج موقعاً؟</h3>
                <p className="text-blue-100 text-sm leading-7 mb-4">
                  شركة السمام تبني مواقع وتطبيقات احترافية بأعلى معايير الجودة.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-white text-blue-700 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition"
                >
                  تواصل معنا
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}