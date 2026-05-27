"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { GLOBAL_CAMPUSES } from "@/lib/utils";
import { Save, Eye, EyeOff } from "lucide-react";

type Profile = {
  id: string; name: string; nameEn: string | null; email: string; role: string;
  cohort: number | null; major: string | null;
  currentCity: string | null; currentCountry: string | null;
  bio: string | null; linkedinUrl: string | null; instagramUrl: string | null;
  company: string | null; jobTitle: string | null; isPublic: boolean;
};

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm(data);
      });
  }, [status]);

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 animate-pulse h-96" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">내 프로필</h1>
          <p className="text-gray-500 text-sm">다른 동문들에게 보이는 정보를 관리하세요</p>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#1a3a5c] to-[#0f2340] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a227] to-[#f0c040] flex items-center justify-center text-white font-bold text-2xl">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-xl">{profile.name}</div>
              {profile.nameEn && <div className="text-blue-200 text-sm">{profile.nameEn}</div>}
              <div className="flex items-center gap-2 mt-1.5">
                <RoleBadge role={profile.role} />
                {profile.cohort && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{profile.cohort}기</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              프로필이 저장되었습니다.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (English)</label>
              <input
                type="text" value={form.nameEn ?? ""}
                onChange={(e) => update("nameEn", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                placeholder="Hong Gildong"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">회사 / 소속</label>
                <input
                  type="text" value={form.company ?? ""}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                  placeholder="회사명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">직책 / 직함</label>
                <input
                  type="text" value={form.jobTitle ?? ""}
                  onChange={(e) => update("jobTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">현재 위치</label>
              <select
                value={form.currentCity ?? ""}
                onChange={(e) => {
                  const found = GLOBAL_CAMPUSES.find((c) => c.city === e.target.value);
                  update("currentCity", e.target.value);
                  if (found) update("currentCountry", found.country);
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                <option value="">선택</option>
                {GLOBAL_CAMPUSES.map((c) => (
                  <option key={c.city} value={c.city}>{c.flag} {c.city}, {c.country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">자기소개</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => update("bio", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-none"
                placeholder="간단한 자기소개를 입력하세요..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
                <input
                  type="url" value={form.linkedinUrl ?? ""}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                <input
                  type="text" value={form.instagramUrl ?? ""}
                  onChange={(e) => update("instagramUrl", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {form.isPublic ? <Eye size={18} className="text-[#1a3a5c]" /> : <EyeOff size={18} className="text-gray-400" />}
                <div>
                  <div className="text-sm font-medium text-gray-900">프로필 공개</div>
                  <div className="text-xs text-gray-500">다른 회원들에게 내 프로필 표시</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => update("isPublic", !form.isPublic)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublic ? "bg-[#1a3a5c]" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a3a5c] hover:bg-[#0f2340] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              {loading ? "저장 중..." : "저장하기"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
