"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { ArrowLeft, Tag, Users, ExternalLink, Code, MessageSquare, Send } from "lucide-react";

type Comment = { id: string; content: string; authorName: string; createdAt: string };
type Project = {
  id: string; title: string; description: string;
  tags: string | null; status: string; teamMembers: string | null;
  demoUrl: string | null; githubUrl: string | null;
  createdAt: string; comments: Comment[];
};

const STATUS = {
  ONGOING:   { label: "진행 중", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", dot: "bg-emerald-400" },
  COMPLETED: { label: "완료",    color: "bg-blue-500/15 text-blue-400 border-blue-500/25",          dot: "bg-blue-400" },
};

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => { setProject(d); setLoading(false); });
  }, [id]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/projects/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorName: name }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setProject((p) => p ? { ...p, comments: [...p.comments, data] } : p);
      setContent("");
    } else {
      setError(data.error ?? "댓글 등록에 실패했습니다.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <PublicNav />
        <main className="max-w-3xl mx-auto px-6 pt-32">
          <div className="card rounded-3xl h-64 shimmer" />
        </main>
      </div>
    );
  }
  if (!project) return null;

  const s = STATUS[project.status as keyof typeof STATUS] ?? STATUS.ONGOING;
  const tags = project.tags ? project.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const members = project.teamMembers ? project.teamMembers.split(",").map((m) => m.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
      <PublicNav />

      <div className="fixed orb orb-gold w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-15 pointer-events-none z-0" />
      <div className="fixed orb orb-navy w-[400px] h-[400px] bottom-0 left-[-100px] opacity-30 pointer-events-none z-0" />

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-28">
        <Link href="/project" className="inline-flex items-center gap-1.5 text-sm hover:text-white mb-8 transition-colors"
          style={{ color: "var(--text-3)" }}>
          <ArrowLeft size={14} />Projects
        </Link>

        {/* Project card */}
        <div className="card rounded-3xl overflow-hidden mb-4">
          <div className="h-1 bg-gradient-to-r from-[#1a3a5c] via-[#c9a227] to-[#f0c040]" />
          <div className="p-7 md:p-9">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
                {s.label}
              </div>
              <div className="flex gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl card hover:border-white/20 transition-all text-white/40 hover:text-white">
                    <Code size={14} />
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl card hover:border-white/20 transition-all text-white/40 hover:text-white">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-snug">{project.title}</h1>
            <p className="leading-relaxed whitespace-pre-wrap mb-6 text-sm" style={{ color: "var(--text-2)" }}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-5 border-t border-white/[0.06]">
              {members.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users size={13} style={{ color: "var(--text-3)" }} />
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>{members.join(", ")}</span>
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={13} style={{ color: "var(--text-3)" }} />
                  {tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="card rounded-3xl overflow-hidden">
          <div className="px-7 md:px-9 pt-6 pb-4 border-b border-white/[0.06]">
            <h2 className="font-bold text-white flex items-center gap-2 text-sm">
              <MessageSquare size={15} style={{ color: "var(--text-3)" }} />
              Comments ({project.comments.length})
            </h2>
          </div>

          {project.comments.length > 0 && (
            <div className="px-7 md:px-9 divide-y divide-white/[0.04]">
              {project.comments.map((c) => (
                <div key={c.id} className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.authorName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-white">{c.authorName}</span>
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed pl-9" style={{ color: "var(--text-2)" }}>{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleComment} className="px-7 md:px-9 py-6 border-t border-white/[0.06]">
            <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>Leave a comment — no account required.</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none mb-2 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)" }}
            />
            <div className="flex gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                placeholder="Share your thoughts..."
                maxLength={500}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 resize-none focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)" }}
              />
              <button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
                className="px-4 bg-[#c9a227] hover:bg-[#f0c040] text-[#060d18] rounded-xl transition-all disabled:opacity-30 shrink-0 font-bold"
              >
                <Send size={14} />
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
