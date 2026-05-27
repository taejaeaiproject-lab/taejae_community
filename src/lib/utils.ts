import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ROLES = {
  STUDENT: { label: "재학생", labelEn: "Student", color: "bg-blue-100 text-blue-800" },
  FACULTY: { label: "교직원", labelEn: "Faculty", color: "bg-green-100 text-green-800" },
  SPONSOR: { label: "후원자/기업", labelEn: "Sponsor", color: "bg-purple-100 text-purple-800" },
  ALUMNI: { label: "동문", labelEn: "Alumni", color: "bg-amber-100 text-amber-800" },
  ADMIN: { label: "관리자", labelEn: "Admin", color: "bg-red-100 text-red-800" },
} as const;

export const CATEGORIES = {
  GENERAL: { label: "자유게시판", labelEn: "General", color: "bg-gray-100 text-gray-700" },
  NOTICE: { label: "공지사항", labelEn: "Notice", color: "bg-red-100 text-red-700" },
  EVENT: { label: "이벤트/모임", labelEn: "Event", color: "bg-blue-100 text-blue-700" },
  JOB: { label: "취업/채용", labelEn: "Jobs", color: "bg-green-100 text-green-700" },
  MENTOR: { label: "멘토링", labelEn: "Mentoring", color: "bg-purple-100 text-purple-700" },
} as const;

export const MAJORS = [
  "인문사회학부",
  "자연과학부",
  "데이터과학과 인공지능학부",
  "비즈니스혁신학부",
  "개인특화전공",
];

export const GLOBAL_CAMPUSES = [
  { city: "Seoul", country: "South Korea", flag: "🇰🇷" },
  { city: "San Francisco", country: "USA", flag: "🇺🇸" },
  { city: "New York", country: "USA", flag: "🇺🇸" },
  { city: "Shenzhen", country: "China", flag: "🇨🇳" },
  { city: "Beijing", country: "China", flag: "🇨🇳" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { city: "Other (Europe)", country: "Europe", flag: "🇪🇺" },
  { city: "Other", country: "Other", flag: "🌍" },
];
