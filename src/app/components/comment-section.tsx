import React, { useEffect, useMemo, useState } from "react";
import { Flag, MessageCircle, Send, ThumbsUp, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router";
import { CourseComment, deleteComment, getAuthUser, getComments, postComment, reportComment, toggleCommentLike } from "../api";

export const CommentSection = ({ courseId }: { courseId: string }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<CourseComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setComments((await getComments(courseId)).comments);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "评论加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);
  const roots = useMemo(() => comments.filter((item) => !item.parentId), [comments]);

  const submit = async () => {
    if (!user) return navigate("/login");
    if (!content.trim()) return;
    try {
      await postComment(courseId, content, replyTo?.id);
      setContent("");
      setReplyTo(null);
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "评论发布失败");
    }
  };

  const Comment = ({ comment, reply = false }: { comment: CourseComment; reply?: boolean }) => (
    <div className={`${reply ? "ml-9 mt-3 border-l-2 border-blue-50 pl-3" : "py-4 border-b border-gray-100 last:border-0"}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0"><User size={17} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black text-gray-900">{comment.nickname}{comment.role === "admin" && <span className="ml-2 text-[9px] text-blue-700">管理员</span>}</p>
            <span className="text-[9px] font-bold text-gray-300">{new Date(comment.createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
          <p className="mt-2 text-xs font-medium leading-relaxed text-gray-600">{comment.content}</p>
          <div className="mt-3 flex gap-4">
            <button onClick={async () => { if (!user) return navigate("/login"); await toggleCommentLike(comment.id); await load(); }} className={`flex items-center gap-1 text-[10px] font-black ${comment.liked ? "text-blue-700" : "text-gray-400"}`}><ThumbsUp size={13} />{comment.likes}</button>
            {!reply && <button onClick={() => user ? setReplyTo(comment) : navigate("/login")} className="flex items-center gap-1 text-[10px] font-black text-gray-400"><MessageCircle size={13} />回复</button>}
            <button onClick={async () => { if (!user) return navigate("/login"); await reportComment(comment.id); }} className="flex items-center gap-1 text-[10px] font-black text-gray-400"><Flag size={13} />举报</button>
            {comment.canDelete && <button onClick={async () => { await deleteComment(comment.id); await load(); }} className="flex items-center gap-1 text-[10px] font-black text-red-400"><Trash2 size={13} />删除</button>}
          </div>
        </div>
      </div>
      {!reply && comments.filter((item) => item.parentId === comment.id).map((item) => <Comment key={item.id} comment={item} reply />)}
    </div>
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-gray-900">课程评论</h2>
        <span className="text-[10px] font-black text-gray-400">{comments.length} 条讨论</span>
      </div>
      <div className="rounded-[22px] bg-gray-50 p-3">
        {replyTo && <div className="mb-2 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-[10px] font-bold text-blue-700"><span>回复 {replyTo.nickname}</span><button onClick={() => setReplyTo(null)}>取消</button></div>}
        <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={500} placeholder={user ? "分享真实修读体验..." : "登录后参与课程讨论"} className="w-full min-h-20 resize-none rounded-xl border-none bg-white p-3 text-xs font-medium" />
        <button onClick={submit} className="mt-2 ml-auto h-9 px-4 rounded-xl bg-blue-800 text-white text-xs font-black flex items-center gap-2"><Send size={13} />发布</button>
      </div>
      {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p>}
      <div className="mt-4 rounded-[22px] bg-white border border-gray-100 px-4 shadow-sm">
        {loading ? <p className="py-8 text-center text-xs font-bold text-gray-400">正在加载评论...</p> : roots.length ? roots.map((comment) => <Comment key={comment.id} comment={comment} />) : <p className="py-8 text-center text-xs font-bold text-gray-400">还没有评论，欢迎分享第一条修读体验。</p>}
      </div>
    </section>
  );
};
