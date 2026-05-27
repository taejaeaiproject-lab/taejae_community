import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { MapPin, Users } from "lucide-react";

const CAMPUS_INFO = [
  { city: "Seoul", country: "South Korea", flag: "🇰🇷", semester: "1~2학기", highlight: true },
  { city: "San Francisco", country: "USA", flag: "🇺🇸", semester: "3학기", highlight: false },
  { city: "New York", country: "USA", flag: "🇺🇸", semester: "4학기", highlight: false },
  { city: "Shenzhen", country: "China", flag: "🇨🇳", semester: "5학기", highlight: false },
  { city: "Beijing", country: "China", flag: "🇨🇳", semester: "6학기", highlight: false },
  { city: "Other (Europe)", country: "Europe", flag: "🇪🇺", semester: "7학기", highlight: false },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵", semester: "8학기", highlight: false },
  { city: "Other", country: "Other", flag: "🌍", semester: "-", highlight: false },
];

export default async function MapPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const members = await prisma.user.findMany({
    where: { status: "APPROVED", isPublic: true },
    select: {
      id: true, name: true, role: true, cohort: true,
      currentCity: true, currentCountry: true,
    },
  });

  const grouped = CAMPUS_INFO.map((campus) => {
    const here = members.filter(
      (m) =>
        m.currentCity?.toLowerCase().includes(campus.city.toLowerCase()) ||
        (campus.city === "Other" && !CAMPUS_INFO.slice(0, -1).some((c) =>
          m.currentCity?.toLowerCase().includes(c.city.toLowerCase())
        ))
    );
    return { ...campus, members: here };
  }).filter((c) => c.members.length > 0 || c.highlight || c.semester !== "-");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">글로벌 지도</h1>
          <p className="text-gray-500 text-sm">태재인이 있는 곳을 확인하세요 — 서울부터 도쿄까지</p>
        </div>

        {/* Campus Route */}
        <div className="bg-gradient-to-r from-[#0f2340] to-[#1a3a5c] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#c9a227]" />
            <span className="text-sm font-medium text-[#c9a227]">Global Campus Route</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CAMPUS_INFO.filter(c => c.semester !== "-").map((campus, i) => (
              <div key={campus.city} className="flex items-center gap-2">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg">{campus.flag}</div>
                  <div className="text-xs font-medium">{campus.city}</div>
                  <div className="text-xs text-blue-300">{campus.semester}</div>
                </div>
                {i < 6 && <span className="text-[#c9a227] text-lg">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Members by Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPUS_INFO.map((campus) => {
            const here = members.filter((m) => {
              const city = m.currentCity?.toLowerCase() ?? "";
              if (campus.city === "Other") {
                return !CAMPUS_INFO.slice(0, -1).some((c) =>
                  city.includes(c.city.toLowerCase())
                );
              }
              return city.includes(campus.city.toLowerCase());
            });

            return (
              <div key={campus.city} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{campus.flag}</span>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{campus.city}</div>
                      <div className="text-xs text-gray-400">{campus.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={12} />
                    {here.length}명
                  </div>
                </div>
                {here.length === 0 ? (
                  <div className="px-5 py-4 text-xs text-gray-300 text-center">아직 없음</div>
                ) : (
                  <div className="px-5 py-3 flex flex-wrap gap-2">
                    {here.slice(0, 6).map((m) => (
                      <div key={m.id} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1">
                        <div className="w-5 h-5 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-700">{m.name}</span>
                        <RoleBadge role={m.role} className="text-xs" />
                      </div>
                    ))}
                    {here.length > 6 && (
                      <div className="text-xs text-gray-400 flex items-center px-2">+{here.length - 6}명</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
