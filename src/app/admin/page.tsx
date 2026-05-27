"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban, BookOpen, Zap, Plus, Pencil, Trash2,
  Check, X, LogOut, ExternalLink, ChevronDown, ChevronUp,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */
type Project = {
  id: string; title: string; description: string; tags: string | null;
  status: string; teamMembers: string | null; demoUrl: string | null;
  githubUrl: string | null; _count: { comments: number };
};
type LearningItem = {
  id: string; title: string; description: string;
  category: string; instructor: string | null; tags: string | null;
};
type ActivityItem = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};
type Tab = "project" | "learning" | "activity";

/* ─── Helpers ────────────────────────────────────────────────────── */
const iStyle = [
  "w-full px-3 py-2.5 rounded-xl text-sm text-white",
  "placeholder:text-white/25 focus:outline-none transition-colors",
].join(" ");
const iBox = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" };
const iBoxFocus = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.25)" };

function DInput({ value, onChange, placeholder, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${iStyle} ${className}`}
      style={iBox}
      onFocus={(e) => Object.assign(e.currentTarget.style, iBoxFocus)}
      onBlur={(e) => Object.assign(e.currentTarget.style, iBox)}
    />
  );
}

function DTextarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${iStyle} resize-none`}
      style={iBox}
    />
  );
}

function DSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${iStyle} cursor-pointer`}
      style={{ ...iBox, colorScheme: "dark" }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

const label = (text: string) => (
  <p className="text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{text}</p>
);

/* ─── Tag/Status Badges ──────────────────────────────────────────── */
const PROJECT_STATUS: Record<string, string> = {
  ONGOING:   "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  COMPLETED: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
};
const LEARN_CAT: Record<string, string> = {
  COURSE:   "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  WORKSHOP: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  SEMINAR:  "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};
const ACT_TYPE: Record<string, string> = {
  SESSION:       "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  WORKSHOP:      "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  COLLABORATION: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
};
const ACT_LABEL: Record<string, string> = { SESSION: "Active Learning", WORKSHOP: "Workshop", COLLABORATION: "Collaboration" };

/* ─── Item Row (display) ─────────────────────────────────────────── */
function ItemRow({ badge, title, sub, onEdit, onDelete }: {
  badge: React.ReactNode; title: string; sub?: string;
  onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 px-5 py-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors last:border-0">
      <div className="shrink-0">{badge}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{title}</p>
        {sub && <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>}
      </div>
      <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: "rgba(201,162,39,0.15)", color: "#c9a227" }}>
          <Pencil size={11} />수정
        </button>
        <button onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
          <Trash2 size={11} />삭제
        </button>
      </div>
    </div>
  );
}

/* ─── Edit/Add form panel ────────────────────────────────────────── */
function FormPanel({ title, onClose, children, onSubmit, saving }: {
  title: string; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  saving: boolean; children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit}
      className="mx-4 mb-2 rounded-2xl p-5 space-y-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-sm font-bold text-white mb-4">{title}</p>
      {children}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
          style={{ background: "#c9a227", color: "#060d18" }}>
          <Check size={13} />{saving ? "저장 중…" : "저장"}
        </button>
        <button type="button" onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
          <X size={13} />취소
        </button>
      </div>
    </form>
  );
}

/* ─── Project Section ────────────────────────────────────────────── */
function ProjectSection({ items, setItems }: {
  items: Project[]; setItems: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const [adding, setAdding]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");

  const blank = { title: "", description: "", tags: "", status: "ONGOING", teamMembers: "", demoUrl: "", githubUrl: "" };
  const [form, setForm] = useState(blank);
  const [editForm, setEditForm] = useState<typeof blank & { id?: string }>(blank);

  const f = (k: keyof typeof blank) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
  const ef = (k: keyof typeof blank) => (v: string) => setEditForm((p) => ({ ...p, [k]: v }));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setItems((p) => [{ ...data, _count: { comments: 0 } }, ...p]);
      setForm(blank); setAdding(false); setMsg("추가되었습니다.");
    } else setMsg("저장에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.id) return;
    setSaving(true);
    const { id, ...data } = editForm;
    const res = await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setItems((p) => p.map((x) => x.id === id ? { ...updated, _count: x._count } : x));
      setEditingId(null); setMsg("수정되었습니다.");
    } else setMsg("수정에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function del(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((p) => p.filter((x) => x.id !== id)); setMsg("삭제되었습니다."); }
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white">{items.length}개의 프로젝트</span>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs" style={{ color: "#c9a227" }}>{msg}</span>}
          <button onClick={() => { setAdding((v) => !v); setEditingId(null); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: adding ? "rgba(255,255,255,0.1)" : "#c9a227", color: adding ? "white" : "#060d18" }}>
            {adding ? <ChevronUp size={13} /> : <Plus size={13} />}새 프로젝트
          </button>
        </div>
      </div>

      {adding && (
        <FormPanel title="새 프로젝트" onClose={() => setAdding(false)} onSubmit={add} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("제목 *")}<DInput value={form.title} onChange={f("title")} placeholder="프로젝트 이름" /></div>
            <div>{label("상태")}<DSelect value={form.status} onChange={f("status")} options={[{ value: "ONGOING", label: "진행 중" }, { value: "COMPLETED", label: "완료" }]} /></div>
          </div>
          <div>{label("설명 *")}<DTextarea value={form.description} onChange={f("description")} placeholder="프로젝트 설명" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("팀원 (쉼표 구분)")}<DInput value={form.teamMembers} onChange={f("teamMembers")} placeholder="홍길동, 김철수" /></div>
            <div>{label("태그 (쉼표 구분)")}<DInput value={form.tags} onChange={f("tags")} placeholder="AI, 데이터" /></div>
            <div>{label("Demo URL")}<DInput value={form.demoUrl} onChange={f("demoUrl")} placeholder="https://..." /></div>
            <div>{label("GitHub URL")}<DInput value={form.githubUrl} onChange={f("githubUrl")} placeholder="https://github.com/..." /></div>
          </div>
        </FormPanel>
      )}

      {items.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>등록된 프로젝트가 없습니다.</p>
      ) : items.map((p) => (
        <div key={p.id}>
          {editingId === p.id ? (
            <FormPanel title="프로젝트 수정" onClose={() => setEditingId(null)} onSubmit={save} saving={saving}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("제목 *")}<DInput value={editForm.title} onChange={ef("title")} /></div>
                <div>{label("상태")}<DSelect value={editForm.status} onChange={ef("status")} options={[{ value: "ONGOING", label: "진행 중" }, { value: "COMPLETED", label: "완료" }]} /></div>
              </div>
              <div>{label("설명 *")}<DTextarea value={editForm.description} onChange={ef("description")} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("팀원")}<DInput value={editForm.teamMembers} onChange={ef("teamMembers")} /></div>
                <div>{label("태그")}<DInput value={editForm.tags} onChange={ef("tags")} /></div>
                <div>{label("Demo URL")}<DInput value={editForm.demoUrl} onChange={ef("demoUrl")} /></div>
                <div>{label("GitHub URL")}<DInput value={editForm.githubUrl} onChange={ef("githubUrl")} /></div>
              </div>
            </FormPanel>
          ) : (
            <ItemRow
              badge={<span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${PROJECT_STATUS[p.status] ?? ""}`}>{p.status === "ONGOING" ? "진행 중" : "완료"}</span>}
              title={p.title}
              sub={[p.teamMembers, p.tags].filter(Boolean).join(" · ")}
              onEdit={() => {
                setEditForm({ id: p.id, title: p.title, description: p.description, tags: p.tags ?? "", status: p.status, teamMembers: p.teamMembers ?? "", demoUrl: p.demoUrl ?? "", githubUrl: p.githubUrl ?? "" });
                setEditingId(p.id); setAdding(false);
              }}
              onDelete={() => del(p.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Learning Section ───────────────────────────────────────────── */
function LearningSection({ items, setItems }: {
  items: LearningItem[]; setItems: React.Dispatch<React.SetStateAction<LearningItem[]>>;
}) {
  const [adding, setAdding]       = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");

  const blank = { title: "", description: "", category: "COURSE", instructor: "", tags: "" };
  const [form, setForm]       = useState(blank);
  const [editForm, setEditForm] = useState<typeof blank & { id?: string }>(blank);
  const f  = (k: keyof typeof blank) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
  const ef = (k: keyof typeof blank) => (v: string) => setEditForm((p) => ({ ...p, [k]: v }));
  const catOptions = [{ value: "COURSE", label: "Course" }, { value: "WORKSHOP", label: "Workshop" }, { value: "SEMINAR", label: "Seminar" }];

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { const data = await res.json(); setItems((p) => [data, ...p]); setForm(blank); setAdding(false); setMsg("추가되었습니다."); }
    else setMsg("저장에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.id) return;
    setSaving(true);
    const { id, ...data } = editForm;
    const res = await fetch(`/api/learning/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    if (res.ok) { setItems((p) => p.map((x) => x.id === id ? { ...x, ...data } : x)); setEditingId(null); setMsg("수정되었습니다."); }
    else setMsg("수정에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function del(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/learning/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((p) => p.filter((x) => x.id !== id)); setMsg("삭제되었습니다."); }
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white">{items.length}개의 과정</span>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs" style={{ color: "#c9a227" }}>{msg}</span>}
          <button onClick={() => { setAdding((v) => !v); setEditingId(null); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: adding ? "rgba(255,255,255,0.1)" : "#c9a227", color: adding ? "white" : "#060d18" }}>
            {adding ? <ChevronUp size={13} /> : <Plus size={13} />}새 과정
          </button>
        </div>
      </div>

      {adding && (
        <FormPanel title="새 학습 과정" onClose={() => setAdding(false)} onSubmit={add} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("제목 *")}<DInput value={form.title} onChange={f("title")} placeholder="과정명" /></div>
            <div>{label("구분")}<DSelect value={form.category} onChange={f("category")} options={catOptions} /></div>
          </div>
          <div>{label("설명 *")}<DTextarea value={form.description} onChange={f("description")} placeholder="과정 설명" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("강사")}<DInput value={form.instructor} onChange={f("instructor")} placeholder="교수/강사 이름" /></div>
            <div>{label("태그")}<DInput value={form.tags} onChange={f("tags")} placeholder="AI, Ethics" /></div>
          </div>
        </FormPanel>
      )}

      {items.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>등록된 과정이 없습니다.</p>
      ) : items.map((item) => (
        <div key={item.id}>
          {editingId === item.id ? (
            <FormPanel title="학습 과정 수정" onClose={() => setEditingId(null)} onSubmit={save} saving={saving}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("제목 *")}<DInput value={editForm.title} onChange={ef("title")} /></div>
                <div>{label("구분")}<DSelect value={editForm.category} onChange={ef("category")} options={catOptions} /></div>
              </div>
              <div>{label("설명 *")}<DTextarea value={editForm.description} onChange={ef("description")} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("강사")}<DInput value={editForm.instructor} onChange={ef("instructor")} /></div>
                <div>{label("태그")}<DInput value={editForm.tags} onChange={ef("tags")} /></div>
              </div>
            </FormPanel>
          ) : (
            <ItemRow
              badge={<span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${LEARN_CAT[item.category] ?? ""}`}>{item.category}</span>}
              title={item.title}
              sub={[item.instructor, item.tags].filter(Boolean).join(" · ")}
              onEdit={() => { setEditForm({ id: item.id, title: item.title, description: item.description, category: item.category, instructor: item.instructor ?? "", tags: item.tags ?? "" }); setEditingId(item.id); setAdding(false); }}
              onDelete={() => del(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Section ───────────────────────────────────────────── */
function ActivitySection({ items, setItems }: {
  items: ActivityItem[]; setItems: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
}) {
  const [adding, setAdding]       = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");

  const blank = { title: "", description: "", type: "SESSION", date: "", tags: "" };
  const [form, setForm]       = useState(blank);
  const [editForm, setEditForm] = useState<typeof blank & { id?: string }>(blank);
  const f  = (k: keyof typeof blank) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
  const ef = (k: keyof typeof blank) => (v: string) => setEditForm((p) => ({ ...p, [k]: v }));
  const typeOptions = [{ value: "SESSION", label: "Active Learning" }, { value: "WORKSHOP", label: "Workshop" }, { value: "COLLABORATION", label: "Collaboration" }];

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { const data = await res.json(); setItems((p) => [data, ...p]); setForm(blank); setAdding(false); setMsg("추가되었습니다."); }
    else setMsg("저장에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.id) return;
    setSaving(true);
    const { id, ...data } = editForm;
    const res = await fetch(`/api/activities/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    if (res.ok) { setItems((p) => p.map((x) => x.id === id ? { ...x, ...data } : x)); setEditingId(null); setMsg("수정되었습니다."); }
    else setMsg("수정에 실패했습니다.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function del(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((p) => p.filter((x) => x.id !== id)); setMsg("삭제되었습니다."); }
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white">{items.length}개의 활동</span>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs" style={{ color: "#c9a227" }}>{msg}</span>}
          <button onClick={() => { setAdding((v) => !v); setEditingId(null); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: adding ? "rgba(255,255,255,0.1)" : "#c9a227", color: adding ? "white" : "#060d18" }}>
            {adding ? <ChevronUp size={13} /> : <Plus size={13} />}새 활동
          </button>
        </div>
      </div>

      {adding && (
        <FormPanel title="새 활동" onClose={() => setAdding(false)} onSubmit={add} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("제목 *")}<DInput value={form.title} onChange={f("title")} placeholder="활동명" /></div>
            <div>{label("유형")}<DSelect value={form.type} onChange={f("type")} options={typeOptions} /></div>
          </div>
          <div>{label("설명 *")}<DTextarea value={form.description} onChange={f("description")} placeholder="활동 설명" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>{label("날짜 (YYYY-MM-DD)")}<DInput value={form.date} onChange={f("date")} placeholder="2026-06-01" /></div>
            <div>{label("태그")}<DInput value={form.tags} onChange={f("tags")} placeholder="Seoul, 팀프로젝트" /></div>
          </div>
        </FormPanel>
      )}

      {items.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>등록된 활동이 없습니다.</p>
      ) : items.map((item) => (
        <div key={item.id}>
          {editingId === item.id ? (
            <FormPanel title="활동 수정" onClose={() => setEditingId(null)} onSubmit={save} saving={saving}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("제목 *")}<DInput value={editForm.title} onChange={ef("title")} /></div>
                <div>{label("유형")}<DSelect value={editForm.type} onChange={ef("type")} options={typeOptions} /></div>
              </div>
              <div>{label("설명 *")}<DTextarea value={editForm.description} onChange={ef("description")} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>{label("날짜")}<DInput value={editForm.date} onChange={ef("date")} /></div>
                <div>{label("태그")}<DInput value={editForm.tags} onChange={ef("tags")} /></div>
              </div>
            </FormPanel>
          ) : (
            <ItemRow
              badge={<span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${ACT_TYPE[item.type] ?? ""}`}>{ACT_LABEL[item.type] ?? item.type}</span>}
              title={item.title}
              sub={[item.date, item.tags].filter(Boolean).join(" · ")}
              onEdit={() => { setEditForm({ id: item.id, title: item.title, description: item.description, type: item.type, date: item.date ?? "", tags: item.tags ?? "" }); setEditingId(item.id); setAdding(false); }}
              onDelete={() => del(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "project",  label: "Project",  icon: FolderKanban },
  { key: "learning", label: "Learning", icon: BookOpen },
  { key: "activity", label: "Activity", icon: Zap },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("project");

  const [projects,  setProjects]  = useState<Project[]>([]);
  const [learning,  setLearning]  = useState<LearningItem[]>([]);
  const [activity,  setActivity]  = useState<ActivityItem[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  const load = useCallback(async () => {
    if (status !== "authenticated" || session?.user.role !== "ADMIN") return;
    setLoading(true);
    const [pr, lc, ac] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/learning").then((r) => r.json()),
      fetch("/api/activities").then((r) => r.json()),
    ]);
    setProjects(Array.isArray(pr) ? pr : []);
    setLearning(Array.isArray(lc) ? lc : []);
    setActivity(Array.isArray(ac) ? ac : []);
    setLoading(false);
  }, [status, session]);

  useEffect(() => { load(); }, [load]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#c9a227] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
      {/* Admin Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 gap-4"
        style={{ background: "rgba(6,13,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center">
            <span className="text-white font-black text-xs">泰</span>
          </div>
          <span className="text-white font-black text-sm hidden sm:block">관리자 패널</span>
        </Link>

        {TABS.map(({ key, label: lbl, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === key ? "rgba(201,162,39,0.15)" : "transparent",
              color: tab === key ? "#c9a227" : "rgba(255,255,255,0.4)",
              border: tab === key ? "1px solid rgba(201,162,39,0.25)" : "1px solid transparent",
            }}>
            <Icon size={13} />{lbl}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
            <ExternalLink size={11} />사이트
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
            <LogOut size={11} />로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 pt-20">
        <div className="card rounded-3xl overflow-hidden">
          {tab === "project"  && <ProjectSection  items={projects} setItems={setProjects} />}
          {tab === "learning" && <LearningSection items={learning} setItems={setLearning} />}
          {tab === "activity" && <ActivitySection items={activity} setItems={setActivity} />}
        </div>
      </main>
    </div>
  );
}
