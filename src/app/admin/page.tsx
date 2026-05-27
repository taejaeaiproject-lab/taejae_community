"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils";
import {
  Check, X, Users, Clock, MessageSquare, FileText,
  Pin, Trash2, BarChart3, FolderKanban, BookOpen, Zap, Plus,
} from "lucide-react";

type CategoryKey = keyof typeof CATEGORIES;

type User = {
  id: string; name: string; nameEn: string | null; email: string;
  role: string; status: string; cohort: number | null; major: string | null;
  createdAt: string;
};
type Post = {
  id: string; title: string; category: string; isPinned: boolean; createdAt: string;
  author: { name: string; role: string };
  _count: { comments: number; likes: number };
};
type Comment = {
  id: string; content: string; isDeleted: boolean; createdAt: string;
  author: { name: string; role: string };
  post: { id: string; title: string };
};
type Project = {
  id: string; title: string; description: string; tags: string | null;
  status: string; teamMembers: string | null; demoUrl: string | null;
  githubUrl: string | null; createdAt: string;
  _count: { comments: number };
};
type LearningItem = {
  id: string; title: string; description: string;
  category: string; instructor: string | null; tags: string | null;
};
type ActivityItem = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};

const TABS = [
  { key: "members",  label: "회원",    icon: Users },
  { key: "projects", label: "Project", icon: FolderKanban },
  { key: "learning", label: "Learning",icon: BookOpen },
  { key: "activity", label: "Activity",icon: Zap },
  { key: "posts",    label: "게시글",  icon: FileText },
  { key: "comments", label: "댓글",    icon: MessageSquare },
  { key: "stats",    label: "통계",    icon: BarChart3 },
] as const;
type TabKey = typeof TABS[number]["key"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

/* ─── Reusable Field ────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
const inp = "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 bg-white";
const textarea = `${inp} resize-none`;

/* ─── Add Project Form ──────────────────────────────────────── */
function AddProjectForm({ onAdd }: { onAdd: (p: Project) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "", status: "ONGOING", teamMembers: "", demoUrl: "", githubUrl: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      onAdd({ ...data, _count: { comments: 0 } });
      setForm({ title: "", description: "", tags: "", status: "ONGOING", teamMembers: "", demoUrl: "", githubUrl: "" });
      setOpen(false);
      toast("프로젝트가 추가되었습니다.", "success");
    } else toast("추가에 실패했습니다.", "error");
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors">
      <Plus size={14} />새 프로젝트
    </button>
  );

  return (
    <form onSubmit={submit} className="border border-[#1a3a5c]/20 rounded-2xl p-5 bg-[#1a3a5c]/3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="제목 *"><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inp} placeholder="프로젝트 이름" /></Field>
        <Field label="상태">
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inp}>
            <option value="ONGOING">진행 중</option>
            <option value="COMPLETED">완료</option>
          </select>
        </Field>
      </div>
      <Field label="설명 *"><textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={textarea} placeholder="프로젝트 설명" /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="팀원 (쉼표 구분)"><input value={form.teamMembers} onChange={(e) => setForm((f) => ({ ...f, teamMembers: e.target.value }))} className={inp} placeholder="홍길동, 김철수" /></Field>
        <Field label="태그 (쉼표 구분)"><input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={inp} placeholder="AI, 데이터, UX" /></Field>
        <Field label="Demo URL"><input value={form.demoUrl} onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))} className={inp} placeholder="https://..." /></Field>
        <Field label="GitHub URL"><input value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} className={inp} placeholder="https://github.com/..." /></Field>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-[#1a3a5c] text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover:bg-[#0f2340] transition-colors">
          {saving ? "저장 중…" : "저장"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-200 text-sm text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">취소</button>
      </div>
    </form>
  );
}

