"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { Check, X, Users, Clock } from "lucide-react";

type User = {
  id: string; name: string; nameEn: string | null; email: string;
  role: string; status: string; cohort: number | null; major: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user.role !== "ADMIN") return;
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  }, [status, session]);

  async function updateStatus(userId: string, newStatus: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    }
  }

  const filtered = users.filter((u) => filter === "ALL" ? true : u.status === filter);
  const pendingCount = users.filter((u) => u.status === "PENDING").length;

  function formatDate(s: string) {
    return new Date(s).toLocaleDateString("ko-KR");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">관리자 패널</h1>
          <p className="text-gray-500 text-sm">가입 신청 검토 및 회원 관리</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "전체 회원", value: users.filter(u => u.status === "APPROVED").length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "대기 중", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "거절됨", value: users.filter(u => u.status === "REJECTED").length, icon: X, color: "text-red-500", bg: "bg-red-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-4 md:p-6`}>
              <Icon size={20} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { value: "PENDING", label: `대기 (${pendingCount})` },
            { value: "APPROVED", label: "승인됨" },
            { value: "REJECTED", label: "거절됨" },
            { value: "ALL", label: "전체" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === value
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a5c]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">해당 목록이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                    <th className="text-left px-5 py-3 font-medium">이름</th>
                    <th className="text-left px-5 py-3 font-medium">이메일</th>
                    <th className="text-left px-5 py-3 font-medium">구분</th>
                    <th className="text-left px-5 py-3 font-medium">기수</th>
                    <th className="text-left px-5 py-3 font-medium">신청일</th>
                    <th className="text-left px-5 py-3 font-medium">상태</th>
                    <th className="text-left px-5 py-3 font-medium">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {u.name}
                        {u.nameEn && <span className="text-xs text-gray-400 ml-1">({u.nameEn})</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                      <td className="px-5 py-4 text-gray-500">{u.cohort ? `${u.cohort}기` : "-"}</td>
                      <td className="px-5 py-4 text-gray-400">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          u.status === "REJECTED" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {u.status === "APPROVED" ? "승인됨" : u.status === "REJECTED" ? "거절됨" : "대기 중"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(u.id, "APPROVED")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Check size={12} /> 승인
                            </button>
                            <button
                              onClick={() => updateStatus(u.id, "REJECTED")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <X size={12} /> 거절
                            </button>
                          </div>
                        )}
                        {u.status === "APPROVED" && (
                          <button
                            onClick={() => updateStatus(u.id, "REJECTED")}
                            className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-lg transition-colors"
                          >
                            취소
                          </button>
                        )}
                        {u.status === "REJECTED" && (
                          <button
                            onClick={() => updateStatus(u.id, "APPROVED")}
                            className="px-3 py-1.5 border border-green-200 text-green-600 hover:bg-green-50 text-xs rounded-lg transition-colors"
                          >
                            재승인
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
