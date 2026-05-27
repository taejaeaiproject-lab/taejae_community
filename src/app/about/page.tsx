import PublicNav from "@/components/PublicNav";
import { Globe, BookOpen, Zap, FolderKanban, Link2, Mail } from "lucide-react";
import Image from "next/image";

const CAMPUSES = [
  { city: "Seoul",         country: "South Korea", flag: "🇰🇷", sem: "Semester 1–2" },
  { city: "San Francisco", country: "USA",          flag: "🇺🇸", sem: "Semester 3" },
  { city: "New York",      country: "USA",          flag: "🇺🇸", sem: "Semester 4" },
  { city: "Shenzhen",      country: "China",        flag: "🇨🇳", sem: "Semester 5" },
  { city: "Beijing",       country: "China",        flag: "🇨🇳", sem: "Semester 6" },
  { city: "Europe",        country: "Various",      flag: "🇪🇺", sem: "Semester 7" },
  { city: "Tokyo",         country: "Japan",        flag: "🇯🇵", sem: "Semester 8" },
];

const VALUES = [
  {
    icon: Globe,
    title: "Great Harmony (泰齋)",
    desc: "Bridging Eastern and Western knowledge — Taejae's founding philosophy of integrating diverse perspectives into a unified whole.",
    color: "text-[#c9a227] bg-[#c9a227]/10",
  },
  {
    icon: BookOpen,
    title: "Liberal Arts + Technology",
    desc: "A curriculum combining humanities, science, and technology to cultivate whole-person leaders capable of navigating complexity.",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Active Learning",
    desc: "Learning by doing — collaborative projects, real-world challenges, and hands-on experiences. All classes under 20 students.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: FolderKanban,
    title: "Project-Based",
    desc: "Every student works on meaningful projects that create real impact — from campus to the global stage.",
    color: "text-emerald-400 bg-emerald-500/10",
  },
];

const COMPETENCIES = [
  "다양성 추구의 글로벌 지도력",
  "공감과 공존의 실천력",
  "소통 및 협업능력",
  "창의적 사고력",
  "비판적 사고력",
  "자기주도학습력",
];

