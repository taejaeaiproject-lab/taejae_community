"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Globe, Users, MessageSquare, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "홈", labelEn: "Home", icon: LayoutDashboard },
    { href: "/directory", label: "동문 디렉토리", labelEn: "Directory", icon: Users },
    { href: "/community", label: "커뮤니티", labelEn: "Community", icon: MessageSquare },
    { href: "/map", label: "글로벌 지도", labelEn: "Global Map", icon: Globe },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center">
              <span className="text-white font-bold text-sm">泰</span>
            </div>
            <div>
              <div className="font-bold text-[#1a3a5c] text-sm leading-tight">태재대학교</div>
              <div className="text-xs text-[#c9a227] leading-tight">동문회 커뮤니티</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-[#1a3a5c] hover:bg-[#f0f4f8] transition-colors"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
            {session?.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Settings size={15} />
                관리자
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session && (
              <>
                <Link href="/profile" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-medium">
                    {session.user.name?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700">{session.user.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} />
                  로그아웃
                </button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600">
              <Settings size={15} />
              관리자
            </Link>
          )}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-500 w-full text-left"
            >
              <LogOut size={15} />
              로그아웃
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
