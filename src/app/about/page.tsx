import PublicNav from "@/components/PublicNav";
import { Globe, BookOpen, Zap, FolderKanban } from "lucide-react";

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
              The name "Taejae" (泰齋) means Great Harmony — a reflection of our commitment to bringing together diverse knowledge, cultures, and perspectives to create something greater than the sum of its parts.
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