/* ─── Add Learning Form ─────────────────────────────────────── */
function AddLearningForm({ onAdd }: { onAdd: (i: LearningItem) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "COURSE", instructor: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/learning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      onAdd(await res.json());
      setForm({ title: "", description: "", category: "COURSE", instructor: "", tags: "" });
      setOpen(false);
      toast("학습 콘텐츠가 추가되었습니다.", "success");
    } else toast("추가에 실패했습니다.", "error");
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors">
      <Plus size={14} />새 콘텐츠
    </button>
  );

  return (
    <form onSubmit={submit} className="border border-[#1a3a5c]/20 rounded-2xl p-5 bg-[#1a3a5c]/3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="제목 *"><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inp} placeholder="강좌명" /></Field>
        <Field label="구분">
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
            <option value="COURSE">Course</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="SEMINAR">Seminar</option>
          </select>
        </Field>
      </div>
      <Field label="설명 *"><textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={textarea} placeholder="강좌 설명" /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="강사"><input value={form.instructor} onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} className={inp} placeholder="이름" /></Field>
        <Field label="태그 (쉼표 구분)"><input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={inp} placeholder="AI, Design" /></Field>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-[#1a3a5c] text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover:bg-[#0f2340] transition-colors">
          {saving ? "저장 중…" : "저장"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-200 text-sm text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">취소</button>
      </div>
    </form>
  );
}

/* ─── Add Activity Form ─────────────────────────────────────── */
function AddActivityForm({ onAdd }: { onAdd: (i: ActivityItem) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "SESSION", date: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      onAdd(await res.json());
      setForm({ title: "", description: "", type: "SESSION", date: "", tags: "" });
      setOpen(false);
      toast("활동이 추가되었습니다.", "success");
    } else toast("추가에 실패했습니다.", "error");
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors">
      <Plus size={14} />새 활동
    </button>
  );

  return (
    <form onSubmit={submit} className="border border-[#1a3a5c]/20 rounded-2xl p-5 bg-[#1a3a5c]/3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="제목 *"><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inp} placeholder="활동명" /></Field>
        <Field label="유형">
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
            <option value="SESSION">Active Learning</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="COLLABORATION">Collaboration</option>
          </select>
        </Field>
      </div>
      <Field label="설명 *"><textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={textarea} placeholder="활동 설명" /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="날짜"><input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inp} placeholder="2026.06.01" /></Field>
        <Field label="태그 (쉼표 구분)"><input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={inp} placeholder="팀프로젝트, 발표" /></Field>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-[#1a3a5c] text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover:bg-[#0f2340] transition-colors">
          {saving ? "저장 중…" : "저장"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-200 text-sm text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">취소</button>
      </div>
    </form>
  );
}

