import Link from "next/link";
import { Globe, Users, MessageSquare, ArrowRight, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2340] via-[#1a3a5c] to-[#0f2340]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,162,39,0.15),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#f0c040] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">泰</span>
              </div>
              <div>
                <div className="text-[#c9a227] text-sm font-medium tracking-widest uppercase">Taejae University</div>
                <div className="text-white font-bold text-lg leading-tight">동문회 커뮤니티</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Great Harmony,<br />
              <span className="text-[#c9a227]">Global Network</span>
            </h1>
            <p className="text-lg text-blue-200 mb-8 leading-relaxed">
              태재대학교 재학생·동문·교직원·후원자가 함께하는<br />
              글로벌 커뮤니티 플랫폼입니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c9a227] hover:bg-[#b8911f] text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                커뮤니티 참여하기
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1a3a5c] mb-3">한 곳에서 연결되는 태재인</h2>
            <p className="text-gray-500">서울부터 뉴욕, 도쿄까지 — 전 세계 태재인과 소통하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "동문 디렉토리",
                desc: "기수별·역할별로 동문을 검색하고 프로필을 확인하세요. 멘토·멘티 연결의 시작점입니다.",
                color: "bg-blue-50",
                iconColor: "text-[#1a3a5c]",
              },
              {
                icon: MessageSquare,
                title: "커뮤니티 게시판",
                desc: "공지사항, 취업·채용 정보, 이벤트, 멘토링 등 다양한 소식을 나눠보세요.",
                color: "bg-amber-50",
                iconColor: "text-[#c9a227]",
              },
              {
                icon: Globe,
                title: "글로벌 지도",
                desc: "서울, 샌프란시스코, 뉴욕, 선전, 베이징, 도쿄 — 태재인이 있는 곳을 확인하세요.",
                color: "bg-green-50",
                iconColor: "text-green-700",
              },
            ].map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div key={title} className={`rounded-2xl p-8 ${color}`}>
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5`}>
                  <Icon size={24} className={iconColor} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Campus Strip */}
      <div className="bg-[#0f2340] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#c9a227] mb-6 justify-center">
            <MapPin size={16} />
            <span className="text-sm font-medium tracking-widest uppercase">Global Campus</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { city: "Seoul", flag: "🇰🇷" },
              { city: "San Francisco", flag: "🇺🇸" },
              { city: "New York", flag: "🇺🇸" },
              { city: "Shenzhen", flag: "🇨🇳" },
              { city: "Beijing", flag: "🇨🇳" },
              { city: "Tokyo", flag: "🇯🇵" },
              { city: "Europe", flag: "🇪🇺" },
            ].map(({ city, flag }) => (
              <div key={city} className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 text-white text-sm">
                <span>{flag}</span>
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a1929] text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c9a227] flex items-center justify-center">
              <span className="text-white font-bold text-xs">泰</span>
            </div>
            <span className="text-sm">태재대학교 동문회 커뮤니티 © 2025</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="https://www.taejae.ac.kr" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a227] transition-colors">
              태재대학교 공식 홈페이지
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
