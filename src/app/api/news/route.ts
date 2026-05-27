import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
};

function parseRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const block = match[1];
    const title = (block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) ?? [])[1]?.trim() ?? "";
    const link = (block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/) ?? [])[1]?.trim()
      ?? (block.match(/<guid[^>]*>(?:<!\[CDATA\[)?(https?:\/\/[^\]<]+)(?:\]\]>)?<\/guid>/) ?? [])[1]?.trim() ?? "";
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) ?? [])[1]?.trim() ?? "";
    const rawDesc = (block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) ?? [])[1]?.trim() ?? "";
    const description = rawDesc.replace(/<[^>]+>/g, "").slice(0, 200);
    if (title && link) items.push({ title, link, pubDate, description, source });
  }
  return items;
}

const RSS_FEEDS = [
  { url: process.env.NEWS_RSS_URL ?? "", source: "태재대학교" },
  { url: "https://feeds.feedburner.com/ycombinator/news", source: "HN" },
].filter((f) => f.url);

// Static curated news as fallback
const STATIC_NEWS: NewsItem[] = [
  {
    title: "태재대학교, 2026년 신입생 모집 요강 발표",
    link: "https://taejae.ac.kr",
    pubDate: new Date("2026-04-15").toISOString(),
    description: "태재대학교가 2026년도 신입생 모집 요강을 발표했습니다. 세계 6개 캠퍼스 연계 교육과정과 함께...",
    source: "태재대학교",
  },
  {
    title: "글로벌 AI 역량 강화 프로그램 개설",
    link: "https://taejae.ac.kr",
    pubDate: new Date("2026-03-20").toISOString(),
    description: "태재대학교는 산업계와 협력하여 AI 실무 역량 강화를 위한 특별 프로그램을 개설한다고 밝혔습니다...",
    source: "태재대학교",
  },
  {
    title: "태재 동문, 실리콘밸리 스타트업 Series A 투자 유치",
    link: "https://taejae.ac.kr",
    pubDate: new Date("2026-03-05").toISOString(),
    description: "태재대학교 1기 졸업생이 창업한 AI 스타트업이 시리즈 A 투자를 유치했습니다...",
    source: "태재 커뮤니티",
  },
  {
    title: "봄학기 글로벌 캠퍼스 교류 프로그램 참여자 모집",
    link: "https://taejae.ac.kr",
    pubDate: new Date("2026-02-10").toISOString(),
    description: "2026년 봄학기 샌프란시스코, 도쿄, 베이징 캠퍼스 교류 프로그램 참가자를 모집합니다...",
    source: "태재대학교",
  },
  {
    title: "태재 커뮤니티 동문 네트워킹 데이 성황리 개최",
    link: "https://taejae.ac.kr",
    pubDate: new Date("2026-01-25").toISOString(),
    description: "지난 주말 서울 캠퍼스에서 열린 동문 네트워킹 데이에 100여 명의 동문이 참여하여...",
    source: "태재 커뮤니티",
  },
];

export async function GET() {
  const allNews: NewsItem[] = [];

  if (RSS_FEEDS.length > 0) {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async ({ url, source }) => {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`${res.status}`);
        const xml = await res.text();
        return parseRss(xml, source);
      })
    );
    for (const result of results) {
      if (result.status === "fulfilled") allNews.push(...result.value);
    }
  }

  const news = allNews.length > 0 ? allNews : STATIC_NEWS;
  return NextResponse.json(news.slice(0, 20));
}
