"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { Plus, Calendar, MapPin, Monitor, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  isOnline: boolean;
  startDate: string;
  endDate: string | null;
  author: { id: string; name: string; role: string };
};

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_LABELS = ["일","월","화","수","목","금","토"];

export default function EventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [form, setForm] = useState({
    title: "", description: "", location: "", isOnline: false,
    startDate: "", endDate: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/events").then((r) => r.json()).then((d) => { setEvents(d); setLoading(false); });
  }, [status]);

  function prevMonth() {
    setCurrent((c) => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  }
  function nextMonth() {
    setCurrent((c) => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });
  }

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }
  function getFirstDay(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function eventsOnDay(year: number, month: number, day: number) {
    return events.filter((e) => {
      const d = new Date(e.startDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  async function handleCreate(ev: React.FormEvent) {
    ev.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setEvents((prev) => [...prev, data].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
      setShowForm(false);
      setForm({ title: "", description: "", location: "", isOnline: false, startDate: "", endDate: "" });
      toast("이벤트가 등록되었습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이벤트를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) { setEvents((prev) => prev.filter((e) => e.id !== id)); toast("삭제되었습니다.", "info"); }
  }

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 });

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= new Date(today.toDateString()))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24 md:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">이벤트 캘린더</h1>
            <p className="text-gray-500 text-sm">동문회 행사·모임·세미나를 확인하세요</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            이벤트 등록
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 animate-fade-in">
            <h2 className="font-bold text-gray-900 mb-5">새 이벤트 등록</h2>
            <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">이벤트명 *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30" placeholder="이벤트 이름" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">설명</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 resize-none" placeholder="이벤트 설명" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">시작일시 *</label>
                <input required type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">종료일시</label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">장소</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} disabled={form.isOnline}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 disabled:bg-gray-50 disabled:text-gray-400" placeholder="장소 입력" />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isOnline} onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#1a3a5c]" />
                  <span className="text-sm font-medium text-gray-700">온라인 이벤트</span>
                </label>
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">취소</button>
                <button type="submit" className="px-5 py-2.5 bg-[#1a3a5c] text-white rounded-xl text-sm font-semibold hover:bg-[#0f2340] transition-colors">등록하기</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900 text-lg">
                {current.year}년 {MONTH_LABELS[current.month]}
              </h2>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {DAY_LABELS.map((d, i) => (
                  <div key={d} className={cn("text-center text-xs font-semibold py-2", i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400")}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((_, i) => {
                  const day = i - firstDay + 1;
                  const valid = day >= 1 && day <= daysInMonth;
                  const isToday = valid && current.year === today.getFullYear() && current.month === today.getMonth() && day === today.getDate();
                  const dayEvents = valid ? eventsOnDay(current.year, current.month, day) : [];
                  const col = i % 7;
                  return (
                    <div key={i} className={cn("min-h-[60px] p-1 rounded-xl", valid ? "hover:bg-gray-50 cursor-default" : "opacity-0 pointer-events-none")}>
                      {valid && (
                        <>
                          <div className={cn(
                            "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mx-auto mb-1",
                            isToday ? "bg-[#1a3a5c] text-white" : col === 0 ? "text-red-400" : col === 6 ? "text-blue-400" : "text-gray-700"
                          )}>
                            {day}
                          </div>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 2).map((e) => (
                              <div key={e.id} className="text-xs bg-[#1a3a5c]/10 text-[#1a3a5c] rounded px-1 truncate">{e.title}</div>
                            ))}
                            {dayEvents.length > 2 && <div className="text-xs text-gray-400 text-center">+{dayEvents.length - 2}</div>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">다가오는 이벤트</h2>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
              ))}</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                예정된 이벤트가 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingEvents.map((e) => {
                  const d = new Date(e.startDate);
                  return (
                    <div key={e.id} className="px-5 py-4 hover:bg-gray-50 group transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 text-center">
                          <div className="text-xs text-gray-400 font-medium">{MONTH_LABELS[d.getMonth()]}</div>
                          <div className="text-xl font-bold text-[#1a3a5c] leading-tight">{d.getDate()}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate mb-1">{e.title}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            {e.isOnline ? <Monitor size={11} /> : <MapPin size={11} />}
                            <span className="truncate">{e.isOnline ? "온라인" : (e.location ?? "장소 미정")}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <RoleBadge role={e.author.role} />
                            <span className="text-xs text-gray-400">{e.author.name}</span>
                          </div>
                        </div>
                        {(session?.user.id === e.author.id || session?.user.role === "ADMIN") && (
                          <button onClick={() => handleDelete(e.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all p-1 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
