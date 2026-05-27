"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, MessageSquare, Calendar, Globe,
  Settings, LogOut, Menu, X, ChevronDown, Newspaper, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "홈", icon: LayoutDashboard },
  { href: "/directory", label: "디렉토리", icon: Users },
  { href: "/community", label: "커뮤니티", icon: MessageSquare },
  { href: "/events", label: "이벤트", icon: Calendar },
  { href: "/map", label: "글로벌 지도", icon: Globe },
];

const NAV_EXTRA = [
  { href: "/news", label: "뉴스", icon: Newspaper },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initial = session?.user.name?.charAt(0) ?? "?";

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">泰</span>
              </div>
              <span className="font-bold text-[#1a3a5c] text-sm hidden sm:block">태재 커뮤니티</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-[#1a3a5c]/8 text-[#1a3a5c]"
                        : "text-gray-500 hover:text-[#1a3a5c] hover:bg-gray-50"
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
              {NAV_EXTRA.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-[#1a3a5c]/8 text-[#1a3a5c]"
                        : "text-gray-500 hover:text-[#1a3a5c] hover:bg-gray-50"
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
              {session?.user.role === "ADMIN" && (
                <Link href="/admin" className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-red-50 text-red-600"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                )}>
                  <Settings size={15} />
                  관리
                </Link>
              )}
            </div>

            {/* User menu */}
            {session && (
              <div className="relative ml-auto">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center text-white text-xs font-bold">
                    {initial}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{session.user.name}</span>
                  <ChevronDown size={14} className={cn("text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-20 animate-fade-in">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a3a5c] transition-colors">
                        <div className="w-5 h-5 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center text-[#1a3a5c] font-bold text-xs">{initial}</div>
                        프로필 설정
                      </Link>
                      <Link href="/mentoring" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a3a5c] transition-colors">
                        <UserCheck size={15} />
                        멘토링 요청
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <Settings size={15} />
                          관리자 패널
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={15} />
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden ml-auto p-2 rounded-xl hover:bg-gray-50"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    active ? "bg-[#1a3a5c]/8 text-[#1a3a5c]" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            {NAV_EXTRA.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    active ? "bg-[#1a3a5c]/8 text-[#1a3a5c]" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            {session?.user.role === "ADMIN" && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500">
                <Settings size={18} />관리자 패널
              </Link>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600">
                프로필 설정
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500">
                <LogOut size={18} />로그아웃
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe">
        <div className="flex">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors",
                  active ? "text-[#1a3a5c]" : "text-gray-400"
                )}
              >
                <Icon size={20} className={cn(active && "stroke-[2.5px]")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
