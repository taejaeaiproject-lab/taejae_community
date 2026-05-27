import PublicNav from "@/components/PublicNav";
import { Globe, BookOpen, Zap, FolderKanban, Users } from "lucide-react";

const CAMPUSES = [
  { city: "Seoul", country: "South Korea", flag: "🇰🇷", sem: "Semester 1–2" },
  { city: "San Francisco", country: "USA", flag: "🇺🇸", sem: "Semester 3" },
  { city: "New York", country: "USA", flag: "🇺🇸", sem: "Semester 4" },
  { city: "Shenzhen", country: "China", flag: "🇨🇳", sem: "Semester 5" },
  { city: "Beijing", country: "China", flag: "🇨🇳", sem: "Semester 6" },
  { city: "Europe", country: "Various", flag: "🇪🇺", sem: "Semester 7" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵", sem: "Semester 8" },
];

const VALUES = [
  { icon: Globe, title: "Great Harmony (泰齋)", desc: "Bridging Eastern and Western knowledge — Taejae's founding philosophy of integrating diverse perspectives." },
  { icon: BookOpen, title: "Liberal Arts + Technology", desc: "A curriculum that combines humanities, science, and technology to cultivate whole-person leaders." },
  { icon: Zap, title: "Active Learning", desc: "Learning by doing — collaborative projects, real-world challenges, and hands-on experiences across global campuses." },
  { icon: FolderKanban, title: "Project-Based", desc: "Every student works on meaningful projects that create real impact, from campus to the world." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-[#0f2340] via-[#1a3a5c] to-[#2a4d73]">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#f0c040] flex items-center justify-center shadow-xl mx-auto mb-6">
            <span className="text-white font-bold text-3xl">泰</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Taejae</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Taejae University is a new kind of university — one that bridges East and West, theory and practice, individual growth and collective harmony.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Taejae University (태재대학교) was founded on the belief that the world needs leaders who can navigate complexity — people who understand both Eastern and Western traditions, who can think across disciplines, and who act with purpose.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The name "Taejae" (泰齋) means Great Harmony — a reflection of our commitment to bringing together diverse knowledge, cultures, and perspectives to create something greater than the sum of its parts.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1a3a5c]/5 to-[#c9a227]/10 rounded-3xl p-8 border border-[#1a3a5c]/10">
            <div className="text-6xl font-bold text-[#1a3a5c] mb-2">泰齋</div>
            <div className="text-lg font-semibold text-gray-700 mb-1">Great Harmony</div>
            <div className="text-sm text-gray-500">태재 — 동서양의 조화</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-[#1a3a5c]/8 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#1a3a5c]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Campuses */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Global Campuses</h2>
        <p className="text-gray-500 mb-10">Students spend each semester in a different city, building a truly global perspective over 4 years.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPUSES.map((c) => (
            <div key={c.city} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
              <span className="text-3xl">{c.flag}</span>
              <div>
                <div className="font-bold text-gray-900">{c.city}</div>
                <div className="text-xs text-gray-400">{c.country} · {c.sem}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="bg-gradient-to-br from-[#0f2340] to-[#1a3a5c] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Users size={32} className="text-[#c9a227] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">The Community</h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            This platform connects Taejae students, alumni, faculty, and partners — sharing knowledge, showcasing projects, and building lasting relationships across borders.
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">© 2026 Taejae University Alumni Association · taejae.ac.kr</p>
        </div>
      </footer>
    </div>
  );
}
