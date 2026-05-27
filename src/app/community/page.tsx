"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { CATEGORIES } from "@/lib/utils";
import { Plus, MessageSquare, Pin } from "lucide-react";

type CategoryKey = keyof typeof CATEGORIES;

type Post = {
  id: string;
  title: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  author: { name: string; role: string; cohort: number | null };
  _count: { comments: number };
};

export default function CommunityPage() {
  const { status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("ALL");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams();
    if (catFilter !== "ALL") params.set("category", catFilter);
    setLoading(true);
    fetch(`/api/posts?${params}`)
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); });
  }, [status, catFilter]);

  function formatDate(s: string) {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">커뮤니티</h1>
            <p className="text-gray-500 text-sm">태재인들의 이야기를 나눠보세요</p>
          </div>
          <Link
            href="/community/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={16} />
            글쓰기
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setCatFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              catFilter === "ALL"
                ? "bg-[#1a3a5c] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a5c]"
            }`}
          >
            전체
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setCatFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                catFilter === key
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a5c]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="mb-2">아직 게시글이 없습니다.</p>
              <Link href="/community/new" className="text-[#1a3a5c] text-sm hover:underline">첫 글 작성하기 →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {posts.map((post) => {
                const cat = CATEGORIES[post.category as CategoryKey] ?? CATEGORIES.GENERAL;
                return (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {post.isPinned && <Pin size={12} className="text-red-500 shrink-0" />}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                        <RoleBadge role={post.author.role} />
                        <span className="text-xs text-gray-400">{post.author.name}</span>
                        {post.author.cohort && (
                          <span className="text-xs text-gray-300">{post.author.cohort}기</span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{post.title}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                      <MessageSquare size={12} />
                      {post._count.comments}
                    </div>
                    <div className="text-xs text-gray-300 shrink-0 hidden sm:block">{formatDate(post.createdAt)}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