/* ─── Main Admin Page ───────────────────────────────────────── */
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("members");
  const [memberFilter, setMemberFilter] = useState("PENDING");

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  const fetchAll = useCallback(async () => {
    if (status !== "authenticated" || session?.user.role !== "ADMIN") return;
    setLoading(true);
    const [u, p, c, pr, lc, ac] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/posts").then((r) => r.json()),
      fetch("/api/admin/comments").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/learning").then((r) => r.json()),
      fetch("/api/activities").then((r) => r.json()),
    ]);
    setUsers(Array.isArray(u) ? u : []);
    setPosts(Array.isArray(p) ? p : []);
    setComments(Array.isArray(c) ? c : []);
    setProjects(Array.isArray(pr) ? pr : []);
    setLearningItems(Array.isArray(lc) ? lc : []);
    setActivityItems(Array.isArray(ac) ? ac : []);
    setLoading(false);
  }, [status, session]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* actions */
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
      toast(!isPinned ? "고정했습니다." : "고정 해제했습니다.", "info");
    }
  }

  async function deletePost(postId: string) {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) { setPosts((p) => p.filter((x) => x.id !== postId)); toast("삭제되었습니다.", "info"); }
  }

  async function deleteComment(id: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, isDeleted: true } : c));
      toast("삭제되었습니다.", "info");
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("프로젝트를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { setProjects((p) => p.filter((x) => x.id !== id)); toast("삭제되었습니다.", "info"); }
  }

  async function deleteLearning(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/learning/${id}`, { method: "DELETE" });
    if (res.ok) { setLearningItems((p) => p.filter((x) => x.id !== id)); toast("삭제되었습니다.", "info"); }
  }

  async function deleteActivity(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) { setActivityItems((p) => p.filter((x) => x.id !== id)); toast("삭제되었습니다.", "info"); }
  }

  const pendingCount = users.filter((u) => u.status === "PENDING").length;
  const filteredUsers = users.filter((u) => memberFilter === "ALL" ? true : u.status === memberFilter);

  const STATUS_BADGE: Record<string, string> = {
    ONGOING: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };
  const CAT_BADGE: Record<string, string> = {
    COURSE: "bg-blue-100 text-blue-700",
    WORKSHOP: "bg-purple-100 text-purple-700",
    SEMINAR: "bg-amber-100 text-amber-700",
  };
  const TYPE_BADGE: Record<string, string> = {
    SESSION: "bg-amber-100 text-amber-700",
    WORKSHOP: "bg-orange-100 text-orange-700",
    COLLABORATION: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24 md:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">관리자 패널</h1>
          <p className="text-gray-500 text-sm">콘텐츠·회원·게시글을 관리합니다</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "승인 회원", value: users.filter((u) => u.status === "APPROVED").length, icon: Users, bg: "bg-blue-50", color: "text-[#1a3a5c]" },
            { label: "승인 대기", value: pendingCount, icon: Clock, bg: "bg-amber-50", color: "text-amber-600", alert: pendingCount > 0 },
            { label: "프로젝트", value: projects.length, icon: FolderKanban, bg: "bg-emerald-50", color: "text-emerald-600" },
            { label: "Learning", value: learningItems.length, icon: BookOpen, bg: "bg-purple-50", color: "text-purple-600" },
          ].map(({ label, value, icon: Icon, bg, color, alert }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 relative`}>
              {alert && <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
              <Icon size={18} className={`${color} mb-2`} />
              <div className="text-2xl font-bold text-gray-900">{loading ? "…" : value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                  tab === key ? "text-[#1a3a5c] border-[#1a3a5c]" : "text-gray-400 border-transparent hover:text-gray-600"
                )}>
                <Icon size={14} />
                {label}
                {key === "members" && pendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Members ── */}
          {tab === "members" && (
            <div>
              <div className="flex gap-2 p-4 border-b border-gray-50 flex-wrap">
                {[
                  { value: "PENDING", label: `대기 (${pendingCount})` },
                  { value: "APPROVED", label: "승인됨" },
                  { value: "REJECTED", label: "거절됨" },
                  { value: "ALL", label: "전체" },
                ].map(({ value, label }) => (
                  <button key={value} onClick={() => setMemberFilter(value)}
                    className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-colors",
                      memberFilter === value ? "bg-[#1a3a5c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
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
                        <tr className="bg-gray-50 text-xs text-gray-400 uppercase">
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
                            <td className="px-5 py-3.5 font-semibold text-gray-900">
                              {u.name}{u.nameEn && <span className="text-xs text-gray-400 ml-1">({u.nameEn})</span>}
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
                            <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                            <td className="px-5 py-3.5 text-gray-400">{u.cohort ? `${u.cohort}기` : "-"}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                            <td className="px-5 py-3.5">
                              <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                                u.status === "APPROVED" ? "bg-green-100 text-green-700"
                                  : u.status === "REJECTED" ? "bg-red-100 text-red-600"
                                  : "bg-amber-100 text-amber-700")}>
                                {u.status === "APPROVED" ? "승인됨" : u.status === "REJECTED" ? "거절됨" : "대기"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {u.status === "PENDING" && (
                                <div className="flex gap-1.5">
                                  <button onClick={() => updateUserStatus(u.id, "APPROVED")}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                                    <Check size={11} />승인
                                  </button>
                                  <button onClick={() => updateUserStatus(u.id, "REJECTED")}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-xs font-semibold rounded-lg transition-colors">
                                    <X size={11} />거절
                                  </button>
                                </div>
                              )}
                              {u.status === "APPROVED" && (
                                <button onClick={() => updateUserStatus(u.id, "REJECTED")}
                                  className="px-2.5 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-lg transition-colors">취소</button>
                              )}
                              {u.status === "REJECTED" && (
                                <button onClick={() => updateUserStatus(u.id, "APPROVED")}
                                  className="px-2.5 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 text-xs rounded-lg transition-colors">재승인</button>
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

          {/* ── Projects ── */}
          {tab === "projects" && (
            <div className="p-5 space-y-4">
              <AddProjectForm onAdd={(p) => setProjects((prev) => [p, ...prev])} />
              {loading ? <div className="text-center text-gray-400 py-8">불러오는 중…</div>
                : projects.length === 0 ? <div className="text-center text-gray-400 py-8 text-sm">등록된 프로젝트가 없습니다.</div>
                : (
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 group transition-colors">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_BADGE[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {p.status === "ONGOING" ? "진행 중" : "완료"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{p.title}</div>
                          <div className="text-xs text-gray-400 truncate">{p.description}</div>
                          {p.teamMembers && <div className="text-xs text-gray-400 mt-0.5">팀: {p.teamMembers}</div>}
                        </div>
                        <div className="text-xs text-gray-400 shrink-0">댓글 {p._count.comments}</div>
                        <button onClick={() => deleteProject(p.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                          <Trash2 size={12} />삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── Learning ── */}
          {tab === "learning" && (
            <div className="p-5 space-y-4">
              <AddLearningForm onAdd={(i) => setLearningItems((prev) => [i, ...prev])} />
              {loading ? <div className="text-center text-gray-400 py-8">불러오는 중…</div>
                : learningItems.length === 0 ? <div className="text-center text-gray-400 py-8 text-sm">등록된 콘텐츠가 없습니다.</div>
                : (
                  <div className="space-y-2">
                    {learningItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 group transition-colors">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${CAT_BADGE[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.category}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{item.title}</div>
                          {item.instructor && <div className="text-xs text-gray-400">강사: {item.instructor}</div>}
                          <div className="text-xs text-gray-400 truncate">{item.description}</div>
                        </div>
                        <button onClick={() => deleteLearning(item.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                          <Trash2 size={12} />삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── Activity ── */}
          {tab === "activity" && (
            <div className="p-5 space-y-4">
              <AddActivityForm onAdd={(i) => setActivityItems((prev) => [i, ...prev])} />
              {loading ? <div className="text-center text-gray-400 py-8">불러오는 중…</div>
                : activityItems.length === 0 ? <div className="text-center text-gray-400 py-8 text-sm">등록된 활동이 없습니다.</div>
                : (
                  <div className="space-y-2">
                    {activityItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 group transition-colors">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_BADGE[item.type] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.type === "SESSION" ? "Active Learning" : item.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{item.title}</div>
                          {item.date && <div className="text-xs text-gray-400">{item.date}</div>}
                          <div className="text-xs text-gray-400 truncate">{item.description}</div>
                        </div>
                        <button onClick={() => deleteActivity(item.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                          <Trash2 size={12} />삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── Posts ── */}
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
                              {p.isPinned && <Pin size={12} className="text-[#1a3a5c]" />}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                              <span className="text-xs text-gray-400">{p.author.name}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 truncate">{p.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">댓글 {p._count.comments} · 좋아요 {p._count.likes} · {formatDate(p.createdAt)}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => togglePin(p.id, p.isPinned)}
                              className={cn("flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors",
                                p.isPinned ? "bg-[#1a3a5c]/10 text-[#1a3a5c]" : "bg-gray-100 text-gray-500 hover:bg-gray-200")}>
                              <Pin size={11} />{p.isPinned ? "고정 해제" : "고정"}
                            </button>
                            <button onClick={() => deletePost(p.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                              <Trash2 size={11} />삭제
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* ── Comments ── */}
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
                            <span className="text-xs text-[#1a3a5c] truncate max-w-[180px]">{c.post.title}</span>
                            <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className={cn("text-sm", c.isDeleted ? "text-gray-300 italic" : "text-gray-700")}>
                            {c.isDeleted ? "삭제된 댓글입니다." : c.content}
                          </p>
                        </div>
                        {!c.isDeleted && (
                          <button onClick={() => deleteComment(c.id)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <Trash2 size={11} />삭제
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── Stats ── */}
          {tab === "stats" && (
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {[
                {
                  label: "역할별 회원",
                  data: ["STUDENT","ALUMNI","FACULTY","SPONSOR"].map((r) => ({
                    name: { STUDENT:"재학생", ALUMNI:"동문", FACULTY:"교직원", SPONSOR:"후원자" }[r] ?? r,
                    value: users.filter((u) => u.role === r && u.status === "APPROVED").length,
                  })).filter((d) => d.value > 0),
                },
                {
                  label: "프로젝트 상태",
                  data: [
                    { name: "진행 중", value: projects.filter((p) => p.status === "ONGOING").length },
                    { name: "완료", value: projects.filter((p) => p.status === "COMPLETED").length },
                  ].filter((d) => d.value > 0),
                },
              ].map(({ label, data }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">{label}</h3>
                  <div className="space-y-3">
                    {data.length === 0
                      ? <p className="text-gray-400 text-sm">데이터 없음</p>
                      : data.map(({ name, value }) => {
                        const max = Math.max(...data.map((d) => d.value), 1);
                        return (
                          <div key={name} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-20 shrink-0">{name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div className="h-2 rounded-full bg-[#1a3a5c] transition-all" style={{ width: `${(value / max) * 100}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-4 text-right">{value}</span>
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
