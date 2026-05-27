"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function NewsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  function fetchNews(refresh = false) {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    const url = refresh ? `/api/news?t=${Date.now()}` : "/api/news";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
        setRefreshing(false);
      });
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchNews();
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">태재 뉴스</h1>
            <p className="text-gray-500 text-sm">태재대학교 최신 소식 및 동문 뉴스</p>
          </div>
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#1a3a5c] border border-gray-200 rounded-xl hover:border-[#1a3a5c] transition-colors bg-white"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            새로고침
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p>뉴스를 불러올 수 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#1a3a5c]/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#1a3a5c]/10 text-[#1a3a5c] font-medium">
                        {item.source}
                      </span>
                      {item.pubDate && (
                        <span className="text-xs text-gray-400">{formatDate(item.pubDate)}</span>
                      )}
                    </div>
                    <h2 className="font-semibold text-gray-900 text-[15px] leading-snug group-hover:text-[#1a3a5c] transition-colors mb-1.5">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-[#1a3a5c] transition-colors shrink-0 mt-0.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
