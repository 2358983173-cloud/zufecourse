import React, { useEffect, useMemo, useState } from "react";
import { Flag, Loader2, MessageCircle, RefreshCcw, Send, ThumbsUp, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router";
import { CourseComment, deleteComment, getAuthUser, getComments, postComment, reportComment, toggleCommentLike } from "../api";

export const CommentSection = ({ courseId }: { courseId: string }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const cacheKey = `courseComments:${courseId}`;
  const readCache = () => {
    try { return JSON.parse(localStorage.getItem(cacheKey) || "[]") as CourseComment[]; }
    catch { return []; }
  };
  const [comments, setComments] = useState<CourseComment[]>(readCache);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<CourseComment | null>(null);
  const [loading, setLoading] = useState(comments.length === 0);
  const [submitting, setSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<"newest" | "popular">("newest");
  const [error, setError] = useState("");

  const load = async (fresh = false) => {
    try {
      if (comments.length === 0) setLoading(true);
      const latest = (await getComments(courseId, fresh)).comments;
      setComments(latest);
      localStorage.setItem(cacheKey, JSON.stringify(latest));
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "评论加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);
  const roots = useMemo(() => comments.filter((item) => !item.parentId).sort((a, b) => sortMode === "popular" ? b.likes - a.likes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [comments, sortMode]);

  const submit = async () => {
    if (!user) return navigate("/login");
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      await postComment(courseId, content, replyTo?.id);
      setContent("");
      setReplyTo(null);
      await load(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "评论发布失败");
    } finally {
      setSubmitting(false);
    }
  };

  const canDelete = (comment: CourseComment) => user?.role === "admin" || user?.id === comment.userId;
  const toggleLike = async (comment: CourseComment) => {
    if (!user) return navigate("/login");
    const previous = comments;
    setComments((items) => items.map((item) => item.id === comment.id ? {
      ...item,
      liked: !item.liked,
      likes: Math.max(0, item.likes + (item.liked ? -1 : 1)),
    } : item));
    try { await toggleCommentLike(comment.id); }
    catch (requestError) {
      setComments(previous);
      setError(requestError instanceof Error ? requestError.message : "点赞失败");
    }
  };

  const Comment = ({ comment, reply = false }: { comment: CourseComment; reply?: boolean }) => (
    <div className={`${reply ? "ml-11 mt-3 border-l-2 border-blue-100 pl-4" : "rounded-xl border border-gray-200 bg-white p-4 lg:p-5"}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0"><User size={17} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-gray-900">{comment.nickname}{comment.role === "admin" && <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] text-blue-700">管理员</span>}</p>
            <span className="text-[10px] font-medium text-gray-400">{new Date(comment.createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
          <p className="mt-3 text-sm font-medium leading-7 text-gray-600">{comment.content}</p>
          <div className="mt-4 flex gap-4 border-t border-gray-100 pt-3">
            <button onClick={() => toggleLike(comment)} className={`flex items-center gap-1.5 text-xs font-bold ${comment.liked ? "text-blue-700" : "text-gray-400 hover:text-blue-700"}`}><ThumbsUp size={14} />有帮助 {comment.likes}</button>
            {!reply && <button onClick={() => user ? setReplyTo(comment) : navigate("/login")} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-700"><MessageCircle size={14} />回复</button>}
            <button onClick={async () => { if (!user) return navigate("/login"); await reportComment(comment.id); }} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-amber-600"><Flag size={13} />举报</button>
            {canDelete(comment) && <button onClick={async () => { await deleteComment(comment.id); await load(true); }} className="flex items-center gap-1 text-xs font-bold text-red-400"><Trash2 size={13} />删除</button>}
          </div>
        </div>
      </div>
      {!reply && comments.filter((item) => item.parentId === comment.id).map((item) => <Comment key={item.id} comment={item} reply />)}
    </div>
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div><h2 className="text-lg font-black text-gray-950 lg:text-xl">课程讨论</h2><p className="mt-1 text-xs text-gray-400">{comments.length} 条讨论 · 分享真实修读体验</p></div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-gray-100 p-1">{(["newest", "popular"] as const).map((mode) => <button key={mode} onClick={() => setSortMode(mode)} className={`h-8 rounded-md px-3 text-xs font-bold ${sortMode === mode ? "bg-white text-blue-800 shadow-sm" : "text-gray-500"}`}>{mode === "newest" ? "最新" : "热门"}</button>)}</div>
          <button onClick={() => load(true)} title="刷新评论" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-700"><RefreshCcw size={15} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3 lg:p-4">
        {replyTo && <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"><span>正在回复 {replyTo.nickname}</span><button onClick={() => setReplyTo(null)}>取消回复</button></div>}
        <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={500} placeholder={user ? "写下课程难度、考核方式或学习建议..." : "登录后参与课程讨论"} className="w-full min-h-24 resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium outline-none focus:border-blue-500" />
        <div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-gray-400">{content.length} / 500</span><button onClick={submit} disabled={submitting || Boolean(user && !content.trim())} className="flex h-9 items-center gap-2 rounded-lg bg-blue-800 px-4 text-xs font-bold text-white disabled:opacity-40">{submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}{user ? submitting ? "发布中" : "发布评论" : "登录后评论"}</button></div>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p>}
      <div className="mt-5 space-y-3">
        {loading ? <div className="py-12 text-center"><Loader2 size={22} className="mx-auto animate-spin text-blue-700" /><p className="mt-3 text-xs font-bold text-gray-400">正在加载评论</p></div> : roots.length ? roots.map((comment) => <Comment key={comment.id} comment={comment} />) : <p className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-xs font-bold text-gray-400">还没有评论，欢迎分享第一条修读体验。</p>}
      </div>
    </section>
  );
};
