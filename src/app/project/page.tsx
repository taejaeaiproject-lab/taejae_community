"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { FolderKanban, MessageSquare, Users, ArrowRight, Tag } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string | null;
  status: string;
  teamMembers: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
  _count: { comments: number };
};

const STATUS = {
  ONGOING:   { label: "진행 중", color: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "완료", color: "bg-blue-100 text-blue-700" },
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
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <FolderKanban size={12} />
            Projects
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Student Projects</h1>
          <p className="text-gray-500 max-w-xl">Explore what Taejae students and alumni are building — from research to real-world impact.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-48" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FolderKanban size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">아직 등록된 프로젝트가 없습니다.</p>
            <p className="text-sm mt-1">관리자 패널에서 프로젝트를 추가해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((p) => {
              const s = STATUS[p.status as keyof typeof STATUS] ?? STATUS.ONGOING;
              const tags = p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
              const members = p.teamMembers ? p.teamMembers.split(",").map((m) => m.trim()).filter(Boolean) : [];
              return (
                <Link
                  key={p.id}
                  href={`/project/${p.id}`}
                  className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors">{p.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">{p.description}</p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.slice(0, 3).map((t) => (
                        <span key={t} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                          <Tag size={10} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    {members.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Users size={12} />
                        {members.slice(0, 2).join(", ")}{members.length > 2 && ` +${members.length - 2}`}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
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
