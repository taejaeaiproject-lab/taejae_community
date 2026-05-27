"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { BookOpen, Tag, User } from "lucide-react";

type LearningContent = {
  id: string; title: string; description: string;
  category: string; instructor: string | null; tags: string | null;
};

const CATEGORY: Record<string, { label: string; color: string; dot: string }> = {
  COURSE:   { label: "Course",   color: "bg-blue-500/15 text-blue-400 border-blue-500/25",     dot: "bg-blue-400" },
  WORKSHOP: { label: "Workshop", color: "bg-purple-500/15 text-purple-400 border-purple-500/25", dot: "bg-purple-400" },
  SEMINAR:  { label: "Seminar",  color: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-400" },
};

const FILTERS = [
  { key: "ALL",      label: "전체" },
  { key: "COURSE",   label: "Course" },
  { key: "WORKSHOP", label: "Workshop" },
  { key: "SEMINAR",  label: "Seminar" },
];

export default function LearningPage() {
  const [items, setItems] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/learning")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = filter === "ALL" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-blue w-[500px] h-[500px] top-0 right-0 opacity-25" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-5">
            <BookOpen size={11} />
            Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3 leading-tight">
            Curriculum<br />
            <span className="gold-text">& Courses</span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            Current educational programs, courses, and workshops offered at Taejae University.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {/* Filter + Count row */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex gap-2">
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
              {filtered.length}개의 과정
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
            <BookOpen size={40} className="mx-auto mb-4 opacity-20 text-white" />
            <p className="text-white/40 font-medium">
              {filter === "ALL" ? "아직 등록된 학습 내용이 없습니다." : "해당 카테고리의 과정이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const cat = CATEGORY[item.category] ?? CATEGORY.COURSE;
              const tags = item.tags ? item.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="card rounded-3xl p-6 flex flex-col hover:border-white/15 transition-all hover:-translate-y-0.5 duration-200">
                  <div className={`self-start flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${cat.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                    {cat.label}
                  </div>
                  <h2 className="font-bold text-white text-base mb-2 leading-snug">{item.title}</h2>
                  <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-4" style={{ color: "var(--text-2)" }}>
                    {item.description}
                  </p>
                  <div className="space-y-2 mt-auto border-t border-white/[0.06] pt-4">
                    {item.instructor && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
                        <User size={11} />
                        {item.instructor}
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag size={10} style={{ color: "var(--text-3)" }} />
                        {tags.map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-md"
                            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                            {t}
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
      </main>
    </div>
  );
}
