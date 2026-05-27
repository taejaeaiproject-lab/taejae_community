"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { Zap, Tag, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

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

// KST(UTC+9) 기준 오늘 날짜
function getKSTToday() {
  return new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
}

export default function ActivityPage() {
  const kstToday   = getKSTToday();
  const todayKey   = kstToday.toISOString().slice(0, 10);

  const [items, setItems]             = useState<ActivityContent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAll, setShowAll]         = useState(false);
  const [current, setCurrent]         = useState(
    () => new Date(kstToday.getFullYear(), kstToday.getMonth(), 1)
  );

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
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

  const fmtKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 표시할 항목: 전체보기 > 선택날짜 > 현재 달
  const displayItems = showAll
    ? [...items].filter((i) => i.date).sort((a, b) => a.date!.localeCompare(b.date!))
    : selectedDate
    ? (eventsByDate[selectedDate] ?? [])
    : [...items]
        .filter((i) => {
          if (!i.date) return false;
          const d = new Date(i.date + "T00:00:00");
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .sort((a, b) => a.date!.localeCompare(b.date!));

  // 이벤트 카드 클릭 → 캘린더 해당 날짜로 이동
  function goToDate(date: string) {
    const d = new Date(date + "T00:00:00");
    setCurrent(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(date);
    setShowAll(false);
  }

  // 전체보기 토글
  function toggleShowAll() {
    setShowAll((v) => {
      if (!v) setSelectedDate(null);
      return !v;
    });
  }

  const headerText = showAll
    ? "전체 일정"
    : selectedDate
    ? `${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8))}일`
    : `${MONTH_NAMES[month]} 일정`;

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

            {/* ── 미니 캘린더 (좌측) ── */}
            <div className="card rounded-3xl overflow-hidden lg:sticky lg:top-24">
              {/* 월 네비게이션 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <button
                  onClick={() => { setCurrent(new Date(year, month - 1, 1)); setSelectedDate(null); setShowAll(false); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "var(--text-3)" }}>
                  <ChevronLeft size={15} />
                </button>
                <div className="text-center">
                  <span className="font-bold text-white text-sm">{year}년 {MONTH_NAMES[month]}</span>
                  {/* 오늘로 돌아가기 버튼 */}
                  {(year !== kstToday.getFullYear() || month !== kstToday.getMonth()) && (
                    <button
                      onClick={() => { setCurrent(new Date(kstToday.getFullYear(), kstToday.getMonth(), 1)); setSelectedDate(null); setShowAll(false); }}
                      className="block mx-auto mt-0.5 text-[10px] font-semibold text-[#c9a227] hover:text-[#f0c040] transition-colors"
                    >
                      오늘로
                    </button>
                  )}
                </div>
                <button
                  onClick={() => { setCurrent(new Date(year, month + 1, 1)); setSelectedDate(null); setShowAll(false); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "var(--text-3)" }}>
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="p-4">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map((d, i) => (
                    <div key={d} className="text-center text-[10px] font-semibold py-1"
                      style={{ color: i === 0 ? "#fb7185" : i === 6 ? "#60a5fa" : "var(--text-3)" }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* 날짜 셀 */}
                <div className="grid grid-cols-7 gap-0.5">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const key    = fmtKey(day);
                    const events = eventsByDate[key] ?? [];
                    const isSel  = !showAll && selectedDate === key;
                    const isToday = key === todayKey;
                    const isSun  = i % 7 === 0;
                    const isSat  = i % 7 === 6;
                    return (
                      <button key={i}
                        onClick={() => {
                          if (isSel) { setSelectedDate(null); }
                          else { setSelectedDate(key); setShowAll(false); }
                        }}
                        className="flex flex-col items-center py-1.5 rounded-lg transition-all"
                        style={{
                          background: isSel
                            ? "rgba(201,162,39,0.20)"
                            : isToday
                            ? "var(--chip-bg-active)"
                            : "transparent",
                          border: isSel
                            ? "1px solid rgba(201,162,39,0.45)"
                            : isToday
                            ? "1px solid var(--chip-border-active)"
                            : "1px solid transparent",
                        }}>
                        <span className="text-[11px] font-semibold" style={{
                          color: isSel ? "#f0c040" : isToday ? "var(--text)" : isSun ? "#fb7185" : isSat ? "#60a5fa" : "var(--text-2)",
                        }}>
                          {day}
                        </span>
                        <div className="flex gap-0.5 mt-0.5 min-h-[5px]">
                          {events.slice(0, 2).map((e, ei) => (
                            <span key={ei} className="w-1 h-1 rounded-full"
                              style={{ background: (TYPE[e.type] ?? TYPE.SESSION).hex }} />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 범례 */}
              <div className="px-4 pb-4 space-y-1.5 border-t border-white/[0.05] pt-3">
                {Object.values(TYPE).map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.hex }} />
                    <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 이벤트 목록 (우측) ── */}
            <div className="lg:col-span-2">
              {/* 헤더 + 전체일정 토글 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} style={{ color: "var(--text-3)" }} />
                  <span className="text-sm font-bold text-white">{headerText}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-3)" }}>
                    {displayItems.length}개
                  </span>
                </div>

                {/* 전체 일정보기 체크박스 토글 */}
                <button
                  onClick={toggleShowAll}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: showAll ? "rgba(201,162,39,0.15)" : "rgba(255,255,255,0.06)",
                    border: showAll ? "1px solid rgba(201,162,39,0.35)" : "1px solid var(--border)",
                    color: showAll ? "#f0c040" : "var(--text-3)",
                  }}>
                  {/* 체크박스 아이콘 */}
                  <span
                    className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: showAll ? "#c9a227" : "transparent",
                      border: showAll ? "1.5px solid #c9a227" : "1.5px solid rgba(255,255,255,0.3)",
                    }}>
                    {showAll && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="#060d18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  전체 일정 보기
                </button>
              </div>

              {displayItems.length === 0 ? (
                <div className="text-center py-20">
                  <CalendarDays size={36} className="mx-auto mb-3 opacity-20 text-white" />
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>
                    {selectedDate ? "이 날에 등록된 활동이 없습니다." : "이 달에 등록된 활동이 없습니다."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayItems.map((item) => {
                    const t    = TYPE[item.type] ?? TYPE.SESSION;
                    const tags = item.tags ? item.tags.split(",").map((g) => g.trim()).filter(Boolean) : [];
                    const isSelected = !showAll && selectedDate === item.date?.slice(0, 10);
                    return (
                      <div
                        key={item.id}
                        onClick={() => item.date && goToDate(item.date.slice(0, 10))}
                        className="card rounded-2xl p-5 flex gap-4 transition-all cursor-pointer"
                        style={{
                          borderColor: isSelected ? "rgba(201,162,39,0.3)" : undefined,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = isSelected ? "rgba(201,162,39,0.3)" : "")}
                      >
                        <div className="w-0.5 rounded-full shrink-0 self-stretch" style={{ background: t.hex }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>
                              {t.label}
                            </span>
                            {item.date && (
                              <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
                                {item.date.slice(0, 10)}
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
