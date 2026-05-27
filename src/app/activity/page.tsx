"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { Zap, Tag, CalendarDays } from "lucide-react";

type ActivityContent = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};

const TYPE: Record<string, { label: string; color: string; dot: string }> = {
  SESSION:       { label: "Active Learning", color: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400" },
  WORKSHOP:      { label: "Workshop",        color: "bg-orange-500/15 text-orange-400 border-orange-500/25", dot: "bg-orange-400" },
  COLLABORATION: { label: "Collaboration",   color: "bg-rose-500/15 text-rose-400 border-rose-500/25",       dot: "bg-rose-400" },
};

const FILTERS = [
  { key: "ALL",           label: "전체" },
  { key: "SESSION",       label: "Active Learning" },
  { key: "WORKSHOP",      label: "Workshop" },
  { key: "COLLABORATION", label: "Collaboration" },
];

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

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
        {/* Filter + Count row */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
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
          {!loading && (
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
              const t = TYPE[item.type] ?? TYPE.SESSION;
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
