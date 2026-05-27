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
  ONGOING:   { label: "진행 중", color: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "완료", color: "bg-blue-100 text-blue-700" },
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
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <main className="max-w-3xl mx-auto px-6 pt-28">
          <div className="bg-white rounded-3xl p-8 animate-pulse h-64" />
        </main>
      </div>
    );
  }
  if (!project) return null;

  const s = STATUS[project.status as keyof typeof STATUS] ?? STATUS.ONGOING;
  const tags = project.tags ? project.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const members = project.teamMembers ? project.teamMembers.split(",").map((m) => m.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-6 pt-28">
        <Link href="/project" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={15} />Projects
        </Link>

        {/* Project card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="h-2 bg-gradient-to-r from-[#1a3a5c] to-[#c9a227]" />
          <div className="p-7 md:p-9">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
              <div className="flex gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors">
                    <Code size={15} />
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors">
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{project.description}</p>

            <div className="flex flex-wrap gap-4 pt-5 border-t border-gray-100">
              {members.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{members.join(", ")}</span>
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={15} className="text-gray-400" />
                  {tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-7 md:px-9 pt-6 pb-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={17} className="text-gray-400" />
              Comments ({project.comments.length})
            </h2>
          </div>

          {project.comments.length > 0 && (
            <div className="px-7 md:px-9 divide-y divide-gray-50">
              {project.comments.map((c) => (
                <div key={c.id} className="py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white text-xs font-bold">
                      {c.authorName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{c.authorName}</span>
                    <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-9">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={handleComment} className="px-7 md:px-9 py-6 border-t border-gray-50">
            <p className="text-xs text-gray-400 mb-3">Leave a comment — no account required.</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
            <div className="flex gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                placeholder="Share your thoughts..."
                maxLength={500}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
              <button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
                className="px-4 bg-[#1a3a5c] hover:bg-[#0f2340] text-white rounded-xl transition-colors disabled:opacity-40 shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
