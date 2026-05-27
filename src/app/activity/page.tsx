"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { Zap, Tag, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

type ActivityContent = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};

const TYPE: Record<string, { label: string; color: string; dot: string; hex: string }> = {
  SESSION:       { label: "Active Learning", color: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400",  hex: "#f59e0b" },
  WORKSHOP:      { label: "Workshop",        color: "bg-orange-500/15 text-orange-400 border-orange-500/25", dot: "bg-orange-400", hex: "#f97316" },
  COLLABORATION: { label: "Collaboration",   color: "bg-rose-500/15 text-rose-400 border-rose-500/25",       dot: "bg-rose-400",   hex: "#fb7185" },
};

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_NAMES   = ["일","월","화","수","목","금","토"];

export default function ActivityPage() {
  const [items, setItems]         = useState<ActivityContent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [current, setCurrent]     = useState(new Date());

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => {
        const arr: ActivityContent[] = Array.isArray(d) ? d : [];
        setItems(arr);
        setLoading(false);
        // Start calendar at the earliest event month
        const first = arr.filter((i) => i.date).sort((a, b) => a.date!.localeCompare(b.date!))[0];
        if (first?.date) setCurrent(new Date(first.date + "T00:00:00"));
      });
  }, []);

  const year  = current.getFullYear();
  const month = current.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const eventsByDate = items.reduce<Record<string, ActivityContent[]>>((acc, item) => {
    if (item.date) {
      const k = item.date.slice(0, 10);
      acc[k] = acc[k] ? [...acc[k], item] : [item];
    }
    return acc;
  }, {});

  const todayKey = new Date().toISOString().slice(0, 10);
  const fmtKey   = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const displayItems = selectedDate
    ? (eventsByDate[selectedDate] ?? [])
    : [...items].filter((i) => i.date).sort((a, b) => a.date!.localeCompare(b.date!));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-gold w-[450px] h-[450px] top-[-50px] right-0 opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-5">
            <Zap size={11} />Activity
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3 leading-tight">
            Active Learning<br />
            <span className="gold-text">활동 보기</span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            Hands-on sessions, workshops, and experiential activities across Taejae&apos;s global campuses.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card rounded-3xl h-80 shimmer lg:col-span-1" />
            <div className="lg:col-span-2 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="card rounded-2xl h-20 shimmer" />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ── Mini Calendar (left / top on mobile) ── */}
            <div className="card rounded-3xl overflow-hidden lg:sticky lg:top-24">
              {/* Month nav */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "var(--text-3)" }}>
                  <ChevronLeft size={15} />
                </button>
                <span className="font-bold text-white text-sm">{year}년 {MONTH_NAMES[month]}</span>
                <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "var(--text-3)" }}>
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="p-4">
                {/* Day labels */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map((d, i) => (
                    <div key={d} className="text-center text-[10px] font-semibold py-1"
                      style={{ color: i === 0 ? "#fb7185" : i === 6 ? "#60a5fa" : "var(--text-3)" }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const key    = fmtKey(day);
                    const events = eventsByDate[key] ?? [];
                    const isSel  = selectedDate === key;
                    const isToday = key === todayKey;
                    const isSun  = i % 7 === 0;
                    const isSat  = i % 7 === 6;
                    return (
                      <button key={i} onClick={() => setSelectedDate(isSel ? null : key)}
                        className="flex flex-col items-center py-1.5 rounded-lg transition-all"
                        style={{
                          background: isSel ? "rgba(201,162,39,0.2)" : isToday ? "rgba(255,255,255,0.08)" : "transparent",
                          border: isSel ? "1px solid rgba(201,162,39,0.4)" : "1px solid transparent",
                        }}>
                        <span className="text-[11px] font-semibold" style={{
                          color: isSel ? "#f0c040" : isToday ? "#fff" : isSun ? "#fb7185" : isSat ? "#60a5fa" : "var(--text-2)",
                        }}>
                          {day}
                        </span>
                        <div className="flex gap-0.5 mt-0.5 min-h-[5px]">
                          {events.slice(0, 2).map((e, ei) => (
                            <span key={ei} className="w-1 h-1 rounded-full" style={{ background: (TYPE[e.type] ?? TYPE.SESSION).hex }} />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="px-4 pb-4 space-y-1.5 border-t border-white/[0.05] pt-3">
                {Object.values(TYPE).map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.hex }} />
                    <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Event List (right / bottom on mobile) ── */}
            <div className="lg:col-span-2">
              {/* Selected date header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} style={{ color: "var(--text-3)" }} />
                  <span className="text-sm font-bold text-white">
                    {selectedDate
                      ? `${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8))}일`
                      : "전체 일정"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-3)" }}>
                    {displayItems.length}개
                  </span>
                </div>
                {selectedDate && (
                  <button onClick={() => setSelectedDate(null)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors"
                    style={{ color: "var(--text-3)", background: "rgba(255,255,255,0.06)" }}>
                    <X size={11} />전체 보기
                  </button>
                )}
              </div>

              {displayItems.length === 0 ? (
                <div className="text-center py-20">
                  <CalendarDays size={36} className="mx-auto mb-3 opacity-20 text-white" />
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>이 날에 등록된 활동이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayItems.map((item) => {
                    const t    = TYPE[item.type] ?? TYPE.SESSION;
                    const tags = item.tags ? item.tags.split(",").map((g) => g.trim()).filter(Boolean) : [];
                    return (
                      <div key={item.id} className="card rounded-2xl p-5 flex gap-4 hover:border-white/15 transition-all">
                        <div className="w-0.5 rounded-full shrink-0 self-stretch" style={{ background: t.hex }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>
                              {t.label}
                            </span>
                            {item.date && (
                              <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
                                {item.date}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-2)" }}>
                            {item.description}
                          </p>
                          {tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-2">
                              <Tag size={9} style={{ color: "var(--text-3)" }} className="mt-0.5 shrink-0" />
                              {tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md"
                                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-3)" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
