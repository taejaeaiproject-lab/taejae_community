"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { Zap, Tag, CalendarDays } from "lucide-react";

type ActivityContent = {
  id: string; title: string; description: string;
  type: string; date: string | null; tags: string | null;
};

const TYPE = {
  SESSION:       { label: "Active Learning", color: "bg-amber-100 text-amber-700" },
  WORKSHOP:      { label: "Workshop", color: "bg-orange-100 text-orange-700" },
  COLLABORATION: { label: "Collaboration", color: "bg-rose-100 text-rose-700" },
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
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Zap size={12} />
            Activity
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Active Learning</h1>
          <p className="text-gray-500 max-w-xl">Hands-on learning sessions, collaborative workshops, and experiential activities at Taejae.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-44" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Zap size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">아직 등록된 활동이 없습니다.</p>
            <p className="text-sm mt-1">관리자 패널에서 활동을 추가해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((item) => {
              const t = TYPE[item.type as keyof typeof TYPE] ?? TYPE.SESSION;
              const tags = item.tags ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.color}`}>{t.label}</span>
                    {item.date && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarDays size={11} />
                        {item.date}
                      </div>
                    )}
                  </div>
                  <h2 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">{item.description}</p>
                  {tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                      <Tag size={11} className="text-gray-300" />
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{tag}</span>
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
