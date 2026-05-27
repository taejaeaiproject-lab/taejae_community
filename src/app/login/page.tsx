"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const errorParam = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error === "PENDING") {
      router.push("/pending");
    } else if (res?.error === "REJECTED") {
      setError("가입이 거절되었습니다. 관리자에게 문의해주세요.");
    } else if (res?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: "var(--bg)" }}>
      {/* Orbs */}
      <div className="fixed orb orb-gold w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-15 pointer-events-none" />
      <div className="fixed orb orb-navy w-[400px] h-[400px] bottom-[-100px] left-[-100px] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-[#c9a227]/20">
            <span className="text-white font-black text-2xl">泰</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">로그인</h1>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>태재대학교 동문회 커뮤니티</p>
        </div>

        {/* Card */}
        <div className="card rounded-3xl p-8">
          {(error || errorParam) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error || "로그인 중 오류가 발생했습니다."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-3)" }}>
                이메일
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-3)" }}>
                비밀번호
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#c9a227] hover:bg-[#f0c040] text-[#060d18] font-bold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/20"
            >
              {loading ? "로그인 중..." : (
                <>
                  로그인
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs" style={{ color: "var(--text-3)" }}>
              계정이 없으신가요?{" "}
              <Link href="/register" className="text-[#c9a227] font-semibold hover:text-[#f0c040] transition-colors">
                가입 신청하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
