import Link from "next/link";
import { Clock } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2340] to-[#1a3a5c] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">승인 대기 중</h1>
        <p className="text-blue-200 mb-2 leading-relaxed">
          가입 신청이 접수되었습니다.<br />
          관리자 검토 후 승인되면 이메일로 안내드립니다.
        </p>
        <p className="text-blue-300 text-sm mb-8">
          승인까지 1-3 영업일 정도 소요될 수 있습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a227] hover:bg-[#b8911f] text-white font-semibold rounded-xl transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
