"use client";

import { useState } from "react";
import PublicNav from "@/components/PublicNav";
import { Mail, Send, MessageSquare, Users, Globe, BookOpen, CheckCircle2 } from "lucide-react";

const SUBJECTS = [
  "일반 문의",
  "동문 네트워크",
  "커뮤니티 참여",
  "학교 관련 문의",
  "파트너십 / 후원",
  "미디어 / 언론",
  "기타",
];

const CONTACTS = [
  {
    role: "커뮤니티 운영",
    name: "동문회 사무국",
    desc: "커뮤니티 가입, 행사 참여, 일반 문의",
    email: "taejae.ai.project@gmail.com",
    icon: Users,
    color: "text-[#c9a227] bg-[#c9a227]/10 border-[#c9a227]/20",
  },
  {
    role: "글로벌 프로그램",
    name: "국제 팀",
    desc: "해외 캠퍼스 연계, 글로벌 네트워크",
    email: "taejae.ai.project@gmail.com",
    icon: Globe,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    role: "학습 & 커리큘럼",
    name: "교육 팀",
    desc: "강의, 워크숍, 교육 프로그램 문의",
    email: "taejae.ai.project@gmail.com",
    icon: BookOpen,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    role: "미디어 & 협력",
    name: "미디어 팀",
    desc: "언론 문의, 파트너십, 후원 프로그램",
    email: "taejae.ai.project@gmail.com",
    icon: MessageSquare,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

export default function ConnectPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const d = await res.json();
        setError(d.error ?? "전송 중 오류가 발생했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSending(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#c9a227]/40 transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="orb orb-gold w-[500px] h-[500px] top-[-50px] right-[-100px] opacity-20" />
        <div className="orb orb-navy w-[350px] h-[350px] bottom-0 left-[-50px] opacity-30" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-5">
            <Mail size={11} />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3 leading-tight">
            Get in<br />
            <span className="gold-text">Touch</span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-2)" }}>
            태재 커뮤니티에 대한 문의, 제안, 협력 요청을 보내주세요.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Contact Form — left (3/5) */}
          <div className="lg:col-span-3">
            <div className="card rounded-3xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-black text-white mb-2">문의가 전송되었습니다!</h2>
                  <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
                    빠른 시일 내에 답변 드리겠습니다.<br />
                    보통 1~2 영업일 내에 회신드립니다.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--border)", color: "var(--text-2)" }}
                  >
                    다시 문의하기
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-black text-white mb-6">문의 보내기</h2>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-3)" }}>이름 *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          placeholder="홍길동"
                          required
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-3)" }}>이메일 *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-3)" }}>문의 유형 *</label>
                      <select
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        required
                        className={inputClass}
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s} style={{ background: "#0f1e30" }}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-3)" }}>메시지 *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="문의 내용을 자세히 작성해주세요..."
                        required
                        rows={6}
                        className={inputClass + " resize-none"}
                        style={inputStyle}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 bg-[#c9a227] hover:bg-[#f0c040] text-[#060d18] font-bold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/20 mt-2"
                    >
                      {sending ? "전송 중..." : (
                        <>
                          <Send size={14} />
                          문의 보내기
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contacts — right (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-white mb-1">담당 팀 연락처</h2>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                문의 유형에 따라 담당 팀에 직접 연락하실 수 있습니다.
              </p>
            </div>

            {CONTACTS.map(({ role, name, desc, email, icon: Icon, color }) => (
              <div key={role} className="card rounded-2xl p-5 hover:border-white/15 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold mb-0.5" style={{ color: "var(--text-3)" }}>{role}</div>
                    <div className="font-bold text-white text-sm mb-1">{name}</div>
                    <div className="text-xs mb-2.5 leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</div>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#c9a227] hover:text-[#f0c040] transition-colors font-medium"
                    >
                      <Mail size={10} />
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Info card */}
            <div className="rounded-2xl p-5 mt-1" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)" }}>
              <div className="text-xs font-semibold text-[#c9a227] mb-2">응답 안내</div>
              <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-2)" }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a227] mt-0.5 shrink-0">·</span>
                  일반 문의: 1–2 영업일 내 회신
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a227] mt-0.5 shrink-0">·</span>
                  파트너십 / 언론: 3–5 영업일 내 회신
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a227] mt-0.5 shrink-0">·</span>
                  영문 문의도 가능합니다 (English OK)
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: "var(--text-3)" }}>© 2026 Taejae University Alumni Association · taejae.ac.kr</p>
        </div>
      </footer>
    </div>
  );
}
