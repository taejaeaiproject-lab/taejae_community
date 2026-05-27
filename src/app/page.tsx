import Link from "next/link";
import { ArrowRight, MapPin, Users, MessageSquare, Calendar, Globe } from "lucide-react";

const CAMPUSES = [
  { city: "Seoul", flag: "🇰🇷", sem: "1–2학기" },
  { city: "San Francisco", flag: "🇺🇸", sem: "3학기" },
  { city: "New York", flag: "🇺🇸", sem: "4학기" },
  { city: "Shenzhen", flag: "🇨🇳", sem: "5학기" },
  { city: "Beijing", flag: "🇨🇳", sem: "6학기" },
  { city: "Europe", flag: "🇪🇺", sem: "7학기" },
  { city: "Tokyo", flag: "🇯🇵", sem: "8학기" },
];

const FEATURES = [
  { icon: Users, title: "동문 디렉토리", desc: "기수·역할별 동문 검색. 선후배 멘토·멘티 연결의 시작." },
  { icon: MessageSquare, title: "커뮤니티 게시판", desc: "공지·이벤트·멘토링·취업 소식. 좋아요와 댓글로 소통." },
  { icon: Calendar, title: "이벤트 캘린더", desc: "동문회 행사, 네트워킹 모임, 세미나를 한 곳에서." },
  { icon: Globe, title: "글로벌 지도", desc: "서울부터 도쿄까지 전 세계 태재인의 현재 위치 확인." },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-navy-gradient min-h-screen flex flex-col">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#c9a227]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1a3a5c]/40 blur-[80px] pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#f0c040] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">泰</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">태재대학교</div>
              <div className="text-[#c9a227] text-xs leading-tight">동문회 커뮤니티</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2">
              로그인
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b8911f] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-colors">
              참여하기
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#c9a227] rounded-full pulse-dot" />
            <span className="text-white/80 text-sm">2023년 개교 · 현재 1–3기 재학 중</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Great
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c9a227] to-[#f0c040]">
              Harmony
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
            태재인이 전 세계에서 연결됩니다.<br />서울, 뉴욕, 도쿄 — 어디서든.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold rounded-2xl text-lg shadow-xl transition-all hover:shadow-[#c9a227]/30 hover:-translate-y-0.5 active:translate-y-0">
              커뮤니티 참여하기
              <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl text-lg backdrop-blur-sm transition-all">
              로그인
            </Link>
          </div>
        </div>

        {/* Campus scroll */}
        <div className="relative z-10 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin size={14} className="text-[#c9a227]" />
              <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Global Campus Route</span>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              {CAMPUSES.map((c, i) => (
                <div key={c.city} className="flex items-center gap-2">
                  <div className="glass-dark rounded-2xl px-3 py-2 text-center">
                    <div className="text-xl mb-0.5">{c.flag}</div>
                    <div className="text-white text-xs font-medium">{c.city}</div>
                    <div className="text-white/40 text-xs">{c.sem}</div>
                  </div>
                  {i < CAMPUSES.length - 1 && (
                    <span className="text-[#c9a227]/50 text-lg hidden sm:block">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0f2340] mb-4">
              한 곳에서 연결되는 태재인
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              흩어져 있어도 연결됩니다. 재학생·동문·교직원·후원자 모두를 위한 공간.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group p-6 rounded-3xl border border-gray-100 hover:border-[#1a3a5c]/20 hover:shadow-xl transition-all card-hover">
                <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] group-hover:bg-[#1a3a5c] flex items-center justify-center mb-5 transition-colors">
                  <Icon size={22} className="text-[#1a3a5c] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-gradient py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">지금 합류하세요</h2>
          <p className="text-white/60 text-lg mb-10">관리자 승인 후 모든 기능을 이용할 수 있습니다.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold rounded-2xl text-lg shadow-xl transition-all hover:-translate-y-0.5">
            가입 신청하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="bg-[#0a1929] py-8 px-6 text-center">
        <p className="text-gray-500 text-sm">© 2025 태재대학교 동문회 커뮤니티 · <a href="https://www.taejae.ac.kr" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a227] transition-colors">taejae.ac.kr</a></p>
      </footer>
    </div>
  );
}
