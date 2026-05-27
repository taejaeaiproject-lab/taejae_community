"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { useToast } from "@/components/ui/Toast";
import { Check, X, Users, Clock, MessageSquare, FileText, Pin, Trash2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils";

type CategoryKey = keyof typeof CATEGORIES;

type User = {
  id: string; name: string; nameEn: string | null; email: string;
  role: string; status: string; cohort: number | null; major: string | null;
  createdAt: string; company: string | null;
};

type Post = {
  id: string; title: string; category: string; isPinned: boolean;
  createdAt: string;
  author: { name: string; role: string };
  _count: { comments: number; likes: number };
};

type Comment = {
  id: string; content: string; isDeleted: boolean; createdAt: string;
  author: { name: string; role: string };
  post: { id: string; title: string };
};

const TABS = [
  { key: "members", label: "회원 관리", icon: Users },
  { key: "posts", label: "게시글 관리", icon: FileText },
  { key: "comments", label: "댓글 관리", icon: MessageSquare },
  { key: "stats", label: "통계", icon: BarChart3 },
] as const;

type TabKey = typeof TABS[number]["key"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("members");

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberFilter, setMemberFilter] = useState("PENDING");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session.user.role !== "ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  const fetchAll = useCallback(async () => {
    if (status !== "authenticated" || session?.user.role !== "ADMIN") return;
    setLoading(true);
    const [u, p, c] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/posts").then((r) => r.json()),
      fetch("/api/admin/comments").then((r) => r.json()),
    ]);
    setUsers(Array.isArray(u) ? u : []);
    setPosts(Array.isArray(p) ? p : []);
    setComments(Array.isArray(c) ? c : []);
    setLoading(false);
  }, [status, session]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateUserStatus(userId: string, newStatus: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
      toast(newStatus === "APPROVED" ? "승인되었습니다." : "거절되었습니다.", newStatus === "APPROVED" ? "success" : "info");
    }
  }

  async function togglePin(postId: string, isPinned: boolean) {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !isPinned }),
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, isPinned: !isPinned } : p));
      toast(!isPinned ? "게시글을 고정했습니다." : "고정을 해제했습니다.", "info");
    }
  }

  async function deletePost(postId: string) {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) { setPosts((prev) => prev.filter((p) => p.id !== postId)); toast("게시글이 삭제되었습니다.", "info"); }
  }

  async function deleteComment(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isDeleted: true, content: "삭제된 댓글입니다." } : c));
      toast("댓글이 삭제되었습니다.", "info");
    }
  }

  const pendingCount = users.filter((u) => u.status === "PENDING").length;
  const approvedCount = users.filter((u) => u.status === "APPROVED").length;
  const filteredUsers = users.filter((u) => memberFilter === "ALL" ? true : u.status === memberFilter);

  const stats = {
    members: approvedCount,
    pending: pendingCount,
    posts: posts.length,
    comments: comments.filter((c) => !c.isDeleted).length,
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24 md:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">관리자 패널</h1>
          <p className="text-gray-500 text-sm">회원·게시글·댓글을 관리합니다</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "승인 회원", value: stats.members, icon: Users, color: "text-[#1a3a5c]", bg: "bg-blue-50" },
            { label: "승인 대기", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50",
              badge: stats.pending > 0 },
            { label: "전체 게시글", value: stats.posts, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "전체 댓글", value: stats.comments, icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
          ].map(({ label, value, icon: Icon, color, bg, badge }) => (
            <button key={label} onClick={() => {
              if (label === "승인 대기") { setTab("members"); setMemberFilter("PENDING"); }
              else if (label === "전체 게시글") setTab("posts");
              else if (label === "전체 댓글") setTab("comments");
              else { setTab("members"); setMemberFilter("APPROVED"); }
            }} className={`${bg} rounded-2xl p-5 text-left hover:shadow-md transition-all card-hover relative`}>
              {badge && <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full pulse-dot" />}
              <Icon size={20} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-gray-900">{loading ? "…" : value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                  tab === key
                    ? "text-[#1a3a5c] border-[#1a3a5c]"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                <Icon size={15} />
                {label}
                {key === "members" && pendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Members tab */}
          {tab === "members" && (
            <div>
              <div className="flex gap-2 p-4 border-b border-gray-50 overflow-x-auto">
                {[
                  { value: "PENDING", label: `대기 (${pendingCount})` },
                  { value: "APPROVED", label: "승인됨" },
                  { value: "REJECTED", label: "거절됨" },
                  { value: "ALL", label: "전체" },
                ].map(({ value, label }) => (
                  <button key={value} onClick={() => setMemberFilter(value)}
                    className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                      memberFilter === value ? "bg-[#1a3a5c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}>
                    {label}
                  </button>
                ))}
              </div>
              {loading ? <div className="p-8 text-center text-gray-400">불러오는 중…</div>
                : filteredUsers.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">해당 목록이 없습니다.</div>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                          <th className="text-left px-5 py-3 font-medium">이름</th>
                          <th className="text-left px-5 py-3 font-medium">이메일</th>
                          <th className="text-left px-5 py-3 font-medium">구분</th>
                          <th className="text-left px-5 py-3 font-medium">기수</th>
                          <th className="text-left px-5 py-3 font-medium">신청일</th>
                          <th className="text-left px-5 py-3 font-medium">상태</th>
                          <th className="text-left px-5 py-3 font-medium">액션</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 font-semibold text-gray-900">
                              {u.name}
                              {u.nameEn && <span className="text-xs text-gray-400 ml-1.5 font-normal">({u.nameEn})</span>}
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs">{u.email}</td>
                            <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                            <td className="px-5 py-4 text-gray-400">{u.cohort ? `${u.cohort}기` : "-"}</td>
                            <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                            <td className="px-5 py-4">
                              <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                                u.status === "APPROVED" ? "bg-green-100 text-green-700"
                                  : u.status === "REJECTED" ? "bg-red-100 text-red-600"
                                  : "bg-amber-100 text-amber-700"
                              )}>
                                {u.status === "APPROVED" ? "승인됨" : u.status === "REJECTED" ? "거절됨" : "대기 중"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {u.status === "PENDING" && (
                                <div className="flex gap-2">
                                  <button onClick={() => updateUserStatus(u.id, "APPROVED")}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors">
                                    <Check size={12} />승인
                                  </button>
                                  <button onClick={() => updateUserStatus(u.id, "REJECTED")}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors">
                                    <X size={12} />거절
                                  </button>
                                </div>
                              )}
                              {u.status === "APPROVED" && (
                                <button onClick={() => updateUserStatus(u.id, "REJECTED")}
                                  className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-xl transition-colors">
                                  취소
                                </button>
                              )}
                              {u.status === "REJECTED" && (
                                <button onClick={() => updateUserStatus(u.id, "APPROVED")}
                                  className="px-3 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 text-xs rounded-xl transition-colors">
                                  재승인
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          )}

          {/* Posts tab */}
          {tab === "posts" && (
            <div>
              {loading ? <div className="p-8 text-center text-gray-400">불러오는 중…</div>
                : posts.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">게시글이 없습니다.</div>
                : (
                  <div className="divide-y divide-gray-50">
                    {posts.map((p) => {
                      const cat = CATEGORIES[p.category as CategoryKey] ?? CATEGORIES.GENERAL;
                      return (
                        <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 group transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {p.isPinned && <Pin size={12} className="text-[#1a3a5c] shrink-0" />}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                              <RoleBadge role={p.author.role} />
                              <span className="text-xs text-gray-400">{p.author.name}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 truncate">{p.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              댓글 {p._count.comments} · 좋아요 {p._count.likes} · {formatDate(p.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => togglePin(p.id, p.isPinned)}
                              className={cn("flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors",
                                p.isPinned ? "bg-[#1a3a5c]/10 text-[#1a3a5c] hover:bg-[#1a3a5c]/20" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              )}>
                              <Pin size={12} />
                              {p.isPinned ? "고정 해제" : "상단 고정"}
                            </button>
                            <button onClick={() => deletePost(p.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                              <Trash2 size={12} />삭제
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* Comments tab */}
          {tab === "comments" && (
            <div>
              {loading ? <div className="p-8 text-center text-gray-400">불러오는 중…</div>
                : comments.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">댓글이 없습니다.</div>
                : (
                  <div className="divide-y divide-gray-50">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 group transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <RoleBadge role={c.author.role} />
                            <span className="text-xs font-medium text-gray-700">{c.author.name}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <a href={`/community/${c.post.id}`} className="text-xs text-[#1a3a5c] hover:underline truncate max-w-[200px]">
                              {c.post.title}
                            </a>
                            <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className={cn("text-sm", c.isDeleted ? "text-gray-300 italic" : "text-gray-700")}>
                            {c.isDeleted ? "삭제된 댓글입니다." : c.content}
                          </p>
                        </div>
                        {!c.isDeleted && (
                          <button onClick={() => deleteComment(c.id)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <Trash2 size={12} />삭제
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* Stats tab */}
          {tab === "stats" && (
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {[
                { label: "역할별 회원 분포", data: ["STUDENT","ALUMNI","FACULTY","SPONSOR","ADMIN"].map((r) => ({
                  name: { STUDENT:"재학생",ALUMNI:"동문",FACULTY:"교직원",SPONSOR:"후원자/기업",ADMIN:"관리자" }[r] ?? r,
                  value: users.filter((u) => u.role === r && u.status === "APPROVED").length,
                })).filter((d) => d.value > 0) },
                { label: "기수별 재학생", data: [1,2,3].map((c) => ({
                  name: `${c}기`,
                  value: users.filter((u) => u.cohort === c && u.status === "APPROVED").length,
                })).filter((d) => d.value > 0) },
              ].map(({ label, data }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">{label}</h3>
                  <div className="space-y-3">
                    {data.length === 0
                      ? <p className="text-gray-400 text-sm">데이터 없음</p>
                      : data.map(({ name, value }) => {
                        const max = Math.max(...data.map((d) => d.value));
                        return (
                          <div key={name} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-20 shrink-0">{name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div className="h-2 rounded-full bg-[#1a3a5c] transition-all" style={{ width: `${(value / max) * 100}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-6 text-right">{value}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
