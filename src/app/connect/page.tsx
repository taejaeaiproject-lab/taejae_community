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
  STUDENT: { label: "재학생", color: "bg-blue-100 text-blue-700" },
  ALUMNI:  { label: "동문", color: "bg-amber-100 text-amber-700" },
  FACULTY: { label: "교직원", color: "bg-green-100 text-green-700" },
  SPONSOR: { label: "후원자", color: "bg-purple-100 text-purple-700" },
  ADMIN:   { label: "관리자", color: "bg-red-100 text-red-600" },
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
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Users size={12} />
            Connect
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Meet the Community</h1>
          <p className="text-gray-500 max-w-xl">Taejae students, alumni, faculty, and partners — building connections across borders.</p>
        </div>

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); setQuery(search); }} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or role..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
          </div>
          <button type="submit" className="px-5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-medium rounded-2xl transition-colors">
            Search
          </button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-36" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{members.length} members</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => {
                const r = ROLES[m.role] ?? { label: m.role, color: "bg-gray-100 text-gray-600" };
                return (
                  <Link key={m.id} href={`/members/${m.id}`} className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate group-hover:text-[#1a3a5c] transition-colors">{m.name}</div>
                        {m.nameEn && <div className="text-xs text-gray-400 truncate">{m.nameEn}</div>}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>{r.label}</span>
                          {m.cohort && <span className="text-xs text-gray-400">{m.cohort}기</span>}
                        </div>
                      </div>
                    </div>
                    {(m.jobTitle || m.company) && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Briefcase size={11} className="text-gray-400 shrink-0" />
                        <span className="truncate">{[m.jobTitle, m.company].filter(Boolean).join(" @ ")}</span>
                      </div>
                    )}
                    {(m.currentCity || m.currentCountry) && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin size={11} className="shrink-0" />
                        {[m.currentCity, m.currentCountry].filter(Boolean).join(", ")}
                      </div>
                    )}
                    {m.linkedinUrl && (
                      <span onClick={(e) => { e.preventDefault(); window.open(m.linkedinUrl!, "_blank"); }}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-500 hover:underline cursor-pointer">
                        <ExternalLink size={11} />LinkedIn
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
