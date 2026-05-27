"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 shrink-0 ${className}`}
      style={{
        background: "var(--chip-bg)",
        border: "1px solid var(--border)",
        color: "var(--text-3)",
      }}
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
