"use client";

import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import { BookOpen, Tag, User } from "lucide-react";

type LearningContent = {
  id: string; title: string; description: string;
  category: string; instructor: string | null; tags: string | null;
};

const CATEGORY = {
  COURSE:    { label: "Course", color: "bg-blue-100 text-blue-700" },
  WORKSHOP:  { label: "Workshop", color: "bg-purple-100 text-purple-700" },
  SEMINAR:   { label: "Seminar", color: "bg-amber-100 text-amber-700" },
};

export default function LearningPage() {
  const [items, setItems] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <BookOpen size={12} />
            Learning
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Curriculum & Courses</h1>
          <p className="text-gray-500 max-w-xl">Current educational programs, courses, and workshops offered at Taejae University.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-44" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">아직 등록된 학습 내용이 없습니다.</p>
            <p className="text-sm mt-1">관리자 패널에서 콘텐츠를 추가해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const cat = CATEGORY[item.category as keyof typeof CATEGORY] ?? CATEGORY.COURSE;
              const tags = item.tags ? item.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
              return (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                  <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${cat.color}`}>
                    {cat.label}
                  </span>
                  <h2 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">{item.description}</p>

                  <div className="space-y-1.5 mt-auto">
                    {item.instructor && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <User size={11} />
                        {item.instructor}
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag size={11} className="text-gray-300" />
                        {tags.map((t) => (
                          <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
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
