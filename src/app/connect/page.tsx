"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { Users, Search, MapPin, Briefcase, ExternalLink } from "lucide-react";

type Member = {
  id: string; name: string; nameEn: string | null; role: string;
  cohort: number | null; major: string | null;
  currentCity: string | null; currentCountry: string | null;
  company: string | null; jobTitle: string | null;
  linkedinUrl: string | null; bio: string | null;
};

const ROLES: Record<string, { label: string; color: string }> = {
  STUDENT: { label: "재학생",  color: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  ALUMNI:  { label: "동문",    color: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  FACULTY: { label: "교직원",  color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  SPONSOR: { label: "후원자",  color: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  ADMIN:   { label: "관리자",  color: "bg-rose-500/15 text-rose-400 border border-rose-500/20" },
};

export default function ConnectPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((d) => { setMembers(Array.isArray(d) ? d : []); setLoading(false); });
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-gold w-[500px] h-[500px] top-[-50px] right-[-100px] opacity-20" />
        <div className="orb orb-blue w-[350px] h-[350px] bottom-0 left-0 opacity-15" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-purple-400 bg-purple-500/10 border border-purple-500/20 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
            <Users size={11} />
            Connect
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Meet the Community
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            Taejae students, alumni, faculty, and partners — building connections across borders.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); setQuery(search); }}
          className="flex gap-2 mb-10"
        >
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, major, or company..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            />
          </div>
          <button
            type="submit"
            className="px-5 bg-[#c9a227] hover:bg-[#f0c040] text-[#060d18] font-bold text-sm rounded-2xl transition-all shadow-lg shadow-[#c9a227]/20"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card rounded-2xl h-36 shimmer" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-32">
            <Users size={40} className="mx-auto mb-4 opacity-20 text-white" />
            <p className="text-white/40">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-5" style={{ color: "var(--text-3)" }}>{members.length} members</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => {
                const r = ROLES[m.role] ?? { label: m.role, color: "bg-white/10 text-white/60 border border-white/10" };
                return (
                  <Link
                    key={m.id}
                    href={`/members/${m.id}`}
                    className="group card rounded-2xl p-5 hover:border-[#c9a227]/20 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg shadow-[#c9a227]/10">
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate group-hover:text-[#c9a227] transition-colors text-sm">
                          {m.name}
                        </div>
                        {m.nameEn && <div className="text-xs truncate" style={{ color: "var(--text-3)" }}>{m.nameEn}</div>}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${r.color}`}>{r.label}</span>
                          {m.cohort && <span className="text-[10px]" style={{ color: "var(--text-3)" }}>{m.cohort}기</span>}
                        </div>
                      </div>
                    </div>
                    {(m.jobTitle || m.company) && (
                      <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-2)" }}>
                        <Briefcase size={10} style={{ color: "var(--text-3)" }} className="shrink-0" />
                        <span className="truncate">{[m.jobTitle, m.company].filter(Boolean).join(" @ ")}</span>
                      </div>
                    )}
                    {(m.currentCity || m.currentCountry) && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-3)" }}>
                        <MapPin size={10} className="shrink-0" />
                        {[m.currentCity, m.currentCountry].filter(Boolean).join(", ")}
                      </div>
                    )}
                    {m.linkedinUrl && (
                      <span
                        onClick={(e) => { e.preventDefault(); window.open(m.linkedinUrl!, "_blank"); }}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                      >
                        <ExternalLink size={10} />LinkedIn
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
