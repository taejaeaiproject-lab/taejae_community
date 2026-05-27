"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft, MapPin, Briefcase, ExternalLink,
  GraduationCap, MessageSquare, UserCheck, Clock, X,
} from "lucide-react";

type MemberProfile = {
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
  instagramUrl: string | null;
  company: string | null;
  jobTitle: string | null;
  graduationYear: number | null;
  isPublic: boolean;
  createdAt: string;
  mentorRequestStatus: string | null;
};

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/users/${id}`)
      .then((r) => {
        if (r.status === 404) { router.push("/directory"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setMember(data);
        setRequestStatus(data.mentorRequestStatus);
        setLoading(false);
      });
  }, [id, status, router]);

  async function handleMentorRequest() {
    if (submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/mentor-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: id, message: requestMessage }),
    });
    setSubmitting(false);
    if (res.ok) {
      setRequestStatus("PENDING");
      setShowRequestModal(false);
      setRequestMessage("");
      toast("멘토링 요청을 보냈습니다!", "success");
    } else {
      const data = await res.json();
      toast(data.error ?? "요청에 실패했습니다.", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-8 animate-pulse h-64" />
        </main>
      </div>
    );
  }
  if (!member) return null;

  const isOwnProfile = session?.user.id === id;

  const requestButtonContent = () => {
    if (isOwnProfile) return null;
    if (requestStatus === "PENDING") {
      return (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-xl border border-amber-200">
          <Clock size={15} />
          요청 대기 중
        </div>
      );
    }
    if (requestStatus === "ACCEPTED") {
      return (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200">
          <UserCheck size={15} />
          멘토링 연결됨
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowRequestModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors"
      >
        <MessageSquare size={15} />
        멘토링 요청
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-20 md:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/directory" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a3a5c] mb-6 transition-colors">
          <ArrowLeft size={15} />동문 디렉토리
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Header gradient */}
          <div className="h-24 bg-gradient-to-r from-[#0f2340] via-[#1a3a5c] to-[#2a4d73]" />

          <div className="px-6 md:px-8 pb-6">
            {/* Avatar + actions row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white font-bold text-3xl shadow-md border-4 border-white">
                {member.name.charAt(0)}
              </div>
              <div className="pb-1">{requestButtonContent()}</div>
            </div>

            {/* Name & badges */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
              {member.nameEn && <p className="text-gray-400 text-sm mt-0.5">{member.nameEn}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <RoleBadge role={member.role} />
                {member.cohort && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{member.cohort}기</span>
                )}
                {member.graduationYear && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{member.graduationYear}년 졸업</span>
                )}
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 rounded-2xl p-4">
                {member.bio}
              </p>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              {(member.jobTitle || member.company) && (
                <div className="flex items-center gap-2.5 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Briefcase size={15} className="text-blue-600" />
                  </div>
                  <span>{[member.jobTitle, member.company].filter(Boolean).join(" @ ")}</span>
                </div>
              )}
              {member.major && (
                <div className="flex items-center gap-2.5 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <GraduationCap size={15} className="text-purple-600" />
                  </div>
                  <span>{member.major}</span>
                </div>
              )}
              {(member.currentCity || member.currentCountry) && (
                <div className="flex items-center gap-2.5 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-green-600" />
                  </div>
                  <span>{[member.currentCity, member.currentCountry].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            {(member.linkedinUrl || member.instagramUrl) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink size={14} />
                    LinkedIn
                  </a>
                )}
                {member.instagramUrl && (
                  <a
                    href={member.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    <ExternalLink size={14} />
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="text-center">
            <Link href="/profile" className="text-sm text-[#1a3a5c] hover:underline">
              내 프로필 수정하기 →
            </Link>
          </div>
        )}
      </main>

      {/* Mentor Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">멘토링 요청</h2>
              <button onClick={() => setShowRequestModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold text-gray-900">{member.name}</span>님에게 멘토링 연결을 요청합니다.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={4}
              placeholder="자기소개 및 멘토링을 요청하는 이유를 적어주세요. (선택)"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 bg-gray-50 focus:bg-white transition-colors"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1 mb-4">{requestMessage.length}/500</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleMentorRequest}
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2340] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
              >
                {submitting ? "전송 중..." : "요청 보내기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
