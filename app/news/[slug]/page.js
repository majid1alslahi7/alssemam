"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getLatestArticles, supabase } from "@/services/supabase";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaEye,
  FaHeart,
  FaShareAlt,
  FaNewspaper,
  FaUser,
  FaClock,
  FaComment,
  FaPaperPlane,
  FaReply,
  FaTimes,
  FaWhatsapp,
  FaFacebookF,
  FaLink,
  FaTelegram,
  FaInstagram,
  FaEnvelope,
  FaCopy,
  FaShare,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

export default function ArticleClient({ article }) {
  const [latestArticles, setLatestArticles] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://alssemam.com/news/${article.slug}`;

  useEffect(() => {
    loadLatestArticles();
    loadComments(article.id);
    incrementViews();

    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "[]"
    );

    if (likedArticles.includes(article.id)) {
      setLiked(true);
    }
  }, [article.id]);

  const loadLatestArticles = async () => {
    try {
      const latestData = await getLatestArticles(4);
      setLatestArticles(latestData || []);
    } catch (error) {
      console.error("Error loading latest articles:", error);
    }
  };

  const incrementViews = async () => {
    try {
      const { data } = await supabase
        .from("articles")
        .select("views_count")
        .eq("slug", article.slug)
        .single();

      await supabase
        .from("articles")
        .update({ views_count: (data?.views_count || 0) + 1 })
        .eq("slug", article.slug);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const loadComments = async (articleId) => {
    try {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from("comments")
            .select("*")
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );

      setComments(commentsWithReplies.filter((c) => c.is_approved !== false));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleLike = () => {
    if (liked) {
      toast.success("لقد أعجبت بهذا المقال مسبقاً");
      return;
    }

    setLiked(true);

    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "[]"
    );

    if (!likedArticles.includes(article.id)) {
      likedArticles.push(article.id);
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    }

    toast.success("شكراً لإعجابك بالمقال!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: articleUrl,
        });

        toast.success("تمت المشاركة بنجاح");
        setShowShare(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("تعذرت المشاركة");
        }
      }
    } else {
      handleCopyLink();
      toast.success("تم نسخ الرابط، يمكنك مشاركته الآن");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      ?.writeText(articleUrl)
      .then(() => {
        setCopied(true);
        toast.success("تم نسخ الرابط");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("تعذر نسخ الرابط"));
  };

  const handleShare = (platform) => {
    const title = article.title || "مقال";
    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          title + " - " + articleUrl
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          articleUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(articleUrl)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          articleUrl
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(articleUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShare(false);
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.success("تم نسخ الرابط! الصقه في انستجرام");
    setShowShare(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.name || !newComment.content) {
      toast.error("الرجاء إدخال الاسم والتعليق");
      return;
    }

    setSubmittingComment(true);

    try {
      const commentData = {
        article_id: article.id,
        user_name: newComment.name,
        user_email: newComment.email || null,
        content: replyTo
          ? `@${replyTo.user_name} ${newComment.content}`
          : newComment.content,
        is_approved: true,
        parent_id: replyTo?.id || null,
      };

      const { error } = await supabase.from("comments").insert([commentData]);

      if (error) throw error;

      toast.success("تم إرسال تعليقك بنجاح!");
      setNewComment({ name: "", email: "", content: "" });
      setReplyTo(null);
      loadComments(article.id);
    } catch (error) {
      toast.error("حدث خطأ في إرسال التعليق");
    } finally {
      setSubmittingComment(false);
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case "news":
        return { bg: "bg-blue-500", text: "text-white", label: "خبر" };
      case "article":
        return { bg: "bg-green-500", text: "text-white", label: "مقال" };
      case "writing":
        return { bg: "bg-purple-500", text: "text-white", label: "كتابة" };
      default:
        return { bg: "bg-gray-500", text: "text-white", label: category };
    }
  };

  const style = getCategoryStyle(article.category);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <Toaster position="top-center" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/news"
            className="text-blue-600 hover:underline inline-flex items-center gap-2"
          >
            <FaArrowRight size={14} />
            العودة إلى السمام نيوز
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-visible"
            >
              <div className="relative h-72 md:h-96">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <FaNewspaper size={80} className="text-white/30" />
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-visible">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                      <FaUser size={16} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {article.author || "شركة السمام"}
                      </p>
                      <p className="text-xs text-gray-500">كاتب المقال</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendarAlt />
                    <span>
                      {new Date(
                        article.published_at || article.created_at
                      ).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaEye />
                    <span>{article.views_count || 0} مشاهدة</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock />
                    <span>5 دقائق قراءة</span>
                  </div>
                </div>

                {article.excerpt && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 p-4 rounded-lg mb-6">
                    <p className="text-gray-700 dark:text-gray-300 italic leading-8">
                      {article.excerpt}
                    </p>
                  </div>
                )}

                <section className="mb-8">
                  <h2 className="text-xl font-bold mb-4">
                    حول هذا المقال
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-8">
                    هذا المقال من السمام نيوز يقدّم محتوى تقنيًا يساعد القراء
                    على فهم موضوع {article.title} ضمن مجالات تطوير المواقع،
                    تطبيقات الموبايل، الذكاء الاصطناعي، والتحول الرقمي.
                  </p>
                </section>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {article.content}
                  </div>
                </div>

                <nav className="mb-8 p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <h2 className="font-bold mb-3">روابط مهمة</h2>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <Link href="/services" className="text-blue-600 font-bold">
                      خدمات شركة السمام
                    </Link>
                    <Link href="/portfolio" className="text-blue-600 font-bold">
                      أعمالنا
                    </Link>
                    <Link href="/contact" className="text-blue-600 font-bold">
                      تواصل معنا
                    </Link>
                    <Link href="/news" className="text-blue-600 font-bold">
                      السمام نيوز
                    </Link>
                  </div>
                </nav>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 overflow-visible">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition ${
                      liked
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaHeart className={liked ? "fill-red-500" : ""} />
                    <span>{liked ? "تم الإعجاب" : "أعجبني"}</span>
                  </motion.button>

                  <div className="relative overflow-visible">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowShare(!showShare)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      <FaShareAlt />
                      <span>مشاركة</span>
                    </motion.button>

                    <AnimatePresence>
                      {showShare && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 z-[100] w-[360px] border border-gray-200 dark:border-gray-700 overflow-visible"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="font-bold text-gray-800 dark:text-white text-lg">
                              مشاركة المقال
                            </p>

                            <button
                              onClick={() => setShowShare(false)}
                              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-4 gap-3 mb-4">
                            <button
                              onClick={() => handleShare("whatsapp")}
                              className="flex flex-col items-center gap-1.5 p-2 bg-green-50 rounded-xl"
                            >
                              <FaWhatsapp className="text-green-500 text-2xl" />
                              <span className="text-xs">واتساب</span>
                            </button>

                            <button
                              onClick={() => handleShare("facebook")}
                              className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 rounded-xl"
                            >
                              <FaFacebookF className="text-blue-600 text-2xl" />
                              <span className="text-xs">فيسبوك</span>
                            </button>

                            <button
                              onClick={() => handleShare("twitter")}
                              className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 rounded-xl"
                            >
                              <FaXTwitter className="text-gray-800 text-2xl" />
                              <span className="text-xs">إكس</span>
                            </button>

                            <button
                              onClick={() => handleShare("telegram")}
                              className="flex flex-col items-center gap-1.5 p-2 bg-sky-50 rounded-xl"
                            >
                              <FaTelegram className="text-sky-500 text-2xl" />
                              <span className="text-xs">تليجرام</span>
                            </button>

                            <button
                              onClick={handleInstagramShare}
                              className="flex flex-col items-center gap-1.5 p-2 bg-pink-50 rounded-xl"
                            >
                              <FaInstagram className="text-pink-500 text-2xl" />
                              <span className="text-xs">انستجرام</span>
                            </button>

                            <button
                              onClick={() => handleShare("email")}
                              className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl"
                            >
                              <FaEnvelope className="text-gray-500 text-2xl" />
                              <span className="text-xs">بريد</span>
                            </button>

                            <button
                              onClick={handleCopyLink}
                              className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl"
                            >
                              <FaCopy className="text-gray-500 text-2xl" />
                              <span className="text-xs">
                                {copied ? "تم النسخ" : "نسخ"}
                              </span>
                            </button>

                            <button
                              onClick={handleNativeShare}
                              className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 rounded-xl"
                            >
                              <FaShare className="text-blue-600 text-2xl" />
                              <span className="text-xs">مشاركة</span>
                            </button>
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <input
                                type="text"
                                value={articleUrl}
                                readOnly
                                className="flex-1 bg-transparent text-sm outline-none"
                              />

                              <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
                              >
                                <FaLink size={12} />
                                {copied ? "تم النسخ" : "نسخ"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaComment className="text-blue-500" />
                التعليقات ({comments.length})
              </h2>

              <form onSubmit={handleSubmitComment} className="mb-8">
                {replyTo && (
                  <div className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <span className="text-sm">رد على @{replyTo.user_name}</span>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="اسمك *"
                    value={newComment.name}
                    onChange={(e) =>
                      setNewComment({ ...newComment, name: e.target.value })
                    }
                    className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 outline-none"
                    required
                  />

                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني (اختياري)"
                    value={newComment.email}
                    onChange={(e) =>
                      setNewComment({ ...newComment, email: e.target.value })
                    }
                    className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 outline-none"
                  />
                </div>

                <textarea
                  placeholder="اكتب تعليقك هنا..."
                  value={newComment.content}
                  onChange={(e) =>
                    setNewComment({ ...newComment, content: e.target.value })
                  }
                  rows="4"
                  className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 resize-none mb-4 outline-none"
                  required
                />

                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <FaPaperPlane size={14} />
                  {submittingComment ? "جاري الإرسال..." : "إرسال التعليق"}
                </button>
              </form>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    لا توجد تعليقات بعد. كن أول من يعلق!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {comment.user_name?.charAt(0) || "م"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {comment.user_name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.created_at).toLocaleDateString(
                                "ar-EG"
                              )}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {comment.content}
                          </p>

                          <button
                            onClick={() => {
                              setReplyTo(comment);
                              setNewComment({ ...newComment, content: "" });
                            }}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                          >
                            <FaReply size={12} />
                            رد
                          </button>

                          {comment.replies?.length > 0 && (
                            <div className="mt-3 space-y-3 pr-4 border-r-2 border-gray-200 dark:border-gray-700">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {reply.user_name?.charAt(0) || "م"}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm">
                                        {reply.user_name}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(
                                          reply.created_at
                                        ).toLocaleDateString("ar-EG")}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaNewspaper className="text-blue-500" />
                  أحدث المقالات
                </h3>

                <div className="space-y-4">
                  {latestArticles
                    .filter((a) => a.id !== article.id)
                    .slice(0, 3)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <FaNewspaper
                                  size={20}
                                  className="text-white/50"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-sm group-hover:text-blue-600 transition line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                item.published_at || item.created_at
                              ).toLocaleDateString("ar-EG")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/news"
                    className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
                  >
                    عرض جميع الأخبار <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
} "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaEye,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaFire,
  FaTimes,
  FaCode,
  FaRobot,
  FaGlobe,
  FaMobileAlt,
  FaRocket,
} from "react-icons/fa";
import Image from "next/image";

export default function NewsClient({ initialArticles = [] }) {
  const [articles] = useState(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 9;
  const featuredArticle = articles[0] || null;

  const categories = [
    { id: "all", name: "الكل", icon: <FaNewspaper size={14} /> },
    { id: "news", name: "أخبار", icon: <FaFire size={14} /> },
    { id: "article", name: "مقالات", icon: <FaNewspaper size={14} /> },
    { id: "writing", name: "كتابات", icon: <FaNewspaper size={14} /> },
  ];

  const normalizeArabic = (text = "") =>
    text
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[ًٌٍَُِّْ]/g, "");

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = normalizeArabic(searchTerm);

      filtered = filtered.filter(
        (article) =>
          normalizeArabic(article.title).includes(term) ||
          normalizeArabic(article.excerpt).includes(term) ||
          normalizeArabic(article.content).includes(term)
      );
    }

    return filtered;
  }, [articles, selectedCategory, searchTerm]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const getCategoryStyle = (category) => {
    switch (category) {
      case "news":
        return { bg: "bg-blue-500", text: "text-white", label: "خبر" };
      case "article":
        return { bg: "bg-green-500", text: "text-white", label: "مقال" };
      case "writing":
        return { bg: "bg-purple-500", text: "text-white", label: "كتابة" };
      default:
        return { bg: "bg-gray-500", text: "text-white", label: category || "مقال" };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900">
          <motion.div
            animate={{ scale: [1, 1.18, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 16 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <FaNewspaper size={44} className="text-blue-100" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
              السمام نيوز
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100 leading-9">
              منصة تقنية تابعة لشركة السمام تقدم أخبار ومقالات في البرمجة،
              تطوير مواقع الويب، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين
              الظهور في محركات البحث.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
              >
                خدمات شركة السمام
              </Link>
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-gray-900 dark:text-white">
            أخبار التقنية والبرمجة من السمام نيوز
          </h2>

          <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-9">
            <p>
              السمام نيوز هي منصة محتوى تقنية تهدف إلى نشر المعرفة الرقمية
              باللغة العربية، وتقديم مقالات عملية حول تطوير المواقع، تطبيقات
              الموبايل، الذكاء الاصطناعي، تحسين SEO، وتجارب بناء المنتجات
              الرقمية.
            </p>

            <p>
              نركز على تقديم محتوى واضح ومفيد لأصحاب الأعمال، رواد المشاريع،
              المطورين، والشركات التي تبحث عن حلول تقنية تساعدها على النمو
              والتحول الرقمي.
            </p>

            <p>
              تغطي مقالات السمام نيوز موضوعات مثل Next.js و React و Laravel و
              Flutter و Supabase و DeepSeek و ChatGPT، مع نصائح عملية لتحسين
              الأداء والظهور في Google ومحركات الذكاء الاصطناعي.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10">
            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaNewspaper className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">{articles.length}</strong>
              <span className="text-sm text-gray-500">مقال منشور</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaCode className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">Web</strong>
              <span className="text-sm text-gray-500">تطوير مواقع</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaMobileAlt className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">Apps</strong>
              <span className="text-sm text-gray-500">تطبيقات موبايل</span>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-2xl text-center">
              <FaRobot className="mx-auto text-blue-600 text-3xl mb-3" />
              <strong className="block text-2xl">AI</strong>
              <span className="text-sm text-gray-500">ذكاء اصطناعي</span>
            </div>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <FaFire className="text-orange-500" />
                المقال المميز
              </h2>
            </motion.div>

            <Link href={`/news/${featuredArticle.slug}`} className="block">
              <motion.article
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl group border border-gray-100 dark:border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-72 md:h-full min-h-[320px]">
                    {featuredArticle.image ? (
                      <Image
                        src={featuredArticle.image}
                        alt={`صورة مقال ${featuredArticle.title}`}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <FaNewspaper size={64} className="text-white/30" />
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          getCategoryStyle(featuredArticle.category).bg
                        } ${getCategoryStyle(featuredArticle.category).text}`}
                      >
                        {getCategoryStyle(featuredArticle.category).label}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 md:p-10 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-extrabold mb-4 group-hover:text-blue-600 transition leading-[1.5]">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-5 leading-8 line-clamp-4">
                      {featuredArticle.excerpt ||
                        featuredArticle.content?.substring(0, 220)}
                      ...
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaUser size={12} /> {featuredArticle.author || "السمام"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={12} />
                        {new Date(
                          featuredArticle.published_at || featuredArticle.created_at
                        ).toLocaleDateString("ar-EG")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={12} /> {featuredArticle.views_count || 0}
                      </span>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold">
                      قراءة المقال <FaArrowLeft size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      <section className="sticky top-16 z-30 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border-y border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الأخبار والمقالات..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  aria-label="مسح البحث"
                >
                  <FaTimes className="text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
              <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">
                لا توجد مقالات مطابقة
              </h3>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentArticles.map((article) => {
                  const style = getCategoryStyle(article.category);

                  return (
                    <motion.article key={article.id} variants={cardVariants}>
                      <Link href={`/news/${article.slug}`} className="block h-full">
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
                          <div className="relative h-48 overflow-hidden">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={`صورة مقال ${article.title}`}
                                fill
                                className="object-cover group-hover:scale-110 transition duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <FaNewspaper size={48} className="text-white/30" />
                              </div>
                            )}

                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                {style.label}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2 leading-8">
                              {article.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-7">
                              {article.excerpt || article.content?.substring(0, 140)}...
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt size={10} />
                                {new Date(
                                  article.published_at || article.created_at
                                ).toLocaleDateString("ar-EG")}
                              </span>

                              <span className="flex items-center gap-1">
                                <FaEye size={10} />
                                {article.views_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                    aria-label="الصفحة السابقة"
                  >
                    <FaArrowRight size={14} />
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        aria-label={`الصفحة ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border disabled:opacity-50 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                    aria-label="الصفحة التالية"
                  >
                    <FaArrowLeft size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            لماذا تتابع السمام نيوز؟
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaRocket className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">محتوى عملي</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نركز على مقالات قابلة للتطبيق تساعدك على فهم التقنية واستخدامها
                في مشروعك.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaGlobe className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">تحسين SEO</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                ننشر محتوى يساعد أصحاب المواقع على تحسين ظهورهم في Google
                ومحركات البحث.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <FaRobot className="text-blue-600 text-3xl mb-4" />
              <h3 className="font-bold text-lg mb-2">جاهزية الذكاء الاصطناعي</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                نغطي موضوعات تساعد المواقع على الظهور والفهم داخل نماذج الذكاء
                الاصطناعي مثل ChatGPT و DeepSeek.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              هل تريد تطوير موقع أو تطبيق احترافي؟
            </h2>

            <p className="max-w-2xl mx-auto mb-6 leading-8 text-blue-100">
              شركة السمام تساعدك في بناء موقع أو تطبيق أو نظام رقمي متكامل
              مع تحسين SEO وتجربة المستخدم.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold">
                خدماتنا
              </Link>
              <Link href="/contact" className="bg-blue-900/40 text-white px-6 py-3 rounded-xl font-bold border border-white/20">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="py-8 bg-gray-50 dark:bg-gray-900" aria-label="روابط داخلية">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/services" className="text-blue-600 font-bold">
            خدمات شركة السمام
          </Link>
          <Link href="/portfolio" className="text-blue-600 font-bold">
            أعمالنا
          </Link>
          <Link href="/about" className="text-blue-600 font-bold">
            من نحن
          </Link>
          <Link href="/contact" className="text-blue-600 font-bold">
            اتصل بنا
          </Link>
          <Link href="/llms.txt" className="text-blue-600 font-bold">
            AI Index
          </Link>
        </div>
      </nav>
    </main>
  );
}  import { supabase } from "@/services/supabase";
import NewsClient from "./NewsClient";

const baseUrl = "https://alssemam.com";

export const metadata = {
  title: "السمام نيوز | أخبار التقنية والبرمجة",
  description:
    "السمام نيوز منصة تقنية تقدم أخبار ومقالات عن البرمجة، تطوير المواقع، تطبيقات الموبايل، الذكاء الاصطناعي، وتحسين SEO.",
  alternates: {
    canonical: `${baseUrl}/news`,
  },
  openGraph: {
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description:
      "أحدث الأخبار والمقالات التقنية من شركة السمام في البرمجة وتطوير المواقع والتطبيقات.",
    url: `${baseUrl}/news`,
    siteName: "شركة السمام",
    type: "website",
    locale: "ar_AR",
    images: [
      {
        url: `${baseUrl}/logo/logo.webp`,
        width: 512,
        height: 512,
        alt: "السمام نيوز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "السمام نيوز | أخبار التقنية والبرمجة",
    description:
      "أحدث الأخبار والمقالات التقنية من شركة السمام.",
    images: [`${baseUrl}/logo/logo.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function NewsPage() {
  const articles = await getArticles();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        name: "السمام نيوز",
        url: `${baseUrl}/news`,
        logo: `${baseUrl}/logo/logo.webp`,
        parentOrganization: {
          "@type": "Organization",
          name: "شركة السمام",
          url: baseUrl,
        },
      },
      {
        "@type": "CollectionPage",
        name: "السمام نيوز",
        description:
          "أخبار ومقالات تقنية حول البرمجة وتطوير المواقع والتطبيقات والذكاء الاصطناعي.",
        url: `${baseUrl}/news`,
        inLanguage: "ar",
      },
      {
        "@type": "ItemList",
        name: "مقالات السمام نيوز",
        itemListElement: articles.slice(0, 20).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/news/${article.slug}`,
          name: article.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <NewsClient initialArticles={articles} />
    </>
  );
}