"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { Zap, Tag, CalendarDays, List, ChevronLeft, ChevronRight } from "lucide-react";

type ActivityContent = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};

const TYPE: Record<string, { label: string; color: string; dot: string; dotBg: string }> = {
  SESSION:       { label: "Active Learning", color: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400",  dotBg: "#f59e0b" },
  WORKSHOP:      { label: "Workshop",        color: "bg-orange-500/15 text-orange-400 border-orange-500/25", dot: "bg-orange-400", dotBg: "#f97316" },
  COLLABORATION: { label: "Collaboration",   color: "bg-rose-500/15 text-rose-400 border-rose-500/25",       dot: "bg-rose-400",   dotBg: "#fb7185" },
};

const LIST_FILTERS = [
  { key: "ALL",           label: "전체" },
  { key: "SESSION",       label: "Active Learning" },
  { key: "WORKSHOP",      label: "Workshop" },
  { key: "COLLABORATION", label: "Collaboration" },
];

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_NAMES   = ["일","월","화","수","목","금","토"];

function CalendarView({ items }: { items: ActivityContent[] }) {
  const initialDate = (() => {
    const withDate = items.filter((i) => i.date).sort((a, b) => a.date!.localeCompare(b.date!));
    return withDate.length > 0 ? new Date(withDate[0].date! + "T00:00:00") : new Date();
  })();

  const [current, setCurrent] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year  = current.getFullYear();
  const month = current.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const eventsByDate = items.reduce<Record<string, ActivityContent[]>>((acc, item) => {
    if (item.date) {
      const key = item.date.slice(0, 10);
      acc[key] = acc[key] ? [...acc[key], item] : [item];
    }
    return acc;
  }, {});

  const formatKey = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const todayKey = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthEvents = items.filter((i) => i.date?.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`));
  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : monthEvents;
  const displayLabel  = selectedDate
    ? `${parseInt(selectedDate.slice(8))}일 일정`
    : `${MONTH_NAMES[month]} 전체 일정`;

  return (
    <div>
      {/* Month navigation */}
      <div className="card rounded-3xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <button
            onClick={() => { setCurrent(new Date(year, month - 1, 1)); setSelectedDate(null); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-3)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-black text-white text-lg">{year}년 {MONTH_NAMES[month]}</h3>
          <button
            onClick={() => { setCurrent(new Date(year, month + 1, 1)); setSelectedDate(null); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-3)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d, i) => (
              <div key={d} className="text-center text-xs font-semibold py-2"
                style={{ color: i === 0 ? "#fb7185" : i === 6 ? "#60a5fa" : "var(--text-3)" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const key      = formatKey(day);
              const events   = eventsByDate[key] ?? [];
              const isToday  = key === todayKey;
              const isSel    = key === selectedDate;
              const isSun    = (i % 7) === 0;
              const isSat    = (i % 7) === 6;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSel ? null : key)}
                  className="relative flex flex-col items-center py-2 rounded-xl transition-all"
                  style={{
                    background: isSel ? "rgba(201,162,39,0.15)" : isToday ? "rgba(255,255,255,0.07)" : "transparent",
                    border: isSel ? "1px solid rgba(201,162,39,0.4)" : "1px solid transparent",
                  }}
                >
                  <span className="text-xs font-semibold mb-1" style={{
                    color: isSel ? "#f0c040" : isToday ? "#fff" : isSun ? "#fb7185" : isSat ? "#60a5fa" : "var(--text-2)",
                  }}>
                    {day}
                  </span>
                  <div className="flex gap-0.5 flex-wrap justify-center min-h-[6px]">
                    {events.slice(0, 3).map((e, ei) => {
                      const t = TYPE[e.type] ?? TYPE.SESSION;
                      return <span key={ei} className="w-1.5 h-1.5 rounded-full" style={{ background: t.dotBg }} />;
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events for selected day / current month */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={13} style={{ color: "var(--text-3)" }} />
          <p className="text-sm font-semibold text-white">{displayLabel}</p>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-3)" }}>
            {selectedEvents.length}개
          </span>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays size={32} className="mx-auto mb-3 opacity-20 text-white" />
            <p className="text-sm" style={{ color: "var(--text-3)" }}>이달에 등록된 일정이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedEvents.map((item) => {
              const t    = TYPE[item.type] ?? TYPE.SESSION;
              const tags = item.tags ? item.tags.split(",").map((g) => g.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="card rounded-2xl p-5 flex gap-4 hover:border-white/15 transition-all">
                  <div className="w-1 rounded-full shrink-0" style={{ background: t.dotBg }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>
                        {t.label}
                      </span>
                      {item.date && (
                        <span className="text-xs" style={{ color: "var(--text-3)" }}>{item.date}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-2)" }}>
                      {item.description}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
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
  );
}

export default function ActivityPage() {
  const [items, setItems]     = useState<ActivityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState<"list" | "calendar">("list");
  const [filter, setFilter]   = useState("ALL");

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = filter === "ALL" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-gold w-[450px] h-[450px] top-[-50px] right-0 opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-5">
            <Zap size={11} />
            Activity
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
        {/* View toggle + Filter row */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: view === "list" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: view === "list" ? "#fff" : "var(--text-3)",
                }}
              >
                <List size={13} /> 목록
              </button>
              <button
                onClick={() => setView("calendar")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: view === "calendar" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: view === "calendar" ? "#fff" : "var(--text-3)",
                }}
              >
                <CalendarDays size={13} /> 캘린더
              </button>
            </div>

            {/* List filters — only shown in list view */}
            {view === "list" && LIST_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all hidden sm:block"
                style={{
                  background: filter === f.key ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${filter === f.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                  color: filter === f.key ? "#fff" : "var(--text-3)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {!loading && view === "list" && (
            <p className="text-sm font-medium" style={{ color: "var(--text-3)" }}>
              {filtered.length}개의 활동
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card rounded-3xl h-52 shimmer" />
            ))}
          </div>
        ) : view === "calendar" ? (
          <CalendarView items={items} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <Zap size={40} className="mx-auto mb-4 opacity-20 text-white" />
            <p className="text-white/40 font-medium">
              {filter === "ALL" ? "아직 등록된 활동이 없습니다." : "해당 유형의 활동이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const t    = TYPE[item.type] ?? TYPE.SESSION;
              const tags = item.tags ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="card rounded-3xl p-6 flex flex-col hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${t.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                      {t.label}
                    </div>
                    {item.date && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
                        <CalendarDays size={11} />
                        {item.date}
                      </div>
                    )}
                  </div>
                  <h2 className="font-bold text-white text-base mb-2 leading-snug">{item.title}</h2>
                  <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-4" style={{ color: "var(--text-2)" }}>
                    {item.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-4 border-t border-white/[0.06]">
                      <Tag size={10} style={{ color: "var(--text-3)" }} />
                      {tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
