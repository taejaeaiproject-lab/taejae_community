"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MAJORS } from "@/lib/utils";

const ROLES = [
  { value: "STUDENT", label: "재학생" },
  { value: "ALUMNI", label: "동문 (졸업생)" },
  { value: "FACULTY", label: "교직원" },
  { value: "SPONSOR", label: "후원자 / 기업" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "", password: "", passwordConfirm: "",
    name: "", nameEn: "", role: "STUDENT", cohort: "", major: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "오류가 발생했습니다.");
    } else {
      router.push("/pending");
    }
  }

  const isStudent = form.role === "STUDENT" || form.role === "ALUMNI";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2340] to-[#1a3a5c] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a227] to-[#f0c040] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">泰</span>
          </div>
          <h1 className="text-2xl font-bold text-white">커뮤니티 가입 신청</h1>
          <p className="text-blue-200 text-sm mt-1">관리자 승인 후 이용 가능합니다</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 (한글) *</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm"
                  placeholder="홍길동"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (English)</label>
                <input
                  type="text" value={form.nameEn}
                  onChange={(e) => update("nameEn", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm"
                  placeholder="Hong Gildong"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 *</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 *</label>
                <input
                  type="password" required value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm"
                  placeholder="8자 이상"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인 *</label>
                <input
                  type="password" required value={form.passwordConfirm}
                  onChange={(e) => update("passwordConfirm", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">구분 *</label>
              <select
                value={form.role} required
                onChange={(e) => update("role", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {isStudent && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">기수 (Cohort)</label>
                  <select
                    value={form.cohort}
                    onChange={(e) => update("cohort", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm bg-white"
                  >
                    <option value="">선택</option>
                    <option value="1">1기 (2023)</option>
                    <option value="2">2기 (2024)</option>
                    <option value="3">3기 (2025)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">전공</label>
                  <select
                    value={form.major}
                    onChange={(e) => update("major", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] text-sm bg-white"
                  >
                    <option value="">선택</option>
                    {MAJORS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
              가입 신청 후 <strong>관리자 검토 및 승인</strong>이 완료되면 이용 가능합니다.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a3a5c] hover:bg-[#0f2340] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? "신청 중..." : "가입 신청하기"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-[#1a3a5c] font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
