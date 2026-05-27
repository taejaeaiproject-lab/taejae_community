"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/learning", label: "Learning" },
  { href: "/activity", label: "Activity" },
  { href: "/project", label: "Project" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">泰</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[#1a3a5c] font-bold text-sm leading-tight">Taejae University</div>
            <div className="text-[#c9a227] text-xs leading-tight">Great Harmony</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-[#1a3a5c] text-white"
                    : "text-gray-600 hover:text-[#1a3a5c] hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-[#1a3a5c] text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
