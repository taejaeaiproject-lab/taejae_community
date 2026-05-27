import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleBadge from "@/components/RoleBadge";
import { CATEGORIES } from "@/lib/utils";
import { Users, MessageSquare, Globe, Pin } from "lucide-react";

type CategoryKey = keyof typeof CATEGORIES;

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [userCount, postCount, recentPosts, me] = await Promise.all([
    prisma.user.count({ where: { status: "APPROVED" } }),
    prisma.post.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        author: { select: { name: true, role: true, cohort: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, role: true, cohort: true, status: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#1a3a5c] to-[#0f2340] rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">안녕하세요 👋</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {session.user.name}님
              </h1>
              <div className="flex items-center gap-2">
                <RoleBadge role={session.user.role} />
                {me?.cohort && (
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{me.cohort}기</span>
                )}
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-[#c9a227] text-4xl font-bold">泰</div>
              <div className="text-blue-200 text-xs mt-1">Great Harmony</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: "전체 회원", value: userCount, href: "/directory", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: MessageSquare, label: "게시글", value: postCount, href: "/community", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Globe, label: "글로벌 캠퍼스", value: 7, href: "/map", color: "text-green-600", bg: "bg-green-50" },
          ].map(({ icon: Icon, label, value, href, color, bg }) => (
            <Link key={label} href={href} className={`${bg} rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow`}>
              <Icon size={20} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </Link>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">최근 게시글</h2>
            <Link href="/community" className="text-sm text-[#1a3a5c] hover:underline">전체보기</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length === 0 && (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">
                아직 게시글이 없습니다.
                <br />
                <Link href="/community/new" className="text-[#1a3a5c] hover:underline mt-2 inline-block">첫 글 작성하기 →</Link>
              </div>
            )}
            {recentPosts.map((post) => {
              const cat = CATEGORIES[post.category as CategoryKey] ?? CATEGORIES.GENERAL;
              return (
                <Link key={post.id} href={`/community/${post.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {post.isPinned && <Pin size={14} className="text-red-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                      <span className="text-xs text-gray-400">{post.author.name}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">{post._count.comments} 댓글</div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
