"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { FolderKanban, MessageSquare, Users, ArrowRight, Tag } from "lucide-react";

type Project = {
  id: string; title: string; description: string;
  tags: string | null; status: string;
  teamMembers: string | null; demoUrl: string | null; githubUrl: string | null;
  createdAt: string; _count: { comments: number };
};

const STATUS = {
  ONGOING:   { label: "진행 중", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", dot: "bg-emerald-400" },
  COMPLETED: { label: "완료",    color: "bg-blue-500/15 text-blue-400 border-blue-500/25",          dot: "bg-blue-400" },
};

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-blue w-[400px] h-[400px] top-0 right-0 opacity-20" />
        <div className="orb orb-gold w-[300px] h-[300px] bottom-0 left-0 opacity-15" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
            <FolderKanban size={11} />
            Projects
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Student Projects
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            Explore what Taejae students are building — from research to real-world impact across 7 global cities.
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
        ) : projects.length === 0 ? (
          <div className="text-center py-32">
            <FolderKanban size={40} className="mx-auto mb-4 opacity-20 text-white" />
            <p className="text-white/40 font-medium">아직 등록된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => {
              const s = STATUS[p.status as keyof typeof STATUS] ?? STATUS.ONGOING;
              const tags = p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
              const members = p.teamMembers ? p.teamMembers.split(",").map((m) => m.trim()).filter(Boolean) : [];
              return (
                <Link
                  key={p.id}
                  href={`/project/${p.id}`}
                  className="group card rounded-3xl p-7 hover:border-emerald-500/25 transition-all duration-200 hover:-translate-y-1 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
                      {s.label}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>

                  <h2 className="font-bold text-white text-lg leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-sm leading-relaxed line-clamp-2 flex-1 mb-5" style={{ color: "var(--text-2)" }}>
                    {p.description}
                  </p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tags.slice(0, 3).map((t) => (
                        <span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                          <Tag size={9} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    {members.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
                        <Users size={12} />
                        {members.slice(0, 2).join(", ")}{members.length > 2 && ` +${members.length - 2}`}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs ml-auto" style={{ color: "var(--text-3)" }}>
                      <MessageSquare size={12} />
                      {p._count.comments}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
