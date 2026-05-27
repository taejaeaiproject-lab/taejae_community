"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { CATEGORIES } from "@/lib/utils";
import { ArrowLeft, Trash2, Send } from "lucide-react";

type CategoryKey = keyof typeof CATEGORIES;

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  author: { id: string; name: string; role: string; cohort: number | null; profileImage: string | null };
  comments: Comment[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; role: string; cohort: number | null };
};

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    if (!comment.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setPost((p) => p ? { ...p, comments: [...p.comments, data] } : p);
      setComment("");
    }
  }

  async function handleDelete() {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/community");
  }

  function formatDate(s: string) {
    return new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-8" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) return null;

  const cat = CATEGORIES[post.category as CategoryKey] ?? CATEGORIES.GENERAL;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/community" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a3a5c] mb-6">
          <ArrowLeft size={15} />
          커뮤니티로 돌아가기
        </Link>

        {/* Post */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
            </div>
            {(session?.user.id === post.author.id || session?.user.role === "ADMIN") && (
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-sm">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{post.author.name}</span>
                <RoleBadge role={post.author.role} />
                {post.author.cohort && <span className="text-xs text-gray-400">{post.author.cohort}기</span>}
              </div>
              <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
            </div>
          </div>

          <div className="py-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="font-bold text-gray-900 mb-5">댓글 {post.comments.length}</h2>

          {post.comments.length > 0 && (
            <div className="space-y-5 mb-6">
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{c.author.name}</span>
                      <RoleBadge role={c.author.role} />
                      {c.author.cohort && <span className="text-xs text-gray-400">{c.author.cohort}기</span>}
                      <span className="text-xs text-gray-300">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleComment} className="flex gap-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-4 py-3 bg-[#1a3a5c] hover:bg-[#0f2340] text-white rounded-xl transition-colors disabled:opacity-50 shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
