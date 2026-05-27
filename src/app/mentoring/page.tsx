"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { useToast } from "@/components/ui/Toast";
import { UserCheck, UserX, Clock, Briefcase, GraduationCap } from "lucide-react";

type UserSnippet = {
  id: string;
  name: string;
  nameEn: string | null;
  role: string;
  cohort: number | null;
  major: string | null;
  jobTitle: string | null;
  company: string | null;
};

type MentorRequest = {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  fromUser?: UserSnippet;
  toUser?: UserSnippet;
};

type RequestsData = {
  received: MentorRequest[];
  sent: MentorRequest[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "대기 중", color: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "수락됨", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "거절됨", color: "bg-red-100 text-red-600" },
};

function UserCard({ user }: { user: UserSnippet }) {
  return (
    <Link href={`/members/${user.id}`} className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-sm shrink-0">
        {user.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-gray-900 text-sm group-hover:text-[#1a3a5c] transition-colors">{user.name}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <RoleBadge role={user.role} />
          {user.cohort && <span className="text-xs text-gray-400">{user.cohort}기</span>}
        </div>
        {(user.jobTitle || user.company) && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Briefcase size={11} className="text-gray-400" />
            {[user.jobTitle, user.company].filter(Boolean).join(" @ ")}
          </div>
        )}
        {user.major && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <GraduationCap size={11} />
            {user.major}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MentoringPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<RequestsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/mentor-requests")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [status]);

  async function handleAction(requestId: string, action: "ACCEPTED" | "REJECTED") {
    const res = await fetch(`/api/mentor-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    if (res.ok) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          received: prev.received.map((r) =>
            r.id === requestId ? { ...r, status: action } : r
          ),
        };
      });
      toast(action === "ACCEPTED" ? "멘토링 요청을 수락했습니다." : "요청을 거절했습니다.", "success");
    }
  }

  const pendingCount = data?.received.filter((r) => r.status === "PENDING").length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">멘토링 요청</h1>
          <p className="text-gray-500 text-sm">받은 요청을 수락하거나 보낸 요청을 확인하세요</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("received")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === "received" ? "bg-[#1a3a5c] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            받은 요청
            {pendingCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setTab("sent")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === "sent" ? "bg-[#1a3a5c] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            보낸 요청
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tab === "received" && (
              data?.received.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <UserCheck size={40} className="mx-auto mb-3 opacity-30" />
                  <p>받은 멘토링 요청이 없습니다.</p>
                </div>
              ) : (
                data?.received.map((req) => {
                  const s = STATUS_LABELS[req.status] ?? STATUS_LABELS.PENDING;
                  return (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {req.fromUser && <UserCard user={req.fromUser} />}
                          {req.message && (
                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                              {req.message}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                              {s.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        </div>
                        {req.status === "PENDING" && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => handleAction(req.id, "ACCEPTED")}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-xs font-medium rounded-xl transition-colors"
                            >
                              <UserCheck size={13} />
                              수락
                            </button>
                            <button
                              onClick={() => handleAction(req.id, "REJECTED")}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-medium rounded-xl transition-colors"
                            >
                              <UserX size={13} />
                              거절
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            )}

            {tab === "sent" && (
              data?.sent.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Clock size={40} className="mx-auto mb-3 opacity-30" />
                  <p>보낸 멘토링 요청이 없습니다.</p>
                </div>
              ) : (
                data?.sent.map((req) => {
                  const s = STATUS_LABELS[req.status] ?? STATUS_LABELS.PENDING;
                  return (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {req.toUser && <UserCard user={req.toUser} />}
                          {req.message && (
                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                              {req.message}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                              {s.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
