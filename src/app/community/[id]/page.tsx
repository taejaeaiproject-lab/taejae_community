"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import LikeButton from "@/components/LikeButton";
import { CATEGORIES } from "@/lib/utils";
import { ArrowLeft, Trash2, Send, CornerDownRight, ChevronDown, Pencil, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type CategoryKey = keyof typeof CATEGORIES;

type Author = { id: string; name: string; role: string; cohort: number | null };

type CommentData = {
  id: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  author: Author;
  parentId: string | null;
  replies: CommentData[];
  liked: boolean;
  _count: { likes: number };
};

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  author: Author;
  comments: CommentData[];
  liked: boolean;
  likeCount: number;
};

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function CommentItem({
  comment, sessionId, sessionRole, postId,
  onDelete, onReply, depth = 0,
}: {
  comment: CommentData;
  sessionId: string;
  sessionRole: string;
  postId: string;
  onDelete: (id: string) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
  depth?: number;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [liked, setLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment._count.likes);

  async function submitReply() {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    await onReply(comment.id, replyText);
    setReplyText("");
    setReplyOpen(false);
    setSubmitting(false);
  }

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="py-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            {comment.isDeleted ? "·" : comment.author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            {!comment.isDeleted ? (
              <>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{comment.author.name}</span>
                  <RoleBadge role={comment.author.role} />
                  {comment.author.cohort && <span className="text-xs text-gray-400">{comment.author.cohort}기</span>}
                  <span className="text-xs text-gray-300">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{comment.content}</p>
                <div className="flex items-center gap-2">
                  <LikeButton
                    size="sm"
                    liked={liked}
                    count={likeCount}
                    onLike={async () => {
                      const res = await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
                      const data = await res.json();
                      setLiked(data.liked);
                      setLikeCount(data.count);
                      return data;
                    }}
                  />
                  {depth === 0 && (
                    <button
                      onClick={() => setReplyOpen((v) => !v)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1a3a5c] transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                    >
                      <CornerDownRight size={12} />
                      답글
                    </button>
                  )}
                  {(sessionId === comment.author.id || sessionRole === "ADMIN") && (
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="text-xs text-gray-300 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-300 italic py-1">삭제된 댓글입니다.</p>
            )}
          </div>
        </div>

        {replyOpen && (
          <div className="ml-11 mt-2 flex gap-2 animate-fade-in">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              placeholder="답글을 입력하세요..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30"
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submitReply(); }}
            />
            <button
              onClick={submitReply}
              disabled={submitting || !replyText.trim()}
              className="px-3 bg-[#1a3a5c] text-white rounded-xl disabled:opacity-40 hover:bg-[#0f2340] transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        )}

        {comment.replies.length > 0 && depth === 0 && (
          <div className="ml-11 mt-1">
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#1a3a5c] hover:underline mb-2"
            >
              <ChevronDown size={12} className={showReplies ? "rotate-180" : ""} />
              답글 {comment.replies.length}개
            </button>
            {showReplies && comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                sessionId={sessionId}
                sessionRole={sessionRole}
                postId={postId}
                onDelete={onDelete}
                onReply={onReply}
                depth={1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => { setPost(data); setLoading(false); });
  }, [id, status]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setPost((p) => p ? { ...p, comments: [...p.comments, { ...data, replies: [] }] } : p);
      setComment("");
    }
  }

  async function handleReply(parentId: string, content: string) {
    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });
    const data = await res.json();
    if (res.ok) {
      setPost((p) => {
        if (!p) return p;
        return {
          ...p,
          comments: p.comments.map((c) =>
            c.id === parentId ? { ...c, replies: [...(c.replies ?? []), { ...data, replies: [] }] } : c
          ),
        };
      });
    }
  }

  async function handleDeleteComment(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setPost((p) => {
        if (!p) return p;
        return {
          ...p,
          comments: p.comments.map((c) =>
            c.id === commentId
              ? { ...c, isDeleted: true, content: "삭제된 댓글입니다." }
              : { ...c, replies: c.replies.map((r) => r.id === commentId ? { ...r, isDeleted: true, content: "삭제된 댓글입니다." } : r) }
          ),
        };
      });
      toast("댓글이 삭제되었습니다.", "info");
    }
  }

  async function handleDeletePost() {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) { toast("게시글이 삭제되었습니다.", "info"); router.push("/community"); }
  }

  function startEdit() {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  }

  async function handleSaveEdit() {
    if (!post || editSaving) return;
    setEditSaving(true);
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    setEditSaving(false);
    if (res.ok) {
      setPost((p) => p ? { ...p, title: editTitle, content: editContent } : p);
      setEditing(false);
      toast("게시글이 수정되었습니다.", "success");
    } else {
      toast("수정에 실패했습니다.", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] pb-20 md:pb-0">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-8 animate-pulse h-64" />
        </main>
      </div>
    );
  }
  if (!post) return null;

  const cat = CATEGORIES[post.category as CategoryKey] ?? CATEGORIES.GENERAL;
  const totalComments = post.comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-20 md:pb-0">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a3a5c] mb-5 transition-colors">
          <ArrowLeft size={15} />돌아가기
        </Link>

        {/* Post */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
                  {post.isPinned && <span className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium">📌 공지</span>}
                </div>
                {editing ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xl font-bold border-b-2 border-[#1a3a5c] focus:outline-none py-1 bg-transparent"
                  />
                ) : (
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{post.title}</h1>
                )}
              </div>
              {(session?.user.id === post.author.id || session?.user.role === "ADMIN") && (
                <div className="flex items-center gap-1 shrink-0">
                  {editing ? (
                    <>
                      <button onClick={handleSaveEdit} disabled={editSaving} className="p-2 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#0f2340] transition-colors disabled:opacity-40">
                        <Check size={15} />
                      </button>
                      <button onClick={() => setEditing(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      {session?.user.id === post.author.id && (
                        <button onClick={startEdit} className="p-2 rounded-xl text-gray-300 hover:text-[#1a3a5c] hover:bg-blue-50 transition-colors">
                          <Pencil size={15} />
                        </button>
                      )}
                      <button onClick={handleDeletePost} className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{post.author.name}</span>
                  <RoleBadge role={post.author.role} />
                  {post.author.cohort && <span className="text-xs text-gray-400">{post.author.cohort}기</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(post.createdAt)}</div>
              </div>
            </div>

            <div className="py-6">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full text-[15px] text-gray-700 leading-relaxed border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 resize-y bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
              <LikeButton
                liked={post.liked}
                count={post.likeCount}
                onLike={async () => {
                  const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
                  return res.json();
                }}
              />
              <span className="text-sm text-gray-400">댓글 {totalComments}</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 md:px-8 pt-6 pb-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">댓글 {totalComments}</h2>
          </div>

          {post.comments.length > 0 && (
            <div className="px-6 md:px-8 divide-y divide-gray-50">
              {post.comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  sessionId={session?.user.id ?? ""}
                  sessionRole={session?.user.role ?? ""}
                  postId={id}
                  onDelete={handleDeleteComment}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}

          <form onSubmit={handleComment} className="px-6 md:px-8 py-5 border-t border-gray-50 flex gap-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="댓글을 입력하세요... (⌘+Enter로 등록)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 resize-none bg-gray-50 focus:bg-white transition-colors"
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleComment(e); }}
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-4 bg-[#1a3a5c] hover:bg-[#0f2340] text-white rounded-2xl transition-colors disabled:opacity-40 shrink-0 active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