const EXECUTIVES = [
  {
    role: "학생회장",
    roleColor: "text-[#c9a227] bg-[#c9a227]/10 border-[#c9a227]/20",
    name: "이준혁",
    nameEn: "Jun Lee",
    cohort: "1기",
    campus: "Seoul → San Francisco",
    motto: "다름이 모여 하나의 위대함을 만든다",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    linkedin: true,
  },
  {
    role: "부학생회장",
    roleColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    name: "김지우",
    nameEn: "Jiwoo Kim",
    cohort: "1기",
    campus: "Seoul → New York",
    motto: "함께, 더 크게 도약하는 커뮤니티",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedin: true,
  },
  {
    role: "총무",
    roleColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    name: "박서연",
    nameEn: "Seoyeon Park",
    cohort: "2기",
    campus: "Seoul → Shenzhen",
    motto: "동문의 연결이 세상을 바꾼다",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    linkedin: false,
  },
  {
    role: "미디어 팀장",
    roleColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    name: "한소희",
    nameEn: "Sohee Han",
    cohort: "2기",
    campus: "Seoul → Beijing",
    motto: "우리의 이야기를 세상에 알린다",
    img: "https://randomuser.me/api/portraits/women/26.jpg",
    linkedin: true,
  },
  {
    role: "국제 팀장",
    roleColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    name: "Alex Morgan",
    nameEn: "Alex Morgan",
    cohort: "1기",
    campus: "San Francisco → Tokyo",
    motto: "East meets West — in every conversation",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    linkedin: true,
  },
  {
    role: "프로젝트 팀장",
    roleColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    name: "최민준",
    nameEn: "Minjun Choi",
    cohort: "3기",
    campus: "Seoul → Shenzhen",
    motto: "아이디어가 현실이 되는 순간을 만든다",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    linkedin: true,
  },
  {
    role: "커뮤니티 팀장",
    roleColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    name: "오현우",
    nameEn: "Hyunwoo Oh",
    cohort: "2기",
    campus: "Seoul → New York",
    motto: "연결이 곧 성장이다",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    linkedin: false,
  },
  {
    role: "이벤트 팀장",
    roleColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    name: "Yuna Sato",
    nameEn: "Yuna Sato",
    cohort: "1기",
    campus: "Tokyo → Seoul",
    motto: "모든 만남이 새로운 시작이 된다",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    linkedin: true,
  },
  {
    role: "디자인 팀장",
    roleColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    name: "장민서",
    nameEn: "Minseo Jang",
    cohort: "3기",
    campus: "Seoul → Europe",
    motto: "아름다움으로 연결되는 태재의 이야기",
    img: "https://randomuser.me/api/portraits/women/35.jpg",
    linkedin: true,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-16">
        <div className="orb orb-gold w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-30" />
        <div className="orb orb-navy w-[400px] h-[400px] bottom-0 left-0 opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <div className="float inline-block mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center shadow-2xl shadow-[#c9a227]/30">
              <span className="text-white font-black text-4xl">泰</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            About<br />
            <span className="gold-text">Taejae</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            A new kind of university — one that bridges East and West, theory and practice, individual growth and collective harmony.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227] mb-4">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Leaders who can<br />navigate complexity
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Taejae University (태재대학교) was founded on the belief that the world needs leaders who can navigate complexity — people who understand both Eastern and Western traditions, think across disciplines, and act with purpose.
            </p>
            <p className="text-white/60 leading-relaxed">
              The name &quot;Taejae&quot; (泰齋) means Great Harmony — a reflection of our commitment to bringing together diverse knowledge, cultures, and perspectives to create something greater than the sum of its parts.
            </p>
          </div>
          <div className="glass rounded-3xl p-10 text-center">
            <div className="text-8xl font-black text-white/10 mb-2">泰齋</div>
            <div className="text-2xl font-bold text-[#c9a227] mb-2">Great Harmony</div>
            <div className="text-sm text-white/40">동서양의 조화 · East meets West</div>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227] mb-3">6 Core Competencies</p>
          <h2 className="text-3xl font-black text-white mb-10">What Taejae Students Develop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMPETENCIES.map((c, i) => (
              <div key={c} className="card rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-[#c9a227]/25 transition-all">
                <span className="text-[#c9a227] font-black text-sm w-6 shrink-0">0{i + 1}</span>
                <span className="text-sm text-white/80 font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227] mb-3">Core Principles</p>
          <h2 className="text-3xl font-black text-white mb-10">How We Educate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card rounded-3xl p-7 hover:border-white/15 transition-all">
                <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executives */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227] mb-3">Student Council</p>
          <h2 className="text-3xl font-black text-white mb-3">학생회 임원진</h2>
          <p className="text-white/50 mb-10 max-w-lg">
            Taejae 커뮤니티를 이끄는 학생회 임원진입니다. 7개 캠퍼스를 연결하고 동문 네트워크를 함께 만들어갑니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXECUTIVES.map((exec) => (
              <div
                key={exec.name}
                className="card rounded-3xl p-6 flex flex-col items-center text-center hover:border-white/15 transition-all hover:-translate-y-0.5 duration-200"
              >
                <div className="relative mb-4">
                  <Image
                    src={exec.img}
                    alt={exec.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#060d18] flex items-center justify-center ring-1 ring-white/10">
                    <span className="text-[8px] font-black text-[#c9a227]">{exec.cohort}</span>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2 ${exec.roleColor}`}>
                  {exec.role}
                </span>

                <h3 className="font-black text-white text-lg leading-tight">{exec.name}</h3>
                {exec.nameEn !== exec.name && (
                  <p className="text-xs mt-0.5 mb-1" style={{ color: "var(--text-3)" }}>{exec.nameEn}</p>
                )}

                <p className="text-[11px] mb-3" style={{ color: "var(--text-3)" }}>{exec.campus}</p>

                <p className="text-xs leading-relaxed italic flex-1 mb-4" style={{ color: "var(--text-2)" }}>
                  &ldquo;{exec.motto}&rdquo;
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <Mail size={12} style={{ color: "var(--text-3)" }} />
                  </div>
                  {exec.linkedin && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      <Link2 size={12} className="text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Campuses */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227] mb-3">Global Rotation</p>
          <h2 className="text-3xl font-black text-white mb-3">7 Cities · 4 Years</h2>
          <p className="text-white/50 mb-10 max-w-lg">Students live and study in a new city every semester — building a truly global perspective.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CAMPUSES.map((c, i) => (
              <div key={c.city} className="card rounded-2xl p-4 flex items-center gap-3 hover:border-[#c9a227]/25 transition-all">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <div className="font-bold text-white text-sm">{c.city}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-3)" }}>{c.sem}</div>
                </div>
                {i < CAMPUSES.length - 1 && <div className="ml-auto text-white/15 text-xs">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: "var(--text-3)" }}>© 2026 Taejae University Alumni Association · taejae.ac.kr</p>
        </div>
      </footer>
    </div>
  );
}
