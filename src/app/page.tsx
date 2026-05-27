import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { ArrowRight, BookOpen, Zap, FolderKanban, Users, Globe } from "lucide-react";

const CAMPUSES = [
  { city: "Seoul", flag: "🇰🇷", sem: "Semester 1–2" },
  { city: "San Francisco", flag: "🇺🇸", sem: "Semester 3" },
  { city: "New York", flag: "🇺🇸", sem: "Semester 4" },
  { city: "Shenzhen", flag: "🇨🇳", sem: "Semester 5" },
  { city: "Beijing", flag: "🇨🇳", sem: "Semester 6" },
  { city: "Europe", flag: "🇪🇺", sem: "Semester 7" },
  { city: "Tokyo", flag: "🇯🇵", sem: "Semester 8" },
];

const SECTIONS = [
  {
    href: "/learning",
    icon: BookOpen,
    label: "Learning",
    desc: "Current curriculum, courses, and educational programs at Taejae University.",
    color: "from-blue-50 to-indigo-50 border-blue-100",
    iconColor: "bg-blue-100 text-blue-700",
  },
  {
    href: "/activity",
    icon: Zap,
    label: "Activity",
    desc: "Active learning sessions, workshops, and collaborative experiences.",
    color: "from-amber-50 to-yellow-50 border-amber-100",
    iconColor: "bg-amber-100 text-amber-700",
  },
  {
    href: "/project",
    icon: FolderKanban,
    label: "Project",
    desc: "Ongoing and completed projects by Taejae students and alumni.",
    color: "from-emerald-50 to-green-50 border-emerald-100",
    iconColor: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/connect",
    icon: Users,
    label: "Connect",
    desc: "Meet the Taejae community — students, alumni, faculty, and partners.",
    color: "from-purple-50 to-violet-50 border-purple-100",
    iconColor: "bg-purple-100 text-purple-700",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2340] via-[#1a3a5c] to-[#2a4d73]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#c9a227]/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#c9a227] text-xs font-semibold px-4 py-2 rounded-full border border-[#c9a227]/30 mb-8">
            <Globe size={13} />
            7 Global Campuses · Great Harmony · 泰齋
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Taejae
            <span className="block text-[#c9a227]">Community</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            A community platform for Taejae University — bridging East and West through learning, collaboration, and meaningful connection.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/project"
              className="flex items-center gap-2 bg-[#c9a227] hover:bg-[#b8911f] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-colors"
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-2xl border border-white/20 transition-colors"
            >
              About Taejae
            </Link>
          </div>
        </div>

        {/* Campus strip */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-white/40 text-xs font-medium shrink-0 mr-2">Global Campuses</span>
              {CAMPUSES.map((c) => (
                <div key={c.city} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 shrink-0">
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <div className="text-white text-xs font-semibold">{c.city}</div>
                    <div className="text-white/40 text-[10px]">{c.sem}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Discover what the Taejae community is learning, building, and doing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTIONS.map(({ href, icon: Icon, label, desc, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              className={`group relative p-6 rounded-3xl border bg-gradient-to-br ${color} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`w-11 h-11 rounded-2xl ${iconColor} flex items-center justify-center mb-4`}>
                <Icon size={20} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">{label}</h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center">
              <span className="text-white font-bold text-sm">泰</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Taejae University Community</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Taejae University Alumni Association</p>
        </div>
      </footer>
    </div>
  );
}
