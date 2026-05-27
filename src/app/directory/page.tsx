"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { Search, MapPin, Briefcase, ExternalLink } from "lucide-react";

type Member = {
  id: string;
  name: string;
  nameEn: string | null;
  role: string;
  cohort: number | null;
  major: string | null;
  currentCity: string | null;
  currentCountry: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  company: string | null;
  jobTitle: string | null;
};

const ROLE_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "STUDENT", label: "재학생" },
  { value: "ALUMNI", label: "동문" },
  { value: "FACULTY", label: "교직원" },
  { value: "SPONSOR", label: "후원자/기업" },
];

export default function DirectoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [cohortFilter, setCohortFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams();
    if (roleFilter !== "ALL") params.set("role", roleFilter);
    if (cohortFilter) params.set("cohort", cohortFilter);
    if (search) params.set("search", search);
    if (countryFilter) params.set("country", countryFilter);

    setLoading(true);
    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((data) => { setMembers(data); setLoading(false); });
  }, [status, roleFilter, cohortFilter, search, countryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">동문 디렉토리</h1>
          <p className="text-gray-500 text-sm">재학생·동문·교직원·후원자를 검색하고 연결하세요</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 회사, 직책 검색..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            >
              {ROLE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            >
              <option value="">전체 기수</option>
              <option value="1">1기</option>
              <option value="2">2기</option>
              <option value="3">3기</option>
            </select>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            >
              <option value="">전체 지역</option>
              <option value="South Korea">한국</option>
              <option value="USA">미국</option>
              <option value="Japan">일본</option>
              <option value="China">중국</option>
              <option value="Europe">유럽</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{members.length}명</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => (
                <Link key={m.id} href={`/members/${m.id}`} className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{m.name}</div>
                      {m.nameEn && <div className="text-xs text-gray-400 truncate">{m.nameEn}</div>}
                      <div className="flex items-center gap-2 mt-1">
                        <RoleBadge role={m.role} />
                        {m.cohort && (
                          <span className="text-xs text-gray-400">{m.cohort}기</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(m.jobTitle || m.company) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                      <Briefcase size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{[m.jobTitle, m.company].filter(Boolean).join(" @ ")}</span>
                    </div>
                  )}
                  {(m.currentCity || m.currentCountry) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      <span>{[m.currentCity, m.currentCountry].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  {m.bio && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{m.bio}</p>
                  )}
                  {m.major && (
                    <div className="text-xs text-[#1a3a5c] bg-blue-50 px-2 py-1 rounded-lg inline-block mb-3">
                      {m.major}
                    </div>
                  )}

                  {m.linkedinUrl && (
                    <span
                      onClick={(e) => { e.preventDefault(); window.open(m.linkedinUrl!, "_blank", "noopener,noreferrer"); }}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline cursor-pointer"
                    >
                      <ExternalLink size={12} />
                      LinkedIn
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
