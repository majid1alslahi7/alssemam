'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { 
  FaArrowRight, FaCalendarAlt, FaUser, FaEye, FaStar,
  FaExternalLinkAlt, FaCode, FaMobileAlt, FaDesktop, FaImage,
  FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaShareAlt,
  FaBookmark, FaComment, FaThumbsUp, FaReply, FaPaperPlane,
  FaWhatsapp, FaFacebookF, FaTelegram, FaInstagram, FaEnvelope,
  FaCopy, FaLink, FaShare, FaClock, FaTag
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '', rating: 5 });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    if (slug) {
      loadProject();
      incrementViews();
    }
  }, [slug]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error) throw error;
      setProject(data);
      setActiveImage(data.primary_image);
      if (data.technologies) {
        try {
          const techs = typeof data.technologies === 'string' ? JSON.parse(data.technologies) : data.technologies;
          setTechnologies(Array.isArray(techs) ? techs : []);
        } catch { setTechnologies([]); }
      }
      loadComments(data.id);
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      if (likedProjects.includes(data.id)) setLiked(true);
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      if (savedProjects.includes(data.id)) setSaved(true);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const { data } = await supabase.from('projects').select('views_count').eq('slug', slug).single();
      await supabase.from('projects').update({ views_count: (data?.views_count || 0) + 1 }).eq('slug', slug);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const loadComments = async (projectId) => {
    try {
      const { data } = await supabase.from('comments').select('*').eq('project_id', projectId).is('parent_id', null).eq('is_approved', true).order('created_at', { ascending: false });
      const commentsWithReplies = await Promise.all((data || []).map(async (comment) => {
        const { data: replies } = await supabase.from('comments').select('*').eq('parent_id', comment.id).eq('is_approved', true).order('created_at', { ascending: true });
        return { ...comment, replies: replies || [] };
      }));
      setComments(commentsWithReplies || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = () => {
    if (liked) { toast.success('لقد أعجبت بهذا المشروع مسبقاً'); return; }
    setLiked(true);
    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
    if (!likedProjects.includes(project.id)) {
      likedProjects.push(project.id);
      localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
    }
    toast.success('شكراً لإعجابك بالمشروع!');
  };

  const handleSave = () => {
    if (saved) {
      setSaved(false);
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      localStorage.setItem('savedProjects', JSON.stringify(savedProjects.filter(id => id !== project.id)));
      toast.success('تم إزالة المشروع من المحفوظات');
    } else {
      setSaved(true);
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      if (!savedProjects.includes(project.id)) {
        savedProjects.push(project.id);
        localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
      }
      toast.success('تم حفظ المشروع');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: project?.title, text: project?.short_description, url: window.location.href });
        toast.success('تمت المشاركة بنجاح');
        setShowShare(false);
      } catch (err) {
        if (err.name !== 'AbortError') toast.error('تعذرت المشاركة');
      }
    } else {
      handleCopyLink();
      toast.success('تم نسخ الرابط، يمكنك مشاركته الآن');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('تعذر نسخ الرابط'));
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = project?.title || 'مشروع';
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`; break;
      case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShare(false);
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.success('تم نسخ الرابط! الصقه في انستجرام');
    setShowShare(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.content) { toast.error('الرجاء إدخال الاسم والتعليق'); return; }
    setSubmittingComment(true);
    try {
      const commentData = {
        project_id: project.id,
        user_name: newComment.name,
        user_email: newComment.email || null,
        content: replyTo ? `@${replyTo.user_name} ${newComment.content}` : newComment.content,
        rating: newComment.rating,
        is_approved: true,
        parent_id: replyTo?.id || null
      };
      const { error } = await supabase.from('comments').insert([commentData]);
      if (error) throw error;
      toast.success('تم إرسال تعليقك بنجاح!');
      setNewComment({ name: '', email: '', content: '', rating: 5 });
      setReplyTo(null);
      loadComments(project.id);
    } catch (error) {
      toast.error('حدث خطأ في إرسال التعليق');
    } finally {
      setSubmittingComment(false);
    }
  };

  const allImages = project ? [project.primary_image, ...(project.screenshots || [])].filter(Boolean) : [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  if (!project) {
    return <div className="pt-32 text-center min-h-screen"><h1 className="text-2xl font-bold mb-4">المشروع غير موجود</h1><Link href="/portfolio" className="text-blue-600 hover:underline">العودة إلى أعمالنا</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />

      <AnimatePresence>
        {showLightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
            <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 text-white text-2xl p-2 hover:bg-white/10 rounded-full"><FaTimes /></button>
            <button onClick={(e) => { e.stopPropagation(); const i = allImages.indexOf(activeImage); setActiveImage(allImages[(i - 1 + allImages.length) % allImages.length]); }} className="absolute left-4 text-white text-2xl p-4 hover:bg-white/10 rounded-full"><FaChevronLeft /></button>
            <div className="relative w-full max-w-4xl h-[80vh] mx-4"><Image src={activeImage} alt={project.title} fill className="object-contain" /></div>
            <button onClick={(e) => { e.stopPropagation(); const i = allImages.indexOf(activeImage); setActiveImage(allImages[(i + 1) % allImages.length]); }} className="absolute right-4 text-white text-2xl p-4 hover:bg-white/10 rounded-full"><FaChevronRight /></button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">{allImages.map((img, i) => <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImage(img); }} className={`w-16 h-16 relative rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-blue-500' : 'border-transparent'}`}><Image src={img} alt="" fill className="object-cover" /></button>)}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"><FaArrowRight size={14} />العودة إلى أعمالنا</Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
              {project.primary_image ? (
                <div className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setShowLightbox(true)}>
                  <Image src={project.primary_image} alt={project.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100"><span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm">اضغط للتكبير</span></div>
                </div>
              ) : (
                <div className="h-[400px] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">{project.category === 'web' ? <FaDesktop size={80} className="text-white/30" /> : <FaMobileAlt size={80} className="text-white/30" />}</div>
              )}
              {project.screenshots?.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {project.screenshots.map((img, i) => <motion.div key={i} whileHover={{ scale: 1.05 }} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer" onClick={() => { setActiveImage(img); setShowLightbox(true); }}><Image src={img} alt={`Screenshot ${i+1}`} fill className="object-cover" /></motion.div>)}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="overflow-visible">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLike} className={`p-2 rounded-full transition ${liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}><FaHeart size={20} /></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave} className={`p-2 rounded-full transition ${saved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}><FaBookmark size={20} /></motion.button>
                  <div className="relative overflow-visible">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowShare(!showShare)} className="p-2 rounded-full text-gray-400 hover:text-blue-600 transition"><FaShareAlt size={20} /></motion.button>
                    <AnimatePresence>
                      {showShare && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 z-[100] w-[360px] border border-gray-200 dark:border-gray-700 overflow-visible" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between mb-4"><p className="font-bold text-gray-800 dark:text-white text-lg">مشاركة المشروع</p><button onClick={() => setShowShare(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"><FaTimes size={14} /></button></div>
                          <div className="grid grid-cols-4 gap-3 mb-4">
                            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-1.5 p-2 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100"><FaWhatsapp className="text-green-500 text-2xl" /><span className="text-xs">واتساب</span></button>
                            <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100"><FaFacebookF className="text-blue-600 text-2xl" /><span className="text-xs">فيسبوك</span></button>
                            <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200"><FaXTwitter className="text-gray-800 dark:text-white text-2xl" /><span className="text-xs">إكس</span></button>
                            <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-1.5 p-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl hover:bg-sky-100"><FaTelegram className="text-sky-500 text-2xl" /><span className="text-xs">تليجرام</span></button>
                            <button onClick={handleInstagramShare} className="flex flex-col items-center gap-1.5 p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:bg-pink-100"><FaInstagram className="text-pink-500 text-2xl" /><span className="text-xs">انستجرام</span></button>
                            <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100"><FaEnvelope className="text-gray-500 text-2xl" /><span className="text-xs">بريد</span></button>
                            <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100"><FaCopy className="text-gray-500 text-2xl" /><span className="text-xs">{copied ? 'تم النسخ' : 'نسخ'}</span></button>
                            <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5 p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 border border-blue-200"><FaShare className="text-blue-600 text-2xl" /><span className="text-xs text-blue-600">مشاركة</span></button>
                          </div>
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <input type="text" value={typeof window !== 'undefined' ? window.location.href : ''} readOnly className="flex-1 bg-transparent text-sm outline-none" />
                              <button onClick={handleCopyLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><FaLink size={12} />{copied ? 'تم النسخ' : 'نسخ'}</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">{project.category === 'web' ? <><FaDesktop size={12} />تطوير مواقع</> : <><FaMobileAlt size={12} />تطبيقات موبايل</>}</span>
                {project.featured && <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"><FaStar size={12} />مميز</span>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                {project.client && <div className="flex items-center gap-2"><FaUser className="text-blue-500" /><div><p className="text-xs text-gray-500">العميل</p><p className="font-semibold">{project.client}</p></div></div>}
                {project.completion_date && <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /><div><p className="text-xs text-gray-500">تاريخ الإنجاز</p><p className="font-semibold">{new Date(project.completion_date).toLocaleDateString('ar-EG')}</p></div></div>}
                <div className="flex items-center gap-2"><FaEye className="text-blue-500" /><div><p className="text-xs text-gray-500">المشاهدات</p><p className="font-semibold">{project.views_count || 0}</p></div></div>
                <div className="flex items-center gap-2"><FaCode className="text-blue-500" /><div><p className="text-xs text-gray-500">التقنيات</p><p className="font-semibold">{technologies.length}</p></div></div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{project.short_description}</p>

              {project.project_url && (
                <motion.a href={project.project_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30"><FaExternalLinkAlt size={16} />زيارة المشروع المباشر</motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">وصف المشروع</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{project.long_description}</p>
              </motion.div>

              {/* التعليقات */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaComment className="text-blue-500" />التعليقات ({comments.length})</h2>
                
                <form onSubmit={handleSubmitComment} className="mb-8">
                  {replyTo && <div className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"><span className="text-sm">رد على @{replyTo.user_name}</span><button type="button" onClick={() => setReplyTo(null)} className="text-gray-500"><FaTimes /></button></div>}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="اسمك *" value={newComment.name} onChange={(e) => setNewComment({...newComment, name: e.target.value})} className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-700" required />
                    <input type="email" placeholder="بريدك الإلكتروني" value={newComment.email} onChange={(e) => setNewComment({...newComment, email: e.target.value})} className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-700" />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm">تقييمك للمشروع</label>
                    <div className="flex gap-1">{[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setNewComment({...newComment, rating: star})} className="text-2xl">{star <= newComment.rating ? <FaStar className="text-yellow-500" /> : <FaStar className="text-gray-300" />}</button>)}</div>
                  </div>
                  <textarea placeholder="اكتب تعليقك هنا..." value={newComment.content} onChange={(e) => setNewComment({...newComment, content: e.target.value})} rows="4" className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 resize-none mb-4" required />
                  <button type="submit" disabled={submittingComment} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2"><FaPaperPlane size={14} />{submittingComment ? 'جاري الإرسال...' : 'إرسال التعليق'}</button>
                </form>

                <div className="space-y-4">
                  {comments.length === 0 ? <p className="text-center text-gray-500 py-8">لا توجد تعليقات بعد. كن أول من يعلق!</p> : comments.map((comment) => (
                    <motion.div key={comment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">{comment.user_name?.charAt(0) || 'م'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><span className="font-semibold">{comment.user_name}</span><span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('ar-EG')}</span>{comment.rating && <div className="flex items-center gap-0.5 mr-auto">{[...Array(5)].map((_, i) => <FaStar key={i} size={12} className={i < comment.rating ? 'text-yellow-500' : 'text-gray-300'} />)}</div>}</div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button onClick={() => { setReplyTo(comment); setNewComment({...newComment, content: ''}); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"><FaReply size={12} />رد</button>
                          </div>
                          {comment.replies?.length > 0 && (
                            <div className="mt-3 space-y-3 pr-4 border-r-2 border-gray-200 dark:border-gray-700">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold">{reply.user_name?.charAt(0) || 'م'}</div>
                                  <div><div className="flex items-center gap-2"><span className="font-semibold text-sm">{reply.user_name}</span><span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString('ar-EG')}</span></div><p className="text-gray-600 dark:text-gray-400 text-sm">{reply.content}</p></div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaCode className="text-blue-500" />التقنيات المستخدمة</h2>
                {technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">{technologies.map((tech, i) => <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-full text-sm">{tech}</motion.span>)}</div>
                ) : <p className="text-gray-500">لم يتم تحديد تقنيات</p>}
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link href={`/project/${slug}/gallery`} className="flex items-center justify-between text-blue-600 hover:text-blue-700">
                    <span className="flex items-center gap-2"><FaImage />معرض الصور</span>
                    <FaArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
