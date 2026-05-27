import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { ArrowRight, BookOpen, Zap, FolderKanban, Users } from "lucide-react";

const CAMPUSES = [
  { city: "Seoul",         flag: "🇰🇷", sem: "Sem 1–2" },
  { city: "San Francisco", flag: "🇺🇸", sem: "Sem 3" },
  { city: "New York",      flag: "🇺🇸", sem: "Sem 4" },
  { city: "Shenzhen",      flag: "🇨🇳", sem: "Sem 5" },
  { city: "Beijing",       flag: "🇨🇳", sem: "Sem 6" },
  { city: "Europe",        flag: "🇪🇺", sem: "Sem 7" },
  { city: "Tokyo",         flag: "🇯🇵", sem: "Sem 8" },
];

const STATS = [
  { value: "3", label: "Cohorts" },
  { value: "7", label: "Global Campuses" },
  { value: "4", label: "Majors" },
  { value: "100%", label: "Active Learning" },
];

const SECTIONS = [
  {
    href: "/learning",
    icon: BookOpen,
    label: "Learning",
    desc: "Curriculum, courses, and educational programs.",
    accent: "from-blue-500/20 to-indigo-500/10",
    iconBg: "bg-blue-500/15 text-blue-400",
    border: "hover:border-blue-500/30",
  },
  {
    href: "/activity",
    icon: Zap,
    label: "Activity",
    desc: "Active learning sessions and collaborative workshops.",
    accent: "from-amber-500/20 to-yellow-500/10",
    iconBg: "bg-amber-500/15 text-amber-400",
    border: "hover:border-amber-500/30",
  },
  {
    href: "/project",
    icon: FolderKanban,
    label: "Project",
    desc: "Ongoing and completed projects by Taejae students.",
    accent: "from-emerald-500/20 to-green-500/10",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    border: "hover:border-emerald-500/30",
  },
  {
    href: "/connect",
    icon: Users,
    label: "Connect",
    desc: "Meet students, alumni, faculty, and partners.",
    accent: "from-purple-500/20 to-violet-500/10",
    iconBg: "bg-purple-500/15 text-purple-400",
    border: "hover:border-purple-500/30",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="orb orb-gold w-[600px] h-[600px] top-[-100px] right-[-150px]" />
        <div className="orb orb-navy w-[500px] h-[500px] bottom-0 left-[-100px]" />
        <div className="orb orb-blue w-[300px] h-[300px] top-[40%] left-[20%] opacity-20" />

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-gold text-[#c9a227] text-xs font-semibold px-4 py-2 rounded-full mb-8 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
            泰齋 · Great Harmony · 태재대학교
          </div>

          {/* Main heading */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <span className="gradient-text">Great</span>
            <br />
            <span className="gradient-text">Harmony</span>
          </h1>

          <p
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 fade-up"
            style={{ color: "var(--text-2)", animationDelay: "0.2s", opacity: 0 }}
          >
            A global community for Taejae University — where Eastern and Western knowledge converge across 7 cities and 4 years.
          </p>

          {/* CTA */}
          <div
            className="flex items-center justify-center gap-3 flex-wrap fade-up"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            <Link
              href="/project"
              className="flex items-center gap-2 bg-[#c9a227] hover:bg-[#f0c040] text-[#060d18] font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/40 transition-all"
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/connect"
              className="flex items-center gap-2 glass text-white/80 hover:text-white font-medium px-6 py-3 rounded-2xl transition-all hover:border-white/20"
            >
              Meet the Community
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/60" />
          <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#c9a227] mb-1">{value}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: "var(--text-3)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Campus Strip ────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-3)" }}>
            Global Rotation Campuses
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {CAMPUSES.map((c, i) => (
              <div
                key={c.city}
                className="flex-shrink-0 glass rounded-2xl px-5 py-3.5 flex items-center gap-3 hover:border-white/20 transition-all group"
              >
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#c9a227] transition-colors">{c.city}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{c.sem}</div>
                </div>
                {i < CAMPUSES.length - 1 && (
                  <div className="ml-1 text-white/20">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sections Grid ─────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
              Explore the Community
            </h2>
            <p className="text-base max-w-md" style={{ color: "var(--text-2)" }}>
              Discover what the Taejae community is learning, building, and doing — across every campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTIONS.map(({ href, icon: Icon, label, desc, accent, iconBg, border }) => (
              <Link
                key={href}
                href={href}
                className={`group card rounded-3xl p-7 overflow-hidden relative ${border} transition-all duration-200`}
              >
                {/* Gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />

                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{label}</h3>
                    <ArrowRight
                      size={16}
                      className="text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission quote ─────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-gold w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="text-7xl md:text-9xl font-black text-white/[0.04] tracking-tighter mb-6 select-none">泰齋</div>
          <p className="text-xl md:text-2xl font-semibold text-white/80 leading-relaxed -mt-16 relative z-10">
            "Education that bridges East and West, theory and practice — building the leaders the world needs."
          </p>
          <div className="mt-6 text-sm text-[#c9a227]">Taejae University · 태재대학교</div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center">
              <span className="text-white font-bold text-sm">泰</span>
            </div>
            <span className="text-sm font-semibold text-white/60">Taejae University Community</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>© 2026 Taejae University Alumni Association</p>
        </div>
      </footer>
    </div>
  );
}
