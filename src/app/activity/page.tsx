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

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-gold w-[450px] h-[450px] top-[-50px] right-0 opacity-20" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-5">
            <Zap size={11} />
            Activity
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Active Learning
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            Hands-on sessions, workshops, and experiential activities across Taejae's global campuses.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card rounded-3xl h-52 shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32">
            <Zap size={40} className="mx-auto mb-4 opacity-20 text-white" />
            <p className="text-white/40 font-medium">아직 등록된 활동이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => {
              const t = TYPE[item.type] ?? TYPE.SESSION;
              const tags = item.tags ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="card rounded-3xl p-7 flex flex-col hover:border-white/15 transition-all">
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
                  <h2 className="font-bold text-white text-lg mb-2 leading-snug">{item.title}</h2>
                  <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-5" style={{ color: "var(--text-2)" }}>
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
