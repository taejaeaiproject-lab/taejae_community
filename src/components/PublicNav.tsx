"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--nav-border)",
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="logo-icon w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a5c] to-[#c9a227] flex items-center justify-center shadow-lg shadow-[#c9a227]/20 group-hover:shadow-[#c9a227]/40 transition-shadow">
            <span className="font-bold text-base">泰</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>Taejae University</div>
            <div className="text-[#c9a227] text-[10px] leading-tight tracking-wide">GREAT HARMONY</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/20"
                    : "hover:bg-[var(--chip-bg)]"
                )}
                style={{ color: active ? undefined : "var(--text-2)" }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-xl transition-colors hover:bg-[var(--chip-bg)]"
            style={{ color: "var(--text-2)" }}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-4 space-y-1"
          style={{
            background: "var(--nav-bg-mobile)",
            backdropFilter: "blur(20px)",
            borderTopColor: "var(--nav-border)",
          }}
        >
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/20"
                    : "hover:bg-[var(--chip-bg)]"
                )}
                style={{ color: active ? undefined : "var(--text-2)" }}
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
